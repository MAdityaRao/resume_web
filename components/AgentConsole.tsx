"use client";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgentSession } from "@/lib/useAgentSession";

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

function Corner({ className }: { className: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className={className}>
      <path d="M1 12V4C1 2.34315 2.34315 1 4 1H12" stroke="currentColor" strokeWidth="1.5" />
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
    setBars(prev => prev.map(() => 0.15 + Math.random() * 0.5));
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
              live ? "opacity-70 bg-gradient-to-br from-cyan/50 via-purple/30 to-cyan/50" : "opacity-25 bg-gradient-to-br from-purple/30 to-cyan/20"
            }`}
          />

          <div className="relative glass-strong rounded-[2rem] overflow-hidden agent-card w-full">
            {/* HUD corner brackets */}
            <Corner className="absolute top-3 left-3 text-cyan/50" />
            <Corner className="absolute top-3 right-3 text-cyan/50 rotate-90" />
            <Corner className="absolute bottom-3 left-3 text-cyan/50 -rotate-90" />
            <Corner className="absolute bottom-3 right-3 text-cyan/50 rotate-180" />

            {/* Scanline sweep */}
            {live && (
              <motion.div
                className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-cyan/[0.06] to-transparent pointer-events-none z-10"
                animate={{ top: ["-10%", "110%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            )}

            {/* Faint HUD grid */}
            <div className="absolute inset-0 hero-grid-bg opacity-20 pointer-events-none" />

            {/* Header readout */}
            <div className="relative px-6 pt-6 pb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              <span>SIG_VOICE_AGENT</span>
              <span
                className={
                  live
                    ? "text-cyan"
                    : reconnecting
                    ? "text-amber animate-pulse"
                    : status === "error"
                    ? "text-red-400"
                    : "text-slate-600"
                }
              >
                {live && `SESSION ${elapsed}`}
                {reconnecting && "RECONNECTING…"}
                {connecting && "CONNECTING…"}
                {status === "error" && "CONNECTION ISSUE"}
                {(status === "idle" || status === "ended") && "STANDBY"}
              </span>
            </div>

            {errorMessage && (status === "error") && (
              <div className="mx-6 mb-2 -mt-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            {/* Orb + radial spectrum */}
            <div className="relative flex flex-col items-center pt-4 pb-8">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* Radar pings */}
                {active &&
                  [0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className={`absolute inset-0 rounded-full border ${
                        reconnecting ? "border-amber/40" : "border-cyan/40"
                      }`}
                      initial={{ scale: 0.4, opacity: 0.6 }}
                      animate={{ scale: 1.6, opacity: 0 }}
                      transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
                    />
                  ))}

                {/* Rotating dashed ring */}
                <motion.svg
                  viewBox="0 0 200 200"
                  className="absolute inset-0 w-full h-full"
                  animate={{ rotate: active ? 360 : 0 }}
                  transition={{ duration: reconnecting ? 4 : 20, repeat: active ? Infinity : 0, ease: "linear" }}
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="92"
                    fill="none"
                    stroke={
                      reconnecting
                        ? "rgba(255,182,72,0.5)"
                        : live
                        ? "rgba(43,200,236,0.4)"
                        : "rgba(148,163,184,0.15)"
                    }
                    strokeWidth="1.5"
                    strokeDasharray="4 10"
                  />
                </motion.svg>

                {/* Radial bar spectrum */}
                <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
                  {bars.map((v, i) => {
                    const angle = (i / bars.length) * 360;
                    const rad = (angle * Math.PI) / 180;
                    const rInner = 62;
                    const len = 10 + v * 20;
                    const x1 = 100 + rInner * Math.cos(rad);
                    const y1 = 100 + rInner * Math.sin(rad);
                    const x2 = 100 + (rInner + len) * Math.cos(rad);
                    const y2 = 100 + (rInner + len) * Math.sin(rad);
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={live ? "#2BC8EC" : "#334155"}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity={live ? 0.85 : 0.4}
                      />
                    );
                  })}
                </svg>

                {/* Core connect button */}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={live ? disconnect : connect}
                  disabled={connecting}
                  className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center font-mono text-[10px] uppercase tracking-widest transition-colors disabled:opacity-60 ${
                    live
                      ? "bg-cyan/10 border border-cyan/50 text-cyan shadow-glow-cyan"
                      : reconnecting
                      ? "bg-amber/10 border border-amber/50 text-amber"
                      : "bg-white text-black"
                  }`}
                >
                  {live && (
                    <span className="flex flex-col items-center leading-tight">
                      <span className="w-2.5 h-2.5 rounded-sm bg-cyan mb-1 live-dot" />
                      End
                    </span>
                  )}
                  {reconnecting && "…"}
                  {connecting && "…"}
                  {!active && !connecting && "Talk"}
                </motion.button>
              </div>

              <p className="mt-4 font-mono text-[11px] text-slate-500 uppercase tracking-widest">
                {live && "Listening — speak naturally"}
                {reconnecting && "Network hiccup — reconnecting automatically"}
                {connecting && "Connecting — this can take a few seconds on campus wifi"}
                {status === "error" && "Tap to try again"}
                {(status === "idle" || status === "ended") && "Tap to start a live voice session"}
              </p>
            </div>

            {/* Transcript — terminal log style */}
            <div
              ref={scrollRef}
              className="relative h-64 overflow-y-auto px-6 py-4 space-y-3 scrollbar-thin border-t border-white/5 bg-black/20 font-mono text-sm"
            >
              {transcript.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-600 text-xs italic">
                  &gt; awaiting transmission...
                </div>
              ) : (
                <AnimatePresence>
                  {transcript.map((line) => (
                    <motion.div
                      key={line.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex gap-2"
                    >
                      <span className={line.from === "you" ? "text-purple" : "text-cyan"}>
                        {line.from === "you" ? "you>" : "ai>"}
                      </span>
                      <span className="text-slate-300">{line.text}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              {live && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-cyan align-middle"
                />
              )}
            </div>

            {/* Command input */}
           <form onSubmit={handleSend} className="border-t border-white/5 bg-black/30 px-6 py-4">
  <div className="flex items-center rounded-xl border border-white/10 bg-black/40 px-4 py-2 gap-2">
    <span className="text-cyan shrink-0">&gt;</span>

    <input
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      className="flex-1 bg-transparent outline-none text-white min-w-0"
      placeholder="Type a message..."
    />

    <button
      type="submit"
      disabled={!live || !draft.trim()}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan text-black hover:scale-105 transition disabled:opacity-40 shrink-0"
    >
      <Send size={18} />
    </button>
  </div>
</form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}