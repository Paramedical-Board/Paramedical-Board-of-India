"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavDropdown, { DropdownItem } from "./NavDropdown";

interface MenuItem {
  name: string;
  href?: string;
  dropdownItems?: DropdownItem[];
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileStudentCornerOpen, setMobileStudentCornerOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "#" },
    { name: "Courses", href: "#" },
    { name: "Affiliated Institutions", href: "#" },
    {
      name: "Student Corner",
      dropdownItems: [
        { name: "Student Registration", href: "/student/registration", badge: "New" },
        { name: "I-Card Download", isPlaceholder: true, badge: "Coming Soon" },
        { name: "Admit Card", isPlaceholder: true, badge: "Coming Soon" },
      ],
    },
    { name: "Examinations", href: "#" },
    { name: "Announcements", href: "#" },
    { name: "Results", href: "#" },
    { name: "Contact Us", href: "#" },
  ];

  return (
    <header className="w-full select-none sticky top-0 z-50 shadow-md bg-[#C2DCED]">
      {/* Tier 1: Top Brand & Action Bar */}
      <div className="w-full bg-[#C2DCED] py-2 px-2.5 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between border-b border-[#00031D]/10">
        {/* Left: Emblem & Prominent Bilingual Title */}
        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-1 mr-1">
          {/* Emblem Logo */}
          <div className="relative w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border border-[#00031D]/20 shadow-xs bg-white/50">
            <Image
              src="/logo-emblem.png"
              alt="Indian Paramedical Board of India Emblem"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Bilingual Title: Fully Visible on Mobile & Desktop */}
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-[10.5px] xs:text-[12px] sm:text-[14px] md:text-[15.5px] lg:text-[16.5px] font-black tracking-tight uppercase text-[#00031D] sm:whitespace-nowrap leading-tight">
              INDIAN PARAMEDICAL BOARD OF INDIA
            </span>
            <span className="text-[9px] xs:text-[10.5px] sm:text-[12px] md:text-[13px] lg:text-[13.5px] font-bold text-[#00031D]/90 tracking-normal sm:whitespace-nowrap leading-tight mt-0.5">
              इण्डियन पैरामेडिकल बोर्ड ऑफ इण्डिया
            </span>
          </div>
        </div>

        {/* Right: Apply Online Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Link
            href="/student/registration"
            className="bg-[#B13B1C] hover:bg-[#962f14] text-white font-bold text-[10px] xs:text-[11px] sm:text-xs md:text-[13px] uppercase px-2.5 xs:px-3 sm:px-4 md:px-5 py-1.5 sm:py-2.5 rounded-[4px] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer inline-block"
          >
            APPLY ONLINE
          </Link>

          {/* Mobile & Tablet Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-1.5 sm:p-2 rounded-md bg-[#143E66] text-white hover:bg-[#0d2a45] transition-colors focus:outline-hidden shrink-0"
          >
            {mobileMenuOpen ? (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Tier 2: Desktop Horizontal Navigation Bar */}
      <div className="hidden lg:flex w-full bg-[#143E66] px-4 md:px-8 lg:px-12 items-center shadow-xs overflow-visible">
        <nav className="flex items-center gap-1 sm:gap-2 text-[13.5px] font-medium text-white/95 whitespace-nowrap min-w-max">
          {menuItems.map((item) => {
            if (item.dropdownItems) {
              const isDropdownActive = item.dropdownItems.some(
                (sub) => sub.href && (pathname === sub.href || (sub.href !== "/" && pathname.startsWith(sub.href)))
              );

              return (
                <NavDropdown
                  key={item.name}
                  name={item.name}
                  items={item.dropdownItems}
                  active={isDropdownActive}
                />
              );
            }

            const isLinkActive =
              item.href === "/"
                ? pathname === "/"
                : item.href && item.href !== "#" && pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href || "#"}
                className={`px-3.5 sm:px-4 py-2 transition-all duration-150 rounded-[2px] flex items-center ${
                  isLinkActive
                    ? "bg-[#0d2a45] text-white font-bold border-b-2 border-[#D4AF37]"
                    : "hover:bg-white/15 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Tier 2: Mobile / Tablet Collapsible Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-[#143E66] border-t border-white/10 px-4 py-3 shadow-xl transition-all duration-200">
          <nav className="flex flex-col space-y-1 text-sm font-medium text-white">
            {menuItems.map((item) => {
              if (item.dropdownItems) {
                return (
                  <div key={item.name} className="flex flex-col border-b border-white/10 pb-1">
                    <button
                      type="button"
                      onClick={() => setMobileStudentCornerOpen(!mobileStudentCornerOpen)}
                      className="flex items-center justify-between w-full px-3 py-2.5 rounded-md hover:bg-white/10 text-left font-semibold text-[#F1E4C3]"
                    >
                      <span>{item.name}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${mobileStudentCornerOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {mobileStudentCornerOpen && (
                      <div className="pl-4 pr-2 py-1 space-y-1 bg-[#0d2a45]/60 rounded-md mt-1">
                        {item.dropdownItems.map((subItem) => {
                          if (subItem.isPlaceholder) {
                            return (
                              <div
                                key={subItem.name}
                                className="flex items-center justify-between px-3 py-2 text-xs text-white/50 cursor-not-allowed"
                              >
                                <span>{subItem.name}</span>
                                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-amber-300 font-semibold">
                                  {subItem.badge}
                                </span>
                              </div>
                            );
                          }

                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href || "#"}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-between px-3 py-2 text-xs text-white hover:bg-white/15 rounded transition-colors"
                            >
                              <span>{subItem.name}</span>
                              {subItem.badge && (
                                <span className="text-[10px] bg-[#B13B1C] px-1.5 py-0.5 rounded text-white font-bold">
                                  {subItem.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const isLinkActive =
                item.href === "/"
                  ? pathname === "/"
                  : item.href && item.href !== "#" && pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href || "#"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md transition-colors ${
                    isLinkActive
                      ? "bg-[#0d2a45] text-[#D4AF37] font-bold"
                      : "hover:bg-white/10 text-white/90"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
