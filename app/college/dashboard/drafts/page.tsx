"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";

interface CollegeDraftItem {
  id: string;
  candidate_name: string;
  father_name: string;
  email: string;
  status: "verified" | "draft" | "submitted";
  form_data?: any;
  created_at: string;
  updated_at: string;
}

export default function CollegeDraftsListPage() {
  const [drafts, setDrafts] = useState<CollegeDraftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [discardingId, setDiscardingId] = useState<string | null>(null);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/college/drafts");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch drafts");
      setDrafts(data.drafts || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load drafts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleDiscard = async (id: string, name: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to discard the registration draft for "${name}"?\nयह ड्राफ्ट हमेशा के लिए हटा दिया जाएगा।`
    );
    if (!confirmDelete) return;

    try {
      setDiscardingId(id);
      const res = await fetch(`/api/college/drafts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete draft");
      }
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to discard draft");
    } finally {
      setDiscardingId(null);
    }
  };

  const stats = useMemo(() => {
    const total = drafts.length;
    const verified = drafts.filter((d) => d.status === "verified").length;
    const inProgress = drafts.filter((d) => d.status === "draft").length;
    return { total, verified, inProgress };
  }, [drafts]);

  const filteredDrafts = useMemo(() => {
    return drafts.filter((draft) => {
      const matchesStatus =
        statusFilter === "all" || draft.status?.toLowerCase() === statusFilter.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        draft.candidate_name?.toLowerCase().includes(q) ||
        draft.father_name?.toLowerCase().includes(q) ||
        draft.email?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [drafts, statusFilter, searchQuery]);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Banner */}
      <div className="bg-white rounded-lg shadow-xs border border-slate-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <Link href="/college/dashboard" className="hover:text-[#143E66] transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span className="font-semibold text-[#143E66]">Verified &amp; Draft Registrations</span>
            </nav>
            <h1 className="text-xl sm:text-2xl font-black text-[#00031D] tracking-tight">
              OTP Verified &amp; Incomplete Registrations / सत्यापित एवं अपूर्ण पंजीकरण
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Students who completed OTP verification. Click &quot;Resume Form&quot; to continue registration without repeating OTP verification.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/college/dashboard/register"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#143E66] hover:bg-[#0a233a] rounded shadow-xs transition-colors"
            >
              <span>+ Register New Student</span>
            </Link>
            <button
              onClick={fetchDrafts}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors cursor-pointer"
            >
              <svg
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
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
              <span>Refresh / रीफ्रेश</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-3 pt-5">
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 text-center">
            <span className="text-xs font-semibold text-slate-500 block mb-0.5">Total Incomplete / कुल</span>
            <span className="text-xl sm:text-2xl font-black text-[#00031D]">{stats.total}</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
            <span className="text-xs font-semibold text-amber-800 block mb-0.5">OTP Verified Only / केवल सत्यापित</span>
            <span className="text-xl sm:text-2xl font-black text-amber-700">{stats.verified}</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <span className="text-xs font-semibold text-blue-800 block mb-0.5">Draft In-Progress / प्रगति पर</span>
            <span className="text-xl sm:text-2xl font-black text-[#143E66]">{stats.inProgress}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-lg shadow-xs border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search candidate name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#143E66] focus:border-transparent transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === "all"
                ? "bg-[#143E66] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({drafts.length})
          </button>
          <button
            onClick={() => setStatusFilter("verified")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === "verified"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            Verified Only ({stats.verified})
          </button>
          <button
            onClick={() => setStatusFilter("draft")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === "draft"
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            Draft In Progress ({stats.inProgress})
          </button>
        </div>
      </div>

      {/* Drafts Table */}
      <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-red-600">
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={fetchDrafts}
              className="mt-3 px-4 py-1.5 bg-[#143E66] text-white text-xs font-bold rounded cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="p-12 text-center text-slate-400">
            <svg
              className="w-8 h-8 animate-spin mx-auto text-[#143E66] mb-3"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-xs font-semibold">Loading verified student drafts...</p>
          </div>
        ) : filteredDrafts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-bold text-slate-700 text-sm">No incomplete drafts found</p>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery ? "Try adjusting your search query." : "All verified registrations have been submitted."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#143E66] text-white text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Candidate Details / अभ्यर्थी</th>
                  <th className="py-3 px-4">Contact / संपर्क</th>
                  <th className="py-3 px-4">Draft Status / स्थिति</th>
                  <th className="py-3 px-4">Last Updated / अंतिम संशोधन</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions / कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredDrafts.map((draft) => (
                  <tr key={draft.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-[#00031D] text-sm sm:text-base">
                        {draft.candidate_name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-400">Father:</span> {draft.father_name}
                      </div>
                      {draft.form_data?.course && (
                        <div className="text-[11px] text-[#143E66] font-semibold mt-1">
                          {draft.form_data.course}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-mono text-xs text-slate-700 font-medium">
                        {draft.email}
                      </div>
                      {draft.form_data?.mobile && (
                        <div className="text-xs text-slate-500 mt-0.5">
                          +91 {draft.form_data.mobile}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {draft.status === "draft" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#143E66] border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#143E66]"></span>
                          Draft In Progress / अपूर्ण
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                          OTP Verified / केवल सत्यापित
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500">
                      <div>{new Date(draft.updated_at || draft.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(draft.updated_at || draft.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/college/dashboard/register?draftId=${draft.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#143E66] hover:bg-[#0a233a] text-white text-xs font-bold rounded shadow-xs transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Resume Form / पूरा करें</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDiscard(draft.id, draft.candidate_name)}
                          disabled={discardingId === draft.id}
                          title="Discard draft / ड्राफ्ट हटाएं"
                          className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
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
