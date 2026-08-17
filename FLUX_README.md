# FLUX

> **Drop anything. It figures out the rest.**

**Phone ↔ Phone ↔ Mac ↔ Windows ↔ Web**

FLUX is a cross-platform personal information router: a beautiful, privacy-first workspace where a user can connect devices, drop files/text/links/screenshots, and let FLUX transfer, understand, classify, enrich, organize, and connect the content automatically.

The product starts as a frictionless cross-device transfer tool and evolves into an AI-powered universal inbox and visual knowledge graph.

---

## 1. Product vision

### The problem

People constantly move information between devices:

- iPhone → Windows
- Android → Mac
- phone → phone
- laptop → phone
- screenshot → laptop
- URL → phone
- PDF → another device
- copied text → another device
- receipt/photo/document → somewhere it can later be found

The problem is not simply file transfer.

The deeper problem is:

> **Digital information has no obvious destination.**

Users repeatedly ask themselves:

- Where should I save this?
- How do I move this to my other device?
- What was that screenshot?
- Which folder should this PDF go into?
- What was the URL I saved last week?
- Why did I keep this image?
- What information is inside this document?
- Which project does this belong to?

FLUX should remove that decision.

### Core promise

> **You don't think about where information belongs. You just send it to FLUX.**

FLUX determines:

1. **What is it?**
2. **What information does it contain?**
3. **Why might it matter?**
4. **Where should it go?**
5. **What actions can be performed?**
6. **What other information is it related to?**

---

# 2. Product principles

## Principle 1 — Drop first, organize later

The user should never be forced to create folders before saving something.

Everything enters through one universal inbox.

```text
DROP
  ↓
UNDERSTAND
  ↓
ENRICH
  ↓
CONNECT
  ↓
ACT
```

## Principle 2 — Transfer should feel instant

For device-to-device transfer, FLUX should prefer direct peer-to-peer transport.

WebRTC DataChannels are designed to transfer arbitrary text/binary data between peers and are encrypted by WebRTC transport security. The application still needs signaling and connection negotiation. Large files should be chunked rather than sent as one enormous message.

## Principle 3 — AI is an invisible assistant

The user should not have to prompt an AI to classify every file.

Instead:

```text
user drops item
       ↓
FLUX analyzes
       ↓
structured result
       ↓
small useful actions
```

AI should be surfaced when it creates value, not as a chatbot bolted onto the UI.

## Principle 4 — Privacy is a feature

The architecture must distinguish:

### P2P transfer

Prefer:

```text
Device A ←──── WebRTC ────→ Device B
```

rather than:

```text
Device A → FLUX server → Device B
```

### Cloud storage

Used only when the user explicitly needs:

- history
- cross-device persistence
- account synchronization
- backup
- AI processing
- sharing
- searchable archive

## Principle 5 — Beautiful motion communicates state

Animation is not decoration.

Animation communicates:

- connection
- transfer
- processing
- AI understanding
- success
- relationships
- synchronization

The interface should feel like information is moving through a living system.

---

# 3. Product positioning

## One-line positioning

> **FLUX is the universal drop zone for everything you want to move, understand, and keep.**

## Product category

FLUX sits at the intersection of:

- AirDrop
- universal clipboard
- AI document scanner
- screenshot organizer
- personal inbox
- lightweight knowledge graph

It should NOT initially try to become:

- a full Notion replacement
- a full Obsidian replacement
- Google Drive
- Dropbox
- a general-purpose chat app
- a complex project management tool

---

# 4. Target users

## Primary user

A digitally active person with multiple devices:

- iPhone + Mac
- Android + Windows
- phone + work laptop
- phone + personal laptop
- multiple browsers/devices

They frequently transfer:

- screenshots
- images
- PDFs
- URLs
- copied text
- documents
- receipts
- notes
- contacts
- snippets

## Secondary users

### Developers

Use cases:

- code snippets
- screenshots
- logs
- documentation
- URLs
- terminal output
- device-to-device clipboard

### Creators

Use cases:

- inspiration
- images
- references
- URLs
- video links
- briefs
- documents

### Business users

Use cases:

- receipts
- invoices
- business cards
- contracts
- meeting screenshots
- notes

### Travelers

Use cases:

- tickets
- hotel confirmations
- addresses
- maps
- screenshots
- reservation PDFs

---

# 5. Core user experience

## First launch

Desktop web:

```text
                         FLUX

                 Drop anything here

                    [ CONNECT ]

                Scan with your phone

                       QR
```

Phone:

```text
                     FLUX

                 Connected to

                  Alex's Mac

                 ● Connected

             [ Send something ]
```

No onboarding carousel.

No 10-step tutorial.

The product should demonstrate itself.

---

# 6. Core flows

## Flow A — Device connection

```text
Desktop
  ↓
Create pairing session
  ↓
Generate short-lived pairing token
  ↓
Render QR
  ↓
Phone scans
  ↓
Phone validates session
  ↓
Signaling begins
  ↓
WebRTC offer/answer
  ↓
ICE candidates
  ↓
DataChannel opens
  ↓
Devices connected
```

The pairing token must be:

- short-lived
- one-time use
- scoped to a session
- non-guessable
- never expose database credentials
- invalidated after successful connection or timeout

---

# 7. Core transfer flow

```text
User selects image
       ↓
Create transfer metadata
       ↓
Hash file
       ↓
Negotiate P2P channel
       ↓
Chunk file
       ↓
Send chunks
       ↓
Receiver acknowledges chunks
       ↓
Reassemble
       ↓
Validate hash
       ↓
Persist locally
       ↓
Optional cloud sync
       ↓
Optional AI processing
```

## Transfer metadata

Example:

