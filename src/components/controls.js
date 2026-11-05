/**
 * Global UI Controls & Custom Magic Cursor
 */

export class Controls {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.cursor = document.getElementById("magic-cursor");
    this.initCursor();
    this.initKeyboardShortcuts();
  }

  initCursor() {
    if (!this.cursor) return;
    if (window.matchMedia("(pointer: coarse)").matches) {
      this.cursor.style.display = "none";
      return;
    }

    let mouseX = -100;
    let mouseY = -100;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      this.cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    // Expand cursor on interactive elements
    const interactives = "a, button, input, [role='button'], .scene-dot, .mini-balloon";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(interactives)) {
        this.cursor.classList.add("cursor-hover");
      }
    });

    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(interactives)) {
        this.cursor.classList.remove("cursor-hover");
      }
    });
  }

  initKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      // Escape closes scene menu
      if (e.key === "Escape") {
        this.sm.closeMenu();
      }
      // ArrowRight goes next scene, ArrowLeft goes prev scene
      if (e.key === "ArrowRight" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        if (this.sm.currentSceneIndex < this.sm.totalScenes) {
          this.sm.goToScene(this.sm.currentSceneIndex + 1);
        }
      }
      if (e.key === "ArrowLeft" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        if (this.sm.currentSceneIndex > 1) {
          this.sm.goToScene(this.sm.currentSceneIndex - 1);
        }
      }
    });
  }
}
