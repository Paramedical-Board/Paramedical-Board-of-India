import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { isCourseResultsReleased } from "@/lib/result-data";

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
    .from("student_registrations")
    .select("id, registration_no, candidate_name, roll_no")
    .eq("course", courseName)
    .eq("status", "approved")
    .not("admit_card_generated_at", "is", null)
    .order("roll_no", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const released = await isCourseResultsReleased(courseName);

  return NextResponse.json({ students: data, released });
}
