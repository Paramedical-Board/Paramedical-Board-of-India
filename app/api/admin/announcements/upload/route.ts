import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { uploadAnnouncementPdf } from '@/lib/announcementFiles';

export const dynamic = 'force-dynamic';

const MAX_BYTES = 1 * 1024 * 1024; // 1 MB

function safeFileName(original: string): string {
  const base = original
    .replace(/\.pdf$/i, '')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return `${base || 'notice'}.pdf`;
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File must be 1 MB or smaller' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Check the real file signature, not just the declared MIME type
  if (buffer.subarray(0, 5).toString('latin1') !== '%PDF-') {
    return NextResponse.json({ error: 'File is not a valid PDF' }, { status: 400 });
  }

  try {
    const { url, fileId } = await uploadAnnouncementPdf(buffer, safeFileName(file.name));
    return NextResponse.json({ url, fileId, originalName: file.name }, { status: 201 });
  } catch (err) {
    console.error('Announcement PDF upload error:', err);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
