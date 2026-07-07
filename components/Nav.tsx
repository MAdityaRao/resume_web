"use client";

import { profile } from "@/lib/content";

const links = [
  { href: "#work", label: "Work" },
  { href: "#agent", label: "Agent" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/80 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="font-display font-medium text-ink tracking-tight shrink-0">
          Aditya
        </a>
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-[0.15em] text-muted">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-ink transition-colors focus-ring">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* GitHub */}
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="focus-ring p-2 rounded-full hover:bg-panel transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-muted hover:text-ink transition-colors"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.61.07-.6.07-.6 1 .07 1.53.9 1.53.9.9 1.54 2.36 1.1 2.94.84.09-.66.35-1.1.63-1.35-2.22-.25-4.55-1.11-4.55-4.92 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.29.1-2.68 0 0 .84-.27 2.75 1.02A9.64 9.64 0 0112 6.84c.85.04 1.71.1 2.52.3 1.91-1.29 2.75-1.02 2.75-1.02.55 1.39.2 2.43.1 2.68.64.7 1.03 1.6 1.03 2.69 0 3.82-2.34 4.67-4.56 4.92.36.31.67.92.67 1.85v2.74c0 .27.16.58.67.5C19.13 20.17 22 16.42 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </a>

          {/* Gmail */}
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="focus-ring p-2 rounded-full hover:bg-panel transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-muted hover:text-ink transition-colors"
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </a>

          {/* Download CV */}
          <a
            href="/Users/adityarao/Desktop/aditya-portfolio/public/Aditya_Resume.docx"
            download
            className="focus-ring inline-flex items-center gap-2 bg-ink text-bg font-mono text-xs px-3 sm:px-4 py-2 rounded-full hover:bg-cyan transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span className="hidden sm:inline">Download CV</span>
          </a>
        </div>
      </div>
    </header>
  );
}
