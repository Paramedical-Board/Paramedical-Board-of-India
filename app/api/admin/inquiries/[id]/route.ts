import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.status) {
      updates.status = body.status;
    }
    if (body.admin_notes !== undefined) {
      updates.admin_notes = body.admin_notes;
    }

    const { data, error } = await supabaseAdmin
      .from("contact_inquiries")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating inquiry:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ inquiry: data });
  } catch (err) {
    console.error("Admin inquiries PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("contact_inquiries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting inquiry:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin inquiries DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
