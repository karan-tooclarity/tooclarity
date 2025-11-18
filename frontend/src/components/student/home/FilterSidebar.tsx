"use client";

import React, { useCallback, useMemo } from "react";
import styles from "./FilterSidebar.module.css";

export interface ActiveFilters {
  instituteType?: string; // Mutually exclusive (only one can be selected)
  kindergartenLevels?: string[];
  schoolLevels?: string[];
  modes?: string[];
  ageGroup?: string[];
  programDuration?: string[];
  priceRange?: string[];
  boardType?: string[];
  graduationType?: string[];
  streamType?: string[];
  educationType?: string[];
  classSize?: string[];
  seatingType?: string[];
  operatingHours?: string[];
  duration?: string[];
  subjects?: string[];
  institutes?: string[];
  levels?: string[];
}

interface FilterSidebarProps {
  activeFilters: ActiveFilters;
  onFilterChange: (
    filterType: string,
    value: string,
    isChecked: boolean
  ) => void;
  // onApplyFilters: (filters: ActiveFilters) => void;
  onApplyFilters: (filters: ActiveFilters) => void | Promise<void>;
  onClearFilters?: () => void;

}

const INSTITUTE_TYPES = [
  "Kindergarten",
  "School's",
  "Intermediate",
  "Graduation",
  "Coaching",
  "Study Hall's",
  "Tuition Center's",
  "Study Abroad",
];

const FILTER_CONFIG: Record<
  string,
  {
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
    seatingType?: string[];
    operatingHours?: string[];
    duration?: string[];
    subjects?: string[];
  }
> = {
  Kindergarten: {
    levels: ["Play School", "Lower kindergarten", "Upper kindergarten"],
    ageGroup: ["2 - 3 Yrs", "3 - 4 Yrs", "4 - 5 Yrs", "5 - 6 Yrs"],
    modes: ["Offline", "Online"],
    programDuration: [
      "Summer Camp",
      "Academic Year",
      "Half-Day Care",
      "Full-Day Care",
    ],
    priceRange: [
      "Below ₹75,000",
      "₹75,000 - ₹1,50,000",
      "₹1,50,000 - ₹3,00,000",
      "Above ₹3,00,000",
    ],
  },
  "School's": {
    levels: ["Primary", "Secondary", "Senior Secondary"],
    boardType: ["State Board", "CBSE"],
    programDuration: ["Academic Year", "Semester"],
    priceRange: [
      "Below ₹75,000",
      "₹75,000 - ₹1,50,000",
      "₹1,50,000 - ₹3,00,000",
      "Above ₹3,00,000",
    ],
  },
  Intermediate: {
    levels: ["Science", "Commerce", "Arts"],
    boardType: ["State Board", "CBSE"],
    programDuration: ["Academic Year", "Semester"],
    priceRange: [
      "Below ₹75,000",
      "₹75,000 - ₹1,50,000",
      "₹1,50,000 - ₹3,00,000",
      "Above ₹3,00,000",
    ],
  },
  Graduation: {
    graduationType: ["Under Graduation", "Post Graduation"],
    streamType: [
      "Engineering and Technology (B.E./B.Tech.)",
      "Medical Sciences",
      "Fine Arts (BFA)",
      "Arts and Humanities (B.A.)",
    ],
    educationType: ["Full time", "Part time", "Distance learning"],
    modes: ["Offline", "Online"],
    programDuration: ["2 Yrs", "3 Yrs", "4 Yrs"],
    priceRange: [
      "Below ₹75,000",
      "₹75,000 - ₹1,50,000",
      "₹1,50,000 - ₹3,00,000",
      "Above ₹3,00,000",
    ],
  },
  Coaching: {
    levels: [
      "Upskilling / Skill Development",
      "Exam Preparation",
      "Vocational Training",
    ],
    modes: ["Offline", "Online", "Hybrid"],
    programDuration: ["3 Months", "6 Months", "1 Year+"],
    classSize: ["Small Batch (<20)", "Medium Batch (20-50)", "Large Batch"],
    priceRange: [
      "Below ₹75,000",
      "₹75,000 - ₹1,50,000",
      "₹1,50,000 - ₹3,00,000",
      "Above ₹3,00,000",
    ],
  },
  "Study Hall's": {
    seatingType: ["Hot Desk", "Dedicated Desk", "Private Cabin / Cubicle"],
    priceRange: [
      "Below ₹2,000",
      "₹2,000 - ₹3,500",
      "₹3,500 - ₹5,000",
      "Above ₹5,000",
    ],
    operatingHours: [
      "24/7 Access",
      "Day Shift",
      "Night Shift",
      "Weekends Only",
    ],
    duration: ["Daily Pass", "Weekly Pass", "Monthly Plan", "Quarterly"],
  },
  "Tuition Center's": {
    subjects: [
      "All Subjects",
      "Languages",
      "English",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "MPC / BiPC",
    ],
    modes: ["Online", "Home Tuition"],
    priceRange: [
      "Below ₹1,000",
      "₹1,000 - ₹2,500",
      "₹2,500 - ₹5,000",
      "Above ₹5,000",
    ],
    operatingHours: ["Morning", "Evening", "Weekdays", "Weekend tuition"],
    duration: ["Monthly", "Quarterly", "Full Academic Year"],
  },
  "Study Abroad": {
    modes: ["Offline", "Online"],
    priceRange: [
      "Below ₹75,000",
      "₹75,000 - ₹1,50,000",
      "₹1,50,000 - ₹3,00,000",
      "Above ₹3,00,000",
    ],
  },
};