```ts
type TransferManifest = {
  id: string;
  sessionId: string;
  itemId: string;
  fileName: string;
  mimeType: string;
  size: number;
  sha256: string;
  chunkSize: number;
  chunkCount: number;
  createdAt: string;
};
```

## Chunk protocol

Do not send huge files in one DataChannel message.

Use a protocol similar to:

```text
manifest
chunk: 0
chunk: 1
chunk: 2
...
chunk: N
complete
```

Each chunk:

```ts
type FileChunk = {
  transferId: string;
  index: number;
  total: number;
  payload: ArrayBuffer;
};
```

Implement:

- backpressure
- retry
- cancellation
- progress
- checksum validation
- pause/resume where supported
- connection interruption recovery

---

# 8. Universal input model

Everything entering FLUX becomes an `Item`.

```ts
type ItemType =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "document"
  | "text"
  | "url"
  | "contact"
  | "screenshot"
  | "receipt"
  | "unknown";
```

Base model:

```ts
type FluxItem = {
  id: string;
  ownerId: string;
  type: ItemType;

  title?: string;
  originalName?: string;
  mimeType?: string;
  sizeBytes?: number;

  sourceDeviceId?: string;

  storageMode: "local" | "cloud" | "p2p";

  storagePath?: string;

  status:
    | "received"
    | "processing"
    | "ready"
    | "failed"
    | "archived";

  createdAt: string;
  updatedAt: string;
};
```

---

# 9. AI processing pipeline

AI should not directly mutate arbitrary database records.

Use a controlled pipeline:

```text
INPUT
  ↓
PREPROCESS
  ↓
EXTRACT
  ↓
CLASSIFY
  ↓
ENRICH
  ↓
RELATE
  ↓
SUGGEST ACTIONS
  ↓
USER CONFIRMATION
```

## Example: screenshot

Input:

```text
screenshot.png
```

Pipeline:

```text
OCR
 ↓
text extraction
 ↓
entity detection
 ↓
classification
 ↓
topic extraction
 ↓
relationship detection
 ↓
suggested actions
```

Result:

```json
{
  "type": "hotel_reservation",
  "title": "Hotel reservation — Bali",
  "entities": [
    {
      "type": "location",
      "value": "Canggu"
    },
    {
      "type": "date_range",
      "value": "2026-09-18/2026-09-24"
    }
  ],
  "topics": [
    "travel",
    "bali",
    "hotel"
  ],
  "suggestedActions": [
    "save",
    "open_map",
    "create_trip"
  ]
}
```

The exact AI provider should be abstracted behind an internal interface:

```ts
interface AIProcessor {
  analyzeImage(input: ImageInput): Promise<AnalysisResult>;
  analyzeDocument(input: DocumentInput): Promise<AnalysisResult>;
  analyzeText(input: string): Promise<AnalysisResult>;
  analyzeUrl(input: string): Promise<AnalysisResult>;
}
```

This prevents vendor lock-in.

---

# 10. AI safety and reliability

AI output is untrusted data.

Never execute AI-generated actions directly.

Bad:

```text
AI → database mutation
```

Good:

```text
AI
 ↓
validated structured output
 ↓
policy layer
 ↓
user confirmation when needed
 ↓
action
```

Use JSON schema validation.

Every AI job should have:

- input hash
- provider
- model
- prompt version
- schema version
- latency
- token usage
- status
- error
- output validation result

This allows prompt/model changes without losing observability.

---

# 11. Visual knowledge graph

The graph is not the product's primary database.

It is a visualization layer over relationships.

Graph entities:

```text
Item
Person
Place
Organization
Topic
Project
Event
Document
URL
Device
```

Relationship examples:

```text
Item → mentions → Place
Item → belongs_to → Project
Item → related_to → Item
Item → contains → Person
Item → references → URL
Item → tagged_as → Topic
```

Example:

```text
                     Bali
                       ●
                      / \
                     /   \
                Hotel   Canggu
                  ●        ●
                  |        |
             Reservation   |
                  ●        |
                   \      /
                    \    /
                     Trip
                      ●
```

## Important

Do not build a graph database first.

Start with PostgreSQL tables:

```text
items
entities
relationships
```

Then render the graph client-side.

Only introduce a dedicated graph database if real usage proves it necessary.

---

# 12. Graph rendering

Recommended web stack:

- React
- TypeScript
- SVG for simple graph
- Canvas/WebGL for large graphs
- React Three Fiber when the 3D/particle aesthetic actually adds value

The first implementation should be 2D.

Do not prematurely introduce Three.js everywhere.

## Visual language

Dark background.

Large empty space.

Glowing nodes.

Soft gradients.

Subtle blur.

Very restrained typography.

No generic SaaS dashboard aesthetic.

The visual metaphor is:

> information flowing through a system.

---

# 13. Animation system

Animation should have a central state machine.

Example:

```ts
type FluxVisualState =
  | "idle"
  | "pairing"
  | "connected"
  | "receiving"
  | "processing"
  | "understood"
  | "linked"
  | "success"
  | "error";
```

Transitions:

```text
idle
 ↓
pairing
 ↓
connected
 ↓
receiving
 ↓
processing
 ↓
understood
 ↓
linked
 ↓
success
```

Animation rules:

### Pairing

QR particles converge toward the center.

### Connected

Two device nodes form a stable orbit.

### Transfer

Particles move from source node to target node.

### AI processing

The item gets scanned by an animated field.

### Understanding

Raw file transforms into structured entities.

### Graph linking

New relationships draw themselves between nodes.

### Success

The system settles into a calm state.

Avoid constant animation.

Motion should stop when the system has finished doing something.

---

# 14. Architecture

## High-level architecture

