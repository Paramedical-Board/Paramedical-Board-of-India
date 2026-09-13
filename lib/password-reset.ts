import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

const TOKEN_EXPIRY_MINUTES = 30;

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function createPasswordResetToken(adminId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000).toISOString();

  await supabaseAdmin.from('admin_password_reset_tokens').insert({
    admin_id: adminId,
    token_hash: tokenHash,
    expires_at: expiresAt,
    used: false,
  });

  return token;
}

export async function consumePasswordResetToken(
  token: string
): Promise<{ valid: boolean; adminId?: string; error?: string }> {
  const tokenHash = hashToken(token);

  const { data: rows, error } = await supabaseAdmin
    .from('admin_password_reset_tokens')
    .select('id, admin_id, expires_at, used')
    .eq('token_hash', tokenHash)
    .limit(1);

  if (error || !rows || rows.length === 0) {
    return { valid: false, error: 'Invalid or expired reset link' };
  }

  const record = rows[0];

  if (record.used) {
    return { valid: false, error: 'This reset link has already been used' };
  }

  if (new Date(record.expires_at) < new Date()) {
    return { valid: false, error: 'This reset link has expired' };
  }

  await supabaseAdmin
    .from('admin_password_reset_tokens')
    .update({ used: true })
    .eq('id', record.id);

  return { valid: true, adminId: record.admin_id };
}
