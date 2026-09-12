import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import LogoutButton from "@/components/college/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = token ? verifyToken(token) : null;

  if (!session) {
    redirect("/college/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FA]">
      {/* College Dashboard Top Navigation Header */}
      <header className="w-full sticky top-0 z-50 bg-[#143E66] border-b-4 border-[#D4AF37] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Left: Emblem and Portal Branding */}
          <Link
            href="/college/dashboard"
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
                INDIAN PARAMEDICAL BOARD
              </span>
              <span className="text-[10px] sm:text-xs text-[#C2DCED] font-medium leading-tight">
                College Portal / महाविद्यालय पोर्टल
              </span>
            </div>
          </Link>

          {/* Right: Logged-in College Info and Logout */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* College Badge */}
            <div className="hidden md:flex items-center gap-2 bg-[#00031D]/40 border border-[#D4AF37]/30 px-3 py-1.5 rounded text-white">
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="text-xs font-semibold max-w-[250px] truncate" title={session.college_name}>
                {session.college_name}
              </span>
            </div>

            {/* Logout Component */}
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#00031D] text-slate-400 py-4 px-4 text-center text-xs border-t border-slate-800 print:hidden">
        <p>© {new Date().getFullYear()} Indian Paramedical Board of India. Confidential College Portal.</p>
      </footer>
    </div>
  );
}
