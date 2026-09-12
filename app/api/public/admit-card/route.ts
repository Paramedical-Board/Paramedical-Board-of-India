import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getAdmitCardData } from "@/lib/admit-card-data";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { registration_no, date_of_birth } = body;

  if (!registration_no || !date_of_birth) {
    return NextResponse.json(
      { error: "registration_no and date_of_birth are both required" },
      { status: 400 }
    );
  }

  const { data: reg, error: regError } = await supabaseAdmin
    .from("student_registrations")
    .select("id")
    .eq("registration_no", registration_no)
    .eq("dob", date_of_birth)
    .single();

  if (regError || !reg) {
    return NextResponse.json(
      { error: "Invalid registration number or date of birth" },
      { status: 404 }
    );
  }

  const { data, error } = await getAdmitCardData(reg.id);

  if (error || !data) {
    return NextResponse.json(
      { error: "Admit card is not available yet. Please contact your college." },
      { status: 400 }
    );
  }

  return NextResponse.json({ admitCard: data });
}
