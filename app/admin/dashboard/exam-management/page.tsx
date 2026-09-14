"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PARAMEDICAL_COURSES } from "@/components/student/registration/registrationSchema";

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
}

export default function ExamManagementHubPage() {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<string>(PARAMEDICAL_COURSES[0]);
  const [activeTab, setActiveTab] = useState<"subjects" | "datesheet" | "sessions" | "roll_admit" | "results">("subjects");

  // Centers list (shared for Sessions dropdown)
  const [centers, setCenters] = useState<ExamCenter[]>([]);
  const [loadingCenters, setLoadingCenters] = useState(false);

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

  // Sessions State (Shared by Sessions tab, Datesheet tab, Roll Numbers tab)
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Tab B: Datesheet State
  const [selectedDatesheetSessionId, setSelectedDatesheetSessionId] = useState<string>("");
  const [datesheetSubjects, setDatesheetSubjects] = useState<DatesheetSubjectItem[]>([]);
  const [datesheetComplete, setDatesheetComplete] = useState<boolean>(false);
  const [loadingDatesheet, setLoadingDatesheet] = useState(false);
  const [datesheetError, setDatesheetError] = useState<string | null>(null);
  const [datesheetFormValues, setDatesheetFormValues] = useState<
    Record<string, { exam_date: string; exam_time: string }>
  >({});
  const [savingDateRowId, setSavingDateRowId] = useState<string | null>(null);
  const [dateRowSuccessMsg, setDateRowSuccessMsg] = useState<Record<string, string>>({});

  // Tab C: Session Management State
  const [editingSession, setEditingSession] = useState<ExamSession | null>(null);
  const [sessionLabel, setSessionLabel] = useState("");
  const [examYearLabel, setExamYearLabel] = useState("");
  const [examCenterId, setExamCenterId] = useState("");
  const [savingSession, setSavingSession] = useState(false);
  const [sessionSuccessMsg, setSessionSuccessMsg] = useState<string | null>(null);
  const [sessionErrorMsg, setSessionErrorMsg] = useState<string | null>(null);

  // Tab D: Roll Numbers & Admit Cards State
  const [selectedAllotSessionId, setSelectedAllotSessionId] = useState<string>("");
  const [allottingRolls, setAllottingRolls] = useState(false);
  const [allotResultMsg, setAllotResultMsg] = useState<string | null>(null);
  const [allotError, setAllotError] = useState<string | null>(null);

  // Tab E: Results State
  const [resultStudents, setResultStudents] = useState<ResultStudentItem[]>([]);
  const [resultsReleased, setResultsReleased] = useState<boolean>(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [resultsError, setResultsError] = useState<string | null>(null);

  // Fetch all exam centers
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

  // Fetch Sessions for the course
  const fetchSessions = useCallback(async (course: string, preferredSessionId?: string) => {
    try {
      setLoadingSessions(true);
      setSessionErrorMsg(null);
      const res = await fetch(`/api/admin/exam-sessions?course_name=${encodeURIComponent(course)}`);
      const data = await res.json();
      if (!res.ok) {
        setSessionErrorMsg(data.error || "Failed to load exam sessions");
        return [];
      }
      const list: ExamSession[] = data.sessions || [];
      setSessions(list);

      // Manage Datesheet Session Selection
      setSelectedDatesheetSessionId((prev) => {
        const targetId = preferredSessionId || prev;
        if (targetId && list.some((s) => s.id === targetId)) {
          return targetId;
        }
        return list.length > 0 ? list[0].id : "";
      });

      // Manage Allot Session Selection
      setSelectedAllotSessionId((prev) => {
        const targetId = preferredSessionId || prev;
        if (targetId && list.some((s) => s.id === targetId)) {
          return targetId;
        }
        return list.length > 0 ? list[0].id : "";
      });

      return list;
    } catch (err) {
      console.error("Fetch sessions error:", err);
      setSessionErrorMsg("Network error loading exam sessions.");
      return [];
    } finally {
      setLoadingSessions(false);
    }
  }, []);

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
  const fetchResults = async (course: string) => {
    try {
      setLoadingResults(true);
      setResultsError(null);
      const res = await fetch(`/api/admin/results?course_name=${encodeURIComponent(course)}`);
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

  // Initial load
  useEffect(() => {
    fetchCenters();
  }, []);

  // Course change load
  useEffect(() => {
    if (selectedCourse) {
      fetchSubjects(selectedCourse);
      fetchSessions(selectedCourse);
      fetchResults(selectedCourse);
      setEditingSession(null);
      setSessionLabel("");
      setExamYearLabel("");
      setExamCenterId(centers.length > 0 ? centers[0].id : "");
      setSessionSuccessMsg(null);
      setSessionErrorMsg(null);
      setAllotResultMsg(null);
      setAllotError(null);
    }
  }, [selectedCourse, centers, fetchSessions]);

  // When selected datesheet session changes, reload datesheet
  useEffect(() => {
    if (selectedCourse && selectedDatesheetSessionId) {
      fetchDatesheet(selectedCourse, selectedDatesheetSessionId);
    } else {
      setDatesheetSubjects([]);
      setDatesheetComplete(false);
    }
  }, [selectedCourse, selectedDatesheetSessionId, fetchDatesheet]);

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
      if (selectedDatesheetSessionId) {
        fetchDatesheet(selectedCourse, selectedDatesheetSessionId);
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
      if (selectedDatesheetSessionId) {
        fetchDatesheet(selectedCourse, selectedDatesheetSessionId);
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
    if (!selectedDatesheetSessionId) {
      alert("Please select an exam session first.");
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
          exam_session_id: selectedDatesheetSessionId,
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
      fetchDatesheet(selectedCourse, selectedDatesheetSessionId);
    } catch (err) {
      console.error("Save datesheet row error:", err);
      alert("Network error saving datesheet entry.");
    } finally {
      setSavingDateRowId(null);
    }
  };

  // Handlers for Tab C: Exam Sessions Management
  const handleStartEditSession = (s: ExamSession) => {
    setEditingSession(s);
    setSessionLabel(s.session_label || "");
    setExamYearLabel(s.exam_year_label || "");
    setExamCenterId(s.exam_center_id || "");
    setSessionSuccessMsg(null);
    setSessionErrorMsg(null);
  };

  const handleCancelEditSession = () => {
    setEditingSession(null);
    setSessionLabel("");
    setExamYearLabel("");
    setExamCenterId(centers.length > 0 ? centers[0].id : "");
    setSessionSuccessMsg(null);
    setSessionErrorMsg(null);
  };

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const sLabel = sessionLabel.trim();
    const yLabel = examYearLabel.trim();
    const cId = examCenterId.trim();

    if (!sLabel || !yLabel || !cId) {
      setSessionErrorMsg("Session label, exam year label, and exam center are all required.");
      return;
    }

    setSavingSession(true);
    setSessionErrorMsg(null);
    setSessionSuccessMsg(null);

    try {
      if (editingSession) {
        // Edit existing session
        const res = await fetch(`/api/admin/exam-sessions/${editingSession.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_label: sLabel,
            exam_year_label: yLabel,
            exam_center_id: cId,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setSessionErrorMsg(data.error || "Failed to update exam session.");
          return;
        }
        setSessionSuccessMsg("Exam session updated successfully!");
        const updatedList = await fetchSessions(selectedCourse, editingSession.id);
        if (selectedDatesheetSessionId === editingSession.id) {
          fetchDatesheet(selectedCourse, editingSession.id);
        }
        handleCancelEditSession();
      } else {
        // Create new session
        const res = await fetch("/api/admin/exam-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course_name: selectedCourse,
            session_label: sLabel,
            exam_year_label: yLabel,
            exam_center_id: cId,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setSessionErrorMsg(data.error || "Failed to create exam session.");
          return;
        }
        setSessionSuccessMsg("New exam session created successfully!");
        const newSessionId = data.session?.id;
        await fetchSessions(selectedCourse, newSessionId);
        handleCancelEditSession();
      }
    } catch (err) {
      console.error("Save session error:", err);
      setSessionErrorMsg("Network error saving exam session.");
    } finally {
      setSavingSession(false);
    }
  };

  // Handlers for Tab D: Roll Numbers Allotment
  const handleAllotRollNumbers = async () => {
    if (!selectedAllotSessionId) {
      setAllotError("Please select an exam session before allotting roll numbers.");
      return;
    }

    const currentSession = sessions.find((s) => s.id === selectedAllotSessionId);
    const sessionName = currentSession
      ? `${currentSession.session_label} · ${currentSession.exam_year_label}`
      : "selected session";

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

    try {
      const res = await fetch("/api/admin/roll-numbers/allot-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: selectedAllotSessionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAllotError(data.error || "Failed to allot roll numbers.");
        return;
      }
      if (data.allotted > 0) {
        setAllotResultMsg(`Success: ${data.allotted} roll numbers successfully allotted!`);
      } else {
        setAllotResultMsg(data.message || "0 students needed roll numbers (all eligible approved students already have roll numbers).");
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

  const activeDatesheetSession = useMemo(() => {
    return sessions.find((s) => s.id === selectedDatesheetSessionId);
  }, [sessions, selectedDatesheetSessionId]);

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
              Configure course subjects, exam sessions, datesheets, examination centers, roll number allotment, and bulk admit cards.
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
                sessions.length > 0
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              {sessions.length > 0 ? `${sessions.length} Session(s)` : "No Sessions"}
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
          onClick={() => setActiveTab("sessions")}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "sessions"
              ? "border-[#143E66] text-[#143E66] bg-white rounded-t-md"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>3. Exam Sessions ({sessions.length})</span>
          {sessions.length > 0 && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
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
          <span>5. Results ({resultStudents.length})</span>
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
          {/* Session Selector Card */}
          <div className="bg-white rounded-lg shadow-xs border border-slate-200 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#143E66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Select Exam Session / परीक्षा सत्र चुनें:</span>
                </label>
                {sessions.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 font-medium">
                    No exam sessions created for <strong>{selectedCourse}</strong> yet.{" "}
                    <button
                      onClick={() => setActiveTab("sessions")}
                      className="text-[#143E66] font-bold underline hover:text-[#0c2a47] cursor-pointer ml-1"
                    >
                      Go to Tab 3 (Exam Sessions) to create one first →
                    </button>
                  </div>
                ) : (
                  <select
                    value={selectedDatesheetSessionId}
                    onChange={(e) => setSelectedDatesheetSessionId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs sm:text-sm font-bold text-[#143E66] focus:bg-white focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
                  >
                    <option value="">-- Select an Exam Session --</option>
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.session_label} · {s.exam_year_label} {s.exam_centers ? `(${s.exam_centers.center_code})` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {activeDatesheetSession && (
                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs shrink-0 sm:min-w-[220px]">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Assigned Center</div>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {activeDatesheetSession.exam_centers?.center_name || "Center Set"}
                  </div>
                  <div className="font-mono text-[11px] text-[#143E66]">
                    Code: {activeDatesheetSession.exam_centers?.center_code || "—"}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Prompt if no session selected */}
          {!selectedDatesheetSessionId && sessions.length > 0 && (
            <div className="p-8 bg-white border border-slate-200 rounded-lg text-center text-slate-500 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-slate-700">Select an exam session to manage its datesheet</p>
              <p className="text-xs text-slate-400 mt-1">
                Choose a session from the dropdown above to view, configure, and save subject exam dates.
              </p>
            </div>
          )}

          {/* Prompt if no sessions exist */}
          {sessions.length === 0 && (
            <div className="p-8 bg-white border border-slate-200 rounded-lg text-center text-slate-500 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 mx-auto flex items-center justify-center mb-3 border border-amber-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-slate-700">No Exam Sessions Created</p>
              <p className="text-xs text-slate-400 mt-1">
                This course does not have any exam sessions yet. Create a session first to set up datesheets.
              </p>
              <button
                onClick={() => setActiveTab("sessions")}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#143E66] hover:bg-[#0c2a47] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-sm"
              >
                <span>Go to Tab 3 (Exam Sessions)</span>
                <span>→</span>
              </button>
            </div>
          )}

          {/* Datesheet Table & Status when session is selected */}
          {selectedDatesheetSessionId && (
            <>
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
              {datesheetSubjects.length > 0 && (
                <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
                  <div className="bg-[#143E66] px-5 py-3.5 text-white border-b-2 border-[#D4AF37] flex items-center justify-between">
                    <div>
                      <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                        Datesheet Schedule / परीक्षा समय सारणी
                      </h2>
                      {activeDatesheetSession && (
                        <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                          Session: {activeDatesheetSession.session_label} · {activeDatesheetSession.exam_year_label}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => fetchDatesheet(selectedCourse, selectedDatesheetSessionId)}
                      disabled={loadingDatesheet}
                      className="text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <svg className={`w-3.5 h-3.5 ${loadingDatesheet ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
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
            </>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB C: EXAM SESSIONS MANAGEMENT (Formerly Exam Config)                   */}
      {/* ========================================================================= */}
      {activeTab === "sessions" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left 2 Cols: Existing Sessions List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#143E66] px-5 py-3.5 text-white border-b-2 border-[#D4AF37] flex items-center justify-between">
              <div>
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                  Exam Sessions for {selectedCourse} ({sessions.length})
                </h2>
                <p className="text-[11px] text-slate-300 font-normal mt-0.5">
                  Multiple academic batches can have distinct sessions without overwriting dates or centers.
                </p>
              </div>
              <button
                onClick={() => fetchSessions(selectedCourse)}
                disabled={loadingSessions}
                className="text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer shrink-0"
              >
                <svg className={`w-3.5 h-3.5 ${loadingSessions ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            {loadingSessions ? (
              <div className="p-12 text-center text-slate-500">
                <svg className="w-8 h-8 animate-spin mx-auto text-[#143E66] mb-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-xs font-semibold">Loading exam sessions...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-slate-700">No exam sessions yet for this course</p>
                <p className="text-xs text-slate-400 mt-1">Add one using the form on the right to get started.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {sessions.map((s, idx) => {
                  const isEditingThis = editingSession?.id === s.id;
                  return (
                    <div
                      key={s.id}
                      className={`p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isEditingThis ? "bg-amber-50/70 border-l-4 border-[#D4AF37]" : "hover:bg-slate-50/60"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
                          <span className="text-sm font-bold text-[#00031D]">{s.session_label}</span>
                          <span className="px-2 py-0.5 bg-blue-50 text-[#143E66] border border-blue-200 rounded text-[11px] font-bold">
                            {s.exam_year_label}
                          </span>
                          {isEditingThis && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[10px] font-bold">
                              Editing Now
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          <div className="flex items-center gap-1 font-medium">
                            <span className="text-slate-400">Exam Center:</span>
                            <span className="font-semibold text-slate-800">
                              {s.exam_centers?.center_name || "—"}
                            </span>
                            {s.exam_centers?.center_code && (
                              <span className="font-mono text-[#143E66] font-bold">
                                ({s.exam_centers.center_code})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleStartEditSession(s)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-[#143E66] hover:text-white text-[#143E66] text-xs font-bold rounded border border-slate-300 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right 1 Col: Add / Edit Session Form */}
          <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#00031D] px-5 py-3.5 text-white border-b-2 border-[#D4AF37] flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>{editingSession ? "Edit Exam Session" : "+ Add New Session"}</span>
              </h2>
              {editingSession && (
                <button
                  type="button"
                  onClick={handleCancelEditSession}
                  className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveSession} className="p-5 space-y-4">
              {sessionSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded text-xs font-semibold">
                  {sessionSuccessMsg}
                </div>
              )}
              {sessionErrorMsg && (
                <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded text-xs font-semibold">
                  {sessionErrorMsg}
                </div>
              )}

              {/* Warning if no centers exist */}
              {centers.length === 0 && !loadingCenters && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                  <strong>No exam centers found!</strong> You must create at least one exam center before adding a session.
                  <div className="mt-1">
                    <Link
                      href="/admin/dashboard/exam-management/centers"
                      className="font-bold text-red-900 underline"
                    >
                      → Manage Exam Centers
                    </Link>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Session Label / सत्र विवरण <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={sessionLabel}
                  onChange={(e) => setSessionLabel(e.target.value)}
                  placeholder="e.g. Mar 2023 - Apr 2024"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
                />
                <p className="text-[10.5px] text-slate-400 mt-1">
                  Printed on admit card banner (e.g. &quot;SESSION MAR 2023 - APR 2024&quot;).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Exam Year Label / परीक्षा वर्ष <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={examYearLabel}
                  onChange={(e) => setExamYearLabel(e.target.value)}
                  placeholder="e.g. 2024 (1st Year) or 2024"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
                />
                <p className="text-[10.5px] text-slate-400 mt-1">
                  Must include 4-digit year used for roll numbers (e.g. 2024 → &quot;24&quot; suffix).
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Assigned Exam Center <span className="text-red-500">*</span>
                  </label>
                  <Link
                    href="/admin/dashboard/exam-management/centers"
                    className="text-[11px] font-semibold text-[#143E66] hover:underline"
                  >
                    + Add Center
                  </Link>
                </div>
                <select
                  required
                  value={examCenterId}
                  onChange={(e) => setExamCenterId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
                >
                  <option value="">-- Select Examination Center --</option>
                  {centers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.center_name} ({c.center_code}) {c.city ? `• ${c.city}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={savingSession || centers.length === 0}
                  className="flex-1 py-2.5 px-4 bg-[#143E66] hover:bg-[#0c2a47] active:bg-[#081f34] text-white text-xs font-bold uppercase tracking-wider rounded shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingSession
                    ? editingSession
                      ? "Saving..."
                      : "Adding..."
                    : editingSession
                    ? "Update Exam Session"
                    : "Add Session to Course"}
                </button>
                {editingSession && (
                  <button
                    type="button"
                    onClick={handleCancelEditSession}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
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
              <div className={`p-4 rounded-lg border ${sessions.length > 0 ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-red-50 border-red-200 text-red-900"}`}>
                <div className="flex items-center gap-2 font-bold text-xs uppercase mb-1">
                  <span>{sessions.length > 0 ? `✓ 2. Exam Sessions (${sessions.length})` : "✕ 2. Missing Exam Sessions"}</span>
                </div>
                <p className="text-[11.5px] opacity-90">
                  {sessions.length > 0 ? `${sessions.length} session(s) configured.` : "No session configured for this course."}
                </p>
              </div>

              {/* Check 3 */}
              <div className={`p-4 rounded-lg border ${datesheetComplete ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
                <div className="flex items-center gap-2 font-bold text-xs uppercase mb-1">
                  <span>{datesheetComplete ? "✓ 3. Datesheet Ready" : "⚠ 3. Datesheet Pending"}</span>
                </div>
                <p className="text-[11.5px] opacity-90">
                  {datesheetComplete ? "Active session datesheet complete." : "Configure datesheet before issuing cards."}
                </p>
              </div>
            </div>

            {/* Action 1: Roll Number Allotment */}
            <div className="pt-5 border-t border-slate-200 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Step 1: Allot Roll Numbers to Approved Students by Session
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generates sequential roll numbers for approved candidates using the selected session&apos;s exam center code and year suffix. Safe to run multiple times.
                </p>
              </div>

              {/* Session Selector for Allotment */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Target Exam Session / लक्षित परीक्षा सत्र:
                  </label>
                  {sessions.length === 0 ? (
                    <p className="text-xs text-amber-800 font-semibold">
                      No exam sessions exist for this course yet. Please create one in Tab 3 (Exam Sessions).
                    </p>
                  ) : (
                    <select
                      value={selectedAllotSessionId}
                      onChange={(e) => setSelectedAllotSessionId(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded text-xs sm:text-sm font-bold text-[#143E66] focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
                    >
                      <option value="">-- Select an Exam Session --</option>
                      {sessions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.session_label} · {s.exam_year_label} {s.exam_centers ? `(${s.exam_centers.center_code})` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="shrink-0">
                  <button
                    onClick={handleAllotRollNumbers}
                    disabled={allottingRolls || !selectedAllotSessionId}
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
              onClick={() => fetchResults(selectedCourse)}
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
                  {resultStudents.map((s, idx) => (
                    <tr
                      key={s.id}
                      onClick={() => router.push(`/admin/dashboard/exam-management/results/${s.id}`)}
                      className="hover:bg-amber-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#143E66]">{s.roll_no || "—"}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{s.registration_no}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 group-hover:text-[#143E66]">
                        {s.candidate_name}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/dashboard/exam-management/results/${s.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#143E66] hover:bg-[#0c2a47] text-white font-bold rounded shadow-xs text-xs transition-colors"
                        >
                          <span>Enter / View Marks</span>
                          <span>→</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
