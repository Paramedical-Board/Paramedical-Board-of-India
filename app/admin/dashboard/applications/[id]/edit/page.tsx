"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import RegistrationForm, { RegistrationQuery } from "@/components/student/registration/RegistrationForm";

export default function AdminEditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [registration, setRegistration] = useState<any>(null);
  const [queries, setQueries] = useState<RegistrationQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch application details from admin endpoint
        const res = await fetch(`/api/admin/applications/${id}`);
        const data = await res.json();

        if (!res.ok || !data.registration) {
          setError(data.error || "Failed to load application details.");
          return;
        }

        setRegistration(data.registration);
        if (Array.isArray(data.queries)) {
          const formattedQueries = data.queries.map((q: any) => ({
            id: q.id,
            field_name: q.field_name,
            message: q.message,
            status: q.status,
          }));
          setQueries(formattedQueries);
        }
      } catch (err) {
        console.error("Load admin edit page data error:", err);
        setError("Network error occurred while loading application.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-slate-500">
        <svg
          className="w-10 h-10 animate-spin mx-auto text-[#143E66] mb-3"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-sm font-semibold">Loading registration for editing...</p>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center">
          <p className="text-red-700 font-bold mb-3">{error || "Application not found"}</p>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#143E66] text-white text-xs font-bold rounded"
          >
            ← Back to Applications List
          </Link>
        </div>
      </div>
    );
  }

  const enr = registration.enrollment_no || registration.registration_no || id;

  return (
    <div className="flex-1 flex flex-col print:bg-white print:min-h-0">
      {/* Header Banner */}
      <section className="w-full bg-[#143E66] text-white py-5 sm:py-6 border-b-4 border-[#D4AF37] print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#C2DCED] mb-2.5">
            <Link href="/admin/dashboard" className="hover:text-white transition-colors">
              Applications
            </Link>
            <span>/</span>
            <Link href={`/admin/dashboard/applications/${id}`} className="hover:text-white transition-colors font-mono font-semibold">
              {enr}
            </Link>
            <span>/</span>
            <span className="text-[#D4AF37] font-semibold">Edit Application</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight uppercase">
                  Edit Application / आवेदन संशोधन (Admin)
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-slate-900">
                  Status: {registration.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#C2DCED] mt-0.5 font-medium">
                Enrollment No: <span className="font-mono font-bold text-white">{enr}</span> • Candidate: <span className="font-bold text-white">{registration.candidate_name}</span>
                {registration.colleges?.college_name && (
                  <span> • College: <span className="font-bold text-white">{registration.colleges.college_name}</span></span>
                )}
              </p>
            </div>

            <Link
              href={`/admin/dashboard/applications/${id}`}
              className="inline-flex items-center gap-1.5 self-start sm:self-auto bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded text-xs font-semibold text-[#F1E4C3] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Application</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Form Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 print:p-0 print:m-0 print:max-w-none">
        <RegistrationForm
          initialData={registration}
          isEditMode={true}
          registrationId={id}
          queries={queries}
          submitEndpoint={`/api/admin/applications/${id}`}
          isAdmin={true}
        />
      </main>
    </div>
  );
}
