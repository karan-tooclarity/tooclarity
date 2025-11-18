"use client";

import React, { useEffect, useState } from "react";
import CourseCard, { Course } from "@/components/student/home/CourseCard";
import styles from "./Wishlist.module.css";
import { useRouter } from "next/navigation";
import { DashboardCourse, studentWishlistApi } from "@/lib/students-api";

interface WishlistProps {
  courses: DashboardCourse[];
}

const Wishlist: React.FC<WishlistProps> = ({ courses }) => {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<DashboardCourse[]>(courses);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist on load
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await studentWishlistApi.getWishlist();
        if (res.success && Array.isArray(res.data)) {
          setWishlist(res.data);
        }
      } catch (err) {
        console.error("Failed to load wishlist", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Remove from UI after toggle
  const handleWishlistToggle = (courseId: string) => {
    setWishlist((prev) => prev.filter((c) => c._id !== courseId));
  };

  const handleViewDetails = (courseId: string) => {
    router.push(`/dashboard/${courseId}`);
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          ←
        </button>
        <h1 className={styles.title}>Wishlist</h1>
      </header>

      {loading ? (
        <div className={styles.emptyState}>
          <p>Loading wishlist...</p>
        </div>
      ) : wishlist.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No courses in your wishlist yet.</p>
        </div>
      ) : (
        <div className={styles.coursesGrid}>
          {wishlist.map((course) => {
            // Correctly map DashboardCourse into CourseCard Course interface
            const mappedCourse: Course = {
              id: course._id,
              title: course.courseName || course.selectBranch || "",
              institution: "",
              rating: 0,
              reviews: 0,
              students: 0,
              price: course.priceOfCourse || 0,
              level: "",
              mode: "",
              iswishlisted: course.isWishlisted || false,
              imageUrl: course.imageUrl || "",
              brandLogo: course.institutionDetails?.logoUrl || "",
              location: course.institutionDetails?.locationURL || "",
              description: "Quality education program",
              duration: course.courseDuration || "1 year",
            };

            return (
              <CourseCard
                key={course._id}
                course={mappedCourse}
                onWishlistToggle={handleWishlistToggle}
                onViewDetails={handleViewDetails}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
