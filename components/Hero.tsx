"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/content";
import LiveDataAnimation from "./LiveDataAnimation";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  return (
    <section id="top" className="relative pt-40 pb-24 px-6 overflow-hidden">
      <div className="mx-auto max-w-6xl grid md:grid-cols-[1fr_auto] gap-12 items-center hero-inner">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-block px-3 py-1 text-slate-300 text-xs font-mono mb-6 uppercase tracking-widest glass-pill rounded-full"
          >
            {profile.tagline}
          </motion.span>
          <motion.h1
            variants={item}
            className="font-display text-6xl md:text-7xl font-medium text-white tracking-tight mb-8"
          >
            Aditya
            <br />
            <span className="text-amber">
              Ai Agent Developer
            </span>
          </motion.h1>
          <motion.p variants={item} className="text-slate-400 text-lg max-w-xl mb-10 leading-relaxed">
            {profile.summary}
          </motion.p>
          <motion.div variants={item} className="flex flex-wrap items-center gap-3">
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href="#work"
              className="px-6 py-3 rounded-full bg-white text-black font-semibold transition-shadow hover:shadow-glow text-sm md:text-base"
            >
              View Projects
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href="/resume.pdf"
              download
              className="px-6 py-3 rounded-full glass-pill text-white text-sm md:text-base"
            >
              Download CV
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href="#agent"
              className="px-6 py-3 rounded-full glass-pill text-white text-sm md:text-base"
            >
              Talk to Agent
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full glass-pill text-white flex items-center gap-2 text-sm md:text-base"
            >
              <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              GitHub
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href="https://www.linkedin.com/in/aditya-rao-81832132b/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full glass-pill text-white flex items-center gap-2 text-sm md:text-base"
            >
              <svg height="18" width="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="w-full max-w-sm glass-strong rounded-3xl p-8 transition-shadow duration-500 flex flex-col items-center hero-photo relative"
        >
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-amber/40 via-transparent to-amber/40 opacity-40 -z-10 blur-xl animate-border-glow" />
          <div className="mb-6 w-full">
            <h3 className="text-white font-medium text-lg mb-2">Hotel Voice Automation</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Autonomous AI agent for hospitality that manages reservations, captures data, and confirms bookings 24/7.
            </p>
          </div>

          <div className="relative h-32 w-full flex items-center justify-center bg-black/20 rounded-2xl border border-white/5 mb-6 overflow-hidden">
            <LiveDataAnimation />
          </div>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="/project/project_readme/hotel_agent"
            className="w-full py-3 rounded-xl bg-amber/10 border border-amber/20 text-amber text-center font-medium hover:bg-amber/20 transition-all text-sm"
          >
            View Case Study
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}