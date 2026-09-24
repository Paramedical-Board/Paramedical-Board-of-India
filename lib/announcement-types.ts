export interface Announcement {
  id: string;
  title_en: string;
  title_hi: string | null;
  description_en: string | null;
  description_hi: string | null;
  announcement_date: string; // 'YYYY-MM-DD'
  attachment_url: string | null;
  attachment_file_id?: string | null; // only returned by admin endpoints
  link_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementInput {
  title_en: string;
  title_hi?: string | null;
  description_en?: string | null;
  description_hi?: string | null;
  announcement_date?: string;
  attachment_url?: string | null;
  attachment_file_id?: string | null;
  link_url?: string | null;
  is_published?: boolean;
}

export interface PaginatedAnnouncements {
  announcements: Announcement[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
