"use client";

import React, { useState, useEffect, useCallback } from "react";
import HomeHeader from "./home/HomeHeader";
import CourseCard from "./home/CourseCard";
import FilterSidebar from "./home/FilterSidebar";
import FooterNav from "./home/FooterNav";
import styles from "./StudentDashboard.module.css";
import { DashboardCourse, studentDashboardAPI } from "@/lib/students-api";
import { useAuth } from "@/lib/auth-context";
import { useNotifications } from "@/lib/hooks/notifications-hooks";
import { useRouter } from "next/navigation";
import {ActiveFilters} from './home/FilterSidebar'

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
  iswishlisted?: boolean;
  ageGroup?: string; // e.g., "2 - 3 Yrs", "3 - 4 Yrs"
  programDuration?: string; // e.g., "Summer Camp", "Academic Year", "2 Yrs"
  priceRange?: string; // e.g., "Below ₹75,000"
  instituteType?: string; // e.g., "Kindergarten", "School's", "Graduation"
  boardType?: string; // e.g., "State Board", "CBSE" (for School's/Intermediate)
  // Graduation-specific fields
  graduationType?: string; // e.g., "Under Graduation", "Post Graduation"
  streamType?: string; // e.g., "Engineering and Technology (B.E./B.Tech.)"
  educationType?: string; // e.g., "Full time", "Part time", "Distance learning"
  // Store original API data for detailed view
  apiData: DashboardCourse;
}

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
const transformApiCourse = (apiCourse: DashboardCourse): Course => {

  const price = apiCourse.priceOfCourse || 0;
  
  return {
  id: apiCourse._id || "",
  title: apiCourse.courseName || "Untitled Course",
  institution: apiCourse.institutionDetails?.instituteName || "Unknown Institution",
  image: apiCourse.imageUrl || "/course-placeholder.jpg",
  // rating: apiCourse.rating || 4.5,
  // reviews: apiCourse.reviews || 0,
  // students: apiCourse.studentsEnrolled || 0,
  price: price,
  // level: "Lower kindergarten", // Default level if not provided
  // mode: modeMap[apiCourse.mode || "Online"] || apiCourse.mode || "Online",
  iswishlisted : apiCourse.isWishlisted,
  // Kindergarten-specific fields with defaults
  // ageGroup: "3 - 4 Yrs", // Default age group
  // programDuration: "Academic Year", // Default program duration
  priceRange: getPriceRange(price),
  instituteType: "Kindergarten", // Default to Kindergarten
  boardType: "CBSE", // Default board type for schools





  // Graduation-specific fields with defaults
  // graduationType: "Under Graduation", // Default graduation type
  // streamType: "Engineering and Technology (B.E./B.Tech.)", // Default stream
  // educationType: "Full time", // Default education type
  // Store original API data for course details page
  apiData: apiCourse,
  rating: 0,
  reviews: 0,
  students: 0,
  level: "",
  mode: "",
};
};

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [, setSearchResults] = useState<Course[] | null>(null);
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const COURSES_PER_PAGE = 9;
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    instituteType: "" as string,
    kindergartenLevels: [] as string[],
    schoolLevels: [] as string[],
    modes: [] as string[],
    ageGroup: [] as string[],
    programDuration: [] as string[],
    priceRange: [] as string[],
    boardType: [] as string[],
    graduationType: [] as string[],
    streamType: [] as string[],
    levels: [] as string[],
    classSize: [] as string[],
    seatingType: [] as string[],
    operatingHours: [] as string[],
    duration: [] as string[],
    subjects: [] as string[],
    educationType: [] as string[],
  });
  const [activePane, setActivePane] = useState<"notifications" | "wishlist" | null>(null);
  const [isFilterBottomSheetOpen, setIsFilterBottomSheetOpen] = useState(false);

  const notificationsQuery = useNotifications();
  const notifications = notificationsQuery.data ?? [];
  const notificationsLoading = notificationsQuery.isLoading;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await studentDashboardAPI.getVisibleCourses();
        if (!response.success || !response.data) {
          throw new Error(response.message || "Failed to fetch courses");
        }

        // Transform API courses to internal format
        const transformedCourses = (response.data as DashboardCourse[]).map((apiCourse) =>
          transformApiCourse(apiCourse)
        );
        setCourses(transformedCourses);
        setFilteredCourses(transformedCourses);
        setDisplayedCourses(transformedCourses.slice(0, COURSES_PER_PAGE));
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err instanceof Error ? err.message : "Failed to load courses");
        setCourses([]);
        setFilteredCourses([]);
        setDisplayedCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    setDisplayedCourses(filteredCourses.slice(0, COURSES_PER_PAGE));
    setCurrentPage(1);
    setIsLoadingMore(false);
  }, [filteredCourses]);

  const loadMoreCourses = useCallback(() => {
    if (isLoadingMore || displayedCourses.length >= filteredCourses.length) return;
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const endIndex = nextPage * COURSES_PER_PAGE;
    const startIndex = 0;
    const newDisplayedCourses = filteredCourses.slice(startIndex, endIndex);
    setDisplayedCourses(newDisplayedCourses);
    setCurrentPage(nextPage);
    setIsLoadingMore(false);
  }, [isLoadingMore, displayedCourses.length, filteredCourses, currentPage]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.innerHeight + window.scrollY;
          const pageHeight = document.documentElement.scrollHeight;
          const threshold = 500;
          const shouldLoadMore =
            scrollPosition >= pageHeight - threshold &&
            !isLoadingMore &&
            displayedCourses.length < filteredCourses.length;
          if (shouldLoadMore) {
            loadMoreCourses();
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Check immediately on mount
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [displayedCourses.length, filteredCourses.length, isLoadingMore, loadMoreCourses]);

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (isFilterBottomSheetOpen && isMobile) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isFilterBottomSheetOpen]);

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

  const handleViewCourseDetails = (courseId: string) => {
    router.push(`/dashboard/${courseId}`);
  };

  const filterCourses = useCallback((query: string, filters: typeof activeFilters, sourceCourses: Course[]) => {
    let result = sourceCourses;
    if (query) {
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(query.toLowerCase()) ||
          course.institution.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (filters.instituteType) {
      result = result.filter((course) => course.instituteType === filters.instituteType);
    }
    if (filters.kindergartenLevels.length > 0) {
      result = result.filter((course) => filters.kindergartenLevels.includes(course.level));
    }
    if (filters.schoolLevels.length > 0) {
      result = result.filter((course) => filters.schoolLevels.includes(course.level));
    }
    if (filters.modes.length > 0) {
      result = result.filter((course) => filters.modes.includes(course.mode));
    }
    if (filters.ageGroup.length > 0) {
      result = result.filter((course) => filters.ageGroup.includes(course.ageGroup || "3 - 4 Yrs"));
    }
    if (filters.programDuration.length > 0) {
      result = result.filter((course) => filters.programDuration.includes(course.programDuration || "Academic Year"));
    }
    if (filters.priceRange.length > 0) {
      result = result.filter((course) => filters.priceRange.includes(course.priceRange || ""));
    }
    if (filters.boardType.length > 0) {
      result = result.filter((course) => filters.boardType.includes(course.boardType || "CBSE"));
    }
    if (filters.graduationType.length > 0) {
      result = result.filter((course) => filters.graduationType.includes(course.graduationType || "Under Graduation"));
    }
    if (filters.streamType.length > 0) {
      result = result.filter((course) => filters.streamType.includes(course.streamType || "Engineering and Technology (B.E./B.Tech.)"));
    }
    if (filters.educationType.length > 0) {
      result = result.filter((course) => filters.educationType.includes(course.educationType || "Full time"));
    }
    setFilteredCourses(result);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchResults(null);
      filterCourses("", activeFilters, courses);
    }
  }, [activeFilters, courses, filterCourses]);

  const handleSearchResults = useCallback((query: string, results: DashboardCourse[] | null) => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    setSearchResults(null);
    filterCourses("", activeFilters, courses);
    setDisplayedCourses(courses.slice(0, COURSES_PER_PAGE));
    return;
  }

  if (!results || results.length === 0) {
    setSearchResults([]);
    setFilteredCourses([]);
    setDisplayedCourses([]);
    return;
  }

  const transformed = results.map((course) =>
    transformApiCourse(course)
  );

  setSearchResults(transformed);
  setFilteredCourses(transformed);
  setDisplayedCourses(transformed.slice(0, COURSES_PER_PAGE));
}, [activeFilters, courses, filterCourses]);


  const handleFilterChange = (filterType: string, value: string, isChecked: boolean) => {
    const updatedFilters = { ...activeFilters };
    if (filterType === "instituteType") {
      if (isChecked) {
        updatedFilters.instituteType = value;
        updatedFilters.kindergartenLevels = [];
        updatedFilters.schoolLevels = [];
        updatedFilters.boardType = [];
        updatedFilters.programDuration = [];
        updatedFilters.ageGroup = [];
        updatedFilters.graduationType = [];
        updatedFilters.streamType = [];
        updatedFilters.educationType = [];
      } else {
        updatedFilters.instituteType = "";
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
  };


  const handleWishlistToggle = (courseId: string) => {

  const updatedCourses = courses.map((course) =>
    course.id === courseId
      ? { ...course, iswishlisted: !course.iswishlisted }
      : course
  );
  setCourses(updatedCourses);

  // Update filtered list
  const updatedFiltered = filteredCourses.map((course) =>
    course.id === courseId
      ? { ...course, iswishlisted: !course.iswishlisted }
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
  
  const wishlistCourses = courses.filter((course) => course.iswishlisted);

  const handleFilterToggle = () => {
    setIsFilterBottomSheetOpen(!isFilterBottomSheetOpen);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      instituteType: "" as string,
      kindergartenLevels: [] as string[],
      schoolLevels: [] as string[],
      modes: [] as string[],
      ageGroup: [] as string[],
      programDuration: [] as string[],
      priceRange: [] as string[],
      boardType: [] as string[],
      graduationType: [] as string[],
      streamType: [] as string[],
      levels: [] as string[],
      classSize: [] as string[],
      seatingType: [] as string[],
      operatingHours: [] as string[],
      duration: [] as string[],
      subjects: [] as string[],
      educationType: [] as string[],
    };
    setActiveFilters(clearedFilters);
  };


  const handleApplyFilters = async (filters: ActiveFilters) => {
  try {
    setLoading(true);
    setError(null);

    const response = await studentDashboardAPI.filterInstitutionCourses(filters);

    if (!response.success && response.message === "No course found") {
      setFilteredCourses([]);
      setDisplayedCourses([]);
      setSearchResults([]);
      setCurrentPage(1);
      return; 
    }

    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to fetch filtered courses");
    }

    const transformedCourses = (response.data as DashboardCourse[])
      .map(transformApiCourse);

    setSearchResults(transformedCourses);
    setFilteredCourses(transformedCourses);
    setDisplayedCourses(transformedCourses.slice(0, COURSES_PER_PAGE));
    setCurrentPage(1);

  } catch (err) {
    console.error("Error applying filters:", err);
    setError(err instanceof Error ? err.message : "Failed to apply filters");
  } finally {
    setLoading(false);
  }
};


  const handleClearFilters = () => {
  clearAllFilters();

  setSearchQuery("");
  setSearchResults(null);

  setFilteredCourses(courses);

  setDisplayedCourses(courses.slice(0, COURSES_PER_PAGE));
  setCurrentPage(1);

  setIsFilterBottomSheetOpen(false);
};


  const handleExploreClick = () => {
    router.push('/student/explore');
  };

  const shouldShowFooter = !isFilterBottomSheetOpen;

  return (
    <div className={styles.dashboardContainer}>
      <HomeHeader
        userName={user?.name || "Student"}
        userAvatar={user?.profilePicture}
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchResults={handleSearchResults}
        onFilterClick={handleFilterToggle}
        onNotificationClick={handleNotificationPaneToggle}
        onWishlistClick={handleWishlistPaneToggle}
        onProfileClick={() => router.push("/student/profile")}
      />

      {activePane && <div className={styles.overlay} onClick={closePane} />}

      {activePane === "notifications" && (
        <aside className={`${styles.pane} ${styles.paneExpanded}`} role="complementary" aria-label="Notifications">
          <header className={styles.paneHeader}>
            <h2>Notifications</h2>
            <button className={styles.closeBtn} onClick={closePane} aria-label="Close notifications">×</button>
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
            <button className={styles.closeBtn} onClick={closePane} aria-label="Close wishlist">×</button>
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
                    <button className={styles.removeWishlistBtn} onClick={() => handleWishlistToggle(course.id)} aria-label="Remove from wishlist">Remove</button>
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
          <FilterSidebar activeFilters={activeFilters} onFilterChange={handleFilterChange} onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters}/>
          <main className={styles.mainContent}>
            <section className={styles.coursesSection}>
              {displayedCourses.length > 0 ? (
                <>
                  <div className={styles.coursesGrid}>
                    {displayedCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={{
                          id: course.apiData?._id,
                          title: course.title,
                          institution: course.institution,
                          rating: course.rating,
                          reviews: course.reviews,
                          students: course.students,
                          price: course.price,
                          level: course.level,
                          mode: course.mode,
                          iswishlisted: course.iswishlisted,
                          location: course.apiData?.institutionDetails.locationURL || "",
                          description: course.apiData?.courseName || course.apiData.selectBranch || 'Quality education program',
                          duration: course.apiData?.courseDuration || '1 year',
                          brandLogo: course.apiData?.institutionDetails?.logoUrl || '',
                          imageUrl: course.apiData?.imageUrl || '',
                        }}
                        onWishlistToggle={handleWishlistToggle}
                        onViewDetails={handleViewCourseDetails}
                      />
                    ))}
                  </div>
                  {isLoadingMore && (
                    <div className={styles.loadingMore}>
                      <div className={styles.spinner}></div>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.emptyState}>
                  <p className={styles.emptyStateText}>
                    No courses found matching your filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </section>
          </main>
        </div>
      )}

      {isFilterBottomSheetOpen && (
        <>
          <div className={styles.filterOverlay} onClick={() => setIsFilterBottomSheetOpen(false)} />
          <div className={`${styles.filterBottomSheet} ${isFilterBottomSheetOpen ? styles.filterBottomSheetOpen : ''}`}>
            <div className={styles.filterBottomSheetDragHandle}>
              <svg width="134" height="5" viewBox="0 0 134 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="134" height="5" rx="2.5" fill="#B0B1B3"/>
              </svg>
            </div>
            <div className={styles.filterBottomSheetHeader}>
              <button className={styles.filterCloseBtn} onClick={() => setIsFilterBottomSheetOpen(false)} aria-label="Close filters">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.96939 12.531L14.4694 20.031C14.5391 20.1007 14.6218 20.156 14.7128 20.1937C14.8039 20.2314 14.9015 20.2508 15 20.2508C15.0986 20.2508 15.1961 20.2314 15.2872 20.1937C15.3782 20.156 15.461 20.1007 15.5306 20.031C15.6003 19.9614 15.6556 19.8786 15.6933 19.7876C15.731 19.6965 15.7504 19.599 15.7504 19.5004C15.7504 19.4019 15.731 19.3043 15.6933 19.2132C15.6556 19.1222 15.6003 19.0395 15.5306 18.9698L8.56032 12.0004L15.5306 5.03104C15.6714 4.89031 15.7504 4.69944 15.7504 4.50042C15.7504 4.30139 15.6714 4.11052 15.5306 3.96979C15.3899 3.82906 15.199 3.75 15 3.75C14.801 3.75 14.6101 3.82906 14.4694 3.96979L6.96939 11.4698C6.89965 11.5394 6.84433 11.6222 6.80659 11.7132C6.76885 11.8043 6.74942 11.9019 6.74942 12.0004C6.74942 12.099 6.76885 12.1966 6.80659 12.2876C6.84433 12.3787 6.89965 12.4614 6.96939 12.531Z" fill="#060B13"/>
                </svg>
              </button>
              <h2 className={styles.filterBottomSheetTitle}>Filter&apos;s</h2>
            </div>
            <div className={styles.filterBottomSheetContent}>
              <FilterSidebar activeFilters={activeFilters} onFilterChange={handleFilterChange} onApplyFilters={handleApplyFilters} />
            </div>
            <div className={styles.filterBottomSheetFooter}>
              <button className={styles.clearFilterBtn} onClick={clearAllFilters}>Clear Filter</button>
              <button className={styles.showResultsBtn} onClick={() => setIsFilterBottomSheetOpen(false)}>Show {filteredCourses.length} Results</button>
            </div>
          </div>
        </>
      )}

      {shouldShowFooter && <FooterNav onExploreClick={handleExploreClick} />}
    </div>
  );
};

export default StudentDashboard;
