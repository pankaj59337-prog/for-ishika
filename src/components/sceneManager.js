/**
 * Scene Manager
 * Controls scene transitions, finite state machine, navigation & UI state
 */

import { IntroScene } from "../scenes/intro.js";
import { InvitationScene } from "../scenes/invitation.js";
import { GiftScene } from "../scenes/gift.js";
import { BirthdayRevealScene } from "../scenes/birthdayReveal.js";
import { CakeScene } from "../scenes/cake.js";
import { SurprisesScene } from "../scenes/surprises.js";
import { GalleryScene } from "../scenes/gallery.js";
import { LetterScene } from "../scenes/letter.js";
import { WishingSkyScene } from "../scenes/wishingSky.js";
import { FinaleScene } from "../scenes/finale.js";

export class SceneManager {
  constructor(audioManager, particleEngine) {
    this.audio = audioManager;
    this.particles = particleEngine;
    this.currentSceneIndex = 1;
    this.totalScenes = 10;
    this.scenes = {};
    this.isTransitioning = false;

    this.progressBar = document.getElementById("progress-fill");
    this.dotsContainer = document.getElementById("scene-dots");
    this.scenesGrid = document.getElementById("scenes-grid");
    this.toastEl = document.getElementById("global-toast");
    this.toastMsg = document.getElementById("toast-msg");
    this.sceneMenuModal = document.getElementById("scene-menu-modal");

    this.sceneNames = [
      "1. Cosmic Intro",
      "2. The Invitation",
      "3. The Magic Gift",
      "4. The Big Reveal",
      "5. Birthday Cake",
      "6. Treasure Room",
      "7. Memory Gallery",
      "8. Letter from Heart",
      "9. Wishing Sky",
      "10. Grand Finale"
    ];

    this.initScenes();
    this.setupUI();
  }

  initScenes() {
    this.scenes[1] = new IntroScene(this);
    this.scenes[2] = new InvitationScene(this);
    this.scenes[3] = new GiftScene(this);
    this.scenes[4] = new BirthdayRevealScene(this);
    this.scenes[5] = new CakeScene(this);
    this.scenes[6] = new SurprisesScene(this);
    this.scenes[7] = new GalleryScene(this);
    this.scenes[8] = new LetterScene(this);
    this.scenes[9] = new WishingSkyScene(this);
    this.scenes[10] = new FinaleScene(this);
  }

  setupUI() {
    // Build scene dots in header
    this.dotsContainer.innerHTML = "";
    for (let i = 1; i <= this.totalScenes; i++) {
      const dot = document.createElement("button");
      dot.className = `scene-dot ${i === 1 ? "active" : ""}`;
      dot.setAttribute("aria-label", `Scene ${i}`);
      dot.addEventListener("click", () => this.goToScene(i));
      this.dotsContainer.appendChild(dot);
    }

    // Build quick navigation menu items
    this.scenesGrid.innerHTML = "";
    this.sceneNames.forEach((name, idx) => {
      const item = document.createElement("button");
      item.className = "scene-menu-item";
      item.textContent = name;
      item.addEventListener("click", () => {
        this.goToScene(idx + 1);
        this.closeMenu();
      });
      this.scenesGrid.appendChild(item);
    });

    // Quick navigation toggle
    document.getElementById("btn-quick-nav").addEventListener("click", () => {
      this.sceneMenuModal.classList.toggle("hidden");
    });
    document.getElementById("btn-close-menu").addEventListener("click", () => {
      this.closeMenu();
    });

    // Sound toggle
    const soundBtn = document.getElementById("btn-sound-toggle");
    const soundOn = soundBtn.querySelector(".icon-sound-on");
    const soundOff = soundBtn.querySelector(".icon-sound-off");

    soundBtn.addEventListener("click", () => {
      const isMuted = this.audio.toggleMute();
      if (isMuted) {
        soundOn.classList.add("hidden");
        soundOff.classList.remove("hidden");
        this.showToast("Audio muted 🔇");
      } else {
        soundOn.classList.remove("hidden");
        soundOff.classList.add("hidden");
        this.showToast("Audio unmuted 🔊");
      }
    });
  }

  closeMenu() {
    this.sceneMenuModal.classList.add("hidden");
  }

  goToScene(index) {
    if (this.isTransitioning || index === this.currentSceneIndex) return;
    if (index < 1 || index > this.totalScenes) return;

    this.isTransitioning = true;
    const currentEl = document.getElementById(`scene-${String(this.currentSceneIndex).padStart(2, "0")}`);
    const nextEl = document.getElementById(`scene-${String(index).padStart(2, "0")}`);

    if (currentEl) {
      currentEl.classList.remove("active");
    }

    setTimeout(() => {
      this.currentSceneIndex = index;

      if (nextEl) {
        nextEl.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Update progress bar & dots
      const progressPercent = (index / this.totalScenes) * 100;
      this.progressBar.style.width = `${progressPercent}%`;

      const dots = this.dotsContainer.querySelectorAll(".scene-dot");
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx + 1 === index);
      });

      // Call enter hook on target scene
      if (this.scenes[index] && typeof this.scenes[index].enter === "function") {
        this.scenes[index].enter();
      }

      this.isTransitioning = false;
    }, 400);
  }

  resetAll() {
    this.goToScene(1);
    this.showToast("Universe reset! Enjoy once again ✨");
  }

  showToast(message) {
    this.toastMsg.textContent = message;
    this.toastEl.classList.remove("hidden");
    gsap.fromTo(
      this.toastEl,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3 }
    );

    setTimeout(() => {
      gsap.to(this.toastEl, {
        y: 20,
        opacity: 0,
        duration: 0.3,
        onComplete: () => this.toastEl.classList.add("hidden")
      });
    }, 2500);
  }
}
