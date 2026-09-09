import React from "react";

export default function CoreFunctions() {
  const functions = [
    {
      id: 1,
      title: "Course Accreditation",
      desc: "Course accreditation in londer and enouimented Course Accreditation.",
      icon: (
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
            {/* Scalloped Badge / Ribbon in Gold/Bronze */}
            <path
              d="M32 6L35.5 10.5L41 9L42.5 14.5L48 15.5L47.5 21L52 24L49.5 29L52.5 34L48.5 37.5L49.5 43L44 44.5L43 50L37.5 49.5L34.5 54L30 51.5L25.5 54L22.5 49.5L17 50L16 44.5L10.5 43L11.5 37.5L7.5 34L10.5 29L8 24L12.5 21L12 15.5L17.5 14.5L19 9L24.5 10.5L28 6L32 6Z"
              fill="#183860"
            />
            <circle cx="30" cy="30" r="16" fill="#A47C3B" />
            <path
              d="M24 30.5L28 34.5L36 26.5"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Ribbon Tails */}
            <path
              d="M21 44L16 56L24 52L27 46"
              fill="#183860"
            />
            <path
              d="M39 44L44 56L36 52L33 46"
              fill="#183860"
            />
          </svg>
        </div>
      ),
    },
    {
      id: 2,
      title: "Institution Affiliation",
      desc: "Institution affiliaten institution affiliater and Institution Affilliatiom.",
      icon: (
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
            {/* Institution / Temple Architecture */}
            <path d="M12 28L32 14L52 28H12Z" fill="#183860" />
            <rect x="15" y="28" width="34" height="4" fill="#183860" />
            {/* Columns */}
            <rect x="17" y="34" width="5" height="14" rx="1" fill="#183860" />
            <rect x="42" y="34" width="5" height="14" rx="1" fill="#183860" />
            <rect x="12" y="50" width="40" height="4" rx="1" fill="#183860" />
            {/* Central Badge Checkmark */}
            <circle cx="32" cy="41" r="7.5" fill="#A47C3B" />
            <path
              d="M29 41L31 43L35 39"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ),
    },
    {
      id: 3,
      title: "Examination Portal",
      desc: "Examination portal are event commendation and examination portal.",
      icon: (
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
            {/* Clipboard Top Tab */}
            <path
              d="M26 12C26 10.3431 27.3431 9 29 9H35C36.6569 9 38 10.3431 38 12V14H26V12Z"
              fill="#A47C3B"
            />
            {/* Clipboard Board */}
            <rect x="18" y="13" width="28" height="38" rx="4" fill="#183860" />
            {/* Lines on Clipboard */}
            <rect x="23" y="22" width="18" height="2.5" rx="1" fill="#FFFFFF" opacity="0.9" />
            <rect x="23" y="28" width="18" height="2.5" rx="1" fill="#FFFFFF" opacity="0.9" />
            <rect x="23" y="34" width="12" height="2.5" rx="1" fill="#FFFFFF" opacity="0.9" />
            <rect x="23" y="40" width="8" height="2.5" rx="1" fill="#FFFFFF" opacity="0.9" />
            {/* Badge Overlay */}
            <circle cx="43" cy="44" r="8" fill="#A47C3B" stroke="#FFFFFF" strokeWidth="2" />
            <path
              d="M40 44L42 46L46 42"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ),
    },
    {
      id: 4,
      title: "Skill Assessment",
      desc: "Desting the assessment of connecting skill assessment.",
      icon: (
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
            {/* Gear / Cog */}
            <path
              d="M32 16L34.5 19.5L39 19L40.5 23.5L45 24.5L45 29.5L49 32L46 36L48 40.5L44 43.5L44 48.5L39 49.5L37.5 54L32.5 52.5L29 55.5L26 51.5L21.5 52.5L20 48L15.5 47L15.5 42L11.5 39.5L14.5 35.5L12.5 31L16.5 28L16.5 23L21.5 22L23 17.5L28 19L32 16Z"
              fill="#183860"
            />
            {/* Checkmark Circle in Center */}
            <circle cx="31" cy="36" r="8.5" fill="#A47C3B" />
            <path
              d="M28 36L30 38L34 34"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ),
    },
    {
      id: 5,
      title: "Career Guidance",
      desc: "Career guidance and guidame in prostmnes and career support.",
      icon: (
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
            {/* Graduation Cap */}
            <path d="M32 15L17 22L32 29L47 22L32 15Z" fill="#183860" />
            <path d="M44 24.5V32" stroke="#A47C3B" strokeWidth="2" strokeLinecap="round" />
            <circle cx="44" cy="33" r="1.5" fill="#A47C3B" />
            {/* Student Head */}
            <circle cx="32" cy="32" r="5" fill="#A47C3B" />
            {/* Supporting Hand */}
            <path
              d="M20 48H27L36 44C38 43 40 44 40.5 46C41 48 40 50 38 50.5L28 54H20"
              stroke="#183860"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ),
    },
    {
      id: 6,
      title: "Research & Innovation",
      desc: "Research & Innovation's research our innovakons and inovation.",
      icon: (
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
            {/* Lightbulb Rays */}
            <path d="M32 10V14" stroke="#183860" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M19 16L22 19" stroke="#183860" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M45 16L42 19" stroke="#183860" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M14 29H18" stroke="#183860" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M46 29H50" stroke="#183860" strokeWidth="2.5" strokeLinecap="round" />
            {/* Lightbulb Outline */}
            <path
              d="M24 35C22 32.5 21 29 21 26C21 20 25.9 15 32 15C38.1 15 43 20 43 26C43 29 42 32.5 40 35L38 41H26L24 35Z"
              stroke="#183860"
              strokeWidth="2.8"
              fill="#FFFFFF"
            />
            {/* Filament / Brain inside bulb */}
            <circle cx="32" cy="26" r="5" fill="#A47C3B" opacity="0.85" />
            {/* Base of Bulb */}
            <path d="M27 45H37" stroke="#183860" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M29 48H35" stroke="#183860" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full bg-[#FAFAFA] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Heading */}
        <h2 className="text-center text-xl sm:text-2xl md:text-[26px] font-black text-[#0B1E36] tracking-wider uppercase mb-8 sm:mb-10 font-sans">
          OUR CORE FUNCTIONS
        </h2>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-4">
          {functions.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E8E8E8] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:-translate-y-1 transition-all duration-200 p-5 sm:p-6 flex flex-col items-center text-center justify-start min-h-[260px] sm:min-h-[270px]"
            >
              {/* Top Icon */}
              <div className="mb-4 flex items-center justify-center">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-[14px] sm:text-[15px] font-bold text-[#0D213A] leading-snug mb-2.5 font-sans">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-[12px] sm:text-[12.5px] text-[#6B6B6B] leading-[1.4] font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
