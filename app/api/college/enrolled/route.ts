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
    .select('id, enrollment_no, candidate_name, course, created_at')
    .eq('college_id', session.college_id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch enrolled students' }, { status: 500 });
  }
  // De-duplicate by enrollment_no so 2nd Year records don't duplicate enrolled list
  const seenEnrNos = new Set<string>();
  const uniqueStudents = [];
  for (const st of (data as any) || []) {
    const enr = st.enrollment_no || st.registration_no;
    if (enr) {
      if (seenEnrNos.has(enr)) continue;
      seenEnrNos.add(enr);
    }
    uniqueStudents.push({
      ...st,
      enrollment_no: enr,
      registration_no: enr,
    });
  }

  return NextResponse.json({ students: uniqueStudents });
}
