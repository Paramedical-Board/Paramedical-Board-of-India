import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const session = token ? verifyAdminToken(token) : null;

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FA]">
      {/* Super-Admin Top Navigation Header */}
      <header className="w-full sticky top-0 z-50 bg-[#00031D] border-b-4 border-[#D4AF37] shadow-md print:hidden no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Left: Emblem and Portal Branding */}
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 hover:opacity-95 transition-opacity"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0">
              <Image
                src="/logo.png"
                alt="Indian Paramedical Board"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-black text-white tracking-wide uppercase leading-tight">
                INDIAN PARAMEDICAL BOARD OF INDIA
              </span>
              <span className="text-[10px] sm:text-xs text-[#D4AF37] font-semibold leading-tight">
                Super-Admin Portal / केंद्रीय व्यवस्थापक पोर्टल
              </span>
            </div>
          </Link>

          {/* Center/Nav: Portal Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/admin/dashboard"
              className="px-3 py-1.5 rounded text-xs font-bold text-white/90 hover:text-white hover:bg-white/10 transition-colors"
            >
              Applications / आवेदन
            </Link>
            <Link
              href="/admin/dashboard/exam-management"
              className="px-3 py-1.5 rounded text-xs font-bold text-[#D4AF37] hover:text-[#f3cd57] hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Exam Management / परीक्षा प्रबंधन</span>
            </Link>
          </div>

          {/* Right: Logged-in Admin Info and Logout */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Admin Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-[#143E66] border border-[#D4AF37]/30 px-3 py-1.5 rounded text-white">
              <svg
                className="w-4 h-4 text-[#D4AF37]"
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
              <span className="text-xs font-semibold max-w-[200px] truncate" title={session.username}>
                Admin: {session.username}
              </span>
            </div>

            {/* Logout Component */}
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#05172C] py-3 px-4 sm:px-6 lg:px-8 text-[11.5px] text-[#90B0D5] border-t border-white/5 print:hidden">
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
      </footer>
    </div>
  );
}
