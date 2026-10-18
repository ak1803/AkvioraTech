'use client';

import React from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from 'motion/react';
import { ArrowRight, Sparkles, Cpu, Layers, Zap } from 'lucide-react';
import { PageRoute, ProcessStep, ServicePillar } from '../types/akviora';

export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const PAGE_TRANSITION_VARIANTS: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: EASE_OUT_EXPO,
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const STAGGER_CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.085,
      delayChildren: 0.05,
    },
  },
};

export const STAGGER_ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 115,
      damping: 19,
      mass: 0.8,
    },
  },
};

// Reusable Viewport Spring Reveal Wrapper
export const FadeUpReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}> = ({ children, className = '', delay = 0, yOffset = 24 }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -20px 0px' }}
      transition={{
        type: 'spring',
        stiffness: 115,
        damping: 20,
        mass: 0.8,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 1. Kinetic Staggered Word-by-Word Display Headline (Fluid and hardware-accelerated without 3D font jitter)
export const KineticHeadline: React.FC<{
  text: string;
  className?: string;
  as?: 'h1' | 'h2';
}> = ({ text, className = '', as = 'h1' }) => {
  const prefersReducedMotion = useReducedMotion();
  const Tag = as;
  const words = text.split(' ');

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          className="inline-block overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em] mr-[0.24em] last:mr-0"
        >
          <motion.span
            initial={{ opacity: 0, y: '30%' }}
            whileInView={{ opacity: 1, y: '0%' }}
            viewport={{ once: true, margin: '0px 0px -15px 0px' }}
            transition={{
              type: 'spring',
              stiffness: 140,
              damping: 22,
              mass: 0.7,
              delay: idx * 0.024,
            }}
            className="inline-block will-change-transform transform-gpu"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

// 2. Word-by-Word Statement Reveal Heading
export const ScrollWordScrub: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = '' }) => {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(' ');

  if (prefersReducedMotion) {
    return <h2 className={className}>{text}</h2>;
  }

  return (
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25, margin: '-30px' }}
      variants={{
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.045,
            delayChildren: 0.02,
          },
        },
      }}
      className={className}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={{
            hidden: {
              opacity: 0.15,
              y: 22,
              filter: 'blur(4px)',
            },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: {
                type: 'spring',
                stiffness: 130,
                damping: 18,
                mass: 0.8,
              },
            },
          }}
          className="inline-block mr-[0.26em] last:mr-0 will-change-[transform,opacity,filter]"
        >
          {word}
        </motion.span>
      ))}
    </motion.h2>
  );
};

