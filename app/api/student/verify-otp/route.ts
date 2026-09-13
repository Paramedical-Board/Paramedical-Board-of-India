import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { verifyOtp } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { email, otp } = await request.json();
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP required' }, { status: 400 });
    }

    const result = await verifyOtp(email, 'student_verification', otp);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json({ success: true, verified: true });
  } catch (error) {
    console.error('Student verify-otp error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
