-- ============================================================
-- Affiliation Certificate: admin-controlled certificate number
-- Run this once in the Supabase Dashboard -> SQL Editor.
--
-- The Affiliation Certificate for an institute shows an Affiliation No.
-- that the admin types in specifically for the certificate (e.g. IPBO-UP-2044),
-- kept separate from the institution's public "Center Code" badge
-- (affiliated_institutions.center_code), which is unrelated and unaffected.
-- The certificate stays unavailable to print until this number is set.
-- ============================================================

ALTER TABLE affiliated_institutions
  ADD COLUMN IF NOT EXISTS affiliation_cert_no text,
  ADD COLUMN IF NOT EXISTS affiliation_cert_issued_at timestamptz;

-- Each number can be used for one institution only (case-insensitive).
CREATE UNIQUE INDEX IF NOT EXISTS uq_ai_affiliation_cert_no
  ON affiliated_institutions (lower(affiliation_cert_no))
  WHERE affiliation_cert_no IS NOT NULL;
