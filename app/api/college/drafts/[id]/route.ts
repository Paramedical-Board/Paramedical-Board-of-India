import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { draftRegistrationSchema } from '@/lib/validations/registration';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = token ? verifyToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const { data: draft, error } = await supabaseAdmin
      .from('student_registration_drafts')
      .select('*')
      .eq('id', id)
      .eq('college_id', session.college_id)
      .single();

    if (error || !draft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }

    return NextResponse.json({ draft });
  } catch (error) {
    console.error('Fetch single draft error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = token ? verifyToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;

    // Check ownership
    const { data: existing, error: findError } = await supabaseAdmin
      .from('student_registration_drafts')
      .select('*')
      .eq('id', id)
      .eq('college_id', session.college_id)
      .single();

    if (findError || !existing) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }

    const body = await request.json();
    const parsed = draftRegistrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid draft data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const validData = parsed.data;
    const existingFormData = (existing.form_data && typeof existing.form_data === 'object')
      ? existing.form_data
      : {};

    // Deep merge education safely so partial edits don't wipe existing rows
    const mergedEducation = {
      ...(existingFormData.education || {}),
      ...(validData.education || {}),
    };

    const mergedFormData = {
      ...existingFormData,
      ...validData,
      education: mergedEducation,
    };

    const updatePayload: Record<string, any> = {
      form_data: mergedFormData,
      status: 'draft',
      updated_at: new Date().toISOString(),
    };

    if (validData.candidate_name && validData.candidate_name.trim()) {
      updatePayload.candidate_name = validData.candidate_name.trim();
    }
    if (validData.father_name && validData.father_name.trim()) {
      updatePayload.father_name = validData.father_name.trim();
    }
    if (validData.email && validData.email.trim()) {
      updatePayload.email = validData.email.trim().toLowerCase();
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('student_registration_drafts')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update draft error:', updateError);
      return NextResponse.json({ error: 'Failed to update draft' }, { status: 500 });
    }

    return NextResponse.json({ success: true, draft: updated });
  } catch (error) {
    console.error('Draft PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = token ? verifyToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership before deleting
    const { data: existing } = await supabaseAdmin
      .from('student_registration_drafts')
      .select('id')
      .eq('id', id)
      .eq('college_id', session.college_id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }

    const { error: deleteError } = await supabaseAdmin
      .from('student_registration_drafts')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete draft error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete draft' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('Draft DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
