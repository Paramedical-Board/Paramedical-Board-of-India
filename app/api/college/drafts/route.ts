import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = token ? verifyToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { email, candidate_name, father_name } = body || {};

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!candidate_name || typeof candidate_name !== 'string' || !candidate_name.trim()) {
      return NextResponse.json({ error: 'Candidate name is required' }, { status: 400 });
    }
    if (!father_name || typeof father_name !== 'string' || !father_name.trim()) {
      return NextResponse.json({ error: "Father's name is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = candidate_name.trim();
    const cleanFather = father_name.trim();

    const { data: draft, error } = await supabaseAdmin
      .from('student_registration_drafts')
      .insert({
        college_id: session.college_id,
        email: cleanEmail,
        candidate_name: cleanName,
        father_name: cleanFather,
        status: 'verified',
        form_data: {
          candidate_name: cleanName,
          father_name: cleanFather,
          email: cleanEmail,
        },
      })
      .select()
      .single();

    if (error) {
      console.error('Create draft error:', error);
      return NextResponse.json({ error: 'Failed to create draft' }, { status: 500 });
    }

    return NextResponse.json({ success: true, draft }, { status: 201 });
  } catch (error) {
    console.error('Draft POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = token ? verifyToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: drafts, error } = await supabaseAdmin
      .from('student_registration_drafts')
      .select('*')
      .eq('college_id', session.college_id)
      .neq('status', 'submitted')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Fetch drafts error:', error);
      return NextResponse.json({ error: 'Failed to fetch drafts' }, { status: 500 });
    }

    return NextResponse.json({ drafts: drafts || [] });
  } catch (error) {
    console.error('Draft GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
