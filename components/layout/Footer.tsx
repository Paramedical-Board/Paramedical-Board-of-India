import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-[#134275] via-[#0E345F] to-[#0A2545] text-white">
      {/* Top 5-Column Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-7 sm:pt-8 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-0 lg:divide-x lg:divide-white/15 items-start">
          
          {/* Column 1: Logo & About (lg:col-span-3) */}
          <div className="lg:col-span-3 lg:pr-5 flex flex-col justify-between space-y-4 min-w-0">
            <div>
              {/* Emblem & Brand Title */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Indian Paramedical Board of India Emblem"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-[12.5px] sm:text-[13px] font-black tracking-wide text-white uppercase leading-tight">
                    INDIAN PARAMEDICAL BOARD OF INDIA
                  </span>
                  <span className="text-[11.5px] sm:text-[12px] font-semibold text-[#F1E4C3] tracking-wide mt-1 leading-snug">
                    इण्डियन पैरामेडिकल बोर्ड ऑफ इण्डिया
                  </span>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-[11.5px] text-[#C8DCF2] leading-relaxed max-w-[280px] pl-0.5">
                Autonomous National Board for standardizing excellence in paramedical, allied healthcare education and institutional accreditation across India.
              </p>
            </div>

            {/* Instagram Modern Pill Badge */}
            <div className="pt-1">
              <Link
                href="#"
                className="inline-flex items-center gap-2.5 bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full transition-all duration-200 shadow-xs group max-w-full"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div className="text-left min-w-0">
                  <span className="text-[9.5px] text-[#A8C8EC] block leading-none">
                    Follow us on Instagram
                  </span>
                  <span className="text-[11px] font-bold text-white tracking-wide leading-tight truncate block">
                    @indianparamedicalboard
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Column 2: Contact Us (lg:col-span-3) - Expanded width */}
          <div className="lg:col-span-3 lg:px-5 flex flex-col space-y-3 min-w-0">
            <h4 className="text-[12.5px] font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span>CONTACT US</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158]" />
            </h4>
            <div className="space-y-3 text-[11.5px] text-[#C8DCF2]">
              {/* Landline Phone */}
              <a href="tel:02223463113" className="flex items-center gap-2.5 group cursor-pointer min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center text-[#E5C158] shrink-0 border border-white/10 group-hover:bg-[#E5C158] group-hover:text-[#0A2545] transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="group-hover:text-white transition-colors font-semibold text-white text-[12px]">022 2346 3113</span>
                  <span className="text-[9.5px] text-[#A8C8EC]">Landline - BSNL</span>
                </div>
              </a>

              {/* Email */}
              <a href="mailto:info@indianparamedicalboard.org" className="flex items-center gap-2.5 group cursor-pointer min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center text-[#E5C158] shrink-0 border border-white/10 group-hover:bg-[#E5C158] group-hover:text-[#0A2545] transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="group-hover:text-white transition-colors text-[11.5px] truncate">
                  info@indianparamedicalboard.org
                </span>
              </a>

              {/* Location */}
              <div className="flex items-start gap-2.5 group min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center text-[#E5C158] shrink-0 border border-white/10 group-hover:bg-[#E5C158] group-hover:text-[#0A2545] transition-colors mt-0.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="group-hover:text-white transition-colors leading-relaxed text-[11.5px]">
                  Globe Heritage, 454/4, Bandra (East), Mumbai - 400051
                </span>
              </div>

              {/* Website */}
              <a href="https://www.indianparamedicalboard.org" className="flex items-center gap-2.5 group cursor-pointer min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center text-[#E5C158] shrink-0 border border-white/10 group-hover:bg-[#E5C158] group-hover:text-[#0A2545] transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 014-10z" />
                  </svg>
                </div>
                <span className="group-hover:text-white transition-colors text-[11.5px] truncate">
                  www.indianparamedicalboard.org
                </span>
              </a>
            </div>
          </div>

          {/* Column 3: Quick Links (lg:col-span-2) */}
          <div className="lg:col-span-2 lg:px-4 flex flex-col space-y-3 min-w-0">
            <h4 className="text-[12.5px] font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span>QUICK LINKS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158]" />
            </h4>
            <div className="flex flex-col space-y-2 text-[12px] text-[#C8DCF2]">
              {[
                { name: "Courses", href: "/courses" },
                { name: "Affiliated Institutions", href: "/affiliated-institutions" },
                { name: "Admit Card", href: "/admit-card" },
                { name: "Examination Results", href: "/result" },
                { name: "About Board", href: "/about-us" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group flex items-center gap-2 hover:text-white transition-all duration-150 hover:translate-x-1 truncate"
                >
                  <span className="text-[#E5C158] text-[11px] font-bold transition-transform group-hover:translate-x-0.5">
                    ›
                  </span>
                  <span className="truncate">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Academic Council (lg:col-span-2) */}
          <div className="lg:col-span-2 lg:px-4 flex flex-col space-y-2.5 min-w-0">
            <h4 className="text-[12.5px] font-black uppercase tracking-wider text-white flex items-center gap-2 mb-3">
              <span>ACADEMIC COUNCIL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158]" />
            </h4>

            {/* Profile 1 Micro-card */}
            <div className="bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5 transition-all duration-200 shadow-xs group cursor-default">
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#E5C158]/60 bg-gray-200 shadow-xs">
                <Image
                  src="/Meditech6.jpeg"
                  alt="Academic Council Member"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="leading-tight overflow-hidden min-w-0">
                <h5 className="text-[11.5px] font-bold text-white truncate group-hover:text-[#F1E4C3] transition-colors">
                  Dr. A. K. Sharma
                </h5>
                <p className="text-[10px] text-[#B8CCE4] truncate mt-0.5">
                  Academic Council Member
                </p>
              </div>
            </div>

            {/* Profile 2 Micro-card */}
            <div className="bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5 transition-all duration-200 shadow-xs group cursor-default">
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#E5C158]/60 bg-gray-200 shadow-xs">
                <Image
                  src="/Meditech3.jpeg"
                  alt="Advisory Board Member"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="leading-tight overflow-hidden min-w-0">
                <h5 className="text-[11.5px] font-bold text-white truncate group-hover:text-[#F1E4C3] transition-colors">
                  Dr. S. K. Verma
                </h5>
                <p className="text-[10px] text-[#B8CCE4] truncate mt-0.5">
                  Institutional Advisory Member
                </p>
              </div>
            </div>
          </div>

          {/* Column 5: Map for Headquarters (lg:col-span-2) */}
          <div className="lg:col-span-2 lg:pl-4 flex flex-col space-y-2 min-w-0">
            <h4 className="text-[12.5px] font-black uppercase tracking-wider text-white flex items-center gap-2 mb-3">
              <span>HEADQUARTERS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158]" />
            </h4>

            {/* Static Map Container - Mumbai / Bandra East */}
            <div className="relative w-full h-[120px] rounded-xl bg-[#F5F2EC] overflow-hidden border border-white/25 p-2 flex flex-col justify-between shadow-md">
              {/* Map background SVG */}
              <svg
                className="absolute inset-0 w-full h-full opacity-65 pointer-events-none"
                viewBox="0 0 200 120"
                preserveAspectRatio="none"
              >
                {/* Background Roads */}
                <path d="M-10 35 Q60 25 110 50 T210 40" stroke="#FFFFFF" strokeWidth="7" fill="none" />
                <path d="M20 -10 L100 130" stroke="#CBD5E1" strokeWidth="4" fill="none" />
                <path d="M-10 85 L210 65" stroke="#FFFFFF" strokeWidth="3.5" fill="none" />
                <path d="M-10 95 Q50 85 100 125" stroke="#93C5FD" strokeWidth="9" fill="none" />
                <path d="M120 -10 L190 130" stroke="#CBD5E1" strokeWidth="3" fill="none" />
              </svg>

              {/* Top Street Labels */}
              <div className="relative z-10 flex justify-between text-[7.5px] font-bold text-[#475569]">
                <span className="bg-white/90 backdrop-blur-xs px-1 py-0.5 rounded shadow-2xs">
                  Bandra (E)
                </span>
                <span className="bg-white/90 backdrop-blur-xs px-1 py-0.5 rounded shadow-2xs">
                  BKC Rd
                </span>
              </div>

              {/* Red Pin Tooltip in center */}
              <div className="relative z-10 flex items-center gap-1 my-auto self-center bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-lg shadow-md border border-gray-200 hover:scale-105 transition-transform max-w-full">
                <div className="w-3.5 h-3.5 text-[#DC2626] shrink-0 animate-bounce">
                  <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <div className="text-[7.5px] font-bold text-[#1E293B] leading-tight truncate">
                  <div className="text-[#143E66] truncate">Indian Paramedical Board</div>
                  <div className="text-gray-500 font-medium truncate">Mumbai 400051</div>
                </div>
              </div>

              {/* Bottom Street Label */}
              <div className="relative z-10 flex items-center gap-1 text-[7.5px] font-bold text-[#334155] bg-white/90 backdrop-blur-xs px-1 py-0.5 rounded shadow-2xs self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block shrink-0" />
                <span className="truncate">Western Exp Hwy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Feature Strip (4 items) */}
      <div className="w-full bg-[#081F3B]/90 backdrop-blur-md border-t border-b border-white/10 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 gap-2 md:gap-0 text-left">
          
          {/* Feature 1 */}
          <div className="flex items-center gap-3 md:px-4 py-1 md:py-0 group cursor-default">
            <div className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center text-[#E5C158] shrink-0 border border-white/10 group-hover:bg-[#E5C158] group-hover:text-[#0A2545] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="leading-tight">
              <span className="text-[11.5px] font-bold text-white block">
                Verified Accreditation
              </span>
              <span className="text-[10px] text-[#A6C4E8]">
                ISO &amp; Govt. Recognized
              </span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-3 md:px-4 py-1 md:py-0 group cursor-default">
            <div className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center text-[#E5C158] shrink-0 border border-white/10 group-hover:bg-[#E5C158] group-hover:text-[#0A2545] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="leading-tight">
              <span className="text-[11.5px] font-bold text-white block">
                Examination Portal
              </span>
              <span className="text-[10px] text-[#A6C4E8]">
                Admit Cards &amp; Results
              </span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-3 md:px-4 py-1 md:py-0 group cursor-default">
            <div className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center text-[#E5C158] shrink-0 border border-white/10 group-hover:bg-[#E5C158] group-hover:text-[#0A2545] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="leading-tight">
              <span className="text-[11.5px] font-bold text-white block">
                Affiliated Institutes
              </span>
              <span className="text-[10px] text-[#A6C4E8]">
                Pan-India Network
              </span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-center gap-3 md:px-4 py-1 md:py-0 group cursor-default">
            <div className="w-7 h-7 rounded-lg bg-white/[0.08] flex items-center justify-center text-[#E5C158] shrink-0 border border-white/10 group-hover:bg-[#E5C158] group-hover:text-[#0A2545] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
              </svg>
            </div>
            <div className="leading-tight">
              <span className="text-[11.5px] font-bold text-white block">
                Instant Verification
              </span>
              <span className="text-[10px] text-[#A6C4E8]">
                24x7 Digital Access
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Bilingual Copyright + Helpline + Policy Links (Option 3) */}
      <div className="w-full bg-[#05172C] py-3 px-4 sm:px-6 lg:px-8 text-[11.5px] text-[#90B0D5] border-t border-white/5">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          {/* Left: Bilingual Copyright & Legal Links */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3.5">
            <span className="text-white/90 font-medium">
              © 2023 Indian Paramedical Board of India / इण्डियन पैरामेडिकल बोर्ड ऑफ इण्डिया
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <div className="flex items-center gap-3 text-[11px]">
              <Link href="#" className="hover:text-[#E5C158] transition-colors">
                Terms &amp; Conditions
              </Link>
              <span className="text-white/20">|</span>
              <Link href="#" className="hover:text-[#E5C158] transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Right: Technical Helpline Highlight Badge */}
          <a
            href="tel:02223463113"
            className="inline-flex items-center gap-2 bg-white/[0.07] hover:bg-white/[0.14] border border-white/15 px-3.5 py-1.5 rounded-full text-white transition-all duration-200 group shrink-0"
          >
            <div className="w-5 h-5 rounded-full bg-[#E5C158] text-[#05172C] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-[11.5px] font-semibold tracking-wide">
              <span className="text-[#F1E4C3]">Technical Helpline:</span>{" "}
              <span className="font-bold text-white group-hover:text-[#E5C158] transition-colors">
                022 2346 3113
              </span>{" "}
              <span className="text-[#A8C8EC] text-[10px] font-normal">
                (Mon – Fri: 10 AM - 6 PM)
              </span>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
