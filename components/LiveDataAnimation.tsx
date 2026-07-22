"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LiveDataAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="relative w-full h-full bg-black/20" />;

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black/20 overflow-hidden">
      {/* Animated Grid Dots */}
      <div className="absolute inset-0 opacity-20"
           style={{ backgroundImage: 'radial-gradient(#C05C43 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* Flowing Particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-500 rounded-full"
          initial={{ x: -100, y: Math.random() * 200 - 100 }}
          animate={{ x: 300, opacity: [0, 1, 0] }}
          transition={{ duration: 3, delay: i * 1, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}
