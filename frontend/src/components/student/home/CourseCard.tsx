'use client';

import React from 'react';
import styles from './CourseCard.module.css';

interface Course {
  id: string;
  title: string;
  institution: string;
  rating: number;
  reviews: number;
  students: number;
  price: number;
  level?: string;
  mode?: string;
  wishlisted: boolean;
}

interface CourseCardProps {
  course: Course;
  onWishlistToggle: (courseId: string) => void;
}

/**
 * CourseCard Component - Displays individual course information
 * Features: Rating, pricing, wishlist toggle, institution info
 * Responsive: Adapts to desktop, tablet, and mobile layouts
 */
export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onWishlistToggle,
}) => {
  const handleWishlistClick = () => {
    onWishlistToggle(course.id);
  };

  return (
    <div className={styles.card}>
      {/* Course Header with placeholder and wishlist icon */}
      <div className={styles.imageContainer}>
        <div className={styles.imagePlaceholder}>
          <span className={styles.placeholderText}>Course Image</span>
        </div>

        {/* Course Badge */}
        <div className={styles.badge}>{course.level}</div>

        {/* Wishlist Button with SVG Icon */}
        <button
          className={`${styles.wishlistBtn} ${course.wishlisted ? styles.active : ''}`}
          onClick={handleWishlistClick}
          aria-label={
            course.wishlisted
              ? 'Remove from wishlist'
              : 'Add to wishlist'
          }
          title={course.wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className={styles.wishlistIcon}
            viewBox="0 0 24 24"
            fill={course.wishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Course Content */}
      <div className={styles.content}>
        {/* Institution Name */}
        <p className={styles.institution}>{course.institution}</p>

        {/* Course Title */}
        <h3 className={styles.title}>{course.title}</h3>

        {/* Rating Section */}
        <div className={styles.ratingSection}>
          <div className={styles.rating}>
            <span className={styles.stars}>★★★★★</span>
            <span className={styles.ratingValue}>{course.rating}</span>
          </div>
          <span className={styles.reviews}>({course.reviews})</span>
        </div>

        {/* Student Count */}
        <p className={styles.students}>{course.students.toLocaleString()} students</p>

        {/* Course Metadata */}
        <div className={styles.metadata}>
          <span className={styles.modeTag}>{course.mode}</span>
        </div>

        {/* Footer with Price */}
        <div className={styles.footer}>
          <div className={styles.priceSection}>
            <span className={styles.price}>₹{course.price.toLocaleString()}</span>
          </div>
          <button className={styles.enrollBtn}>Enroll Now</button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;