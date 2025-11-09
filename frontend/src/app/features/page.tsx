"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import SignUpDialog from "@/components/auth/SignUpDialog";
import LoginDialogBox from "@/components/auth/LoginDialogBox";
// import { useAuth } from "@/lib/auth-context";

// NOTE: Please adjust the import paths for these components to match your project structure.
import StaticDashboardCard from "@/components/LandingPage/DashboardCard";
import StaticLeadsManagementCard from "@/components/LandingPage/LeadManagementCard";
import AnalyticsDashboardCard from "@/components/LandingPage/DataInsightsCard";
import ListedProgramsCard from "@/components/LandingPage/BillingListingCard";
import SettingsDashboardCard from "@/components/LandingPage/SettingsCard";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/footer";

/* -------------------------------- data ---------------------------------- */
const features = [
  {
    id: 1,
    title: "Dashboard",
    label: "Get your daily performance snapshot",
    description:
      "Your dashboard is the first thing you'll see, giving you an instant overview of what's new and important. Track your key metrics and see new inquiries the moment you log in.",
    steps: [
      "At the top, find your Key Metric Cards to see real-time views and leads.",
      "Check the Recent Inquiries list for your latest messages.",
      "Glance at the Performance Chart to spot trends over the last week.",
    ],
    component: <StaticDashboardCard />,
    badge: "DASHBOARD",
  },
  {
    id: 2,
    title: "Lead Management",
    label: "Turn interest into enrollment.",
    description:
      "A new inquiry is more than just data—it's a potential student. Our simple CRM is designed to help you build that relationship, from their first question to their first day on campus.",
    steps: [
      "Go to the Customers (CRM) page from the side navigation.",
      "See all your student inquiries in one organized list.",
      "Click any student to see their full details and the specific course interest.",
      "Use the Status dropdown to select the program, so you always know your next step.",
    ],
    component: <StaticLeadsManagementCard />,
    badge: "LEAD MANAGEMENT",
  },
  {
    id: 3,
    title: "Data & Insights",
    label: "Make smarter, data-driven decisions.",
    description:
      "Stop guessing what works. Your analytics page tells you the story behind your numbers, so you can understand which programs are successful and what students are most interested in.",
    steps: [
      "Navigate to the Analytics page.",
      "Use the Data Range filter to select your desired period.",
      "Review the Course Performance table to identify your top programs.",
      "Use the View & Lead Trends chart to see how profile views correlate with new leads.",
    ],
    component: <AnalyticsDashboardCard />,
    badge: "DATA & INSIGHTS",
  },
  {
    id: 4,
    title: "Billing & Listings",
    label: "Manage your account with clarity.",
    description:
      "Our simple pay-per-listing model means no complex recurring fees. This page gives you a clear overview of all your active listings, their expiry dates, and your complete payment history.",
    steps: [
      "Navigate to the Subscription page from the side menu.",
      "Check the 'My Program Listings' widget for active listings.",
      "Review the Billing History table to see all past transactions.",
      "Click the Download icon to save invoices as PDFs.",
    ],
    component: <ListedProgramsCard />,
    badge: "BILLING & LISTINGS",
  },
  {
    id: 5,
    title: "Profile Management",
    label: "Keep your institute profile fresh.",
    description:
      "Your offerings and details can change. Our simple editor lets you update your profile, add new courses, or upload a new brochure in just a few clicks.",
    steps: [
      "Go to the Settings page and select the Edit Course tab.",
      "Choose the course you want to update from the list.",
      "Make your changes in the form and click Save to publish instantly.",
    ],
    component: <SettingsDashboardCard />,
    badge: "PROFILE MANAGEMENT",
  },
] as const;


/* ---------------------------- FeaturesPage ------------------------------ */
const FeaturesPage = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
    <Header />
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <section className="max-w-7xl mx-auto px-6 py-16 space-y-24">
          {features.map((feature, index) => {
            const isReversed = index % 2 !== 0;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-10",
                  isReversed && "md:flex-row-reverse"
                )}
              >
                {/* <div className="flex items-center w-full h-full bg-gray-50 overflow-hidden"> */}
  <div className="w-full max-w-[525px] aspect-[525/355.83] rounded-[10px] bg-[#EBEEFF] relative overflow-hidden mt-20 sm:mt-24 lg:mt-28">
    <div className="scale-[0.9] origin-top w-full h-full">
      <div className="absolute inset-[4%] rounded-[6.67px] bg-white pointer-events-none">
        {feature.component}
      </div>
    </div>




            </div>

                <div className="w-full md:w-1/2 space-y-4">
                  <Badge className="bg-blue-800 text-white px-[10px] py-[10px] gap-[10px] rounded-[12px] opacity-100 ">
                    
                    {feature.badge}
                  </Badge>
                  <h3
                    className="mb-2 text-gray-900"
                    style={{
                      fontFamily:
                        "Sora, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
                      fontWeight: 600,
                      fontSize: "24px",
                      lineHeight: "100%",
                      letterSpacing: "0",
                    }}
                  >
                    {feature.label}
                  </h3>
                  <p
                    style={{
                      fontFamily:
                        "Montserrat, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
                      fontWeight: 500,
                      fontSize: "16px",
                      lineHeight: "150%",
                      letterSpacing: "0",
                      color: "rgba(75,85,99,1)",
                    }}
                  >
                    {feature.description}
                  </p>
                  <ul className="list-decimal list-inside space-y-2 text-gray-700 mt-2">
                    {feature.steps.map((s, si) => (
                      <li key={si} className="text-sm">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* CTA Section */}
        <div className="bg-gray-100 py-20">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              It only takes a few minutes to create your profile and start
              connecting with students who are actively searching for you.
            </p>
            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              onClick={() => setIsSignUpOpen(true)}
            >
              Sign up for free
            </button>
          </div>
        </div>
      </div>

     <Footer />
     <SignUpDialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen} caller="institution" />
    <LoginDialogBox open={isLoginOpen} onOpenChange={setIsLoginOpen} caller="institution"/>

    </>
  );
};

export default FeaturesPage;