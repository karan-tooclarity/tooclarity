'use client';

import React from 'react';
import Image from 'next/image';
import styles from './ProfileHeader.module.css';

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatar?: string;
  onEditProfile?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  avatar,
  onEditProfile,
}) => {
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className={styles.header}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {avatar ? (
            <Image src={avatar} alt={name} width={48} height={48} />
          ) : (
            <span className={styles.initials}>{getInitials(name)}</span>
          )}
        </div>
        <div className={styles.details}>
          <h1>{name}</h1>
          <p>{email}</p>
          <button className={styles.editBtn} onClick={onEditProfile}>
            ✏️ Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;