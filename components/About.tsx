"use client";

import Image from "next/image";
import LiveDataAnimation from "./LiveDataAnimation";
import { motion } from "framer-motion";
import { experience, education, profile } from "@/lib/content";

export default function About() {
  return (
    <section id="about" className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-bold text-primary mb-12 md:mb-16"
        >
          Journey
        </motion.h2>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 md:gap-16 about-grid">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] w-full rounded-3xl overflow-hidden glass-strong bg-border"
          >
            <Image src="/aditya.jpg" alt="Aditya" fill className="object-cover object-top" priority />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/80 backdrop-blur rounded-xl text-primary text-sm font-medium z-20 shadow-sm">
              {profile.location}
            </div>
          </motion.div>

          {/* Timeline & Education */}
          <div className="space-y-16">
            {/* Experience */}
            <div>
              <h3 className="text-2xl font-bold text-primary mb-8">Work Experience</h3>
              <div className="space-y-12">
                {experience.map((job, i) => (
                  <motion.div
                    key={job.org}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="relative pl-8 border-l border-border"
                  >
                    <span className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-primary">{job.role}</h3>
                      <span className="text-sm font-mono text-yellow-500">{job.period}</span>
                    </div>
                    <p className="text-secondary mb-4">{job.org}</p>
                    <ul className="space-y-2">
                      {job.points.map((p) => (
                        <li key={p} className="text-sm text-secondary leading-relaxed">• {p}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-2xl font-bold text-primary mb-8">Education</h3>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-8 border-l border-border"
              >
                <span className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-yellow-500" />
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-primary">{education.degree}</h3>
                  <span className="text-sm font-mono text-yellow-500">{education.period}</span>
                </div>
                <p className="text-secondary">{education.school}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}