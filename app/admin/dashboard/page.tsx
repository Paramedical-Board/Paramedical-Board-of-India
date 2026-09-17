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
            className="w-full sm:w-48 px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#143E66]"
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

      {/* Applications Table Card */}
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
              className="mt-3 px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="font-bold text-slate-700 text-base">No Applications Found</p>
            <p className="text-xs text-slate-500 mt-1">No student registrations match your current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                      <Link
                        href={`/admin/dashboard/applications/${app.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#143E66] hover:bg-[#0a233a] text-white text-xs font-bold rounded shadow-2xs hover:shadow-xs transition-all"
                      >
                        <span>Review</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
