import { supabaseAdmin } from '@/lib/supabase';
import type { Announcement, PaginatedAnnouncements } from '@/lib/announcement-types';

const COLUMNS =
  'id, title_en, title_hi, description_en, description_hi, announcement_date, attachment_url, link_url, is_published, created_at, updated_at';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getLatestAnnouncements(limit = 4): Promise<Announcement[]> {
  const { data, error } = await supabaseAdmin
    .from('announcements')
    .select(COLUMNS)
    .eq('is_published', true)
    .order('announcement_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('getLatestAnnouncements error:', error);
    return [];
  }
  return (data ?? []) as Announcement[];
}

export async function getAnnouncementsPage(
  page = 1,
  pageSize = 10
): Promise<PaginatedAnnouncements> {
  const safePage = Math.max(1, Math.floor(page) || 1);
  const safeSize = Math.min(50, Math.max(1, Math.floor(pageSize) || 10));
  const from = (safePage - 1) * safeSize;
  const to = from + safeSize - 1;

  const { data, error, count } = await supabaseAdmin
    .from('announcements')
    .select(COLUMNS, { count: 'exact' })
    .eq('is_published', true)
    .order('announcement_date', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('getAnnouncementsPage error:', error);
    return { announcements: [], total: 0, page: safePage, pageSize: safeSize, totalPages: 1 };
  }

  const total = count ?? 0;
  return {
    announcements: (data ?? []) as Announcement[],
    total,
    page: safePage,
    pageSize: safeSize,
    totalPages: Math.max(1, Math.ceil(total / safeSize)),
  };
}

export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  if (!UUID_RE.test(id)) return null;

  const { data, error } = await supabaseAdmin
    .from('announcements')
    .select(COLUMNS)
    .eq('id', id)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    console.error('getAnnouncementById error:', error);
    return null;
  }
  return (data as Announcement | null) ?? null;
}
