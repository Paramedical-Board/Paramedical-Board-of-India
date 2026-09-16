import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { registration_id, year_number } = body;

  if (!registration_id) {
    return NextResponse.json({ error: "registration_id is required" }, { status: 400 });
  }

  const isYear2 = year_number === 2 || year_number === "2";

  const { data: existing, error: existingError } = await supabaseAdmin
    .from("student_registrations")
    .select("id, course, roll_no, roll_no_2nd_year")
    .eq("id", registration_id)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  const targetRollNo = isYear2 ? existing.roll_no_2nd_year : existing.roll_no;
  if (!targetRollNo) {
    return NextResponse.json({ error: "This student has no roll number to un-allot for this year" }, { status: 400 });
  }

  // Delete marks for the corresponding year
  if (isYear2) {
    const { data: yr2Subjects } = await supabaseAdmin
      .from("course_subjects")
      .select("id")
      .eq("course_name", existing.course)
      .eq("year_number", 2);

    if (yr2Subjects && yr2Subjects.length > 0) {
      await supabaseAdmin
        .from("student_subject_marks")
        .delete()
        .eq("registration_id", registration_id)
        .in("subject_id", yr2Subjects.map((s) => s.id));
    }
  } else {
    // 1st year marks
    const { data: yr1Subjects } = await supabaseAdmin
      .from("course_subjects")
      .select("id")
      .eq("course_name", existing.course)
      .eq("year_number", 1);

    if (yr1Subjects && yr1Subjects.length > 0) {
      await supabaseAdmin
        .from("student_subject_marks")
        .delete()
        .eq("registration_id", registration_id)
        .in("subject_id", yr1Subjects.map((s) => s.id));
    } else {
      await supabaseAdmin
        .from("student_subject_marks")
        .delete()
        .eq("registration_id", registration_id);
    }
  }

  const updateData = isYear2
    ? { roll_no_2nd_year: null, exam_session_id_2nd_year: null, admit_card_2nd_year_generated_at: null }
    : { roll_no: null, exam_session_id: null, admit_card_generated_at: null };

  const { data, error } = await supabaseAdmin
    .from("student_registrations")
    .update(updateData)
    .eq("id", registration_id)
    .select("id, registration_no, candidate_name, course")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, registration: data });
}
