// Reproducción de la voz del agente con colchón anti-cortes.
//
// La versión anterior reproducía cada fragmento en cuanto llegaba y escribía
// silencio en el instante en que la cola se vaciaba. En un escritorio los
// fragmentos llegan más rápido de lo que se consumen y la cola nunca se seca,
// así que sonaba perfecto. En un teléfono no: iOS gestiona la radio con
// ahorro de energía y el hilo de audio tiene menos holgura, de modo que los
// fragmentos llegan a ráfagas y cada hueco se oía como un corte.
//
// La solución es un colchón: no empezar hasta tener PRELOAD muestras
// acumuladas, y si la cola se agota a media frase, callar y volver a llenar
// en vez de reproducir a tirones cada trocito suelto.

// Colchón fijo de 150 ms. Se probó hacerlo adaptativo (crecer tras cada
// corte) y salió peor: cuando la red entrega justo lo necesario y sin
// holgura, un colchón mayor nunca alcanza a llenarse y lo único que logra es
// concentrar el silencio en una pausa más larga. Fijo es predecible y cubre
// el caso real, que es jitter con ancho de banda de sobra.
const SAMPLE_RATE = 24000;              // el audio del modelo llega a 24 kHz
const PRELOAD = SAMPLE_RATE * 0.15;     // 150 ms

class SignalPCMPlaybackProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.queue = [];
    this.offset = 0;
    this.queued = 0;        // muestras disponibles sin reproducir
    this.playing = false;   // false = acumulando colchón
    this.draining = false;  // el turno terminó: vaciar sin volver a esperar

    this.port.onmessage = ({ data }) => {
      if (data === "interrupt") {
        this.queue = [];
        this.offset = 0;
        this.queued = 0;
        this.playing = false;
        this.draining = false;
      } else if (data === "reset") {
        // Sesión nueva: olvidar lo aprendido de la conexión anterior.
          } else if (data === "drain") {
        // El modelo terminó de hablar. Sin esto, el final de la respuesta se
        // quedaría atrapado en el colchón esperando muestras que ya no vienen.
        this.draining = true;
        // Puede llegar cuando ya no queda nada por sonar —respuesta corta,
        // colchón vacío—. Entonces el turno acabó en este instante y `process`
        // no va a pasar por el aviso: sale antes, por la puerta del silencio.
        if (this.queued === 0) this.avisarQueTermino();
      } else if (data instanceof Float32Array) {
        this.queue.push(data);
        this.queued += data.length;
      }
    };
  }

  /*
   * El único que sabe cuándo S1gnal dejó de sonar es este worklet.
   *
   * `turnComplete` del servidor dice que el modelo terminó de GENERAR, y genera
   * varias veces más rápido de lo que se habla: cuando llega, aquí puede quedar
   * media respuesta por reproducir. El hilo principal reabría el micrófono en
   * ese momento y S1gnal se oía a sí misma durante todo el resto de la frase.
   *
   * Se avisa sólo con `draining` puesto: la cola también se seca a media
   * respuesta cuando la red no alcanza —para eso está el colchón— y eso no es
   * el final de nada.
   */
  avisarQueTermino() {
    this.draining = false;
    this.playing = false;
    this.port.postMessage("drained");
  }

  process(_inputs, outputs) {
    const channel = outputs[0]?.[0];
    if (!channel) return true;

    if (!this.playing && (this.queued >= PRELOAD || (this.draining && this.queued > 0))) {
      this.playing = true;
    }

    if (!this.playing) {
      channel.fill(0);
      return true;
    }

    let outputIndex = 0;
    while (outputIndex < channel.length && this.queue.length) {
      const current = this.queue[0];
      const count = Math.min(channel.length - outputIndex, current.length - this.offset);

      for (let index = 0; index < count; index += 1) {
        channel[outputIndex] = current[this.offset];
        outputIndex += 1;
        this.offset += 1;
      }
      this.queued -= count;

      if (this.offset === current.length) {
        this.queue.shift();
        this.offset = 0;
      }
    }

    if (outputIndex < channel.length) {
      // Se agotó a media reproducción: silencio y a rellenar el colchón.
      channel.fill(0, outputIndex);
      this.playing = false;
      if (this.draining && this.queued === 0) this.avisarQueTermino();
    }

    return true;
  }
}

registerProcessor("signal-pcm-playback", SignalPCMPlaybackProcessor);
