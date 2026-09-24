import { NextRequest, NextResponse } from 'next/server';
import { getLatestAnnouncements, getAnnouncementsPage } from '@/lib/announcements';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const limitParam = searchParams.get('limit');
  if (limitParam) {
    const limit = Math.min(20, Math.max(1, parseInt(limitParam, 10) || 4));
    const announcements = await getLatestAnnouncements(limit);
    return NextResponse.json({ announcements });
  }

  const page = parseInt(searchParams.get('page') || '1', 10) || 1;
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10) || 10;
  return NextResponse.json(await getAnnouncementsPage(page, pageSize));
}
