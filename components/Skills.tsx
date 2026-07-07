"use client";

import { motion } from "framer-motion";
import SignalDivider from "./SignalDivider";
import { skills } from "@/lib/content";

export default function Skills() {
  return (
    <section id="skills" className="px-6 py-24 border-b border-border">
      <div className="mx-auto max-w-6xl">
        <SignalDivider code="SIG_03" label="Toolset" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {skills.map((group, i) => (
            <motion.div
              key={group.group}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-cyan mb-4">
                {group.group}
              </h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-ink text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
