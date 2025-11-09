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
  image?: string;
  location?: string;
  description?: string;
  duration?: string;
  brandLogo?: string;
}

interface CourseCardProps {
  course: Course;
  onWishlistToggle: (courseId: string) => void;
  onViewDetails?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onWishlistToggle,
  onViewDetails,
}) => {
  const handleWishlistClick = () => {
    onWishlistToggle(course.id);
  };

  const handleViewDetails = () => {
    onViewDetails?.(course.id);
  };

  return (
    <div className={styles.card} style={{ width: '100%', minWidth: 0 }}>
      {/* Course Image with Overlays */}
      <div className={styles.imageContainer} style={{ width: '100%', minWidth: 0 }}>
        <img
          src={course.image || 'https://res.cloudinary.com/daq0xtstq/image/upload/v1759253728/Gemini_Generated_Image_82dkbt82dkbt82dk_chvp3e.png'}
          alt={course.title}
          className={styles.courseImage}
          style={{ width: '100%', height: '100%', objectFit: 'cover', minWidth: 0 }}
        />

        {/* Badge Container - Full width at bottom */}
        <div className={styles.badgeContainer} style={{ width: '100%', minWidth: 0 }}>
          {/* Institution Badge - Left side */}
          <div className={styles.institutionBadge} style={{ minWidth: 0 }}>
            <div className={styles.logoContainer}>
              <img 
                src={course.brandLogo || "https://res.cloudinary.com/daq0xtstq/image/upload/v1759253728/Gemini_Generated_Image_82dkbt82dkbt82dk_chvp3e.png"} 
                alt={course.institution}
                className={styles.logo}
                style={{ width: '100%', height: '100%', objectFit: 'contain', minWidth: 0 }}
              />
            </div>
            <div className={styles.institutionInfo} style={{ minWidth: 0 }}>
              <h3 className={styles.institutionName} style={{ minWidth: 0 }}>{course.institution}</h3>
              {course.location && (
                <div className={styles.locationRow} style={{ minWidth: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.0625 3.93757C10.0626 3.35053 9.8939 2.77584 9.5766 2.28195C9.2593 1.78805 8.80674 1.39576 8.2728 1.15178C7.73886 0.907803 7.14606 0.822425 6.56497 0.905813C5.98389 0.989201 5.43902 1.23784 4.99524 1.62212C4.55146 2.00641 4.22748 2.51014 4.06188 3.07333C3.89628 3.63653 3.89604 4.23545 4.06118 4.79878C4.22632 5.36211 4.54989 5.86611 4.99335 6.25075C5.43681 6.6354 5.98148 6.88448 6.5625 6.96835V12.6876C6.5625 12.8036 6.60859 12.9149 6.69064 12.9969C6.77269 13.079 6.88397 13.1251 7 13.1251C7.11603 13.1251 7.22731 13.079 7.30936 12.9969C7.39141 12.9149 7.4375 12.8036 7.4375 12.6876V6.96835C8.16589 6.86218 8.83182 6.49762 9.31373 5.94121C9.79565 5.38481 10.0614 4.67365 10.0625 3.93757ZM7 6.12506C6.56735 6.12506 6.14442 5.99677 5.78469 5.7564C5.42496 5.51604 5.14458 5.1744 4.97901 4.77469C4.81345 4.37497 4.77013 3.93514 4.85453 3.51081C4.93894 3.08647 5.14728 2.6967 5.4532 2.39077C5.75913 2.08484 6.14891 1.8765 6.57324 1.7921C6.99757 1.70769 7.43741 1.75101 7.83712 1.91658C8.23683 2.08215 8.57847 2.36252 8.81884 2.72226C9.05921 3.08199 9.1875 3.50492 9.1875 3.93757C9.1875 4.22483 9.13092 4.50929 9.02099 4.77469C8.91105 5.04008 8.74992 5.28123 8.5468 5.48436C8.34367 5.68749 8.10252 5.84862 7.83712 5.95855C7.57172 6.06848 7.28727 6.12506 7 6.12506Z" fill="white"/>
                  </svg>
                  <span className={styles.locationText} style={{ minWidth: 0 }}>{course.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bookmark Button - Right side */}
          <button
            className={`${styles.bookmarkBtn} ${course.wishlisted ? styles.active : ''}`}
            onClick={handleWishlistClick}
            aria-label={course.wishlisted ? 'Remove from saved' : 'Save for later'}
            style={{ minWidth: 0 }}
          >
            <svg
              className={styles.bookmarkIcon}
              viewBox="0 0 24 24"
              fill={course.wishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className={styles.content} style={{ width: '100%', minWidth: 0 }}>
        {/* Description */}
        {course.description && (
          <p className={styles.description} style={{ minWidth: 0 }}>{course.description}</p>
        )}

        {/* Fees and Duration */}
        <div className={styles.infoRow} style={{ minWidth: 0 }}>
          <div className={styles.infoItem} style={{ minWidth: 0 }}>
            <span className={styles.infoLabel} style={{ minWidth: 0 }}>Total Fees:</span>
            <span className={styles.infoValue} style={{ minWidth: 0 }}>₹ {(course.price / 100000).toFixed(2)} L</span>
          </div>
          {course.duration && (
            <div className={styles.infoItem} style={{ minWidth: 0 }}>
              <span className={styles.infoLabel} style={{ minWidth: 0 }}>Duration:</span>
              <span className={styles.infoValue} style={{ minWidth: 0 }}>{course.duration}</span>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <button className={styles.viewDetailsBtn} onClick={handleViewDetails} style={{ minWidth: 0 }}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default CourseCard;