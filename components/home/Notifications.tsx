import React from "react";
import Image from "next/image";
import Link from "next/link";

interface BaseCard {
  id: number;
}

interface ImageCard extends BaseCard {
  type: "image";
  image: string;
  imageAlt: string;
  date: string;
  title: string;
  description: string;
  linkText: string;
  href?: string;
}

interface TwoBlockCard extends BaseCard {
  type: "two-block";
  topBlock: {
    date: string;
    title: string;
    linkText?: string;
    href?: string;
  };
  bottomBlock: {
    date: string;
    title: string;
    description: string;
    linkText: string;
    href?: string;
  };
}

type NotificationItem = ImageCard | TwoBlockCard;

const notifications: NotificationItem[] = [
  {
    id: 1,
    type: "image",
    image: "/Admissions.jpeg",
    imageAlt: "Admissions Open",
    date: "27 Sept 2024",
    title: "Admission Open 2024-25",
    description:
      "शैक्षणिक सत्र 2024-25 के लिए प्रवेश प्रक्रिया शुरू हो चुकी है। इच्छुक विद्यार्थी ऑनलाइन आवेदन कर सकते हैं।",
    linkText: "LEARN MORE →",
    href: "#",
  },
  {
    id: 2,
    type: "two-block",
    topBlock: {
      date: "25 Sept 2024",
      title: "Admission Open 2024-25",
      linkText: "LEARN MORE →",
      href: "#",
    },
    bottomBlock: {
      date: "25 Sept 2024",
      title: "Exam Time Table: Sept 2024",
      description:
        "सितंबर 2024 सत्र की परीक्षा समय सारणी जारी कर दी गई है। कृपया विस्तृत जानकारी हेतु लिंक देखें।",
      linkText: "LEARN MORE →",
      href: "#",
    },
  },
  {
    id: 3,
    type: "two-block",
    topBlock: {
      date: "27 Sept 2024",
      title: "Exam Time Table: Sept 2024",
      linkText: "LEARN MORE →",
      href: "#",
    },
    bottomBlock: {
      date: "27 Sept 2024",
      title: "Affiliation Renewal Notice",
      description:
        "संबद्धता नवीनीकरण से संबंधित सूचना जारी की गई है। कृपया आवश्यक दस्तावेज़ समय पर जमा करें।",
      linkText: "LEARN MORE →",
      href: "#",
    },
  },
  {
    id: 4,
    type: "two-block",
    topBlock: {
      date: "27 Sept 2024",
      title: "Affiliation Renewal Notice",
      linkText: "LEARN MCRE →",
      href: "#",
    },
    bottomBlock: {
      date: "27 Sept 2024",
      title: "Affiliation Renewal Notice",
      description:
        "संबद्धता नवीनीकरण प्रक्रिया हेतु आवेदन अब उपलब्ध है। अंतिम तिथि से पूर्व आवेदन सुनिश्चित करें।",
      linkText: "LEARN MORE →",
      href: "#",
    },
  },
];

export default function Notifications() {
  return (
    <section className="w-full bg-white pt-2 sm:pt-4 md:pt-6 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Centered Heading with Decorative Lines */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-6 sm:mb-8">
          <span className="hidden xs:inline-block w-6 sm:w-12 h-[1.5px] bg-[#A47C3B] opacity-80" />
          <h2 className="text-center text-[15px] xs:text-base sm:text-lg md:text-[22px] lg:text-[24px] font-black text-[#1A2B4A] tracking-wider uppercase font-sans">
            IMPORTANT ANNOUNCEMENTS / महत्वपूर्ण घोषणाएं
          </h2>
          <span className="hidden xs:inline-block w-6 sm:w-12 h-[1.5px] bg-[#A47C3B] opacity-80" />
        </div>

        {/* 4-Column Grid (Responsive: 1 col mobile, 2 cols tablet, 4 cols desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {notifications.map((card) => {
            if (card.type === "image") {
              return (
                <div
                  key={card.id}
                  className="flex flex-col bg-white rounded-xl border border-[#E5E5E5] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  {/* Image Block */}
                  <div className="relative w-full aspect-[16/9] sm:aspect-[1.8/1] bg-gray-100 overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content Block */}
                  <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="block text-[11px] sm:text-[12px] font-medium text-[#888888] mb-1">
                        {card.date}
                      </span>
                      <h3 className="text-[14px] sm:text-[14.5px] lg:text-[15px] font-bold text-[#1A2B4A] leading-snug mb-2">
                        {card.title}
                      </h3>
                      <p className="text-[12px] text-[#6B6B6B] leading-relaxed mb-3">
                        {card.description}
                      </p>
                    </div>

                    <Link
                      href={card.href || "#"}
                      className="inline-flex items-center text-[11.5px] sm:text-[12px] font-bold text-[#8B1F13] hover:text-[#70170d] tracking-wide uppercase transition-colors duration-150"
                    >
                      {card.linkText}
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={card.id}
                className="flex flex-col bg-white rounded-xl border border-[#E5E5E5] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Top Strip */}
                <div className="bg-[#EDEBF7] p-3.5 sm:p-4 border-b border-[#E5E5E5]/60 flex flex-col justify-between">
                  <div>
                    <span className="block text-[11px] sm:text-[12px] font-medium text-[#888888] mb-1">
                      {card.topBlock.date}
                    </span>
                    <h3 className="text-[14px] sm:text-[14.5px] lg:text-[15px] font-bold text-[#1A2B4A] leading-snug mb-2">
                      {card.topBlock.title}
                    </h3>
                  </div>
                  {card.topBlock.linkText && (
                    <Link
                      href={card.topBlock.href || "#"}
                      className="inline-flex items-center text-[11.5px] sm:text-[12px] font-bold text-[#8B1F13] hover:text-[#70170d] tracking-wide uppercase transition-colors duration-150 mt-1"
                    >
                      {card.topBlock.linkText}
                    </Link>
                  )}
                </div>

                {/* Bottom Block */}
                <div className="bg-white p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="block text-[11px] sm:text-[12px] font-medium text-[#888888] mb-1">
                      {card.bottomBlock.date}
                    </span>
                    <h3 className="text-[14px] sm:text-[14.5px] lg:text-[15px] font-bold text-[#1A2B4A] leading-snug mb-2">
                      {card.bottomBlock.title}
                    </h3>
                    <p className="text-[12px] text-[#6B6B6B] leading-relaxed mb-3">
                      {card.bottomBlock.description}
                    </p>
                  </div>

                  <Link
                    href={card.bottomBlock.href || "#"}
                    className="inline-flex items-center text-[11.5px] sm:text-[12px] font-bold text-[#8B1F13] hover:text-[#70170d] tracking-wide uppercase transition-colors duration-150"
                  >
                    {card.bottomBlock.linkText}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
