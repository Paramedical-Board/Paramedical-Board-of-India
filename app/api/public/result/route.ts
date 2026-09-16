import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getResultData, isCourseResultsReleased } from "@/lib/result-data";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { roll_no, date_of_birth, year } = body;

  if (!roll_no || !date_of_birth) {
    return NextResponse.json(
      { error: "Roll Number and Date of Birth are both required" },
      { status: 400 }
    );
  }

  const { data: regList, error: regError } = await supabaseAdmin
    .from("student_registrations")
    .select("id, course, roll_no, roll_no_2nd_year, exam_session_id, exam_session_id_2nd_year")
    .or(`roll_no.eq.${roll_no},roll_no_2nd_year.eq.${roll_no}`)
    .eq("dob", date_of_birth);

  if (regError || !regList || regList.length === 0) {
    return NextResponse.json(
      { error: "Result not available. Please check your Roll Number and Date of Birth." },
      { status: 404 }
    );
  }

  const reg = regList[0];

  // Determine year number from matched roll number or requested year
  let yrNum = 1;
  if (reg.roll_no_2nd_year && reg.roll_no_2nd_year.trim() === roll_no.trim()) {
    yrNum = 2;
  } else if (reg.roll_no && reg.roll_no.trim() === roll_no.trim()) {
    yrNum = 1;
  } else if (year && (year.includes("2") || year.toLowerCase().includes("2nd"))) {
    yrNum = 2;
  }

  const targetSessionId = yrNum === 2 ? (reg.exam_session_id_2nd_year || reg.exam_session_id) : reg.exam_session_id;

  const released = await isCourseResultsReleased(reg.course, targetSessionId ?? undefined);
  if (!released) {
    return NextResponse.json(
      { error: "Result for this course has not been published yet. Please check back later or contact your institution." },
      { status: 400 }
    );
  }

  const { data, error } = await getResultData(reg.id, yrNum);

  if (error || !data) {
    return NextResponse.json(
      { error: error || "Result not available. Please check your Roll Number and Date of Birth." },
      { status: 400 }
    );
  }

  return NextResponse.json({ result: data });
}
