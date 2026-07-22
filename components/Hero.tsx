"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/content";
import LiveDataAnimation from "./LiveDataAnimation";

export default function Hero() {
  return (
      <section id="top" className="w-full min-h-[90vh] flex flex-col justify-center items-center px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <span className="inline-block px-4 py-1.5 text-secondary text-xs font-mono mb-6 md:mb-8 uppercase tracking-widest bg-white/5 rounded-full border border-border">
            {profile.tagline}
          </span>

          <h1 className="text-4xl md:text-clamp-hero font-display font-bold text-primary tracking-tighter mb-8 md:mb-10 leading-[0.9]">
            Building the future of <br />
            <span className="text-yellow-500">Conversational AI.</span>
          </h1>

          <p className="text-lg md:text-2xl text-secondary max-w-2xl mx-auto mb-10 md:mb-16 leading-relaxed font-light">
            {profile.summary}
          </p>

        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#work"
              className="px-8 py-4 rounded-full bg-primary text-bg font-bold hover:bg-neutral-800 transition-colors duration-300"
            >
              Explore Work
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#agent"
              className="px-8 py-4 rounded-full bg-bg border border-border text-primary font-bold hover:border-neutral-500/50 transition-colors duration-300"
            >
              Talk to My Agent
            </motion.a>
          </div>

          {/* Social Links & Resume Download */}
          <div className="flex items-center flex-wrap justify-center gap-6 mt-8 p-6 bg-card/50 rounded-2xl border border-border">
            {[
              { label: "Download Resume", href: "/Aditya_Resume.docx", download: true },
              { label: "Gmail", href: `mailto:${profile.email}` },
              { label: "GitHub", href: profile.github, target: "_blank" },
              { label: "LinkedIn", href: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.download ? { download: true } : {})}
                {...(link.target ? { target: link.target, rel: "noopener noreferrer" } : {})}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-border text-secondary hover:text-primary hover:border-primary transition-all group shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-primary group-hover:scale-125 transition-transform" />
                <span className="text-sm font-medium">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
