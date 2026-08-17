// Widget de voz en tiempo real: captura micrófono, streaming bidireccional
// por WebSocket con la Gemini Live API, reproducción de audio, interrupciones
// (barge-in), transcripción en vivo y un puente de tool calling hacia tu
// propio backend.
//
// Personaliza SIN editar este archivo: define `window.VoiceWidgetConfig`
// en tu página ANTES de este <script>. Ver embed-snippet.html para el
// ejemplo completo de markup + configuración.
const config = Object.assign(
  {
    // Endpoint del Worker que emite el token efímero (voice-token.js).
    tokenEndpoint: "/api/voice-token",
    // Nombre mostrado en la conversación (además del rótulo visual del HTML).
    agentName: "Agente",
    // Mensaje inicial antes de que el usuario diga algo.
    idleMessage: "Toca para hablar y cuéntame en qué te ayudo.",
    // Mensaje al quedar conectado. El encabezado y el reactor ya cambian de
    // estado, pero la línea de conversación se quedaba en "Iniciando enlace…"
    // hasta la primera transcripción: el micrófono llevaba un segundo abierto y
    // la pantalla seguía diciendo que arrancaba, así que la gente esperaba en
    // silencio a una señal que no iba a llegar.
    readyMessage: "Listo, te escucho. Habla cuando quieras.",
    // Respaldo para tokens antiguos. En instalaciones actuales lo define el
    // perfil del servidor y viaja junto con el modelo y la duración.
    greetingPrompt: "Inicia la conversación ahora siguiendo tu instrucción de sistema.",
    // Saludo local opcional. En una landing, una frase fija no necesita esperar
    // a que el modelo la genere cada vez: puede reproducirse desde un asset
    // precargado mientras el micrófono y el WebSocket terminan de abrir.
    // `localGreetingText` mantiene sincronizados audio, transcripción y la
    // instrucción del agente para que Gemini no repita el saludo.
    localGreetingUrl: null,
    localGreetingText: null,
    // Duración máxima de sesión en el cliente (respaldo del límite del Worker).
    maxSessionMinutes: 3,
    // A dónde se envían las tool calls que el modelo invoque en vivo.
    // Recibe POST { name, args } y debe responder JSON; lo que devuelva se
    // usa como `output` de la función hacia el modelo (ver examples/).
    toolWebhookUrl: null,
    // Hook opcional para manejar tool calls sin red (por ejemplo abrir un
    // modal). Si lo defines, se usa en vez de toolWebhookUrl.
    // async onToolCall(name, args) => ({ ok: true, ... })
    onToolCall: null,
    // Una herramienta que no responde no puede congelar la conversación para
    // siempre. El error vuelve al modelo para que lo diga con honestidad.
    toolTimeoutMs: 15000,
    // Diagnóstico opcional y sin contenido: sólo tiempos, conteos, modelo y
    // frecuencia de audio. Nunca manda voz, transcripción ni argumentos.
    telemetryEndpoint: null,
    // CTA de producto dentro del panel. APAGADO por defecto: es lead-gen de
    // quien vende el widget, no algo que quiera ver el cliente final en su
    // propio sitio. Actívalo solo en tu web:
    //   productLink: { href: "/s1gnal", label: "Quiero S1GNAL en mi página" }
    productLink: null,
    // Carpeta de los AudioWorklets. Por defecto se resuelve junto a este
    // archivo (../audio-processors/); defínela si los alojas en otra ruta.
    audioProcessorsPath: null,
    // "right" (default) o "left" — usa "left" si el sitio del cliente ya
    // tiene algo en la esquina inferior derecha (típico: botón de WhatsApp).
    // Ver BRAND-GUIDELINES.md, regla 3 de embedding.
    position: "right",
    // Sólo modo barra: la barra ya está abierta al cargar la página, sin
    // cápsula. Para superficies donde la voz es parte del marco de la app,
    // no una invitación. Cerrar la pliega (termina la sesión y encoge la
    // conversación) en vez de quitarla.
    startOpen: false,
  },
  window.VoiceWidgetConfig || {},
);

// Los worklets se resuelven contra la URL de ESTE módulo, no contra la raíz
// del sitio anfitrión. Una ruta absoluta solo funciona si los assets quedaron
// en la raíz; en cuanto el widget vive en un subdirectorio, addModule falla
// con "Importing a module script failed". Si el cliente los aloja en otro
// lugar, pásale VoiceWidgetConfig.audioProcessorsPath.
const AUDIO_PROCESSORS = config.audioProcessorsPath
  ? new URL(config.audioProcessorsPath.replace(/\/?$/, "/"), window.location.href).href
  : new URL("../audio-processors/", import.meta.url).href;

// Los tokens efímeros actuales sólo están soportados por v1beta. Mantener aquí
// v1alpha dejaba la sesión sobre una ruta heredada aunque el modelo fuera el
// correcto, con más riesgo de cierres y comportamiento desigual por aparato.
const WS_ENDPOINT = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained";

const launcher = document.getElementById("signal-launcher");
const panel = document.getElementById("signal-panel");
const closeButton = document.getElementById("close-signal");

// El CTA se inyecta antes del aviso legal, al final del panel, para que no
// compita con el botón de hablar.
if (config.productLink && config.productLink.href) {
  const cta = document.createElement("a");
  cta.className = "panel-cta";
  cta.href = config.productLink.href;
  cta.textContent = config.productLink.label || "Quiero uno en mi página";
  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = " →";
  cta.appendChild(arrow);
  // En la barra el CTA vive al final de la conversación: aparece cuando la
  // zona crece, es decir, cuando ya hubo un turno y hay interés que cerrar.
  // En el panel alto conserva su sitio, antes del aviso legal.
  const growInner = panel.querySelector(".sg-grow-inner");
  const notice = panel.querySelector(".notice");
  if (panel.classList.contains("as-bar") && growInner) growInner.appendChild(cta);
  else if (notice) notice.parentNode.insertBefore(cta, notice);
}

if (config.position === "left") {
  launcher.classList.add("pos-left");
  panel.classList.add("pos-left");
}
const talkButton = document.getElementById("talk");
const interruptButton = document.getElementById("interrupt");
const textButton =
  document.getElementById("sg-text") ||
  document.querySelector('[aria-label="Continuar por texto"]');
const voiceLabel = document.getElementById("voice-label");
const headState = document.getElementById("head-state");
const reactorState = document.getElementById("reactor-state");
const reactor = document.getElementById("reactor");
const pixels = [...document.querySelectorAll("#voice-pixels i")];
const conversation = document.getElementById("conversation");
const chips = document.getElementById("chips");

let socket;
let inputContext;
let outputContext;
let outputPreparation;
let inputStream;
let inputAnalyser;
let outputAnalyser;
let captureNode;
let playbackNode;
let animationFrame;
let connected = false;
let pendingPrompt = "";
let userTranscript = "";
let modelTranscript = "";
let sessionTimer;
let connectionTimer;
let activeModel = "unknown";
let sessionGreetingPrompt = config.greetingPrompt;
let turnMetrics = null;
let playbackMetrics = { underruns: 0, preloadMs: 0, maxQueuedMs: 0 };
let sessionMetrics = null;
let gestureStartedAt = null;

const localGreetingAudio = config.localGreetingUrl
  ? new Audio(new URL(config.localGreetingUrl, window.location.href).href)
  : null;
let localGreetingStarted = false;
let localGreetingPlaying = false;
let localGreetingStartedAt = null;

if (localGreetingAudio) {
  localGreetingAudio.preload = "auto";
  localGreetingAudio.load();
}

// Mientras abre el WebSocket, el micrófono ya puede estar disponible. Un
// pequeño pre-roll conserva la primera palabra en vez de tirarla por no existir
// todavía `setupComplete`. Sólo se guarda audio técnico en memoria y se vacía
// al conectar; nunca sale por telemetría ni se persiste.
const EARLY_SPEECH_RMS = 0.01;
const EARLY_AUDIO_PREROLL_SAMPLES = 4_000; // 250 ms a 16 kHz.
const EARLY_AUDIO_MAX_SAMPLES = 40_000; // 2.5 s, límite de memoria y latencia.
let earlyAudioRing = [];
let earlyAudioRingSamples = 0;
let earlyAudioQueue = [];
let earlyAudioQueueSamples = 0;
let earlySpeechDetected = false;

function nowMs() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function clientPlatform() {
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Macintosh/i.test(ua)) return "macos";
  if (/Android/i.test(ua)) return "android";
  if (/Windows/i.test(ua)) return "windows";
  return "other";
}

function clientBrowser() {
  const ua = navigator.userAgent || "";
  if (/CriOS/i.test(ua)) return "chrome-ios";
  if (/FxiOS/i.test(ua)) return "firefox-ios";
  if (/EdgiOS/i.test(ua)) return "edge-ios";
  if (/Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg/i.test(ua)) return "safari";
  if (/Chrome|Chromium/i.test(ua)) return "chrome";
  if (/Firefox/i.test(ua)) return "firefox";
  return "other";
}

