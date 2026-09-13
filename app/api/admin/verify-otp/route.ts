import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyOtp } from '@/lib/otp';
import { signAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, otp } = await request.json();

    if (!username || !otp) {
      return NextResponse.json({ error: 'Username and OTP required' }, { status: 400 });
    }

    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('id, username, email, is_active')
      .eq('username', username)
      .single();

    if (error || !admin || !admin.is_active || !admin.email) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 401 });
    }

    const result = await verifyOtp(admin.email, 'admin_login', otp);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const token = signAdminToken({ admin_id: admin.id, username: admin.username });

    const response = NextResponse.json({
      success: true,
      admin: { id: admin.id, username: admin.username },
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin verify-otp error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
