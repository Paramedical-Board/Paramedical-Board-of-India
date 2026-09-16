"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import StatusBadge from "@/components/common/StatusBadge";

interface QueryItem {
  id: string;
  field_name: string;
  message: string;
  status: "open" | "resolved" | string;
  created_at: string;
  resolved_at?: string | null;
}

interface RegistrationData {
  id: string;
  enrollment_no?: string;
  registration_no?: string;
  candidate_name: string;
  father_name: string;
  mother_name: string;
  dob: string;
  category: string;
  gender: string;
  mobile: string;
  email: string;
  academic_session: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  course: string;
  education?: {
    high_school?: { board?: string; year?: string; total?: number; obtained?: number; percentage?: number };
    intermediate?: { board?: string; year?: string; total?: number; obtained?: number; percentage?: number };
    graduation?: { board?: string; year?: string; total?: number; obtained?: number; percentage?: number };
    other?: { board?: string; year?: string; total?: number; obtained?: number; percentage?: number };
  };
  photo_url?: string;
  signature_url?: string;
  aadhaar_url?: string;
  marksheet_10th_url?: string;
  marksheet_12th_url?: string;
  affidavit_url?: string;
  status: string;
  created_at: string;
  college_id: string;
  colleges?: {
    college_name: string;
  } | null;
}

const QUERY_FIELD_OPTIONS = [
  { value: "candidate_name", label: "Candidate Name / अभ्यर्थी का नाम" },
  { value: "father_name", label: "Father's Name / पिता का नाम" },
  { value: "mother_name", label: "Mother's Name / माता का नाम" },
  { value: "dob", label: "Date of Birth / जन्म तिथि" },
  { value: "category", label: "Category / श्रेणी" },
  { value: "gender", label: "Gender / लिंग" },
  { value: "mobile", label: "Mobile Number / मोबाइल नंबर" },
  { value: "email", label: "Email Address / ईमेल" },
  { value: "academic_session", label: "Academic Session / शैक्षणिक सत्र" },
  { value: "address", label: "Address / पता" },
  { value: "district", label: "District / जिला" },
  { value: "state", label: "State / राज्य" },
  { value: "pincode", label: "Pincode / पिन कोड" },
  { value: "course", label: "Course / पाठ्यक्रम" },
  { value: "photo_url", label: "Passport Photo / पासपोर्ट फोटो" },
  { value: "signature_url", label: "Signature / हस्ताक्षर" },
  { value: "aadhaar_url", label: "Aadhaar Card / आधार कार्ड" },
  { value: "marksheet_10th_url", label: "10th Marksheet / 10वीं अंकतालिका" },
  { value: "marksheet_12th_url", label: "12th Marksheet / 12वीं अंकतालिका" },
  { value: "affidavit_url", label: "Affidavit / शपथ पत्र" },
];

