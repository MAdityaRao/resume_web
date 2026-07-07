"use client";

import { motion } from "framer-motion";
import { projects } from "@/lib/content";

export default function Projects() {
  return (
    <section id="work" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl font-display font-bold text-white mb-16 text-center">Selected Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <motion.article
              key={p.id}
              whileHover={{ y: -10 }}
              className="group glass rounded-3xl p-8 border border-white/5 hover:border-cyan/50 transition-all relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan transition-colors">
                    {p.name}
                  </h3>
                  {p.metric && (
                    <span className="text-xs font-mono text-cyan bg-cyan/10 px-3 py-1 rounded-full border border-cyan/20">
                      {p.metric}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 mb-6 line-clamp-3">{p.points.join(" ")}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {p.stack.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-md bg-white/5 text-xs text-slate-300 font-mono">
                      {s}
                    </span>
                  ))}
                </div>
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    className="inline-flex items-center text-sm font-semibold text-white hover:text-cyan transition-colors"
                  >
                    View Project <span className="ml-2">→</span>
                  </a>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple/5 to-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
