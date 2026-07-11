"use client";
import { Send, Mic, Square } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgentSession } from "@/lib/useAgentSession";

const SUGGESTED_QUESTIONS = [
  "Do you have experience with LLM agents like LangChain or LangGraph?",
  "Have you built real-time voice AI with LiveKit or WebRTC?",
  "Any experience with Python, FastAPI, and AWS deployment?",
  "Have you worked with PostgreSQL and backend data pipelines?",
];

function useElapsed(live: boolean) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!live) {
      setSeconds(0);
      return;
    }
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [live]);
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * Radial bar visualizer that wraps tightly around the mic button.
 * Bars sit just outside the button edge and extend outward with audio level.
 * viewBox is a fixed 0-200 square so it scales cleanly at any container size (mobile-safe).
 */
function RadialBars({ bars, live, reconnecting }: { bars: number[]; live: boolean; reconnecting: boolean }) {
  const center = 100;
  const innerRadius = 34;
  const maxBarLength = 54;
  const barCount = bars.length;
  const active = live || reconnecting;

  return (
    <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
      {bars.map((level, i) => {
        const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
        const clamped = Math.max(0.05, Math.min(1, level));
        const length = active ? 14 + clamped * maxBarLength : 8;
        const x1 = center + innerRadius * Math.cos(angle);
        const y1 = center + innerRadius * Math.sin(angle);
        const x2 = center + (innerRadius + length) * Math.cos(angle);
        const y2 = center + (innerRadius + length) * Math.sin(angle);
        return (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            animate={{ x2, y2 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            stroke="currentColor"
            strokeWidth={4}
            strokeLinecap="round"
            className={active ? "text-cyan" : "text-faint"}
            style={{ opacity: active ? 0.6 + clamped * 0.4 : 0.4 }}
          />
        );
      })}
    </svg>
  );
}

export default function AgentConsole() {
  const { status, transcript, connect, disconnect, sendChatMessage, getLevels, errorMessage } = useAgentSession();

  const [draft, setDraft] = useState("");
  const [bars, setBars] = useState<number[]>(Array(24).fill(0.05));
  const scrollRef = useRef<HTMLDivElement>(null);
  const live = status === "live";
  const connecting = status === "connecting";
  const reconnecting = status === "reconnecting";
  const active = live || reconnecting;
  const elapsed = useElapsed(live);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  // Poll audio levels into a tiny radial bar spectrum
  useEffect(() => {
    if (!live) {
      setBars(Array(24).fill(0.05));
      return;
    }
    let raf: number;
    const tick = () => {
      const levels = getLevels();

      if (levels.length) {
        setBars(levels);
      } else {
        setBars((prev) => prev.map(() => 0.15 + Math.random() * 0.5));
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, getLevels]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    const ok = await sendChatMessage(draft.trim());
    if (ok) setDraft("");
  }

  async function handleSuggestion(text: string) {
    if (!live) return;
    await sendChatMessage(text);
  }

  return (
    <section id="agent" className="px-6 py-24 agent-section relative">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Outer glow */}
          <div
            className={`absolute -inset-1 rounded-[2rem] -z-10 blur-2xl transition-opacity duration-700 ${
              live
                ? "opacity-70 bg-gradient-to-br from-cyan/30 via-transparent to-violet/30"
                : "opacity-25 bg-gradient-to-br from-faint/20 to-cyan/10"
            }`}
          />

          <div className="relative glass-strong rounded-[2rem] overflow-hidden agent-card w-full border border-border">
            {/* Header readout */}
            <div className="relative px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              <span>Voice Interface</span>
              <span
                className={
                  live
                    ? "text-cyan"
                    : reconnecting
                    ? "text-cyan animate-pulse"
                    : status === "error"
                    ? "text-coral"
                    : "text-faint"
                }
              >
                {live && `SESSION ${elapsed}`}
                {reconnecting && "RECONNECTING…"}
                {connecting && "CONNECTING…"}
                {status === "error" && "CONNECTION ISSUE"}
                {(status === "idle" || status === "ended") && "STANDBY"}
              </span>
            </div>

            {errorMessage && status === "error" && (
              <div className="mx-6 mb-2 -mt-2 px-3 py-2 rounded-lg bg-coral/10 border border-coral/20 text-coral text-xs font-mono">
                {errorMessage}
              </div>
            )}

            {/* Orb area */}
            <div className="relative flex flex-col items-center pt-5 pb-6 sm:pt-6 sm:pb-8 px-4">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center shrink-0">
                {/* Soft pulse ring behind bars when live */}
                {live && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-cyan/5"
                    animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.15, 0.5] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}

                {/* Radial waveform hugging the button */}
                <RadialBars bars={bars} live={live} reconnecting={reconnecting} />

                {/* Core connect/disconnect button — icon + label live inside the circle */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={live || reconnecting ? disconnect : connect}
                  disabled={connecting}
                  aria-label={live ? "Stop voice session" : "Start voice session"}
                  className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center gap-1 border transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                    live
                      ? "bg-cyan/10 border-cyan/30 text-cyan shadow-glow-cyan hover:border-coral/40 hover:text-coral"
                      : reconnecting
                      ? "bg-cyan/10 border-cyan/30 text-cyan"
                      : "bg-ink text-bg hover:bg-ink/90 border-ink"
                  }`}
                >
                  {live ? <Square size={20} /> : <Mic size={24} className="sm:hidden" />}
                  {!live && <Mic size={26} className="hidden sm:block" />}
                  <span className="font-mono text-[10px] uppercase tracking-widest">
                    {connecting ? "…" : live ? "Stop" : reconnecting ? "…" : "Start"}
                  </span>
                </motion.button>
              </div>

              <p className="mt-5 font-mono text-[11px] text-muted uppercase tracking-widest text-center px-4">
                {live && "Active — listening"}
                {reconnecting && "Reconnecting"}
                {connecting && "Connecting"}
                {status === "error" && "Try again"}
                {(status === "idle" || status === "ended") && "Tap start to begin"}
              </p>
            </div>

            {/* Transcript + suggestions — fixed 80/20 split so quick-asks never disappear */}
            <div className="relative flex flex-col h-64 sm:h-72 border-t border-border bg-elevated/40">
              {/* Chat area — ~80% */}
              <div
                ref={scrollRef}
                className="flex-[4] min-h-0 overflow-y-auto px-4 sm:px-6 py-4 space-y-3 font-mono text-[13px] sm:text-sm"
              >
                {!live ? (
                  <div className="h-full flex items-center justify-center text-faint text-xs italic text-center px-4">
                    &gt; connect to agent to unlock chat...
                  </div>
                ) : transcript.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-faint text-xs italic">
                    &gt; awaiting transmission...
                  </div>
                ) : (
                  <AnimatePresence>
                    {transcript.map((line) => (
                      <motion.div
                        key={line.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2"
                      >
                        <span className={line.from === "you" ? "text-muted" : "text-cyan"}>
                          {line.from === "you" ? "you>" : "ai>"}
                        </span>
                        <span className="text-ink break-words">{line.text}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Suggested questions — ~20%, persistent, swipeable on mobile, never disappears */}
              <div
                className="flex-1 min-h-0 border-t border-border/70 flex items-center gap-2 overflow-x-auto snap-x snap-mandatory scroll-px-4 px-4 py-2"
                style={{
                  maskImage: "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
                }}
              >
                <span className="shrink-0 text-[9px] font-mono uppercase tracking-widest text-faint pr-1">
                  Try
                </span>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    disabled={!live}
                    onClick={() => handleSuggestion(q)}
                    className="shrink-0 snap-start whitespace-nowrap text-[11px] font-mono px-3 py-2 sm:py-1.5 rounded-full border border-border bg-panel/60 text-muted hover:border-cyan/40 hover:text-cyan active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {q}
                  </button>
                ))}
                <span className="shrink-0 w-1" aria-hidden="true" />
              </div>
            </div>

            {/* Command input */}
            <form onSubmit={handleSend} className="border-t border-border bg-elevated/40 px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center rounded-xl border border-border bg-panel/60 px-4 py-2 gap-2">
                <span className={`shrink-0 ${live ? "text-cyan" : "text-faint"}`}>&gt;</span>
                <input
                  value={draft}
                  disabled={!live}
                  onChange={(e) => setDraft(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-ink min-w-0 placeholder-faint text-base"
                  placeholder={live ? "Ask something..." : "Connect to chat..."}
                />
                <button
                  type="submit"
                  disabled={!live || !draft.trim()}
                  className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-cyan text-bg hover:scale-105 active:scale-95 transition disabled:opacity-40 shrink-0"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}