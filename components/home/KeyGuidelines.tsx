import React from "react";

const englishGuidelines = [
  "All affiliated institutions must maintain minimum infrastructure and faculty standards set by the Board.",
  "Students must complete the prescribed curriculum and clinical training hours for their diploma/certificate.",
  "Registration with the Board is mandatory before practicing in any paramedical field.",
  "Institutions must renew affiliation annually and submit compliance reports on time.",
];

const hindiGuidelines = [
  "सभी संबद्ध संस्थानों को बोर्ड द्वारा निर्धारित न्यूनतम अवसंरचना और संकाय मानकों को बनाए रखना अनिवार्य है।",
  "विद्यार्थियों को अपने डिप्लोमा/सर्टिफिकेट के लिए निर्धारित पाठ्यक्रम एवं क्लिनिकल प्रशिक्षण घंटे पूरे करने होंगे।",
  "किसी भी पैरामेडिकल क्षेत्र में कार्य करने से पूर्व बोर्ड में पंजीकरण अनिवार्य है।",
  "संस्थानों को प्रतिवर्ष संबद्धता का नवीनीकरण कराना होगा और समय पर अनुपालन रिपोर्ट प्रस्तुत करनी होगी।",
];

export default function KeyGuidelines() {
  return (
    <section className="w-full bg-white pt-2 sm:pt-4 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Heading */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
          <span className="hidden xs:inline-block w-6 sm:w-12 h-[1.5px] bg-[#A47C3B] opacity-80" />
          <h2 className="text-center text-[15px] xs:text-base sm:text-lg md:text-[22px] lg:text-[24px] font-black text-[#1A2B4A] tracking-wider uppercase font-sans">
            KEY GUIDELINES / मुख्य दिशा-निर्देश
          </h2>
          <span className="hidden xs:inline-block w-6 sm:w-12 h-[1.5px] bg-[#A47C3B] opacity-80" />
        </div>

        {/* Half/Half Split: Desktop side-by-side, Mobile stacked */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* English Guidelines Column */}
          <div className="bg-[#F8FAFC] rounded-xl sm:rounded-2xl border border-gray-200/90 p-4 sm:p-6 md:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-start">
            <div className="flex items-center gap-2 mb-3.5 sm:mb-5 pb-2.5 sm:pb-3 border-b border-gray-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B1F13]" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider text-[#8B1F13] uppercase font-sans">
                Key Guidelines (English)
              </h3>
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {englishGuidelines.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5 sm:gap-3">
                  <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-[#A47C3B]" />
                  <p className="text-[13px] sm:text-[14px] lg:text-[14.5px] text-[#1A2B4A] leading-relaxed font-medium">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Hindi Guidelines Column */}
          <div className="bg-[#F8FAFC] rounded-xl sm:rounded-2xl border border-gray-200/90 p-4 sm:p-6 md:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-start">
            <div className="flex items-center gap-2 mb-3.5 sm:mb-5 pb-2.5 sm:pb-3 border-b border-gray-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B1F13]" />
              <h3 className="text-xs sm:text-sm font-bold tracking-wider text-[#8B1F13] uppercase font-sans">
                मुख्य दिशा-निर्देश (हिन्दी)
              </h3>
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {hindiGuidelines.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5 sm:gap-3">
                  <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-[#A47C3B]" />
                  <p className="text-[13px] sm:text-[14px] lg:text-[14.5px] text-[#1A2B4A] leading-relaxed font-medium">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
