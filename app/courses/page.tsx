"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export interface CertificateCourse {
  id: string;
  code: string;
  title: string;
  hindiTitle: string;
  category: "Diagnostics & Lab" | "Radiology & Imaging" | "Clinical & OT Care" | "Community & Primary Health" | "Specialized Care";
  duration: string;
  eligibility: string;
  mode: string;
  description: string;
  careerScope: string[];
  isFeatured?: boolean;
}

export const CERTIFICATE_COURSES_DATA: CertificateCourse[] = [
  {
    id: "cmsed",
    code: "CMS & ED",
    title: "Community Medical Services & Essential Drugs",
    hindiTitle: "कम्युनिटी मेडिकल सर्विसेज एवं एसेंशियल ड्रग्स",
    category: "Community & Primary Health",
    duration: "1 Year / 18 Months",
    eligibility: "10th / 10+2 Pass",
    mode: "Theory + Primary Healthcare & First Aid Practice",
    description: "Prepares primary healthcare workers for delivering primary treatment, essential drug guidance, and preventive health education in rural areas.",
    careerScope: ["Rural First Aid Centers", "Primary Healthcare Clinics", "NGO Health Outreaches", "Community Medical Posts"],
    isFeatured: true,
  },
  {
    id: "cmlt",
    code: "CMLT",
    title: "Certificate in Medical Laboratory Technology",
    hindiTitle: "मेडिकल लैबोरेट्री टेक्नोलॉजी में सर्टिफिकेट",
    category: "Diagnostics & Lab",
    duration: "1 Year / 2 Year",
    eligibility: "10th / 10+2 Pass",
    mode: "Theory + Hands-on Clinical Lab Practical",
    description: "Equips students with comprehensive skills to perform clinical blood tests, pathology screening, microbiology, and biochemical assays in medical labs.",
    careerScope: ["Pathology Diagnostic Centers", "Hospital Clinical Laboratories", "Blood Sample Collection Units", "Research Centers"],
  },
  {
    id: "cott",
    code: "COTT",
    title: "Certificate in Operation Theatre Technology",
    hindiTitle: "ऑपरेशन थियेटर टेक्नोलॉजी में सर्टिफिकेट",
    category: "Clinical & OT Care",
    duration: "1 Year / 2 Year",
    eligibility: "10th / 10+2 Pass",
    mode: "Theory + Live OT Assisting Training",
    description: "Prepares healthcare technicians to manage surgical equipment, sterilization, patient preparation, and assist surgeons during operations.",
    careerScope: ["Hospital Operation Theatres", "Surgical Intensive Care Units (ICU)", "Emergency Surgical Departments", "Multi-Speciality Hospitals"],
  },
  {
    id: "cdt",
    code: "CDT",
    title: "Certificate in Dialysis Technician",
    hindiTitle: "डायलिसिस तकनीशियन में सर्टिफिकेट",
    category: "Clinical & OT Care",
    duration: "1 Year",
    eligibility: "10+2 (Science / Any)",
    mode: "Theory + Hemodialysis Clinical Training",
    description: "Specialized training in operating and maintaining hemodialysis machines, monitoring renal failure patients, and ensuring dialyzer sterilization.",
    careerScope: ["Renal Care & Nephrology Centers", "Dialysis Units in Hospitals", "Critical Kidney Care Centers", "Transplant Support Units"],
  },
  {
    id: "cgda",
    code: "CGDA",
    title: "Certificate in General Duty Assistant",
    hindiTitle: "जनरल ड्यूटी असिस्टेंट में सर्टिफिकेट",
    category: "Clinical & OT Care",
    duration: "6 Months / 1 Year",
    eligibility: "10th Pass",
    mode: "Theory + Patient Care Practical Training",
    description: "Trains students in essential patient care, basic bedside assistance, vitals recording, and assisting nursing staff in daily clinical routines.",
    careerScope: ["Hospital In-patient Wards", "Nursing Homes & Old Age Homes", "Home Healthcare Organizations", "Community Health Centers"],
  },
  {
    id: "cecg",
    code: "CECG",
    title: "Certificate in ECG Technician",
    hindiTitle: "ईसीजी तकनीशियन में सर्टिफिकेट",
    category: "Diagnostics & Lab",
    duration: "6 Months / 1 Year",
    eligibility: "10th / 10+2 Pass",
    mode: "Theory + ECG Lead Placement & Reading",
    description: "Focuses on recording electrocardiograms (ECG), lead placement, detecting heart rhythm abnormalities, and maintaining cardiac monitoring devices.",
    careerScope: ["Cardiology Clinics & Hospitals", "Diagnostic Centers", "Cardiac Care Units (CCU)", "Emergency Rooms"],
  },
  {
    id: "cmrit",
    code: "CMRIT",
    title: "Certificate in Medical Radiology & Imaging Technology",
    hindiTitle: "मेडिकल रेडियोलॉजी एवं इमेजिंग टेक्नोलॉजी में सर्टिफिकेट",
    category: "Radiology & Imaging",
    duration: "1 Year / 2 Year",
    eligibility: "10+2 (Science)",
    mode: "Theory + Radiographic Equipment Training",
    description: "Comprehensive training in diagnostic radiography, radiation safety protocols, medical imaging techniques, and diagnostic reporting assistance.",
    careerScope: ["Radiology Centers", "Trauma & Emergency Care Units", "Government & Private Hospitals", "Orthopedic Imaging Clinics"],
  },
  {
    id: "cemt",
    code: "CEMT",
    title: "Certificate in Emergency Medical Technician",
    hindiTitle: "इमरजेंसी मेडिकल तकनीशियन में सर्टिफिकेट",
    category: "Clinical & OT Care",
    duration: "1 Year",
    eligibility: "10+2 Pass",
    mode: "Theory + Emergency Rescue & Trauma Training",
    description: "Trains paramedical responders in pre-hospital emergency care, trauma management, CPR, patient stabilization, and ambulance operations.",
    careerScope: ["Advanced Life Support Ambulances", "Emergency Trauma Centers", "Disaster Response Units", "Hospital Casualty Wards"],
  },
  {
    id: "ccce",
    code: "CCCE",
    title: "Certificate in Child Care & Education",
    hindiTitle: "चाइल्ड केयर एवं एजुकेशन में सर्टिफिकेट",
    category: "Specialized Care",
    duration: "1 Year",
    eligibility: "10th / 10+2 Pass",
    mode: "Theory + Pediatric Care & Nutrition Training",
    description: "Covers early childhood physical health, nutritional management, infant care routines, vaccination schedules, and developmental support.",
    careerScope: ["Pediatric Care Clinics", "Maternity & Child Health Centers", "Child Daycare Organizations", "Community Nutrition Programs"],
  },
  {
    id: "firstaid",
    code: "First Aid & CPR",
    title: "Certificate in First Aid & CPR",
    hindiTitle: "फर्स्ट एड एवं सीपीआर में सर्टिफिकेट",
    category: "Community & Primary Health",
    duration: "6 Months / 1 Year",
    eligibility: "10th Pass",
    mode: "Practical Life-Support & CPR Drills",
    description: "Hands-on instruction in immediate life-saving techniques, Cardiopulmonary Resuscitation (CPR), wound control, fracture stabilization, and choking relief.",
    careerScope: ["Industrial Health & Safety Units", "Educational & Corporate Facilities", "Sports & Fitness Centers", "Disaster Relief Organizations"],
  },
  {
    id: "cbbt",
    code: "CBBT",
    title: "Certificate in Blood Bank Technology",
    hindiTitle: "ब्लड बैंक टेक्नोलॉजी में सर्टिफिकेट",
    category: "Diagnostics & Lab",
    duration: "1 Year",
    eligibility: "10+2 (Science)",
    mode: "Theory + Blood Processing & Storage Practice",
    description: "Training in blood grouping, cross-matching, donor screening, component separation (RBC, Platelets, Plasma), and cold storage management.",
    careerScope: ["Hospital Blood Banks", "Red Cross & Independent Blood Centers", "Hematology Laboratories", "Transfusion Medicine Centers"],
  },
  {
    id: "cmhw",
    code: "CMHW",
    title: "Certificate in Multipurpose Health Worker",
    hindiTitle: "मल्टीपर्पज हेल्थ वर्कर में सर्टिफिकेट",
    category: "Community & Primary Health",
    duration: "1 Year",
    eligibility: "10th Pass",
    mode: "Theory + Field Healthcare Training",
    description: "Prepares health workers for epidemic control, vaccination campaigns, maternal-child health monitoring, and family welfare initiatives.",
    careerScope: ["Primary Health Centers (PHC)", "Community Health Posts", "Public Health Outreach Missions", "Rural Dispensaries"],
  },
  {
    id: "cdth",
    code: "CDTH",
    title: "Certificate in Dental Technician & Hygienist",
    hindiTitle: "डेंटल तकनीशियन एवं हाइजीनिस्ट में सर्टिफिकेट",
    category: "Specialized Care",
    duration: "1 Year",
    eligibility: "10th / 10+2 Pass",
    mode: "Theory + Dental Chair & Lab Practice",
    description: "Instruction in dental sterilization, oral hygiene assistance, dental prosthesis preparation, cast model fabrication, and equipment handling.",
    careerScope: ["Private Dental Clinics", "Dental Colleges & Hospitals", "Dental Prosthetics Laboratories", "Oral Care Centers"],
  },
  {
    id: "cxray",
    code: "Cert. X-ray",
    title: "Certificate in X-ray Technician",
    hindiTitle: "एक्स-रे तकनीशियन में सर्टिफिकेट",
    category: "Radiology & Imaging",
    duration: "1 Year",
    eligibility: "10+2 (Science / Any)",
    mode: "Theory + X-ray Positioning & Darkroom Practice",
    description: "Trains candidates in operating stationary and portable X-ray equipment, digital radiography (DR/CR), patient positioning, and film processing.",
    careerScope: ["X-Ray Imaging Centers", "Orthopedic & Trauma Hospitals", "Government Radiography Clinics", "Diagnostic Labs"],
  },
  {
    id: "cu",
    code: "CU",
    title: "Certificate in Ultrasonography Technician",
    hindiTitle: "अल्ट्रासोनोग्राफी में सर्टिफिकेट",
    category: "Radiology & Imaging",
    duration: "1 Year",
    eligibility: "10+2 (Science) / Allied Health",
    mode: "Theory + Sonography Machine Operations",
    description: "Focuses on ultrasound machine calibration, transducer handling, patient acoustic prep, sonography assisting, and digital image archiving.",
    careerScope: ["Sonography Diagnostic Centers", "Maternity & Fetal Imaging Units", "Abdominal Ultrasound Centers", "Multi-speciality Imaging Wards"],
  },
  {
    id: "cpt",
    code: "CPT",
    title: "Certificate in Phlebotomy Technology",
    hindiTitle: "फ्लेबोटोमी टेक्नोलॉजी में सर्टिफिकेट",
    category: "Diagnostics & Lab",
    duration: "6 Months / 1 Year",
    eligibility: "10th / 10+2 Pass",
    mode: "Practical Blood Venipuncture & Safety Drills",
    description: "Hands-on specialized training in sterile venipuncture, capillary blood drawing, vacutainer selection, sample barcoding, and biosafety protocols.",
    careerScope: ["Commercial Diagnostic Chains", "Hospital Blood Collection Centers", "Pathology Laboratories", "Home Sample Collection Services"],
  },
  {
    id: "cctscan",
    code: "Cert. CT Scan",
    title: "Certificate in CT Scan Technician",
    hindiTitle: "सीटी स्कैन तकनीशियन में सर्टिफिकेट",
    category: "Radiology & Imaging",
    duration: "1 Year",
    eligibility: "10+2 (Science)",
    mode: "Theory + Computed Tomography Scanners Training",
    description: "Training in Computed Tomography (CT) operations, cross-sectional imaging, slice reconstruction, contrast media safety, and scan protocols.",
    careerScope: ["Advanced CT Imaging Centers", "Neuro-trauma Hospitals", "Diagnostic Radiology Departments", "Cancer & Oncology Imaging Centers"],
  },
  {
    id: "csi",
    code: "CSI",
    title: "Certificate in Sanitary Inspector",
    hindiTitle: "सेनेटरी इंस्पेक्टर में सर्टिफिकेट",
    category: "Specialized Care",
    duration: "1 Year",
    eligibility: "10th / 10+2 Pass",
    mode: "Theory + Environmental Sanitation Inspections",
    description: "Equips students with knowledge of public sanitation, bio-medical waste segregation, food hygiene inspection, water purity, and disease control.",
    careerScope: ["Municipal Corporations & Councils", "Hospital Sanitation Departments", "Hotel & Food Hygiene Units", "Public Health Inspectorate"],
  },
  {
    id: "cmd",
    code: "CMD",
    title: "Certificate in Medical Dressing",
    hindiTitle: "मेडिकल ड्रेसिंग में सर्टिफिकेट",
    category: "Specialized Care",
    duration: "6 Months / 1 Year",
    eligibility: "10th Pass",
    mode: "Practical Aseptic Wound Care & Bandaging",
    description: "Hands-on practical training in aseptic wound cleaning, suture removal, surgical dressing, burn care, and antiseptic handling in clinical rooms.",
    careerScope: ["Hospital Minor Operation Rooms", "Emergency Wound Care Clinics", "Nursing Homes & Dispensaries", "Post-operative Care Units"],
  },
];

