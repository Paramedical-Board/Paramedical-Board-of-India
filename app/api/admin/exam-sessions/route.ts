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

  const { data, error } = await supabaseAdmin
    .from("exam_sessions")
    .select("id, session_label, exam_year_label, exam_center_id, exam_centers(center_name, center_code)")
    .eq("course_name", courseName)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ sessions: data });
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { course_name, session_label, exam_year_label, exam_center_id, academic_session } = body;
  let centerId = exam_center_id;
  if (!centerId) {
    const { data: firstCenter } = await supabaseAdmin
      .from("exam_centers")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    centerId = firstCenter?.id ?? null;
  }

  if (!course_name || !session_label || !exam_year_label) {
    return NextResponse.json(
      { error: "course_name, session_label, and exam_year_label are required" },
      { status: 400 }
    );
  }

  const { data: existing } = await supabaseAdmin
    .from("exam_sessions")
    .select("id, session_label, exam_year_label, exam_center_id, academic_session")
    .eq("course_name", course_name)
    .eq("session_label", session_label)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ session: existing }, { status: 200 });
  }

  const insertPayload: Record<string, any> = {
    course_name,
    session_label,
    exam_year_label,
  };
  if (centerId) {
    insertPayload.exam_center_id = centerId;
  }
  if (academic_session) {
    insertPayload.academic_session = academic_session;
  }

  const { data, error } = await supabaseAdmin
    .from("exam_sessions")
    .insert(insertPayload)
    .select("id, session_label, exam_year_label, exam_center_id, academic_session")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data }, { status: 201 });
}
