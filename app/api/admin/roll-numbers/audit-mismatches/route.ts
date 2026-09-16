import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("student_registrations")
    .select(
      "id, enrollment_no, candidate_name, course, academic_session, roll_no, admit_card_generated_at, exam_session_id, exam_sessions(session_label, academic_session)"
    )
    .not("roll_no", "is", null)
    .not("exam_session_id", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type Row = {
    id: string;
    enrollment_no: string;
    registration_no?: string;
    candidate_name: string;
    course: string;
    academic_session: string;
    roll_no: string;
    admit_card_generated_at: string | null;
    exam_session_id: string;
    exam_sessions: { session_label: string; academic_session: string } | null;
  };

  const mismatches = (data as unknown as Row[])
    .filter((r) => r.exam_sessions && r.exam_sessions.academic_session !== r.academic_session)
    .map((r) => {
      const enr = r.enrollment_no || r.registration_no;
      return {
        id: r.id,
        enrollment_no: enr,
        registration_no: enr,
        candidate_name: r.candidate_name,
        course: r.course,
        student_academic_session: r.academic_session,
      roll_no: r.roll_no,
      session_label: r.exam_sessions!.session_label,
      session_academic_session: r.exam_sessions!.academic_session,
      has_admit_card: !!r.admit_card_generated_at,
    };
  });

  // Flag which of these mismatched students already have marks entered,
  // so the UI can warn before un-allotting.
  if (mismatches.length > 0) {
    const { data: marks } = await supabaseAdmin
      .from("student_subject_marks")
      .select("registration_id")
      .in("registration_id", mismatches.map((m) => m.id));

    const idsWithMarks = new Set((marks || []).map((m) => m.registration_id));
    for (const m of mismatches as (typeof mismatches[number] & { has_marks: boolean })[]) {
      m.has_marks = idsWithMarks.has(m.id);
    }
  }

  return NextResponse.json({ mismatches });
}
