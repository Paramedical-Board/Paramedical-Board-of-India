import jwt from 'jsonwebtoken';

export const COOKIE_NAME = 'college_session';

export interface CollegeTokenPayload {
  college_id: string;
  college_name: string;
}

export function signToken(payload: CollegeTokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1d' });
}

export function verifyToken(token: string): CollegeTokenPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as CollegeTokenPayload;
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE_NAME = 'admin_session';

export interface AdminTokenPayload {
  admin_id: string;
  username: string;
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1d' });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as AdminTokenPayload;
  } catch {
    return null;
  }
}
