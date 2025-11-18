"use client";

import { DashboardCourse } from "@/lib/students-api";
import Wishlist from "../../../components/student/wishlist/wishlist";

export default function WishlistPage() {
  const courses: DashboardCourse[] = [];

  return <Wishlist courses={courses} />;
}
