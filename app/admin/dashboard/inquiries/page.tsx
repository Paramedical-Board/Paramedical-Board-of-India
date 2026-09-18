"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface InquiryItem {
  id: string;
  category: "student" | "affiliation" | "verification" | "general" | string;
  full_name: string;
  email: string;
  phone?: string | null;
  roll_no?: string | null;
  subject?: string | null;
  message: string;
  status: "new" | "in_progress" | "resolved" | string;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
}

interface InquiryStats {
  all: number;
  new: number;
  in_progress: number;
  resolved: number;
}

export default function AdminInquiriesPage() {
  const router = useRouter();

  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [stats, setStats] = useState<InquiryStats>({
    all: 0,
    new: 0,
    in_progress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Selected Inquiry for Modal
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch inquiries from API
  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetch("/api/admin/inquiries");

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to load inquiries.");
        return;
      }

      setInquiries(data.inquiries || []);
      setStats(
        data.stats || {
          all: 0,
          new: 0,
          in_progress: 0,
          resolved: 0,
        }
      );
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      setErrorMsg("Network error while loading inquiries.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Update Status handler
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      setActionLoading(true);
      setActionError(null);

      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "Failed to update status.");
        return;
      }

      // Update in state
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );

      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }

      // Re-fetch to recalculate accurate stats
      fetchInquiries();
    } catch (err) {
      console.error("Error updating status:", err);
      setActionError("Network error while updating status.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Inquiry handler
  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this inquiry?")) {
      return;
    }

    try {
      setActionLoading(true);
      setActionError(null);

      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setActionError(data.error || "Failed to delete inquiry.");
        return;
      }

      // Remove from state
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      setSelectedInquiry(null);

      fetchInquiries();
    } catch (err) {
      console.error("Error deleting inquiry:", err);
      setActionError("Network error while deleting inquiry.");
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((item) => {
    // Status filter
    if (statusFilter !== "all" && item.status !== statusFilter) {
      return false;
    }

    // Category filter
    if (categoryFilter !== "all" && item.category !== categoryFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = item.full_name?.toLowerCase().includes(q);
      const emailMatch = item.email?.toLowerCase().includes(q);
      const phoneMatch = item.phone?.toLowerCase().includes(q);
      const rollMatch = item.roll_no?.toLowerCase().includes(q);
      const subjectMatch = item.subject?.toLowerCase().includes(q);
      const messageMatch = item.message?.toLowerCase().includes(q);

      if (!nameMatch && !emailMatch && !phoneMatch && !rollMatch && !subjectMatch && !messageMatch) {
        return false;
      }
    }

    return true;
  });

  // Helper for Category badge
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "student":
        return {
          label: "Student Query",
          bg: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "affiliation":
        return {
          label: "College Affiliation",
          bg: "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "verification":
        return {
          label: "Doc Verification",
          bg: "bg-amber-50 text-amber-700 border-amber-200",
        };
      default:
        return {
          label: "General Inquiry",
          bg: "bg-slate-100 text-slate-700 border-slate-200",
        };
    }
  };

  // Helper for Status badge
  const getStatusBadge = (st: string) => {
    switch (st) {
      case "new":
        return {
          label: "New / नया",
          badge: "bg-amber-50 text-amber-700 border border-amber-200",
          dot: "bg-amber-500",
        };
      case "in_progress":
        return {
          label: "Under Review",
          badge: "bg-blue-50 text-blue-700 border border-blue-200",
          dot: "bg-blue-500",
        };
      case "resolved":
        return {
          label: "Resolved / स्वीकृत",
          badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
          dot: "bg-emerald-500",
        };
      default:
        return {
          label: st,
          badge: "bg-slate-100 text-slate-700 border border-slate-200",
          dot: "bg-slate-400",
        };
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Title & Refresh Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#00031D] tracking-tight">
            Helpdesk Inquiries / पूछताछ प्रबंधन
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review and respond to incoming queries submitted through the Contact Us portal.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchInquiries}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs sm:text-sm font-bold text-slate-700 shadow-xs transition-colors self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh List / रिफ्रेश करें</span>
        </button>
      </div>

      {/* KPI Stat Cards (Matching Application Dashboard Design) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* All Records */}
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`p-4 sm:p-5 rounded-2xl text-left transition-all border shadow-xs cursor-pointer ${
            statusFilter === "all"
              ? "bg-[#0A2545] text-white border-[#0A2545] ring-2 ring-[#0A2545]/20"
              : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
          }`}
        >
          <span className={`text-[11px] font-black uppercase tracking-wider block ${statusFilter === "all" ? "text-slate-300" : "text-slate-500"}`}>
            ALL RECORDS
          </span>
          <span className="text-2xl sm:text-3xl font-black mt-1 block">
            {stats.all}
          </span>
        </button>

        {/* New / Unread */}
        <button
          type="button"
          onClick={() => setStatusFilter("new")}
          className={`p-4 sm:p-5 rounded-2xl text-left transition-all border shadow-xs cursor-pointer ${
            statusFilter === "new"
              ? "bg-amber-500 text-white border-amber-600 ring-2 ring-amber-500/20"
              : "bg-white text-slate-800 border-slate-200 hover:border-amber-300"
          }`}
        >
          <span className={`text-[11px] font-black uppercase tracking-wider block ${statusFilter === "new" ? "text-white/80" : "text-amber-600"}`}>
            NEW / UNREAD
          </span>
          <span className="text-2xl sm:text-3xl font-black mt-1 block text-amber-600 group-hover:text-amber-700">
            {stats.new}
          </span>
        </button>

        {/* Under Review */}
        <button
          type="button"
          onClick={() => setStatusFilter("in_progress")}
          className={`p-4 sm:p-5 rounded-2xl text-left transition-all border shadow-xs cursor-pointer ${
            statusFilter === "in_progress"
              ? "bg-blue-600 text-white border-blue-700 ring-2 ring-blue-600/20"
              : "bg-white text-slate-800 border-slate-200 hover:border-blue-300"
          }`}
        >
          <span className={`text-[11px] font-black uppercase tracking-wider block ${statusFilter === "in_progress" ? "text-white/80" : "text-blue-600"}`}>
            UNDER REVIEW
          </span>
          <span className="text-2xl sm:text-3xl font-black mt-1 block text-blue-600">
            {stats.in_progress}
          </span>
        </button>

        {/* Resolved */}
        <button
          type="button"
          onClick={() => setStatusFilter("resolved")}
          className={`p-4 sm:p-5 rounded-2xl text-left transition-all border shadow-xs cursor-pointer ${
            statusFilter === "resolved"
              ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-600/20"
              : "bg-white text-slate-800 border-slate-200 hover:border-emerald-300"
          }`}
        >
          <span className={`text-[11px] font-black uppercase tracking-wider block ${statusFilter === "resolved" ? "text-white/80" : "text-emerald-600"}`}>
            RESOLVED
          </span>
          <span className="text-2xl sm:text-3xl font-black mt-1 block text-emerald-600">
            {stats.resolved}
          </span>
        </button>
      </div>

      {/* Filter & Search Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Instant Search Box */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, Email, Phone, Roll No, or Subject..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#134275] focus:border-transparent bg-slate-50/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 text-base sm:text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#134275]"
            >
              <option value="all">All Categories</option>
              <option value="student">Student Query</option>
              <option value="affiliation">College Affiliation</option>
              <option value="verification">Document Verification</option>
              <option value="general">General Inquiry</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 text-base sm:text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#134275]"
            >
              <option value="all">All Statuses (सभी)</option>
              <option value="new">New / Unread</option>
              <option value="in_progress">Under Review</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Data Container: Mobile Cards (< md) & Table (md+) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5 text-[#134275]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="font-semibold text-slate-600">Loading inquiries...</span>
            </div>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="py-12 px-4 text-center text-slate-400">
            <div className="max-w-sm mx-auto space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 text-lg">
                ✉️
              </div>
              <p className="font-bold text-slate-700">No inquiries found</p>
              <p className="text-xs text-slate-500">
                {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Try clearing your search or status filter criteria."
                  : "New inquiries submitted via the Contact Us page will appear here."}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* 1. Mobile Cards View (< md) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredInquiries.map((inquiry) => {
                const catBadge = getCategoryBadge(inquiry.category);
                const statBadge = getStatusBadge(inquiry.status);
                const dateStr = new Date(inquiry.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <div
                    key={inquiry.id}
                    onClick={() => setSelectedInquiry(inquiry)}
                    className="p-4 hover:bg-slate-50 transition-colors space-y-2.5 cursor-pointer"
                  >
                    {/* Top Badges & Date */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${catBadge.bg}`}>
                        {catBadge.label}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{dateStr}</span>
                    </div>

                    {/* Inquirer Name & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{inquiry.full_name}</h4>
                        <div className="text-xs text-slate-500 truncate">{inquiry.email}</div>
                        {inquiry.roll_no && (
                          <span className="inline-block mt-0.5 text-xs font-mono font-bold text-[#143E66]">
                            Roll: {inquiry.roll_no}
                          </span>
                        )}
                      </div>
                      <div className="shrink-0">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${statBadge.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statBadge.dot}`} />
                          <span>{statBadge.label}</span>
                        </span>
                      </div>
                    </div>

                    {/* Query Message Preview */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700">
                      <div className="font-semibold text-slate-800 truncate">
                        {inquiry.subject || <span className="italic text-slate-400">No Subject</span>}
                      </div>
                      <div className="text-slate-500 line-clamp-2 mt-0.5">
                        {inquiry.message}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInquiry(inquiry);
                      }}
                      className="w-full py-2 px-3 bg-[#0A2545] hover:bg-[#134275] active:bg-[#061828] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>Review &amp; Reply / विवरण देखें</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* 2. Desktop & Tablet Table View (hidden on mobile, visible on md+) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0A2545] text-white text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Candidate / Sender</th>
                    <th className="py-3.5 px-4">Roll No</th>
                    <th className="py-3.5 px-4">Subject &amp; Query</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-[13px]">
                  {filteredInquiries.map((inquiry) => {
                    const catBadge = getCategoryBadge(inquiry.category);
                    const statBadge = getStatusBadge(inquiry.status);
                    const dateStr = new Date(inquiry.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });

                    return (
                      <tr
                        key={inquiry.id}
                        className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        onClick={() => setSelectedInquiry(inquiry)}
                      >
                        {/* Date */}
                        <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-medium">
                          {dateStr}
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${catBadge.bg}`}>
                            {catBadge.label}
                          </span>
                        </td>

                        {/* Sender Info */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#00031D]">{inquiry.full_name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex flex-col">
                            <span>{inquiry.email}</span>
                            {inquiry.phone && <span>{inquiry.phone}</span>}
                          </div>
                        </td>

                        {/* Roll No */}
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-600">
                          {inquiry.roll_no || <span className="text-slate-300 font-sans">—</span>}
                        </td>

                        {/* Subject & Message Preview */}
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-semibold text-slate-800 truncate">
                            {inquiry.subject || <span className="text-slate-400 font-normal italic">No Subject</span>}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {inquiry.message}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${statBadge.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statBadge.dot}`} />
                            <span>{statBadge.label}</span>
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0A2545] hover:bg-[#134275] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                          >
                            <span>Review</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 bg-[#0A2545] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                  Inquiry Review &amp; Actions
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedInquiry.full_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedInquiry(null);
                  setActionError(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
              {actionError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {actionError}
                </div>
              )}

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Category</span>
                  <span className="font-semibold text-slate-800 capitalize mt-0.5 block">
                    {selectedInquiry.category}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Status</span>
                  <span className="font-bold text-slate-800 capitalize mt-0.5 block">
                    {selectedInquiry.status.replace("_", " ")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Received On</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {new Date(selectedInquiry.created_at).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Email Address</span>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="font-semibold text-blue-600 hover:underline mt-0.5 block truncate"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Phone / Mobile</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {selectedInquiry.phone || "Not Provided"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Roll / Enroll No.</span>
                  <span className="font-mono font-semibold text-slate-800 mt-0.5 block">
                    {selectedInquiry.roll_no || "N/A"}
                  </span>
                </div>
              </div>

              {/* Subject & Full Message */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                  Subject
                </span>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold">
                  {selectedInquiry.subject || "No Subject Specified"}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                  Message Content / विवरण
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Left: Delete */}
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors disabled:opacity-50 cursor-pointer text-center sm:text-left"
              >
                Delete Query
              </button>

              {/* Right: Actions */}
              <div className="flex flex-wrap items-center gap-2 justify-end">
                {/* Direct Email Reply */}
                <a
                  href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(
                    `Re: ${selectedInquiry.subject || "Inquiry to Indian Paramedical Board of India"}`
                  )}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-2xs transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Reply via Email</span>
                </a>

                {/* Status Toggle buttons */}
                {selectedInquiry.status !== "in_progress" && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedInquiry.id, "in_progress")}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    Mark Under Review
                  </button>
                )}

                {selectedInquiry.status !== "resolved" ? (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedInquiry.id, "resolved")}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    Mark as Resolved
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedInquiry.id, "new")}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    Reopen as New
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
