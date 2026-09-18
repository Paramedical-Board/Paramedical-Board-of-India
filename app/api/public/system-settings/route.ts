import { NextResponse } from 'next/server';
import { getMaintenanceMode } from '@/lib/system-settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  const setting = await getMaintenanceMode();
  return NextResponse.json(
    {
      maintenance_mode: {
        enabled: setting.enabled,
        message: setting.message,
      },
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    }
  );
}
