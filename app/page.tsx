'use client';
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import AgentConsole from "@/components/AgentConsole";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-bg text-primary selection:bg-yellow-500/30 selection:text-white">
      <Nav />

      {/* Each section is a full-viewport container for cinematic flow */}
      <section className="section-wrapper">
        <Hero />
      </section>

      <section className="section-wrapper">
        <Reveal>
          <About />
        </Reveal>
      </section>

      <section className="section-wrapper">
        <Reveal>
          <Projects />
        </Reveal>
      </section>

      <section className="section-wrapper">
        <Reveal>
          <Skills />
        </Reveal>
      </section>

      <section className="section-wrapper">
        <Reveal>
          <AgentConsole />
        </Reveal>
      </section>

      <section className="section-wrapper">
        <Reveal>
          <Contact />
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
