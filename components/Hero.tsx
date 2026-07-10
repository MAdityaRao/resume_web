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
          <div className="flex flex-wrap items-center gap-3">
            <a href="#work" className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-slate-200 transition-all text-sm md:text-base">
              View Projects
            </a>
            <a
              href="/resume.pdf"
              download
              className="px-6 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-all text-sm md:text-base"
            >
              Download CV
            </a>
            <a
              href="#agent"
              className="px-6 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-all text-sm md:text-base"
            >
              Talk to Agent
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-all flex items-center gap-2 text-sm md:text-base"
            >
              <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/aditya-rao-81832132b/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-all flex items-center gap-2 text-sm md:text-base"
            >
              <svg height="18" width="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </motion.div>

        <div className="w-full max-w-sm glass rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all flex flex-col items-center">
          <div className="flex items-center justify-between mb-8 w-full">
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

          <div className="h-20 w-full flex items-center justify-center bg-black/20 rounded-2xl border border-white/5 mb-6">
            <Waveform mode="live" getLevels={getLevels} active={live} height={40} />
          </div>

          <div className="flex justify-between items-center text-slate-500 text-[10px] font-mono uppercase tracking-widest w-full">
            <span>{live ? "Status: Active" : "Status: Standby"}</span>
            <span className="text-cyan">{live ? "Streaming Audio" : "Ready"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
