import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessionId = req.nextUrl.searchParams.get("session_id");
  const yearNumberParam = req.nextUrl.searchParams.get("year_number");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  const isSecondYear = yearNumberParam === "2";

  const selectFields = isSecondYear
    ? "id, candidate_name, father_name, dob, address, photo_url, enrollment_no, course, roll_no:roll_no_2nd_year, admit_card_generated_at:admit_card_2nd_year_generated_at, created_at, colleges(college_name)"
    : "id, candidate_name, father_name, dob, address, photo_url, enrollment_no, course, roll_no, admit_card_generated_at, created_at, colleges(college_name)";

  let query = supabaseAdmin
    .from("student_registrations")
    .select(selectFields)
    .eq(isSecondYear ? "exam_session_id_2nd_year" : "exam_session_id", sessionId)
    .not(isSecondYear ? "roll_no_2nd_year" : "roll_no", "is", null)
    .order(isSecondYear ? "roll_no_2nd_year" : "roll_no", { ascending: true });

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type SupabaseRegistrationRow = {
    id: string;
    candidate_name: string;
    father_name: string | null;
    dob: string | null;
    address: string | null;
    photo_url: string | null;
    enrollment_no: string | null;
    course: string;
    roll_no: string;
    admit_card_generated_at: string | null;
    created_at: string | null;
    colleges: { college_name: string } | null;
  };

  const students = ((data as unknown as SupabaseRegistrationRow[]) || []).map((r) => ({
    registration_id: r.id,
    candidate_name: r.candidate_name,
    father_name: r.father_name || "—",
    dob: r.dob || "",
    address: r.address || "",
    photo_url: r.photo_url || null,
    registration_no: r.enrollment_no || "—",
    course: r.course,
    college_name: r.colleges?.college_name || "—",
    roll_no: r.roll_no,
    admit_card_generated_at: r.admit_card_generated_at,
    updated_at: r.created_at,
  }));

  return NextResponse.json({ students });
}
