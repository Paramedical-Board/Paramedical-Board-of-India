import React from "react";
import Image from "next/image";

export default function CounselorGuidanceBanner() {
  return (
    <section className="w-full bg-slate-50/60 py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0E345F] via-[#134275] to-[#0A2545] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-[#E5C158]/40 shadow-lg text-white">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#E5C158]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8">
            
            {/* Left: Photo + Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 min-w-0">
              
              {/* Photo with golden frame */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 rounded-2xl overflow-hidden border-2 border-[#E5C158] shadow-md shrink-0 bg-slate-100">
                <Image
                  src="/counselor-c-patel.jpg"
                  alt="Miss C. Patel - Academic Counselor"
                  fill
                  sizes="(max-width: 640px) 80px, 110px"
                  className="object-cover object-top"
                />
              </div>

              {/* Text Information */}
              <div className="space-y-1.5 min-w-0">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] font-semibold text-[#E5C158] border border-white/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Free Academic &amp; Career Guidance Desk
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-black text-white tracking-tight">
                  Confused About Which Paramedical Course to Choose?
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                  Speak with our Academic Counselor <strong className="text-[#F1E4C3] font-bold">Miss C. Patel</strong> for syllabus overview, eligibility criteria, and admission guidance across accredited institutes.
                </p>

                <p className="text-[11px] text-[#A8C8EC] italic">
                  सही पाठ्यक्रम चयन एवं करियर मार्गदर्शन हेतु संपर्क करें
                </p>
              </div>

            </div>

            {/* Right: Direct Call Button */}
            <div className="shrink-0 w-full sm:w-auto flex flex-col items-center sm:items-end gap-1.5 pt-1 sm:pt-0">
              <a
                href="tel:02223463113"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#E5C158] hover:bg-[#f0d068] text-[#0A2545] font-black px-5 sm:px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 text-xs sm:text-sm tracking-wide group"
              >
                <div className="w-6 h-6 rounded-full bg-[#0A2545] text-[#E5C158] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span>Call Counselor: 022 2346 3113</span>
              </a>

              <span className="text-[10.5px] text-slate-300">
                Official Helpline • Mon - Fri (10 AM - 5 PM)
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
