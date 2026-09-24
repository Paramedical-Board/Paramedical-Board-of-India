import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/adminAuth';
import { validateAnnouncementInput } from '@/lib/announcementValidation';
import { deleteAnnouncementPdf } from '@/lib/announcementFiles';

export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Ctx = { params: Promise<{ id: string }> };

function revalidateAll(id: string) {
  revalidatePath('/');
  revalidatePath('/announcements');
  revalidatePath(`/announcements/${id}`);
}

// Best-effort: a failed cleanup must never fail the request itself
async function removeFromImageKit(fileId: string | null | undefined) {
  if (!fileId) return;
  try {
    await deleteAnnouncementPdf(fileId);
  } catch (e) {
    console.error('Failed to remove attachment from ImageKit:', e);
  }
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const result = validateAnnouncementInput(body, true);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  // If the attachment is being changed/removed, remember the old file for cleanup
  let oldFileId: string | null = null;
  if ('attachment_file_id' in result.data) {
    const { data: existing } = await supabaseAdmin
      .from('announcements')
      .select('attachment_file_id')
      .eq('id', id)
      .maybeSingle();
    oldFileId = existing?.attachment_file_id ?? null;
  }

  const { data, error } = await supabaseAdmin
    .from('announcements')
    .update(result.data)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Admin update announcement error:', error);
    return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });

  if (oldFileId && oldFileId !== data.attachment_file_id) {
    await removeFromImageKit(oldFileId);
  }

  revalidateAll(id);
  return NextResponse.json({ announcement: data });
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { id } = await params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const { data: existing } = await supabaseAdmin
    .from('announcements')
    .select('id, attachment_file_id')
    .eq('id', id)
    .maybeSingle();

  if (!existing) return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });

  const { error } = await supabaseAdmin.from('announcements').delete().eq('id', id);
  if (error) {
    console.error('Admin delete announcement error:', error);
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
  }

  await removeFromImageKit(existing.attachment_file_id);

  revalidateAll(id);
  return NextResponse.json({ success: true });
}
