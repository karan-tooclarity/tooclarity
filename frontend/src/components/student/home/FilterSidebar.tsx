'use client';

import React from 'react';
import styles from './FilterSidebar.module.css';

interface ActiveFilters {
  instituteType?: string; // Mutually exclusive (only one can be selected)
  kindergartenLevels?: string[];
  schoolLevels?: string[];
  modes?: string[];
  ageGroup?: string[];
  programDuration?: string[];
  priceRange?: string[];
  boardType?: string[];
  // Graduation-specific filters
  graduationType?: string[];
  streamType?: string[];
  educationType?: string[];
  // Coaching-specific filters
  classSize?: string[];
  // Study Hall specific filters
  seatingType?: string[];
  operatingHours?: string[];
  duration?: string[];
  // Tuition Center specific filters
  subjects?: string[];
  // Legacy support
  institutes?: string[];
  levels?: string[];
}

interface FilterSidebarProps {
  /** Current active filters */
  activeFilters: ActiveFilters;
  /** Callback when filter is toggled */
  onFilterChange: (filterType: string, value: string, isChecked: boolean) => void;
}

// Kindergarten Specific Filters
const INSTITUTE_TYPES = [
  'Kindergarten',
  "School's",
  'Intermediate',
  'Graduation',
  'Coaching',
  "Study Hall's",
  "Tuition Center's",
  'Study Abroad',
];

// Context-specific filter configurations
const FILTER_CONFIG: Record<string, {
  levels?: string[];
  boardType?: string[];
  programDuration?: string[];
  ageGroup?: string[];
  modes?: string[];
  priceRange?: string[];
  graduationType?: string[];
  streamType?: string[];
  educationType?: string[];
  classSize?: string[];
  // Study Hall specific
  seatingType?: string[];
  operatingHours?: string[];
  duration?: string[];
  // Tuition Center specific
  subjects?: string[];
}> = {
  'Kindergarten': {
    levels: [
      'Play School',
      'Lower kindergarten',
      'Upper kindergarten',
    ],
    ageGroup: [
      '2 - 3 Yrs',
      '3 - 4 Yrs',
      '4 - 5 Yrs',
      '5 - 6 Yrs',
    ],
    boardType: ['State Board', 'CBSE'],
    programDuration: [
      'Summer Camp',
      'Academic Year',
      'Half-Day Care',
      'Full-Day Care',
    ],
    priceRange: [
      'Below ₹75,000',
      '₹75,000 - ₹1,50,000',
      '₹1,50,000 - ₹3,00,000',
      'Above ₹3,00,000',
    ],
  },
  "School's": {
    levels: [
      'Primary',
      'Secondary',
      'Senior Secondary',
    ],
    boardType: ['State Board', 'CBSE'],
    programDuration: [
      'Academic Year',
      'Semester',
    ],
    priceRange: [
      'Below ₹75,000',
      '₹75,000 - ₹1,50,000',
      '₹1,50,000 - ₹3,00,000',
      'Above ₹3,00,000',
    ],
  },
  'Intermediate': {
    levels: [
      'Science',
      'Commerce',
      'Arts',
    ],
    boardType: ['State Board', 'CBSE'],
    programDuration: [
      'Academic Year',
      'Semester',
    ],
    priceRange: [
      'Below ₹75,000',
      '₹75,000 - ₹1,50,000',
      '₹1,50,000 - ₹3,00,000',
      'Above ₹3,00,000',
    ],
  },
  'Graduation': {
    graduationType: [
      'Under Graduation',
      'Post Graduation',
    ],
    streamType: [
      'Engineering and Technology (B.E./B.Tech.)',
      'Medical Sciences',
      'Fine Arts (BFA)',
      'Arts and Humanities (B.A.)',
    ],
    educationType: [
      'Full time',
      'Part time',
      'Distance learning',
    ],
    modes: ['Offline', 'Online'],
    programDuration: [
      '2 Yrs',
      '3 Yrs',
      '4 Yrs',
    ],
    priceRange: [
      'Below ₹75,000',
      '₹75,000 - ₹1,50,000',
      '₹1,50,000 - ₹3,00,000',
      'Above ₹3,00,000',
    ],
  },
  'Coaching': {
    levels: [
      'Upskilling / Skill Development',
      'Exam Preparation',
      'Vocational Training',
    ],
    modes: ['Offline', 'Online', 'Hybrid'],
    programDuration: [
      '3 Months',
      '6 Months',
      '1 Year+',
    ],
    classSize: [
      'Small Batch (<20)',
      'Medium Batch (20-50)',
      'Large Batch',
    ],
    priceRange: [
      'Below ₹75,000',
      '₹75,000 - ₹1,50,000',
      '₹1,50,000 - ₹3,00,000',
      'Above ₹3,00,000',
    ],
  },
  "Study Hall's": {
    seatingType: [
      'Hot Desk',
      'Dedicated Desk',
      'Private Cabin / Cubicle',
    ],
    priceRange: [
      'Below ₹2,000',
      '₹2,000 - ₹3,500',
      '₹3,500 - ₹5,000',
      'Above ₹5,000',
    ],
    operatingHours: [
      '24/7 Access',
      'Day Shift',
      'Night Shift',
      'Weekends Only',
    ],
    duration: [
      'Daily Pass',
      'Weekly Pass',
      'Monthly Plan',
      'Quarterly',
    ],
  },
  "Tuition Center's": {
    subjects: [
      'All Subjects',
      'Languages',
      'English',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'MPC / BiPC',
    ],
    modes: [
      'Online',
      'Home Tuition'
    ],
    priceRange: [
      'Below ₹1,000',
      '₹1,000 - ₹2,500',
      '₹2,500 - ₹5,000',
      'Above ₹5,000',
    ],
    operatingHours: [
      'Morning',
      'Evening',
      'Weekdays',
      'Weekend tuition',
    ],
    duration: [
      'Monthly',
      'Quarterly',
      'Full Academic Year',
    ],
  },
  'Study Abroad': {
    modes: ['Offline', 'Online'],
    priceRange: [
      'Below ₹75,000',
      '₹75,000 - ₹1,50,000',
      '₹1,50,000 - ₹3,00,000',
      'Above ₹3,00,000',
    ],
  },
};

