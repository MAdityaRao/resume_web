# Aditya — Portfolio

Next.js 14 portfolio site with a live voice agent section. The agent runs on LiveKit Cloud
(explicit dispatch, agent_name `Aditya_Agent`) and is not part of this repository. This repo
is the frontend only.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, livekit-client, livekit-server-sdk.

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local` with three values only, nothing else is required:

```
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
```

```bash
npm run dev
```

## How the agent connection works

`app/api/token/route.ts` is a serverless route. On each call it generates a random room name
and participant identity, builds an access token with the three env vars above, and attaches
a `RoomConfiguration` with explicit agent dispatch for `Aditya_Agent`. It does not open a
persistent connection and holds no state between requests.

The client (`lib/useAgentSession.ts`) fetches that token, connects directly to
`LIVEKIT_URL` with `livekit-client`, publishes the visitor's microphone, and subscribes to the
agent's audio track. Two `AnalyserNode`s (one on the local mic track, one on the agent's
track) drive the live waveform in `components/Waveform.tsx`.

Typed messages are sent with `room.localParticipant.sendText(text, { topic: "lk.chat" })`.
LiveKit Agents watches this topic by default and treats incoming text the same way as
speech: it interrupts the agent's current turn and responds to it, whether the user spoke
or typed. Pasting a job description into the box works the same way, since it is just text
on `lk.chat`. Live captions for both sides come from the `lk.transcription` topic that
LiveKit Agents forwards automatically.

## Known limitations

- **Transcript captions depend on the deployed agent forwarding `lk.transcription`.** This is
  LiveKit Agents' default behavior, but if the agent's `AgentSession` has this disabled, the
  caption panel will show fewer lines than the actual spoken conversation. This does not
  affect audio, only the caption panel.
- **Typed input depends on `text_input` being enabled on the agent.** It is enabled by default
  in LiveKit Agents, but if the deployed agent explicitly sets `text_input=False` in its
  `RoomInputOptions`, typed messages will be delivered but ignored by the agent.
- **No fallback if the LiveKit Cloud agent is offline.** If `Aditya_Agent` is not deployed or
  its dispatch name changes, the call will connect to a room with no agent in it and the
  visitor will hear silence. The `AGENT_NAME` constant in `app/api/token/route.ts` must match
  the agent's registered `agent_name` exactly.
- **Mobile Safari autoplay.** The agent's audio element is created and attached
  programmatically; on some iOS Safari versions this requires the mic button tap to be the
  same user gesture that triggers `connect()`, which is already how the button is wired, but
  worth testing on an actual device before shipping to a client.

## Structure

```
app/
  api/token/route.ts   serverless token + agent dispatch
  layout.tsx
  page.tsx
  globals.css
components/
  Nav.tsx  Hero.tsx  About.tsx  Projects.tsx  Skills.tsx
  AgentConsole.tsx     the voice + chat interface
  Waveform.tsx         shared canvas signal visual (ambient + live modes)
  SignalDivider.tsx  Contact.tsx  Footer.tsx
lib/
  content.ts           all resume/GitHub content, edit here to update copy
  useAgentSession.ts    LiveKit room connection, analysers, transcript, JD channel
public/
  aditya.jpg
```
