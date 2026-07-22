import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AmbientBackground from "@/components/Ambientbackground";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import ScrollPerformanceHandler from "@/components/ScrollPerformanceHandler";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Aditya — AI/ML Developer, Voice AI & LLM Systems",
  description:
    "Aditya builds production voice AI agents, LLM pipelines, and real-time conversational systems. Talk to a live voice agent built from this resume.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <CustomCursor />
        <AmbientBackground />
        <ScrollPerformanceHandler />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}