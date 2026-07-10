"use client";

import { useCallback, useRef, useState } from "react";
import {
  Room,
  RoomEvent,
  Track,
  createAudioAnalyser,
  RemoteTrack,
  RemoteAudioTrack,
  RemoteTrackPublication,
  RemoteParticipant,
  LocalAudioTrack,
  DefaultReconnectPolicy,
} from "livekit-client";

export type SessionStatus =
  | "idle"
  | "connecting"
  | "live"
  | "reconnecting"
  | "ended"
  | "error";

export type TranscriptLine = {
  id: string;
  from: "you" | "agent";
  text: string;
  ts: number;
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// College / campus wifi is frequently locked down to TCP 443 only —
// UDP media ports (50000-60000) and even UDP STUN (3478) are commonly
// blocked by the network's firewall or captive portal proxy. LiveKit
// Cloud runs a TURN server reachable over TLS on 443, so as long as
// outbound HTTPS works at all, a relayed connection can still succeed.
// We don't force iceTransportPolicy: "relay" upfront (that would add
// unnecessary latency on open networks) — instead we give ICE/WS more
// time to try every candidate type before giving up, and retry with a
// relay-only attempt if the first connect fails outright.
const CONNECT_OPTS = {
  autoSubscribe: true,
  peerConnectionTimeout: 30_000, // default 15s is too tight on slow/proxied campus networks
  websocketTimeout: 30_000,
  maxRetries: 4,
};

export function useAgentSession() {
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [agentSpeaking, setAgentSpeaking] = useState(false);

  const roomRef = useRef<Room | null>(null);
  const localAnalyserRef = useRef<{ analyser: AnalyserNode; cleanup: () => void } | null>(null);
  const remoteAnalyserRef = useRef<{ analyser: AnalyserNode; cleanup: () => void } | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const pushLine = useCallback((from: "you" | "agent", text: string) => {
    if (!text || !text.trim()) return;
    setTranscript((prev) => [...prev, { id: uid(), from, text: text.trim(), ts: Date.now() }]);
  }, []);

  const cleanupMedia = useCallback(() => {
    audioElRef.current?.remove();
    audioElRef.current = null;
    localAnalyserRef.current?.cleanup();
    remoteAnalyserRef.current?.cleanup();
    localAnalyserRef.current = null;
    remoteAnalyserRef.current = null;
  }, []);

  const attachRoomListeners = useCallback(
    (room: Room) => {
      room.on(
        RoomEvent.TrackSubscribed,
        (track: RemoteTrack, _pub: RemoteTrackPublication, _participant: RemoteParticipant) => {
          if (track.kind === Track.Kind.Audio) {
            const el = track.attach();
            el.autoplay = true;
            audioElRef.current = el;
            document.body.appendChild(el);

            try {
              remoteAnalyserRef.current = createAudioAnalyser(track as RemoteAudioTrack, {
                fftSize: 512,
                smoothingTimeConstant: 0.75,
              });
            } catch {
              // analyser is a visual nicety only — call still works without it
            }
          }
        }
      );

      room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        setAgentSpeaking(speakers.some((s) => !s.isLocal));
      });

      // Fires when the network drops a candidate and LiveKit is retrying
      // (very common on flaky campus wifi mid-call). Surface this instead
      // of letting the UI look frozen/dead.
      room.on(RoomEvent.Reconnecting, () => {
        setStatus("reconnecting");
      });

      room.on(RoomEvent.Reconnected, () => {
        setStatus("live");
      });

      room.on(RoomEvent.Disconnected, (reason) => {
        cleanupMedia();
        roomRef.current = null;
        setAgentSpeaking(false);
        // 1 === DisconnectReason.CLIENT_INITIATED (the user pressed "End").
        // Anything else (server drop, timeout, migration) is treated as an
        // unexpected disconnect, which matters most on flaky campus wifi.
        if (reason !== undefined && reason !== 1) {
          setErrorMessage("Connection dropped — your network may be blocking part of the call.");
          setStatus("error");
        } else {
          setStatus("ended");
        }
      });

      room.registerTextStreamHandler("lk.transcription", async (reader, participantInfo) => {
        try {
          const text = await reader.readAll();
          const isLocal = participantInfo.identity === room.localParticipant.identity;
          pushLine(isLocal ? "you" : "agent", text);
        } catch {
          // best-effort live captioning; a missed segment doesn't break the call
        }
      });
    },
    [cleanupMedia, pushLine]
  );

  const attachMicAnalyser = useCallback(async (room: Room) => {
    const micPub = room.localParticipant.getTrackPublication(Track.Source.Microphone);
    if (micPub?.track) {
      try {
        localAnalyserRef.current = createAudioAnalyser(micPub.track as LocalAudioTrack, {
          fftSize: 512,
          smoothingTimeConstant: 0.75,
        });
      } catch {
        // analyser is a visual nicety only
      }
    }
  }, []);

  // Attempts a normal connect first (fastest on open networks). If that
  // fails, retries once forcing TURN-over-TLS relay only — this is the
  // path that gets through firewalls which block direct UDP/STUN but
  // allow standard HTTPS (443), which is the common case on college wifi.
  const connectWithFallback = useCallback(
    async (serverUrl: string, token: string) => {
      const primary = new Room({
        adaptiveStream: true,
        dynacast: true,
        reconnectPolicy: new DefaultReconnectPolicy(),
      });

      try {
        await primary.connect(serverUrl, token, CONNECT_OPTS);
        return primary;
      } catch (err) {
        console.warn("Direct connect failed, retrying via TURN/TLS relay…", err);
        try {
          primary.disconnect();
        } catch {
          // ignore
        }

        const relayRoom = new Room({
          adaptiveStream: true,
          dynacast: true,
          reconnectPolicy: new DefaultReconnectPolicy(),
        });

        await relayRoom.connect(serverUrl, token, {
          ...CONNECT_OPTS,
          rtcConfig: {
            iceTransportPolicy: "relay" as RTCIceTransportPolicy,
          },
        });
        return relayRoom;
      }
    },
    []
  );

  const connect = useCallback(async () => {
    if (roomRef.current) return;
    setErrorMessage(null);
    setStatus("connecting");

    try {
      const res = await fetch("/api/token", { method: "POST" });
      if (!res.ok) throw new Error("Could not reach the agent right now.");
      const { serverUrl, token } = await res.json();

      const room = await connectWithFallback(serverUrl, token);
      roomRef.current = room;
      attachRoomListeners(room);

      await room.localParticipant.setMicrophoneEnabled(true);
      await attachMicAnalyser(room);

      setStatus("live");
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error
          ? /timeout|timed out/i.test(err.message)
            ? "Connection timed out — this network may be blocking the call. Try switching to mobile data or a different wifi."
            : err.message
          : "Could not start the call. Check mic permissions and try again.";
      setErrorMessage(message);
      setStatus("error");
      roomRef.current?.disconnect();
      roomRef.current = null;
    }
  }, [attachMicAnalyser, attachRoomListeners, connectWithFallback]);

  const disconnect = useCallback(() => {
    roomRef.current?.disconnect();
    roomRef.current = null;
    cleanupMedia();
    setAgentSpeaking(false);
    setStatus("ended");
  }, [cleanupMedia]);

  const sendChatMessage = useCallback(
    async (text: string) => {
      const room = roomRef.current;
      if (!room || status !== "live" || !text.trim()) return false;
      await room.localParticipant.sendText(text.trim(), { topic: "lk.chat" });
      pushLine("you", text.trim());
      return true;
    },
    [status, pushLine]
  );

  // Returns a flat array of normalized levels (0-1) for the UI's radial
  // spectrum, mixing local + remote so the orb animates for both sides
  // of the conversation. Consumers should treat this as best-effort.
  const getLevels = useCallback((): number[] => {
    const sample = (wrapper: { analyser: AnalyserNode } | null, bins: number) => {
      if (!wrapper) return null;
      const data = new Uint8Array(wrapper.analyser.frequencyBinCount);
      wrapper.analyser.getByteTimeDomainData(data);
      const step = Math.max(1, Math.floor(data.length / bins));
      const out: number[] = [];
      for (let i = 0; i < bins; i++) {
        const v = data[i * step] ?? 128;
        out.push(Math.min(1, Math.abs(v - 128) / 128));
      }
      return out;
    };

    const bins = 24;
    const local = sample(localAnalyserRef.current, bins);
    const remote = sample(remoteAnalyserRef.current, bins);

    if (!local && !remote) return [];
    if (!local) return remote as number[];
    if (!remote) return local;

    return local.map((v, i) => Math.max(v, remote[i]));
  }, []);

  return {
    status,
    errorMessage,
    transcript,
    agentSpeaking,
    connect,
    disconnect,
    sendChatMessage,
    getLevels,
  };
}