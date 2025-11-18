'use client';

import React, { useState } from 'react';
import styles from './CourseCard.module.css';
import Image from 'next/image';
import { studentWishlistApi } from "@/lib/students-api";
import { useUserStore } from "@/lib/user-store";

export interface Course {
  id: string;
  title: string;
  institution: string;
  rating?: number;
  reviews?: number;
  students: number;
  price: number;
  level?: string;
  mode?: string;
  iswishlisted?: boolean;
  imageUrl?: string;
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

  // 🔥 Local state for instant UI response (optimistic update)
  const [isWishlisted, setIsWishlisted] = useState(!!course.iswishlisted);
  const [loading, setLoading] = useState(false);
  const { updateUser, user } = useUserStore();

  const handleWishlistClick = async () => {
    if (loading) return; // prevent spamming  
    setLoading(true);

    const newState = !isWishlisted;

    // 🔥 Optimistic UI update
    setIsWishlisted(newState);

    try {
      const res = await studentWishlistApi.toggleWishlist(course.id, newState);

      if (!res.success) {
        // ❌ Revert if API fails
        setIsWishlisted(!newState);
        console.error("Toggle wishlist failed", res);
      } else {
        // 🔥 Notify parent (only needed in wishlist page to remove item)
        onWishlistToggle(course.id);

        // 🔥 Update wishlist count in user store
        if (user?.wishlistCount !== undefined) {
          const countChange = newState ? 1 : -1;
          updateUser({ wishlistCount: user.wishlistCount + countChange });
        }
      }
    } catch (err) {
      console.error("Error while toggling wishlist", err);

      // ❌ Revert if network/API error
      setIsWishlisted(!newState);
    }

    setLoading(false);
  };

  const handleViewDetails = () => {
    onViewDetails?.(course.id);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={
            course.imageUrl ||
            'https://res.cloudinary.com/daq0xtstq/image/upload/v1759253728/Gemini_Generated_Image_82dkbt82dkbt82dk_chvp3e.png'
          }
          alt={course.title}
          width={200}
          height={200}
          className={styles.courseImage}
        />

        <div className={styles.badgeContainer}>
          {/* Institution */}
          <div className={styles.institutionBadge}>
            <div className={styles.logoContainer}>
              <Image
                src={
                  course.brandLogo ||
                  "https://res.cloudinary.com/daq0xtstq/image/upload/v1759253728/Gemini_Generated_Image_82dkbt82dkbt82dk_chvp3e.png"
                }
                alt={course.institution}
                width={20}
                height={20}
                className={styles.logo}
              />
            </div>
            <div>
              <h3 className={styles.institutionName}>{course.institution}</h3>
              {course.location && (
                <div className={styles.locationRow}>
                  <svg width="14" height="14">
                    <path
                      d="M10.0625 3.93757C10.0626 3.35053..."
                      fill="white"
                    />
                  </svg>
                  <span className={styles.locationText}>{course.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* 🔥 Bookmark Button */}
          <button
            className={`${styles.bookmarkBtn} ${isWishlisted ? styles.active : ""}`}
            onClick={handleWishlistClick}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            disabled={loading}
          >
            <svg
              className={styles.bookmarkIcon}
              viewBox="0 0 24 24"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {course.description && (
          <p className={styles.description}>{course.description}</p>
        )}

        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Total Fees:</span>
            <span className={styles.infoValue}>
              ₹ {(course.price / 100000).toFixed(2)} L
            </span>
          </div>

          {course.duration && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Duration:</span>
              <span className={styles.infoValue}>{course.duration}</span>
            </div>
          )}
        </div>

        <button className={styles.viewDetailsBtn} onClick={handleViewDetails}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
