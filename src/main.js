/**
 * ISHIKA — A Magical Birthday Universe
 * Main Entry Point
 */

import { ThreeBackground } from "./components/threeBackground.js";
import { ParticleEngine } from "./components/particleEngine.js";
import { AudioManager } from "./components/audioManager.js";
import { SceneManager } from "./components/sceneManager.js";
import { Controls } from "./components/controls.js";
import { CONFIG } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Audio Engine
  const audioManager = new AudioManager();

  // 2. Initialize 3D Three.js Cosmic Canvas
  const bgCanvas = document.getElementById("webgl-canvas");
  const threeBg = new ThreeBackground(bgCanvas);

  // 3. Initialize Particle & Atmospheric Effects
  const ambientOverlay = document.getElementById("ambient-overlay");
  const fxCanvas = document.getElementById("fx-canvas");
  const particleEngine = new ParticleEngine(ambientOverlay, fxCanvas);

  // 4. Initialize Scene Orchestrator
  const sceneManager = new SceneManager(audioManager, particleEngine);

  // 5. Initialize UI Controls & Magic Cursor
  new Controls(sceneManager);

  // 6. Enter Opening Scene
  if (sceneManager.scenes[1]) {
    sceneManager.scenes[1].enter();
  }

  console.log(`✨ Ishika's Magical Birthday Universe initialized successfully! ✨`);
});
