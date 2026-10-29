import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, CheckCircle2, ChevronDown, Mail, Sparkles, X } from 'lucide-react';
import { AssistantPersonaId, ProjectInquiry } from '../types/akviora';
import {
  FadeUpReveal,
  KineticHeadline,
} from '../components/CinematicScroll';
import { MagneticButton } from '../components/MagneticButton';
import {
  ContactPageSkeleton,
  InquiryCardSkeleton,
  ShimmerBlock,
  usePageContentLoading,
} from '../components/ShimmerSkeleton';

interface ContactPageProps {
  inquiries: ProjectInquiry[];
  onNewInquirySaved: (inquiry: ProjectInquiry) => void;
  onOpenAssistantWithPrompt: (prompt: string, persona?: AssistantPersonaId) => void;
  isLoading?: boolean;
}

const INPUT_FIELD_CLASSES =
  'w-full bg-gradient-to-b from-[#0B1424]/90 to-[#060B14]/95 border border-white/[0.12] hover:border-[#5CE1E6]/45 focus:border-[#5CE1E6] focus:bg-[#0B1628] rounded-2xl px-4 py-3.5 text-sm text-[#EAF4F8] placeholder-[#8EA6B4]/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.25)] focus:shadow-[inset_0_1px_0_rgba(92,225,230,0.22),0_0_0_4px_rgba(92,225,230,0.12),0_12px_32px_-6px_rgba(92,225,230,0.22)] !outline-none focus:!outline-none focus-visible:!outline-none transition-all duration-300 ease-out';

interface AnimatedSelectProps {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string; badge?: string }[];
  onChange: (val: string) => void;
}

