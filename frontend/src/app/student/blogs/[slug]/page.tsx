"use client";
import React from 'react';
import { ArrowLeft, Users, School, BookOpen, GraduationCap, Target, Briefcase, Library } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';
import { Plus, Minus } from 'lucide-react';
import Link from "next/link";
import { useParams } from 'next/navigation';
import { 
 KinderGardenDetails,
 SchoolDetails,
 IntermediateDetails,
 GraduationDetails,
 TrainingInstituteDetails,
 TuitionCentreDetails,
 StudyHallDetails,
 StudyAboradDetails
} from '@/components/student/StudentLandingPage2/BlogInsituteDetails';

const BlogDetailPage = () => {
  const params = useParams();
  const slug = params?.slug as string;

  const institutes = [
    {
      id: 1,
      slug: 'kindergarten',
      title: 'Kindergarten',
      icon: <Users className="w-8 h-8" />,
      description: 'Early childhood education programs for ages 3-6',
      image: '🎨',
      brief: <KinderGardenDetails/>,
      faqs: [
        {
          question: 'What age is appropriate for kindergarten?',
          answer: 'Typically, children between 3-6 years old attend kindergarten programs. Pre-KG starts at 3, and children usually transition to primary school by age 6.'
        },
        {
          question: 'What should I look for in a kindergarten?',
          answer: 'Consider factors like qualified teachers, safe infrastructure, play-based curriculum, teacher-student ratio, hygiene standards, and the overall learning environment.'
        },
        {
          question: 'How do I know if my child is ready for kindergarten?',
          answer: 'Signs include basic communication skills, ability to follow simple instructions, interest in social interaction, and some level of independence in daily activities.'
        }
      ]
    },
    {
      id: 2,
      slug: 'schools',
      title: 'Schools',
      icon: <School className="w-8 h-8" />,
      description: 'Primary and secondary education institutions (K-12)',
      image: '🏫',
      brief: <SchoolDetails/>,
      faqs: [
        {
          question: 'Which board is best for my child?',
          answer: 'CBSE is nationally recognized and ideal for competitive exams, ICSE offers detailed subject knowledge, State Boards align with local contexts, and International boards (IB, Cambridge) provide global perspectives. Choose based on your child\'s learning style and future goals.'
        },
        {
          question: 'What is the ideal student-teacher ratio?',
          answer: 'An ideal ratio is 20:1 or lower for primary classes and 30:1 for secondary classes, ensuring personalized attention and effective learning.'
        },
        {
          question: 'How important are extracurricular activities?',
          answer: 'Very important. They develop soft skills, creativity, teamwork, and help in overall personality development alongside academics.'
        }
      ]
    },
    {
      id: 3,
      slug: 'intermediate',
      title: 'Intermediate Colleges',
      icon: <BookOpen className="w-8 h-8" />,
      description: 'Junior colleges for 11th and 12th grade students',
      image: '📚',
      brief: <IntermediateDetails/>,
      faqs: [
        {
          question: 'Which stream should I choose after 10th?',
          answer: 'Choose based on your career goals: MPC for engineering, BiPC for medicine, CEC for commerce and management, MEC for economics, and HEC for humanities and social sciences.'
        },
        {
          question: 'Can I change my stream after 11th?',
          answer: 'While technically possible, it\'s challenging and may require repeating the year. It\'s best to choose carefully after thorough career counseling.'
        },
        {
          question: 'Should I join a college with integrated coaching?',
          answer: 'Integrated coaching can be beneficial if you\'re preparing for competitive exams like JEE or NEET, as it provides structured preparation alongside regular curriculum.'
        }
      ]
    },
    {
      id: 4,
      slug: 'undergraduate',
      title: 'Undergraduate/Graduate Colleges',
      icon: <GraduationCap className="w-8 h-8" />,
      description: 'Universities and colleges for degree programs',
      image: '🎓',
      brief: <GraduationDetails/>,
      faqs: [
        {
          question: 'What factors should I consider when choosing a college?',
          answer: 'Consider accreditation (NAAC, NBA), placement records, faculty qualifications, infrastructure, industry partnerships, research opportunities, and alumni network.'
        },
        {
          question: 'Is college ranking important?',
          answer: 'Rankings provide a general overview but shouldn\'t be the only criterion. Consider course curriculum, faculty, facilities, and alignment with your career goals.'
        },
        {
          question: 'Should I pursue a general degree or specialized program?',
          answer: 'Specialized programs offer focused skill development for specific careers, while general degrees provide broader knowledge and flexibility. Choose based on your career clarity and interests.'
        }
      ]
    },
    {
      id: 5,
      slug: 'training',
      title: 'Training Institutes',
      icon: <Target className="w-8 h-8" />,
      description: 'Professional skill development and certification programs',
      image: '💼',
      brief: <TrainingInstituteDetails/>,
      faqs: [
        {
          question: 'Are training institute certifications valuable?',
          answer: 'Yes, especially industry-recognized certifications (Google, Microsoft, AWS, etc.) that demonstrate practical skills to employers and enhance employability.'
        },
        {
          question: 'How long do training programs typically last?',
          answer: 'Duration varies from short-term workshops (1-4 weeks) to comprehensive programs (3-12 months) depending on the skill complexity and depth.'
        },
        {
          question: 'Can I pursue training while working?',
          answer: 'Absolutely. Many institutes offer weekend batches, evening classes, and online programs designed for working professionals.'
        }
      ]
    },
    {
      id: 6,
      slug: 'tuition',
      title: 'Tuition Centres',
      icon: <BookOpen className="w-8 h-8" />,
      description: 'Personalized academic support and subject tutoring',
      image: '✏️',
      brief: <TuitionCentreDetails/>,
      faqs: [
        {
          question: 'When should my child start tuition?',
          answer: 'Consider tuition when your child struggles with specific subjects, needs concept reinforcement, or requires additional practice and personalized attention that school doesn\'t provide.'
        },
        {
          question: 'Group tuition vs. individual tuition?',
          answer: 'Group tuition is cost-effective and promotes peer learning, while individual tuition offers personalized attention and customized pace. Choose based on your child\'s learning style and needs.'
        },
        {
          question: 'How do I choose the right tuition center?',
          answer: 'Check teacher qualifications, teaching methodology, batch size, student reviews, success rates, and whether they align with your child\'s school curriculum.'
        }
      ]
    },
    {
      id: 7,
      slug: 'study-halls',
      title: 'Study Halls',
      icon: <Briefcase className="w-8 h-8" />,
      description: 'Quiet spaces for focused studying and exam preparation',
      image: '🎯',
      brief: <StudyHallDetails/>,
      faqs: [
        {
          question: 'How is study hall different from a coaching center or tutoring?',
          answer: 'A study hall is a quiet space for students to study independently, often with minimal guidance. In contrast, a coaching center or tutoring involves structured teaching, explanations, and personalized support from instructors. Study halls focus on self-study, while coaching or tutoring focuses on direct teaching and skill improvement.'
        },
        {
          question: 'Is a study hall better for self-study or guided learning?',
          answer: 'A study hall is better suited for self-study rather than guided learning. It provides a quiet and focused environment for students to revise, practice, and complete work on their own. While some may offer basic guidance, the main purpose is to encourage independent learning and discipline.'
        },
        {
          question: 'What are the fees for top study halls in Hyderabad or major Indian cities?',
          answer: 'In major Indian cities like Hyderabad, study hall fees usually range from ₹800 to ₹2,000 per month, depending on facilities like AC, Wi-Fi, and seating type. Coaching or tutoring centers, on the other hand, charge much higher—ranging from ₹15,000 to ₹2,00,000+, especially for competitive exams like NEET or JEE. Study halls mainly offer space for self-study, while coaching provides structured teaching.'
        },
        {
          question: 'How do study halls help students improve focus and time management?',
          answer: 'Study halls help students improve focus by providing a quiet, distraction-free environment dedicated to studying. With a set time for self-study, students learn to concentrate better on their tasks. They also develop time management skills by planning and completing assignments within the allotted period. Regular use of study halls encourages consistent study habits, reducing procrastination and improving overall productivity.'
        }
      ]
    },
    {
      id: 8,
      slug: 'study-abroad',
      title: 'Study Abroad',
      icon: <Library className="w-8 h-8" />,
      description: 'International education opportunities and guidance',
      image: '📖',
      brief: <StudyAboradDetails/>,
      faqs: [
        {
          question: 'What are the benefits of study halls?',
          answer: 'Study halls offer distraction-free environment, disciplined study routine, peer motivation, extended study hours, and a serious academic atmosphere that enhances productivity and focus.'
        },
        {
          question: 'What facilities should a good study hall have?',
          answer: 'Look for comfortable seating, adequate lighting, proper ventilation, clean washrooms, drinking water, power backup, security, and locker facilities for books.'
        },
        {
          question: 'Are study halls only for competitive exam preparation?',
          answer: 'No, study halls are useful for anyone needing focused study time—college students, working professionals pursuing certifications, or anyone preparing for any examination.'
        }
      ]
    }
  ];

  const institute = institutes.find(inst => inst.slug === slug);

  if (!institute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Institute Not Found</h1>
          <Link href="/blog" className="text-blue-600 hover:underline">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-20">
        <Link
          href="/student/blogs"
          className="bg-white w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700 cursor-pointer group-hover:text-blue-600 transition-colors" />
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-7xl mb-4">{institute.image}</div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4"> 
              {institute.title}
            </h1>
            <p className="text-xl opacity-90">{institute.description}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-8 sm:px-12 lg:px-16 py-12">
        {/* Brief Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-1 h-8 bg-blue-600 mr-4 rounded-full"></span>
            Overview
          </h2>
          <div className="text-gray-700 leading-relaxed text-lg"> 
            {institute.brief}
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-1 h-8 bg-purple-600 mr-4 rounded-full"></span>
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {institute.faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-200 rounded-2xl px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-all duration-200"
              >
                <AccordionTrigger className="flex justify-between items-center w-full text-left text-lg font-semibold text-gray-900">
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-3 text-xl">Q{index + 1}.</span>
                    <span>{faq.question}</span>
                  </div>
                  <div className="ml-4 transition-transform duration-200 accordion-icon">
                    <Plus className="w-5 h-5 text-purple-600 group-data-[state=open]:hidden" />
                    <Minus className="w-5 h-5 text-purple-600 hidden group-data-[state=open]:block" />
                  </div>
                </AccordionTrigger>

                <AccordionContent className="text-gray-700 leading-relaxed ml-8 mt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Looking for More Information?</h3>
          <p className="mb-6 text-lg opacity-90">
            Connect with us to explore the best {institute.title.toLowerCase()} options 
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Contact Us
            </button>
            <Link
              href="/student"
              className="bg-transparent border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block text-center"
            >
              Explore More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
