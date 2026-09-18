import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { getMaintenanceMode, setMaintenanceMode } from '@/lib/system-settings';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const setting = await getMaintenanceMode();
  return NextResponse.json({ maintenance_mode: setting });
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { enabled, message } = body;

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid payload: "enabled" must be boolean' },
        { status: 400 }
      );
    }

    const updated = await setMaintenanceMode(enabled, message, admin.username);
    return NextResponse.json({ success: true, maintenance_mode: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
