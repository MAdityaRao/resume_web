"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <motion.div whileHover={{ x: -3 }} className="inline-block mb-8">
      <Link
        href="/#work"
        className="inline-flex items-center gap-2 glass-pill rounded-full px-4 py-2 text-slate-300 hover:text-terracotta transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>
    </motion.div>
  );
}