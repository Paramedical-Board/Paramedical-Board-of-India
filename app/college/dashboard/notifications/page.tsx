"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface NotificationQuery {
  id: string;
  registration_id: string;
  field_name: string;
  message: string;
  status: string;
  created_at: string;
  resolved_at?: string | null;
  student_registrations?: {
    college_id: string;
    registration_no: string;
    candidate_name: string;
  } | null;
}

export default function CollegeNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/college/notifications");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load notifications.");
        return;
      }

      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Fetch notifications error:", err);
      setError("Network error occurred while fetching notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Banner */}
      <div className="bg-white rounded-lg shadow-xs border border-slate-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <Link href="/college/dashboard" className="hover:text-[#143E66] transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span className="font-semibold text-[#143E66]">Notifications</span>
            </nav>
            <h1 className="text-xl sm:text-2xl font-black text-[#00031D] tracking-tight flex items-center gap-2.5">
              <span>Board Notifications & Queries / सूचनाएं एवं आपत्तियां</span>
              {notifications.length > 0 && (
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-300">
                  {notifications.length} Open
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Action items and query remarks sent by the verification board regarding student applications.
            </p>
          </div>

          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="inline-flex items-center self-start sm:self-auto gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors cursor-pointer"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <svg className="w-8 h-8 animate-spin mx-auto text-[#143E66] mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm font-semibold">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 bg-red-50">
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={fetchNotifications}
              className="mt-3 px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3 border border-emerald-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-bold text-slate-800 text-base">All Clear! No Open Queries</p>
            <p className="text-xs text-slate-500 mt-1">There are currently no open queries or remarks pending your action.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {notifications.map((notif) => {
              const regNo = notif.student_registrations?.registration_no || "Registration";
              const candidateName = notif.student_registrations?.candidate_name || "Student";

              return (
                <div key={notif.id} className="p-5 sm:p-6 hover:bg-amber-50/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#143E66] bg-[#EBF4FA] px-2.5 py-0.5 rounded border border-[#C2DCED]">
                        {regNo}
                      </span>
                      <strong className="text-sm text-slate-900">{candidateName}</strong>
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 uppercase">
                        Field: {notif.field_name}
                      </span>
                    </div>

                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-md text-xs sm:text-sm text-amber-950">
                      <strong className="text-amber-800 font-semibold block mb-0.5">Board Remarks / निर्देश:</strong>
                      <p className="whitespace-pre-wrap">{notif.message}</p>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Received on: {notif.created_at ? new Date(notif.created_at).toLocaleString("en-IN") : "—"}
                    </p>
                  </div>

                  <Link
                    href={`/college/dashboard/applications/${notif.registration_id}/edit`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold uppercase tracking-wider rounded shadow-md transition-all self-start md:self-center shrink-0 cursor-pointer"
                  >
                    <span>Fix & Resubmit / सुधारें</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
