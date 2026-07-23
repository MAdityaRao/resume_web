'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: any) => {
      if (e.target.closest('a') || e.target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference hidden md:flex items-center justify-center rounded-full bg-white text-black font-bold text-[10px]"
      animate={{
        x: mousePos.x - (isHovering ? 32 : 12),
        y: mousePos.y - (isHovering ? 32 : 12),
        width: isHovering ? 64 : 24,
        height: isHovering ? 64 : 24,
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 300, mass: 0.5 }}
      style={{ backgroundColor: isHovering ? '#000000' : '#000000', color: '#FFFFFF' }}
    />
  );
}
