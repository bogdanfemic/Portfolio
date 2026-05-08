export const NEON_DRIFT_CONFIG = {
  bounds: {
    x: 4.4,
    y: 2.45,
  },
  speed: {
    base: 14,
    max: 31,
    rampPerSecond: 0.18,
    boostBonus: 7,
    boostDuration: 1.4,
  },
  player: {
    movementSpeed: 8.5,
    radius: 0.42,
    gracePeriod: 1.8,
  },
  spawn: {
    obstacleInterval: 1.35,
    obstacleMinInterval: 0.58,
    collectibleInterval: 2.7,
    startZ: -92,
  },
  camera: {
    shakeIntensity: 0.22,
    boostPulse: 5.5,
  },
  colors: {
    background: '#02030b',
    cyan: '#34f6ff',
    magenta: '#ff2bd6',
    purple: '#8b5cff',
    blue: '#3d7dff',
    amber: '#ffd166',
    danger: '#ff355d',
  },
} as const;

export type NeonDriftConfig = typeof NEON_DRIFT_CONFIG;
