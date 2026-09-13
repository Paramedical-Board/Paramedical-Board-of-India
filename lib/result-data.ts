import { supabaseAdmin } from "@/lib/supabase";

export interface ResultSubject {
  subject_id: string;
  subject_name: string;
  subject_code: string;
  theory_max: number;
  practical_max: number;
  ca_max: number;
  theory_marks: number | null;
  practical_marks: number | null;
  ca_marks: number | null;
  total_marks: number | null;
  total_max: number;
  percentage: number | null;
  grade: string | null;
  subject_result: "PASS" | "FAIL" | null;
}

export interface ResultData {
  registration_no: string;
  roll_no: string;
  candidate_name: string;
  father_name: string;
  mother_name: string;
  dob: string;
  course: string;
  photo_url?: string | null;
  session_label: string;
  exam_year_label: string;
  center_name: string;
  subjects: ResultSubject[];
  grand_total_obtained: number;
  grand_total_max: number;
  final_result: "PASS" | "FAIL" | "INCOMPLETE";
}

export interface ResultDataResult {
  data: ResultData | null;
  error: string | null;
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

export async function getResultData(registrationId: string): Promise<ResultDataResult> {
  const { data: reg, error: regError } = await supabaseAdmin
    .from("student_registrations")
    .select(
      "registration_no, roll_no, candidate_name, father_name, mother_name, dob, course, photo_url, status, admit_card_generated_at"
    )
    .eq("id", registrationId)
    .single();

  if (regError || !reg) {
    return { data: null, error: "Registration not found" };
  }

  if (reg.status !== "approved") {
    return { data: null, error: "Registration is not approved yet" };
  }

  if (!reg.admit_card_generated_at) {
    return { data: null, error: "Admit card has not been generated for this student yet" };
  }

  const { data: config, error: configError } = await supabaseAdmin
    .from("course_exam_config")
    .select("session_label, exam_year_label, exam_centers(center_name)")
    .eq("course_name", reg.course)
    .single();

  if (configError || !config) {
    return { data: null, error: "Exam session/year/center has not been configured for this course" };
  }

  const center = config.exam_centers as unknown as { center_name: string } | null;

  const { data: subjectRows, error: subjectError } = await supabaseAdmin
    .from("course_subjects")
    .select("id, subject_name, subject_code, theory_max, practical_max, ca_max")
    .eq("course_name", reg.course)
    .order("created_at", { ascending: true });

  if (subjectError) {
    return { data: null, error: subjectError.message };
  }

  if (!subjectRows || subjectRows.length === 0) {
    return { data: null, error: "No subjects defined for this course" };
  }

  const missingMax = subjectRows.some(
    (s) => s.theory_max === null || s.practical_max === null || s.ca_max === null
  );
  if (missingMax) {
    return {
      data: null,
      error: "Max marks (theory/practical/CA) are not set for all subjects in this course",
    };
  }

  const subjectIds = subjectRows.map((s) => s.id);

  const { data: markRows, error: markError } = await supabaseAdmin
    .from("student_subject_marks")
    .select("subject_id, theory_marks, practical_marks, ca_marks")
    .eq("registration_id", registrationId)
    .in("subject_id", subjectIds);

  if (markError) {
    return { data: null, error: markError.message };
  }

  const markMap = new Map((markRows ?? []).map((m) => [m.subject_id, m]));

  let grandTotalObtained = 0;
  let grandTotalMax = 0;
  let anyMissing = false;
  let anyFail = false;

  const subjects: ResultSubject[] = subjectRows.map((s) => {
    const totalMax = (s.theory_max ?? 0) + (s.practical_max ?? 0) + (s.ca_max ?? 0);
    const m = markMap.get(s.id);
    grandTotalMax += totalMax;

    if (!m) {
      anyMissing = true;
      return {
        subject_id: s.id,
        subject_name: s.subject_name,
        subject_code: s.subject_code,
        theory_max: s.theory_max,
        practical_max: s.practical_max,
        ca_max: s.ca_max,
        theory_marks: null,
        practical_marks: null,
        ca_marks: null,
        total_marks: null,
        total_max: totalMax,
        percentage: null,
        grade: null,
        subject_result: null,
      };
    }

    const totalObtained = m.theory_marks + m.practical_marks + m.ca_marks;
    const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
    const grade = computeGrade(percentage);
    const subjectResult: "PASS" | "FAIL" = percentage >= 40 ? "PASS" : "FAIL";

    if (subjectResult === "FAIL") anyFail = true;
    grandTotalObtained += totalObtained;

    return {
      subject_id: s.id,
      subject_name: s.subject_name,
      subject_code: s.subject_code,
      theory_max: s.theory_max,
      practical_max: s.practical_max,
      ca_max: s.ca_max,
      theory_marks: m.theory_marks,
      practical_marks: m.practical_marks,
      ca_marks: m.ca_marks,
      total_marks: totalObtained,
      total_max: totalMax,
      percentage: Math.round(percentage * 100) / 100,
      grade,
      subject_result: subjectResult,
    };
  });

  const finalResult: "PASS" | "FAIL" | "INCOMPLETE" = anyMissing
    ? "INCOMPLETE"
    : anyFail
    ? "FAIL"
    : "PASS";

  return {
    data: {
      registration_no: reg.registration_no,
      roll_no: reg.roll_no,
      candidate_name: reg.candidate_name,
      father_name: reg.father_name,
      mother_name: reg.mother_name,
      dob: reg.dob,
      course: reg.course,
      photo_url: reg.photo_url ?? null,
      session_label: config.session_label,
      exam_year_label: config.exam_year_label,
      center_name: center?.center_name ?? "",
      subjects,
      grand_total_obtained: grandTotalObtained,
      grand_total_max: grandTotalMax,
      final_result: finalResult,
    },
    error: null,
  };
}

export async function upsertSubjectMarks(
  registrationId: string,
  marks: { subject_id: string; theory_marks: number; practical_marks: number; ca_marks: number }[]
): Promise<{ error: string | null }> {
  const rows = marks.map((m) => ({
    registration_id: registrationId,
    subject_id: m.subject_id,
    theory_marks: m.theory_marks,
    practical_marks: m.practical_marks,
    ca_marks: m.ca_marks,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabaseAdmin
    .from("student_subject_marks")
    .upsert(rows, { onConflict: "registration_id,subject_id" });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function isCourseResultsReleased(courseName: string): Promise<boolean> {
  const { data: registrations, error } = await supabaseAdmin
    .from("student_registrations")
    .select("id")
    .eq("course", courseName)
    .eq("status", "approved")
    .not("admit_card_generated_at", "is", null);

  if (error || !registrations || registrations.length === 0) {
    return false;
  }

  for (const reg of registrations) {
    const { data, error: resultError } = await getResultData(reg.id);
    if (resultError || !data || data.final_result === "INCOMPLETE") {
      return false;
    }
  }

  return true;
}
