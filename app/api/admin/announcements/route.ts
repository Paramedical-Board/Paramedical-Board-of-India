import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/adminAuth';
import { validateAnnouncementInput } from '@/lib/announcementValidation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('announcements')
    .select('*')
    .order('announcement_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Admin list announcements error:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
  return NextResponse.json({ announcements: data ?? [] });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const result = validateAnnouncementInput(body, false);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('announcements')
    .insert(result.data)
    .select()
    .single();

  if (error) {
    console.error('Admin create announcement error:', error);
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }

  revalidatePath('/');
  revalidatePath('/announcements');
  return NextResponse.json({ announcement: data }, { status: 201 });
}
