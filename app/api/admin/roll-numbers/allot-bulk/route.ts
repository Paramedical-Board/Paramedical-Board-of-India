import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getBatchAcademicSessionFromSessionLabel } from "@/lib/course-session-utils";
import { checkStudentFirstYearPassed } from "@/lib/result-data";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { session_id, academic_session } = body;

  if (!session_id) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  const { data: session, error: sessionError } = await supabaseAdmin
    .from("exam_sessions")
    .select("course_name, session_label, exam_year_label, exam_centers(center_code)")
    .eq("id", session_id)
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "Exam session not found" }, { status: 400 });
  }

  const centerCode = (session.exam_centers as unknown as { center_code: string } | null)?.center_code;
  if (!centerCode) {
    return NextResponse.json({ error: "Assigned exam center has no center_code set" }, { status: 400 });
  }

  const yearMatch = session.exam_year_label.match(/\d{4}/);
  if (!yearMatch) {
    return NextResponse.json({ error: "Could not extract a 4-digit year from exam_year_label" }, { status: 400 });
  }
  const yearSuffix = yearMatch[0].slice(-2);
  const prefix = `${centerCode}${yearSuffix}`;

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("student_registrations")
    .select("roll_no")
    .like("roll_no", `${prefix}%`)
    .order("roll_no", { ascending: false })
    .limit(1);

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  let nextSeq = 1;
  if (existing.length > 0) {
    const lastSeqStr = existing[0].roll_no.slice(prefix.length);
    const lastSeq = parseInt(lastSeqStr, 10);
    if (!isNaN(lastSeq)) {
      nextSeq = lastSeq + 1;
    }
  }

  const targetAcademicSession =
    academic_session || getBatchAcademicSessionFromSessionLabel(session.session_label);

  let query = supabaseAdmin
    .from("student_registrations")
    .select("id, candidate_name, registration_no")
    .eq("course", session.course_name)
    .eq("status", "approved")
    .is("roll_no", null)
    .order("created_at", { ascending: true });

  if (targetAcademicSession) {
    query = query.eq("academic_session", targetAcademicSession);
  }

  const { data: students, error: studentsError } = await query;

  if (studentsError) {
    return NextResponse.json({ error: studentsError.message }, { status: 500 });
  }

  if (!students || students.length === 0) {
    return NextResponse.json({ allotted: 0, message: "No eligible students (approved, without roll_no) found for this course and session" });
  }

  const isSecondYear = session.session_label?.includes("2nd Year");
  const eligibleStudents = [];
  const skippedStudents = [];

  for (const student of students) {
    if (isSecondYear) {
      const check = await checkStudentFirstYearPassed(student.id);
      if (!check.passed) {
        skippedStudents.push({
          id: student.id,
          registration_no: student.registration_no,
          candidate_name: student.candidate_name,
          reason: check.reason || "1st Year result not cleared",
        });
        continue;
      }
    }
    eligibleStudents.push(student);
  }

  if (eligibleStudents.length === 0) {
    return NextResponse.json({
      allotted: 0,
      skipped: skippedStudents,
      message: isSecondYear
        ? "0 students allotted: Candidates have not cleared/completed 1st Year examinations yet."
        : "No eligible students found for roll number allotment.",
    });
  }

  const results = [];
  for (const student of eligibleStudents) {
    const rollNo = `${prefix}${String(nextSeq).padStart(4, "0")}`;
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("student_registrations")
      .update({ roll_no: rollNo, exam_session_id: session_id })
      .eq("id", student.id)
      .select("id, roll_no, exam_session_id")
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message, allotted: results.length, results }, { status: 500 });
    }

    results.push(updated);
    nextSeq++;
  }

  return NextResponse.json({ allotted: results.length, results });
}
