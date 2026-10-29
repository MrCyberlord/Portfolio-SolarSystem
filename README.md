# Portfolio 3.0 — Aman Jain

A personal portfolio for **Aman Jain, AI Engineer / Full-Stack Developer**,
built around an immersive, procedural 3D solar system. Native vertical scrolling
connects the portfolio's five sections while the Sun and eight planets remain
part of one persistent cosmic environment.

**Live demo:** Not deployed yet. A deployment URL will be added here when available.

## Features

- Five sections: Home + About, Projects, Skills, Experience, and Contact.
- Featured applications: ResearchLab, RivalIQ, and Runningo.
- Procedural Sun and planet surfaces, inclined orbits, individual orbital and
  axial rotation speeds, Saturn's rings, and a lightweight Earth atmosphere.
- Layered stars, nebula shaders, subtle dust, and guided camera compositions.
- Native hash navigation, direct section links, and browser history support.
- Dedicated mobile framing and lower geometry, texture, and pixel-density budgets.
- Keyboard-accessible HTML content, visible focus states, reduced-motion support,
  and loading/error/WebGL fallbacks. Content remains usable without the scene.
- Custom favicon assets and social links for GitHub, LinkedIn, and X.

Project-specific screenshots, GitHub links, and demo URLs are optional and should
only be added after verification. The current project illustrations are labeled
concept visuals; no demo URLs or unsupported project achievements are invented.

## Tech stack

- React 19 and TypeScript 5.9 with strict checking
- Vite 8
- Three.js and React Three Fiber 9
- Tailwind CSS 4 and custom responsive CSS
- ESLint with TypeScript and React Hooks rules
- Node.js built-in test runner for solar-system validation

The current project does not require GSAP, Drei, an API server, external 3D models,
or paid services. Planet textures are generated locally, without downloaded maps.

## Installation and local development

Use **Node.js 24.x** and npm. The project has been checked with Node 24.19.0
and npm 11.17.0. No environment variables or credentials are required.

```sh
git clone https://github.com/MrCyberlord/Portfolio-3.0.git
cd Portfolio-3.0
npm ci
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.
Vite may select another port when that port is occupied.

Use `npm install` when intentionally changing dependencies; commit the updated
`package-lock.json` along with `package.json`. On Windows, use `npm.cmd` if
PowerShell's execution policy blocks the `npm.ps1` launcher.

## Validation

```sh
npx tsc -b --pretty false
npm run lint
node --test tests/solar-system.test.mjs
npm run build
```

The production build also runs `tsc -b` before Vite. Solar-system tests check
planet identities and speeds, orbital envelopes including Saturn's rings,
texture seams, viewport framing, and clearance from the content column.

## Production build and local preview

```sh
npm run build
npm run preview
```

Vite writes production files to `dist/`. Preview serves those files locally;
it does not deploy them. `dist/`, `node_modules/`, environment files, private
keys, logs, and local caches are excluded from Git. If a shareable environment
example becomes necessary, `.env.example` is allowed by `.gitignore`.

## Project structure

```text
public/                 Favicons and public assets
src/
  components/           Semantic portfolio sections, navigation, and fallback
  hooks/                Media queries and native scroll signal
  scene/
    UniverseScene.tsx   Lazy Canvas, lighting, and scene integration
    SolarSystem.tsx     Sun-centered planetary assembly
    Sun.tsx             Animated surface and restrained corona
    Planet.tsx          Planet bodies, orbits, rings, and axial animation
    solarConfig.ts      Planet definitions and orbital speed multiplier
    planetTextures.ts   Procedural surface maps
    solarShaders.ts     Sun, atmosphere, and Saturn-ring shaders
    Cosmos.tsx          Stars, dust, and nebula plane
    shaders.ts          Background shaders
    ScrollDirector.tsx  Camera framing and section compositions
    useSceneTime.ts     Shared visibility-aware animation clock
    config.ts           Quality budgets and composition keyframes
  assets/               Source image/vector assets
  content.ts            Professional, project, technology, and social content
  App.tsx               Persistent scene and HTML application shell
  App.css               Portfolio layout and responsive styling
tests/                  Solar-system validation
```

Edit `src/content.ts` to update professional information and verified project
details. Section hashes are `#home`, `#projects`, `#skills`, `#experience`,
and `#contact`. Scrolling is native, without mandatory snapping or hijacking.

## Rendering and known limitations

The scene is lazy-loaded and uses demand rendering. A single timer requests
animation updates at up to 15 Hz on mobile or 24 Hz on desktop while the page
is visible and focused. These are update limits, not measured frame rates.
Reduced motion stops orbital, axial, and Sun surface animation, disables
pointer response, and removes CSS smooth scrolling.

Mobile uses pixel ratio 1, 24×12 sphere segments, and 128×64 planet maps.
Desktop caps pixel ratio at 1.5, with 48×24 segments and 256×128 maps.
There are no real-time cast shadows, eclipses, transmission materials, or
heavy postprocessing. Surface textures and orbital sizes are artistic;
Earth's land patterns are not an accurate geographic map.

Vite warns that the lazy 3D chunk exceeds its default uncompressed size budget
(approximately 247 KB gzipped). Shader cost, transparent overdraw, and texture
generation still need profiling on representative physical mobile devices.
Automated geometry tests do not establish GPU performance or visual correctness.
Desktop rendering has been inspected, but the latest framing changes, all
navigation/history cases, touch behavior, reduced motion, and WebGL context loss
still need a complete browser/device test pass before production-readiness claims.
