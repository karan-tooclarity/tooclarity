"use client";
import React from 'react';
import { Users, School, BookOpen, GraduationCap, Target, Briefcase, Library } from 'lucide-react';
import Link from "next/link";

const BlogPage = () => {
  const institutes = [
    {
      id: 1,
      slug: 'kindergarten',
      title: 'Kindergarten',
      icon: <Users className="w-8 h-8" />,
      description: 'Early childhood education programs for ages 3-6',
      image: '🎨',
    },
    {
      id: 2,
      slug: 'schools',
      title: 'Schools',
      icon: <School className="w-8 h-8" />,
      description: 'Primary and secondary education institutions (K-12)',
      image: '🏫',
    },
    {
      id: 3,
      slug: 'intermediate',
      title: 'Intermediate Colleges',
      icon: <BookOpen className="w-8 h-8" />,
      description: 'Junior colleges for 11th and 12th grade students',
      image: '📚',
    },
    {
      id: 4,
      slug: 'undergraduate',
      title: 'Undergraduate/Graduate Colleges',
      icon: <GraduationCap className="w-8 h-8" />,
      description: 'Universities and colleges for degree programs',
      image: '🎓',
    },
    {
      id: 5,
      slug: 'training',
      title: 'Training Institutes',
      icon: <Target className="w-8 h-8" />,
      description: 'Professional skill development and certification programs',
      image: '💼',
    },
    {
      id: 6,
      slug: 'tuition',
      title: 'Tuition Centres',
      icon: <BookOpen className="w-8 h-8" />,
      description: 'Personalized academic support and subject tutoring',
      image: '✏️',
    },
    {
      id: 7,
      slug: 'study-halls',
      title: 'Study Halls',
      icon: <Briefcase className="w-8 h-8" />,
      description: 'Quiet spaces for focused studying and exam preparation',
      image: '🎯',
    },
    {
      id: 8,
      slug: 'study-abroad',
      title: 'Study Abroad',
      icon: <Library className="w-8 h-8" />,
      description: 'International education opportunities and guidance',
      image: '📖',
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
              Welcome to Too Clarity <span className="text-blue-600">Blog Section!</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive guide to educational institutions and make informed decisions about your learning journey
            </p>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {institutes.map((institute) => (
            <Link
              key={institute.id}
              href={`/student/blogs/${institute.slug}`}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden group"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-center">
                <div className="text-6xl mb-4">{institute.image}</div>
                <div className="text-white mb-2">{institute.icon}</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {institute.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {institute.description}
                </p>
                <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm">
                  Read More
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make Your Education Choice?</h2>
          <p className="text-lg mb-6 opacity-90">
            Discover the best institutions that match your goals and aspirations
          </p>
          <Link
            href="/student"
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg inline-block"
          >
            Explore Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
