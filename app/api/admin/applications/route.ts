import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('student_registrations')
    .select('id, enrollment_no, candidate_name, course, status, created_at, college_id, colleges(college_name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch applications error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }

  // De-duplicate by enrollment_no so 2nd Year exam records don't show as duplicate applications
  const seenEnrNos = new Set<string>();
  const uniqueApplications = [];
  for (const app of (data as any) || []) {
    const enr = app.enrollment_no || app.registration_no;
    if (enr) {
      if (seenEnrNos.has(enr)) continue;
      seenEnrNos.add(enr);
    }
    uniqueApplications.push({
      ...app,
      enrollment_no: enr,
      registration_no: enr,
    });
  }

  return NextResponse.json({ applications: uniqueApplications });
}
