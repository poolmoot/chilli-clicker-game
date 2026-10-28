/**
 * CAPY CHILL CLICKER — Procedural Web Audio Synthesizer
 * Zero-dependency juicy sound engine for clicks, crits, upgrades, milestones, frenzy & golden events.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  _initContext() {
    if (this.muted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setMuted(bool) {
    this.muted = Boolean(bool);
  }

  isMuted() {
    return this.muted;
  }

  /**
   * Juicy water-bloop / marimba-pop on click, or harmonic chord burst + sub-thump on critical hit.
   */
  playClick(isCrit = false, frenzyActive = false) {
    const ctx = this._initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const jitter = 1 + (Math.random() * 0.16 - 0.08); // ±8% organic pitch jitter
    const frenzyPitch = frenzyActive ? 1.12 : 1.0;

    if (!isCrit) {
      // Primary sine water-bloop sweep: 260Hz -> 540Hz over 55ms
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      const startFreq = 260 * jitter * frenzyPitch;
      const endFreq = 540 * jitter * frenzyPitch;

      osc1.frequency.setValueAtTime(startFreq, now);
      osc1.frequency.exponentialRampToValueAtTime(endFreq, now + 0.055);

      osc2.frequency.setValueAtTime(startFreq * 1.5, now);
      osc2.frequency.exponentialRampToValueAtTime(endFreq * 1.25, now + 0.055);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.08);
      osc2.stop(now + 0.08);
    } else {
      // Critical Click: Punchy low sub-thump + Crisp harmonic chord burst (C5 - E5 - G5 - C6)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(150, now);
      subOsc.frequency.exponentialRampToValueAtTime(42, now + 0.11);

      subGain.gain.setValueAtTime(0.28, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.13);

      // Harmonic chord burst: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
      const chordFreqs = [523.25, 659.25, 783.99, 1046.5];
      chordFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq * jitter * frenzyPitch, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.04 * jitter * frenzyPitch, now + 0.16);

        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(0.09, now + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.19 + idx * 0.02);

        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22 + idx * 0.02);
      });
    }
  }

  /**
   * Satisfying two-tone coin ka-ching (B5 -> E6 bell chime).
   */
  playBuy() {
    const ctx = this._initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { freq: 987.77, start: 0, dur: 0.09 },    // B5
      { freq: 1318.51, start: 0.055, dur: 0.22 } // E6
    ];

    notes.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      overtone.type = 'triangle';

      osc.frequency.setValueAtTime(freq, now + start);
      overtone.frequency.setValueAtTime(freq * 2, now + start);

      gain.gain.setValueAtTime(0.001, now + start);
      gain.gain.linearRampToValueAtTime(0.14, now + start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

      osc.connect(gain);
      overtone.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      overtone.start(now + start);
      osc.stop(now + start + dur + 0.01);
      overtone.stop(now + start + dur + 0.01);
    });
  }

  /**
   * Triumphant 4-note ascending fanfare arpeggio (C5 -> E5 -> G5 -> C6)
   */
  playMilestone() {
    const ctx = this._initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const start = now + i * 0.075;
      const dur = i === notes.length - 1 ? 0.38 : 0.16;

      const osc = ctx.createOscillator();
      const sub = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      sub.type = 'sine';

      osc.frequency.setValueAtTime(freq, start);
      sub.frequency.setValueAtTime(freq * 0.5, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(gain);
      sub.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      sub.start(start);
      osc.stop(start + dur + 0.02);
      sub.stop(start + dur + 0.02);
    });
  }

  /**
   * Exciting rising synth power-up sweep + shimmering chord.
   */
  playFrenzyStart() {
    const ctx = this._initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Rising power-up sweep
    const sweep = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweep.type = 'sawtooth';
    sweep.frequency.setValueAtTime(220, now);
    sweep.frequency.exponentialRampToValueAtTime(880, now + 0.28);

    // Low-pass filter for warm synth sweep
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.28);

    sweepGain.gain.setValueAtTime(0.001, now);
    sweepGain.gain.linearRampToValueAtTime(0.12, now + 0.04);
    sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    sweep.connect(filter);
    filter.connect(sweepGain);
    sweepGain.connect(ctx.destination);

    sweep.start(now);
    sweep.stop(now + 0.34);

    // Shimmering major 9th chord at peak
    const shimmerFreqs = [587.33, 739.99, 880, 1174.66, 1318.51]; // D5, F#5, A5, D6, E6
    shimmerFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const start = now + 0.14 + idx * 0.03;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      g.gain.setValueAtTime(0.001, start);
      g.gain.linearRampToValueAtTime(0.09, start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);

      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.52);
    });
  }

  /**
   * Magical sparkling celesta chime (E6 -> G#6 -> B6).
   */
  playGoldenSpawn() {
    const ctx = this._initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [1318.51, 1661.22, 1975.53]; // E6, G#6, B6

    notes.forEach((freq, i) => {
      const start = now + i * 0.065;
      const osc = ctx.createOscillator();
      const bell = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      bell.type = 'sine';

      osc.frequency.setValueAtTime(freq, start);
      bell.frequency.setValueAtTime(freq * 2.0, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.11, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

      osc.connect(gain);
      bell.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      bell.start(start);
      osc.stop(start + 0.37);
      bell.stop(start + 0.37);
    });
  }

  /**
   * Massive jackpot fanfare!
   */
  playGoldenCatch() {
    const ctx = this._initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Sparkling coin cascade + jackpot chord
    const cascade = [587.33, 739.99, 880, 1174.66, 1479.98, 1760.0]; // D major arpeggio up to A6

    cascade.forEach((freq, idx) => {
      const start = now + idx * 0.055;
      const dur = idx === cascade.length - 1 ? 0.55 : 0.22;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(freq, start);
      osc2.frequency.setValueAtTime(freq * 1.5, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.14, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(start);
      osc2.start(start);
      osc1.stop(start + dur + 0.02);
      osc2.stop(start + dur + 0.02);
    });
  }

  /**
   * Deep cosmic choir/chord swell.
   */
  playRebirth() {
    return this.playAscend();
  }

  playAscend() {
    const ctx = this._initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Ethereal cosmic major/lydian swell across octaves
    const choirFreqs = [130.81, 196.0, 261.63, 329.63, 392.0, 523.25, 659.25, 783.99];

    choirFreqs.forEach((freq, idx) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = idx < 3 ? 'sine' : 'triangle';
      osc2.type = 'sine';

      // Slight detune for lush chorus feel
      osc1.frequency.setValueAtTime(freq * 0.997, now);
      osc1.frequency.exponentialRampToValueAtTime(freq * 1.003, now + 1.4);

      osc2.frequency.setValueAtTime(freq * 1.004, now);
      osc2.frequency.exponentialRampToValueAtTime(freq * 0.998, now + 1.4);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.35 + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.55);
      osc2.stop(now + 1.55);
    });
  }
}

export const soundEngine = new SoundEngine();
export default soundEngine;
