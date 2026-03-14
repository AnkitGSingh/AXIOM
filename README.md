# Project AXIOM — Ankit Singh Portfolio

A cinematic, Iron Man-inspired interactive portfolio built with Next.js 16, React Three Fiber, and Framer Motion. The centrepiece is a 3D rigged exosuit model where each body zone acts as a hotspot that reveals a portfolio project.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| 3D | React Three Fiber 9, Three.js 0.183 |
| 3D helpers | @react-three/drei 10 |
| Post-FX | @react-three/postprocessing (Bloom) |
| Animation | Framer Motion 12 |
| State | Zustand 5 |
| Styling | Tailwind CSS 4 |
| Contact form | Web3Forms |
| Fonts | Orbitron, Rajdhani, JetBrains Mono (Google Fonts) |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create `.env.local` at the root:

```env
NEXT_PUBLIC_WEB3FORMS_KEY=your_key_here
```

Get a free key at [web3forms.com](https://web3forms.com). Without it, the contact form shows a graceful unavailable state.

### 3. Run dev server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 3D Model

The hero asset lives at `public/models/Y_Bot.glb`. It must be a **Mixamo-rigged character** with:

- Mesh names `Alpha_Surface` (primary armour colour) and `Alpha_Joints` (gold seam colour). Any other mesh falls back to the armour material.
- Bone names prefixed `mixamorig:` (standard Mixamo export). Six bones are mapped to portfolio projects in `src/lib/data/projects.ts`.

### Swapping the model

1. Drop the new `.glb` into `public/models/` and update the path in `SuitModel.tsx` if the filename changes.
2. In dev, add `scene.traverse(c => console.log(c.name, c.type))` in `SuitModel.tsx` to list all mesh and bone names.
3. Update `boneName` values in `src/lib/data/projects.ts`.
4. If mesh names differ from `Alpha_Surface` / `Alpha_Joints`, update material logic in `SuitModel.tsx`.
5. Adjust `scale` and `position` in the `<group>` return in `SuitModel.tsx` if proportions differ.

## Project–Bone Mapping

| Project | Bone | Zone |
|---------|------|------|
| First Aid Buddy | `mixamorig:Head` | Head |
| Maze Runner | `mixamorig:Spine2` | Chest |
| Digit Recognition | `mixamorig:LeftArm` | Left arm |
| IPL Scraper | `mixamorig:RightArm` | Right arm |
| GODL1KE | `mixamorig:LeftUpLeg` | Left leg |
| ML Medical Imaging | `mixamorig:RightUpLeg` | Right leg |

## Phase State Machine

The experience progresses through ordered phases in `src/lib/store/useAXIOMStore.ts`:

```
LOADING  →  HUD_INTRO  →  INTERACTIVE  →  PROJECT_VIEW
```

Phases `LANDING` and `RISING` are reserved for future cinematic animation sequences (Sprint 1 scope).

## Environment Notes

- `reactStrictMode: false` in `next.config.ts` is intentional while R3F scene stability is being validated (double-mount in dev can break Three.js lifecycle hooks). Re-enable after Sprint 1.
- `NEXT_PUBLIC_*` embeds the Web3Forms key at **build time**. Ensure it is set in your environment before running `npm run build`.

## Deployment

Push to a Vercel project. Set `NEXT_PUBLIC_WEB3FORMS_KEY` in **Vercel → Project Settings → Environment Variables** before deploying.
