/**
 * Professional Cinematic Audio Engine
 * Features:
 * - Studio-grade Reverb & Delay acoustics
 * - Warm orchestral string pads & analog bass
 * - Delicate romantic Music-Box / Celeste playing an emotional slow Birthday motif
 * - Support for custom MP3 if placed in public/assets/audio/birthday.mp3
 */

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlayingMusic = false;
    this.musicLoopTimer = null;
    this.customAudio = null;

    // Buses
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.reverbNode = null;

    // Happy Birthday melody in Key of F Major (Hz):
    // C4, C4, D4, C4, F4, E4
    // C4, C4, D4, C4, G4, F4
    // C4, C4, C5, A4, F4, E4, D4
    // Bb4, Bb4, A4, F4, G4, F4
    this.melody = [
      { note: 261.63, dur: 0.5, pause: 0.6 },  // C4
      { note: 261.63, dur: 0.4, pause: 0.5 },  // C4
      { note: 293.66, dur: 0.8, pause: 1.0 },  // D4
      { note: 261.63, dur: 0.8, pause: 1.0 },  // C4
      { note: 349.23, dur: 0.9, pause: 1.1 },  // F4
      { note: 329.63, dur: 1.6, pause: 2.0 },  // E4

      { note: 261.63, dur: 0.5, pause: 0.6 },  // C4
      { note: 261.63, dur: 0.4, pause: 0.5 },  // C4
      { note: 293.66, dur: 0.8, pause: 1.0 },  // D4
      { note: 261.63, dur: 0.8, pause: 1.0 },  // C4
      { note: 392.00, dur: 0.9, pause: 1.1 },  // G4
      { note: 349.23, dur: 1.6, pause: 2.0 },  // F4

      { note: 261.63, dur: 0.5, pause: 0.6 },  // C4
      { note: 261.63, dur: 0.4, pause: 0.5 },  // C4
      { note: 523.25, dur: 0.9, pause: 1.1 },  // C5
      { note: 440.00, dur: 0.9, pause: 1.1 },  // A4
      { note: 349.23, dur: 0.8, pause: 1.0 },  // F4
      { note: 329.63, dur: 0.8, pause: 1.0 },  // E4
      { note: 293.66, dur: 1.6, pause: 2.0 },  // D4

      { note: 466.16, dur: 0.5, pause: 0.6 },  // Bb4
      { note: 466.16, dur: 0.4, pause: 0.5 },  // Bb4
      { note: 440.00, dur: 0.9, pause: 1.1 },  // A4
      { note: 349.23, dur: 0.8, pause: 1.0 },  // F4
      { note: 392.00, dur: 0.9, pause: 1.1 },  // G4
      { note: 349.23, dur: 2.5, pause: 3.2 }   // F4 (hold)
    ];

    // Background lush chord progressions (F, C, Bb, F)
    this.chords = [
      [174.61, 220.00, 261.63, 349.23], // F Major
      [130.81, 164.81, 196.00, 261.63], // C Major
      [146.83, 174.61, 220.00, 261.63], // D minor / Bb
      [116.54, 146.83, 174.61, 233.08]  // Bb Major
    ];
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Reverb Impulse Response Node
    this.reverbNode = this.createReverb(2.5, 2.0);
    this.reverbNode.connect(this.masterGain);

    // Music & SFX Gain Buses
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.42, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);
    this.musicGain.connect(this.reverbNode);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);
    this.sfxGain.connect(this.reverbNode);

    // Check for custom audio file if provided
    this.checkCustomAudio();
  }

  checkCustomAudio() {
    const audio = new Audio();
    audio.src = "./assets/audio/birthday.mp3";
    audio.loop = true;
    audio.preload = "auto";
    audio.addEventListener("canplaythrough", () => {
      this.customAudio = audio;
    });
  }

  createReverb(duration = 2.5, decay = 2.0) {
    const rate = this.ctx.sampleRate;
    const length = rate * duration;
    const impulse = this.ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = (length - i) / length;
      const dec = Math.pow(n, decay);
      left[i] = (Math.random() * 2 - 1) * dec;
      right[i] = (Math.random() * 2 - 1) * dec;
    }

    const convolver = this.ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
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

    if (this.customAudio) {
      this.customAudio.muted = this.isMuted;
    }

    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : 0.75,
        this.ctx.currentTime
      );
    }
    return this.isMuted;
  }

  startAmbientMusic() {
    if (this.isPlayingMusic) return;
    this.ensureContext();
    this.isPlayingMusic = true;

    // If custom audio exists, play it
    if (this.customAudio) {
      this.customAudio.play().catch(() => {});
      return;
    }

    // Otherwise play the romantic Music Box + Pad orchestral arrangement
    this.playMelodyLoop();
  }

  playMelodyLoop() {
    if (!this.isPlayingMusic) return;

    let melodyIndex = 0;
    let chordIndex = 0;

    const playNextNote = () => {
      if (!this.isPlayingMusic || !this.ctx) return;

      const item = this.melody[melodyIndex];

      // Play warm string chord pad periodically
      if (melodyIndex % 6 === 0) {
        const chord = this.chords[chordIndex % this.chords.length];
        this.playLushPadChord(chord, 6.0);
        chordIndex++;
      }

      // Play soft celeste/music box note
      this.playMusicBoxNote(item.note, item.dur);

      melodyIndex = (melodyIndex + 1) % this.melody.length;
      this.musicLoopTimer = setTimeout(playNextNote, item.pause * 1000);
    };

    playNextNote();
  }

  stopAmbientMusic() {
    this.isPlayingMusic = false;
    if (this.customAudio) {
      this.customAudio.pause();
    }
    if (this.musicLoopTimer) {
      clearTimeout(this.musicLoopTimer);
      this.musicLoopTimer = null;
    }
  }

  // Realistic Music Box / Celeste Bell Tone (FM Synthesis)
  playMusicBoxNote(freq, duration = 1.0) {
    if (!this.ctx || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;

      // Carrier
      const carrier = this.ctx.createOscillator();
      const carrierGain = this.ctx.createGain();

      // Modulator (adds crystalline bell harmonic shimmer)
      const modulator = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();

      carrier.type = "sine";
      carrier.frequency.setValueAtTime(freq, now);

      modulator.type = "triangle";
      modulator.frequency.setValueAtTime(freq * 2.75, now);

      modGain.gain.setValueAtTime(freq * 0.8, now);
      modGain.gain.exponentialRampToValueAtTime(0.01, now + duration * 0.6);

      modulator.connect(carrier.frequency);

      // Acoustic envelope
      carrierGain.gain.setValueAtTime(0.0001, now);
      carrierGain.gain.linearRampToValueAtTime(0.22, now + 0.02);
      carrierGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 1.2);

      carrier.connect(carrierGain);
      carrierGain.connect(this.musicGain);

      modulator.start(now);
      carrier.start(now);

      modulator.stop(now + duration + 1.2);
      carrier.stop(now + duration + 1.2);
    } catch (e) {}
  }

  // Warm Orchestral String Pad
  playLushPadChord(frequencies, duration = 5.0) {
    if (!this.ctx || this.isMuted) return;

    frequencies.forEach((f) => {
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(f * 0.5, now); // Warm lower register

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 1.2);
        gain.gain.linearRampToValueAtTime(0.04, now + duration * 0.7);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + duration);
      } catch (e) {}
    });
  }

  // Sound Effects:
  playChime() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    [1046.50, 1318.51, 1567.98, 2093.00].forEach((freq, idx) => {
      setTimeout(() => this.playMusicBoxNote(freq, 1.2), idx * 75);
    });
  }

  playMagicSparkle() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const notes = [659.25, 783.99, 987.77, 1174.66, 1318.51, 1567.98];
    notes.forEach((f, i) => {
      setTimeout(() => this.playMusicBoxNote(f, 0.5), i * 45);
    });
  }

  playPop() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.1);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playBlowCandle() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.5);

    setTimeout(() => this.playWishGranted(), 300);
  }

  playWishGranted() {
    this.playMagicSparkle();
    setTimeout(() => this.playChime(), 200);
  }

  playGiftOpen() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(540, now + 0.6);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.7);

    setTimeout(() => this.playMagicSparkle(), 250);
  }

  playStarCollect(idx = 0) {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const pitches = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    this.playMusicBoxNote(pitches[idx % pitches.length], 1.2);
  }

  playFanfare() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const fMajor = [349.23, 440.00, 523.25, 698.46];
    this.playLushPadChord(fMajor, 4.0);
    fMajor.forEach((f, i) => {
      setTimeout(() => this.playMusicBoxNote(f * 2, 1.8), i * 140);
    });
  }
}
