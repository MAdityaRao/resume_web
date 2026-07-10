# PRD: Outbound AI Sales Agent — Demo

**Status:** Draft  
**Author:** Aditya  
**Version:** 1.0  
**Last Updated:** June 2026  

---

## 1. Executive Summary

This product is a demo-grade outbound AI voice sales agent that dials contacts from a PostgreSQL database using LiveKit's SIP infrastructure and Plivo phone numbers. When a contact answers, a fully autonomous conversational agent — powered by GPT-4o-mini with Sarvam STT/TTS for Indian-English — conducts a natural sales conversation, handles objections, and logs outcomes back to the database.

The demo exists to prove end-to-end viability of the architecture: DB → orchestrator → SIP dial → voice conversation → outcome recording. It is not yet a production system. There is no web UI, no campaign management console, and no scheduling engine — those are explicitly future scope.

The immediate goal is a reliable, observable, single-operator demo that can be run from the terminal, place real calls, and show a stakeholder the full loop working.

---

## 2. Problem Statement

Sales teams making outbound calls at scale face three problems: cost (human agents), consistency (pitch quality varies), and throughput (one call at a time per agent). An AI voice agent can call multiple contacts in parallel, deliver a consistent pitch, handle common objections, and hand off genuinely interested leads — all at a fraction of the cost.

For this demo, the problem is narrower: **can we build a working proof-of-concept that places a real call, runs a real conversation, and records a structured outcome?** If yes, the architecture is proven and the product can be iterated toward production.

---

## 3. Goals & Objectives

| # | Goal | Measure |
|---|------|---------|
| G1 | Place a real outbound call to a contact from the DB | Call connects, agent speaks opening line |
| G2 | Conduct a natural, multi-turn sales conversation | Contact can respond; agent handles at least 3 turns without breaking |
| G3 | Record a structured outcome per call | `calls` table row inserted with outcome, transcript, notes |
| G4 | Support multiple contacts via an orchestrator | 2+ contacts dialled in sequence from a seeded DB |
| G5 | Operate from a single terminal with clear logs | No silent failures; every step logged with context |

---

## 4. User Personas

### 4.1 Demo Operator (Primary)
- **Who:** Aditya (developer / founder)
- **Context:** Running a terminal session; wants to seed contacts, start the agent worker, trigger the orchestrator, and watch calls complete
- **Needs:** Clear setup instructions, predictable env var names, actionable error messages, visible logs

### 4.2 Demo Audience (Secondary)
- **Who:** Potential client or investor watching a live or recorded demo
- **Context:** Listens to or participates in a test call
- **Needs:** Natural-sounding agent, coherent conversation, visible outcome in the DB afterward

### 4.3 Contact (End-User)
- **Who:** A person whose phone rings
- **Context:** Receives an unexpected outbound sales call
- **Needs:** Clear identity of caller, polite tone, ability to end the call at any time

---

## 5. Functional Requirements

### 5.1 Contact Management

| ID | Requirement |
|----|-------------|
| F1 | System reads contacts from a `contacts` table with at minimum: `id`, `name`, `phone`, `status` |
| F2 | Contacts have a `status` field: `pending`, `follow_up`, `converted`, `discarded` |
| F3 | Only contacts with `status = 'pending'` or due `follow_up` are dialled |
| F4 | Phone numbers are normalised to E.164 format before dialling (10-digit Indian numbers auto-prefixed `+91`) |

### 5.2 Campaign Configuration

| ID | Requirement |
|----|-------------|
| F5 | A `campaigns` table stores: `id`, `name`, `metadata` (JSON), `max_follow_up_attempts`, `follow_up_delay_hours` |
| F6 | Campaign `metadata` contains: `agent_name`, `product_name`, `product_desc`, `talking_points[]` |
| F7 | The agent's system prompt is dynamically built per call from contact + campaign data |

### 5.3 Outbound Dialling

| ID | Requirement |
|----|-------------|
| F8 | Each call creates a unique LiveKit room named `outbound-{contact_id}` |
| F9 | Room metadata contains the full `contact` and `campaign` JSON so the agent has context without a DB query |
| F10 | The agent worker (`outbound-agent`) is dispatched into the room before the SIP dial is placed |
| F11 | The SIP participant is created using `wait_until_answered=True` — the orchestrator blocks until the call is picked up or times out |
| F12 | SIP timeout is 60 seconds; unanswered calls are logged and the contact remains `pending` |

### 5.4 Voice Agent Behaviour

