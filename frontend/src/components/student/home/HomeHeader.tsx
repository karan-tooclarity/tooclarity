'use client';

import React from 'react';
import Image from 'next/image';
import styles from './HomeHeader.module.css';

interface HomeHeaderProps {
  userName: string;
  userAvatar?: string;
  searchValue?: string;
  onFilterClick?: () => void;
  onNotificationClick?: () => void;
  onWishlistClick?: () => void;
  onSearchChange?: (query: string) => void;
  onProfileClick?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName,
  userAvatar,
  searchValue = '',
  onFilterClick,
  onNotificationClick,
  onWishlistClick,
  onSearchChange,
  onProfileClick,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className={styles.header}>
      <div className={styles.greetingSection}>
        <button
          type="button"
          className={styles.avatar}
          onClick={onProfileClick}
          aria-label="Open profile"
        >
          {userAvatar ? (
            <Image src={userAvatar} alt={userName} width={48} height={48} />
          ) : (
            <span className={styles.initialsText}>{getInitials(userName)}</span>
          )}
        </button>
        <div className={styles.greetingText}>
          <h2 className={styles.greeting}>Welcome back</h2>
          <p className={styles.userName}>{userName} 👋</p>
        </div>
      </div>

      <div className={styles.searchFilterGroup}>
        <input
          type="text"
          className={styles.searchBar}
          placeholder="Search courses..."
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          aria-label="Search courses"
        />

        {/* Filter Button with SVG Icon */}
        <button
          className={styles.filterBtn}
          title="Filters"
          onClick={onFilterClick}
          aria-label="Open filters"
        >
          <svg
            className={styles.filterIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0 0-.293.707V17l-4 4v-6.586a1 1 0 0 0-.293-.707L3.293 7.293A1 1 0 0 1 3 6.586V4z" />
          </svg>
        </button>

        <button
          className={styles.wishlistBtn}
          title="Wishlist"
          onClick={onWishlistClick}
          aria-label="View wishlist"
        >
          <svg
            className={styles.wishlistIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Notification Button with SVG Icon */}
        <button
          className={styles.notificationBtn}
          title="Notifications"
          onClick={onNotificationClick}
          aria-label="View notifications"
        >
          <svg
            className={styles.notificationIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HomeHeader;