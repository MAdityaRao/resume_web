"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/lib/content";

const links = [
  { href: "#work", label: "Work" },
  { href: "#agent", label: "Agent" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 inset-x-0 z-50 glass border-b border-white/10"
    >
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 font-display font-bold text-lg text-white tracking-tight">
          <img src="/aditya.jpg" alt="Aditya" className="w-8 h-8 rounded-full object-cover object-top border border-white/20" />
          Aditya<span className="text-purple">.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-slate-400">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="relative group hover:text-white transition-colors">
              {l.label}
              <motion.span className="absolute -bottom-1 left-0 w-full h-0.5 bg-purple scale-x-0 group-hover:scale-x-100 transition-transform" />
            </a>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white font-mono text-sm uppercase tracking-widest hover:text-purple transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10 overflow-hidden"
          >
            <nav className="flex flex-col p-6 gap-4 font-mono text-sm uppercase text-slate-200 items-end">
              {links.map((l) => (
                <a key={l.href} href={l.href} className="hover:text-white transition-colors" onClick={() => setIsOpen(false)}>{l.label}</a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