function postTelemetry(payload) {
  if (!config.telemetryEndpoint) return;
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      config.telemetryEndpoint,
      new Blob([body], { type: "application/json" }),
    );
    return;
  }
  void fetch(config.telemetryEndpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

function beginTurn(kind) {
  if (turnMetrics) return turnMetrics;
  const now = nowMs();
  turnMetrics = {
    kind,
    startedAt: now,
    lastInputAt: now,
    firstAudioMs: null,
    lastAudioAt: null,
    maxInterChunkGapMs: 0,
    audioChunks: 0,
    audioSeconds: 0,
    toolCalls: 0,
    maxToolMs: 0,
    serverTurnCompleteMs: null,
  };
  playbackMetrics = { underruns: 0, preloadMs: 0, maxQueuedMs: 0 };
  return turnMetrics;
}

function noteInput(kind = "voice") {
  const metrics = beginTurn(kind);
  metrics.lastInputAt = nowMs();
}

function noteAudio(samples, sampleRate) {
  const metrics = beginTurn("voice");
  const now = nowMs();
  if (metrics.firstAudioMs === null) {
    metrics.firstAudioMs = Math.round(now - metrics.lastInputAt);
  }
  if (metrics.lastAudioAt !== null) {
    metrics.maxInterChunkGapMs = Math.max(
      metrics.maxInterChunkGapMs,
      Math.round(now - metrics.lastAudioAt),
    );
  }
  metrics.lastAudioAt = now;
  metrics.audioChunks += 1;
  metrics.audioSeconds += samples / sampleRate;
}

function noteTool(durationMs) {
  const metrics = beginTurn("tool");
  metrics.toolCalls += 1;
  metrics.maxToolMs = Math.max(metrics.maxToolMs, Math.round(durationMs));
}

function flushTelemetry(reason) {
  if (!turnMetrics) return;
  const metrics = turnMetrics;
  turnMetrics = null;

  // Lista blanca deliberada: no hay textos, argumentos, ids de contacto ni
  // contenido de audio. El endpoint puede registrar este objeto sin exponer la
  // conversación.
  postTelemetry({
    schema: 1,
    event: "voice_turn",
    reason,
    model: activeModel,
    kind: metrics.kind,
    sampleRate: outputContext?.sampleRate || 0,
    firstAudioMs: metrics.firstAudioMs,
    turnMs: Math.round(nowMs() - metrics.startedAt),
    serverTurnCompleteMs: metrics.serverTurnCompleteMs,
    audioChunks: metrics.audioChunks,
    audioSeconds: Number(metrics.audioSeconds.toFixed(3)),
    maxInterChunkGapMs: metrics.maxInterChunkGapMs,
    toolCalls: metrics.toolCalls,
    maxToolMs: metrics.maxToolMs,
    playbackUnderruns: playbackMetrics.underruns,
    preloadMs: playbackMetrics.preloadMs,
    maxQueuedMs: playbackMetrics.maxQueuedMs,
  });
}

function flushSessionTelemetry(bufferedSpeech) {
  if (!sessionMetrics) return;
  const metrics = sessionMetrics;
  sessionMetrics = null;
  postTelemetry({
    schema: 1,
    event: "voice_session",
    model: activeModel,
    micReadyMs: metrics.micReadyAt
      ? Math.round(metrics.micReadyAt - metrics.startedAt)
      : null,
    connectedMs: Math.round(nowMs() - metrics.startedAt),
    warmToken: metrics.warmToken,
    bufferedSpeech,
    localGreeting: metrics.localGreeting,
    localGreetingMs: metrics.localGreetingAt
      ? Math.max(0, Math.round(metrics.localGreetingAt - metrics.startedAt))
      : null,
    platform: clientPlatform(),
    browser: clientBrowser(),
  });
}

/* Tolerante con los nodos que falten: desde que el reposo se escribe al cargar
   el módulo, un id ausente en una superficie tumbaría el widget entero antes de
   que nadie toque nada. Un rótulo sin pintar es un defecto; una voz que no
   carga es la voz apagada. */
function setState(shortState, longState, label) {
  if (headState) headState.textContent = shortState;
  if (reactorState) reactorState.textContent = longState;
  if (voiceLabel) voiceLabel.textContent = label;
}

/*
 * El reposo se escribe desde aquí, no desde el marcado.
 *
 * Las tres cadenas estaban además a mano en el HTML del componente, y la del
 * gesto —«MANTÉN PARA HABLAR»— sobrevivió ahí a tres limpiezas seguidas
 * enseñando un gesto que ya no existe: ahora es un toque para encender y otro
 * para apagar. El marcado sigue trayendo el mismo texto para que la barra no
 * nazca en blanco, pero deja de ser quien decide: en cuanto carga el widget,
 * el reposo lo dicta esta función.
 */
function enReposo() {
  setState("LISTO", "ENLACE EN ESPERA", "TOCA PARA HABLAR");
}
enReposo();

function renderConversation(userText = "", agentText = "") {
  if (userText || (agentText && agentText !== config.idleMessage)) markTalk();
  const escape = (value) => value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character]);
  conversation.innerHTML = `${userText ? `<p class="user-line"><b>TÚ /</b> ${escape(userText)}</p>` : ""}<div class="speaker">${escape(config.agentName)} /</div><p class="message">${escape(agentText || config.idleMessage)}</p>`;
  conversation.scrollTop = conversation.scrollHeight;
}

/* ---------------- Escáner: tres estados ----------------
 * El movimiento es lo que comunica en qué está el agente, así que cada
 * estado tiene una figura distinta y se distinguen sin leer la etiqueta:
 *
 *   reposo    · barrido lento y tenue de lado a lado — está encendido y
 *               esperando, sin fingir que ya te escucha.
 *   escucha   · barrido normal; la voz del usuario ensancha el haz.
 *   responde  · expansión del centro hacia los lados, como la caja de voz
 *               de KITT: el volumen empuja las luces hacia afuera.
 *
 * Detalles que lo separan de un LED que parpadea: la posición viene de una
 * sinusoide (la cabeza se frena sola en los extremos; el ir y venir lineal
 * delata la máquina), el brillo cae en curva gaussiana (sin borde duro) y
 * cada LED decae hacia su nivel previo, dejando la estela de un fósforo.
 */
const PHI_REST = 0.618;

/*
 * Rampa del escáner. Antes eran cuatro constantes ámbar fijas: el color del
 * único elemento que el visitante mira fijamente quedaba fuera del alcance del
 * tema, y cualquier marca que no fuera S1GNAL terminaba con un dorado prestado.
 *
 * Ahora se leen de variables CSS, así que la rampa la manda la hoja de marca.
 * Si no están definidas, se conserva el ámbar original del motor y nada cambia
 * para quien ya lo tenía instalado.
 */
function readRamp(name, fallback, element = document.documentElement) {
  const raw = getComputedStyle(element).getPropertyValue(name).trim();
  if (!raw) return fallback;
  const channels = raw.split(/[\s,]+/).map(Number);
  return channels.length === 3 && channels.every((n) => Number.isFinite(n))
    ? channels
    : fallback;
}

/*
 * La rampa se lee por elemento, no sólo de :root.
 *
 * El launcher y el panel flotante viven sobre la superficie clara de la marca;
 * la barra impone la suya, oscura. Con una sola rampa global los segmentos
 * apagados —pensados como una línea clarita sobre niebla— salían casi blancos
 * en la barra y la ranura se leía como un código de barras. Cada superficie
 * pide la suya y el motor pinta con la que le toca.
 */
function rampaDe(element) {
  return {
    off: readRamp("--vw-seg-off", [61, 42, 5], element),
    dim: readRamp("--vw-seg-dim", [138, 90, 0], element),
    on: readRamp("--vw-seg-on", [255, 176, 0], element),
    hot: readRamp("--vw-seg-hot", [255, 231, 176], element),
    glow: readRamp("--vw-seg-glow", [255, 176, 0], element).join(","),
  };
}

const RAMPA_RAIZ = rampaDe(document.documentElement);
// La del escáner grande: se resuelve contra el panel, que es quien conoce su
// propia superficie. Se recalcula al encender la barra.
let rampaEscaner = RAMPA_RAIZ;
const scanLevel = new Float32Array(pixels.length);
const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function mixChannel(a, b, t) {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}

function paintSegment(segment, value, ramp = RAMPA_RAIZ) {
  let color;
  if (value < 0.5) color = mixChannel(ramp.off, ramp.dim, value / 0.5);
  else if (value < 0.86) color = mixChannel(ramp.dim, ramp.on, (value - 0.5) / 0.36);
  else color = mixChannel(ramp.on, ramp.hot, (value - 0.86) / 0.14);
  segment.style.background = color;
  segment.style.boxShadow = value > 0.45
    ? `0 0 ${(12 * value).toFixed(1)}px rgba(${ramp.glow},${(value * 0.72).toFixed(2)})`
    : "none";
}

function bell(distance, sigma) {
  return Math.exp(-(distance * distance) / (2 * sigma * sigma));
}

// `decay` es la persistencia de fósforo: 0 apaga de golpe, cerca de 1 deja
// estela larga. Se aplica sobre el nivel del frame anterior.
function applyLevels(compute, decay) {
  pixels.forEach((segment, index) => {
    const target = compute(index);
    scanLevel[index] = decay > 0 ? Math.max(target, scanLevel[index] * decay) : target;
    paintSegment(segment, scanLevel[index], rampaEscaner);
  });
}

function runScanner(mode, analyser, label) {
  cancelAnimationFrame(animationFrame);
  if (label) reactorState.textContent = label;

  const count = pixels.length;
  const last = count - 1;
  const baseSigma = Math.max(1.2, count * 0.075);

  if (prefersReducedMotion) {
    applyLevels((index) => bell(index - PHI_REST * last, baseSigma), 0);
    return;
  }

  const data = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
  const readAmplitude = () => {
    if (!analyser) return 0;
    analyser.getByteFrequencyData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i += 1) sum += data[i];
    return Math.min(1, sum / data.length / 90);
  };

  const step = (time) => {
    const amplitude = readAmplitude();

    if (mode === "speak") {
      // Halo anclado al centro cuyo ANCHO lo gobierna el timbre, no el volumen.
      //
      // Con el volumen no funcionaba: mientras alguien habla es casi constante
      // y solo cae en las pausas, así que el halo se veía congelado. El centro
      // espectral sí cambia en cada fonema — una vocal concentra energía en
      // graves, una "s" en agudos — y eso ocurre varias veces por segundo.
      //
      // Mapear la frecuencia a la posición del LED tampoco servía: la energía
      // de los agudos caía donde la envolvente ya está oscura, así que las
      // consonantes apagaban el halo en vez de animarlo. Aquí el espectro
      // decide qué tan ancho se abre y el brillo se mantiene alto mientras
      // habla, que es como se comporta el indicador de voz de Siri.
      let spectralEnergy = 0;
      let weighted = 0;
      if (data) {
        const usable = Math.max(1, Math.floor(data.length * 0.6));
        for (let i = 0; i < usable; i += 1) {
          const v = data[i] / 255;
          spectralEnergy += v;
          weighted += v * i;
        }
        // Centroide normalizado 0..1: grave → 0, agudo → 1.
        weighted = spectralEnergy > 0.001 ? (weighted / spectralEnergy) / usable : 0;
      }
      const breath = 0.5 + 0.5 * Math.sin(time / 1100);
      const drive = 0.35 * amplitude + 0.65 * weighted;
      const reach = 1.6 + drive * 3.2;      // ~3 vecinos en silencio, ~8 en agudos
      const glow = Math.max(0.55 + 0.45 * amplitude, breath * 0.3);
      const center = last / 2;
      applyLevels((index) => bell(index - center, reach) * glow, 0.8);
    } else {
      const idle = mode === "idle";
      const period = idle ? 6200 : 2600 + count * 12;
      const head = (Math.sin((time / period) * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5) * last;
      // En reposo el haz es más fino y nunca llega a incandescente: se nota
      // que está vivo sin competir con el contenido de la página.
      const sigma = idle ? baseSigma * 0.8 : baseSigma * (1 + amplitude * 0.9);
      const ceiling = idle ? 0.52 : 1;
      applyLevels((index) => bell(index - head, sigma) * ceiling, idle ? 0.93 : 0.9);
    }

    animationFrame = requestAnimationFrame(step);
  };
  animationFrame = requestAnimationFrame(step);
}

