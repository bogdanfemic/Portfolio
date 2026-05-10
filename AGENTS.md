# AGENTS.md

## Project overview
This repository contains a personal portfolio site. The main app lives in `portfolio/` and is built with React, TypeScript, styled-components, Framer Motion, and Three.js. It includes animated portfolio sections, a contained Three.js game section, a small command palette/navigation layer, and a separate `/os` Mini OS Portfolio experience.

## Tech stack
- React 19
- TypeScript
- Vite
- styled-components
- Framer Motion
- Three.js
- react-icons
- React Testing Library and Jest-style test setup
- `emailjs-com` for the contact form
- npm

## Project structure
- `portfolio/src/App.tsx`: app composition, top-level section order, and the `/os` route switch for the Mini OS page.
- `portfolio/src/components/layout/`: header, layout wrapper, and footer.
- `portfolio/src/components/sections/`: page sections such as Home, About, Projects, Skills, Future Goals, ThreeJsGame, and Contact.
- `portfolio/src/components/os/`: the Mini OS Portfolio feature. `MiniOSPage.tsx` owns the desktop shell, window manager, dock, command palette, boot screen, theme state, context menu, and resize/drag behavior. `OSApps.tsx` contains the app-window content. `osData.ts` contains app metadata, project/contact data, and editable Now Playing content.
- `portfolio/src/components/ui/`: small interactive UI pieces such as the command palette.
- `portfolio/src/effects/`: motion/visual helpers and Three.js background/viewer components.
- `portfolio/src/game/`: the Neon Drift game engine and gameplay systems.
- `portfolio/src/hooks/`: reusable React hooks such as theme mode and reduced-motion detection.
- `portfolio/src/styles/`: global styles and theme tokens.
- `portfolio/src/utils/`: shared helpers such as `IconWrapper` and WebGL detection.
- `portfolio/src/assets/`: imported images used by sections and project cards.
- `portfolio/feedback.html`, `portfolio/css/`, `portfolio/js/`: legacy static HTML/CSS/JS assets separate from the React app. Treat this as a separate surface unless a task explicitly targets it.
- `portfolio/src/components/sections/Home 2.tsx`: alternate/legacy Home implementation. Check references before editing.

## Setup commands
From the app directory:

```bash
cd portfolio
npm install
```

If you are working only on the root package, note that the root `package.json` currently has no scripts and only lists `three` as a dependency. Verify before using it as the app entry point.

## Development commands
From `portfolio/`:

```bash
npm run dev
```

The Vite dev server is configured for port `3000` in `portfolio/vite.config.mts`.

Preview a production build from `portfolio/`:

```bash
npm run build
npm run preview
```

## Test, lint, and build commands
- `npm run build` in `portfolio/`: runs `tsc --noEmit && vite build`.
- No explicit lint script is defined in `portfolio/package.json`; verify before using any lint command.
- No explicit test script is defined in `portfolio/package.json`; `portfolio/src/App.test.tsx` exists and uses React Testing Library with Jest-style mocks, so verify before using `npm test` or another runner.

## Coding conventions
- Use TypeScript and keep `strict`-compatible code; `portfolio/tsconfig.json` enables strict mode and `forceConsistentCasingInFileNames`.
- Prefer functional React components, hooks, and typed props.
- Use `styled-components` for component-local styling and the theme token system from `portfolio/src/styles/theme.ts`.
- Global colors, spacing, and dark/light mode behavior are driven by CSS variables in `portfolio/src/styles/GlobalStyles.ts`.
- Section and component filenames are typically PascalCase; hooks use `use*`; helpers live in `utils/`.
- Animated UI uses Framer Motion, usually with `motion.*` elements and `whileInView`/`whileHover` variants.
- For section-level scroll reveals, use `portfolio/src/effects/ScrollAnimation.tsx` from `App.tsx`; default behavior should replay (animate in on enter, animate out on exit) unless a task explicitly needs one-time reveal.
- Icons from `react-icons` are usually wrapped with `IconWrapper`.
- Keep navigation and section anchors aligned: when adding a section, update the header nav and command palette together.
- The Mini OS is a separate route rendered from `App.tsx` when `window.location.pathname === '/os'`; this project does not currently use Next.js routing.
- Keep the homepage “Enter Mini OS” CTA in `portfolio/src/components/sections/Home.tsx` pointed at `/os`.
- For Mini OS app content edits, prefer updating `portfolio/src/components/os/osData.ts` first. Update `OSApps.tsx` only when the app-window layout or behavior needs to change.
- The Mini OS window system is custom controlled state. Preserve open, close, minimize, maximize/restore, focus/z-index, drag, resize, mobile stacking, and command-palette app opening behavior when editing it.
- The Mini OS terminal supports predefined commands and can open OS apps / switch theme. Keep terminal commands deterministic and frontend-only; do not add backend or shell execution.
- Avoid mixing the React app with the legacy static layer under `portfolio/feedback.html`, `portfolio/css/`, and `portfolio/js/`.

## AI agent workflow
- Inspect the relevant files first and follow the repo’s existing patterns.
- Make the smallest focused diff that solves the request.
- Avoid unrelated refactors, renames, or styling rewrites.
- If behavior changes, update nearby tests or docs when appropriate.
- Run the relevant checks, at minimum `npm run build` for app changes.
- Summarize what changed clearly, including any unknowns or unverified areas.

## Safety and constraints
- Do not casually modify generated output: `node_modules/`, `portfolio/node_modules/`, `dist/`, `portfolio/dist/`, `build/`, `portfolio/build/`, or `coverage/`.
- Do not edit `.env*` files unless the task explicitly requires environment configuration.
- Treat `package-lock.json` files as dependency-tree artifacts; only change them when dependency changes are intentional.
- Be careful with the Three.js/game surface: `portfolio/src/components/sections/ThreeJsGame.tsx`, `portfolio/src/game/*`, `portfolio/src/effects/ThreeBackground.tsx`, and `portfolio/src/effects/ThreeProjectViewer.tsx`.
- Be careful with the Mini OS surface: `portfolio/src/components/os/*`, the `/os` route switch in `portfolio/src/App.tsx`, and the Mini OS CTA in `portfolio/src/components/sections/Home.tsx`.
- Treat `portfolio/src/styles/GlobalStyles.ts` and `portfolio/src/styles/theme.ts` as shared design-system files.
- Treat the legacy static layer (`portfolio/feedback.html`, `portfolio/css/`, `portfolio/js/`) as separate from the React app.
- Check references before editing `portfolio/src/components/sections/Home 2.tsx`.

## Definition of done
- The requested change is implemented with minimal collateral edits.
- `npm run build` passes in `portfolio/`.
- New or changed navigation targets are reachable from the header and command palette when applicable.
- Mini OS changes keep `/os` reachable from the homepage CTA and preserve dock/desktop icon app launching, window controls, resizing, command palette, terminal commands, theme toggle, and mobile usability.
- Tests or docs are updated when the change affects behavior or usage.
- The final summary states what changed and any remaining uncertainty.
