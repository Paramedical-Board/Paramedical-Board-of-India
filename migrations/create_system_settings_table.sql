-- System Settings Table for Centralized Configuration (Maintenance Mode, etc.)
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default maintenance_mode setting as disabled
INSERT INTO system_settings (key, value, updated_at)
VALUES (
  'maintenance_mode',
  '{"enabled": false, "message": "Portal is currently under scheduled maintenance. Please check back shortly.", "updated_by": "system"}'::jsonb,
  NOW()
)
ON CONFLICT (key) DO NOTHING;
