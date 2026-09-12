import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { getAdmitCardData } from "@/lib/admit-card-data";
import AdmitCardLayout from "@/components/AdmitCardLayout";
import PrintButton from "@/components/PrintButton";

interface PageProps {
  params: Promise<{ registrationId: string }>;
}

export default async function IndividualAdmitCardPage({ params }: PageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const admin = token ? verifyAdminToken(token) : null;

  if (!admin) {
    redirect("/admin/login");
  }

  const { registrationId } = await params;
  const { data: admitCard, error } = await getAdmitCardData(registrationId);

  // If error is present or registration not eligible
  if (error || !admitCard) {
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
            Admit Card Unavailable
          </h2>
          <p className="text-sm text-red-600 font-medium mb-6">
            {error || "Registration details could not be retrieved."}
          </p>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#143E66] hover:bg-[#0a233a] text-white text-xs font-bold rounded shadow-xs transition-colors"
          >
            ← Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 relative bg-slate-100 print:bg-white print:p-0">
      {/* Floating Print Button */}
      <div className="fixed top-20 right-6 z-50 no-print print:hidden">
        <PrintButton />
      </div>

      {/* Breadcrumb Navigation on Screen */}
      <div className="max-w-[794px] mx-auto mb-4 flex items-center justify-between no-print print:hidden">
        <Link
          href="/admin/dashboard"
          className="text-xs font-semibold text-[#143E66] hover:underline flex items-center gap-1"
        >
          ← Back to Dashboard
        </Link>
        <span className="text-xs text-slate-500 font-mono">
          Roll No: <strong>{admitCard.roll_no || "N/A"}</strong>
        </span>
      </div>

      {/* Render Admit Card */}
      <AdmitCardLayout admitCard={admitCard} />
    </div>
  );
}
