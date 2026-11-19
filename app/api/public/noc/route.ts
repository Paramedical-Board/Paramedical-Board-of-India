import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getNocData } from "@/lib/noc-data";
import { normalizeDob } from "@/lib/normalize-dob";

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { enrollment_no, date_of_birth } = (body ?? {}) as Record<string, unknown>;

    if (typeof enrollment_no !== "string" || typeof date_of_birth !== "string") {
      return NextResponse.json(
        { error: "Enrollment Number and Date of Birth are both required" },
        { status: 400 }
      );
    }

    const enrollmentNo = enrollment_no.trim();
    const dob = normalizeDob(date_of_birth);

    if (!enrollmentNo || enrollmentNo.length > 40 || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      return NextResponse.json(
        { error: "Enrollment Number and Date of Birth are both required" },
        { status: 400 }
      );
    }

    const { data: reg, error: regError } = await supabaseAdmin
      .from("student_registrations")
      .select("id")
      .eq("enrollment_no", enrollmentNo)
      .eq("dob", dob)
      .maybeSingle();

    if (regError) {
      // Database/connection problem — don't report it to the student as "invalid details".
      console.error("NOC lookup DB error:", regError.message);
      return NextResponse.json(
        { error: "Service is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    if (!reg) {
      // Same message for "not found" and "wrong DOB" so enrollment numbers can't be probed.
      return NextResponse.json({ error: "Invalid enrollment number or date of birth" }, { status: 404 });
    }

    const { data, error } = await getNocData(reg.id);

    if (error || !data) {
      return NextResponse.json(
        { error: error || "NOC is not available yet. Please contact your college." },
        { status: 400 }
      );
    }

    return NextResponse.json({ noc: data });
  } catch (err) {
    console.error("NOC lookup error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 });
  }
}
