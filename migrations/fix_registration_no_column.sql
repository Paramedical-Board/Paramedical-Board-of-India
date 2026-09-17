-- ============================================================
-- Fix: record "new" has no field "registration_no"
-- Run this SQL in your Supabase Dashboard SQL Editor
-- ============================================================

-- 1. Add registration_no column so all triggers and references work
ALTER TABLE student_registrations 
  ADD COLUMN IF NOT EXISTS registration_no text;

-- 2. Populate existing records
UPDATE student_registrations 
SET registration_no = enrollment_no 
WHERE registration_no IS NULL;

-- 3. Keep enrollment_no and registration_no in sync automatically
CREATE OR REPLACE FUNCTION sync_enrollment_and_registration_no()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.enrollment_no IS NOT NULL AND (NEW.registration_no IS NULL OR NEW.registration_no = '') THEN
    NEW.registration_no := NEW.enrollment_no;
  ELSIF NEW.registration_no IS NOT NULL AND (NEW.enrollment_no IS NULL OR NEW.enrollment_no = '') THEN
    NEW.enrollment_no := NEW.registration_no;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_enrollment_registration_no ON student_registrations;
CREATE TRIGGER trg_sync_enrollment_registration_no
BEFORE INSERT OR UPDATE ON student_registrations
FOR EACH ROW
EXECUTE FUNCTION sync_enrollment_and_registration_no();
