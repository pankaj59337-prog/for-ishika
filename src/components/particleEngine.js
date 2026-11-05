/**
 * Particle & Atmosphere Engine
 * Confetti bursts, fireworks, floating petals, and butterfly trails
 */

import confetti from "canvas-confetti";

export class ParticleEngine {
  constructor(overlayContainer, fxCanvas) {
    this.overlay = overlayContainer;
    this.fxCanvas = fxCanvas;
    this.ctx = fxCanvas ? fxCanvas.getContext("2d") : null;
    this.customSparks = [];
    this.petals = [];
    this.butterflies = [];
    this.animId = null;

    if (this.fxCanvas) {
      this.resizeCanvas();
      window.addEventListener("resize", () => this.resizeCanvas());
      this.loop();
    }

    this.initAtmosphere();
  }

  resizeCanvas() {
    if (!this.fxCanvas) return;
    this.fxCanvas.width = window.innerWidth;
    this.fxCanvas.height = window.innerHeight;
  }

  initAtmosphere() {
    if (!this.overlay) return;

    // Generate floating petals
    const petalCount = window.innerWidth < 600 ? 12 : 25;
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement("div");
      petal.className = "ambient-petal";
      const size = 10 + Math.random() * 12;
      petal.style.width = `${size}px`;
      petal.style.height = `${size * 1.3}px`;
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.top = `${-20 - Math.random() * 50}px`;

      this.overlay.appendChild(petal);
      this.animatePetal(petal);
    }

    // Generate floating butterflies
    const butterflyCount = window.innerWidth < 600 ? 3 : 6;
    for (let i = 0; i < butterflyCount; i++) {
      const bf = document.createElement("div");
      bf.className = "ambient-butterfly";
      bf.textContent = "🦋";
      bf.style.left = `${Math.random() * 90}vw`;
      bf.style.top = `${20 + Math.random() * 60}vh`;
      this.overlay.appendChild(bf);
      this.animateButterfly(bf);
    }
  }

  animatePetal(petal) {
    const duration = 8000 + Math.random() * 7000;
    const startX = parseFloat(petal.style.left);
    const driftX = (Math.random() - 0.5) * 15;
    const startTime = performance.now();

    const frame = (now) => {
      const elapsed = now - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        petal.style.top = "-20px";
        petal.style.left = `${Math.random() * 100}vw`;
        this.animatePetal(petal);
        return;
      }

      const y = progress * (window.innerHeight + 50);
      const x = startX + Math.sin(progress * Math.PI * 4) * driftX;
      const rot = progress * 360;

      petal.style.transform = `translate3d(${x}vw, ${y}px, 0) rotate(${rot}deg)`;
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }

  animateButterfly(bf) {
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight * 0.8;
    let targetX = Math.random() * window.innerWidth;
    let targetY = Math.random() * window.innerHeight * 0.8;

    const move = () => {
      targetX = Math.random() * (window.innerWidth - 60);
      targetY = Math.random() * (window.innerHeight * 0.8);
      const dur = 4000 + Math.random() * 4000;

      const startTime = performance.now();
      const startX = x;
      const startY = y;

      const step = (now) => {
        const p = Math.min((now - startTime) / dur, 1);
        const ease = 0.5 - Math.cos(p * Math.PI) / 2;

        x = startX + (targetX - startX) * ease;
        y = startY + (targetY - startY) * ease + Math.sin(p * 15) * 15;

        const flip = targetX > startX ? 1 : -1;
        bf.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${flip})`;

        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          setTimeout(move, 500 + Math.random() * 1000);
        }
      };

      requestAnimationFrame(step);
    };

    move();
  }

  // Confetti celebration burst
  fireConfetti(origin = { x: 0.5, y: 0.6 }) {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: origin,
      colors: ["#F4D58D", "#F8BBD9", "#BE9BFF", "#FFF8F0", "#FFE8A3"],
      disableForReducedMotion: true
    });
  }

  // Big Grand Finale fireworks blast
  fireworksBlast() {
    const duration = 4000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#F4D58D", "#F8BBD9", "#BE9BFF"]
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#F4D58D", "#F8BBD9", "#FFE8A3"]
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }

  // Sparkling golden dust burst at specific coordinates
  sparkleBurst(x, y, count = 25) {
    if (!this.ctx) return;
    const colors = ["#F4D58D", "#FFE8A3", "#F8BBD9", "#FFF8F0"];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      this.customSparks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.025 + 0.015
      });
    }
  }

  loop() {
    this.animId = requestAnimationFrame(() => this.loop());
    if (!this.ctx || this.customSparks.length === 0) return;

    this.ctx.clearRect(0, 0, this.fxCanvas.width, this.fxCanvas.height);

    for (let i = this.customSparks.length - 1; i >= 0; i--) {
      const p = this.customSparks[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.customSparks.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}
