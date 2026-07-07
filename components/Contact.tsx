"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="glass rounded-3xl p-12 border border-white/5">
          <h2 className="text-4xl font-display font-bold text-white mb-6">Let's work together.</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            I am currently open to discussing new projects and opportunities in AI agent development.
          </p>
          <div className="space-y-4">
            <a href="mailto:madityarao5@gmail.com" className="block text-white hover:text-purple transition-colors font-mono">
              madityarao5@gmail.com
            </a>
            <a href="tel:+917338078108" className="block text-white hover:text-purple transition-colors font-mono">
              +91 7338078108
            </a>
            <div className="flex items-center gap-2 text-slate-500 font-mono text-sm">
              <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
              Available for work
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}