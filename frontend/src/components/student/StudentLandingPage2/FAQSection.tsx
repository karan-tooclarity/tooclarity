"use client";

import React from "react";
import { Instagram, Linkedin, Twitter, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function FAQSection() {
  const router = useRouter();
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is TooClarity and how does it help me?",
      answer:
        "TooClarity helps students discover the right educational path with expert guidance, verified scholarships, and real-time updates.",
    },
    {
      question: "Who can use TooClarity?",
      answer:
        "Students, parents, and educational institutions can all use TooClarity to connect and make informed choices.",
    },
    {
      question: "Is this platform free?",
      answer:
        "Yes! TooClarity offers core features for free to make education access easier for everyone.",
    },
    {
      question: "Do you help with college admissions or job prep?",
      answer:
        "Yes, we provide personalized support for both college admissions and career preparation.",
    },
    {
      question: "Can parents or guardians use it too?",
      answer:
        "Absolutely. Parents and guardians can access insights and updates to support their child's journey.",
    },
  ];

  return (
    <>
    <section className="w-full bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-10 lg:gap-24">
        {/* LEFT SIDE - Text Content */}
        <div className="flex-1 flex flex-col justify-start space-y-6 text-center lg:text-left">
          <h2 className="font-sora font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-lg sm:text-xl font-medium text-black">
            Still Have Questions? We&apos;ve Got Answers.
            Reach out to our founders anytime 
          </p>
      

          <div className="mt-4">
            <button 
            onClick={()=>router.push("/student/signup")}
            className="bg-blue-800 cursor-pointer text-white text-base sm:text-lg font-medium px-6 sm:px-8 py-3 mb-4 rounded-xl transition-colors duration-200">
              Get in Touch
            </button>
          </div>
          <div className="flex gap-4">
                <a href="https://www.instagram.com/tooclarity/#" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-[#000000] hover:bg-blue-700">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/company/tooclarity/" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-[#000000] hover:bg-blue-700">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://www.youtube.com/@tooclarity" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-[#000000] hover:bg-blue-700">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
        </div>

        {/* RIGHT SIDE - Accordion FAQs */}
        <div className="w-full lg:max-w-[45%] mx-auto space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="relative">
          {/* Top Question Row */} 
          <div
            onClick={() => setOpenItem(openItem === index ? null : index)}
            className="flex items-center cursor-pointer transition-all duration-300"
          >
            {/* Question Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[#0222D7] flex items-center justify-center text-[#0222D7] font-bold text-xl mr-3">
              ?
            </div>

            {/* Question Box */}
            <div
              className={`flex-1 border border-[#0222D7] rounded-full px-5 py-3 text-gray-800 font-medium text-[15px] sm:text-base ${
                openItem === index ? "bg-[#CAD2FF]" : "bg-transparent"
              }`}
            >
              {faq.question}
            </div>
          </div>

          {/* Answer Box */}
          {openItem === index && (
            <div className="ml-14 mt-3 border border-[#0222D7] rounded-lg px-5 py-4 text-gray-700 text-sm sm:text-[15px] flex items-start justify-between">
              <p className="max-w-[90%] leading-relaxed">{faq.answer}</p>
              <MessageSquare className="w-5 h-5 text-[#0222D7] flex-shrink-0" />
            </div>
          )}
        </div>
      ))}
    </div>
      </div>
    </section>

  


    </>
  );
}