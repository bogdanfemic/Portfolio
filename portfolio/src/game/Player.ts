import * as THREE from 'three';
import { NEON_DRIFT_CONFIG } from './config';

export class Player {
  readonly group = new THREE.Group();
  readonly position = new THREE.Vector3();

  private target = new THREE.Vector3();
  private trailLights: THREE.Mesh[] = [];
  private clock = 0;

  constructor() {
    this.group.name = 'NeonDriftPlayer';
    this.createCar();
    this.reset();
  }

  reset() {
    this.position.set(0, 0, 0);
    this.target.set(0, 0, 0);
    this.group.position.copy(this.position);
    this.group.rotation.set(0, 0, 0);
  }

  update(delta: number, direction: { x: number; y: number }) {
    const bounds = NEON_DRIFT_CONFIG.bounds;
    this.clock += delta;

    this.target.x = THREE.MathUtils.clamp(
      this.target.x + direction.x * NEON_DRIFT_CONFIG.player.movementSpeed * delta,
      -bounds.x,
      bounds.x,
    );
    this.target.y = THREE.MathUtils.clamp(
      this.target.y + direction.y * NEON_DRIFT_CONFIG.player.movementSpeed * delta,
      -bounds.y,
      bounds.y,
    );

    this.position.lerp(this.target, 1 - Math.pow(0.001, delta));
    const bob = Math.sin(this.clock * 7) * 0.055;
    this.group.position.set(this.position.x, this.position.y + bob, 0);

    // Banking communicates drift direction without changing the collision shape.
    this.group.rotation.z = THREE.MathUtils.lerp(this.group.rotation.z, -direction.x * 0.46, 0.12);
    this.group.rotation.x = THREE.MathUtils.lerp(this.group.rotation.x, direction.y * 0.18, 0.1);
    this.group.rotation.y = THREE.MathUtils.lerp(this.group.rotation.y, direction.x * 0.16, 0.1);

    this.trailLights.forEach((trail, index) => {
      const scale = 1 + Math.sin(this.clock * 10 + index) * 0.15;
      trail.scale.z = scale;
    });
  }

  private createCar() {
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x11172c,
      metalness: 0.68,
      roughness: 0.24,
      emissive: new THREE.Color(0x120826),
      emissiveIntensity: 0.65,
    });
    const cyanGlow = new THREE.MeshBasicMaterial({ color: NEON_DRIFT_CONFIG.colors.cyan });
    const magentaGlow = new THREE.MeshBasicMaterial({ color: NEON_DRIFT_CONFIG.colors.magenta });
    const glass = new THREE.MeshStandardMaterial({
      color: 0x201546,
      metalness: 0.2,
      roughness: 0.08,
      emissive: new THREE.Color(NEON_DRIFT_CONFIG.colors.purple),
      emissiveIntensity: 0.85,
      transparent: true,
      opacity: 0.86,
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.28, 1.12), bodyMaterial);
    body.position.z = -0.05;
    this.group.add(body);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.62, 4), bodyMaterial);
    nose.rotation.x = Math.PI / 2;
    nose.position.z = -0.78;
    this.group.add(nose);

    const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 8), glass);
    cockpit.scale.set(0.82, 0.42, 1.08);
    cockpit.position.set(0, 0.19, -0.2);
    this.group.add(cockpit);

    const wingGeometry = new THREE.BoxGeometry(0.08, 0.05, 0.78);
    [-0.55, 0.55].forEach((x) => {
      const wing = new THREE.Mesh(wingGeometry, bodyMaterial);
      wing.position.set(x, -0.04, 0.05);
      wing.rotation.z = x < 0 ? -0.18 : 0.18;
      this.group.add(wing);
    });

    const engineGeometry = new THREE.BoxGeometry(0.2, 0.08, 0.42);
    [-0.27, 0.27].forEach((x, index) => {
      const engine = new THREE.Mesh(engineGeometry, cyanGlow);
      engine.position.set(x, -0.04, 0.62);
      this.group.add(engine);

      const trail = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.035, 1.55), index === 0 ? cyanGlow : magentaGlow);
      trail.position.set(x, -0.04, 1.35);
      this.group.add(trail);
      this.trailLights.push(trail);
    });
  }
}
