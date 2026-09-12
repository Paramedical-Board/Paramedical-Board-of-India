import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;

  const { data: registration, error } = await supabaseAdmin
    .from('student_registrations')
    .select('*, colleges(college_name)')
    .eq('id', id)
    .single();

  if (error || !registration) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  // Auto-mark as under_review the first time an admin opens it
  if (registration.status === 'submitted') {
    await supabaseAdmin
      .from('student_registrations')
      .update({ status: 'under_review' })
      .eq('id', id);
    registration.status = 'under_review';
  }

  const { data: queries } = await supabaseAdmin
    .from('registration_queries')
    .select('*')
    .eq('registration_id', id)
    .order('created_at', { ascending: false });

  return NextResponse.json({ registration, queries: queries ?? [] });
}
