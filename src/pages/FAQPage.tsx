import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Search, MessageSquare } from 'lucide-react';
import { AssistantPersonaId, FAQItem, PageRoute } from '../types/akviora';
import { FAQ_ITEMS } from '../data/akvioraData';
import {
  FadeUpReveal,
  KineticHeadline,
} from '../components/CinematicScroll';
import { MagneticButton } from '../components/MagneticButton';
import {
  FocusBeam,
  INPUT_FIELD_CLASSES,
} from '../components/FormControls';
import {
  FAQItemSkeleton,
  FAQPageSkeleton,
  usePageContentLoading,
  useSectionFilterShimmer,
} from '../components/ShimmerSkeleton';

interface FAQPageProps {
  onNavigate: (page: PageRoute) => void;
  onOpenAssistantWithPrompt: (prompt: string, persona?: AssistantPersonaId) => void;
  isLoading?: boolean;
}

export const FAQPage: React.FC<FAQPageProps> = ({
  onNavigate,
  onOpenAssistantWithPrompt,
  isLoading = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);
  const showPageSkeleton = usePageContentLoading(isLoading, 240);
  const switchingCategory = useSectionFilterShimmer(selectedCategory, 160);

  const categories = [
    'All',
    'AI & Automation',
    'Web & SaaS',
    'Process & Pricing',
    'Security & SEO',
  ];

  const filteredFaqs: FAQItem[] = FAQ_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  if (showPageSkeleton) {
    return <FAQPageSkeleton />;
  }

  return (
    <div className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-12 max-w-[1160px] mx-auto space-y-12 sm:space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <section className="pt-4 sm:pt-8 space-y-5 sm:space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-xs font-mono text-[#5CE1E6]"
        >
          05 · FREQUENTLY ASKED QUESTIONS &amp; ARCHITECTURE ANSWERS
        </motion.div>
        <KineticHeadline
          text="Clear answers on AI, software delivery, and ownership."
          className="font-display font-bold text-[clamp(30px,6vw,84px)] max-w-[15ch] leading-[1.02] text-[#EAF4F8] break-words"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="max-w-[58ch] text-[#b8cdd8] text-sm sm:text-base"
        >
          Have a specific technical or workflow question not listed below? Click
          any question to expand or ask our live Akviora AI Assistant directly.
        </motion.p>

        {/* Search & Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.28 }}
          className="flex flex-col md:flex-row gap-4 pt-2"
        >
          <div className="relative flex-1 group">
            <Search className="w-4 h-4 text-[#8EA6B4] group-hover:text-[#EAF4F8] group-focus-within:text-[#5CE1E6] absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions about AI accuracy, timelines, code ownership..."
              aria-label="Search FAQ questions"
              className={`${INPUT_FIELD_CLASSES} !pl-11 !pr-4 !bg-none !border-[rgba(255,255,255,0.11)] !text-[#EAF4F8] placeholder:text-[#8EA6B4] focus:!border-[#5CE1E6] focus:!bg-white/[0.02] w-full `}
            />
            <FocusBeam />
          </div>

          <div className="md:flex gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-[rgba(255,255,255,0.11)] overflow-x-auto scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative shrink-0 sm:shrink px-3.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-[#060B14]'
                      : 'text-[#8EA6B4] hover:text-[#EAF4F8]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="faqCategoryActiveTab"
                      transition={{
                        type: 'spring',
                        stiffness: 340,
                        damping: 28,
                      }}
                      className="absolute inset-0 rounded-xl bg-[#EAF4F8] shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Accordion List */}
      <motion.section layout className="space-y-3.5">
        <AnimatePresence mode="popLayout">
          {switchingCategory ? (
            <motion.div
              key="faq-skeleton-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3.5"
            >
              {[0, 1, 2, 3].map((i) => (
                <FAQItemSkeleton key={i} />
              ))}
            </motion.div>
          ) : filteredFaqs.length === 0 ? (
            <motion.div
              key="empty-faq"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="rounded-2xl border border-[rgba(255,255,255,0.11)] bg-white/[0.02] p-8 text-center space-y-4"
            >
              <p className="text-[#EAF4F8] font-display text-xl">
                No matching FAQ found for “{searchQuery}”
              </p>
              <MagneticButton
                variant="gradient"
                onClick={() => onOpenAssistantWithPrompt(searchQuery)}
              >
                Ask Akviora AI Assistant: “{searchQuery}”
              </MagneticButton>
            </motion.div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{
                    type: 'spring',
                    stiffness: 130,
                    damping: 20,
                    delay: idx * 0.04,
                  }}
                  className="rounded-[22px] border border-[rgba(255,255,255,0.11)] bg-white/[0.025] hover:border-[#5CE1E6]/35 transition-colors overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full text-left p-4 sm:p-6 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-mono text-[#5CE1E6] block">
                        {faq.category}
                      </span>
                      <h2 className="font-display text-lg sm:text-2xl text-[#EAF4F8]">
                        {faq.question}
                      </h2>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                      className="shrink-0"
                    >
                      <ChevronDown className="w-5 h-5 text-[#5CE1E6]" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="px-4 sm:px-6 pb-5 sm:pb-6 pt-1 border-t border-white/5 space-y-4"
                      >
                        <p className="text-[#b8cdd8] text-sm sm:text-base leading-relaxed">
                          {faq.answer}
                        </p>
                        <motion.button
                          type="button"
                          whileHover={{ x: 4 }}
                          onClick={() =>
                            onOpenAssistantWithPrompt(
                              `Tell me more about: ${faq.question}`
                            )
                          }
                          className="inline-flex items-center gap-1.5 text-xs text-[#5CE1E6] hover:underline cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                          <span>Ask Akviora AI follow-up on this topic →</span>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.section>

      {/* Bottom CTA */}
      <FadeUpReveal>
        <section className="rounded-[28px] border border-[rgba(255,255,255,0.11)] bg-white/[0.02] p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h3 className="font-display text-2xl sm:text-3xl text-[#EAF4F8]">
              Still have a specific workflow question?
            </h3>
            <p className="text-sm text-[#8EA6B4]">
              Start a project brief or ask our Akviora AI Assistant for an instant
              feasibility check.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <MagneticButton
              variant="gradient"
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto"
            >
              Start a Project
            </MagneticButton>
          </div>
        </section>
      </FadeUpReveal>
    </div>
  );
};
