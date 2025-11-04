"use client";

import React, { useState, useEffect } from "react";
import HomeHeader from "./home/HomeHeader";
import CourseCard from "./home/CourseCard";
import FilterSidebar from "./home/FilterSidebar";
import styles from "./StudentDashboard.module.css";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { studentDashboardAPI, type CourseForStudent } from "@/lib/students-api";
import { useAuth } from "@/lib/auth-context";
import { useNotifications } from "@/lib/hooks/notifications-hooks";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
  institution: string;
  image: string;
  rating: number;
  reviews: number;
  students: number;
  price: number;
  originalPrice?: number;
  level: string;
  mode: string;
  wishlisted: boolean;
  ageGroup?: string; // e.g., "2 - 3 Yrs", "3 - 4 Yrs"
  programDuration?: string; // e.g., "Summer Camp", "Academic Year", "2 Yrs"
  priceRange?: string; // e.g., "Below ₹75,000"
  instituteType?: string; // e.g., "Kindergarten", "School's", "Graduation"
  boardType?: string; // e.g., "State Board", "CBSE" (for School's/Intermediate)
  // Graduation-specific fields
  graduationType?: string; // e.g., "Under Graduation", "Post Graduation"
  streamType?: string; // e.g., "Engineering and Technology (B.E./B.Tech.)"
  educationType?: string; // e.g., "Full time", "Part time", "Distance learning"
}

const PAGE_SIZE = 9;

type PageDescriptor = number | "ellipsis";

const buildPageNumbers = (currentPage: number, totalPages: number): PageDescriptor[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
};

/**
 * Get price range category based on price
 */
const getPriceRange = (price: number): string => {
  if (price < 75000) return "Below ₹75,000";
  if (price <= 150000) return "₹75,000 - ₹1,50,000";
  if (price <= 300000) return "₹1,50,000 - ₹3,00,000";
  return "Above ₹3,00,000";
};

/**
 * Transform API course data to internal Course format
 */
