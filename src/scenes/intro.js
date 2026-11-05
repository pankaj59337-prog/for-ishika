/**
 * SCENE 01: Cinematic Loading Intro
 */

import gsap from "gsap";

export class IntroScene {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.el = document.getElementById("scene-01");
    this.loaderFill = document.getElementById("loader-progress");
    this.statusText = document.getElementById("loader-status-text");
    this.title1 = document.getElementById("intro-title-1");
    this.title2 = document.getElementById("intro-title-2");
    this.startBtn = document.getElementById("btn-start-experience");
    this.skipBtn = document.getElementById("btn-skip-intro");

    this.setupEvents();
  }

  setupEvents() {
    this.startBtn.addEventListener("click", () => {
      this.sm.audio.ensureContext();
      this.sm.audio.playChime();
      this.sm.audio.startAmbientMusic();
      this.sm.goToScene(2);
    });

    this.skipBtn.addEventListener("click", () => {
      this.sm.audio.ensureContext();
      this.sm.audio.startAmbientMusic();
      this.sm.goToScene(2);
    });
  }

  enter() {
    // Animate loading simulation
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        this.onLoaded();
      }
      this.loaderFill.style.width = `${progress}%`;
      this.statusText.textContent = `Gathering starlight... ${progress}%`;
    }, 120);

    // Cinematic title switch
    setTimeout(() => {
      if (this.title1 && this.title2) {
        gsap.to(this.title1, {
          opacity: 0,
          y: -15,
          duration: 0.6,
          onComplete: () => {
            this.title1.classList.add("hidden");
            this.title2.classList.remove("hidden");
            gsap.fromTo(
              this.title2,
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );
          }
        });
      }
    }, 1200);
  }

  onLoaded() {
    this.statusText.textContent = "Your birthday universe is ready ✨";
    gsap.to(document.getElementById("intro-loader-wrap"), {
      opacity: 0.4,
      duration: 0.5
    });

    this.startBtn.style.display = "inline-flex";
    gsap.fromTo(
      this.startBtn,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
    );
  }
}