| ID | Requirement |
|----|-------------|
| F13 | Agent speaks the opening line immediately on call connect — no waiting for the contact to speak first |
| F14 | Opening includes: agent name, company name, reason for calling, soft permission question — all in ≤ 2 sentences |
| F15 | Agent asks one question per turn |
| F16 | Agent handles three objection types: busy, not interested, interested |
| F17 | If contact is busy: agent acknowledges and closes politely |
| F18 | If contact is not interested: agent asks once for reason, then closes |
| F19 | If contact is interested: agent qualifies and moves toward a concrete next step |
| F20 | Agent never fabricates product details beyond what is in campaign metadata |
| F21 | Agent matches contact's language if they switch to Hindi or mix languages |

### 5.5 Outcome Recording

| ID | Requirement |
|----|-------------|
| F22 | At call end, the `record_outcome` tool is called with: `outcome`, `notes`, `transcript` |
| F23 | Valid outcomes: `answered`, `no_answer`, `voicemail`, `follow_up`, `converted`, `failed` |
| F24 | Outcome is written to the `calls` table |
| F25 | Contact `status` in the `contacts` table is updated based on outcome mapping |
| F26 | If outcome is `follow_up` and `max_follow_up_attempts` is reached, outcome is overridden to `failed` and contact is discarded |
| F27 | `follow_up_at` timestamp is set on the `contacts` row when a follow-up is scheduled |

### 5.6 Test Dialler

| ID | Requirement |
|----|-------------|
| F28 | `testd.py` supports a single hardcoded contact + campaign for quick end-to-end tests |
| F29 | `--dry-run` flag validates env vars and prints config without placing a call |
| F30 | Clear checklist printed on dial failure (Plivo balance, DND, SIP trunk credentials) |

---

## 6. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NF1 | Call setup latency (room create → agent dispatch → SIP dial) < 5 seconds |
| NF2 | Agent first-word latency after call connect < 2 seconds |
| NF3 | DB connection pool: min 2, max 10 connections; query timeout 5 seconds |
| NF4 | All errors logged with room name, contact ID, and a human-readable cause |
| NF5 | No call should silently succeed without a row in the `calls` table |
| NF6 | System must work on a single Linux machine with Python 3.11+ and outbound internet access |

---

## 7. System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Operator Terminal                      │
│   python orchestrator.py  │  python agent.py start       │
└────────────┬──────────────┴────────────────┬─────────────┘
             │                               │
             ▼                               ▼
   ┌─────────────────┐             ┌──────────────────────┐
   │  orchestrator.py │             │   agent.py (Worker)  │
   │  - reads DB      │             │   - registers with   │
   │  - calls sip.py  │             │     LiveKit as       │
   └────────┬────────┘             │     "outbound-agent" │
            │                      └──────────┬───────────┘
            ▼                                 │
   ┌─────────────────┐   dispatch             │
   │    sip.py        │ ─────────────────────▶│
   │  1. create room  │                        │
   │  2. dispatch agent                        ▼
   │  3. SIP dial     │             ┌──────────────────────┐
   └────────┬────────┘             │  LiveKit Room         │
            │                      │  metadata: contact    │
            ▼                      │           campaign    │
   ┌─────────────────┐             └──────────┬───────────┘
   │  Plivo / SIP     │                        │
   │  Trunk           │  SIP participant joins │
   │  (outbound call) │ ──────────────────────▶│
   └─────────────────┘             ┌──────────▼───────────┐
                                   │  AgentSession         │
             ┌──────────────────── │  STT: Sarvam saaras:v3│
             │                     │  LLM: GPT-4o-mini     │
             ▼                     │  TTS: Sarvam bulbul:v3│
   ┌─────────────────┐             │  VAD: Silero          │
   │  outcome.py      │◀────────── │  Tools: record_outcome│
   │  - writes calls  │  tool call  └──────────────────────┘
   │  - updates status│
   └─────────────────┘
             │
             ▼
   ┌─────────────────┐
   │  PostgreSQL DB   │
   │  contacts        │
   │  campaigns       │
   │  calls           │
   └─────────────────┘
