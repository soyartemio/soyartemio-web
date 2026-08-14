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

const customWorker = {
  fetch: handler.fetch,

  async scheduled(controller: ScheduledControllerLike, env: DailyDigestEnv) {
    // Un intento por día. Si Meta falla, lo pendiente permanece en D1 y se
    // incluye en el resumen del día siguiente sin generar reintentos pagados.
    controller.noRetry?.();
    await sendDailyWhatsAppDigest(env, new Date(controller.scheduledTime));
  },
};

export default customWorker;
