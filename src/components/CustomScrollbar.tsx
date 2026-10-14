'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';

export const CustomScrollbar: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(56);
  const [trackHeight, setTrackHeight] = useState(0);
  const [isScrollable, setIsScrollable] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const dragStartYRef = useRef(0);
  const dragStartScrollTopRef = useRef(0);
  const scrollTimeoutRef = useRef<number | null>(null);

  const updateMetrics = useCallback(() => {
    if (typeof window === 'undefined') return;
    const doc = document.documentElement;
    const body = document.body;
    const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
    const scrollHeight = Math.max(
      doc.scrollHeight,
      body.scrollHeight,
      doc.offsetHeight,
      body.offsetHeight
    );
    const clientHeight = window.innerHeight || doc.clientHeight;
    const maxScroll = Math.max(0, scrollHeight - clientHeight);

    const scrollable = maxScroll > 8;
    setIsScrollable(scrollable);

    const progress =
      maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
    setScrollProgress(progress);

    if (trackRef.current) {
      const currentTrackHeight = trackRef.current.clientHeight;
      setTrackHeight(currentTrackHeight);
      if (currentTrackHeight > 0 && scrollHeight > 0) {
        const ratio = clientHeight / scrollHeight;
        const calculatedThumb = Math.max(
          40,
          Math.min(currentTrackHeight * 0.65, currentTrackHeight * ratio)
        );
        setThumbHeight(calculatedThumb);
      }
    }
  }, []);

  useEffect(() => {
    updateMetrics();

    const handleScroll = () => {
      updateMetrics();
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 900);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateMetrics, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateMetrics();
      });
      resizeObserver.observe(document.documentElement);
      resizeObserver.observe(document.body);
      if (trackRef.current) {
        resizeObserver.observe(trackRef.current);
      }
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateMetrics);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [updateMetrics]);

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      e.preventDefault();
      const doc = document.documentElement;
      const body = document.body;
      const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);
      const clientHeight = window.innerHeight || doc.clientHeight;
      const maxScroll = Math.max(0, scrollHeight - clientHeight);
      const availableTrack = Math.max(1, trackHeight - thumbHeight);

      const deltaY = e.clientY - dragStartYRef.current;
      const scrollDelta = (deltaY / availableTrack) * maxScroll;
      const nextScrollTop = Math.min(
        maxScroll,
        Math.max(0, dragStartScrollTopRef.current + scrollDelta)
      );

      window.scrollTo({
        top: nextScrollTop,
        behavior: 'instant' as ScrollBehavior,
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
    };

    window.addEventListener('pointermove', handlePointerMove, {
      passive: false,
    });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging, trackHeight, thumbHeight]);

  const handleThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    dragStartYRef.current = e.clientY;
    dragStartScrollTopRef.current =
      window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.userSelect = 'none';
    setIsDragging(true);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || isDragging) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const availableTrack = Math.max(1, rect.height - thumbHeight);
    const targetThumbTop = Math.min(
      availableTrack,
      Math.max(0, clickY - thumbHeight / 2)
    );
    const targetRatio = targetThumbTop / availableTrack;

    const doc = document.documentElement;
    const body = document.body;
    const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);
    const clientHeight = window.innerHeight || doc.clientHeight;
    const maxScroll = Math.max(0, scrollHeight - clientHeight);

    window.scrollTo({
      top: targetRatio * maxScroll,
      behavior: 'smooth',
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isScrollable) return null;

  const maxThumbOffset = Math.max(0, trackHeight - thumbHeight);
  const thumbOffset = scrollProgress * maxThumbOffset;
  const percent = Math.round(scrollProgress * 100);
  const showReadout = isHovered || isDragging || isScrolling;

  return (
    <div
      aria-hidden="true"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="hidden md:flex fixed right-2.5 top-[68px] bottom-[84px] z-40 flex-col items-center gap-2 select-none"
    >
      {/* Quick Scroll-to-Top Trigger */}
      <button
        type="button"
        onClick={scrollToTop}
        tabIndex={-1}
        title="Scroll to top"
        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
          scrollProgress > 0.08
            ? 'opacity-100 scale-100 bg-[#08101E]/90 border-[#5CE1E6]/40 text-[#5CE1E6] hover:bg-[#5CE1E6] hover:text-[#04121c] shadow-[0_0_12px_rgba(92,225,230,0.35)]'
            : 'opacity-0 scale-75 pointer-events-none border-transparent text-transparent'
        }`}
      >
        <ChevronUp className="w-3 h-3 stroke-[2.5]" />
      </button>

      {/* Interactive Scrollbar Hit Area + Glassmorphic Theme Track */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        className="relative flex-1 w-5 flex justify-center cursor-pointer group"
      >
        {/* Outer Track Capsule */}
        <div
          className={`relative h-full rounded-full bg-[#060B14]/85 backdrop-blur-md border transition-all duration-200 overflow-hidden ${
            isHovered || isDragging
              ? 'w-[9px] border-[#5CE1E6]/40 shadow-[0_0_18px_rgba(92,225,230,0.2)]'
              : 'w-[6px] border-[rgba(255,255,255,0.12)]'
          }`}
        >
          {/* Subtle Track Progress Fill Above Thumb */}
          <div
            style={{ height: `${thumbOffset + thumbHeight / 2}px` }}
            className="w-full bg-gradient-to-b from-[#5CE1E6]/20 via-[#7A86FF]/20 to-transparent pointer-events-none"
          />

          {/* Section Tick Marks */}
          <span className="absolute left-0 right-0 top-1/4 h-[1px] bg-white/10 pointer-events-none" />
          <span className="absolute left-0 right-0 top-2/4 h-[1px] bg-white/10 pointer-events-none" />
          <span className="absolute left-0 right-0 top-3/4 h-[1px] bg-white/10 pointer-events-none" />
        </div>

        {/* Draggable Theme Gradient Thumb */}
        <div
          onPointerDown={handleThumbPointerDown}
          style={{
            height: `${thumbHeight}px`,
            transform: `translate3d(0, ${thumbOffset}px, 0)`,
          }}
          className={`absolute top-0 rounded-full bg-gradient-to-b from-[#5CE1E6] via-[#7A86FF] to-[#5CE1E6] transition-[width,box-shadow] duration-150 cursor-grab active:cursor-grabbing flex items-center justify-center ${
            isHovered || isDragging
              ? 'w-[9px] shadow-[0_0_16px_rgba(92,225,230,0.85),0_0_28px_rgba(122,134,255,0.55)]'
              : 'w-[6px] shadow-[0_0_10px_rgba(92,225,230,0.5)]'
          }`}
        >
          <span
            className={`w-[2px] h-3 rounded-full bg-[#04121c]/60 transition-opacity duration-150 ${
              isHovered || isDragging ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* Live Percentage Readout Pill Next to Thumb */}
        <div
          style={{
            transform: `translate3d(0, ${Math.min(
              Math.max(0, trackHeight - 24),
              Math.max(0, thumbOffset + thumbHeight / 2 - 11)
            )}px, 0)`,
          }}
          className={`pointer-events-none absolute right-6 top-0 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#08101E]/95 border border-[#5CE1E6]/40 text-[#EAF4F8] font-mono text-[10px] tabular-nums shadow-[0_4px_16px_rgba(0,0,0,0.65)] transition-opacity duration-200 ${
            showReadout ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#5CE1E6] shadow-[0_0_6px_#5CE1E6]" />
          <span>{percent}%</span>
        </div>
      </div>
    </div>
  );
};
