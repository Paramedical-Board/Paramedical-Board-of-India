import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? verifyToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('student_registrations')
    .select('id, enrollment_no, candidate_name, course, status, created_at')
    .eq('college_id', session.college_id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }

  const applications = (data || []).map((app: any) => ({
    ...app,
    enrollment_no: app.enrollment_no || app.registration_no,
    registration_no: app.enrollment_no || app.registration_no,
  }));

  return NextResponse.json({ applications });
}
