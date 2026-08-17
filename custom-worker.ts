// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- `.open-next/worker.js` se genera durante el build de OpenNext.
import handler from "./.open-next/worker.js";

import {
  sendDailyWhatsAppDigest,
  type DailyDigestEnv,
} from "./src/lib/voice/daily-digest";

type ScheduledControllerLike = {
  scheduledTime: number;
  noRetry?: () => void;
};

const CANONICAL_HOST = "soyartemio.me";

const customWorker = {
  async fetch(
    request: Request,
    env: Record<string, unknown>,
    context: unknown,
  ) {
    const url = new URL(request.url);
    const isPublicHost =
      url.hostname === CANONICAL_HOST ||
      url.hostname === `www.${CANONICAL_HOST}`;

    // Este punto corre antes de OpenNext, donde todavía conservamos el
    // protocolo original de Cloudflare. Así HTTP y `www` nunca dependen de la
    // normalización interna de Next.js para llegar a la URL canónica.
    if (
      isPublicHost &&
      (url.hostname !== CANONICAL_HOST || url.protocol !== "https:")
    ) {
      url.protocol = "https:";
      url.hostname = CANONICAL_HOST;
      url.port = "";
      return Response.redirect(url.toString(), 308);
    }

    return handler.fetch(request, env, context);
  },

  async scheduled(controller: ScheduledControllerLike, env: DailyDigestEnv) {
    // Un intento por día. Si Meta falla, lo pendiente permanece en D1 y se
    // incluye en el resumen del día siguiente sin generar reintentos pagados.
    controller.noRetry?.();
    await sendDailyWhatsAppDigest(env, new Date(controller.scheduledTime));
  },
};

export default customWorker;
