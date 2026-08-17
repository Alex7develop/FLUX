# Supabase

Reserved for a later phase. Do not require a live project to run the apps.

Future responsibilities:

- Auth
- Postgres
- Storage
- Realtime
- Edge Functions

Apps read public env vars through their `lib/supabase` module. They must not import `supabase-js` into the landing bundle until a feature actually needs it.

Never place a service-role key in this tree.
