"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HeroSection() {
  
  const router = useRouter();

  return (
    <>
      {/* Content}*/}
      <div className=" items-center justify-center md:mt-16 mt-30">
        <div className="space-y-2 sm:space-y-3 md:space-y-4 w-full flex flex-col items-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#000000] leading-tight tracking-tight text-center">
            Find Your Right Career Path
          </h1>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#000000] leading-tight tracking-tight text-center">
            Without Stepping Out.
          </h1>
        </div>

        {/* Subtext */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#000000] mt-4 sm:mt-5 md:mt-6 max-w-2xl mx-auto text-center">
          Personalised Guidance, Scholarship Matching, And A Clear Action-Plan.
        </p>
      </div>

      {/* Button */}
      <div className="mt-6 flex items-center justify-center sm:mt-8 mb-10 ">
        <Button 
        onClick={()=>router.push("/student/signup")}
        className="bg-[#0222D7] cursor-pointer hover:bg-[#001DBA] text-white px-6 sm:px-8 md:px-10 py-6 sm:py-8 md:py-8 text-sm sm:text-base md:text-lg rounded-lg">
          Start Your Journey
        </Button>
      </div>

      <div className="text-center mb-8 sm:mb-12 relative px-4 sm:px-6 lg:px-8">
        <div className="text-4xl sm:text-6xl md:text-8xl font-bold text-gray-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
          Services
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold relative z-10">
          Services Provide
        </h2>
      </div>

      <div className="md:min-h-screen bg-white  md:p-8">
        <div className="w-100vw m-2">
          {/* MOBILE VIEW: Below 500px */}
          <div className="block md:hidden mx-auto max-w-md rounded-2xl shadow border border-gray-200">
            <div className="grid grid-cols-[0.9fr_1.1fr] gap-1">
              {/* First Column: Kindergarten (50% height), Graduation (50% height) */}
              <div className="flex flex-col gap-1">
                {/* Kindergarten Card */}
                {/* Wrapper for both cards */}
                <div className="flex flex-col gap-2 w-full h-full max-w-sm mx-auto">
                  {/* Kindergarten Card */}
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-3 border border-gray-100 flex flex-col justify-between relative overflow-hidden w-full flex-1 min-h-[160px] h-[32vh] sm:h-[30vh]">
                    {/* Text Content */}
                    <div className="flex flex-col gap-[3px] z-10 relative pr-[45%]">
                      <h3 className="text-[13px] font-bold text-gray-900 leading-tight">
                        Kindergarten
                      </h3>
                      <p className="text-gray-600 text-[9px] leading-snug">
                        Find The Best Kindergarten For Your Little One Near You
                      </p>
                      <a
                        href="#"
                        className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors text-[10px] leading-none mt-[2px]"
                      >
                        Explore <span className="ml-1">→</span>
                      </a>
                    </div>

                    {/* Image anchored bottom-right */}
                    <div className="absolute bottom-0 right-0 w-[100%] max-w-[430px] h-[55%]">
                      <Image
                        src="/kinderGarten.jpg"
                        alt="Kindergarten"
                        width={100}
                        height={100}
                        className="w-full h-full object-contain object-bottom"
                      />
                    </div>
                  </div>

                  {/* Graduation Card */}
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-3 border border-gray-100 flex flex-col justify-between relative overflow-hidden w-full flex-1 min-h-[140px] h-[20vh] sm:h-[18vh]">
                    {/* Text Content */}
                    <div className="flex flex-col gap-[3px] z-10 relative pr-[40%]">
                      <h3 className="text-[13px] font-bold text-gray-900 leading-tight">
                        Graduation
                      </h3>
                      <p className="text-gray-600 text-[9px] leading-snug">
                        Explore Verified Colleges For UG/PG Programs
                      </p>
                      <a
                        href="#"
                        className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors text-[10px] leading-none mt-[2px]"
                      >
                        Explore <span className="ml-1">→</span>
                      </a>
                    </div>

                    {/* Image anchored bottom-right */}
                    <div className="absolute bottom-0 right-[4px] w-[100%] max-w-[800px] h-[80%]">
                      <Image
                        src="/Graduate.jpg"
                        alt="Graduate"
                        width={100}
                        height={100}
                        className="w-full h-full object-contain object-bottom"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Column: Four rows as described */}
              <div className="flex flex-col gap-1">
                {/* Row 1: Schools card (full width) */}
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-1 border border-gray-100 flex flex-col justify-between w-full max-w-xs">
                  {/* Text Section */}
                  <div className="">
                    <h3 className="text-md font-bold text-gray-900">Schools</h3>
                    <p className="text-gray-600 text-[9px] leading-snug">
                      Discover Top Rated Schools For Your Child.
                    </p>
                  </div>

                  {/* Explore Link */}
                  <a
                    href="#"
                    className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors text-[11px]"
                  >
                    Explore
                    <span className="ml-1">→</span>
                  </a>

                  {/* Image Section */}
                  <div className="flex justify-end items-end">
                    <Image
                      src="/school.jpg"
                      alt="Schools"
                      width={100}
                      height={100}
                      className="w-20 h-5 object-contain"
                    />
                  </div>
                </div>

                {/* Row 2: Two equal columns - Tuition Centre and Intermediate */}
                <div className="grid grid-cols-2 gap-1">
                  {/* Tuition Centres */}
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-1 border border-gray-100 flex flex-col justify-between">
                    <div className="flex-1">
                      <h3 className="text-md font-bold text-gray-900 leading-none">
                        Tuition Centres
                      </h3>
                      <p className="text-gray-600 text-[9px] leading-tight line-clamp-2">
                        Struggling With Studies? Find Expert Tutors Nearby Who
                        Can Help You Score Better!
                      </p>
                      <a
                        href="#"
                        className="flex leading-none items-center text-blue-600 font-medium hover:text-blue-700 transition-colors text-[11px]"
                      >
                        Explore <span>→</span>
                      </a>
                    </div>
                    <div className="flex justify-end">
                      <Image
                        src="/TuitionCentres.jpg"
                        alt="Tuition"
                        width={100}
                        height={100}
                        className="w-16 h-10 object-contain rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Intermediate */}
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-1 border border-gray-100 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[14px] font-bold text-gray-900">
                        Intermediate
                      </h3>
                      <p className="text-gray-600 text-[9px] leading-tight line-clamp-2">
                        Choose The Right Intermediate College For Your Stream
                      </p>
                      <a
                        href="#"
                        className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors text-[11px]"
                      >
                        Explore <span>→</span>
                      </a>
                    </div>
                    <div className="flex justify-end items-center">
                      <Image
                        src="/Intermediate.jpg"
                        alt="Intermediate"
                        width={100}
                        height={100}
                        className="w-12 h-10 object-contain rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: UpskillingService Centres (full width) */}
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-1 border border-gray-100 flex flex-col justify-between">
                  <div className="ml-1">
                    <h3 className="text-base font-bold text-gray-900">
                      UpskillingService Centres
                    </h3>
                    <p className="text-gray-600 text-[9px] leading-tight">
                      Learn Job-Ready Skills And Boost Your Career With Trending
                      Courses From Top Institutes!
                    </p>
                    <a
                      href="#"
                      className="flex leading-none items-center text-blue-600 font-medium hover:text-blue-700 transition-colors text-[11px]"
                    >
                      Explore <span>→</span>
                    </a>
                    <div className="flex justify-end">
                      <Image
                        src="/UpskillingService.jpg"
                        alt="Upskilling"
                        width={100}
                        height={100}
                        className="w-28 h-8 object-contain rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: Two equal columns - Exam Preparation and Study Abroad */}
                <div className="grid grid-cols-2 gap-1">
                  {/* Exam Preparation */}
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-1 border border-gray-100 flex flex-col items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 leading-none">
                        Exam Preparation
                      </h3>
                      <p className="text-gray-600 text-[9px] leading-tight line-clamp-3">
                        Preparing For JEE, NEET, UPSC, Or Other Competitive
                        Exams? Find The Best Coaching Now
                      </p>
                      <a
                        href="#"
                        className="flex leading-none items-center text-blue-600 font-medium hover:text-blue-700 transition-colors text-[11px]"
                      >
                        Explore <span>→</span>
                      </a>
                    </div>
                    <div className="flex justify-end">
                      <Image
                        src="/ExamPrep.jpg"
                        alt="Exam Prep"
                        width={100}
                        height={100}
                        className="w-16 h-8 object-contain rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Study Abroad */}
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-1 border border-gray-100 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 leading-none">
                        Study Abroad
                      </h3>
                      <p className="text-gray-600 text-[9px] leading-tight line-clamp-3">
                        More Verified Colleges For UG/PG Program
                      </p>
                      <a
                        href="#"
                        className="flex leading-none items-center text-blue-600 font-medium hover:text-blue-700 transition-colors text-[11px]"
                      >
                        Explore <span>→</span>
                      </a>
                    </div>
                    <div className="flex justify-end">
                      <Image
                        src="/studyAbroad.jpg"
                        alt="Study Abroad"
                        width={100}
                        height={100}
                        className="w-16 h-12 object-contain rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

     {/* DESKTOP VIEW: 500px and above */}
<div className="hidden md:block">
  <div className="grid grid-cols-3 gap-3">

    {/* LEFT COLUMN */}
    <div className="flex flex-col gap-3">
      {/* Kindergarten */}
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-5 flex flex-col justify-between h-[460px]">
        <div>
          <h3 className="text-[24px] font-bold text-gray-900 mb-1">Kindergarten</h3>
          <p className="text-gray-600 text-sm leading-snug">
            Find The Best Kindergarten For Your Little One Near You
          </p>
          <a href="#" className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800 text-sm mt-2">
            Explore Options Now! →
          </a>
        </div>
        <div className="flex justify-end mt-auto">
          <Image width={380} height={380} src="/kinderGarten.jpg" alt="ABC Learning"
            className="bottomw-[400px] h-[245px] object-contain" />
        </div>
      </div>

      {/* Schools */}
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-5 flex flex-col justify-between h-[200px]">
        <div>
          <h3 className="text-[24px] font-bold text-gray-900 mb-1">Schools</h3>
          <p className="text-[#000000] text-[16px] leading-snug">
            Discover Top-Rated Schools That Shape Your Child&apos;s Future
          </p>
          <a href="#" className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800 text-xs mt-2">
            Compare And Choose Wisely! →
          </a>
        </div>
        <div className="flex justify-end mt-auto">
          <Image width={100}
                        height={100} src="/school.jpg" alt="School" className="w-[170px] h-[96px] object-contain" />
        </div>
      </div>
    </div>

    {/* MIDDLE COLUMN */}
    <div className="flex flex-col gap-3">
      {/* Tuition Centres */}
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-5 flex flex-col justify-between h-[260px]">
        <div>
          <h3 className="text-[24px] font-bold text-gray-900 mb-1">Tuition Centres</h3>
          <p className="text-gray-600 text-sm leading-snug">
            Struggling With Studies? Find Expert Tutors Nearby Who Can Help You Score Better!
          </p>
          <a href="#" className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800 text-sm mt-2">
            Start Exploring →
          </a>
        </div>
        <div className="flex justify-end mt-auto">
          <Image width={100}
                        height={100} src="/TuitionCentres.jpg" alt="Tuition" className="w-[220px] h-[120px] object-contain" />
        </div>
      </div>

      {/* Intermediate & Graduate side by side */}
      <div className="grid grid-cols-2 gap-3">
        {/* Intermediate */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-4 flex flex-col justify-between h-[180px]">
          <div>
            <h3 className="text-[24px] font-bold text-gray-900 mb-1">Intermediate</h3>
            <p className="text-gray-600 text-xs leading-snug">
              Choose The Right Intermediate College For Your Stream
            </p>
            <a href="#" className="text-blue-700 font-medium hover:text-blue-800 text-xs mt-2 inline-block">
              Start Exploring →
            </a>
          </div>
          <div className="flex  justify-end mt-auto">
            <Image width={100}
                        height={100} src="/intermediate.jpg" alt="Intermediate"
              className="w-[90px] h-[60px] object-contain" />
          </div>
        </div>

        {/* Graduate */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-4 flex flex-col justify-between h-[180px]">
          <div>
            <h3 className="text-[24px] font-bold text-gray-900 mb-1">Graduate</h3>
            <p className="text-gray-600 text-xs leading-snug">
              Explore Verified Colleges For UG/PG Programs
            </p>
            <a href="#" className="text-blue-700 font-medium hover:text-blue-800 text-xs mt-2 inline-block">
              Start Exploring →
            </a>
          </div>
          <div className="flex justify-end mt-auto">
            <Image width={100}
                        height={100} src="/Graduate.jpg" alt="Graduate"
              className="w-[90px] h-[65px] object-contain" />
          </div>
        </div>
      </div>

      {/* Exam Preparation */}
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-5 flex flex-col justify-between h-[200px]">
        <div>
          <h3 className="text-[24px] font-bold text-gray-900 mb-1">Exam Preparation</h3>
          <p className="text-gray-600 text-sm leading-snug">
            Preparing for JEE, NEET, UPSC, Or Other Exams? Find The Best Coaching Now!
          </p>
          <a href="#" className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800 text-sm mt-2">
            Start Exploring →
          </a>
        </div>
        <div className="flex justify-end mt-auto">
          <Image width={100}
                        height={100} src="/ExamPrep2Service.jpg" alt="Exam Prep"
            className="w-[210px] h-[90px] object-contain" />
        </div>
      </div>
    </div>

    {/* RIGHT COLUMN */}
    <div className="flex flex-col gap-3">
      {/* Upskilling Centres */}
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-5 flex flex-col justify-between h-[350px]">
        <div>
          <h3 className="text-[24px] font-bold text-gray-900 mb-1">Upskilling Centres</h3>
          <p className="text-gray-600 text-sm leading-snug">
            Learn Job-Ready Skills And Boost Your Career With Trending Courses From Top Institutes!
          </p>
          <a href="#" className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800 text-sm mt-2">
            Start Exploring →
          </a>
        </div>
        <div className="flex overflow-hidden justify-end mt-auto">
          <Image width={280}
                        height={280} src="/UpskillingService.jpg" alt="UpskillingService"
            className="bottomw-[320px] h-[310px] object-contain" />
        </div>
      </div>

      {/* Study Abroad */}
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-5 flex flex-col justify-between h-[300px]">
        <div>
          <h3 className="text-[24px] font-bold text-gray-900 mb-1">Study Abroad</h3>
          <p className="text-gray-600 text-sm leading-snug">
            Lorem Ipsum Is Simply Dummy Text Of The Printing.
          </p>
          <a href="#" className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800 text-sm mt-2">
            Start Exploring →
          </a>
        </div>
        <div className="flex justify-end mt-auto">
          <Image width={280}
                        height={280} src="/studyAbroad.jpg" alt="Study Abroad"
            className="bottomw-[310px] h-[190px] object-contain" />
        </div>
      </div>
    </div>
  </div>
</div>



          
        </div>
      </div>
    </>
  );
}




          