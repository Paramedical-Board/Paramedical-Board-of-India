import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import RegistrationForm from "@/components/student/registration/RegistrationForm";

export const metadata: Metadata = {
  title: "Register Student | College Portal",
  description: "Register a new student for Diploma and Certificate courses.",
};

export default function DashboardStudentRegisterPage() {
  return (
    <div className="flex-1 flex flex-col print:bg-white print:min-h-0">
      {/* Title & Breadcrumb Banner - Hidden on print/PDF */}
      <section className="w-full bg-[#143E66] text-white py-5 sm:py-6 border-b-4 border-[#D4AF37] print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#C2DCED] mb-2.5">
            <Link
              href="/college/dashboard"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-[#D4AF37] font-semibold">Student Registration</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight uppercase">
                Student Online Registration / छात्र ऑनलाइन पंजीकरण
              </h1>
              <p className="text-xs sm:text-sm text-[#C2DCED] mt-0.5 font-medium">
                Academic Session 2026-2027 • Candidate Enrollment Portal
              </p>
            </div>

            <Link
              href="/college/dashboard"
              className="inline-flex items-center gap-1.5 self-start sm:self-auto bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded text-xs font-semibold text-[#F1E4C3] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Form Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 print:p-0 print:m-0 print:max-w-none">
        {/* Important Guidelines Banner - Hidden on print */}
        <div className="bg-[#FFF9E6] border-l-4 border-[#D4AF37] p-4 rounded-r-md shadow-xs mb-6 text-xs sm:text-sm text-slate-800 print:hidden">
          <h4 className="font-bold text-[#00031D] mb-1 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#B13B1C]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Important Instructions for College / महाविद्यालय हेतु निर्देश:
          </h4>
          <ul className="list-disc list-inside space-y-1 text-slate-700 ml-1">
            <li>Verify candidate personal and academic particulars with original certificates before submission.</li>
            <li>Ensure active student Mobile Number and Email ID are provided for board notifications.</li>
            <li>Uploaded documents must be legible and in JPG/JPEG format within the specified size limits.</li>
          </ul>
        </div>

        {/* Student Registration Form */}
        <RegistrationForm />
      </main>
    </div>
  );
}
