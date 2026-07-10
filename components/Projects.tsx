"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/content";

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const displayedProjects = showAll ? projects : projects.slice(0, 4);

  return (
    <section id="work" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-display font-bold text-white mb-16 text-center"
        >
          Selected Projects
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8 proj-grid">
          <AnimatePresence>
            {displayedProjects.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: (i % 2) * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8 }}
                className="group glass glass-hover rounded-3xl p-8 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-white group-hover:text-amber transition-colors">
                      {p.name}
                    </h3>
                    {p.metric && (
                      <span className="text-xs font-mono text-amber bg-amber/10 px-3 py-1 rounded-full border border-amber/20">
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
                      className="inline-flex items-center text-sm font-semibold text-white hover:text-amber transition-colors"
                    >
                      Read README <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                    </a>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-amber/5 to-amber/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {projects.length > 0 && (
          <div className="text-center mt-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 rounded-full bg-amber/10 border border-amber/20 text-amber font-semibold hover:bg-amber/20 hover:shadow-glow transition-all cursor-pointer z-20 relative"
            >
              {showAll ? "Show Less" : "View All Projects"}
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}