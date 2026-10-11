'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const CursorFollower: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [hoveredInteractive, setHoveredInteractive] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, {
    stiffness: 340,
    damping: 28,
    mass: 0.4,
  });
  const springY = useSpring(cursorY, {
    stiffness: 340,
    damping: 28,
    mass: 0.4,
  });

  useEffect(() => {
    // Only enable on fine pointer devices (desktop)
    if (
      typeof window === 'undefined' ||
      !window.matchMedia('(pointer: fine)').matches
    ) {
      return;
    }

    const handlePointerMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement | null;
      const isClickable = Boolean(
        target?.closest('button, a, [role="button"], input, textarea, select')
      );
      setHoveredInteractive(isClickable);
    };

    const handlePointerLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [cursorX, cursorY, visible]);

  if (!visible) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        scale: hoveredInteractive ? 1.65 : 1,
        borderColor: hoveredInteractive
          ? 'rgba(92, 225, 230, 0.75)'
          : 'rgba(92, 225, 230, 0.32)',
        backgroundColor: hoveredInteractive
          ? 'rgba(92, 225, 230, 0.10)'
          : 'rgba(122, 134, 255, 0.04)',
      }}
      transition={{ duration: 0.18 }}
      className="pointer-events-none fixed top-0 left-0 z-50 hidden lg:block w-8 h-8 rounded-full border backdrop-blur-[1px] shadow-[0_0_24px_rgba(92,225,230,0.22)]"
    />
  );
};
