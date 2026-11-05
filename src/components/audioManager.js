/**
 * Audio Manager
 * Synthesizes procedural music & sound effects using Web Audio API
 * Does not require external audio assets while sounding celestial and polished!
 */

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlayingMusic = false;
    this.ambientTimer = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;

    // Pentatonic scale frequencies for harmonic ambient arpeggios
    // F# Pentatonic Major: F#4, G#4, A#4, C#5, D#5, F#5, G#5
    this.notes = [369.99, 415.30, 466.16, 554.37, 622.25, 739.99, 830.61];
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Music & SFX buses
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.ensureContext();
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : 0.7,
        this.ctx.currentTime
      );
    }
    return this.isMuted;
  }

  startAmbientMusic() {
    if (this.isPlayingMusic) return;
    this.ensureContext();
    this.isPlayingMusic = true;

    let step = 0;
    const scheduleNextNote = () => {
      if (!this.isPlayingMusic || !this.ctx) return;

      const freq = this.notes[step % this.notes.length];
      const oct = (step % 4 === 0) ? 0.5 : 1;
      this.playSynthNote(freq * oct, 2.2, 0.15);

      step++;
      const nextDelay = 800 + Math.random() * 500;
      this.ambientTimer = setTimeout(scheduleNextNote, nextDelay);
    };

    scheduleNextNote();
  }

  stopAmbientMusic() {
    this.isPlayingMusic = false;
    if (this.ambientTimer) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
  }

  playSynthNote(freq, duration = 1.5, volume = 0.2) {
    if (!this.ctx || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio fallback gracefully
    }
  }

  // Soft Angelic Chime
  playChime() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    [880, 1320, 1760].forEach((freq, idx) => {
      setTimeout(() => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.2);
      }, idx * 90);
    });
  }

  // Rising Sparkling Shimmer
  playMagicSparkle() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const pitches = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    pitches.forEach((freq, i) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
      }, i * 50);
    });
  }

  // Gentle Balloon Pop
  playPop() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(280, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.45, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // Wish Granted Shimmer
  playWishGranted() {
    this.playMagicSparkle();
    setTimeout(() => {
      this.playChime();
    }, 250);
  }

  // Gift Open Whoosh + Sparkle
  playGiftOpen() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    // Low whoosh swell
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(450, this.ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.8);

    setTimeout(() => this.playMagicSparkle(), 300);
  }

  // Candle Extinguish Puff
  playBlowCandle() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    // Breath puff (noise buffer or low sine)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);

    setTimeout(() => this.playWishGranted(), 300);
  }

  // Star Collection Tone
  playStarCollect(index = 0) {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const note = this.notes[index % this.notes.length];
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(note * 2, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.7);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.7);
  }

  // Grand Finale Fanfare
  playFanfare() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const chord = [369.99, 466.16, 554.37, 739.99]; // F# Major chord
    chord.forEach((f) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 2.5);
    });

    setTimeout(() => this.playMagicSparkle(), 500);
  }
}
