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
    .select("id, course, exam_session_id, exam_sessions(session_label, exam_year_label)")
    .eq("roll_no", roll_no)
    .eq("dob", date_of_birth);

  if (regError || !regList || regList.length === 0) {
    return NextResponse.json(
      { error: "Result not available. Please check your Roll Number and Date of Birth." },
      { status: 404 }
    );
  }

  let selectedReg = regList[0];
  if (year && regList.length > 1) {
    const matched = regList.find((r: any) => {
      const label = (r.exam_sessions?.session_label || "") + " " + (r.exam_sessions?.exam_year_label || "");
      if (year.includes("1") || year.toLowerCase().includes("1st")) {
        return label.includes("1st") || label.includes("1");
      }
      if (year.includes("2") || year.toLowerCase().includes("2nd")) {
        return label.includes("2nd") || label.includes("2");
      }
      return false;
    });
    if (matched) {
      selectedReg = matched;
    }
  } else if (year && regList.length === 1) {
    const r: any = regList[0];
    const label = (r.exam_sessions?.session_label || "") + " " + (r.exam_sessions?.exam_year_label || "");
    const isYear1 = year.includes("1") || year.toLowerCase().includes("1st");
    const isYear2 = year.includes("2") || year.toLowerCase().includes("2nd");

    if (r.exam_sessions) {
      if (isYear2 && label.includes("1st Year") && !label.includes("2nd Year")) {
        return NextResponse.json(
          { error: `Result for 2nd Year is not declared yet. Your record is for ${r.exam_sessions.session_label || "1st Year"}.` },
          { status: 400 }
        );
      }
      if (isYear1 && label.includes("2nd Year") && !label.includes("1st Year")) {
        return NextResponse.json(
          { error: `Result for 1st Year was not found for the active session (${r.exam_sessions.session_label || "2nd Year"}).` },
          { status: 400 }
        );
      }
    }
  }

  const released = await isCourseResultsReleased(selectedReg.course);
  if (!released) {
    return NextResponse.json(
      { error: "Result for this course has not been published yet. Please check back later or contact your institution." },
      { status: 400 }
    );
  }

  const { data, error } = await getResultData(selectedReg.id);

  if (error || !data) {
    return NextResponse.json(
      { error: error || "Result not available. Please check your Roll Number and Date of Birth." },
      { status: 400 }
    );
  }

  return NextResponse.json({ result: data });
}
