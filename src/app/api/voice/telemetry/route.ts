import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function number(value: unknown, min = 0, max = 600_000) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.min(max, Math.max(min, parsed));
}

function label(value: unknown, max = 100) {
  return String(value ?? "")
    .replace(/[^a-zA-Z0-9._:-]/g, "")
    .slice(0, max);
}

/**
 * Métricas técnicas de S1GNAL, sin contenido de la conversación.
 *
 * No se guardan audio, transcripciones, argumentos, nombres, teléfonos,
 * correos ni ids. La lista blanca sólo llega a los logs de Cloudflare para
 * separar latencia del modelo, herramientas lentas y cortes del reproductor.
 */
export async function POST(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") {
    return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > 4096) return new NextResponse(null, { status: 413 });

  const raw = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!raw || (raw.event !== "voice_turn" && raw.event !== "voice_session")) {
    return new NextResponse(null, { status: 400 });
  }

  if (raw.event === "voice_session") {
    console.info(
      "s1gnal.voice_session",
      JSON.stringify({
        schema: 1,
        model: label(raw.model),
        micReadyMs: number(raw.micReadyMs),
        connectedMs: number(raw.connectedMs),
        warmToken: raw.warmToken === true,
        bufferedSpeech: raw.bufferedSpeech === true,
        localGreeting: raw.localGreeting === true,
        localGreetingMs: number(raw.localGreetingMs),
        platform: label(raw.platform, 20),
        browser: label(raw.browser, 20),
      }),
    );

    return new NextResponse(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  }

  console.info(
    "s1gnal.voice_turn",
    JSON.stringify({
      schema: 1,
      reason: label(raw.reason, 30),
      model: label(raw.model),
      kind: label(raw.kind, 20),
      sampleRate: number(raw.sampleRate, 0, 192_000),
      firstAudioMs: number(raw.firstAudioMs),
      turnMs: number(raw.turnMs),
      serverTurnCompleteMs: number(raw.serverTurnCompleteMs),
      audioChunks: number(raw.audioChunks, 0, 100_000),
      audioSeconds: number(raw.audioSeconds, 0, 3600),
      maxInterChunkGapMs: number(raw.maxInterChunkGapMs),
      toolCalls: number(raw.toolCalls, 0, 1000),
      maxToolMs: number(raw.maxToolMs),
      playbackUnderruns: number(raw.playbackUnderruns, 0, 100_000),
      preloadMs: number(raw.preloadMs, 0, 5000),
      maxQueuedMs: number(raw.maxQueuedMs, 0, 600_000),
    }),
  );

  return new NextResponse(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}
