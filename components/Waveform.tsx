"use client";

import { useEffect, useRef } from "react";

type Props = {
  mode: "ambient" | "live";
  getLevels?: () => { local: Uint8Array | null; remote: Uint8Array | null };
  active?: boolean;
  height?: number;
};

// A discrete spectrum stop table — solid color lookups, not a CSS gradient.
// Grounded in the subject: this is how a real spectrum analyser assigns
// color by frequency band, not a decorative flourish.
const STOPS: [number, string][] = [
  [0, "124,108,255"], // violet — low band
  [0.32, "43,200,236"], // cyan
  [0.58, "51,214,160"], // mint
  [0.8, "255,182,72"], // amber
  [1, "255,107,94"], // coral — high band
];

function colorAt(t: number) {
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [t0, c0] = STOPS[i];
    const [t1, c1] = STOPS[i + 1];
    if (t >= t0 && t <= t1) {
      const localT = (t - t0) / (t1 - t0 || 1);
      const a = c0.split(",").map(Number);
      const b = c1.split(",").map(Number);
      const r = Math.round(a[0] + (b[0] - a[0]) * localT);
      const g = Math.round(a[1] + (b[1] - a[1]) * localT);
      const bch = Math.round(a[2] + (b[2] - a[2]) * localT);
      return `${r},${g},${bch}`;
    }
  }
  return STOPS[STOPS.length - 1][1];
}

export default function Waveform({ mode, getLevels, active = true, height = 160 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();
  const tRef = useRef(0);
  const barsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const BAR_COUNT = 48;
    if (barsRef.current.length === 0) {
      barsRef.current = new Array(BAR_COUNT).fill(0.08);
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }
    resize();
    window.addEventListener("resize", resize);

    function frame() {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      tRef.current += 0.045;

      const bars = barsRef.current;
      const n = bars.length;
      const gap = w * 0.006;
      const barW = (w - gap * (n - 1)) / n;

      let localData: Uint8Array | null = null;
      let remoteData: Uint8Array | null = null;
      if (mode === "live" && getLevels) {
        const levels = getLevels();
        localData = levels.local;
        remoteData = levels.remote;
      }

      for (let i = 0; i < n; i++) {
        let target: number;
        if (mode === "ambient") {
          target =
            0.12 +
            Math.abs(Math.sin(tRef.current * 0.6 + i * 0.35)) * 0.22 +
            Math.abs(Math.sin(tRef.current * 0.21 + i * 0.12)) * 0.12;
        } else if (active && (localData || remoteData)) {
          const idxL = localData ? Math.floor((i / n) * localData.length) : 0;
          const idxR = remoteData ? Math.floor((i / n) * remoteData.length) : 0;
          const vL = localData ? localData[idxL] / 255 : 0;
          const vR = remoteData ? remoteData[idxR] / 255 : 0;
          target = 0.06 + Math.max(vL, vR) * 0.9;
        } else {
          target = 0.06 + Math.abs(Math.sin(tRef.current * 0.4 + i * 0.3)) * 0.05;
        }
        bars[i] += (target - bars[i]) * 0.35;

        const barH = bars[i] * h;
        const x = i * (barW + gap);
        const y = h - barH;
        const color = colorAt(i / (n - 1));
        ctx.fillStyle = `rgba(${color},${mode === "ambient" ? 0.85 : 1})`;
        const radius = Math.min(barW / 2, 3 * dpr);
        roundRect(ctx, x, y, barW, barH, radius);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(frame);
    }
    frame();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mode, getLevels, active]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height }}
      aria-hidden="true"
    />
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}