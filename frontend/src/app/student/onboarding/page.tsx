"use client";

import React, { useEffect } from "react";
import StudentOnboarding from "@/components/student/StudentOnboarding";
import { useAuth } from "@/lib/auth-context";
import { useUserStore } from "@/lib/user-store";
import { useRouter } from "next/navigation";

const StudentSignupPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const previousUrl = document.referrer || "/student/login"; // fallback to home if no referrer

    // 1️⃣ If user is not authenticated — redirect back
    if (!isAuthenticated) {
      router.replace(previousUrl);
      return;
    }

    // 2️⃣ Wait for user data to load
    if (!user) return;

    // 3️⃣ If role is not STUDENT — redirect back
    if (user.role !== "STUDENT") {
      router.replace(previousUrl);
      return;
    }

    // 4️⃣ If student and already completed profile — go to dashboard
    if (user.isProfileCompleted) {
      router.replace("/dashboard");
      return;
    }
  }, [isAuthenticated, user, router]);

  return <StudentOnboarding />;
};

export default StudentSignupPage;
