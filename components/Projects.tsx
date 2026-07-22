"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/content";

export default function Projects() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section id="work" className="w-full py-16 md:py-24 px-4 md:px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-clamp-h2 font-display font-bold text-primary mb-12 md:mb-20 tracking-tighter">
          Selected Work
        </h2>

        <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col p-6 md:p-8 rounded-3xl border border-border bg-card/30 hover:bg-card transition-all duration-500 overflow-hidden snap-start w-80 shrink-0"
            >
              <div className="flex flex-col h-full">
                <div className="relative z-10 w-full flex-grow">
                  <h3 className="text-xl font-display font-bold text-primary group-hover:text-yellow-500 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-secondary mt-1 text-sm">{p.role}</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {p.stack.map((tech) => (
                      <span key={tech} className="px-3 py-1 text-xs font-mono bg-white border border-border rounded-full text-secondary">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href={p.link || "#"}
                    className="inline-block px-4 py-2 rounded-full border border-yellow-500 text-yellow-500 text-sm hover:bg-yellow-500 hover:text-white transition-colors"
                  >
                    Read More
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
