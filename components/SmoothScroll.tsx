'use client';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Only initialize if not already running
    if (!lenisRef.current) {
      const lenis = new Lenis({
        duration: 0.8, // Decreased for snappier response
        easing: (t) => 1 - Math.pow(1 - t, 4), // Smoother acceleration
        smoothWheel: true,
        wheelMultiplier: 1.2, // Slightly faster scrolling
        touchMultiplier: 1.5,
        infinite: false,
        syncTouch: true, // Syncs touch scrolling for better smoothness
      });

      lenisRef.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    }

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return <>{children}</>;
}
