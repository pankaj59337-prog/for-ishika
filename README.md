# ISHIKA — A Magical Birthday Universe ✨

> An extraordinary, complete, production-ready interactive 3D birthday experience crafted for **Ishika**.

Built with the craftsmanship of an award-winning digital campaign, combining Disney-like enchanted atmosphere with Apple-grade polish.

---

## 🌟 Master Experience: 10 Interactive Scenes

1. **Scene 01 — Cinematic Loading Intro**:
   - 3D cosmic starfield with softly twinkling stardust.
   - Parametric 3D golden constellation forming a heart orbit with trailing comets.
   - Smooth progress bar with starlight gathering and a clear "Begin the Magic" / "Skip Intro" option.
2. **Scene 02 — The Secret Invitation**:
   - Luxurious floating invitation card with gold foil borders, rose-gold accents, and floral ornaments.
   - Real-time 3D tilt tracking with cursor/touch.
   - Dissolves into golden dust upon entering.
3. **Scene 03 — The 3D Magic Gift Box**:
   - Blush-pink luxury gift box with 3D golden silk ribbon and ornate bow.
   - Interactive hover tilt and click/touch shake.
   - Ribbon unties, lid lifts and floats away, emitting bright golden light, confetti, and floating balloons.
4. **Scene 04 — The Ultimate Birthday Name Reveal**:
   - Iconic champagne-gold 3D typography for **"HAPPY BIRTHDAY ISHIKA"**.
   - Fireworks burst, floating balloons, falling rose petals, and atmospheric butterflies.
5. **Scene 05 — Interactive Birthday Cake**:
   - Multi-tier pastel celebration cake with gold leaf, sugar pearls, and edible flowers.
   - Smoothly flickering independent candle flames.
   - Tap "Blow Out the Candles" to extinguish flames with rising smoke puffs and unlock a cosmic blessing banner.
6. **Scene 06 — The Surprise Treasure Room**:
   - 4 Interactive secrets:
     - **A. Magic Envelope**: Unfolds with a gold wax seal to reveal heartfelt message.
     - **B. Scratch to Reveal**: Metallic lavender canvas scratch-off revealing `"YOU ARE AMAZING, ISHIKA! ✨"`.
     - **C. Balloon Pop**: 3 floating balloons with sound effects and secret wishes.
     - **D. The Wishing Star**: Interactive glowing star that launches skyward with a golden trail.
7. **Scene 07 — The Magic Memory Gallery**:
   - 3D carousel with polaroid frames, smooth swipe & arrow controls.
   - Fallback illustrated art cards for joy, memories, adventure, and new horizons.
   - Real-time photo uploader button to add personal photos on the fly.
8. **Scene 08 — The Letter from the Heart**:
   - Handwritten-style ivory parchment with rose-gold flourishes.
   - Complete birthday letter with staggered cinematic reveal.
   - **"Keep This Wish 💌"** button that renders and downloads a high-resolution 1200x1600 birthday card via HTML5 Canvas.
9. **Scene 09 — The Magical Wishing Sky**:
   - Celestial nighttime sky with 6 interactive stars.
   - SVG constellation connectors that map connections between stars.
   - Once all 6 stars are gathered, the constellation spells out **"I S H I K A"** in glowing starlight.
10. **Scene 10 — The Grand Cinematic Finale**:
    - Grand celebration sky with golden comet, blooming fireworks, and grand typography.
    - "Experience Again 🔄" with full state reset.
    - "Share This Surprise 🔗" with Web Share API and clipboard copy fallback.
    - "Download Birthday Card 🎁" keepsake exporter.

---

## 🎨 Visual Design System

- **Midnight Purple**: `#130824`
- **Deep Plum**: `#291036`
- **Lavender**: `#BE9BFF`
- **Blush Pink**: `#F8BBD9`
- **Champagne Gold**: `#F4D58D`
- **Ivory**: `#FFF8F0`
- **Rose Gold**: `#D99A9D`
- **Typography**: Cinzel Decorative, Cormorant Garamond, Playfair Display, and Outfit.

---

## 🎵 Sound Design & Web Audio Synthesizer

- Built-in procedural harmonic synth using the **Web Audio API**.
- Dreamy F# Major Pentatonic ambient chord arpeggios.
- Procedural SFX: celestial chimes, sparkle sweeps, balloon pops, candle breath puffs, and celebratory fanfares.
- **Zero external MP3 dependencies required to run with full audio out of the box.**
- Audio is 100% opt-in and respects browser autoplay policies.

---

## ⚙️ Configuration & Personalization

All text, colors, wishes, and assets can be edited centrally in `src/config.js`:

```javascript
export const CONFIG = {
  birthdayPersonName: "Ishika",
  birthdayTitle: "Happy Birthday",
  themeColors: { ... },
  recipientMessage: "...",
  photoAssets: []
};
```

---

## 🚀 How to Run Locally

1. **Install Dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. Open the provided localhost URL (typically `http://localhost:5173`) in your browser.

---

## 📦 How to Build for Production

```bash
npm run build
```

The optimized, minified production assets will be generated in the `dist/` directory, ready to deploy to Vercel, Netlify, or GitHub Pages.
