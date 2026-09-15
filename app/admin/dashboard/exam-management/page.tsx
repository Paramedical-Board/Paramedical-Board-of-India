"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PARAMEDICAL_COURSES } from "@/components/student/registration/registrationSchema";
import {
  getCourseSessionOptions,
  isTwoYearCourse,
  CourseSessionOption,
} from "@/lib/course-session-utils";

interface SubjectItem {
  id: string;
  course_name: string;
  subject_name: string;
  subject_code: string;
  theory_max?: number | null;
  practical_max?: number | null;
  ca_max?: number | null;
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

interface ExamSession {
  id: string;
  course_name?: string;
  session_label: string;
  exam_year_label: string;
  exam_center_id: string;
  exam_centers?: {
    center_name: string;
    center_code: string;
  };
}

interface ResultStudentItem {
  id: string;
  registration_no: string;
  candidate_name: string;
  roll_no: string;
  first_year_passed?: boolean;
  first_year_reason?: string;
}

export default function ExamManagementHubPage() {
  const router = useRouter();

  // Primary Course & Session Selection (Header)
  const [selectedCourse, setSelectedCourse] = useState<string>(PARAMEDICAL_COURSES[0]);
  const [selectedSessionKey, setSelectedSessionKey] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"subjects" | "datesheet" | "roll_admit" | "results">("subjects");

  // Dynamic Session Options based on course duration
  const sessionOptions = useMemo(() => {
    return getCourseSessionOptions(selectedCourse);
  }, [selectedCourse]);

  const activeSessionOption = useMemo<CourseSessionOption>(() => {
    const found = sessionOptions.find((o) => o.key === selectedSessionKey);
    return found || sessionOptions[0];
  }, [sessionOptions, selectedSessionKey]);

  // Tab A: Subjects State
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [subjectError, setSubjectError] = useState<string | null>(null);
  const [newSubjName, setNewSubjName] = useState("");
  const [newSubjCode, setNewSubjCode] = useState("");
  const [newTheoryMax, setNewTheoryMax] = useState("");
  const [newPracticalMax, setNewPracticalMax] = useState("");
  const [newCaMax, setNewCaMax] = useState("");
  const [addingSubject, setAddingSubject] = useState(false);
  const [addSubjectSuccess, setAddSubjectSuccess] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);
  const [editSubjName, setEditSubjName] = useState("");
  const [editSubjCode, setEditSubjCode] = useState("");
  const [editTheoryMax, setEditTheoryMax] = useState("");
  const [editPracticalMax, setEditPracticalMax] = useState("");
  const [editCaMax, setEditCaMax] = useState("");
  const [savingEditSubject, setSavingEditSubject] = useState(false);

  // Sessions State from Backend
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [activeSession, setActiveSession] = useState<ExamSession | null>(null);

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

  // Tab C (previously D): Roll Numbers & Admit Cards State
  const [allottingRolls, setAllottingRolls] = useState(false);
  const [allotResultMsg, setAllotResultMsg] = useState<string | null>(null);
  const [allotError, setAllotError] = useState<string | null>(null);
  const [allottedResults, setAllottedResults] = useState<Array<{ id: string; roll_no: string; exam_session_id?: string }>>([]);

