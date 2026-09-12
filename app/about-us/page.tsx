import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About Us | Indian Paramedical Board of India",
  description:
    "Learn about the Indian Paramedical Board of India (IPBI), an autonomous body regulating, standardizing, and promoting paramedical education across the nation.",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Header Navigation */}
      <Navbar />

      {/* Hero Banner Header */}
      <section className="w-full bg-gradient-to-r from-[#134275] via-[#0E345F] to-[#0A2545] text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-12 relative overflow-hidden border-b-4 border-[#D4AF37]">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto relative z-10">
          {/* Breadcrumbs */}
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
            <span className="text-[#E5C158] font-semibold">About Us</span>
          </nav>

          {/* Banner Title & Subtitle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#F1E4C3] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#E5C158] animate-pulse" />
                Autonomous National Board
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-white font-sans">
                About Us
              </h1>
              <p className="text-sm sm:text-base text-slate-200 mt-2 max-w-2xl leading-relaxed">
                Indian Paramedical Board of India (IPBI) — Dedicated to Excellence, Standardization &amp; Innovation in Paramedical Education.
              </p>
            </div>

            {/* Quick Authority Stats Pill Strip */}
            <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-2xl">
              <div className="text-center px-3 border-r border-white/15">
                <div className="text-lg font-black text-[#E5C158]">100%</div>
                <div className="text-[11px] text-slate-300">Autonomous</div>
              </div>
              <div className="text-center px-3 border-r border-white/15">
                <div className="text-lg font-black text-white">All India</div>
                <div className="text-[11px] text-slate-300">Affiliation Scope</div>
              </div>
              <div className="text-center px-3">
                <div className="text-lg font-black text-[#E5C158]">Standardized</div>
                <div className="text-[11px] text-slate-300">Curricula &amp; Exams</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">

        {/* ======================================================== */}
        {/* SECTION: INTRODUCTION (Dual Balanced Cards + 4 Pillars)  */}
        {/* ======================================================== */}
        <div className="space-y-6">
          
          {/* Dual Balanced Introduction Cards (50/50 Split) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            
            {/* Left Card: English Introduction */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#143E66] tracking-tight mb-5">
                  Introduction
                </h2>
                <div className="space-y-4 text-[14.5px] sm:text-[15.5px] text-[#1E293B] leading-relaxed">
                  <p>
                    The <strong className="text-[#143E66] font-bold">Indian Paramedical Board of India (IPBI)</strong> is an autonomous body established to regulate, standardize, and promote paramedical education across the country. The Board works independently to set academic benchmarks, affiliate training institutions, and ensure that every certified paramedical professional meets the standards required to serve India&apos;s healthcare sector effectively.
                  </p>
                  <p>
                    As an autonomous body, the Board operates with academic and administrative independence, allowing it to design curricula, conduct examinations, and issue certifications without external interference — while remaining accountable to the students, institutions, and healthcare industry it serves.
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5 text-[#143E66]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#143E66]" />
                  Academic &amp; Administrative Independence
                </span>
                <span className="text-slate-400">English</span>
              </div>
            </div>

            {/* Right Card: Hindi Introduction */}
            <div className="bg-[#FDFBF7] rounded-2xl border border-amber-200/80 shadow-sm p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#8B1F13] tracking-tight mb-5 font-sans">
                  परिचय
                </h2>
                <div className="space-y-4 text-[15px] sm:text-[16px] text-[#0F172A] leading-[1.85] font-normal">
                  <p>
                    <strong className="text-[#8B1F13] font-bold">इंडियन पैरामेडिकल बोर्ड ऑफ इंडिया (आईपीबीआई)</strong> एक स्वायत्त निकाय है जिसकी स्थापना देश भर में पैरामेडिकल शिक्षा को विनियमित, मानकीकृत और बढ़ावा देने के लिए की गई है। बोर्ड शैक्षणिक मानक तय करने, प्रशिक्षण संस्थानों को संबद्ध करने, तथा यह सुनिश्चित करने के लिए स्वतंत्र रूप से कार्य करता है कि प्रत्येक प्रमाणित पैरामेडिकल पेशेवर भारत के स्वास्थ्य सेवा क्षेत्र में प्रभावी रूप से सेवा देने हेतु आवश्यक मानकों को पूरा करे।
                  </p>
                  <p>
                    एक स्वायत्त निकाय के रूप में, बोर्ड शैक्षणिक और प्रशासनिक स्वतंत्रता के साथ कार्य करता है, जिससे वह बिना किसी बाहरी हस्तक्षेप के पाठ्यक्रम तैयार करने, परीक्षाएं आयोजित करने और प्रमाणपत्र जारी करने में सक्षम होता है — साथ ही यह उन छात्रों, संस्थानों और स्वास्थ्य सेवा उद्योग के प्रति जवाबदेह बना रहता है जिनकी वह सेवा करता है।
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-amber-200/50 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5 text-[#8B1F13]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B1F13]" />
                  पारदर्शी एवं स्वतंत्र कार्यप्रणाली
                </span>
                <span className="text-amber-800/60 font-medium">हिन्दी</span>
              </div>
            </div>

          </div>

          {/* Bottom 4-Grid Institutional Pillars with Clean SVG Vector Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* Pillar 1 */}
            <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs hover:shadow-xs transition-shadow flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#143E66]/10 text-[#143E66] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#143E66] leading-tight">
                  Academic Autonomy
                </h4>
                <div className="text-[11px] font-semibold text-[#8B1F13] mt-0.5">
                  स्वायत्त दर्जा
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Independent curriculum design &amp; administrative freedom.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs hover:shadow-xs transition-shadow flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#8B1F13]/10 text-[#8B1F13] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#143E66] leading-tight">
                  Standard Curricula
                </h4>
                <div className="text-[11px] font-semibold text-[#8B1F13] mt-0.5">
                  मानकीकृत पाठ्यक्रम
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Unified academic &amp; clinical benchmarks across India.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs hover:shadow-xs transition-shadow flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#A47C3B]/10 text-[#A47C3B] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#143E66] leading-tight">
                  Institutional Affiliation
                </h4>
                <div className="text-[11px] font-semibold text-[#8B1F13] mt-0.5">
                  संस्थान संबद्धता
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Rigorous monitoring of affiliated training institutes.
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs hover:shadow-xs transition-shadow flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#143E66] leading-tight">
                  Verified Certification
                </h4>
                <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                  पारदर्शी प्रमाणन
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  Direct student verification &amp; examination security.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* STATUTORY OBJECTIVES & BOARD MANDATE (Idea 2 Callout)     */}
        {/* ======================================================== */}
        <section className="bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9] rounded-2xl border-2 border-[#143E66]/20 shadow-sm p-6 sm:p-8 lg:p-9 relative overflow-hidden">
          {/* Subtle Institutional Gold Accent Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="pb-5 mb-6 border-b border-slate-200/90 relative z-10">
            <h3 className="text-xl sm:text-2xl font-black text-[#143E66] tracking-tight">
              Statutory Objectives &amp; Board Mandate
            </h3>
            <p className="text-sm font-semibold text-[#8B1F13] mt-0.5">
              न्यास (ट्रस्ट) एवं बोर्ड के मुख्य सांविधिक उद्देश्य
            </p>
          </div>

          {/* 2 Statutory Highlight Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">

            {/* Mandate Point 1: Multi-tier Institutional Expansion */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#143E66] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[15px] sm:text-base font-bold text-[#143E66] leading-snug">
                      Institutional Establishment &amp; Nationwide Operation
                    </h4>
                    <span className="text-xs font-bold text-[#8B1F13]">
                      संस्थान संचालन एवं राष्ट्रव्यापी विस्तार
                    </span>
                  </div>
                </div>

                {/* English Text */}
                <p className="text-[13.5px] text-slate-700 font-medium leading-relaxed mb-3">
                  To establish, affiliate, and operate colleges and educational institutions across national, international, state, district, tehsil, and block levels for conducting paramedical, nursing, and allied medical healthcare courses.
                </p>

                {/* Hindi Text */}
                <p className="text-[14px] sm:text-[14.5px] text-[#0F172A] leading-[1.8] bg-[#F8FAFC] border-l-4 border-l-[#143E66] p-3 rounded-r-lg">
                  पैरामेडिकल / नर्सिंग तथा अन्य चिकित्सीय कोर्सेस के संचालन हेतु कॉलेज / शैक्षिक संस्थानों को देश-विदेश, राज्य, जिला, तहसील एवं ब्लॉक स्तर पर प्रारम्भ एवं संचालन करना।
                </p>
              </div>
            </div>

            {/* Mandate Point 2: Conferring Certification, Diplomas & Degrees */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#8B1F13] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[15px] sm:text-base font-bold text-[#143E66] leading-snug">
                      Conferment of Diplomas, Certificates &amp; Degrees
                    </h4>
                    <span className="text-xs font-bold text-[#8B1F13]">
                      प्रशिक्षण उपरान्त प्रमाणन एवं उपाधि प्रदान करना
                    </span>
                  </div>
                </div>

                {/* English Text */}
                <p className="text-[13.5px] text-slate-700 font-medium leading-relaxed mb-3">
                  To award diplomas, certificates, and degrees (subsequent to requisite affiliations) to trained youth upon the successful completion of paramedical, nursing, and healthcare training programs through the Trust.
                </p>

                {/* Hindi Text */}
                <p className="text-[14px] sm:text-[14.5px] text-[#0F172A] leading-[1.8] bg-[#F8FAFC] border-l-4 border-l-[#8B1F13] p-3 rounded-r-lg">
                  न्यास (ट्रस्ट) के पैरामेडिकल / नर्सिंग तथा अन्य चिकित्सीय कोर्सेस के पूर्ण करने के पश्चात प्रशिक्षित युवक/युवतियों को डिप्लोमा / सर्टिफिकेट / डिग्री (आवश्यक सम्बद्धता उपरान्त) आदि प्रदान करना।
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* VISION & MISSION (Side-by-Side Bento Grid)                */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">

          {/* CARD 1: OUR VISION */}
          <section className="bg-white rounded-2xl border-t-4 border-t-[#143E66] border-x border-b border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-[#143E66]/10 text-[#143E66] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#143E66]">
                  Our Vision
                </h2>
              </div>

              {/* English Vision Statement */}
              <p className="text-[14.5px] sm:text-[15.5px] font-semibold text-[#143E66] leading-relaxed mb-4">
                To become a nationally recognized standard-setting body for paramedical education, ensuring every certified professional is skilled, ethical, and ready to serve India&apos;s growing healthcare needs.
              </p>

              {/* English Bullet List */}
              <ul className="space-y-3 mb-6">
                {[
                  "Deliver accessible, quality-driven paramedical education across urban and rural India",
                  "Maintain consistent academic and clinical training standards across all affiliated institutions",
                  "Build a transparent, technology-enabled system for registration, examination, and certification",
                  "Support the healthcare sector with a steady pipeline of well-trained paramedical professionals",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#143E66]/10 text-[#143E66] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-[13.5px] sm:text-[14.5px] text-[#1E293B] font-medium leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Hindi Translation Block */}
              <div className="pt-5 border-t border-slate-100 bg-[#FDFBF7] border border-amber-200/60 rounded-xl p-4 sm:p-5">
                <p className="text-[14.5px] sm:text-[15.5px] font-semibold text-[#8B1F13] mb-3 leading-[1.75]">
                  पैरामेडिकल शिक्षा के लिए एक राष्ट्रीय स्तर पर मान्यता प्राप्त मानक-निर्धारक निकाय बनना, जिससे यह सुनिश्चित हो कि प्रत्येक प्रमाणित पेशेवर कुशल, नैतिक और भारत की बढ़ती स्वास्थ्य सेवा आवश्यकताओं को पूरा करने के लिए तैयार हो।
                </p>
                <ul className="space-y-3">
                  {[
                    "शहरी और ग्रामीण भारत दोनों में सुलभ, गुणवत्तापूर्ण पैरामेडिकल शिक्षा उपलब्ध कराना",
                    "सभी संबद्ध संस्थानों में समान शैक्षणिक एवं नैदानिक प्रशिक्षण मानक बनाए रखना",
                    "पंजीकरण, परीक्षा और प्रमाणन हेतु एक पारदर्शी, प्रौद्योगिकी-सक्षम प्रणाली विकसित करना",
                    "प्रशिक्षित पैरामेडिकल पेशेवरों की निरंतर आपूर्ति के साथ स्वास्थ्य सेवा क्षेत्र का समर्थन करना",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#A47C3B] shrink-0 mt-2" />
                      <span className="text-[14px] sm:text-[15px] text-[#0F172A] leading-[1.75] font-normal">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>


          {/* CARD 2: OUR MISSION */}
          <section className="bg-white rounded-2xl border-t-4 border-t-[#8B1F13] border-x border-b border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-[#8B1F13]/10 text-[#8B1F13] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#143E66]">
                  Our Mission
                </h2>
              </div>

              {/* English Bullet List */}
              <ul className="space-y-3 mb-6">
                {[
                  "Set and maintain rigorous academic standards for all affiliated paramedical institutions",
                  "Conduct fair, transparent, and timely student registration, examination, and certification processes",
                  "Promote skill-based, job-oriented paramedical education across diploma and certificate programs",
                  "Strengthen the link between education and real-world healthcare employment",
                  "Continuously review and update curricula to reflect current healthcare practices",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#8B1F13]/10 text-[#8B1F13] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-[13.5px] sm:text-[14.5px] text-[#1E293B] font-medium leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Hindi Translation Block */}
              <div className="pt-5 border-t border-slate-100 bg-[#FDFBF7] border border-amber-200/60 rounded-xl p-4 sm:p-5">
                <ul className="space-y-3">
                  {[
                    "सभी संबद्ध पैरामेडिकल संस्थानों के लिए सख्त शैक्षणिक मानक तय करना और बनाए रखना",
                    "छात्र पंजीकरण, परीक्षा और प्रमाणन प्रक्रियाओं को निष्पक्ष, पारदर्शी और समयबद्ध तरीके से संचालित करना",
                    "डिप्लोमा एवं प्रमाणपत्र कार्यक्रमों में कौशल-आधारित, रोजगारोन्मुखी पैरामेडिकल शिक्षा को बढ़ावा देना",
                    "शिक्षा और वास्तविक स्वास्थ्य सेवा रोजगार के बीच संबंध को मजबूत करना",
                    "वर्तमान स्वास्थ्य सेवा प्रथाओं को दर्शाने हेतु पाठ्यक्रम की निरंतर समीक्षा एवं अद्यतन करना",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#A47C3B] shrink-0 mt-2" />
                      <span className="text-[14px] sm:text-[15px] text-[#0F172A] leading-[1.75] font-normal">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

        </div>


        {/* ======================================================== */}
        {/* MIDDLE HIGHLIGHT STRIP: IMAGE #2 (Full Showcase Card)    */}
        {/* ======================================================== */}
        <section className="bg-gradient-to-r from-[#143E66] to-[#0E345F] rounded-2xl overflow-hidden shadow-md text-white">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            
            {/* Image on Left (6 Cols) */}
            <div className="md:col-span-6 relative h-[240px] sm:h-[300px] md:h-[340px] w-full bg-slate-900">
              <Image
                src="/aboutusimage2.jpg"
                alt="Medical Laboratory and Equipment Training"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover object-center"
              />
            </div>

            {/* Content Callout on Right (6 Cols) */}
            <div className="md:col-span-6 p-6 sm:p-8 lg:p-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#E5C158] border border-white/15">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Hands-on Clinical Training
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
                Bridging Academic Curriculum with Hands-On Healthcare Practice
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                IPBI ensures that every student undergoes intensive clinical exposure, ensuring graduates are workforce-ready for hospitals, diagnostic centers, and healthcare institutions across India.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-bold text-[#E5C158]">
                <span>✓ High Benchmarks</span>
                <span>•</span>
                <span>✓ Practical Rigor</span>
                <span>•</span>
                <span>✓ Certified Competency</span>
              </div>
            </div>

          </div>
        </section>


        {/* ======================================================== */}
        {/* WHAT WE DO (Split Showcase with Image #3)                */}
        {/* ======================================================== */}
        <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 lg:p-10">
          
          {/* Section Header */}
          <div className="pb-4 mb-8 border-b border-slate-100">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#143E66] tracking-tight">
              What We Do
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Image #3 (5 Cols) */}
            <div className="lg:col-span-5 relative min-h-[300px] sm:min-h-[380px] rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100">
              <Image
                src="/aboutusimage3.jpg"
                alt="Healthcare professionals and medical graduates"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-xs font-bold text-[#F1E4C3] uppercase tracking-wider">
                  Future-Ready Professionals
                </div>
                <div className="text-sm font-semibold mt-0.5 drop-shadow-md">
                  Empowering the Next Generation of Certified Paramedical Leaders
                </div>
              </div>
            </div>

            {/* Right Column: 5 Structured Feature Points (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              
              {/* Feature Item 1 */}
              <div className="bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-slate-200/80 rounded-xl p-4 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#143E66] text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-[15px] font-bold text-[#143E66] leading-snug">
                      Affiliate &amp; Monitor Paramedical Training Institutions
                    </h4>
                    <p className="text-[13px] sm:text-[14px] text-slate-600 mt-1 leading-relaxed">
                      पूरे भारत में पैरामेडिकल प्रशिक्षण संस्थानों को संबद्ध करना एवं उनकी निगरानी करना।
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Item 2 */}
              <div className="bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-slate-200/80 rounded-xl p-4 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#8B1F13] text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-[15px] font-bold text-[#143E66] leading-snug">
                      Student Registration, Examinations &amp; Official Certifications
                    </h4>
                    <p className="text-[13px] sm:text-[14px] text-slate-600 mt-1 leading-relaxed">
                      छात्र पंजीकरण, परीक्षाएं आयोजित करना और आधिकारिक प्रमाणपत्र जारी करना।
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Item 3 */}
              <div className="bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-slate-200/80 rounded-xl p-4 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#A47C3B] text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-[15px] font-bold text-[#143E66] leading-snug">
                      Publish &amp; Update Syllabi for Healthcare Needs
                    </h4>
                    <p className="text-[13px] sm:text-[14px] text-slate-600 mt-1 leading-relaxed">
                      वर्तमान स्वास्थ्य सेवा आवश्यकताओं के अनुरूप पाठ्यक्रम प्रकाशित एवं अद्यतन करना।
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Item 4 */}
              <div className="bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-slate-200/80 rounded-xl p-4 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#143E66] text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                    4
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-[15px] font-bold text-[#143E66] leading-snug">
                      Student Support Services (Admit Cards, Results &amp; Verification)
                    </h4>
                    <p className="text-[13px] sm:text-[14px] text-slate-600 mt-1 leading-relaxed">
                      प्रवेश पत्र, परिणाम और सत्यापन सहित छात्र सहायता सेवाएं प्रदान करना।
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Item 5 */}
              <div className="bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-slate-200/80 rounded-xl p-4 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#8B1F13] text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                    5
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-[15px] font-bold text-[#143E66] leading-snug">
                      Expand Paramedical Education in Underserved Regions
                    </h4>
                    <p className="text-[13px] sm:text-[14px] text-slate-600 mt-1 leading-relaxed">
                      अल्प-सुविधा प्राप्त क्षेत्रों में पैरामेडिकल शिक्षा की पहुंच बढ़ाने हेतु कार्य करना।
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
