import React from "react";
import Image from "next/image";

export default function AccreditationsBar() {
  const accreditations = [
    {
      id: "iso",
      title: "ISO 9001:2015",
      category: "Quality Management Certified",
      description: "Certified for maintaining standardized quality in paramedical education and training.",
      image: "/iso-certified.jpg",
      alt: "ISO 9001:2015 Certified Badge",
      tag: "Certified Standard",
      tagColor: "bg-blue-50 text-[#143E66] border-blue-200",
    },
    {
      id: "niti-aayog",
      title: "NITI Aayog",
      category: "National Institution for Transforming India",
      description: "Registered under NITI Aayog NGO-Darpan Portal, Government of India.",
      image: "/niti-aayog.jpg",
      alt: "NITI Aayog Government of India Emblem",
      tag: "Govt. of India",
      tagColor: "bg-amber-50 text-[#714B15] border-amber-200",
    },
    {
      id: "msme",
      title: "MSME Dept.",
      category: "Ministry of MSME, Govt. of India",
      description: "Recognized & registered under Micro, Small & Medium Enterprises Development.",
      image: "/msme-registered.jpg",
      alt: "MSME Micro Small and Medium Enterprises Emblem",
      tag: "Udyam Registered",
      tagColor: "bg-emerald-50 text-[#165A36] border-emerald-200",
    },
  ];

  return (
    <section className="w-full bg-[#F4F8FB] border-y border-[#D6E4F0] py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Header Title */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#143E66]/10 text-[#143E66] text-[11px] sm:text-[12px] font-bold tracking-wider uppercase mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#89281F]" />
            Official Recognitions &amp; Accreditations
          </div>
          <h2 className="text-[17px] sm:text-[21px] md:text-[23px] font-extrabold text-[#14233C] tracking-tight uppercase">
            मान्यता एवं राष्ट्रीय प्रमाणन (Certified Standards)
          </h2>
          <div className="w-14 h-1 bg-[#89281F] rounded-full mt-2" />
        </div>

        {/* 3 Accreditation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {accreditations.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#143E66]/30 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Top Row: Category Tag + Authorized Shield Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`text-[10.5px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${item.tagColor}`}
                >
                  {item.tag}
                </span>

                {/* Premium Micro Trust Shield */}
                <div className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/80 rounded-full px-2 py-0.5 text-[10.5px] font-bold text-[#143E66] shadow-2xs">
                  <svg
                    className="w-3.5 h-3.5 text-[#143E66]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span>Authorized</span>
                </div>
              </div>

              {/* Logo Presentation Container */}
              <div className="relative w-full h-20 sm:h-24 bg-[#FAFCFF] rounded-xl border border-gray-100 p-2 flex items-center justify-center overflow-hidden mb-3.5 group-hover:scale-[1.02] transition-transform duration-200">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Text Info */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[15px] sm:text-[16px] font-black text-[#143E66] tracking-tight group-hover:text-[#89281F] transition-colors">
                    {item.title}
                  </h3>
                  {/* Official Rosette Checkmark Seal */}
                  <span className="inline-flex text-[#1E5B99] shrink-0" title="Officially Recognized">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <h4 className="text-[12px] font-bold text-gray-700 mt-0.5 leading-snug">
                  {item.category}
                </h4>
                <p className="text-[11.5px] text-gray-500 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
