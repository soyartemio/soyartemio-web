import { NextResponse } from "next/server";

import { notifyAppointment, notifyLead } from "@/lib/voice/notify";

export const dynamic = "force-dynamic";

/*
 * Ejecuta las herramientas que invoca el agente de voz.
 *
 * Esta superficie es pública, así que ninguna herramienta opera sistemas del
 * cliente. La única herramienta registra un interés y manda un aviso privado
 * a Artemio. Es la misma regla de S1gnal Dental: la voz de la web vende, la de
 * la app opera.
 */

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function text(value: unknown, max = 200) {
  return String(value ?? "").trim().slice(0, max);
}

function backupFailed(reason?: string) {
  return ["respaldo-no-disponible", "respaldo-fallo", "respaldo-sin-id"].includes(
    reason ?? "",
  );
}

async function registrarInteres(args: Record<string, unknown>) {
  // El consentimiento se verifica aquí, no sólo en el prompt: una instrucción
  // se puede rodear hablando, un if no.
  if (text(args.acepta_contacto).toLowerCase() !== "si")
    return {
      ok: false,
      error:
        "La persona todavía no aceptó que la contacten. Pregúntaselo antes de registrar nada.",
    };

  const nombre = text(args.nombre, 120);
  if (!nombre) return { ok: false, error: "Falta el nombre." };

  const telefono = text(args.telefono, 40);
  const correo = text(args.correo, 180).toLowerCase();
  if (!telefono && !correo)
    return {
      ok: false,
      error: "Falta una vía de contacto. Pide teléfono o correo, el que prefiera.",
    };

  if (text(args.datos_confirmados).toLowerCase() !== "si")
    return {
      ok: false,
      error:
        "Falta confirmar la vía de contacto. Repite el teléfono y/o correo y pregunta si lo escuchaste bien.",
    };

  const { delivered, reason } = await notifyLead({
    nombre,
    telefono,
    correo,
    empresa: text(args.empresa, 160),
    nota: text(args.nota, 900),
  });

  /*
   * Se responde ok aunque WhatsApp falle si D1 ya protegió el dato. Sólo se
   * rechaza cuando tampoco fue posible crear el respaldo: en ese caso decir
   * "ya lo tengo" sería mentirle a la persona.
   */
  if (backupFailed(reason))
    return {
      ok: false,
      error:
        "No pude guardar tus datos en este momento. Ofrece el correo soyartemio@me.com como alternativa.",
    };

  return {
    ok: true,
    entregado: delivered,
    mensaje: "Listo, ya tengo tus datos. Artemio te escribe personalmente.",
  };
}

async function solicitarCita(args: Record<string, unknown>) {
  if (text(args.acepta_contacto).toLowerCase() !== "si")
    return {
      ok: false,
      error:
        "La persona todavía no aceptó que la contacten. Pregúntaselo antes de enviar la solicitud.",
    };

  const nombre = text(args.nombre, 120);
  if (!nombre) return { ok: false, error: "Falta el nombre." };

  const telefono = text(args.telefono, 40);
  const correo = text(args.correo, 180).toLowerCase();
  if (!telefono && !correo)
    return {
      ok: false,
      error: "Falta una vía de contacto. Pide teléfono o correo.",
    };

  if (text(args.datos_confirmados).toLowerCase() !== "si")
    return {
      ok: false,
      error:
        "Falta confirmar la vía de contacto. Repite el teléfono y/o correo y pregunta si lo escuchaste bien.",
    };

  const momento = text(args.momento_preferido, 220);
  if (!momento)
    return {
      ok: false,
      error: "Falta saber qué día u horario le funciona mejor.",
    };

  const empresa = text(args.empresa, 160);
  const motivo = text(args.motivo, 700) || "No explicó el motivo.";
  const { delivered, reason } = await notifyAppointment({
    nombre: empresa ? `${nombre} — ${empresa}` : nombre,
    contacto: [telefono, correo].filter(Boolean).join(" · "),
    fecha: momento,
    tipo: "Solicitud de diagnóstico de 30 min",
    nota: motivo,
  });

  if (backupFailed(reason))
    return {
      ok: false,
      error:
        "No pude guardar la solicitud en este momento. Ofrece el correo soyartemio@me.com como alternativa.",
    };

  return {
    ok: true,
    entregado: delivered,
    mensaje:
      "Listo, registré tu solicitud. Artemio te confirma personalmente el horario.",
  };
}

export async function POST(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin")
    return json({ ok: false, error: "Solicitud no permitida." }, 403);

  let body: { name?: string; args?: Record<string, unknown> };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, error: "Solicitud inválida." }, 400);
  }

  const name = text(body.name, 60);
  const args = body.args ?? {};

  if (name === "registrar_interes") return json(await registrarInteres(args));
  if (name === "solicitar_cita") return json(await solicitarCita(args));

  return json({ ok: false, error: `Herramienta desconocida: ${name}` }, 400);
}
