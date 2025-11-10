"use client";

import Link from "next/link";
import React from "react";
import SuccessBadge from "@/components/LandingPage/SuccessBadge";


const ThankYouPage = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">Thank You!</h1>
      <SuccessBadge />
      
      <p className="text-gray-700 text-lg mb-6 max-w-md">
        Your message has been successfully submitted. We’ll get back to you soon.
      </p>
      <Link
        href="/"
        className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to Home
      </Link>
    </main>
  );
};

export default ThankYouPage;
