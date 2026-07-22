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
      className="fixed top-0 inset-x-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border"
    >
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a
          href="#top"
          onClick={(e) => handleScroll(e, "#top")}
          className="flex items-center gap-3 font-display font-bold text-lg text-primary tracking-tight"
        >
          <motion.img
            whileHover={{ scale: 1.08, rotate: 4 }}
            src="/aditya.jpg"
            alt="Aditya"
            className="w-8 h-8 rounded-full object-cover object-top border border-border"
          />
          Aditya<span className="text-primary">.</span>
        </a>

              {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-secondary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleScroll(e, l.href)}
              className="relative group hover:text-primary transition-colors py-1 cursor-pointer select-none"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </a>
          ))}
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            href="/Aditya_Resume.docx"
            download
            className="px-4 py-2 rounded-full border border-border text-primary hover:border-primary transition-colors text-xs font-semibold"
          >
            Resume
          </motion.a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-full border border-border"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            className="w-4 h-[1.5px] bg-primary block"
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-4 h-[1.5px] bg-primary block"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            className="w-4 h-[1.5px] bg-primary block"
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
            transition={{ duration: 0.3 }}
            className="md:hidden bg-bg border-t border-border overflow-hidden"
          >
            <nav className="flex flex-col p-6 gap-2 font-mono text-sm uppercase text-secondary">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  className="px-4 py-3.5 hover:text-primary transition-colors"
                  onClick={(e) => handleScroll(e, l.href)}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
