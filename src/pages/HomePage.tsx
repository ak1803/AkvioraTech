import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Cpu, Sparkles } from 'lucide-react';
import {
  AssistantPersonaId,
  CaseStudy,
  PageRoute,
} from '../types/akviora';
import {
  AI_ASSISTANTS,
  CASE_STUDIES,
  CLIENT_TESTIMONIALS,
  MARQUEE_ITEMS,
  PAIN_POINTS,
  PROCESS_STEPS,
  SERVICE_PILLARS,
  WHY_AKVIORA_ITEMS,
} from '../data/akvioraData';
import {
  FadeUpReveal,
  HorizontalServicesShowcase,
  KineticHeadline,
  ScrollProcessTimeline,
  ScrollWordScrub,
  SpotlightBentoTile,
  STAGGER_CONTAINER_VARIANTS,
  STAGGER_ITEM_VARIANTS,
} from '../components/CinematicScroll';
import { MagneticButton } from '../components/MagneticButton';
import {
  HomePageSkeleton,
  usePageContentLoading,
} from '../components/ShimmerSkeleton';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onOpenAssistantWithPrompt: (prompt: string, persona?: AssistantPersonaId) => void;
  onSelectCaseStudy: (study: CaseStudy) => void;
  isLoading?: boolean;
}

const PAIN_POINT_SOLUTIONS: Record<
  string,
  { metric: string; fix: string; prompt: string }
> = {
  'Scattered information': {
    metric: '100% Unified Single Source',
    fix: 'Centralized web portals and knowledge systems that connect spreadsheets, documents, and team updates in one searchable hub.',
    prompt:
      'Our business has scattered information across spreadsheets and messages. How can Akviora centralize our workflow?',
  },
  'Hard-to-track processes': {
    metric: '3.2x Faster Turnaround',
    fix: 'Role-based operational dashboards and automated stage tracking so every task, approval, and handoff is visible in real time.',
    prompt:
      'We have hard-to-track internal processes and handoffs. What custom web app or workflow system should we build?',
  },
  'Repetitive manual work': {
    metric: '18+ Hours Saved Weekly',
    fix: 'Event-driven webhook & Akviora AI automation that extracts documents, updates CRMs, and triggers follow-ups.',
    prompt:
      'We spend too much time on repetitive manual data entry and follow-ups. How can Akviora automate this with AI?',
  },
  'Customers waiting for answers': {
    metric: '<30s Instant AI Response',
    fix: '24/7 Akviora AI customer & WhatsApp assistants trained on your verified business data to qualify leads and resolve inquiries.',
    prompt:
      'Our customers wait too long for answers and quotes. How can an Akviora AI assistant automate our customer responses?',
  },
  'Little visibility for owners': {
    metric: 'Real-Time KPI Telemetry',
    fix: 'Live executive analytics dashboards uniting revenue pipelines, team throughput, and operational bottlenecks at a glance.',
    prompt:
      'As a business owner, I lack real-time visibility into operations and revenue metrics. What dashboard system can Akviora build?',
  },
};

