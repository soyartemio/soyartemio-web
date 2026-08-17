"use client";

import { useEffect } from "react";

/*
 * S1gnal en soyartemio.me — perfil "landing".
 *
 * El motor es el de S1gnal Dental (public/voz/voice-widget.js), que es la
 * versión que corre en producción y trae resueltas las trampas de audio que la
 * copia de S1gnal Engine todavía no tiene (ver RECETA-DE-VALORES.md §0).
 *
 * Reglas de esta superficie, tomadas de INTEGRACION-EN-APP.md §1:
 *  - `startOpen: false`  — es una cápsula, no el marco de la página.
 *  - `autoStart: true`   — tocar una cápsula que dice HABLAR ya es querer
 *                          hablar; pedir un segundo gesto perdía a la gente.
 *  - `autoGreet: true`   — arranca ella, porque nadie sabe qué decirle a una
 *                          computadora la primera vez.
 *  - Las herramientas NO escriben en ningún sistema: sólo registran interés.
 *
 * El widget es un módulo que lee `window.VoiceWidgetConfig` y busca sus nodos
 * por id, así que la configuración tiene que existir ANTES de cargar el script.
 */

declare global {
  interface Window {
    VoiceWidgetConfig?: Record<string, unknown>;
  }
}

const PIXELS = 35;

function TalkSurface({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="reactor-wrap"
      id="talk-slot"
      aria-pressed="false"
      aria-label={label}
    >
      {children}
    </button>
  );
}

