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

  const targetAcademicSession =
    academic_session || getBatchAcademicSessionFromSessionLabel(session.session_label);

  const sessionStr = targetAcademicSession || session.session_label || session.exam_year_label || "2023-2024";
  const fullMatch = sessionStr.match(/(\d{4})[^\d]*(\d{2,4})/);
  let sessionDigits = "202324";
  if (fullMatch) {
    const y1 = fullMatch[1];
    const y2 = fullMatch[2].slice(-2);
    sessionDigits = `${y1}${y2}`;
  } else {
    const singleMatch = sessionStr.match(/\d{4}/);
    if (singleMatch) {
      const y1 = singleMatch[0];
      const y2 = String((parseInt(y1.slice(-2), 10) + 1) % 100).padStart(2, "0");
      sessionDigits = `${y1}${y2}`;
    }
  }

  let query = supabaseAdmin
    .from("student_registrations")
    .select("id, candidate_name, registration_no, college_id, colleges(username, college_code, college_name)")
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

  // Sequence cache per prefix so multiple students in the same batch get sequential numbers
  const seqMap = new Map<string, number>();

  const getNextSeqForPrefix = async (pref: string) => {
    if (seqMap.has(pref)) {
      const next = seqMap.get(pref)! + 1;
      seqMap.set(pref, next);
      return next;
    }
    const { data: existing } = await supabaseAdmin
      .from("student_registrations")
      .select("roll_no")
      .like("roll_no", `${pref}%`)
      .order("roll_no", { ascending: false })
      .limit(1);

    let start = 1;
    if (existing && existing.length > 0 && existing[0].roll_no) {
      const lastSeqStr = existing[0].roll_no.slice(pref.length);
      const lastSeq = parseInt(lastSeqStr, 10);
      if (!isNaN(lastSeq)) {
        start = lastSeq + 1;
      }
    }
    seqMap.set(pref, start);
    return start;
  };

  const results = [];
  for (const student of eligibleStudents) {
    const college = student.colleges as unknown as { username?: string; college_code?: string } | null;
    const studentCode = college?.username ? college.username.toUpperCase() : (centerCode || "IPBI");
    const prefix = `${studentCode}${sessionDigits}`;

    const seq = await getNextSeqForPrefix(prefix);
    const rollNo = `${prefix}${String(seq).padStart(2, "0")}`;

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
  }

  return NextResponse.json({ allotted: results.length, results });
}
