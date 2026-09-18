"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PARAMEDICAL_COURSES,
  DIPLOMA_COURSES,
  CERTIFICATE_COURSES,
} from "@/components/student/registration/registrationSchema";
import CourseSelectorDropdown from "@/components/common/CourseSelectorDropdown";
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
  year_number?: number;
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
  enrollment_no?: string;
  registration_no?: string;
  candidate_name: string;
  roll_no: string;
  first_year_passed?: boolean;
  first_year_reason?: string;
  is_published?: boolean;
  published_at?: string | null;
}

interface AllottedStudentItem {
  registration_id: string;
  candidate_name: string;
  father_name: string;
  registration_no: string;
  course: string;
  college_name: string;
  roll_no: string;
  admit_card_generated_at: string | null;
  updated_at: string | null;
}

export default function ExamManagementHubPage() {
  const router = useRouter();

  // Primary Course & Session Selection (Header)
  const [selectedCourse, setSelectedCourse] = useState<string>(PARAMEDICAL_COURSES[0]);
  const [selectedSessionKey, setSelectedSessionKey] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"subjects" | "datesheet" | "roll_admit" | "results">("subjects");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize state from URL query parameters or sessionStorage on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sp = new URLSearchParams(window.location.search);
    let tabParam = sp.get("tab");
    let courseParam = sp.get("course");
    let sessionParam = sp.get("session");

    if (!tabParam && !courseParam && !sessionParam) {
      try {
        const saved = sessionStorage.getItem("exam_hub_state");
        if (saved) {
          const parsed = JSON.parse(saved);
          tabParam = parsed.tab;
          courseParam = parsed.course;
          sessionParam = parsed.session;
        }
      } catch (e) {
        // ignore
      }
    }

    if (courseParam && PARAMEDICAL_COURSES.includes(courseParam)) {
      setSelectedCourse(courseParam);
    }
    if (
      tabParam &&
      ["subjects", "datesheet", "roll_admit", "results"].includes(tabParam)
    ) {
      setActiveTab(tabParam as "subjects" | "datesheet" | "roll_admit" | "results");
    }
    if (sessionParam) {
      setSelectedSessionKey(sessionParam);
    }
    setIsInitialized(true);
  }, []);

  // Whenever activeTab, selectedCourse, or selectedSessionKey changes, keep URL & sessionStorage in sync
  useEffect(() => {
    if (typeof window === "undefined" || !isInitialized) return;

    const url = new URL(window.location.href);
    url.searchParams.set("tab", activeTab);
    url.searchParams.set("course", selectedCourse);
    if (selectedSessionKey) {
      url.searchParams.set("session", selectedSessionKey);
    }
    window.history.replaceState(null, "", url.toString());

    try {
      sessionStorage.setItem(
        "exam_hub_state",
        JSON.stringify({
          tab: activeTab,
          course: selectedCourse,
          session: selectedSessionKey,
        })
      );
    } catch (e) {
      // ignore
    }
  }, [activeTab, selectedCourse, selectedSessionKey, isInitialized]);

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
  const [deletingSubjectId, setDeletingSubjectId] = useState<string | null>(null);
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
  const [savingAllDates, setSavingAllDates] = useState(false);
  const [dateRowSuccessMsg, setDateRowSuccessMsg] = useState<Record<string, string>>({});
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState<string | null>(null);
  const [bulkShiftVal, setBulkShiftVal] = useState("Morning (10:00 AM - 01:00 PM)");
  const [bulkStartDate, setBulkStartDate] = useState("");
  const [bulkGapDays, setBulkGapDays] = useState("1");

  // Tab C (previously D): Roll Numbers & Admit Cards State
  const [allottingRolls, setAllottingRolls] = useState(false);
  const [allotResultMsg, setAllotResultMsg] = useState<string | null>(null);
  const [allotError, setAllotError] = useState<string | null>(null);
  const [allottedResults, setAllottedResults] = useState<Array<{ id: string; roll_no: string; exam_session_id?: string }>>([]);
  const [allottedStudents, setAllottedStudents] = useState<AllottedStudentItem[]>([]);
  const [loadingAllottedStudents, setLoadingAllottedStudents] = useState(false);
  const [allottedStudentsError, setAllottedStudentsError] = useState<string | null>(null);

  // Tab D (previously E): Results State
  const [resultStudents, setResultStudents] = useState<ResultStudentItem[]>([]);
  const [resultsReleased, setResultsReleased] = useState<boolean>(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [resultsError, setResultsError] = useState<string | null>(null);

  const fetchRequestIdRef = React.useRef(0);

  // Sync all tab data for a course and session option
  const syncAllData = useCallback(
    async (course: string, targetSessionOpt: CourseSessionOption) => {
      const fetchId = ++fetchRequestIdRef.current;

      setLoadingSubjects(true);
      setLoadingSessions(true);
      setLoadingDatesheet(true);
      setLoadingResults(true);
      setLoadingAllottedStudents(true);
      setSubjectError(null);
      setDatesheetError(null);
      setResultsError(null);
      setAllottedStudentsError(null);

      try {
        // 1. Fetch Subjects & Sessions in parallel (subjects scoped to year_number)
        const yearParam = targetSessionOpt.year_number || 1;
        const subjPromise = fetch(
          `/api/admin/subjects?course_name=${encodeURIComponent(course)}&year_number=${encodeURIComponent(String(yearParam))}`
        )
          .then((r) => r.json())
          .catch(() => ({ subjects: [] }));

        const sessPromise = fetch(`/api/admin/exam-sessions?course_name=${encodeURIComponent(course)}`)
          .then((r) => r.json())
          .catch(() => ({ sessions: [] }));

        const [subjData, sessData] = await Promise.all([subjPromise, sessPromise]);

        if (fetchId !== fetchRequestIdRef.current) return;

        const subjectList: SubjectItem[] = subjData.subjects || [];
        setSubjects(subjectList);
        setLoadingSubjects(false);

        const sessionList: ExamSession[] = sessData.sessions || [];
        setSessions(sessionList);

        let matched = sessionList.find((s) => s.session_label === targetSessionOpt.session_label);

        // Auto-provision session if missing
        if (!matched && targetSessionOpt.session_label) {
          try {
            const createRes = await fetch("/api/admin/exam-sessions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                course_name: course,
                session_label: targetSessionOpt.session_label,
                exam_year_label: targetSessionOpt.exam_year_label,
                academic_session: targetSessionOpt.academic_session,
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

        if (fetchId !== fetchRequestIdRef.current) return;
        setActiveSession(matched || null);
        setLoadingSessions(false);

        if (matched?.id) {
          // 2. Fetch Datesheet, Results & Allotted Roll Numbers for this matched session
          const datesheetPromise = fetch(
            `/api/admin/datesheets?course_name=${encodeURIComponent(course)}&session_id=${encodeURIComponent(matched.id)}`
          )
            .then((r) => r.json())
            .catch(() => ({ subjects: [], complete: false }));

          const resultsUrl = `/api/admin/results?course_name=${encodeURIComponent(course)}&session_label=${encodeURIComponent(targetSessionOpt.session_label)}&academic_session=${encodeURIComponent(targetSessionOpt.academic_session)}&year_number=${targetSessionOpt.year_number}&session_id=${encodeURIComponent(matched.id)}`;
          const resultsPromise = fetch(resultsUrl)
            .then((r) => r.json())
            .catch(() => ({ students: [], released: false }));

          const rollNumbersUrl = `/api/admin/roll-numbers?session_id=${encodeURIComponent(matched.id)}&year_number=${encodeURIComponent(String(targetSessionOpt.year_number || 1))}`;
          const rollNumbersPromise = fetch(rollNumbersUrl)
            .then((r) => r.json())
            .catch(() => ({ students: [] }));

          const [dsData, resData, rollData] = await Promise.all([datesheetPromise, resultsPromise, rollNumbersPromise]);

          if (fetchId !== fetchRequestIdRef.current) return;

          const dsList: DatesheetSubjectItem[] = dsData.subjects || [];
          setDatesheetSubjects(dsList);
          setDatesheetComplete(dsData.complete ?? false);

          setDatesheetFormValues((prev) => {
            const nextMap: Record<string, { exam_date: string; exam_time: string }> = { ...prev };
            dsList.forEach((s) => {
              nextMap[s.id] = {
                exam_date: s.exam_date || prev[s.id]?.exam_date || "",
                exam_time: s.exam_time || prev[s.id]?.exam_time || "Morning (10:00 AM - 01:00 PM)",
              };
            });
            return nextMap;
          });

          setResultStudents(resData.students || []);
          setResultsReleased(resData.released ?? false);
          setAllottedStudents(rollData.students || []);
        } else {
          setDatesheetSubjects([]);
          setDatesheetComplete(false);
          setResultStudents([]);
          setResultsReleased(false);
          setAllottedStudents([]);
        }
      } catch (err) {
        console.error("syncAllData error:", err);
      } finally {
        if (fetchId === fetchRequestIdRef.current) {
          setLoadingSubjects(false);
          setLoadingSessions(false);
          setLoadingDatesheet(false);
          setLoadingResults(false);
          setLoadingAllottedStudents(false);
        }
      }
    },
    []
  );

  // Dedicated helper to refresh allotted students roster on demand
  const fetchAllottedStudents = useCallback(async (sessionId: string, yearNumber: number) => {
    setLoadingAllottedStudents(true);
    setAllottedStudentsError(null);
    try {
      const res = await fetch(
        `/api/admin/roll-numbers?session_id=${encodeURIComponent(sessionId)}&year_number=${encodeURIComponent(String(yearNumber))}`
      );
      const data = await res.json();
      if (!res.ok) {
        setAllottedStudentsError(data.error || "Failed to load allotted students");
      } else {
        setAllottedStudents(data.students || []);
      }
    } catch (err) {
      console.error("Fetch allotted students error:", err);
      setAllottedStudentsError("Failed to connect to server.");
    } finally {
      setLoadingAllottedStudents(false);
    }
  }, []);

  // Sync data whenever isInitialized is true and course/session changes
  useEffect(() => {
    if (!isInitialized) return;
    syncAllData(selectedCourse, activeSessionOption);
  }, [isInitialized, selectedCourse, activeSessionOption, syncAllData]);

  // Re-fetch allotted students roster whenever switching to the roll_admit tab
  useEffect(() => {
    if (activeTab === "roll_admit" && activeSession?.id) {
      fetchAllottedStudents(activeSession.id, activeSessionOption.year_number || 1);
    }
  }, [activeTab, activeSession?.id, activeSessionOption.year_number, fetchAllottedStudents]);

  // Handlers for course and session dropdown changes
  const handleCourseChange = (newCourse: string) => {
    setSelectedCourse(newCourse);
    const newOpts = getCourseSessionOptions(newCourse);
    const defaultKey = newOpts[0]?.key || "";
    setSelectedSessionKey(defaultKey);
    setAllotResultMsg(null);
    setAllotError(null);
    setAllottedResults([]);
  };

  const handleSessionChange = (newKey: string) => {
    setSelectedSessionKey(newKey);
    setAllotResultMsg(null);
    setAllotError(null);
    setAllottedResults([]);
  };

  // Individual helper fetchers for targeted updates
  const fetchSubjects = async (course: string, yearNumber?: number) => {
    try {
      setLoadingSubjects(true);
      setSubjectError(null);
      const yr = yearNumber ?? activeSessionOption.year_number ?? 1;
      const res = await fetch(
        `/api/admin/subjects?course_name=${encodeURIComponent(course)}&year_number=${encodeURIComponent(String(yr))}`
      );
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

      setDatesheetFormValues((prev) => {
        const nextMap: Record<string, { exam_date: string; exam_time: string }> = { ...prev };
        list.forEach((s) => {
          nextMap[s.id] = {
            exam_date: s.exam_date || prev[s.id]?.exam_date || "",
            exam_time: s.exam_time || prev[s.id]?.exam_time || "Morning (10:00 AM - 01:00 PM)",
          };
        });
        return nextMap;
      });
    } catch (err) {
      console.error("Fetch datesheet error:", err);
      setDatesheetError("Network error loading datesheet.");
    } finally {
      setLoadingDatesheet(false);
    }
  }, []);

  const fetchResults = async (
    course: string,
    targetAcademicSession?: string,
    sessionLabel?: string,
    yearNum?: number,
    sessionId?: string
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
      if (sessionId) url += `&session_id=${encodeURIComponent(sessionId)}`;

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
      year_number: activeSessionOption.year_number || 1,
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
      fetchSubjects(selectedCourse, activeSessionOption.year_number);
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

  const handleDeleteSubject = async (subject: SubjectItem) => {
    const confirmed = window.confirm(
      `Delete subject "${subject.subject_name}" (${subject.subject_code})? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingSubjectId(subject.id);
    try {
      const res = await fetch(`/api/admin/subjects/${subject.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete subject");
        return;
      }
      fetchSubjects(selectedCourse);
      if (activeSession?.id) {
        fetchDatesheet(selectedCourse, activeSession.id);
      }
    } catch (err) {
      console.error("Delete subject error:", err);
      alert("Network error deleting subject.");
    } finally {
      setDeletingSubjectId(null);
    }
  };

  // Handlers for Tab B: Datesheet
  const handleDatesheetRowChange = (subjectId: string, field: "exam_date" | "exam_time", value: string) => {
    setDatesheetFormValues((prev) => ({
      ...prev,
      [subjectId]: {
        ...(prev[subjectId] || { exam_date: "", exam_time: "Morning (10:00 AM - 01:00 PM)" }),
        [field]: value,
      },
    }));
  };

  const handleApplyShiftToAll = (shiftText: string) => {
    if (!shiftText) return;
    setDatesheetFormValues((prev) => {
      const updated = { ...prev };
      displayDatesheetRows.forEach((s) => {
        updated[s.id] = {
          exam_date: updated[s.id]?.exam_date || s.exam_date || "",
          exam_time: shiftText,
        };
      });
      return updated;
    });
  };

  const handleAutoFillDates = () => {
    if (!bulkStartDate) {
      alert("Please select a starting date first (शुरुआती तारीख चुनें).");
      return;
    }
    const start = new Date(bulkStartDate);
    if (isNaN(start.getTime())) {
      alert("Invalid starting date.");
      return;
    }

    const gap = parseInt(bulkGapDays, 10) || 1;
    const nextValues: Record<string, { exam_date: string; exam_time: string }> = { ...datesheetFormValues };
    const curr = new Date(start);

    displayDatesheetRows.forEach((s, idx) => {
      if (idx > 0) {
        curr.setDate(curr.getDate() + gap);
      }
      const yyyy = curr.getFullYear();
      const mm = String(curr.getMonth() + 1).padStart(2, "0");
      const dd = String(curr.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;

      nextValues[s.id] = {
        exam_date: dateStr,
        exam_time: nextValues[s.id]?.exam_time || bulkShiftVal || "Morning (10:00 AM - 01:00 PM)",
      };
    });

    setDatesheetFormValues(nextValues);
  };

  const ensureTargetSessionId = async (): Promise<string | null> => {
    let targetSessionId = activeSession?.id;
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
        return null;
      }
    }
    return targetSessionId || null;
  };

  const handleSaveDatesheetRow = async (subjectId: string) => {
    const row = datesheetFormValues[subjectId];
    if (!row || !row.exam_date || !row.exam_time) {
      alert("Please provide both Exam Date and Exam Time.");
      return;
    }

    setSavingDateRowId(subjectId);
    setDateRowSuccessMsg((prev) => ({ ...prev, [subjectId]: "" }));
    setBulkSuccessMsg(null);

    try {
      const targetSessionId = await ensureTargetSessionId();
      if (!targetSessionId) return;

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

  const handleSaveAllDatesheetRows = async () => {
    const entriesToSave: Array<{ subject_id: string; exam_date: string; exam_time: string }> = [];
    const emptySubjects: string[] = [];

    displayDatesheetRows.forEach((s) => {
      const val = datesheetFormValues[s.id];
      if (val && val.exam_date && val.exam_time) {
        entriesToSave.push({
          subject_id: s.id,
          exam_date: val.exam_date,
          exam_time: val.exam_time,
        });
      } else {
        emptySubjects.push(s.subject_name);
      }
    });

    if (entriesToSave.length === 0) {
      alert("Please fill in Exam Date and Exam Time for at least one subject.");
      return;
    }

    setSavingAllDates(true);
    setDatesheetError(null);
    setBulkSuccessMsg(null);

    try {
      const targetSessionId = await ensureTargetSessionId();
      if (!targetSessionId) return;

      const res = await fetch("/api/admin/datesheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam_session_id: targetSessionId,
          entries: entriesToSave,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDatesheetError(data.error || "Failed to save datesheet schedule.");
        return;
      }

      const successUpdates: Record<string, string> = {};
      entriesToSave.forEach((entry) => {
        successUpdates[entry.subject_id] = "Saved ✓";
      });
      setDateRowSuccessMsg((prev) => ({ ...prev, ...successUpdates }));

      const count = entriesToSave.length;
      if (emptySubjects.length === 0) {
        setBulkSuccessMsg(`All ${count} subjects schedule saved successfully! (पूरा टाइम-टेबल सेव हो गया)`);
      } else {
        setBulkSuccessMsg(`${count} subjects schedule saved! (${emptySubjects.length} subject(s) pending)`);
      }

      fetchDatesheet(selectedCourse, targetSessionId);
    } catch (err) {
      console.error("Bulk save datesheet error:", err);
      setDatesheetError("Network error saving datesheet schedule.");
    } finally {
      setSavingAllDates(false);
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
      await fetchAllottedStudents(activeSession.id, activeSessionOption.year_number || 1);
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
          <div className="lg:col-span-6 relative z-20">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Course / पाठ्यक्रम चुनें:
              </label>
              <span className="text-[11px] font-bold text-[#143E66] px-2 py-0.5 bg-blue-50 border border-blue-200 rounded">
                {is2Year ? "2 Years Duration" : "1 Year Duration"}
              </span>
            </div>
            <CourseSelectorDropdown
              value={selectedCourse}
              onChange={handleCourseChange}
              buttonClassName="font-bold text-[#143E66] border-slate-300"
            />
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
              value={selectedSessionKey || sessionOptions[0]?.key}
              onChange={(e) => handleSessionChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-base sm:text-sm font-bold text-[#143E66] focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
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
              {subjects.length} Subjects Defined ({activeSessionOption.year_number === 2 ? "2nd Year" : "1st Year"})
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
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
        <button
          onClick={() => setActiveTab("subjects")}
          className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
            activeTab === "subjects"
              ? "border-[#143E66] text-[#143E66] bg-white rounded-t-md"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>1. Subjects ({subjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("datesheet")}
          className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
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
          className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
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
            fetchResults(
              selectedCourse,
              activeSessionOption.academic_session,
              activeSessionOption.session_label,
              activeSessionOption.year_number,
              activeSession?.id
            );
          }}
          className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
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
              <div>
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                  Subjects for {selectedCourse} — {activeSessionOption.year_number === 2 ? "2nd Year" : "1st Year"} ({subjects.length})
                </h2>
                <p className="text-[11px] text-slate-300 font-normal mt-0.5">
                  Showing syllabus curriculum for {activeSessionOption.label}
                </p>
              </div>
              <button
                onClick={() => fetchSubjects(selectedCourse, activeSessionOption.year_number)}
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
                            <div className="flex items-center justify-end gap-2">
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
                              <button
                                onClick={() => handleDeleteSubject(s)}
                                disabled={deletingSubjectId === s.id}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-red-600 hover:text-white text-red-600 font-bold rounded border border-slate-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {deletingSubjectId === s.id ? "..." : "Delete"}
                              </button>
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

          {/* Right 1 Col: Add Subject Form */}
          <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
            <div className="bg-[#00031D] px-5 py-3.5 text-white border-b-2 border-[#D4AF37]">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add New Subject ({activeSessionOption.year_number === 2 ? "2nd Year" : "1st Year"})</span>
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66] focus:outline-hidden"
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
                {addingSubject ? "Adding Subject..." : `Add Subject to ${activeSessionOption.year_number === 2 ? "2nd Year" : "1st Year"}`}
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
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66]"
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

          {/* Bulk Success Message Banner */}
          {bulkSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs sm:text-sm flex items-center justify-between shadow-xs animate-fadeIn">
              <div className="flex items-center gap-2 font-bold">
                <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{bulkSuccessMsg}</span>
              </div>
              <button
                onClick={() => setBulkSuccessMsg(null)}
                className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2 py-1 hover:bg-emerald-100 rounded"
              >
                ✕ Dismiss
              </button>
            </div>
          )}

          {/* Quick Setup & Auto-Fill Toolbar */}
          {subjects.length > 0 && (
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-[#143E66] uppercase tracking-wider flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#143E66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Fill Tools / त्वरित सुविधा (Multiple Dates & Timings)
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Fill multiple dates at once then click <strong>Save All</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-xs">
                {/* Tool 1: Consecutive Dates Auto-Fill */}
                <div className="bg-white p-3 rounded-md border border-slate-200 flex flex-col gap-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <span>1. Auto-Fill Date Sequence / क्रमिक तिथियां भरें:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-6">
                      <label className="text-[11px] text-slate-500 font-semibold block mb-0.5">Start Date (शुरुआती तारीख):</label>
                      <input
                        type="date"
                        value={bulkStartDate}
                        onChange={(e) => setBulkStartDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66]"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[11px] text-slate-500 font-semibold block mb-0.5">Gap (अन्तराल):</label>
                      <select
                        value={bulkGapDays}
                        onChange={(e) => setBulkGapDays(e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white"
                      >
                        <option value="1">+1 Day (Daily)</option>
                        <option value="2">+2 Days (Alt)</option>
                        <option value="3">+3 Days</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3 flex items-end">
                      <button
                        type="button"
                        onClick={handleAutoFillDates}
                        className="w-full mt-4 sm:mt-0 py-1.5 px-2.5 bg-[#143E66] hover:bg-[#0c2a47] text-white font-bold rounded text-[11px] transition cursor-pointer shadow-xs"
                      >
                        Fill Dates
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tool 2: Apply Shift to All */}
                <div className="bg-white p-3 rounded-md border border-slate-200 flex flex-col gap-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <span>2. Common Shift / Time (सभी में एक समय लागू करें):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-8">
                      <label className="text-[11px] text-slate-500 font-semibold block mb-0.5">Shift / Time String:</label>
                      <input
                        type="text"
                        value={bulkShiftVal}
                        onChange={(e) => setBulkShiftVal(e.target.value)}
                        placeholder="Morning (10:00 AM - 01:00 PM)"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#143E66]"
                      />
                    </div>
                    <div className="sm:col-span-4 flex items-end">
                      <button
                        type="button"
                        onClick={() => handleApplyShiftToAll(bulkShiftVal)}
                        className="w-full mt-4 sm:mt-0 py-1.5 px-2.5 bg-[#143E66] hover:bg-[#0c2a47] text-white font-bold rounded text-[11px] transition cursor-pointer shadow-xs"
                      >
                        Apply to All
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        const s = "Morning (10:00 AM - 01:00 PM)";
                        setBulkShiftVal(s);
                        handleApplyShiftToAll(s);
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10.5px] rounded border border-slate-300 cursor-pointer"
                    >
                      Morning (10:00 AM - 01:00 PM)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const s = "Evening (02:00 PM - 05:00 PM)";
                        setBulkShiftVal(s);
                        handleApplyShiftToAll(s);
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10.5px] rounded border border-slate-300 cursor-pointer"
                    >
                      Evening (02:00 PM - 05:00 PM)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Datesheet Schedule Table */}
          {subjects.length > 0 && (
            <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
              <div className="bg-[#143E66] px-5 py-3.5 text-white border-b-2 border-[#D4AF37] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                    Datesheet Schedule / परीक्षा समय सारणी
                  </h2>
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                    Session: {activeSessionOption.label} • {displayDatesheetRows.length} Subject(s)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveAllDatesheetRows}
                    disabled={savingAllDates}
                    className="px-4 py-2 bg-[#D4AF37] hover:bg-[#b5952f] text-[#00031D] font-black rounded shadow-md text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {savingAllDates ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving All Dates...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        Save All Dates / सभी तिथियां सहेजें
                      </>
                    )}
                  </button>
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
                      const formVal = datesheetFormValues[s.id] || {
                        exam_date: s.exam_date || "",
                        exam_time: s.exam_time || "Morning (10:00 AM - 01:00 PM)",
                      };
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
                                type="button"
                                onClick={() => handleSaveDatesheetRow(s.id)}
                                disabled={isSaving || savingAllDates}
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

              {/* Bottom Bulk Save Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">
                    {displayDatesheetRows.filter((s) => datesheetFormValues[s.id]?.exam_date && datesheetFormValues[s.id]?.exam_time).length} of {displayDatesheetRows.length}
                  </span>{" "}
                  subjects have dates configured. Click <strong>Save All Dates</strong> to save the entire schedule at once.
                </div>
                <button
                  type="button"
                  onClick={handleSaveAllDatesheetRows}
                  disabled={savingAllDates}
                  className="px-5 py-2.5 bg-[#143E66] hover:bg-[#0c2a47] text-white font-bold rounded-md shadow-sm text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {savingAllDates ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving All Dates...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Save All Dates / सभी तिथियां सहेजें
                    </>
                  )}
                </button>
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
              {/* Allotted Students Persistent Roster */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#00031D] flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#143E66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Allotted Roll Numbers List ({allottedStudents.length})</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    {loadingAllottedStudents && (
                      <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <svg className="w-3 h-3 animate-spin text-[#143E66]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Refreshing roster...
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-slate-600">
                      {activeSessionOption.label}
                    </span>
                  </div>
                </div>

                {allottedStudentsError && (
                  <div className="mb-3 text-xs font-bold text-red-700 bg-red-50 p-2.5 rounded border border-red-200">
                    {allottedStudentsError}
                  </div>
                )}

                {loadingAllottedStudents && allottedStudents.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 bg-white rounded border border-slate-200">
                    <svg className="w-5 h-5 animate-spin mx-auto text-[#143E66] mb-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading allotted candidates...
                  </div>
                ) : allottedStudents.length === 0 ? (
                  <div className="py-8 text-center bg-white rounded border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">
                      No roll numbers allotted yet for this batch.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Click &quot;Allot Roll Numbers&quot; above to assign sequential roll numbers to approved candidates.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-80 overflow-y-auto border border-slate-200 rounded bg-white shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px] tracking-wider sticky top-0 z-10 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3 w-10 text-center">#</th>
                          <th className="py-2.5 px-3">Roll No</th>
                          <th className="py-2.5 px-3">Reg / Enr No</th>
                          <th className="py-2.5 px-3">Candidate Name</th>
                          <th className="py-2.5 px-3">Father&apos;s Name</th>
                          <th className="py-2.5 px-3">College / Institute</th>
                          <th className="py-2.5 px-3 text-center">Admit Card</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {allottedStudents.map((item, idx) => (
                          <tr key={item.registration_id} className="hover:bg-blue-50/40 transition-colors">
                            <td className="py-2.5 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-[#143E66]">{item.roll_no}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-600">{item.registration_no}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{item.candidate_name}</td>
                            <td className="py-2.5 px-3 text-slate-600">{item.father_name}</td>
                            <td className="py-2.5 px-3 text-slate-600 max-w-[200px] truncate" title={item.college_name}>
                              {item.college_name}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {item.admit_card_generated_at ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  Generated
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <Link
                                href={`/admin/dashboard/applications/${item.registration_id}`}
                                target="_blank"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#143E66] hover:text-[#0b2545] hover:underline"
                              >
                                View
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
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
                  Preview and edit candidate details before confirming bulk admit card generation and printing.
                </p>
              </div>

              <Link
                href={`/admin/dashboard/admit-cards/bulk/preview?course_name=${encodeURIComponent(selectedCourse)}&academic_session=${encodeURIComponent(activeSessionOption.academic_session)}&session_label=${encodeURIComponent(activeSessionOption.session_label)}&year_number=${activeSessionOption.year_number}`}
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
                  activeSessionOption.year_number,
                  activeSession?.id
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
                    <th className="py-3 px-4">Enrollment No.</th>
                    <th className="py-3 px-4">Candidate Name</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {resultStudents.map((s, idx) => {
                    const isLocked = activeSessionOption.year_number === 2 && s.first_year_passed === false;
                    const yearNum = activeSessionOption.year_number || (selectedSessionKey.includes("2nd Year") ? 2 : 1);
                    const resultLink = `/admin/dashboard/exam-management/results/${s.id}?returnTab=${activeTab}&course=${encodeURIComponent(selectedCourse)}&session=${encodeURIComponent(selectedSessionKey)}&year=${yearNum}`;

                    return (
                      <tr
                        key={s.id}
                        onClick={() => {
                          if (!isLocked) {
                            router.push(resultLink);
                          }
                        }}
                        className={`transition-colors ${
                          isLocked ? "bg-slate-50 opacity-75 cursor-not-allowed" : "hover:bg-amber-50/50 cursor-pointer group"
                        }`}
                      >
                        <td className="py-3 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-4 font-mono font-bold text-[#143E66]">{s.roll_no || "—"}</td>
                        <td className="py-3 px-4 font-mono text-slate-700">{s.enrollment_no || s.registration_no}</td>
                        <td className="py-3 px-4 font-bold text-slate-900 group-hover:text-[#143E66]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span>{s.candidate_name}</span>
                            {s.is_published && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[10px] font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Live Published
                              </span>
                            )}
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
                              href={resultLink}
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
