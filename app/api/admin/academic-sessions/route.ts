import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { DEFAULT_BASE_SESSIONS } from "@/lib/course-session-utils";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("system_settings")
      .select("value")
      .eq("key", "academic_sessions")
      .maybeSingle();

    if (error) {
      console.warn("Could not query academic_sessions from system_settings:", error.message);
      return NextResponse.json({ customSessions: [] });
    }

    const sessions: string[] = Array.isArray(data?.value?.sessions)
      ? data.value.sessions
      : [];

    return NextResponse.json({ customSessions: sessions });
  } catch (err: any) {
    console.error("GET /api/admin/academic-sessions error:", err);
    return NextResponse.json({ customSessions: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const rawSession = (body.session || "").trim();

    if (!rawSession) {
      return NextResponse.json(
        { error: "Session label is required (e.g. 2027-2028)" },
        { status: 400 }
      );
    }

    // Format validation: Accept YYYY-YYYY (e.g. 2027-2028)
    const sessionRegex = /^\d{4}-\d{4}$/;
    if (!sessionRegex.test(rawSession)) {
      return NextResponse.json(
        { error: "Please enter session in 'YYYY-YYYY' format (e.g. 2027-2028)" },
        { status: 400 }
      );
    }

    // Get current custom sessions
    const { data: existingData } = await supabaseAdmin
      .from("system_settings")
      .select("value")
      .eq("key", "academic_sessions")
      .maybeSingle();

    const currentSessions: string[] = Array.isArray(existingData?.value?.sessions)
      ? existingData.value.sessions
      : [];

    let updatedSessions = [...currentSessions];
    if (!updatedSessions.includes(rawSession) && !DEFAULT_BASE_SESSIONS.includes(rawSession)) {
      updatedSessions.push(rawSession);
    }

    // Save back to system_settings
    const { error: upsertError } = await supabaseAdmin
      .from("system_settings")
      .upsert(
        {
          key: "academic_sessions",
          value: { sessions: updatedSessions },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

    if (upsertError) {
      console.error("Failed to upsert academic_sessions:", upsertError.message);
      return NextResponse.json(
        { error: `Database error: ${upsertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      session: rawSession,
      customSessions: updatedSessions,
    });
  } catch (err: any) {
    console.error("POST /api/admin/academic-sessions error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to add academic session" },
      { status: 500 }
    );
  }
}
