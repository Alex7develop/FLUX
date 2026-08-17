# 002. Web-first, mobile in parallel

## Status

Accepted.

## Context

The first milestone is not file transfer. It is proving that FLUX *feels* like a product: cinematic shell, drop interaction, visual state. That proof is fastest on the web: large canvas, motion, keyboard, Playwright.

Waiting for a native transfer stack before any UI would hide product risk. Building only web would hide the cross-platform constraint that is the actual company story.

## Decision

1. Design and implement the visual system on web first (`/`, `/app`).
2. Stand up an Expo shell in the same monorepo, sharing types and tokens, with platform-native screens.
3. Do not port web components into React Native.

## Why web first

- Visual direction can be judged on a laptop in a browser.
- Drop / paste / keyboard are cheap to get right.
- E2E smoke tests are straightforward.
- The canvas metaphor needs space; desktop is the native habitat of the first shell.

## Why mobile now anyway

- Forces package boundaries immediately.
- Prevents “we’ll wrap the webview later”.
- Gives a real home screen: *Ready to receive. Connect device. Send something.*

## Consequences

- Web is the design source of truth for Phase 1.
- Mobile will need its own motion language (Reanimated) when transfer is real.
- Pairing UX will be designed twice, on purpose.
