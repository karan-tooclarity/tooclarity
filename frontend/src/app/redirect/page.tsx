"use client";

import { Suspense } from "react";
import RedirectPageContent from "../../components/RedirectComponent";

export default function RedirectPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen text-lg text-gray-600">
        Redirecting...
      </div>
    }>
      <RedirectPageContent />
    </Suspense>
  );
}
