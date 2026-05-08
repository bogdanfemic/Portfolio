# Portfolio

React, TypeScript, styled-components, and Three.js portfolio site built with Vite.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm run preview
```

## Neon Drift

Neon Drift is a contained Three.js portfolio section at `src/components/sections/ThreeJsGame.tsx`. It mounts a `WebGLRenderer` into a responsive section instead of taking over the full app. Fullscreen can be enabled from the in-game controls.

Controls:

- `A` / `D` or left / right arrows: drift horizontally.
- `W` / `S` or up / down arrows: move vertically.
- Pointer or touch drag: steer toward the touched point.

Game systems:

- `src/game/Game.ts` owns the requestAnimationFrame loop, game states, scoring, best score, speed ramp, camera shake, FOV pulse, resize handling, and tab visibility pause.
- `src/game/Player.ts` builds the hover car procedurally from simple meshes, including glowing engines and trails.
- `src/game/Tunnel.ts` recycles hex tunnel line segments to create endless forward motion.
- `src/game/ObstacleManager.ts` reuses glowing laser gate objects and avoids impossible early spawns.
- `src/game/CollectibleManager.ts` reuses boost rings and awards score plus a temporary speed boost.
- `src/game/Particles.ts` pools particles for boost pickups and crash bursts.
- `src/game/config.ts` exposes tunable speed, spawn, player, color, and camera values.

Embedding:

```tsx
import ThreeJsGame from './components/sections/ThreeJsGame';

export default function PortfolioPage() {
  return <ThreeJsGame />;
}
```

The component includes WebGL fallback messaging and a reduced-motion toggle that lowers camera shake and particle volume.
