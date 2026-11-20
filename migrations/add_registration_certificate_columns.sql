-- ============================================================
-- Registration Certificate & NOC: admin-controlled issuance
-- Run this once in the Supabase Dashboard -> SQL Editor.
--
-- A student can download the Registration Certificate and the NOC
-- only after an admin has set reg_cert_suffix for that student.
-- Certificate No. = 'IPBI/REG/' || reg_cert_suffix
-- NOC No.         = 'IPBI/NOC/' || reg_cert_suffix
-- ============================================================

ALTER TABLE student_registrations
  ADD COLUMN IF NOT EXISTS reg_cert_suffix text,
  ADD COLUMN IF NOT EXISTS reg_cert_issued_at timestamptz;

-- Each number can be used for one student only (case-insensitive).
CREATE UNIQUE INDEX IF NOT EXISTS uq_sr_reg_cert_suffix
  ON student_registrations (lower(reg_cert_suffix))
  WHERE reg_cert_suffix IS NOT NULL;
