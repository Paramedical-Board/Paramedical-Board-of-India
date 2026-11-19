"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NocLayout from "@/components/NocLayout";
import PrintButton from "@/components/PrintButton";
import DobSelectPicker from "@/components/common/DobSelectPicker";
import { NocData } from "@/lib/noc-data";

export default function PublicNocPage() {
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noc, setNoc] = useState<NocData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEnrollment = enrollmentNo.trim();
    const trimmedDob = dateOfBirth.trim();

    if (!trimmedEnrollment || !trimmedDob) {
      setError("Please provide both Enrollment Number and Date of Birth.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/public/noc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollment_no: trimmedEnrollment, date_of_birth: trimmedDob }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "NOC could not be found. Please check your details.");
        return;
      }

      if (result.noc) {
        setNoc(result.noc);
      } else {
        setError("Unexpected response received. Please try again.");
      }
    } catch (err) {
      console.error("NOC lookup error:", err);
      setError("Network connection issue. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAgain = () => {
    setNoc(null);
    setError(null);
    setEnrollmentNo("");
    setDateOfBirth("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <div className="no-print print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 print:p-0 print:m-0 print:bg-white print:justify-start print:pt-0">
        {noc ? (
          <div className="w-full max-w-[794px] mx-auto relative">
            <div className="mb-3 sm:mb-0 sm:fixed sm:top-20 sm:right-6 sm:z-50 no-print print:hidden">
              <PrintButton label="Print / Download PDF" className="w-full justify-center sm:w-auto" />
            </div>

            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between no-print print:hidden">
              <button
                type="button"
                onClick={handleSearchAgain}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-[#143E66] border border-slate-300 rounded-md text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Search Another NOC</span>
              </button>
              <span className="text-xs text-slate-500 font-medium">
                Candidate: <strong className="text-slate-800 uppercase">{noc.candidate_name}</strong>
              </span>
            </div>

            <NocLayout noc={noc} />

            <div className="mt-6 text-center no-print print:hidden">
              <button
                type="button"
                onClick={handleSearchAgain}
                className="text-xs font-semibold text-[#143E66] hover:underline"
              >
                ← Look up another registration
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto no-print">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-[#143E66] text-white px-6 py-6 border-b-4 border-[#D4AF37] text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#F1E4C3] mb-2 border border-white/15">
                  <span className="w-2 h-2 rounded-full bg-[#E5C158] animate-pulse" />
                  Registration Division
                </div>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  No Objection Certificate
                </h1>
                <p className="text-xs text-slate-200 mt-1">अनापत्ति प्रमाण-पत्र (NOC) डाउनलोड • Paramedical Board</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                {error && (
                  <div
                    role="alert"
                    className="p-3.5 bg-red-50 border-l-4 border-red-500 rounded-r text-xs text-red-800 font-medium flex items-start gap-2.5"
                  >
                    <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="leading-snug">{error}</span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="noc_enrollment_no"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Enrollment Number / नामांकन संख्या <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="noc_enrollment_no"
                    type="text"
                    required
                    maxLength={40}
                    value={enrollmentNo}
                    onChange={(e) => setEnrollmentNo(e.target.value)}
                    placeholder="e.g. IPMB012401"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#143E66] focus:border-transparent transition-all uppercase"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Enter your enrollment number (e.g. IPMB...).</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Date of Birth / जन्म तिथि <span className="text-red-500">*</span>
                  </label>
                  <DobSelectPicker idPrefix="noc_dob" value={dateOfBirth} onChange={setDateOfBirth} required />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Select your exact Day, Month and Year of birth as registered.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#143E66] hover:bg-[#0c2a47] active:bg-[#081f34] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Searching NOC..." : "Find My NOC"}
                </button>
              </form>

              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center text-xs text-slate-500">
                NOC is issued only to candidates who have passed the final examination and whose result is published.
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-xs text-slate-500 hover:text-[#143E66] font-medium transition-colors">
                ← Back to Homepage
              </Link>
            </div>
          </div>
        )}
      </main>

      <div className="no-print print:hidden">
        <Footer />
      </div>
    </div>
  );
}
