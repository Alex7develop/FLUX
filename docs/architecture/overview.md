# Architecture overview

FLUX is a TypeScript monorepo. The current milestone is a production-shaped foundation plus a visual product shell. Later systems plug into existing package boundaries instead of growing out of React components.

## Why these boundaries

| Package | Owns | Must not own |
| --- | --- | --- |
| `types` | Domain language | Runtime I/O, UI |
| `validation` | Zod for untrusted data | React |
| `design-tokens` | Visual constants | Components |
| `ui` | Web visual system | Transfer, AI, auth |
| `transfer` / `signaling` | Transport contracts | Browser RTC now |
| `ai` | Analysis contract | A vendor SDK |
| `graph` | Node/edge language | A graph database |
| `analytics` | `track()` | File contents |

Web (`apps/web`) and mobile (`apps/mobile`) are delivery surfaces. They share types and tokens. They do not share view trees.

## State

- **Visual / session UI state** — Zustand (`useFluxStore`). Small. No files, no server cache.
- **Server state (later)** — TanStack Query. QueryClient is already mounted.
- **Local component state** — hover, drag-over, layout.

## Data that does not exist yet

No Postgres, no object storage, no signaling server, no AI provider. `supabase/` is a reserved tree. Apps read env through `lib/supabase` and treat missing config as “not configured”.

## Error model

User-facing errors use `FluxError`: `code`, `message`, `retryable`, optional `context`. Low-level transport errors stay behind that shape.

## Future production shape

Compatible with web + mobile + later desktop, Supabase (auth/db/storage/realtime/functions), WebRTC between devices, then AI, Stripe, and jobs. None of that is running in Phase 0/1.
