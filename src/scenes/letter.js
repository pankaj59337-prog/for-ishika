/**
 * SCENE 08: The Letter from the Heart
 */

import gsap from "gsap";
import { GreetingExporter } from "../components/greetingExporter.js";

export class LetterScene {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.el = document.getElementById("scene-08");
    this.box = document.getElementById("letter-box");
    this.paragraphs = document.querySelectorAll(".letter-p, .letter-salutation, .sign-wish");
    this.saveBtn = document.getElementById("btn-save-wish");
    this.nextBtn = document.getElementById("btn-letter-next");

    this.setupEvents();
  }

  setupEvents() {
    this.saveBtn.addEventListener("click", () => {
      this.sm.audio.playWishGranted();
      GreetingExporter.exportCard();
      this.sm.showToast("Your birthday wish has been saved to downloads! 💌");
    });

    this.nextBtn.addEventListener("click", () => {
      this.sm.audio.playChime();
      this.sm.goToScene(9);
    });
  }

  enter() {
    gsap.set(this.box, { scale: 0.9, opacity: 0 });
    gsap.set(this.paragraphs, { opacity: 0, y: 15 });

    const tl = gsap.timeline();

    tl.to(this.box, {
      scale: 1,
      opacity: 1,
      duration: 0.9,
      ease: "power3.out"
    });

    tl.to(this.paragraphs, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.18,
      ease: "power2.out"
    }, "-=0.3");
  }
}
