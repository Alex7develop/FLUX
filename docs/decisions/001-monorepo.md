# 001. Monorepo with pnpm and Turborepo

## Status

Accepted.

## Context

FLUX ships on more than one surface (web now, mobile now, desktop later) and has a domain that must stay identical: items, devices, transfer manifests, visual states, errors. A single app repo would either duplicate those types or leak web UI into React Native.

## Decision

Use a pnpm workspace with Turborepo.

```text
apps/*        independently runnable products
packages/*    shared language and contracts
```

## Why

- **Shared types** — one `FluxItem`, one `Device`, one `FluxError`.
- **Shared design tokens** — the product identity is a data file, not a CSS accident in one app.
- **Shared domain logic** — validation and small utils stay out of view components.
- **Independent deployment** — web can ship without an Expo build; mobile can ship without Vite.
- **Scalable boundaries** — transfer, signaling, AI, graph, and analytics can grow implementations without rewriting the apps.

## Consequences

- Package APIs must stay platform-agnostic except `@flux/ui` (web-only).
- Tooling (lint, typecheck, test) runs per-package through Turbo.
- Expo requires a hoisted pnpm linker in this repo.
