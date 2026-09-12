import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await supabaseAdmin
    .from('student_registrations')
    .update({ status: 'rejected' })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: 'Failed to reject' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
