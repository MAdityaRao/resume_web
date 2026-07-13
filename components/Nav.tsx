"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "#work", label: "Work" },
  { href: "#agent", label: "Agent" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

const NAV_OFFSET = 64;

function scrollToId(href: string) {
  const id = href.replace("#", "");
  const element = document.getElementById(id);
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
  window.history.pushState(null, "", href);
}

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setIsOpen(false);
      setTimeout(() => scrollToId(href), isOpen ? 300 : 0);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
      className="fixed top-0 inset-x-0 z-50 glass-strong border-b border-white/10"
    >
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a
          href="#top"
          onClick={(e) => handleScroll(e, "#top")}
          className="flex items-center gap-3 font-display font-bold text-lg text-white tracking-tight"
        >
          <motion.img
            whileHover={{ scale: 1.08, rotate: 4 }}
            src="/aditya.jpg"
            alt="Aditya"
            className="w-8 h-8 rounded-full object-cover object-top border border-white/20"
          />
          Aditya<span className="text-amber">.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-slate-400">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleScroll(e, l.href)}
              className="relative group hover:text-white transition-colors py-1"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 shadow-glow" />
            </a>
          ))}
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            href="/resume.pdf"
            download
            className="glass-pill px-4 py-2 rounded-full text-white normal-case tracking-normal text-xs font-semibold"
          >
            Resume
          </motion.a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-1.5 glass-pill rounded-full"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            className="w-4 h-[1.5px] bg-white block"
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-4 h-[1.5px] bg-white block"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            className="w-4 h-[1.5px] bg-white block"
          />
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden glass-strong border-t border-white/10 overflow-hidden"
          >
            <nav className="flex flex-col p-6 gap-1 font-mono text-sm uppercase text-slate-200">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-pill rounded-xl px-4 py-3.5 hover:text-white hover:border-amber/40 transition-colors"
                  onClick={(e) => handleScroll(e, l.href)}
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: links.length * 0.06 }}
                href="/resume.pdf"
                download
                className="mt-2 text-center rounded-xl px-4 py-3.5 bg-white text-black font-semibold normal-case tracking-normal"
              >
                Download Resume
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}