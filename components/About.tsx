"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { experience, education, profile } from "@/lib/content";

export default function About() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl font-display font-bold text-white mb-16">Journey</h2>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-16">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative h-[400px] w-full rounded-3xl overflow-hidden glass border border-white/5"
          >
            <Image
              src="/aditya.jpg"
              alt="Aditya"
              fill
              className="object-cover object-top"
              priority
            />
            <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-xl border border-white/10 text-white text-sm font-medium">
              {profile.location}
            </div>
          </motion.div>

          {/* Timeline */}
          <div className="space-y-12">
            {experience.map((job, i) => (
              <motion.div
                key={job.org}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-8 border-l border-white/10"
              >
                <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-purple" />
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{job.role}</h3>
                  <span className="text-sm font-mono text-purple">{job.period}</span>
                </div>
                <p className="text-slate-400 mb-4">{job.org}</p>
                <ul className="space-y-2">
                  {job.points.map((p) => (
                    <li key={p} className="text-sm text-slate-300 leading-relaxed">• {p}</li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative pl-8 border-l border-white/10"
            >
              <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-cyan" />
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{education.degree}</h3>
                <span className="text-sm font-mono text-cyan">{education.period}</span>
              </div>
              <p className="text-slate-400">{education.school}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}