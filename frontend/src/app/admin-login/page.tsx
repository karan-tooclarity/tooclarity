"use client";

import LoginDialogBox from "@/components/auth/LoginDialogBox";
import SignUpDialog from "@/components/auth/SignUpDialog";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FBF9F5] p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
        <p className="text-gray-600 mb-6">Sign in to manage your institution</p>
        <div className="flex flex-col items-center gap-4">
          <LoginDialogBox
            caller="admin"
            onSuccess={() => window.location.assign("/dashboard")}
            open={true}
            onOpenChange={() => {}}
          />
          <div className="text-gray-500 text-sm">or</div>
          <SignUpDialog
            caller="admin"
            onSuccess={() => window.location.assign("/dashboard")}
          />
        </div>
      </div>
    </main>
  );
}
