/**
 * Accessibility Utilities
 */

export const Accessibility = {
  isReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  announce(message) {
    let announcer = document.getElementById("a11y-announcer");
    if (!announcer) {
      announcer = document.createElement("div");
      announcer.id = "a11y-announcer";
      announcer.setAttribute("aria-live", "polite");
      announcer.setAttribute("aria-atomic", "true");
      announcer.className = "sr-only";
      document.body.appendChild(announcer);
    }
    announcer.textContent = message;
  },

  trapFocus(element) {
    const focusableEls = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), [tabindex="0"]'
    );
    if (!focusableEls.length) return () => {};

    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    const handler = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          lastEl.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastEl) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener("keydown", handler);
    return () => element.removeEventListener("keydown", handler);
  }
};
