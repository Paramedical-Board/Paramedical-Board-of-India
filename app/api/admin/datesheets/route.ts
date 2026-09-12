import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courseName = req.nextUrl.searchParams.get("course_name");
  if (!courseName) {
    return NextResponse.json({ error: "course_name is required" }, { status: 400 });
  }

  const { data: subjectRows, error: subjectError } = await supabaseAdmin
    .from("course_subjects")
    .select("id, subject_name, subject_code")
    .eq("course_name", courseName)
    .order("created_at", { ascending: true });

  if (subjectError) {
    return NextResponse.json({ error: subjectError.message }, { status: 500 });
  }

  const subjectIds = subjectRows.map((s) => s.id);

  const { data: dateRows, error: dateError } = await supabaseAdmin
    .from("datesheets")
    .select("subject_id, exam_date, exam_time")
    .in("subject_id", subjectIds.length > 0 ? subjectIds : ["00000000-0000-0000-0000-000000000000"]);

  if (dateError) {
    return NextResponse.json({ error: dateError.message }, { status: 500 });
  }

  const dateMap = new Map(dateRows.map((d) => [d.subject_id, d]));

  const subjects = subjectRows.map((s) => ({
    id: s.id,
    subject_name: s.subject_name,
    subject_code: s.subject_code,
    exam_date: dateMap.get(s.id)?.exam_date ?? null,
    exam_time: dateMap.get(s.id)?.exam_time ?? null,
  }));

  const complete =
    subjects.length > 0 && subjects.every((s) => s.exam_date && s.exam_time);

  return NextResponse.json({ subjects, complete });
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { subject_id, exam_date, exam_time } = body;

  if (!subject_id || !exam_date || !exam_time) {
    return NextResponse.json(
      { error: "subject_id, exam_date, and exam_time are all required" },
      { status: 400 }
    );
  }

  const { data: subject, error: subjectError } = await supabaseAdmin
    .from("course_subjects")
    .select("course_name")
    .eq("id", subject_id)
    .single();

  if (subjectError || !subject) {
    return NextResponse.json({ error: "Invalid subject_id" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("datesheets")
    .upsert(
      { subject_id, course_name: subject.course_name, exam_date, exam_time },
      { onConflict: "subject_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ datesheet: data }, { status: 201 });
}
