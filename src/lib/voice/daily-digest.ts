import {
  claimDailyDigest,
  completeDailyDigest,
  markNotificationsSent,
  queuedNotifications,
  reserveMonthlyQuota,
  toE164Mexico,
  type D1DatabaseLike,
  type StoredNotification,
} from "./notification-store";
import type { Appointment, Lead } from "./notify";

export type DailyDigestEnv = Record<string, unknown> & {
  WHATSAPP_ALERTS_DB: D1DatabaseLike;
  WHATSAPP_PHONE_NUMBER_ID?: string;
  WHATSAPP_ACCESS_TOKEN?: string;
  WHATSAPP_TO?: string;
  WHATSAPP_GRAPH_VERSION?: string;
  WHATSAPP_DAILY_TEMPLATE?: string;
  WHATSAPP_MONTHLY_LIMIT?: string;
};

function text(env: DailyDigestEnv, key: keyof DailyDigestEnv, fallback = "") {
  const value = env[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function monterreyParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Monterrey",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const day = `${value("year")}-${value("month")}-${value("day")}`;
  const label = new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Monterrey",
    dateStyle: "long",
  }).format(date);
  return { day, month: day.slice(0, 7), label };
}

function parsePayload<T>(row: StoredNotification): T | null {
  try {
    return JSON.parse(row.payload_json) as T;
  } catch {
    return null;
  }
}

function compact(items: string[], max = 360) {
  if (!items.length) return "0";
  let value = "";
  let included = 0;
  for (const item of items) {
    const next = value ? `${value}; ${item}` : item;
    if (next.length > max) break;
    value = next;
    included += 1;
  }
  const missing = items.length - included;
  return `${items.length} — ${value || "datos guardados"}${missing ? `; +${missing} más guardados` : ""}`;
}

function summarize(rows: StoredNotification[]) {
  const leads = rows
    .filter((row) => row.kind === "lead")
    .map((row) => parsePayload<Lead>(row))
    .filter((lead): lead is Lead => Boolean(lead))
    .map((lead) => {
      const name = [lead.nombre, lead.empresa].filter(Boolean).join(" — ") || "Sin nombre";
      const contact = lead.telefono || lead.correo || "sin contacto";
      return `${name}: ${contact}`;
    });

  const appointments = rows
    .filter((row) => row.kind === "appointment")
    .map((row) => parsePayload<Appointment>(row))
    .filter((appointment): appointment is Appointment => Boolean(appointment))
    .map((appointment) =>
      `${appointment.nombre || "Sin nombre"}: ${appointment.fecha || "sin horario"} · ${appointment.contacto || "sin contacto"}`,
    );

  return { leads: compact(leads), appointments: compact(appointments) };
}

function limit(env: DailyDigestEnv) {
  const configured = Number(text(env, "WHATSAPP_MONTHLY_LIMIT", "50"));
  if (!Number.isFinite(configured)) return 50;
  return Math.min(50, Math.max(1, Math.floor(configured)));
}

export async function sendDailyWhatsAppDigest(
  env: DailyDigestEnv,
  scheduledAt = new Date(),
) {
  const db = env.WHATSAPP_ALERTS_DB;
  const pending = await queuedNotifications(db);
  if (!pending.length) return { status: "empty" as const };

  const phoneNumberId = text(env, "WHATSAPP_PHONE_NUMBER_ID");
  const accessToken = text(env, "WHATSAPP_ACCESS_TOKEN");
  const to = toE164Mexico(text(env, "WHATSAPP_TO"));
  if (!phoneNumberId || !accessToken || !to) return { status: "not_configured" as const };

  const date = monterreyParts(scheduledAt);
  if (!(await claimDailyDigest(db, date.day))) return { status: "already_processed" as const };

  const quota = await reserveMonthlyQuota(db, date.month, limit(env));
  if (!quota) {
    await completeDailyDigest(db, date.day, "quota_exceeded", "cuota-mensual-agotada");
    return { status: "quota_exceeded" as const };
  }

  const summary = summarize(pending);
  const graphVersion = text(env, "WHATSAPP_GRAPH_VERSION", "v25.0");
  const template = text(env, "WHATSAPP_DAILY_TEMPLATE", "resumen_diario_soyartemio");

  try {
    const response = await fetch(
      `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          type: "template",
          template: {
            name: template,
            language: { code: "es_MX" },
            components: [
              {
                type: "body",
                parameters: [date.label, summary.leads, summary.appointments].map(
                  (value) => ({ type: "text", text: value }),
                ),
              },
            ],
          },
        }),
      },
    );

    if (!response.ok) {
      await response.text().catch(() => "");
      await completeDailyDigest(db, date.day, "failed", `meta-${response.status}`);
      return { status: "failed" as const, reason: `meta-${response.status}` };
    }

    const result = (await response.json().catch(() => ({}))) as {
      messages?: Array<{ id?: string }>;
    };
    const messageId = result.messages?.[0]?.id;
    await markNotificationsSent(
      db,
      pending.map((row) => row.id),
      date.day,
    );
    await completeDailyDigest(db, date.day, "sent", undefined, messageId);
    return { status: "sent" as const, count: pending.length, messageId };
  } catch (error) {
    await completeDailyDigest(db, date.day, "failed", "excepcion").catch(() => {});
    console.error("[RESUMEN-DIARIO] Entrega fallida.", error);
    return { status: "failed" as const, reason: "excepcion" };
  }
}
