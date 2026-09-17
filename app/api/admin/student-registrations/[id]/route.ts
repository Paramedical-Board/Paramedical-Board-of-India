import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
  }

  const body = await request.json();
  const {
    candidate_name,
    father_name,
    dob,
    address,
    photo_url,
    roll_no,
    year_number,
  } = body;

  const updateData: Record<string, any> = {};

  if (candidate_name !== undefined) {
    if (typeof candidate_name !== "string" || candidate_name.trim().length < 2) {
      return NextResponse.json({ error: "Candidate name must be at least 2 characters" }, { status: 400 });
    }
    updateData.candidate_name = candidate_name.trim();
  }

  if (father_name !== undefined) {
    if (typeof father_name !== "string" || father_name.trim().length < 2) {
      return NextResponse.json({ error: "Father's name must be at least 2 characters" }, { status: 400 });
    }
    updateData.father_name = father_name.trim();
  }

  if (dob !== undefined) {
    if (typeof dob !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dob.trim())) {
      return NextResponse.json({ error: "Date of Birth must be in YYYY-MM-DD format" }, { status: 400 });
    }
    updateData.dob = dob.trim();
  }

  if (address !== undefined) {
    if (typeof address !== "string" || address.trim().length < 3) {
      return NextResponse.json({ error: "Address must be at least 3 characters" }, { status: 400 });
    }
    updateData.address = address.trim();
  }

  if (photo_url !== undefined) {
    if (typeof photo_url !== "string" || !photo_url.startsWith("http")) {
      return NextResponse.json({ error: "Valid photo URL is required" }, { status: 400 });
    }
    updateData.photo_url = photo_url.trim();
  }

  if (roll_no !== undefined) {
    const trimmedRoll = typeof roll_no === "string" ? roll_no.trim() : "";
    if (!trimmedRoll) {
      return NextResponse.json({ error: "Roll number cannot be empty" }, { status: 400 });
    }

    // Check uniqueness across both 1st year and 2nd year roll numbers (excluding self)
    const { data: duplicate, error: dupError } = await supabaseAdmin
      .from("student_registrations")
      .select("id, candidate_name")
      .neq("id", id)
      .or(`roll_no.eq.${trimmedRoll},roll_no_2nd_year.eq.${trimmedRoll}`)
      .maybeSingle();

    if (dupError) {
      return NextResponse.json({ error: dupError.message }, { status: 500 });
    }

    if (duplicate) {
      return NextResponse.json(
        { error: `Roll number ${trimmedRoll} is already assigned to ${duplicate.candidate_name}` },
        { status: 400 }
      );
    }

    const isYear2 = year_number === 2 || year_number === "2";
    if (isYear2) {
      updateData.roll_no_2nd_year = trimmedRoll;
    } else {
      updateData.roll_no = trimmedRoll;
    }
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No valid fields provided for update" }, { status: 400 });
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("student_registrations")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, student: updated });
}
