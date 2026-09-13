import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { getResultData, upsertSubjectMarks } from "@/lib/result-data";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { registrationId } = await params;
  const { data, error } = await getResultData(registrationId);

  if (error || !data) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ result: data });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { registrationId } = await params;
  const body = await req.json();
  const { marks } = body;

  if (!Array.isArray(marks) || marks.length === 0) {
    return NextResponse.json(
      { error: "marks must be a non-empty array of {subject_id, theory_marks, practical_marks, ca_marks}" },
      { status: 400 }
    );
  }

  for (const m of marks) {
    if (
      !m.subject_id ||
      typeof m.theory_marks !== "number" ||
      typeof m.practical_marks !== "number" ||
      typeof m.ca_marks !== "number"
    ) {
      return NextResponse.json(
        { error: "Each mark entry needs subject_id, theory_marks, practical_marks, ca_marks (numbers)" },
        { status: 400 }
      );
    }
  }

  const { error: upsertError } = await upsertSubjectMarks(registrationId, marks);
  if (upsertError) {
    return NextResponse.json({ error: upsertError }, { status: 500 });
  }

  const { data, error } = await getResultData(registrationId);
  if (error || !data) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ result: data });
}
