import { NextRequest, NextResponse } from "next/server";
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
    .from("courses")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ courses: data });
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const code = (body.code || "").trim();
  const title = (body.title || "").trim();
  const hindi_title = (body.hindi_title || "").trim();
  const course_type = (body.course_type || "").trim();
  const category = body.category ? String(body.category).trim() : null;
  const duration_display = (body.duration_display || "").trim();
  const is_two_year = body.is_two_year === true || body.is_two_year === "true";
  const eligibility = body.eligibility ? String(body.eligibility).trim() : null;
  const mode = body.mode ? String(body.mode).trim() : null;
  const description = body.description ? String(body.description).trim() : null;
  const career_scope = Array.isArray(body.career_scope) ? body.career_scope : [];
  const is_featured = body.is_featured === true || body.is_featured === "true";
  const display_order = Number.isFinite(Number(body.display_order)) ? Number(body.display_order) : 0;
  const is_active = body.is_active === false || body.is_active === "false" ? false : true;

  if (!code || !title || !hindi_title || !course_type || !duration_display) {
    return NextResponse.json(
      { error: "code, title, hindi_title, course_type, and duration_display are all required" },
      { status: 400 }
    );
  }

  if (course_type !== "diploma" && course_type !== "certificate") {
    return NextResponse.json(
      { error: "course_type must be 'diploma' or 'certificate'" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("courses")
    .insert({
      code,
      title,
      hindi_title,
      course_type,
      category,
      duration_display,
      is_two_year,
      eligibility,
      mode,
      description,
      career_scope,
      is_featured,
      display_order,
      is_active,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ course: data }, { status: 201 });
}
