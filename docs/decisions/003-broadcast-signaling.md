# 003. BroadcastChannel signaling before Supabase

## Status

Accepted.

## Context

WebRTC needs a signaling channel for offer, answer, and ICE. A custom signaling server would violate the “no extra backend” rule. A live Supabase project is not provisioned yet.

## Decision

Implement `SignalingClient` for real, with two adapters:

- In-memory — tests
- BroadcastChannel — two tabs on the same origin

The pairing token is the capability. Only its hash is stored. The session expires in five minutes and is single-use.

## Consequences

- Phone ↔ Mac across networks is not available until a networked `SignalingClient` (Supabase Realtime) is plugged in.
- The WebRTC transport, chunk protocol, and UI do not change when that adapter arrives.
- No TURN yet. Same-machine / friendly NAT should connect; some networks will not.
