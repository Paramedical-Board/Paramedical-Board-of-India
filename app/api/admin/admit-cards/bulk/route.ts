import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getAdmitCardData, AdmitCardData } from "@/lib/admit-card-data";

import { checkStudentFirstYearPassed } from "@/lib/result-data";
import { getBatchAcademicSessionFromSessionLabel } from "@/lib/course-session-utils";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courseName = req.nextUrl.searchParams.get("course_name");
  const academicSession = req.nextUrl.searchParams.get("academic_session");
  const sessionLabel = req.nextUrl.searchParams.get("session_label");
  const yearNumber = req.nextUrl.searchParams.get("year_number");
  if (!courseName) {
    return NextResponse.json({ error: "course_name is required" }, { status: 400 });
  }

  let query = supabaseAdmin
    .from("student_registrations")
    .select("id, registration_no, candidate_name")
    .eq("course", courseName)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (academicSession) {
    query = query.eq("academic_session", academicSession);
  } else if (sessionLabel) {
    const resolved = getBatchAcademicSessionFromSessionLabel(sessionLabel);
    if (resolved) {
      query = query.eq("academic_session", resolved);
    }
  }

  const { data: registrations, error: regError } = await query;

  if (regError) {
    return NextResponse.json({ error: regError.message }, { status: 500 });
  }

  if (!registrations || registrations.length === 0) {
    return NextResponse.json({ admitCards: [], skipped: [], message: "No approved students found for this course" });
  }

  const isSecondYear = sessionLabel?.includes("2nd Year") || yearNumber === "2";
  const admitCards: AdmitCardData[] = [];
  const skipped: { id: string; registration_no: string; candidate_name: string; reason: string }[] = [];

  for (const reg of registrations) {
    if (isSecondYear) {
      const check = await checkStudentFirstYearPassed(reg.id);
      if (!check.passed) {
        skipped.push({
          id: reg.id,
          registration_no: reg.registration_no,
          candidate_name: reg.candidate_name,
          reason: check.reason || "1st Year examination not cleared",
        });
        continue;
      }
    }

    const { data, error } = await getAdmitCardData(reg.id);
    if (error || !data) {
      skipped.push({
        id: reg.id,
        registration_no: reg.registration_no,
        candidate_name: reg.candidate_name,
        reason: error ?? "Unknown error",
      });
    } else {
      admitCards.push(data);
    }
  }

  return NextResponse.json({ admitCards, skipped });
}
