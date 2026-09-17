import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";
import { ContactPageEmailLink, ContactPageWebLink } from "@/components/common/DynamicDomain";

export const metadata: Metadata = {
  title: "Contact Us | Indian Paramedical Board of India",
  description:
    "Official Contact & Helpdesk of the Indian Paramedical Board of India. Find headquarters address, telephone numbers, and submit official inquiries.",
};

export const dynamic = "force-dynamic";

export default function ContactUsPage() {
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Link>
            <span className="text-slate-500">/</span>
            <span className="text-[#E5C158] font-semibold">Contact Us</span>
          </nav>

          {/* Banner Title & Exact Subtitle */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#F1E4C3] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#E5C158] animate-pulse" />
                Helpdesk &amp; Communication
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase text-white font-sans">
                Contact Us
              </h1>
              {/* Exact subtitle as requested */}
              <p className="text-base sm:text-lg font-medium text-slate-200 mt-2 max-w-2xl leading-relaxed">
                Indian Paramedical Board of India
              </p>
            </div>

            {/* Quick Badges Strip */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Office Timings (without public dealing) */}
              <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-[#E5C158]/20 flex items-center justify-center text-[#E5C158]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className="text-left leading-tight">
                  <span className="text-[10px] text-slate-300 block uppercase font-semibold">Office Timings</span>
                  <span className="text-[12px] font-bold text-white">Mon – Fri: 10:00 AM – 5:00 PM</span>
                </div>
              </div>

              {/* Technical Helpline */}
              <a
                href="tel:02223463113"
                className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-xl"
              >
                <div className="w-7 h-7 rounded-lg bg-[#E5C158]/20 flex items-center justify-center text-[#E5C158]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="text-left leading-tight">
                  <span className="text-[10px] text-slate-300 block uppercase font-semibold">Helpline</span>
                  <span className="text-[12px] font-bold text-[#E5C158]">022 2346 3113</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        
        {/* Address & Quick Contact Highlight Strip */}
        <div className="bg-[#0A2545] rounded-2xl p-5 sm:p-6 text-white border border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#E5C158] shrink-0 border border-white/15 mt-0.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#E5C158] uppercase tracking-wider block">
                Official Headquarters Address
              </span>
              <p className="text-sm sm:text-base font-semibold text-white mt-0.5">
                Globe Heritage, 454/4, Bandra (East), Mumbai - 400051
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 md:border-l md:border-white/15 md:pl-6">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Email</span>
              <ContactPageEmailLink />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Web Portal</span>
              <ContactPageWebLink />
            </div>
          </div>
        </div>

        {/* 2-Column Section: Left Form + Right Map & How-To-Reach */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Official Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Right Column: Headquarters Map & How-To-Reach Guide (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Headquarters Map Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-5 hover:shadow-md transition-shadow space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#134275]/10 text-[#134275] flex items-center justify-center font-bold text-xs">
                    📍
                  </div>
                  <h3 className="text-base font-bold text-[#143E66]">
                    Headquarters Location
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  Mumbai, Maharashtra
                </span>
              </div>

              {/* Styled Visual Map Container (No external link) */}
              <div className="relative w-full h-[240px] rounded-xl overflow-hidden border border-slate-200 bg-[#F4F1EA] shadow-inner flex flex-col justify-between p-3 select-none">
                {/* Visual Map Background Vector */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-70 pointer-events-none"
                  viewBox="0 0 400 240"
                  preserveAspectRatio="none"
                >
                  {/* Subtle terrain / park patches */}
                  <path d="M-10 0 L110 0 L80 90 L-10 60 Z" fill="#E2EDDF" />
                  <path d="M290 140 L410 120 L410 250 L270 250 Z" fill="#E8F1E5" />
                  <path d="M240 0 L410 0 L410 70 L300 40 Z" fill="#E3ECDF" />

                  {/* Secondary Roads */}
                  <path d="M-20 70 L420 50" stroke="#FFFFFF" strokeWidth="9" fill="none" />
                  <path d="M-20 70 L420 50" stroke="#E2E8F0" strokeWidth="5" fill="none" />

                  <path d="M50 -20 L180 260" stroke="#FFFFFF" strokeWidth="10" fill="none" />
                  <path d="M50 -20 L180 260" stroke="#CBD5E1" strokeWidth="6" fill="none" />

                  <path d="M-20 180 L420 150" stroke="#FFFFFF" strokeWidth="9" fill="none" />
                  <path d="M-20 180 L420 150" stroke="#E2E8F0" strokeWidth="5" fill="none" />

                  <path d="M220 -20 L350 260" stroke="#FFFFFF" strokeWidth="8" fill="none" />
                  <path d="M220 -20 L350 260" stroke="#CBD5E1" strokeWidth="5" fill="none" />

                  {/* Major Highway (Western Express Hwy & BKC Connector) */}
                  <path d="M-20 120 Q160 90 240 160 T420 130" stroke="#93C5FD" strokeWidth="14" fill="none" opacity="0.85" />
                  <path d="M-20 120 Q160 90 240 160 T420 130" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="6 6" fill="none" />
                </svg>

                {/* Top Street Labels */}
                <div className="relative z-10 flex justify-between text-[9px] font-bold text-slate-600">
                  <span className="bg-white/95 backdrop-blur-xs px-2 py-1 rounded-md shadow-xs border border-slate-200">
                    Bandra (E)
                  </span>
                  <span className="bg-white/95 backdrop-blur-xs px-2 py-1 rounded-md shadow-xs border border-slate-200">
                    BKC Complex Rd
                  </span>
                </div>

                {/* Central Headquarters Marker Box */}
                <div className="relative z-10 self-center my-auto bg-white/98 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-200/90 flex items-center gap-2.5 max-w-[90%]">
                  <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm animate-bounce">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <div className="min-w-0 leading-tight">
                    <div className="text-[11.5px] font-extrabold text-[#143E66] truncate">
                      Indian Paramedical Board of India
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                      Globe Heritage, 454/4, Bandra (East), Mumbai
                    </div>
                  </div>
                </div>

                {/* Bottom Highway / Landmark Label */}
                <div className="relative z-10 flex items-center justify-between text-[9px] font-bold text-slate-700">
                  <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-md shadow-xs border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block shrink-0" />
                    <span>Western Express Highway</span>
                  </div>
                  <span className="bg-white/95 backdrop-blur-xs px-2 py-1 rounded-md shadow-xs border border-slate-200 text-slate-500">
                    Bandra Terminus ~ 1 km
                  </span>
                </div>
              </div>

              {/* Address Micro Details */}
              <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">Globe Heritage, 454/4, Bandra (East), Mumbai - 400051</p>
                <p className="text-slate-500">Autonomous National Board under standard statutory guidelines.</p>
              </div>
            </div>

            {/* How to Reach Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 hover:shadow-md transition-shadow space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-7 h-7 rounded-lg bg-[#E5C158]/20 text-[#B38E1B] flex items-center justify-center font-bold text-xs">
                  🧭
                </div>
                <h3 className="text-base font-bold text-[#143E66]">
                  How to Reach / आवागमन निर्देश
                </h3>
              </div>

              <div className="space-y-3.5 text-xs sm:text-[13px]">
                {/* Rail */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">By Railway (रेल मार्ग द्वारा)</h4>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      Bandra Railway Station (East) is approximately 1.2 km away. Readily accessible via local autorickshaws and city buses.
                    </p>
                  </div>
                </div>

                {/* Road */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">By Road (सड़क मार्ग द्वारा)</h4>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      Direct connectivity via Western Express Highway and the BKC Connector route with ample public transportation.
                    </p>
                  </div>
                </div>

                {/* Air */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">By Air (वायु मार्ग द्वारा)</h4>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      Chhatrapati Shivaji Maharaj International Airport (Terminal 2) is ~6 km away, easily reachable via taxi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
