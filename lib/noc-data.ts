import { supabaseAdmin } from "@/lib/supabase";
import { getResultData, isCourseResultsReleased } from "@/lib/result-data";
import { isTwoYearCourse } from "@/lib/course-session-utils";

export interface NocData {
  serial_no: string;
  enrollment_no: string;
  candidate_name: string;
  salutation: string; // Mr. / Ms. / Mr./Ms.
  relation: string; // S/O / D/O / S/O, D/O
  father_name: string;
  course: string;
  institution_name: string;
  photo_url: string | null;
  registration_date: string; // YYYY-MM-DD
  issue_date: string; // YYYY-MM-DD (IST)
  generated_at: string; // ISO timestamp of when this copy was generated
}

export interface NocResult {
  data: NocData | null;
  error: string | null;
}

function todayIst(): string {
  // en-CA gives YYYY-MM-DD
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export async function getNocData(registrationId: string): Promise<NocResult> {
  const { data: reg, error } = await supabaseAdmin
    .from("student_registrations")
    .select(
      "enrollment_no, candidate_name, father_name, gender, course, photo_url, status, created_at, exam_session_id, exam_session_id_2nd_year, result_published_at, result_published_2nd_year_at, colleges(college_name)"
    )
    .eq("id", registrationId)
    .single();

  if (error || !reg) {
    return { data: null, error: "Registration not found" };
  }

  if (reg.status !== "approved") {
    return { data: null, error: "Your registration has not been approved yet." };
  }

  const enrollmentNo = (reg as any).enrollment_no as string | null;
  if (!enrollmentNo) {
    return { data: null, error: "Enrollment number has not been allotted yet" };
  }

  // The NOC is issued only after the FINAL year of the course is passed.
  // Match the course row the same way the admin exam-management screen does (title, "title (code)" or code).
  const { data: courseRows } = await supabaseAdmin.from("courses").select("title, code, is_two_year");
  const courseRow = (courseRows ?? []).find(
    (c: any) =>
      reg.course === `${c.title} (${c.code})` ||
      c.title === reg.course ||
      c.code === reg.course ||
      (c.code && reg.course.includes(c.code))
  );
  // No matching row -> undefined -> isTwoYearCourse() falls back to its keyword list.
  const dbIsTwoYear = courseRow ? Boolean((courseRow as any).is_two_year) : undefined;
  const finalYear = isTwoYearCourse(reg.course, dbIsTwoYear) ? 2 : 1;

  const sessionId =
    finalYear === 2
      ? ((reg as any).exam_session_id_2nd_year || reg.exam_session_id)
      : reg.exam_session_id;
  const manuallyPublished =
    finalYear === 2 ? !!(reg as any).result_published_2nd_year_at : !!(reg as any).result_published_at;

  if (!manuallyPublished) {
    const released = await isCourseResultsReleased(reg.course, sessionId ?? undefined);
    if (!released) {
      return {
        data: null,
        error: "Your final result has not been published yet. NOC is issued only after passing the course.",
      };
    }
  }

  const { data: result, error: resultError } = await getResultData(registrationId, finalYear);
  if (resultError || !result) {
    return { data: null, error: resultError || "Result not available. Please contact your college." };
  }
  if (result.final_result !== "PASS") {
    return {
      data: null,
      error: "NOC is issued only to candidates who have passed the final examination of the course.",
    };
  }

  const gender = String((reg as any).gender ?? "").trim().toLowerCase();
  const isFemale = gender.startsWith("f");
  const isMale = gender.startsWith("m");

  const college = reg.colleges as unknown as { college_name?: string } | null;

  return {
    data: {
      serial_no: `IPBI/NOC/${enrollmentNo}`,
      enrollment_no: enrollmentNo,
      candidate_name: reg.candidate_name,
      salutation: isFemale ? "Ms." : isMale ? "Mr." : "Mr./Ms.",
      relation: isFemale ? "D/O" : isMale ? "S/O" : "S/O, D/O",
      father_name: reg.father_name,
      course: reg.course,
      institution_name: college?.college_name || "—",
      photo_url: reg.photo_url,
      registration_date: reg.created_at ? new Date(reg.created_at).toISOString().slice(0, 10) : todayIst(),
      issue_date: todayIst(),
      generated_at: new Date().toISOString(),
    },
    error: null,
  };
}
