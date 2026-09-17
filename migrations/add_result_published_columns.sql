-- Add nullable timestamps for 1st Year and 2nd Year single-student result publish
ALTER TABLE student_registrations
  ADD COLUMN IF NOT EXISTS result_published_at timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS result_published_2nd_year_at timestamptz DEFAULT NULL;
