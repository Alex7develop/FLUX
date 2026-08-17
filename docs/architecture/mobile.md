# Mobile architecture

Stack: React Native, Expo, Expo Router, TypeScript, TanStack Query, Zustand, Reanimated, Gesture Handler.

## Routes

```text
app/
  _layout.tsx
  index.tsx      Home — Ready to receive
  devices.tsx
  inbox.tsx
  settings.tsx
```

Home copy: FLUX, ready to receive, Connect device, Send something. Connect is a no-op in this phase. Send something runs the same visual demo sequence as web (`idle → processing → success → idle`).

## Sharing

Mobile imports `@flux/types`, `@flux/design-tokens`, `@flux/validation`, and `@flux/utils`. It does **not** import `@flux/ui`. Web canvas components use DOM, SVG, and Framer Motion.

## Metro

`metro.config.js` watches the workspace root so package source can be bundled. pnpm uses a hoisted linker because Expo is sensitive to nested `node_modules`.

## Supabase

`apps/mobile/src/lib/supabase/config.ts` reads `EXPO_PUBLIC_*` keys. Same rule as web: publishable keys only, no client calls yet.