export default function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [registration, setRegistration] = useState<RegistrationData | null>(null);
  const [queries, setQueries] = useState<QueryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Raise Query Form State
  const [selectedField, setSelectedField] = useState(QUERY_FIELD_OPTIONS[0].value);
  const [queryMessage, setQueryMessage] = useState("");
  const [submittingQuery, setSubmittingQuery] = useState(false);
  const [querySuccess, setQuerySuccess] = useState<string | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  // Action states (Approve / Reject)
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Modal preview for images
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/applications/${id}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Application not found");
        return;
      }

      setRegistration(data.registration);
      setQueries(data.queries || []);
    } catch (err) {
      console.error("Fetch detail error:", err);
      setError("Failed to load application details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleRaiseQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryMessage.trim()) {
      setQueryError("Please write a detailed query message.");
      return;
    }

    setSubmittingQuery(true);
    setQueryError(null);
    setQuerySuccess(null);

    try {
      const res = await fetch(`/api/admin/applications/${id}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field_name: selectedField,
          message: queryMessage.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setQueryError(data.error || "Failed to raise query.");
        return;
      }

      setQuerySuccess("Query successfully raised and notified to college.");
      setQueryMessage("");
      // Refresh application data to show new query and updated status
      fetchData();
    } catch (err) {
      console.error("Raise query error:", err);
      setQueryError("Network error occurred while submitting query.");
    } finally {
      setSubmittingQuery(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to APPROVE this student registration? This will enroll the student.")) {
      return;
    }

    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch(`/api/admin/applications/${id}/approve`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setActionError(data.error || "Failed to approve application.");
        return;
      }

      setActionSuccess("Application approved successfully!");
      fetchData();
    } catch (err) {
      console.error("Approve error:", err);
      setActionError("Network error while approving application.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("Are you sure you want to REJECT this student application? This action is terminal.")) {
      return;
    }

    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await fetch(`/api/admin/applications/${id}/reject`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setActionError(data.error || "Failed to reject application.");
        return;
      }

      setActionSuccess("Application rejected successfully.");
      fetchData();
    } catch (err) {
      console.error("Reject error:", err);
      setActionError("Network error while rejecting application.");
    } finally {
      setActionLoading(false);
    }
  };

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
        <p className="text-sm font-semibold">Loading application details...</p>
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

  const isTerminal = registration.status === "approved" || registration.status === "rejected";

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Breadcrumb & Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/admin/dashboard" className="hover:text-[#143E66] font-medium transition-colors">
              Applications
            </Link>
            <span>/</span>
            <span className="font-mono font-bold text-[#143E66]">{registration.enrollment_no || registration.registration_no}</span>
          </nav>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-[#00031D] tracking-tight">
              {registration.candidate_name}
            </h1>
            <StatusBadge status={registration.status} size="md" />
            {registration.status === "approved" && (
              <Link
                href={`/admin/dashboard/admit-cards/${registration.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#143E66] hover:bg-[#0a233a] text-white text-xs font-bold rounded shadow-2xs transition-colors"
                title="View / Print Candidate Admit Card"
              >
                <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Generate Admit Card / प्रवेश पत्र</span>
              </Link>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            College: <strong className="text-slate-800">{registration.colleges?.college_name || "—"}</strong> • Applied on{" "}
            {registration.created_at ? new Date(registration.created_at).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }) : "—"}
          </p>
        </div>

        {/* Action Buttons: Approve / Reject */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded border border-slate-300 transition-colors"
          >
            Back
          </Link>

          <button
            onClick={handleApprove}
            disabled={actionLoading || isTerminal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Approve Application</span>
          </button>

          <button
            onClick={handleReject}
            disabled={actionLoading || isTerminal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold uppercase tracking-wider rounded shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Reject</span>
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {actionSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r text-emerald-800 text-xs sm:text-sm font-semibold">
          {actionSuccess}
        </div>
      )}
      {actionError && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r text-red-800 text-xs sm:text-sm font-semibold">
          {actionError}
        </div>
      )}

      {/* Layout Grid: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Full Application Details & Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Candidate Particulars */}
          <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#143E66] px-5 py-3 text-white border-b-2 border-[#D4AF37] flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                1. Personal & Contact Information / व्यक्तिगत एवं संपर्क विवरण
              </h3>
              <span className="text-[11px] font-mono text-[#D4AF37] font-bold">
                {registration.academic_session}
              </span>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Candidate Name / नाम</span>
                <span className="font-bold text-slate-800 text-sm">{registration.candidate_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Father&apos;s Name / पिता का नाम</span>
                <span className="font-bold text-slate-800 text-sm">{registration.father_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Mother&apos;s Name / माता का नाम</span>
                <span className="font-bold text-slate-800 text-sm">{registration.mother_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Date of Birth / जन्म तिथि</span>
                <span className="font-bold text-slate-800">{registration.dob}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Gender / लिंग</span>
                <span className="font-bold text-slate-800 uppercase">{registration.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Category / श्रेणी</span>
                <span className="font-bold text-slate-800 uppercase">{registration.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Mobile / मोबाइल</span>
                <span className="font-bold text-slate-800">{registration.mobile}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block font-medium">Email / ईमेल</span>
                <span className="font-bold text-slate-800">{registration.email}</span>
              </div>
              <div className="sm:col-span-3 pt-2 border-t border-slate-100">
                <span className="text-slate-400 block font-medium">Full Address / स्थायी पता</span>
                <span className="font-semibold text-slate-800">
                  {registration.address}, District: {registration.district}, State: {registration.state} - {registration.pincode}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Course Details */}
          <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#143E66] px-5 py-3 text-white border-b-2 border-[#D4AF37]">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                2. Enrolled Course / पाठ्यक्रम
              </h3>
            </div>
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Applied Course Name</span>
                <span className="text-base font-black text-[#00031D]">{registration.course}</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 px-3 py-2 rounded text-xs">
                <span className="text-slate-500 block">Academic Session</span>
                <span className="font-bold text-amber-900">{registration.academic_session}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Academic Qualifications */}
          <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#143E66] px-5 py-3 text-white border-b-2 border-[#D4AF37]">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                3. Educational Qualifications / शैक्षणिक योग्यता
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase">
                    <th className="py-2.5 px-4">Examination</th>
                    <th className="py-2.5 px-4">Board / University</th>
                    <th className="py-2.5 px-4">Passing Year</th>
                    <th className="py-2.5 px-4">Max Marks</th>
                    <th className="py-2.5 px-4">Marks Obtained</th>
                    <th className="py-2.5 px-4">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  <tr>
                    <td className="py-2.5 px-4 font-bold">10th / High School</td>
                    <td className="py-2.5 px-4">{registration.education?.high_school?.board || "—"}</td>
                    <td className="py-2.5 px-4">{registration.education?.high_school?.year || "—"}</td>
                    <td className="py-2.5 px-4">{registration.education?.high_school?.total || "—"}</td>
                    <td className="py-2.5 px-4">{registration.education?.high_school?.obtained || "—"}</td>
                    <td className="py-2.5 px-4 font-bold text-[#143E66]">{registration.education?.high_school?.percentage ? `${registration.education.high_school.percentage}%` : "—"}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold">12th / Intermediate</td>
                    <td className="py-2.5 px-4">{registration.education?.intermediate?.board || "—"}</td>
                    <td className="py-2.5 px-4">{registration.education?.intermediate?.year || "—"}</td>
                    <td className="py-2.5 px-4">{registration.education?.intermediate?.total || "—"}</td>
                    <td className="py-2.5 px-4">{registration.education?.intermediate?.obtained || "—"}</td>
                    <td className="py-2.5 px-4 font-bold text-[#143E66]">{registration.education?.intermediate?.percentage ? `${registration.education.intermediate.percentage}%` : "—"}</td>
                  </tr>
                  {registration.education?.graduation?.board && (
                    <tr>
                      <td className="py-2.5 px-4 font-bold">Graduation</td>
                      <td className="py-2.5 px-4">{registration.education.graduation.board}</td>
                      <td className="py-2.5 px-4">{registration.education.graduation.year || "—"}</td>
                      <td className="py-2.5 px-4">{registration.education.graduation.total || "—"}</td>
                      <td className="py-2.5 px-4">{registration.education.graduation.obtained || "—"}</td>
                      <td className="py-2.5 px-4 font-bold text-[#143E66]">{registration.education.graduation.percentage ? `${registration.education.graduation.percentage}%` : "—"}</td>
                    </tr>
                  )}
                  {registration.education?.other?.board && (
                    <tr>
                      <td className="py-2.5 px-4 font-bold">Other Qualification</td>
                      <td className="py-2.5 px-4">{registration.education.other.board}</td>
                      <td className="py-2.5 px-4">{registration.education.other.year || "—"}</td>
                      <td className="py-2.5 px-4">{registration.education.other.total || "—"}</td>
                      <td className="py-2.5 px-4">{registration.education.other.obtained || "—"}</td>
                      <td className="py-2.5 px-4 font-bold text-[#143E66]">{registration.education.other.percentage ? `${registration.education.other.percentage}%` : "—"}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: 6 Uploaded Documents */}
          <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#143E66] px-5 py-3 text-white border-b-2 border-[#D4AF37]">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                4. Uploaded Documents Verification / अपलोड किए गए दस्तावेज
              </h3>
            </div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Photo */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-center">
                <span className="text-xs font-bold text-slate-700 block mb-2">Passport Photo</span>
                {registration.photo_url ? (
                  <div
                    onClick={() => setPreviewImage({ src: registration.photo_url!, title: "Passport Photo" })}
                    className="relative w-24 h-28 mx-auto bg-slate-200 rounded overflow-hidden cursor-pointer hover:opacity-90 border border-slate-300 shadow-2xs"
                  >
                    <Image src={registration.photo_url} alt="Photo" fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <span className="text-xs text-red-500 italic">Not uploaded</span>
                )}
              </div>

              {/* Signature */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-center">
                <span className="text-xs font-bold text-slate-700 block mb-2">Signature</span>
                {registration.signature_url ? (
                  <div
                    onClick={() => setPreviewImage({ src: registration.signature_url!, title: "Candidate Signature" })}
                    className="relative w-28 h-16 mx-auto bg-white rounded overflow-hidden cursor-pointer hover:opacity-90 border border-slate-300 shadow-2xs my-4"
                  >
                    <Image src={registration.signature_url} alt="Signature" fill className="object-contain p-1" unoptimized />
                  </div>
                ) : (
                  <span className="text-xs text-red-500 italic">Not uploaded</span>
                )}
              </div>

              {/* Aadhaar Card */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col justify-between text-center">
                <span className="text-xs font-bold text-slate-700 block mb-2">Aadhaar Card</span>
                {registration.aadhaar_url ? (
                  <a
                    href={registration.aadhaar_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#143E66] text-white text-xs font-semibold rounded hover:bg-[#0a233a] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>View Aadhaar</span>
                  </a>
                ) : (
                  <span className="text-xs text-red-500 italic">Not uploaded</span>
                )}
              </div>

              {/* 10th Marksheet */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col justify-between text-center">
                <span className="text-xs font-bold text-slate-700 block mb-2">10th Marksheet</span>
                {registration.marksheet_10th_url ? (
                  <a
                    href={registration.marksheet_10th_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#143E66] text-white text-xs font-semibold rounded hover:bg-[#0a233a] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>View 10th</span>
                  </a>
                ) : (
                  <span className="text-xs text-red-500 italic">Not uploaded</span>
                )}
              </div>

              {/* 12th Marksheet */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col justify-between text-center">
                <span className="text-xs font-bold text-slate-700 block mb-2">12th Marksheet</span>
                {registration.marksheet_12th_url ? (
                  <a
                    href={registration.marksheet_12th_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#143E66] text-white text-xs font-semibold rounded hover:bg-[#0a233a] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>View 12th</span>
                  </a>
                ) : (
                  <span className="text-xs text-red-500 italic">Not uploaded</span>
                )}
              </div>

              {/* Affidavit / Declaration */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col justify-between text-center">
                <span className="text-xs font-bold text-slate-700 block mb-2">Affidavit / Doc</span>
                {registration.affidavit_url ? (
                  <a
                    href={registration.affidavit_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#143E66] text-white text-xs font-semibold rounded hover:bg-[#0a233a] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>View Affidavit</span>
                  </a>
                ) : (
                  <span className="text-xs text-red-500 italic">Not uploaded</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Query Management Desk */}
        <div className="space-y-6">
          {/* Raise Query Card */}
          <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-amber-500 px-5 py-3 text-white flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Raise Query / आपत्ति दर्ज करें
              </h3>
            </div>

            <form onSubmit={handleRaiseQuery} className="p-5 space-y-4">
              {querySuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-800 font-medium">
                  {querySuccess}
                </div>
              )}
              {queryError && (
                <div className="p-3 bg-red-50 border border-red-300 rounded text-xs text-red-800 font-medium">
                  {queryError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Field / संबंधित फ़ील्ड <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  disabled={isTerminal}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden disabled:opacity-50"
                >
                  {QUERY_FIELD_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Query Message / निर्देश या कारण <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={queryMessage}
                  onChange={(e) => setQueryMessage(e.target.value)}
                  disabled={isTerminal}
                  placeholder="Explain clearly what the college needs to fix (e.g. 'Marksheet image is blurry. Please upload clear original scan')..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={submittingQuery || isTerminal}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold uppercase tracking-wider rounded shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {submittingQuery ? (
                  "Submitting Query..."
                ) : (
                  "Submit Query to College"
                )}
              </button>

              {isTerminal && (
                <p className="text-[11px] text-slate-500 italic text-center">
                  Queries cannot be raised on approved or rejected applications.
                </p>
              )}
            </form>
          </div>

          {/* Queries History List */}
          <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#00031D] px-5 py-3 text-white flex items-center justify-between border-b border-[#D4AF37]/40">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                Query History ({queries.length})
              </h3>
            </div>

            <div className="p-4 divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {queries.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4 italic">
                  No queries raised for this application yet.
                </p>
              ) : (
                queries.map((q) => (
                  <div key={q.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {q.field_name}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          q.status === "resolved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium my-1">{q.message}</p>
                    <span className="text-[10px] text-slate-400 block">
                      Raised: {q.created_at ? new Date(q.created_at).toLocaleString("en-IN") : "—"}
                    </span>
                    {q.resolved_at && (
                      <span className="text-[10px] text-emerald-600 block">
                        Resolved: {new Date(q.resolved_at).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full p-4 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <h4 className="text-sm font-bold text-slate-800">{previewImage.title}</h4>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="relative w-full h-80 bg-slate-100 rounded flex items-center justify-center overflow-hidden">
              <Image
                src={previewImage.src}
                alt={previewImage.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
