import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { RoomAgentDispatch, RoomConfiguration } from "@livekit/protocol";

export const dynamic = "force-dynamic";

// The room's agent must match the agent_name registered by @server.rtc_session
// on the deployed LiveKit Cloud agent (see agent.py: agent_name="Aditya_Agent").
const AGENT_NAME = "Aditya_Agent";

export async function POST() {
  const url = process.env.LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!url || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Server is missing LiveKit credentials." },
      { status: 500 }
    );
  }

  const identity = `visitor-${Math.random().toString(36).slice(2, 10)}`;
  const roomName = `portfolio-${Math.random().toString(36).slice(2, 10)}`;

  const at = new AccessToken(apiKey, apiSecret, {
    identity,
    ttl: "10m",
  });

  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  at.roomConfig = new RoomConfiguration({
    agents: [new RoomAgentDispatch({ agentName: AGENT_NAME })],
  });

  const token = await at.toJwt();

  return NextResponse.json({ serverUrl: url, token });
}
