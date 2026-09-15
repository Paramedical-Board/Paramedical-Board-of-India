import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { isCourseResultsReleased, checkStudentFirstYearPassed } from "@/lib/result-data";
import { getBatchAcademicSessionFromSessionLabel } from "@/lib/course-session-utils";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courseName = req.nextUrl.searchParams.get("course_name");
  const academicSession = req.nextUrl.searchParams.get("academic_session");
  const sessionLabel = req.nextUrl.searchParams.get("session_label");
  const yearNumber = req.nextUrl.searchParams.get("year_number");
  if (!courseName) {
    return NextResponse.json({ error: "course_name is required" }, { status: 400 });
  }

  let query = supabaseAdmin
    .from("student_registrations")
    .select("id, registration_no, candidate_name, roll_no")
    .eq("course", courseName)
    .eq("status", "approved")
    .not("admit_card_generated_at", "is", null)
    .order("roll_no", { ascending: true });

  if (academicSession) {
    query = query.eq("academic_session", academicSession);
  } else if (sessionLabel) {
    const resolved = getBatchAcademicSessionFromSessionLabel(sessionLabel);
    if (resolved) {
      query = query.eq("academic_session", resolved);
    }
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const isSecondYear = sessionLabel?.includes("2nd Year") || yearNumber === "2";

  const enrichedStudents = await Promise.all(
    (data ?? []).map(async (st) => {
      if (!isSecondYear) {
        return {
          ...st,
          first_year_passed: true,
        };
      }
      const check = await checkStudentFirstYearPassed(st.id);
      return {
        ...st,
        first_year_passed: check.passed,
        first_year_reason: check.reason,
      };
    })
  );

  const released = await isCourseResultsReleased(courseName);

  return NextResponse.json({ students: enrichedStudents, released });
}
