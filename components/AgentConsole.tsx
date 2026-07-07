"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Waveform from "./Waveform";
import { useAgentSession } from "@/lib/useAgentSession";

export default function AgentConsole() {
  const {
    status,
    transcript,
    connect,
    disconnect,
    sendChatMessage,
    getLevels,
  } = useAgentSession();

  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const live = status === "live";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    const ok = await sendChatMessage(draft.trim());
    if (ok) setDraft("");
  }

  return (
    <section id="agent" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="glass rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[600px]">
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
            <div>
              <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-mono">
                {live ? "Live Connection" : "Offline"}
              </p>
            </div>
            <StatusPill status={status} />
          </div>

          {/* Transcript Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {transcript.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm italic">
                Start the conversation to begin...
              </div>
            ) : (
              <AnimatePresence>
                {transcript.map((line, i) => (
                  <motion.div
                    key={line.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${line.from === "you" ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] uppercase text-slate-600 mb-1 px-1">
                      {line.from === "you" ? "You" : "Assistant"}
                    </span>
                    <div className={`px-5 py-3 rounded-2xl max-w-[85%] ${
                      line.from === "you"
                        ? "bg-purple text-white rounded-br-none"
                        : "bg-white/5 text-slate-200 rounded-bl-none border border-white/5"
                    }`}>
                      {line.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Controls & Input */}
          <div className="p-4 border-t border-white/5 bg-black/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-12 flex items-center">
                <Waveform mode="live" getLevels={getLevels} active={live} height={40} />
              </div>
              <button
                onClick={live ? disconnect : connect}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  live
                    ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    : "bg-white text-black hover:bg-slate-200"
                }`}
              >
                {live ? "End Session" : "Connect"}
              </button>
            </div>

            <form onSubmit={handleSend} className="relative">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={live ? "Message your AI assistant..." : "Connect to start chatting..."}
                disabled={!live}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple/50 transition-colors"
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <div className={`px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-widest ${
      status === 'live' ? 'border-cyan/30 text-cyan bg-cyan/5' : 'border-slate-800 text-slate-600'
    }`}>
      {status}
    </div>
  );
}
