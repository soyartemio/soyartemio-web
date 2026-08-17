import { NextResponse } from "next/server";

import {
  VOICE_MODEL,
  VOICE_NAME,
  isVoiceConfigured,
  landingAgent,
} from "@/lib/voice/profile";

export const dynamic = "force-dynamic";

/*
 * Emisor de tokens efímeros para la Gemini Live API.
 *
 * El navegador habla por WebSocket directo con Google para no pagar un relay
 * de audio, así que necesita credenciales. GEMINI_API_KEY nunca sale de aquí:
 * este endpoint la usa para pedir un token de UN SOLO USO que expira en
 * minutos. Lo único que llega al cliente es ese token.
 */

const TOKEN_LIFETIME_MS = 5 * 60 * 1000;
const SESSION_START_WINDOW_MS = 60 * 1000;

function lowestLatencyThinking(model: string) {
  if (model.startsWith("gemini-2.5")) return { thinkingBudget: 0 };
  if (model.startsWith("gemini-3.1")) return { thinkingLevel: "MINIMAL" };
  return undefined;
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

export async function POST(request: Request) {
  if (!isVoiceConfigured())
    return json({ error: "La voz todavía no está configurada." }, 503);

  // Que ningún sitio ajeno use este endpoint como proxy gratuito de tokens a
  // costa de la cuenta de Google de Artemio.
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin")
    return json({ error: "Solicitud no permitida." }, 403);

  const agent = landingAgent();
  const now = Date.now();
  const thinkingConfig = lowestLatencyThinking(VOICE_MODEL);

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/auth_tokens",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY!.trim(),
      },
      body: JSON.stringify({
        uses: 1,
        expireTime: new Date(now + TOKEN_LIFETIME_MS).toISOString(),
        newSessionExpireTime: new Date(now + SESSION_START_WINDOW_MS).toISOString(),
        bidiGenerateContentSetup: {
          model: `models/${VOICE_MODEL}`,
          generationConfig: {
            responseModalities: ["AUDIO"],
            temperature: agent.temperature,
            ...(thinkingConfig ? { thinkingConfig } : {}),
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE_NAME } },
            },
          },
          systemInstruction: { parts: [{ text: agent.systemInstruction }] },
          tools: agent.tools,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          realtimeInputConfig: {
            /*
             * Detección de voz para entorno de oficina, no de consultorio: el
             * visitante de una landing normalmente está sentado y solo. Se
             * dejan los valores estándar de Dental para ese caso.
             */
            automaticActivityDetection: {
              disabled: false,
              prefixPaddingMs: 300,
              silenceDurationMs: 700,
            },
            activityHandling: "START_OF_ACTIVITY_INTERRUPTS",
            turnCoverage: "TURN_INCLUDES_ONLY_ACTIVITY",
          },
        },
      }),
    },
  );

  const payload = (await response.json().catch(() => ({}))) as { name?: string };
  if (!response.ok || !payload.name) {
    console.error("voice token creation failed", response.status);
    return json(
      { error: "No se pudo iniciar la voz. Intenta de nuevo." },
      response.status === 429 ? 429 : 502,
    );
  }

  return json({
    token: payload.name,
    model: VOICE_MODEL,
    greetingPrompt: agent.greetingPrompt,
    maxSessionMinutes: agent.maxSessionMinutes,
  });
}
