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
  const { session_label, exam_year_label, exam_center_id } = body;

  const updates: Record<string, string> = {};
  if (session_label) updates.session_label = session_label;
  if (exam_year_label) updates.exam_year_label = exam_year_label;
  if (exam_center_id) updates.exam_center_id = exam_center_id;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Provide at least one field to update" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("exam_sessions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data });
}
