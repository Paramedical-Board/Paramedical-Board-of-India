import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const admin = token ? verifyAdminToken(token) : null;
  if (!admin) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;
  const { field_name, message } = await request.json();

  if (!field_name || !message) {
    return NextResponse.json({ error: 'field_name and message are required' }, { status: 400 });
  }

  const { data: query, error: queryError } = await supabaseAdmin
    .from('registration_queries')
    .insert({ registration_id: id, admin_id: admin.admin_id, field_name, message })
    .select()
    .single();

  if (queryError) {
    console.error('Query insert error:', queryError);
    return NextResponse.json({ error: 'Failed to raise query' }, { status: 500 });
  }

  const { error: updateError } = await supabaseAdmin
    .from('student_registrations')
    .update({ status: 'query_raised' })
    .eq('id', id);

  if (updateError) {
    console.error('Status update error:', updateError);
    return NextResponse.json({ error: 'Query created but status update failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true, query });
}
