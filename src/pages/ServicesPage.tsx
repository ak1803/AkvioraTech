import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { AssistantPersonaId, PageRoute } from '../types/akviora';
import { SERVICE_PILLARS } from '../data/akvioraData';
import {
  FadeUpReveal,
  KineticHeadline,
  ScrollWordScrub,
  STAGGER_CONTAINER_VARIANTS,
  STAGGER_ITEM_VARIANTS,
} from '../components/CinematicScroll';
import { MagneticButton } from '../components/MagneticButton';
import { ROICalculator } from '../../components/ROICalculator';
import {
  ServicePillarPanelSkeleton,
  ServicesPageSkeleton,
  usePageContentLoading,
  useSectionFilterShimmer,
} from '../components/ShimmerSkeleton';

interface ServicesPageProps {
  onNavigate: (page: PageRoute) => void;
  onOpenAssistantWithPrompt: (prompt: string, persona?: AssistantPersonaId) => void;
  isLoading?: boolean;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  onOpenAssistantWithPrompt,
  isLoading = false,
}) => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>(
    SERVICE_PILLARS[0].id
  );
  const showPageSkeleton = usePageContentLoading(isLoading, 240);
  const switchingPillar = useSectionFilterShimmer(selectedPillarId, 170);

  const activePillar =
    SERVICE_PILLARS.find((s) => s.id === selectedPillarId) || SERVICE_PILLARS[0];

  if (showPageSkeleton) {
    return <ServicesPageSkeleton />;
  }

  return (
    <div className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto space-y-16 sm:space-y-24">
      {/* Page Hero */}
      <section className="pt-4 sm:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-xs font-mono text-[#5CE1E6] mb-4"
        >
          01 · CAPABILITIES &amp; ENGINEERING PILLARS
        </motion.div>
        <KineticHeadline
          text="One technology partner. Built around real business workflows."
          className="font-display font-bold text-[clamp(34px,6.8vw,96px)] max-w-[15ch] leading-[1.02] text-[#EAF4F8] break-words"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-5 sm:mt-6 max-w-[62ch] text-[#b8cdd8] text-base sm:text-lg"
        >
          Whether you need a customer-facing SaaS platform, an internal Akviora
          AI document assistant, or end-to-end WhatsApp and CRM automation, our
          engineering and UI/UX teams deliver connected systems under one roof.
        </motion.p>
      </section>

      {/* Interactive Pillar Architecture Explorer */}
      <section className="space-y-6 sm:space-y-8">
        <FadeUpReveal className="flex flex-col lg:flex-row gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-[rgba(255,255,255,0.1)] w-full lg:w-fit">
          {SERVICE_PILLARS.map((pillar) => {
            const active = pillar.id === selectedPillarId;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setSelectedPillarId(pillar.id)}
                className={`relative w-full lg:w-auto px-4 py-2.5 sm:py-3 lg:py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer text-center flex items-center justify-center ${
                  active
                    ? 'text-[#060B14]'
                    : 'text-[#8EA6B4] hover:text-[#EAF4F8]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="servicePillarActiveTab"
                    transition={{
                      type: 'spring',
                      stiffness: 340,
                      damping: 28,
                    }}
                    className="absolute inset-0 rounded-xl bg-[#EAF4F8] shadow-sm"
                  />
                )}
                <span className="relative z-10 font-semibold">
                  {pillar.number}. {pillar.title}
                </span>
              </button>
            );
          })}
        </FadeUpReveal>

        <AnimatePresence mode="wait">
          {switchingPillar ? (
            <motion.div
              key="pillar-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ServicePillarPanelSkeleton />
            </motion.div>
          ) : (
          <motion.div
            key={activePillar.id}
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.99 }}
            transition={{
              type: 'spring',
              stiffness: 140,
              damping: 22,
            }}
            style={{ '--c': activePillar.accentColor } as React.CSSProperties}
            className="akviora-service-panel p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            <div className="lg:col-span-7 relative z-10 space-y-6">
              <div className="text-xs font-mono text-[#5CE1E6] tabular-nums">
                PILLAR {activePillar.number} · TYPICAL DELIVERY: {activePillar.timeline}
              </div>
              <h2 className="font-display text-3xl sm:text-5xl text-[#EAF4F8]">
                {activePillar.title}
              </h2>
              <p className="text-lg text-[#EAF4F8]/90 font-medium">
                {activePillar.tagline}
              </p>
              <p className="text-[#b8cdd8] leading-relaxed">
                {activePillar.description}
              </p>

              <div className="pt-2 space-y-3">
                <div className="text-xs font-mono text-[#8EA6B4]">
                  CORE DELIVERABLES
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activePillar.deliverables.map((item, idx) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                      className="flex items-start gap-2.5 text-sm text-[#EAF4F8]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#5CE1E6] shrink-0 mt-1" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3.5 sm:gap-4">
                <MagneticButton
                  variant="gradient"
                  onClick={() => onNavigate('contact')}
                  className="w-full sm:w-auto px-5 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base"
                >
                  <span>Scope {activePillar.title} Project</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </MagneticButton>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    onOpenAssistantWithPrompt(
                      `Create a project roadmap and deliverables checklist for ${activePillar.title}.`
                    )
                  }
                  className="w-full sm:w-auto text-center px-5 py-3 rounded-full border border-[#5CE1E6]/40 text-sm text-[#5CE1E6] hover:bg-[#5CE1E6]/10 transition-colors cursor-pointer"
                >
                  Ask Akviora AI to Scope This
                </motion.button>
              </div>
            </div>

            <div className="lg:col-span-5 relative z-10 space-y-6 bg-[#060B14]/70 border border-[rgba(255,255,255,0.11)] rounded-2xl p-6">
              <div>
                <div className="text-xs font-mono text-[#5CE1E6] mb-3">
                  MEASURED BUSINESS OUTCOMES
                </div>
                <div className="space-y-3">
                  {activePillar.outcomes.map((outcome, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.08 + i * 0.06 }}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-sm text-[#EAF4F8] tabular-nums"
                    >
                      {outcome}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="text-xs font-mono text-[#8EA6B4] mb-2">
                  PRODUCTION ARCHITECTURE STACK
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#EAF4F8]">
                  {activePillar.architectureStack.map((tech, idx) => (
                    <React.Fragment key={tech}>
                      <span>{tech}</span>
                      {idx < activePillar.architectureStack.length - 1 && (
                        <span aria-hidden="true" className="text-[#5CE1E6]">
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Full Pillar Matrix */}
      <section className="space-y-10">
        <ScrollWordScrub
          text="Every engagement combines product strategy, clean UI/UX, and reliable backend engineering."
          className="font-display text-[clamp(28px,4.4vw,60px)] max-w-[20ch] text-[#EAF4F8]"
        />

        <motion.div
          variants={STAGGER_CONTAINER_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {SERVICE_PILLARS.map((srv) => (
            <motion.article
              key={srv.id}
              variants={STAGGER_ITEM_VARIANTS}
              whileHover={{ y: -6 }}
              style={{ '--c': srv.accentColor } as React.CSSProperties}
              className="akviora-service-panel p-7 sm:p-9 flex flex-col justify-between group will-change-transform"
            >
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#8EA6B4] tabular-nums">
                  <span>{srv.number} · SERVICE PILLAR</span>
                  <span>{srv.timeline}</span>
                </div>
                <h3 className="font-display text-3xl sm:text-4xl text-[#EAF4F8] group-hover:text-[#5CE1E6] transition-colors">
                  {srv.title}
                </h3>
                <p className="text-[#b8cdd8] text-sm sm:text-base">
                  {srv.description}
                </p>
              </div>

              <div className="relative z-10 mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-[#8EA6B4]">
                  {srv.architectureStack.slice(0, 3).join(' · ')}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate(srv.targetPage)}
                  className="text-sm text-[#5CE1E6] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Interactive Workflow Automation ROI Calculator */}
      <section>
        <ROICalculator
          onSendScenarioToAI={(prompt) => onOpenAssistantWithPrompt(prompt)}
          onStartProject={() => onNavigate('contact')}
        />
      </section>
    </div>
  );
};
