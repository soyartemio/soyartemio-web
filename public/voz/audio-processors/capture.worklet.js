class SignalAudioCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 512;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
  }

  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;

    for (let index = 0; index < channel.length; index += 1) {
      this.buffer[this.bufferIndex] = channel[index];
      this.bufferIndex += 1;

      if (this.bufferIndex === this.bufferSize) {
        this.port.postMessage({ type: "audio", data: this.buffer.slice() });
        this.bufferIndex = 0;
      }
    }

    return true;
  }
}

registerProcessor("signal-audio-capture", SignalAudioCaptureProcessor);
