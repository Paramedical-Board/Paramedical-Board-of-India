import React from "react";

function NepalFlag({ className = "w-14 h-18" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 425 518"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Flag of Nepal"
    >
      {/* Outer Blue Border (Iconic Double Pennon) */}
      <polygon points="0,0 425,250 140,250 425,518 0,518" fill="#003893" />
      {/* Inner Crimson Field */}
      <polygon points="26,38 375,232 110,232 375,482 26,482" fill="#DC143C" />
      {/* Upper Moon Crescent */}
      <path
        d="M92 172c35 0 60-22 60-48 0-6-.8-11-2.2-16-12 18-32 28-56 28-10 0-20-2-28-6 4 24 14 42 26.2 42z"
        fill="#FFFFFF"
      />
      {/* Upper Moon Sun Center */}
      <circle cx="92" cy="120" r="10" fill="#FFFFFF" />
      {/* Lower Sun Symbol with Rays */}
      <circle cx="120" cy="370" r="34" fill="#FFFFFF" />
      <path
        d="M120 318l6 14h-12zm36 15l-6 14 12-6zm26 37l-14-6v12zm-15 36l-14-6 6 12zm-37 26l-6-14-6 14zm-36-15l6-14-12 6zm-26-37l14 6v-12zm15-36l14 6-6-12z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export default function NepalEquivalenceBanner() {
  const highlights = [
    {
      id: "cdc-equivalence",
      tag: "Curriculum Alignment",
      tagColor: "bg-blue-50 text-[#143E66] border-blue-200",
      title: "CDC Equivalence Guidance",
      subtitle: "समकक्षता निर्धारण मार्गदर्शन",
      description:
        "Proactive documentation and procedural guidance aligned with the Curriculum Development Centre (CDC), Sanothimi, Bhaktapur equivalence frameworks for healthcare & paramedical qualifications.",
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#143E66]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      id: "verification-support",
      tag: "Institutional Support",
      tagColor: "bg-emerald-50 text-[#165A36] border-emerald-200",
      title: "Fast-Track Verification",
      subtitle: "अंकपत्र एवं प्रमाणपत्र प्रमाणीकरण",
      description:
        "Direct institutional assistance for authentic verification of marksheets, certificates, and academic transcripts required by relevant Nepal authorities, councils, and institutions.",
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#165A36]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
          />
        </svg>
      ),
    },
    {
      id: "career-pathways",
      tag: "Cross-Border Recognition",
      tagColor: "bg-amber-50 text-[#714B15] border-amber-200",
      title: "Cross-Border Career Pathways",
      subtitle: "द्विपक्षीय रोजगार एवं उच्च शिक्षा",
      description:
        "Equipping Nepali students with standardized clinical skills and recognized paramedical credentials for career and higher education opportunities across India and Nepal.",
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#714B15]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="nepal-desk"
      className="w-full bg-[#F4F8FB] border-y border-[#D6E4F0] py-6 sm:py-9 md:py-12 px-3.5 sm:px-6 lg:px-8"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Main Banner Card */}
        <div className="bg-white rounded-2xl border border-[#D0DFEB] shadow-sm p-4 sm:p-6 md:p-8 lg:p-9 relative overflow-hidden">
          {/* Subtle decorative background watermarks */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#143E66]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-[#89281F]/5 rounded-full blur-2xl pointer-events-none" />

          {/* Header Area: Responsive 2-Row on Mobile, Unified on Tablet/Desktop */}
          <div className="relative z-10 border-b border-[#E8EEF3] pb-4 sm:pb-6 md:pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 lg:gap-10">
              
              {/* MOBILE VIEW (< sm): Idea A - Row 1 (Flag + Title) | Row 2 (Full-Width Text) */}
              <div className="block sm:hidden">
                {/* Row 1: Flag Shield + (Badge & Title) side-by-side */}
                <div className="flex items-center gap-3">
                  <div className="shrink-0 flex items-center justify-center w-[52px] h-[66px] rounded-xl bg-gradient-to-b from-white to-[#F4F8FC] border-2 border-[#CDDCE9] shadow-md shadow-[#143E66]/10 p-1.5">
                    <NepalFlag className="w-8 h-11 drop-shadow-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#143E66]/5 border border-[#143E66]/15 text-[#143E66] text-[10px] font-semibold tracking-wide mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#89281F]" />
                      <span className="font-bold tracking-wider uppercase">Nepal Students Desk</span>
                    </div>
                    <h2 className="text-[17px] xs:text-[19px] font-extrabold text-[#14233C] tracking-tight leading-snug">
                      Nepal Equivalence &amp; Student Facilitation Desk
                    </h2>
                  </div>
                </div>

                {/* Row 2: Subtitle & Description across the FULL card width */}
                <div className="mt-3">
                  <p className="text-xs font-semibold text-[#89281F] leading-tight">
                    पाठ्यक्रम विकास केन्द्र (CDC, Sanothimi, Bhaktapur) मान्यता एवं समकक्षता मार्गदर्शन
                  </p>
                  <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                    A specialized facilitation desk is{" "}
                    <strong className="text-[#14233C] font-semibold">
                      launching soon for the upcoming session
                    </strong>{" "}
                    to assist students from Nepal with educational equivalence guidance, document
                    verification, and academic recognition under prevailing standards.
                  </p>
                </div>
              </div>

              {/* TABLET & DESKTOP VIEW (>= sm): Large Flag Shield + Flowing Content */}
              <div className="hidden sm:flex items-center gap-6 lg:gap-8 flex-1">
                {/* Prominently Scaled Flag Shield */}
                <div className="shrink-0 flex items-center justify-center w-20 h-24 md:w-24 md:h-28 rounded-2xl bg-gradient-to-b from-white to-[#F4F8FC] border-2 border-[#CDDCE9] shadow-md shadow-[#143E66]/10 p-3 hover:scale-105 transition-transform duration-200">
                  <NepalFlag className="w-13 h-17 md:w-16 md:h-20 drop-shadow-xs" />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#143E66]/5 border border-[#143E66]/15 text-[#143E66] text-xs font-semibold tracking-wide mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#89281F]" />
                    <span className="font-bold tracking-wider uppercase text-[#143E66]">
                      Nepal Students Desk
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-[26px] lg:text-[30px] font-extrabold text-[#14233C] tracking-tight leading-snug">
                    Nepal Equivalence &amp; Student Facilitation Desk
                  </h2>

                  <p className="mt-1 text-sm md:text-base font-semibold text-[#89281F] leading-tight">
                    पाठ्यक्रम विकास केन्द्र (CDC, Sanothimi, Bhaktapur) मान्यता एवं समकक्षता मार्गदर्शन
                  </p>

                  <p className="mt-2 text-sm md:text-[14.5px] text-gray-600 max-w-4xl leading-relaxed">
                    A specialized facilitation desk is{" "}
                    <strong className="text-[#14233C] font-semibold">
                      launching soon for the upcoming session
                    </strong>{" "}
                    to assist students from Nepal with educational equivalence guidance, document
                    verification, and academic recognition under prevailing standards.
                  </p>
                </div>
              </div>

              {/* Right Side Institutional Context Box (Only on xl: viewports) */}
              <div className="hidden xl:flex flex-col justify-center items-end text-right shrink-0 pl-8 border-l border-[#E8EEF3]">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#143E66] text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#89281F]" />
                  CDC Sanothimi Aligned
                </div>
                <p className="text-xs font-bold text-[#14233C]">Curriculum Development Centre</p>
                <p className="text-[11.5px] text-gray-500">Sanothimi, Bhaktapur (Nepal)</p>
                <p className="text-[11px] text-[#89281F] font-semibold mt-1">मान्यता तथा समकक्षता निर्धारण</p>
              </div>
            </div>
          </div>

          {/* 3 Benefit Cards Grid: Responsive 1 col on mobile, 3 cols on tablet/desktop */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 md:gap-5 lg:gap-6 mt-4 sm:mt-6 md:mt-8">
            {highlights.map((item) => (
              <div
                key={item.id}
                className="bg-[#FAFBFD] rounded-xl p-4 sm:p-4.5 md:p-5 border border-[#E2EAF1] hover:border-[#143E66]/30 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5 sm:mb-3.5">
                    <div className="p-2 sm:p-2.5 rounded-lg bg-white border border-[#E2EAF1] shadow-2xs">
                      {item.icon}
                    </div>
                    <span
                      className={`text-[9.5px] sm:text-[10.5px] md:text-[11px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full border ${item.tagColor}`}
                    >
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base md:text-[17px] font-bold text-[#14233C]">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs font-semibold text-[#89281F] mt-0.5 mb-1.5 sm:mb-2">
                    {item.subtitle}
                  </p>
                  <p className="text-xs sm:text-[12.5px] md:text-[13px] text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Informational Bar */}
          <div className="relative z-10 mt-4 sm:mt-6 md:mt-7 pt-3 sm:pt-4 border-t border-[#E8EEF3] flex items-center gap-2 text-[11px] sm:text-xs text-gray-500">
            <span className="text-sm sm:text-base shrink-0">📌</span>
            <span className="leading-snug">
              <strong>आधिकारिक सूचना:</strong> नेपाल के विद्यार्थियों हेतु समकक्षता एवं सत्यापन प्रक्रिया का विवरण जल्द ही आधिकारिक पोर्टल पर प्रकाशित किया जाएगा।
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
