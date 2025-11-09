"use client";

import React, { useState } from "react";
import CourseCard from "@/components/student/home/CourseCard";
import styles from "./WishlistPage.module.css";
import { useRouter } from "next/navigation";

interface CourseCardData {
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

// Mock data for wishlist courses
const mockWishlistCourses: CourseCardData[] = [
  {
    id: "1",
    title: "Full Stack Web Development Bootcamp",
    institution: "Tech Academy",
    rating: 4.8,
    reviews: 1250,
    students: 5420,
    price: 12999,
    level: "Intermediate",
    mode: "Online",
    wishlisted: true,
    image: "https://res.cloudinary.com/daq0xtstq/image/upload/v1759253728/Gemini_Generated_Image_82dkbt82dkbt82dk_chvp3e.png",
    location: "Mumbai",
    description: "Learn full stack development with React, Node.js, MongoDB and modern web technologies",
    duration: "6 months",
    brandLogo: "https://res.cloudinary.com/daq0xtstq/image/upload/v1759253728/Gemini_Generated_Image_82dkbt82dkbt82dk_chvp3e.png",
  },
  {
    id: "2",
    title: "Data Science & Machine Learning",
    institution: "AI Institute",
    rating: 4.9,
    reviews: 2100,
    students: 8750,
    price: 18999,
    level: "Advanced",
    mode: "Hybrid",
    wishlisted: true,
    image: "https://res.cloudinary.com/daq0xtstq/image/upload/v1759253728/Gemini_Generated_Image_82dkbt82dkbt82dk_chvp3e.png",
    location: "Bangalore",
    description: "Master data science with Python, machine learning algorithms, and real-world projects",
    duration: "9 months",
    brandLogo: "https://res.cloudinary.com/daq0xtstq/image/upload/v1759253728/Gemini_Generated_Image_82dkbt82dkbt82dk_chvp3e.png",
  },
  {
    id: "3",
    title: "Digital Marketing Mastery",
    institution: "Marketing Pro Institute",
    rating: 4.7,
    reviews: 890,
    students: 3200,
    price: 9999,
    level: "Beginner",
    mode: "Online",
    wishlisted: true,
    image: "https://res.cloudinary.com/daq0xtstq/image/upload/v1759253728/Gemini_Generated_Image_82dkbt82dkbt82dk_chvp3e.png",
    location: "Delhi",
    description: "Comprehensive digital marketing course covering SEO, SEM, social media, and analytics",
    duration: "4 months",
    brandLogo: "https://res.cloudinary.com/daq0xtstq/image/upload/v1759253728/Gemini_Generated_Image_82dkbt82dkbt82dk_chvp3e.png",
  },
  {
    id: "4",
    title: "UI/UX Design Professional",
    institution: "Design School",
    rating: 4.8,
    reviews: 1540,
    students: 4680,
    price: 14999,
    level: "Intermediate",
    mode: "Online",
    wishlisted: true,
    image: "https://res.cloudinary.com/daq0xtstq/image/upload/v1759253728/Gemini_Generated_Image_82dkbt82dkbt82dk_chvp3e.png",
    location: "Pune",
    description: "Learn user interface and user experience design with Figma, Adobe XD, and prototyping",
    duration: "5 months",
    brandLogo: "https://res.cloudinary.com/daq0xtstq/image/upload/v1759253728/Gemini_Generated_Image_82dkbt82dkbt82dk_chvp3e.png",
  },
  {
    id: "5",
    title: "Full Stack Web Development Bootcamp",
    institution: "Tech Academy",
    rating: 4.8,
    reviews: 1250,
    students: 5420,
    price: 12999,
    level: "Intermediate",
    mode: "Online",
    wishlisted: true,
    image: "https://res.cloudinary.com/daq0xtstq/image/upload/v1759253728/Gemini_Generated_Image_82dkbt82dkbt82dk_chvp3e.png",
    location: "Mumbai",
    description: "Learn full stack development with React, Node.js, MongoDB and modern web technologies",
    duration: "6 months",
    brandLogo: "https://res.cloudinary.com/daq0xtstq/image/upload/v1759253728/Gemini_Generated_Image_82dkbt82dkbt82dk_chvp3e.png",
  },
];

const WishlistPage: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseCardData[]>(mockWishlistCourses);

  const handleWishlistToggle = (courseId: string) => {
    // Remove course from wishlist when toggled
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const handleViewDetails = (courseId: string) => {
    router.push(`/dashboard/${courseId}`);
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack} aria-label="Go back">
          <svg width="9" height="17" viewBox="0 0 9 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.219965 8.78104L7.71996 16.281C7.78965 16.3507 7.87237 16.406 7.96342 16.4437C8.05446 16.4814 8.15204 16.5008 8.25059 16.5008C8.34914 16.5008 8.44672 16.4814 8.53776 16.4437C8.62881 16.406 8.71153 16.3507 8.78122 16.281C8.8509 16.2114 8.90617 16.1286 8.94389 16.0376C8.9816 15.9465 9.00101 15.849 9.00101 15.7504C9.00101 15.6519 8.9816 15.5543 8.94389 15.4632C8.90617 15.3722 8.8509 15.2895 8.78122 15.2198L1.8109 8.25042L8.78122 1.28104C8.92195 1.14031 9.00101 0.94944 9.00101 0.750417C9.00101 0.551394 8.92195 0.360523 8.78122 0.219792C8.64048 0.0790615 8.44961 1.48284e-09 8.25059 0C8.05157 -1.48284e-09 7.8607 0.0790615 7.71996 0.219792L0.219965 7.71979C0.150232 7.78945 0.0949125 7.87216 0.0571699 7.96321C0.0194263 8.05426 9.53674e-07 8.15186 9.53674e-07 8.25042C9.53674e-07 8.34898 0.0194263 8.44657 0.0571699 8.53762C0.0949125 8.62867 0.150232 8.71139 0.219965 8.78104Z" fill="#060B13"/>
          </svg>
        </button>
        <h1 className={styles.title}>Wishlist</h1>
      </header>

      {/* Content */}
      {courses.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No courses in your wishlist yet.</p>
        </div>
      ) : (
        <div className={styles.coursesGrid}>
          {courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onWishlistToggle={handleWishlistToggle}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;