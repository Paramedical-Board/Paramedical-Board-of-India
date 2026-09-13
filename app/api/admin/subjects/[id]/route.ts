import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { subject_name, subject_code, theory_max, practical_max, ca_max } = body;

  const updates: Record<string, string | number | null> = {};
  if (subject_name) updates.subject_name = subject_name;
  if (subject_code) updates.subject_code = subject_code;
  if (theory_max !== undefined) updates.theory_max = theory_max;
  if (practical_max !== undefined) updates.practical_max = practical_max;
  if (ca_max !== undefined) updates.ca_max = ca_max;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Provide at least one field to update" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("course_subjects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ subject: data });
}