function animateIdle() {
  runScanner("idle", null, null);
}

function startVisual(analyser, label, mode) {
  runScanner(mode || "listen", analyser, label);
}

// El símbolo del launcher corre el mismo barrido lento de reposo, en
// miniatura: es la afordancia que hace que el ojo lo encuentre, y usa la
// misma rampa de color que el escáner grande para que nunca se desincronicen.
document.querySelectorAll(".mk-slit[data-scanner]").forEach((slit) => {
  const count = parseInt(slit.getAttribute("data-count"), 10) || 7;
  const segments = [];
  for (let index = 0; index < count; index += 1) {
    const segment = document.createElement("i");
    slit.appendChild(segment);
    segments.push(segment);
  }
  const last = count - 1;
  const sigma = Math.max(1.05, count * 0.13);
  const levels = new Float32Array(count);

  const paintAt = (head, ceiling, decay) => {
    segments.forEach((segment, index) => {
      const target = bell(index - head, sigma) * ceiling;
      levels[index] = decay > 0 ? Math.max(target, levels[index] * decay) : target;
      paintSegment(segment, levels[index]);
    });
  };

  if (prefersReducedMotion) {
    paintAt(PHI_REST * last, 0.85, 0);
    return;
  }
  const tick = (time) => {
    const head = (Math.sin((time / 6200) * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5) * last;
    paintAt(head, 0.85, 0.9);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

function bytesToBase64(bytes) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary);
}

function floatToPCM16Base64(samples) {
  const pcm = new Int16Array(samples.length);
  samples.forEach((sample, index) => {
    const clamped = Math.max(-1, Math.min(1, sample));
    pcm[index] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
  });
  return bytesToBase64(new Uint8Array(pcm.buffer));
}

/*
 * ── Por qué hay remuestreo ──────────────────────────────────────────────────
 *
 * El protocolo de Gemini es fijo: se le manda audio a 16 kHz y él contesta a
 * 24 kHz. Lo natural es abrir un AudioContext para cada cosa, con su frecuencia
 * — y eso es lo que hacía este widget.
 *
 * En iPhone eso significa no oír nada. iOS maneja UNA sola frecuencia de
 * hardware a la vez: el segundo AudioContext que se abre con otra frecuencia se
 * crea sin error, reporta `running`, y entrega SILENCIO. Aquí el de salida se
 * abría primero (24 kHz) y el de entrada después (16 kHz), así que el micrófono
 * era el mudo. Diagnóstico en un iPhone 18.7: permiso concedido, pista
 * «Micrófono del iPhone» activa, nivel de entrada 1 sobre 128.
 *
 * Por eso ahora hay UN solo contexto, a la frecuencia que el aparato quiera
 * darnos, y se convierte a la entrada y a la salida. Es más código, pero es el
 * único arreglo que funciona en los dos lados: en escritorio da igual, y en
 * teléfono es la diferencia entre que te oiga o no.
 */
const HZ_HACIA_GEMINI = 16000;
const HZ_DESDE_GEMINI = 24000;

/**
 * Interpolación lineal entre frecuencias. Para voz es de sobra: los saltos que
 * introduce viven muy por encima de lo que articula una persona.
 */
function remuestrear(muestras, hzOrigen, hzDestino) {
  if (!muestras.length || hzOrigen === hzDestino) return muestras;
  const razon = hzOrigen / hzDestino;
  const salida = new Float32Array(Math.max(1, Math.round(muestras.length / razon)));
  for (let i = 0; i < salida.length; i += 1) {
    const posicion = i * razon;
    const base = Math.floor(posicion);
    const resto = posicion - base;
    const a = muestras[base] ?? 0;
    const b = muestras[base + 1] ?? a;
    salida[i] = a + (b - a) * resto;
  }
  return salida;
}

function nivelRms(muestras) {
  if (!muestras.length) return 0;
  let suma = 0;
  for (let i = 0; i < muestras.length; i += 1) {
    suma += muestras[i] * muestras[i];
  }
  return Math.sqrt(suma / muestras.length);
}

function limpiarAudioTemprano() {
  earlyAudioRing = [];
  earlyAudioRingSamples = 0;
  earlyAudioQueue = [];
  earlyAudioQueueSamples = 0;
  earlySpeechDetected = false;
}

function guardarAudioTemprano(data, samples, rms) {
  const chunk = { data, samples };
  const yaHabiaVoz = earlySpeechDetected;

  earlyAudioRing.push(chunk);
  earlyAudioRingSamples += samples;
  while (
    earlyAudioRingSamples > EARLY_AUDIO_PREROLL_SAMPLES &&
    earlyAudioRing.length > 1
  ) {
    const removed = earlyAudioRing.shift();
    earlyAudioRingSamples -= removed.samples;
  }

  if (!yaHabiaVoz && rms >= EARLY_SPEECH_RMS) {
    earlySpeechDetected = true;
    earlyAudioQueue = [...earlyAudioRing];
    earlyAudioQueueSamples = earlyAudioRingSamples;
    return;
  }

  if (
    yaHabiaVoz &&
    earlyAudioQueueSamples < EARLY_AUDIO_MAX_SAMPLES
  ) {
    earlyAudioQueue.push(chunk);
    earlyAudioQueueSamples += samples;
  }
}

function enviarAudio(data) {
  socket.send(JSON.stringify({
    realtimeInput: {
      audio: { data, mimeType: "audio/pcm;rate=16000" },
    },
  }));
}

function vaciarAudioTemprano() {
  const habiaVoz =
    earlySpeechDetected &&
    earlyAudioQueue.length > 0 &&
    socket?.readyState === WebSocket.OPEN;

  if (habiaVoz) {
    noteInput("voice");
    earlyAudioQueue.forEach((chunk) => enviarAudio(chunk.data));
  }
  limpiarAudioTemprano();
  return habiaVoz;
}

function base64ToFloat(base64) {
  const binary = atob(base64);
  const samples = new Float32Array(Math.floor(binary.length / 2));
  for (let index = 0; index < samples.length; index += 1) {
    const low = binary.charCodeAt(index * 2);
    const high = binary.charCodeAt(index * 2 + 1);
    const unsigned = low | (high << 8);
    const signed = unsigned & 0x8000 ? unsigned - 0x10000 : unsigned;
    samples[index] = signed / 32768;
  }
  // Gemini contesta a 24 kHz; el contexto corre a la frecuencia del aparato.
  // Sin esta conversión la voz sonaría acelerada o arrastrada según el equipo.
  return remuestrear(samples, HZ_DESDE_GEMINI, outputContext?.sampleRate ?? HZ_DESDE_GEMINI);
}

function prepareOutputGraph() {
  // Una sola promesa representa TODA la preparación. Safari podía entrar aquí
  // en reposo y, durante ese mismo trabajo, recibir el toque: la segunda llamada
  // veía que ya había contexto y continuaba aunque los worklets aún no existían.
  // El resultado era intermitente por definición: dependía de quién ganara la
  // carrera. Ahora todas las entradas esperan exactamente el mismo trabajo.
  if (outputPreparation) return outputPreparation;

  const preparation = (async () => {
  /*
   * Sin forzar frecuencia: se toma la del aparato. Pedir 24 kHz aquí es lo que
   * dejaba mudo al micrófono en iPhone, porque después el de entrada pedía
   * 16 kHz y iOS no admite dos.
  */
    outputContext = new AudioContext();
  // Los dos módulos se traen juntos. Antes `capture.worklet.js` empezaba a
  // descargarse sólo DESPUÉS de conceder el micrófono, sumando otra espera
  // visible justo en Safari móvil.
    await Promise.all([
      outputContext.audioWorklet.addModule(AUDIO_PROCESSORS + "playback.worklet.js"),
      outputContext.audioWorklet.addModule(AUDIO_PROCESSORS + "capture.worklet.js"),
    ]);
    playbackNode = new AudioWorkletNode(outputContext, "signal-pcm-playback");
  // El worklet es el único que sabe cuándo la bocina se calló de verdad. Ese
  // aviso —y no `turnComplete`— es el que reabre el micrófono.
  playbackNode.port.onmessage = ({ data }) => {
    if (data?.type === "playback-underrun") {
      playbackMetrics.underruns += 1;
      return;
    }
    if (data?.type === "playback-stats") {
      playbackMetrics = {
        underruns: Number(data.underruns) || 0,
        preloadMs: Number(data.preloadMs) || 0,
        maxQueuedMs: Number(data.maxQueuedMs) || 0,
      };
      return;
    }
    if (data === "drained") alDejarDeSonar();
  };
  outputAnalyser = outputContext.createAnalyser();
  // 256 -> 128 bandas: el espejo espectral del estado "responde" necesita
  // resolución fina, con 32 bandas el halo se veía escalonado y quieto.
  outputAnalyser.fftSize = 256;
  // Menos suavizado que la entrada: queremos que el espectro se mueva.
  outputAnalyser.smoothingTimeConstant = 0.6;
    playbackNode.connect(outputAnalyser).connect(outputContext.destination);
  })();
  outputPreparation = preparation;
  // Un fallo de caché o de carga no condena todos los intentos posteriores.
  // Se descarta únicamente esta preparación; el siguiente toque construye una
  // nueva desde cero.
  preparation.catch(() => {
    if (outputPreparation !== preparation) return;
    outputContext?.close();
    outputPreparation = undefined;
    outputContext = outputAnalyser = playbackNode = undefined;
  });

  return outputPreparation;
}

async function initOutput() {
  const preparation = prepareOutputGraph();
  // `resume()` se invoca antes del primer `await`: si esta llamada nació de un
  // pointer/click, Safari todavía la reconoce como parte del gesto. Esperar a
  // que acaben los worklets primero perdería esa ventana de autorización.
  const resume = outputContext?.state === "suspended"
    ? outputContext.resume()
    : Promise.resolve();
  await Promise.all([preparation, resume]);
}

async function initInput() {
  /*
   * El micrófono se pide PRIMERO. Antes que el contexto, antes que el worklet,
   * antes que nada que espere.
   *
   * Safari sólo concede `getUserMedia` mientras dura el gesto de la persona, y
   * cualquier `await` que cruce la red rompe esa ventana. Aquí se pedía después
   * de traer el token —una petición HTTP completa— así que en Safari el
   * micrófono NUNCA abría: la barra se desplegaba, S1gnal saludaba con su voz
   * perfecta, y no oía a nadie. En Chromium funciona igual en cualquier orden,
   * que es por qué pasó todas mis pruebas.
   */
  inputStream = await navigator.mediaDevices.getUserMedia({
    audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
  });
  /*
   * El MISMO contexto que la salida. Abrir uno propio para la entrada es
   * exactamente lo que rompía el micrófono en iPhone.
   */
  await initOutput();
  inputContext = outputContext;
  const source = inputContext.createMediaStreamSource(inputStream);
  inputAnalyser = inputContext.createAnalyser();
  inputAnalyser.fftSize = 64;
  inputAnalyser.smoothingTimeConstant = 0.72;
  captureNode = new AudioWorkletNode(inputContext, "signal-audio-capture");
  const silentGain = inputContext.createGain();
  silentGain.gain.value = 0;
  source.connect(inputAnalyser).connect(captureNode).connect(silentGain).connect(inputContext.destination);
  captureNode.port.onmessage = ({ data }) => {
    if (data.type !== "audio") return;
    // El micrófono está apagado: no sale audio. El contrato es un interruptor,
    // no un botón que se sostiene.
    if (isBar && !transmitiendo) return;
    // Mientras S1gnal habla, el micrófono no manda: su propia voz volvería a
    // entrar por la bocina y nunca cedería el turno.
    if (modeloHablando) return;
    // Se captura a la frecuencia del aparato y se entrega a 16 kHz, que es lo
    // único que Gemini entiende.
    const aGemini = remuestrear(data.data, inputContext.sampleRate, HZ_HACIA_GEMINI);
    const encoded = floatToPCM16Base64(aGemini);

    if (socket?.readyState === WebSocket.OPEN && connected) {
      enviarAudio(encoded);
      return;
    }

    // La persona no tiene por qué conocer la diferencia entre «micrófono
    // abierto» y «WebSocket listo». Si empieza a hablar durante ese segundo,
    // conservamos su primera frase y la entregamos en cuanto Gemini confirme
    // el setup. El RMS sólo decide si había voz; el audio jamás se registra.
    guardarAudioTemprano(encoded, aGemini.length, nivelRms(data.data));
  };
  await inputContext.resume();
}

function sendText(text) {
  if (!text || socket?.readyState !== WebSocket.OPEN || !connected) return;
  userTranscript = text;
  modelTranscript = "";
  renderConversation(userTranscript, "Estoy revisando tu mensaje.");
  beginTurn("text");
  socket.send(JSON.stringify({ realtimeInput: { text } }));
  reactor.classList.add("thinking");
  setState("PENSANDO", "PROCESANDO", "UN MOMENTO");
}

function withTimeout(promise, timeoutMs) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = window.setTimeout(
        () => reject(new Error("La herramienta tardó demasiado en responder.")),
        timeoutMs,
      );
    }),
  ]).finally(() => window.clearTimeout(timer));
}

