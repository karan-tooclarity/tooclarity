'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './CoursePage.module.css';

interface CoursePageProps {
  course: {
    id: string;
    title: string;
    institution: string;
    location?: string;
    description?: string;
    aboutCourse?: string;
    eligibility?: string;
    price: number;
    duration?: string;
    mode?: string;
    timings?: string;
    brandLogo?: string;
    startDate?: string;
    image?: string;
    operationalDays?: string[];
    features?: {
      recognized?: boolean;
      activities?: boolean;
      transport?: boolean;
      extraCare?: boolean;
      mealsProvided?: boolean;
      playground?: boolean;
    };
  };
  onBack?: () => void;
  onRequestCall?: () => void;
  onBookDemo?: () => void;
}

// Tuition Centre specific course page variant
export const TuitionCentre: React.FC<CoursePageProps> = ({
  course,
  onBack,
  onRequestCall,
  onBookDemo,
}) => {
  const [showMore, setShowMore] = useState(false);
  const allDays = ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const operationalDays = course.operationalDays || ['Mon', 'Tues', 'Wed', 'Thu', 'Fri'];

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className={styles.pageContainer} style={{ width: '100%', minWidth: 0 }}>
      {/* Back Button */}
      {onBack && (
        <button className={styles.backButton} onClick={onBack} aria-label="Go back to dashboard">
          <svg width="9" height="17" viewBox="0 0 9 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.219965 8.78104L7.71996 16.281C7.78965 16.3507 7.87237 16.406 7.96342 16.4437C8.05446 16.4814 8.15204 16.5008 8.25059 16.5008C8.34914 16.5008 8.44672 16.4814 8.53776 16.4437C8.62881 16.406 8.71153 16.3507 8.78122 16.281C8.8509 16.2114 8.90617 16.1286 8.94389 16.0376C8.9816 15.9465 9.00101 15.849 9.00101 15.7504C9.00101 15.6519 8.9816 15.5543 8.94389 15.4632C8.90617 15.3722 8.8509 15.2895 8.78122 15.2198L1.8109 8.25042L8.78122 1.28104C8.92195 1.14031 9.00101 0.94944 9.00101 0.750417C9.00101 0.551394 8.92195 0.360523 8.78122 0.219792C8.64048 0.0790615 8.44961 1.48284e-09 8.25059 0C8.05157 -1.48284e-09 7.8607 0.0790615 7.71996 0.219792L0.219965 7.71979C0.150232 7.78945 0.0949125 7.87216 0.0571699 7.96321C0.0194263 8.05426 9.53674e-07 8.15186 9.53674e-07 8.25042C9.53674e-07 8.34898 0.0194263 8.44657 0.0571699 8.53762C0.0949125 8.62867 0.150232 8.71139 0.219965 8.78104Z" fill="#060B13"/>
          </svg>
        </button>
      )}


      {/* Course Image with Overlays */}
      <div className={styles.imageContainer} style={{ width: '100%', minWidth: 0 }}>
        <Image
          src={course.image || 'https://res.cloudinary.com/daq0xtstq/image/upload/v1759253728/Gemini_Generated_Image_82dkbt82dkbt82dk_chvp3e.png'}
          alt={course.title}
          className={styles.courseImage}
          width={500}
          height={300}
          style={{ width: '100%', height: '100%', objectFit: 'cover', minWidth: 0 }}
          priority
        />

        {/* Badge Container - Full width at bottom */}
        <div className={styles.badgeContainer} style={{ width: '100%', minWidth: 0 }}>
          {/* Institution Badge - Left side */}
          <div className={styles.institutionBadge} style={{ minWidth: 0 }}>
            <div className={styles.logoContainer}>
              <Image 
                src={course.brandLogo || "https://res.cloudinary.com/daq0xtstq/image/upload/v1759253728/Gemini_Generated_Image_82dkbt82dkbt82dk_chvp3e.png"} 
                alt={course.institution}
                className={styles.logo}
                width={60}
                height={60}
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
            className={styles.bookmarkBtn}
            aria-label="Save for later"
            style={{ minWidth: 0 }}
          >
            <svg
              className={styles.bookmarkIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Course Content */}
      <div className={styles.contentSection} style={{ width: '100%', minWidth: 0 }}>
        {/* Course Title and Subtitle */}
        <div className={styles.titleSection} style={{ minWidth: 0 }}>
          <h1 className={styles.courseTitle} style={{ minWidth: 0 }}>{course.title}</h1>
          <h2 className={styles.courseSubtitle} style={{ minWidth: 0 }}>{course.institution}</h2>
        </div>

        {/* Info Row - Fees and Duration */}
        <div className={styles.infoGrid} style={{ minWidth: 0 }}>
          <div className={styles.infoBoxBlue} style={{ minWidth: 0 }}>
            <span className={styles.infoLabel} style={{ minWidth: 0 }}>Total Fees: </span>
            <span className={styles.infoValue} style={{ minWidth: 0 }}>₹ {(course.price / 100000).toFixed(2)} L</span>
          </div>
          {course.location && (
            <div className={styles.infoBox} style={{ minWidth: 0 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
                <path d="M6 1C3.79 1 2 2.79 2 5c0 2.5 4 6 4 6s4-3.5 4-6c0-2.21-1.79-4-4-4zm0 5.5c-.83 0-1.5-.67-1.5-1.5S5.17 3.5 6 3.5 7.5 4.17 7.5 5 6.83 6.5 6 6.5z" fill="#666"/>
              </svg>
              <span className={styles.infoValue} style={{ minWidth: 0 }}>
                {course.location.length > 12 ? course.location.substring(0, 12) + '...' : course.location}
              </span>
            </div>
          )}
        </div>


        {/* Mode and Timings */}
        <div className={styles.modeTimingsGrid} style={{ minWidth: 0 }}>
          <div style={{ minWidth: 0 }}>
            <h3 className={styles.sectionTitle} style={{ minWidth: 0 }}>Mode</h3>
            <div className={styles.modeTimingBox} style={{ minWidth: 0 }}>
              <div className={styles.modeTimingValue} style={{ minWidth: 0 }}>{course.mode || 'Classroom'}</div>
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 className={styles.sectionTitle} style={{ minWidth: 0 }}>Timing&apos;s</h3>
            <div className={styles.modeTimingBox} style={{ minWidth: 0 }}>
              <div className={styles.modeTimingValue} style={{ minWidth: 0 }}>{course.timings || '9:00 AM - 4:00 PM'}</div>
            </div>
          </div>
        </div>


        {/* Instructor and Subjects */}
        <div className={styles.modeTimingsGrid} style={{ minWidth: 0 }}>
          <div style={{ minWidth: 0 }}>
            <h3 className={styles.sectionTitle} style={{ minWidth: 0 }}>Instructor</h3>
            <div className={styles.modeTimingBox} style={{ minWidth: 0 }}>
              <div className={styles.modeTimingValue} style={{ minWidth: 0 }}>{'Kiran Kumar'}</div>
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 className={styles.sectionTitle} style={{ minWidth: 0 }}>Subject&apos;s</h3>
            <div className={styles.modeTimingBox} style={{ minWidth: 0 }}>
              <div className={styles.modeTimingValue} style={{ minWidth: 0 }}>{'Math, Science, English'}</div>
            </div>
          </div>
        </div>


        {/* About Course */}
        <div className={styles.section} style={{ minWidth: 0 }}>
          <h3 className={styles.sectionTitle} style={{ minWidth: 0 }}>About Course</h3>
          <p className={styles.sectionText} style={{ minWidth: 0 }}>
            {course.aboutCourse || 'Lorem ipsum is simply dummy text of the printing and typesetting industry, Lorem ipsum'}
          </p>
        </div>

        {/* Eligibility */}
        <div className={styles.section} style={{ minWidth: 0 }}>
          <h3 className={styles.sectionTitle} style={{ minWidth: 0 }}>Eligibility</h3>
          <p className={styles.sectionText} style={{ minWidth: 0 }}>
            {course.eligibility || '2 - 3, Uppali Hills...'}
          </p>
        </div>

        {/* Operational Days */}
        <div className={styles.section} style={{ minWidth: 0 }}>
          <h3 className={styles.sectionTitle} style={{ minWidth: 0 }}>Operational Day&apos;s</h3>
          <div className={styles.daysGrid} style={{ minWidth: 0 }}>
            {allDays.map((day) => (
              <div
                key={day}
                className={`${styles.dayPill} ${
                  operationalDays.includes(day) ? styles.active : ''
                }`}
                style={{ minWidth: 0 }}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        
        {/* Advertisement Section */}
        <div className={styles.adSection} style={{ minWidth: 0 }}>
          <div className={styles.adContent} style={{ minWidth: 0 }}>
            <h3 style={{ minWidth: 0 }}>Galaxy F16 5G</h3>
            <p style={{ minWidth: 0 }}>India&apos;s<br />Segment&apos;s slimmest phone with aAMOLED</p>
          </div>
          <div className={styles.adImage} style={{ minWidth: 0 }}>
            <span style={{ minWidth: 0 }}>Phone Image</span>
          </div>
        </div>

        {/* Show More Button */}
        <button className={styles.showMoreBtn} onClick={handleShowMore} style={{ minWidth: 0 }}>
          {showMore ? 'Show Less' : 'Show More'}
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{ transform: showMore ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Action Buttons - Only shown when showMore is true */}
        {showMore && (
          <div className={styles.actionButtons} style={{ minWidth: 0 }}>
            <button className={styles.requestCallBtn} onClick={onRequestCall} style={{ minWidth: 0 }}>
              Request a Call
            </button>
            <button className={styles.bookDemoBtn} onClick={onBookDemo} style={{ minWidth: 0 }}>
              Book Demo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TuitionCentre;
