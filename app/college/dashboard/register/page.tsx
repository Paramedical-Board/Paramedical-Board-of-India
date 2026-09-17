import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import StudentRegistrationGatedView from "@/components/student/registration/StudentRegistrationGatedView";
import RegistrationForm from "@/components/student/registration/RegistrationForm";

export const metadata: Metadata = {
  title: "Register Student | College Portal",
  description: "Register a new student for Diploma and Certificate courses.",
};

interface DraftRecord {
  id: string;
  college_id: string;
  email: string;
  candidate_name: string;
  father_name: string;
  status: string;
  form_data?: any;
}

interface PageProps {
  searchParams: Promise<{ draftId?: string }>;
}

export default async function DashboardStudentRegisterPage({ searchParams }: PageProps) {
  const sp = searchParams ? await searchParams : {};
  const draftId = sp.draftId;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = token ? verifyToken(token) : null;

  let draft: DraftRecord | null = null;

  if (draftId && session?.college_id) {
    const { data } = await supabaseAdmin
      .from("student_registration_drafts")
      .select("*")
      .eq("id", draftId)
      .eq("college_id", session.college_id)
      .single();
    if (data) {
      draft = data as DraftRecord;
    }
  }

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
            {draft ? (
              <>
                <Link
                  href="/college/dashboard/drafts"
                  className="hover:text-white transition-colors"
                >
                  Drafts
                </Link>
                <span>/</span>
                <span className="text-[#D4AF37] font-semibold">Resume Draft</span>
              </>
            ) : (
              <span className="text-[#D4AF37] font-semibold">Student Registration</span>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight uppercase">
                {draft
                  ? "Resume Student Registration / अपूर्ण पंजीकरण पूरा करें"
                  : "Student Online Registration / छात्र ऑनलाइन पंजीकरण"}
              </h1>
              <p className="text-xs sm:text-sm text-[#C2DCED] mt-0.5 font-medium">
                {draft ? (
                  <>
                    Candidate: <span className="text-white font-bold">{draft.candidate_name}</span> • Father: <span className="text-white font-bold">{draft.father_name}</span>
                  </>
                ) : (
                  "Candidate Enrollment Portal"
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {draft && (
                <Link
                  href="/college/dashboard/drafts"
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded text-xs font-semibold text-[#F1E4C3] transition-colors"
                >
                  <span>All Drafts / सभी ड्राफ्ट</span>
                </Link>
              )}
              <Link
                href="/college/dashboard"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded text-xs font-semibold text-[#F1E4C3] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 print:p-0 print:m-0 print:max-w-none">
        {/* Draft Resume Info Banner */}
        {draft && (
          <div className="bg-emerald-50 border-2 border-emerald-500/80 rounded-lg p-4 sm:p-4.5 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                    OTP Verification Already Completed / ओटीपी पूर्व सत्यापित
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-200/80 text-emerald-800">
                    Draft Loaded
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-950 font-medium mt-0.5">
                  Resuming saved registration for <strong className="font-bold">{draft.candidate_name}</strong> (<span className="font-mono">{draft.email}</span>). Form changes will automatically autosave.
                </p>
              </div>
            </div>

            <Link
              href="/college/dashboard/register"
              className="self-start sm:self-auto text-xs font-bold text-slate-700 hover:text-[#143E66] bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded transition-colors"
            >
              Start New / नया पंजीकरण शुरू करें
            </Link>
          </div>
        )}

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

        {/* If draft found: render RegistrationForm directly without OTP gate */}
        {draft ? (
          <RegistrationForm
            verifiedEmail={draft.email}
            draftId={draft.id}
            initialData={draft.form_data || {
              candidate_name: draft.candidate_name,
              father_name: draft.father_name,
              email: draft.email,
            }}
          />
        ) : (
          /* Student Email Verification & Registration Flow */
          <StudentRegistrationGatedView />
        )}
      </main>
    </div>
  );
}