async function dispatchToolCall(name, args) {
  const timeoutMs = Math.min(30000, Math.max(1000, Number(config.toolTimeoutMs) || 15000));
  if (typeof config.onToolCall === "function") {
    return withTimeout(Promise.resolve().then(() => config.onToolCall(name, args)), timeoutMs);
  }
  if (!config.toolWebhookUrl) {
    console.warn(`[VoiceWidget] Tool call "${name}" recibida pero no hay toolWebhookUrl ni onToolCall configurados.`);
    return { ok: false, error: "tool_not_wired" };
  }
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(config.toolWebhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, args }),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `El backend respondió ${response.status}`);
    return data;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("La herramienta tardó demasiado en responder.");
    }
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

/* ---------------- Saludo inmediato ----------------
 *
 * El saludo es una frase fija. Generarlo en Live en cada sesión añadía entre
 * 1.8 y 2.3 s DESPUÉS de que iPhone terminara de abrir su audio. Este asset usa
 * la misma voz Aoede y empieza dentro del gesto de la persona, mientras el
 * enlace real se levanta por detrás. La instrucción del agente deja asentado
 * que esa bienvenida ya ocurrió, así que el primer turno entra directo.
 */
function terminarSaludoLocal(notify = true) {
  if (!localGreetingPlaying) return false;
  localGreetingPlaying = false;
  localGreetingAudio?.pause();
  if (localGreetingAudio) localGreetingAudio.currentTime = 0;
  if (notify) alDejarDeSonar();
  else marcarQueTermino();
  return true;
}

function solicitarSaludoEnVivo() {
  if (
    !connected ||
    !config.autoGreet ||
    pendingPrompt ||
    socket?.readyState !== WebSocket.OPEN
  ) return;

  renderConversation("", "…");
  reactor.classList.add("thinking");
  setState("PENSANDO", "PROCESANDO", "UN MOMENTO");
  beginTurn("greeting");
  socket.send(JSON.stringify({
    realtimeInput: { text: sessionGreetingPrompt },
  }));
}

function iniciarSaludoLocal() {
  if (!localGreetingAudio || !config.localGreetingText || localGreetingPlaying) {
    return false;
  }

  localGreetingStarted = true;
  localGreetingPlaying = true;
  localGreetingStartedAt = nowMs();
  modeloHablando = true;
  despedidaPendiente = false;
  interruptButton.disabled = false;
  if (isBar) panel.classList.add("is-answering");
  markTalk();
  renderConversation("", config.localGreetingText);
  setState("HABLANDO", `${config.agentName.toUpperCase()} RESPONDE`, "PUEDES INTERRUMPIR");
  // Sin analizador todavía hay un pulso orgánico; el audio real llegará al
  // analizador en los turnos del Live API.
  startVisual(null, `${config.agentName.toUpperCase()} RESPONDE`, "speak");

  localGreetingAudio.onended = () => {
    if (!localGreetingPlaying) return;
    localGreetingPlaying = false;
    localGreetingAudio.currentTime = 0;
    alDejarDeSonar();
  };
  localGreetingAudio.onerror = () => {
    const habiaEmpezado = localGreetingStarted;
    terminarSaludoLocal(false);
    localGreetingStarted = false;
    if (habiaEmpezado) solicitarSaludoEnVivo();
  };

  const playback = localGreetingAudio.play();
  if (playback && typeof playback.catch === "function") {
    playback.catch(() => {
      if (!localGreetingPlaying) return;
      terminarSaludoLocal(false);
      localGreetingStarted = false;
      solicitarSaludoEnVivo();
    });
  }
  return true;
}

async function handleServerMessage(event) {
  const raw = typeof event.data === "string" ? event.data : await event.data.text();
  const message = JSON.parse(raw);

  if (message.setupComplete) {
    window.clearTimeout(connectionTimer);
    connected = true;
    talkButton.classList.add("listening");
    talkButton.setAttribute("aria-label", "Detener conversación");
    interruptButton.disabled = false;

    if (!localGreetingPlaying) {
      setState("TE ESCUCHO", "ESCUCHANDO", "TE ESCUCHO");
      startVisual(inputAnalyser, "ESCUCHANDO", "listen");
    }
    const habloMientrasConectaba = vaciarAudioTemprano();
    flushSessionTelemetry(habloMientrasConectaba);
    if (pendingPrompt) {
      const prompt = pendingPrompt;
      pendingPrompt = "";
      sendText(prompt);
    } else if (config.autoGreet && !localGreetingStarted && !habloMientrasConectaba) {
      /*
       * Se le cede el turno con una señal neutra definida por el servidor.
       *
       * El primer intento le mandaba un texto —«preséntate y pregunta en qué
       * ayudas»— y eso resultó peor que no saludar: el modelo tomó esa frase
       * como el arranque real de la conversación, se saltó su guion y se puso a
       * dar la demostración de corrido. El argumento de venta completo, que
       * está escrito con cuidado en su instrucción, se perdió por una línea
       * puesta encima.
       *
       * El turno vacío dejó de iniciar respuesta al fijar Gemini 2.5 Live. Una
       * señal neutra por `realtimeInput` funciona en 2.5 y 3.1, y el contenido
       * concreto sigue mandado por la instrucción del perfil.
       */
      renderConversation("", "…");
      reactor.classList.add("thinking");
      setState("PENSANDO", "PROCESANDO", "UN MOMENTO");
      beginTurn("greeting");
      socket.send(JSON.stringify({
        realtimeInput: { text: sessionGreetingPrompt },
      }));
    } else if (!localGreetingStarted) {
      // Sin esto, la conversación se queda anclada en "Iniciando enlace de voz
      // seguro…" aunque la sesión ya esté abierta.
      renderConversation(
        "",
        habloMientrasConectaba ? "Te escuché." : config.readyMessage,
      );
    }
    return;
  }

  // Tool calling en vivo: el modelo puede invocar funciones a mitad de la
  // conversación de voz. Aquí se despachan al backend (o al hook local) y
  // la respuesta se reenvía al modelo para que continúe hablando.
  if (message.toolCall) {
    const functionCalls = message.toolCall.functionCalls || [];
    for (const call of functionCalls) {
      const toolStartedAt = nowMs();
      try {
        const result = await dispatchToolCall(call.name, call.args || {});
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            toolResponse: {
              functionResponses: [{ response: { output: result }, id: call.id }],
            },
          }));
        }
      } catch (err) {
        console.error(`[VoiceWidget] Error ejecutando tool call "${call.name}":`, err);
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            toolResponse: {
              functionResponses: [{ response: { output: { ok: false, error: String(err.message || err) } }, id: call.id }],
            },
          }));
        }
      } finally {
        noteTool(nowMs() - toolStartedAt);
      }
    }
  }

  const serverContent = message.serverContent;
  if (!serverContent) return;

  const inputText = serverContent.inputTranscription?.text;
  const outputText = serverContent.outputTranscription?.text;
  if (inputText) {
    userTranscript += inputText;
    noteInput("voice");
  }
  if (outputText) modelTranscript += outputText;
  if (inputText || outputText) renderConversation(userTranscript.trim(), modelTranscript.trim() || "Te escucho…");

  for (const part of serverContent.modelTurn?.parts || []) {
    if (part.inlineData?.data) {
      const muestras = base64ToFloat(part.inlineData.data);
      const outputSampleRate = outputContext?.sampleRate || HZ_DESDE_GEMINI;
      const seconds = muestras.length / outputSampleRate;
      noteAudio(muestras.length, outputSampleRate);
      playbackNode?.port.postMessage(muestras, [muestras.buffer]);
      // Empieza a sonar: se cierra el micrófono para que no se oiga a sí mismo.
      // Se le dice cuánto dura este fragmento para que el vigilante sepa hasta
      // cuándo es normal que siga sonando.
      marcarQueHabla(seconds);
      reactor.classList.remove("thinking");
      // Aquí EMPIEZA a responder: es cuando se puede interrumpir, no antes.
      if (isBar) panel.classList.add("is-answering");
      setState("HABLANDO", `${config.agentName.toUpperCase()} RESPONDE`, "PUEDES INTERRUMPIR");
      startVisual(outputAnalyser, `${config.agentName.toUpperCase()} RESPONDE`, "speak");
    }
  }

  if (serverContent.interrupted) {
    // Se tira el colchón, así que deja de sonar ya: no hay «drained» que
    // esperar porque no queda nada por reproducir.
    playbackNode?.port.postMessage("interrupt");
    despedidaPendiente = false;
    alDejarDeSonar();
  }
  if (serverContent.turnComplete) {
    if (turnMetrics) {
      turnMetrics.serverTurnCompleteMs = Math.round(nowMs() - turnMetrics.startedAt);
    }
    /*
     * El modelo terminó de GENERAR. No de sonar.
     *
     * Genera varias veces más rápido de lo que se habla, así que cuando esto
     * llega puede quedar media respuesta en el colchón. Aquí sólo se le dice al
     * worklet que suelte lo que retiene —si no, el final de la frase se
     * quedaría atrapado esperando muestras que ya no vienen— y se espera su
     * aviso. Reabrir el micrófono en este punto era abrirlo encima de la propia
     * voz de S1gnal durante todo el resto de la respuesta.
     */
    playbackNode?.port.postMessage("drain");
    /*
     * Si se despidió, la sesión se cierra cuando acabe de sonar.
     *
     * Una barra de voz que sigue abierta después del «hasta luego» deja el
     * micrófono encendido y la mitad de la pantalla ocupada mientras la persona
     * quiere navegar. Nadie vuelve a tocar el botón de cerrar cuando la
     * conversación ya terminó: simplemente se va con la barra puesta.
     *
     * Antes se le daban 2.5 s a ojo para que terminara la despedida. Ya no hace
     * falta adivinar: el worklet avisa.
     */
    if (seDespidio(modelTranscript)) despedidaPendiente = true;
    reactor.classList.remove("thinking");
    userTranscript = "";
    modelTranscript = "";
  }
}

