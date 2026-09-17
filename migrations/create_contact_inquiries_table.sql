-- Migration: Create contact_inquiries table for Contact Us form submissions

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'student', -- 'student' | 'affiliation' | 'verification' | 'general'
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  roll_no text,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new', -- 'new' | 'in_progress' | 'resolved'
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Fast search & filter indexes for Admin Dashboard
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_category ON contact_inquiries(category);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
