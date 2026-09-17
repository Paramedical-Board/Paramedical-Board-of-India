import React from "react";
import Image from "next/image";

export default function Hero() {
  const badges = [
    {
      titleLine1: "Academic",
      titleLine2: "Integrity",
      icon: (
        <svg
          className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#71664A] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4"
          />
        </svg>
      ),
    },
    {
      titleLine1: "Skill-Based",
      titleLine2: "Learning",
      icon: (
        <svg
          className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#71664A] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="9" r="6" />
          <path d="M12 3a9 9 0 0 1 0 12M12 3a9 9 0 0 0 0 12M6 9h12" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 17c1.5 2 4 4 9 4s7.5-2 9-4M5 20h14"
          />
        </svg>
      ),
    },
    {
      titleLine1: "National",
      titleLine2: "Recognition",
      icon: (
        <svg
          className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#71664A] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="8" r="5" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.5 13L7 21l5-3 5 3-1.5-8"
          />
          <path d="M10 8l1.5 1.5 2.5-2.5" />
        </svg>
      ),
    },
    {
      titleLine1: "Career",
      titleLine2: "Support",
      icon: (
        <svg
          className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#71664A] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="7" r="3" />
          <path d="M12 5.5v3M10.5 7h3" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 15s2-2 6-2h3l3 2 4-1"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 19h16"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative w-full bg-[#E5EEF5] overflow-hidden min-h-[440px] sm:min-h-[480px] md:min-h-[500px] lg:min-h-[530px] flex items-center">
      {/* Right Image with Smooth Seamless Gradient Mask */}
      <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[62%] h-full z-0">
        <Image
          src="/hero-image.jpg"
          alt="Paramedical research and healthcare laboratory team"
          fill
          priority
          className="object-cover object-right"
          sizes="(max-width: 1024px) 100vw, 62vw"
        />

        {/* Soft Linear Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#E5EEF5]/95 via-[#E5EEF5]/85 to-[#E5EEF5]/40 lg:from-[#E5EEF5] lg:via-[#E5EEF5]/75 lg:to-transparent pointer-events-none" />
      </div>

      {/* Left Content Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:pl-16 xl:pl-20 py-8 sm:py-10 md:py-14">
        <div className="max-w-xl lg:max-w-2xl">
          {/* 3-Line Heading strictly matching colors and typography */}
          <h1 className="font-sans font-black tracking-[-0.02em] text-[24px] sm:text-[30px] md:text-[36px] lg:text-[40px] xl:text-[44px] leading-[1.14] uppercase select-none">
            <span className="sr-only">Indian Paramedical Board of India — </span>
            {/* Line 1: PARAMEDICAL EDUCATION & (Blue #143E66) */}
            <span className="block text-[#143E66] sm:whitespace-nowrap">
              PARAMEDICAL EDUCATION &amp;
            </span>

            {/* Line 2: CERTIFICATION: (Blue #143E66) ADVANCING (Red #89281F) */}
            <span className="block sm:whitespace-nowrap">
              <span className="text-[#143E66]">CERTIFICATION: </span>
              <span className="text-[#89281F]">ADVANCING</span>
            </span>

            {/* Line 3: INDIA'S HEALTHCARE (Red #89281F) */}
            <span className="block text-[#89281F] sm:whitespace-nowrap">
              INDIA&apos;S HEALTHCARE
            </span>
          </h1>

          {/* Subtext Paragraph */}
          <p className="mt-3 sm:mt-4 text-[#1a2530] text-[14px] sm:text-[15.5px] md:text-[16.5px] leading-relaxed max-w-lg font-normal">
            Empowering professionals, accrediting institutions, and ensuring the highest standards of paramedical care.
          </p>

          {/* Badges Row with Frosted Glass Pill Containers */}
          <div className="mt-4 sm:mt-5 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 py-1">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/80 hover:bg-white/95 backdrop-blur-xs border border-white/80 rounded-xl px-2.5 sm:px-3 py-2 shadow-xs transition-all duration-200"
              >
                {badge.icon}
                <div className="flex flex-col text-[#070707] text-[11px] sm:text-[12.5px] leading-tight font-semibold">
                  <span>{badge.titleLine1}</span>
                  <span>{badge.titleLine2}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Explore Courses Button */}
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="bg-[#8B1F13] hover:bg-[#72190f] text-white font-bold text-xs sm:text-[13px] uppercase py-2.5 sm:py-3 px-6 sm:px-8 rounded-[4px] shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 tracking-wider transition-all duration-200 cursor-pointer"
            >
              EXPLORE COURSES
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
