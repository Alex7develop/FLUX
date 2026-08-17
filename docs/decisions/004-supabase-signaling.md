# 004. Supabase Realtime for networked signaling

## Status

Accepted.

## Context

BroadcastChannel cannot leave the origin tab group. Phone ↔ laptop needs a networked signaling path without standing up a custom server.

## Decision

Keep `SignalingClient` + `SignalRelay`. If `VITE_SUPABASE_*` is set, the web app uses Supabase Realtime broadcast. Otherwise it stays on BroadcastChannel.

TURN is optional via `VITE_TURN_*`. STUN is always on.

## Consequences

- Cross-network pairing works only after a Supabase project and, on hard NAT, a TURN server.
- No service-role key is used. Auth and signaling share the publishable key.
- The UI does not pretend a phone is connected when keys are missing.
