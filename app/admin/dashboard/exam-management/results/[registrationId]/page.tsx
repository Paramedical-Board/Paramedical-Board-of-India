import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { getResultData } from "@/lib/result-data";
import ResultMarksForm from "@/components/ResultMarksForm";
import PrintButton from "@/components/PrintButton";

interface PageProps {
  params: Promise<{ registrationId: string }>;
  searchParams?: Promise<{ returnTab?: string; course?: string; session?: string }>;
}

export default async function ResultEntryPage({ params, searchParams }: PageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const admin = token ? verifyAdminToken(token) : null;

  if (!admin) {
    redirect("/admin/login");
  }

  const { registrationId } = await params;
  const sp = searchParams ? await searchParams : {};
  const isYear2 = (sp as any).year === "2" || (sp as any).year === 2 || (sp as any).session?.includes("2nd Year");
  const { data: resultData, error } = await getResultData(registrationId, isYear2 ? 2 : 1);

  const returnTab = sp.returnTab || "results";
  const returnCourse = sp.course || resultData?.course || "";
  const returnSession = sp.session || "";

  let backUrl = `/admin/dashboard/exam-management?tab=${encodeURIComponent(returnTab)}`;
  if (returnCourse) backUrl += `&course=${encodeURIComponent(returnCourse)}`;
  if (returnSession) backUrl += `&session=${encodeURIComponent(returnSession)}`;

  // If error is present or student not eligible for result entry
  if (error || !resultData) {
    return (
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-red-200 rounded-lg p-8 shadow-sm">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Result Entry Unavailable
          </h2>
          <p className="text-sm text-red-600 font-medium mb-6">
            {error || "Student result details could not be retrieved."}
          </p>
          <Link
            href={backUrl}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#143E66] hover:bg-[#0a233a] text-white text-xs font-bold rounded shadow-xs transition-colors"
          >
            ← Back to Exam Management
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 relative bg-slate-100 print:bg-white print:p-0">
      {/* Top Controls & Breadcrumbs Bar */}
      <div className="max-w-7xl mx-auto mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href={backUrl}
            className="text-xs font-semibold text-[#143E66] hover:underline flex items-center gap-1"
          >
            ← Back to Exam Management Hub
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500 font-mono">
            Roll No: <strong className="text-slate-900">{resultData.roll_no || "N/A"}</strong>
          </span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Reg No: <strong className="text-slate-900">{resultData.registration_no}</strong>
          </span>
        </div>

        {/* Action Button: Print Marksheet */}
        <div className="flex items-center gap-2">
          <PrintButton label="Print Marksheet (PDF)" />
        </div>
      </div>

      {/* Interactive Split-Screen Form + Marksheet Preview */}
      <div className="max-w-7xl mx-auto">
        <ResultMarksForm
          initialData={resultData}
          registrationId={registrationId}
        />
      </div>
    </div>
  );
}
