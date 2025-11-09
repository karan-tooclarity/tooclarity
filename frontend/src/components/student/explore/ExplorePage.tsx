"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./ExplorePage.module.css";
import FooterNav from "../home/FooterNav";
import HomeHeader from "../home/HomeHeader";
import { getMockInstitutionGroups } from "./mockData";
import { studentDashboardAPI, type CourseForStudent } from "@/lib/students-api";
import { useAuth } from "@/lib/auth-context";

interface InstitutionGroup {
  category: string;
  institutions: {
    id: string;
    name: string;
    location: string;
    logo: string;
  }[];
}

const ExplorePage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [institutionGroups, setInstitutionGroups] = useState<InstitutionGroup[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const USE_MOCK = true;

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await studentDashboardAPI.getVisibleCourses();
      
      if (response.success && response.data && (response.data as CourseForStudent[]).length > 0) {
        const courses = response.data as CourseForStudent[];
        const grouped = groupCoursesByCategory(courses);
        setInstitutionGroups(grouped);
      } else {
        // Fallback to mock when no data
        setInstitutionGroups(getMockInstitutionGroups());
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Fallback to mock on error
      setInstitutionGroups(getMockInstitutionGroups());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (USE_MOCK) {
      // Show mock data immediately to match design
      setInstitutionGroups(getMockInstitutionGroups());
      setLoading(false);
      return;
    }
    fetchCourses();
  }, [USE_MOCK, fetchCourses]);

  const groupCoursesByCategory = (courses: CourseForStudent[]): InstitutionGroup[] => {
    const categories = [
      "Kindergarten",
      "School",
      "Intermediate",
      "Graduation",
      "Coaching Centers",
      "Study Hall",
      "Tuition Centers"
    ];

    const grouped: InstitutionGroup[] = categories.map(category => ({
      category,
      institutions: []
    }));

    // Extract unique institutions per category
    const institutionMap = new Map<string, Set<string>>();

    courses.forEach(course => {
      let category = "";
      
      // Determine category based on course data
      // We'll use the courseName or other fields to determine category
      // Since we don't have explicit type field for institution type
      if (course.courseName?.toLowerCase().includes("kindergarten") || 
          course.courseName?.toLowerCase().includes("childcare")) category = "Kindergarten";
      else if (course.courseName?.toLowerCase().includes("school")) category = "School";
      else if (course.courseName?.toLowerCase().includes("intermediate") ||
               course.courseName?.toLowerCase().includes("college")) category = "Intermediate";
      else if (course.courseName?.toLowerCase().includes("graduation") ||
               course.courseName?.toLowerCase().includes("degree") ||
               course.courseName?.toLowerCase().includes("b.tech") ||
               course.courseName?.toLowerCase().includes("engineering")) category = "Graduation";
      else if (course.courseName?.toLowerCase().includes("coaching")) category = "Coaching Centers";
      else if (course.courseName?.toLowerCase().includes("tuition")) category = "Tuition Centers";
      else if (course.courseName?.toLowerCase().includes("study hall")) category = "Study Hall";
      else category = "Other Programs"; // Default category

      if (category && course.institution) {
        if (!institutionMap.has(category)) {
          institutionMap.set(category, new Set());
        }
        
        const institutionKey = `${course.institution._id}`;
        if (!institutionMap.get(category)?.has(institutionKey)) {
          institutionMap.get(category)?.add(institutionKey);
          
          const group = grouped.find(g => g.category === category);
          if (group) {
            group.institutions.push({
              id: course.institution._id,
              name: course.institution.instituteName || "Institution",
              location: course.location || "",
              logo: course.imageUrl || ""
            });
          }
        }
      }
    });

    return grouped.filter(group => group.institutions.length > 0);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const truncateName = (name: string, maxLength: number = 11): string => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const filteredGroups = institutionGroups.map(group => ({
    ...group,
    institutions: group.institutions.filter(inst =>
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.institutions.length > 0);

  return (
    <div className={styles.pageContainer}>
      {/* Header using HomeHeader component */}
      <HomeHeader
        userName={user?.name || "Student"}
        userAvatar={(user && 'profilePicture' in user ? (user as { profilePicture?: string }).profilePicture : undefined) || 
                    (user && 'ProfilePicutre' in user ? (user as { ProfilePicutre?: string }).ProfilePicutre : undefined)}
        searchValue={searchQuery}
        onSearchChange={handleSearch}
        onNotificationClick={() => router.push("/student/notifications")}
        onProfileClick={() => router.push("/student/profile")}
        onFilterClick={() => {}}
      />

      {/* Content */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <>
            {filteredGroups.map((group) => (
              <div key={group.category} className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <h2 className={styles.categoryTitle}>{group.category}</h2>
                  <button 
                    className={styles.seeAllBtn}
                    onClick={() => toggleCategory(group.category)}
                  >
                    {expandedCategories.has(group.category) ? 'Show Less' : 'See All'}
                  </button>
                </div>
                
                <div className={styles.institutionsGrid}>
                  {(expandedCategories.has(group.category) 
                    ? group.institutions 
                    : group.institutions.slice(0, 3)
                  ).map((institution) => (
                    <div
                      key={institution.id}
                      className={styles.institutionCard}
                      onClick={() => router.push(`/student/institution/${institution.id}`)}
                    >
                      <div className={styles.institutionLogo}>
                          <Image                 
                            src={institution.logo || "https://res.cloudinary.com/daq0xtstq/image/upload/v1759253728/Gemini_Generated_Image_82dkbt82dkbt82dk_chvp3e.png"} 
                            alt={institution.name}
                            width={113}
                            height={110}
                            style={{ objectFit: 'contain' }}
                          />
                      </div>
                      <div className={styles.institutionInfo}>
                        <h3 className={styles.institutionName}>{truncateName(institution.name)}</h3>
                        <p className={styles.institutionLocation}>{institution.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <FooterNav />
    </div>
  );
};

export default ExplorePage;
