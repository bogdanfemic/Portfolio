import * as THREE from 'three';
import { NEON_DRIFT_CONFIG } from './config';
import { Collidable } from './types';

interface Obstacle extends Collidable {
  mesh: THREE.Group;
  rotationSpeed: number;
}

export class ObstacleManager {
  readonly group = new THREE.Group();

  private obstacles: Obstacle[] = [];
  private spawnTimer = 0;
  private lanesX = [-3.2, -1.6, 0, 1.6, 3.2];
  private lanesY = [-1.55, 0, 1.55];
  private lastLane = { x: 0, y: 0 };

  constructor() {
    for (let i = 0; i < 18; i += 1) {
      const obstacle = this.createObstacle();
      obstacle.active = false;
      obstacle.mesh.visible = false;
      this.group.add(obstacle.mesh);
      this.obstacles.push(obstacle);
    }
  }

  reset() {
    this.spawnTimer = 1.8;
    this.obstacles.forEach((obstacle) => {
      obstacle.active = false;
      obstacle.mesh.visible = false;
      obstacle.z = NEON_DRIFT_CONFIG.spawn.startZ;
      obstacle.mesh.position.z = obstacle.z;
    });
  }

  update(delta: number, speed: number, elapsed: number) {
    this.spawnTimer -= delta;
    const difficulty = Math.min(1, elapsed / 45);
    const interval = THREE.MathUtils.lerp(
      NEON_DRIFT_CONFIG.spawn.obstacleInterval,
      NEON_DRIFT_CONFIG.spawn.obstacleMinInterval,
      difficulty,
    );

    if (this.spawnTimer <= 0) {
      this.spawnObstacle(elapsed);
      this.spawnTimer = interval + Math.random() * 0.28;
    }

    this.obstacles.forEach((obstacle) => {
      if (!obstacle.active) return;
      obstacle.z += speed * delta;
      obstacle.mesh.position.z = obstacle.z;
      obstacle.mesh.rotation.z += obstacle.rotationSpeed * delta;

      if (obstacle.z > 5) {
        obstacle.active = false;
        obstacle.mesh.visible = false;
      }
    });
  }

  getActiveColliders() {
    return this.obstacles.filter((obstacle) => obstacle.active);
  }

  private spawnObstacle(elapsed: number) {
    const obstacle = this.obstacles.find((item) => !item.active);
    if (!obstacle) return;

    const easyWindow = elapsed < 10;
    const x = this.pickLane(this.lanesX, this.lastLane.x);
    const y = easyWindow ? this.lanesY[1] : this.pickLane(this.lanesY, this.lastLane.y);
    this.lastLane = { x, y };

    const horizontalGate = Math.random() > 0.48;
    obstacle.mesh.scale.set(horizontalGate ? 1.75 : 0.85, horizontalGate ? 0.46 : 1.65, 1);
    obstacle.radius = horizontalGate ? 0.75 : 0.68;
    obstacle.x = x;
    obstacle.y = y;
    obstacle.z = NEON_DRIFT_CONFIG.spawn.startZ - Math.random() * 18;
    obstacle.rotationSpeed = (Math.random() > 0.5 ? 1 : -1) * (0.35 + Math.random() * 0.65);
    obstacle.active = true;
    obstacle.mesh.visible = true;
    obstacle.mesh.position.set(x, y, obstacle.z);
    obstacle.mesh.rotation.z = Math.random() * Math.PI;
  }

  private createObstacle(): Obstacle {
    const group = new THREE.Group();
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: NEON_DRIFT_CONFIG.colors.danger,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
    });
    const edgeMaterial = new THREE.MeshBasicMaterial({
      color: NEON_DRIFT_CONFIG.colors.magenta,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
    });

    const core = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.34, 0.34), coreMaterial);
    group.add(core);

    const edgeA = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.065, 0.42), edgeMaterial);
    edgeA.position.y = 0.23;
    const edgeB = edgeA.clone();
    edgeB.position.y = -0.23;
    group.add(edgeA, edgeB);

    return {
      active: false,
      mesh: group,
      x: 0,
      y: 0,
      z: 0,
      radius: 0.72,
      rotationSpeed: 0,
    };
  }

  private pickLane(lanes: number[], previous: number) {
    const filtered = lanes.filter((lane) => lane !== previous);
    return filtered[Math.floor(Math.random() * filtered.length)];
  }
}
