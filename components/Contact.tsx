"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong rounded-3xl p-12 relative overflow-hidden contact-item"
        >
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-amber/30 via-transparent to-amber/30 opacity-50 -z-10 blur-2xl animate-border-glow" />
          <h2 className="text-4xl font-display font-bold text-white mb-6">Let's work together.</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            I am currently open to discussing new projects and opportunities in AI agent development.
          </p>
          <div className="space-y-4 contact-grid">
            <motion.a
              whileHover={{ x: 4 }}
              href="mailto:madityarao5@gmail.com"
              className="block text-white hover:text-amber transition-colors font-mono"
            >
              madityarao5@gmail.com
            </motion.a>
            <motion.a
              whileHover={{ x: 4 }}
              href="tel:+917338078108"
              className="block text-white hover:text-amber transition-colors font-mono"
            >
              +91 7338078108
            </motion.a>
            <div className="flex items-center gap-2 text-slate-500 font-mono text-sm">
              <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
              Available for work
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}