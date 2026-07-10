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
        <h2 className="text-4xl font-display font-bold text-white mb-16 text-center">Selected Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <AnimatePresence>
            {displayedProjects.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
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
                      Read README <span className="ml-2">→</span>
                    </a>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple/5 to-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {projects.length > 0 && (
          <div className="text-center mt-16">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 rounded-full bg-cyan/10 border border-cyan/20 text-cyan font-semibold hover:bg-cyan/20 transition-all cursor-pointer z-20 relative"
            >
              {showAll ? "Show Less" : "View All Projects"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