export default function VoiceAgent({ locale = "es" }: { locale?: "es" | "en" }) {
  const es = locale === "es";

  useEffect(() => {
    window.VoiceWidgetConfig = {
      tokenEndpoint: "/api/voice/token",
      audioProcessorsPath: "/voz/audio-processors",
      agentName: "S1GNAL",
      idleMessage: es
        ? "Toca para hablar. Pregúntame lo que quieras sobre tu operación."
        : "Tap to talk. Ask me anything about your operation.",
      readyMessage: es ? "Te escucho." : "I'm listening.",
      maxSessionMinutes: 5,
      autoStart: true,
      autoGreet: true,
      startOpen: false,
      position: "right",
      toolWebhookUrl: "/api/voice/tool-call",
      toolTimeoutMs: 15000,
      telemetryEndpoint: "/api/voice/telemetry",
    };

    // El CSS va en el <head> del layout, no aquí: inyectarlo desde el efecto
    // deja ver el marcado crudo del panel durante un frame.
    const script = document.createElement("script");
    script.type = "module";
    script.src = "/voz/voice-widget.js";
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [es]);

  return (
    <>
      <button
        className="signal-launcher"
        id="signal-launcher"
        aria-label={es ? "Hablar con el agente de voz" : "Talk to the voice agent"}
        aria-controls="signal-panel"
        aria-expanded="false"
      >
        <span className="mk-slit" data-scanner="" data-count="7" aria-hidden="true" />
        <span className="launcher-action">{es ? "HABLAR" : "TALK"}</span>
      </button>

      <section
        className="signal-panel as-bar"
        id="signal-panel"
        role="region"
        aria-label={es ? "Agente de voz de SoyArtemio" : "SoyArtemio voice agent"}
        aria-hidden="true"
      >
        <header className="panel-head">
          <div className="lockup" id="signal-title">
            S<i>1</i>GNAL
          </div>
          <div className="head-right">
            <div className="status">
              <span className="status-dot" />
              <span id="head-state">{es ? "LISTO" : "READY"}</span>
            </div>
            <button className="close" id="close-signal" aria-label={es ? "Cerrar" : "Close"}>
              —
            </button>
          </div>
        </header>

        <div className="sg-grow">
          <div className="sg-grow-inner">
            <div
              className="conversation"
              id="conversation"
              aria-live="polite"
              aria-atomic="false"
            >
              <div className="speaker">S1GNAL / SOYARTEMIO</div>
              <p className="message" id="message">
                {es
                  ? "Toca para hablar. Pregúntame lo que quieras sobre tu operación."
                  : "Tap to talk. Ask me anything about your operation."}
              </p>
            </div>
          </div>
        </div>

            <div className="sg-row">
              <TalkSurface
                label={
                  es
                    ? "Hablar con S1gnal: toca para activar o silenciar el micrófono"
                    : "Talk to S1gnal: tap to turn the microphone on or off"
                }
              >
                <div className="reactor" id="reactor" aria-hidden="true">
                  <div className="axis" />
                  <div className="voice-pixels" id="voice-pixels">
                    {Array.from({ length: PIXELS }, (_, i) => (
                      <i key={i} />
                    ))}
                  </div>
                  <div className="reactor-state" id="reactor-state">
                    {es ? "ENLACE EN ESPERA" : "LINK STANDBY"}
                  </div>
                </div>
              </TalkSurface>

              {/* La barra presta la primera frase en vez de dar el manual: la
                  fricción real no es hablar, es no saber qué decir. */}
              <p className="sg-hint" id="sg-hint">
                <span className="sg-hint-lead">
                  {es
                    ? "«¿Qué me estás rentando que no necesito?» — "
                    : "“What am I renting that I don't need?” — "}
                </span>
                <b className="sg-hint-key">
                  {es ? "toca la señal o presiona " : "tap the signal or press "}
                  <kbd className="sg-kbd">{es ? "espacio" : "space"}</kbd>
                </b>
                <b className="sg-hint-touch">
                  {es
                    ? "Pregúntame dónde se fuga tu margen"
                    : "Ask where your margin leaks"}
                </b>
              </p>

              <form className="sg-write" id="sg-write">
                <input
                  id="sg-input"
                  type="text"
                  autoComplete="off"
                  placeholder={es ? "Escribe aquí" : "Type here"}
                  aria-label={es ? "Escribe tu pregunta" : "Type your question"}
                />
                <button
                  type="submit"
                  className="sg-send"
                  aria-label={es ? "Preguntar" : "Ask"}
                  title={es ? "Preguntar" : "Ask"}
                >
                  →
                </button>
              </form>

              <div className="sg-actions">
                <div className="control-zone">
                  <button
                    className="utility"
                    id="sg-text"
                    aria-label={es ? "Continuar por texto" : "Continue in text"}
                    title={es ? "Continuar por texto" : "Continue in text"}
                  >
                    TXT
                  </button>
                  <div className="voice-control">
                    <span className="voice-label" id="voice-label">
                      {es ? "TOCA PARA HABLAR" : "TAP TO TALK"}
                    </span>
                    <button
                      className="talk"
                      id="talk"
                      aria-label={es ? "Activar micrófono" : "Turn on microphone"}
                    >
                      <span className="talk-reactor" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                      </span>
                    </button>
                  </div>
                  <button
                    className="utility"
                    id="interrupt"
                    aria-label={es ? "Interrumpir respuesta" : "Interrupt"}
                    disabled
                  >
                    ■
                  </button>
                </div>
                <button
                  className="sg-close"
                  id="sg-close"
                  aria-label={es ? "Terminar conversación" : "End conversation"}
                >
                  {es ? "Terminar" : "End"}
                </button>
              </div>
            </div>

        <div className="chips" id="chips">
          <button className="chip" data-prompt={es ? "¿Qué haces exactamente?" : "What exactly do you do?"}>
            {es ? "¿Qué hace Artemio?" : "What does Artemio do?"}
          </button>
          <button
            className="chip"
            data-prompt={
              es
                ? "Quiero que Artemio me contacte, toma mis datos."
                : "I want Artemio to contact me, take my details."
            }
          >
            {es ? "Que me contacte" : "Have him contact me"}
          </button>
        </div>

        <p className="notice">
          {es
            ? "Agente de IA en pruebas. No compartas datos confidenciales ni información de tus clientes."
            : "Experimental AI agent. Do not share confidential or customer data."}
        </p>
      </section>
    </>
  );
}
