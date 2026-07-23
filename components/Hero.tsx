"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/content";

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="black" aria-hidden="true" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GmailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="none" />
      <path d="M12 16.64L24 7.636v11.73c0 .904-.732 1.636-1.636 1.636h-3.819V11.73z" fill="#4285F4" />
      <path d="M12 16.64L0 7.636v11.73c0 .904.732 1.636 1.636 1.636h3.819V11.73z" fill="#34A853" />
      <path d="M12 9.548L5.455 4.64 3.927 3.493C2.309 2.279 0 3.434 0 5.457v2.179L12 16.64z" fill="#FBBC04" />
      <path d="M12 9.548l6.545-4.91 1.528-1.145c1.618-1.214 3.927-.059 3.927 1.964v2.179L12 16.64z" fill="#EA4335" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section 
      id="top" 
      className="w-full min-h-[85svh] md:min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 py-12 md:py-16 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl flex flex-col items-center"
      >
        {/* Tagline Badge */}
        <span className="inline-flex items-center px-3.5 py-1.5 text-secondary text-[11px] sm:text-xs font-mono mb-6 md:mb-8 uppercase tracking-widest bg-white/5 rounded-full border border-border max-w-[90%] truncate">
          {profile.tagline}
        </span>

        {/* Dynamic Mobile Title */}
        <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary tracking-tight mb-6 sm:mb-8 leading-[1.15] sm:leading-[1.08]">
          Building the future of <br className="hidden sm:inline" />
          <span className="text-yellow-500">Conversational AI.</span>
        </h1>

        {/* Summary */}
        <p className="text-base sm:text-xl md:text-2xl text-secondary max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed font-light px-2">
          {profile.summary}
        </p>

        {/* Actions Container */}
        <div className="w-full max-w-xl flex flex-col items-center gap-6">
          {/* Main CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              href="#work"
              className="w-full sm:w-auto sm:min-w-[180px] px-6 py-3.5 sm:py-4 rounded-full bg-primary text-bg font-bold hover:bg-neutral-800 active:bg-neutral-900 transition-colors duration-200 text-center text-sm sm:text-base shadow-md"
            >
              Explore Work
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              href="#agent"
              className="w-full sm:w-auto sm:min-w-[180px] px-6 py-3.5 sm:py-4 rounded-full bg-bg border border-border text-primary font-bold hover:border-neutral-500/50 active:bg-white/5 transition-colors duration-200 text-center text-sm sm:text-base"
            >
              Talk to My Agent
            </motion.a>
          </div>

          {/* Social Links Matrix (2-column Grid on Mobile, Flex on Desktop) */}
          <div className="w-full mt-4 sm:mt-6 p-3 sm:p-5 bg-card/50 backdrop-blur-sm rounded-2xl border border-border grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2.5 sm:gap-3">
            {[
              { label: "Resume", href: "/Aditya_Resume.docx", download: true, icon: null },
              { label: "Gmail", href: `mailto:${profile.email}`, icon: GmailIcon },
              { label: "GitHub", href: profile.github, target: "_blank", icon: GitHubIcon },
              { label: "LinkedIn", href: profile.linkedin || "#", target: "_blank", icon: LinkedInIcon },
            ].map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.download ? { download: true } : {})}
                  {...(link.target ? { target: link.target, rel: "noopener noreferrer" } : {})}
                  className="flex items-center justify-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-full bg-white border border-border text-secondary hover:text-primary active:bg-neutral-100 hover:border-primary transition-all shadow-sm active:scale-[0.98]"
                >
                  {Icon ? (
                    <Icon className="w-4 h-4 shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm font-medium truncate">{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}