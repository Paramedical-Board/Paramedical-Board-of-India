"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import StatusBadge from "@/components/common/StatusBadge";

interface ApplicationItem {
  id: string;
  enrollment_no?: string;
  registration_no?: string;
  candidate_name: string;
  course: string;
  status: string;
  created_at: string;
  college_id: string;
  colleges?: {
    college_name: string;
  } | null;
}

export default function AdminApplicationsDashboardPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Delete state
  const [appToDelete, setAppToDelete] = useState<ApplicationItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!appToDelete) return;
    try {
      setDeleting(true);
      setDeleteError(null);
      const res = await fetch(`/api/admin/applications/${appToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || "Failed to delete application.");
        return;
      }

      setApplications((prev) => prev.filter((a) => a.id !== appToDelete.id));
      const deletedName = appToDelete.candidate_name;
      setAppToDelete(null);
      setToastMessage(`Application for "${deletedName}" deleted successfully.`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error("Delete application error:", err);
      setDeleteError("Network error occurred while deleting.");
    } finally {
      setDeleting(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/applications");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load applications.");
        return;
      }

      setApplications(data.applications || []);
    } catch (err) {
      console.error("Fetch applications error:", err);
      setError("Network error occurred while loading applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filtered list
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus =
        statusFilter === "all" || app.status?.toLowerCase() === statusFilter.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const collegeName = app.colleges?.college_name?.toLowerCase() || "";
      const matchesSearch =
        !q ||
        (app.enrollment_no || app.registration_no)?.toLowerCase().includes(q) ||
        app.candidate_name?.toLowerCase().includes(q) ||
        app.course?.toLowerCase().includes(q) ||
        collegeName.includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [applications, statusFilter, searchQuery]);

  // Quick stats
  const stats = useMemo(() => {
    const total = applications.length;
    const submitted = applications.filter((a) => a.status === "submitted").length;
    const underReview = applications.filter((a) => a.status === "under_review").length;
    const queryRaised = applications.filter((a) => a.status === "query_raised").length;
    const approved = applications.filter((a) => a.status === "approved").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;
    return { total, submitted, underReview, queryRaised, approved, rejected };
  }, [applications]);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Banner */}
      <div className="bg-white rounded-lg shadow-xs border border-slate-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#00031D] tracking-tight">
              College Student Applications / छात्र आवेदन प्रबंधन
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Review, raise queries, approve, or reject student registration submissions from affiliated colleges.
            </p>
          </div>

          <button
            onClick={fetchApplications}
            disabled={loading}
            className="inline-flex items-center self-start md:self-auto gap-2 px-3.5 py-2 text-xs font-bold text-[#143E66] bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors cursor-pointer"
          >
            <svg
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh List / रिफ्रेश करें
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <div
            onClick={() => setStatusFilter("all")}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              statusFilter === "all"
                ? "bg-[#143E66] text-white border-[#143E66] shadow-md"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <span className="text-[11px] font-bold block opacity-80 uppercase tracking-wider">All Records</span>
            <span className="text-xl font-black">{stats.total}</span>
          </div>

          <div
            onClick={() => setStatusFilter("submitted")}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              statusFilter === "submitted"
                ? "bg-slate-800 text-white border-slate-800 shadow-md"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <span className="text-[11px] font-bold block opacity-80 uppercase tracking-wider">Submitted</span>
            <span className="text-xl font-black">{stats.submitted}</span>
          </div>

          <div
            onClick={() => setStatusFilter("under_review")}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              statusFilter === "under_review"
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200"
            }`}
          >
            <span className="text-[11px] font-bold block opacity-80 uppercase tracking-wider">Under Review</span>
            <span className="text-xl font-black">{stats.underReview}</span>
          </div>

          <div
            onClick={() => setStatusFilter("query_raised")}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              statusFilter === "query_raised"
                ? "bg-amber-600 text-white border-amber-600 shadow-md"
                : "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200"
            }`}
          >
            <span className="text-[11px] font-bold block opacity-80 uppercase tracking-wider">Query Raised</span>
            <span className="text-xl font-black">{stats.queryRaised}</span>
          </div>

          <div
            onClick={() => setStatusFilter("approved")}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              statusFilter === "approved"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200"
            }`}
          >
            <span className="text-[11px] font-bold block opacity-80 uppercase tracking-wider">Approved</span>
            <span className="text-xl font-black">{stats.approved}</span>
          </div>

          <div
            onClick={() => setStatusFilter("rejected")}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              statusFilter === "rejected"
                ? "bg-red-600 text-white border-red-600 shadow-md"
                : "bg-red-50 hover:bg-red-100 text-red-900 border-red-200"
            }`}
          >
            <span className="text-[11px] font-bold block opacity-80 uppercase tracking-wider">Rejected</span>
            <span className="text-xl font-black">{stats.rejected}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-xs border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by Reg No, Name, College..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#143E66] focus:border-transparent"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="status-select" className="text-xs font-bold text-slate-600 whitespace-nowrap">
            Filter Status:
          </label>
          <select
            id="status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 bg-slate-50 border border-slate-300 rounded text-base sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#143E66]"
          >
            <option value="all">All Statuses (सभी)</option>
            <option value="submitted">Submitted (प्रस्तुत)</option>
            <option value="under_review">Under Review (समीक्षाधीन)</option>
            <option value="query_raised">Query Raised (प्रश्न उठाया गया)</option>
            <option value="approved">Approved (स्वीकृत)</option>
            <option value="rejected">Rejected (अस्वीकृत)</option>
          </select>
        </div>
      </div>

      {/* Applications Table & Mobile Card View */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <svg
              className="w-8 h-8 animate-spin mx-auto text-[#143E66] mb-3"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-sm font-semibold">Loading student applications...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 bg-red-50">
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={fetchApplications}
              className="mt-3 px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-10 sm:p-12 text-center text-slate-500">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="font-bold text-slate-700 text-base">No Applications Found</p>
            <p className="text-xs text-slate-500 mt-1">No student registrations match your current filters.</p>
          </div>
        ) : (
          <>
            {/* 1. Mobile Card View (< md) */}
            <div className="md:hidden divide-y divide-slate-200">
              {filteredApplications.map((app) => (
                <div key={app.id} className="p-4 hover:bg-slate-50 transition-colors space-y-3">
                  {/* Card Header: Candidate Name & Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 text-sm truncate">
                        {app.candidate_name}
                      </h3>
                      <span className="font-mono text-xs font-bold text-[#143E66] block mt-0.5">
                        {app.enrollment_no || app.registration_no}
                      </span>
                    </div>
                    <div className="shrink-0">
                      <StatusBadge status={app.status} size="sm" />
                    </div>
                  </div>

                  {/* Card Body: College & Course Details */}
                  <div className="space-y-1 text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-1.5 truncate">
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="truncate">{app.colleges?.college_name || "Unknown College"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="truncate font-medium text-slate-700">{app.course}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pt-1">
                      Applied: {app.created_at ? new Date(app.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }) : "—"}
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href={`/admin/dashboard/applications/${app.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#143E66] hover:bg-[#0a233a] active:bg-[#061828] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                    >
                      <span>Review Application / आवेदन देखें</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError(null);
                        setAppToDelete(app);
                      }}
                      className="inline-flex items-center justify-center gap-1 py-2 px-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                      title="Delete Application / आवेदन हटाएं"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Desktop & Tablet Table View (hidden on mobile, visible on md+) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#143E66] text-white text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3.5 px-4 font-bold">Enrollment No</th>
                    <th className="py-3.5 px-4 font-bold">Candidate Name</th>
                    <th className="py-3.5 px-4 font-bold">College / Institution</th>
                    <th className="py-3.5 px-4 font-bold">Course</th>
                    <th className="py-3.5 px-4 font-bold">Date</th>
                    <th className="py-3.5 px-4 font-bold">Status</th>
                    <th className="py-3.5 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-700">
                  {filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-amber-50/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#143E66] whitespace-nowrap">
                        {app.enrollment_no || app.registration_no}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {app.candidate_name}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600 max-w-[220px] truncate" title={app.colleges?.college_name || "Unknown College"}>
                        {app.colleges?.college_name || "—"}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600 max-w-[180px] truncate" title={app.course}>
                        {app.course}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {app.created_at ? new Date(app.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        }) : "—"}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={app.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/dashboard/applications/${app.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#143E66] hover:bg-[#0a233a] text-white text-xs font-bold rounded shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                          >
                            <span>Review</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteError(null);
                              setAppToDelete(app);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold rounded shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                            title="Delete Application / आवेदन हटाएं"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {appToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Delete Student Application?
                  </h3>
                  <p className="text-xs text-slate-500">छात्र का आवेदन रिकॉर्ड हमेशा के लिए हटाएं</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-red-50/70 rounded-lg border border-red-100 text-xs sm:text-sm text-slate-700 space-y-1">
                <p className="text-slate-600">Are you sure you want to delete this record?</p>
                <p className="font-bold text-slate-900 text-sm pt-0.5">
                  {appToDelete.candidate_name}
                </p>
                <p className="text-xs text-slate-600">
                  Enrollment: <span className="font-mono font-semibold text-slate-800">{appToDelete.enrollment_no || appToDelete.registration_no || "N/A"}</span>
                </p>
                <p className="text-xs text-slate-600">
                  Course: <span className="font-semibold text-slate-800">{appToDelete.course}</span>
                </p>
              </div>

              <p className="mt-3 text-xs text-red-600 font-medium">
                Warning: This action is permanent and will completely remove this application from the database.
              </p>

              {deleteError && (
                <div className="mt-3 p-2.5 bg-red-100 border border-red-300 text-red-800 text-xs rounded font-medium">
                  {deleteError}
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => {
                    setAppToDelete(null);
                    setDeleteError(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel / रद्द करें
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={confirmDelete}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Record / हटाएं
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

