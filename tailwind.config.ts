import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0D14",
        elevated: "#10141D",
        panel: "#141924",
        border: "#232A38",
        ink: "#F2F5F8",
        muted: "#8D98A8",
        faint: "#5B6577",
        violet: "#7C6CFF",
        cyan: {
          DEFAULT: "#2BC8EC",
          dim: "#1D4C5C",
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
    },
  },
  plugins: [],
};
export default config;