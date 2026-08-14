export type NotificationKind = "lead" | "appointment";

/** Normaliza un WhatsApp mexicano a E.164 sin "+". */
export function toE164Mexico(raw: string): string | null {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 10) return `52${digits}`;
  if (digits.length === 12 && digits.startsWith("52")) return digits;
  if (digits.length === 13 && digits.startsWith("521")) return `52${digits.slice(3)}`;
  return digits.length >= 8 ? digits : null;
}

export type D1Result<T> = {
  first(): Promise<T | null>;
  all(): Promise<{ results?: T[] }>;
  run(): Promise<unknown>;
  bind(...values: unknown[]): D1Result<T>;
};

export type D1DatabaseLike = {
  prepare<T = Record<string, unknown>>(query: string): D1Result<T>;
};

export type StoredNotification = {
  id: number;
  kind: NotificationKind;
  payload_json: string;
  created_at: string;
};

type StoredId = { id: number };
type DigestClaim = { day: string };

export type QuotaReservation = {
  used: number;
  limit_count: number;
};

export async function storeNotification(
  db: D1DatabaseLike,
  kind: NotificationKind,
  payload: unknown,
): Promise<number | null> {
  const row = await db
    .prepare<StoredId>(
      `INSERT INTO s1gnal_notifications (kind, payload_json, whatsapp_status)
       VALUES (?, ?, 'queued')
       RETURNING id`,
    )
    .bind(kind, JSON.stringify(payload))
    .first();
  return row?.id ?? null;
}

export async function queuedNotifications(
  db: D1DatabaseLike,
): Promise<StoredNotification[]> {
  const result = await db
    .prepare<StoredNotification>(
      `SELECT id, kind, payload_json, created_at
       FROM s1gnal_notifications
       WHERE whatsapp_status = 'queued'
       ORDER BY id ASC
       LIMIT 100`,
    )
    .all();
  return result.results ?? [];
}

export async function claimDailyDigest(db: D1DatabaseLike, day: string) {
  const row = await db
    .prepare<DigestClaim>(
      `INSERT INTO whatsapp_daily_digest (day, status, attempt_count)
       VALUES (?, 'processing', 1)
       ON CONFLICT(day) DO NOTHING
       RETURNING day`,
    )
    .bind(day)
    .first();
  return Boolean(row);
}

export async function completeDailyDigest(
  db: D1DatabaseLike,
  day: string,
  status: "sent" | "failed" | "quota_exceeded",
  reason?: string,
  messageId?: string,
) {
  await db
    .prepare(
      `UPDATE whatsapp_daily_digest
       SET status = ?, reason = ?, message_id = ?, updated_at = CURRENT_TIMESTAMP
       WHERE day = ?`,
    )
    .bind(status, reason ?? null, messageId ?? null, day)
    .run();
}

export async function reserveMonthlyQuota(
  db: D1DatabaseLike,
  month: string,
  limit: number,
): Promise<QuotaReservation | null> {
  return db
    .prepare<QuotaReservation>(
      `INSERT INTO whatsapp_monthly_quota (month, used, limit_count, updated_at)
       VALUES (?, 1, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(month) DO UPDATE SET
         used = whatsapp_monthly_quota.used + 1,
         limit_count = excluded.limit_count,
         updated_at = CURRENT_TIMESTAMP
       WHERE whatsapp_monthly_quota.used < excluded.limit_count
       RETURNING used, limit_count`,
    )
    .bind(month, limit)
    .first();
}

export async function markNotificationsSent(
  db: D1DatabaseLike,
  ids: number[],
  day: string,
) {
  if (!ids.length) return;
  const placeholders = ids.map(() => "?").join(", ");
  await db
    .prepare(
      `UPDATE s1gnal_notifications
       SET whatsapp_status = 'digest_sent', notified_at = CURRENT_TIMESTAMP,
           reason = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id IN (${placeholders})`,
    )
    .bind(`resumen-${day}`, ...ids)
    .run();
}
