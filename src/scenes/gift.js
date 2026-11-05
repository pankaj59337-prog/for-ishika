/**
 * SCENE 03: The 3D Magic Gift Box
 */

import gsap from "gsap";

export class GiftScene {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.el = document.getElementById("scene-03");
    this.giftStage = document.getElementById("gift-stage");
    this.gift3D = document.getElementById("gift-3d-box");
    this.giftLid = document.getElementById("gift-lid");
    this.boxLight = document.getElementById("box-light");
    this.openBtn = document.getElementById("btn-open-gift");
    this.isOpened = false;

    this.setupEvents();
  }

  setupEvents() {
    const triggerOpen = () => {
      if (this.isOpened) return;
      this.openGift();
    };

    this.giftStage.addEventListener("click", triggerOpen);
    this.openBtn.addEventListener("click", triggerOpen);

    // Keyboard accessibility: Enter or Space opens gift
    this.giftStage.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerOpen();
      }
    });

    // Cursor interactive reaction
    this.giftStage.addEventListener("mousemove", (e) => {
      if (this.isOpened) return;
      const rect = this.giftStage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(this.gift3D, {
        rotationY: 28 + x * 35,
        rotationX: -18 - y * 25,
        duration: 0.3
      });
    });
  }

  enter() {
    this.isOpened = false;
    gsap.set(this.gift3D, { rotationY: 28, rotationX: -18, scale: 1, opacity: 1 });
    gsap.set(this.giftLid, { y: 0, rotationX: 0, rotationZ: 0, opacity: 1 });
    gsap.set(this.boxLight, { opacity: 0 });
    this.openBtn.style.display = "inline-flex";

    gsap.fromTo(
      this.giftStage,
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.5)" }
    );
  }

  openGift() {
    this.isOpened = true;
    this.openBtn.style.display = "none";
    this.sm.audio.playGiftOpen();

    const tl = gsap.timeline();

    // 1. Delicate shake
    tl.to(this.gift3D, {
      x: "+=8",
      yoyo: true,
      repeat: 8,
      duration: 0.05,
      ease: "power1.inOut"
    });

    // 2. Lid lifts and floats away
    tl.to(this.giftLid, {
      y: -140,
      rotationX: -45,
      rotationZ: 15,
      opacity: 0.85,
      duration: 0.9,
      ease: "power2.out"
    });

    // 3. Bright golden light emerges
    tl.to(this.boxLight, {
      opacity: 1,
      duration: 0.4
    }, "-=0.6");

    // 4. Confetti and sparkle burst
    tl.add(() => {
      const rect = this.giftStage.getBoundingClientRect();
      const cx = (rect.left + rect.width / 2) / window.innerWidth;
      const cy = (rect.top + rect.height / 2) / window.innerHeight;

      this.sm.particles.fireConfetti({ x: cx, y: cy });
      this.sm.particles.sparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);
    });

    // 5. Box ascends and fades into birthday reveal
    tl.to(this.giftStage, {
      scale: 1.25,
      opacity: 0,
      filter: "blur(15px)",
      duration: 0.9,
      ease: "power2.in",
      delay: 0.5,
      onComplete: () => {
        this.sm.goToScene(4);
      }
    });
  }
}
