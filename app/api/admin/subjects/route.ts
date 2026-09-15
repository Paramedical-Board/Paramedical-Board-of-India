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
  const yearNumberParam = req.nextUrl.searchParams.get("year_number");
  const yearNumber = yearNumberParam ? parseInt(yearNumberParam, 10) : 1;

  if (!courseName) {
    return NextResponse.json({ error: "course_name is required" }, { status: 400 });
  }

  let query = supabaseAdmin
    .from("course_subjects")
    .select("*")
    .eq("course_name", courseName);

  if (yearNumber) {
    query = query.eq("year_number", yearNumber);
  }

  let { data, error } = await query.order("created_at", { ascending: true });

  // Fallback if year_number column has not been added to DB yet
  if (error && error.message?.includes("year_number")) {
    const fallback = await supabaseAdmin
      .from("course_subjects")
      .select("*")
      .eq("course_name", courseName)
      .order("created_at", { ascending: true });

    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ subjects: data });
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { course_name, subject_name, subject_code, theory_max, practical_max, ca_max, year_number } = body;

  if (!course_name || !subject_name || !subject_code) {
    return NextResponse.json(
      { error: "course_name, subject_name, and subject_code are all required" },
      { status: 400 }
    );
  }

  const insertPayload: Record<string, any> = {
    course_name,
    subject_name,
    subject_code,
    theory_max: theory_max ?? null,
    practical_max: practical_max ?? null,
    ca_max: ca_max ?? null,
    year_number: Number(year_number) || 1,
  };

  let { data, error } = await supabaseAdmin
    .from("course_subjects")
    .insert(insertPayload)
    .select()
    .single();

  // Fallback if year_number column not yet migrated
  if (error && error.message?.includes("year_number")) {
    delete insertPayload.year_number;
    const fallback = await supabaseAdmin
      .from("course_subjects")
      .insert(insertPayload)
      .select()
      .single();

    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ subject: data }, { status: 201 });
}
