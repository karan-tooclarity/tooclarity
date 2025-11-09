"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

export default function RedirectPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const to = searchParams.get("to");
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const reason = searchParams.get("reason");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (status === "success") {
        if (type === "login")
          toast.success("Login successful! Welcome to TooClarity 🎉");
        else if (type === "register")
          toast.success("Account created successfully! 🎊");
      } else if (status === "fail") {
        if (reason === "not_registered")
          toast.error("No account found. Please register first.");
        else if (reason === "wrong_user_type")
          toast.error("Account type mismatch. Please use the correct login.");
        else if (reason === "already_registered")
          toast.error("Account already registered. Try logging in.");
        else toast.error("Something went wrong. Please try again.");
      }

      if (to) router.push(to);
      else router.replace("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [to, status, type, reason, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-center overflow-hidden">
      <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-gradient-move animate-float">
        TooClarity
      </h1>

      <style jsx global>{`
        @keyframes gradient-move {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 3s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fade-up 1s ease forwards;
        }
      `}</style>
    </div>
  );
}
