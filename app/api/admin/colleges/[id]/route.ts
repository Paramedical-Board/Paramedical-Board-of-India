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

  const updates: Record<string, string | boolean> = {};

  if (typeof body.is_active === "boolean") {
    updates.is_active = body.is_active;
  }
  if (typeof body.college_name === "string" && body.college_name.trim()) {
    updates.college_name = body.college_name.trim();
  }
  if (typeof body.college_code === "string" && body.college_code.trim()) {
    updates.college_code = body.college_code.trim();
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Provide at least one field to update (is_active, college_name, or college_code)" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("colleges")
    .update(updates)
    .eq("id", id)
    .select("id, college_name, username, college_code, is_active, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ college: data });
}