/* ---------------- Enlace precalentado ----------------
 * El estado «conectando» era trabajo hecho en el peor momento: cuando la
 * persona ya quería hablar. Ahora el token, los worklets y el contexto de
 * salida se preparan al abrir la barra —que ya es un gesto del usuario, así
 * que el navegador deja levantar audio— y al encender el micrófono ya está
 * todo listo.
 *
 * El servidor sólo da 60 s para ABRIR sesión con un token (newSessionExpireTime),
 * así que el precalentado caduca antes que él y, si se pasó, se pide uno nuevo.
 */
const TOKEN_WINDOW_MS = 50 * 1000;
let warmToken = null;
let warming = null;

async function requestToken() {
  const response = await fetch(config.tokenEndpoint, { method: "POST", headers: { accept: "application/json" } });
  const credentials = await response.json();
  if (!response.ok || !credentials.token)
    throw new Error(credentials.error || "No fue posible iniciar el agente de voz.");
  return { ...credentials, at: Date.now() };
}

function tokenVigente() {
  return warmToken && Date.now() - warmToken.at < TOKEN_WINDOW_MS;
}

/** Prepara el enlace sin abrir sesión. Falla en silencio: es adelanto, no camino. */
function precalentar() {
  // El micrófono NO se adelanta a propósito: abrirlo encendería el indicador de
  // grabación del navegador por el solo hecho de abrir la barra. Se pide cuando
  // la persona lo enciende, que es cuando de verdad va a hablar.
  void initOutput().catch(() => {});

  if (tokenVigente() || warming) return;
  warming = requestToken()
    .then((credentials) => { warmToken = credentials; })
    .catch(() => { warmToken = null; })
    .finally(() => { warming = null; });
}

/** Devuelve el token precalentado si sigue vivo; si no, pide uno. De un solo uso. */
async function tomarToken() {
  if (warming) await warming;
  if (tokenVigente()) {
    const credentials = warmToken;
    warmToken = null;
    return credentials;
  }
  warmToken = null;
  return requestToken();
}

async function startSession(prompt = "") {
  if (socket || inputStream) return;
  pendingPrompt = prompt;
  chips.style.visibility = "hidden";
  limpiarAudioTemprano();
  sessionMetrics = {
    startedAt: gestureStartedAt || nowMs(),
    micReadyAt: null,
    warmToken: Boolean(tokenVigente()),
    localGreeting: localGreetingStarted,
    localGreetingAt: localGreetingStartedAt,
  };
  // Con el enlace precalentado no hay nada que esperar, así que tampoco hay que
  // anunciar una espera: se pasa directo a escuchar.
  if (localGreetingPlaying) {
    // El saludo ya confirma que el gesto funcionó; cambiar a «conectando» por
    // encima haría parecer que la voz y la interfaz discrepan.
  } else if (tokenVigente()) {
    setState("TE ESCUCHO", "ABRIENDO MICRÓFONO", "TE ESCUCHO");
  } else {
    setState("CONECTANDO", "CREANDO ENLACE SEGURO", "UN MOMENTO");
    renderConversation("", "Iniciando enlace de voz seguro…");
  }

  try {
    /*
     * Micrófono, luego token. El orden importa y no es preferencia: pedir el
     * token primero mete una petición de red entre el gesto y `getUserMedia`, y
     * Safari deja de considerarlo pedido por la persona.
     */
    await initInput();
    if (sessionMetrics) sessionMetrics.micReadyAt = nowMs();
    // Desde aquí el pre-roll ya conserva voz aunque Gemini siga terminando el
    // enlace. La interfaz puede decir «te escucho» porque ya es verdad.
    if (!localGreetingPlaying) {
      setState("TE ESCUCHO", "ENLACE EN CURSO", "HABLA, YA TE ESCUCHO");
      renderConversation("", "Habla, ya te escucho.");
    }
    const credentials = await tomarToken();
    activeModel = credentials.model || "unknown";
    sessionGreetingPrompt =
      credentials.greetingPrompt || config.greetingPrompt;
    socket = new WebSocket(`${WS_ENDPOINT}?access_token=${encodeURIComponent(credentials.token)}`);
    /*
     * El navegador NO manda `generationConfig`. La voz no se decide aquí.
     *
     * El token ya viaja con el suyo completo —modalidad, temperatura y
     * `speechConfig` con la voz Aoede (api/voice/token/route.ts)—. El servidor
     * mezcla este `setup` sobre el del token campo por campo del primer nivel:
     * lo que el navegador manda, reemplaza; lo que calla, se hereda. Mandar un
     * `generationConfig` con sólo la modalidad se llevaba por delante la voz y
     * la temperatura, y se oía la voz por omisión de Gemini.
     *
     * Que `systemInstruction` y `tools` sí funcionaran —y este widget nunca los
     * manda— es la prueba de que la herencia existe: el único campo que se
     * perdía era justo el que se pisaba desde aquí.
     *
     * `model` se queda porque el protocolo lo exige en el setup, y no duplica
     * nada: viene del propio servidor en la respuesta del token.
     */
    socket.onopen = () => socket.send(JSON.stringify({
      setup: { model: `models/${credentials.model}` },
    }));
    socket.onmessage = handleServerMessage;
    socket.onerror = () => showError("Se perdió el enlace. Intenta de nuevo.");
    socket.onclose = () => {
      if (connected) showError("La sesión terminó. Puedes iniciar una nueva.");
      cleanupSession(false);
    };
    const openingSocket = socket;
    connectionTimer = window.setTimeout(() => {
      if (connected || socket !== openingSocket) return;
      openingSocket.onclose = null;
      openingSocket.close();
      showError("El enlace tardó demasiado. Toca para intentarlo de nuevo.");
      cleanupSession(false);
    }, 10 * 1000);
    /*
     * Cuánto dura la sesión lo decide el TOKEN, no la página.
     *
     * Estaba declarado en los dos lados y no coincidían: el servidor daba 5
     * minutos al consultorio y la página 30, y como el widget usaba el suyo, el
     * de `profiles.ts` era una cifra muerta que además mentía a quien la leyera.
     * En la landing pasaba al revés: el servidor reservaba 5 «para no cortar a
     * media frase» y la página cortaba a los 3.
     *
     * Ahora manda el token, que es donde vive el resto de la definición del
     * agente —instrucción, herramientas, temperatura—. El `config` queda de
     * respaldo por si un token viejo no lo trae.
     */
    const minutosDeSesion =
      Number(credentials.maxSessionMinutes) || config.maxSessionMinutes;
    sessionTimer = window.setTimeout(
      // No siempre es una demo: adentro del consultorio esto le salía a quien
      // está trabajando, y le decía que su trabajo era una demostración.
      () =>
        stopSession(
          `La sesión de voz se cerró tras ${minutosDeSesion} minutos. Toca el micrófono para seguir.`,
        ),
      minutosDeSesion * 60 * 1000,
    );
  } catch (error) {
    // El error crudo del navegador ("Importing a module script failed") no le
    // dice nada al visitante ni al que instala. Se traduce a la causa real.
    const raw = String(error && error.message || "");
    let message = raw || "No fue posible iniciar el agente de voz.";
    if (/worklet|module script/i.test(raw)) {
      message = "No se cargaron los archivos de audio. Revisa que /audio-processors/ esté publicado.";
      console.error("[VoiceWidget] AudioWorklet no cargó desde:", AUDIO_PROCESSORS, "-", raw);
    } else if (/permission|denied|NotAllowed/i.test(raw)) {
      message = "Necesito permiso del micrófono para escucharte.";
    }
    showError(message);
    cleanupSession();
  }
}