```

### 7.1 Key Components

| File | Role |
|------|------|
| `orchestrator.py` | Reads pending contacts from DB; drives the dial loop |
| `agent.py` | LiveKit Worker; handles both inbound and outbound rooms |
| `sip.py` | Creates room, dispatches agent, places SIP call |
| `persona.py` | Builds dynamic system prompt from contact + campaign |
| `outcome.py` | `record_outcome` function tool; writes to DB |
| `db.py` | asyncpg connection pool; shared across modules |
| `regulations.py` | `get_policy` tool (hotel-specific; reusable pattern for any FAQ) |
| `escalate.py` | `escalate_to_supervisor` tool; writes escalation flag to room metadata |
| `testd.py` | Single-number test dialler; no DB required |
| `join_room.py` | Generates a LiveKit Meet URL so a human can listen in on any room |

---

## 8. Data Model

### `contacts`
```sql
id                  SERIAL PRIMARY KEY
name                TEXT NOT NULL
phone               TEXT NOT NULL
status              TEXT DEFAULT 'pending'   -- pending | follow_up | converted | discarded
follow_up_at        TIMESTAMPTZ
follow_up_attempts  INT DEFAULT 0
campaign_id         INT REFERENCES campaigns(id)
```

### `campaigns`
```sql
id                      SERIAL PRIMARY KEY
name                    TEXT NOT NULL
metadata                JSONB            -- agent_name, product_name, product_desc, talking_points
max_follow_up_attempts  INT DEFAULT 3
follow_up_delay_hours   INT DEFAULT 24
```

### `calls`
```sql
id                  SERIAL PRIMARY KEY
contact_id          INT REFERENCES contacts(id)
started_at          TIMESTAMPTZ
ended_at            TIMESTAMPTZ
outcome             TEXT   -- answered | no_answer | voicemail | follow_up | converted | failed
transcript          TEXT
livekit_room_name   TEXT
agent_notes         TEXT
```

---

## 9. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `LIVEKIT_URL` | Yes | LiveKit server WebSocket URL |
| `LIVEKIT_API_KEY` | Yes | LiveKit API key |
| `LIVEKIT_API_SECRET` | Yes | LiveKit API secret |
| `LIVEKIT_SIP_TRUNK_ID` | Yes | Outbound SIP trunk ID (must start with `ST_`) |
| `SARVAM_API_KEY` | Yes | Sarvam AI API key for STT and TTS |
| `DB_URL` | Yes | PostgreSQL connection string (asyncpg format) |
| `OPENAI_API_KEY` | Yes | OpenAI API key for GPT-4o-mini via LiveKit inference |

---

## 10. User Stories

### Epic 1: Place a Call

**US-01 — Dial a pending contact**
> As the orchestrator, I want to dial contacts with `status = 'pending'` so that the campaign reaches its target list.

Acceptance Criteria:
- Orchestrator queries DB for pending contacts filtered by campaign
- For each contact, `sip.py` creates a room, dispatches the agent, and places the SIP call
- If no pending contacts exist, orchestrator exits cleanly with a log message

**US-02 — Handle unanswered calls**
> As the system, I want to detect when a call is not answered within 60 seconds so that I can log the outcome and move to the next contact.

Acceptance Criteria:
- `wait_until_answered=True` raises `TwirpError` on timeout/rejection
- Contact status remains `pending` or is set to `no_answer` depending on outcome
- Next contact in queue is dialled without operator intervention

---

### Epic 2: Conduct the Conversation

**US-03 — Speak the opening line**
> As the agent, I want to speak immediately when the call connects so that the contact knows who is calling and why.

Acceptance Criteria:
- Agent speaks within 2 seconds of SIP participant joining
- Opening includes name, company, reason, permission question
- No waiting for contact to speak first

**US-04 — Handle "not interested" objection**
> As the agent, I want to acknowledge disinterest gracefully so that the contact ends the call feeling respected.

Acceptance Criteria:
- Agent asks once for reason ("may I ask what put you off?")
- If contact remains uninterested, agent closes with "Understood, have a great day"
- No further pitching after second refusal

**US-05 — Match contact's language**
> As the agent, I want to mirror the contact's language (Hindi / Hinglish / English) so the conversation feels natural.

Acceptance Criteria:
- If contact responds in Hindi, agent continues in Hindi
- Mixed-language responses are matched proportionally
- Agent never reverts to English-only after a language switch

---

### Epic 3: Record the Outcome

**US-06 — Record call outcome to DB**
> As the operator, I want every completed call to have a row in the `calls` table so that I can audit the campaign.

Acceptance Criteria:
- `record_outcome` tool is called before the call ends
- Row inserted with: `contact_id`, `outcome`, `transcript`, `agent_notes`, `started_at`, `ended_at`
- Contact `status` updated correctly per outcome mapping

**US-07 — Schedule follow-up**
> As the system, I want to set a `follow_up_at` timestamp when outcome is `follow_up` so that the contact is redialled at the right time.

Acceptance Criteria:
- `follow_up_at = NOW() + follow_up_delay_hours`
- `follow_up_attempts` incremented
- If `follow_up_attempts >= max_follow_up_attempts`, contact is discarded instead

---

## 11. Scope

### In Scope (Demo v1)
- Single-operator terminal-based demo
- Outbound calls to Indian mobile numbers via Plivo SIP trunk
- One campaign, N contacts from a seeded DB
- Dynamic system prompt per contact
- Outcome recording to PostgreSQL
- `testd.py` single-number test dialler
- `join_room.py` listener URL generator
- Inbound call handling (basic hotel receptionist fallback — already built)
- Escalation tool (already built, available if needed during demo)

### Out of Scope (Future)
- Web dashboard / campaign management UI
- Scheduling engine (cron-based follow-up dialler)
- Multi-tenant / multi-campaign parallel execution
- Real-time call monitoring UI
- Call recording storage (audio files)
- CRM integrations (Salesforce, HubSpot)
- WhatsApp / SMS follow-up after call
- Analytics dashboard (Grafana is partially built but not in demo scope)
- Voicemail detection (AMD)
- DND registry checking before dial

---

## 12. Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Call connect rate | > 80% of dialled numbers connect | `calls` rows where outcome ≠ `no_answer` / total dials |
| Agent first-word latency | < 2s after SIP join | Log timestamps in `agent.py` |
| Conversation coherence | 0 broken sessions in demo | Manual review of transcripts |
| Outcome recording rate | 100% of completed calls have a DB row | `calls` count vs rooms created |
| Demo run time (setup → first call) | < 10 minutes from fresh clone | Operator stopwatch |

---

## 13. Technical Considerations

### STT / TTS
- Sarvam `saaras:v3` (STT) and `bulbul:v3` (TTS) with speaker `priya` — tuned for Indian English
- Language set to `en-IN`; multilingual turn detection via `MultilingualModel`

### LLM
- `openai/gpt-4o-mini` via LiveKit inference proxy
- `max_tool_steps=1` — agent makes at most one tool call per turn to keep latency low

### Turn Detection
- VAD: Silero
- Endpointing: dynamic, 0.4–0.7s delay
- Interruption: enabled with false-interruption recovery (0.8s timeout)
- Preemptive TTS: enabled, max 5s speech segments

### SIP / Plivo
- Outbound trunk configured in LiveKit dashboard with Plivo SIP credentials
- `wait_until_answered=True` is critical — without it, the room is created but the agent speaks into silence
- Phone numbers normalised to E.164 in `sip.py` before every dial

### Database
- asyncpg pool: min 2, max 10, command timeout 5s
- All outcome writes are wrapped in a transaction (contact update + calls insert are atomic)

### Observability (Partial)
- LGTM stack (Loki, Grafana, Tempo, Prometheus) partially deployed
- OpenTelemetry tracing via `telemetry.py` (not in demo critical path)
- Fallback: all modules use Python `logging` with structured fields

---

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Plivo rejects call (DND, no balance) | Medium | High | `testd.py --dry-run` validates env; checklist printed on failure |
| Agent doesn't speak (no SIP participant) | Low | High | `SIP_ANSWER_TIMEOUT` = 60s; agent logs warning and exits cleanly |
| `record_outcome` tool not called (LLM skips it) | Medium | Medium | `on_called` callback in `outcome.py`; add fallback in shutdown hook |
| DB connection failure mid-call | Low | Medium | asyncpg pool with `command_timeout=5`; error logged, call still completes |
| LiveKit Tempo traces unstable | High | Low | Telemetry failures caught silently; don't break call flow |
| Contact speaks only Hindi | Medium | Medium | `MultilingualModel` + agent language-matching instruction in persona |

---

## 15. Dependencies & Assumptions

**Dependencies**
- LiveKit Cloud or self-hosted LiveKit server (SIP enabled)
- Plivo account with outbound SIP trunk configured in LiveKit
- Sarvam AI API access (`saaras:v3`, `bulbul:v3`)
- OpenAI API access (GPT-4o-mini)
- PostgreSQL 14+ instance with `contacts`, `campaigns`, `calls` tables

**Assumptions**
- Demo is run from a single machine by a single operator
- Contacts table is pre-seeded manually before the demo
- No concurrent campaigns in demo mode (orchestrator is single-threaded per run)
- Indian mobile numbers only for demo (E.164 normalisation assumes +91)
- Agent name "Priya" and Indian-English persona are appropriate for the demo audience

---

## 16. Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| OQ1 | Should `orchestrator.py` dial contacts sequentially or in parallel? Current assumption: sequential for demo simplicity. | Aditya | Before demo |
| OQ2 | What happens if the contact hangs up before `record_outcome` is called? Need a shutdown-hook fallback. | Aditya | Before demo |
| OQ3 | Is Tempo required for the demo, or can it be skipped given instability? | Aditya | Before demo |
| OQ4 | Should the demo use a real campaign from the DB, or is the hardcoded `testd.py` campaign sufficient? | Aditya | Before demo |
| OQ5 | What is the demo success criteria for the audience — a single successful call, or a full 3-contact loop? | Aditya | Before demo |

---

## 17. Milestones

| Milestone | Description | Status |
|-----------|-------------|--------|
| M1 | `testd.py` places a call, agent speaks, call completes | ✅ Done |
| M2 | Outcome recorded to DB after call | ✅ Done |
| M3 | Orchestrator dials 3 contacts in sequence from DB | 🔲 To Do |
| M4 | Follow-up scheduling and retry logic validated | 🔲 To Do |
| M5 | Demo run: stakeholder watches a full loop end-to-end | 🔲 To Do |