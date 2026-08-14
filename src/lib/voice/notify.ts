import { getCloudflareContext } from "@opennextjs/cloudflare";

import {
  storeNotification,
  type D1DatabaseLike,
  type NotificationKind,
} from "@/lib/voice/notification-store";

export { toE164Mexico } from "@/lib/voice/notification-store";

/*
 * Entrada privada de S1gnal.
 *
 * Cada lead o cita se guarda inmediatamente en D1. WhatsApp no se llama desde
 * la conversación: un Cron consolida lo pendiente y entrega un solo resumen
 * diario a las 18:00 de Monterrey. Así no se pierde información y el costo
 * máximo normal es un mensaje por día.
 */

export type Lead = {
  nombre: string;
  telefono: string;
  correo: string;
  empresa: string;
  nota: string;
};

export type Appointment = {
  nombre: string;
  contacto: string;
  fecha: string;
  tipo: string;
  nota: string;
};

type RuntimeBindings = Record<string, unknown> & {
  WHATSAPP_ALERTS_DB?: D1DatabaseLike;
};

export type NotificationResult = {
  delivered: boolean;
  reason?: string;
};

async function runtimeBindings(): Promise<RuntimeBindings> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env as RuntimeBindings;
  } catch {
    return {};
  }
}

async function queueNotification(
  kind: NotificationKind,
  payload: Lead | Appointment,
): Promise<NotificationResult> {
  const runtime = await runtimeBindings();
  const db = runtime.WHATSAPP_ALERTS_DB;

  if (!db) {
    console.error(`[${kind.toUpperCase()}] D1 no disponible; no se pudo respaldar.`);
    return { delivered: false, reason: "respaldo-no-disponible" };
  }

  try {
    const id = await storeNotification(db, kind, payload);
    if (!id) return { delivered: false, reason: "respaldo-sin-id" };
    console.info(`[${kind.toUpperCase()}] Evento ${id} en cola para el resumen diario.`);
    return { delivered: false, reason: "resumen-diario" };
  } catch (error) {
    console.error(`[${kind.toUpperCase()}] No se pudo respaldar el evento.`, error);
    return { delivered: false, reason: "respaldo-fallo" };
  }
}

export async function notifyLead(lead: Lead): Promise<NotificationResult> {
  return queueNotification("lead", lead);
}

export async function notifyAppointment(
  appointment: Appointment,
): Promise<NotificationResult> {
  return queueNotification("appointment", appointment);
}
