"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/lib/hooks/notifications-hooks";
import EmptyState from "@/components/student/home/EmptyState";
import styles from "./notifications.module.css";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const date = new Date(ts);
  return date.toLocaleDateString();
}

export default function StudentNotificationsPage() {
  const router = useRouter();
  const { data: notifications = [], isLoading } = useNotifications();

  const handleBack = () => {
    router.back();
  };

  const handleBackToHome = () => {
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack} aria-label="Go back">
          <svg width="9" height="17" viewBox="0 0 9 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.219965 8.78104L7.71996 16.281C7.78965 16.3507 7.87237 16.406 7.96342 16.4437C8.05446 16.4814 8.15204 16.5008 8.25059 16.5008C8.34914 16.5008 8.44672 16.4814 8.53776 16.4437C8.62881 16.406 8.71153 16.3507 8.78122 16.281C8.8509 16.2114 8.90617 16.1286 8.94389 16.0376C8.9816 15.9465 9.00101 15.849 9.00101 15.7504C9.00101 15.6519 8.9816 15.5543 8.94389 15.4632C8.90617 15.3722 8.8509 15.2895 8.78122 15.2198L1.8109 8.25042L8.78122 1.28104C8.92195 1.14031 9.00101 0.94944 9.00101 0.750417C9.00101 0.551394 8.92195 0.360523 8.78122 0.219792C8.64048 0.0790615 8.44961 1.48284e-09 8.25059 0C8.05157 -1.48284e-09 7.8607 0.0790615 7.71996 0.219792L0.219965 7.71979C0.150232 7.78945 0.0949125 7.87216 0.0571699 7.96321C0.0194263 8.05426 9.53674e-07 8.15186 9.53674e-07 8.25042C9.53674e-07 8.34898 0.0194263 8.44657 0.0571699 8.53762C0.0949125 8.62867 0.150232 8.71139 0.219965 8.78104Z" fill="#060B13"/>
          </svg>
        </button>
        <h1 className={styles.title}>Notifications</h1>
      </header>

      {/* Content */}
      {notifications.length === 0 ? (
        <EmptyState
          iconType="notification"
          title="No notifications yet!"
          description="You don't have any notification at the moment, check back later."
          buttonText="Back to home"
          onButtonClick={handleBackToHome}
        />
      ) : (
        <div className={styles.notificationsList}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notificationCard} ${
                !notification.read ? styles.unread : ""
              }`}
            >
              <div className={styles.notificationHeader}>
                <h3 className={styles.notificationTitle}>{notification.title}</h3>
                <span className={styles.notificationTime}>
                  {timeAgo(notification.time)}
                </span>
              </div>
              {notification.description && (
                <p className={styles.notificationDescription}>
                  {notification.description}
                </p>
              )}
              {!notification.read && <div className={styles.unreadIndicator} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
