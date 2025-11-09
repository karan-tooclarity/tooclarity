import React, { useState } from "react";
import { _Card, _CardContent } from "../ui/card";
import { motion, AnimatePresence } from "framer-motion";
import AppSelect from "../ui/AppSelect";

export type StatTrend = {
  value: number;
  isPositive: boolean;
};

export interface StatCardProps {
  title: string | React.ReactNode;
  value: string | number;
  trend?: StatTrend;
  isLoading?: boolean;
  onClick?: () => void;
  showFilters?: boolean;
  onFilterChange?: (filter: { course: string; timeRange: string }) => void;
}

export default function StatCard({ 
  title, 
  value, 
  trend, 
  isLoading, 
  onClick, 
  showFilters = false,
  onFilterChange 
}: StatCardProps) {
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [timeRangeFilter, setTimeRangeFilter] = useState("Weekly");

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  const loadingVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const courseOptions = ["All Courses", "Web Development", "Data Science", "UI/UX Design", "Mobile Development"];
  const timeRangeOptions = ["Daily", "Weekly", "Monthly", "Yearly"];

  const handleCourseChange = (course: string) => {
    setCourseFilter(course);
    onFilterChange?.({ course, timeRange: timeRangeFilter });
  };

  const handleTimeRangeChange = (timeRange: string) => {
    setTimeRangeFilter(timeRange);
    onFilterChange?.({ course: courseFilter, timeRange });
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer mx-1 sm:mx-3 pb-3"
      onClick={onClick}
    >
      <_Card className="border-none shadow-sm bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow duration-200">
        <_CardContent className="p-3 sm:p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 font-medium">{title}</div>
            <motion.div 
                              className="text-gray-400 dark:text-gray-300 cursor-pointer"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2 }}
            >
            </motion.div>
          </div>

          {/* Filters inside the card */}
          {showFilters && (
            <motion.div 
              className="flex gap-2 mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative flex-1">
                <AppSelect
                  value={courseFilter}
                  onChange={(v) => handleCourseChange(v)}
                  options={courseOptions}
                  variant="blue"
                  size="sm"
                  rounded="lg"
                  className="w-full"
                  stopPropagation
                />
              </div>
              <div className="relative flex-1">
                <AppSelect
                  value={timeRangeFilter}
                  onChange={(v) => handleTimeRangeChange(v)}
                  options={timeRangeOptions}
                  variant="blue"
                  size="sm"
                  rounded="lg"
                  className="w-full"
                  stopPropagation
                />
        </div>
            </motion.div>
          )}
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                variants={loadingVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex items-center justify-center h-12"
              >
                <motion.div
                  className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                variants={loadingVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div 
                  className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                >
                  {value}
                </motion.div>
        {trend && (
                  <motion.div
                    className={`text-xs font-medium flex items-center gap-1 ${
              trend.isPositive ? "text-emerald-600" : "text-rose-600"
            }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
          >
                    <motion.span
                      animate={{ 
                        y: trend.isPositive ? [-2, 0, -2] : [2, 0, 2]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity 
                      }}
                    >
                      {trend.isPositive ? "↗" : "↘"}
                    </motion.span>
            {trend.isPositive ? "+" : "-"}
                    {Math.abs(trend.value).toFixed(2)}%
                  </motion.div>
                )}
              </motion.div>
        )}
          </AnimatePresence>
      </_CardContent>
    </_Card>
    </motion.div>
  );
}
