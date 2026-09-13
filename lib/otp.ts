import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { sendOtpEmail } from '@/lib/brevo';

const OTP_EXPIRY_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 5;

export type OtpPurpose = 'admin_login' | 'student_verification';

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

export async function requestOtp(
  email: string,
  purpose: OtpPurpose
): Promise<{ success: boolean; error?: string }> {
  const cooldownSince = new Date(Date.now() - RESEND_COOLDOWN_SECONDS * 1000).toISOString();
  const { data: recent } = await supabaseAdmin
    .from('otp_verifications')
    .select('id, created_at')
    .eq('email', email)
    .eq('purpose', purpose)
    .gte('created_at', cooldownSince)
    .order('created_at', { ascending: false })
    .limit(1);

  if (recent && recent.length > 0) {
    return { success: false, error: 'Please wait before requesting another OTP' };
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

  const { error } = await supabaseAdmin.from('otp_verifications').insert({
    email,
    otp_hash: otpHash,
    purpose,
    expires_at: expiresAt,
    verified: false,
    attempt_count: 0,
  });

  if (error) {
    console.error('OTP insert error:', error);
    return { success: false, error: 'Failed to generate OTP' };
  }

  try {
    await sendOtpEmail(email, otp, purpose);
  } catch (err) {
    console.error('OTP email send error:', err);
    return { success: false, error: 'Failed to send OTP email' };
  }

  return { success: true };
}

export async function verifyOtp(
  email: string,
  purpose: OtpPurpose,
  otpInput: string
): Promise<{ success: boolean; error?: string }> {
  const { data: rows, error } = await supabaseAdmin
    .from('otp_verifications')
    .select('id, otp_hash, expires_at, verified, attempt_count')
    .eq('email', email)
    .eq('purpose', purpose)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !rows || rows.length === 0) {
    return { success: false, error: 'No OTP request found, please request a new one' };
  }

  const record = rows[0];

  if (record.verified) {
    return { success: false, error: 'This OTP has already been used, please request a new one' };
  }

  if (new Date(record.expires_at) < new Date()) {
    return { success: false, error: 'OTP expired, please request a new one' };
  }

  if (record.attempt_count >= MAX_ATTEMPTS) {
    return { success: false, error: 'Too many attempts, please request a new OTP' };
  }

  const matches = await bcrypt.compare(otpInput, record.otp_hash);

  if (!matches) {
    await supabaseAdmin
      .from('otp_verifications')
      .update({ attempt_count: record.attempt_count + 1 })
      .eq('id', record.id);
    return { success: false, error: 'Incorrect OTP' };
  }

  await supabaseAdmin
    .from('otp_verifications')
    .update({ verified: true })
    .eq('id', record.id);

  return { success: true };
}

export async function isEmailVerified(
  email: string,
  purpose: OtpPurpose
): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('otp_verifications')
    .select('id')
    .eq('email', email)
    .eq('purpose', purpose)
    .eq('verified', true)
    .limit(1);

  return !!(data && data.length > 0);
}
