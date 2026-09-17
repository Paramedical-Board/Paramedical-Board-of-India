import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: inquiries, error } = await supabaseAdmin
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching inquiries:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const list = inquiries || [];

    const stats = {
      all: list.length,
      new: list.filter((i) => i.status === "new").length,
      in_progress: list.filter((i) => i.status === "in_progress").length,
      resolved: list.filter((i) => i.status === "resolved").length,
    };

    return NextResponse.json({
      inquiries: list,
      stats,
    });
  } catch (err) {
    console.error("Admin inquiries GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