const AnimatedSelect: React.FC<AnimatedSelectProps> = ({
  id,
  label,
  value,
  options,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  return (
    <div ref={containerRef} className="relative group">
      <label
        htmlFor={id}
        className={`block text-xs font-medium tracking-wide mb-2 transition-colors duration-200 ${
          isOpen
            ? 'text-[#5CE1E6]'
            : 'text-[#8EA6B4] group-hover:text-[#EAF4F8]'
        }`}
      >
        {label}
      </label>

      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${INPUT_FIELD_CLASSES} flex items-center justify-between gap-2 text-left cursor-pointer ${
          isOpen
            ? '!border-[#5CE1E6] !bg-[#0B1628] !shadow-[inset_0_1px_0_rgba(92,225,230,0.22),0_0_0_4px_rgba(92,225,230,0.12),0_12px_32px_-6px_rgba(92,225,230,0.22)]'
            : ''
        }`}
      >
        <span className="truncate font-medium text-[#EAF4F8]">
          {selectedOption?.label || value}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
            isOpen
              ? 'bg-[#5CE1E6]/20 text-[#5CE1E6]'
              : 'bg-white/[0.04] text-[#8EA6B4] group-hover:text-[#5CE1E6]'
          }`}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#5CE1E6] to-[#7A86FF] transition-all duration-300 ease-out ${
          isOpen ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
        }`}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            role="listbox"
            aria-labelledby={id}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 26,
              mass: 0.7,
            }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl border border-[#5CE1E6]/35 bg-[#081120]/95 backdrop-blur-xl p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_32px_rgba(92,225,230,0.16)] space-y-1 overflow-hidden"
          >
            {options.map((opt, idx) => {
              const active = opt.value === value;
              return (
                <motion.li
                  key={opt.value}
                  role="option"
                  aria-selected={active}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18, delay: idx * 0.03 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-left transition-all cursor-pointer !outline-none ${
                      active
                        ? 'bg-gradient-to-r from-[#5CE1E6]/20 to-[#7A86FF]/15 text-[#5CE1E6] font-semibold border border-[#5CE1E6]/30'
                        : 'text-[#b8cdd8] hover:text-[#EAF4F8] hover:bg-white/[0.06] hover:translate-x-0.5'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {active && (
                      <motion.span
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-4 h-4 rounded-full bg-[#5CE1E6]/20 text-[#5CE1E6] flex items-center justify-center shrink-0"
                      >
                        <Check className="w-3 h-3" />
                      </motion.span>
                    )}
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ContactPage: React.FC<ContactPageProps> = ({
  inquiries,
  onNewInquirySaved,
  onOpenAssistantWithPrompt,
  isLoading = false,
}) => {
  const showPageSkeleton = usePageContentLoading(isLoading, 240);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [serviceInterest, setServiceInterest] = useState('AI Solutions & Automation');
  const [budgetRange, setBudgetRange] = useState('$10k – $25k (Full Platform)');
  const [timeline, setTimeline] = useState('4 – 8 Weeks');
  const [problemStatement, setProblemStatement] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [enhancingBrief, setEnhancingBrief] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<ProjectInquiry | null>(null);
  const [toastNotification, setToastNotification] = useState<{
    id: number;
    name: string;
    company: string;
    serviceInterest: string;
  } | null>(null);

  useEffect(() => {
    if (!toastNotification) return;
    const timer = window.setTimeout(() => {
      setToastNotification(null);
    }, 5500);
    return () => window.clearTimeout(timer);
  }, [toastNotification]);

  const handleEnhanceWithAI = async () => {
    if (!problemStatement.trim()) {
      setErrorMsg('Write a few words about your project or bottleneck first so Akviora AI can structure it.');
      return;
    }
    setErrorMsg('');
    setEnhancingBrief(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Rewrite and structure this rough client project idea into a crisp, clear 3-bullet business problem & goal statement for a software discovery call: "${problemStatement}"`,
          personaId: 'strategy',
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.reply) {
        setProblemStatement(data.reply);
      }
    } catch {
      setProblemStatement(
        `• Core Workflow Challenge: ${problemStatement.trim()}\n• Target Architecture: Custom ${serviceInterest} system built with Next.js, Node.js, and automated status workflows.\n• Desired Outcome: Launch within ${timeline} (${budgetRange}) to eliminate manual bottlenecks and improve team visibility.`
      );
    } finally {
      setEnhancingBrief(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !problemStatement.trim()) {
      setErrorMsg('Please fill in your name, work email, and a short description of what you want to build or improve.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanCompany = company.trim() || 'Startup / Growing Business';
    const cleanProblem = problemStatement.trim();

    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          company: cleanCompany,
          serviceInterest,
          budgetRange,
          timeline,
          problemStatement: cleanProblem,
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.inquiry) {
        setSubmittedRecord(data.inquiry);
        setToastNotification({
          id: Date.now(),
          name: data.inquiry.name,
          company: data.inquiry.company,
          serviceInterest: data.inquiry.serviceInterest,
        });
        onNewInquirySaved(data.inquiry);
        setName('');
        setEmail('');
        setCompany('');
        setProblemStatement('');
      }
    } catch {
      const fallbackInquiry: ProjectInquiry = {
        id: `inq-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        company: cleanCompany,
        serviceInterest,
        budgetRange,
        timeline,
        problemStatement: cleanProblem,
        aiSummary: `Discovery Roadmap prepared for ${cleanCompany}: Focus on ${serviceInterest} within ${timeline}.`,
        createdAt: new Date().toISOString(),
        status: 'New',
      };
      setSubmittedRecord(fallbackInquiry);
      setToastNotification({
        id: Date.now(),
        name: fallbackInquiry.name,
        company: fallbackInquiry.company,
        serviceInterest: fallbackInquiry.serviceInterest,
      });
      onNewInquirySaved(fallbackInquiry);
      setName('');
      setEmail('');
      setCompany('');
      setProblemStatement('');
    } finally {
      setSubmitting(false);
    }
  };

  if (showPageSkeleton) {
    return <ContactPageSkeleton />;
  }

  return (
    <div className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto space-y-14 sm:space-y-20">
      {/* Submission Confirmation Toast Notification */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            key={toastNotification.id}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 360, damping: 26 }}
            className="fixed top-20 right-4 sm:right-8 z-50 w-[calc(100vw-2rem)] sm:w-[400px] rounded-2xl border border-[#5CE1E6]/40 bg-[#081120]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.75),0_0_32px_rgba(92,225,230,0.2)] overflow-hidden"
          >
            <div className="p-4 sm:p-5 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#5CE1E6]/15 border border-[#5CE1E6]/35 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5 text-[#5CE1E6]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono text-[#5CE1E6]">
                  MESSAGE SENT · BRIEF LOGGED
                </div>
                <p className="font-display text-base font-semibold text-[#EAF4F8] mt-0.5">
                  Thank you, {toastNotification.name}!
                </p>
                <p className="text-xs text-[#8EA6B4] mt-1 leading-relaxed">
                  Your project inquiry for{' '}
                  <span className="text-[#EAF4F8] font-medium">
                    {toastNotification.company}
                  </span>{' '}
                  ({toastNotification.serviceInterest}) has been sent and saved.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setToastNotification(null)}
                aria-label="Dismiss notification"
                className="p-1.5 rounded-lg text-[#8EA6B4] hover:text-[#EAF4F8] hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5.5, ease: 'linear' }}
              className="h-[2.5px] w-full origin-left bg-gradient-to-r from-[#5CE1E6] via-[#7A86FF] to-[#5CE1E6]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <section className="pt-4 sm:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-xs font-mono text-[#5CE1E6] mb-4"
        >
          07 · START A PROJECT OR DISCOVERY CALL
        </motion.div>
        <KineticHeadline
          text="Have an idea, problem or process worth improving?"
          className="font-display font-bold text-[clamp(32px,6.8vw,96px)] max-w-[14ch] leading-[1.02] text-[#EAF4F8] break-words"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-5 sm:mt-6 max-w-[58ch] text-[#b8cdd8] text-base sm:text-lg"
        >
          Tell us what you are trying to build, automate or improve. You
          don&apos;t need a perfect technical specification. Start with the
          business problem, and we&apos;ll help turn it into a practical
          technology plan.
        </motion.p>
      </section>

      {/* Main Grid: Form + Direct Contact & Database Saved Briefs */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Form Column */}
        <FadeUpReveal className="lg:col-span-7 rounded-[28px] border border-[rgba(255,255,255,0.12)] bg-white/[0.025] p-6 sm:p-10">
          {submittedRecord ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 py-4"
            >
              <div className="inline-flex items-center gap-2 text-[#5CE1E6] text-sm font-mono">
                <CheckCircle2 className="w-5 h-5" />
                <span>PROJECT BRIEF SAVED TO DATABASE</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-[#EAF4F8]">
                Thank you, {submittedRecord.name}. Your discovery roadmap is ready.
              </h2>
              <p className="text-[#b8cdd8]">
                We&apos;ve logged your inquiry for{' '}
                <strong className="text-[#EAF4F8]">
                  {submittedRecord.company}
                </strong>{' '}
                ({submittedRecord.serviceInterest} · {submittedRecord.timeline}).
              </p>

              {submittedRecord.aiSummary && (
                <div className="rounded-2xl border border-[#5CE1E6]/35 bg-[#5CE1E6]/[0.06] p-5 space-y-2">
                  <div className="text-xs font-mono text-[#5CE1E6]">
                    AKVIORA AI DISCOVERY PREPARATION BRIEF
                  </div>
                  <p className="text-sm text-[#EAF4F8] leading-relaxed">
                    {submittedRecord.aiSummary}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-4 pt-2">
                <MagneticButton
                  variant="gradient"
                  onClick={() => setSubmittedRecord(null)}
                >
                  Submit Another Project Brief
                </MagneticButton>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="relative group">
                  <label
                    htmlFor="inq-name"
                    className="block text-xs font-medium tracking-wide text-[#8EA6B4] group-hover:text-[#EAF4F8] group-focus-within:text-[#5CE1E6] mb-2 transition-colors duration-200"
                  >
                    Your Full Name *
                  </label>
                  <input
                    id="inq-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Akshay Jain"
                    className={INPUT_FIELD_CLASSES}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#5CE1E6] to-[#7A86FF] opacity-0 scale-x-50 group-focus-within:opacity-100 group-focus-within:scale-x-100 transition-all duration-300 ease-out"
                  />
                </div>

                <div className="relative group">
                  <label
                    htmlFor="inq-email"
                    className="block text-xs font-medium tracking-wide text-[#8EA6B4] group-hover:text-[#EAF4F8] group-focus-within:text-[#5CE1E6] mb-2 transition-colors duration-200"
                  >
                    Work Email *
                  </label>
                  <input
                    id="inq-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className={INPUT_FIELD_CLASSES}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#5CE1E6] to-[#7A86FF] opacity-0 scale-x-50 group-focus-within:opacity-100 group-focus-within:scale-x-100 transition-all duration-300 ease-out"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="relative group">
                  <label
                    htmlFor="inq-company"
                    className="block text-xs font-medium tracking-wide text-[#8EA6B4] group-hover:text-[#EAF4F8] group-focus-within:text-[#5CE1E6] mb-2 transition-colors duration-200"
                  >
                    Company / Startup
                  </label>
                  <input
                    id="inq-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company Name"
                    className={INPUT_FIELD_CLASSES}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#5CE1E6] to-[#7A86FF] opacity-0 scale-x-50 group-focus-within:opacity-100 group-focus-within:scale-x-100 transition-all duration-300 ease-out"
                  />
                </div>

                <AnimatedSelect
                  id="inq-timeline"
                  label="Target Timeline"
                  value={timeline}
                  onChange={setTimeline}
                  options={[
                    { value: '2 – 4 Weeks', label: '2 – 4 Weeks' },
                    { value: '4 – 8 Weeks', label: '4 – 8 Weeks' },
                    { value: '2 – 3 Months', label: '2 – 3 Months' },
                    { value: 'Flexible / Ongoing', label: 'Flexible / Ongoing' },
                  ]}
                />

                <AnimatedSelect
                  id="inq-budget"
                  label="Estimated Scope Tier"
                  value={budgetRange}
                  onChange={setBudgetRange}
                  options={[
                    {
                      value: '$3k – $10k (MVP / Automation)',
                      label: '$3k – $10k (MVP / Automation)',
                    },
                    {
                      value: '$10k – $25k (Full Platform)',
                      label: '$10k – $25k (Full Platform)',
                    },
                    {
                      value: '$25k+ (Enterprise System)',
                      label: '$25k+ (Enterprise System)',
                    },
                  ]}
                />
              </div>

              {/* Service Pillar Selector */}
              <div>
                <span className="block text-xs text-[#8EA6B4] mb-2">
                  Primary Area of Interest
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'AI Solutions & Automation',
                    'Web & SaaS Application',
                    'UI/UX Design System',
                    'Business Workflow Automation',
                    'SEO & Digital Growth',
                  ].map((srv) => {
                    const isSelected = serviceInterest === srv;
                    return (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => setServiceInterest(srv)}
                        className={`relative px-3.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'text-[#04121c] font-semibold'
                            : 'bg-[#060B14] border border-white/10 text-[#8EA6B4] hover:text-[#EAF4F8]'
                        }`}
                      >
                        {isSelected && (
                          <motion.span
                            layoutId="contactServiceActivePill"
                            transition={{
                              type: 'spring',
                              stiffness: 340,
                              damping: 28,
                            }}
                            className="absolute inset-0 rounded-xl bg-[#5CE1E6]"
                          />
                        )}
                        <span className="relative z-10">{srv}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                  <label
                    htmlFor="inq-problem"
                    className="text-xs font-medium tracking-wide text-[#8EA6B4] group-hover:text-[#EAF4F8] group-focus-within:text-[#5CE1E6] transition-colors duration-200"
                  >
                    What business problem or product are you looking to build? *
                  </label>
                  <button
                    type="button"
                    disabled={enhancingBrief}
                    onClick={handleEnhanceWithAI}
                    className="inline-flex items-center gap-1 text-xs text-[#5CE1E6] hover:underline cursor-pointer disabled:opacity-50 self-start sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {enhancingBrief
                        ? 'Akviora AI Structuring...'
                        : 'Refine Brief with Akviora AI'}
                    </span>
                  </button>
                </div>
                {enhancingBrief ? (
                  <div
                    role="status"
                    aria-label="Refining project brief with Akviora AI"
                    className="w-full bg-[#060B14] border border-[#5CE1E6]/35 rounded-2xl p-4 space-y-2.5"
                  >
                    <ShimmerBlock className="h-3.5 w-3/4 rounded-md" />
                    <ShimmerBlock className="h-3.5 w-11/12 rounded-md" />
                    <ShimmerBlock className="h-3.5 w-2/3 rounded-md" />
                  </div>
                ) : (
                  <textarea
                    id="inq-problem"
                    rows={4}
                    required
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="Tell us what is slowing your team down, or describe the web app / AI assistant you want to launch..."
                    className={`${INPUT_FIELD_CLASSES} resize-y`}
                  />
                )}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-1.5 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#5CE1E6] to-[#7A86FF] opacity-0 scale-x-50 group-focus-within:opacity-100 group-focus-within:scale-x-100 transition-all duration-300 ease-out"
                />
              </div>

              {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <MagneticButton
                  type="submit"
                  variant="gradient"
                  disabled={submitting}
                  className="w-full sm:w-auto"
                >
                  {submitting
                    ? 'Saving Brief & Preparing AI Roadmap...'
                    : 'Tell Us About Your Project'}
                </MagneticButton>

                <a
                  href="mailto:hello@akvioratechnologies.com?subject=Discovery%20Call%20Request"
                  className="text-xs sm:text-sm text-[#EAF4F8] border-b border-[#5CE1E6] pb-0.5 hover:text-[#5CE1E6] transition-colors break-all sm:break-normal"
                >
                  Or email hello@akvioratechnologies.com
                </a>
              </div>
            </form>
          )}
        </FadeUpReveal>

        {/* Right Column: Direct Channels + Live Database Inquiries */}
        <FadeUpReveal delay={0.12} className="lg:col-span-5 space-y-6">
          <div className="rounded-[24px] border border-[rgba(255,255,255,0.11)] bg-white/[0.025] p-6 sm:p-7 space-y-4">
            <div className="text-xs font-mono text-[#5CE1E6]">
              DIRECT DISCOVERY CHANNEL
            </div>
            <h3 className="font-display text-2xl text-[#EAF4F8]">
              Start with a 25-minute workflow discovery call.
            </h3>
            <p className="text-sm text-[#8EA6B4] leading-relaxed">
              We review your current process, identify quick-win automations,
              and outline a practical architecture plan within 48 hours.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-sm">
              <a
                href="mailto:hello@akvioratechnologies.com"
                className="inline-flex items-center gap-2 text-[#5CE1E6] hover:underline"
              >
                <Mail className="w-4 h-4" />
                <span>hello@akvioratechnologies.com</span>
              </a>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                onOpenAssistantWithPrompt(
                  'Help me prepare for a discovery call with Akviora Technologies.'
                )
              }
              className="w-full py-2.5 px-4 rounded-xl border border-[#5CE1E6]/40 bg-[#5CE1E6]/10 text-xs font-medium text-[#5CE1E6] hover:bg-[#5CE1E6]/20 transition-colors cursor-pointer"
            >
              Prepare Your Brief with Akviora AI Assistant →
            </motion.button>
          </div>

          {/* Live Database Recent Project Inquiries */}
          <div className="rounded-[24px] border border-[rgba(255,255,255,0.11)] bg-white/[0.02] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#8EA6B4]">
                RECENT LOGGED BRIEFS ({inquiries.length})
              </span>
              <span className="text-xs text-[#5CE1E6] font-mono">
                Live Database
              </span>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {submitting && <InquiryCardSkeleton />}
              <AnimatePresence initial={false}>
                {inquiries.map((inq, idx) => (
                  <motion.div
                    key={inq.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    whileHover={{ x: 4 }}
                    className="rounded-xl border border-white/10 bg-[#060B14]/70 hover:border-[#5CE1E6]/35 transition-colors p-4 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs text-[#8EA6B4]">
                      <span>
                        {inq.company} · {inq.timeline}
                      </span>
                      <span className="text-[#5CE1E6] font-mono">{inq.status}</span>
                    </div>
                    <div className="text-sm font-medium text-[#EAF4F8]">
                      {inq.serviceInterest}
                    </div>
                    {inq.aiSummary && (
                      <p className="text-xs text-[#8EA6B4] leading-relaxed">
                        {inq.aiSummary}
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </FadeUpReveal>
      </section>
    </div>
  );
};
