import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getResultData } from "@/lib/result-data";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> }
) {
  const cookieStore = await cookies();
  const token =
    cookieStore.get(ADMIN_COOKIE_NAME)?.value ||
    cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { registrationId } = await params;

  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    // Body is optional; defaults to year 1
  }

  const year = body?.year === 2 || body?.year === "2" ? 2 : 1;

  // 1. Look up student registration
  const { data: reg, error: regError } = await supabaseAdmin
    .from("student_registrations")
    .select("id, course, exam_session_id, exam_session_id_2nd_year, status")
    .eq("id", registrationId)
    .single();

  if (regError || !reg) {
    return NextResponse.json(
      { error: "Student registration not found." },
      { status: 404 }
    );
  }

  if (year === 2 && !reg.exam_session_id_2nd_year) {
    return NextResponse.json(
      { error: "Student is not enrolled in a 2nd Year exam session." },
      { status: 400 }
    );
  }

  // 2. Call getResultData and confirm data.final_result !== "INCOMPLETE"
  const { data: resultData, error: resultError } = await getResultData(
    registrationId,
    year
  );

  if (resultError || !resultData) {
    return NextResponse.json(
      { error: resultError || "Unable to retrieve student marks for publishing." },
      { status: 400 }
    );
  }

  if (resultData.final_result === "INCOMPLETE") {
    return NextResponse.json(
      {
        error:
          "Cannot publish result: Subject marks are incomplete. Please enter and save marks for all subjects before publishing.",
      },
      { status: 400 }
    );
  }

  // 3. Update student_registrations
  const now = new Date().toISOString();
  const updatePayload =
    year === 2
      ? { result_published_2nd_year_at: now }
      : { result_published_at: now };

  const { error: updateError } = await supabaseAdmin
    .from("student_registrations")
    .update(updatePayload)
    .eq("id", registrationId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    published_at: now,
    year,
    message: `Result for Year ${year} published successfully!`,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> }
) {
  const cookieStore = await cookies();
  const token =
    cookieStore.get(ADMIN_COOKIE_NAME)?.value ||
    cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { registrationId } = await params;

  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    // If query param year is passed
  }

  const yearParam = req.nextUrl.searchParams.get("year");
  const year =
    body?.year === 2 || body?.year === "2" || yearParam === "2" ? 2 : 1;

  const updatePayload =
    year === 2
      ? { result_published_2nd_year_at: null }
      : { result_published_at: null };

  const { error: updateError } = await supabaseAdmin
    .from("student_registrations")
    .update(updatePayload)
    .eq("id", registrationId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    unpublish: true,
    year,
    message: `Result for Year ${year} unpublished successfully.`,
  });
}
