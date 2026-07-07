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
} from "livekit-client";

export type SessionStatus = "idle" | "connecting" | "live" | "ended" | "error";

export type TranscriptLine = {
  id: string;
  from: "you" | "agent";
  text: string;
  ts: number;
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

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
    setTranscript((prev) => [
      ...prev,
      { id: uid(), from, text: text.trim(), ts: Date.now() },
    ]);
  }, []);

  const connect = useCallback(async () => {
    if (roomRef.current) return;
    setErrorMessage(null);
    setStatus("connecting");

    try {
      const res = await fetch("/api/token", { method: "POST" });
      if (!res.ok) throw new Error("Could not reach the agent right now.");
      const { serverUrl, token } = await res.json();

      const room = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = room;

      room.on(
        RoomEvent.TrackSubscribed,
        (track: RemoteTrack, _pub: RemoteTrackPublication, participant: RemoteParticipant) => {
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

      room.on(RoomEvent.Disconnected, () => {
        setStatus("ended");
        roomRef.current = null;
      });

      room.registerTextStreamHandler(
        "lk.transcription",
        async (reader, participantInfo) => {
          try {
            const text = await reader.readAll();
            const isLocal = participantInfo.identity === room.localParticipant.identity;
            pushLine(isLocal ? "you" : "agent", text);
          } catch {
            // best-effort live captioning; a missed segment doesn't break the call
          }
        }
      );

      await room.connect(serverUrl, token);
      await room.localParticipant.setMicrophoneEnabled(true);

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

      setStatus("live");
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : "Could not start the call. Check mic permissions and try again."
      );
      setStatus("error");
      roomRef.current?.disconnect();
      roomRef.current = null;
    }
  }, [pushLine]);

  const disconnect = useCallback(() => {
    roomRef.current?.disconnect();
    roomRef.current = null;
    audioElRef.current?.remove();
    audioElRef.current = null;
    localAnalyserRef.current?.cleanup();
    remoteAnalyserRef.current?.cleanup();
    localAnalyserRef.current = null;
    remoteAnalyserRef.current = null;
    setAgentSpeaking(false);
    setStatus("ended");
  }, []);

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

  const getLevels = useCallback(() => {
    const read = (wrapper: { analyser: AnalyserNode } | null) => {
      if (!wrapper) return null;
      const data = new Uint8Array(wrapper.analyser.frequencyBinCount);
      wrapper.analyser.getByteTimeDomainData(data);
      return data;
    };
    return {
      local: read(localAnalyserRef.current),
      remote: read(remoteAnalyserRef.current),
    };
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
