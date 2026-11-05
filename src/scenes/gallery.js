/**
 * SCENE 07: The Magic Memory Gallery
 * Enhanced with persistent storage, drag-and-drop upload, and enchanted Lightbox!
 */

import gsap from "gsap";
import { CONFIG } from "../config.js";

export class GalleryScene {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.el = document.getElementById("scene-07");
    this.track = document.getElementById("gallery-track");
    this.viewport = document.getElementById("gallery-viewport");
    this.prevBtn = document.getElementById("btn-gallery-prev");
    this.nextBtn = document.getElementById("btn-gallery-next");
    this.proceedBtn = document.getElementById("btn-gallery-proceed");
    this.fileInput = document.getElementById("photo-file-input");

    // Lightbox modal elements
    this.lightbox = document.getElementById("photo-lightbox-modal");
    this.lightboxImg = document.getElementById("lightbox-img");
    this.lightboxTitle = document.getElementById("lightbox-title");
    this.lightboxCaption = document.getElementById("lightbox-caption");
    this.closeLightboxBtn = document.getElementById("btn-close-lightbox");
    this.lightboxBackdrop = document.getElementById("lightbox-backdrop");

    this.currentIndex = 0;
    this.cardsData = [];

    this.loadCards();
    this.setupEvents();
  }

  loadCards() {
    // 1. Check CONFIG.photoAssets first (real photos configured)
    if (CONFIG.photoAssets && CONFIG.photoAssets.length > 0) {
      this.cardsData = CONFIG.photoAssets;
      this.renderCards();
      return;
    }

    // 2. Check local storage for previously uploaded photos
    const saved = localStorage.getItem("ishika_birthday_photos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.cardsData = parsed;
          this.renderCards();
          return;
        }
      } catch (e) {
        // Fallback
      }
    }

    // 3. Fallback to default illustrated artwork cards
    this.cardsData = CONFIG.defaultGalleryCards;
    this.renderCards();
  }

  renderCards() {
    this.track.innerHTML = "";
    this.cardsData.forEach((item, idx) => {
      const card = document.createElement("article");
      card.className = `polaroid-card ${idx === 0 ? "active" : ""}`;
      card.setAttribute("data-index", idx);

      let artHtml = "";
      if (item.url) {
        // Uploaded or real photo - full 100% view with luxury ambient background
        artHtml = `
          <div class="polaroid-art photo-art">
            <div class="photo-art-blur-bg" style="background-image: url('${item.url}');"></div>
            <img class="polaroid-main-img" src="${item.url}" alt="${item.title || 'Ishika Photo'}" loading="lazy" />
            <div class="photo-zoom-hint" title="Click to view full photo">🔍 Zoom Fullscreen</div>
          </div>
        `;
      } else {
        // Illustrated card
        artHtml = `
          <div class="polaroid-art ${item.artClass || 'art-bloom'}">
            <div class="art-graphic">${item.icon || '🌸'}</div>
            <div class="art-tag">${item.tag || 'Cherished'}</div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="polaroid-inner">
          ${artHtml}
          <div class="polaroid-caption">
            <h3>${item.title || 'Precious Memory'}</h3>
            <p>${item.caption || 'A joyful moment in Ishika\'s universe.'}</p>
          </div>
        </div>
      `;

      // Open Lightbox on click
      card.addEventListener("click", () => {
        this.openLightbox(item);
      });

      this.track.appendChild(card);
    });

    this.updateTrack();
  }

  setupEvents() {
    this.prevBtn.addEventListener("click", () => this.navigate(-1));
    this.nextBtn.addEventListener("click", () => this.navigate(1));

    this.proceedBtn.addEventListener("click", () => {
      this.sm.audio.playChime();
      this.sm.goToScene(8);
    });

    // File Input change
    this.fileInput.addEventListener("change", (e) => {
      this.handleFiles(Array.from(e.target.files));
    });

    // Drag and drop onto viewport
    this.viewport.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.viewport.classList.add("drag-over");
    });

    this.viewport.addEventListener("dragleave", () => {
      this.viewport.classList.remove("drag-over");
    });

    this.viewport.addEventListener("drop", (e) => {
      e.preventDefault();
      this.viewport.classList.remove("drag-over");
      if (e.dataTransfer && e.dataTransfer.files) {
        this.handleFiles(Array.from(e.dataTransfer.files));
      }
    });

    // Lightbox close events
    if (this.closeLightboxBtn) {
      this.closeLightboxBtn.addEventListener("click", () => this.closeLightbox());
    }
    if (this.lightboxBackdrop) {
      this.lightboxBackdrop.addEventListener("click", () => this.closeLightbox());
    }

    // Touch swipe support
    let startX = 0;
    this.track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });
    this.track.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (diff > 45) this.navigate(-1);
      if (diff < -45) this.navigate(1);
    });
  }

  handleFiles(files) {
    if (!files || files.length === 0) return;

    const newCards = [];
    let loaded = 0;

    files.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newCards.push({
          url: event.target.result,
          title: `Keepsake #${idx + 1}`,
          caption: "A timeless, beautiful memory of Ishika.",
          tag: "Ishika ✨"
        });
        loaded++;

        if (loaded === files.length) {
          this.cardsData = newCards;
          try {
            // Save to localStorage so photos persist across page refreshes!
            localStorage.setItem("ishika_birthday_photos", JSON.stringify(newCards));
          } catch (err) {
            // In case of storage quota
          }
          this.currentIndex = 0;
          this.renderCards();
          this.sm.audio.playWishGranted();
          this.sm.showToast(`✨ ${files.length} photos added to Ishika's gallery!`);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  openLightbox(item) {
    if (!this.lightbox) return;

    if (item.url) {
      this.lightboxImg.src = item.url;
      this.lightboxImg.style.display = "block";
    } else {
      // Illustrated placeholder in lightbox
      this.lightboxImg.style.display = "none";
    }

    this.lightboxTitle.textContent = item.title || "Precious Memory";
    this.lightboxCaption.textContent = item.caption || "A beautiful celebration for Ishika.";

    this.lightbox.classList.remove("hidden");
    this.sm.audio.playChime();

    gsap.fromTo(
      this.lightbox.querySelector(".lightbox-container"),
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
    );
  }

  closeLightbox() {
    if (!this.lightbox) return;
    gsap.to(this.lightbox.querySelector(".lightbox-container"), {
      scale: 0.85,
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        this.lightbox.classList.add("hidden");
      }
    });
  }

  enter() {
    this.currentIndex = 0;
    this.updateTrack();
    gsap.fromTo(
      this.track,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
    );
  }

  navigate(dir) {
    if (this.cardsData.length === 0) return;
    this.currentIndex = (this.currentIndex + dir + this.cardsData.length) % this.cardsData.length;
    this.updateTrack();
    this.sm.audio.playChime();
  }

  updateTrack() {
    gsap.to(this.track, {
      xPercent: -this.currentIndex * 100,
      duration: 0.6,
      ease: "power2.out"
    });
  }
}
