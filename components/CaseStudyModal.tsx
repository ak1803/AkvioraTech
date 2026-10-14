'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CaseStudy, PageRoute } from '../lib/types';
import { MagneticButton, SafeImage } from './MagneticButton';

interface CaseStudyModalProps {
  study: CaseStudy | null;
  onClose: () => void;
  onNavigate: (page: PageRoute) => void;
  onAskAI: (prompt: string) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  study,
  onClose,
  onNavigate,
  onAskAI,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (study) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [study, onClose]);

  return (
    <AnimatePresence>
      {study && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#060B14]/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl rounded-[28px] border border-[rgba(255,255,255,0.14)] bg-[#08101E] text-[#EAF4F8] overflow-hidden shadow-2xl my-auto max-h-[90vh] flex flex-col"
          >
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between gap-2">
              <div className="text-[11px] sm:text-xs text-[#8EA6B4] font-mono tabular-nums truncate">
                {study.sector} · {study.year} · Delivered in {study.duration}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close case study modal"
                className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-[#EAF4F8] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-8 space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <div className="text-xs sm:text-sm text-[#5CE1E6]">{study.category}</div>
                  <h2 className="font-display text-2xl sm:text-5xl text-[#EAF4F8]">
                    {study.title}
                  </h2>
                  <p className="text-[#b8cdd8] text-sm sm:text-base leading-relaxed">
                    {study.summary}
                  </p>
                </div>
                <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.11)] aspect-[16/10]">
                  <SafeImage
                    src={study.image}
                    alt={study.title}
                    fallbackTitle={study.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {study.impactMetrics.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-white/[0.03] p-5"
                  >
                    <div className="font-display text-3xl sm:text-4xl text-[#5CE1E6] font-bold tabular-nums">
                      {m.value}
                    </div>
                    <div className="text-sm font-medium text-[#EAF4F8] mt-1">
                      {m.label}
                    </div>
                    <p className="text-xs text-[#8EA6B4] mt-1.5 leading-relaxed">
                      {m.context}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-[rgba(255,255,255,0.09)] bg-white/[0.02] p-6 space-y-2">
                  <h3 className="font-display text-xl text-[#EAF4F8]">
                    The Workflow Bottleneck
                  </h3>
                  <p className="text-sm text-[#8EA6B4] leading-relaxed">
                    {study.challenge}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#5CE1E6]/25 bg-[#5CE1E6]/[0.04] p-6 space-y-2">
                  <h3 className="font-display text-xl text-[#EAF4F8]">
                    The Akviora System
                  </h3>
                  <p className="text-sm text-[#b8cdd8] leading-relaxed">
                    {study.solution}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[rgba(255,255,255,0.1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-[#8EA6B4] block">
                    System Architecture
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#EAF4F8]">
                    {study.stack.map((tech, idx) => (
                      <React.Fragment key={tech}>
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#5CE1E6]" />
                          {tech}
                        </span>
                        {idx < study.stack.length - 1 && (
                          <span aria-hidden="true" className="text-[#8EA6B4]">
                            ·
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onAskAI(
                        `How can we build a system similar to ${study.title} (${study.category}) for our business?`
                      );
                    }}
                    className="px-4 py-2.5 rounded-full border border-[#5CE1E6]/40 text-xs font-medium text-[#5CE1E6] hover:bg-[#5CE1E6]/10 transition-colors cursor-pointer"
                  >
                    Ask AI About Similar Build
                  </button>

                  <MagneticButton
                    variant="gradient"
                    onClick={() => {
                      onClose();
                      onNavigate('contact');
                    }}
                    className="!px-5 !py-2.5 text-xs font-semibold"
                  >
                    <span>Start Similar Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </MagneticButton>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
