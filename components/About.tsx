"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SignalDivider from "./SignalDivider";
import { experience, education, profile } from "@/lib/content";

export default function About() {
  return (
    <section id="about" className="px-6 py-24 border-b border-border">
      <div className="mx-auto max-w-6xl">
        <SignalDivider code="SIG_01" label="Background" />
        <div className="grid md:grid-cols-[0.8fr_1.2fr] gap-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-border">
              <Image
                src="/aditya.jpg"
                alt="Aditya"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                priority
              />
            </div>
            <p className="font-mono text-[11px] text-faint mt-3">{profile.location}</p>
          </motion.div>

          <div>
            <h2 className="font-display font-medium text-clamp-h2 text-ink mb-8">
              Production systems,
              <br />
              not demos.
            </h2>

            {/* GitHub Stats */}
            <div className="flex flex-wrap gap-6 mb-10 font-mono text-xs">
              <div className="flex items-center gap-2 border border-border rounded-full px-4 py-2">
                <span className="text-ink font-medium">14</span>
                <span className="text-muted">Repositories</span>
              </div>
              <div className="flex items-center gap-2 border border-border rounded-full px-4 py-2">
                <span className="text-ink font-medium">3</span>
                <span className="text-muted">Followers</span>
              </div>
              <div className="flex items-center gap-2 border border-border rounded-full px-4 py-2">
                <span className="text-ink font-medium">5</span>
                <span className="text-muted">Following</span>
              </div>
              <a
                href="https://github.com/MAdityaRao"
                target="_blank"
                rel="noreferrer"
                className="focus-ring flex items-center gap-2 border border-border rounded-full px-4 py-2 hover:border-cyan transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-muted">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.61.07-.6.07-.6 1 .07 1.53.9 1.53.9.9 1.54 2.36 1.1 2.94.84.09-.66.35-1.1.63-1.35-2.22-.25-4.55-1.11-4.55-4.92 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.29.1-2.68 0 0 .84-.27 2.75 1.02A9.64 9.64 0 0112 6.84c.85.04 1.71.1 2.52.3 1.91-1.29 2.75-1.02 2.75-1.02.55 1.39.2 2.43.1 2.68.64.7 1.03 1.6 1.03 2.69 0 3.82-2.34 4.67-4.56 4.92.36.31.67.92.67 1.85v2.74c0 .27.16.58.67.5C19.13 20.17 22 16.42 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span className="text-ink">View GitHub</span>
              </a>
            </div>

            {experience.map((job) => (
              <motion.div
                key={job.org}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="mb-8 border-l border-border pl-6"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 mb-2">
                  <h3 className="font-display text-ink text-lg">{job.role}</h3>
                  <span className="text-muted text-sm">— {job.org}</span>
                  <span className="font-mono text-xs text-faint ml-auto">{job.period}</span>
                </div>
                <ul className="space-y-2">
                  {job.points.map((p) => (
                    <li key={p} className="text-muted text-sm leading-relaxed">
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            <div className="border-l border-border pl-6">
              <div className="flex flex-wrap items-baseline gap-x-3 mb-2">
                <h3 className="font-display text-ink text-lg">{education.degree}</h3>
                <span className="font-mono text-xs text-faint ml-auto">{education.period}</span>
              </div>
              <p className="text-muted text-sm mb-2">{education.school}</p>
              <p className="font-mono text-xs text-faint">
                {education.coursework.join(" · ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
