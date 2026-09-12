"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { PARAMEDICAL_COURSES } from "@/components/student/registration/registrationSchema";

interface SubjectItem {
  id: string;
  course_name: string;
  subject_name: string;
  subject_code: string;
  created_at?: string;
}

interface DatesheetSubjectItem {
  id: string;
  subject_name: string;
  subject_code: string;
  exam_date: string | null;
  exam_time: string | null;
}

interface ExamCenter {
  id: string;
  center_name: string;
  center_code: string;
  address: string | null;
  city: string | null;
}

interface ExamConfig {
  course_name: string;
  session_label: string;
  exam_year_label: string;
  exam_center_id: string;
  exam_centers?: ExamCenter;
}

export default function ExamManagementHubPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>(PARAMEDICAL_COURSES[0]);
  const [activeTab, setActiveTab] = useState<"subjects" | "datesheet" | "config" | "roll_admit">("subjects");

  // Centers list (shared for Config dropdown)
  const [centers, setCenters] = useState<ExamCenter[]>([]);
  const [loadingCenters, setLoadingCenters] = useState(false);

  // Tab A: Subjects State
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [subjectError, setSubjectError] = useState<string | null>(null);
  const [newSubjName, setNewSubjName] = useState("");
  const [newSubjCode, setNewSubjCode] = useState("");
  const [addingSubject, setAddingSubject] = useState(false);
  const [addSubjectSuccess, setAddSubjectSuccess] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);
  const [editSubjName, setEditSubjName] = useState("");
  const [editSubjCode, setEditSubjCode] = useState("");
  const [savingEditSubject, setSavingEditSubject] = useState(false);

  // Tab B: Datesheet State
  const [datesheetSubjects, setDatesheetSubjects] = useState<DatesheetSubjectItem[]>([]);
  const [datesheetComplete, setDatesheetComplete] = useState<boolean>(false);
  const [loadingDatesheet, setLoadingDatesheet] = useState(false);
  const [datesheetError, setDatesheetError] = useState<string | null>(null);
  const [datesheetFormValues, setDatesheetFormValues] = useState<
    Record<string, { exam_date: string; exam_time: string }>
  >({});
  const [savingDateRowId, setSavingDateRowId] = useState<string | null>(null);
  const [dateRowSuccessMsg, setDateRowSuccessMsg] = useState<Record<string, string>>({});

  // Tab C: Exam Config State
  const [config, setConfig] = useState<ExamConfig | null>(null);
  const [sessionLabel, setSessionLabel] = useState("");
  const [examYearLabel, setExamYearLabel] = useState("");
  const [examCenterId, setExamCenterId] = useState("");
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSuccess, setConfigSuccess] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  // Tab D: Roll Numbers & Admit Cards State
  const [allottingRolls, setAllottingRolls] = useState(false);
  const [allotResultMsg, setAllotResultMsg] = useState<string | null>(null);
  const [allotError, setAllotError] = useState<string | null>(null);

  // Fetch all centers once
  const fetchCenters = async () => {
    try {
      setLoadingCenters(true);
      const res = await fetch("/api/admin/exam-centers");
      const data = await res.json();
      if (res.ok) {
        setCenters(data.centers || []);
      }
    } catch (err) {
      console.error("Fetch centers error:", err);
    } finally {
      setLoadingCenters(false);
    }
  };

  // Fetch Tab A: Subjects
  const fetchSubjects = async (course: string) => {
    try {
      setLoadingSubjects(true);
      setSubjectError(null);
      const res = await fetch(`/api/admin/subjects?course_name=${encodeURIComponent(course)}`);
      const data = await res.json();
      if (!res.ok) {
        setSubjectError(data.error || "Failed to load subjects");
        return;
      }
      setSubjects(data.subjects || []);
    } catch (err) {
      console.error("Fetch subjects error:", err);
      setSubjectError("Network error loading subjects.");
    } finally {
      setLoadingSubjects(false);
    }
  };

  // Fetch Tab B: Datesheet
  const fetchDatesheet = async (course: string) => {
    try {
      setLoadingDatesheet(true);
      setDatesheetError(null);
      const res = await fetch(`/api/admin/datesheets?course_name=${encodeURIComponent(course)}`);
      const data = await res.json();
      if (!res.ok) {
        setDatesheetError(data.error || "Failed to load datesheet");
        return;
      }
      const list: DatesheetSubjectItem[] = data.subjects || [];
      setDatesheetSubjects(list);
      setDatesheetComplete(data.complete ?? false);

      // Initialize form inputs map
      const initialMap: Record<string, { exam_date: string; exam_time: string }> = {};
      list.forEach((s) => {
        initialMap[s.id] = {
          exam_date: s.exam_date || "",
          exam_time: s.exam_time || "Morning (10:00 AM)",
        };
      });
      setDatesheetFormValues(initialMap);
    } catch (err) {
      console.error("Fetch datesheet error:", err);
      setDatesheetError("Network error loading datesheet.");
    } finally {
      setLoadingDatesheet(false);
    }
  };

  // Fetch Tab C: Config
  const fetchConfig = async (course: string) => {
    try {
      setLoadingConfig(true);
      setConfigError(null);
      setConfigSuccess(null);
      const res = await fetch(`/api/admin/course-exam-config?course_name=${encodeURIComponent(course)}`);
      const data = await res.json();
      if (!res.ok) {
        setConfigError(data.error || "Failed to load exam config");
        return;
      }
      const existing = data.configs && data.configs.length > 0 ? data.configs[0] : null;
      setConfig(existing);
      if (existing) {
        setSessionLabel(existing.session_label || "");
        setExamYearLabel(existing.exam_year_label || "");
        setExamCenterId(existing.exam_center_id || "");
      } else {
        setSessionLabel("Mar 2023 - Apr 2024");
        setExamYearLabel("2024 (1st Year)");
        setExamCenterId(centers.length > 0 ? centers[0].id : "");
      }
    } catch (err) {
      console.error("Fetch config error:", err);
      setConfigError("Network error loading exam config.");
    } finally {
      setLoadingConfig(false);
    }
  };

  // Load everything on course change
  useEffect(() => {
    fetchCenters();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchSubjects(selectedCourse);
      fetchDatesheet(selectedCourse);
      fetchConfig(selectedCourse);
      setAllotResultMsg(null);
      setAllotError(null);
    }
  }, [selectedCourse]);

  // Handlers for Tab A: Subjects
  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newSubjName.trim();
    const code = newSubjCode.trim().toUpperCase();
    if (!name || !code) return;

    setAddingSubject(true);
    setSubjectError(null);
    setAddSubjectSuccess(null);

    try {
      const res = await fetch("/api/admin/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_name: selectedCourse,
          subject_name: name,
          subject_code: code,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubjectError(data.error || "Failed to add subject");
        return;
      }
      setAddSubjectSuccess(`Subject "${name}" added successfully.`);
      setNewSubjName("");
      setNewSubjCode("");
      fetchSubjects(selectedCourse);
      fetchDatesheet(selectedCourse);
    } catch (err) {
      console.error("Add subject error:", err);
      setSubjectError("Network error adding subject.");
    } finally {
      setAddingSubject(false);
    }
  };

  const handleEditSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;

    const name = editSubjName.trim();
    const code = editSubjCode.trim().toUpperCase();
    if (!name && !code) return;

    setSavingEditSubject(true);
    try {
      const res = await fetch(`/api/admin/subjects/${editingSubject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_name: name,
          subject_code: code,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update subject");
        return;
      }
      setEditingSubject(null);
      fetchSubjects(selectedCourse);
      fetchDatesheet(selectedCourse);
    } catch (err) {
      console.error("Edit subject error:", err);
      alert("Network error updating subject.");
    } finally {
      setSavingEditSubject(false);
    }
  };

  // Handlers for Tab B: Datesheet
  const handleDatesheetRowChange = (subjectId: string, field: "exam_date" | "exam_time", value: string) => {
    setDatesheetFormValues((prev) => ({
      ...prev,
      [subjectId]: {
        ...(prev[subjectId] || { exam_date: "", exam_time: "" }),
        [field]: value,
      },
    }));
  };

  const handleSaveDatesheetRow = async (subjectId: string) => {
    const row = datesheetFormValues[subjectId];
    if (!row || !row.exam_date || !row.exam_time) {
      alert("Please provide both Exam Date and Exam Time.");
      return;
    }

    setSavingDateRowId(subjectId);
    setDateRowSuccessMsg((prev) => ({ ...prev, [subjectId]: "" }));

    try {
      const res = await fetch("/api/admin/datesheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_id: subjectId,
          exam_date: row.exam_date,
          exam_time: row.exam_time,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save datesheet entry.");
        return;
      }
      setDateRowSuccessMsg((prev) => ({ ...prev, [subjectId]: "Saved ✓" }));
      fetchDatesheet(selectedCourse);
    } catch (err) {
      console.error("Save datesheet row error:", err);
      alert("Network error saving datesheet entry.");
    } finally {
      setSavingDateRowId(null);
    }
  };

  // Handlers for Tab C: Exam Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionLabel.trim() || !examYearLabel.trim() || !examCenterId) {
      setConfigError("Session label, exam year label, and exam center are all required.");
      return;
    }

    setSavingConfig(true);
    setConfigError(null);
    setConfigSuccess(null);

    try {
      const res = await fetch("/api/admin/course-exam-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_name: selectedCourse,
          session_label: sessionLabel.trim(),
          exam_year_label: examYearLabel.trim(),
          exam_center_id: examCenterId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setConfigError(data.error || "Failed to save exam config.");
        return;
      }
      setConfigSuccess("Course Exam Configuration saved successfully!");
      fetchConfig(selectedCourse);
    } catch (err) {
      console.error("Save config error:", err);
      setConfigError("Network error saving exam configuration.");
    } finally {
      setSavingConfig(false);
    }
  };

  // Handlers for Tab D: Roll Numbers
  const handleAllotRollNumbers = async () => {
    if (
      !confirm(
        `Are you sure you want to allot roll numbers to all approved students in "${selectedCourse}"?`
      )
    ) {
      return;
    }

    setAllottingRolls(true);
    setAllotResultMsg(null);
    setAllotError(null);

    try {
      const res = await fetch("/api/admin/roll-numbers/allot-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_name: selectedCourse }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAllotError(data.error || "Failed to allot roll numbers.");
        return;
      }
      if (data.allotted > 0) {
        setAllotResultMsg(`Success: ${data.allotted} roll numbers successfully allotted!`);
      } else {
        setAllotResultMsg(data.message || "0 students needed roll numbers (all approved students already have roll numbers).");
      }
    } catch (err) {
      console.error("Allot roll numbers error:", err);
      setAllotError("Network error during roll number allotment.");
    } finally {
      setAllottingRolls(false);
    }
  };

  // Missing count calculation for datesheet banner
  const missingDatesheetCount = useMemo(() => {
    return datesheetSubjects.filter((s) => !s.exam_date || !s.exam_time).length;
  }, [datesheetSubjects]);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-lg shadow-xs border border-slate-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full mb-2 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Examination Division • Academic Sessions
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#00031D] tracking-tight">
              Exam Management Hub / परीक्षा प्रबंधन
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Configure course subjects, datesheets, examination centers, roll number allotment, and bulk admit cards.
            </p>
          </div>

          {/* Quick Action Link to Manage Exam Centers */}
          <Link
            href="/admin/dashboard/exam-management/centers"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#143E66] hover:bg-[#0c2a47] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transition-all self-start md:self-auto"
          >
            <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Manage Exam Centers ({centers.length})</span>
          </Link>
        </div>

        {/* Course Selector Dropdown */}
        <div className="mt-5 bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Paramedical Course / पाठ्यक्रम चुनें:
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-xs sm:text-sm font-bold text-[#143E66] focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
            >
              {PARAMEDICAL_COURSES.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Course Status Badges */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <span
              className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                subjects.length > 0
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {subjects.length} Subjects
            </span>
            <span
              className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                datesheetComplete
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              {datesheetComplete ? "Datesheet Ready ✓" : "Datesheet Pending"}
            </span>
            <span
              className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                config
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              {config ? "Config Set ✓" : "Config Missing"}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("subjects")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "subjects"
              ? "border-[#143E66] text-[#143E66] bg-white rounded-t-md"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>1. Subjects ({subjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("datesheet")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "datesheet"
              ? "border-[#143E66] text-[#143E66] bg-white rounded-t-md"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>2. Datesheet</span>
          {datesheetComplete ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("config")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "config"
              ? "border-[#143E66] text-[#143E66] bg-white rounded-t-md"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>3. Exam Config</span>
          {config && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
        </button>

        <button
          onClick={() => setActiveTab("roll_admit")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "roll_admit"
              ? "border-[#143E66] text-[#143E66] bg-white rounded-t-md"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="text-[#D4AF37]">★</span>
          <span>4. Roll Numbers &amp; Admit Cards</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB A: SUBJECTS                                                           */}
      {/* ========================================================================= */}
      {activeTab === "subjects" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left 2 Cols: Subjects Table */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#143E66] px-5 py-3.5 text-white border-b-2 border-[#D4AF37] flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                Subjects for {selectedCourse} ({subjects.length})
              </h2>
              <button
                onClick={() => fetchSubjects(selectedCourse)}
                disabled={loadingSubjects}
                className="text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1"
              >
                <svg className={`w-3.5 h-3.5 ${loadingSubjects ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            {loadingSubjects ? (
              <div className="p-12 text-center text-slate-500">
                <svg className="w-8 h-8 animate-spin mx-auto text-[#143E66] mb-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-xs font-semibold">Loading subjects...</p>
              </div>
            ) : subjects.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-slate-700">No Subjects Added Yet</p>
                <p className="text-xs text-slate-400 mt-1">Use the &quot;Add Subject&quot; form on the right to define subjects for this course.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                      <th className="py-3 px-4 w-12 text-center">#</th>
                      <th className="py-3 px-4">Subject Name</th>
                      <th className="py-3 px-4">Subject Code</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {subjects.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-3 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{s.subject_name}</td>
                        <td className="py-3 px-4 font-mono font-bold text-[#143E66]">{s.subject_code}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setEditingSubject(s);
                              setEditSubjName(s.subject_name);
                              setEditSubjCode(s.subject_code);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-[#143E66] hover:text-white text-[#143E66] font-bold rounded border border-slate-300 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right 1 Col: Add Subject Form */}
          <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#00031D] px-5 py-3.5 text-white border-b-2 border-[#D4AF37]">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add New Subject</span>
              </h2>
            </div>

            <form onSubmit={handleAddSubject} className="p-5 space-y-4">
              {addSubjectSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded text-xs font-semibold">
                  {addSubjectSuccess}
                </div>
              )}
              {subjectError && (
                <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded text-xs font-semibold">
                  {subjectError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject Name / विषय का नाम <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newSubjName}
                  onChange={(e) => setNewSubjName(e.target.value)}
                  placeholder="e.g. HUMAN ANATOMY & PHYSIOLOGY"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] focus:outline-hidden uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject Code / विषय कोड <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newSubjCode}
                  onChange={(e) => setNewSubjCode(e.target.value.toUpperCase())}
                  placeholder="e.g. HAP-101 or MLT01"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] focus:outline-hidden uppercase"
                />
              </div>

              <button
                type="submit"
                disabled={addingSubject}
                className="w-full py-2.5 px-4 bg-[#143E66] hover:bg-[#0c2a47] active:bg-[#081f34] text-white text-xs font-bold uppercase tracking-wider rounded shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {addingSubject ? "Adding Subject..." : "Add Subject to Course"}
              </button>
            </form>
          </div>

          {/* Edit Subject Modal */}
          {editingSubject && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
              onClick={() => setEditingSubject(null)}
            >
              <div
                className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                  <h3 className="text-sm font-bold text-[#00031D] uppercase tracking-wider">
                    Edit Subject / विषय संपादित करें
                  </h3>
                  <button
                    onClick={() => setEditingSubject(null)}
                    className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleEditSubjectSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Subject Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editSubjName}
                      onChange={(e) => setEditSubjName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Subject Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editSubjCode}
                      onChange={(e) => setEditSubjCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] uppercase"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setEditingSubject(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingEditSubject}
                      className="px-4 py-2 bg-[#143E66] hover:bg-[#0c2a47] text-white text-xs font-bold rounded shadow-md disabled:opacity-50"
                    >
                      {savingEditSubject ? "Saving..." : "Save Subject"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB B: DATESHEET                                                          */}
      {/* ========================================================================= */}
      {activeTab === "datesheet" && (
        <div className="space-y-6">
          {/* Status Banner */}
          {datesheetSubjects.length === 0 ? (
            <div className="p-6 bg-amber-50 border-l-4 border-amber-500 rounded-r text-amber-900 text-xs sm:text-sm">
              <strong className="block font-bold mb-1">No subjects defined for this course!</strong>
              Please go to <strong>Tab 1 (Subjects)</strong> and add the course subjects first before setting up the datesheet schedule.
            </div>
          ) : datesheetComplete ? (
            <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r text-emerald-900 text-xs sm:text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  <strong>Datesheet Complete ✓</strong> All {datesheetSubjects.length} subjects have exam dates &amp; times assigned. Admit cards can now be generated for eligible students.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r text-amber-900 text-xs sm:text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>
                  <strong>Datesheet Incomplete:</strong> {missingDatesheetCount} subject(s) are missing exam dates or timings. Complete all rows below to unlock admit card generation.
                </span>
              </div>
            </div>
          )}

          {/* Datesheet Schedule Table */}
          {datesheetSubjects.length > 0 && (
            <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
              <div className="bg-[#143E66] px-5 py-3.5 text-white border-b-2 border-[#D4AF37] flex items-center justify-between">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                  Examination Datesheet Schedule / परीक्षा समय सारणी
                </h2>
                <button
                  onClick={() => fetchDatesheet(selectedCourse)}
                  disabled={loadingDatesheet}
                  className="text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1"
                >
                  <svg className={`w-3.5 h-3.5 ${loadingDatesheet ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                      <th className="py-3 px-4 w-10 text-center">#</th>
                      <th className="py-3 px-4">Subject Name</th>
                      <th className="py-3 px-4 w-32">Subject Code</th>
                      <th className="py-3 px-4 w-48">Exam Date (दिनांक)</th>
                      <th className="py-3 px-4 w-48">Exam Time / Shift (समय)</th>
                      <th className="py-3 px-4 w-32 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {datesheetSubjects.map((s, idx) => {
                      const formVal = datesheetFormValues[s.id] || { exam_date: "", exam_time: "" };
                      const isSaving = savingDateRowId === s.id;
                      const successMsg = dateRowSuccessMsg[s.id];

                      return (
                        <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{s.subject_name}</td>
                          <td className="py-3 px-4 font-mono font-bold text-[#143E66]">{s.subject_code}</td>
                          <td className="py-3 px-4">
                            <input
                              type="date"
                              required
                              value={formVal.exam_date}
                              onChange={(e) => handleDatesheetRowChange(s.id, "exam_date", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66]"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              required
                              placeholder="e.g. 10:00 AM or Morning"
                              value={formVal.exam_time}
                              onChange={(e) => handleDatesheetRowChange(s.id, "exam_time", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66]"
                            />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {successMsg && (
                                <span className="text-[11px] font-bold text-emerald-600 animate-fadeIn">
                                  {successMsg}
                                </span>
                              )}
                              <button
                                onClick={() => handleSaveDatesheetRow(s.id)}
                                disabled={isSaving}
                                className="px-3 py-1.5 bg-[#143E66] hover:bg-[#0c2a47] text-white font-bold rounded shadow-xs text-xs transition-colors cursor-pointer disabled:opacity-50"
                              >
                                {isSaving ? "Saving..." : "Save Row"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB C: EXAM CONFIG                                                        */}
      {/* ========================================================================= */}
      {activeTab === "config" && (
        <div className="max-w-2xl bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
          <div className="bg-[#143E66] px-5 py-3.5 text-white border-b-2 border-[#D4AF37]">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
              Course Examination Session &amp; Center Configuration
            </h2>
          </div>

          <form onSubmit={handleSaveConfig} className="p-6 space-y-5">
            {configSuccess && (
              <div className="p-3.5 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 rounded-r text-xs font-semibold">
                {configSuccess}
              </div>
            )}
            {configError && (
              <div className="p-3.5 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r text-xs font-semibold">
                {configError}
              </div>
            )}

            {/* Warning if no centers exist */}
            {centers.length === 0 && !loadingCenters && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-xs text-red-800">
                <strong>No exam centers registered!</strong> You must create at least one exam center before configuring this course.
                <div className="mt-2">
                  <Link
                    href="/admin/dashboard/exam-management/centers"
                    className="inline-flex items-center gap-1 font-bold text-red-900 underline"
                  >
                    → Go to Exam Centers Page to Add a Center
                  </Link>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Session Label / सत्र विवरण <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={sessionLabel}
                onChange={(e) => setSessionLabel(e.target.value)}
                placeholder="e.g. Mar 2023 - Apr 2024"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Printed on the admit card title banner (e.g. &quot;EXAMINATION HALL TICKET (SESSION MAR 2023 - APR 2024)&quot;).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Exam Year Label / परीक्षा वर्ष <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={examYearLabel}
                onChange={(e) => setExamYearLabel(e.target.value)}
                placeholder="e.g. 2024 (1st Year) or 2024"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Includes the 4-digit year used to form student Roll Numbers (e.g. 2024 → &quot;24&quot; suffix).
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Assigned Exam Center / आवंटित परीक्षा केंद्र <span className="text-red-500">*</span>
                </label>
                <Link
                  href="/admin/dashboard/exam-management/centers"
                  className="text-[11px] font-semibold text-[#143E66] hover:underline"
                >
                  + Add New Center
                </Link>
              </div>
              <select
                required
                value={examCenterId}
                onChange={(e) => setExamCenterId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66]"
              >
                <option value="">-- Select Examination Center --</option>
                {centers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.center_name} ({c.center_code}) {c.city ? `• ${c.city}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={savingConfig || centers.length === 0}
              className="w-full py-3 px-4 bg-[#143E66] hover:bg-[#0c2a47] active:bg-[#081f34] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {savingConfig ? "Saving Configuration..." : "Save Course Exam Configuration"}
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB D: ROLL NUMBERS & ADMIT CARDS                                         */}
      {/* ========================================================================= */}
      {activeTab === "roll_admit" && (
        <div className="space-y-6">
          {/* Readiness Summary Card */}
          <div className="bg-white rounded-lg shadow-xs border border-slate-200 p-6">
            <h2 className="text-sm font-bold text-[#00031D] uppercase tracking-wider mb-3">
              Admit Card Generation Readiness Checklist / तैयारी समीक्षा
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Check 1 */}
              <div className={`p-4 rounded-lg border ${subjects.length > 0 ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-red-50 border-red-200 text-red-900"}`}>
                <div className="flex items-center gap-2 font-bold text-xs uppercase mb-1">
                  <span>{subjects.length > 0 ? "✓ 1. Subjects Configured" : "✕ 1. Missing Subjects"}</span>
                </div>
                <p className="text-[11.5px] opacity-90">{subjects.length} subject(s) added to this course.</p>
              </div>

              {/* Check 2 */}
              <div className={`p-4 rounded-lg border ${datesheetComplete ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-red-50 border-red-200 text-red-900"}`}>
                <div className="flex items-center gap-2 font-bold text-xs uppercase mb-1">
                  <span>{datesheetComplete ? "✓ 2. Datesheet Complete" : "✕ 2. Incomplete Datesheet"}</span>
                </div>
                <p className="text-[11.5px] opacity-90">
                  {datesheetComplete ? "All exam dates and times set." : `${missingDatesheetCount} subject(s) missing exam dates.`}
                </p>
              </div>

              {/* Check 3 */}
              <div className={`p-4 rounded-lg border ${config ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-red-50 border-red-200 text-red-900"}`}>
                <div className="flex items-center gap-2 font-bold text-xs uppercase mb-1">
                  <span>{config ? "✓ 3. Exam Config Set" : "✕ 3. Config Missing"}</span>
                </div>
                <p className="text-[11.5px] opacity-90">
                  {config ? `Assigned to center (${config.exam_centers?.center_code || "OK"}).` : "Session & exam center not yet set."}
                </p>
              </div>
            </div>

            {/* Action 1: Roll Number Allotment */}
            <div className="pt-5 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Step 1: Allot Roll Numbers to Approved Students
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generates sequential roll numbers for all approved candidates who do not already have one. Safe to run multiple times.
                </p>
                {allotResultMsg && (
                  <div className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 inline-block">
                    {allotResultMsg}
                  </div>
                )}
                {allotError && (
                  <div className="mt-2 text-xs font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded border border-red-200 inline-block">
                    {allotError}
                  </div>
                )}
              </div>

              <button
                onClick={handleAllotRollNumbers}
                disabled={allottingRolls || !config}
                className="px-5 py-2.5 bg-[#143E66] hover:bg-[#0c2a47] active:bg-[#081f34] text-white text-xs font-bold uppercase tracking-wider rounded shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
              >
                {allottingRolls ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Allotting Roll Numbers...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Allot Roll Numbers / रोल नंबर आवंटित करें</span>
                  </>
                )}
              </button>
            </div>

            {/* Action 2: Generate Bulk Admit Cards */}
            <div className="pt-5 mt-5 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Step 2: Generate &amp; Print Bulk Admit Cards
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Opens the printable bulk admit cards page for all approved and configured candidates in this course.
                </p>
              </div>

              <Link
                href={`/admin/dashboard/admit-cards/bulk?course_name=${encodeURIComponent(selectedCourse)}`}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded shadow-md transition-all flex items-center gap-2 shrink-0"
              >
                <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Generate Bulk Admit Cards / सामूहिक प्रवेश पत्र</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
