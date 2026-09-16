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
    .from('registration_queries')
    .select('*, student_registrations!inner(college_id, enrollment_no, candidate_name)')
    .eq('student_registrations.college_id', session.college_id)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }

  const notifications = (data || []).map((notif: any) => {
    const student = notif.student_registrations;
    const enr = student?.enrollment_no || student?.registration_no;
    return {
      ...notif,
      student_registrations: student ? {
        ...student,
        enrollment_no: enr,
        registration_no: enr,
      } : student,
    };
  });

  return NextResponse.json({ notifications });
}