function showError(text) {
  renderConversation("", text);
  setState("SIN ENLACE", "INTENTA DE NUEVO", "TOCA PARA REINTENTAR");
}

function cleanupSession(closeSocket = true) {
  flushTelemetry("session-ended");
  sessionMetrics = null;
  terminarSaludoLocal(false);
  localGreetingStarted = false;
  localGreetingStartedAt = null;
  gestureStartedAt = null;
  limpiarAudioTemprano();
  clearTimeout(sessionTimer);
  clearTimeout(connectionTimer);
  cancelAnimationFrame(animationFrame);
  connected = false;
  if (socket) {
    const currentSocket = socket;
    socket = undefined;
    if (closeSocket && currentSocket.readyState < WebSocket.CLOSING) {
      currentSocket.onclose = null;
      currentSocket.close();
    }
  }
  inputStream?.getTracks().forEach((track) => track.stop());
  inputStream = undefined;
  captureNode?.disconnect();
  playbackNode?.disconnect();
  // Entrada y salida son el MISMO contexto desde que se unificaron por iOS.
  // Cerrarlo dos veces lanza una excepción que abortaba el resto de la
  // limpieza, y con ella quedaba el micrófono encendido.
  outputContext?.close();
  outputPreparation = undefined;
  inputContext = outputContext = inputAnalyser = outputAnalyser = captureNode = playbackNode = undefined;
  talkButton.classList.remove("listening");
  interruptButton.disabled = true;
  reactor.classList.remove("thinking");
  if (isBar) panel.classList.remove("is-answering");
  // El turno muere con la sesión: sin esto, el vigilante de la sesión anterior
  // seguía armado y una despedida a medias reaparecía en la siguiente.
  marcarQueTermino();
  despedidaPendiente = false;
  animateIdle();
}

function stopSession(message = config.idleMessage) {
  cleanupSession();
  renderConversation("", message);
  enReposo();
  chips.style.visibility = "visible";
}

/* ---------------- Modo barra ----------------
 * La barra vive en el marco de la aplicación, no encima. Tres cambios sobre el
 * panel flotante: el micrófono se enciende y se apaga con un toque —o con la
 * barra espaciadora— en vez de con dos clics, hay salida por escrito para
 * micrófono bloqueado o lugar ruidoso, y la zona de conversación crece sólo
 * cuando hay algo que decir.
 */
const isBar = panel.classList.contains("as-bar");
const writeForm = document.getElementById("sg-write");
const writeInput = document.getElementById("sg-input");
let holding = false;
/* Puerta del audio de subida. La sesión y la pista del micrófono siguen vivas
   mientras la barra está abierta —reabrirlas costaría un segundo cada vez—,
   pero el audio sólo sale con el micrófono encendido. Sin esta puerta,
   «apagado» sería sólo un rótulo: seguiría subiendo todo. */
let transmitiendo = false;
/*
 * ── Por qué el micrófono se cierra mientras S1gnal habla ────────────────────
 *
 * Con «mantén para hablar» esto no existía: mientras el modelo respondía, la
 * persona tenía el dedo suelto y el micrófono cerrado. Al cambiar a un
 * interruptor —que es lo correcto para el teléfono— el micrófono se quedó
 * abierto TAMBIÉN mientras la bocina reproduce la respuesta.
 *
 * En una computadora con bocinas eso significa que S1gnal se oye a sí mismo. El
 * cancelador de eco del navegador no cubre este camino: sólo conoce el audio
 * que sale por las rutas de WebRTC, no el de un AudioWorklet conectado a
 * `destination`. Así que su propia voz vuelve a entrar como si fuera la
 * persona, la detección automática de voz cree que alguien sigue hablando, y el
 * turno no termina nunca: habla de corrido y no escucha.
 *
 * Mientras suena, no se manda audio. En cuanto DEJA DE SONAR —no en cuanto el
 * servidor deja de mandarlo— se reabre. Y el botón de interrumpir sigue ahí
 * para cortarlo a media frase.
 */
let modeloHablando = false;
/*
 * Vigilante: si el aviso de que terminó nunca llega —un error de red, un
 * mensaje perdido— el micrófono se quedaría cerrado para siempre y la barra
 * parecería muerta. Cerrar el micrófono por eco es un arreglo; dejarlo cerrado
 * por un mensaje perdido sería un fallo peor que el que vino a resolver.
 */
let vigilanteDeTurno = null;
/*
 * Cuánto audio lleva encolado este turno, en segundos.
 *
 * El vigilante era de 1.5 s fijos desde el último fragmento, y eso ERA parte
 * del defecto: los fragmentos llegan mucho más rápido que el habla, así que a
 * los 1.5 s del último todavía quedaban veinte segundos de respuesta sonando —
 * y el vigilante reabría el micrófono en mitad de la frase. Ahora se le suma
 * lo que falta por reproducir, de modo que sólo puede saltar cuando de verdad
 * algo se perdió.
 */
let segundosDelTurno = 0;

function marcarQueHabla(segundos = 0) {
  modeloHablando = true;
  segundosDelTurno += segundos;
  window.clearTimeout(vigilanteDeTurno);
  vigilanteDeTurno = window.setTimeout(
    () => {
      console.warn("[VoiceWidget] El worklet no avisó que terminó de sonar; se reabre el micrófono por vigilante.");
      marcarQueTermino();
    },
    segundosDelTurno * 1000 + 1500,
  );
}

/**
 * ¿Se despidió S1gnal?
 *
 * Se mira su transcripción, no la de la persona: que el visitante diga «gracias,
 * adiós» no cierra nada —puede estar despidiéndose de alguien más en la
 * oficina—. La conversación termina cuando quien la conduce la da por
 * terminada.
 */
function seDespidio(texto) {
  return /\b(hasta luego|hasta pronto|que estés bien|que te vaya bien|buen d[ií]a|buenas tardes, adi[oó]s|nos vemos|fue un gusto|hasta la pr[oó]xima)\b/i.test(
    texto || "",
  );
}

function marcarQueTermino() {
  modeloHablando = false;
  segundosDelTurno = 0;
  window.clearTimeout(vigilanteDeTurno);
}

/*
 * S1gnal acabó de sonar de verdad: la bocina está en silencio.
 *
 * Aquí —y no en `turnComplete`— es donde se reabre el micrófono, se retira el
 * botón de interrumpir y la barra vuelve a decir que escucha. Antes las tres
 * cosas pasaban cuando el servidor terminaba de mandar, con la respuesta aún
 * en el colchón: el rótulo mentía, el botón de interrumpir desaparecía
 * mientras todavía había algo que interrumpir, y el micrófono abierto se
 * comía la propia voz de S1gnal.
 */
let despedidaPendiente = false;

function alDejarDeSonar() {
  flushTelemetry("drained");
  marcarQueTermino();
  if (isBar) panel.classList.remove("is-answering");
  if (!connected) return;

  if (despedidaPendiente) {
    despedidaPendiente = false;
    // Ya terminó de sonar la despedida: no hay nada que esperar.
    stopSession("Hasta luego. Toca la cápsula cuando quieras seguir.");
    return;
  }

  // Y se dice la verdad: si la persona silenció el micrófono mientras S1gnal
  // hablaba, esto decía TE ESCUCHO sobre un micrófono apagado.
  if (isBar && !transmitiendo) {
    setState("EN SILENCIO", "MICRÓFONO APAGADO", "TOCA PARA HABLAR");
    animateIdle();
    return;
  }
  setState("TE ESCUCHO", "ESCUCHANDO", "TE ESCUCHO");
  startVisual(inputAnalyser, "ESCUCHANDO", "listen");
}
/* Modo alternado: un clic (o Enter) en la ranura deja el micrófono abierto
   hasta el siguiente. Existe para quien no puede sostener — temblor, switch,
   dictado — y para el que simplemente lo prefiere. */
let enganchado = false;
/**
 * Lo llena `enableBar()` en modo barra; fuera de ahí el micrófono se vale por
 * sí mismo con `alternarMicrofono()`.
 */
let alternarDesdeElBoton = null;

/*
 * Encender y apagar el micrófono desde el botón redondo.
 *
 * En un teléfono la ranura de «mantener para hablar» está oculta —es un gesto
 * de escritorio— así que el único control visible es este botón. Y sólo abría
 * la sesión: encendía el micrófono, la barra decía TE ESCUCHO, y el audio se
 * descartaba entero porque nadie ponía `transmitiendo` en verdadero. Se le
 * hablaba a un sistema que no estaba oyendo, sin ninguna señal de que no oía.
 *
 * Quien está parada junto al sillón con guantes y el teléfono en la mano no
 * tiene otro control. Si el micrófono no funciona ahí, la voz no existe.
 */
function alternarMicrofono() {
  if (alternarDesdeElBoton) {
    alternarDesdeElBoton();
    return;
  }
  if (enganchado) {
    enganchado = false;
    panel.classList.remove("is-holding");
    holdEnd();
    return;
  }
  void holdStart().then(() => {
    enganchado = true;
    panel.classList.add("is-holding");
  });
}
/* Se asigna en enableBar; existe fuera para poder llamarla desde openPanel:
   una pestaña en segundo plano congela las transiciones y el transitionend
   que la disparaba puede no llegar nunca. */
let reservarEspacio = () => {};

/* Mide el contenido real de la zona que crece y lo escribe como variable.
   Sin esto la barra dependía de que un vh resolviera dentro de un flex de
   altura automática, que es justo donde falla. */
function medirCrecimiento() {
  const inner = panel.querySelector(".sg-grow-inner");
  if (!inner) return;
  /*
   * Con techo. La medida era el alto completo del contenido, sin límite, así
   * que una respuesta larga —o una tarjeta— empujaba la barra hasta comerse
   * media pantalla. En la demo eso es fatal: tapa el producto que se está
   * enseñando, que es justo lo que hay que ver.
   *
   * Un tercio de la ventana alcanza para leer la última respuesta; lo que no
   * cabe se desplaza dentro de su zona en vez de empujar hacia arriba.
   */
  const techo = Math.round(window.innerHeight / 3);
  panel.style.setProperty(
    "--grow-h",
    Math.min(Math.ceil(inner.scrollHeight), techo) + "px",
  );
}

