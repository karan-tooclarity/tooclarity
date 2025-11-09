"use client";

import React, { useState } from 'react';
import { CoursePage as GenericCoursePage } from './CoursePage';
import { Kindergarten } from '../coursePage/Kindergarten';
import { School } from '../coursePage/School';
import { Intermediate } from '../coursePage/Intermediate';
import { UG_PG } from '../coursePage/UG_PG';
import { CoachingCenter } from '../coursePage/CoachingCenter';
import { StudyHall } from '../coursePage/StudyHall';
import { ExamPreparation } from '../coursePage/ExamPreparation';
import { StudyAbroad } from '../coursePage/StudyAbroad';
import { TuitionCentre } from '../coursePage/TuitionCentre';
import ScheduleCallbackDialog, { CallbackFormData } from './ScheduleCallbackDialog';
import BookDemoDialog, { BookDemoFormData } from './BookDemoDialog';

interface BaseCourse {
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
}

export interface InstituteCoursePageProps {
  course: BaseCourse;
  instituteType?: string; // Raw institute type label from API or filters
  onBack?: () => void;
  onRequestCall?: () => void;
  onBookDemo?: () => void;
}

// Normalization helper to map potential variations to component keys
function normalizeType(raw?: string): string {
  if (!raw) return '';
  const cleaned = raw.trim().toLowerCase();
  if (cleaned === "school's" || cleaned === 'school' || cleaned === 'schools') return 'School';
  if (cleaned === 'ug_pg' || cleaned === 'ug-pg' || cleaned === 'graduation' || cleaned === 'under graduation' || cleaned === 'post graduation') return 'UG_PG';
  if (cleaned === 'coaching' || cleaned === 'coaching center' || cleaned === 'coachingcentre') return 'CoachingCenter';
  if (cleaned === 'study hall' || cleaned === 'studyhalls' || cleaned === 'study_hall') return 'StudyHall';
  if (cleaned === 'exam' || cleaned === 'exam preparation' || cleaned === 'exampreparation') return 'ExamPreparation';
  if (cleaned === 'study abroad' || cleaned === 'studyabroad' || cleaned === 'abroad') return 'StudyAbroad';
  if (cleaned === 'tuition centre' || cleaned === 'tuition center' || cleaned === 'tuition') return 'TuitionCentre';
  if (cleaned === 'intermediate') return 'Intermediate';
  if (cleaned === 'kindergarten') return 'Kindergarten';
  return ''; // Unknown -> fallback generic
}

interface CourseComponentProps {
  course: BaseCourse;
  onRequestCall: () => void;
  onBookDemo: () => void;
  onBack?: () => void;
}

const componentMap: Record<string, React.FC<CourseComponentProps>> = {
  Kindergarten,
  School,
  Intermediate,
  UG_PG,
  CoachingCenter,
  StudyHall,
  ExamPreparation,
  StudyAbroad,
  TuitionCentre,
};

export const InstituteCoursePage: React.FC<InstituteCoursePageProps> = ({
  course,
  instituteType,
  onBack,
  onRequestCall,
  onBookDemo,
}) => {
  const [isCallbackDialogOpen, setIsCallbackDialogOpen] = useState(false);
  const [isBookDemoDialogOpen, setIsBookDemoDialogOpen] = useState(false);

  const handleRequestCall = () => {
    setIsCallbackDialogOpen(true);
  };

  const handleBookDemo = () => {
    setIsBookDemoDialogOpen(true);
  };

  const handleCallbackSubmit = async (data: CallbackFormData) => {
    try {
      // TODO: Add API call to submit callback request
      console.log('Callback request submitted:', data);
      
      // Call the original onRequestCall if provided
      if (onRequestCall) {
        onRequestCall();
      }
      
      // You can add toast notification here
      // toast.success('Callback request submitted successfully!');
    } catch (error) {
      console.error('Error submitting callback request:', error);
      // toast.error('Failed to submit callback request');
    }
  };

  const handleDemoSubmit = async (data: BookDemoFormData) => {
    try {
      // TODO: Add API call to submit demo booking
      console.log('Demo booking submitted:', data);
      
      // Call the original onBookDemo if provided
      if (onBookDemo) {
        onBookDemo();
      }
      
      // You can add toast notification here
      // toast.success('Demo booked successfully!');
    } catch (error) {
      console.error('Error submitting demo booking:', error);
      // toast.error('Failed to book demo');
    }
  };

  const key = normalizeType(instituteType) || 'StudyHall'; // Default for now
  const Component = componentMap[key] || GenericCoursePage;

  return (
    <>
      <Component
        course={course}
        onBack={onBack}
        onRequestCall={handleRequestCall}
        onBookDemo={handleBookDemo}
      />
      <ScheduleCallbackDialog
        open={isCallbackDialogOpen}
        onOpenChange={setIsCallbackDialogOpen}
        onSubmit={handleCallbackSubmit}
      />
      <BookDemoDialog
        open={isBookDemoDialogOpen}
        onOpenChange={setIsBookDemoDialogOpen}
        onSubmit={handleDemoSubmit}
      />
    </>
  );
};

export default InstituteCoursePage;