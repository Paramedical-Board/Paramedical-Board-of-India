import { supabaseAdmin } from "@/lib/supabase";

export interface AdmitCardSubject {
  subject_name: string;
  subject_code: string;
  exam_date: string;
  exam_time: string;
}

export interface AdmitCardData {
  registration_no: string;
  roll_no: string;
  candidate_name: string;
  father_name: string;
  dob: string;
  course: string;
  photo_url: string | null;
  session_label: string;
  exam_year_label: string;
  center_name: string;
  center_code: string;
  center_address: string | null;
  center_city: string | null;
  subjects: AdmitCardSubject[];
}

export interface AdmitCardResult {
  data: AdmitCardData | null;
  error: string | null;
}

export async function getAdmitCardData(registrationId: string): Promise<AdmitCardResult> {
  const { data: reg, error: regError } = await supabaseAdmin
    .from("student_registrations")
    .select("registration_no, roll_no, candidate_name, father_name, dob, course, photo_url, status")
    .eq("id", registrationId)
    .single();

  if (regError || !reg) {
    return { data: null, error: "Registration not found" };
  }

  if (reg.status !== "approved") {
    return { data: null, error: "Registration is not approved yet" };
  }

  if (!reg.roll_no) {
    return { data: null, error: "Roll number has not been allotted yet" };
  }

  const { data: config, error: configError } = await supabaseAdmin
    .from("course_exam_config")
    .select("session_label, exam_year_label, exam_centers(center_name, center_code, address, city)")
    .eq("course_name", reg.course)
    .single();

  if (configError || !config) {
    return { data: null, error: "Exam session/year/center has not been configured for this course" };
  }

  const center = config.exam_centers as unknown as {
    center_name: string;
    center_code: string;
    address: string | null;
    city: string | null;
  } | null;

  if (!center) {
    return { data: null, error: "Exam center details are missing for this course's config" };
  }

  const { data: subjectRows, error: subjectError } = await supabaseAdmin
    .from("course_subjects")
    .select("id, subject_name, subject_code")
    .eq("course_name", reg.course)
    .order("created_at", { ascending: true });

  if (subjectError) {
    return { data: null, error: subjectError.message };
  }

  if (!subjectRows || subjectRows.length === 0) {
    return { data: null, error: "No subjects defined for this course" };
  }

  const subjectIds = subjectRows.map((s) => s.id);

  const { data: dateRows, error: dateError } = await supabaseAdmin
    .from("datesheets")
    .select("subject_id, exam_date, exam_time")
    .in("subject_id", subjectIds);

  if (dateError) {
    return { data: null, error: dateError.message };
  }

  const dateMap = new Map(dateRows.map((d) => [d.subject_id, d]));

  const incomplete = subjectRows.some((s) => {
    const d = dateMap.get(s.id);
    return !d || !d.exam_date || !d.exam_time;
  });

  if (incomplete) {
    return { data: null, error: "Datesheet is not complete for all subjects in this course" };
  }

  const subjects: AdmitCardSubject[] = subjectRows.map((s) => {
    const d = dateMap.get(s.id)!;
    return {
      subject_name: s.subject_name,
      subject_code: s.subject_code,
      exam_date: d.exam_date,
      exam_time: d.exam_time,
    };
  });

  return {
    data: {
      registration_no: reg.registration_no,
      roll_no: reg.roll_no,
      candidate_name: reg.candidate_name,
      father_name: reg.father_name,
      dob: reg.dob,
      course: reg.course,
      photo_url: reg.photo_url,
      session_label: config.session_label,
      exam_year_label: config.exam_year_label,
      center_name: center.center_name,
      center_code: center.center_code,
      center_address: center.address,
      center_city: center.city,
      subjects,
    },
    error: null,
  };
}
