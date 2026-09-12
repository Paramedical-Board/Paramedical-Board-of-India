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

  let query = supabaseAdmin.from("course_exam_config").select("*, exam_centers(*)");
  if (courseName) {
    query = query.eq("course_name", courseName);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ configs: data });
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
    .from("course_exam_config")
    .upsert(
      { course_name, session_label, exam_year_label, exam_center_id, updated_at: new Date().toISOString() },
      { onConflict: "course_name" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ config: data }, { status: 201 });
}
