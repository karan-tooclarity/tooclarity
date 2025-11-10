"use client";

import React, { useState } from "react";
import { _Card, _CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StreamsSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("After 10th");
  // const carouselRef = useRef<HTMLDivElement | null>(null);

  const streamData: Record<
    string,
    { title: string; desc: string }[]
  > = {
    "After 10th": [
      {
        title: "Start Your Journey In MPC",
        desc: "Engineering, Architecture, or Pure Sciences — your tech path begins here.",
      },
      {
        title: "Build Your Future With BiPC",
        desc: "Explore Medical, Pharmacy, or Life Sciences with strong foundations.",
      },
      {
        title: "Grow In Business With MEC",
        desc: "Step into careers in CA, Business, or Economics with confidence.",
      },
      {
        title: "Think Creatively With CEC",
        desc: "Shape your future in Arts, Law, or Journalism with clarity.",
      },
    ],
    "After 12th": [
      {
        title: "Engineering & Technology",
        desc: "Explore pathways in various engineering fields.",
      },
      {
        title: "Medical & Sciences",
        desc: "Discover careers in medicine and allied health.",
      },
      {
        title: "Business & Management",
        desc: "Learn about careers in finance, marketing, and more.",
      },
      {
        title: "Arts & Humanities",
        desc: "Explore creative and analytical fields.",
      },
    ],
    "Exam Preparation": [
      {
        title: "JEE Main/Advanced",
        desc: "Prepare for top engineering entrance exams.",
      },
      {
        title: "NEET",
        desc: "Ace the national medical entrance exam",
      },
      {
        title: "UPSC CSE",
        desc: "Prepare for civil services examination.",
      },
      {
        title: "Bank PO/Clerk",
        desc: "Get ready for banking sector jobs.",
      },
    ],
    "Up Skilling": [
      {
        title: "Data Science",
        desc: "Master data analysis and machine learning.",
      },
      {
        title: "Web Development",
        desc: "Learn to build modern web applications.",
      },
      {
        title: "Digital Marketing",
        desc: "Boost your career in online marketing.",
      },
      {
        title: "Cloud Computing",
        desc: "Understand cloud platforms and services",
      },
    ],
  };

  const currentStreams = streamData[activeTab];

  return (
    <>
      {/* Section Heading */}
      <div className="text-center mb-8 sm:mb-12 relative px-4 sm:px-6 lg:px-8">
        <div className="text-4xl sm:text-6xl md:text-8xl font-bold text-gray-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
          Explore Streams
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold relative z-10">
          Explore Streams That Shape Your Future
        </h2>
      </div>

      {/* Section Body */}
      <section className="py-16 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-black text-lg mb-6">
            Get personalized guidance, real-world mentorship, and
            industry-aligned learning to take your next step with confidence.
          </p>

          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <div className="flex w-fit justify-between gap-2 bg-[#E2E2E2] rounded-full border border-gray-300 px-1.5 sm:px-3 py-2">
              {Object.keys(streamData).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-semibold text-sm sm:text-base transition-all ${
                    activeTab === tab
                      ? "bg-blue-800 text-white shadow-md"
                      : "text-gray-700 hover:bg-[#dcdcdc]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-black mb-8 font-medium text-base sm:text-lg">
            Personalized Support To Help You Decide What To Do{" "}
            <span className="capitalize">{activeTab}</span>.
          </p>

          {/* Desktop Timeline */}
          <div className="hidden md:block relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-blue-800 transform -translate-x-1/2"></div>

            <div className="space-y-14 transition-all duration-500 ease-in-out">
              {currentStreams.map((stream, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-12 ${
                    index % 2 === 0
                      ? "md:flex-row"
                      : "md:flex-row-reverse"
                  }`}
                >
                  {/* Card */}
                  <div
                    className={`flex-1 ${
                      index % 2 === 0 ? "text-right" : "text-left"
                    }`}
                  >
                    <_Card className="border-[#0222D7] border-[1.5px] rounded-2xl hover:shadow-lg transition-transform duration-300 hover:-translate-y-1">
                      <_CardContent className="p-6">
                        <h3 className="text-3xl font-bold mb-2 text-gray-900">
                          {stream.title}
                        </h3>
                        <p className="text-gray-600 mb-3 text-[25px]">
                          {stream.desc}
                        </p>
                        <button 
                        onClick={()=>router.push("/student/signup")}
                        className="text-blue-800 cursor-pointer font-semibold flex items-center justify-end md:justify-start hover:text-blue-700">
                          Explore Now{" "}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </_CardContent>
                    </_Card>
                  </div>

                  {/* Center Dots */}
                  <div className="flex items-center justify-center w-9 h-9 bg-blue-200 rounded-full relative z-10">
                    <div className="w-4 h-4 bg-blue-800 rounded-full"></div>
                  </div>

                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Vertical Timeline */}
          <div className="md:hidden relative px-4 mt-10">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-800"></div>
            <div className="space-y-6 relative">
              {currentStreams.map((stream, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="relative z-10 flex flex-col justify-center">
                    <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-blue-800 rounded-full"></div>
                    </div>
                  </div>

                  <_Card className="flex-1 border border-blue-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <_CardContent className="p-4">
                      <h3 className="text-base font-bold mb-1 text-gray-900">
                        {stream.title}
                      </h3>
                      <p className="text-sm text-[#000000] mb-2">
                        {stream.desc}
                      </p>
                      <button 
                      onClick={()=>router.push("/student/signup")}
                      className="text-blue-800 font-semibold text-sm flex items-center hover:text-blue-800">
                        Explore Now{" "}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </_CardContent>
                  </_Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
