-- Migration: Add student_registration_drafts table for persisting college-side registration drafts

CREATE TABLE IF NOT EXISTS student_registration_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  email text NOT NULL,
  candidate_name text NOT NULL,
  father_name text NOT NULL,
  form_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'verified', -- 'verified' | 'draft' | 'submitted'
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_drafts_college_id ON student_registration_drafts(college_id);
CREATE INDEX IF NOT EXISTS idx_drafts_college_status ON student_registration_drafts(college_id, status);
