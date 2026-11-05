/**
 * Three.js Background Visual Engine
 * Manages cosmic starfield, 3D heart constellation, and shooting stars
 */

import * as THREE from "three";
import { Performance } from "../utils/performance.js";

export class ThreeBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.starPoints = null;
    this.heartLine = null;
    this.shootingStars = [];
    this.targetMouse = { x: 0, y: 0 };
    this.currentMouse = { x: 0, y: 0 };
    this.clock = new THREE.Clock();
    this.animFrameId = null;
    this.isRunning = true;

    this.init();
  }

  init() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x130824, 0.0012);

    // Camera setup
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 2000);
    this.camera.position.z = 400;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Performance.getOptimalDPR());
    this.renderer.setClearColor(0x130824, 1);

    this.createStarfield();
    this.createHeartConstellation();
    this.setupEventListeners();
    this.animate();
  }

  createStarfield() {
    const starCount = Performance.isLowPowerDevice() ? 1200 : 2500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const goldColor = new THREE.Color(0xF4D58D);
    const lavenderColor = new THREE.Color(0xBE9BFF);
    const blushColor = new THREE.Color(0xF8BBD9);
    const ivoryColor = new THREE.Color(0xFFF8F0);

    const palette = [goldColor, lavenderColor, blushColor, ivoryColor];

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Spherical distribution
      const radius = 300 + Math.random() * 900;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 2.8 + 1.0;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Particle texture
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.3, "rgba(244,213,141,0.8)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 4,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.starPoints = new THREE.Points(geometry, material);
    this.scene.add(this.starPoints);
  }

  createHeartConstellation() {
    // 3D parametric heart curve
    const points = [];
    const numPoints = 180;
    for (let i = 0; i <= numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 2;
      // Heart formula
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const z = Math.sin(t * 2) * 5;
      points.push(new THREE.Vector3(x * 6, y * 6, z * 6));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xF4D58D,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      linewidth: 1.5
    });

    this.heartLine = new THREE.Line(geometry, material);
    this.heartLine.position.set(0, 20, 50);
    this.scene.add(this.heartLine);

    // Glowing heart node stars
    const nodeGeo = new THREE.SphereGeometry(1.4, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xFFE8A3 });
    for (let i = 0; i < points.length; i += 15) {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      mesh.position.copy(points[i]);
      this.heartLine.add(mesh);
    }
  }

  spawnShootingStar() {
    if (this.shootingStars.length >= 2) return;

    const startX = (Math.random() - 0.5) * 600;
    const startY = 150 + Math.random() * 150;
    const startZ = 100 + Math.random() * 200;

    const dir = new THREE.Vector3(
      -(Math.random() * 2 + 3),
      -(Math.random() * 1.5 + 2),
      -1
    ).normalize();

    const trailLength = 40;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(trailLength * 3);
    for (let i = 0; i < trailLength * 3; i++) positions[i] = 0;

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: 0xFFF8F0,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const star = {
      mesh: new THREE.Line(geometry, material),
      pos: new THREE.Vector3(startX, startY, startZ),
      velocity: dir.multiplyScalar(14),
      history: [],
      life: 1.0,
      decay: 0.015
    };

    this.scene.add(star.mesh);
    this.shootingStars.push(star);
  }

  updateShootingStars() {
    // Random chance to spawn
    if (Math.random() < 0.02) {
      this.spawnShootingStar();
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const star = this.shootingStars[i];
      star.pos.add(star.velocity);
      star.history.unshift(star.pos.clone());

      if (star.history.length > 25) {
        star.history.pop();
      }

      const positions = star.mesh.geometry.attributes.position.array;
      for (let j = 0; j < star.history.length; j++) {
        const j3 = j * 3;
        positions[j3] = star.history[j].x;
        positions[j3 + 1] = star.history[j].y;
        positions[j3 + 2] = star.history[j].z;
      }
      star.mesh.geometry.attributes.position.needsUpdate = true;

      star.life -= star.decay;
      star.mesh.material.opacity = star.life;

      if (star.life <= 0) {
        this.scene.remove(star.mesh);
        star.mesh.geometry.dispose();
        star.mesh.material.dispose();
        this.shootingStars.splice(i, 1);
      }
    }
  }

  setupEventListeners() {
    window.addEventListener("resize", () => {
      if (!this.renderer || !this.camera) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener("mousemove", (e) => {
      this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    document.addEventListener("visibilitychange", () => {
      this.isRunning = !document.hidden;
    });
  }

  animate() {
    this.animFrameId = requestAnimationFrame(() => this.animate());
    if (!this.isRunning) return;

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth camera mouse follow
    this.currentMouse.x += (this.targetMouse.x - this.currentMouse.x) * 0.04;
    this.currentMouse.y += (this.targetMouse.y - this.currentMouse.y) * 0.04;

    this.camera.position.x = this.currentMouse.x * 35;
    this.camera.position.y = this.currentMouse.y * 25;
    this.camera.lookAt(0, 0, 0);

    // Slow rotation of starfield
    if (this.starPoints) {
      this.starPoints.rotation.y = elapsedTime * 0.02;
      this.starPoints.rotation.x = Math.sin(elapsedTime * 0.015) * 0.05;
    }

    // Slow orbit of heart constellation
    if (this.heartLine) {
      this.heartLine.rotation.y = elapsedTime * 0.12;
      this.heartLine.rotation.z = Math.sin(elapsedTime * 0.25) * 0.1;
      this.heartLine.position.y = 10 + Math.sin(elapsedTime * 0.8) * 8;
    }

    this.updateShootingStars();
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.renderer) this.renderer.dispose();
  }
}
