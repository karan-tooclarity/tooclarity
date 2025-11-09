"use client";

import React, { useMemo, useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import SettingsSection from "./SettingsSection";
import { useAuth } from "@/lib/auth-context";

// Define user metrics type for strong typing
interface UserMetrics {
  programsVisited?: number;
  wishlistCount?: number;
  requestsRaised?: number;
}

interface User {
  name?: string;
  email?: string;
  metrics?: UserMetrics;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth() as { user: User | null };

  // Wishlist count comes from localStorage key 'wishlistedCourses'
  const [wishlistCount, setWishlistCount] = useState<number | string>(() => {
    if (typeof window === "undefined") return user?.metrics?.wishlistCount ?? "--";
    try {
      const saved = localStorage.getItem("wishlistedCourses");
      return saved ? JSON.parse(saved).length : 0;
    } catch {
      return user?.metrics?.wishlistCount ?? "--";
    }
  });

  useEffect(() => {
    const read = () => {
      try {
        const saved = localStorage.getItem("wishlistedCourses");
        setWishlistCount(saved ? JSON.parse(saved).length : 0);
      } catch {
        setWishlistCount(user?.metrics?.wishlistCount ?? "--");
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "wishlistedCourses") read();
    };

    const handleCustomEvent = () => read();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("wishlistUpdated", handleCustomEvent as EventListener);

    // initial read
    read();

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("wishlistUpdated", handleCustomEvent as EventListener);
    };
  }, [user]); // cleaned dependency list

  const stats = useMemo(
    () => [
      {
        icon: "📚",
        value: user?.metrics?.programsVisited ?? "--",
        label: "Programs Visited",
      },
      {
        icon: "🔖",
        value: wishlistCount ?? user?.metrics?.wishlistCount ?? "--",
        label: "Wishlist",
      },
      {
        icon: "📝",
        value: user?.metrics?.requestsRaised ?? "--",
        label: "Requests Raised",
      },
    ],
    [user, wishlistCount]
  );

  const settings = useMemo(
    () => [
      { icon: "👤", label: "Profile" },
      { icon: "🔔", label: "Notifications" },
      { icon: "❓", label: "Help center" },
      { icon: "🔐", label: "Security & Privacy" },
      { icon: "🚪", label: "Logout", isDangerous: true },
    ],
    []
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <ProfileHeader name={user?.name || "--"} email={user?.email || "--"} />
        <ProfileStats stats={stats} />
        <SettingsSection items={settings} />
      </div>
    </div>
  );
};

export default ProfilePage;
