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
    // Pure Cosmic Midnight Velvet Atmosphere
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x090412, 0.001);

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
    this.renderer.setClearColor(0x090412, 1);

    this.createStarfield();
    this.createFloatingBalloons();
    this.setupEventListeners();
    this.animate();
  }

  createStarfield() {
    const starCount = Performance.isLowPowerDevice() ? 1200 : 2500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const diamondWhite = new THREE.Color(0xFFFFFF);
    const champagneGold = new THREE.Color(0xF4D58D);
    const rosePink = new THREE.Color(0xFF9EAA);
    const blushSoft = new THREE.Color(0xFFD3DA);

    const palette = [diamondWhite, champagneGold, rosePink, blushSoft];

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
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

      sizes[i] = Math.random() * 2.8 + 1.2;
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
    grad.addColorStop(0.35, "rgba(244,213,141,0.9)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 4.2,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.starPoints = new THREE.Points(geometry, material);
    this.scene.add(this.starPoints);
  }

  createFloatingBalloons() {
    this.balloonGroup = new THREE.Group();
    this.scene.add(this.balloonGroup);

    this.balloons = [];
    const balloonCount = Performance.isLowPowerDevice() ? 10 : 20;
    const colors = [0xF8BBD9, 0xFF7597, 0xF6D365, 0xE8D4FF, 0xFFCAD4, 0xF4D58D];

    for (let i = 0; i < balloonCount; i++) {
      const radius = 10 + Math.random() * 8;
      const sphereGeo = new THREE.SphereGeometry(radius, 20, 20);
      const color = colors[i % colors.length];

      const mat = new THREE.MeshPhongMaterial({
        color: color,
        shininess: 70,
        specular: 0xffffff,
        transparent: true,
        opacity: 0.88
      });

      const balloon = new THREE.Mesh(sphereGeo, mat);
      balloon.scale.set(1, 1.28, 1); // Natural balloon oval shape

      // Tiny knot at base
      const knotGeo = new THREE.ConeGeometry(2, 3, 8);
      const knotMat = new THREE.MeshBasicMaterial({ color: color });
      const knot = new THREE.Mesh(knotGeo, knotMat);
      knot.rotation.x = Math.PI;
      knot.position.y = -radius * 1.28;
      balloon.add(knot);

      // Random position across space
      balloon.position.x = (Math.random() - 0.5) * 550;
      balloon.position.y = -300 + Math.random() * 600;
      balloon.position.z = -150 + Math.random() * 250;

      balloon.userData = {
        speed: 0.35 + Math.random() * 0.45,
        wobbleSpeed: 1 + Math.random() * 1.5,
        wobbleAmp: 0.4 + Math.random() * 0.6,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        startX: balloon.position.x
      };

      this.balloonGroup.add(balloon);
      this.balloons.push(balloon);
    }

    // Warm ambient point lights for balloons
    const light1 = new THREE.PointLight(0xF4D58D, 1.5, 800);
    light1.position.set(100, 150, 200);
    this.scene.add(light1);

    const light2 = new THREE.PointLight(0xFF85A1, 1.2, 800);
    light2.position.set(-150, -100, 150);
    this.scene.add(light2);
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

    // Smooth upward drift of 3D celebration balloons
    if (this.balloons) {
      this.balloons.forEach((b) => {
        b.position.y += b.userData.speed;
        b.rotation.y += b.userData.rotSpeed;
        b.position.x = b.userData.startX + Math.sin(elapsedTime * b.userData.wobbleSpeed) * 12;

        // Wrap around when rising past top
        if (b.position.y > 360) {
          b.position.y = -360;
          b.position.x = (Math.random() - 0.5) * 550;
          b.userData.startX = b.position.x;
        }
      });
    }

    this.updateShootingStars();
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.renderer) this.renderer.dispose();
  }
}
