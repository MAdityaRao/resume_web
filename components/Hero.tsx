"use client";

import { motion } from "framer-motion";
import Waveform from "./Waveform";
import { profile } from "@/lib/content";

export default function Hero() {
  return (
    <section id="top" className="relative pt-40 pb-24 px-6 border-b border-border overflow-hidden">
      <div className="mx-auto max-w-6xl grid md:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-xs tracking-[0.25em] text-cyan uppercase mb-6">
            {profile.tagline}
          </p>
          <h1 className="font-display font-medium text-clamp-hero leading-[1.02] text-ink mb-8">
            I build voice agents
            <br />
            that hold a real
            <br />
            conversation.
          </h1>
          <p className="text-muted text-lg max-w-xl mb-10 leading-relaxed">
            {profile.summary}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#agent"
              className="focus-ring inline-flex items-center gap-2 bg-ink text-bg font-mono text-sm px-6 py-3 rounded-full hover:bg-cyan transition-colors"
            >
              Talk to the agent
            </a>
            <a
              href="#work"
              className="focus-ring inline-flex items-center gap-2 border border-border text-ink font-mono text-sm px-6 py-3 rounded-full hover:border-cyan transition-colors"
            >
              View the work
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="border border-border rounded-2xl bg-panel p-6">
            <Waveform mode="ambient" height={140} />
            <div className="flex items-center justify-between mt-4 font-mono text-[11px] text-faint">
              <span>SIG · IDLE TRACE</span>
              <span>REPOS: 14 · FOLLOWERS: 3 · LOC: KARNATAKA, IN</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
