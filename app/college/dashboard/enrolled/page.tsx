"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import StatusBadge from "@/components/common/StatusBadge";

interface EnrolledStudent {
  id: string;
  registration_no: string;
  candidate_name: string;
  course: string;
  created_at: string;
}

export default function CollegeEnrolledStudentsPage() {
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEnrolled = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/college/enrolled");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load enrolled students.");
        return;
      }

      setStudents(data.students || []);
    } catch (err) {
      console.error("Fetch enrolled error:", err);
      setError("Network error while loading enrolled students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolled();
  }, []);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.registration_no?.toLowerCase().includes(q) ||
        s.candidate_name?.toLowerCase().includes(q) ||
        s.course?.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 print:p-0 print:m-0 print:max-w-none">
      {/* Top Banner - Hidden on print */}
      <div className="bg-white rounded-lg shadow-xs border border-slate-200 p-6 mb-8 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <Link href="/college/dashboard" className="hover:text-[#143E66] transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span className="font-semibold text-[#143E66]">Enrolled Students</span>
            </nav>
            <h1 className="text-xl sm:text-2xl font-black text-[#00031D] tracking-tight">
              Enrolled Students List / नामांकित छात्र सूची
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Official list of verified and approved student admissions for the academic session.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.print()}
              disabled={students.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#143E66] hover:bg-[#0a233a] rounded shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print List / प्रिंट करें</span>
            </button>

            <button
              onClick={fetchEnrolled}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors cursor-pointer"
            >
              <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by Reg No, Name, Course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#143E66]"
          />
        </div>
      </div>

      {/* Print Only Header */}
      <div className="hidden print:block mb-6 text-center border-b-2 border-slate-800 pb-4">
        <h1 className="text-xl font-black uppercase text-slate-900">INDIAN PARAMEDICAL BOARD OF INDIA</h1>
        <h2 className="text-sm font-bold text-slate-700">Official Enrolled Students Master List (Session 2026-2027)</h2>
        <p className="text-xs text-slate-500 mt-1">Generated on: {new Date().toLocaleDateString("en-IN")}</p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none">
        {loading ? (
          <div className="p-12 text-center text-slate-500 print:hidden">
            <svg className="w-8 h-8 animate-spin mx-auto text-[#143E66] mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm font-semibold">Loading enrolled students...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 bg-red-50">
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={fetchEnrolled}
              className="mt-3 px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="font-bold text-slate-700 text-base">No Enrolled Students Yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Once student applications are approved by the board, they will appear in this confirmed roll list.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#143E66] text-white text-xs uppercase tracking-wider border-b border-slate-200 print:bg-slate-800">
                  <th className="py-3 px-4 font-bold">#</th>
                  <th className="py-3 px-4 font-bold">Registration No</th>
                  <th className="py-3 px-4 font-bold">Candidate Name</th>
                  <th className="py-3 px-4 font-bold">Enrolled Course</th>
                  <th className="py-3 px-4 font-bold">Admission Date</th>
                  <th className="py-3 px-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-slate-700">
                {filteredStudents.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-mono text-xs">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#143E66] whitespace-nowrap">
                      {student.registration_no}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {student.candidate_name}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">
                      {student.course}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {student.created_at ? new Date(student.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      }) : "—"}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <StatusBadge status="approved" size="sm" />
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
