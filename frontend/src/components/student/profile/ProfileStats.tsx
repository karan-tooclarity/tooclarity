'use client';

import React from 'react';
import styles from './ProfileStats.module.css';

interface StatItem {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

interface ProfileStatsProps {
  stats: StatItem[];
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.icon}>{stat.icon}</div>
          <div className={styles.value}>{stat.value}</div>
          <div className={styles.label}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;