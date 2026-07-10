# Agent–Frontend Integration: Complete Architecture Reference

**Scope**: How AI agents (voice pipelines, LLM chat, autonomous workers) are wired into website and dashboard frontends. Based on three production systems built end-to-end:

1. **NITK Central Library Kiosk** — a voice agent ("Ritu") + text agent ("Aria") behind a single Next.js frontend
2. **Torq Hotel Agent Dashboard** — a voice booking agent whose actions surface as live operational data in a management dashboard
3. **Torq Outbound Campaign Dashboard** — an internal tool where the frontend drives *outbound* agent calling at scale (campaigns, contact lists, per-call outcomes) rather than receiving inbound calls

This document consolidates all three into one reference so the underlying pattern — and where each implementation diverges — is clear in one place.

---

## Table of Contents

1. [Why This Separation Exists](#1-why-this-separation-exists)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Integration Mode A — Voice Room Dispatch](#3-integration-mode-a--voice-room-dispatch)
4. [Integration Mode B — Direct API Chat](#4-integration-mode-b--direct-api-chat)
5. [Integration Mode C — Shared-Database Dashboard](#5-integration-mode-c--shared-database-dashboard)
6. [Integration Mode D — Outbound Campaign Orchestration](#6-integration-mode-d--outbound-campaign-orchestration)
7. [Full Project Structure Reference](#7-full-project-structure-reference)
8. [Environment Variables & Secret Boundaries](#8-environment-variables--secret-boundaries)
9. [Database Schema Deep Dive (Hotel Dashboard)](#9-database-schema-deep-dive-hotel-dashboard)
10. [Database Schema Deep Dive (Outbound Campaign Dashboard)](#10-database-schema-deep-dive-outbound-campaign-dashboard)
11. [API Reference (Hotel Dashboard)](#11-api-reference-hotel-dashboard)
12. [API Reference (Outbound Campaign Dashboard)](#12-api-reference-outbound-campaign-dashboard)
13. [Data Flow & Lifecycles](#13-data-flow--lifecycles)
14. [Keeping Multiple Channels Consistent](#14-keeping-multiple-channels-consistent)
15. [Deployment Model](#15-deployment-model)
16. [Design Decisions & Trade-offs](#16-design-decisions--trade-offs)
17. [Common Failure Modes & Fixes](#17-common-failure-modes--fixes)
18. [Summary Table — Four Integration Modes](#18-summary-table--four-integration-modes)
19. [Checklist for Wiring a New Agent Into a Frontend](#19-checklist-for-wiring-a-new-agent-into-a-frontend)
20. [Glossary](#20-glossary)

---

## 1. Why This Separation Exists

An AI agent that talks (via voice or chat) or acts (creates bookings, updates records) has fundamentally different operational needs than a web frontend:

- **The agent is long-running or bursty and stateful mid-conversation.** A LiveKit voice agent worker holds an open audio/video session, runs a VAD (voice activity detection) loop, and keeps a conversation state machine alive for the duration of a call. That's a persistent process, not a request/response function.
- **The frontend is stateless and short-lived per request.** Next.js serverless functions and static/ISR pages are built around fast, ephemeral request handling — they are not designed to hold a long-lived audio session open.

Trying to run the agent *inside* the frontend's serverless functions would mean fighting the execution model of both sides. So in both systems described here, the agent is deployed and run as a **separate, independently long-running process**, and the frontend's only job is to:

1. **Open a door** for the agent to join a conversation, or
2. **Call the agent's brain directly** for a single request/response turn, or
3. **Read/write shared state** that the agent also reads/writes.

This gives a clean deployment boundary: the frontend team can ship UI changes without touching the agent process, and the agent/ML team can change models, prompts, or pipelines without a frontend deploy.

---

## 2. High-Level Architecture

```
                         ┌────────────────────────────────────────┐
                         │              Frontend                    │
                         │         (Next.js, serverless)             │
                         │                                            │
                         │  /voice   /chat   /dashboard   /bookings   │
                         └───────┬─────────┬──────────┬──────────────┘
                                 │         │          │
                    ┌────────────┘         │          └───────────────┐
                    ▼                      ▼                          ▼
        ┌───────────────────┐   ┌───────────────────┐     ┌─────────────────────┐
        │  LiveKit Room      │   │  LLM Provider API   │     │  Shared Database      │
        │  (token + dispatch)│   │  (direct HTTPS call) │     │  (Neon Postgres)       │
        └─────────┬──────────┘   └───────────────────┘     └───────────┬─────────────┘
                  │ joins                                              │
                  ▼                                                    │
        ┌───────────────────┐                                         │
        │  Agent Worker       │◀────────────────── reads/writes ──────┘
        │  (long-running       │
        │   process — STT/TTS/  │
        │   LLM/VAD, or booking  │
        │   logic)                │
        └───────────────────┘
```

Three distinct integration modes appear in the diagram above, and a given product typically uses more than one at once:

| System | Modes used |
|---|---|
| NITK Library Kiosk | A (voice room dispatch) + B (direct API chat) |
| Torq Hotel Dashboard | A (voice room dispatch) + C (shared-database dashboard) |
| Torq Outbound Campaign Dashboard | A (voice room dispatch, agent-initiated) + C (shared-database dashboard) + D (outbound orchestration) |

Each mode is broken down in full below.

---

## 3. Integration Mode A — Voice Room Dispatch

This is the mechanism that gets a real-time voice agent into a browser call **without the frontend running any part of the voice pipeline itself.**

### 3.1 What the frontend does

The frontend has exactly one server-side responsibility for voice: minting a token. In the NITK Library project this lives at `app/api/token/route.ts`, a Next.js serverless route running with `runtime = "nodejs"`.

That route:

1. Accepts a request from the browser (`/voice` page) to start a call.
2. Uses the LiveKit server SDK, authenticated with `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET`, to mint a **short-lived access token** scoped to a specific room.
3. Embeds an explicit **agent dispatch instruction** directly inside that token's grants — a `RoomConfiguration` containing a `RoomAgentDispatch` with an `agentName` field (e.g. `"nitk-library-agent"`).
4. Returns only the signed token string to the browser.

The browser-side `VoiceRoom.tsx` component then:

1. Uses the LiveKit client SDK to connect to the LiveKit server using that token.
2. On connect, LiveKit creates the room (if it doesn't already exist) and, because the token carries the dispatch instruction, **automatically invites the registered agent worker into that room** — no separate network call from the frontend to the agent is needed.
3. Renders the call UI: a connect gate, live captions (from the agent's STT/TTS transcript stream), an audio bar visualizer, and a mic mute/unmute toggle.

### 3.2 What never happens on the frontend

- The browser **never** receives `LIVEKIT_API_SECRET`. Only the final signed token crosses the network to the client.
- The frontend **never** runs STT, TTS, VAD, or the conversational LLM. All of that lives in the agent worker process.
- The frontend **never** directly calls the agent process's IP/port. The only integration point is the LiveKit room itself, mediated by the dispatch metadata in the token.

### 3.3 What the agent side does

The agent worker (`agent.py`, using LiveKit Agents, paired with `persona.py` for prompt/personality and `tools.py` for callable functions) is:

- Started completely independently: `uv run agent.py start`.
- Registered under a fixed `agentName` (must match the string embedded in the token's dispatch config exactly — this is the entire contract between frontend and agent).
- Pointed at the **same LiveKit project** as the frontend (same `LIVEKIT_URL`).
- Running its own pipeline: Sarvam for STT/TTS, DeepSeek as the conversational LLM, Silero for voice activity detection.

The instant a room is created with the dispatch embedded, LiveKit's server infrastructure — not the frontend, not a webhook the frontend has to manage — pushes the worker into the room. This is the crux of the decoupling: **the frontend's only contract with the agent is a string (`agentName`) and a shared LiveKit project.** Nothing about the agent's model, prompt, or pipeline is visible to or dependent on the frontend code.

### 3.4 Why embed dispatch in the token vs. a separate dispatch API call

Embedding the dispatch directly in the token (rather than the frontend making a second call to a LiveKit dispatch endpoint after minting the token) collapses "authenticate the browser" and "invite the agent" into a single atomic step. There's no window where a room exists with a connected human but no agent yet, and no second serverless round-trip needed.

---

## 4. Integration Mode B — Direct API Chat

This is the pattern for a **text-only** assistant that needs to answer the same questions as the voice agent, without any real-time audio/room infrastructure at all.

### 4.1 What the frontend does

In the NITK Library project, this is the `/chat` route backed by `app/api/chat/route.ts`:

1. The browser (`ChatWindow.tsx`) posts the user's message to this serverless route.
2. The route calls the LLM provider's chat completions endpoint **directly** over HTTPS, using a server-side-only key (`DEEPSEEK_API_KEY`).
3. The LLM call is configured with **function-calling tools** defined in `lib/ariaPersona.ts` — this is where "Aria" (the text persona) is prompted and given callable functions.
4. Tool calls the model requests are resolved against `lib/knowledge.ts`, and the reply is streamed back to the browser.
5. `ChatWindow.tsx` renders the streamed reply plus suggestion chips for follow-up questions.

### 4.2 Why this is a separate mode from voice dispatch

There is no LiveKit room, no audio pipeline, no persistent worker process for this path — it's a conventional stateless request/response serverless function calling an LLM API. It's a different integration mode because:

- The security boundary is a plain API key in a serverless function's environment, not a scoped, short-lived, room-bound token.
- The "agent" here isn't a separate long-running process — its logic (the tool schema and system prompt) lives **inside the frontend's own codebase**, in `lib/ariaPersona.ts`.

### 4.3 Single-sourcing knowledge between voice and chat

Both Ritu (voice) and Aria (chat) need to answer from the same facts (library hours, database locations, floor info, etc.). Rather than re-deriving that knowledge independently for each channel:

- `tools.py` (used by the Python voice agent) defines the canonical `search_databases` and `get_library_info` functions and the static knowledge base they read from.
- `lib/knowledge.ts` is a **direct TypeScript port** of that same static knowledge base.
- `lib/ariaPersona.ts` wires `lib/knowledge.ts` up as DeepSeek function-calling tool schemas, mirroring the shape of the Python tool functions.

This is a deliberate, manual sync point, not a shared runtime import (the two live in different languages/runtimes — Python for the agent worker, TypeScript for the Next.js app). The explicit rule that falls out of this: **if the static knowledge base changes in `tools.py`, the change must be mirrored by hand in `lib/knowledge.ts`.** There's no automatic sync; consistency is a discipline, not a guarantee, so the port needs to be revisited any time the source of truth changes.

---

## 5. Integration Mode C — Shared-Database Dashboard

This is the pattern for when an agent's actions need to become **live operational state** that a human manages through a dashboard — used in the Torq Hotel Agent Dashboard, where a voice booking agent and a Next.js management dashboard both operate against the same hotel.

### 5.1 The core idea

The agent and the dashboard **never call each other directly**. There is no API between "agent process" and "dashboard process." Instead, both sides read and write the same Neon Postgres database, and the database itself — specifically, careful status-field discipline — is what keeps the two views consistent.

```
Agent (on a call, books a room)
        │
        ▼  INSERT booking (status='active'), UPDATE rooms SET availability=false
┌───────────────────┐
│   Neon Postgres     │
│   booking / rooms /   │
│   settings tables      │
└─────────┬───────────┘
          │  SELECT ... WHERE status='active' AND dates valid
          ▼
   Dashboard queries (getMetrics, getBookings, getRooms)
          │
          ▼
   Next.js dashboard UI, ISR-refreshed every ~10s
```

### 5.2 Why a database instead of a live call

- **No coupling to agent uptime.** The dashboard doesn't need the agent process to be reachable to render correct data — it only needs the database to be up.
- **Multiple writers, one source of truth.** Front-desk staff can also create/modify bookings from the dashboard UI itself (`POST /api/bookings`), and those writes are indistinguishable to the dashboard from ones the agent made — both just become rows with the same schema.
- **"Near real-time" without a socket layer.** Using ISR (Incremental Static Regeneration) with a short revalidation window (10 seconds) gives a live-feeling dashboard without needing WebSockets, polling loops, or a pub/sub layer between agent and frontend.

### 5.3 Settings as a two-way configuration channel

The `settings` table is the other half of this integration: it lets a **non-technical hotel staff member** change what the agent says and how it prices rooms, entirely from the dashboard's Settings page, with zero code deploys:

- Hotel name, agent name, greeting script, tone (Formal / Friendly / Luxury)
- Room pricing (`delux_price`, `standard_price`)
- SIP trunk / telephony config, PMS provider, manager SIP for escalation

The agent reads these values at call time from the same database the dashboard writes them to. This closes the loop: the dashboard isn't just a read-only view of agent activity, it's also a live control panel for agent behavior.

---

## 6. Integration Mode D — Outbound Campaign Orchestration

This mode appears in the **Torq Outbound Campaign Dashboard**, and it inverts the usual relationship between frontend and agent. In modes A–C, a human (or the agent, on an inbound call) initiates contact and the system responds. In outbound calling, the **frontend is the thing that tells the agent who to call, when, and with what context** — the frontend drives the agent, at scale, on a schedule.

### 6.1 What the frontend owns

- **Campaign configuration** — calling window (e.g. 09:00–18:00), follow-up delay in hours, max follow-up attempts, and status (`active` / `paused` / `completed` / `archived`), all stored per-campaign and editable from `/campaigns`.
- **Contact ingestion at scale** — `/upload` parses a CSV client-side, shows a preview, and on confirmation bulk-inserts every row into Neon in a single transaction via `POST /api/upload`. Required columns are just `name` and `phone`; every other CSV column is captured automatically into a `metadata` JSONB field with zero schema changes — so a campaign with `company` and `lead_source` columns just works, and the agent reads that metadata at call time for personalized context.
- **Contact state tracking** — `/contacts` shows every contact's lifecycle status (`pending → called / completed / failed / do_not_call`), follow-up date, and attempt count, filterable by campaign and status.
- **Call outcome logging** — `/calls` is the full history of every call attempt: contact, campaign, duration, outcome, and the LiveKit room name that call used. Outcomes are one of `answered / voicemail / no_answer / busy / failed / completed`.

### 6.2 What the agent owns

The actual outbound dialing and conversation logic lives outside this repo entirely — this dashboard is explicitly the **control and record-keeping layer**, not the dialer itself. The contract points are:

- The agent (or an orchestrating worker) reads `pending` contacts from the shared DB, respecting each campaign's calling window and follow-up rules.
- For each call it places, it generates a LiveKit room (naming convention: `torq-campaign{id}-contact{id}-{timestamp}`) and, on the same shared LiveKit project (`LIVEKIT_URL` / `NEXT_PUBLIC_LIVEKIT_URL`), the dashboard can join or reference that room using the room name recorded on the call log.
- When the call ends, the agent (or a webhook/worker acting on its behalf) calls `POST /api/calls` with the outcome and transcript. **This single write is what closes the loop**: the API route updates the parent contact's status automatically based on the outcome, so the dashboard never needs a second reconciliation step.

### 6.3 Why this is a distinct mode from A/B/C

- Unlike Mode A, the *dashboard* — not a human clicking "call" in a browser — is the source of the decision to start a call. The browser's role is upstream (defining who/when/how many attempts), not present at call time.
- Unlike Mode C's booking pattern (where dashboard and agent both react to real-world events as they happen), here the dashboard's data **is the work queue** the agent consumes from — campaigns and contacts aren't just a record of what happened, they're instructions for what should happen next.
- The single most important integration point is still a shared database, but the read direction is reversed: the agent is the *reader* of dashboard-authored config (campaign rules, contact list, metadata) as much as it is a *writer* of outcomes.

### 6.4 CSV-to-metadata pattern

Worth calling out on its own because it's a reusable trick: rather than requiring a fixed contact schema, the upload flow treats `name` and `phone` as the only structural columns and folds everything else into a JSONB `metadata` column automatically.

```json
// CSV: name, phone, company, lead_source
// becomes:
{
  "name": "Jane Smith",
  "phone": "+91-9876543210",
  "metadata": { "company": "Acme", "lead_source": "referral" }
}
```

This means new campaigns with new context fields never require a schema migration or a frontend code change — the agent simply reads whatever keys happen to be present in `metadata` at call time and uses what's relevant to its prompt.

---

## 7. Full Project Structure Reference

### NITK Library Kiosk (Next.js 14, App Router)

```
app/
  page.tsx                 Home — scattered card board, Books/Home/Papers tabs, Voice/Chat entry points
  voice/page.tsx            Voice call route (renders VoiceRoom)
  chat/page.tsx             Aria chat route (renders ChatWindow)
  api/token/route.ts         Mints LiveKit token + embeds agent dispatch (runtime = "nodejs")
  api/chat/route.ts          Calls DeepSeek directly, resolves tool calls, streams reply
components/
  ScatteredBoard.tsx         Home page card board UI
  VoiceRoom.tsx               LiveKit room UI: connect gate, live captions, bar visualizer, mic toggle
  ChatWindow.tsx               Aria chat UI: streamed replies, suggestion chips
lib/
  cards.ts                     Content for the scattered board
  knowledge.ts                  TypeScript port of tools.py's static knowledge base
  ariaPersona.ts                 Aria's system prompt + DeepSeek tool schemas

# Paired, unchanged, separately deployed:
agent.py / persona.py / tools.py     The existing LiveKit voice agent worker ("Ritu")
```

### Torq Hotel Agent Dashboard (Next.js 16.2 + React 19)

```
server/db/
  queries.ts        getMetrics, getBookings, getRooms, getSettings, updateSettings,
                     checkoutBooking, getBookingsByRoom, getActiveBookings
app/api/bookings/    GET (list active), POST (create), DELETE (checkout)
app/api/settings/    GET (load / auto-create defaults), POST (update)
(dashboard pages)    Home metrics grid, 7-day trend chart, recent bookings,
                     room type breakdown, live system health
```

### Torq Outbound Campaign Dashboard (Next.js 14)

```
torq-dashboard/
├── app/
│   ├── (dashboard)/          # Shared sidebar+topbar layout wraps all these pages
│   │   ├── dashboard/          Overview metrics, recent calls, per-campaign progress
│   │   ├── campaigns/           Create/manage campaigns, calling window, follow-up rules
│   │   ├── upload/               CSV parse + preview client-side, bulk push to DB
│   │   ├── contacts/              Browse/filter contacts by campaign + status
│   │   ├── calls/                  Full call history: outcome, duration, room name
│   │   └── settings/                Credential reference + "Test Connection" (/api/health)
│   ├── api/                    # Server-side only — never runs in the browser
│   │   ├── campaigns/           GET, POST, PATCH /:id, DELETE /:id
│   │   ├── contacts/              GET (filterable), PATCH /:id
│   │   ├── calls/                  GET (filterable), POST (logs outcome, updates contact)
│   │   ├── upload/                  POST (bulk insert from parsed CSV)
│   │   └── health/                   GET (DB connectivity check)
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── Topbar.tsx
│   ├── Sidebar.tsx
│   └── UI.tsx                 # Shared components: Card, Button, Badge, Toast, etc.
├── lib/
│   ├── db.ts                   # Postgres pool — reuses connection in dev to avoid exhaustion
│   ├── livekit.ts               # JWT token generation, room name helpers
│   └── types.ts                  # TypeScript interfaces shared across app + API
├── db/
│   └── schema.sql               # Run once to initialise a fresh DB
└── .env.example
```

---

## 8. Environment Variables & Secret Boundaries

### NITK Library Kiosk

```env
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
DEEPSEEK_API_KEY=
```

All four are read **server-side only**, inside `app/api/*/route.ts` files running with `runtime = "nodejs"`. None are exposed to the browser bundle. Set in the deployment host's project settings (e.g. Vercel), never committed to the repo.

### Torq Hotel Dashboard

```env
DB_URL=postgresql://user:pass@host/db?sslmode=require
LIVEKIT_URL=wss://your-server.com
LIVEKIT_API_KEY=your-key
LIVEKIT_API_SECRET=your-secret
```

### Torq Outbound Campaign Dashboard

```env
DATABASE_URL=postgresql://user:pass@host.neon.tech/neondb?sslmode=require
LIVEKIT_URL=wss://torq-xxxx.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxxxxxxxxxx
LIVEKIT_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_LIVEKIT_URL=wss://torq-xxxx.livekit.cloud
```

This project makes the client/server boundary explicit in the variable name itself: `LIVEKIT_URL` (server-only, used wherever a route needs to mint tokens) versus `NEXT_PUBLIC_LIVEKIT_URL` (deliberately duplicated with the `NEXT_PUBLIC_` prefix, which is Next.js's mechanism for allowing a value into the browser bundle). The URL itself isn't sensitive — it's just a connection endpoint — but `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` are never given the `NEXT_PUBLIC_` treatment, so they can't leak into client code even by accident.

### The general rule this implies

Any credential that grants write access, room-creation power, or LLM billing (`LIVEKIT_API_SECRET`, `DEEPSEEK_API_KEY`, `DATABASE_URL` / `DB_URL`) stays server-side, inside a Next.js API route with the Node runtime. The **only** artifacts that ever reach the browser are a narrowly scoped, short-lived token (LiveKit access token), a plain connection endpoint that carries no auth power on its own (`NEXT_PUBLIC_LIVEKIT_URL`), or a plain JSON response (chat reply, booking list, campaign list) — never a credential the browser could reuse to impersonate the server.

---

## 9. Database Schema Deep Dive (Hotel Dashboard)

Three tables, all auto-created on first access — **zero manual migrations required.**

### `booking`

```sql
booking (
  booking_id: SERIAL PRIMARY KEY,
  name: VARCHAR,             -- guest name
  no: VARCHAR,                -- booking reference
  room_no: INTEGER,            -- FK to rooms
  check_in: DATE,
  check_out: DATE,
  actual_checkout: DATE,        -- set when guest actually checks out
  total_price: INTEGER,          -- in ₹
  status: VARCHAR,                -- 'active' | 'checked_out' | 'cancelled'
  created_at: TIMESTAMP
)
```

- `status` is the field every query filters on to avoid showing stale or invalid data.
- `actual_checkout` is distinct from `check_out` (the planned date) — it records when the guest *really* left, which feeds analytics separately from the booked date range.
- Rows with null/invalid dates are automatically filtered out of every read path.

### `rooms`

```sql
rooms (
  room_no: INTEGER PRIMARY KEY,
  room_type: VARCHAR,     -- 'Delux' | 'Standard'
  availability: BOOLEAN    -- true = available, false = occupied
)
```

Auto-populated with 10 default rooms on first access (5 Delux, 5 Standard — rooms 101–103 and 108/110 Delux; 104–107 and 109 Standard) so the dashboard has a working room list with zero setup.

### `settings`

```sql
settings (
  id: SERIAL PRIMARY KEY,
  hotel_name: VARCHAR,      -- default 'The Grand Heritage, Mysuru'
  agent_name: VARCHAR,       -- default 'Aria'
  greeting: VARCHAR,
  tone: VARCHAR,               -- 'Formal' | 'Friendly' | 'Luxury'
  sip_trunk: VARCHAR,
  livekit_room: VARCHAR,
  manager_sip: VARCHAR,
  pms_provider: VARCHAR,
  delux_price: VARCHAR,          -- default '5000'
  standard_price: VARCHAR,        -- default '2500'
  updated_at: TIMESTAMP
)
```

Auto-created with sensible defaults on first access, and persisted across restarts once saved from the dashboard's Settings page.

---

## 10. Database Schema Deep Dive (Outbound Campaign Dashboard)

Three tables, defined explicitly in `db/schema.sql` and run **once** against a fresh database (unlike the hotel dashboard, this schema is not auto-created at runtime — it's a deliberate, versioned migration step). Foreign keys are enforced, and deleting a campaign cascades to its contacts and calls.

```
campaigns   — one per client campaign, holds calling config
  - belongs to a client_id
  - calling_window_start / calling_window_end (e.g. "09:00" / "18:00")
  - follow_up_delay_hours, max_follow_up_attempts
  - status: 'active' | 'paused' | 'completed' | 'archived'

contacts    — one per person, belongs to a campaign, holds status + metadata
  - name, phone (only structurally required fields)
  - metadata: JSONB — every other CSV column lands here automatically
  - status: 'pending' | 'called' | 'completed' | 'failed' | 'do_not_call'
  - follow_up_at, follow_up_attempts
  - updated_at kept current automatically via a DB trigger

calls       — one per call attempt, belongs to a contact, holds outcome + transcript
  - livekit_room_name
  - outcome: 'answered' | 'voicemail' | 'no_answer' | 'busy' | 'failed' | 'completed'
  - transcript, agent_notes
```

Two schema design choices worth calling out:

- **`metadata` as an escape hatch.** Rather than every new campaign requiring a new column (and a migration) for whatever extra fields that client's CSV happens to have, arbitrary columns fall into a JSONB blob on the contact row. This is the same "avoid a migration for every new shape of data" instinct as the hotel dashboard's auto-created defaults, applied to a different problem (variable-shape input data rather than zero-setup onboarding).
- **A DB trigger, not application code, keeps `updated_at` current.** This guarantees the timestamp is correct regardless of which code path (API route, future admin script, direct SQL) touches the row — consistency is enforced at the data layer rather than trusted to every caller to remember.

---

## 11. API Reference (Hotel Dashboard)

### `GET /api/bookings`

Returns all **active** bookings.

```json
[
  {
    "bookingId": 1,
    "name": "Aditya",
    "no": "BK001",
    "roomNo": 101,
    "checkIn": "2026-06-02",
    "checkOut": "2026-06-05",
    "actualCheckout": null,
    "totalPrice": 15000,
    "status": "active"
  }
]
```

### `POST /api/bookings`

Creates a new booking.

```json
{
  "name": "Guest Name",
  "no": "BK002",
  "roomNo": 102,
  "checkIn": "2026-06-05",
  "checkOut": "2026-06-08"
}
```

Validation performed server-side:
- Date-range conflict detection against existing active bookings for that room
- `check_out` must be after `check_in`
- Room must currently be available
- Price is calculated automatically from the room type's current price in `settings`

### `DELETE /api/bookings`

Checks a guest out.

```json
{ "bookingId": 1 }
```

Actions performed:
1. Marks that booking's `status` as `"checked_out"`
2. Sets `actual_checkout` to today's date
3. If no other active bookings remain for that room, flips `rooms.availability` back to `true`

### `GET /api/settings`

Returns current settings — auto-creates defaults on first call if the row doesn't exist yet.

### `POST /api/settings`

Updates settings and persists to the database (hotel name, agent name, greeting script, tone, pricing, telephony config).

### `server/db/queries.ts` function reference

| Function | Purpose |
|---|---|
| `getMetrics()` | Dashboard stats — computed from **active** bookings only |
| `getBookings()` | All valid bookings (filters null/invalid rows) |
| `getRooms()` | Room list with current availability |
| `getSettings()` | Load settings (auto-creates defaults if missing) |
| `updateSettings()` | Persist settings changes |
| `checkoutBooking()` | Mark a guest as checked out, free the room if applicable |
| `getBookingsByRoom()` | Bookings scoped to one room |
| `getActiveBookings()` | Only `status = 'active'` rows |

---

## 12. API Reference (Outbound Campaign Dashboard)

All responses are JSON. Success: `{ data: ... }`. Failure: `{ error: "..." }` with an appropriate HTTP status — a consistent envelope every route in the project follows.

### Campaigns

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/campaigns` | All campaigns with contact counts and progress |
| `POST` | `/api/campaigns` | Create a campaign |
| `PATCH` | `/api/campaigns/:id` | Update status, name, calling window, follow-up config |
| `DELETE` | `/api/campaigns/:id` | Delete campaign (cascades to contacts + calls) |

```json
// POST /api/campaigns
{
  "name": "June Enterprise Push",
  "client_id": "client_001",
  "status": "active",
  "calling_window_start": "09:00",
  "calling_window_end": "18:00",
  "follow_up_delay_hours": 48,
  "max_follow_up_attempts": 3
}
```

### Contacts

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/contacts` | List contacts — filter with `?campaign_id=` and/or `?status=` |
| `PATCH` | `/api/contacts/:id` | Update status, `follow_up_at`, `follow_up_attempts`, or `metadata` |

### Upload

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/upload` | Bulk insert contacts from a parsed CSV into a campaign, single transaction |

```json
// POST /api/upload
{
  "campaign_id": 12,
  "contacts": [
    { "name": "Jane Smith", "phone": "+91-9876543210", "company": "Acme" },
    { "name": "Bob Jones",  "phone": "+91-9876543211" }
  ]
}
// Response: { "inserted": 2, "message": "2 contacts pushed to campaign 12" }
```

### Calls

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/calls` | All call logs — filter with `?contact_id=` |
| `POST` | `/api/calls` | Log a call; updates parent contact status automatically if outcome is provided |

```json
// POST /api/calls
{
  "contact_id": 44,
  "livekit_room_name": "torq-campaign12-contact44-1717123456789",
  "outcome": "answered",
  "transcript": "Full transcript text here...",
  "agent_notes": "Requested callback on Monday."
}
```

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Confirms DB connectivity — used by Vercel health checks and the Settings page's "Test Connection" button |

```json
// Response
{ "status": "ok", "db": true, "timestamp": "2025-06-05T10:00:00.000Z" }
```

**Convention for new routes**: create `app/api/your-route/route.ts`, export named `GET`/`POST`/`PATCH`/`DELETE` functions, use the shared `query()` helper from `lib/db.ts`, and return `NextResponse.json({ data })` or `NextResponse.json({ error }, { status: 4xx })` — every route in the project follows this shape, which is what keeps the API surface predictable as it grows.

---

## 13. Data Flow & Lifecycles

### 13.1 Hotel booking lifecycle

### Dashboard read path

```
Dashboard Request
    ↓
getMetrics() {
  - Fetch all bookings
  - Filter: status = 'active' AND valid dates
  - Calculate: occupied rooms, available rooms
  - Compute: occupancy %, revenue (MTD + all-time), 7-day trend
}
    ↓
Render: active booking count, occupied rooms, available rooms, trend chart
```

### Booking write path (create → occupy → checkout → free)

```
Create Booking (POST /api/bookings)
    ↓
INSERT booking, status = 'active'
UPDATE rooms SET availability = false
    ↓
Appears in: Recent Bookings, occupancy ↑
    ↓
Checkout (DELETE /api/bookings)
    ↓
UPDATE booking SET status = 'checked_out', actual_checkout = today
    ↓
Any other active bookings for this room?
   NO  → UPDATE rooms SET availability = true
   YES → room stays occupied (another active booking still holds it)
    ↓
Removed from: Recent Bookings, occupancy ↓
```

This status-driven lifecycle is what makes the dashboard, the bookings page, and (in the full system) the voice agent's live view of room availability all agree with each other — every one of them is reading the same `status` and `availability` fields rather than maintaining separate derived state.

### 13.2 Outbound campaign lifecycle

```
Upload CSV (client-side parse + preview)
    ↓
POST /api/upload → bulk INSERT contacts, status = 'pending', extra columns → metadata JSONB
    ↓
Agent/orchestrator reads pending contacts for active campaigns
    within calling_window_start–calling_window_end
    ↓
Agent places call → creates LiveKit room
    (torq-campaign{id}-contact{id}-{timestamp})
    ↓
Call ends → POST /api/calls with outcome + transcript
    ↓
INSERT into calls
UPDATE contacts.status based on outcome:
    answered/completed  → 'completed'
    no_answer/busy       → stays 'pending', follow_up_at advances
    failed                 → 'failed'
    (manual)                → 'do_not_call'
    ↓
If follow_up_attempts < max_follow_up_attempts and status still 'pending':
    eligible for another call after follow_up_delay_hours
    ↓
Dashboard (/dashboard, /contacts, /calls) reflects updated counts on next page load
```

Unlike the hotel dashboard's ISR-based near-real-time refresh, this dashboard **loads fresh data on every page visit with no websocket polling** — an explicit, simpler choice appropriate for an internal ops tool where staff actively navigate between pages rather than needing a live-updating screen.

---

## 14. Keeping Multiple Channels Consistent

This concern shows up in all three systems, in different forms:

**NITK Library (voice + chat parity):**
Two separate "agents" (Ritu the voice persona, Aria the chat persona) must give the same factual answers. The fix is a manual, explicit port: `tools.py` (Python, canonical) → `lib/knowledge.ts` (TypeScript, mirrored). No shared runtime — the sync is a documented responsibility, not automatic.

**Torq Hotel (agent + dashboard parity):**
The voice agent and the human-facing dashboard must agree on what rooms are occupied and what bookings are active. The fix is a shared database with disciplined status fields, rather than two independently-derived views. There's no "port the logic" step here because there's only one source of truth (the DB) — the risk instead is inconsistent *filtering* (e.g. one query path forgetting to exclude `cancelled` bookings), which is why every read path funnels through the same `queries.ts` functions instead of ad hoc SQL scattered across routes.

**Torq Outbound (dashboard + agent, bidirectional):**
Unlike the hotel dashboard where the agent is the primary writer and the dashboard mostly reads, here **both sides write and both sides read** — the dashboard writes campaign config and contact lists that the agent reads as its work queue, and the agent writes call outcomes that the dashboard reads as history. Consistency is kept by making the API the single choke point for every write (`POST /api/calls` is the only path that updates a contact's status from a call outcome — nothing else is allowed to mutate that field directly), so there's one authoritative place the "outcome → status" mapping logic lives.

**General principle:** whenever two or more surfaces (two agent personas, an agent and a dashboard, or a dashboard and its own agent-consumed work queue) need to present or act on the same facts, pick one of two disciplined strategies — a single shared source of truth with one authoritative write path (preferred, e.g. one database, one API route owning a given state transition), or an explicitly documented port between runtimes/languages when a shared source isn't possible (e.g. Python agent process vs. TypeScript serverless function). What doesn't work is letting each surface independently reimplement, re-derive, or separately mutate the same facts.

---

## 15. Deployment Model

### NITK Library Kiosk

- Deployed as an ordinary serverless Next.js app — Vercel or any Node-compatible host. No standalone backend server to run for the frontend itself.
- The agent worker (`agent.py`) is **deployed and run completely separately** — it's a long-running LiveKit Agents worker process, not a serverless function, and is not part of the Next.js project at all.
- Local dev: `npm run dev` for the frontend, `uv run agent.py start` for the agent, run side by side, pointed at the same LiveKit project.
- Production build: `npm run build && npm run start`; the agent worker is started the same way it runs locally, just deployed to wherever long-running processes live (a VM, container, etc.) — not to the frontend's serverless host.

### Torq Hotel Dashboard

- `npm run build` / `npm start` for production; `npm run dev` for local development.
- Zero migrations required — all three tables auto-create on first access.
- Uses Neon's HTTP client, which needs no connection pooling setup — well suited to a serverless deployment target where traditional long-lived DB connections are awkward.

### Torq Outbound Campaign Dashboard

- Deployed on Vercel; pushing to `main` triggers an automatic deploy. Environment variables live in Vercel project settings — `.env.local` is explicitly a local-only convenience, never relied on in production.
- First-time local setup requires running `db/schema.sql` once against a fresh database — or, more commonly, pointing `DATABASE_URL` at the already-provisioned shared staging DB and skipping that step entirely.
- Uses a reused connection pool in dev (`lib/db.ts`) specifically to avoid exhausting Postgres connections under Next.js's hot-reload behavior, where naive pool creation on every reload can otherwise leak connections quickly.
- Every preview deployment is expected to be health-checked before merge: `curl https://<preview-url>.vercel.app/api/health` should return `{ "status": "ok", "db": true }`, confirming DB connectivity before code touching the API or DB layer ships.

### The shared deployment principle

Across all three systems, **the agent process's deployment lifecycle is independent of the frontend's.** The frontend can be redeployed (new UI, new routes) without restarting the agent, and the agent can be redeployed (new prompt, new model, new pipeline) without a frontend build. The only things that must stay in sync across a deploy are the *contracts*: the `agentName` string, the LiveKit project, the DB schema/connection string, and (for the dual-persona or campaign-orchestration cases) the ported knowledge base or the outcome→status mapping.

---

## 16. Design Decisions & Trade-offs

| Decision | Why | Trade-off accepted |
|---|---|---|
| Dispatch embedded in token, not a separate API call | Atomic: room + agent invite happen in one step | Frontend must know the agent name at token-mint time; can't dynamically choose an agent later in the call |
| ISR (10s) instead of WebSockets for dashboard | No extra infra, "good enough" for hotel-staff usage patterns | Not truly real-time — up to ~10s staleness window |
| Manual TypeScript port of Python knowledge base | Two runtimes (Python agent, Node frontend) can't share code directly | Sync is a manual discipline; drift is possible if not maintained |
| Shared DB instead of agent→dashboard API | Removes coupling to agent uptime; supports multiple writers (agent + staff) cleanly | Requires disciplined status-field filtering everywhere data is read |
| Secrets only ever server-side, tokens only ever client-side | Standard least-privilege boundary | Every new capability needs a new serverless route rather than a direct client call |
| Auto-create tables/defaults on first access | Zero-migration onboarding, fast to stand up a new hotel instance | Schema changes later require an explicit, deliberate migration path (not automatic) |
| `metadata` JSONB catch-all for contact fields | New campaigns with new data shapes need zero migrations or frontend changes | Loses type safety and query-ability on those fields at the DB level (JSONB querying is possible but clunkier than typed columns) |
| Versioned `schema.sql` run once, instead of auto-create-on-access | Explicit, reviewable, reproducible schema for a shared multi-user internal tool | Requires a deliberate setup step per fresh DB (acceptable trade-off since staging/prod DBs are typically shared, not spun up per-developer) |
| Fresh data load per page visit (no websockets/polling) for the campaign dashboard | Simplicity — appropriate for an internal ops tool with active navigation, not a live monitoring screen | No live-updating view; staff must revisit/refresh a page to see the latest state |

---

## 17. Common Failure Modes & Fixes

These map to real issues fixed in the hotel dashboard build and are worth calling out explicitly since they recur in any agent+dashboard integration:

- **Ghost bookings** — dashboard counting *all* rows including ones with null/invalid dates. Fix: every read filters on `status = 'active' AND` valid dates, consistently, via one shared query layer.
- **Missing occupancy visibility** — no way to see "how many rooms are occupied right now" distinct from total bookings. Fix: derive `occupiedRooms` directly from active bookings/rooms state, surfaced as its own metric.
- **Checkout not freeing rooms** — no mechanism to release a room once a guest leaves. Fix: an explicit checkout action (`DELETE /api/bookings`) that flips status and conditionally frees the room.
- **Dashboard/bookings-page mismatch** — two pages showing different numbers because they queried differently. Fix: force every surface through the same `status='active'` filtered query functions.
- **Empty rooms/settings on first load** — nothing to display before any manual setup. Fix: auto-populate sensible defaults on first access instead of requiring a seed step.
- **Settings not surviving a restart** — no persistence layer originally. Fix: settings now read/write the same DB as everything else, so they survive restarts and are editable from the UI.

The pattern behind all of these: **agent-produced state and dashboard-displayed state drift apart whenever there's more than one code path reading or writing it.** The fix is always the same shape — collapse to one shared, filtered, status-aware source of truth.

The outbound campaign dashboard adds one more class of failure worth naming explicitly:

- **Contacts stuck in `pending` forever** — if `follow_up_attempts` isn't incremented correctly on every non-terminal outcome (`no_answer`, `busy`), or `max_follow_up_attempts` isn't checked before scheduling another call, contacts can accumulate indefinitely without ever reaching a terminal status. Fix: the outcome-to-status mapping and attempt-counting logic lives in exactly one place (the `POST /api/calls` handler), so there's a single spot to audit rather than logic duplicated across an agent process and a dashboard.

---

## 18. Summary Table — Four Integration Modes

| Mode | Used for | Frontend's job | Agent's job | Contract between them |
|---|---|---|---|---|
| **A — Voice room dispatch** | Real-time voice conversations | Mint token, embed dispatch, render call UI (captions, visualizer, mic toggle) | Register under `agentName`, join room, run STT/TTS/LLM/VAD | LiveKit project + exact `agentName` string |
| **B — Direct API chat** | Text assistant with same knowledge as voice | Call LLM API server-side with a secret key, define tool schemas, resolve tool calls, stream reply | N/A — persona/tool logic lives inside the frontend's own serverless route | Ported knowledge base kept in sync by hand |
| **C — Shared-DB dashboard** | Operational visibility into and control of agent behavior | Query + render DB state (ISR or fresh-per-visit), expose settings UI as a control panel | Read config / write outcomes to the same DB as it works | Database schema + disciplined status fields |
| **D — Outbound orchestration** | Frontend-driven, agent-executed calling at scale | Own campaign config, ingest contact lists (with flexible metadata), track lifecycle state, log outcomes | Read the DB as a work queue (who/when/context to call), write outcomes back via one authoritative API route | Database schema + calling-window/attempt rules + a single outcome→status mapping |

A single product commonly combines two or three of these: the Library kiosk uses A + B; the Hotel dashboard uses A + C; the Outbound Campaign dashboard uses A + C + D.

---

## 19. Checklist for Wiring a New Agent Into a Frontend

- [ ] Decide which mode(s) apply: real-time voice (A), stateless chat (B), operational dashboard (C), outbound orchestration (D) — most real products need more than one
- [ ] Keep the agent as a separate, independently deployable, independently restartable process — never fold its runtime into the frontend's serverless functions
- [ ] For voice: mint short-lived, room-scoped tokens server-side; embed agent dispatch in the token so joining and inviting happen atomically; never send `API_SECRET` to the browser
- [ ] For chat: call the LLM provider directly from a server-side route with a server-only key; never expose that key to the client
- [ ] If both voice and chat exist, pick one canonical knowledge/tool source and port deliberately to the other runtime — document the sync obligation explicitly so it isn't forgotten on the next change
- [ ] If the agent produces operational state (bookings, tickets, orders), put a shared database between agent and dashboard instead of a direct API call between them, and route every read through one shared, filtered query layer (avoid ad hoc queries scattered across routes)
- [ ] Use explicit status fields (`active` / `checked_out` / `cancelled`, or equivalent) rather than inferring state from presence/absence of rows
- [ ] Auto-create sensible defaults (tables, settings, seed rows) on first access to avoid a manual setup step, but plan an explicit path for schema changes later
- [ ] Decide on a staleness tolerance and pick the cheapest infra that meets it — ISR/polling is often sufficient; reach for sockets only if the staleness window is genuinely unacceptable
- [ ] Document the exact contract needed for independent deployability: agent name string, LiveKit/project identifiers, env var list with client/server boundary marked, DB schema — so frontend and agent teams can each ship without waiting on the other
- [ ] If the frontend drives outbound work (campaigns, batch jobs), make the database the agent's work queue, give every "what should happen next" rule (calling windows, retry/follow-up limits) an explicit column rather than implicit logic, and fold variable-shape input data into a JSONB/metadata field instead of forcing a migration per new field
- [ ] Route every state-transition write (e.g. "call outcome changes contact status") through exactly one API handler, so the mapping logic is auditable in a single place instead of duplicated across dashboard and agent

---

## 20. Glossary

- **Agent worker** — the long-running process that actually runs the AI pipeline (STT, TTS, LLM, VAD for voice; or business logic for an autonomous agent). Deployed and scaled independently of the frontend.
- **Dispatch** — the LiveKit mechanism by which a registered agent worker is automatically invited into a room, triggered by metadata embedded in the room's access token.
- **`agentName`** — the string identifier that ties a token's dispatch instruction to a specific registered agent worker. The entire contract between frontend and agent for voice integration.
- **ISR (Incremental Static Regeneration)** — a Next.js rendering mode that serves a cached page and regenerates it in the background after a set interval (10 seconds in the hotel dashboard), giving near-real-time data without a live socket connection.
- **Status field** — an explicit column (`status`, `availability`) used to represent current state, filtered on consistently across every read path, rather than inferring state from row presence or other side effects.
- **Knowledge port** — a deliberate, manually-maintained duplication of a knowledge base or tool schema across two runtimes/languages (e.g. Python agent, TypeScript frontend) that can't share code directly.
- **Work queue (outbound context)** — the set of `pending` contacts, filtered by campaign rules (calling window, follow-up delay, attempt limits), that an outbound agent/orchestrator reads from the shared database to decide who to call next. The dashboard authors this queue; the agent consumes it.
- **Outcome→status mapping** — the single authoritative piece of logic (in the outbound system, inside the `POST /api/calls` handler) that translates a call's terminal result (`answered`, `no_answer`, etc.) into the contact's next lifecycle status. Kept in exactly one place to avoid drift between what the agent believes happened and what the dashboard displays.
