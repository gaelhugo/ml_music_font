/**
 * Class using TONE.JS to handle sound
 * It provides an analyser (set by default to be FFT)
 * Get microphone input
 * Compute the signal to get numeric value from microphone
 */
import EventEmitter from "./EventEmitter.js";
export default class SoundTool extends EventEmitter {
  /**
   *
   * @param {HTMLNode} wrapper Dom element containing the sound visualisation
   */
  constructor(wrapper) {
    super();
    this.canvas = document.createElement("canvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext("2d");
    // this.ctx.strokeStyle = "white";
    this.color = "rgba(0,0,255,0.3)";
    wrapper.appendChild(this.canvas);
  }
  /**
   *
   * @param {number} freq max range value for sound computation
   */
  initAnalyser(freq) {
    this.freq = freq;
    this.analyser = new Tone.Analyser({
      type: "fft",
      size: freq,
    });
  }
  /**
   * Start to get the Microphone
   */
  getUserMedia() {
    let audSrc = new Tone.UserMedia();
    audSrc.connect(this.analyser);
    audSrc.open();
  }
  /**
   *
   * @param {boolean} show set if analyzer is visible on stage
   */
  start(show = true) {
    this.freqWidth = Math.ceil(window.innerWidth / this.freq);
    console.log(this.freqWidth);
    setInterval(() => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = this.color;
      let signal = this.analyser.getValue();
      const inputs = {};
      for (const [i, h] of signal.entries()) {
        inputs[i] = h * -1;
        /*VIEW */
        if (show) {
          this.ctx.fillRect(
            i * this.freqWidth +
              window.innerWidth / 2 -
              (this.freq * this.freqWidth) / 2,
            window.innerHeight,
            this.freqWidth,
            h * 3
          );
        }
      }
      this.raiseEvent("ondata", [inputs]);
    }, 10);
  }
}
