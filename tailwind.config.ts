import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#262626", // Charcoal
        elevated: "#333333",
        panel: "#404040",
        border: "#505050",
        ink: "#F2F5F8",
        muted: "#A0A0A0",
        faint: "#707070",
        terracotta: {
          DEFAULT: "#C05C43",
          light: "#D87A60",
        },
        cyan: {
          DEFAULT: "#2BC8EC",
          dim: "#1D4C5C",
          glow: "#00E5FF",
        },
        purple: {
          DEFAULT: "#A855F7",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.05)",
          dark: "rgba(0, 0, 0, 0.2)",
        },
        mint: "#33D6A0",
        amber: {
          DEFAULT: "#FFB648",
          dim: "#6E5326",
        },
        coral: "#FF6B5E",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "clamp-hero": "clamp(2.75rem, 6vw, 5.5rem)",
        "clamp-h2": "clamp(2rem, 4vw, 3.25rem)",
      },
      transitionTimingFunction: {
        signal: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      boxShadow: {
        "glow": "0 0 40px -8px rgba(255, 182, 72, 0.4)",
        "glow-cyan": "0 0 40px -8px rgba(43, 200, 236, 0.35)",
        "glow-purple": "0 0 40px -8px rgba(168, 85, 247, 0.35)",
        "glass-inset": "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(20px, -30px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(-25px, 25px)" },
        },
        borderGlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 10s ease-in-out infinite",
        "float-slow": "floatSlow 14s ease-in-out infinite",
        "border-glow": "borderGlow 3s ease-in-out infinite",
      },
      typography: (theme: any) => ({
        invert: {
          css: {
            "--tw-prose-body": theme("colors.slate.300"),
            "--tw-prose-headings": theme("colors.white"),
            "--tw-prose-links": theme("colors.cyan.DEFAULT"),
            "--tw-prose-code": theme("colors.cyan.DEFAULT"),
            "--tw-prose-pre-bg": theme("colors.panel"),
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;