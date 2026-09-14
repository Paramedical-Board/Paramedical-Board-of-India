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
  const { course_name, session_label, exam_year_label, exam_center_id } = body;

  if (!course_name || !session_label || !exam_year_label || !exam_center_id) {
    return NextResponse.json(
      { error: "course_name, session_label, exam_year_label, and exam_center_id are all required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("exam_sessions")
    .insert({ course_name, session_label, exam_year_label, exam_center_id })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data }, { status: 201 });
}