```text
                         ┌──────────────────┐
                         │      FLUX        │
                         │    Web Client    │
                         └────────┬─────────┘
                                  │
                       ┌──────────┴──────────┐
                       │                     │
                    Supabase              WebRTC
                       │                     │
          ┌────────────┼────────────┐        │
          ↓            ↓            ↓        │
       Auth         Postgres      Storage     │
          │            │            │         │
          └────────────┼────────────┘         │
                       │                      │
                   Edge Functions             │
                       │                      │
             ┌─────────┼─────────┐            │
             ↓         ↓         ↓            │
           AI       Billing    Jobs           │
             │         │                      │
             ↓         ↓                      │
         AI Provider Stripe                    │
                                              │
                    Device A ←────────────→ Device B
```

---

# 15. Monorepo architecture

Use pnpm + Turborepo.

```text
flux/
├── apps/
│   ├── web/
│   └── mobile/
│
├── packages/
│   ├── ui/
│   ├── design-tokens/
│   ├── types/
│   ├── config/
│   ├── validation/
│   ├── transfer/
│   ├── signaling/
│   ├── ai/
│   ├── graph/
│   ├── analytics/
│   └── utils/
│
├── supabase/
│   ├── migrations/
│   ├── functions/
│   │   ├── create-pairing-session/
│   │   ├── ai-analyze/
│   │   ├── create-checkout/
│   │   ├── stripe-webhook/
│   │   └── create-portal-session/
│   └── seed.sql
│
├── docs/
│   ├── architecture/
│   ├── product/
│   ├── decisions/
│   └── security/
│
├── .github/
│   └── workflows/
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── eslint.config.js
├── prettier.config.js
└── README.md
```

---

# 16. Web application

Recommended:

```text
React
TypeScript
Vite
React Router
TanStack Query
Zustand
Tailwind CSS
Framer Motion
```

Optional:

```text
React Three Fiber
Three.js
Zod
React Hook Form
```

Do not use Redux unless application complexity proves that a centralized Redux architecture is necessary.

For FLUX, local UI state + server state + a small global store should be sufficient initially.

---

# 17. Mobile application

Use:

```text
React Native
Expo
TypeScript
Expo Router
TanStack Query
Zustand
React Native Reanimated
react-native-gesture-handler
```

Platform responsibilities:

### Mobile

- camera
- QR scanning
- file picker
- share sheet integration
- local persistence
- secure credentials
- notifications
- WebRTC transport
- background transfer where platform rules permit

### Web

- desktop experience
- drag and drop
- clipboard
- QR pairing
- file receiving
- graph visualization
- account management
- billing

---

# 18. Supabase responsibilities

Supabase should handle:

- Postgres
- Auth
- Storage
- Realtime
- Edge Functions
- Row Level Security

The frontend should never receive a Supabase service-role key.

Use publishable/client credentials in clients and keep privileged credentials in Edge Functions/server-side environments.

---

# 19. Database schema

## profiles

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  plan text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## devices

```sql
create table devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  name text not null,
  platform text not null,
  browser text,

  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);
```

## pairing_sessions

```sql
create table pairing_sessions (
  id uuid primary key default gen_random_uuid(),

  creator_device_id uuid not null references devices(id) on delete cascade,

  status text not null default 'pending',

  token_hash text not null,
  expires_at timestamptz not null,

  created_at timestamptz not null default now()
);
```

Never store a raw pairing token if it can be avoided.

## items

