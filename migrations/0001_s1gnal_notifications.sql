CREATE TABLE IF NOT EXISTS s1gnal_notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL CHECK (kind IN ('lead', 'appointment')),
  payload_json TEXT NOT NULL,
  whatsapp_status TEXT NOT NULL DEFAULT 'pending',
  reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_s1gnal_notifications_created_at
  ON s1gnal_notifications (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_s1gnal_notifications_status
  ON s1gnal_notifications (whatsapp_status, created_at DESC);

CREATE TABLE IF NOT EXISTS whatsapp_monthly_quota (
  month TEXT PRIMARY KEY,
  used INTEGER NOT NULL DEFAULT 0 CHECK (used >= 0),
  limit_count INTEGER NOT NULL CHECK (limit_count > 0),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