const transformApiCourse = (apiCourse: CourseForStudent, wishlisted: boolean): Course => {
  // Map mode values: "Offline" -> "Offline", keep others as-is
  const modeMap: Record<string, string> = {
    "Offline": "Offline",
    "Online": "Online",
  };

  const price = apiCourse.priceOfCourse || 0;
  
  return {
    id: apiCourse._id || apiCourse.id || "",
    title: apiCourse.courseName || "Untitled Course",
    institution: apiCourse.institution?.instituteName || "Unknown Institution",
    image: apiCourse.imageUrl || "/course-placeholder.jpg",
    rating: apiCourse.rating || 4.5,
    reviews: apiCourse.reviews || 0,
    students: apiCourse.studentsEnrolled || 0,
    price: price,
    level: "Lower kindergarten", // Default level if not provided
    mode: modeMap[apiCourse.mode || "Online"] || apiCourse.mode || "Online",
    wishlisted,
    // Kindergarten-specific fields with defaults
    ageGroup: "3 - 4 Yrs", // Default age group
    programDuration: "Academic Year", // Default program duration
    priceRange: getPriceRange(price),
    instituteType: "Kindergarten", // Default to Kindergarten
    boardType: "CBSE", // Default board type for schools
    // Graduation-specific fields with defaults
    graduationType: "Under Graduation", // Default graduation type
    streamType: "Engineering and Technology (B.E./B.Tech.)", // Default stream
    educationType: "Full time", // Default education type
  };
};

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    instituteType: "" as string, // Mutually exclusive - only one can be selected
    kindergartenLevels: [] as string[],
    schoolLevels: [] as string[],
    modes: [] as string[],
    ageGroup: [] as string[],
    programDuration: [] as string[],
    priceRange: [] as string[],
    boardType: [] as string[],
    // Graduation-specific filters
    graduationType: [] as string[],
    streamType: [] as string[],
    // Coaching-specific filters
    levels: [] as string[],
    classSize: [] as string[],
    // Study Hall specific filters
    seatingType: [] as string[],
    operatingHours: [] as string[],
    duration: [] as string[],
    // Tuition Center specific filters
    subjects: [] as string[],
    educationType: [] as string[],
  });
  const [activePane, setActivePane] = useState<"notifications" | "wishlist" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const notificationsQuery = useNotifications();
  const notifications = notificationsQuery.data ?? [];
  const notificationsLoading = notificationsQuery.isLoading;

  // Load wishlist from localStorage
  const getWishlistedCourseIds = (): Set<string> => {
    if (typeof window === "undefined") return new Set();
    const saved = localStorage.getItem("wishlistedCourses");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  };

  // Save wishlist to localStorage
  const saveWishlistedCourseIds = (ids: Set<string>): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlistedCourses", JSON.stringify(Array.from(ids)));
      // Notify other components in the same window that wishlist changed
      try {
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      } catch (e) {
        // ignore if dispatch fails in some environments
      }
    }
  };

  // Fetch courses from API on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await studentDashboardAPI.getVisibleCourses();
        
        if (!response.success || !response.data) {
          throw new Error(response.message || "Failed to fetch courses");
        }

        // Get wishlisted courses from localStorage
        const wishlistedIds = getWishlistedCourseIds();

        // Transform API courses to internal format
        const transformedCourses = (response.data as CourseForStudent[]).map((apiCourse) =>
          transformApiCourse(apiCourse, wishlistedIds.has(apiCourse._id))
        );

        setCourses(transformedCourses);
        setFilteredCourses(transformedCourses);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err instanceof Error ? err.message : "Failed to load courses");
        // Keep the component functional even if API fails
        setCourses([]);
        setFilteredCourses([]);
        setCurrentPage(1);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    setCurrentPage((prev) => {
      const total = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));
      return prev > total ? total : prev;
    });
  }, [filteredCourses]);

  const formatNotificationTime = (timestamp?: number) => {
    if (!timestamp) return "";
    const diff = Date.now() - timestamp;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleNotificationPaneToggle = () => {
    setActivePane((prev) => (prev === "notifications" ? null : "notifications"));
  };

  const handleWishlistPaneToggle = () => {
    setActivePane((prev) => (prev === "wishlist" ? null : "wishlist"));
  };

  const closePane = () => {
    setActivePane(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterCourses(query, activeFilters, courses);
  };

  const handleFilterChange = (filterType: string, value: string, isChecked: boolean) => {
    const updatedFilters = { ...activeFilters };

    // Handle mutually exclusive institute type
    if (filterType === "instituteType") {
      if (isChecked) {
        updatedFilters.instituteType = value; // Replace with new value
        // Clear sub-filters when changing institute type
        updatedFilters.kindergartenLevels = [];
        updatedFilters.schoolLevels = [];
        updatedFilters.boardType = [];
        updatedFilters.programDuration = [];
        updatedFilters.ageGroup = [];
        updatedFilters.graduationType = [];
        updatedFilters.streamType = [];
        updatedFilters.educationType = [];
      } else {
        updatedFilters.instituteType = ""; // Deselect
        // Clear sub-filters when deselecting institute type
        updatedFilters.kindergartenLevels = [];
        updatedFilters.schoolLevels = [];
        updatedFilters.boardType = [];
        updatedFilters.programDuration = [];
        updatedFilters.ageGroup = [];
        updatedFilters.graduationType = [];
        updatedFilters.streamType = [];
        updatedFilters.educationType = [];
      }
    } else {
      // Handle array-based filters
      const filterKey = filterType as keyof typeof updatedFilters;
      const filterArray = updatedFilters[filterKey] as string[];

      if (isChecked) {
        filterArray.push(value);
      } else {
        const index = filterArray.indexOf(value);
        if (index > -1) {
          filterArray.splice(index, 1);
        }
      }
    }

    setActiveFilters(updatedFilters);
    filterCourses(searchQuery, updatedFilters, courses);
  };

  const filterCourses = (
    query: string,
    filters: typeof activeFilters,
    sourceCourses: Course[]
  ) => {
    let result = sourceCourses;

    // Search filter
    if (query) {
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(query.toLowerCase()) ||
          course.institution.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Institute Type filter (mutually exclusive - only one selected or none)
    if (filters.instituteType) {
      result = result.filter((course) =>
        course.instituteType === filters.instituteType
      );
    }

    // Kindergarten Level filter (only for Kindergarten institute type)
    if (filters.kindergartenLevels.length > 0) {
      result = result.filter((course) =>
        filters.kindergartenLevels.includes(course.level)
      );
    }

    // School Level filter (only for School's institute type)
    if (filters.schoolLevels.length > 0) {
      result = result.filter((course) =>
        filters.schoolLevels.includes(course.level)
      );
    }

    // Mode filter
    if (filters.modes.length > 0) {
      result = result.filter((course) =>
        filters.modes.includes(course.mode)
      );
    }

    // Age Group filter
    if (filters.ageGroup.length > 0) {
      result = result.filter((course) =>
        filters.ageGroup.includes(course.ageGroup || "3 - 4 Yrs")
      );
    }

    // Program Duration filter
    if (filters.programDuration.length > 0) {
      result = result.filter((course) =>
        filters.programDuration.includes(course.programDuration || "Academic Year")
      );
    }

    // Price Range filter
    if (filters.priceRange.length > 0) {
      result = result.filter((course) =>
        filters.priceRange.includes(course.priceRange || "")
      );
    }

    // Board Type filter
    if (filters.boardType.length > 0) {
      result = result.filter((course) =>
        filters.boardType.includes(course.boardType || "CBSE")
      );
    }

    // Graduation Type filter
    if (filters.graduationType.length > 0) {
      result = result.filter((course) =>
        filters.graduationType.includes(course.graduationType || "Under Graduation")
      );
    }

    // Stream Type filter
    if (filters.streamType.length > 0) {
      result = result.filter((course) =>
        filters.streamType.includes(course.streamType || "Engineering and Technology (B.E./B.Tech.)")
      );
    }

    // Education Type filter
    if (filters.educationType.length > 0) {
      result = result.filter((course) =>
        filters.educationType.includes(course.educationType || "Full time")
      );
    }

    setFilteredCourses(result);
    setCurrentPage(1);
  };

  const handleWishlistToggle = (courseId: string) => {
    // Get current wishlist
    const wishlistedIds = getWishlistedCourseIds();
    const isCurrentlyWishlisted = wishlistedIds.has(courseId);

    // Update wishlist
    if (isCurrentlyWishlisted) {
      wishlistedIds.delete(courseId);
    } else {
      wishlistedIds.add(courseId);
    }

    // Save to localStorage
    saveWishlistedCourseIds(wishlistedIds);

    // Update courses state
    const updatedCourses = courses.map((course) =>
      course.id === courseId
        ? { ...course, wishlisted: !course.wishlisted }
        : course
    );
    setCourses(updatedCourses);

    // Update filtered courses as well
    const updatedFiltered = filteredCourses.map((course) =>
      course.id === courseId
        ? { ...course, wishlisted: !course.wishlisted }
        : course
    );
    setFilteredCourses(updatedFiltered);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePane(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const wishlistCourses = courses.filter((course) => course.wishlisted);
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));
  const paginatedCourses = filteredCourses.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pageNumbers = buildPageNumbers(currentPage, totalPages);
  const shouldShowPagination = filteredCourses.length > PAGE_SIZE;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <HomeHeader
        userName={user?.name || "Student"}
        searchValue={searchQuery}
        onSearchChange={handleSearch}
        onNotificationClick={handleNotificationPaneToggle}
        onWishlistClick={handleWishlistPaneToggle}
        onProfileClick={() => router.push("/student/profile")}
      />

      {activePane && (
        <div className={styles.overlay} onClick={closePane} />
      )}

      {activePane === "notifications" && (
        <aside className={`${styles.pane} ${styles.paneExpanded}`} role="complementary" aria-label="Notifications">
          <header className={styles.paneHeader}>
            <h2>Notifications</h2>
            <button className={styles.closeBtn} onClick={closePane} aria-label="Close notifications">
              ×
            </button>
          </header>
          <div className={styles.paneContent}>
            {notificationsLoading ? (
              <div className={styles.paneLoading}>Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className={styles.paneEmpty}>No notifications yet.</div>
            ) : (
              <ul className={styles.notificationsList}>
                {notifications.map((notification) => (
                  <li key={notification.id} className={`${styles.notificationItem} ${notification.read ? "" : styles.notificationUnread}`}>
                    <div className={styles.notificationTitle}>{notification.title}</div>
                    {notification.description && <div className={styles.notificationDescription}>{notification.description}</div>}
                    <div className={styles.notificationMeta}>{formatNotificationTime(notification.time)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      )}

      {activePane === "wishlist" && (
        <aside className={`${styles.pane} ${styles.paneExpanded}`} role="complementary" aria-label="Wishlist">
          <header className={styles.paneHeader}>
            <h2>Wishlist</h2>
            <button className={styles.closeBtn} onClick={closePane} aria-label="Close wishlist">
              ×
            </button>
          </header>
          <div className={styles.paneContent}>
            {wishlistCourses.length === 0 ? (
              <div className={styles.paneEmpty}>No courses in wishlist yet.</div>
            ) : (
              <ul className={styles.wishlistList}>
                {wishlistCourses.map((course) => (
                  <li key={course.id} className={styles.wishlistItem}>
                    <div className={styles.wishlistText}>
                      <div className={styles.wishlistTitle}>{course.title}</div>
                      <div className={styles.wishlistSubtitle}>{course.institution}</div>
                    </div>
                    <button
                      className={styles.removeWishlistBtn}
                      onClick={() => handleWishlistToggle(course.id)}
                      aria-label="Remove from wishlist"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading courses...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>⚠️ {error}</p>
          <p className={styles.errorSubtext}>Please refresh the page or try again later.</p>
        </div>
      ) : (
        <div className={styles.contentWrapper}>
          <FilterSidebar
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />

          <main className={styles.mainContent}>
            <section className={styles.coursesSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  Courses ({filteredCourses.length})
                </h2>
              </div>

              {filteredCourses.length > 0 ? (
                <>
                  <div className={styles.coursesGrid}>
                    {paginatedCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={{
                          id: course.id,
                          title: course.title,
                          institution: course.institution,
                          rating: course.rating,
                          reviews: course.reviews,
                          students: course.students,
                          price: course.price,
                          level: course.level,
                          mode: course.mode,
                          wishlisted: course.wishlisted,
                        }}
                        onWishlistToggle={handleWishlistToggle}
                      />
                    ))}
                  </div>
                  {shouldShowPagination && (
                    <div className={styles.paginationContainer}>
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              aria-disabled={currentPage === 1}
                              className={currentPage === 1 ? styles.paginationDisabled : undefined}
                              onClick={(event) => {
                                event.preventDefault();
                                handlePageChange(currentPage - 1);
                              }}
                            />
                          </PaginationItem>
                          {pageNumbers.map((page, index) => (
                            <PaginationItem key={`${page}-${index}`}>
                              {page === "ellipsis" ? (
                                <PaginationEllipsis />
                              ) : (
                                <PaginationLink
                                  href="#"
                                  isActive={page === currentPage}
                                  onClick={(event) => {
                                    event.preventDefault();
                                    handlePageChange(page);
                                  }}
                                >
                                  {page}
                                </PaginationLink>
                              )}
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              aria-disabled={currentPage === totalPages}
                              className={currentPage === totalPages ? styles.paginationDisabled : undefined}
                              onClick={(event) => {
                                event.preventDefault();
                                handlePageChange(currentPage + 1);
                              }}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.emptyState}>
                  <p className={styles.emptyStateText}>
                    No courses found matching your filters. Try adjusting your
                    search criteria.
                  </p>
                </div>
              )}
            </section>
          </main>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
