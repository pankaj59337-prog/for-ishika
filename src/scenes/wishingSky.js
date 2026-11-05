/**
 * SCENE 09: The Magical Wishing Sky
 */

import gsap from "gsap";

export class WishingSkyScene {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.el = document.getElementById("scene-09");
    this.starBtns = document.querySelectorAll(".wishing-star-btn");
    this.countEl = document.getElementById("sky-star-count");
    this.toastText = document.getElementById("toast-text");
    this.svg = document.getElementById("constellation-svg");
    this.nameReveal = document.getElementById("sky-constellation-name");
    this.unlockBtn = document.getElementById("btn-unlock-finale");

    this.collectedStars = new Set();
    this.starCoords = [];

    this.setupEvents();
  }

  setupEvents() {
    this.starBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => this.collectStar(btn, idx));
    });

    this.unlockBtn.addEventListener("click", () => {
      this.sm.audio.playFanfare();
      this.sm.goToScene(10);
    });
  }

  enter() {
    this.collectedStars.clear();
    this.countEl.textContent = "0";
    this.unlockBtn.classList.add("hidden");
    this.nameReveal.classList.add("hidden");
    this.svg.innerHTML = "";

    this.starBtns.forEach((btn) => {
      btn.classList.remove("collected");
      gsap.fromTo(
        btn,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, delay: Math.random() * 0.4, ease: "back.out(1.8)" }
      );
    });

    this.toastText.textContent = "Tap any star to awaken a cosmic blessing";
  }

  collectStar(btn, idx) {
    if (this.collectedStars.has(idx)) return;
    this.collectedStars.add(idx);

    btn.classList.add("collected");
    const blessing = btn.getAttribute("data-blessing");
    this.toastText.textContent = `✦ "${blessing}" ✦`;
    this.countEl.textContent = this.collectedStars.size;

    this.sm.audio.playStarCollect(idx);

    const rect = btn.getBoundingClientRect();
    this.sm.particles.sparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);

    // Record star coordinate for constellation SVG
    const parentRect = document.getElementById("celestial-sky-stage").getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - parentRect.left;
    const cy = rect.top + rect.height / 2 - parentRect.top;
    this.starCoords.push({ x: cx, y: cy });

    this.drawConstellationLine();

    // When all 6 collected -> Form ISHIKA constellation & unlock finale
    if (this.collectedStars.size === 6) {
      this.revealConstellationName();
    }
  }

  drawConstellationLine() {
    if (this.starCoords.length < 2) return;
    const p1 = this.starCoords[this.starCoords.length - 2];
    const p2 = this.starCoords[this.starCoords.length - 1];

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", p1.x);
    line.setAttribute("y1", p1.y);
    line.setAttribute("x2", p2.x);
    line.setAttribute("y2", p2.y);
    line.setAttribute("stroke", "rgba(244, 213, 141, 0.75)");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("stroke-dasharray", "4 4");
    this.svg.appendChild(line);
  }

  revealConstellationName() {
    this.toastText.textContent = "✨ The Stars Have Aligned For ISHIKA! ✨";
    this.nameReveal.classList.remove("hidden");
    
    gsap.fromTo(
      this.nameReveal.querySelectorAll(".c-letter"),
      { opacity: 0, scale: 0.5, y: -20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "back.out(2)" }
    );

    this.sm.particles.fireConfetti({ x: 0.5, y: 0.5 });

    setTimeout(() => {
      this.unlockBtn.classList.remove("hidden");
      gsap.fromTo(
        this.unlockBtn,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }
      );
    }, 800);
  }
}
