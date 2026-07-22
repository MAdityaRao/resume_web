import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FFFFFF",
        card: "#F4F4F5",
        border: "#E4E4E7",
        primary: "#18181B",
        secondary: "#71717A",
        "yellow-500": "#FACC15",
        "yellow-500-glow": "rgba(250, 204, 21, 0.2)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "clamp-hero": "clamp(3.5rem, 8vw, 10rem)",
        "clamp-h2": "clamp(2rem, 5vw, 4.5rem)",
      },
      boxShadow: {
        "glow": "0 0 40px -8px rgba(250, 204, 21, 0.2)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
