/**
 * SCENE 04: The Ultimate Birthday Name Reveal
 */

import gsap from "gsap";

export class BirthdayRevealScene {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.el = document.getElementById("scene-04");
    this.pretitle = document.getElementById("reveal-pretitle");
    this.nameLetters = document.querySelectorAll(".name-letter");
    this.quote = document.getElementById("reveal-quote");
    this.nextBtn = document.getElementById("btn-reveal-next");

    this.setupEvents();
  }

  setupEvents() {
    this.nextBtn.addEventListener("click", () => {
      this.sm.audio.playChime();
      this.sm.goToScene(5);
    });
  }

  enter() {
    this.sm.audio.playWishGranted();

    // Fire fireworks celebration
    this.sm.particles.fireConfetti({ x: 0.3, y: 0.5 });
    this.sm.particles.fireConfetti({ x: 0.7, y: 0.5 });

    const tl = gsap.timeline();

    // Reset initial states
    gsap.set(this.pretitle, { opacity: 0, y: 20 });
    gsap.set(this.nameLetters, { opacity: 0, y: 50, scale: 0.7, rotationX: 45 });
    gsap.set(this.quote, { opacity: 0, y: 30 });
    gsap.set(this.nextBtn, { opacity: 0, scale: 0.8 });

    // 1. Reveal "HAPPY BIRTHDAY"
    tl.to(this.pretitle, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    });

    // 2. Cinematic staggered reveal of ISHIKA letters
    tl.to(this.nameLetters, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 1.2,
      stagger: 0.12,
      ease: "back.out(1.8)",
      onStart: () => {
        this.sm.particles.fireConfetti({ x: 0.5, y: 0.4 });
      }
    }, "-=0.4");

    // 3. Heartfelt quote
    tl.to(this.quote, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=0.3");

    // 4. Action button
    tl.to(this.nextBtn, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.5)"
    }, "+=0.2");
  }
}