const WhyAkvioraSection: React.FC = () => {
  const [activeWhyIndex, setActiveWhyIndex] = React.useState<number>(0);
  const progressRatio = (activeWhyIndex + 1) / WHY_AKVIORA_ITEMS.length;

  return (
    <section
      className="relative grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-6 sm:gap-8 md:gap-6 lg:gap-[6vw] max-w-[1320px] mx-auto py-12 sm:py-14 md:py-10 lg:py-[14vh] px-4 sm:px-8 lg:px-12"
    >
      {/* Sticky Left Column (pinned on scroll without transform clipping) */}
      <div className="lg:sticky lg:top-[20vh] lg:self-start space-y-6 md:space-y-4 lg:space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#5CE1E6] tracking-wider uppercase">
            04 · PRINCIPLES &amp; CLARITY
          </span>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-mono text-[#8EA6B4]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5CE1E6] animate-pulse" />
            <span>
              Stage 0{activeWhyIndex + 1} / 0{WHY_AKVIORA_ITEMS.length}
            </span>
          </div>
        </div>

        <KineticHeadline
          as="h2"
          text="Technology should create clarity, not complexity."
          className="font-display text-[clamp(28px,4.8vw,68px)] text-[#EAF4F8] leading-[1.05]"
        />

        <p className="text-[#8EA6B4] max-w-[40ch] text-sm sm:text-base leading-relaxed">
          Every system we ship is engineered to reduce operational friction
          and give founders measurable visibility.
        </p>

        {/* On-Scroll Progress Track & Stage Indicators */}
        <div className="pt-2 hidden lg:block space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8EA6B4]">
            <span>On-Scroll Principle Track</span>
            <span className="text-[#5CE1E6] tabular-nums">
              {Math.round(((activeWhyIndex + 1) / WHY_AKVIORA_ITEMS.length) * 100)}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              animate={{ scaleX: progressRatio }}
              transition={{ type: 'spring', stiffness: 140, damping: 22 }}
              className="h-full origin-left bg-gradient-to-r from-[#5CE1E6] via-[#7A86FF] to-[#5CE1E6] shadow-[0_0_12px_rgba(92,225,230,0.8)]"
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            {WHY_AKVIORA_ITEMS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setActiveWhyIndex(i);
                  const el = document.getElementById(`why-item-${i}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeWhyIndex === i
                    ? 'w-8 bg-[#5CE1E6] shadow-[0_0_8px_rgba(92,225,230,0.8)]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Jump to principle ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Scroll-Reactive Principles */}
      <div className="relative space-y-2.5 md:space-y-2 lg:space-y-2.5">
        {WHY_AKVIORA_ITEMS.map((item, idx) => {
          const isActive = activeWhyIndex === idx;
          return (
            <motion.div
              id={`why-item-${idx}`}
              key={item.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              onViewportEnter={() => setActiveWhyIndex(idx)}
              viewport={{ amount: 0.55, margin: '-10% 0px -25% 0px' }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 20,
                delay: idx * 0.04,
              }}
              whileHover={{ x: 6 }}
              onClick={() => setActiveWhyIndex(idx)}
              className={`group relative py-6 px-5 sm:py-7 sm:px-6 md:py-4 md:px-5 lg:py-7 lg:px-6 rounded-2xl border transition-all cursor-pointer will-change-transform ${
                isActive
                  ? 'border-[#5CE1E6]/40 bg-gradient-to-r from-[#5CE1E6]/[0.08] via-white/[0.02] to-transparent shadow-[0_10px_30px_rgba(0,0,0,0.3)]'
                  : 'border-white/10 bg-transparent hover:border-white/20'
              }`}
            >
              {/* Active indicator vertical glowing bar */}
              <div
                className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-b from-[#5CE1E6] to-[#7A86FF] opacity-100 shadow-[0_0_12px_rgba(92,225,230,0.9)]'
                    : 'bg-white/10 opacity-0 group-hover:opacity-60'
                }`}
              />

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`text-xs font-mono font-semibold tabular-nums transition-colors ${
                        isActive ? 'text-[#5CE1E6]' : 'text-[#8EA6B4]'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8EA6B4]/80">
                      Principle
                    </span>
                  </div>

                  <b
                    className={`font-display font-medium text-[clamp(21px,2.4vw,32px)] tracking-[-0.02em] block transition-colors ${
                      isActive
                        ? 'text-[#EAF4F8]'
                        : 'text-[#EAF4F8]/85 group-hover:text-[#EAF4F8]'
                    }`}
                  >
                    {item.title}
                  </b>

                  <p className="text-[#8EA6B4] text-sm sm:text-base mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <span
                  className={`mt-1 w-6 h-6 rounded-full border flex items-center justify-center text-xs transition-colors shrink-0 ${
                    isActive
                      ? 'border-[#5CE1E6] text-[#5CE1E6] bg-[#5CE1E6]/10 shadow-[0_0_8px_rgba(92,225,230,0.4)]'
                      : 'border-white/15 text-[#8EA6B4] group-hover:border-white/30'
                  }`}
                >
                  →
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenAssistantWithPrompt,
  onSelectCaseStudy,
  isLoading = false,
}) => {
  const statementSectionRef = React.useRef<HTMLElement | null>(null);
  const [activePainPoint, setActivePainPoint] = React.useState<string>(
    'Repetitive manual work'
  );

  const showSkeleton = usePageContentLoading(isLoading, 240);

  const activePainDetail =
    PAIN_POINT_SOLUTIONS[activePainPoint] ||
    PAIN_POINT_SOLUTIONS['Repetitive manual work'];

  if (showSkeleton) {
    return <HomePageSkeleton />;
  }

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="min-h-[100svh] md:min-h-0 lg:min-h-[100svh] flex items-center pt-24 sm:pt-28 md:pt-16 md:pb-8 lg:pt-28 lg:pb-16 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.95fr] gap-8 sm:gap-10 md:gap-6 lg:gap-10 items-center w-full">
          <div className="min-w-0">
            <KineticHeadline
              text="Technology built around the way your business works."
              className="font-display font-bold text-[clamp(36px,8.5vw,64px)] lg:text-[clamp(58px,5.6vw,100px)] xl:text-[84px] 2xl:text-[100px] leading-[1.02] tracking-[-0.035em] text-[#EAF4F8] break-words"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#b8cdd8] max-w-[54ch] text-[15px] sm:text-[17px] leading-[1.6] mt-5 sm:mt-7 md:mt-4 lg:mt-7"
            >
              Akviora Technologies designs and builds modern web applications,
              AI-powered workflows, and custom automation systems for growing
              teams—uniting product strategy, UI/UX, and full-stack engineering
              in one technology partner.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-4 sm:gap-7 md:gap-4 lg:gap-7 items-center mt-6 sm:mt-8 md:mt-5 lg:mt-8"
            >
              <MagneticButton
                variant="gradient"
                magnetic
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto px-5 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base"
              >
                Start a Project
              </MagneticButton>

              <motion.button
                type="button"
                whileHover={{ x: 4 }}
                onClick={() => onNavigate('work')}
                className="text-[#EAF4F8] border-b-[1.5px] border-[#5CE1E6] pb-1 hover:text-[#5CE1E6] transition-colors cursor-pointer font-medium whitespace-nowrap shrink-0"
              >
                Explore Our Work
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ x: 4 }}
                onClick={() =>
                  onOpenAssistantWithPrompt(
                    'Help me identify what digital system or AI automation my business should build first.'
                  )
                }
                className="text-sm text-[#8EA6B4] hover:text-[#5CE1E6] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Consult Akviora AI Assistant →
              </motion.button>
            </motion.div>
          </div>

          {/* Right-side Realistic Animated Vector Metrics & Architecture Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 26 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 20,
              delay: 0.16,
            }}
            className="relative w-full max-w-[660px] mx-auto lg:max-w-none select-none mt-2 lg:mt-0"
          >
            <div className="absolute -inset-6 rounded-full bg-[radial-gradient(circle_at_55%_45%,rgba(92,225,230,0.16),rgba(122,134,255,0.12)_48%,transparent_72%)] blur-2xl pointer-events-none" />

            <svg
              viewBox="0 0 660 540"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Animated vector illustration of real-time business growth metrics, AI workflow automation, and system performance"
              className="relative w-full h-auto overflow-visible drop-shadow-[0_28px_60px_rgba(0,0,0,0.65)]"
            >
              <defs>
                {/* Ambient & Surface Gradients */}
                <linearGradient id="akvGlassSurface" x1="60" y1="40" x2="580" y2="480" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0E192D" stopOpacity="0.95" />
                  <stop offset="55%" stopColor="#08101E" stopOpacity="0.92" />
                  <stop offset="100%" stopColor="#050A14" stopOpacity="0.96" />
                </linearGradient>

                <linearGradient id="akvCardFloat" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#122138" stopOpacity="0.96" />
                  <stop offset="100%" stopColor="#070E1B" stopOpacity="0.96" />
                </linearGradient>

                <linearGradient id="akvBorderStroke" x1="0" y1="0" x2="660" y2="540" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#5CE1E6" stopOpacity="0.55" />
                  <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#7A86FF" stopOpacity="0.45" />
                </linearGradient>

                <linearGradient id="akvCyanLine" x1="120" y1="210" x2="540" y2="150" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#7A86FF" />
                  <stop offset="50%" stopColor="#5CE1E6" />
                  <stop offset="100%" stopColor="#9AF5F8" />
                </linearGradient>

                <linearGradient id="akvAreaFill" x1="330" y1="145" x2="330" y2="335" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#5CE1E6" stopOpacity="0.34" />
                  <stop offset="60%" stopColor="#7A86FF" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#060B14" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="akvBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5CE1E6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#7A86FF" stopOpacity="0.25" />
                </linearGradient>

                <linearGradient id="akvGaugeGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#5CE1E6" />
                  <stop offset="100%" stopColor="#7A86FF" />
                </linearGradient>

                <radialGradient id="akvGridMaskGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="30%" stopColor="white" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>

                <mask id="akvGridMask">
                  <rect width="660" height="540" fill="url(#akvGridMaskGrad)" />
                </mask>

                <filter id="akvGlow" x="-25%" y="-25%" width="150%" height="150%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                <filter id="akvCardShadow" x="-15%" y="-15%" width="130%" height="140%">
                  <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000000" floodOpacity="0.65" />
                </filter>
              </defs>

              {/* Subtle Architectural Grid Backdrop */}
              <g mask="url(#akvGridMask)" stroke="#5CE1E6" strokeOpacity="0.14" strokeWidth="1">
                <line x1="60" y1="80" x2="600" y2="80" />
                <line x1="60" y1="150" x2="600" y2="150" />
                <line x1="60" y1="220" x2="600" y2="220" />
                <line x1="60" y1="290" x2="600" y2="290" />
                <line x1="60" y1="360" x2="600" y2="360" />
                <line x1="60" y1="430" x2="600" y2="430" />
                <line x1="120" y1="30" x2="120" y2="500" />
                <line x1="210" y1="30" x2="210" y2="500" />
                <line x1="300" y1="30" x2="300" y2="500" />
                <line x1="390" y1="30" x2="390" y2="500" />
                <line x1="480" y1="30" x2="480" y2="500" />
                <line x1="570" y1="30" x2="570" y2="500" />
              </g>

              {/* ================= MAIN ANALYTICS & METRICS CANVAS ================= */}
              <g filter="url(#akvCardShadow)">
                <rect
                  x="76"
                  y="56"
                  width="500"
                  height="364"
                  rx="22"
                  fill="url(#akvGlassSurface)"
                  stroke="url(#akvBorderStroke)"
                  strokeWidth="1.25"
                />
                {/* Top specular edge */}
                <line
                  x1="100"
                  y1="56.75"
                  x2="552"
                  y2="56.75"
                  stroke="#5CE1E6"
                  strokeOpacity="0.5"
                  strokeWidth="1.25"
                />

                {/* Window Header Bar */}
                <circle cx="104" cy="82" r="4.5" fill="#FF5F56" fillOpacity="0.8" />
                <circle cx="120" cy="82" r="4.5" fill="#FFBD2E" fillOpacity="0.8" />
                <circle cx="136" cy="82" r="4.5" fill="#27C93F" fillOpacity="0.8" />
                <text
                  x="156"
                  y="86"
                  fill="#8EA6B4"
                  fontSize="11"
                  fontFamily="JetBrains Mono, monospace"
                  letterSpacing="0.06em"
                >
                  AKVIORA TELEMETRY · GROWTH &amp; AUTOMATION ENGINE
                </text>
                <line x1="76" y1="104" x2="576" y2="104" stroke="#FFFFFF" strokeOpacity="0.08" />

                {/* Top Metric Summary Row inside Main Canvas */}
                <g transform="translate(102, 122)">
                  <text fill="#8EA6B4" fontSize="11" fontFamily="Figtree, sans-serif">
                    Automated Pipeline Revenue
                  </text>
                  <text
                    y="28"
                    fill="#EAF4F8"
                    fontSize="26"
                    fontWeight="700"
                    fontFamily="Bricolage Grotesque, sans-serif"
                  >
                    $1,482,900
                  </text>
                  <rect x="136" y="10" width="66" height="20" rx="6" fill="#5CE1E6" fillOpacity="0.14" />
                  <text
                    x="145"
                    y="24"
                    fill="#5CE1E6"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    +142.8%
                  </text>
                </g>

                {/* Chart Legend */}
                <g transform="translate(370, 128)">
                  <circle cx="6" cy="6" r="4" fill="#5CE1E6" />
                  <text x="16" y="10" fill="#B8CDD8" fontSize="11" fontFamily="Figtree, sans-serif">
                    AI Output
                  </text>
                  <circle cx="88" cy="6" r="4" fill="#7A86FF" />
                  <text x="98" y="10" fill="#8EA6B4" fontSize="11" fontFamily="Figtree, sans-serif">
                    Baseline
                  </text>
                </g>

                {/* Horizontal Chart Guide Lines */}
                <g stroke="#FFFFFF" strokeOpacity="0.06" strokeDasharray="4 6">
                  <line x1="102" y1="185" x2="548" y2="185" />
                  <line x1="102" y1="230" x2="548" y2="230" />
                  <line x1="102" y1="275" x2="548" y2="275" />
                  <line x1="102" y1="320" x2="548" y2="320" />
                </g>

                {/* Animated Throughput Histogram Bars (Background Layer of Chart) */}
                <g transform="translate(112, 0)">
                  {[
                    { x: 0, h: 36, dur: '3.2s' },
                    { x: 38, h: 48, dur: '2.8s' },
                    { x: 76, h: 42, dur: '3.6s' },
                    { x: 114, h: 64, dur: '3.1s' },
                    { x: 152, h: 58, dur: '2.9s' },
                    { x: 190, h: 82, dur: '3.4s' },
                    { x: 228, h: 76, dur: '2.7s' },
                    { x: 266, h: 98, dur: '3.5s' },
                    { x: 304, h: 112, dur: '3.0s' },
                    { x: 342, h: 128, dur: '2.6s' },
                    { x: 380, h: 142, dur: '3.3s' },
                    { x: 418, h: 162, dur: '2.9s' },
                  ].map((bar, i) => (
                    <rect
                      key={i}
                      x={bar.x}
                      y={330 - bar.h}
                      width="14"
                      height={bar.h}
                      rx="4"
                      fill="url(#akvBarGrad)"
                      opacity="0.28"
                    >
                      <animate
                        attributeName="height"
                        values={`${bar.h};${Math.max(24, bar.h - 16)};${bar.h}`}
                        dur={bar.dur}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="y"
                        values={`${330 - bar.h};${330 - Math.max(24, bar.h - 16)};${330 - bar.h}`}
                        dur={bar.dur}
                        repeatCount="indefinite"
                      />
                    </rect>
                  ))}
                </g>

                {/* Secondary Baseline Curve (Indigo Dashed) */}
                <path
                  d="M102 308 C 165 302, 215 280, 275 272 C 335 264, 390 245, 455 232 C 495 224, 525 215, 548 206"
                  stroke="#7A86FF"
                  strokeOpacity="0.55"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  style={{ animation: 'akviora-dash-flow 3s linear infinite' }}
                />

                {/* Primary Growth Spline Area Fill */}
                <path
                  d="M102 300 C 155 292, 195 250, 250 242 C 305 234, 345 190, 405 176 C 460 164, 505 142, 548 128 L 548 330 L 102 330 Z"
                  fill="url(#akvAreaFill)"
                />

                {/* Primary Growth Spline Stroke */}
                <path
                  id="akvGrowthCurve"
                  d="M102 300 C 155 292, 195 250, 250 242 C 305 234, 345 190, 405 176 C 460 164, 505 142, 548 128"
                  stroke="url(#akvCyanLine)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#akvGlow)"
                />

                {/* Animated Glowing Data Packet Traveling Along Growth Curve */}
                <circle r="5" fill="#EAF4F8" filter="url(#akvGlow)">
                  <animateMotion
                    dur="5.5s"
                    repeatCount="indefinite"
                    path="M102 300 C 155 292, 195 250, 250 242 C 305 234, 345 190, 405 176 C 460 164, 505 142, 548 128"
                  />
                </circle>

                {/* Key Data Nodes on Spline */}
                {[
                  { cx: 185, cy: 263 },
                  { cx: 295, cy: 222 },
                  { cx: 405, cy: 176 },
                  { cx: 515, cy: 138 },
                ].map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.cx} cy={pt.cy} r="7" fill="#5CE1E6" fillOpacity="0.22">
                      <animate
                        attributeName="r"
                        values="6;11;6"
                        dur="2.6s"
                        begin={`${idx * 0.5}s`}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="fill-opacity"
                        values="0.35;0.08;0.35"
                        dur="2.6s"
                        begin={`${idx * 0.5}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx={pt.cx} cy={pt.cy} r="4" fill="#060B14" stroke="#5CE1E6" strokeWidth="2.2" />
                  </g>
                ))}

                {/* Peak Callout Tag inside Chart */}
                <g transform="translate(342, 118)">
                  <rect
                    width="132"
                    height="42"
                    rx="10"
                    fill="#0A1628"
                    stroke="#5CE1E6"
                    strokeOpacity="0.55"
                    strokeWidth="1"
                  />
                  <text x="12" y="17" fill="#8EA6B4" fontSize="10" fontFamily="JetBrains Mono, monospace">
                    CONVERSION LIFT
                  </text>
                  <text x="12" y="33" fill="#5CE1E6" fontSize="13" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                    3.4x ROI · 99.9%
                  </text>
                </g>

                {/* X-Axis Month Labels */}
                <g fill="#8EA6B4" fontSize="10" fontFamily="JetBrains Mono, monospace">
                  <text x="104" y="352">Q1 · STRATEGY</text>
                  <text x="234" y="352">Q2 · PRODUCT LAUNCH</text>
                  <text x="392" y="352">Q3 · AI AUTOMATION</text>
                  <text x="518" y="352">LIVE</text>
                </g>

                {/* Bottom Status Strip inside Main Canvas */}
                <line x1="76" y1="372" x2="576" y2="372" stroke="#FFFFFF" strokeOpacity="0.08" />
                <g transform="translate(102, 396)" fontFamily="JetBrains Mono, monospace" fontSize="11">
                  <text fill="#5CE1E6" fontWeight="600">+142% Velocity</text>
                  <text x="128" fill="#8EA6B4">·</text>
                  <text x="148" fill="#EAF4F8">310+ Hrs Saved/Mo</text>
                  <text x="298" fill="#8EA6B4">·</text>
                  <text x="318" fill="#7A86FF" fontWeight="600">&lt;45ms AI Latency</text>
                </g>
              </g>

              {/* ================= FLOATING CARD 1: TOP-RIGHT EFFICIENCY GAUGE ================= */}
              <g
                style={{ animation: 'akviora-float-a 5.5s ease-in-out infinite' }}
                filter="url(#akvCardShadow)"
              >
                <rect
                  x="408"
                  y="14"
                  width="244"
                  height="118"
                  rx="18"
                  fill="url(#akvCardFloat)"
                  stroke="url(#akvBorderStroke)"
                  strokeWidth="1.2"
                />

                {/* Animated Radial Progress Ring */}
                <g transform="translate(460, 73)">
                  <circle r="32" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="6" />
                  <circle
                    r="32"
                    stroke="url(#akvGaugeGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="201"
                    strokeDashoffset="18"
                    transform="rotate(-90)"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="38;14;38"
                      dur="4.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <text
                    textAnchor="middle"
                    y="5"
                    fill="#EAF4F8"
                    fontSize="15"
                    fontWeight="700"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    98.4%
                  </text>
                </g>

                <g transform="translate(508, 52)">
                  <text fill="#8EA6B4" fontSize="10" fontFamily="JetBrains Mono, monospace">
                    SYSTEM SCORE
                  </text>
                  <text
                    y="20"
                    fill="#EAF4F8"
                    fontSize="15"
                    fontWeight="600"
                    fontFamily="Bricolage Grotesque, sans-serif"
                  >
                    Peak Efficiency
                  </text>
                  <text y="39" fill="#5CE1E6" fontSize="11" fontFamily="JetBrains Mono, monospace">
                    +38.2% vs Manual
                  </text>
                </g>
              </g>

              {/* ================= FLOATING CARD 2: BOTTOM-LEFT AI WORKFLOW PIPELINE ================= */}
              <g
                style={{ animation: 'akviora-float-b 6.2s ease-in-out infinite' }}
                filter="url(#akvCardShadow)"
              >
                <rect
                  x="18"
                  y="374"
                  width="324"
                  height="142"
                  rx="18"
                  fill="url(#akvCardFloat)"
                  stroke="url(#akvBorderStroke)"
                  strokeWidth="1.2"
                />

                <text
                  x="38"
                  y="402"
                  fill="#5CE1E6"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  letterSpacing="0.06em"
                >
                  LIVE AI WORKFLOW PIPELINE · AUTO-SYNC
                </text>

                {/* Animated Connector Line Between Nodes */}
                <line
                  x1="82"
                  y1="452"
                  x2="278"
                  y2="452"
                  stroke="#5CE1E6"
                  strokeOpacity="0.25"
                  strokeWidth="2"
                />
                <line
                  x1="82"
                  y1="452"
                  x2="278"
                  y2="452"
                  stroke="#5CE1E6"
                  strokeWidth="2.5"
                  strokeDasharray="8 10"
                  style={{ animation: 'akviora-dash-flow 2.2s linear infinite' }}
                />

                {/* Pipeline Node 1: Web/Lead Intake */}
                <g transform="translate(38, 424)">
                  <rect width="74" height="56" rx="12" fill="#0B1629" stroke="#5CE1E6" strokeOpacity="0.45" />
                  <text x="37" y="25" textAnchor="middle" fill="#EAF4F8" fontSize="11" fontWeight="600" fontFamily="Figtree, sans-serif">
                    Web &amp; App
                  </text>
                  <text x="37" y="41" textAnchor="middle" fill="#8EA6B4" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
                    100% Capture
                  </text>
                </g>

                {/* Pipeline Node 2: Akviora AI Agent */}
                <g transform="translate(143, 424)">
                  <rect width="74" height="56" rx="12" fill="#101D38" stroke="#7A86FF" strokeOpacity="0.7" />
                  <text x="37" y="25" textAnchor="middle" fill="#5CE1E6" fontSize="11" fontWeight="600" fontFamily="Figtree, sans-serif">
                    Akviora AI
                  </text>
                  <text x="37" y="41" textAnchor="middle" fill="#B8CDD8" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
                    Auto-Qualify
                  </text>
                </g>

                {/* Pipeline Node 3: CRM & Revenue */}
                <g transform="translate(248, 424)">
                  <rect width="74" height="56" rx="12" fill="#0B1629" stroke="#5CE1E6" strokeOpacity="0.45" />
                  <text x="37" y="25" textAnchor="middle" fill="#EAF4F8" fontSize="11" fontWeight="600" fontFamily="Figtree, sans-serif">
                    CRM Sync
                  </text>
                  <text x="37" y="41" textAnchor="middle" fill="#5CE1E6" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
                    3.4x Faster
                  </text>
                </g>

                <text x="38" y="502" fill="#8EA6B4" fontSize="10.5" fontFamily="Figtree, sans-serif">
                  Zero manual bottlenecks · End-to-end automated execution
                </text>
              </g>

              {/* ================= FLOATING CARD 3: BOTTOM-RIGHT ACTIVE GROWTH METRIC ================= */}
              <g
                style={{ animation: 'akviora-float-a 4.8s ease-in-out 0.8s infinite' }}
                filter="url(#akvCardShadow)"
              >
                <rect
                  x="364"
                  y="398"
                  width="288"
                  height="118"
                  rx="18"
                  fill="url(#akvCardFloat)"
                  stroke="url(#akvBorderStroke)"
                  strokeWidth="1.2"
                />

                <text
                  x="386"
                  y="426"
                  fill="#8EA6B4"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  letterSpacing="0.06em"
                >
                  QUALIFIED INBOUND CONVERSION
                </text>

                <text
                  x="386"
                  y="458"
                  fill="#EAF4F8"
                  fontSize="26"
                  fontWeight="700"
                  fontFamily="Bricolage Grotesque, sans-serif"
                >
                  +186%
                </text>

                <text
                  x="484"
                  y="455"
                  fill="#5CE1E6"
                  fontSize="11"
                  fontFamily="JetBrains Mono, monospace"
                >
                  ▲ Last 6 Months
                </text>

                {/* Mini Animated Vector Sparkline */}
                <path
                  d="M386 492 L 426 486 L 466 474 L 506 478 L 546 462 L 586 452 L 626 436"
                  stroke="#5CE1E6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="626" cy="436" r="4" fill="#5CE1E6">
                  <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>

            <div className="mt-6 sm:mt-10 pt-4 sm:pt-5 border-t border-[rgba(255,255,255,0.12)]">
              <p className="text-center text-xs sm:text-[13px] leading-relaxed text-[#8EA6B4] tracking-[0.01em]">
                Websites • Web Apps • SaaS • AI Assistants • Automation • UI/UX • Business Systems
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CAPABILITY RIBBON */}
      <div
        aria-hidden="true"
        className="overflow-hidden border-y border-[rgba(255,255,255,0.11)] bg-[#060B14] bg-[radial-gradient(60%_120%_at_50%_50%,rgba(92,225,230,0.10),rgba(122,134,255,0.08)_55%,rgba(6,11,20,0.98)_100%)] py-4 sm:py-[20px] md:py-2.5 lg:py-[20px] my-6 sm:my-[4vh] md:my-3 lg:my-[4vh]"
      >
        <div className="animate-akviora-marquee">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <span key={idx}>{item}</span>
          ))}
        </div>
      </div>

      {/* 3. STATEMENT & PAIN POINTS */}
      <section
        ref={statementSectionRef}
        className="min-h-[65vh] sm:min-h-[75vh] md:min-h-0 lg:min-h-[75vh] flex items-center py-14 sm:py-16 md:py-10 lg:py-[14vh] px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full min-w-0"
        >
          <ScrollWordScrub
            text="Your business shouldn't have to work around its software."
            className="font-display font-medium text-[clamp(30px,5.8vw,88px)] max-w-[18ch] leading-[1.03] text-[#EAF4F8]"
          />

          <motion.div
            variants={STAGGER_CONTAINER_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="flex flex-wrap gap-2.5 sm:gap-[12px] md:gap-2 lg:gap-[12px] max-w-[1000px] mt-8 sm:mt-[6vh] md:mt-4 lg:mt-[6vh]"
          >
            {PAIN_POINTS.map((pain) => {
              const isActive = pain === activePainPoint;
              return (
                <motion.button
                  key={pain}
                  type="button"
                  variants={STAGGER_ITEM_VARIANTS}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActivePainPoint(pain)}
                  className={`px-4 sm:px-[20px] py-2.5 sm:py-[12px] rounded-full border text-sm sm:text-[15px] transition-all duration-300 inline-flex items-center gap-2.5 cursor-pointer ${
                    isActive
                      ? 'akviora-btn-gradient border-transparent text-[#04121c] font-medium shadow-[0_0_28px_rgba(92,225,230,0.35)]'
                      : 'border-[rgba(255,255,255,0.11)] bg-white/[0.03] text-[#EAF4F8] hover:border-[#5CE1E6] hover:bg-[rgba(92,225,230,0.08)]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isActive ? 'bg-[#04121c]' : 'bg-[#5CE1E6]'
                    }`}
                  />
                  <span>{pain}</span>
                </motion.button>
              );
            })}
          </motion.div>

          <motion.div
            key={activePainPoint}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 md:mt-4 lg:mt-6 max-w-[780px] rounded-2xl border border-[#5CE1E6]/25 bg-gradient-to-r from-[#5CE1E6]/[0.07] via-[#081322]/90 to-[#7A86FF]/[0.06] p-5 sm:p-6 md:p-4 lg:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="text-[#8EA6B4] uppercase tracking-wider">
                    BOTTLENECK:
                  </span>
                  <span className="text-[#EAF4F8] font-medium">
                    {activePainPoint} →
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#5CE1E6]/12 border border-[#5CE1E6]/30 text-[#5CE1E6] text-[11px]">
                    {activePainDetail.metric}
                  </span>
                </div>
                <p className="mt-2.5 text-sm sm:text-[15px] text-[#EAF4F8]/90 leading-relaxed">
                  <strong className="text-[#5CE1E6] font-medium">
                    Akviora System Fix:
                  </strong>{' '}
                  {activePainDetail.fix}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onOpenAssistantWithPrompt(activePainDetail.prompt)
                }
                className="text-xs font-mono text-[#5CE1E6] border-b border-[#5CE1E6]/60 pb-1 hover:text-[#EAF4F8] hover:border-[#EAF4F8] transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
              >
                Solve This Bottleneck →
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative max-w-[1000px] mt-8 sm:mt-[7vh] md:mt-5 lg:mt-[7vh] pl-5 sm:pl-7"
          >
            <div
              aria-hidden="true"
              className="absolute left-0 top-1 bottom-1 w-[2.5px] rounded-full bg-gradient-to-b from-[#5CE1E6] via-[#5CE1E6]/80 to-[#7A86FF] shadow-[0_0_14px_rgba(92,225,230,0.65)]"
            />
            <p className="font-display font-light text-[clamp(20px,2.8vw,38px)] leading-[1.28] tracking-[-0.02em] text-[#EAF4F8]">
              Too many businesses run on spreadsheets, WhatsApp messages and
              disconnected apps.{' '}
              <em className="not-italic text-[#8EA6B4]">
                We identify what is slowing you down and design a digital system
                around the real workflow, not the other way around.
              </em>
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 4. SERVICES SECTION */}
      <HorizontalServicesShowcase
        services={SERVICE_PILLARS}
        onNavigate={onNavigate}
        onAskAI={(prompt) => onOpenAssistantWithPrompt(prompt)}
      />

      {/* 5. AI SOLUTIONS BENTO SHOWCASE */}
      <section
        id="ai"
        className="pt-12 sm:pt-14 md:pt-10 md:pb-8 lg:pt-[12vh] lg:pb-[10vh] px-4 sm:px-8 lg:px-12 max-w-[1320px] mx-auto"
      >
        <FadeUpReveal>
          <KineticHeadline
            as="h2"
            text="What if your business had an assistant that never forgets the process?"
            className="font-display text-[clamp(28px,5.2vw,74px)] max-w-[17ch] text-[#EAF4F8]"
          />
          <p className="mt-4 sm:mt-6 md:mt-3 lg:mt-6 max-w-[58ch] text-sm sm:text-base text-[#8EA6B4]">
            An AI assistant can become more than a chatbot. It can understand
            your business information, qualify leads, summarize documents and
            trigger the next step in a workflow, built around a specific need
            rather than because AI is trending.
          </p>
        </FadeUpReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(195px,auto)] md:auto-rows-[minmax(160px,auto)] lg:auto-rows-[minmax(195px,auto)] gap-4 md:gap-3 lg:gap-4 mt-8 sm:mt-12 md:mt-6 lg:mt-12">
          {AI_ASSISTANTS.map((assistant, idx) => (
            <SpotlightBentoTile
              key={assistant.id}
              delay={idx * 0.06}
              onClick={() =>
                onOpenAssistantWithPrompt(
                  assistant.samplePrompts[0],
                  assistant.id
                )
              }
              className={assistant.gridSpan || ''}
            >
              <div className="flex items-center justify-between text-xs text-[#8EA6B4] font-mono tabular-nums">
                <span>0{idx + 1} · {assistant.id.toUpperCase()}</span>
                <span className="text-[#5CE1E6] inline-flex items-center gap-1">
                  Test Live <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="mt-5">
                {assistant.id === 'customer' && (
                  <div className="relative w-full h-44 sm:h-48 mb-6 flex items-center justify-center">
                    {/* Left floating 3D metallic badge */}
                    <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-white/15 bg-gradient-to-b from-white/15 via-[#182436]/90 to-[#080E1A]/95 shadow-[0_12px_28px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.35)] -mr-4 z-10 -translate-y-5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#EAF4F8] via-[#8EA6B4] to-[#243447] p-[1px] shadow-inner">
                        <div className="w-full h-full rounded-[7px] bg-[#0B1322] flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5 text-[#5CE1E6]" />
                        </div>
                      </div>
                      <span className="text-[11px] font-mono tracking-wide text-[#EAF4F8]/90">
                        NEURAL CORE
                      </span>
                    </div>

                    {/* Centerpiece 3D Metallic Gyroscopic Torus & Chrome Polyhedron */}
                    <svg
                      viewBox="0 0 220 180"
                      className="w-48 h-40 sm:w-56 sm:h-44 drop-shadow-[0_18px_28px_rgba(0,0,0,0.75)] select-none"
                      aria-hidden="true"
                    >
                      <defs>
                        {/* Liquid Chrome Outer Ring Gradient */}
                        <linearGradient id="metalChromeRing" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="18%" stopColor="#DCE8F2" />
                          <stop offset="40%" stopColor="#5C748A" />
                          <stop offset="62%" stopColor="#121C2B" />
                          <stop offset="82%" stopColor="#5CE1E6" />
                          <stop offset="100%" stopColor="#EAF4F8" />
                        </linearGradient>

                        {/* Brushed Titanium Secondary Ring Gradient */}
                        <linearGradient id="metalTitanium" x1="100%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#EAF4F8" />
                          <stop offset="25%" stopColor="#7A86FF" />
                          <stop offset="55%" stopColor="#1B263B" />
                          <stop offset="80%" stopColor="#8EA6B4" />
                          <stop offset="100%" stopColor="#FFFFFF" />
                        </linearGradient>

                        {/* 3D Chrome Sphere Core Gradient */}
                        <radialGradient id="chromeSphere" cx="35%" cy="28%" r="68%">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="16%" stopColor="#E4F2F9" />
                          <stop offset="38%" stopColor="#7592A8" />
                          <stop offset="66%" stopColor="#162234" />
                          <stop offset="88%" stopColor="#080E18" />
                          <stop offset="100%" stopColor="#5CE1E6" />
                        </radialGradient>

                        {/* Facet Top Light Metallic Sheen */}
                        <linearGradient id="facetTop" x1="20%" y1="0%" x2="80%" y2="100%">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                          <stop offset="45%" stopColor="#9BB4C7" stopOpacity="0.85" />
                          <stop offset="100%" stopColor="#24354C" stopOpacity="0.9" />
                        </linearGradient>

                        {/* Facet Shadow Metallic */}
                        <linearGradient id="facetSide" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#5CE1E6" stopOpacity="0.55" />
                          <stop offset="45%" stopColor="#1A283D" stopOpacity="0.95" />
                          <stop offset="100%" stopColor="#070C16" stopOpacity="0.98" />
                        </linearGradient>
                      </defs>

                      {/* Ambient floor shadow ellipse */}
                      <ellipse
                        cx="110"
                        cy="158"
                        rx="64"
                        ry="10"
                        fill="rgba(0,0,0,0.55)"
                      />

                      {/* Outer 3D Metallic Torus Ring (Tilted) */}
                      <g transform="translate(110, 86) rotate(-22)">
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="74"
                          ry="32"
                          fill="none"
                          stroke="url(#metalChromeRing)"
                          strokeWidth="12"
                        />
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="74"
                          ry="32"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeOpacity="0.55"
                          strokeWidth="1.5"
                        />
                      </g>

                      {/* Intersecting 3D Brushed Titanium Gyro Ring */}
                      <g transform="translate(110, 86) rotate(36)">
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="62"
                          ry="25"
                          fill="none"
                          stroke="url(#metalTitanium)"
                          strokeWidth="9"
                        />
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="62"
                          ry="25"
                          fill="none"
                          stroke="#5CE1E6"
                          strokeOpacity="0.45"
                          strokeWidth="1.2"
                        />
                      </g>

                      {/* Central Sculpted 3D Metallic Core Sphere & Faceted Octahedron */}
                      <circle
                        cx="110"
                        cy="86"
                        r="31"
                        fill="url(#chromeSphere)"
                        stroke="url(#metalChromeRing)"
                        strokeWidth="2"
                      />

                      {/* Metallic 3D Faceted Crown Overlay */}
                      <polygon
                        points="110,55 134,82 110,96 86,82"
                        fill="url(#facetTop)"
                        stroke="#FFFFFF"
                        strokeOpacity="0.6"
                        strokeWidth="0.8"
                      />
                      <polygon
                        points="110,96 134,82 110,117 86,82"
                        fill="url(#facetSide)"
                        stroke="#5CE1E6"
                        strokeOpacity="0.45"
                        strokeWidth="0.8"
                      />

                      {/* Specular Star Highlight on Chrome Core */}
                      <circle cx="99" cy="72" r="4.5" fill="#FFFFFF" fillOpacity="0.9" />
                      <circle cx="99" cy="72" r="9" fill="#FFFFFF" fillOpacity="0.22" />

                      {/* Orbiting 3D Chrome Satellite Spheres */}
                      <circle
                        cx="42"
                        cy="64"
                        r="7"
                        fill="url(#chromeSphere)"
                        stroke="#FFFFFF"
                        strokeOpacity="0.6"
                        strokeWidth="1"
                      />
                      <circle
                        cx="178"
                        cy="108"
                        r="8.5"
                        fill="url(#chromeSphere)"
                        stroke="#5CE1E6"
                        strokeOpacity="0.65"
                        strokeWidth="1"
                      />
                    </svg>

                    {/* Right floating 3D metallic badge */}
                    <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-white/15 bg-gradient-to-b from-white/15 via-[#182436]/90 to-[#080E1A]/95 shadow-[0_12px_28px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.35)] -ml-4 z-10 translate-y-6">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#EAF4F8] via-[#8EA6B4] to-[#243447] p-[1px] shadow-inner">
                        <div className="w-full h-full rounded-[7px] bg-[#0B1322] flex items-center justify-center">
                          <Cpu className="w-3.5 h-3.5 text-[#7A86FF]" />
                        </div>
                      </div>
                      <span className="text-[11px] font-mono tracking-wide text-[#EAF4F8]/90">
                        24/7 SYNC
                      </span>
                    </div>
                  </div>
                )}
                <b
                  className={`font-display font-medium tracking-[-0.02em] text-[#EAF4F8] block ${
                    assistant.id === 'customer'
                      ? 'text-[clamp(26px,3.2vw,44px)] leading-[1.08]'
                      : 'text-[clamp(20px,2vw,28px)] leading-[1.12]'
                  }`}
                >
                  {assistant.title}
                </b>
                <span className="text-[#8EA6B4] text-[15px] mt-2 block">
                  {assistant.shortDesc}
                </span>
                <span className="text-xs text-[#5CE1E6]/90 mt-3 block font-mono tabular-nums">
                  {assistant.metrics}
                </span>
              </div>
            </SpotlightBentoTile>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-6 md:gap-4 lg:gap-6 mt-9 md:mt-6 lg:mt-9">
          <MagneticButton
            variant="gradient"
            onClick={() => onNavigate('ai')}
            className="px-5 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base"
          >
            <span className="sm:hidden">Open AI Studio →</span>
            <span className="hidden sm:inline">
              Open Interactive AI Studio &amp; Suggestion Hub →
            </span>
          </MagneticButton>

          <button
            type="button"
            onClick={() =>
              onOpenAssistantWithPrompt(
                'Help me design a custom AI assistant for my team.'
              )
            }
            className="text-[#EAF4F8] border-b-[1.5px] border-[#5CE1E6] pb-1 hover:text-[#5CE1E6] transition-colors cursor-pointer text-sm"
          >
            Chat with Akviora AI Now
          </button>
        </div>
      </section>

      {/* 6. WHY AKVIORA / PRINCIPLES */}
      <WhyAkvioraSection />

      {/* 7. SELECTED WORK / CASE STUDIES LIST */}
      <section
        id="work"
        className="pt-12 sm:pt-14 md:pt-10 md:pb-8 lg:pt-[12vh] lg:pb-[10vh] px-4 sm:px-8 lg:px-12 max-w-[1320px] mx-auto overflow-hidden"
      >
        <FadeUpReveal className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <KineticHeadline
            as="h2"
            text="Products and systems shaped around real workflows."
            className="font-display text-[clamp(28px,5.2vw,74px)] max-w-[17ch] text-[#EAF4F8]"
          />
          <p className="text-xs sm:text-sm text-[#8EA6B4]">
            Click any product to inspect architecture &amp; verified outcomes
          </p>
        </FadeUpReveal>

        <div className="mt-8 sm:mt-12 md:mt-6 lg:mt-12">
          {CASE_STUDIES.map((study, idx) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{
                type: 'spring',
                stiffness: 115,
                damping: 20,
                delay: idx * 0.05,
              }}
              whileHover={{ x: 8 }}
              onClick={() => onSelectCaseStudy(study)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCaseStudy(study);
                }
              }}
              className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-3 sm:gap-4 md:gap-3 py-5 sm:py-6 md:py-3.5 lg:py-6 border-t border-[rgba(255,255,255,0.11)] transition-colors hover:bg-gradient-to-r hover:from-[#5CE1E6]/10 hover:to-transparent cursor-pointer group will-change-transform"
            >
              <div className="flex flex-wrap items-baseline justify-between sm:justify-start gap-x-4 gap-y-1">
                <b className="font-display font-medium text-[clamp(22px,3.6vw,50px)] leading-[1.05] tracking-[-0.03em] text-[#EAF4F8] group-hover:text-[#5CE1E6] transition-colors">
                  {study.title}
                </b>
                <span className="text-[11px] sm:text-xs font-mono text-[#5CE1E6] tabular-nums">
                  {study.impactMetrics[0]?.value} {study.impactMetrics[0]?.label}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base text-[#8EA6B4] self-center">
                <span>{study.category}</span>
                <ArrowUpRight className="w-5 h-5 text-[#8EA6B4] group-hover:text-[#5CE1E6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>

        <FadeUpReveal delay={0.1} className="mt-8 md:mt-5 lg:mt-8 flex flex-wrap items-center gap-6">
          <motion.button
            type="button"
            whileHover={{ x: 4 }}
            onClick={() => onNavigate('work')}
            className="text-sm sm:text-base text-[#EAF4F8] border-b-[1.5px] border-[#5CE1E6] pb-1 hover:text-[#5CE1E6] transition-colors cursor-pointer font-medium"
          >
            View All Case Studies &amp; Visual Showcases →
          </motion.button>
        </FadeUpReveal>
      </section>

      {/* 8. ATTRIBUTABLE CLIENT OUTCOMES */}
      <section className="py-12 sm:py-14 md:py-10 lg:py-[10vh] px-4 sm:px-8 lg:px-12 max-w-[1320px] mx-auto overflow-hidden">
        <motion.div
          variants={STAGGER_CONTAINER_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-3.5 lg:gap-5"
        >
          {CLIENT_TESTIMONIALS.map((item) => (
            <motion.blockquote
              key={item.id}
              variants={STAGGER_ITEM_VARIANTS}
              whileHover={{ y: -6 }}
              className="rounded-[24px] border border-[rgba(255,255,255,0.11)] bg-white/[0.025] hover:border-[#5CE1E6]/40 transition-colors p-6 sm:p-7 md:p-5 lg:p-7 flex flex-col justify-between will-change-transform"
            >
              <div>
                <div className="text-xs font-mono text-[#5CE1E6] tabular-nums mb-3">
                  Verified Impact · {item.metric}
                </div>
                <p className="text-sm sm:text-base text-[#EAF4F8]/90 leading-relaxed">
                  “{item.quote}”
                </p>
              </div>
              <footer className="mt-6 pt-4 border-t border-white/10 text-xs text-[#8EA6B4]">
                <strong className="text-[#EAF4F8] font-medium block">
                  {item.author}
                </strong>
                <span>
                  {item.role} · {item.organization}
                </span>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </section>

      {/* 9. 8-STEP TIMELINE PROCESS */}
      <section
        id="process"
        className="pt-12 sm:pt-14 md:pt-10 md:pb-8 lg:pt-[12vh] lg:pb-[10vh] px-4 sm:px-8 lg:px-12 max-w-[1320px] mx-auto overflow-hidden"
      >
        <KineticHeadline
          as="h2"
          text="From idea to working system."
          className="font-display text-[clamp(28px,5.2vw,74px)] max-w-[17ch] text-[#EAF4F8]"
        />
        <ScrollProcessTimeline steps={PROCESS_STEPS} />
      </section>

      {/* 10. CLOSING CONVERSION CTA */}
      <section
        id="contact"
        className="min-h-[60svh] sm:min-h-[70svh] md:min-h-0 lg:min-h-[85svh] flex flex-col justify-center items-start px-4 sm:px-8 lg:px-12 max-w-[1320px] mx-auto py-12 sm:py-16 md:py-10 lg:py-20"
      >
        <KineticHeadline
          as="h2"
          text="Have an idea, problem or process worth improving?"
          className="font-display font-bold text-[clamp(34px,7.2vw,112px)] max-w-[14ch] leading-[1.02] text-[#EAF4F8] break-words"
        />
        <FadeUpReveal delay={0.12} className="w-full">
          <p className="max-w-[52ch] mt-5 sm:mt-7 md:mt-4 lg:mt-7 text-[#b8cdd8] text-base sm:text-lg">
            Tell us what you are trying to build, automate or improve. You
            don&apos;t need a perfect technical specification. Start with the
            business problem, and we&apos;ll help turn it into a practical
            technology plan.
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-7 md:gap-4 lg:gap-7 items-center mt-7 sm:mt-8 md:mt-5 lg:mt-8 w-full sm:w-auto">
            <MagneticButton
              variant="gradient"
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-5 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base"
            >
              Tell Us About Your Project
            </MagneticButton>
            <motion.button
              type="button"
              whileHover={{ x: 4 }}
              onClick={() => onNavigate('ai')}
              className="text-sm sm:text-base text-[#EAF4F8] border-b-[1.5px] border-[#5CE1E6] pb-1 hover:text-[#5CE1E6] transition-colors cursor-pointer font-medium text-left"
            >
              <span className="sm:hidden">Generate AI Workflow Blueprint →</span>
              <span className="hidden sm:inline">
                Generate Instant AI Workflow Blueprint
              </span>
            </motion.button>
          </div>
        </FadeUpReveal>
      </section>
    </>
  );
};
