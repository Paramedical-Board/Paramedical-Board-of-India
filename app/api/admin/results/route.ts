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
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!courseName) {
    return NextResponse.json({ error: "course_name is required" }, { status: 400 });
  }

  // Resolve target exam session ID
  let targetSessionId = sessionId;
  if (sessionLabel) {
    const { data: sessionData } = await supabaseAdmin
      .from("exam_sessions")
      .select("id")
      .eq("course_name", courseName)
      .eq("session_label", sessionLabel)
      .maybeSingle();

    if (sessionData?.id) {
      targetSessionId = sessionData.id;
    }
  }

  // If no exam session exists yet for this label, return empty list
  if (!targetSessionId) {
    return NextResponse.json({ students: [], released: false });
  }

  let query = supabaseAdmin
    .from("student_registrations")
    .select("id, registration_no, candidate_name, roll_no")
    .eq("course", courseName)
    .eq("status", "approved")
    .eq("exam_session_id", targetSessionId)
    .not("admit_card_generated_at", "is", null)
    .order("roll_no", { ascending: true });

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

  const released = await isCourseResultsReleased(courseName, targetSessionId);

  return NextResponse.json({ students: enrichedStudents, released });
}
