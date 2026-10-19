import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { CaseStudy, PageRoute } from '../types/akviora';
import { CASE_STUDIES } from '../data/akvioraData';
import {
  FadeUpReveal,
  KineticHeadline,
} from '../components/CinematicScroll';
import { MagneticButton, SafeImage } from '../components/MagneticButton';
import {
  CaseStudyCardSkeleton,
  WorkPageSkeleton,
  usePageContentLoading,
  useSectionFilterShimmer,
} from '../components/ShimmerSkeleton';

interface WorkPageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectCaseStudy: (study: CaseStudy) => void;
  isLoading?: boolean;
}

export const WorkPage: React.FC<WorkPageProps> = ({
  onNavigate,
  onSelectCaseStudy,
  isLoading = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'saas' | 'ai' | 'operations' | 'retail'>('all');
  const showPageSkeleton = usePageContentLoading(isLoading, 240);
  const switchingFilter = useSectionFilterShimmer(filter, 180);

  const filteredStudies = CASE_STUDIES.filter((s) => {
    if (filter === 'all') return true;
    if (filter === 'ai') return s.id === 'neuronova' || s.id === 'cosmic-compass';
    if (filter === 'saas') return s.id === 'paytrack' || s.id === 'omniflow';
    if (filter === 'operations') return s.id === 'nextgen-iot' || s.id === 'omniflow';
    if (filter === 'retail') return s.id === 'easymart' || s.id === 'cosmic-compass';
    return true;
  });

  if (showPageSkeleton) {
    return <WorkPageSkeleton />;
  }

  return (
    <div className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto space-y-14 sm:space-y-20">
      {/* Header */}
      <section className="pt-4 sm:pt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-xs font-mono text-[#5CE1E6] mb-4"
          >
            03 · SELECTED WORK &amp; PRODUCTION SYSTEMS
          </motion.div>
          <KineticHeadline
            text="Products and systems shaped around real workflows."
            className="font-display font-bold text-[clamp(32px,6.4vw,90px)] max-w-[15ch] leading-[1.02] text-[#EAF4F8] break-words"
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
        </div>
      </section>
      

 <section className="space-y-6 sm:space-y-8">
      {/* Interactive Filter Tabs with Shared layoutId Pill */}
         <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-[rgba(255,255,255,0.11)] self-start lg:self-end w-full lg:w-fit"
        >
          {[
            { id: 'all', label: 'All Systems' },
            { id: 'saas', label: 'FinTech & SaaS' },
            { id: 'ai', label: 'AI & Neural Systems' },
            { id: 'operations', label: 'IoT & Operations' },
            { id: 'retail', label: 'Consumer & Retail' },
          ].map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setFilter(tab.id as 'all' | 'saas' | 'ai' | 'operations' | 'retail')
                }
                className={`relative w-full lg:w-auto px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer text-center flex items-center justify-center ${
                  isActive
                    ? 'text-[#060B14]'
                    : 'text-[#8EA6B4] hover:text-[#EAF4F8]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="workFilterActiveTab"
                    transition={{
                      type: 'spring',
                      stiffness: 340,
                      damping: 28,
                    }}
                    className="absolute inset-0 rounded-xl bg-[#EAF4F8] shadow-sm"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

           {/* Bento Case Study Cards Grid */}
      <motion.section
        layout
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {switchingFilter ? (
            <React.Fragment key="work-skeleton-grid">
              <CaseStudyCardSkeleton isWide />
              <CaseStudyCardSkeleton />
            </React.Fragment>
          ) : (
          filteredStudies.map((study, idx) => {
            const isWide = idx % 3 === 0;
            return (
              <motion.article
                key={study.id}
                layout
                initial={{ opacity: 0, y: 26, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94, y: -12 }}
                transition={{
                  type: 'spring',
                  stiffness: 130,
                  damping: 20,
                  delay: idx * 0.05,
                }}
                whileHover={{ y: -6 }}
                onClick={() => onSelectCaseStudy(study)}
                className={`${
                  isWide ? 'md:col-span-6 lg:col-span-7' : 'md:col-span-6 lg:col-span-5'
                } group rounded-[28px] border border-[rgba(255,255,255,0.11)] bg-white/[0.02] hover:border-[#5CE1E6]/45 overflow-hidden flex flex-col justify-between cursor-pointer transition-colors will-change-transform`}
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-[rgba(255,255,255,0.08)]">
                  <SafeImage
                    src={study.image}
                    alt={study.title}
                    fallbackTitle={study.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060B14] via-[#060B14]/30 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-5 sm:right-5 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-[#EAF4F8]/90 font-mono tabular-nums">
                    <span>
                      {study.sector} · {study.year} · {study.duration}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#5CE1E6]">
                      Inspect{' '}
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-2.5">
                    <div className="text-xs text-[#8EA6B4]">{study.category}</div>
                    <h2 className="font-display text-2xl sm:text-4xl text-[#EAF4F8] group-hover:text-[#5CE1E6] transition-colors">
                      {study.title}
                    </h2>
                    <p className="text-sm sm:text-base text-[#b8cdd8] leading-relaxed">
                      {study.summary}
                    </p>
                  </div>

                  {/* Quantified Metrics Row */}
                  <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 sm:gap-3">
                    {study.impactMetrics.map((m, i) => (
                      <div key={i} className="min-w-0">
                        <div className="font-display font-bold text-lg sm:text-xl lg:text-2xl text-[#5CE1E6] tabular-nums break-words">
                          {m.value}
                        </div>
                        <div className="text-[11px] sm:text-xs text-[#8EA6B4] leading-snug">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })
          )}
        </AnimatePresence>
      </motion.section>
 </section>



   

      {/* CTA Banner */}
      <FadeUpReveal>
        <section className="rounded-[28px] border border-[rgba(255,255,255,0.12)] bg-gradient-to-r from-[#5CE1E6]/10 via-[#7A86FF]/10 to-transparent p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-display text-3xl sm:text-4xl text-[#EAF4F8]">
              Ready to turn your internal process into a streamlined product?
            </h2>
            <p className="text-[#8EA6B4]">
              Start with the business bottleneck—we handle discovery, UI/UX,
              full-stack development, and automation.
            </p>
          </div>
          <MagneticButton
            variant="gradient"
            onClick={() => onNavigate('contact')}
          >
            Start Your Project Brief
          </MagneticButton>
        </section>
      </FadeUpReveal>
    </div>
  );
};