```sql
create table items (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references auth.users(id) on delete cascade,

  type text not null,
  title text,

  mime_type text,
  original_name text,
  size_bytes bigint,

  source_device_id uuid references devices(id),

  storage_mode text not null default 'local',
  storage_path text,

  status text not null default 'received',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## item_analysis

```sql
create table item_analysis (
  id uuid primary key default gen_random_uuid(),

  item_id uuid not null references items(id) on delete cascade,

  provider text,
  model text,
  prompt_version text,
  schema_version text,

  result jsonb not null default '{}'::jsonb,

  status text not null default 'pending',

  created_at timestamptz not null default now()
);
```

## entities

```sql
create table entities (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references auth.users(id) on delete cascade,

  type text not null,
  name text not null,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
```

## relationships

```sql
create table relationships (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references auth.users(id) on delete cascade,

  source_id uuid not null,
  target_id uuid not null,

  relation_type text not null,

  confidence numeric,

  created_at timestamptz not null default now()
);
```

## subscriptions

```sql
create table subscriptions (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references auth.users(id) on delete cascade,

  provider text not null,
  provider_customer_id text,
  provider_subscription_id text,

  plan text not null,
  status text not null,

  current_period_start timestamptz,
  current_period_end timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

# 20. Row Level Security

Every user-owned table must use RLS.

Example:

```sql
alter table items enable row level security;

create policy "Users can read own items"
on items
for select
using (auth.uid() = user_id);

create policy "Users can create own items"
on items
for insert
with check (auth.uid() = user_id);

create policy "Users can update own items"
on items
for update
using (auth.uid() = user_id);

create policy "Users can delete own items"
on items
for delete
using (auth.uid() = user_id);
```

Repeat this principle for every user-owned table.

Never rely on frontend filtering for security.

---

# 21. Storage architecture

Buckets:

```text
flux-private
flux-thumbnails
```

Storage paths:

```text
/{userId}/{itemId}/original
/{userId}/{itemId}/preview
```

Use private buckets.

Generate signed URLs only when necessary.

Never put sensitive content into public buckets.

---

# 22. WebRTC architecture

WebRTC is the transport.

Supabase Realtime or a lightweight signaling channel can be used for:

```text
offer
answer
ICE candidates
connection state
```

Conceptually:

```text
Phone
  │
  │ signaling
  ↓
Supabase
  │
  ↓
Desktop

Then:

Phone ←──────── WebRTC DataChannel ────────→ Desktop
```

After connection establishment, the actual file data should flow directly whenever network topology permits.

## STUN/TURN

Production needs:

- STUN
- TURN fallback

Because direct peer-to-peer connectivity is not guaranteed across all NAT/firewall combinations.

A production deployment should have a TURN strategy and connection telemetry.

---

# 23. Transfer reliability

Required metrics:

```text
connection_established
transfer_started
bytes_sent
bytes_received
transfer_completed
transfer_failed
transfer_cancelled
checksum_failed
```

The client should expose:

```text
42%
8.2 MB / 19.4 MB
12.4 MB/s
```

But the UX should remain calm.

Do not turn the product into a network diagnostic screen.

---

# 24. AI provider abstraction

Create:

```text
packages/ai/
├── src/
│   ├── types.ts
│   ├── processor.ts
│   ├── providers/
│   │   ├── openai.ts
│   │   └── anthropic.ts
│   ├── schemas/
│   │   ├── image-analysis.ts
│   │   ├── document-analysis.ts
│   │   └── url-analysis.ts
│   └── index.ts
```

Example:

```ts
export interface AIProvider {
  analyzeText(input: string): Promise<AnalysisResult>;
  analyzeImage(input: ImageInput): Promise<AnalysisResult>;
  analyzeDocument(input: DocumentInput): Promise<AnalysisResult>;
}
```

Never call an AI provider directly from UI components.

---

# 25. Processing queue

AI processing must be asynchronous.

```text
item created
     ↓
analysis job
     ↓
queue
     ↓
worker/function
     ↓
AI provider
     ↓
validate JSON
     ↓
store result
     ↓
update item
```

Never block the upload UI waiting for AI analysis.

The user should see:

```text
Received ✓

Understanding...
```

and continue using the app.

---

# 26. Search architecture

Start with Postgres full-text search.

Then add semantic search.

Recommended progression:

### V1

Postgres:

```text
title
description
extracted_text
tags
```

### V2

Embeddings:

```text
item_embeddings
```

Vector search can answer:

> "Find that hotel screenshot I saved around summer."

without exact keyword matching.

Do not add a vector database until there is a demonstrated need.

Supabase Postgres can support vector workflows without introducing another infrastructure dependency too early.

---

# 27. Search UX

Search should feel like:

```text
                 Search FLUX

       "hotel reservation Bali"

              ↓

     ┌─────────────────────┐
     │ 🏨 Bali reservation  │
     │ Canggu               │
     │ Sept 18–24           │
     └─────────────────────┘
```

Search can understand:

- filename
- text
- entities
- tags
- date
- device
- content type
- semantic meaning

---

# 28. Pricing strategy

Do not monetize basic transfer too aggressively.

The free experience should be good enough to become habitual.

## Free

```text
$0

- device pairing
- P2P transfer
- limited history
- basic clipboard
- limited AI processing
- limited cloud storage
```

## Pro

Suggested starting price:

```text
$8/month
or
$72/year
```

Pro:

- unlimited devices
- larger transfer limits
- unlimited history
- AI processing
- smart OCR
- semantic search
- graph
- cloud sync
- advanced actions
- priority processing

## Future

Team plan:

```text
$15/user/month
```

Potential features:

- shared spaces
- team devices
- shared inbox
- team knowledge graph
- permissions
- admin controls

Pricing must be validated with real users before committing.

---

# 29. Billing architecture

Use Stripe Billing/Checkout for web subscriptions.

Recommended flow:

```text
Pricing page
     ↓
Create Checkout Session
     ↓
Stripe Checkout
     ↓
Payment
     ↓
Stripe webhook
     ↓
Verify event
     ↓
Update subscriptions
     ↓
Grant entitlements
```

Never activate paid features solely because the frontend returned from a success URL.

The source of truth must be verified server-side through Stripe webhook events.

Required events include at least:

```text
checkout.session.completed
invoice.paid
invoice.payment_failed
customer.subscription.updated
customer.subscription.deleted
```

Also implement a customer portal for:

- payment method
- invoices
- cancellation
- subscription management

---

# 30. Entitlements

Do not scatter:

```ts
if (plan === "pro")
```

throughout the application.

Create an entitlement layer:

```ts
type Entitlement =
  | "p2p_transfer"
  | "cloud_history"
  | "ai_analysis"
  | "semantic_search"
  | "graph"
  | "advanced_actions";

function canUse(
  plan: Plan,
  entitlement: Entitlement
): boolean;
```

This allows pricing to change without rewriting product logic.

---

# 31. Security model

Threat model:

### Threats

- malicious pairing
- stolen session token
- unauthorized item access
- insecure storage URLs
- malicious uploaded files
- prompt injection in documents
- AI hallucinations
- abuse of AI processing
- payment spoofing
- replay attacks
- rate abuse

### Controls

- short-lived pairing tokens
- token hashing
- RLS
- private storage
- signed URLs
- MIME validation
- file size limits
- checksum validation
- rate limits
- webhook signature validation
- server-side entitlement checks
- AI output schemas
- prompt-injection-aware processing
- audit logs

---

# 32. File security

Never trust:

```text
filename
mime type
extension
metadata
AI classification
```

Validate:

- size
- content type
- file signature/magic bytes where applicable
- maximum dimensions
- decompression limits
- archive limits

For future document processing, isolate risky parsers.

Never execute uploaded content.

---

# 33. Privacy modes

The product should eventually offer:

## Local/P2P

```text
No cloud copy
```

## Synced

```text
Stored in encrypted cloud storage
```

## AI processing

```text
Content is sent to configured AI processor
```

Clearly explain what happens.

Privacy must not be hidden inside a legal page.

---

# 34. Observability

Use:

- Sentry for client/server errors
- PostHog for product analytics
- structured logs
- Supabase logs
- Stripe logs
- performance metrics

Track:

### Activation

```text
landing → pair → transfer
```

### Core usage

```text
items dropped
transfers completed
transfer success rate
AI analyses
searches
graph opens
```

### Monetization

```text
pricing viewed
checkout started
checkout completed
trial started
subscription active
cancelled
```

Never send raw private file content to analytics.

---

# 35. Product analytics events

Example:

```ts
type AnalyticsEvent =
  | "pairing_started"
  | "pairing_completed"
  | "transfer_started"
  | "transfer_completed"
  | "transfer_failed"
  | "item_created"
  | "ai_processing_started"
  | "ai_processing_completed"
  | "search_performed"
  | "graph_opened"
  | "pricing_viewed"
  | "checkout_started"
  | "subscription_started"
  | "subscription_cancelled";
```

---

# 36. Testing strategy

## Unit

Test:

- transfer protocol
- chunking
- checksum
- validators
- AI schema validation
- entitlement logic
- parsing

## Integration

Test:

- pairing
- authentication
- Supabase RLS
- storage
- AI jobs
- Stripe webhooks

## E2E

Playwright:

```text
open desktop
scan/connect simulation
send file
receive file
verify checksum
verify history
```

Mobile:

- Maestro or Detox
- physical iOS device
- physical Android device

## Network testing

Simulate:

- slow network
- packet loss
- connection interruption
- offline
- reconnect
- TURN fallback

---

# 37. Accessibility

Requirements:

- keyboard navigation
- visible focus
- reduced motion
- sufficient contrast
- screen reader labels
- no information communicated only through color
- touch targets >= platform recommendations

If reduced motion is enabled:

```text
particles → fade
large transitions → crossfade
graph motion → static
```

The visual identity must survive without animation.

---

# 38. Performance

## Web

Targets:

```text
LCP < 2.5s
INP < 200ms
CLS < 0.1
```

Avoid loading Three.js on the initial route.

Lazy-load:

```text
Graph
3D scene
AI visualizer
large previews
```

## Mobile

Avoid:

- rendering huge image lists
- decoding full-resolution images unnecessarily
- keeping entire files in JS memory
- long-running JS animations

Use native/platform APIs where appropriate.

---

# 39. Offline architecture

Eventually:

```text
local queue
   ↓
pending item
   ↓
offline
   ↓
network returns
   ↓
sync
```

Use local persistence for:

- pending transfers
- recent items
- device state
- unsent metadata

The user should never lose an item because Wi-Fi disappeared for 5 seconds.

---

# 40. Design system

Tokens:

```ts
const colors = {
  background: "#050505",
  surface: "#0B0B0D",
  surfaceElevated: "#111116",
  textPrimary: "#F5F5F7",
  textSecondary: "#8D8D98",
  border: "rgba(255,255,255,0.08)",
  accent: "...",
};
```

Do not hard-code colors throughout components.

Typography:

- one primary UI font
- clear hierarchy
- generous spacing
- minimal labels

The interface should feel closer to a premium creative tool than an enterprise dashboard.

---

# 41. Core UI routes

## Public

```text
/
 /pricing
 /privacy
 /terms
 /login
 /signup
```

## App

```text
/app
/app/inbox
/app/search
/app/graph
/app/devices
/app/settings
/app/billing
```

## Pairing

```text
/pair/:token
```

Do not put private information into URLs.

---

# 42. Component architecture

```text
components/
├── flux/
│   ├── FluxCanvas
│   ├── FluxNode
│   ├── FluxParticles
│   ├── FluxDropZone
│   ├── FluxScanner
│   ├── FluxTransfer
│   ├── FluxGraph
│   └── FluxStatus
│
├── device/
│   ├── DeviceCard
│   ├── DeviceConnection
│   └── QRPairing
│
├── item/
│   ├── ItemCard
│   ├── ItemPreview
│   ├── ItemMetadata
│   └── ItemActions
│
├── search/
│   ├── SearchInput
│   ├── SearchResults
│   └── SearchFilters
│
└── billing/
    ├── PricingCard
    ├── UpgradeModal
    └── SubscriptionStatus
```

Components should be feature-oriented, not one giant component tree.

---

# 43. State architecture

Separate state into:

## Server state

TanStack Query:

- items
- devices
- profile
- subscription
- AI analysis
- graph data

## Client state

Zustand:

- active device
- pairing state
- transfer state
- animation state
- selected item
- UI preferences

## Local device state

Platform/local persistence:

- pending transfers
- recent sessions
- local cache

Do not put binary file data into Zustand.

---

# 44. Folder architecture

```text
apps/web/src/
├── app/
├── routes/
├── features/
│   ├── pairing/
│   ├── transfer/
│   ├── inbox/
│   ├── ai/
│   ├── graph/
│   ├── search/
│   └── billing/
├── components/
├── hooks/
├── lib/
├── stores/
└── styles/
```

Mobile mirrors the feature boundaries:

```text
apps/mobile/
├── app/
├── features/
├── components/
├── hooks/
├── lib/
└── stores/
```

Shared logic goes into `packages`.

---

# 45. API / Edge Function boundaries

Use Edge Functions for privileged operations:

```text
create-pairing-session
consume-pairing-session
create-checkout
stripe-webhook
create-customer-portal
ai-analyze
generate-signed-upload
```

Client should never call Stripe secret APIs directly.

Client should never call AI providers with secret API keys.

---

# 46. Error handling

Every async operation needs a predictable error model.

```ts
type FluxError = {
  code: string;
  message: string;
  retryable: boolean;
  context?: Record<string, unknown>;
};
```

Example codes:

```text
PAIRING_EXPIRED
PAIRING_INVALID
WEBRTC_FAILED
TRANSFER_INTERRUPTED
CHECKSUM_MISMATCH
FILE_TOO_LARGE
AI_TIMEOUT
AI_INVALID_RESPONSE
SUBSCRIPTION_REQUIRED
STORAGE_FAILED
```

The UI should translate technical errors into human language.

Bad:

```text
ICE candidate gathering failed.
```

Good:

```text
We couldn't connect these devices.
Try again or switch networks.
```

---

# 47. Rate limiting

Protect:

- pairing creation
- AI requests
- file uploads
- search
- checkout session creation

AI should have quotas:

```text
Free:
100 analyses/month

Pro:
higher or effectively unlimited fair-use
```

Exact limits should be determined from actual AI cost.

---

# 48. Cost control

Every AI call has a cost.

Store:

```text
provider
model
input tokens
output tokens
processing time
estimated cost
```

Build a simple internal dashboard:

```text
MRR
AI cost
Storage cost
Bandwidth
Gross margin
```

Track:

```text
AI cost / active user / month
```

The product must never sell an unlimited plan before understanding the worst-case AI usage.

---

# 49. Monetization roadmap

## Phase 1

Free:

```text
P2P
basic history
limited AI
```

## Phase 2

Pro:

```text
cloud history
AI
semantic search
graph
```

## Phase 3

Power:

```text
advanced AI
automations
large storage
```

## Phase 4

Team:

```text
shared spaces
team knowledge
admin
```

---

# 50. MVP definition

MVP is NOT:

- full AI second brain
- full graph
- desktop native apps
- team collaboration
- billing
- 100 file types

MVP is:

```text
Desktop browser
        ↓
QR
        ↓
Mobile browser/app
        ↓
WebRTC
        ↓
Transfer
        ↓
Beautiful result
```

Plus:

```text
image
PDF
text
URL
```

and one AI processing path:

```text
image → OCR/understanding → structured result
```

---

# 51. Development phases

## Phase 0 — Product foundation

Deliver:

- monorepo
- TypeScript
- lint
- formatting
- testing
- environment config
- CI
- design tokens
- README
- architecture docs

Definition of done:

```text
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

all work.

---

## Phase 1 — Visual shell

Build:

- landing page
- app shell
- dark design
- Flux canvas
- nodes
- particles
- drop zone
- responsive layout

No backend.

Goal:

> Make the product look incredible before making it smart.

---

## Phase 2 — Device pairing

Build:

- pairing session
- QR
- token expiration
- device identity
- Supabase signaling
- WebRTC connection

Definition:

```text
Mac browser
       ↕
iPhone
```

connects successfully.

---

## Phase 3 — File transfer

Build:

- file picker
- drag/drop
- binary transfer
- chunks
- backpressure
- progress
- checksum
- cancel
- retry

Definition:

100MB+ files work reliably on realistic networks.

---

## Phase 4 — Universal inbox

Build:

- item model
- local persistence
- item cards
- history
- previews
- metadata
- filters

---

## Phase 5 — AI

Build:

- processor interface
- image analysis
- OCR
- structured extraction
- classification
- entity extraction
- suggested actions

Definition:

A screenshot can become a useful structured object.

---

## Phase 6 — Graph

Build:

- entities
- relationships
- graph layout
- animations
- item → graph navigation

Definition:

AI-generated relationships become visible.

---

## Phase 7 — Search

Build:

- full-text search
- filters
- semantic search
- relevance ranking

---

## Phase 8 — Accounts + sync

Build:

- Auth
- profiles
- cloud history
- private storage
- RLS
- cross-device sync

---

## Phase 9 — Monetization

Build:

- pricing
- Stripe Checkout
- webhooks
- entitlements
- customer portal
- billing settings
- subscription states

Never gate based only on client-side state.

---

## Phase 10 — Production hardening

Build:

- Sentry
- analytics
- rate limits
- abuse protection
- performance monitoring
- backups
- disaster recovery
- security review
- privacy policy
- terms
- GDPR flows
- deletion/export

---

# 52. Production readiness checklist

## Product

- [ ] First-time user understands product in <10 seconds
- [ ] Pairing works without documentation
- [ ] Transfer is visually obvious
- [ ] Failed transfer explains what to do
- [ ] AI results are understandable
- [ ] Search finds saved content
- [ ] Pricing is understandable

## Engineering

- [ ] TypeScript strict
- [ ] no `any` without justification
- [ ] no secrets in client
- [ ] RLS enabled
- [ ] tests
- [ ] CI
- [ ] error monitoring
- [ ] logging
- [ ] analytics
- [ ] migrations
- [ ] rollback strategy

## Security

- [ ] pairing tokens expire
- [ ] pairing tokens are single-use
- [ ] files are private
- [ ] signed URLs expire
- [ ] file size limits
- [ ] MIME validation
- [ ] AI outputs validated
- [ ] Stripe webhooks verified
- [ ] rate limiting
- [ ] abuse monitoring

## Billing

- [ ] free plan
- [ ] pro plan
- [ ] checkout
- [ ] webhook
- [ ] entitlement system
- [ ] failed payment
- [ ] cancellation
- [ ] customer portal
- [ ] invoice handling

---

# 53. Definition of done for every feature

A feature is complete only when:

```text
UI
+
state
+
API
+
database
+
security
+
loading
+
empty state
+
error state
+
analytics
+
tests
+
documentation
```

No "it works on my machine" features.

---

# 54. Git workflow

Use:

```text
main
develop
feat/*
fix/*
chore/*
refactor/*
```

Commit convention:

```text
feat:
fix:
refactor:
chore:
docs:
test:
perf:
security:
```

Example:

```text
feat(pairing): add QR device pairing
feat(transfer): implement chunked WebRTC transfer
feat(ai): add screenshot analysis pipeline
fix(transfer): recover interrupted chunks
security(pairing): hash pairing tokens
```

---

# 55. Architecture decision records

Every important architectural decision goes into:

```text
docs/decisions/
```

Examples:

```text
001-web-first.md
002-webrtc-transfer.md
003-supabase-backend.md
004-ai-provider-abstraction.md
005-postgres-graph-model.md
006-stripe-billing.md
```

Each ADR:

```md
# Decision

## Context

## Options

## Decision

## Consequences

## Revisit when
```

---

# 56. Launch strategy

Do not launch with:

> "AI-powered cross-platform knowledge graph."

That is confusing.

Launch with:

> **Send anything between your devices. FLUX figures out the rest.**

The first wow moment:

```text
Scan QR
 ↓
Phone connected
 ↓
Drop screenshot
 ↓
Beautiful particle transfer
 ↓
Scanning animation
 ↓
"Hotel reservation — Bali"
 ↓
[Save] [Open map]
```

That is the demo.

---

# 57. Landing page

Hero:

```text
FLUX

Drop anything.
It figures out the rest.

Phone ↔ Phone ↔ Mac ↔ Windows

[ Try FLUX ]
```

Then interactive demo.

Then:

```text
TRANSFER
Send anything between your devices.

UNDERSTAND
FLUX recognizes what you dropped.

CONNECT
Your information becomes a living graph.

FIND
Search what you saved, not where you saved it.
```

Then pricing.

Then privacy.

Then CTA.

---

# 58. North Star Metric

Do not optimize for registered accounts.

Use:

> **Useful drops per active user per week**

A useful drop means:

```text
drop
→ successful transfer/processing
→ user keeps or acts on the item
```

Secondary metrics:

- time to first successful transfer
- pairing success rate
- transfer completion rate
- AI usefulness rating
- weekly active devices
- retained users
- free → paid conversion
- MRR
- AI cost/user

---

# 59. Key product risks

## Risk 1 — "AirDrop already exists"

Response:

FLUX is not just transfer.

Transfer is the entry point.

The long-term value is:

```text
transfer
+
understanding
+
search
+
memory
+
relationships
```

## Risk 2 — AI is expensive

Response:

- quotas
- model routing
- caching
- hashes
- asynchronous processing
- smaller models for classification
- premium limits

## Risk 3 — WebRTC reliability

Response:

- robust signaling
- STUN
- TURN fallback
- reconnect
- checksums
- chunking
- telemetry

## Risk 4 — Too much product

Response:

MVP only solves:

> "Get something from this device to that device."

Then layer intelligence on top.

---

# 60. Future product direction

Potential future features:

### Universal clipboard

```text
Copy on Mac
→ Paste on phone
```

### Share sheet

```text
Share → FLUX
```

### Browser extension

```text
Save page → FLUX
```

### AI actions

```text
receipt → expense
business card → contact
URL → bookmark
hotel → trip
PDF → summary
screenshot → structured information
```

### Automations

```text
IF
item.type = receipt

THEN
extract expense
tag "finance"
```

### Personal graph

```text
Everything
 ↓
People
Places
Projects
Topics
Documents
```

### Team spaces

```text
Personal
Work
Project
Family
```

---

# 61. The product in one diagram

```text
                         ┌───────────────┐
                         │     FLUX      │
                         │ Universal     │
                         │ Drop Zone     │
                         └───────┬───────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
          TRANSFER           UNDERSTAND          CONNECT
              │                  │                  │
          WebRTC              AI/OCR             Graph
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 │
                                 ▼
                             REMEMBER
                                 │
                                 ▼
                              SEARCH
                                 │
                                 ▼
                               ACT
```

This is the core architecture.

---

# 62. First implementation order

Do NOT ask Cursor to build the whole product.

Build in this exact order:

```text
01 foundation
02 visual shell
03 pairing
04 WebRTC
05 transfer
06 inbox
07 AI
08 graph
09 search
10 auth/sync
11 billing
12 production
```

Every phase must compile and run before the next phase begins.

---

# 63. First Cursor prompt

The first prompt must NOT ask Cursor to build AI, billing, WebRTC, or the entire product.

The first task is to establish the engineering foundation.

Paste this into Cursor:

---

You are acting as a Senior Staff Frontend Engineer and Product Architect.

We are building **FLUX**:

> Drop anything. It figures out the rest.

FLUX is a premium cross-platform product for transferring information between devices and then understanding, organizing, and connecting that information.

Target platforms:

- Web/Desktop
- iOS
- Android

Planned stack:

- React
- TypeScript
- Vite
- React Native
- Expo
- Expo Router
- Supabase
- PostgreSQL
- WebRTC
- TanStack Query
- Zustand
- Tailwind/CSS architecture
- Framer Motion
- React Native Reanimated
- Zod
- Playwright
- Vitest
- pnpm
- Turborepo

Future capabilities:

- QR device pairing
- WebRTC P2P file transfer
- universal clipboard
- screenshots/images/PDF/text/URL ingestion
- AI analysis
- OCR
- structured extraction
- semantic search
- visual knowledge graph
- Stripe subscriptions

IMPORTANT:

Do NOT implement all of those features now.

We are starting with **Phase 0 — Foundation + Phase 1 — Visual Shell**.

## Your responsibilities

Before writing code:

1. Inspect the existing repository.
2. Do not delete existing user work.
3. Determine whether the repo is empty or already contains an application.
4. Explain the current structure briefly.
5. Propose the smallest safe migration path if the repo already contains code.
6. Then implement the foundation.

## Architecture requirements

Create a production-oriented Turborepo monorepo:

```text
apps/
  web/
  mobile/

packages/
  ui/
  design-tokens/
  types/
  validation/
  transfer/
  signaling/
  ai/
  graph/
  analytics/
  utils/

supabase/
  migrations/
  functions/

docs/
  architecture/
  decisions/
  product/
  security/
```

Use pnpm workspaces.

Use strict TypeScript.

Avoid `any`.

Do not introduce unnecessary dependencies.

## Web

Create a Vite + React + TypeScript application.

Prepare routing for:

```text
/
/pricing
/login
/signup
/app
/app/inbox
/app/search
/app/graph
/app/devices
/app/settings
/app/billing
```

For now, only implement:

```text
/
/app
```

The other routes can have minimal placeholders.

## Mobile

Create an Expo React Native TypeScript application.

Use Expo Router.

Create a minimal shell that will later support:

```text
Home
Devices
Inbox
Settings
```

Do not implement authentication yet.

Do not implement native WebRTC yet.

Do not implement file transfer yet.

## Design direction

FLUX must NOT look like a generic SaaS dashboard.

Design language:

- dark
- cinematic
- minimal
- premium
- futuristic
- spacious
- subtle glass
- glowing nodes
- particles
- soft gradients
- restrained typography
- strong hierarchy
- excellent mobile responsiveness

The visual metaphor is information flowing through a system.

Main web screen should contain a large central FLUX visual.

Create an initial interactive visual shell with:

```text
central FLUX node
+
small surrounding nodes
+
subtle particle movement
+
connection lines
+
drop zone
+
status state
```

The animation must communicate state.

Create a reusable state model:

```ts
type FluxVisualState =
  | "idle"
  | "pairing"
  | "connected"
  | "receiving"
  | "processing"
  | "understood"
  | "linked"
  | "success"
  | "error";
```

Initially only implement:

```text
idle
```

and a simple demo transition to:

```text
processing
success
```

This is only a visual prototype.

Do not fake real data or pretend a real transfer happened.

## Design system

Create centralized design tokens.

At minimum:

- colors
- typography
- spacing
- radii
- shadows
- blur
- motion durations
- easing

Do not scatter magic values throughout components.

Create reusable components:

```text
FluxCanvas
FluxNode
FluxParticles
FluxDropZone
FluxStatus
```

Components must be small and composable.

## State management

Use Zustand only for client-side UI state.

Create:

```ts
useFluxStore
```

with the visual state.

Do not put server state into Zustand.

Prepare TanStack Query but do not create fake server queries.

## Packages

Create package boundaries even if some packages initially contain only types/interfaces.

For example:

```ts
packages/types
```

should contain shared domain types.

Start with:

```ts
ItemType
FluxItem
FluxVisualState
Device
TransferManifest
```

Do not implement the full backend yet.

## Environment

Create:

```text
.env.example
```

with placeholders only.

Never create real credentials.

Prepare variables for:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Do not initialize privileged Supabase credentials in client applications.

## Quality

Configure:

- ESLint
- Prettier
- TypeScript strict mode
- Vitest
- Playwright
- CI-ready scripts

Add scripts:

```text
dev
build
lint
typecheck
test
test:e2e
format
```

The repository must pass:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Documentation

Create:

```text
README.md
docs/architecture/overview.md
docs/architecture/frontend.md
docs/architecture/mobile.md
docs/decisions/001-monorepo.md
docs/decisions/002-web-first.md
```

README should explain:

- product
- architecture
- local setup
- commands
- repository structure
- development phases
- design principles

## Important engineering rules

1. Do not build beyond the current phase.
2. Do not implement fake backend functionality.
3. Do not add unnecessary dependencies.
4. Do not create giant components.
5. Do not put business logic into UI components.
6. Do not use `any` to silence TypeScript.
7. Do not hard-code environment secrets.
8. Do not put binary data into Zustand.
9. Keep domain types platform-independent.
10. Prefer small composable modules.
11. Make the architecture ready for WebRTC without implementing WebRTC yet.
12. Make the architecture ready for Supabase without requiring a live project yet.
13. Make the architecture ready for AI without coupling UI to an AI provider.
14. Make animations accessible and respect reduced-motion preferences.
15. Do not use Three.js unless it is genuinely necessary for the first visual shell. Prefer performant CSS/SVG/Canvas primitives initially.
16. Keep the initial bundle small.
17. Lazy-load future graph/3D features.
18. Use semantic HTML on web.
19. Keep mobile and web UI visually related but platform-appropriate.
20. Every architectural decision must have a clear reason.

## Execution order

Execute in this exact order:

### Step 1

Inspect repository.

### Step 2

Create/normalize monorepo structure.

### Step 3

Configure TypeScript.

### Step 4

Configure linting/formatting/testing.

### Step 5

Create shared packages.

### Step 6

Create web application shell.

### Step 7

Create mobile Expo shell.

### Step 8

Implement FLUX design tokens.

### Step 9

Implement visual shell.

### Step 10

Implement visual state store.

### Step 11

Add tests.

### Step 12

Run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### Step 13

Fix all errors.

### Step 14

Show me:

1. final file tree
2. architecture decisions
3. packages added
4. commands executed
5. test results
6. build results
7. remaining TODOs
8. what should be implemented in Phase 2

Do not start Phase 2 automatically.

Wait for my approval.

The goal of this task is to establish a clean, scalable foundation for a real commercial product, not to generate a quick prototype.

