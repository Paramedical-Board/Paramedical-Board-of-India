import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export default async function CollegeDashboardHomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = token ? verifyToken(token) : null;

  const collegeName = session?.college_name || "Affiliated Institution";

  // Fetch open queries count for notification badge
  let openQueriesCount = 0;
  let draftsCount = 0;
  if (session?.college_id) {
    const [queriesRes, draftsRes] = await Promise.all([
      supabaseAdmin
        .from("registration_queries")
        .select("id, student_registrations!inner(college_id)", { count: "exact", head: true })
        .eq("student_registrations.college_id", session.college_id)
        .eq("status", "open"),
      supabaseAdmin
        .from("student_registration_drafts")
        .select("id", { count: "exact", head: true })
        .eq("college_id", session.college_id)
        .neq("status", "submitted"),
    ]);
    openQueriesCount = queriesRes.count || 0;
    draftsCount = draftsRes.count || 0;
  }

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Welcome Banner */}
      <div className="bg-white rounded-lg shadow-xs border border-slate-200 p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-2 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Portal Active
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#00031D] tracking-tight">
              Welcome, {collegeName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              महाविद्यालय डैशबोर्ड • Indian Paramedical Board of India
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6 flex items-center sm:flex-col sm:items-end justify-between gap-2">
            <span className="text-xs text-slate-400 block font-medium">Institution Status</span>
            <span className="text-xs font-bold text-[#143E66] uppercase bg-slate-100 px-2.5 py-1 rounded inline-block">
              Verified Partner
            </span>
          </div>
        </div>

        {/* Notifications Alert Bar if queries exist */}
        {openQueriesCount > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5 text-amber-900">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <div>
                <p className="text-xs sm:text-sm font-bold">
                  {openQueriesCount} Action Required / ध्यान दें: {openQueriesCount} आवेदन पर आपत्ति उठाई गई है
                </p>
                <p className="text-xs text-amber-800 mt-0.5">
                  The examination board has raised queries on your student registrations. Please review and resubmit.
                </p>
              </div>
            </div>
            <Link
              href="/college/dashboard/notifications"
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded shadow-xs self-start sm:self-auto transition-colors"
            >
              View Queries / देखें
            </Link>
          </div>
        )}

        {/* Quick Actions / Services Section */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-[#B13B1C]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            Available Services / उपलब्ध सेवाएं
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Primary Action Card: Student Registration */}
            <Link
              href="/college/dashboard/register"
              className="group relative bg-linear-to-br from-[#143E66] to-[#0a233a] hover:from-[#184877] hover:to-[#0d2a45] text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border-2 border-[#D4AF37]/50 hover:border-[#D4AF37] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-105 transition-transform">
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Register New Student
                </h3>
                <p className="text-xs text-[#C2DCED] font-medium mb-4">
                  नया छात्र पंजीकरण फॉर्म भरें
                </p>
                <p className="text-xs text-white/80 leading-relaxed">
                  Enroll a student into Paramedical Diploma & Certificate programs.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#F1E4C3]">
                <span>Open Registration Form</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </Link>

            {/* 2. Application Status Tracking Card */}
            <Link
              href="/college/dashboard/applications"
              className="group bg-white hover:bg-slate-50 text-slate-900 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-2 border-slate-200 hover:border-[#143E66] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#EBF4FA] text-[#143E66] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#00031D] mb-1">
                  Application Status
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-4">
                  आवेदन स्थिति एवं ट्रैकिंग
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Track the verification status of all submitted registrations and fix flagged records.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#143E66]">
                <span>Track Applications</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </Link>

            {/* 3. Notifications & Queries Card */}
            <Link
              href="/college/dashboard/notifications"
              className="group bg-white hover:bg-slate-50 text-slate-900 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-2 border-slate-200 hover:border-amber-500 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform relative">
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {openQueriesCount > 0 && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-full shadow-xs">
                      {openQueriesCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-[#00031D]">
                    Notifications / सूचनाएं
                  </h3>
                  {openQueriesCount > 0 && (
                    <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded">
                      {openQueriesCount} Open
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mb-4">
                  बोर्ड आपत्तियां एवं संदेश
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  View remarks and correction requests raised by the central board on submitted candidate files.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>View All Notifications</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </Link>

            {/* 4. Enrolled Students List Card */}
            <Link
              href="/college/dashboard/enrolled"
              className="group bg-white hover:bg-slate-50 text-slate-900 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-2 border-slate-200 hover:border-emerald-600 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-[#00031D]">
                    Enrolled Students List
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">नामांकित छात्रों की सूची</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  View and manage approved student enrollment records and registration numbers for your college.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>View Enrolled Students</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </Link>

            {/* 5. Incomplete & Draft Registrations Card */}
            <Link
              href="/college/dashboard/drafts"
              className="group bg-white hover:bg-slate-50 text-slate-900 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-2 border-slate-200 hover:border-[#143E66] flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform relative">
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
                  {draftsCount > 0 && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-full shadow-xs">
                      {draftsCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-[#00031D]">
                    Incomplete Registrations
                  </h3>
                  {draftsCount > 0 ? (
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                      {draftsCount} Pending
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded">
                      0 Pending
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-4">सत्यापित / अपूर्ण पंजीकरण</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Students who completed OTP verification. Resume forms without repeating OTP verification.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#143E66]">
                <span>View Incomplete Registrations</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </Link>

            {/* 6. Verification / Hall Tickets (Future Placeholder) */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 opacity-75 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center mb-4">
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
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-slate-700">
                    Verification & Hall Tickets
                  </h3>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                    Coming Soon
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">सत्यापन एवं प्रवेश पत्र</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Download batches of student admit cards, enrollment cards, and verification certificates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
