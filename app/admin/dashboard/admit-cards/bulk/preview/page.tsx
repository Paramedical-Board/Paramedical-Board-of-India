"use client";

import React, { Suspense, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

interface StudentPreviewItem {
  registration_id: string;
  candidate_name: string;
  father_name: string;
  dob: string;
  address: string;
  photo_url: string | null;
  registration_no: string;
  course: string;
  college_name: string;
  roll_no: string;
  admit_card_generated_at: string | null;
}

interface ExamCenterInfo {
  center_name?: string;
  center_code?: string;
}

interface DatesheetSubject {
  id: string;
  subject_name: string;
  subject_code: string;
  exam_date: string | null;
  exam_time: string | null;
}

function AdmitCardPreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const course_name = searchParams.get("course_name") || "";
  const academic_session = searchParams.get("academic_session") || "";
  const session_label = searchParams.get("session_label") || "";
  const year_number = searchParams.get("year_number") || "1";

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [students, setStudents] = useState<StudentPreviewItem[]>([]);
  const [examCenter, setExamCenter] = useState<ExamCenterInfo | null>(null);
  const [datesheet, setDatesheet] = useState<DatesheetSubject[]>([]);

  // Per-row editing state
  const [rowForms, setRowForms] = useState<
    Record<
      string,
      {
        candidate_name: string;
        father_name: string;
        dob: string;
        address: string;
        roll_no: string;
        photo_url: string | null;
      }
    >
  >({});
  const [savingRowId, setSavingRowId] = useState<string | null>(null);
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [rowSuccess, setRowSuccess] = useState<Record<string, boolean>>({});
  const [uploadingPhotoRowId, setUploadingPhotoRowId] = useState<string | null>(null);

  useEffect(() => {
    if (!course_name) {
      setPageError("Course name is missing from query parameters.");
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function loadPreviewData() {
      setLoading(true);
      setPageError(null);

      try {
        // 1. Fetch Exam Sessions to resolve session_id and assigned center
        const sessRes = await fetch(`/api/admin/exam-sessions?course_name=${encodeURIComponent(course_name)}`);
        const sessData = await sessRes.json();
        const sessions = sessData.sessions || [];

        let matchedSession = sessions.find((s: any) => s.session_label === session_label);
        if (!matchedSession && sessions.length > 0) {
          matchedSession = sessions[0];
        }

        if (!matchedSession?.id) {
          if (isMounted) {
            setPageError("Could not find an active exam session for this batch.");
            setLoading(false);
          }
          return;
        }

        setExamCenter(matchedSession.exam_centers || null);

        // 2. Fetch Datesheet info (read-only session-wide banner)
        const dsRes = await fetch(
          `/api/admin/datesheets?course_name=${encodeURIComponent(course_name)}&session_id=${encodeURIComponent(matchedSession.id)}`
        );
        const dsData = await dsRes.json();
        if (isMounted) {
          setDatesheet(dsData.subjects || []);
        }

        // 3. Fetch allotted students list (safe lightweight fetch, DOES NOT stamp admit_card_generated_at)
        const yrNum = session_label.includes("2nd Year") || year_number === "2" ? 2 : 1;
        const studentsRes = await fetch(
          `/api/admin/roll-numbers?session_id=${encodeURIComponent(matchedSession.id)}&year_number=${encodeURIComponent(String(yrNum))}`
        );
        const studentsData = await studentsRes.json();

        if (!studentsRes.ok) {
          throw new Error(studentsData.error || "Failed to load candidate list");
        }

        const list: StudentPreviewItem[] = studentsData.students || [];
        if (isMounted) {
          setStudents(list);

          const initialForms: Record<string, any> = {};
          list.forEach((st) => {
            initialForms[st.registration_id] = {
              candidate_name: st.candidate_name || "",
              father_name: st.father_name !== "—" ? st.father_name : "",
              dob: st.dob || "",
              address: st.address || "",
              roll_no: st.roll_no || "",
              photo_url: st.photo_url || null,
            };
          });
          setRowForms(initialForms);
        }
      } catch (err: any) {
        console.error("Failed to load admit card preview data:", err);
        if (isMounted) {
          setPageError(err.message || "Failed to load preview data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPreviewData();

    return () => {
      isMounted = false;
    };
  }, [course_name, session_label, year_number]);

  const handleFieldChange = (
    registrationId: string,
    field: "candidate_name" | "father_name" | "dob" | "address" | "roll_no",
    value: string
  ) => {
    setRowForms((prev) => ({
      ...prev,
      [registrationId]: {
        ...prev[registrationId],
        [field]: value,
      },
    }));

    // Clear previous errors when user edits
    if (rowErrors[registrationId]) {
      setRowErrors((prev) => {
        const copy = { ...prev };
        delete copy[registrationId];
        return copy;
      });
    }
  };

  const handleSaveRow = async (registrationId: string) => {
    const formData = rowForms[registrationId];
    if (!formData) return;

    setSavingRowId(registrationId);
    setRowErrors((prev) => {
      const copy = { ...prev };
      delete copy[registrationId];
      return copy;
    });

    try {
      const yrNum = session_label.includes("2nd Year") || year_number === "2" ? 2 : 1;
      const res = await fetch(`/api/admin/student-registrations/${registrationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_name: formData.candidate_name,
          father_name: formData.father_name,
          dob: formData.dob,
          address: formData.address,
          roll_no: formData.roll_no,
          year_number: yrNum,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setRowErrors((prev) => ({
          ...prev,
          [registrationId]: data.error || "Failed to save changes.",
        }));
        return;
      }

      setRowSuccess((prev) => ({ ...prev, [registrationId]: true }));
      setTimeout(() => {
        setRowSuccess((prev) => {
          const copy = { ...prev };
          delete copy[registrationId];
          return copy;
        });
      }, 3000);
    } catch (err: any) {
      console.error("Save row error:", err);
      setRowErrors((prev) => ({
        ...prev,
        [registrationId]: "Network error saving changes.",
      }));
    } finally {
      setSavingRowId(null);
    }
  };

  const handlePhotoUpload = async (registrationId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size (200 KB max for JPG/JPEG)
    if (!["image/jpeg", "image/jpg"].includes(file.type)) {
      setRowErrors((prev) => ({
        ...prev,
        [registrationId]: "Only JPG/JPEG images are allowed.",
      }));
      return;
    }

    if (file.size > 200 * 1024) {
      setRowErrors((prev) => ({
        ...prev,
        [registrationId]: "Photo must be less than 200 KB.",
      }));
      return;
    }

    setUploadingPhotoRowId(registrationId);
    setRowErrors((prev) => {
      const copy = { ...prev };
      delete copy[registrationId];
      return copy;
    });

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("docType", "photo");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok || !uploadJson.url) {
        throw new Error(uploadJson.error || "Photo upload failed");
      }

      const photoUrl = uploadJson.url;

      // PATCH photo_url immediately to student record
      const patchRes = await fetch(`/api/admin/student-registrations/${registrationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo_url: photoUrl }),
      });

      const patchJson = await patchRes.json();
      if (!patchRes.ok) {
        throw new Error(patchJson.error || "Failed to save uploaded photo URL");
      }

      setRowForms((prev) => ({
        ...prev,
        [registrationId]: {
          ...prev[registrationId],
          photo_url: photoUrl,
        },
      }));

      setRowSuccess((prev) => ({ ...prev, [registrationId]: true }));
      setTimeout(() => {
        setRowSuccess((prev) => {
          const copy = { ...prev };
          delete copy[registrationId];
          return copy;
        });
      }, 3000);
    } catch (err: any) {
      console.error("Photo replacement error:", err);
      setRowErrors((prev) => ({
        ...prev,
        [registrationId]: err.message || "Failed to upload new photo.",
      }));
    } finally {
      setUploadingPhotoRowId(null);
    }
  };

  const bulkPrintUrl = `/admin/dashboard/admit-cards/bulk?course_name=${encodeURIComponent(course_name)}&academic_session=${encodeURIComponent(academic_session)}&session_label=${encodeURIComponent(session_label)}&year_number=${encodeURIComponent(year_number)}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm max-w-md w-full text-center">
          <svg className="w-8 h-8 animate-spin text-[#143E66] mx-auto mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <h2 className="text-sm font-bold text-slate-800">Loading Admit Card Preview...</h2>
          <p className="text-xs text-slate-500 mt-1">Preparing candidate roster and session schedule details.</p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-lg p-6 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
            ✕
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-1">Preview Loading Error</h2>
          <p className="text-xs text-red-600 mb-6">{pageError}</p>
          <Link
            href={`/admin/dashboard/exam-management?tab=roll_admit&course=${encodeURIComponent(course_name)}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#143E66] text-white text-xs font-bold rounded hover:bg-[#0c2a47] transition-colors"
          >
            ← Back to Exam Management
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div>
            <Link
              href={`/admin/dashboard/exam-management?tab=roll_admit&course=${encodeURIComponent(course_name)}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#143E66] hover:underline mb-2"
            >
              ← Back to Exam Management
            </Link>
            <h1 className="text-xl font-black text-[#00031D] tracking-tight">
              Admit Card Verification &amp; Edit Preview / प्रवेश पत्र पूर्वावलोकन
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and correct student details before confirming bulk admit card generation. Changes saved here immediately update the student records.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              href={bulkPrintUrl}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Confirm &amp; Generate All ({students.length})</span>
            </Link>
          </div>
        </div>

        {/* Session Constraint Banner (Read-Only Session Info) */}
        <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 text-xs">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-bold text-blue-950 mb-1">
                <span>Course: {course_name}</span>
                <span>•</span>
                <span>Session: {session_label || academic_session}</span>
                <span>•</span>
                <span>
                  Exam Center: {examCenter?.center_name || "Self Examination Center"} ({examCenter?.center_code || "IPBI"})
                </span>
              </div>
              <p className="text-blue-800 text-[11.5px] leading-relaxed">
                <strong>Batch-Wide Schedule Note:</strong> The Exam Center and Datesheet schedule ({datesheet.length} subject{datesheet.length === 1 ? "" : "s"}) apply to all candidates in this batch. To adjust center assignment or exam timings, please edit the <em>Datesheet</em> or <em>Exam Centers</em> tabs in Exam Management.
              </p>
            </div>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Candidates Slated for Admit Card Issuance ({students.length})
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Edit individual names, father&apos;s name, date of birth, address, or roll numbers. Click &quot;Save&quot; on any modified row.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Safe Preview: Generation timestamps not stamped yet
            </span>
          </div>

          {students.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm font-semibold text-slate-700">No candidates with roll numbers found for this batch.</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                You must allot roll numbers first before generating admit cards.
              </p>
              <Link
                href={`/admin/dashboard/exam-management?tab=roll_admit&course=${encodeURIComponent(course_name)}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#143E66] text-white text-xs font-bold rounded hover:bg-[#0c2a47] transition-colors"
              >
                ← Return to Roll Allotment
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">#</th>
                    <th className="py-3 px-3 w-24 text-center">Photo</th>
                    <th className="py-3 px-3 w-36">Roll Number</th>
                    <th className="py-3 px-3 w-32">Reg / Enr No</th>
                    <th className="py-3 px-3 min-w-[170px]">Candidate Name</th>
                    <th className="py-3 px-3 min-w-[160px]">Father&apos;s Name</th>
                    <th className="py-3 px-3 min-w-[130px]">DOB (YYYY-MM-DD)</th>
                    <th className="py-3 px-3 min-w-[200px]">Address</th>
                    <th className="py-3 px-3 w-28 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {students.map((student, idx) => {
                    const rowForm = rowForms[student.registration_id] || {
                      candidate_name: student.candidate_name,
                      father_name: student.father_name,
                      dob: student.dob,
                      address: student.address,
                      roll_no: student.roll_no,
                      photo_url: student.photo_url,
                    };
                    const isSaving = savingRowId === student.registration_id;
                    const isUploadingPhoto = uploadingPhotoRowId === student.registration_id;
                    const errorMsg = rowErrors[student.registration_id];
                    const isSuccess = rowSuccess[student.registration_id];

                    return (
                      <tr
                        key={student.registration_id}
                        className={`hover:bg-slate-50/60 transition-colors ${
                          errorMsg ? "bg-red-50/40" : ""
                        }`}
                      >
                        <td className="py-3 px-3 text-center font-bold text-slate-400 align-middle">
                          {idx + 1}
                        </td>

                        {/* Photo Column */}
                        <td className="py-3 px-3 text-center align-middle">
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="relative w-12 h-14 bg-slate-100 rounded border border-slate-300 overflow-hidden shadow-2xs flex items-center justify-center">
                              {rowForm.photo_url ? (
                                <Image
                                  src={rowForm.photo_url}
                                  alt={student.candidate_name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              ) : (
                                <span className="text-[9px] text-slate-400 uppercase font-bold">No Photo</span>
                              )}
                              {isUploadingPhoto && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <label className="text-[10px] font-bold text-[#143E66] hover:underline cursor-pointer">
                              Replace
                              <input
                                type="file"
                                accept="image/jpeg,image/jpg"
                                className="hidden"
                                disabled={isUploadingPhoto || isSaving}
                                onChange={(e) => handlePhotoUpload(student.registration_id, e)}
                              />
                            </label>
                          </div>
                        </td>

                        {/* Roll Number Input */}
                        <td className="py-3 px-3 align-middle">
                          <input
                            type="text"
                            value={rowForm.roll_no}
                            onChange={(e) => handleFieldChange(student.registration_id, "roll_no", e.target.value)}
                            className="w-full font-mono font-bold text-[#143E66] px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-[#143E66] focus:border-[#143E66] bg-white"
                          />
                        </td>

                        {/* Registration Number (Read-only) */}
                        <td className="py-3 px-3 align-middle font-mono text-[11.5px] text-slate-600">
                          {student.registration_no}
                        </td>

                        {/* Candidate Name Input */}
                        <td className="py-3 px-3 align-middle">
                          <input
                            type="text"
                            value={rowForm.candidate_name}
                            onChange={(e) => handleFieldChange(student.registration_id, "candidate_name", e.target.value)}
                            className="w-full font-semibold text-slate-900 px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-[#143E66] focus:border-[#143E66] bg-white"
                          />
                        </td>

                        {/* Father's Name Input */}
                        <td className="py-3 px-3 align-middle">
                          <input
                            type="text"
                            value={rowForm.father_name}
                            onChange={(e) => handleFieldChange(student.registration_id, "father_name", e.target.value)}
                            className="w-full text-slate-800 px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-[#143E66] focus:border-[#143E66] bg-white"
                          />
                        </td>

                        {/* DOB Input */}
                        <td className="py-3 px-3 align-middle">
                          <input
                            type="text"
                            value={rowForm.dob}
                            placeholder="YYYY-MM-DD"
                            onChange={(e) => handleFieldChange(student.registration_id, "dob", e.target.value)}
                            className="w-full font-mono text-slate-800 px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-[#143E66] focus:border-[#143E66] bg-white"
                          />
                        </td>

                        {/* Address Input */}
                        <td className="py-3 px-3 align-middle">
                          <input
                            type="text"
                            value={rowForm.address}
                            onChange={(e) => handleFieldChange(student.registration_id, "address", e.target.value)}
                            className="w-full text-slate-800 px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-[#143E66] focus:border-[#143E66] bg-white"
                          />
                        </td>

                        {/* Action Column */}
                        <td className="py-3 px-3 text-center align-middle">
                          <div className="flex flex-col items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleSaveRow(student.registration_id)}
                              disabled={isSaving || isUploadingPhoto}
                              className="px-3 py-1 bg-[#143E66] hover:bg-[#0c2a47] text-white text-[11px] font-bold uppercase rounded shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
                            >
                              {isSaving ? "Saving..." : "Save"}
                            </button>

                            {isSuccess && (
                              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                                ✓ Saved
                              </span>
                            )}
                            {errorMsg && (
                              <span className="text-[10px] font-bold text-red-600 text-center leading-tight max-w-[130px]">
                                {errorMsg}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bottom Confirm & Generate Call-to-Action */}
        {students.length > 0 && (
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Ready to Print Admit Cards?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirming generation will compile printable cards and stamp the generation date for all {students.length} candidates.
              </p>
            </div>

            <Link
              href={bulkPrintUrl}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Confirm &amp; Generate All Admit Cards</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BulkAdmitCardsPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="text-xs font-bold text-slate-500">Loading Admit Card Preview...</div>
        </div>
      }
    >
      <AdmitCardPreviewContent />
    </Suspense>
  );
}