const EMPTY_ARRAY: string[] = [];

interface FilterSectionProps {
  title: string;
  filterType: keyof ActiveFilters;
  options: string[];
  isMutuallyExclusive?: boolean;
  selectedValue?: string;
  selectedValues?: string[];
  onFilterChange: (
    filterType: string,
    value: string,
    isChecked: boolean
  ) => void;
}

const areArraysEqual = (a: string[], b: string[]) => {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  const setA = new Set(a);
  for (const value of b) {
    if (!setA.has(value)) {
      return false;
    }
  }
  return true;
};

const FilterSection = React.memo(
  function FilterSection({
    title,
    filterType,
    options,
    isMutuallyExclusive = false,
    selectedValue,
    selectedValues = EMPTY_ARRAY,
    onFilterChange,
  }: FilterSectionProps) {
    const handleClick = useCallback(
      (option: string) => {
        if (isMutuallyExclusive) {
          const shouldSelect = selectedValue !== option;
          onFilterChange(String(filterType), option, shouldSelect);
        } else {
          const shouldSelect = !selectedValues.includes(option);
          onFilterChange(String(filterType), option, shouldSelect);
        }
      },
      [
        filterType,
        isMutuallyExclusive,
        selectedValue,
        selectedValues,
        onFilterChange,
      ]
    );

    return (
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <div className={styles.buttonGroup}>
          {options.map((option) => {
            const isSelected = isMutuallyExclusive
              ? selectedValue === option
              : selectedValues.includes(option);

            return (
              <button
                key={option}
                className={`${styles.filterButton} ${
                  isSelected ? styles.filterButtonActive : ""
                }`}
                onClick={() => handleClick(option)}
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
  },
  (prev, next) => {
    if (prev.title !== next.title) {
      return false;
    }
    if (prev.filterType !== next.filterType) {
      return false;
    }
    if (prev.isMutuallyExclusive !== next.isMutuallyExclusive) {
      return false;
    }
    if (prev.options !== next.options) {
      return false;
    }
    if (prev.onFilterChange !== next.onFilterChange) {
      return false;
    }
    if (prev.isMutuallyExclusive) {
      return prev.selectedValue === next.selectedValue;
    }
    const prevValues = prev.selectedValues ?? EMPTY_ARRAY;
    const nextValues = next.selectedValues ?? EMPTY_ARRAY;
    return areArraysEqual(prevValues, nextValues);
  }
);

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  activeFilters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
}) => {
  const selectedInstituteType = activeFilters.instituteType;
  const filterConfig = useMemo(
    () =>
      selectedInstituteType
        ? FILTER_CONFIG[selectedInstituteType] ?? null
        : null,
    [selectedInstituteType]
  );

  const getSelectedValues = useCallback(
    (key: keyof ActiveFilters): string[] => {
      const value = activeFilters[key];
      return Array.isArray(value) ? value : EMPTY_ARRAY;
    },
    [activeFilters]
  );

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    if (activeFilters.instituteType) return true;
    const arrayKeys: (keyof ActiveFilters)[] = [
      'kindergartenLevels', 'schoolLevels', 'modes', 'ageGroup', 'programDuration',
      'priceRange', 'boardType', 'graduationType', 'streamType', 'levels',
      'classSize', 'seatingType', 'operatingHours', 'duration', 'subjects', 'educationType'
    ];
    return arrayKeys.some(key => {
      const value = activeFilters[key];
      return Array.isArray(value) && value.length > 0;
    });
  }, [activeFilters]);

  // Check if on smaller screens
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Check if filterInstitutionCoursesOpened (when API filters are applied)
  const [filterInstitutionCoursesOpened, setFilterInstitutionCoursesOpened] = React.useState(false);

  // For now, we'll assume this is set when onApplyFilters is called with actual filters
  // This could be passed as a prop or determined by checking if filtered results differ from original

  // Determine if buttons should be shown
  const shouldShowButtons = hasActiveFilters && !isSmallScreen && !filterInstitutionCoursesOpened;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.content}>
        {shouldShowButtons && (
          <div className="flex gap-2">
            <button
              type="button"
              className={styles.applyButton}
              onClick={() => {
                onClearFilters?.();
                setFilterInstitutionCoursesOpened(false);
              }}
            >
              Clear Filters
            </button>
            <button
              type="button"
              className={styles.applyButton}
              onClick={() => {
                onApplyFilters?.(activeFilters);
                setFilterInstitutionCoursesOpened(true);
              }}
            >
              Apply Filters
            </button>
          </div>
        )}
        <FilterSection
          title="Institute Type"
          filterType="instituteType"
          options={INSTITUTE_TYPES}
          isMutuallyExclusive={true}
          selectedValue={selectedInstituteType}
          onFilterChange={onFilterChange}
        />

        {filterConfig && (
          <>
            {filterConfig.levels && (
              <FilterSection
                title={
                  selectedInstituteType === "Kindergarten"
                    ? "Kindergarten Levels"
                    : selectedInstituteType === "School's"
                    ? "School Levels"
                    : "Levels"
                }
                filterType={
                  selectedInstituteType === "Kindergarten"
                    ? "kindergartenLevels"
                    : "schoolLevels"
                }
                options={filterConfig.levels}
                selectedValues={
                  selectedInstituteType === "Kindergarten"
                    ? getSelectedValues("kindergartenLevels")
                    : getSelectedValues("schoolLevels")
                }
                onFilterChange={onFilterChange}
              />
            )}

            {filterConfig.modes && (
              <FilterSection
                title="Mode"
                filterType="modes"
                options={filterConfig.modes}
                selectedValues={getSelectedValues("modes")}
                onFilterChange={onFilterChange}
              />
            )}

            {filterConfig.boardType && (
              <FilterSection
                title="Board type"
                filterType="boardType"
                options={filterConfig.boardType}
                selectedValues={getSelectedValues("boardType")}
                onFilterChange={onFilterChange}
              />
            )}

            {filterConfig.graduationType && (
              <FilterSection
                title="Graduation type"
                filterType="graduationType"
                options={filterConfig.graduationType}
                selectedValues={getSelectedValues("graduationType")}
                onFilterChange={onFilterChange}
              />
            )}

            {filterConfig.streamType && (
              <FilterSection
                title="Stream type"
                filterType="streamType"
                options={filterConfig.streamType}
                selectedValues={getSelectedValues("streamType")}
                onFilterChange={onFilterChange}
              />
            )}

            {filterConfig.educationType && (
              <FilterSection
                title="Education type"
                filterType="educationType"
                options={filterConfig.educationType}
                selectedValues={getSelectedValues("educationType")}
                onFilterChange={onFilterChange}
              />
            )}

            {filterConfig.programDuration && (
              <FilterSection
                title="Program Duration"
                filterType="programDuration"
                options={filterConfig.programDuration}
                selectedValues={getSelectedValues("programDuration")}
                onFilterChange={onFilterChange}
              />
            )}

            {filterConfig.ageGroup && (
              <FilterSection
                title="Age Group"
                filterType="ageGroup"
                options={filterConfig.ageGroup}
                selectedValues={getSelectedValues("ageGroup")}
                onFilterChange={onFilterChange}
              />
            )}

            {filterConfig.seatingType && (
              <FilterSection
                title="Seating type"
                filterType="seatingType"
                options={filterConfig.seatingType}
                selectedValues={getSelectedValues("seatingType")}
                onFilterChange={onFilterChange}
              />
            )}

            {filterConfig.priceRange && (
              <FilterSection
                title="Price Range"
                filterType="priceRange"
                options={filterConfig.priceRange}
                selectedValues={getSelectedValues("priceRange")}
                onFilterChange={onFilterChange}
              />
            )}

            {filterConfig.operatingHours && (
              <FilterSection
                title="Operating Hours"
                filterType="operatingHours"
                options={filterConfig.operatingHours}
                selectedValues={getSelectedValues("operatingHours")}
                onFilterChange={onFilterChange}
              />
            )}

            {filterConfig.duration && (
              <FilterSection
                title="Duration"
                filterType="duration"
                options={filterConfig.duration}
                selectedValues={getSelectedValues("duration")}
                onFilterChange={onFilterChange}
              />
            )}

            {filterConfig.subjects && (
              <FilterSection
                title="Subjects"
                filterType="subjects"
                options={filterConfig.subjects}
                selectedValues={getSelectedValues("subjects")}
                onFilterChange={onFilterChange}
              />
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;
