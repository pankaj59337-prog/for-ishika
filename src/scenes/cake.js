/**
 * SCENE 05: Interactive Birthday Cake
 */

import gsap from "gsap";

export class CakeScene {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.el = document.getElementById("scene-05");
    this.blowBtn = document.getElementById("btn-blow-candles");
    this.nextBtn = document.getElementById("btn-cake-next");
    this.wishBanner = document.getElementById("wish-banner");
    this.flames = document.querySelectorAll(".candle-flame");
    this.smokes = document.querySelectorAll(".candle-smoke");
    this.isBlown = false;

    this.setupEvents();
  }

  setupEvents() {
    this.blowBtn.addEventListener("click", () => {
      if (this.isBlown) return;
      this.blowCandles();
    });

    this.nextBtn.addEventListener("click", () => {
      this.sm.audio.playChime();
      this.sm.goToScene(6);
    });
  }

  enter() {
    this.isBlown = false;
    this.blowBtn.classList.remove("hidden");
    this.nextBtn.classList.add("hidden");
    this.wishBanner.classList.add("hidden");

    this.flames.forEach((flame) => flame.classList.remove("extinguished"));
    this.smokes.forEach((smoke) => smoke.classList.remove("smoking"));

    gsap.fromTo(
      document.getElementById("cake-stage"),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );
  }

  blowCandles() {
    this.isBlown = true;
    this.sm.audio.playBlowCandle();

    // 1. Extinguish flames with smoke puff
    this.flames.forEach((flame) => flame.classList.add("extinguished"));
    this.smokes.forEach((smoke) => smoke.classList.add("smoking"));

    // 2. Hide blow button
    this.blowBtn.classList.add("hidden");

    // 3. Reveal wish banner with celebratory confetti
    setTimeout(() => {
      this.wishBanner.classList.remove("hidden");
      gsap.fromTo(
        this.wishBanner,
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.6)" }
      );

      this.sm.particles.fireConfetti({ x: 0.5, y: 0.5 });
      this.nextBtn.classList.remove("hidden");
      gsap.fromTo(
        this.nextBtn,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, delay: 0.3, ease: "back.out(1.5)" }
      );
    }, 900);
  }
}
