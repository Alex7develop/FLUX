# FLUX

> Drop anything. It figures out the rest.

**Phone ↔ Phone ↔ Mac ↔ Windows ↔ Web**

FLUX is a premium cross-platform product for moving information between devices, then understanding, organizing, connecting, and finding it. Cross-platform transfer is the entry point. The long-term product is a universal inbox with AI understanding and a knowledge graph.

This repository is currently in **Phase 0–5** on the web: foundation, visual shell, chunked transfer, local understanding, graph/search, and account/billing boundaries. Phone ↔ laptop needs Supabase Realtime keys and, on hard NAT, TURN. There are no fake OpenAI or Stripe calls.

## Product vision

The user should never have to think about where information belongs. They send something to FLUX. FLUX determines what it is, what it contains, why it might matter, where it should go, what can be done with it, and what it relates to.

```text
DROP → TRANSFER → UNDERSTAND → ENRICH → CONNECT → SEARCH → ACT
```

## Core user experience (now)

The web workspace at `/app` is a cinematic shell over a real transfer pipeline:

1. Idle — calm FLUX node, “Ready for anything.”
2. Drop / paste / choose a file — the file is hashed, chunked, and sent as a `TransferManifest`.
3. Without a peer, the same protocol runs locally and the item appears in Inbox.
4. With a paired tab, bytes go over a WebRTC DataChannel.
5. Success — “Got it.” Inbox then classifies the item locally (URL, contact, receipt, image, PDF).
6. Search and Graph read that same inbox. Login and billing stay honest until public keys exist.

Pairing: `/app/devices` → create a 6-character code or copy the join link. Same-origin tabs use BroadcastChannel. Across networks, set `VITE_SUPABASE_*` and optionally `VITE_TURN_*`.

## Architecture

pnpm workspaces + Turborepo. Web and mobile share domain types, design tokens, validation, and utilities. They do **not** share view components. Future WebRTC, AI, graph, analytics, and Supabase live behind package interfaces.

```text
                    FLUX
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
      WEB          MOBILE        FUTURE DESKTOP
        │             │
        └───────┬─────┘
                │
        ┌───────┴────────┐
        │                │
      Supabase         WebRTC   (later)
```

## Repository structure

```text
apps/web                 Vite + React visual product
apps/mobile              Expo + Expo Router shell
packages/types           Domain types
packages/design-tokens   Color, space, motion, type
packages/validation      Zod schemas for untrusted data
packages/utils           Tiny shared helpers
packages/ui              Web visual system (canvas, node, drop)
packages/transfer        TransferTransport interface only
packages/signaling       SignalingClient interface only
packages/ai              AIProcessor interface only
packages/graph           Node / edge / entity types only
packages/analytics       Analytics track() abstraction
supabase/                Future Auth / Postgres / Storage / Functions
docs/                    Architecture, ADRs, product, security
```

## Local development

Requires Node 20+ and pnpm 9+.

```bash
corepack enable
pnpm install
pnpm dev
```

- Web: `pnpm dev:web` → http://127.0.0.1:5173
- Mobile: `pnpm dev:mobile` → Expo dev server

## Available scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start app dev servers via Turbo |
| `pnpm build` | Production build (web) / typecheck (mobile) |
| `pnpm lint` | ESLint across workspaces |
| `pnpm typecheck` | `tsc --noEmit` across workspaces |
| `pnpm test` | Vitest unit tests |
| `pnpm test:e2e` | Playwright smoke test for web |
| `pnpm format` | Prettier write |

First e2e run needs Playwright browsers:

```bash
pnpm --filter @flux/web exec playwright install chromium
```

## Environment variables

Copy `.env.example`. Do not put a Supabase service-role key in any frontend app.

| Variable | App |
| --- | --- |
| `VITE_SUPABASE_URL` | Web |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Web |
| `VITE_STUN_URLS` | Web (defaults to Google STUN) |
| `VITE_TURN_URL` / `VITE_TURN_USERNAME` / `VITE_TURN_CREDENTIAL` | Web, optional |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Web, optional |
| `EXPO_PUBLIC_SUPABASE_URL` | Mobile |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Mobile |

Blank values keep the app local. Never put a service-role or Stripe secret key in a frontend app. TURN credentials in `VITE_*` are visible in the browser; use a dedicated TURN user, not a root account.

## Development phases

| Phase | Status | Scope |
| --- | --- | --- |
| 0 Foundation | This repo | Monorepo, types, tokens, tooling |
| 1 Visual shell | This repo | Web canvas, drop, mobile shell |
| 2 Transfer | This repo | Pairing, WebRTC chunks, BroadcastChannel or Supabase Realtime |
| 3 Understand | This repo | Local classifier + OCR text on larger images |
| 4 Graph + search | This repo | Graph and find over understood items |
| 5 Accounts + billing | This repo | Auth/billing UI; live only with public keys |
| Inbox | This repo | Cards, previews, filters, IndexedDB blobs |

## Design principles

- Dark, cinematic, restrained. Not a dashboard, not a file manager, not a chat app.
- Motion communicates state. Reduced motion is respected.
- Domain types live in one package. UI never talks to a provider SDK.
- No fake backends. Transfer uses the real chunk protocol even on a single device.
- Keep the web bundle light. No Three.js, no AI SDKs, no graph libraries on the landing route.

## Docs

- [Architecture overview](docs/architecture/overview.md)
- [Web](docs/architecture/web.md)
- [Mobile](docs/architecture/mobile.md)
- [ADR 001 — monorepo](docs/decisions/001-monorepo.md)
- [ADR 002 — web-first](docs/decisions/002-web-first.md)
- [ADR 003 — BroadcastChannel signaling](docs/decisions/003-broadcast-signaling.md)
- [ADR 004 — Supabase signaling](docs/decisions/004-supabase-signaling.md)
- [Product vision](docs/product/vision.md)
- [Security](docs/security/overview.md)

The original long-form product brief is preserved in `FLUX_README.md`.
