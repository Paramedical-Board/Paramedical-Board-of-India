import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getAdmitCardData, AdmitCardData } from "@/lib/admit-card-data";
import AdmitCardLayout from "@/components/AdmitCardLayout";
import PrintButton from "@/components/PrintButton";

import { getBatchAcademicSessionFromSessionLabel } from "@/lib/course-session-utils";

import { checkStudentFirstYearPassed } from "@/lib/result-data";

interface BulkPageProps {
  searchParams: Promise<{ course_name?: string; academic_session?: string; session_label?: string; year_number?: string }>;
}

export default async function BulkAdmitCardsPage({ searchParams }: BulkPageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const admin = token ? verifyAdminToken(token) : null;

  if (!admin) {
    redirect("/admin/login");
  }

  const { course_name, academic_session, session_label, year_number } = await searchParams;

  if (!course_name) {
    return (
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-amber-200 rounded-lg p-8 shadow-sm">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Course Name Required</h2>
          <p className="text-sm text-slate-600 mb-6">
            Please specify a course name in the URL query parameter (e.g., <code>?course_name=...</code>) to generate bulk admit cards.
          </p>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#143E66] hover:bg-[#0a233a] text-white text-xs font-bold rounded transition-colors"
          >
            ← Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  // Resolve target exam session ID if session_label is provided
  let targetSessionId: string | null = null;
  if (session_label) {
    const { data: sessionData } = await supabaseAdmin
      .from("exam_sessions")
      .select("id")
      .eq("course_name", course_name)
      .eq("session_label", session_label)
      .maybeSingle();

    if (sessionData?.id) {
      targetSessionId = sessionData.id;
    }
  }

  // Fetch approved registrations for this course and session
  let query = supabaseAdmin
    .from("student_registrations")
    .select("id, enrollment_no, candidate_name")
    .eq("course", course_name)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  const isSecondYear = session_label?.includes("2nd Year") || year_number === "2";
  const yrNum = isSecondYear ? 2 : 1;

  if (targetSessionId) {
    if (isSecondYear) {
      query = query.eq("exam_session_id_2nd_year", targetSessionId);
    } else {
      query = query.eq("exam_session_id", targetSessionId);
    }
  } else if (academic_session) {
    query = query.eq("academic_session", academic_session);
  } else if (session_label) {
    const resolved = getBatchAcademicSessionFromSessionLabel(session_label);
    if (resolved) {
      query = query.eq("academic_session", resolved);
    }
  }

  const { data: registrations, error: regError } = await query;

  if (regError) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          Failed to load students: {regError.message}
        </div>
      </div>
    );
  }

  const admitCards: AdmitCardData[] = [];
  const skipped: { id: string; enrollment_no?: string; registration_no?: string; candidate_name: string; reason: string }[] = [];

  if (registrations && registrations.length > 0) {
    for (const reg of (registrations as any[])) {
      const enr = reg.enrollment_no || reg.registration_no;
      if (isSecondYear) {
        const check = await checkStudentFirstYearPassed(reg.id);
        if (!check.passed) {
          skipped.push({
            id: reg.id,
            enrollment_no: enr,
            registration_no: enr,
            candidate_name: reg.candidate_name,
            reason: check.reason || "1st Year examination not cleared / pending",
          });
          continue;
        }
      }

      const { data, error } = await getAdmitCardData(reg.id, yrNum);
      if (error || !data) {
        skipped.push({
          id: reg.id,
          enrollment_no: enr,
          registration_no: enr,
          candidate_name: reg.candidate_name,
          reason: error ?? "Unknown error",
        });
      } else {
        admitCards.push(data);
      }
    }
  }

  const hasAdmitCards = admitCards.length > 0;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 relative bg-slate-100 print:bg-white print:p-0">
      {/* Floating Print Button */}
      {hasAdmitCards && (
        <div className="fixed top-20 right-6 z-50 no-print print:hidden">
          <PrintButton label={`Print All (${admitCards.length})`} />
        </div>
      )}

      {/* Screen-Only Top Control & Summary Bar */}
      <div className="max-w-[794px] mx-auto mb-6 no-print print:hidden space-y-4">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="text-xs font-semibold text-[#143E66] hover:underline flex items-center gap-1"
          >
            ← Back to Dashboard
          </Link>
          <span className="text-xs text-slate-500 font-medium">
            Course: <strong className="text-slate-800">{course_name}</strong>
          </span>
        </div>

        {/* Generation Status Overview */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <h2 className="text-sm font-bold text-[#00031D] mb-1">
            Bulk Admit Cards Generation / सामूहिक प्रवेश पत्र
          </h2>
          <p className="text-xs text-slate-500">
            Total Approved: <strong>{(registrations?.length || 0)}</strong> | Ready to Print:{" "}
            <strong className="text-emerald-700">{admitCards.length}</strong> | Skipped:{" "}
            <strong className="text-amber-700">{skipped.length}</strong>
          </p>
        </div>

        {/* Skipped Students Warning Table (Screen-Only) */}
        {skipped.length > 0 && (
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-amber-700 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Skipped Students ({skipped.length}) — Action Required
              </h3>
            </div>
            <p className="text-[11px] text-amber-800 mb-3">
              The following students could not be included in bulk printing because their record or course schedule is incomplete (e.g. missing roll number, missing datesheet, or exam center).
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs bg-white rounded border border-amber-200">
                <thead>
                  <tr className="bg-amber-100/70 text-amber-900 text-[11px] uppercase border-b border-amber-200">
                    <th className="py-2 px-3 font-bold">Enrollment No</th>
                    <th className="py-2 px-3 font-bold">Candidate Name</th>
                    <th className="py-2 px-3 font-bold">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 text-[11.5px]">
                  {skipped.map((s) => (
                    <tr key={s.id}>
                      <td className="py-2 px-3 font-mono font-bold text-[#143E66]">{s.enrollment_no || s.registration_no}</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">{s.candidate_name}</td>
                      <td className="py-2 px-3 text-red-600 font-medium">{s.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Empty State when no admit cards can be printed */}
      {!hasAdmitCards && (
        <div className="max-w-[794px] mx-auto bg-white border border-slate-200 rounded-lg p-10 text-center shadow-xs">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            No Admit Cards Ready for Printing
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            {registrations?.length === 0
              ? `No approved student registrations found for course "${course_name}".`
              : `All approved students for "${course_name}" are missing required prerequisites (roll number, exam center, or datesheet). Check the skipped list above.`}
          </p>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#143E66] hover:bg-[#0a233a] text-white text-xs font-bold rounded transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      )}

      {/* Printable Cards List */}
      {hasAdmitCards && (
        <div className="bulk-admit-cards-container space-y-8 print:space-y-0">
          {admitCards.map((admitCard, index) => (
            <div
              key={admitCard.enrollment_no || admitCard.registration_no || index}
              className="admit-card-item-wrapper break-after-page"
              style={{
                pageBreakAfter: "always",
                breakAfter: "page",
              }}
            >
              <AdmitCardLayout admitCard={admitCard} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