  // Tab D (previously E): Results State
  const [resultStudents, setResultStudents] = useState<ResultStudentItem[]>([]);
  const [resultsReleased, setResultsReleased] = useState<boolean>(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [resultsError, setResultsError] = useState<string | null>(null);

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

  // Fetch Sessions for the course & ensure active session
  const fetchSessions = useCallback(
    async (course: string, targetSessionLabel?: string) => {
      try {
        setLoadingSessions(true);
        const res = await fetch(`/api/admin/exam-sessions?course_name=${encodeURIComponent(course)}`);
        const data = await res.json();
        if (!res.ok) return [];

        const list: ExamSession[] = data.sessions || [];
        setSessions(list);

        const currentOpt = targetSessionLabel || activeSessionOption?.session_label;
        let matched = list.find((s) => s.session_label === currentOpt);

        // Auto-provision if missing and session label exists
        if (!matched && currentOpt) {
          const opt = sessionOptions.find((o) => o.session_label === currentOpt) || activeSessionOption;
          try {
            const createRes = await fetch("/api/admin/exam-sessions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                course_name: course,
                session_label: opt.session_label,
                exam_year_label: opt.exam_year_label,
                academic_session: opt.academic_session,
              }),
            });
            const createData = await createRes.json();
            if (createRes.ok && createData.session) {
              matched = createData.session;
              setSessions((prev) => [matched!, ...prev]);
            }
          } catch (autoErr) {
            console.error("Auto provision session error:", autoErr);
          }
        }

        if (matched) {
          setActiveSession(matched);
        } else {
          setActiveSession(null);
        }

        return list;
      } catch (err) {
        console.error("Fetch sessions error:", err);
        return [];
      } finally {
        setLoadingSessions(false);
      }
    },
    [activeSessionOption, sessionOptions]
  );

  // Fetch Tab B: Datesheet (scoped to course & session_id)
  const fetchDatesheet = useCallback(async (course: string, sessionId: string) => {
    if (!sessionId) {
      setDatesheetSubjects([]);
      setDatesheetComplete(false);
      return;
    }
    try {
      setLoadingDatesheet(true);
      setDatesheetError(null);
      const res = await fetch(
        `/api/admin/datesheets?course_name=${encodeURIComponent(course)}&session_id=${encodeURIComponent(sessionId)}`
      );
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
  }, []);

  // Fetch Tab E: Results
  const fetchResults = async (
    course: string,
    targetAcademicSession?: string,
    sessionLabel?: string,
    yearNum?: number
  ) => {
    try {
      setLoadingResults(true);
      setResultsError(null);
      const sessionParam = targetAcademicSession ?? activeSessionOption?.academic_session;
      const labelParam = sessionLabel ?? activeSessionOption?.session_label;
      const yrParam = yearNum ?? activeSessionOption?.year_number;

      let url = `/api/admin/results?course_name=${encodeURIComponent(course)}`;
      if (sessionParam) url += `&academic_session=${encodeURIComponent(sessionParam)}`;
      if (labelParam) url += `&session_label=${encodeURIComponent(labelParam)}`;
      if (yrParam) url += `&year_number=${encodeURIComponent(String(yrParam))}`;

      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        setResultsError(data.error || "Failed to load eligible students for result entry");
        return;
      }
      setResultStudents(data.students || []);
      setResultsReleased(data.released ?? false);
    } catch (err) {
      console.error("Fetch results error:", err);
      setResultsError("Network error loading eligible students.");
    } finally {
      setLoadingResults(false);
    }
  };


  // Course change: update default session option
  useEffect(() => {
    const opts = getCourseSessionOptions(selectedCourse);
    if (opts.length > 0) {
      setSelectedSessionKey(opts[0].key);
    }
    fetchSubjects(selectedCourse);
    setAllotResultMsg(null);
    setAllotError(null);
    setAllottedResults([]);
  }, [selectedCourse]);

  // When course or session key changes, sync sessions, datesheet & results
  useEffect(() => {
    if (selectedCourse && activeSessionOption) {
      fetchSessions(selectedCourse, activeSessionOption.session_label);
      fetchResults(
        selectedCourse,
        activeSessionOption.academic_session,
        activeSessionOption.session_label,
        activeSessionOption.year_number
      );
    }
  }, [selectedCourse, activeSessionOption, fetchSessions]);

  // When active session is loaded, fetch its datesheet
  useEffect(() => {
    if (selectedCourse && activeSession?.id) {
      setDatesheetFormValues({});
      setDateRowSuccessMsg({});
      fetchDatesheet(selectedCourse, activeSession.id);
    } else {
      setDatesheetSubjects([]);
      setDatesheetComplete(false);
    }
  }, [selectedCourse, activeSession?.id, fetchDatesheet]);

  // Handlers for Tab A: Subjects
  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newSubjName.trim();
    const code = newSubjCode.trim().toUpperCase();
    if (!name || !code) return;

    setAddingSubject(true);
    setSubjectError(null);
    setAddSubjectSuccess(null);

    const body: Record<string, string | number> = {
      course_name: selectedCourse,
      subject_name: name,
      subject_code: code,
    };
    if (newTheoryMax.trim() !== "") {
      body.theory_max = Number(newTheoryMax.trim());
    }
    if (newPracticalMax.trim() !== "") {
      body.practical_max = Number(newPracticalMax.trim());
    }
    if (newCaMax.trim() !== "") {
      body.ca_max = Number(newCaMax.trim());
    }

    try {
      const res = await fetch("/api/admin/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubjectError(data.error || "Failed to add subject");
        return;
      }
      setAddSubjectSuccess(`Subject "${name}" added successfully.`);
      setNewSubjName("");
      setNewSubjCode("");
      setNewTheoryMax("");
      setNewPracticalMax("");
      setNewCaMax("");
      fetchSubjects(selectedCourse);
      if (activeSession?.id) {
        fetchDatesheet(selectedCourse, activeSession.id);
      }
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
    const body: Record<string, string | number | null> = {
      subject_name: name,
      subject_code: code,
      theory_max: editTheoryMax.trim() !== "" ? Number(editTheoryMax.trim()) : null,
      practical_max: editPracticalMax.trim() !== "" ? Number(editPracticalMax.trim()) : null,
      ca_max: editCaMax.trim() !== "" ? Number(editCaMax.trim()) : null,
    };

    try {
      const res = await fetch(`/api/admin/subjects/${editingSubject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update subject");
        return;
      }
      setEditingSubject(null);
      fetchSubjects(selectedCourse);
      if (activeSession?.id) {
        fetchDatesheet(selectedCourse, activeSession.id);
      }
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
      let targetSessionId = activeSession?.id;

      // If activeSession is not yet populated, dynamically ensure/provision it now
      if (!targetSessionId && selectedCourse && activeSessionOption) {
        const createRes = await fetch("/api/admin/exam-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course_name: selectedCourse,
            session_label: activeSessionOption.session_label,
            exam_year_label: activeSessionOption.exam_year_label,
            academic_session: activeSessionOption.academic_session,
          }),
        });
        const createData = await createRes.json();
        if (createRes.ok && createData.session?.id) {
          targetSessionId = createData.session.id;
          setActiveSession(createData.session);
          setSessions((prev) => [createData.session, ...prev.filter((s) => s.id !== createData.session.id)]);
        } else {
          alert(createData.error || "Please wait for exam session to initialize.");
          return;
        }
      }

      if (!targetSessionId) {
        alert("Please ensure exam session is ready.");
        return;
      }

      const res = await fetch("/api/admin/datesheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_id: subjectId,
          exam_session_id: targetSessionId,
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
      fetchDatesheet(selectedCourse, targetSessionId);
    } catch (err) {
      console.error("Save datesheet row error:", err);
      alert("Network error saving datesheet entry.");
    } finally {
      setSavingDateRowId(null);
    }
  };

  // Handlers for Tab C (previously D): Roll Numbers Allotment
  const handleAllotRollNumbers = async () => {
    if (!activeSession?.id) {
      setAllotError("No active exam session found for allotment.");
      return;
    }

    const sessionName = `${activeSessionOption.label}`;

    if (
      !confirm(
        `Are you sure you want to allot roll numbers for session "${sessionName}" in course "${selectedCourse}"?`
      )
    ) {
      return;
    }

    setAllottingRolls(true);
    setAllotResultMsg(null);
    setAllotError(null);
    setAllottedResults([]);

    try {
      const res = await fetch("/api/admin/roll-numbers/allot-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: activeSession.id,
          academic_session: activeSessionOption.academic_session,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAllotError(data.error || "Failed to allot roll numbers.");
        return;
      }
      if (data.results && Array.isArray(data.results)) {
        setAllottedResults(data.results);
      }
      if (data.allotted > 0) {
        setAllotResultMsg(`Success: ${data.allotted} roll numbers successfully allotted for ${sessionName}!`);
      } else {
        setAllotResultMsg(data.message || "0 students needed roll numbers (all approved students in this batch already have roll numbers).");
      }
    } catch (err) {
      console.error("Allot roll numbers error:", err);
      setAllotError("Network error during roll number allotment.");
    } finally {
      setAllottingRolls(false);
    }
  };

  // Ensure datesheet rows always contain all course subjects
  const displayDatesheetRows = useMemo<DatesheetSubjectItem[]>(() => {
    if (datesheetSubjects.length > 0) return datesheetSubjects;
    return subjects.map((s) => ({
      id: s.id,
      subject_name: s.subject_name,
      subject_code: s.subject_code,
      exam_date: null,
      exam_time: null,
    }));
  }, [datesheetSubjects, subjects]);

  // Missing count calculation for datesheet banner
  const missingDatesheetCount = useMemo(() => {
    return displayDatesheetRows.filter((s) => !s.exam_date || !s.exam_time).length;
  }, [displayDatesheetRows]);

  const is2Year = isTwoYearCourse(selectedCourse);

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
              Select course and academic session to configure datesheets, roll numbers, and admit cards.
            </p>
          </div>
        </div>

        {/* Course & Session Selector Dual Panel */}
        <div className="mt-5 bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
          {/* 1. Course Selector */}
          <div className="lg:col-span-6">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Course / पाठ्यक्रम चुनें:
              </label>
              <span className="text-[11px] font-bold text-[#143E66] px-2 py-0.5 bg-blue-50 border border-blue-200 rounded">
                {is2Year ? "2 Years Duration" : "1 Year Duration"}
              </span>
            </div>
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

          {/* 2. Academic Session Selector (Dynamic based on course duration) */}
          <div className="lg:col-span-6">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Academic Session / सत्र चुनें:
              </label>
              <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                Exam Year: <strong className="text-[#143E66]">{activeSessionOption.exam_year_label}</strong>
              </span>
            </div>
            <select
              value={selectedSessionKey}
              onChange={(e) => setSelectedSessionKey(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-xs sm:text-sm font-bold text-[#143E66] focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
            >
              {sessionOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Course & Session Status Badges */}
          <div className="lg:col-span-12 flex items-center gap-2 flex-wrap pt-2 border-t border-slate-200/80">
            <span
              className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                subjects.length > 0
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {subjects.length} Subjects Defined
            </span>
            <span
              className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                activeSession
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              {activeSession ? `Active Session: ${activeSession.session_label}` : "Auto-provisioning session..."}
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
                resultsReleased
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              {resultsReleased ? "Result Alloted ✓" : "Result Pending"}
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
          onClick={() => setActiveTab("roll_admit")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "roll_admit"
              ? "border-[#143E66] text-[#143E66] bg-white rounded-t-md"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="text-[#D4AF37]">★</span>
          <span>3. Roll Numbers &amp; Admit Cards</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("results");
            fetchResults(selectedCourse);
          }}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "results"
              ? "border-[#143E66] text-[#143E66] bg-white rounded-t-md"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span className="text-[#D4AF37]">★</span>
          <span>4. Results ({resultStudents.length})</span>
          {resultsReleased ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          )}
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
                className="text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer"
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
                      <th className="py-3 px-3 w-10 text-center">#</th>
                      <th className="py-3 px-4">Subject Name</th>
                      <th className="py-3 px-3 w-28 whitespace-nowrap">Subject Code</th>
                      <th className="py-3 px-2.5 text-center whitespace-nowrap">Theory Max</th>
                      <th className="py-3 px-2.5 text-center whitespace-nowrap">Practical Max</th>
                      <th className="py-3 px-2.5 text-center whitespace-nowrap">CA Max</th>
                      <th className="py-3 px-2.5 text-center whitespace-nowrap">Total Max</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {subjects.map((s, idx) => {
                      const hasAllMax =
                        s.theory_max !== null &&
                        s.theory_max !== undefined &&
                        s.practical_max !== null &&
                        s.practical_max !== undefined &&
                        s.ca_max !== null &&
                        s.ca_max !== undefined;
                      const totalMax = hasAllMax ? (s.theory_max! + s.practical_max! + s.ca_max!) : null;

                      return (
                        <tr key={s.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{s.subject_name}</td>
                          <td className="py-3 px-3 font-mono font-bold text-[#143E66]">{s.subject_code}</td>
                          <td className="py-3 px-2.5 text-center font-mono font-semibold text-slate-700">
                            {s.theory_max !== null && s.theory_max !== undefined ? (
                              s.theory_max
                            ) : (
                              <span className="text-amber-600 font-bold" title="Theory Max Missing">—</span>
                            )}
                          </td>
                          <td className="py-3 px-2.5 text-center font-mono font-semibold text-slate-700">
                            {s.practical_max !== null && s.practical_max !== undefined ? (
                              s.practical_max
                            ) : (
                              <span className="text-amber-600 font-bold" title="Practical Max Missing">—</span>
                            )}
                          </td>
                          <td className="py-3 px-2.5 text-center font-mono font-semibold text-slate-700">
                            {s.ca_max !== null && s.ca_max !== undefined ? (
                              s.ca_max
                            ) : (
                              <span className="text-amber-600 font-bold" title="CA Max Missing">—</span>
                            )}
                          </td>
                          <td className="py-3 px-2.5 text-center font-mono font-bold text-[#0b2545]">
                            {totalMax !== null ? (
                              totalMax
                            ) : (
                              <span className="text-amber-600 font-bold" title="Max Marks Incomplete">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setEditingSubject(s);
                                setEditSubjName(s.subject_name);
                                setEditSubjCode(s.subject_code);
                                setEditTheoryMax(s.theory_max !== null && s.theory_max !== undefined ? String(s.theory_max) : "");
                                setEditPracticalMax(s.practical_max !== null && s.practical_max !== undefined ? String(s.practical_max) : "");
                                setEditCaMax(s.ca_max !== null && s.ca_max !== undefined ? String(s.ca_max) : "");
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-[#143E66] hover:text-white text-[#143E66] font-bold rounded border border-slate-300 transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1 min-h-[30px] flex flex-col justify-between">
                    <span>Theory Max</span>
                    <span className="text-[9px] text-slate-500 font-normal">सैद्धांतिक</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newTheoryMax}
                    onChange={(e) => setNewTheoryMax(e.target.value)}
                    placeholder="e.g. 60"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1 min-h-[30px] flex flex-col justify-between">
                    <span>Practical Max</span>
                    <span className="text-[9px] text-slate-500 font-normal">प्रायोगिक</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newPracticalMax}
                    onChange={(e) => setNewPracticalMax(e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1 min-h-[30px] flex flex-col justify-between">
                    <span>CA Max</span>
                    <span className="text-[9px] text-slate-500 font-normal">आंतरिक</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCaMax}
                    onChange={(e) => setNewCaMax(e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
                  />
                </div>
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
                    className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
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

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1 min-h-[30px] flex flex-col justify-between">
                        <span>Theory Max</span>
                        <span className="text-[9px] text-slate-500 font-normal">सैद्धांतिक</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editTheoryMax}
                        onChange={(e) => setEditTheoryMax(e.target.value)}
                        placeholder="e.g. 60"
                        className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1 min-h-[30px] flex flex-col justify-between">
                        <span>Practical Max</span>
                        <span className="text-[9px] text-slate-500 font-normal">प्रायोगिक</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editPracticalMax}
                        onChange={(e) => setEditPracticalMax(e.target.value)}
                        placeholder="e.g. 20"
                        className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider mb-1 min-h-[30px] flex flex-col justify-between">
                        <span>CA Max</span>
                        <span className="text-[9px] text-slate-500 font-normal">आंतरिक</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editCaMax}
                        onChange={(e) => setEditCaMax(e.target.value)}
                        placeholder="e.g. 20"
                        className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setEditingSubject(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingEditSubject}
                      className="px-4 py-2 bg-[#143E66] hover:bg-[#0c2a47] text-white text-xs font-bold rounded shadow-md disabled:opacity-50 cursor-pointer"
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
          {/* Active Session Info Banner */}
          <div className="bg-white rounded-lg shadow-xs border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                Selected Session for Datesheet
              </div>
              <div className="text-base font-bold text-[#00031D] mt-0.5">
                {activeSessionOption.label}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Course: <strong>{selectedCourse}</strong> • Exam Center:{" "}
                <strong>{activeSession?.exam_centers?.center_name || "Assigned Center"}</strong> ({activeSession?.exam_centers?.center_code || "—"})
              </div>
            </div>

            <button
              onClick={() => activeSession?.id && fetchDatesheet(selectedCourse, activeSession.id)}
              disabled={loadingDatesheet || !activeSession?.id}
              className="self-start sm:self-center px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              <svg className={`w-3.5 h-3.5 ${loadingDatesheet ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Datesheet
            </button>
          </div>

          {/* Status Banner */}
          {loadingDatesheet || loadingSessions ? (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded text-slate-600 text-xs sm:text-sm flex items-center gap-3">
              <svg className="w-5 h-5 animate-spin text-[#143E66]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Loading datesheet schedule for {activeSessionOption.label}...</span>
            </div>
          ) : subjects.length === 0 ? (
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
                  <strong>Datesheet Complete ✓</strong> All {datesheetSubjects.length} subjects have exam dates &amp; times assigned for this session.
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
                  <strong>Datesheet Incomplete:</strong> {missingDatesheetCount} subject(s) are missing exam dates or timings for this session.
                </span>
              </div>
            </div>
          )}

          {/* Datesheet Schedule Table */}
          {subjects.length > 0 && (
            <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
              <div className="bg-[#143E66] px-5 py-3.5 text-white border-b-2 border-[#D4AF37] flex items-center justify-between">
                <div>
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                    Datesheet Schedule / परीक्षा समय सारणी
                  </h2>
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                    Session: {activeSessionOption.label}
                  </p>
                </div>
              </div>

              {datesheetError && (
                <div className="p-3.5 bg-red-50 border-b border-red-200 text-red-800 text-xs font-semibold">
                  {datesheetError}
                </div>
              )}

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
                    {displayDatesheetRows.map((s, idx) => {
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
                <p className="text-[11.5px] opacity-90">{subjects.length} subject(s) defined for this course.</p>
              </div>

              {/* Check 2 */}
              <div className={`p-4 rounded-lg border ${activeSession ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-red-50 border-red-200 text-red-900"}`}>
                <div className="flex items-center gap-2 font-bold text-xs uppercase mb-1">
                  <span>{activeSession ? "✓ 2. Session Active" : "✕ 2. Session Pending"}</span>
                </div>
                <p className="text-[11.5px] opacity-90">
                  {activeSession ? `${activeSessionOption.label} configured.` : "Setting up session..."}
                </p>
              </div>

              {/* Check 3 */}
              <div className={`p-4 rounded-lg border ${datesheetComplete ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
                <div className="flex items-center gap-2 font-bold text-xs uppercase mb-1">
                  <span>{datesheetComplete ? "✓ 3. Datesheet Ready" : "⚠ 3. Datesheet Pending"}</span>
                </div>
                <p className="text-[11.5px] opacity-90">
                  {datesheetComplete ? "Datesheet complete for this session." : "Configure datesheet before issuing cards."}
                </p>
              </div>
            </div>

            {/* 2nd Year Prerequisite Notice Banner */}
            {activeSessionOption.year_number === 2 && (
              <div className="p-3.5 bg-blue-50 border-l-4 border-blue-500 rounded-r text-blue-950 text-xs flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  <strong>2nd Year Prerequisite Active:</strong> Only candidates who have successfully <strong>PASSED 1st Year examinations</strong> are eligible for 2nd Year Roll Number allotment and Admit Card generation.
                </span>
              </div>
            )}

            {/* Action 1: Roll Number Allotment */}
            <div className="pt-5 border-t border-slate-200 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Step 1: Allot Roll Numbers to Approved Candidates in {activeSessionOption.label}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generates sequential roll numbers for approved candidates belonging to this course &amp; session using center code &apos;{activeSession?.exam_centers?.center_code || "—"}&apos; and year suffix &apos;{activeSessionOption.exam_year_label.slice(-2)}&apos;. Safe to run multiple times.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">Target Batch:</span>
                  <span className="font-bold text-[#143E66] text-sm">{activeSessionOption.label}</span>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={handleAllotRollNumbers}
                    disabled={allottingRolls || !activeSession?.id}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#143E66] hover:bg-[#0c2a47] active:bg-[#081f34] text-white text-xs font-bold uppercase tracking-wider rounded shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
              </div>

              {allotResultMsg && (
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded border border-emerald-200">
                  {allotResultMsg}
                </div>
              )}
              {allottedResults.length > 0 && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-300 rounded-lg">
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Allotted Roll Numbers List ({allottedResults.length})</span>
                    </h4>
                    <span className="text-[11px] font-semibold text-emerald-800">
                      Sequential Roll Numbers Generated
                    </span>
                  </div>
                  <div className="overflow-x-auto max-h-60 overflow-y-auto border border-emerald-200 rounded bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-emerald-100/60 text-emerald-900 font-bold uppercase text-[10.5px]">
                        <tr>
                          <th className="py-2 px-3 w-12 text-center">#</th>
                          <th className="py-2 px-3">Student Registration ID</th>
                          <th className="py-2 px-3">Assigned Roll Number</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-100 text-slate-800">
                        {allottedResults.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-emerald-50/40 transition-colors">
                            <td className="py-2 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                            <td className="py-2 px-3 font-mono text-slate-700">{item.id}</td>
                            <td className="py-2 px-3 font-mono font-bold text-[#143E66]">{item.roll_no}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {allotError && (
                <div className="text-xs font-bold text-red-700 bg-red-50 px-3.5 py-2 rounded border border-red-200">
                  {allotError}
                </div>
              )}
            </div>

            {/* Action 2: Generate Bulk Admit Cards */}
            <div className="pt-5 mt-5 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Step 2: Generate &amp; Print Bulk Admit Cards
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Opens printable admit cards for all approved candidates in this course &amp; session.
                </p>
              </div>

              <Link
                href={`/admin/dashboard/admit-cards/bulk?course_name=${encodeURIComponent(selectedCourse)}&academic_session=${encodeURIComponent(activeSessionOption.academic_session)}&session_label=${encodeURIComponent(activeSessionOption.session_label)}&year_number=${activeSessionOption.year_number}`}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
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

      {/* ========================================================================= */}
      {/* TAB E: RESULTS                                                            */}
      {/* ========================================================================= */}
      {activeTab === "results" && (
        <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
          <div className="bg-[#143E66] px-5 py-3.5 text-white border-b-2 border-[#D4AF37] flex items-center justify-between">
            <div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                Student Results &amp; Marksheet Management / परिणाम प्रबंधन ({resultStudents.length})
              </h2>
              <p className="text-[11px] text-slate-300 font-normal mt-0.5">
                Select an eligible student below to enter subject marks and generate official marksheets.
              </p>
            </div>
            <button
              onClick={() =>
                fetchResults(
                  selectedCourse,
                  activeSessionOption.academic_session,
                  activeSessionOption.session_label,
                  activeSessionOption.year_number
                )
              }
              disabled={loadingResults}
              className="text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <svg className={`w-3.5 h-3.5 ${loadingResults ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {loadingResults ? (
            <div className="p-12 text-center text-slate-500">
              <svg className="w-8 h-8 animate-spin mx-auto text-[#143E66] mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-xs font-semibold">Loading eligible students...</p>
            </div>
          ) : resultsError ? (
            <div className="p-8 text-center text-red-600">
              <p className="text-sm font-bold">{resultsError}</p>
            </div>
          ) : resultStudents.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-3 border border-amber-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-slate-800">
                No students eligible for result entry yet (admit card must be generated first).
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Admit cards must be generated for candidates in <strong>Tab 4 (Roll Numbers &amp; Admit Cards)</strong> before marks can be entered.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px]">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Registration No.</th>
                    <th className="py-3 px-4">Candidate Name</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {resultStudents.map((s, idx) => {
                    const isLocked = activeSessionOption.year_number === 2 && s.first_year_passed === false;

                    return (
                      <tr
                        key={s.id}
                        onClick={() => {
                          if (!isLocked) {
                            router.push(`/admin/dashboard/exam-management/results/${s.id}`);
                          }
                        }}
                        className={`transition-colors ${
                          isLocked ? "bg-slate-50 opacity-75 cursor-not-allowed" : "hover:bg-amber-50/50 cursor-pointer group"
                        }`}
                      >
                        <td className="py-3 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-4 font-mono font-bold text-[#143E66]">{s.roll_no || "—"}</td>
                        <td className="py-3 px-4 font-mono text-slate-700">{s.registration_no}</td>
                        <td className="py-3 px-4 font-bold text-slate-900 group-hover:text-[#143E66]">
                          <div className="flex items-center gap-2">
                            <span>{s.candidate_name}</span>
                            {isLocked && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[10px] font-bold">
                                1st Year Pending / Not Passed
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isLocked ? (
                            <span
                              title={s.first_year_reason || "1st Year result not cleared"}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 text-slate-500 font-bold rounded text-xs cursor-not-allowed"
                            >
                              <span>🔒 Locked (1st Year Incomplete)</span>
                            </span>
                          ) : (
                            <Link
                              href={`/admin/dashboard/exam-management/results/${s.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#143E66] hover:bg-[#0c2a47] text-white font-bold rounded shadow-xs text-xs transition-colors"
                            >
                              <span>Enter / View Marks</span>
                              <span>→</span>
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
