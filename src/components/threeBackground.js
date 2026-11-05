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
    this.createCelestialPortal();
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

  createCelestialPortal() {
    this.portalGroup = new THREE.Group();
    this.portalGroup.position.set(0, 25, -20);
    this.scene.add(this.portalGroup);

    // Ring 1: Outer Celestial Ring
    const torusMat1 = new THREE.MeshBasicMaterial({
      color: 0xF4D58D,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    this.ringOuter = new THREE.Mesh(new THREE.TorusGeometry(125, 0.8, 16, 90), torusMat1);
    this.ringOuter.rotation.x = Math.PI / 3;
    this.portalGroup.add(this.ringOuter);

    // Ring 2: Middle Gyroscope Ring
    const torusMat2 = new THREE.MeshBasicMaterial({
      color: 0xFFD3DA,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    this.ringMid = new THREE.Mesh(new THREE.TorusGeometry(95, 0.8, 16, 80), torusMat2);
    this.ringMid.rotation.y = Math.PI / 4;
    this.portalGroup.add(this.ringMid);

    // Ring 3: Inner Fast Ring
    const torusMat3 = new THREE.MeshBasicMaterial({
      color: 0xFFEAA7,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    this.ringInner = new THREE.Mesh(new THREE.TorusGeometry(68, 1.0, 16, 70), torusMat3);
    this.ringInner.rotation.z = Math.PI / 6;
    this.portalGroup.add(this.ringInner);

    // Central Radiant Crystal Core
    const coreGeo = new THREE.IcosahedronGeometry(14, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    this.portalCore = new THREE.Mesh(coreGeo, coreMat);
    this.portalGroup.add(this.portalCore);

    // Inner glowing sphere inside the crystal
    const innerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(7, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0xF4D58D,
        transparent: true,
        opacity: 0.95
      })
    );
    this.portalCore.add(innerSphere);

    // Orbiting Satellite Stars
    this.satellites = [];
    const starGeo = new THREE.SphereGeometry(2.2, 12, 12);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

    for (let i = 0; i < 6; i++) {
      const sat = new THREE.Mesh(starGeo, starMat);
      sat.userData = {
        radius: 70 + (i % 3) * 25,
        speed: 0.8 + i * 0.25,
        angle: (i / 6) * Math.PI * 2,
        ringIdx: i % 3
      };
      this.portalGroup.add(sat);
      this.satellites.push(sat);
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

    // Elegant Multidimensional Rotation of Celestial Portal
    if (this.portalGroup) {
      if (this.ringOuter) {
        this.ringOuter.rotation.x += 0.003;
        this.ringOuter.rotation.y += 0.004;
      }
      if (this.ringMid) {
        this.ringMid.rotation.y -= 0.005;
        this.ringMid.rotation.z += 0.003;
      }
      if (this.ringInner) {
        this.ringInner.rotation.x -= 0.004;
        this.ringInner.rotation.z -= 0.006;
      }
      if (this.portalCore) {
        this.portalCore.rotation.x = elapsedTime * 0.35;
        this.portalCore.rotation.y = elapsedTime * 0.45;
        const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.08;
        this.portalCore.scale.set(pulse, pulse, pulse);
      }

      // Orbiting satellites along rings
      if (this.satellites) {
        this.satellites.forEach((sat) => {
          sat.userData.angle += 0.012 * sat.userData.speed;
          const r = sat.userData.radius;
          const a = sat.userData.angle;
          if (sat.userData.ringIdx === 0) {
            sat.position.set(Math.cos(a) * r, Math.sin(a) * r * 0.5, Math.sin(a) * r * 0.86);
          } else if (sat.userData.ringIdx === 1) {
            sat.position.set(Math.cos(a) * r * 0.7, Math.sin(a) * r, Math.cos(a) * r * 0.7);
          } else {
            sat.position.set(Math.sin(a) * r * 0.8, Math.cos(a) * r * 0.6, Math.cos(a) * r);
          }
        });
      }

      this.portalGroup.position.y = 20 + Math.sin(elapsedTime * 0.6) * 6;
    }

    this.updateShootingStars();
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.renderer) this.renderer.dispose();
  }
}
