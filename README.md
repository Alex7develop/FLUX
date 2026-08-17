# FLUX

> Drop anything. It figures out the rest.

**Phone ↔ Phone ↔ Mac ↔ Windows ↔ Web**

FLUX is a premium cross-platform product for moving information between devices, then understanding, organizing, connecting, and finding it. Cross-platform transfer is the entry point. The long-term product is a universal inbox with AI understanding and a knowledge graph.

This repository is currently in **Phase 0 (foundation)** and **Phase 1 (visual shell)**. Transfer, auth, AI, billing, and the real graph are intentionally not implemented.

## Product vision

The user should never have to think about where information belongs. They send something to FLUX. FLUX determines what it is, what it contains, why it might matter, where it should go, what can be done with it, and what it relates to.

```text
DROP → TRANSFER → UNDERSTAND → ENRICH → CONNECT → SEARCH → ACT
```

## Core user experience (now)

The web workspace at `/app` is a cinematic visual shell:

1. Idle — calm FLUX node, “Ready for anything.”
2. Drop / paste / choose a file — demo state only, no upload.
3. Processing — “Understanding…”
4. Success — “Got it.”
5. Return to idle.

The drop interaction is a visual state machine. Real transfer will replace `runDropDemo` later without rewriting the shell.

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
| `EXPO_PUBLIC_SUPABASE_URL` | Mobile |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Mobile |

Blank values are expected in this phase. Clients read config through `lib/supabase` and do not call Supabase.

## Development phases

| Phase | Status | Scope |
| --- | --- | --- |
| 0 Foundation | This repo | Monorepo, types, tokens, tooling |
| 1 Visual shell | This repo | Web canvas, drop demo, mobile shell |
| 2 Transfer | Not started | Pairing, signaling, WebRTC data channels |
| 3 Understand | Not started | AI / OCR pipeline behind `packages/ai` |
| 4 Graph + search | Not started | Real graph, semantic retrieval |
| 5 Accounts + billing | Not started | Supabase auth, Stripe |

## Design principles

- Dark, cinematic, restrained. Not a dashboard, not a file manager, not a chat app.
- Motion communicates state. Reduced motion is respected.
- Domain types live in one package. UI never talks to a provider SDK.
- No fake backends. Demo visual state is explicit and replaceable.
- Keep the web bundle light. No Three.js, no AI SDKs, no graph libraries on the landing route.

## Docs

- [Architecture overview](docs/architecture/overview.md)
- [Web](docs/architecture/web.md)
- [Mobile](docs/architecture/mobile.md)
- [ADR 001 — monorepo](docs/decisions/001-monorepo.md)
- [ADR 002 — web-first](docs/decisions/002-web-first.md)
- [Product vision](docs/product/vision.md)
- [Security](docs/security/overview.md)

The original long-form product brief is preserved in `FLUX_README.md`.
