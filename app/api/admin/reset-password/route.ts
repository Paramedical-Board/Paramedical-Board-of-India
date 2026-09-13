import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { consumePasswordResetToken } from '@/lib/password-reset';

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password required' }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const result = await consumePasswordResetToken(token);
    if (!result.valid || !result.adminId) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    const { error } = await supabaseAdmin
      .from('admins')
      .update({ password_hash: newHash })
      .eq('id', result.adminId);

    if (error) {
      console.error('Password update error:', error);
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset-password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
