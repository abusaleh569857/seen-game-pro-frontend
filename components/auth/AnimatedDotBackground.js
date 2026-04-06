'use client';

import { motion } from 'framer-motion';

const FLOATING_DOTS = Array.from({ length: 40 }, (_, index) => ({
  id: index,
  width: 1 + ((index * 7) % 30) / 10,
  height: 1 + ((index * 11) % 30) / 10,
  left: (index * 19.37) % 100,
  top: (index * 13.91) % 100,
  duration: 2 + (index % 6) * 0.5,
}));

export default function AnimatedDotBackground({ className = '', opacityClass = 'opacity-20' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      {FLOATING_DOTS.map((dot) => (
        <motion.div
          key={dot.id}
          className={`absolute rounded-full bg-white ${opacityClass}`}
          style={{
            width: `${dot.width}px`,
            height: `${dot.height}px`,
            left: `${dot.left}%`,
            top: `${dot.top}%`,
          }}
          animate={{
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}
