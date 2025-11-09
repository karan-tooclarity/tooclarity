
"use client";

import InputField from "@/components/ui/InputField";
import SearchableSelect from "@/components/ui/SearchableSelect";
import SlidingIndicator from "@/components/ui/SlidingIndicator";
import { Course } from "../../L2DialogBox";
import { useMemo } from "react";

// Cascading dropdown data structure
const CATEGORY_DOMAIN_MAPPING = {
    "Exam Preparation": {
      domains: [
        "Civil Services & Administrative",
        "Banking Exams",
        "Insurance Exams",
        "Railways Exams",
        "SSC Exams (Staff Selection Commission)",
        "Defence Exams",
        "Police & Law Enforcement",
        "Teaching Exams",
        "Legal & Judicial Services",
        "State Government Exams",
        "Central Government Recruitment",
        "Research & Scientific",
        "Other Government Exams",
        "ENGINEERING ENTRANCE EXAMS - INDIA",
        "Architecture Entrance",
        "MEDICAL ENTRANCE EXAMS - INDIA",
        "Physiotherapy Entrance Exams",
        "MANAGEMENT ENTRANCE EXAMS - INDIA",
        "LAW ENTRANCE EXAMS - INDIA",
        "DESIGN & CREATIVE ENTRANCE EXAMS - INDIA",
        "HOTEL MANAGEMENT & HOSPITALITY EXAMS - INDIA",
        "MASS COMMUNICATION & JOURNALISM - INDIA",
        "OTHER PROFESSIONAL ENTRANCE EXAMS - INDIA",
        "SCHOOL/FOUNDATION LEVEL EXAMS - INDIA",
        "INTERNATIONAL EXAMS"
      ],
      subDomains: {
        "Civil Services & Administrative": [
          "UPSC Civil Services Examination (IAS/IPS/IFS)",
          "UPSC Prelims",
          "UPSC Mains",
          "UPSC Interview/Personality Test",
          "State Public Service Commission (State PSC)",
          "BPSC (Bihar)",
          "MPPSC (Madhya Pradesh)",
          "UPPSC (Uttar Pradesh)",
          "RPSC (Rajasthan)",
          "GPSC (Gujarat)",
          "KPSC (Karnataka)",
          "TNPSC (Tamil Nadu)",
          "WBPSC (West Bengal)",
          "APPSC (Andhra Pradesh)",
          "TSPSC (Telangana)",
          "CGPSC (Chhattisgarh)",
          "UKPSC (Uttarakhand)",
          "HPPSC (Himachal Pradesh)",
          "PPSC (Punjab)",
          "JKPSC (Jammu & Kashmir)",
          "APSC (Assam)",
          "MPSC (Maharashtra)",
          "KPSC (Kerala)"
        ],
        "Banking Exams": [
          "IBPS PO (Probationary Officer)",
          "IBPS Clerk",
          "IBPS SO (Specialist Officer)",
          "IBPS RRB (Regional Rural Banks)",
          "SBI PO",
          "SBI Clerk",
          "SBI SO",
          "RBI Grade B",
          "RBI Assistant",
          "NABARD Grade A & B",
          "SIDBI",
          "SEBI Grade A",
          "IPPB (India Post Payment Bank)",
          "Cooperative Bank Exams"
        ],
        "Insurance Exams": [
          "LIC AAO (Assistant Administrative Officer)",
          "LIC ADO (Apprentice Development Officer)",
          "LIC HFL (Housing Finance Limited)",
          "NIACL (New India Assurance)",
          "OICL (Oriental Insurance)",
          "UIIC (United India Insurance)",
          "GIC (General Insurance Corporation)"
        ],
        "Railways Exams": [
          "RRB NTPC (Non-Technical Popular Categories)",
          "RRB Group D",
          "RRB JE (Junior Engineer)",
          "RRB ALP (Assistant Loco Pilot)",
          "RRB RPF (Railway Protection Force)",
          "RRB Technician",
          "DFCCIL (Dedicated Freight Corridor Corporation)",
          "RITES (Rail India Technical & Economic Service)",
          "IRCTC",
          "CONCOR"
        ],
        "SSC Exams (Staff Selection Commission)": [
          "SSC CGL (Combined Graduate Level)",
          "SSC CHSL (Combined Higher Secondary Level)",
          "SSC CPO (Central Police Organisation)",
          "SSC GD (General Duty)",
          "SSC JE (Junior Engineer)",
          "SSC MTS (Multi-Tasking Staff)",
          "SSC Stenographer",
          "SSC Selection Post",
          "SSC Scientific Assistant"
        ],
        "Defence Exams": [
          "NDA (National Defence Academy)",
          "CDS (Combined Defence Services)",
          "AFCAT (Air Force Common Admission Test)",
          "Indian Army TGC/TES",
          "Indian Navy Entrance",
          "Indian Air Force",
          "INET (Indian Navy Entrance Test)",
          "Territorial Army",
          "Coast Guard",
          "Military Nursing Service",
          "Para Military Forces"
        ],
        "Police & Law Enforcement": [
          "CAPF (Central Armed Police Forces)",
          "CRPF (Central Reserve Police Force)",
          "BSF (Border Security Force)",
          "CISF (Central Industrial Security Force)",
          "ITBP (Indo-Tibetan Border Police)",
          "SSB (Sashastra Seema Bal)",
          "Assam Rifles",
          "NSG (National Security Guard)",
          "State Police Constable",
          "State Police SI (Sub-Inspector)",
          "Delhi Police",
          "Mumbai Police"
        ],
        "Teaching Exams": [
          "CTET (Central Teacher Eligibility Test)",
          "State TET (All States)",
          "UGC NET (National Eligibility Test)",
          "CSIR NET",
          "SLET/SET (State Level Eligibility Test)",
          "KVS (Kendriya Vidyalaya Sangathan)",
          "NVS (Navodaya Vidyalaya Samiti)",
          "DSSSB (Delhi Subordinate Services Selection Board)",
          "Army Public School Teachers",
          "AWES (Army Welfare Education Society)"
        ],
        "Legal & Judicial Services": [
          "CLAT PG (Common Law Admission Test)",
          "Judicial Services (All States)",
          "AIBE (All India Bar Examination)",
          "District Judge Exam",
          "Civil Judge Exam",
          "Judicial Magistrate",
          "Law Officer Exams"
        ],
        "State Government Exams": [
          "Group A, B, C, D Posts (All States)",
          "Patwari Exam",
          "Revenue Inspector",
          "Village Accountant",
          "Gram Sevak",
          "Panchayat Secretary",
          "Block Development Officer",
          "Tehsildar",
          "Lekhpal"
        ],
        "Central Government Recruitment": [
          "UPPCL (Uttar Pradesh Power Corporation)",
          "State Electricity Boards",
          "FCI (Food Corporation of India)",
          "ESIC (Employees' State Insurance Corporation)",
          "EPFO (Employees' Provident Fund Organisation)",
          "NHM (National Health Mission)",
          "NRHM (National Rural Health Mission)",
          "India Post GDS/Postman/Mail Guard",
          "DRDO (Defence Research & Development Organisation)",
          "ISRO (Indian Space Research Organisation)",
          "BARC (Bhabha Atomic Research Centre)",
          "BHEL (Bharat Heavy Electricals Limited)",
          "ONGC (Oil & Natural Gas Corporation)",
          "IOCL (Indian Oil Corporation)",
          "BPCL (Bharat Petroleum Corporation)",
          "HPCL (Hindustan Petroleum Corporation)",
          "GAIL (Gas Authority of India Limited)",
          "Coal India Limited",
          "NTPC (National Thermal Power Corporation)",
          "Power Grid Corporation",
          "HAL (Hindustan Aeronautics Limited)",
          "BEL (Bharat Electronics Limited)",
          "SAIL (Steel Authority of India Limited)",
          "AAI (Airports Authority of India)"
        ],
        "Research & Scientific": [
          "CSIR NET",
          "GATE (Graduate Aptitude Test in Engineering)",
          "JEST (Joint Entrance Screening Test)",
          "JGEEBILS (Joint GATE Entrance Examination for Biology & Life Sciences)",
          "TIFR (Tata Institute of Fundamental Research)",
          "IISc Admission Test",
          "IISER Aptitude Test"
        ],
        "Other Government Exams": [
          "Lok Sabha Secretariat",
          "Rajya Sabha Secretariat",
          "Election Commission of India",
          "CAG (Comptroller & Auditor General)",
          "Supreme Court of India",
          "High Court Recruitment",
          "Intelligence Bureau (IB)",
          "Research & Analysis Wing (RAW)",
          "CBI (Central Bureau of Investigation)",
          "NIA (National Investigation Agency)",
          "ED (Enforcement Directorate)"
        ],
        "ENGINEERING ENTRANCE EXAMS - INDIA": [
          "JEE Main",
          "JEE Advanced",
          "BITSAT (Birla Institute of Technology & Science)",
          "VITEEE (VIT Engineering Entrance Exam)",
          "SRMJEEE (SRM Joint Engineering Entrance Exam)",
          "COMEDK UGET",
          "MET (Manipal Entrance Test)",
          "AEEE (Amrita Engineering Entrance Exam)",
          "KIITEE (Kalinga Institute of Industrial Technology)",
          "WBJEE (West Bengal Joint Entrance Exam)",
          "UPSEE/UPTU (Uttar Pradesh State Entrance Exam)",
          "KCET (Karnataka Common Entrance Test)",
          "TNEA (Tamil Nadu Engineering Admissions)",
          "AP EAMCET (Andhra Pradesh Engineering Common Entrance Test)",
          "TS EAMCET (Telangana State Engineering Common Entrance Test)",
          "MHT CET (Maharashtra Common Entrance Test)",
          "GUJCET (Gujarat Common Entrance Test)",
          "KEAM (Kerala Engineering Architecture Medical)",
          "OJEE (Odisha Joint Entrance Exam)",
          "BCECE (Bihar Combined Entrance Competitive Exam)",
          "JCECE (Jharkhand Combined Entrance Competitive Exam)",
          "CGPET (Chhattisgarh Pre-Engineering Test)",
          "RPET (Rajasthan Pre-Engineering Test)",
          "MP JEE (Madhya Pradesh Joint Entrance Exam)"
        ],
        "Architecture Entrance": [
          "NATA (National Aptitude Test in Architecture)",
          "JEE Main Paper 2 (B.Arch)",
          "AAT (Architecture Aptitude Test - After JEE Advanced)"
        ],
        "MEDICAL ENTRANCE EXAMS - INDIA": [
          "NEET UG (Undergraduate)",
          "NEET PG (Postgraduate)",
          "NEET SS (Super Specialty)",
          "NEET MDS (Master of Dental Surgery)",
          "AIIMS Nursing",
          "INI CET (Institute of National Importance Combined Entrance Test)",
          "Allied Medical & Paramedical",
          "JIPMER Nursing",
          "BHU Nursing",
          "PGIMER Nursing",
          "AIIMS B.Sc Nursing",
          "State Paramedical Entrance Exams",
          "Pharmacy Entrance Exams"
        ],
        "Physiotherapy Entrance Exams": [],
        "2.4 MANAGEMENT ENTRANCE EXAMS - INDIA": [
          "National Level MBA/PGDM",
          "CAT (Common Admission Test) - IIMS",
          "XAT (Xavier Aptitude Test)",
          "CMAT (Common Management Admission Test)",
          "MAT (Management Aptitude Test)",
          "ATMA (AIMS Test for Management Admissions)",
          "NMAT by GMAC (Narsee Monjee)",
          "SNAP (Symbiosis National Aptitude Test)",
          "IIFT (Indian Institute of Foreign Trade)",
          "TISSNET (Tata Institute of Social Sciences)",
          "MICAT (MICA Admission Test)",
          "IBSAT (ICFAI Business School Aptitude Test)",
          "Integrated & UG Management",
          "IPMAT (IIM Indore & Rohtak)",
          "NPAT (NMIMS Programs After Twelfth)",
          "SET (Symbiosis Entrance Test)",
          "Christ University Entrance",
          "DU JAT (Delhi University Joint Admission Test)"
        ],
        "LAW ENTRANCE EXAMS - INDIA": [
          "CLAT (Common Law Admission Test) - UG & PG",
          "AILET (All India Law Entrance Test) - NLU Delhi",
          "LSAT India (Law School Admission Test)",
          "SLAT (Symbiosis Law Admission Test)",
          "Christ University Law Entrance",
          "IPU CET (Guru Gobind Singh Indraprastha University)",
          "Jindal Global Law School Entrance",
          "BLAT (Bennett Law Aptitude Test)",
          "DU LLB Entrance",
          "BHU UET (Law)",
          "AMU Law Entrance",
          "Jamia Millia Islamia Law Entrance"
        ],
        "DESIGN & CREATIVE ENTRANCE EXAMS - INDIA": [
          "UCEED (Undergraduate Common Entrance Exam for Design) - IIT",
          "CEED (Common Entrance Exam for Design) - IIT Postgraduate",
          "NID DAT (National Institute of Design - Design Aptitude Test)",
          "NIFT Entrance Exam",
          "PEARL (Pearl Academy Entrance Exam)",
          "SEED (Srishti Entrance Exam for Design)",
          "MIT Institute of Design Entrance",
          "Symbiosis Institute of Design Entrance",
          "FDDI (Footwear Design & Development Institute)",
          "AIFD (Army Institute of Fashion & Design)",
          "NIFT",
          "NID",
          "IIAD (Indian Institute of Art & Design)",
          "Arch Academy Entrance",
          "JJ School of Applied Art Entrance"
        ],
        "HOTEL MANAGEMENT & HOSPITALITY EXAMS - INDIA": [
          "NCHMCT JEE (National Council for Hotel Management Joint Entrance Exam)",
          "IHM Entrance Exams (State-wise)",
          "AIMA UGAT (Hotel Management)",
          "WIHM Entrance",
          "BHM Entrance (Various Universities)"
        ],
        "2.8 MASS COMMUNICATION & JOURNALISM - INDIA": [
          "IIMC Entrance (Indian Institute of Mass Communication)",
          "JMI Mass Communication Entrance",
          "DUET (Delhi University) - Journalism",
          "Symbiosis Entrance (Mass Communication)",
          "Xavier Institute of Communication Entrance",
          "Asian College of Journalism (ACJ)",
          "IP University CET (Mass Communication)"
        ],
        "OTHER PROFESSIONAL ENTRANCE EXAMS - INDIA": [
          "NIMCET (NIT MCA Common Entrance Test)",
          "BIT MCA Entrance",
          "VIT MCA Entrance",
          "IPU CET (MCA)",
          "State University MCA Entrances",
          "IGRUA (Indira Gandhi Rashtriya Uran Akademi)",
          "NDA (for Indian Air Force)",
          "Pilot Training Entrance Exams",
          "Cabin Crew Entrance",
          "ICAR AIEEA (UG & PG)",
          "State Agriculture University Entrances",
          "Veterinary Entrance Exams",
          "GPAT (Graduate Pharmacy Aptitude Test)",
          "State Pharmacy Entrance Exams",
          "TISS NET (Tata Institute of Social Sciences)",
          "DU Entrance (Social Work)",
          "IGNOU MSW Entrance",
          "UGC NET (Library & Information Science)"
        ],
        "2.10 SCHOOL/FOUNDATION LEVEL EXAMS - INDIA": [
          "National Science Olympiad (NSO)",
          "National Cyber Olympiad (NCO)",
          "International Mathematics Olympiad (IMO)",
          "International English Olympiad (IEO)",
          "Science Olympiad Foundation (SOF) Exams",
          "NTSE (National Talent Search Examination)",
          "KVPY (Kishore Vaigyanik Protsahan Yojana)",
          "NMMS (National Means cum Merit Scholarship)",
          "JSTSE (Junior Science Talent Search Examination)",
          "NTSE",
          "NMMS",
          "INSPIRE",
          "Pre-RMO (Regional Mathematical Olympiad)",
          "RMO",
          "INMO (Indian National Mathematical Olympiad)",
          "Sainik School Entrance (AISSEE)",
          "Jawahar Navodaya Vidyalaya Selection Test (JNVST)",
          "Army Public School Entrance",
          "Delhi Public School Entrance",
          "Various Private School Entrances"
        ],
        "INTERNATIONAL EXAMS": [
          "IELTS (International English Language Testing System)",
          "TOEFL (Test of English as a Foreign Language)",
          "PTE (Pearson Test of English)",
          "Duolingo English Test",
          "Cambridge English Exams (FCE, CAE, CPE)",
          "GRE (Graduate Record Examination)",
          "GMAT (Graduate Management Admission Test)",
          "SAT (Scholastic Assessment Test)",
          "ACT (American College Testing)",
          "MCAT (Medical College Admission Test)",
          "LSAT (Law School Admission Test - US)",
          "PCAT (Pharmacy College Admission Test)",
          "DAT (Dental Admission Test)",
          "OAT (Optometry Admission Test)",
          "AP (Advanced Placement) Exams",
          "IB (International Baccalaureate) Preparation",
          "CFA (Chartered Financial Analyst)",
          "FRM (Financial Risk Manager)",
          "ACCA (Association of Chartered Certified Accountants)",
          "CPA (Certified Public Accountant - US)",
          "CMA (Certified Management Accountant - US)",
          "CIA (Certified Internal Auditor)",
          "CISA (Certified Information Systems Auditor)",
          "PMP (Project Management Professional)",
          "PRINCE2",
          "ITIL",
          "CEH (Certified Ethical Hacker)",
          "CISSP (Certified Information Systems Security Professional)"
        ]
      }
    },
      "Upskilling": {
        domains: [
          "Programming Languages",
          "Web Development",
          "Mobile App Development",
          "Database & Backend",
          "DevOps & Cloud",
          "Data Science & Analytics",
          "Artificial Intelligence & Machine Learning",
          "Cyber Security",
          "Blockchain & Emerging Tech",
          "Software Testing & QA",
          "UI/UX & Design Tech",
          "IT Management & Architecture",
          "Game Development",
          "Specialized IT Areas",
          "Graphic Design & Visual Arts",
          "Video & Motion Graphics",
          "Photography",
          "Music & Audio",
          "Beauty & Wellness",
          "Fashion & Styling",
          "Marketing & Sales",
          "Business Management",
          "Finance & Accounting",
          "Human Resources",
          "Supply Chain & Logistics",
          "Language Learning",
          "Communication & Soft Skills",
          "Health & Fitness",
          "Culinary Arts & Food",
          "Performing Arts",
          "Craft & DIY",
          "Interior Design & Home Decor",
          "Event Management & Hospitality",
          "Automobile & Mechanics",
          "Other Vocational Skills",
          "Real Estate",
          "Agriculture & Farming",
          "Pet Care"
        ],
        subDomains: {
          "Programming Languages": [
            "Python Programming",
            "Java Programming",
            "C Programming",
            "C++ Programming",
            "C# Programming",
            "JavaScript",
            "TypeScript",
            "Ruby",
            "PHP",
            "Go (Golang)",
            "Rust",
            "Kotlin",
            "Swift",
            "Objective-C",
            "Scala",
            "Perl",
            "R Programming",
            "MATLAB",
            "Julia"
          ],
          "Web Development": [
            "HTML5 & CSS3",
            "Frontend Development",
            "Backend Development",
            "Full Stack Development",
            "React.js",
            "Angular",
            "Vue.js",
            "Node.js",
            "Express.js",
            "Django",
            "Flask",
            "Ruby on Rails",
            "ASP.NET",
            "Laravel",
            "WordPress Development",
            "Shopify Development",
            "Responsive Web Design",
            "Progressive Web Apps (PWA)",
            "Web Performance Optimization"
          ],
          "Mobile App Development": [
            "Android Development",
            "iOS Development",
            "React Native",
            "Flutter",
            "Ionic",
            "Xamarin",
            "Cross-Platform Development",
            "Mobile UI/UX Design",
            "App Store Optimization"
          ],
          "Database & Backend": [
            "SQL & Database Management",
            "MySQL",
            "PostgreSQL",
            "MongoDB",
            "Oracle Database",
            "Microsoft SQL Server",
            "Redis",
            "Cassandra",
            "DynamoDB",
            "Firebase",
            "Database Design & Architecture",
            "Database Administration (DBA)"
          ],
          "DevOps & Cloud": [
            "DevOps Fundamentals",
            "Docker & Containerization",
            "Kubernetes",
            "Jenkins",
            "Git & GitHub",
            "GitLab CI/CD",
            "AWS (Amazon Web Services)",
            "Microsoft Azure",
            "Google Cloud Platform (GCP)",
            "Cloud Architecture",
            "Infrastructure as Code (Terraform, Ansible)",
            "Linux Administration",
            "Server Management",
            "Microservices Architecture"
          ],
          "Data Science & Analytics": [
            "Data Science Fundamentals",
            "Data Analysis",
            "Data Visualization",
            "Business Intelligence (BI)",
            "Tableau",
            "Power BI",
            "Excel Advanced & Data Analytics",
            "Google Data Analytics",
            "Statistical Analysis",
            "Predictive Analytics",
            "Big Data Analytics",
            "Apache Hadoop",
            "Apache Spark",
            "Data Engineering",
            "ETL (Extract, Transform, Load)",
            "SQL for Data Analysis"
          ],
          "Artificial Intelligence & Machine Learning": [
            "Machine Learning Fundamentals",
            "Deep Learning",
            "Neural Networks",
            "Computer Vision",
            "Natural Language Processing (NLP)",
            "AI & ML with Python",
            "TensorFlow",
            "PyTorch",
            "Scikit-learn",
            "Keras",
            "Reinforcement Learning",
            "GANs (Generative Adversarial Networks)",
            "MLOps",
            "AI Ethics"
          ],
          "Cyber Security": [
            "Ethical Hacking",
            "Penetration Testing",
            "Network Security",
            "Information Security",
            "Cyber Security Fundamentals",
            "CEH (Certified Ethical Hacker) Prep",
            "CISSP Prep",
            "Security+",
            "Web Application Security",
            "Cloud Security",
            "Malware Analysis",
            "Digital Forensics",
            "Incident Response",
            "Security Operations Center (SOC)",
            "Cryptography"
          ],
          "Blockchain & Emerging Tech": [
            "Blockchain Fundamentals",
            "Cryptocurrency & Bitcoin",
            "Ethereum & Smart Contracts",
            "Solidity Programming",
            "Web3 Development",
            "NFT Development",
            "DeFi (Decentralized Finance)",
            "Blockchain for Business"
          ],
          "Software Testing & QA": [
            "Manual Testing",
            "Automation Testing",
            "Selenium",
            "Appium",
            "TestNG",
            "JUnit",
            "API Testing",
            "Performance Testing (JMeter, LoadRunner)",
            "Quality Assurance (QA)",
            "Test-Driven Development (TDD)"
          ],
          "UI/UX & Design Tech": [
            "UI/UX Design",
            "Figma",
            "Adobe XD",
            "Sketch",
            "InVision",
            "Wireframing & Prototyping",
            "User Research",
            "Usability Testing",
            "Design Thinking",
            "Product Design"
          ],
          "IT Management & Architecture": [
            "IT Project Management",
            "Agile & Scrum",
            "Software Architecture",
            "System Design",
            "Enterprise Architecture",
            "ITIL",
            "SAP",
            "Salesforce",
            "ServiceNow"
          ],
          "Game Development": [
            "Unity Game Development",
            "Unreal Engine",
            "Game Design",
            "3D Game Development",
            "Mobile Game Development",
            "VR/AR Game Development"
          ],
          "Specialized IT Areas": [
            "Internet of Things (IoT)",
            "Augmented Reality (AR)",
            "Virtual Reality (VR)",
            "Quantum Computing",
            "Edge Computing",
            "5G Technology",
            "Robotics Programming",
            "Embedded Systems"
          ],
          "Graphic Design & Visual Arts": [
            "Graphic Design Fundamentals",
            "Adobe Photoshop",
            "Adobe Illustrator",
            "CorelDRAW",
            "Adobe InDesign",
            "Canva for Professionals",
            "Logo Design",
            "Brand Identity Design",
            "Print Design",
            "Packaging Design",
            "Typography",
            "Color Theory",
            "Digital Illustration",
            "Vector Art",
            "Photo Editing & Retouching"
          ],
          "Video & Motion Graphics": [
            "Video Editing",
            "Adobe Premiere Pro",
            "Final Cut Pro",
            "DaVinci Resolve",
            "After Effects",
            "Motion Graphics",
            "Animation",
            "2D Animation",
            "3D Animation (Blender, Maya, 3ds Max)",
            "VFX (Visual Effects)",
            "Cinematography",
            "Video Production",
            "YouTube Video Creation",
            "Short Film Making"
          ],
          "Photography": [
            "Photography Fundamentals",
            "Digital Photography",
            "Portrait Photography",
            "Wedding Photography",
            "Product Photography",
            "Fashion Photography",
            "Wildlife Photography",
            "Landscape Photography",
            "Street Photography",
            "Food Photography",
            "Real Estate Photography",
            "Drone Photography",
            "Photo Editing (Lightroom)",
            "Studio Lighting",
            "Commercial Photography"
          ],
          "Music & Audio": [
            "Music Production",
            "Audio Engineering",
            "Sound Design",
            "Music Composition",
            "Digital Audio Workstation (Logic Pro, Ableton, FL Studio)",
            "Mixing & Mastering",
            "Voice Over Training",
            "Podcast Production",
            "Singing/Vocal Training",
            "Guitar/Piano/Drums (Various Instruments)",
            "Music Theory",
            "DJ Training"
          ],
          "Beauty & Wellness": [
            "Professional Makeup Artistry",
            "Bridal Makeup",
            "HD Makeup",
            "Special Effects Makeup",
            "Hair Styling",
            "Hair Cutting & Coloring",
            "Nail Art & Manicure",
            "Cosmetology",
            "Beauty Therapy",
            "Spa Therapy",
            "Massage Therapy",
            "Aromatherapy",
            "Skincare Specialist",
            "Permanent Makeup (Microblading)",
            "Eyelash Extensions"
          ],
          "Fashion & Styling": [
            "Fashion Design",
            "Fashion Illustration",
            "Pattern Making",
            "Garment Construction",
            "Fashion Styling",
            "Personal Styling",
            "Image Consulting",
            "Wardrobe Consulting",
            "Fashion Merchandising",
            "Textile Design"
          ],
          "Marketing & Sales": [
            "Digital Marketing",
            "Social Media Marketing",
            "Content Marketing",
            "Email Marketing",
            "SEO (Search Engine Optimization)",
            "SEM (Search Engine Marketing)",
            "Google Ads",
            "Facebook Ads",
            "Instagram Marketing",
            "LinkedIn Marketing",
            "Influencer Marketing",
            "Affiliate Marketing",
            "Growth Hacking",
            "Marketing Analytics",
            "Brand Management",
            "Public Relations (PR)",
            "Sales Techniques",
            "B2B Sales",
            "Negotiation Skills",
            "Customer Relationship Management (CRM)"
          ],
          "Business Management": [
            "Business Strategy",
            "Business Development",
            "Operations Management",
            "Project Management (PMP, PRINCE2)",
            "Entrepreneurship",
            "Startup Management",
            "Business Planning",
            "Lean Management",
            "Six Sigma",
            "Change Management",
            "Risk Management",
            "Strategic Planning"
          ],
          "Finance & Accounting": [
            "Financial Analysis",
            "Financial Modeling",
            "Investment Banking",
            "Equity Research",
            "Portfolio Management",
            "Personal Finance",
            "Wealth Management",
            "Tax Planning",
            "Bookkeeping",
            "QuickBooks",
            "Tally",
            "GST (Goods & Services Tax)",
            "Accounting Fundamentals",
            "Corporate Finance"
          ],
          "Human Resources": [
            "HR Management",
            "Talent Acquisition & Recruitment",
            "Employee Relations",
            "Performance Management",
            "Compensation & Benefits",
            "HR Analytics",
            "Organizational Development",
            "Training & Development",
            "Labour Laws",
            "Payroll Management"
          ],
          "Supply Chain & Logistics": [
            "Supply Chain Management",
            "Logistics Management",
            "Inventory Management",
            "Warehouse Management",
            "Procurement",
            "Import Export Management",
            "Custom Clearance"
          ],
          "Language Learning": [
            "English Speaking & Communication",
            "IELTS Preparation",
            "TOEFL Preparation",
            "PTE Preparation",
            "Business English",
            "French Language",
            "German Language",
            "Spanish Language",
            "Mandarin Chinese",
            "Japanese Language",
            "Korean Language",
            "Arabic Language",
            "Italian Language",
            "Portuguese Language",
            "Russian Language",
            "Dutch Language",
            "Hindi for Foreigners",
            "Sanskrit Language"
          ],
          "Communication & Soft Skills": [
            "Public Speaking",
            "Presentation Skills",
            "Business Communication",
            "Email Writing",
            "Report Writing",
            "Technical Writing",
            "Creative Writing",
            "Copywriting",
            "Content Writing",
            "Blogging",
            "Storytelling",
            "Interpersonal Skills",
            "Leadership Skills",
            "Team Management",
            "Time Management",
            "Emotional Intelligence",
            "Conflict Resolution",
            "Critical Thinking",
            "Problem Solving",
            "Decision Making"
          ],
          "Health & Fitness": [
            "Personal Training",
            "Yoga Teacher Training (200hr, 500hr)",
            "Pilates Instructor",
            "Zumba Instructor",
            "Aerobics Instructor",
            "CrossFit Training",
            "Nutrition & Diet Planning",
            "Sports Nutrition",
            "Weight Loss Coaching",
            "Fitness Coaching",
            "Strength & Conditioning",
            "Meditation & Mindfulness",
            "Pranayama",
            "Reiki Healing",
            "Alternative Therapy"
          ],
          "Culinary Arts & Food": [
            "Cooking Classes (Various Cuisines)",
            "Baking & Pastry",
            "Cake Decorating",
            "Chocolate Making",
            "Indian Cuisine",
            "Chinese Cuisine",
            "Italian Cuisine",
            "Continental Cuisine",
            "Bakery Management",
            "Food Styling & Photography",
            "Barista Training",
            "Bartending",
            "Wine Sommelier",
            "Food Safety & Hygiene"
          ],
          "Performing Arts": [
            "Acting",
            "Theatre Arts",
            "Dance (Classical/Contemporary)",
            "Bharatanatyam",
            "Kathak",
            "Hip Hop Dance",
            "Salsa",
            "Ballet",
            "Stage Performance",
            "Stand-up Comedy",
            "Improv Comedy",
            "Mimicry & Voice Modulation"
          ],
          "Craft & DIY": [
            "Handmade Jewelry Making",
            "Pottery & Ceramics",
            "Candle Making",
            "Soap Making",
            "Paper Crafts",
            "Origami",
            "Crochet & Knitting",
            "Embroidery",
            "Painting (Oil, Acrylic, Watercolor)",
            "Sketching & Drawing",
            "Calligraphy",
            "Rangoli & Mandala Art",
            "Resin Art",
            "Macrame"
          ],
          "Interior Design & Home Decor": [
            "Interior Design",
            "Interior Decoration",
            "Vastu Shastra",
            "Feng Shui",
            "Furniture Design",
            "3D Visualization (SketchUp, 3ds Max)",
            "AutoCAD for Interiors",
            "Home Staging"
          ],
          "Event Management & Hospitality": [
            "Event Planning & Management",
            "Wedding Planning",
            "Corporate Event Management",
            "Hotel Management",
            "Front Office Operations",
            "Housekeeping Management",
            "Food & Beverage Service",
            "Hospitality Management"
          ],
          "Automobile & Mechanics": [
            "Car Driving",
            "Bike Riding",
            "Automobile Repair & Maintenance",
            "Two-Wheeler Mechanics",
            "Four-Wheeler Mechanics",
            "Electrical Vehicle Training",
            "Diesel Mechanics"
          ],
          "Other Vocational Skills": [
            "Tailoring & Stitching",
            "Garment Making",
            "Screen Printing",
            "Mobile Repairing",
            "Computer Hardware",
            "AC & Refrigeration Repair",
            "Electrical Work",
            "Plumbing",
            "Carpentry",
            "Welding",
            "Painting (Walls)",
            "Tile Fitting",
            "Security Guard Training",
            "Housekeeping",
            "Patient Care Attendant",
            "First Aid & CPR"
          ],
          "Real Estate": [
            "Real Estate Sales",
            "Property Management",
            "Real Estate Investment",
            "Real Estate Marketing",
            "RERA Compliance"
          ],
          "Agriculture & Farming": [
            "Organic Farming",
            "Hydroponics",
            "Terrace Gardening",
            "Mushroom Cultivation",
            "Vermicomposting",
            "Beekeeping",
            "Poultry Farming",
            "Dairy Farming"
          ],
          "Pet Care": [
            "Dog Training",
            "Pet Grooming",
            "Pet Care & Management",
            "Veterinary Assistant"
          ]
        }
      }
};

