"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { projects } from "@/lib/content";

export default function Projects() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [circlePos, setCirclePos] = useState({ x: 0, y: 0 });
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rafRef = useRef<number | null>(null);

  const updateOrbit = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const progress = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
    const orbitX = Math.sin(progress * Math.PI * 2) * 120;
    const orbitY = Math.cos(progress * Math.PI * 2) * 90;

    const activeId = hoveredId || selectedId;
    const wrapper = track.parentElement;
    const wrapperRect = wrapper?.getBoundingClientRect();

    if (activeId) {
      const card = cardRefs.current[activeId];
      if (card && wrapperRect) {
        const cardRect = card.getBoundingClientRect();
        setCirclePos({
          x: cardRect.left + cardRect.width / 2 - wrapperRect.left,
          y: cardRect.top + cardRect.height / 2 - wrapperRect.top,
        });
        return;
      }
    }

    const trackRect = track.getBoundingClientRect();
    setCirclePos({
      x: (wrapperRect ? trackRect.left - wrapperRect.left : 0) + trackRect.width / 2 + orbitX,
      y: (wrapperRect ? trackRect.top - wrapperRect.top : 0) + trackRect.height / 2 + orbitY,
    });
  }, [hoveredId, selectedId]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        updateOrbit();
      });
    };

    updateOrbit();
    track.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      track.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [updateOrbit]);

  useEffect(() => {
    updateOrbit();
  }, [hoveredId, selectedId, updateOrbit]);

  return (
    <section id="work" className="w-full py-16 md:py-24 px-4 md:px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-clamp-h2 font-display font-bold text-primary mb-12 md:mb-20 tracking-tighter">
          Selected Work
        </h2>

        <div className="relative overflow-visible py-6 md:py-8">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute z-20 h-32 w-32 rounded-full border-[3px] border-yellow-500/90 bg-yellow-500/20 shadow-[0_0_90px_rgba(234,179,8,0.6)] blur-3xl"
            animate={{
              x: circlePos.x,
              y: circlePos.y,
              scale: hoveredId ? 1.25 : selectedId ? 1.18 : 1,
              opacity: hoveredId || selectedId ? 0.95 : 0,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ left: 0, top: 0, transform: "translate(-50%, -50%)" }}
          />
          <div
            ref={trackRef}
            className="relative z-10 flex gap-4 md:gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide overscroll-x-contain px-3 md:px-0"
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x', scrollPadding: '0 1rem' }}
          >
            {projects.map((p, i) => (
            <motion.div
              key={p.id}
              ref={(el) => {
                cardRefs.current[p.id] = el;
              }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedId(p.id)}
              className="group relative flex flex-col p-5 md:p-8 rounded-3xl border border-border bg-card/30 hover:bg-card transition-all duration-500 overflow-hidden snap-center w-[84vw] max-w-[20rem] sm:w-80 shrink-0 cursor-pointer"
              animate={selectedId === p.id ? { scale: 1.03 } : hoveredId === p.id ? { scale: 1.02 } : { scale: 1 }}
            >
              <div className="flex flex-col h-full">
                <div className="relative z-10 w-full flex-grow">
                  <h3 className="text-xl font-display font-bold text-primary group-hover:text-yellow-500 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-secondary mt-1 text-sm">{p.role}</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {p.stack.map((tech) => (
                      <span key={tech} className="px-3 py-1 text-xs font-mono bg-white border border-border rounded-full text-secondary">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={p.link || "#"}
                    className="inline-block px-4 py-2 rounded-full border border-yellow-500 text-yellow-500 text-sm hover:bg-yellow-500 hover:text-white transition-colors"
                    onClick={(event) => event.stopPropagation()}
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
