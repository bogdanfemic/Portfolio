import * as THREE from 'three';
import { NEON_DRIFT_CONFIG } from './config';

export class Tunnel {
  readonly group = new THREE.Group();

  private segments: THREE.LineSegments[] = [];
  private segmentLength = 10;
  private segmentCount = 18;
  private radius = 5.65;
  private material: THREE.LineBasicMaterial;

  constructor() {
    this.material = new THREE.LineBasicMaterial({
      color: NEON_DRIFT_CONFIG.colors.cyan,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    this.createSegments();
  }

  reset() {
    this.segments.forEach((segment, index) => {
      segment.position.z = -index * this.segmentLength;
      segment.rotation.z = index * 0.18;
    });
  }

  update(delta: number, speed: number) {
    const travel = speed * delta;
    const intensity = THREE.MathUtils.mapLinear(speed, NEON_DRIFT_CONFIG.speed.base, NEON_DRIFT_CONFIG.speed.max, 0.45, 0.9);
    this.material.opacity = THREE.MathUtils.clamp(intensity, 0.45, 0.9);

    this.segments.forEach((segment) => {
      segment.position.z += travel;
      segment.rotation.z += delta * 0.1;

      if (segment.position.z > this.segmentLength) {
        segment.position.z -= this.segmentLength * this.segmentCount;
        segment.rotation.z += 0.42;
      }
    });
  }

  private createSegments() {
    for (let i = 0; i < this.segmentCount; i += 1) {
      const geometry = this.createHexGridGeometry();
      const segment = new THREE.LineSegments(geometry, this.material);
      segment.position.z = -i * this.segmentLength;
      segment.rotation.z = i * 0.18;
      this.group.add(segment);
      this.segments.push(segment);
    }
  }

  private createHexGridGeometry() {
    const points: number[] = [];
    const sides = 6;

    // Rings plus longitudinal rails make the tunnel read clearly at high speed.
    for (let side = 0; side < sides; side += 1) {
      const a = (side / sides) * Math.PI * 2 + Math.PI / 6;
      const b = (((side + 1) % sides) / sides) * Math.PI * 2 + Math.PI / 6;
      points.push(
        Math.cos(a) * this.radius,
        Math.sin(a) * this.radius,
        0,
        Math.cos(b) * this.radius,
        Math.sin(b) * this.radius,
        0,
      );
      points.push(
        Math.cos(a) * this.radius,
        Math.sin(a) * this.radius,
        0,
        Math.cos(a) * this.radius,
        Math.sin(a) * this.radius,
        -this.segmentLength,
      );
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geometry;
  }
}
