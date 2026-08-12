/*
 * Entrega de leads a Artemio.
 *
 * S1gnal es el punto de contacto de la página: no hay formulario. Cuando
 * alguien acepta que lo contacten, el lead tiene que llegar al WhatsApp
 * personal de Artemio — si se queda en un log, no existió.
 *
 * Dos caminos, en orden:
 *
 *  1. WhatsApp Cloud API. Es el bueno y el que Artemio quiere. Mandar un
 *     mensaje que NO es respuesta dentro de la ventana de 24 h obliga a usar
 *     una PLANTILLA aprobada por Meta — por eso esto manda `template` y no
 *     texto libre. Requiere las cuatro variables de entorno de abajo.
 *
 *  2. Si no hay credenciales todavía, se registra en consola con un formato
 *     que se distingue de un error cualquiera y `delivered` vuelve en false.
 *     El agente igual le confirma a la persona, porque el dato ya se capturó;
 *     lo que falta es el aviso, y eso es problema de Artemio, no del visitante.
 *
 * Plantilla a dar de alta en WhatsApp Manager (categoría UTILITY, es-MX):
 *
 *   Nombre: lead_soyartemio
 *   Cuerpo: Nuevo lead desde soyartemio.me
 *           {{1}}
 *           Contacto: {{2}}
 *           Dijo: {{3}}
 *
 * Variables de entorno:
 *   WHATSAPP_PHONE_NUMBER_ID   id del número emisor (Meta lo da al registrarlo)
 *   WHATSAPP_ACCESS_TOKEN      token permanente del System User
 *   WHATSAPP_TO                el WhatsApp personal de Artemio, E.164 sin "+"
 *   WHATSAPP_TEMPLATE          opcional; por defecto "lead_soyartemio"
 */

export type Lead = {
  nombre: string;
  telefono: string;
  correo: string;
  empresa: string;
  nota: string;
};

/**
 * Normaliza a E.164 mexicano sin "+".
 *
 * Meta rechaza el formato viejo con el 1 después del 52 en algunos casos y
 * acepta 52 + 10 dígitos, así que se recorta ese 1 cuando aparece.
 */
export function toE164Mexico(raw: string): string | null {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 10) return `52${digits}`;
  if (digits.length === 12 && digits.startsWith("52")) return digits;
  if (digits.length === 13 && digits.startsWith("521")) return `52${digits.slice(3)}`;
  // Cualquier otra cosa es un número de otro país o un dato mal capturado: se
  // devuelve tal cual para no romper un caso legítimo, pero sin inventar lada.
  return digits.length >= 8 ? digits : null;
}

function line(lead: Lead) {
  const via = [lead.telefono, lead.correo].filter(Boolean).join(" · ") || "no dejó vía";
  return {
    quien: [lead.nombre, lead.empresa].filter(Boolean).join(" — ") || "Sin nombre",
    via,
    dijo: lead.nota || "No dejó nota.",
  };
}

export async function notifyLead(
  lead: Lead,
): Promise<{ delivered: boolean; reason?: string }> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const to = toE164Mexico(process.env.WHATSAPP_TO?.trim() ?? "");
  const template = process.env.WHATSAPP_TEMPLATE?.trim() || "lead_soyartemio";
  const parts = line(lead);

  if (!phoneNumberId || !accessToken || !to) {
    // Sin credenciales el lead NO se pierde: queda en los logs del worker con
    // una marca buscable.
    console.warn(
      `[LEAD] ${parts.quien} | ${parts.via} | ${parts.dijo}` +
        " -- WhatsApp sin configurar (WHATSAPP_PHONE_NUMBER_ID / _ACCESS_TOKEN / _TO)",
    );
    return { delivered: false, reason: "whatsapp-no-configurado" };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: template,
            language: { code: "es_MX" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: parts.quien.slice(0, 300) },
                  { type: "text", text: parts.via.slice(0, 300) },
                  { type: "text", text: parts.dijo.slice(0, 700) },
                ],
              },
            ],
          },
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(
        `[LEAD] entrega fallida (${response.status}) ${detail.slice(0, 400)} | ` +
          `${parts.quien} | ${parts.via} | ${parts.dijo}`,
      );
      return { delivered: false, reason: `meta-${response.status}` };
    }

    return { delivered: true };
  } catch (error) {
    console.error(
      `[LEAD] entrega fallida (excepción) | ${parts.quien} | ${parts.via} | ${parts.dijo}`,
      error,
    );
    return { delivered: false, reason: "excepcion" };
  }
}