const CATEGORIES = [
  "All Certificate Courses",
  "Diagnostics & Lab",
  "Radiology & Imaging",
  "Clinical & OT Care",
  "Community & Primary Health",
  "Specialized Care",
] as const;

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Certificate Courses");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filter courses based on category and search query
  const filteredCourses = useMemo(() => {
    return CERTIFICATE_COURSES_DATA.filter((course) => {
      const matchesCategory =
        selectedCategory === "All Certificate Courses" || course.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        course.title.toLowerCase().includes(q) ||
        course.code.toLowerCase().includes(q) ||
        course.hindiTitle.toLowerCase().includes(q) ||
        course.eligibility.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Header Navigation */}
      <Navbar />

      {/* Hero Banner Header */}
      <section className="w-full bg-gradient-to-r from-[#134275] via-[#0E345F] to-[#0A2545] text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-12 relative overflow-hidden border-b-4 border-[#D4AF37]">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto relative z-10">
          {/* Breadcrumb Bar */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 mb-4">
            <Link
              href="/"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <span className="text-slate-500">/</span>
            <span className="text-[#E5C158] font-semibold">Certificate Courses</span>
          </nav>

          {/* Banner Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#F1E4C3] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#E5C158] animate-pulse" />
                Industry-Recognized Programs
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-white font-sans">
                Certificate Courses
              </h1>
              <p className="text-sm sm:text-base text-slate-200 mt-2 max-w-2xl leading-relaxed">
                Skill-based, job-oriented paramedical certificate programs standardized for hospital, diagnostic laboratory, and clinical careers across India.
              </p>
            </div>

            {/* Total Courses Metric Pill */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-5 py-3 rounded-2xl flex items-center gap-4 self-start md:self-auto">
              <div className="w-12 h-12 rounded-xl bg-[#E5C158] text-[#0A2545] flex items-center justify-center font-black text-xl shadow-md">
                19
              </div>
              <div>
                <div className="text-sm font-bold text-white">Certificate Programs</div>
                <div className="text-xs text-slate-300">Standardized Curricula</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* ======================================================== */}
        {/* FEATURED COURSE SPOTLIGHT BANNER: CCMS & ED              */}
        {/* ======================================================== */}
        <section className="bg-gradient-to-br from-[#143E66] via-[#103456] to-[#0A2545] rounded-2xl p-6 sm:p-8 lg:p-9 text-white shadow-md relative overflow-hidden mb-8">
          {/* Gold Glow Accent */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
            
            {/* Left: Course Branding & Overview */}
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-slate-200 border border-white/15">
                  Course Code: CMS &amp; ED
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug">
                Community Medical Services &amp; Essential Drugs
              </h2>

              <p className="text-sm sm:text-base font-semibold text-[#F1E4C3] mt-1.5">
                कम्युनिटी मेडिकल सर्विसेज एवं एसेंशियल ड्रग्स
              </p>

              <p className="text-xs sm:text-sm text-slate-200 mt-3 leading-relaxed">
                Prepares qualified primary healthcare workers for delivering primary treatment, essential drug guidance, and preventive health services across rural and community clinics under standardized guidelines.
              </p>
            </div>

            {/* Right: 4 Fast Spec Grid Pills */}
            <div className="w-full lg:w-auto shrink-0 grid grid-cols-2 gap-3 min-w-[280px] sm:min-w-[320px]">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3">
                <span className="text-[11px] text-slate-300 block font-medium">Program Duration</span>
                <strong className="text-sm font-bold text-[#E5C158]">1 Year / 18 Months</strong>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3">
                <span className="text-[11px] text-slate-300 block font-medium">Eligibility Criteria</span>
                <strong className="text-sm font-bold text-white">10th / 10+2 Pass</strong>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3">
                <span className="text-[11px] text-slate-300 block font-medium">Practice Scope</span>
                <strong className="text-sm font-bold text-white">Rural &amp; Primary Clinics</strong>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3">
                <span className="text-[11px] text-slate-300 block font-medium">Accreditation</span>
                <strong className="text-sm font-bold text-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  IPBI Certified
                </strong>
              </div>
            </div>

          </div>
        </section>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search certificate course by name or code (e.g. CMLT, Dialysis, ECG)..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#143E66]/20 focus:border-[#143E66] transition-all"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Switcher Toggle */}
            <div className="flex items-center gap-2 self-end lg:self-auto">
              <span className="text-xs font-semibold text-slate-500 mr-1">View:</span>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#143E66] text-white border-[#143E66] shadow-2xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === "table"
                    ? "bg-[#143E66] text-white border-[#143E66] shadow-2xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Table
              </button>
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#143E66] text-white shadow-xs"
                      : "bg-[#F1F5F9] text-slate-700 hover:bg-slate-200/80"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count Bar */}
        <div className="flex items-center justify-between mb-6 text-xs sm:text-sm text-slate-600">
          <div>
            Showing <strong className="text-[#143E66]">{filteredCourses.length}</strong> of {CERTIFICATE_COURSES_DATA.length} Certificate Courses
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Certificate Courses");
              }}
              className="text-[#8B1F13] font-bold hover:underline text-xs"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: GRID CARDS VIEW                                   */}
        {/* ======================================================== */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Top Accent Strip (All Blue) */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#143E66] via-[#1E5285] to-[#2B6CB0]" />

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header: Code & Category */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-black bg-[#143E66] text-white tracking-wide shadow-2xs">
                        {course.code}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {course.category}
                      </span>
                    </div>

                    {/* Course Title (English) */}
                    <h3 className="text-base sm:text-lg font-bold text-[#143E66] leading-snug group-hover:text-[#0d2a45] transition-colors mb-1">
                      {course.title}
                    </h3>

                    {/* Course Title (Hindi) */}
                    <p className="text-xs font-medium text-[#8B1F13] mb-3.5">
                      {course.hindiTitle}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                      {course.description}
                    </p>

                    {/* Key Specs Matrix */}
                    <div className="bg-[#F8FAFC] rounded-xl p-3 space-y-2 border border-slate-100 mb-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-[#143E66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Duration:
                        </span>
                        <strong className="text-slate-800">{course.duration}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-[#8B1F13]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                          </svg>
                          Eligibility:
                        </span>
                        <strong className="text-slate-800">{course.eligibility}</strong>
                      </div>
                    </div>

                    {/* Career Scope Tags */}
                    <div className="mb-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Work Areas / Career Scope:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {course.careerScope.map((scope, idx) => (
                          <span
                            key={idx}
                            className="text-[10.5px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            • {scope}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Status & Accreditation */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      IPBI Certified
                    </span>
                    <span className="text-[10.5px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Affiliated Centers
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: TABLE LIST MATRIX VIEW                            */}
        {/* ======================================================== */}
        {viewMode === "table" && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#143E66] text-white text-xs font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Code</th>
                    <th className="py-3.5 px-4">Course Name &amp; Specialization</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Eligibility</th>
                    <th className="py-3.5 px-4">Career Scope</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredCourses.map((course, idx) => (
                    <tr
                      key={course.id}
                      className={`hover:bg-[#F8FAFC] transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      }`}
                    >
                      {/* Code */}
                      <td className="py-3.5 px-4 font-black text-[#143E66] whitespace-nowrap">
                        <span className="bg-[#143E66]/10 px-2 py-1 rounded text-xs">
                          {course.code}
                        </span>
                      </td>

                      {/* Course Title */}
                      <td className="py-3.5 px-4 max-w-[280px]">
                        <div className="font-bold text-slate-900">{course.title}</div>
                        <div className="text-[11px] text-[#8B1F13] font-medium mt-0.5">
                          {course.hindiTitle}
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        {course.duration}
                      </td>

                      {/* Eligibility */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded font-semibold text-[11px]">
                          {course.eligibility}
                        </span>
                      </td>

                      {/* Career Scope */}
                      <td className="py-3.5 px-4 text-slate-600 max-w-[220px]">
                        <div className="truncate" title={course.careerScope.join(", ")}>
                          {course.careerScope.join(", ")}
                        </div>
                      </td>

                      {/* Certification Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          IPBI Certified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-xl mb-3">
              🔍
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              No Certificate Courses Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              No courses match your current search or category filter. Try clearing the search query.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Certificate Courses");
              }}
              className="px-4 py-2 rounded-lg bg-[#143E66] text-white text-xs font-bold hover:bg-[#0d2a45] transition-colors"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* BOTTOM ADMISSION & AFFILIATION CTA STRIP                  */}
        {/* ======================================================== */}
        <section className="mt-12 bg-gradient-to-r from-[#143E66] to-[#0E345F] rounded-2xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#E5C158] border border-white/15">
                Institutional Paramedical Network
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                Want to Enroll in a Paramedical Certificate Course?
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                Candidate admissions and enrollment registrations are processed directly through authorized affiliated institutions across India.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="/about-us"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#c4a02e] text-[#00031D] font-black text-xs sm:text-sm transition-all shadow-md text-center inline-flex items-center justify-center"
              >
                Visit Us
              </Link>
              <Link
                href="/about-us"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all text-center"
              >
                Learn About Board
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
