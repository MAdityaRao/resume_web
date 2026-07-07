"use client";

import SignalDivider from "./SignalDivider";
import { profile } from "@/lib/content";

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SignalDivider code="SIG_05" label="Contact" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h2 className="font-display font-medium text-clamp-h2 text-ink max-w-xl leading-tight">
            Building a voice agent or LLM pipeline? Let&apos;s talk.
          </h2>
          <div className="flex flex-col gap-3 font-mono text-sm">
            <a href={`mailto:${profile.email}`} className="focus-ring text-ink hover:text-cyan transition-colors">
              {profile.email}
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="focus-ring text-ink hover:text-cyan transition-colors"
            >
              github.com/{profile.githubHandle}
            </a>
            <span className="text-faint">{profile.location}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
