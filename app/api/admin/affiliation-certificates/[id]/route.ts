import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import {
  parseAffilCertNo,
  parsePersonName,
  AFFIL_PREFIX,
  AFFIL_SUFFIX_MAX,
  PERSON_NAME_MAX,
} from "@/lib/cert-number";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MIGRATION_HINT =
  "Database migration pending: run migrations/add_affiliation_certificate_column.sql in Supabase SQL Editor.";

function isAdmin(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return !!token && !!verifyAdminToken(token);
}

/**
 * Issue (or change the number of) the Affiliation Certificate for one institution.
 * Optionally also sets the Director / Principal name printed on it (stored in contact_person);
 * omit `director_name` to leave it unchanged, send "" to clear it.
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!UUID_RE.test(id)) {
      return NextResponse.json({ error: "Invalid institution id" }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const fields = (body ?? {}) as Record<string, unknown>;
    // cert_no is the part after the fixed "IPBO-" prefix; the server always adds the prefix itself.
    const certNo = parseAffilCertNo(fields.cert_no);
    if (!certNo) {
      return NextResponse.json(
        {
          error: `Enter 1–${AFFIL_SUFFIX_MAX} characters after ${AFFIL_PREFIX} using letters, digits, spaces and / _ . - only.`,
        },
        { status: 400 }
      );
    }

    const hasDirector = "director_name" in fields;
    const directorName = hasDirector ? parsePersonName(fields.director_name) : null;
    if (hasDirector && directorName === null) {
      return NextResponse.json(
        {
          error: `Director / Principal name must start with a letter and be up to ${PERSON_NAME_MAX} characters (letters, spaces and . , ' ( ) / - only).`,
        },
        { status: 400 }
      );
    }

    const { data: inst, error: fetchError } = await supabaseAdmin
      .from("affiliated_institutions")
      .select("affiliation_cert_issued_at")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      console.error("Affiliation certificate lookup error:", fetchError.message);
      const missing = /affiliation_cert/i.test(fetchError.message);
      return NextResponse.json({ error: missing ? MIGRATION_HINT : "Failed to load institution" }, { status: 500 });
    }
    if (!inst) {
      return NextResponse.json({ error: "Institution not found" }, { status: 404 });
    }

    // Keep the original issue date if the number is edited later.
    const issuedAt: string = inst.affiliation_cert_issued_at ?? new Date().toISOString();

    const updates: Record<string, string | null> = {
      affiliation_cert_no: certNo,
      affiliation_cert_issued_at: issuedAt,
    };
    if (hasDirector) {
      updates.contact_person = directorName || null;
    }

    const { error: updateError } = await supabaseAdmin
      .from("affiliated_institutions")
      .update(updates)
      .eq("id", id);

    if (updateError) {
      if (updateError.code === "23505") {
        const { data: owner } = await supabaseAdmin
          .from("affiliated_institutions")
          .select("name")
          .ilike("affiliation_cert_no", certNo)
          .neq("id", id)
          .maybeSingle();

        const who = owner ? ` It belongs to ${owner.name}.` : "";
        return NextResponse.json(
          { error: `This number is already used for another institution.${who}` },
          { status: 409 }
        );
      }
      console.error("Affiliation certificate update error:", updateError.message);
      return NextResponse.json({ error: "Failed to save the number" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      cert_no: certNo,
      issued_at: issuedAt,
      ...(hasDirector ? { director_name: directorName || null } : {}),
    });
  } catch (err) {
    console.error("Affiliation certificate PUT error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

/** Withdraw the certificate: it can no longer be printed until re-issued. */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!UUID_RE.test(id)) {
      return NextResponse.json({ error: "Invalid institution id" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("affiliated_institutions")
      .update({ affiliation_cert_no: null, affiliation_cert_issued_at: null })
      .eq("id", id);

    if (error) {
      console.error("Affiliation certificate revoke error:", error.message);
      const missing = /affiliation_cert/i.test(error.message);
      return NextResponse.json({ error: missing ? MIGRATION_HINT : "Failed to withdraw" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Affiliation certificate DELETE error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
