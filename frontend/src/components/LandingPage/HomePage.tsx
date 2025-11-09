"use client";
import { ArrowRight } from "lucide-react";
import SignUpDialog from "@/components/auth/SignUpDialog";
import LoginDialogBox from "@/components/auth/LoginDialogBox";
import OtpDialogBox  from "@/components/auth/OtpDialogBox";
import StaticDashboardCard from "@/components/LandingPage/DashboardCard";
import StaticLeadsManagementCard from "@/components/LandingPage/LeadManagementCard";
import AnalyticsDashboardCard from "@/components/LandingPage/DataInsightsCard";
import ListedProgramsCard from "@/components/LandingPage/BillingListingCard";
import SettingsDashboardCard from "@/components/LandingPage/SettingsCard";
import { CardStack } from "@/components/ui/card-stack";
import ScrollingBoxContainer from "@/components/ui/ScrollingBoxContainers";
import { useRouter } from "next/navigation";
import FAQ from "./FAQ";
import DummyDashboard from "@/components/LandingPage/DummyDashboard";
import React, { useState, useEffect } from "react";



// Home Page Component

const HomePage = () => {
  const router = useRouter();
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  const leftBoxes = [
    { id: 1, component: <StaticDashboardCard /> },
    { id: 2, component: <StaticLeadsManagementCard /> },
    { id: 3, component: <AnalyticsDashboardCard /> },
    { id: 4, component: <SettingsDashboardCard /> },
  ];

  const rightBoxes = [
    { id: 5, component: <ListedProgramsCard /> },
    { id: 6, component: <SettingsDashboardCard /> },
    { id: 7, component: <AnalyticsDashboardCard /> },
    { id: 8, component: <StaticLeadsManagementCard /> },
  ];

  const _CARD_WIDTH = 1279.56;
const _CARD_HEIGHT = 958;


  useEffect(() => {
    function handleResize() {
      // Removed scale logic since scale variable was unused
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignUpSuccess = (email: string) => {
    // Close signup _Dialog
    setIsSignUpOpen(false);

    // Store email for OTP verification
    setOtpEmail(email);

    // Small delay to ensure clean modal transition
    setTimeout(() => setIsOtpOpen(true), 150);
  };

  const handleOtpVerified = () => {
    setIsOtpOpen(false);
    // Optional: show toast, navigate, or refresh user here
    console.log("✅ OTP verified successfully");
  };


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Promo Banner */}
      <div className="bg-blue-50 py-2 px-4 flex items-center justify-center relative mb-2">
        <p className="text-gray-700 mb-2">
          First two months listing free{" "}
          <button
            className="text-blue-600 hover:underline font-semibold mb-2"
            onClick={() => setIsSignUpOpen(true)}
          >
            Get started →
          </button>
        </p>
      </div>


      {/* Hero Section */}
      <section className="py-20 px-4 mb-2"
  style={{
    background: `
      radial-gradient(circle at top left, rgba(92, 117, 255, 0.9) 0%, rgba(243, 244, 249, 1) 40%, transparent 70%),
      radial-gradient(circle at top right, rgba(92, 116, 250, 0.9) 0%, rgba(244, 245, 250, 0.98) 40%, transparent 70%),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.99) 60%, rgba(255,255,255,1) 100%)
    `,
  }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="font-sora font-semibold text-[40px] leading-[100%] tracking-[0] text-center text-[#060B13]   p-4 rounded-lg mb-2"
          >
            Unlock Your Institution&apos;s
          </h1>
          <h1
            className="font-sora font-semibold text-[40px] leading-[100%] tracking-[0] text-center text-[#060B13]  p-4 rounded-lg"
          >
            Global Reach
          </h1>

          <div className="font-montserrat font-medium text-[20px] leading-[100%] tracking-[0] text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            <p>Connect directly with students actively seeking quality</p>
            <br/>
            
            <p>
             education with a verified marketplace.
             </p>
          </div>

       <div className="flex flex-col cursor-pointer sm:flex-row justify-center gap-6 sm:gap-6 w-full sm:w-[424px] mx-auto mb-4">
  {/* Sign Up Button */}
  <button
    className="w-full cursor-pointer sm:w-[200px] h-12 bg-[#0222D7] text-white font-semibold text-base rounded-[12px] flex items-center justify-center transition-colors hover:bg-blue-800"
    onClick={() => setIsSignUpOpen(true)}
  >
    Sign up for free
  </button>

  {/* Contact Sales Button */}
  <button
    className="w-full cursor-pointer sm:w-[200px] h-12 bg-white text-gray-700 font-medium text-base rounded-[12px] border border-[#808897] flex items-center justify-center transition-colors hover:bg-gray-50"
  >
    Contact sales
  </button>
</div>


        </div>
      </section>

      {/* Card Stacks - Responsive */}
{/* Card Stacks */}
<div className="flex justify-center items-start p-4 bg-gray-100">
  <div
    className="
      w-full max-w-[393px] sm:max-w-[90%]
      h-[294px] sm:h-[95vh]
      rounded-2xl shadow-lg
      rotate-0 opacity-100
    "
  >
    <CardStack
      items={[
        {
          id: 1,
          name: "",
          designation: "",
          content: (
            <div className="h-full w-full flex items-center justify-center overflow-hidden">
              <DummyDashboard />
            </div>
          ),
        },
        {
          id: 2,
          name: "",
          designation: "",
          content: <div className="h-full w-full"></div>,
        },
        {
          id: 3,
          name: "",
          designation: "",
          content: <div className="h-full w-full"></div>,
        },
      ]}
      containerHeight="100%"
      containerWidth="100%"
      offset={10}
      scaleFactor={0.04}
      autoFlip={false}
    />
  </div>
</div>
      <section className="py-20 px-4 bg-gray-100">
      {/* <div className="min-h-screen bg-white py-16"> */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h1 className="text-5xl font-bold text-black mb-6 tracking-tight">
              Getting Started is Easy
            </h1>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
              Create your profile in minutes to reach thousands
              <br />
              of actively searching students. Here&apos;s how.
            </p>
          </div>
          
          {/* Desktop Layout - Absolute Positioning */}
          <div className="hidden bg-gray-100 lg:block relative max-w-6xl mx-auto">
            {/* Step 1 - Create Your Listing (Top Left) */}
            <div className="absolute left-0 top-0 w-80">
              <div className="bg-gradient-to-br from-pink-200 via-pink-250 to-pink-300 rounded-3xl p-8 h-72 relative">
                <div className="flex items-center justify-center mb-12">
                  <div className="w-4 h-4 bg-pink-600 rounded-full"></div>
                  <div className="w-16 h-0.5 bg-pink-400 mx-2"></div>
                  <div className="w-4 h-4 bg-pink-400 rounded-full border-2 border-white"></div>
                  <div className="w-16 h-0.5 bg-pink-300 mx-2"></div>
                  <div className="w-4 h-4 bg-pink-300 rounded-full border-2 border-white"></div>
                </div>
                <div className="text-left">
                  <h2 className="text-3xl font-bold text-black mb-4 leading-tight">
                    Create Your
                    <br />
                    Listing
                  </h2>
                  <p className="text-lg text-gray-700 font-medium">
                    Showcase your programs with
                    <br />
                    details.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 2 - Reach Qualified Students (Center) */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-16 w-80">
              <div className="bg-gradient-to-br from-purple-200 via-purple-250 to-purple-300 rounded-3xl p-8 h-72 relative">
                <div className="flex items-center justify-center mb-12">
                  <div className="w-4 h-4 bg-purple-300 rounded-full border-2 border-white"></div>
                  <div className="w-16 h-0.5 bg-purple-500 mx-2"></div>
                  <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                  <div className="w-16 h-0.5 bg-purple-400 mx-2"></div>
                  <div className="w-4 h-4 bg-purple-300 rounded-full border-2 border-white"></div>
                </div>
                <div className="text-left">
                  <h2 className="text-3xl font-bold text-black mb-4 leading-tight">
                    Reach Qualified
                    <br />
                    Students
                  </h2>
                  <p className="text-sm text-gray-700 font-medium">
                    Receive inquiries, view analytics,
                    <br />
                    and track your performance.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 3 - Manage Your Dashboard (Top Right) */}
            <div className="absolute right-0 top-8 w-80">
              <div className="bg-gradient-to-br from-blue-200 via-blue-250 to-blue-300 rounded-3xl p-8 h-72 relative">
                <div className="flex items-center justify-center mb-12">
                  <div className="w-4 h-4 bg-blue-300 rounded-full border-2 border-white"></div>
                  <div className="w-16 h-0.5 bg-blue-500 mx-2"></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-16 h-0.5 bg-blue-600 mx-2"></div>
                  <div className="w-4 h-4 bg-blue-700 rounded-full"></div>
                </div>
                <div className="text-left">
                  <h2 className="text-3xl font-bold text-black mb-4 leading-tight">
                    Manage Your
                    <br />
                    Dashboard
                  </h2>
                  <p className="text-sm text-gray-700 font-medium">
                    Your profile gets shown Your
                    <br />
                    profile gets shown searching for you.
                  </p>
                </div>
              </div>
            </div>
            <div className="h-96"></div>
          </div>

          {/* Mobile/Tablet Layout - Stacked Cards */}
          <div className="lg:hidden flex flex-col items-center gap-8 max-w-md mx-auto">
            {/* Step 1 - Create Your Listing */}
<div className="w-full">
  <div className="bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 rounded-2xl sm:rounded-3xl p-4 sm:p-8 h-auto">
    <div className="flex items-center justify-center mb-6 sm:mb-12">
      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-pink-600 rounded-full"></div>
      <div className="w-10 sm:w-16 h-0.5 bg-pink-400 mx-2"></div>
      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-pink-400 rounded-full border-2 border-white"></div>
      <div className="w-10 sm:w-16 h-0.5 bg-pink-300 mx-2"></div>
      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-pink-300 rounded-full border-2 border-white"></div>
    </div>
    <div className="text-left">
      <h2 className="text-xl sm:text-3xl font-bold text-black mb-3 sm:mb-4 leading-tight">
        Create Your 
        <br className="hidden sm:block" />
        <br /> Listing
      </h2>
      <p className="text-xs sm:text-lg text-gray-700 font-medium">
        Showcase your programs with 
        <br className="hidden sm:block" /> 
        <br />details.
      </p>
    </div>
  </div>
</div>

            
            {/* Step 2 - Reach Qualified Students */}
<div className="w-full">
  <div className="bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 rounded-2xl sm:rounded-3xl p-4 sm:p-8 h-auto">
    <div className="flex items-center justify-center mb-6 sm:mb-12">
      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-300 rounded-full border-2 border-white"></div>
      <div className="w-10 sm:w-16 h-0.5 bg-purple-500 mx-2"></div>
      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-600 rounded-full"></div>
      <div className="w-10 sm:w-16 h-0.5 bg-purple-400 mx-2"></div>
      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-300 rounded-full border-2 border-white"></div>
    </div>
    <div className="text-left">
      <h2 className="text-xl sm:text-3xl font-bold text-black mb-3 sm:mb-4 leading-tight">
        Reach Qualified <br className="hidden sm:block" /> Students
      </h2>
      <p className="text-xs sm:text-sm text-gray-700 font-medium">
        Receive inquiries, view analytics, <br className="hidden sm:block" />
        and track your performance.
      </p>
    </div>
  </div>
</div>

{/* Step 3 - Manage Your Dashboard */}
<div className="w-full mt-4 sm:mt-0">
  <div className="bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 rounded-2xl sm:rounded-3xl p-4 sm:p-8 h-auto">
    <div className="flex items-center justify-center mb-6 sm:mb-12">
      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-300 rounded-full border-2 border-white"></div>
      <div className="w-10 sm:w-16 h-0.5 bg-blue-500 mx-2"></div>
      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full border-2 border-white"></div>
      <div className="w-10 sm:w-16 h-0.5 bg-blue-600 mx-2"></div>
      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-700 rounded-full"></div>
    </div>
    <div className="text-left">
      <h2 className="text-xl sm:text-3xl font-bold text-black mb-3 sm:mb-4 leading-tight">
        Manage Your <br className="hidden sm:block" /> Dashboard
      </h2>
      <p className="text-xs sm:text-sm text-gray-700 font-medium">
        Your profile gets shown <br className="hidden sm:block" />
        when students search for you.
      </p>
    </div>
  </div>
</div>

        </div>
        <style jsx>{`
          .via-pink-250 {
            --tw-gradient-via: rgb(251 207 232);
          }
          .via-purple-250 {
            --tw-gradient-via: rgb(233 213 255);
          }
          .via-blue-250 {
            --tw-gradient-via: rgb(191 219 254);
          }
        `}</style>
      </div>
    </section>
      {/* Features Section with Scrolling Boxes */}
<section className="py-20 px-4 bg-gray-100">
  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      
      {/* Left Content */}
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          The clear path to better admissions.
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Packed with tools to grow your reach without increasing your costs,
          all focused on quality leads.
        </p>
        <button
  onClick={() => router.push("/features")}
  className="inline-flex cursor-pointer items-center justify-center gap-2 w-[216px] h-[40px] px-4 py-2 border border-gray-300 rounded-[24px] text-gray-700 font-medium text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors"
>
  Show all features <ArrowRight className="h-4 w-4" />
</button>

            </div>

            {/* Scrolling Columns */}
            <div className="grid grid-cols-2 gap-6 overflow-hidden">
              <ScrollingBoxContainer direction="up" boxes={leftBoxes} />
              <ScrollingBoxContainer direction="down" boxes={rightBoxes} />
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="bg-gray-100">
        <FAQ />
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-100">
        <div
          className="mx-auto bg-white shadow-lg rounded-[12px] flex flex-col items-center text-center"
          style={{
            maxWidth: "1122px",
            minHeight: "296px",
            padding: "24px 24px 50px 24px",
            gap: "42px",
            opacity: 1,
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Your future students are searching.
            <br />
            Will they find you?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            Don&apos;t miss out on connecting with the next generation of talent.
            Create your listing on Too Clarity today
          </p>

          <button
            className="w-[176px] h-[48px] bg-[#0222D7] hover:cursor-pointer text-white font-semibold text-[16px] rounded-[12px] flex items-center justify-center transition-colors hover:bg-blue-800"
            onClick={() => setIsSignUpOpen(true)}
          >
            Sign up for free
          </button>
        </div>
      </section>
      {/* Render Dialogs at the top level (not inside button!) */}
      {isSignUpOpen && <SignUpDialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen} onSuccess={handleSignUpSuccess} caller="institution" />}
      {isLoginOpen && <LoginDialogBox open={isLoginOpen} onOpenChange={setIsLoginOpen} caller="institution"/>}
      {isOtpOpen && ( <OtpDialogBox open={isOtpOpen} setOpen={setIsOtpOpen} email={otpEmail} onVerificationSuccess={handleOtpVerified}/>)}

    </div>  
  );
};

export default HomePage;