/*const MODES = ['Offline', 'Online'];

const PRICE_RANGES = [
  'Below ₹75,000',
  '₹75,000 - ₹1,50,000',
  '₹1,50,000 - ₹3,00,000',
  'Above ₹3,00,000',
];
*/
/**
 * FilterSidebar Component - Sidebar with course filters
 * Features: Multi-select pill-button filters for kindergarten courses
 * Responsive: Sticky on desktop, collapsible on mobile
 */
export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  activeFilters,
  onFilterChange,
}) => {
  const handleInstituteTypeClick = (value: string) => {
    // Mutually exclusive: clicking same option deselects it, different option replaces it
    const isCurrentlySelected = activeFilters.instituteType === value;
    if (isCurrentlySelected) {
      onFilterChange('instituteType', value, false); // Deselect
    } else {
      onFilterChange('instituteType', value, true); // Select
    }
  };

  const handleOtherFilterClick = (
    filterType: string,
    value: string
  ) => {
    const filterKey = filterType as keyof ActiveFilters;
    const currentValues = (activeFilters[filterKey] as string[]) || [];
    const isChecked = !currentValues.includes(value);
    onFilterChange(filterType, value, isChecked);
  };

  const FilterSection = ({
    title,
    filterType,
    options,
    isMutuallyExclusive = false,
  }: {
    title: string;
    filterType: keyof ActiveFilters;
    options: string[];
    isMutuallyExclusive?: boolean;
  }) => {
    const currentValue = isMutuallyExclusive
      ? activeFilters[filterType]
      : (activeFilters[filterType] as string[]) || [];
    
    return (
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <div className={styles.buttonGroup}>
          {options.map((option) => {
            const isSelected = isMutuallyExclusive
              ? currentValue === option
              : (currentValue as string[]).includes(option);

            return (
              <button
                key={option}
                className={`${styles.filterButton} ${isSelected ? styles.filterButtonActive : ''}`}
                onClick={() =>
                  isMutuallyExclusive
                    ? handleInstituteTypeClick(option)
                    : handleOtherFilterClick(String(filterType), option)
                }
                aria-pressed={isSelected}
                type="button"
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Get the filter configuration for the selected institute type
  const selectedInstituteType = activeFilters.instituteType;
  const filterConfig = selectedInstituteType
    ? FILTER_CONFIG[selectedInstituteType]
    : null;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Filters</h2>
          {/* Filter Icon SVG */}
          <svg
            className={styles.headerIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0 0-.293.707V17l-4 4v-6.586a1 1 0 0 0-.293-.707L3.293 7.293A1 1 0 0 1 3 6.586V4z" />
          </svg>
        </div>

        {/* Institute Type - Mutually Exclusive */}
        <FilterSection
          title="Institute Type"
          filterType="instituteType"
          options={INSTITUTE_TYPES}
          isMutuallyExclusive={true}
        />

        {/* Conditionally show filters based on selected institute type */}
        {filterConfig && (
          <>
            {/* Levels */}
            {filterConfig.levels && (
              <FilterSection
                title={
                  selectedInstituteType === 'Kindergarten'
                    ? 'Kindergarten Levels'
                    : selectedInstituteType === "School's"
                      ? 'School Levels'
                      : 'Levels'
                }
                filterType={
                  selectedInstituteType === 'Kindergarten'
                    ? 'kindergartenLevels'
                    : 'schoolLevels'
                }
                options={filterConfig.levels}
              />
            )}

            {/* Board Type */}
            {filterConfig.boardType && (
              <FilterSection
                title="Board type"
                filterType="boardType"
                options={filterConfig.boardType}
              />
            )}

            {/* Graduation Type */}
            {filterConfig.graduationType && (
              <FilterSection
                title="Graduation type"
                filterType="graduationType"
                options={filterConfig.graduationType}
              />
            )}

            {/* Stream Type */}
            {filterConfig.streamType && (
              <FilterSection
                title="Stream type"
                filterType="streamType"
                options={filterConfig.streamType}
              />
            )}

            {/* Education Type */}
            {filterConfig.educationType && (
              <FilterSection
                title="Education type"
                filterType="educationType"
                options={filterConfig.educationType}
              />
            )}

            {/* Program Duration */}
            {filterConfig.programDuration && (
              <FilterSection
                title="Program Duration"
                filterType="programDuration"
                options={filterConfig.programDuration}
              />
            )}

            {/* Age Group */}
            {filterConfig.ageGroup && (
              <FilterSection
                title="Age Group"
                filterType="ageGroup"
                options={filterConfig.ageGroup}
              />
            )}

            {/* Mode */}
            {filterConfig.modes && (
              <FilterSection
                title="Mode"
                filterType="modes"
                options={filterConfig.modes}
              />
            )}

            {/* Price Range */}
            {filterConfig.priceRange && (
              <FilterSection
                title="Price Range"
                filterType="priceRange"
                options={filterConfig.priceRange}
              />
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;