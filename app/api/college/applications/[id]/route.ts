import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { registrationSchema } from '@/lib/validations/registration';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? verifyToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from('student_registrations')
    .select('*')
    .eq('id', id)
    .eq('college_id', session.college_id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }
  const enr = (data as any).enrollment_no || (data as any).registration_no;
  return NextResponse.json({
    registration: {
      ...data,
      enrollment_no: enr,
      registration_no: enr,
    },
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? verifyToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;

  // Ownership check first
  const { data: existing } = await supabaseAdmin
    .from('student_registrations')
    .select('id')
    .eq('id', id)
    .eq('college_id', session.college_id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  const body = await request.json();
  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('student_registrations')
    .update({ ...parsed.data, status: 'submitted' })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    console.error('Resubmit update error:', updateError);
    return NextResponse.json({ error: 'Failed to resubmit' }, { status: 500 });
  }

  // Mark any open queries on this registration as resolved
  await supabaseAdmin
    .from('registration_queries')
    .update({ status: 'resolved', resolved_at: new Date().toISOString() })
    .eq('registration_id', id)
    .eq('status', 'open');

  return NextResponse.json({ success: true, registration: updated });
}
