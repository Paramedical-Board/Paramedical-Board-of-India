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
    .select('id, registration_no, candidate_name, course, created_at')
    .eq('college_id', session.college_id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch enrolled students' }, { status: 500 });
  }
  // De-duplicate by registration_no so 2nd Year records don't duplicate enrolled list
  const seenRegNos = new Set<string>();
  const uniqueStudents = [];
  for (const st of data || []) {
    if (st.registration_no) {
      if (seenRegNos.has(st.registration_no)) continue;
      seenRegNos.add(st.registration_no);
    }
    uniqueStudents.push(st);
  }

  return NextResponse.json({ students: uniqueStudents });
}
