"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import InstituteCoursePage from "@/components/student/home/InstituteCoursePage";
import HomeHeader from "@/components/student/home/HomeHeader";
import FooterNav from "@/components/student/home/FooterNav";
import { studentDashboardAPI, type CourseForStudent } from "@/lib/students-api";
import { useAuth } from "@/lib/auth-context";
import styles from "./CoursePage.module.css";

const CourseDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseId = params.courseId as string;
  
  const [courseData, setCourseData] = useState<CourseForStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all courses and find the specific one
        const response = await studentDashboardAPI.getVisibleCourses();
        
        if (!response.success || !response.data) {
          throw new Error(response.message || "Failed to fetch course details");
        }

        const course = (response.data as CourseForStudent[]).find(
          (c) => c._id === courseId
        );

        if (!course) {
          throw new Error("Course not found");
        }

        setCourseData(course);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(err instanceof Error ? err.message : "Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const handleBackFromDetails = () => {
    router.push('/dashboard');
  };

  const handleRequestCall = () => {
    console.log('Request call clicked');
    // Add API call here
  };

  const handleBookDemo = () => {
    console.log('Book demo clicked');
    // Add API call here
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Could implement search functionality if needed
  };

  const handleNotificationClick = () => {
    router.push("/student/notifications");
  };

  const handleWishlistClick = () => {
    router.push("/dashboard"); // Navigate back to dashboard
  };

  const handleProfileClick = () => {
    router.push("/student/profile");
  };

  const handleExploreClick = () => {
    router.push('/student/explore');
  };

  if (loading) {
    return (
      <>
      <div className={styles.pageContainer}>
        <HomeHeader
          userName={user?.name || "Student"}
          searchValue={searchQuery}
          onSearchChange={handleSearch}
          onFilterClick={() => {}}
          onNotificationClick={handleNotificationClick}
          onWishlistClick={handleWishlistClick}
          onProfileClick={handleProfileClick}
          showSearchAndFilter={false}
        />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading course details...</p>
        </div>
        <FooterNav onExploreClick={handleExploreClick} />
        </div>
      </>
    );
  }

  if (error || !courseData) {
    return (
      <>
      <div className={styles.pageContainer}>
        <HomeHeader
          userName={user?.name || "Student"}
          searchValue={searchQuery}
          onSearchChange={handleSearch}
          onFilterClick={() => {}}
          onNotificationClick={handleNotificationClick}
          onWishlistClick={handleWishlistClick}
          onProfileClick={handleProfileClick}
          showSearchAndFilter={false}
        />
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>⚠️ {error || "Course not found"}</p>
          <button 
            className={styles.backButton}
            onClick={handleBackFromDetails}
          >
            Back to Dashboard
          </button>
        </div>
        <FooterNav onExploreClick={handleExploreClick} />
        </div>
      </>
    );
  }

  return (
    <>
    <div className={styles.pageContainer}>
      <HomeHeader
        userName={user?.name || "Student"}
        searchValue={searchQuery}
        onSearchChange={handleSearch}
        onFilterClick={() => {}}
        onNotificationClick={handleNotificationClick}
        onWishlistClick={handleWishlistClick}
        onProfileClick={handleProfileClick}
        showSearchAndFilter={false}
      />
      <InstituteCoursePage
        course={{
          id: courseId,
          title: courseData.courseName || "Untitled Course",
          institution: courseData.institution?.instituteName || "Unknown Institution",
          location: courseData.location || courseData.institution?.instituteName || "Location not specified",
          description: courseData.aboutCourse || 'Discover quality education with comprehensive learning programs',
          aboutCourse: courseData.aboutCourse || 'Our institution provides world-class education with experienced faculty and modern facilities.',
          eligibility: courseData.eligibilityCriteria || 'All students meeting basic requirements',
          price: courseData.priceOfCourse || 0,
          duration: courseData.courseDuration || courseData.mode || '1 year',
          mode: courseData.mode || 'Classroom',
          timings: courseData.openingTime && courseData.closingTime 
            ? `${courseData.openingTime} - ${courseData.closingTime}`
            : '9:00 AM - 5:00 PM',
          brandLogo: courseData.institution?.instituteLogo || '',
          startDate: courseData.startDate 
            ? new Date(courseData.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : 'July 2024',
          operationalDays: courseData.operationalDays && courseData.operationalDays.length > 0
            ? courseData.operationalDays
            : ['Mon', 'Tues', 'Wed', 'Thu', 'Fri'],
          features: {
            recognized: true,
            activities: true,
            transport: true,
            extraCare: true,
            mealsProvided: courseData.hasWifi === 'Yes',
            playground: courseData.hasAC === 'Yes',
          },
        }}
        instituteType={courseData.institution?.instituteType}
        onBack={handleBackFromDetails}
        onRequestCall={handleRequestCall}
        onBookDemo={handleBookDemo}
      />
      <FooterNav onExploreClick={handleExploreClick} />
      </div>
    </>
  );
};

export default CourseDetailsPage;
