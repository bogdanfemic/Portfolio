import * as THREE from 'three';
import { NEON_DRIFT_CONFIG } from './config';
import { CollectibleManager } from './CollectibleManager';
import { Input } from './Input';
import { ObstacleManager } from './ObstacleManager';
import { Particles } from './Particles';
import { Player } from './Player';
import { Tunnel } from './Tunnel';
import { createSnapshot, readBestScore, saveBestScore } from './UI';
import { GameSnapshot, GameState } from './types';

interface GameOptions {
  reducedMotion: boolean;
  onSnapshot: (snapshot: GameSnapshot) => void;
}

export class Game {
  private container: HTMLElement;
  private options: GameOptions;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private input: Input;
  private player = new Player();
  private tunnel = new Tunnel();
  private obstacles = new ObstacleManager();
  private collectibles = new CollectibleManager();
  private particles = new Particles();
  private stars: THREE.Points;
  private animationFrame = 0;
  private lastTime = 0;
  private state: GameState = 'idle';
  private elapsed = 0;
  private score = 0;
  private bestScore = readBestScore();
  private boostTimer = 0;
  private shake = 0;
  private fovPulse = 0;
  private hidden = false;

  constructor(container: HTMLElement, options: GameOptions) {
    this.container = container;
    this.options = options;
    this.camera = new THREE.PerspectiveCamera(70, 1, 0.1, 180);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.input = new Input(container);
    this.stars = this.createSpeedLines();

    this.configureScene();
    this.resize();
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', this.resize);
    document.addEventListener('visibilitychange', this.handleVisibility);
    this.publish();
    this.loop(performance.now());
  }

  start() {
    this.state = 'playing';
    this.elapsed = 0;
    this.score = 0;
    this.boostTimer = 0;
    this.shake = 0;
    this.fovPulse = 0;
    this.player.reset();
    this.tunnel.reset();
    this.obstacles.reset();
    this.collectibles.reset();
    this.input.setActive(true);
    this.publish();
  }

  restart() {
    this.start();
  }

  setReducedMotion(reducedMotion: boolean) {
    this.options.reducedMotion = reducedMotion;
  }

