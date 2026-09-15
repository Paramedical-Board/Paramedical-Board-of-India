import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { registrationSchema } from '@/lib/validations/registration';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { isEmailVerified } from '@/lib/otp';

function extractSessionDigits(academicSession: string): string {
  const matches = academicSession.match(/\d{4}/g);
  if (matches && matches.length >= 2) {
    return matches[0].slice(-2) + matches[1].slice(-2);
  } else if (matches && matches.length === 1) {
    const y1 = parseInt(matches[0].slice(-2), 10);
    const y2 = (y1 + 1) % 100;
    return `${matches[0].slice(-2)}${String(y2).padStart(2, '0')}`;
  }
  return '2324';
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const session = verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const normalizedEmail = parsed.data.email.trim().toLowerCase();
    const emailVerified = await isEmailVerified(normalizedEmail, 'student_verification');
    if (!emailVerified) {
      return NextResponse.json(
        { error: 'Email not verified, please complete OTP verification first' },
        { status: 403 }
      );
    }

    // Lookup college_code for formatted registration_no
    const { data: college } = await supabaseAdmin
      .from('colleges')
      .select('college_code')
      .eq('id', session.college_id)
      .single();

    const collegeCode = college?.college_code ? String(college.college_code).padStart(2, '0') : '01';
    const sessDigits = extractSessionDigits(parsed.data.academic_session);
    const prefix = `IPMB${collegeCode}${sessDigits}`;

    // Get next sequence for this college and session
    const { data: latestReg } = await supabaseAdmin
      .from('student_registrations')
      .select('registration_no')
      .like('registration_no', `${prefix}%`)
      .order('registration_no', { ascending: false })
      .limit(1);

    let nextSeq = 1;
    if (latestReg && latestReg.length > 0 && latestReg[0].registration_no) {
      const lastSeqStr = latestReg[0].registration_no.slice(prefix.length);
      const parsedSeq = parseInt(lastSeqStr, 10);
      if (!isNaN(parsedSeq)) {
        nextSeq = parsedSeq + 1;
      }
    }

    const registration_no = `${prefix}${String(nextSeq).padStart(2, '0')}`;

    const { data, error } = await supabaseAdmin
      .from('student_registrations')
      .insert({
        ...parsed.data,
        email: normalizedEmail,
        college_id: session.college_id,
        registration_no,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Database insert failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, registration: data });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