interface CoachingCourseFormProps {
  currentCourse: Course;
  handleCourseChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  courses: Course[];
  selectedCourseId: number;
  // ✅ Add courseErrors prop to receive validation errors
  courseErrors?: Record<string, string>; 
  labelVariant?: 'course' | 'program';

}

export default function CoachingCourseForm({
  currentCourse,
  handleCourseChange,
  setCourses,
  courses,
  selectedCourseId,
  // ✅ Destructure courseErrors with a default empty object
  courseErrors = {},
  labelVariant = 'course',
}: CoachingCourseFormProps) {
  
  // Get available domains based on selected category (pure in-memory)
  const availableDomains = useMemo(() => {
    if (!currentCourse.categoriesType) return [];
    const cat = currentCourse.categoriesType as keyof typeof CATEGORY_DOMAIN_MAPPING;
    return CATEGORY_DOMAIN_MAPPING[cat]?.domains || [];
  }, [currentCourse.categoriesType]);

  // Get available sub-domains based on selected category and domain
  const availableSubDomains = useMemo(() => {
    if (!currentCourse.categoriesType || !currentCourse.domainType) return [];
    const cat = currentCourse.categoriesType as keyof typeof CATEGORY_DOMAIN_MAPPING;
    const categoryData = CATEGORY_DOMAIN_MAPPING[cat];
    return categoryData?.subDomains[currentCourse.domainType as keyof typeof categoryData.subDomains] || [];
  }, [currentCourse.categoriesType, currentCourse.domainType]);

  // Handle category change and reset dependent fields
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const newCategory = e.target.value;
    
    // Update the course with new category and reset dependent fields
    setCourses(courses.map(course => 
      course.id === selectedCourseId 
        ? { 
            ...course, 
            categoriesType: newCategory,
            domainType: '', // Reset domain when category changes
            subDomainType: '' // Reset sub-domain when category changes
          }
        : course
    ));
  };

  // Handle domain change and reset sub-domain
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const newDomain = e.target.value;
    
    // Update the course with new domain and reset sub-domain
    setCourses(courses.map(course => 
      course.id === selectedCourseId 
        ? { 
            ...course, 
            domainType: newDomain,
            subDomainType: '' // Reset sub-domain when domain changes
          }
        : course
    ));
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <InputField
        label="Categories type"
        name="categoriesType"
        value={currentCourse.categoriesType}
        onChange={handleCategoryChange}
        isSelect
        options={[
          "Exam Preparation",
          "Upskilling"
        ]}
        placeholder="Select Categories type"
        required
        // ✅ Display validation error for this field
        error={courseErrors.categoriesType}
      />

      <SearchableSelect
        label="Domain type"
        name="domainType"
        value={currentCourse.domainType}
        onChange={handleDomainChange}
        options={availableDomains}
        placeholder="Select domain type"
        required
        disabled={!currentCourse.categoriesType}
        error={courseErrors.domainType}
      />
      
      <SearchableSelect
        label="Sub-Domain type"
        name="subDomainType"
        value={currentCourse.subDomainType}
        onChange={handleCourseChange}
        options={availableSubDomains}
        placeholder="Select sub-domain type"
        required
        disabled={!currentCourse.domainType}
        error={courseErrors.subDomainType}
      />

      <InputField
        label={labelVariant === 'program' ? 'Program name' : 'Course name'}
        name="courseName"
        value={currentCourse.courseName}
        onChange={handleCourseChange}
        placeholder={labelVariant === 'program' ? 'Enter program name' : 'Enter course name'}
        required
        // ✅ Display validation error for this field
        error={courseErrors.courseName}
      />

      <div className="flex flex-col gap-2 dark:bg-gray-50">
        <label className="font-medium text-[16px] ">Mode</label>
        <SlidingIndicator
          options={["Offline", "Online", "Hybrid"] as const}
          activeOption={currentCourse.mode}
          onOptionChange={(mode) =>
            setCourses(
              courses.map((course) =>
                course.id === selectedCourseId ? { ...course, mode } : course
              )
            )
          }
          size="md"
        />
         {/* You can add a text element here for errors if SlidingIndicator doesn't support it */}
         {courseErrors.mode && <p className="text-sm text-red-500">{courseErrors.mode}</p>}
      </div>

      <InputField
        label={labelVariant === 'program' ? 'Program Duration' : 'Course Duration'}
        name="courseDuration"
        value={currentCourse.courseDuration}
        onChange={handleCourseChange}
        placeholder="e.g, 3 months"
        required
        // ✅ Display validation error for this field
        error={courseErrors.courseDuration}
      />

      <InputField
        label={labelVariant === 'program' ? "Program Start Date" : "Course Start Date"}
        name="startDate"
        value={currentCourse.startDate}
        onChange={handleCourseChange}
        type="date"
        error={courseErrors.startDate}
        required
      />

      <InputField
        label={labelVariant === 'program' ? "Program End Date" : "Course End Date"}
        name="endDate"
        value={currentCourse.endDate}
        onChange={handleCourseChange}
        type="date"
        error={courseErrors.endDate}
        required
      />

      <InputField
        label={labelVariant === 'program' ? 'Price of Program' : 'Price of Course'}
        name="priceOfCourse"
        value={currentCourse.priceOfCourse}
        onChange={handleCourseChange}
        placeholder={labelVariant === 'program' ? 'Enter Program price' : 'Enter Course price'}
        type="number"
        required
        // ✅ Display validation error for this field
        error={courseErrors.priceOfCourse}
      />

      <InputField
        label="Location"
        name="location"
        value={currentCourse.location}
        onChange={handleCourseChange}
        placeholder="Enter a valid URL (e.g., https://...)"
        required
        // ✅ Display validation error for this field
        error={courseErrors.location}
      />

      <InputField
        label="Class size"
        name="classSize"
        value={currentCourse.classSize}
        onChange={handleCourseChange}
        placeholder="Enter no of students per class"
        type="number"
        // ✅ Display validation error for this field
        error={courseErrors.classSize}
      />
      <InputField
        label={labelVariant === 'program' ? 'Program Highlights' : 'Course Highlights'}
        name="courseHighlights"
        value={currentCourse.courseHighlights}
        onChange={handleCourseChange}
        placeholder="e.g., Weekly Mock Tests, Expert Faculty"
        required
        // ✅ Display validation error for this field
        error={courseErrors.courseHighlights}
      />
    </div>
  );
}