import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { requestOtp } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const result = await requestOtp(email, 'student_verification');
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 429 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    console.error('Student send-otp error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