  dispose() {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.resize);
    document.removeEventListener('visibilitychange', this.handleVisibility);
    this.input.dispose();
    this.renderer.dispose();
  }

  private configureScene() {
    this.scene.background = new THREE.Color(NEON_DRIFT_CONFIG.colors.background);
    this.scene.fog = new THREE.FogExp2(NEON_DRIFT_CONFIG.colors.background, 0.026);
    this.camera.position.set(0, 1.15, 7.35);
    this.camera.lookAt(0, 0, -15);
    this.renderer.setClearColor(NEON_DRIFT_CONFIG.colors.background, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    const ambient = new THREE.AmbientLight(0x6f7cff, 0.52);
    const cyanLight = new THREE.PointLight(NEON_DRIFT_CONFIG.colors.cyan, 16, 18);
    cyanLight.position.set(-3.5, 2.8, 3.5);
    const magentaLight = new THREE.PointLight(NEON_DRIFT_CONFIG.colors.magenta, 12, 18);
    magentaLight.position.set(3.8, -2.1, -4);

    this.scene.add(ambient, cyanLight, magentaLight, this.tunnel.group, this.stars, this.player.group, this.obstacles.group, this.collectibles.group, this.particles.group);
  }

  private loop = (time: number) => {
    const rawDelta = Math.min(0.05, (time - this.lastTime) / 1000 || 0);
    this.lastTime = time;

    if (!this.hidden) {
      this.update(rawDelta);
      this.renderer.render(this.scene, this.camera);
    }

    this.animationFrame = requestAnimationFrame(this.loop);
  };

  private update(delta: number) {
    const speed = this.currentSpeed();
    this.input.update(this.player.position.x, this.player.position.y);
    this.tunnel.update(delta, this.state === 'playing' ? speed : NEON_DRIFT_CONFIG.speed.base * 0.46);
    this.updateSpeedLines(delta, speed);
    this.particles.update(delta);

    if (this.state !== 'playing') {
      this.updateCamera(delta);
      return;
    }

    this.elapsed += delta;
    this.score += delta * speed * 8;
    this.player.update(delta, this.input.direction);
    this.obstacles.update(delta, speed, this.elapsed);
    this.collectibles.update(delta, speed);

    if (this.boostTimer > 0) this.boostTimer -= delta;
    this.checkCollisions();
    this.updateCamera(delta);
    this.publish();
  }

  private checkCollisions() {
    const playerRadius = NEON_DRIFT_CONFIG.player.radius;
    const playerPosition = this.player.position;

    const collectible = this.collectibles.collectNear(playerPosition, playerRadius);
    if (collectible) {
      this.score += 240;
      this.boostTimer = NEON_DRIFT_CONFIG.speed.boostDuration;
      this.shake = Math.max(this.shake, this.options.reducedMotion ? 0.045 : 0.14);
      this.fovPulse = NEON_DRIFT_CONFIG.camera.boostPulse;
      this.particles.burst(new THREE.Vector3(collectible.x, collectible.y, collectible.z), NEON_DRIFT_CONFIG.colors.amber, 18, 5.5, this.options.reducedMotion);
    }

    if (this.elapsed < NEON_DRIFT_CONFIG.player.gracePeriod) return;

    for (const obstacle of this.obstacles.getActiveColliders()) {
      const distance = Math.hypot(obstacle.x - playerPosition.x, obstacle.y - playerPosition.y, obstacle.z - playerPosition.z);
      if (distance < obstacle.radius + playerRadius) {
        this.crash();
        break;
      }
    }
  }

  private crash() {
    this.state = 'gameover';
    this.input.setActive(false);
    this.bestScore = saveBestScore(Math.round(this.score));
    this.shake = this.options.reducedMotion ? 0.08 : NEON_DRIFT_CONFIG.camera.shakeIntensity;
    this.particles.burst(this.player.group.position, NEON_DRIFT_CONFIG.colors.danger, 48, 8, this.options.reducedMotion);
    this.publish();
  }

  private currentSpeed() {
    const normalSpeed = Math.min(NEON_DRIFT_CONFIG.speed.max, NEON_DRIFT_CONFIG.speed.base + this.elapsed * NEON_DRIFT_CONFIG.speed.rampPerSecond);
    return normalSpeed + (this.boostTimer > 0 ? NEON_DRIFT_CONFIG.speed.boostBonus : 0);
  }

  private updateCamera(delta: number) {
    const targetX = this.player.position.x * 0.18;
    const targetY = 1.08 + this.player.position.y * 0.15;
    const shakeAmount = this.options.reducedMotion ? this.shake * 0.35 : this.shake;
    this.shake = Math.max(0, this.shake - delta * 1.8);
    this.fovPulse = Math.max(0, this.fovPulse - delta * 12);

    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, targetX, 0.08);
    this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, targetY, 0.08);
    this.camera.position.x += (Math.random() - 0.5) * shakeAmount;
    this.camera.position.y += (Math.random() - 0.5) * shakeAmount;
    this.camera.rotation.z = THREE.MathUtils.lerp(this.camera.rotation.z, -this.player.position.x * 0.025, 0.06);
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, 70 + this.fovPulse, 0.16);
    this.camera.updateProjectionMatrix();
  }

  private createSpeedLines() {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    for (let i = 0; i < 180; i += 1) {
      positions.push(THREE.MathUtils.randFloatSpread(11), THREE.MathUtils.randFloatSpread(6), -Math.random() * 120);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: NEON_DRIFT_CONFIG.colors.blue,
      size: 0.035,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.Points(geometry, material);
  }

  private updateSpeedLines(delta: number, speed: number) {
    const positions = this.stars.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < positions.count; i += 1) {
      const z = positions.getZ(i) + speed * delta * 2.2;
      positions.setZ(i, z > 5 ? -120 - Math.random() * 30 : z);
    }
    positions.needsUpdate = true;
  }

  private resize = () => {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.setSize(width, height, false);
  };

  private handleVisibility = () => {
    this.hidden = document.hidden;
    this.lastTime = performance.now();
  };

  private publish() {
    this.options.onSnapshot(createSnapshot(this.state, this.score, this.currentSpeed(), this.bestScore));
  }
}
