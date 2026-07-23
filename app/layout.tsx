import type { Metadata } from "next";
import "./globals.css";
import AmbientBackground from "@/components/Ambientbackground";
import CustomCursor from "@/components/CustomCursor";

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
    <html lang="en">
      <body>
        <CustomCursor />
        <AmbientBackground />
        {children}
      </body>
    </html>
  );
}