ALTER TABLE s1gnal_notifications ADD COLUMN notified_at TEXT;

CREATE TABLE IF NOT EXISTS whatsapp_daily_digest (
  day TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('processing', 'sent', 'failed', 'quota_exceeded')),
  attempt_count INTEGER NOT NULL DEFAULT 1 CHECK (attempt_count > 0),
  reason TEXT,
  message_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
