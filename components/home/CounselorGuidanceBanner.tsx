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

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            
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

            {/* Right: Direct Actions (WhatsApp & Call) */}
            <div className="shrink-0 w-full sm:w-auto flex flex-col items-center sm:items-end gap-2.5 pt-1 lg:pt-0">
              <a
                href="https://wa.me/919454169287?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20Paramedical%20courses."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-[260px] inline-flex items-center justify-center gap-2.5 bg-[#128C7E] hover:bg-[#0e7569] text-white font-black px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg border border-emerald-400/20 transition-all duration-200 active:scale-95 text-xs sm:text-sm tracking-wide group"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>
                <span>WhatsApp: 094541 69287</span>
              </a>

              <a
                href="tel:02223463113"
                className="w-full sm:w-[260px] inline-flex items-center justify-center gap-2.5 bg-[#E5C158] hover:bg-[#f0d068] text-[#0A2545] font-black px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 text-xs sm:text-sm tracking-wide group"
              >
                <div className="w-6 h-6 rounded-full bg-[#0A2545] text-[#E5C158] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span>Call Counselor: 022 2346 3113</span>
              </a>

              <span className="text-[10.5px] text-slate-300 text-center sm:text-right w-full">
                Official Helpline • Mon - Fri (10 AM - 5 PM)
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
