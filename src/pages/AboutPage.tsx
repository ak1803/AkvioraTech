import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { PageRoute } from '../types/akviora';
import {
  CLIENT_TESTIMONIALS,
  PROCESS_STEPS,
  WHY_AKVIORA_ITEMS,
} from '../data/akvioraData';
import {
  FadeUpReveal,
  KineticHeadline,
  ScrollProcessTimeline,
  ScrollWordScrub,
  STAGGER_CONTAINER_VARIANTS,
  STAGGER_ITEM_VARIANTS,
} from '../components/CinematicScroll';
import { MagneticButton, SafeImage } from '../components/MagneticButton';
import {
  AboutPageSkeleton,
  usePageContentLoading,
} from '../components/ShimmerSkeleton';
import aboutMetallicAiCoreImg from '../assets/images/about_metallic_ai_core_1791646465069.jpg';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
  isLoading?: boolean;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  isLoading = false,
}) => {
  const showPageSkeleton = usePageContentLoading(isLoading, 240);

  if (showPageSkeleton) {
    return <AboutPageSkeleton />;
  }

  return (
    <div className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-12 max-w-[1360px] mx-auto space-y-16 sm:space-y-24">
      {/* 1. About Hero */}
      <section className="pt-4 sm:pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-xs font-mono text-[#5CE1E6] mb-4"
          >
            04 · ABOUT AKVIORA TECHNOLOGIES
          </motion.div>
          <KineticHeadline
            text="Design the experience. Automate the work. Build what's next."
            className="font-display font-bold text-[clamp(32px,6.2vw,88px)] max-w-[15ch] leading-[1.02] text-[#EAF4F8] break-words"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="mt-5 sm:mt-6 max-w-[60ch] text-[#b8cdd8] text-base sm:text-lg leading-relaxed"
          >
            Akviora Technologies was founded on a simple observation: growing
            businesses shouldn&apos;t have to bend their operations around
            disconnected software. We bring product strategy, UI/UX design,
            full-stack engineering, and practical AI automation together in a
            single connected workflow.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="hidden sm:flex lg:col-span-4 items-center justify-center bg-transparent will-change-transform"
        >
          <SafeImage
            src={aboutMetallicAiCoreImg}
            alt="Three-tier metallic architecture representing UI/UX design, full-stack engineering, and AI automation"
            fallbackTitle="Akviora Engineering Studio"
            removeBackground
            className="hidden sm:block md:block w-full h-[320px] sm:h-[420px] lg:h-[480px] aspect-[3/4] object-contain bg-transparent drop-shadow-[0_24px_56px_rgba(92,225,230,0.2)]"
          />
        </motion.div>
      </section>

      {/* 2. Word-Scrub Philosophy */}
      <section className="py-10 border-y border-[rgba(255,255,255,0.11)]">
        <ScrollWordScrub
          text="We start with the business problem, workflow and desired outcome before choosing technology."
          className="font-display text-[clamp(28px,4.6vw,64px)] max-w-[20ch] text-[#EAF4F8]"
        />
      </section>

      {/* 3. Why Akviora Sticky Split */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-[6vw]">
        <div className="lg:sticky lg:top-[20vh] self-start space-y-4">
          <KineticHeadline
            as="h2"
            text="Technology should create clarity, not complexity."
            className="font-display text-[clamp(32px,4.6vw,64px)] text-[#EAF4F8]"
          />
          <p className="text-[#8EA6B4] max-w-[42ch]">
            Our multidisciplinary model eliminates the handoff gap between
            designers, backend engineers, and AI specialists.
          </p>
        </div>

        <div>
          {WHY_AKVIORA_ITEMS.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                type: 'spring',
                stiffness: 115,
                damping: 20,
                delay: idx * 0.06,
              }}
              whileHover={{ x: 6 }}
              className="py-7 border-t border-[rgba(255,255,255,0.11)] will-change-transform"
            >
              <b className="font-display font-medium text-2xl sm:text-3xl text-[#EAF4F8] block">
                {item.title}
              </b>
              <span className="text-[#8EA6B4] mt-1.5 block">
                {item.description}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. 8-Step Animated Process Timeline */}
      <section className="space-y-4">
        <FadeUpReveal>
          <div className="text-xs font-mono text-[#5CE1E6]">
            OUR 8-STAGE DELIVERY LIFECYCLE
          </div>
          <KineticHeadline
            as="h2"
            text="From idea to working system."
            className="font-display text-[clamp(32px,5vw,72px)] max-w-[17ch] text-[#EAF4F8]"
          />
        </FadeUpReveal>
        <ScrollProcessTimeline steps={PROCESS_STEPS} />
      </section>

      {/* 5. Engineering, WCAG Accessibility & SEO Standards */}
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ type: 'spring', stiffness: 110, damping: 20 }}
        className="rounded-[28px] border border-[rgba(255,255,255,0.11)] bg-white/[0.02] p-7 sm:p-10 space-y-8"
      >
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-mono text-[#5CE1E6]">
            QUALITY &amp; COMPLIANCE ARCHITECTURE
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#EAF4F8]">
            Built to Production Standards from Day One
          </h2>
        </div>

        <motion.div
          variants={STAGGER_CONTAINER_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: 'WCAG 2.1 AA Accessibility',
              points: [
                'High-contrast typography (>= 4.5:1 ratio)',
                'Full keyboard focus-visible navigation',
                'Respects prefers-reduced-motion settings',
              ],
            },
            {
              title: 'Technical SEO & Schema.org',
              points: [
                'Validated JSON-LD Organization & FAQ schemas',
                'OpenGraph & Twitter social card metadata',
                'Semantic HTML5 landmarks & fast LCP',
              ],
            },
            {
              title: 'Full-Stack Scalability',
              points: [
                'Server-side AI & API key protection',
                'Modular React + TypeScript + Node architecture',
                '100% source code & database handover',
              ],
            },
          ].map((block) => (
            <motion.div
              key={block.title}
              variants={STAGGER_ITEM_VARIANTS}
              whileHover={{ y: -5 }}
              className="rounded-2xl border border-white/10 bg-[#060B14]/60 hover:border-[#5CE1E6]/40 transition-colors p-6 space-y-3 will-change-transform"
            >
              <h3 className="font-display text-xl text-[#EAF4F8]">
                {block.title}
              </h3>
              <ul className="space-y-2">
                {block.points.map((pt) => (
                  <li
                    key={pt}
                    className="flex items-start gap-2 text-sm text-[#8EA6B4]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#5CE1E6] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 6. Client Proof + CTA */}
      <section className="space-y-10">
        <motion.div
          variants={STAGGER_CONTAINER_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {CLIENT_TESTIMONIALS.map((t) => (
            <motion.blockquote
              key={t.id}
              variants={STAGGER_ITEM_VARIANTS}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-[rgba(255,255,255,0.11)] bg-white/[0.02] hover:border-[#5CE1E6]/40 transition-colors p-6 flex flex-col justify-between will-change-transform"
            >
              <div>
                <div className="text-xs font-mono text-[#5CE1E6] mb-2 tabular-nums">
                  {t.metric}
                </div>
                <p className="text-sm text-[#EAF4F8]/90">“{t.quote}”</p>
              </div>
              <footer className="mt-4 pt-3 border-t border-white/10 text-xs text-[#8EA6B4]">
                <strong className="text-[#EAF4F8] block">{t.author}</strong>
                {t.role} · {t.organization}
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>

        <FadeUpReveal className="flex flex-wrap items-center gap-5">
          <MagneticButton
            variant="gradient"
            onClick={() => onNavigate('contact')}
          >
            Start a Discovery Conversation
          </MagneticButton>
        </FadeUpReveal>
      </section>
    </div>
  );
};
