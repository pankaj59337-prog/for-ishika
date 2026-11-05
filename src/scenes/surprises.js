/**
 * SCENE 06: The Surprise Treasure Room
 */

import gsap from "gsap";

export class SurprisesScene {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.el = document.getElementById("scene-06");
    this.countEl = document.getElementById("treasure-count");
    this.nextBtn = document.getElementById("btn-treasure-next");

    // Surprise A
    this.envItem = document.getElementById("env-item");
    this.envFlap = document.getElementById("env-flap");
    this.envLetter = document.getElementById("env-letter");

    // Surprise B
    this.scratchCanvas = document.getElementById("scratch-canvas");
    this.scratchCtx = this.scratchCanvas.getContext("2d");
    this.quickScratchBtn = document.getElementById("btn-quick-scratch");

    // Surprise C
    this.balloons = document.querySelectorAll(".mini-balloon");
    this.balloonWishesLog = document.getElementById("balloon-wishes-log");

    // Surprise D
    this.starD = document.getElementById("magic-star-d");
    this.starDMsg = document.getElementById("star-d-message");

    this.discovered = new Set();
    this.isScratching = false;

    this.setupEvents();
    this.initScratchCard();
  }

  setupEvents() {
    // Surprise A: Magic Envelope
    this.envItem.addEventListener("click", () => this.openEnvelope());
    this.envItem.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") this.openEnvelope();
    });

    // Surprise B: Scratch
    this.scratchCanvas.addEventListener("mousedown", () => (this.isScratching = true));
    window.addEventListener("mouseup", () => (this.isScratching = false));
    this.scratchCanvas.addEventListener("mousemove", (e) => this.handleScratch(e));

    // Touch support for scratch
    this.scratchCanvas.addEventListener("touchstart", (e) => {
      this.isScratching = true;
      this.handleScratch(e.touches[0]);
    });
    this.scratchCanvas.addEventListener("touchend", () => (this.isScratching = false));
    this.scratchCanvas.addEventListener("touchmove", (e) => {
      if (this.isScratching) this.handleScratch(e.touches[0]);
    });

    this.quickScratchBtn.addEventListener("click", () => this.revealScratchQuick());

    // Surprise C: Balloon Pop
    this.balloons.forEach((b) => {
      b.addEventListener("click", () => this.popBalloon(b));
      b.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") this.popBalloon(b);
      });
    });

    // Surprise D: Wishing Star
    this.starD.addEventListener("click", () => this.launchWishingStar());
    this.starD.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") this.launchWishingStar();
    });

    // Next Scene Button
    this.nextBtn.addEventListener("click", () => {
      this.sm.audio.playChime();
      this.sm.goToScene(7);
    });
  }

  enter() {
    gsap.fromTo(
      this.el.querySelectorAll(".treasure-item"),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out" }
    );
  }

  markDiscovered(key) {
    if (!this.discovered.has(key)) {
      this.discovered.add(key);
      this.countEl.textContent = this.discovered.size;
      this.sm.audio.playStarCollect(this.discovered.size);

      if (this.discovered.size === 4) {
        this.sm.particles.fireConfetti({ x: 0.5, y: 0.6 });
        gsap.to(this.nextBtn, {
          scale: 1.08,
          yoyo: true,
          repeat: 3,
          duration: 0.3
        });
      }
    }
  }

  // Surprise A: Envelope
  openEnvelope() {
    this.envFlap.classList.add("opened");
    this.envLetter.classList.add("revealed");
    this.sm.audio.playMagicSparkle();
    this.markDiscovered("A");
  }

  // Surprise B: Scratch Card
  initScratchCard() {
    const ctx = this.scratchCtx;
    ctx.fillStyle = "#A386D4";
    ctx.fillRect(0, 0, this.scratchCanvas.width, this.scratchCanvas.height);

    // Decorative pattern
    ctx.fillStyle = "#BE9BFF";
    ctx.font = "bold 14px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✦ SCRATCH HERE ✦", this.scratchCanvas.width / 2, this.scratchCanvas.height / 2 + 5);
  }

  handleScratch(e) {
    if (!this.isScratching) return;
    const rect = this.scratchCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = this.scratchCtx;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    this.markDiscovered("B");
  }

  revealScratchQuick() {
    const ctx = this.scratchCtx;
    ctx.clearRect(0, 0, this.scratchCanvas.width, this.scratchCanvas.height);
    this.sm.audio.playMagicSparkle();
    this.markDiscovered("B");
  }

  // Surprise C: Balloon Pop
  popBalloon(b) {
    if (b.classList.contains("popped")) return;
    b.classList.add("popped");
    this.sm.audio.playPop();

    const rect = b.getBoundingClientRect();
    this.sm.particles.sparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);

    const wish = b.getAttribute("data-wish");
    this.balloonWishesLog.textContent = `✨ "${wish}" ✨`;
    gsap.fromTo(
      this.balloonWishesLog,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4 }
    );

    this.markDiscovered("C");
  }

  // Surprise D: Wishing Star
  launchWishingStar() {
    if (this.starD.classList.contains("launched")) return;
    this.starD.classList.add("launched");
    this.sm.audio.playWishGranted();

    const rect = this.starD.getBoundingClientRect();
    this.sm.particles.sparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);

    this.starDMsg.classList.remove("hidden");
    gsap.fromTo(
      this.starDMsg,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );

    this.markDiscovered("D");
  }
}
