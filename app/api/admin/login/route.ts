import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { requestOtp } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('id, username, password_hash, is_active, email')
      .eq('username', username)
      .single();

    if (error || !admin || !admin.is_active) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(password, admin.password_hash);
    if (!passwordMatches) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!admin.email) {
      return NextResponse.json(
        { error: 'No email configured for this admin account, contact system owner' },
        { status: 500 }
      );
    }

    const otpResult = await requestOtp(admin.email, 'admin_login');
    if (!otpResult.success) {
      return NextResponse.json({ error: otpResult.error }, { status: 429 });
    }

    return NextResponse.json({
      success: true,
      otpRequired: true,
      message: 'OTP sent to registered email',
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
