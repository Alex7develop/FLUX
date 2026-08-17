# Security overview

Phase 0/1 has no auth, no transfer, and no cloud. The rules below are still binding so later phases do not have to unpick accidents.

## Secrets

- Never commit `.env`, `.env.local`, or `.env.production`.
- Frontend may receive **publishable** Supabase keys only.
- Service-role keys must never ship in web or mobile.
- `.env.example` is empty on purpose.

## Trust

Do not trust API payloads, URL params, localStorage, future AI output, or user metadata. Parse them with Zod in `@flux/validation`.

## Transfer (later)

Prefer device-to-device WebRTC over routing file bytes through FLUX servers. Cloud storage is explicit: history, sync, backup, AI, sharing — not the default pipe.

## Analytics (later)

`packages/analytics` must not be given file contents, OCR text, or message bodies. Event names and coarse metadata only.

## Errors

Do not show ICE / WebRTC / SQL / vendor errors. Map them to `FluxError` messages a person can act on.
