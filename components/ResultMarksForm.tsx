"use client";

import React, { useState, useMemo } from "react";
import { ResultData, ResultSubject } from "@/lib/result-data";
import ResultLayout from "@/components/ResultLayout";

interface ResultMarksFormProps {
  initialData: ResultData;
  registrationId: string;
  yearNumber?: number;
}

interface MarkInputState {
  theory: string;
  practical: string;
  ca: string;
}

function computeGrade(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
}

export default function ResultMarksForm({
  initialData,
  registrationId,
  yearNumber = 1,
}: ResultMarksFormProps) {
  // Local authoritative result data
  const [resultData, setResultData] = useState<ResultData>(initialData);

  // Initial publication timestamp based on active year
  const initialPublished =
    yearNumber === 2
      ? initialData.result_published_2nd_year_at
      : initialData.result_published_at;

  const [publishedAt, setPublishedAt] = useState<string | null>(initialPublished || null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Form input values per subjectId
  const [formValues, setFormValues] = useState<Record<string, MarkInputState>>(() => {
    const map: Record<string, MarkInputState> = {};
    initialData.subjects.forEach((s) => {
      map[s.subject_id] = {
        theory: s.theory_marks !== null && s.theory_marks !== undefined ? String(s.theory_marks) : "",
        practical: s.practical_marks !== null && s.practical_marks !== undefined ? String(s.practical_marks) : "",
        ca: s.ca_marks !== null && s.ca_marks !== undefined ? String(s.ca_marks) : "",
      };
    });
    return map;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Handle individual input changes with validation
  const handleInputChange = (
    subjectId: string,
    field: "theory" | "practical" | "ca",
    rawVal: string,
    maxAllowed: number
  ) => {
    setSaveSuccess(null);
    setSaveError(null);

    // Allow empty string to let user backspace
    if (rawVal === "") {
      setFormValues((prev) => ({
        ...prev,
        [subjectId]: {
          ...(prev[subjectId] || { theory: "", practical: "", ca: "" }),
          [field]: "",
        },
      }));
      return;
    }

    // Must be a valid non-negative number
    const num = Number(rawVal);
    if (isNaN(num) || num < 0) return;

    // Clamp or restrict to maxAllowed
    const clampedVal = num > maxAllowed ? String(maxAllowed) : rawVal;

    setFormValues((prev) => ({
      ...prev,
      [subjectId]: {
        ...(prev[subjectId] || { theory: "", practical: "", ca: "" }),
        [field]: clampedVal,
      },
    }));
  };

  // Compute live ResultData for preview from form inputs
  const liveResult: ResultData = useMemo(() => {
    let grandTotalObtained = 0;
    let grandTotalMax = 0;
    let anyEmpty = false;
    let anyFail = false;

    const computedSubjects: ResultSubject[] = resultData.subjects.map((s) => {
      const val = formValues[s.subject_id] || { theory: "", practical: "", ca: "" };
      const totalMax = (s.theory_max ?? 0) + (s.practical_max ?? 0) + (s.ca_max ?? 0);
      grandTotalMax += totalMax;

      const tTrim = val.theory.trim();
      const pTrim = val.practical.trim();
      const cTrim = val.ca.trim();

      if (tTrim === "" || pTrim === "" || cTrim === "") {
        anyEmpty = true;
        const tNum = tTrim !== "" && !isNaN(Number(tTrim)) ? Number(tTrim) : null;
        const pNum = pTrim !== "" && !isNaN(Number(pTrim)) ? Number(pTrim) : null;
        const cNum = cTrim !== "" && !isNaN(Number(cTrim)) ? Number(cTrim) : null;
        const partialTotal = (tNum ?? 0) + (pNum ?? 0) + (cNum ?? 0);
        if (tNum !== null || pNum !== null || cNum !== null) {
          grandTotalObtained += partialTotal;
        }

        return {
          ...s,
          theory_marks: tNum,
          practical_marks: pNum,
          ca_marks: cNum,
          total_marks: null,
          total_max: totalMax,
          percentage: null,
          grade: null,
          subject_result: null,
        };
      }

      const t = Number(tTrim);
      const p = Number(pTrim);
      const c = Number(cTrim);
      const totalObtained = t + p + c;
      grandTotalObtained += totalObtained;

      const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
      const grade = computeGrade(percentage);
      const subjectResult: "PASS" | "FAIL" = percentage >= 40 ? "PASS" : "FAIL";

      if (subjectResult === "FAIL") anyFail = true;

      return {
        ...s,
        theory_marks: t,
        practical_marks: p,
        ca_marks: c,
        total_marks: totalObtained,
        total_max: totalMax,
        percentage: Math.round(percentage * 100) / 100,
        grade,
        subject_result: subjectResult,
      };
    });

    const finalResult: "PASS" | "FAIL" | "INCOMPLETE" = anyEmpty
      ? "INCOMPLETE"
      : anyFail
      ? "FAIL"
      : "PASS";

    return {
      ...resultData,
      subjects: computedSubjects,
      grand_total_obtained: grandTotalObtained,
      grand_total_max: grandTotalMax,
      final_result: finalResult,
    };
  }, [resultData, formValues]);

  // Check if save is enabled: all subjects have all 3 fields filled with valid numbers
  const isSaveEnabled = useMemo(() => {
    if (resultData.subjects.length === 0) return false;
    return resultData.subjects.every((s) => {
      const val = formValues[s.subject_id];
      if (!val) return false;
      const t = val.theory.trim();
      const p = val.practical.trim();
      const c = val.ca.trim();
      if (t === "" || p === "" || c === "") return false;
      const tNum = Number(t);
      const pNum = Number(p);
      const cNum = Number(c);
      if (isNaN(tNum) || isNaN(pNum) || isNaN(cNum)) return false;
      if (tNum < 0 || tNum > s.theory_max) return false;
      if (pNum < 0 || pNum > s.practical_max) return false;
      if (cNum < 0 || cNum > s.ca_max) return false;
      return true;
    });
  }, [resultData.subjects, formValues]);

  // Handle Save
  const handleSaveMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSaveEnabled || isSaving) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const payload = {
        marks: resultData.subjects.map((s) => {
          const val = formValues[s.subject_id];
          return {
            subject_id: s.subject_id,
            theory_marks: Number(val.theory),
            practical_marks: Number(val.practical),
            ca_marks: Number(val.ca),
          };
        }),
      };

      const res = await fetch(`/api/admin/results/${registrationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || "Failed to save subject marks.");
        return;
      }

      if (data.result) {
        // Authoritative server state
        setResultData(data.result);
        setSaveSuccess("Subject marks saved and official marksheet computed successfully! ✓");
        const pub =
          yearNumber === 2
            ? data.result.result_published_2nd_year_at
            : data.result.result_published_at;
        if (pub !== undefined) {
          setPublishedAt(pub);
        }
      }
    } catch (err) {
      console.error("Save marks error:", err);
      setSaveError("Network error occurred while saving marks. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Publish Single Student
  const handlePublish = async () => {
    if (liveResult.final_result === "INCOMPLETE" || isPublishing) return;

    setIsPublishing(true);
    setPublishError(null);
    setPublishSuccess(null);

    try {
      const res = await fetch(`/api/admin/results/${registrationId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: yearNumber }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.error || "Failed to publish student result.");
        return;
      }

      setPublishedAt(data.published_at);
      setPublishSuccess(`Student result published live to student portal successfully! ✓`);
    } catch (err) {
      console.error("Publish error:", err);
      setPublishError("Network error occurred while publishing result.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle Unpublish Single Student
  const handleUnpublish = async () => {
    if (isPublishing) return;

    setIsPublishing(true);
    setPublishError(null);
    setPublishSuccess(null);

    try {
      const res = await fetch(`/api/admin/results/${registrationId}/publish?year=${yearNumber}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: yearNumber }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.error || "Failed to unpublish student result.");
        return;
      }

      setPublishedAt(null);
      setPublishSuccess(`Student result unpublished successfully.`);
    } catch (err) {
      console.error("Unpublish error:", err);
      setPublishError("Network error occurred while unpublishing result.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice (Per Spec) */}
      <div className="no-print print:hidden bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r shadow-xs text-xs sm:text-sm font-semibold text-amber-900 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-amber-600 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>
          Minimum passing marks: 40% combined (Theory + Practical + CA) per subject.
        </span>
      </div>

      {/* Split Screen Container */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Marksheet Preview */}
        <div className="xl:col-span-7 flex flex-col items-center justify-start">
          <div className="w-full mb-3 flex items-center justify-between no-print print:hidden">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-xs sm:text-sm font-bold text-[#00031D] uppercase tracking-wider">
                Live Marksheet Preview / लाइव पूर्वावलोकन
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">
                Status:
              </span>
              {liveResult.final_result === "PASS" ? (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded">
                  PASS ✓
                </span>
              ) : liveResult.final_result === "FAIL" ? (
                <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold text-[10px] rounded">
                  FAIL ✕
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded">
                  INCOMPLETE
                </span>
              )}
            </div>
          </div>

          {/* Render Presentational Marksheet */}
          <div className="w-full overflow-x-auto pb-4">
            <ResultLayout result={liveResult} />
          </div>
        </div>

        {/* Right Column: Marks Entry Form */}
        <div className="xl:col-span-5 no-print print:hidden">
          <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden sticky top-6">
            <div className="bg-[#143E66] px-5 py-3.5 text-white border-b-2 border-[#D4AF37] flex items-center justify-between">
              <div>
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                  Marks Entry / अंक प्रविष्टि
                </h2>
                <p className="text-[11px] text-slate-300 font-normal mt-0.5">
                  Enter student marks for each subject below.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-[#0b2545] px-2.5 py-1 rounded border border-[#1e3a6a] text-[#D4AF37]">
                {resultData.subjects.length} Subjects
              </span>
            </div>

            <form onSubmit={handleSaveMarks} className="p-5 space-y-5">
              {/* Status Notifications */}
              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 rounded-r text-xs font-semibold animate-fadeIn flex items-center justify-between">
                  <span>{saveSuccess}</span>
                  <button
                    type="button"
                    onClick={() => setSaveSuccess(null)}
                    className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}

              {saveError && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r text-xs font-semibold animate-fadeIn flex items-center justify-between">
                  <span>{saveError}</span>
                  <button
                    type="button"
                    onClick={() => setSaveError(null)}
                    className="text-red-700 hover:text-red-900 font-bold ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}

              {publishSuccess && (
                <div className="p-3 bg-emerald-50 border-l-4 border-emerald-600 text-emerald-900 rounded-r text-xs font-semibold animate-fadeIn flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{publishSuccess}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPublishSuccess(null)}
                    className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}

              {publishError && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r text-xs font-semibold animate-fadeIn flex items-center justify-between">
                  <span>{publishError}</span>
                  <button
                    type="button"
                    onClick={() => setPublishError(null)}
                    className="text-red-700 hover:text-red-900 font-bold ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Candidate Info Summary Header */}
              <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs">
                <div className="font-bold text-[#143E66] uppercase text-sm mb-1">
                  {resultData.candidate_name}
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-600 text-[11px]">
                  <div>
                    Roll No: <strong className="font-mono text-slate-900">{resultData.roll_no || "N/A"}</strong>
                  </div>
                  <div>
                    Enrollment No: <strong className="font-mono text-slate-900">{resultData.enrollment_no || resultData.registration_no}</strong>
                  </div>
                  <div className="col-span-2 text-slate-700 font-semibold truncate">
                    Course: {resultData.course}
                  </div>
                </div>
              </div>

              {/* Subject Inputs Cards List */}
              <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
                {resultData.subjects.map((subj, index) => {
                  const val = formValues[subj.subject_id] || { theory: "", practical: "", ca: "" };
                  const liveSubj = liveResult.subjects.find((s) => s.subject_id === subj.subject_id);

                  return (
                    <div
                      key={subj.subject_id}
                      className="border border-slate-200 rounded-lg p-3.5 bg-white hover:border-[#143E66]/40 transition-all shadow-2xs"
                    >
                      {/* Subject Header */}
                      <div className="flex items-start justify-between gap-2 mb-2.5 pb-2 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-mono font-bold text-[10px] rounded border border-slate-200">
                              {subj.subject_code}
                            </span>
                            <span className="text-xs font-bold text-slate-900 uppercase">
                              {subj.subject_name}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Max Total: <strong>{subj.total_max}</strong> (T: {subj.theory_max}, P: {subj.practical_max}, CA: {subj.ca_max})
                          </div>
                        </div>

                        {/* Mini Subject Status */}
                        {liveSubj?.subject_result && (
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                              liveSubj.subject_result === "PASS"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {liveSubj.subject_result} ({liveSubj.grade})
                          </span>
                        )}
                      </div>

                      {/* 3 Input Fields Grid */}
                      <div className="grid grid-cols-3 gap-2.5">
                        {/* Theory */}
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-700 mb-1">
                            Theory (Max: {subj.theory_max})
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={subj.theory_max}
                            required
                            placeholder={`0 - ${subj.theory_max}`}
                            value={val.theory}
                            onChange={(e) =>
                              handleInputChange(subj.subject_id, "theory", e.target.value, subj.theory_max)
                            }
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
                          />
                        </div>

                        {/* Practical */}
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-700 mb-1">
                            Practical (Max: {subj.practical_max})
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={subj.practical_max}
                            required
                            placeholder={`0 - ${subj.practical_max}`}
                            value={val.practical}
                            onChange={(e) =>
                              handleInputChange(subj.subject_id, "practical", e.target.value, subj.practical_max)
                            }
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
                          />
                        </div>

                        {/* CA */}
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-700 mb-1">
                            CA / Int. (Max: {subj.ca_max})
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={subj.ca_max}
                            required
                            placeholder={`0 - ${subj.ca_max}`}
                            value={val.ca}
                            onChange={(e) =>
                              handleInputChange(subj.subject_id, "ca", e.target.value, subj.ca_max)
                            }
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Totals Bar */}
              <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-600">Grand Total: </span>
                  <strong className="font-mono text-slate-900 font-bold">
                    {liveResult.grand_total_obtained} / {liveResult.grand_total_max}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-600">Final: </span>
                  <strong
                    className={`font-bold uppercase ${
                      liveResult.final_result === "PASS"
                        ? "text-emerald-700"
                        : liveResult.final_result === "FAIL"
                        ? "text-red-700"
                        : "text-amber-700"
                    }`}
                  >
                    {liveResult.final_result}
                  </strong>
                </div>
              </div>

              {/* Save Button */}
              <div>
                <button
                  type="submit"
                  disabled={!isSaveEnabled || isSaving}
                  className="w-full py-3 px-4 bg-[#143E66] hover:bg-[#0c2a47] active:bg-[#081f34] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Saving Official Marks...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save Subject Marks / अंक सुरक्षित करें</span>
                    </>
                  )}
                </button>

                {!isSaveEnabled && (
                  <p className="text-[11px] text-amber-700 text-center mt-2 font-medium">
                    * Enter all 3 marks (Theory, Practical, CA) for every subject to enable save.
                  </p>
                )}
              </div>

              {/* Publish Student Result Section */}
              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Live Portal Publishing
                  </span>
                  {publishedAt && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Live on Portal
                    </span>
                  )}
                </div>

                {publishedAt ? (
                  <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-900 font-semibold text-[11px]">
                        <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Published on:</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-emerald-800">
                        {new Date(publishedAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handlePublish}
                        disabled={liveResult.final_result === "INCOMPLETE" || isPublishing}
                        className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isPublishing ? (
                          <>
                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Updating...</span>
                          </>
                        ) : (
                          <span>Re-publish Result / पुनः प्रकाशित करें</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleUnpublish}
                        disabled={isPublishing}
                        className="py-2 px-3 bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-semibold rounded border border-slate-300 hover:border-red-300 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Un-publish this student's result to make it hidden from public portal"
                      >
                        Un-publish
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={liveResult.final_result === "INCOMPLETE" || isPublishing}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isPublishing ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Publishing to Portal...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                          </svg>
                          <span>Publish This Student&apos;s Result / इस छात्र का परिणाम प्रकाशित करें</span>
                        </>
                      )}
                    </button>

                    {liveResult.final_result === "INCOMPLETE" ? (
                      <p className="text-[11px] text-slate-500 text-center mt-1.5 font-medium">
                        * Save complete marks for all subjects to enable publishing this student&apos;s result.
                      </p>
                    ) : (
                      <p className="text-[11px] text-emerald-700 text-center mt-1.5 font-medium">
                        ✓ All marks saved. Click above to immediately publish this student&apos;s result live.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
