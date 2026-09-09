import React from "react";

export default function StatsBar() {
  const stats = [
    {
      id: 1,
      title: "NATIONAL STANDARDS",
      desc: "Aligning curricula with global best practices",
      icon: (
        <svg
          className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-[#8B6B38] shrink-0"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 8C12 5.79086 13.7909 4 16 4H32L40 12V40C40 42.2091 38.2091 44 36 44H16C13.7909 44 12 42.2091 12 40V8Z" />
          <path d="M32 4V12H40" />
          <path d="M18 16H28" />
          <path d="M18 22H24" />
          <circle cx="20" cy="32" r="6" fill="#FFF" />
          <circle cx="20" cy="32" r="6" />
          <path d="M17.5 32L19.5 34L23 29.5" strokeWidth="2.5" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "NATIONAL STANDARDS",
      desc: "Aligning curricula with global best practices",
      icon: (
        <svg
          className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-[#8B6B38] shrink-0"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="24" cy="24" r="14" />
          <ellipse cx="24" cy="24" rx="7" ry="14" />
          <path d="M10 24H38" />
          <path d="M24 4V8" />
          <path d="M24 40V44" />
          <path d="M4 24H8" />
          <path d="M40 24H44" />
          <circle cx="24" cy="24" r="19" strokeDasharray="3 3" opacity="0.6" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "NATIONAL RECOGNITION",
      desc: "Aligning curricula with global best practices",
      icon: (
        <svg
          className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-[#8B6B38] shrink-0"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="24" cy="18" r="11" />
          <path d="M20 18L23 21L28 15" strokeWidth="2.5" />
          <path d="M16 26L13 42L24 37L35 42L32 26" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "CAREER SUPPORT",
      desc: "Aligning curricula with global best practices",
      icon: (
        <svg
          className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-[#8B6B38] shrink-0"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="28" cy="14" r="7" />
          <path d="M28 10V18" />
          <path d="M26 12C26 11 27 10.5 28 10.5C29 10.5 30 11 30 12C30 13.5 26 13.5 26 15C26 16 27 16.5 28 16.5C29 16.5 30 16 30 15" />
          <path d="M10 32H20L31 29C33 28.5 35 29.5 35.5 31.5C36 33.5 35 35.5 33 36L22 39H10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full bg-[#FAFAFA] pt-4 sm:pt-6 pb-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto bg-white border border-[#E0E0E0] rounded-2xl shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-[#E5E5E5]">
          {stats.map((item, idx) => (
            <div
              key={item.id}
              className={`flex items-center gap-3.5 px-4 sm:px-5 py-3.5 sm:py-4 lg:py-5 transition-colors hover:bg-slate-50/60 ${
                idx % 2 === 1 ? "sm:border-l sm:border-[#E5E5E5] lg:border-l-0" : ""
              } ${idx >= 2 ? "sm:border-t sm:border-[#E5E5E5] lg:border-t-0" : ""}`}
            >
              <div className="shrink-0">{item.icon}</div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-[12.5px] sm:text-[13px] lg:text-[13.5px] font-bold text-[#14233C] tracking-wide uppercase font-sans truncate">
                  {item.title}
                </h4>
                <p className="text-[11.5px] sm:text-[12px] lg:text-[12.5px] text-[#6B6B6B] leading-snug mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
