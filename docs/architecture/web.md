# Web architecture

Stack: React 19, TypeScript, Vite, React Router, TanStack Query, Zustand, Tailwind CSS, Framer Motion, Zod.

## Routes

Meaningful UI:

- `/` — landing
- `/app` — workspace shell + drop demo

Placeholders: `/pricing`, `/login`, `/signup`, `/app/inbox`, `/app/search`, `/app/graph`, `/app/devices`, `/app/settings`, `/app/billing`.

## Visual shell

`packages/ui` renders the conceptual graph:

- `FluxCanvas` — composition
- `FluxNode` — engine node, state-aware
- `FluxParticles` — Canvas 2D, density drops on small screens
- `FluxConnections` — decorative SVG edges (`Device → FLUX → content`)
- `FluxDropZone` — keyboard, click, drag, disabled/busy
- `FluxStatus` — human copy, not protocol errors

Drop now runs the real transfer pipeline: hash → `TransferManifest` → chunks → ack. If a peer is connected, bytes go over a WebRTC DataChannel. If not, the same protocol runs over an in-process loopback and the item lands in the local inbox.

Pairing lives on `/app/devices`. A host creates a 6-character code; another tab joins it. Tokens expire in five minutes and are single-use. The raw token is never stored — only its hash.

## Performance

Landing does not load Three.js, AI SDKs, or `supabase-js`. Particles pause when the document is hidden. `prefers-reduced-motion` stops continuous motion.

## Supabase

`apps/web/src/lib/supabase/config.ts` reads public env vars. No SDK, no queries, no service-role key.
