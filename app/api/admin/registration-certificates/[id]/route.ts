import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { parseCertSuffix } from "@/lib/cert-number";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MIGRATION_HINT =
  "Database migration pending: run migrations/add_registration_certificate_columns.sql in Supabase SQL Editor.";

function isAdmin(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return !!token && !!verifyAdminToken(token);
}

/** Issue (or change the number of) the Registration Certificate + NOC for one student. */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!UUID_RE.test(id)) {
      return NextResponse.json({ error: "Invalid application id" }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const suffix = parseCertSuffix((body as Record<string, unknown> | null)?.suffix);
    if (!suffix) {
      return NextResponse.json(
        { error: "Enter a number of 1–30 characters using letters, digits and / _ . - only." },
        { status: 400 }
      );
    }

    const { data: reg, error: fetchError } = await supabaseAdmin
      .from("student_registrations")
      .select("status, reg_cert_issued_at")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      console.error("Registration certificate lookup error:", fetchError.message);
      const missing = /reg_cert/i.test(fetchError.message);
      return NextResponse.json({ error: missing ? MIGRATION_HINT : "Failed to load application" }, { status: 500 });
    }
    if (!reg) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    if (reg.status !== "approved") {
      return NextResponse.json(
        { error: "Only approved applications can be issued a registration certificate." },
        { status: 400 }
      );
    }

    // Keep the original issue date if the number is edited later.
    const issuedAt: string = reg.reg_cert_issued_at ?? new Date().toISOString();

    const { error: updateError } = await supabaseAdmin
      .from("student_registrations")
      .update({ reg_cert_suffix: suffix, reg_cert_issued_at: issuedAt })
      .eq("id", id);

    if (updateError) {
      if (updateError.code === "23505") {
        const { data: owner } = await supabaseAdmin
          .from("student_registrations")
          .select("candidate_name, enrollment_no")
          .ilike("reg_cert_suffix", suffix)
          .neq("id", id)
          .maybeSingle();

        const who = owner
          ? ` It belongs to ${owner.candidate_name}${owner.enrollment_no ? ` (${owner.enrollment_no})` : ""}.`
          : "";
        return NextResponse.json(
          { error: `This number is already used for another student.${who}` },
          { status: 409 }
        );
      }
      console.error("Registration certificate update error:", updateError.message);
      return NextResponse.json({ error: "Failed to save the number" }, { status: 500 });
    }

    return NextResponse.json({ success: true, suffix, issued_at: issuedAt });
  } catch (err) {
    console.error("Registration certificate PUT error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

/** Withdraw the certificate + NOC: the student can no longer download them. */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!UUID_RE.test(id)) {
      return NextResponse.json({ error: "Invalid application id" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("student_registrations")
      .update({ reg_cert_suffix: null, reg_cert_issued_at: null })
      .eq("id", id);

    if (error) {
      console.error("Registration certificate revoke error:", error.message);
      const missing = /reg_cert/i.test(error.message);
      return NextResponse.json({ error: missing ? MIGRATION_HINT : "Failed to withdraw" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Registration certificate DELETE error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
