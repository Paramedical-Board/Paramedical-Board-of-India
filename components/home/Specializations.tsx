import React from "react";
import Image from "next/image";
import Link from "next/link";

interface SpecializationItem {
  id: number;
  title: string;
  image: string;
  alt: string;
  href?: string;
}

const specializations: SpecializationItem[] = [
  {
    id: 1,
    title: "Medical Lab Tech",
    image: "/Meditech1.jpeg",
    alt: "Medical Lab Tech",
    href: "/careers/medical-lab-tech",
  },
  {
    id: 2,
    title: "Radiographer",
    image: "/Meditech2.jpeg",
    alt: "Radiographer",
    href: "/careers/radiographer",
  },
  {
    id: 3,
    title: "Physiotherapist",
    image: "/Meditech3.jpeg",
    alt: "Physiotherapist",
    href: "/careers/physiotherapist",
  },
  {
    id: 4,
    title: "Operation Theatre Tech",
    image: "/Meditech4.jpeg",
    alt: "Operation Theatre Tech",
    href: "/careers/operation-theatre-tech",
  },
  {
    id: 5,
    title: "Dental Hygienist",
    image: "/Meditech5.jpeg",
    alt: "Dental Hygienist",
    href: "/careers/dental-hygienist",
  },
  {
    id: 6,
    title: "Optometrist",
    image: "/Meditech6.jpeg",
    alt: "Optometrist",
    href: "/careers/optometrist",
  },
  {
    id: 7,
    title: "Nursing Assistant",
    image: "/Meditech7.jpeg",
    alt: "Nursing Assistant",
    href: "/careers/nursing-assistant",
  },
];

export default function Specializations() {
  return (
    <section id="specializations" className="w-full bg-white pt-6 sm:pt-8 md:pt-12 pb-3 sm:pb-4 md:pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Centered Heading with Decorative Lines */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
          <span className="hidden xs:inline-block w-6 sm:w-12 h-[1.5px] bg-[#A47C3B] opacity-80" />
          <h2 className="text-center text-[15px] xs:text-base sm:text-lg md:text-[22px] lg:text-[24px] font-black text-[#1A2B4A] tracking-wider uppercase font-sans">
            PARAMEDICAL SPECIALIZATIONS: BUILD YOUR CAREER
          </h2>
          <span className="hidden xs:inline-block w-6 sm:w-12 h-[1.5px] bg-[#A47C3B] opacity-80" />
        </div>

        {/* 7-Card Grid (Responsive: 2 cols mobile, 3-4 cols tablet, 7 cols desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5 lg:gap-3.5 xl:gap-4">
          {specializations.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col items-start text-left bg-transparent"
            >
              {/* Image Container */}
              <Link
                href={item.href || "#"}
                className="relative w-full aspect-[4/3] rounded-t-xl sm:rounded-xl overflow-hidden bg-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] group-hover:shadow-md transition-shadow duration-200 block"
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 14vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Title & Link */}
              <div className="pt-2 sm:pt-2.5 w-full flex flex-col items-start">
                <Link href={item.href || "#"}>
                  <h3 className="text-[12.5px] sm:text-[13.5px] lg:text-[14.5px] font-bold text-[#1A2B4A] hover:text-[#134275] transition-colors leading-snug min-h-[34px] sm:min-h-[38px] line-clamp-2">
                    {item.title}
                  </h3>
                </Link>

                <Link
                  href={item.href || "#"}
                  className="mt-1 sm:mt-1.5 inline-flex items-center text-[11px] sm:text-[12px] font-bold text-[#8B1F13] hover:text-[#70170d] tracking-wide uppercase transition-colors duration-150"
                >
                  <span>LEARN MORE</span>
                  <span className="ml-1 text-[12px] sm:text-[13px] font-bold transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
