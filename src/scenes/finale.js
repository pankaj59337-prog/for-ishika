/**
 * SCENE 10: The Grand Cinematic Finale
 */

import gsap from "gsap";
import { GreetingExporter } from "../components/greetingExporter.js";

export class FinaleScene {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.el = document.getElementById("scene-10");
    this.replayBtn = document.getElementById("btn-replay-all");
    this.shareBtn = document.getElementById("btn-share-surprise");
    this.downloadBtn = document.getElementById("btn-download-card");

    this.setupEvents();
  }

  setupEvents() {
    this.replayBtn.addEventListener("click", () => {
      this.sm.resetAll();
    });

    this.shareBtn.addEventListener("click", () => {
      this.shareSurprise();
    });

    this.downloadBtn.addEventListener("click", () => {
      this.sm.audio.playWishGranted();
      GreetingExporter.exportCard();
      this.sm.showToast("Birthday card downloaded successfully! 🎁");
    });
  }

  enter() {
    this.sm.audio.playFanfare();
    this.sm.particles.fireworksBlast();

    const tl = gsap.timeline();

    gsap.set(this.el.querySelector(".finale-typography"), { scale: 0.85, opacity: 0 });
    gsap.set(this.el.querySelectorAll(".finale-actions button"), { scale: 0.8, opacity: 0 });

    tl.to(this.el.querySelector(".finale-typography"), {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out"
    });

    tl.to(this.el.querySelectorAll(".finale-actions button"), {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      stagger: 0.15,
      ease: "back.out(1.5)"
    }, "-=0.4");
  }

  async shareSurprise() {
    const shareData = {
      title: "Ishika — A Magical Birthday Universe ✨",
      text: "A magical interactive 3D birthday universe created specially for Ishika! 🎂✨",
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or fallback
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        this.sm.showToast("Universe link copied to clipboard! 🔗");
      } catch (err) {
        this.sm.showToast("Share this link with Ishika!");
      }
    }
  }
}
