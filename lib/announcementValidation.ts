import { isImageKitUrl } from '@/lib/announcementFiles';

type ValidationResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: string };

const fail = (error: string): ValidationResult => ({ ok: false, error });

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

const isEmpty = (v: unknown) => v === null || v === undefined || v === '';

const TEXT_FIELDS: ReadonlyArray<readonly [string, number]> = [
  ['title_en', 200],
  ['title_hi', 200],
  ['description_en', 1000],
  ['description_hi', 1000],
];

export function validateAnnouncementInput(body: unknown, partial: boolean): ValidationResult {
  if (!body || typeof body !== 'object') return fail('Invalid request body');
  const input = body as Record<string, unknown>;
  const data: Record<string, unknown> = {};

  for (const [key, max] of TEXT_FIELDS) {
    if (!(key in input)) continue;
    const raw = input[key];
    if (raw === null || raw === undefined) {
      data[key] = null;
      continue;
    }
    if (typeof raw !== 'string') return fail(`${key} must be text`);
    const text = raw.trim();
    if (text.length > max) return fail(`${key} must be at most ${max} characters`);
    data[key] = text === '' ? null : text;
  }

  if ((!partial || 'title_en' in input) && !data.title_en) {
    return fail('English title is required');
  }

  if ('announcement_date' in input && input.announcement_date) {
    const d = String(input.announcement_date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || Number.isNaN(Date.parse(d))) {
      return fail('Invalid date, use YYYY-MM-DD');
    }
    data.announcement_date = d;
  }

  // attachment_url and attachment_file_id always travel together
  const hasUrl = 'attachment_url' in input;
  const hasFileId = 'attachment_file_id' in input;
  if (hasUrl !== hasFileId) {
    return fail('attachment_url and attachment_file_id must be sent together');
  }
  if (hasUrl) {
    const rawUrl = input.attachment_url;
    const rawId = input.attachment_file_id;

    if (isEmpty(rawUrl) && isEmpty(rawId)) {
      data.attachment_url = null;
      data.attachment_file_id = null;
    } else if (isEmpty(rawUrl) || isEmpty(rawId)) {
      return fail('attachment_url and attachment_file_id must both be set or both be empty');
    } else {
      if (
        typeof rawUrl !== 'string' ||
        rawUrl.length > 2000 ||
        !isHttpUrl(rawUrl.trim()) ||
        !isImageKitUrl(rawUrl.trim())
      ) {
        return fail('attachment_url must be an uploaded PDF');
      }
      if (typeof rawId !== 'string' || !/^[A-Za-z0-9_-]{8,64}$/.test(rawId.trim())) {
        return fail('Invalid attachment_file_id');
      }
      data.attachment_url = rawUrl.trim();
      data.attachment_file_id = rawId.trim();
    }
  }

  if ('link_url' in input) {
    const raw = input.link_url;
    if (isEmpty(raw)) {
      data.link_url = null;
    } else {
      if (typeof raw !== 'string' || raw.length > 2000 || !isHttpUrl(raw.trim())) {
        return fail('link_url must be a valid http(s) URL');
      }
      data.link_url = raw.trim();
    }
  }

  if ('is_published' in input) {
    if (typeof input.is_published !== 'boolean') return fail('is_published must be true or false');
    data.is_published = input.is_published;
  }

  if (partial && Object.keys(data).length === 0) return fail('No fields to update');
  return { ok: true, data };
}
