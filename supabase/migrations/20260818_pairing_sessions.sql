-- Optional persistence for pairing. Realtime broadcast works without this table.
-- Enable Realtime on this table only if you choose a row-based signaling adapter later.

create table if not exists pairing_sessions (
  id text primary key,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  consumed_at timestamptz
);

alter table pairing_sessions enable row level security;
