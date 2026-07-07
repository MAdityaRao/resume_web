"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SignalDivider from "./SignalDivider";
import Waveform from "./Waveform";
import { useAgentSession } from "@/lib/useAgentSession";

export default function AgentConsole() {
  const {
    status,
    errorMessage,
    transcript,
    agentSpeaking,
    connect,
    disconnect,
    sendChatMessage,
    getLevels,
  } = useAgentSession();

  const [draft, setDraft] = useState("");
  const live = status === "live";

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    const ok = await sendChatMessage(draft.trim());
    if (ok) setDraft("");
  }

  return (
    <section id="agent" className="px-6 py-24 border-b border-border">
      <div className="mx-auto max-w-6xl">
        <SignalDivider code="SIG_04" label="Live agent" />

        <div className="border border-border rounded-2xl bg-panel overflow-hidden">
          <div className="p-7 border-b border-border">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display text-xl text-ink">Ask about Aditya</h3>
                <p className="text-muted text-sm mt-1 max-w-xl">
                  Press the mic to join, then talk or type in the same conversation. The agent
                  answers from this resume and can take a job description mid-call, spoken or typed.
                </p>
              </div>
              <StatusPill status={status} />
            </div>

            <Waveform mode="live" getLevels={getLevels} active={live} height={110} />

            <div className="flex items-center gap-3 mt-5">
              {!live ? (
                <button
                  onClick={connect}
                  disabled={status === "connecting"}
                  className="focus-ring flex items-center gap-3 bg-ink text-bg font-mono text-sm px-6 py-3 rounded-full hover:bg-cyan transition-colors disabled:opacity-50"
                >
                  <MicIcon />
                  {status === "connecting" ? "Connecting…" : "Join and start talking"}
                </button>
              ) : (
                <button
                  onClick={disconnect}
                  className="focus-ring flex items-center gap-3 border border-border text-ink font-mono text-sm px-6 py-3 rounded-full hover:border-amber transition-colors"
                >
                  <span className="h-2 w-2 rounded-full bg-amber" />
                  Leave
                </button>
              )}
              {live && (
                <span className="font-mono text-xs text-faint">
                  {agentSpeaking ? "agent is speaking" : "mic is live, or type below"}
                </span>
              )}
            </div>

            {errorMessage && (
              <p className="font-mono text-xs text-amber mt-4">{errorMessage}</p>
            )}
          </div>

          <div className="p-7">
            <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-muted mb-4">
              Conversation
            </h3>
            <div className="transcript-scroll min-h-[220px] max-h-[420px] overflow-y-auto space-y-3 pr-1 mb-5">
              {transcript.length === 0 && (
                <p className="text-faint text-sm">
                  Nothing here yet. Join the room and start speaking, or send a message below
                  once you&apos;re in.
                </p>
              )}
              {transcript.map((line) => (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                    line.from === "you"
                      ? "ml-auto bg-elevated border border-cyan-dim text-ink"
                      : "bg-elevated border border-amber-dim text-ink"
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider text-faint block mb-1">
                    {line.from === "you" ? "You" : "Agent"}
                  </span>
                  {line.text}
                </motion.div>
              ))}
            </div>

            <form onSubmit={handleSend} className="flex items-end gap-3">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder={
                  live
                    ? "Type a message, or paste a job description to tailor the interview…"
                    : "Join the room above to start typing"
                }
                disabled={!live}
                rows={2}
                className="focus-ring flex-1 bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-faint resize-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!live || !draft.trim()}
                className="focus-ring font-mono text-xs px-5 py-3 rounded-full border border-border text-ink hover:border-cyan transition-colors disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  const label =
    status === "live"
      ? "LIVE"
      : status === "connecting"
      ? "CONNECTING"
      : status === "error"
      ? "ERROR"
      : "IDLE";
  const color =
    status === "live" ? "text-cyan" : status === "error" ? "text-amber" : "text-faint";
  return (
    <span className={`font-mono text-[11px] tracking-wider ${color} border border-border rounded-full px-3 py-1`}>
      {label}
    </span>
  );
}

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M19 11a7 7 0 0 1-14 0M12 19v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