/** La zona que crece se abre en cuanto hay un turno real. */
function markTalk() {
  medirCrecimiento();
  if (isBar) panel.classList.add("has-talk");
}

/** Enciende el micrófono; si todavía no hay sesión, la abre de paso. */
async function holdStart() {
  if (holding) return;
  holding = true;
  transmitiendo = true;
  panel.classList.add("is-holding");
  if (!socket && !inputStream) await startSession();
}

function holdEnd() {
  // Con el micrófono encendido, esto no apaga: apaga el siguiente toque.
  if (enganchado) return;
  if (!holding) return;
  holding = false;
  transmitiendo = false;
  panel.classList.remove("is-holding");
  /*
   * Y se DICE que está apagado.
   *
   * Con un interruptor, el estado tiene que verse: si al silenciar la barra
   * sigue diciendo TE ESCUCHO, quien habla se queda esperando una respuesta
   * que no va a llegar, sin ninguna pista de por qué. La sesión sigue viva
   * —volver a encenderlo es instantáneo—, lo que se cortó es el micrófono.
   */
  if (connected)
    setState("EN SILENCIO", "MICRÓFONO APAGADO", "TOCA PARA HABLAR");
  /* No se manda `activityEnd`: el token emite la sesión con detección
     automática de voz encendida (api/voice/token/route.ts), y con ella activa
     las señales manuales de turno no aplican. Al cortar el audio el servidor ve
     silencio y cierra el turno por su cuenta a los 700 ms. Para un
     push-to-talk exacto habría que emitir el token con
     `automaticActivityDetection.disabled: true` y mandar las dos señales; es
     un cambio de servidor y no se puede probar sin GEMINI_API_KEY. */
}

function enableBar() {
  if (!isBar) return;

  // La barra impone superficie oscura: su rampa la define ella, no :root.
  rampaEscaner = rampaDe(panel);
  animateIdle();

  /* La barra es fija, así que por sí sola taparía el contenido — exactamente el
     defecto que veníamos a corregir. Se mide y se reserva ese espacio al final
     de la página, y se vuelve a medir cuando la barra crece o cambia el ancho. */
  reservarEspacio = () => {
    // offsetHeight, no getBoundingClientRect: la reserva es de layout y no
    // debe encogerse si el panel está a media transición (o congelado en una
    // pestaña de fondo, donde el morph queda a escala de cápsula).
    const alto = panel.classList.contains("is-open") ? panel.offsetHeight : 0;
    document.body.style.paddingBottom = alto ? `${Math.round(alto)}px` : "";
    /*
     * Y la altura se publica, porque el padding del cuerpo no mueve nada que
     * esté fijo.
     *
     * La navegación del celular vive pegada abajo con `position: fixed`, así
     * que la barra de voz se le montaba encima —84 píxeles de barra sobre 60 de
     * navegación, con más z-index— y quien estaba junto al sillón no podía
     * cambiar de módulo en todo el día. Ahora cualquier elemento fijo puede
     * apartarse solo con `bottom: var(--s1gnal-bar-h)`.
     */
    document.documentElement.style.setProperty(
      "--s1gnal-bar-h",
      alto ? `${Math.round(alto)}px` : "0px",
    );
  };
  if (typeof ResizeObserver === "function") {
    new ResizeObserver(reservarEspacio).observe(panel);
    // El contenido de la conversación llega después de markTalk en varias
    // rutas, así que la altura se vuelve a medir cada vez que cambia.
    const interior = panel.querySelector(".sg-grow-inner");
    if (interior) new ResizeObserver(medirCrecimiento).observe(interior);
  }
  window.addEventListener("resize", reservarEspacio);
  panel.addEventListener("transitionend", reservarEspacio);

  /* Barra espaciadora sostenida — pero SÓLO con el foco dentro de la barra.
   *
   * La versión global secuestraba el teclado de toda la landing: se perdía el
   * scroll por espacio, Shift+espacio y la activación de cualquier botón de la
   * página mientras la barra estuviera abierta. Al abrir, el foco aterriza en
   * la ranura, así que el gesto funciona de inmediato; si la persona se va a
   * leer la página, la página recupera su teclado. */
  document.addEventListener("keydown", (event) => {
    if (event.code !== "Space") return;
    const el = document.activeElement;
    const escribiendo = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
    if (escribiendo || !panel.classList.contains("is-open")) return;

    /* Dos reglas según la superficie.
     *
     * En la landing (la barra es una invitación sobre una página de venta),
     * espacio sólo habla con el foco DENTRO de la barra: la página conserva su
     * scroll y sus botones.
     *
     * Dentro de la app (startOpen: la barra es el marco de la operación),
     * espacio habla desde donde estés — la mano no sale del teclado, que es la
     * promesa del diseño. La barra abre sola sin robar el foco, así que exigir
     * foco aquí era exigir lo imposible: espacio no funcionaba nunca. Sólo se
     * respeta el control interactivo enfocado, para no robarle su activación
     * por teclado. */
    if (!panel.contains(el)) {
      if (!config.startOpen) return;
      const interactivo =
        el && el !== document.body &&
        (el.tagName === "BUTTON" || el.tagName === "A" || el.tagName === "SELECT" || el.tagName === "SUMMARY");
      if (interactivo) return;
    }

    /* El preventDefault va ANTES de descartar la repetición: la ráfaga de
     * `repeat` de una tecla sostenida salía sin cancelar y el navegador hacía
     * lo suyo con espacio — bajar la página. También cancela la activación por
     * teclado del botón enfocado, que si no cerraba la barra o disparaba el
     * clic de la ranura encima del hold. */
    event.preventDefault();
    if (event.repeat) return;
    // Un toque enciende, otro apaga. Sostener era el gesto original y resultó
    // el problema: ver más abajo.
    alternarMicrofono();
  });
  /*
   * ── El micrófono se apaga si la pestaña deja de VERSE, no si pierde el foco ──
   *
   * Esto era un `blur`, y era la causa de que el landing no oyera a nadie.
   *
   * El diálogo de permiso del micrófono es interfaz del navegador: al abrirse,
   * la página pierde el foco y dispara `blur`. Y se abre justo DENTRO de
   * `holdStart()`, mientras `getUserMedia` está esperando la respuesta. Así que
   * el orden real era éste:
   *
   *   1. la persona toca la cápsula
   *   2. `holdStart()` pone `transmitiendo = true` y llama a `getUserMedia`
   *   3. aparece el diálogo → `blur` → `holdEnd()` → `transmitiendo = false`
   *      (en silencio: `enganchado` todavía es falso, así que ni siquiera
   *      cambiaba el rótulo, y `connected` tampoco era cierto)
   *   4. la persona concede el permiso, la sesión abre
   *   5. `.then(() => marcarEnganche(true))` vuelve a encender la barra
   *
   * Resultado: TE ESCUCHO en pantalla, `is-holding` puesto, la sesión viva y
   * S1gnal saludando con su voz — y `transmitiendo` en falso, así que
   * `captureNode` descartaba cada paquete antes de mandarlo. Todo funcionaba
   * salvo lo único que importaba. Por eso el diagnóstico daba bien en cada
   * eslabón por separado: ninguno estaba roto.
   *
   * Pega sobre todo en el landing porque ahí es donde alguien pide el micrófono
   * por primera vez, y porque `autoStart` lo pide en el mismo gesto de abrir.
   *
   * `blur` era además herencia del gesto viejo: existía porque al cambiar de
   * ventana con la tecla sostenida el `keyup` se lo llevaba el sistema y la
   * barra se quedaba escuchando. Con un interruptor no hay tecla que se atore.
   *
   * Lo que sí se quería —no dejar el micrófono abierto en una ventana que ya no
   * miras— es exactamente `visibilitychange`: se dispara al cambiar de pestaña
   * o de app, y NO con un diálogo de permiso encima de la página que sigues
   * viendo.
   */
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "hidden") return;
    if (enganchado) marcarEnganche(false);
    holdEnd();
  });

  /*
   * ── El gesto: UN TOQUE ──────────────────────────────────────────────────
   *
   * Esto era «mantén para hablar», copiado de los huddles de Slack y Discord.
   * En una computadora se defiende; en un teléfono no funciona y punto: la
   * ranura que había que sostener está oculta en táctil, sostener el dedo
   * mientras lees la pantalla es incómodo, y si sueltas sin querer a media
   * frase la frase se pierde sin aviso.
   *
   * Ahora es un interruptor: tocas y te escucha, vuelves a tocar y se calla.
   * Es lo que la gente espera de un micrófono, y es igual en la barra, en la
   * cápsula del landing y con la barra espaciadora.
   */
  const slot = document.getElementById("talk-slot");
  const marcarEnganche = (valor) => {
    enganchado = valor;
    slot?.setAttribute("aria-pressed", String(valor));
    panel.classList.toggle("is-holding", valor);
    if (slot)
      slot.setAttribute(
        "aria-label",
        valor ? "Silenciar el micrófono" : "Hablar con S1gnal",
      );
  };
  const alternar = () => {
    if (enganchado) {
      marcarEnganche(false);
      holdEnd();
    } else {
      void holdStart().then(() => {
        /*
         * Se reafirma lo que la persona pidió.
         *
         * Entre su gesto y este punto pasaron dos cosas largas: el diálogo del
         * permiso y una vuelta de red para el token. En ese hueco cabe todo —un
         * evento del navegador, un cambio de foco— y si algo apagó
         * `transmitiendo` por el camino, esto se enteraba sólo el micrófono: la
         * barra se encendía igual y no subía un solo byte. No hubo un segundo
         * gesto, así que no hubo intención de apagarlo.
         */
        holding = true;
        transmitiendo = true;
        marcarEnganche(true);
      });
    }
  };
  alternarDesdeElBoton = alternar;
  slot?.addEventListener("click", alternar);

  // Cerrar desde la fila. La cabecera no existe en modo barra.
  document.getElementById("sg-close")?.addEventListener("click", closePanel);

  // Escribir: alterna el campo en línea en vez de abrir un window.prompt.
  writeForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = writeInput.value.trim();
    if (!value) return;
    writeInput.value = "";
    markTalk();
    renderConversation(value, "…");
    if (connected) sendText(value);
    else void startSession(value);
  });
}

