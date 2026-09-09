import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RegistrationForm from "@/components/student/registration/RegistrationForm";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Registration | Indian Paramedical Board of India",
  description: "Online Student Registration Portal for Paramedical Diploma and Certificate Courses.",
};

export default function StudentRegistrationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FA]">
      {/* Top Navbar */}
      <Navbar />

      {/* Page Title & Breadcrumb Banner */}
      <section className="w-full bg-[#143E66] text-white py-6 sm:py-8 border-b-4 border-[#D4AF37]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#C2DCED] mb-3">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#C2DCED]/80">Student Corner</span>
            <span>/</span>
            <span className="text-[#D4AF37] font-semibold">Online Registration</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight uppercase">
                Student Online Registration / छात्र ऑनलाइन पंजीकरण
              </h1>
              <p className="text-xs sm:text-sm text-[#C2DCED] mt-1 font-medium">
                Academic Session 2026-2027 • Indian Paramedical Board of India
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-white/10 backdrop-blur-xs border border-white/20 px-3.5 py-1.5 rounded text-xs font-semibold text-[#F1E4C3]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
              Admissions Open 2026-27
            </div>
          </div>
        </div>
      </section>

      {/* Form Content Area */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Important Guidelines Callout */}
        <div className="bg-[#FFF9E6] border-l-4 border-[#D4AF37] p-4 rounded-r-md shadow-xs mb-8 text-xs sm:text-sm text-slate-800">
          <h4 className="font-bold text-[#00031D] mb-1 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#B13B1C]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Important Instructions for Candidates / महत्वपूर्ण निर्देश:
          </h4>
          <ul className="list-disc list-inside space-y-1 text-slate-700 ml-1">
            <li>Please fill in all candidate details accurately as per your Matriculation / 10th Class Certificate.</li>
            <li>Ensure active Mobile Number and Email ID are provided for SMS and verification alerts.</li>
            <li>Upload clear scanned copies of recent passport-size photograph and specimen signature (Max 200 KB).</li>
          </ul>
        </div>

        {/* Student Registration Form Component */}
        <RegistrationForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
