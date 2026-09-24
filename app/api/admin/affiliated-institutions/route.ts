import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("affiliated_institutions")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ institutions: data });
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const center_code = (body.center_code || "").trim();
  const name = (body.name || "").trim();
  const hindi_name = (body.hindi_name || "").trim();
  const district = (body.district || "").trim();
  const state = (body.state || "").trim();
  const address = (body.address || "").trim();
  const affiliated_since = (body.affiliated_since || "").trim();
  const status = body.status === "Verified Center" ? "Verified Center" : "Active & Recognized";
  const approved_programs = Array.isArray(body.approved_programs) ? body.approved_programs : [];
  const contact_person = body.contact_person ? String(body.contact_person).trim() : null;
  const phone = body.phone ? String(body.phone).trim() : null;
  const display_order = Number.isFinite(Number(body.display_order)) ? Number(body.display_order) : 0;

  if (!center_code || !name || !hindi_name || !district || !state || !address || !affiliated_since) {
    return NextResponse.json(
      { error: "center_code, name, hindi_name, district, state, address, and affiliated_since are all required" },
      { status: 400 }
    );
  }
  if (approved_programs.length === 0) {
    return NextResponse.json(
      { error: "At least one approved program is required" },
      { status: 400 }
    );
  }

  const { data: existing } = await supabaseAdmin
    .from("affiliated_institutions")
    .select("id")
    .eq("center_code", center_code)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Center code already exists" }, { status: 409 });
  }

  const { data, error } = await supabaseAdmin
    .from("affiliated_institutions")
    .insert({
      center_code,
      name,
      hindi_name,
      district,
      state,
      address,
      affiliated_since,
      status,
      approved_programs,
      contact_person,
      phone,
      display_order,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ institution: data }, { status: 201 });
}
