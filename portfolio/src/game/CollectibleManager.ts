import * as THREE from 'three';
import { NEON_DRIFT_CONFIG } from './config';
import { Collidable } from './types';

interface Collectible extends Collidable {
  mesh: THREE.Group;
}

export class CollectibleManager {
  readonly group = new THREE.Group();

  private collectibles: Collectible[] = [];
  private spawnTimer = 1.2;

  constructor() {
    for (let i = 0; i < 12; i += 1) {
      const collectible = this.createCollectible();
      collectible.active = false;
      collectible.mesh.visible = false;
      this.group.add(collectible.mesh);
      this.collectibles.push(collectible);
    }
  }

  reset() {
    this.spawnTimer = 1.2;
    this.collectibles.forEach((collectible) => {
      collectible.active = false;
      collectible.mesh.visible = false;
    });
  }

  update(delta: number, speed: number) {
    this.spawnTimer -= delta;
    if (this.spawnTimer <= 0) {
      this.spawnCollectible();
      this.spawnTimer = NEON_DRIFT_CONFIG.spawn.collectibleInterval + Math.random() * 1.1;
    }

    this.collectibles.forEach((collectible) => {
      if (!collectible.active) return;
      collectible.z += speed * delta;
      collectible.mesh.position.z = collectible.z;
      collectible.mesh.rotation.z += delta * 2.4;
      collectible.mesh.rotation.y += delta * 1.5;

      if (collectible.z > 5) {
        collectible.active = false;
        collectible.mesh.visible = false;
      }
    });
  }

  collectNear(position: THREE.Vector3, radius: number) {
    for (const collectible of this.collectibles) {
      if (!collectible.active) continue;
      const distance = Math.hypot(collectible.x - position.x, collectible.y - position.y, collectible.z - position.z);
      if (distance < collectible.radius + radius) {
        collectible.active = false;
        collectible.mesh.visible = false;
        return collectible;
      }
    }

    return null;
  }

  private spawnCollectible() {
    const collectible = this.collectibles.find((item) => !item.active);
    if (!collectible) return;

    collectible.x = THREE.MathUtils.randFloatSpread(NEON_DRIFT_CONFIG.bounds.x * 1.45);
    collectible.y = THREE.MathUtils.randFloatSpread(NEON_DRIFT_CONFIG.bounds.y * 1.35);
    collectible.z = NEON_DRIFT_CONFIG.spawn.startZ - Math.random() * 20;
    collectible.radius = 0.62;
    collectible.active = true;
    collectible.mesh.visible = true;
    collectible.mesh.position.set(collectible.x, collectible.y, collectible.z);
  }

  private createCollectible(): Collectible {
    const group = new THREE.Group();
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: NEON_DRIFT_CONFIG.colors.amber,
      transparent: true,
      opacity: 0.96,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: NEON_DRIFT_CONFIG.colors.cyan,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.045, 10, 28), ringMaterial);
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.17, 0), coreMaterial);
    group.add(ring, core);

    return {
      active: false,
      mesh: group,
      x: 0,
      y: 0,
      z: 0,
      radius: 0.62,
    };
  }
}
