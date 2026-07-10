# NITK Library Voice Agent

A voice agent for the Central Library at NITK Surathkal. It runs on a robot placed at the library entrance and helps students, faculty, and researchers find research papers, journals, and library resources, locate physical sections, and get answers about library services and hours.

This is a demo project, not a production deployment.

## What it does

The agent, named Ritu, talks to a user through voice, understands what they're looking for, and responds out loud. It can:

- Recommend the right academic databases for a topic (engineering, chemistry, mathematics, business, and so on)
- Answer questions about library hours, floor layout, borrowing, fines, remote access, theses, plagiarism checking, and other services
- Direct users to the physical section of the library they need
- Point users to the OPAC catalogue for finding specific physical books

## How it works

The agent runs on LiveKit Agents and is deployed alongside a Next.js frontend. A user opens the frontend, the browser joins a LiveKit room, and the Python agent worker joins the same room to handle the conversation.

Speech pipeline:

1. **Speech to text**: Sarvam STT (`saaras:v3`), tuned for English with high VAD sensitivity
2. **Language model**: DeepSeek Chat, used to decide what to say and which tools to call
3. **Text to speech**: Sarvam TTS (`bulbul:v3`, voice "simran")
4. **Voice activity detection**: Silero VAD, loaded once at worker startup to avoid cold starts

The agent has two tools backed by a static knowledge base (no live API calls, so the demo stays reliable):

- `search_databases(subject)` — matches a subject to the right academic databases
- `get_library_info(topic)` — answers questions about hours, floors, services, and facilities

## Project structure

```
agent.py     LiveKit agent server, session setup, entrypoint
persona.py   System prompt and voice/behavior rules for Ritu
tools.py     Static knowledge base and the two function tools
```

## Setup

### Prerequisites

- Python 3.10 or later
- `uv` for running the project
- A LiveKit Cloud project (or self-hosted LiveKit server)
- A Sarvam AI API key
- A DeepSeek API key

### Environment variables

Create a `.env` file in the project root:

```
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
SARVAM_API_KEY=
DEEPSEEK_API_KEY=
```

### Install dependencies

```bash
uv sync
```

## Running locally

Test the agent in the terminal without a browser or frontend:

```bash
uv run agent.py console
```

This starts a console session where you can talk to the agent directly through your microphone.

## Running with the frontend

The agent is meant to be paired with a Next.js frontend that creates a LiveKit room and dispatches a job to this agent by name. The agent name is set in `agent.py`:

```python
AGENT_NAME = "nitk-library-agent"
```

This must match the agent name used when the frontend requests a room and dispatch token, otherwise the worker will never receive the job.

To run the worker so it's ready to accept jobs from the frontend:

```bash
uv run agent.py start
```

## Notes on the demo setup

- The knowledge base in `tools.py` is static, sourced from the NITK library website as of June 2026. It does not call any live library API, which keeps the demo predictable but means it will go stale if the library changes its hours, databases, or services.
- Warmup rooms (room names starting with `warmup-`) are used by LiveKit Cloud to keep the worker process hot. The agent detects these and returns immediately without starting a real session.
- The greeting is currently triggered from `on_enter` on the agent. If the greeting plays before the user's audio track is fully subscribed in the browser, move the greeting call into the `entrypoint` function, after `ctx.connect()` and after waiting for the participant to fully join.

## License

Internal demo project. Not licensed for external use.