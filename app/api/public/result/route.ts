import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getResultData, isCourseResultsReleased } from "@/lib/result-data";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { roll_no, date_of_birth } = body;

  if (!roll_no || !date_of_birth) {
    return NextResponse.json(
      { error: "roll_no and date_of_birth are both required" },
      { status: 400 }
    );
  }

  const { data: reg, error: regError } = await supabaseAdmin
    .from("student_registrations")
    .select("id, course")
    .eq("roll_no", roll_no)
    .eq("dob", date_of_birth)
    .single();

  if (regError || !reg) {
    return NextResponse.json(
      { error: "Result not available. Please check your Roll Number and Date of Birth." },
      { status: 404 }
    );
  }

  const released = await isCourseResultsReleased(reg.course);
  if (!released) {
    return NextResponse.json(
      { error: "Result not available. Please check your Roll Number and Date of Birth." },
      { status: 400 }
    );
  }

  const { data, error } = await getResultData(reg.id);

  if (error || !data) {
    return NextResponse.json(
      { error: "Result not available. Please check your Roll Number and Date of Birth." },
      { status: 400 }
    );
  }

  return NextResponse.json({ result: data });
}
