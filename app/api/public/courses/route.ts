import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/public/courses
 * Public endpoint — returns all active courses ordered by display_order.
 * Used by CourseSelectorDropdown and college registration form.
 * No auth required (public data).
 */
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("id, code, title, course_type, is_two_year, display_order")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ courses: data || [] });
}
