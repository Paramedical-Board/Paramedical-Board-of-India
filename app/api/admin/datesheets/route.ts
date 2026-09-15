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
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!courseName || !sessionId) {
    return NextResponse.json({ error: "course_name and session_id are both required" }, { status: 400 });
  }

  // Determine year_number from session
  let yearNumber = 1;
  const { data: sessionData } = await supabaseAdmin
    .from("exam_sessions")
    .select("session_label, academic_session")
    .eq("id", sessionId)
    .maybeSingle();

  if (sessionData?.session_label?.includes("2nd Year")) {
    yearNumber = 2;
  }

  let { data: subjectRows, error: subjectError } = await supabaseAdmin
    .from("course_subjects")
    .select("id, subject_name, subject_code")
    .eq("course_name", courseName)
    .eq("year_number", yearNumber)
    .order("created_at", { ascending: true });

  // Fallback if year_number column not present
  if (subjectError && subjectError.message?.includes("year_number")) {
    const fallback = await supabaseAdmin
      .from("course_subjects")
      .select("id, subject_name, subject_code")
      .eq("course_name", courseName)
      .order("created_at", { ascending: true });

    subjectRows = fallback.data;
    subjectError = fallback.error;
  }

  if (subjectError) {
    return NextResponse.json({ error: subjectError.message }, { status: 500 });
  }

  const subjectIds = (subjectRows ?? []).map((s) => s.id);

  const { data: dateRows, error: dateError } = await supabaseAdmin
    .from("datesheets")
    .select("subject_id, exam_date, exam_time")
    .in("subject_id", subjectIds.length > 0 ? subjectIds : ["00000000-0000-0000-0000-000000000000"])
    .eq("exam_session_id", sessionId);

  if (dateError) {
    return NextResponse.json({ error: dateError.message }, { status: 500 });
  }

  const dateMap = new Map((dateRows ?? []).map((d) => [d.subject_id, d]));

  const subjects = (subjectRows ?? []).map((s) => ({
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

  // Bulk entries format: { exam_session_id, entries: [...] } or array
  if (Array.isArray(body.entries) || Array.isArray(body)) {
    const entries: Array<{ subject_id: string; exam_session_id?: string; exam_date: string; exam_time: string }> =
      Array.isArray(body.entries) ? body.entries : body;
    const defaultSessionId = body.exam_session_id;

    if (entries.length === 0) {
      return NextResponse.json({ error: "No datesheet entries provided" }, { status: 400 });
    }

    const validEntries = entries.filter((e) => {
      const sessId = e.exam_session_id || defaultSessionId;
      return e.subject_id && sessId && e.exam_date && e.exam_time;
    });

    if (validEntries.length === 0) {
      return NextResponse.json({ error: "No valid datesheet entries found to save" }, { status: 400 });
    }

    const subjectIds = Array.from(new Set(validEntries.map((e) => e.subject_id)));
    const { data: subjectRows, error: subjectError } = await supabaseAdmin
      .from("course_subjects")
      .select("id, course_name")
      .in("id", subjectIds);

    if (subjectError) {
      return NextResponse.json({ error: subjectError.message }, { status: 500 });
    }

    const subjectMap = new Map((subjectRows || []).map((s) => [s.id, s.course_name]));

    const upsertPayload = validEntries.map((e) => ({
      subject_id: e.subject_id,
      exam_session_id: e.exam_session_id || defaultSessionId,
      course_name: subjectMap.get(e.subject_id) || "",
      exam_date: e.exam_date,
      exam_time: e.exam_time,
    }));

    const { data, error } = await supabaseAdmin
      .from("datesheets")
      .upsert(upsertPayload, { onConflict: "subject_id,exam_session_id" })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ datesheets: data, count: data?.length || 0 }, { status: 200 });
  }

  // Single entry format
  const { subject_id, exam_session_id, exam_date, exam_time } = body;

  if (!subject_id || !exam_session_id || !exam_date || !exam_time) {
    return NextResponse.json(
      { error: "subject_id, exam_session_id, exam_date, and exam_time are all required" },
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
      { subject_id, exam_session_id, course_name: subject.course_name, exam_date, exam_time },
      { onConflict: "subject_id,exam_session_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ datesheet: data }, { status: 201 });
}
