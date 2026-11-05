/**
 * SCENE 02: The Secret Invitation
 */

import gsap from "gsap";

export class InvitationScene {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.el = document.getElementById("scene-02");
    this.card = document.getElementById("invitation-card");
    this.enterBtn = document.getElementById("btn-enter-universe");

    this.setupEvents();
  }

  setupEvents() {
    // 3D Card tilt on mousemove
    window.addEventListener("mousemove", (e) => {
      if (!this.el.classList.contains("active")) return;
      const rect = this.card.getBoundingClientRect();
      const cardX = rect.left + rect.width / 2;
      const cardY = rect.top + rect.height / 2;
      const angleX = (e.clientY - cardY) / 25;
      const angleY = -(e.clientX - cardX) / 25;
      gsap.to(this.card, {
        rotationX: angleX,
        rotationY: angleY,
        duration: 0.5,
        ease: "power1.out"
      });
    });

    this.enterBtn.addEventListener("click", (e) => {
      this.sm.audio.playMagicSparkle();
      
      const rect = this.enterBtn.getBoundingClientRect();
      this.sm.particles.sparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);

      // Dissolve card into golden dust
      gsap.to(this.card, {
        scale: 0.85,
        opacity: 0,
        filter: "blur(12px)",
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          this.sm.goToScene(3);
        }
      });
    });
  }

  enter() {
    gsap.set(this.card, { scale: 0.9, opacity: 0, filter: "blur(10px)", rotationX: 0, rotationY: 0 });
    gsap.to(this.card, {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.2,
      ease: "power3.out"
    });
  }
}
