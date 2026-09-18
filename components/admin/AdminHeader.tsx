"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import MaintenanceToggle from "@/components/admin/MaintenanceToggle";

interface AdminHeaderProps {
  session: {
    username: string;
    role?: string;
  };
}

export default function AdminHeader({ session }: AdminHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Navigation Items
  const navItems = [
    {
      label: "Applications / आवेदन",
      href: "/admin/dashboard",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      isActive: (path: string) =>
        path === "/admin/dashboard" || (path.startsWith("/admin/dashboard/applications") && !path.includes("exam-management")),
    },
    {
      label: "Exam Management / परीक्षा प्रबंधन",
      href: "/admin/dashboard/exam-management",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      isActive: (path: string) =>
        path.startsWith("/admin/dashboard/exam-management") || path.startsWith("/admin/dashboard/admit-cards"),
    },
    {
      label: "Colleges / कॉलेज",
      href: "/admin/dashboard/colleges",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      isActive: (path: string) => path.startsWith("/admin/dashboard/colleges"),
    },
    {
      label: "Inquiries / पूछताछ",
      href: "/admin/dashboard/inquiries",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      isActive: (path: string) => path.startsWith("/admin/dashboard/inquiries"),
    },
  ];

  return (
    <>
      <header className="w-full sticky top-0 z-50 shadow-md print:hidden no-print">
        {/* Tier 1: Top Brand & Admin Profile Bar */}
        <div className="w-full bg-[#00031D] border-b border-white/10 px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-3">
          {/* Left: Emblem & Full Bilingual Title (Unobstructed) */}
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2.5 sm:gap-3.5 hover:opacity-95 transition-opacity min-w-0"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 shrink-0">
              <Image
                src="/logo.png"
                alt="Indian Paramedical Board of India"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-xs sm:text-sm md:text-[15px] font-black tracking-wide uppercase text-white sm:whitespace-nowrap leading-tight">
                INDIAN PARAMEDICAL BOARD OF INDIA
              </span>
              <span className="text-[10px] sm:text-xs text-[#D4AF37] font-semibold tracking-normal sm:whitespace-nowrap leading-tight mt-0.5">
                Super-Admin Portal / केंद्रीय व्यवस्थापक पोर्टल
              </span>
            </div>
          </Link>

          {/* Right: Desktop Admin Info & Maintenance Toggle & Logout / Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop Maintenance Mode Switch */}
            <div className="hidden sm:block">
              <MaintenanceToggle variant="compact" />
            </div>

            {/* Desktop Admin Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-[#143E66] border border-[#D4AF37]/40 px-3 py-1.5 rounded-lg text-white">
              <svg
                className="w-3.5 h-3.5 text-[#D4AF37]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs font-semibold max-w-[180px] truncate" title={session.username}>
                {session.username}
              </span>
            </div>

            {/* Desktop Logout Button */}
            <div className="hidden lg:block">
              <AdminLogoutButton />
            </div>

            {/* Mobile & Tablet Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:text-[#D4AF37] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Tier 2: Desktop Horizontal Navigation Bar (Below Logo and Name) */}
        <div className="hidden lg:flex w-full bg-[#00031D] border-b-4 border-[#D4AF37] px-4 sm:px-6 lg:px-8 shadow-xs">
          <nav className="flex items-center gap-2 py-1.5 text-xs font-bold whitespace-nowrap">
            {navItems.map((item) => {
              const active = item.isActive(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-md transition-all flex items-center gap-2 ${
                    active
                      ? "bg-[#143E66] text-[#D4AF37] shadow-sm border border-[#D4AF37]/50"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Drawer / Slide-Over Menu (for < lg screens) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-[85%] max-w-xs sm:max-w-sm bg-[#00031D] text-white h-full shadow-2xl flex flex-col z-50 border-l border-[#D4AF37]/30">
            {/* Drawer Top Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2.5">
                <div className="relative w-7 h-7 shrink-0">
                  <Image src="/logo.png" alt="Emblem" fill className="object-contain" />
                </div>
                <div>
                  <div className="text-xs font-black tracking-wider text-white">MENU / मेनू</div>
                  <div className="text-[10px] text-[#D4AF37]">Admin Controls</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Admin User Info Card in Drawer */}
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#143E66] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Logged In As</span>
                <span className="text-sm font-bold text-white block truncate">{session.username}</span>
              </div>
            </div>

            {/* Maintenance Toggle in Mobile Drawer */}
            <div className="p-3.5 bg-black/40 border-b border-white/10">
              <MaintenanceToggle variant="full" />
            </div>

            {/* Nav Links in Drawer */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {navItems.map((item) => {
                const active = item.isActive(pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      active
                        ? "bg-[#143E66] text-[#D4AF37] border border-[#D4AF37]/40 shadow-md"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className={active ? "text-[#D4AF37]" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout at Bottom of Drawer */}
            <div className="p-4 border-t border-white/10 bg-black/40">
              <div className="w-full flex justify-end">
                <AdminLogoutButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
