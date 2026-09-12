import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { course_name } = body;

  if (!course_name) {
    return NextResponse.json({ error: "course_name is required" }, { status: 400 });
  }

  const { data: config, error: configError } = await supabaseAdmin
    .from("course_exam_config")
    .select("*, exam_centers(center_code)")
    .eq("course_name", course_name)
    .single();

  if (configError || !config) {
    return NextResponse.json(
      { error: "No exam config found for this course. Set session, exam year, and center first." },
      { status: 400 }
    );
  }

  const centerCode = config.exam_centers?.center_code;
  if (!centerCode) {
    return NextResponse.json({ error: "Assigned exam center has no center_code set" }, { status: 400 });
  }

  const yearMatch = config.exam_year_label.match(/\d{4}/);
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

  const { data: students, error: studentsError } = await supabaseAdmin
    .from("student_registrations")
    .select("id")
    .eq("course", course_name)
    .eq("status", "approved")
    .is("roll_no", null)
    .order("created_at", { ascending: true });

  if (studentsError) {
    return NextResponse.json({ error: studentsError.message }, { status: 500 });
  }

  if (students.length === 0) {
    return NextResponse.json({ allotted: 0, message: "No eligible students (approved, without roll_no) found for this course" });
  }

  const results = [];
  for (const student of students) {
    const rollNo = `${prefix}${String(nextSeq).padStart(4, "0")}`;
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("student_registrations")
      .update({ roll_no: rollNo })
      .eq("id", student.id)
      .select("id, roll_no")
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message, allotted: results.length, results }, { status: 500 });
    }

    results.push(updated);
    nextSeq++;
  }

  return NextResponse.json({ allotted: results.length, results });
}
