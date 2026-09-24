import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export interface AdminSession {
  admin_id: string;
  username: string;
}

// Returns the admin session if the cookie is valid AND the admin is still active.
export async function requireAdmin(request: NextRequest): Promise<AdminSession | null> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyAdminToken(token) as { admin_id: string } | null;
  if (!payload?.admin_id) return null;

  const { data: admin } = await supabaseAdmin
    .from('admins')
    .select('id, username, is_active')
    .eq('id', payload.admin_id)
    .maybeSingle();

  if (!admin || !admin.is_active) return null;
  return { admin_id: admin.id, username: admin.username };
}
