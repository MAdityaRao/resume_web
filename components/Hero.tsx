"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/content";
import { useAgentSession } from "@/lib/useAgentSession";
import Waveform from "./Waveform";

export default function Hero() {
  const { status, connect, disconnect, getLevels } = useAgentSession();
  const live = status === "live";

  return (
    <section id="top" className="relative pt-40 pb-24 px-6 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-cyan/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl grid md:grid-cols-[1fr_auto] gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <span className="inline-block px-3 py-1 text-slate-400 text-xs font-mono mb-6 uppercase tracking-widest border-b border-slate-800">
            {profile.tagline}
          </span>
          <h1 className="font-display text-6xl md:text-7xl font-medium text-white tracking-tight mb-8">
            Aditya
            <br />
            <span className="text-accent-secondary">
              Software Engineer
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mb-10 leading-relaxed">
            {profile.summary}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#work" className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-slate-200 transition-all">
              View Projects
            </a>
            <a
              href="/resume.pdf"
              download
              className="px-8 py-4 rounded-full border border-white/10 text-white hover:bg-white/5 transition-all"
            >
              Download CV
            </a>
            <a
              href="#agent"
              className="px-8 py-4 rounded-full border border-white/10 text-white hover:bg-white/5 transition-all"
            >
              Talk to Agent
            </a>
          </div>
        </motion.div>

        {/* Hero AI Assistant Console */}
        <div className="w-full max-w-sm glass rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className={`relative flex items-center justify-center w-3 h-3`}>
                <div className={`absolute w-full h-full rounded-full ${live ? 'bg-cyan' : 'bg-slate-600'}`} />
                {live && <div className="absolute w-full h-full rounded-full bg-cyan animate-ping" />}
              </div>
              <p className="text-white font-medium text-sm">Voice Interface</p>
            </div>
            <button
              onClick={live ? disconnect : connect}
              className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all uppercase font-mono tracking-wider"
            >
              {live ? "Stop" : "Connect"}
            </button>
          </div>

          <div className="h-20 flex items-center justify-center bg-black/20 rounded-2xl border border-white/5 mb-6">
            <Waveform mode="live" getLevels={getLevels} active={live} height={40} />
          </div>

          <div className="flex justify-between items-center text-slate-500 text-[10px] font-mono uppercase tracking-widest">
            <span>{live ? "Status: Active" : "Status: Standby"}</span>
            <span className="text-cyan">{live ? "Streaming Audio" : "Ready"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
