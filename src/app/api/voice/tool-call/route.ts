import { NextResponse } from "next/server";

import { notifyLead } from "@/lib/voice/notify";

export const dynamic = "force-dynamic";

/*
 * Ejecuta las herramientas que invoca el agente de voz.
 *
 * Esta superficie es pública, así que NADA de aquí escribe en un sistema real.
 * La única herramienta registra un interés y se lo manda a Artemio. Es la
 * misma regla de S1gnal Dental: la voz de la web vende, la de la app opera.
 */

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function text(value: unknown, max = 200) {
  return String(value ?? "").trim().slice(0, max);
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

  const { delivered } = await notifyLead({
    nombre,
    telefono,
    correo,
    empresa: text(args.empresa, 160),
    nota: text(args.nota, 900),
  });

  /*
   * Se responde ok aunque la entrega falle: el dato ya se capturó y quedó en
   * el log. Decirle a la persona "no se pudo" la haría repetir su teléfono por
   * un problema que es de este lado.
   */
  return {
    ok: true,
    entregado: delivered,
    mensaje: "Listo, ya tengo tus datos. Artemio te escribe personalmente.",
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

  return json({ ok: false, error: `Herramienta desconocida: ${name}` }, 400);
}