// 3. Interactive 3D Tilt & Cursor Spotlight Bento Tile
export const SpotlightBentoTile: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
}> = ({ children, className = '', onClick, delay = 0 }) => {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const springRotateX = useSpring(tiltX, { stiffness: 180, damping: 22 });
  const springRotateY = useSpring(tiltY, { stiffness: 180, damping: 22 });

  const spotlightBg = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, rgba(92, 225, 230, 0.13), rgba(122, 134, 255, 0.06) 45%, transparent 80%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);

    const pctX = x / rect.width - 0.5;
    const pctY = y / rect.height - 0.5;
    tiltX.set(-pctY * 5);
    tiltY.set(pctX * 5);
  };

  const handlePointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -20px 0px' }}
      transition={{
        type: 'spring',
        stiffness: 115,
        damping: 20,
        mass: 0.8,
        delay,
      }}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      whileTap={onClick && !prefersReducedMotion ? { scale: 0.985 } : undefined}
      style={
        prefersReducedMotion
          ? undefined
          : {
              rotateX: springRotateX,
              rotateY: springRotateY,
              transformPerspective: 1100,
            }
      }
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`group relative overflow-hidden akviora-bento-tile p-6 sm:p-7 flex flex-col justify-between transition-colors hover:border-[#5CE1E6]/45 will-change-transform ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <motion.div
        aria-hidden="true"
        style={{ background: spotlightBg }}
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative z-10 flex flex-col justify-between h-full">
        {children}
      </div>
    </motion.div>
  );
};

// 4. Animated AI & System Pipeline Visualizer
export const CinematicPipelineVisualizer: React.FC<{
  onExploreAI?: () => void;
}> = ({ onExploreAI }) => {
  const nodes = [
    {
      id: '01',
      label: 'Client Touchpoints',
      sub: 'Web · WhatsApp · Portal',
      icon: Layers,
      color: '#5CE1E6',
    },
    {
      id: '02',
      label: 'Akviora AI Engine',
      sub: 'Context · Intent · Extraction',
      icon: Sparkles,
      color: '#7A86FF',
    },
    {
      id: '03',
      label: 'Workflow Automation',
      sub: 'CRM · ERP · Approvals',
      icon: Cpu,
      color: '#6AE3B4',
    },
    {
      id: '04',
      label: 'Live Business Impact',
      sub: 'Zero Manual Bottlenecks',
      icon: Zap,
      color: '#FFB86B',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
      className="my-12 select-none"
    >
      <div className="relative rounded-[28px] border border-[rgba(255,255,255,0.13)] bg-gradient-to-br from-white/[0.06] via-[#060B14]/90 to-white/[0.02] p-6 sm:p-9 overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#5CE1E6]">
              Akviora System Architecture · End-to-End Workflow
            </span>
          </div>
          {onExploreAI && (
            <motion.button
              type="button"
              whileHover={{ x: 4 }}
              onClick={onExploreAI}
              className="text-xs font-mono text-[#EAF4F8] hover:text-[#5CE1E6] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Launch Interactive Blueprint Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </div>

        <motion.div
          variants={STAGGER_CONTAINER_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="relative mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {nodes.map((node) => {
            const IconComponent = node.icon;
            return (
              <motion.div
                key={node.id}
                variants={STAGGER_ITEM_VARIANTS}
                whileHover={{ y: -5, scale: 1.01 }}
                className="relative rounded-2xl border border-white/10 bg-[#060B14]/80 p-5 flex flex-col justify-between hover:border-[#5CE1E6]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#8EA6B4]">
                    STEP {node.id}
                  </span>
                  <div
                    style={{
                      backgroundColor: `${node.color}18`,
                      borderColor: `${node.color}45`,
                    }}
                    className="w-9 h-9 rounded-xl border flex items-center justify-center"
                  >
                    <IconComponent
                      className="w-4 h-4"
                      style={{ color: node.color }}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="font-display text-lg font-medium text-[#EAF4F8]">
                    {node.label}
                  </div>
                  <div className="text-xs text-[#8EA6B4] mt-1">{node.sub}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

// 5. Horizontal Scroll Services Showcase (Responsive stack on mobile, smooth sticky horizontal scroll on md+)
export const HorizontalServicesShowcase: React.FC<{
  services: ServicePillar[];
  onNavigate: (page: PageRoute) => void;
  onAskAI: (prompt: string) => void;
}> = ({ services, onNavigate, onAskAI }) => {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const sectionEl = sectionRef.current;
    const trackEl = trackRef.current;
    if (!sectionEl || !trackEl) return;

    let rafId = 0;
    let currentX = 0;
    let targetX = 0;
    let isAnimating = false;

    const computeTarget = () => {
      if (window.innerWidth < 768) {
        targetX = 0;
        currentX = 0;
        trackEl.style.transform = 'none';
        return;
      }
      const rect = sectionEl.getBoundingClientRect();
      const maxScroll = Math.max(1, sectionEl.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / maxScroll));
      const viewportWidth =
        document.documentElement.clientWidth || window.innerWidth;
      const maxTranslate = Math.max(
        0,
        trackEl.scrollWidth - viewportWidth + 48
      );
      targetX = -progress * maxTranslate;
    };

    const tick = () => {
      if (window.innerWidth < 768) {
        trackEl.style.transform = 'none';
        isAnimating = false;
        return;
      }
      const diff = targetX - currentX;
      if (Math.abs(diff) > 0.15) {
        currentX += diff * 0.09;
        trackEl.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
        rafId = requestAnimationFrame(tick);
      } else {
        currentX = targetX;
        trackEl.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
        isAnimating = false;
      }
    };

    const onScrollOrResize = () => {
      computeTarget();
      if (window.innerWidth >= 768 && !isAnimating) {
        isAnimating = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    computeTarget();
    currentX = targetX;
    if (window.innerWidth >= 768) {
      trackEl.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
    } else {
      trackEl.style.transform = 'none';
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [services.length]);

  return (
    <section
      id="services"
      ref={sectionRef}
      aria-label="Services"
      className="relative py-12 md:py-0 md:h-[215vh]"
    >
      <div className="md:sticky md:top-0 md:h-[100svh] md:overflow-hidden overflow-visible flex flex-col md:justify-center">
        <FadeUpReveal className="px-4 sm:px-8 lg:px-12 max-w-[1440px] w-full mx-auto mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#5CE1E6] mb-2 uppercase tracking-wider">
              Core Capabilities &amp; Architecture
            </div>
            <KineticHeadline
              as="h2"
              text="One technology partner. Multiple ways to grow."
              className="font-display text-[clamp(28px,4.4vw,64px)] max-w-[18ch] text-[#EAF4F8]"
            />
          </div>

          <motion.button
            type="button"
            whileHover={{ x: 4 }}
            onClick={() => onNavigate('services')}
            className="text-sm text-[#5CE1E6] border-b border-[#5CE1E6] pb-1 hover:text-[#EAF4F8] transition-colors cursor-pointer whitespace-nowrap self-start sm:self-end"
          >
            View All Services Architecture →
          </motion.button>
        </FadeUpReveal>

        <div
          ref={trackRef}
          className="flex flex-col md:flex-row gap-4 sm:gap-5 md:gap-7 px-4 sm:px-8 lg:px-12 w-full md:w-max md:will-change-transform"
        >
          {services.map((srv, idx) => (
            <motion.article
              key={srv.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -20px 0px' }}
              transition={{
                type: 'spring',
                stiffness: 110,
                damping: 20,
                delay: idx * 0.05,
              }}
              whileHover={{ y: -4 }}
              style={{ '--c': srv.accentColor } as React.CSSProperties}
              className="akviora-service-panel w-full md:w-[min(78vw,520px)] shrink-0 p-5 sm:p-8 md:p-10 min-h-[260px] md:min-h-[340px] flex flex-col justify-between group will-change-transform"
            >
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#8EA6B4] font-mono tabular-nums">
                <span>
                  {srv.number} · {srv.title}
                </span>
                <span>Timeline · {srv.timeline}</span>
              </div>

              <div className="relative z-10 mt-6">
                <h3 className="font-display text-[clamp(24px,2.8vw,38px)] text-[#EAF4F8] group-hover:text-[#5CE1E6] transition-colors">
                  {srv.title}
                </h3>
                <p className="text-[#b8cdd8] mt-3 mb-6 text-sm sm:text-base leading-relaxed">
                  {srv.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => onNavigate(srv.targetPage)}
                    className="text-[#EAF4F8] border-b-[1.5px] border-[#5CE1E6] pb-1 hover:text-[#5CE1E6] transition-colors inline-flex items-center gap-1.5 text-sm font-medium cursor-pointer"
                  >
                    <span>Explore {srv.title}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onAskAI(
                        `How can Akviora help my business with ${srv.title}?`
                      )
                    }
                    className="text-xs text-[#8EA6B4] hover:text-[#5CE1E6] transition-colors cursor-pointer"
                  >
                    Ask AI Architect →
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

// 6. Scroll-Linked 3D Alternating Process Timeline with Interactive Stage Scrubber & Plasma Conduit
const ProcessStepCard: React.FC<{
  stepItem: ProcessStep;
  index: number;
  isActive: boolean;
  onActivate: (index: number) => void;
  prefersReducedMotion: boolean | null;
}> = ({ stepItem, index, isActive, onActivate, prefersReducedMotion }) => {
  const isEven = index % 2 === 0;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const springRotateX = useSpring(tiltX, { stiffness: 190, damping: 22 });
  const springRotateY = useSpring(tiltY, { stiffness: 190, damping: 22 });

  const spotlightBg = useMotionTemplate`radial-gradient(360px circle at ${mouseX}px ${mouseY}px, rgba(92, 225, 230, 0.16), rgba(122, 134, 255, 0.08) 45%, transparent 80%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);

    const pctX = x / rect.width - 0.5;
    const pctY = y / rect.height - 0.5;
    tiltX.set(-pctY * 6);
    tiltY.set(pctX * 6);
  };

  const handlePointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.div
      id={`process-step-${stepItem.step}`}
      onViewportEnter={() => onActivate(index)}
      viewport={{ amount: 0.35, margin: '0px 0px -15% 0px' }}
      className={`relative grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-14 ${
        index === 0 ? 'pt-2' : 'pt-6 md:pt-12'
      }`}
    >
      {/* Central Timeline Node & Concentric Sonar Pulse */}
      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-10 md:top-1/2 md:-translate-y-1/2 z-20 flex items-center justify-center">
        {isActive && !prefersReducedMotion && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: [1, 2.1, 1], opacity: [0.75, 0, 0.75] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-7 h-7 rounded-full bg-[#5CE1E6]/30 pointer-events-none"
          />
        )}
        <motion.button
          type="button"
          onClick={() => onActivate(index)}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.94 }}
          aria-label={`Select step ${stepItem.step}: ${stepItem.title}`}
          className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
            isActive
              ? 'bg-[#5CE1E6] border-[#EAF4F8] text-[#041019] shadow-[0_0_20px_rgba(92,225,230,0.85)]'
              : 'bg-[#060B14] border-[#5CE1E6]/50 text-[#8EA6B4] hover:border-[#5CE1E6]'
          }`}
        >
          0{stepItem.step}
        </motion.button>
      </div>

      {/* Horizontal Laser Connector Beam (Desktop) */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        style={{ originX: isEven ? 1 : 0 }}
        className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[1.5px] w-8 z-10 ${
          isEven
            ? 'right-1/2 mr-4 bg-gradient-to-l from-[#5CE1E6] to-transparent'
            : 'left-1/2 ml-4 bg-gradient-to-r from-[#5CE1E6] to-transparent'
        }`}
      />

      {/* Responsive Step Card Container */}
      <div
        className={`pl-11 pr-1 sm:pl-12 sm:pr-0 ${
          isEven
            ? 'md:col-start-1 md:pr-8'
            : 'md:col-start-2 md:pl-8'
        }`}
      >
        <motion.div
          initial={
            prefersReducedMotion
              ? false
              : {
                  opacity: 0,
                  y: 24,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -15px 0px' }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 20,
            mass: 0.8,
          }}
          whileHover={prefersReducedMotion ? undefined : { y: -4 }}
          style={
            prefersReducedMotion
              ? undefined
              : {
                  rotateX: springRotateX,
                  rotateY: springRotateY,
                  transformPerspective: 1100,
                }
          }
          onClick={() => onActivate(index)}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className={`group relative overflow-hidden rounded-[24px] border p-5 sm:p-7 transition-colors cursor-pointer will-change-transform ${
            isActive
              ? 'border-[#5CE1E6]/65 bg-gradient-to-br from-[#5CE1E6]/[0.11] via-[#0B1526]/95 to-[#7A86FF]/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.55),0_0_30px_rgba(92,225,230,0.12)]'
              : 'border-white/10 bg-white/[0.025] hover:border-[#5CE1E6]/40'
          }`}
        >
          {/* Pointer-tracking radial spotlight */}
          <motion.div
            aria-hidden="true"
            style={{ background: spotlightBg }}
            className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5CE1E6]">
                <span className="w-2 h-2 rounded-full bg-[#5CE1E6] animate-pulse" />
                Stage 0{stepItem.step}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono tabular-nums border border-white/10 bg-[#060B14]/70 text-[#8EA6B4]">
                {stepItem.duration}
              </span>
            </div>

            <h3 className="font-display text-[clamp(22px,2.6vw,34px)] font-medium text-[#EAF4F8] group-hover:text-[#5CE1E6] transition-colors leading-tight">
              {stepItem.title}
            </h3>

            <p className="text-[#b8cdd8] mt-2.5 text-sm sm:text-base leading-relaxed">
              {stepItem.description}
            </p>

            {/* Animated Deliverable & Sweeping Completion Bar */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-mono text-[#8EA6B4] mb-2">
                <span className="uppercase tracking-wider text-[10px] text-[#5CE1E6]/90">
                  Verified Deliverable
                </span>
                <span className="text-[#EAF4F8] font-medium truncate max-w-full sm:max-w-none">
                  {stepItem.deliverable}
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: isActive ? 1 : 0.65 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
                  className="h-full origin-left bg-gradient-to-r from-[#5CE1E6] via-[#7A86FF] to-[#5CE1E6]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const ScrollProcessTimeline: React.FC<{
  steps: ProcessStep[];
}> = ({ steps }) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const progressRatio = (activeStep + 1) / steps.length;
  const orbPercent = `${(activeStep / Math.max(steps.length - 1, 1)) * 100}%`;

  const handleStageSelect = (idx: number) => {
    setActiveStep(idx);
    const stepEl = document.getElementById(`process-step-${steps[idx]?.step}`);
    if (stepEl) {
      stepEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div
      className="relative mt-10 sm:mt-14 mx-auto"
    >
      {/* Interactive 8-Stage Scrubber Bar with Shared layoutId Spotlight */}
      <div className="mb-10 sm:mb-14 rounded-2xl border border-white/10 bg-[#060B14]/85 backdrop-blur-md p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-3 mb-3 border-b border-white/10 text-xs font-mono">
          <span className="text-[#5CE1E6] uppercase tracking-wider">
            Interactive Lifecycle Scrubber · Stage 0{activeStep + 1} of 0{steps.length}
          </span>
          <span className="text-[#8EA6B4]">
            Active Deliverable:{' '}
            <strong className="text-[#EAF4F8] font-normal">
              {steps[activeStep]?.deliverable}
            </strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
          {steps.map((st, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <button
                key={st.step}
                type="button"
                onClick={() => handleStageSelect(idx)}
                className={`relative px-3 py-2 rounded-xl text-left transition-colors cursor-pointer overflow-hidden ${
                  isCurrent
                    ? 'text-[#041019] font-semibold'
                    : 'text-[#8EA6B4] hover:text-[#EAF4F8] bg-white/[0.02]'
                }`}
              >
                {isCurrent && (
                  <motion.span
                    layoutId="process-stage-scrubber-pill"
                    transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5CE1E6] to-[#7A86FF]"
                  />
                )}
                <span className="relative z-10 block text-[10px] font-mono opacity-80">
                  0{st.step}
                </span>
                <span className="relative z-10 block text-xs truncate">
                  {st.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alternating 3D Cards + Central Scroll-Driven Plasma Spine */}
      <div className="relative pb-6">
        {/* Static background conduit track */}
        <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/10" />

        {/* Scroll-driven glowing energy beam */}
        <motion.div
          animate={{ scaleY: progressRatio }}
          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
          className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] origin-top bg-gradient-to-b from-[#5CE1E6] via-[#7A86FF] to-[#5CE1E6] shadow-[0_0_16px_rgba(92,225,230,0.8)]"
        />

        {/* Traveling scroll-linked plasma orb */}
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            animate={{ top: orbPercent }}
            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
            className="pointer-events-none absolute left-4 md:left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-4 h-4 rounded-full bg-[#EAF4F8] shadow-[0_0_24px_6px_rgba(92,225,230,0.9)]"
          />
        )}

        {steps.map((st, idx) => (
          <ProcessStepCard
            key={st.step}
            stepItem={st}
            index={idx}
            isActive={activeStep === idx}
            onActivate={setActiveStep}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </div>
  );
};

