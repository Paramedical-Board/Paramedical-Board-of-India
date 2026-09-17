"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CareerItem, CAREERS_DATA } from "@/data/careersData";

interface CareerDetailClientProps {
  career: CareerItem;
}

export default function CareerDetailClient({ career }: CareerDetailClientProps) {
  const [lang, setLang] = useState<"en" | "hi">("en");

  const isHindi = lang === "hi";
  const content = isHindi ? career.hi : career.en;
  const otherLangContent = isHindi ? career.en : career.hi;

  // Other careers for bottom explorer (excluding current)
  const otherCareers = CAREERS_DATA.filter((c) => c.slug !== career.slug);

  return (
    <main
      className={`w-full flex-grow bg-[#F8FAFC] ${isHindi ? "lang-hi" : ""}`}
      lang={lang}
    >
      {/* ===================== HERO HEADER ===================== */}
      <section className="w-full bg-gradient-to-r from-[#134275] via-[#0E345F] to-[#0A2545] text-white pt-7 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-12 relative overflow-hidden border-b-4 border-[#D4AF37]">
        {/* Subtle decorative glow circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-12 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

        <div className="max-w-[1360px] mx-auto relative z-10">
          {/* Top Bar: Breadcrumb + Language Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
              <Link
                href="/"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {isHindi ? "मुख्य पृष्ठ" : "Home"}
              </Link>
              <span className="text-slate-500">/</span>
              <span className="text-slate-300">
                {isHindi ? "करियर मार्गदर्शिका" : "Careers"}
              </span>
              <span className="text-slate-500">/</span>
              <span className="text-[#E5C158] font-semibold truncate max-w-[220px] sm:max-w-none">
                {content.title}
              </span>
            </nav>

            {/* Language Switcher Button (Option A) */}
            <div className="inline-flex items-center self-start sm:self-auto bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-md">
              <button
                onClick={() => setLang("en")}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  !isHindi
                    ? "bg-[#E5C158] text-[#0A2545] shadow-xs scale-100"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
                aria-label="Switch to English"
              >
                <span>English</span>
                {!isHindi && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0A2545]" />
                )}
              </button>
              <button
                onClick={() => setLang("hi")}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isHindi
                    ? "bg-[#E5C158] text-[#0A2545] shadow-xs scale-100"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
                aria-label="Switch to Hindi"
              >
                <span>हिंदी (Hindi)</span>
                {isHindi && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0A2545]" />
                )}
              </button>
            </div>
          </div>

          {/* Hero Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Headline & Key Intro */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#F1E4C3] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#E5C158] animate-pulse" />
                {content.badge}
              </div>

              <h1
                className={`text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-[40px] text-white leading-tight ${
                  isHindi
                    ? "font-bold tracking-normal"
                    : "font-black tracking-tight uppercase font-sans"
                }`}
              >
                {content.title}
              </h1>

              {/* Sub-title in alternate language for bilingual authenticity */}
              <p className="text-sm sm:text-base text-[#F1E4C3]/90 font-medium mt-1.5 leading-normal">
                {otherLangContent.title}
              </p>

              <p className="text-sm sm:text-base md:text-[17px] text-slate-100 mt-3 leading-relaxed font-normal max-w-2xl">
                {content.tagline}
              </p>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <Link
                  href="/courses"
                  className="px-5 py-2.5 rounded-lg bg-[#E5C158] hover:bg-[#d9b348] text-[#0A2545] font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-150 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span>{isHindi ? "कोर्सेज देखें" : "View Courses"}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link
                  href="/affiliated-institutions"
                  className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-150 backdrop-blur-sm"
                >
                  {isHindi ? "संबद्ध कॉलेज खोजें" : "Find Colleges"}
                </Link>
              </div>
            </div>

            {/* Right: Featured Photo Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl group">
                <Image
                  src={career.image}
                  alt={content.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2545]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15">
                  <span className="font-semibold">{content.title}</span>
                  <span className="text-[#E5C158] font-bold">IPBI Recognized</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Strip (Glassmorphic) */}
          <div className="mt-8 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Stat 1: Duration */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3.5 sm:p-4 text-left">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-[12.5px] font-semibold uppercase tracking-wide">
                <svg className="w-4 h-4 text-[#E5C158] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                </svg>
                <span>{isHindi ? "पाठ्यक्रम अवधि" : "Course Duration"}</span>
              </div>
              <div className="text-base sm:text-lg md:text-xl font-bold text-white mt-1">
                {isHindi ? career.stats.durationHi : career.stats.durationEn}
              </div>
            </div>

            {/* Stat 2: Eligibility */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3.5 sm:p-4 text-left">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-[12.5px] font-semibold uppercase tracking-wide">
                <svg className="w-4 h-4 text-[#E5C158] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                <span>{isHindi ? "न्यूनतम योग्यता" : "Eligibility"}</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white mt-1">
                {isHindi ? career.stats.eligibilityHi : career.stats.eligibilityEn}
              </div>
            </div>

            {/* Stat 3: Salary */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3.5 sm:p-4 text-left">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-[12.5px] font-semibold uppercase tracking-wide">
                <svg className="w-4 h-4 text-[#E5C158] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{isHindi ? "प्रारंभिक वेतन" : "Starting Salary"}</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-[#E5C158] mt-1">
                {isHindi ? career.stats.salaryHi : career.stats.salaryEn}
              </div>
            </div>

            {/* Stat 4: Demand */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3.5 sm:p-4 text-left flex flex-col justify-between">
              <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-[12.5px] font-semibold uppercase tracking-wide">
                <svg className="w-4 h-4 text-[#E5C158] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>{isHindi ? "रोजगार मांग" : "Industry Demand"}</span>
              </div>
              <div className="mt-1">
                <div className="text-sm sm:text-base md:text-lg font-bold text-emerald-400 leading-tight">
                  {isHindi ? career.stats.demandHi : career.stats.demandEn}
                </div>
                {(career.stats.demandSubEn || career.stats.demandSubHi) && (
                  <div className="text-[11.5px] text-slate-200/90 font-medium mt-0.5 leading-tight">
                    {isHindi ? career.stats.demandSubHi : career.stats.demandSubEn}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== BODY CONTENT ===================== */}
      <section className="max-w-[1360px] mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
        {/* Balanced 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Left Content (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. About the Profession Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-[#134275]/10 text-[#134275] flex items-center justify-center font-bold shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2
                    className={`text-xl sm:text-2xl text-[#0A2545] leading-snug ${
                      isHindi ? "font-bold tracking-normal" : "font-black tracking-tight"
                    }`}
                  >
                    {content.aboutTitle}
                  </h2>
                  <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5 leading-normal">
                    {isHindi
                      ? "व्यावसायिक विवरण एवं चिकित्सीय महत्व"
                      : "Professional Overview & Clinical Importance"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-[15px] sm:text-[16px] text-slate-700 leading-[1.8] font-normal">
                {content.aboutParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* 2. Key Roles & Responsibilities */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 mb-2 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h2
                    className={`text-xl sm:text-2xl text-[#0A2545] leading-snug ${
                      isHindi ? "font-bold tracking-normal" : "font-black tracking-tight"
                    }`}
                  >
                    {content.rolesTitle}
                  </h2>
                  <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5 leading-normal">
                    {content.rolesDescription}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                {content.roles.map((role, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/70 hover:border-[#134275]/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#134275] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-[14px] sm:text-[15px] text-[#0A2545] leading-snug">
                          {role.title}
                        </h4>
                        <p className="text-[13px] sm:text-[13.5px] text-slate-600 mt-1.5 leading-relaxed">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Right Column (5 cols) with Sticky Behavior */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
            {/* Sidebar Card 1: Related Board Courses */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5C158]" />
                <h3 className="font-bold text-base text-[#0A2545] uppercase tracking-wide">
                  {content.relatedCoursesTitle}
                </h3>
              </div>

              <div className="space-y-3 mt-4">
                {content.relatedCourses.map((course, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/70 hover:border-[#E5C158] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#134275] text-white">
                        {course.code}
                      </span>
                      <span className="text-[11.5px] font-semibold text-slate-500">
                        {course.duration}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-[14.5px] text-[#0A2545] mt-2 leading-snug">
                      {course.title}
                    </h4>
                    <p className="text-xs sm:text-[12.5px] text-slate-500 mt-1">
                      {isHindi ? "पात्रता: " : "Eligibility: "}
                      <span className="font-medium text-slate-700">{course.eligibility}</span>
                    </p>
                    <Link
                      href={course.href}
                      className="mt-2.5 inline-flex items-center text-xs font-bold text-[#8B1F13] hover:text-[#70170d]"
                    >
                      <span>{isHindi ? "कोर्स की जानकारी" : "Course Details"}</span>
                      <span className="ml-1">→</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Card 2: Top Employment Sectors */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                <span className="w-2.5 h-2.5 rounded-full bg-[#134275]" />
                <h3 className="font-bold text-base text-[#0A2545] uppercase tracking-wide">
                  {content.sectorsTitle}
                </h3>
              </div>

              <div className="space-y-3 mt-4">
                {content.sectors.map((sec, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-left">
                    <div className="w-2 h-2 rounded-full bg-[#E5C158] shrink-0 mt-1.5" />
                    <div>
                      <h4 className="text-xs sm:text-[13px] font-bold text-[#0A2545]">{sec.name}</h4>
                      <p className="text-[11.5px] sm:text-xs text-slate-600 leading-relaxed mt-0.5">
                        {sec.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Card 3: Board Recognition Seal */}
            <div className="bg-gradient-to-br from-[#0A2545] to-[#134275] text-white rounded-2xl p-5 shadow-md border-t-4 border-[#E5C158]">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#E5C158] shrink-0">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {isHindi ? "IPBI प्रमाणित पाठ्यक्रम" : "IPBI Certified Programs"}
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Indian Paramedical Board of India
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-[12.5px] text-slate-200 leading-relaxed mb-3 font-normal">
                {isHindi
                  ? "अखिल भारतीय मान्यता, अस्पतालों में प्रैक्टिकल क्लिनिकल ट्रेनिंग और आधिकारिक ऑनलाइन सत्यापन।"
                  : "Standardized curricula, valid all-India certification, clinical hospital internships, and nationwide verification."}
              </p>
              <Link
                href="/about-us"
                className="block text-center text-xs font-bold text-[#0A2545] bg-[#E5C158] hover:bg-[#d9b348] py-2 rounded-lg transition-colors"
              >
                {isHindi ? "बोर्ड की मान्यताएं देखें" : "About Board Accreditations"}
              </Link>
            </div>

            {/* Sidebar Card 4: Admission Helpline & Support */}
            <div className="bg-[#F0F5FA] rounded-2xl p-5 border border-blue-100/90 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#134275]">
                  {isHindi ? "छात्र सहायता एवं परामर्श" : "Student Helpline & Inquiries"}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0A2545]">
                {isHindi
                  ? "प्रवेश या पाठ्यक्रम से जुड़ा कोई प्रश्न है?"
                  : "Need admission guidance or syllabus details?"}
              </h4>
              <p className="text-[12px] text-slate-600 mt-1 leading-relaxed">
                {isHindi
                  ? "संबद्ध कॉलेजों की सूची और परीक्षा कार्यक्रम के लिए हमारे काउंसिलिंग डेस्क से संपर्क करें।"
                  : "Contact our central admission counseling desk for affiliated colleges list and examination schedules."}
              </p>
              <div className="mt-3 pt-3 border-t border-blue-200/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">{isHindi ? "समय:" : "Desk Hours:"}</span>
                <span className="font-bold text-[#134275]">{isHindi ? "सोम - शुक्र (10am - 5pm)" : "Mon - Fri (10am - 5pm)"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== CAREER PROGRESSION (FULL WIDTH ROADMAP) ===================== */}
        <div className="mt-10 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h2
                className={`text-xl sm:text-2xl text-[#0A2545] leading-snug ${
                  isHindi ? "font-bold tracking-normal" : "font-black tracking-tight"
                }`}
              >
                {content.ladderTitle}
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5 leading-normal">
                {isHindi
                  ? "ट्रेनी से लेकर विभागाध्यक्ष तक पदोन्नति एवं अनुभव का संपूर्ण क्रम"
                  : "Structured growth ladder from entry-level trainee to departmental in-charge"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.ladderSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-[#F8FAFC] p-4 sm:p-5 rounded-xl border border-slate-200/80 hover:border-[#134275]/40 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#134275] text-[#E5C158] flex items-center justify-center text-xs font-black shadow-xs">
                      {step.step}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11.5px] font-bold bg-[#E5C158]/20 text-[#8B1F13]">
                      {step.experience}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm sm:text-[15px] text-[#0A2545] leading-snug">
                    {step.role}
                  </h4>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mt-2 font-normal">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================== SKILLS ACQUIRED (FULL WIDTH) ===================== */}
        <div className="mt-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <h2
                className={`text-xl sm:text-2xl text-[#0A2545] leading-snug ${
                  isHindi ? "font-bold tracking-normal" : "font-black tracking-tight"
                }`}
              >
                {content.skillsTitle}
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5 leading-normal">
                {isHindi
                  ? "प्रशिक्षण के दौरान सिखाए जाने वाले मुख्य क्लिनिकल एवं तकनीकी कौशल"
                  : "Core clinical, technical and procedural proficiencies mastered in training"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {content.skills.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F0F5FA] text-[#134275] border border-blue-100/80 hover:bg-blue-50/80 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-[#E5C158] text-[#0A2545] flex items-center justify-center shrink-0 shadow-2xs">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs sm:text-[13.5px] font-medium text-[#0A2545] leading-snug">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===================== FULL WIDTH CTA BANNER ===================== */}
        <div className="mt-10 w-full bg-gradient-to-r from-[#0A2545] via-[#134275] to-[#0E345F] rounded-2xl p-6 sm:p-10 text-white shadow-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E5C158] block mb-1">
              {isHindi ? "प्रवेश एवं नामांकन" : "Admissions & Enrollments"}
            </span>
            <h3
              className={`text-xl sm:text-2xl md:text-3xl text-white ${
                isHindi ? "font-bold tracking-normal" : "font-black"
              }`}
            >
              {content.ctaTitle}
            </h3>
            <p className="text-xs sm:text-[13.5px] text-slate-200 mt-2 leading-relaxed">
              {content.ctaDescription}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/courses"
              className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-[#E5C158] hover:bg-[#d9b348] text-[#0A2545] font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-150 shadow-md"
            >
              {content.ctaButtonText}
            </Link>
            <Link
              href="/affiliated-institutions"
              className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-150"
            >
              {isHindi ? "संबद्ध संस्थान" : "Affiliated Colleges"}
            </Link>
          </div>
        </div>

        {/* ===================== BOTTOM CAREER EXPLORER ===================== */}
        <div className="mt-14 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                className={`text-lg sm:text-xl text-[#0A2545] uppercase tracking-wide ${
                  isHindi ? "font-bold" : "font-black"
                }`}
              >
                {isHindi ? "अन्य पैरामेडिकल करियर देखें" : "Explore Other Paramedical Careers"}
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-500 font-medium">
                {isHindi
                  ? "स्वास्थ्य क्षेत्र के अन्य मांग वाले करियर विकल्पों को जानें"
                  : "Discover all high-demand healthcare specializations"}
              </p>
            </div>
            <Link
              href="/#specializations"
              className="text-xs font-bold text-[#8B1F13] hover:text-[#70170d] flex items-center gap-1"
            >
              <span>{isHindi ? "होम पर सभी देखें" : "View All on Home"}</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {otherCareers.map((c) => {
              const otherCContent = isHindi ? c.hi : c.en;
              return (
                <Link
                  key={c.id}
                  href={`/careers/${c.slug}`}
                  className="group flex flex-col items-start p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-[#134275] hover:shadow-md transition-all duration-200"
                >
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 mb-2">
                    <Image
                      src={c.image}
                      alt={otherCContent.title}
                      fill
                      sizes="150px"
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-[#0A2545] leading-snug line-clamp-2 group-hover:text-[#8B1F13] transition-colors">
                    {otherCContent.title}
                  </h4>
                  <span className="text-[10.5px] font-bold text-[#8B1F13] mt-1.5 flex items-center gap-0.5">
                    <span>{isHindi ? "विवरण" : "Details"}</span>
                    <span>→</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
