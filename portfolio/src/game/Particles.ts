import * as THREE from 'three';
import { NEON_DRIFT_CONFIG } from './config';

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
}

export class Particles {
  readonly group = new THREE.Group();

  private pool: Particle[] = [];
  private active: Particle[] = [];
  private material: THREE.MeshBasicMaterial;

  constructor(count = 90) {
    this.material = new THREE.MeshBasicMaterial({
      color: NEON_DRIFT_CONFIG.colors.cyan,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const geometry = new THREE.SphereGeometry(0.045, 6, 4);
    for (let i = 0; i < count; i += 1) {
      const mesh = new THREE.Mesh(geometry, this.material.clone());
      mesh.visible = false;
      this.group.add(mesh);
      this.pool.push({
        mesh,
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 1,
      });
    }
  }

  burst(position: THREE.Vector3, color: string, amount: number, power: number, reducedMotion: boolean) {
    const particleCount = reducedMotion ? Math.ceil(amount * 0.35) : amount;
    for (let i = 0; i < particleCount; i += 1) {
      const particle = this.pool.pop();
      if (!particle) return;

      particle.mesh.visible = true;
      particle.mesh.position.copy(position);
      particle.mesh.material = (particle.mesh.material as THREE.MeshBasicMaterial).clone();
      (particle.mesh.material as THREE.MeshBasicMaterial).color.set(color);
      (particle.mesh.material as THREE.MeshBasicMaterial).opacity = 1;
      particle.life = 0;
      particle.maxLife = 0.45 + Math.random() * 0.45;
      particle.velocity.set(
        (Math.random() - 0.5) * power,
        (Math.random() - 0.5) * power,
        (Math.random() - 0.25) * power * 1.4,
      );
      this.active.push(particle);
    }
  }

  update(delta: number) {
    for (let i = this.active.length - 1; i >= 0; i -= 1) {
      const particle = this.active[i];
      particle.life += delta;
      particle.mesh.position.addScaledVector(particle.velocity, delta);
      particle.velocity.multiplyScalar(1 - delta * 1.8);

      const progress = particle.life / particle.maxLife;
      const material = particle.mesh.material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0, 1 - progress);
      particle.mesh.scale.setScalar(Math.max(0.1, 1 - progress * 0.6));

      if (particle.life >= particle.maxLife) {
        particle.mesh.visible = false;
        this.active.splice(i, 1);
        this.pool.push(particle);
      }
    }
  }
}
