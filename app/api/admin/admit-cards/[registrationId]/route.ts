import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { getAdmitCardData } from "@/lib/admit-card-data";

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
  const { data, error } = await getAdmitCardData(registrationId);

  if (error || !data) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ admitCard: data });
}
