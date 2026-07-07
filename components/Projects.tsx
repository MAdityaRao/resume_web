"use client";

import { motion } from "framer-motion";
import SignalDivider from "./SignalDivider";
import { projects } from "@/lib/content";

export default function Projects() {
  return (
    <section id="work" className="px-6 py-24 border-b border-border">
      <div className="mx-auto max-w-6xl">
        <SignalDivider code="SIG_02" label="Selected work" />
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
              className="group border border-border rounded-2xl p-7 bg-panel hover:border-cyan/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="font-display text-xl text-ink leading-snug">{p.name}</h3>
                {p.metric && (
                  <span className="font-mono text-xs text-cyan whitespace-nowrap border border-cyan-dim rounded-full px-3 py-1">
                    {p.metric}
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-faint uppercase tracking-wide mb-4">{p.role}</p>
              <ul className="space-y-2 mb-5">
                {p.points.map((pt) => (
                  <li key={pt} className="text-muted text-sm leading-relaxed">
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mb-5">
                {p.stack.map((s) => (
                  <span key={s} className="font-mono text-[11px] text-muted border border-border rounded-full px-2.5 py-1">
                    {s}
                  </span>
                ))}
              </div>
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring font-mono text-xs text-cyan hover:text-ink transition-colors"
                >
                  View repository →
                </a>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
