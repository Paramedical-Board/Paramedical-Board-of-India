import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { registrationSchema } from '@/lib/validations/registration';

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

  const enr = registration.enrollment_no || registration.registration_no;
  registration.enrollment_no = enr;
  registration.registration_no = enr;

  return NextResponse.json({ registration, queries: queries ?? [] });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;

  const body = await request.json();
  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Update fields WITHOUT touching status — stays whatever it currently is
  const { data, error } = await supabaseAdmin
    .from('student_registrations')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Admin update application error:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }

  return NextResponse.json({ success: true, registration: data });
}