/*
 * Morph del launcher al panel.
 *
 * Se mide la caja de los dos y se arranca el panel con la geometría del
 * launcher, para que el ojo lea una transformación y no una aparición. La
 * medición necesita que el panel tenga layout, así que se hace con
 * `is-morphing` puesto (visible pero sin transición) y antes de pintar.
 */
function morphOpen() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Neutralizar la transformación antes de medir. Si no, a partir de la segunda
  // apertura getBoundingClientRect devuelve la caja YA transformada por el morph
  // anterior, y el cálculo sale en identidad — el panel aparece sin animar.
  panel.style.setProperty("--mx", "0px");
  panel.style.setProperty("--my", "0px");
  panel.style.setProperty("--msx", 1);
  panel.style.setProperty("--msy", 1);
  panel.classList.add("is-morphing");
  void panel.offsetWidth;

  const l = launcher.getBoundingClientRect();
  const p = panel.getBoundingClientRect();

  if (!reduce && l.width && p.width) {
    const sx = Math.max(l.width / p.width, 0.02);
    const sy = Math.max(l.height / p.height, 0.02);
    // Con transform-origin en la esquina superior izquierda, basta llevar esa
    // esquina a la del launcher y escalar.
    panel.style.setProperty("--mx", (l.left - p.left) + "px");
    panel.style.setProperty("--my", (l.top - p.top) + "px");
    panel.style.setProperty("--msx", sx);
    panel.style.setProperty("--msy", sy);
  } else {
    panel.style.setProperty("--mx", "0px");
    panel.style.setProperty("--my", "0px");
    panel.style.setProperty("--msx", 1);
    panel.style.setProperty("--msy", 1);
  }

  // Fuerza el reflow para que el navegador tome la posición inicial antes de
  // que `is-open` cambie el destino. Sin esto no hay animación.
  void panel.offsetWidth;

  panel.classList.add("is-open");

  // Los LED se encienden del centro hacia afuera, ya que la caja aterrizó.
  const leds = panel.querySelectorAll(".voice-pixels i");
  if (leds.length && !reduce) {
    const mid = (leds.length - 1) / 2;
    leds.forEach((led, i) => {
      led.style.setProperty("--ignite", (0.3 + Math.abs(i - mid) * 0.016).toFixed(3) + "s");
    });
    panel.classList.add("is-igniting");
    window.setTimeout(() => panel.classList.remove("is-igniting"), 1000);
  }

  window.setTimeout(() => panel.classList.remove("is-morphing"), reduce ? 20 : 700);
}

function openPanel() {
  gestureStartedAt = nowMs();
  // Primero lo audible. `play()` sigue dentro del gesto y no espera red,
  // permisos ni worklets; en iPhone eso es la diferencia entre respuesta
  // inmediata y cuatro segundos de incertidumbre.
  iniciarSaludoLocal();
  // Abrir la barra ya es un gesto del usuario: aquí se puede levantar audio y
  // pedir el token, para que al encender el micrófono no haya nada que esperar.
  precalentar();
  morphOpen();
  panel.setAttribute("aria-hidden", "false");
  launcher.classList.add("is-hidden");
  launcher.setAttribute("aria-expanded", "true");
  /* En barra el foco aterriza en la ranura: es la acción principal y es lo que
     hace que la barra espaciadora funcione de inmediato — en la landing,
     espacio sólo habla con el foco dentro de la barra. Antes se enfocaba el
     cierre de la cabecera, que en barra está oculto, y el foco caía al body. */
  const primerFoco = isBar ? document.getElementById("talk-slot") : closeButton;
  window.setTimeout(() => primerFoco?.focus(), 260);

  /*
   * En el landing, abrir la cápsula ES querer hablar.
   *
   * Antes había que abrir y DESPUÉS encontrar el gesto para hablar —que en
   * teléfono estaba escondido—. Quien toca una cápsula que dice HABLAR ya
   * decidió; pedirle un segundo paso es hacerle adivinar.
   *
   * El clic en la cápsula es un gesto del usuario, así que aquí sí se puede
   * pedir micrófono y levantar audio.
   */
  /*
   * SIN setTimeout. Safari cuenta el gesto del usuario sólo dentro de la pila
   * de llamadas del clic: un `setTimeout`, aunque sea de 120 ms, ya está fuera
   * y `getUserMedia` deja de considerarse pedido por la persona. En Chromium
   * funcionaba igual con o sin retraso —por eso pasó mis pruebas— y en Safari,
   * que es donde se probó de verdad, el micrófono nunca abría: la barra se
   * desplegaba, S1gnal saludaba, y no oía a nadie.
   */
  if (config.autoStart && !connected && !enganchado) alternarMicrofono();
  // Sin esperar al transitionend, que en una pestaña en segundo plano no
  // llega (las transiciones se congelan).
  if (isBar) window.setTimeout(reservarEspacio, 760);
}

function closePanel() {
  // Cerrar la barra apaga todo, incluido el enganche del micrófono.
  enganchado = false;
  holding = false;
  transmitiendo = false;
  document.getElementById("talk-slot")?.setAttribute("aria-pressed", "false");

  /* Si la barra es parte del marco de la app, «cerrar» es plegar: la sesión
     termina y la conversación se encoge, pero la barra se queda — quitarla
     sería quitarle el motor a la operación. */
  if (isBar && config.startOpen) {
    if (socket || inputStream) stopSession();
    panel.classList.remove("has-talk", "is-writing", "is-holding");
    return;
  }

  if (socket || inputStream) stopSession();
  panel.classList.remove("is-open", "is-morphing", "is-igniting", "has-talk", "is-writing", "is-holding");
  if (isBar) document.body.style.paddingBottom = "";
  panel.setAttribute("aria-hidden", "true");
  launcher.classList.remove("is-hidden");
  launcher.setAttribute("aria-expanded", "false");
  launcher.focus();
}

// El contexto puede nacer suspendido sin permiso y aun así descargar/compilar
// los worklets. Al tocar sólo queda reanudarlo. No se abre el micrófono ni se
// pide token aquí, así que no hay indicador de grabación ni costo de sesión.
const prepararAudioEnReposo = () => { void prepareOutputGraph().catch(() => {}); };
if (typeof window.requestIdleCallback === "function") {
  window.requestIdleCallback(prepararAudioEnReposo, { timeout: 1200 });
} else {
  window.setTimeout(prepararAudioEnReposo, 0);
}

enableBar();

/* Barra ya abierta al cargar: sin cápsula, sin morph y sin robar el foco —
   la persona vino a trabajar, la barra sólo está presente. El precalentado
   corre desde ya, así el primer toque no espera nada. */
if (isBar && config.startOpen) {
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  launcher.classList.add("is-hidden");
  launcher.setAttribute("aria-expanded", "true");
  precalentar();
  reservarEspacio();
}

// `pointerdown` sucede antes que `click`: en teléfono nos regala el tiempo del
// propio toque para pedir el token y preparar la salida, sin abrir el micrófono
// ni mostrar permisos antes de que la persona confirme con el clic.
launcher.addEventListener("pointerdown", precalentar, { passive: true });
launcher.addEventListener("pointerenter", precalentar, { passive: true });
launcher.addEventListener("click", openPanel);
closeButton.addEventListener("click", closePanel);
// El micrófono enciende y apaga el micrófono. Para terminar la sesión está el
// botón de cerrar: son dos cosas distintas y antes eran la misma.
talkButton.addEventListener("click", alternarMicrofono);
interruptButton.addEventListener("click", () => {
  terminarSaludoLocal(false);
  playbackNode?.port.postMessage("interrupt");
  // Quien interrumpe quiere hablar YA: el micrófono se reabre en el acto. Se
  // tiró el colchón, así que la bocina calló de verdad en este instante.
  despedidaPendiente = false;
  alDejarDeSonar();
  socket?.send(JSON.stringify({ realtimeInput: { activityStart: {} } }));
});
chips?.addEventListener("click", (event) => {
  const chip = event.target.closest(".chip");
  if (chip) startSession(chip.dataset.prompt);
});
textButton?.addEventListener("click", () => {
  if (isBar) {
    panel.classList.toggle("is-writing");
    if (panel.classList.contains("is-writing")) writeInput?.focus();
    return;
  }
  const text = window.prompt("¿En qué te ayudo?");
  if (!text) return;
  if (connected) sendText(text.trim());
  else startSession(text.trim());
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && panel.classList.contains("is-open")) closePanel();
});
window.addEventListener("pagehide", () => cleanupSession());

// La ranura del launcher la llena y la anima el bloque de arriba. Aquí vivía
// una segunda pasada estática de la versión anterior que no reemplazaba a la
// primera: le añadía otros siete segmentos al mismo hueco, así que la cápsula
// mostraba catorce —siete respirando y siete congelados.

/*
 * Un canal para que la aplicación le cuente a S1gnal cómo terminó lo que
 * propuso.
 *
 * El lazo estaba abierto: el modelo se enteraba de que había dejado algo
 * «pendiente de confirmar» y ahí se acababa su historia. La persona tocaba
 * Confirmar, el cobro se registraba… y si después preguntaba «¿ya quedó?», la
 * voz no tenía idea. Peor: podía volver a ofrecer lo mismo que ya estaba hecho.
 *
 * Con esto, la confirmación —y también las acciones que S1gnal ejecuta sola—
 * regresan a la conversación como un mensaje del sistema, y puede seguir:
 * «Listo, quedó registrado. ¿Le imprimo la remisión?».
 */
window.s1gnalVoz = {
  /** ¿Hay una sesión de voz viva ahora mismo? */
  activa: () => connected,
  /** Abre S1gnal desde un CTA de la página sin exponer un teléfono. */
  abrir: () => openPanel(),
  /**
   * Le dice algo a S1gnal en nombre del sistema, no de la persona.
   * Devuelve falso si no hay sesión: quien llama decide si eso importa.
   */
  contar(mensaje) {
    if (!connected || !mensaje) return false;
    sendText(String(mensaje));
    return true;
  },
};

/*
 * Los CTA del sitio apuntan a #s1gnal. El clic sigue siendo un gesto real del
 * usuario, así que Safari permite pedir el micrófono durante openPanel().
 */
document.addEventListener("click", (event) => {
  const trigger = event.target.closest?.('a[href="#s1gnal"]');
  if (!trigger) return;
  event.preventDefault();
  openPanel();
});
document.addEventListener("pointerdown", (event) => {
  if (event.target.closest?.('a[href="#s1gnal"]')) precalentar();
}, { passive: true });

animateIdle();
