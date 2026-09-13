import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createPasswordResetToken } from '@/lib/password-reset';
import { sendBrevoEmail } from '@/lib/brevo';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    const genericResponse = NextResponse.json({
      success: true,
      message: 'If that account exists, a reset link has been sent to its registered email.',
    });

    const { data: admin } = await supabaseAdmin
      .from('admins')
      .select('id, email, is_active')
      .eq('username', username)
      .single();

    if (!admin || !admin.is_active || !admin.email) {
      return genericResponse;
    }

    const token = await createPasswordResetToken(admin.id);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://www.indianparamedicalboardofindia.com'
        : 'http://localhost:3000');
    const resetUrl = `${siteUrl}/admin/reset-password?token=${token}`;

    await sendBrevoEmail({
      to: admin.email,
      subject: 'Password Reset - INDIAN PARAMEDICAL BOARD OF INDIA',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 8px;">
          <h2 style="color: #1a1a1a;">INDIAN PARAMEDICAL BOARD OF INDIA</h2>
          <p style="color: #333;">A password reset was requested for your admin account.</p>
          <p style="margin: 20px 0;">
            <a href="${resetUrl}" style="background: #0a58ca; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a>
          </p>
          <p style="color: #555; font-size: 14px;">This link expires in 30 minutes. If you did not request this, ignore this email.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e5e5;" />
          <p style="color: #555;">आपके एडमिन अकाउंट के लिए पासवर्ड रीसेट अनुरोध किया गया था। यह लिंक 30 मिनट में समाप्त हो जाएगा। अगर आपने यह अनुरोध नहीं किया, तो इस ईमेल को अनदेखा करें।</p>
        </div>
      `,
    });

    return genericResponse;
  } catch (error) {
    console.error('Forgot-password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
