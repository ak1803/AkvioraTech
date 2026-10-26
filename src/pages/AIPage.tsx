import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  ThumbsUp,
  Cpu,
} from 'lucide-react';
import {
  AIBlueprint,
  AssistantPersonaId,
  PageRoute,
  UserSuggestion,
} from '../types/akviora';
import { AI_ASSISTANTS } from '../data/akvioraData';
import {
  buildSmartBlueprint,
  buildSmartSuggestionEvaluation,
} from '../../lib/ai-fallback';
import {
  FadeUpReveal,
  KineticHeadline,
  SpotlightBentoTile,
} from '../components/CinematicScroll';
import { MagneticButton, SafeImage } from '../components/MagneticButton';
import customerAssistantMetallicImg from '../assets/images/customer_assistant_metallic_1791729500313.webp';
import {
  AnimatedSelect,
  FocusBeam,
  INPUT_FIELD_CLASSES,
  INPUT_LABEL_CLASSES,
} from '../components/FormControls';
import {
  AIPageSkeleton,
  BlueprintCardSkeleton,
  SuggestionCardSkeleton,
  usePageContentLoading,
} from '../components/ShimmerSkeleton';
import { GeminiVoiceAssistant } from '../components/GeminiVoiceAssistant';

interface AIPageProps {
  onNavigate: (page: PageRoute) => void;
  onOpenAssistantWithPrompt: (prompt: string, persona?: AssistantPersonaId) => void;
  suggestions: UserSuggestion[];
  onNewSuggestionSaved: (s: UserSuggestion) => void;
  onUpvoteSuggestion: (id: string) => void;
  blueprints: AIBlueprint[];
  onNewBlueprintSaved: (b: AIBlueprint) => void;
  isLoading?: boolean;
}

export const AIPage: React.FC<AIPageProps> = ({
  onNavigate,
  onOpenAssistantWithPrompt,
  suggestions,
  onNewSuggestionSaved,
  onUpvoteSuggestion,
  blueprints,
  onNewBlueprintSaved,
  isLoading = false,
}) => {
  const showPageSkeleton = usePageContentLoading(isLoading, 240);
  const [selectedAssistantId, setSelectedAssistantId] =
    useState<AssistantPersonaId>('customer');

  // Blueprint Generator State
  const [businessType, setBusinessType] = useState('');
  const [bottleneck, setBottleneck] = useState('');
  const [generatingBlueprint, setGeneratingBlueprint] = useState(false);
  const [blueprintError, setBlueprintError] = useState('');
  const [activeBlueprint, setActiveBlueprint] = useState<AIBlueprint | null>(
    blueprints[0] || null
  );
  const [copiedBlueprint, setCopiedBlueprint] = useState(false);

  React.useEffect(() => {
    if (!activeBlueprint && blueprints.length > 0) {
      setActiveBlueprint(blueprints[0]);
    }
  }, [blueprints, activeBlueprint]);

  // Suggestion Submission State
  const [sugAuthor, setSugAuthor] = useState('');
  const [sugCategory, setSugCategory] =
    useState<UserSuggestion['category']>('AI Workflow');
  const [sugText, setSugText] = useState('');
  const [sugGoal, setSugGoal] = useState('');
  const [submittingSug, setSubmittingSug] = useState(false);
  const [sugError, setSugError] = useState('');
  const [sugSuccess, setSugSuccess] = useState(false);

  const activeAssistant =
    AI_ASSISTANTS.find((a) => a.id === selectedAssistantId) || AI_ASSISTANTS[0];

  const handleGenerateBlueprint = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlueprintError('');
    if (!businessType.trim() || !bottleneck.trim()) {
      setBlueprintError(
        'Please enter both your industry/business type and the workflow bottleneck you want to solve.'
      );
      return;
    }

    const cleanBusiness = businessType.trim();
    const cleanBottleneck = bottleneck.trim();

    setGeneratingBlueprint(true);
    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 30000);
      const res = await fetch('/api/ai/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType: cleanBusiness,
          bottleneck: cleanBottleneck,
        }),
        signal: controller.signal,
      });
      window.clearTimeout(timeoutId);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.blueprint) {
        setActiveBlueprint(data.blueprint);
        onNewBlueprintSaved(data.blueprint);
      }
    } catch {
      const generated = buildSmartBlueprint({
        businessType: cleanBusiness,
        bottleneck: cleanBottleneck,
      });
      const fallbackBp: AIBlueprint = {
        id: `bp-${Date.now()}`,
        businessType: cleanBusiness,
        bottleneck: cleanBottleneck,
        ...generated,
        createdAt: new Date().toISOString(),
      };
      setActiveBlueprint(fallbackBp);
      onNewBlueprintSaved(fallbackBp);
    } finally {
      setGeneratingBlueprint(false);
    }
  };

  const handleCreateSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSugError('');
    setSugSuccess(false);
    if (!sugText.trim()) {
      setSugError('Please describe your workflow suggestion or feature idea.');
      return;
    }

    const cleanAuthor = sugAuthor.trim() || 'Founder / Team Lead';
    const cleanText = sugText.trim();
    const cleanGoal =
      sugGoal.trim() || 'Automate repetitive tasks and speed up customer response';

    setSubmittingSug(true);
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: cleanAuthor,
          category: sugCategory,
          suggestionText: cleanText,
          businessGoal: cleanGoal,
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.suggestion) {
        onNewSuggestionSaved(data.suggestion);
        setSugText('');
        setSugGoal('');
        setSugSuccess(true);
      }
    } catch {
      const evalResult = buildSmartSuggestionEvaluation({
        authorName: cleanAuthor,
        category: sugCategory,
        suggestionText: cleanText,
        businessGoal: cleanGoal,
      });
      const localSuggestion: UserSuggestion = {
        id: `sug-${Date.now()}`,
        authorName: cleanAuthor,
        category: sugCategory,
        suggestionText: cleanText,
        businessGoal: cleanGoal,
        aiAssessment: evalResult.aiAssessment,
        recommendedPillar: evalResult.recommendedPillar,
        upvotes: 1,
        createdAt: new Date().toISOString(),
      };
      onNewSuggestionSaved(localSuggestion);
      setSugText('');
      setSugGoal('');
      setSugSuccess(true);
    } finally {
      setSubmittingSug(false);
    }
  };

  if (showPageSkeleton) {
    return <AIPageSkeleton />;
  }

  return (
    <div className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-12 max-w-[1360px] mx-auto space-y-16 sm:space-y-24">
      {/* 1. AI Page Hero */}
      <section className="pt-4 sm:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-xs font-mono text-[#5CE1E6] mb-4"
        >
          02 · AKVIORA AI STUDIO · INTELLIGENT WORKFLOW ARCHITECTURE
        </motion.div>
        <KineticHeadline
          text="What if your business had an assistant that never forgets the process?"
          className="font-display font-bold text-[clamp(32px,6.4vw,92px)] max-w-[16ch] leading-[1.02] text-[#EAF4F8] break-words"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-5 sm:mt-6 max-w-[62ch] text-[#b8cdd8] text-base sm:text-lg"
        >
          An AI assistant can become more than a chatbot. It can understand your
          business information, qualify leads, summarize documents and trigger
          the next step in a workflow—built around a specific business need
          rather than because AI is trending.
        </motion.p>
      </section>

      {/* 2. Interactive Gemini Voice Assistant Studio */}
      <section className="space-y-6">
        <FadeUpReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
            <div>
              <div className="text-[11px] sm:text-xs font-mono text-[#5CE1E6] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5CE1E6] animate-pulse shrink-0" />
                <span className="truncate">VOICE AI CAPABILITY · GEMINI 3.8 LIVE SPEECH</span>
              </div>
              <h2 className="font-display font-bold text-2xl xs:text-3xl sm:text-4xl lg:text-5xl text-[#EAF4F8] tracking-tight leading-tight">
                Akviora Gemini Voice Assistant
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#8EA6B4] max-w-md leading-relaxed">
              Experience hands-free speech dialogue with real-time waveform visualizers, voice persona switching, and Gemini TTS audio synthesis.
            </p>
          </div>
        </FadeUpReveal>

        <GeminiVoiceAssistant
          initialPersonaId={selectedAssistantId}
          onExploreServices={() => onNavigate('services')}
        />
      </section>

      {/* 3. Interactive 6-Assistant Bento Grid + Live Persona Inspector */}
      <section className="space-y-8 sm:space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(190px,auto)] gap-4">
          {AI_ASSISTANTS.map((assistant, idx) => {
            const isSelected = assistant.id === selectedAssistantId;
            return (
              <SpotlightBentoTile
                key={assistant.id}
                delay={idx * 0.05}
                onClick={() => setSelectedAssistantId(assistant.id)}
                className={`${assistant.gridSpan || ''} ${
                  isSelected
                    ? 'border-[#5CE1E6] ring-1 ring-[#5CE1E6]/40'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono text-[#8EA6B4] tabular-nums">
                  <span>0{idx + 1}</span>
                  <span
                    className={
                      isSelected ? 'text-[#5CE1E6] font-semibold' : 'text-[#8EA6B4]'
                    }
                  >
                    {isSelected ? 'Active Mode' : 'Select Mode'}
                  </span>
                </div>

                <div className="mt-4 flex flex-col justify-between flex-1">
                  {idx === 0 && (
                    <div className="mb-4 relative flex items-center justify-center bg-transparent">
                      <SafeImage
                        src={customerAssistantMetallicImg}
                        alt="3D metallic AI Customer Assistant core"
                        fallbackTitle="Customer Assistant Core"
                        removeBackground
                        className="relative z-10 w-full max-w-[300px] h-[180px] sm:h-[205px] object-contain bg-transparent drop-shadow-[0_18px_36px_rgba(92,225,230,0.22)] transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div>
                    <b className="font-display text-2xl sm:text-3xl text-[#EAF4F8] block">
                      {assistant.title}
                    </b>
                    <span className="text-sm text-[#8EA6B4] mt-1.5 block">
                      {assistant.shortDesc}
                    </span>
                  </div>
                </div>
              </SpotlightBentoTile>
            );
          })}
        </div>

        {/* Active Assistant Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAssistant.id}
            initial={{ opacity: 0, y: 18, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 145, damping: 22 }}
            style={{ '--c': activeAssistant.accentColor } as React.CSSProperties}
            className="akviora-service-panel p-5 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center"
          >
            <div className="lg:col-span-7 relative z-10 space-y-4">
              <div className="text-xs font-mono text-[#5CE1E6] tabular-nums">
                {activeAssistant.metrics}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-[#EAF4F8]">
                {activeAssistant.title}
              </h2>
              <p className="text-[#b8cdd8] leading-relaxed">
                {activeAssistant.fullDesc}
              </p>
              <ul className="space-y-2 pt-2">
                {activeAssistant.capabilities.map((cap, idx) => (
                  <motion.li
                    key={cap}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, delay: idx * 0.04 }}
                    className="flex items-start gap-2.5 text-sm text-[#EAF4F8]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#5CE1E6] shrink-0 mt-1" />
                    <span>{cap}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5 relative z-10 bg-[#060B14]/75 border border-[rgba(255,255,255,0.12)] rounded-2xl p-6 space-y-4">
              <div className="text-xs font-mono text-[#8EA6B4]">
                TEST {activeAssistant.title.toUpperCase()} WITH AKVIORA AI
              </div>
              <div className="space-y-2">
                {activeAssistant.samplePrompts.map((prompt) => (
                  <motion.button
                    key={prompt}
                    type="button"
                    whileHover={{ x: 4 }}
                    onClick={() =>
                      onOpenAssistantWithPrompt(prompt, activeAssistant.id)
                    }
                    className="w-full text-left p-3 rounded-xl bg-white/[0.04] hover:bg-[#5CE1E6]/15 border border-white/10 hover:border-[#5CE1E6]/50 text-xs sm:text-sm text-[#EAF4F8] transition-colors flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span>“{prompt}”</span>
                    <ArrowRight className="w-4 h-4 text-[#5CE1E6] shrink-0" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 3. LIVE AKVIORA AI WORKFLOW BLUEPRINT GENERATOR */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
        <FadeUpReveal className="lg:col-span-5 space-y-5 bg-white/[0.025] border border-[rgba(255,255,255,0.11)] rounded-[28px] p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#5CE1E6]">
            <Cpu className="w-4 h-4" />
            <span>LIVE AKVIORA AI ARCHITECT</span>
          </div>
          <h2 className="font-display text-3xl text-[#EAF4F8]">
            Generate a Custom AI Workflow Blueprint
          </h2>
          <p className="text-sm text-[#8EA6B4]">
            Tell our Akviora AI about your industry and your biggest manual
            bottleneck. It will design a 4-step automation blueprint and save it
            to the database.
          </p>

          <form onSubmit={handleGenerateBlueprint} className="space-y-5 pt-2">
            <div className="relative group">
              <label
                htmlFor="bp-business"
                className={INPUT_LABEL_CLASSES}
              >
                Your Business or Industry
              </label>
              <input
                id="bp-business"
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="e.g., Real Estate Agency, Logistics SME, B2B SaaS"
                className={INPUT_FIELD_CLASSES}
              />
              <FocusBeam />
            </div>

            <div className="relative group">
              <label
                htmlFor="bp-bottleneck"
                className={INPUT_LABEL_CLASSES}
              >
                What manual process is slowing your team down?
              </label>
              <textarea
                id="bp-bottleneck"
                rows={3}
                value={bottleneck}
                onChange={(e) => setBottleneck(e.target.value)}
                placeholder="e.g., Our sales team spends 3 hours daily answering repetitive WhatsApp pricing questions and copying leads into spreadsheets."
                className={`${INPUT_FIELD_CLASSES} resize-y`}
              />
              <FocusBeam className="bottom-1.5 left-4 right-4" />
            </div>

            {blueprintError && (
              <p className="text-xs text-rose-400">{blueprintError}</p>
            )}

            <MagneticButton
              type="submit"
              variant="gradient"
              disabled={generatingBlueprint}
              className="w-full px-5 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base"
            >
              {generatingBlueprint
                ? 'Akviora AI is Designing Your Blueprint...'
                : 'Generate 4-Step AI Blueprint'}
            </MagneticButton>
          </form>
        </FadeUpReveal>

        {/* Blueprint Output Display */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {generatingBlueprint ? (
              <motion.div
                key="blueprint-loading-skeleton"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <BlueprintCardSkeleton />
              </motion.div>
            ) : (
            activeBlueprint && (
              <motion.div
                key={activeBlueprint.id}
                initial={{ opacity: 0, y: 18, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.99 }}
                transition={{ type: 'spring', stiffness: 140, damping: 22 }}
                className="rounded-[28px] border border-[#5CE1E6]/35 bg-gradient-to-br from-[#0A1424] to-[#060B14] p-6 sm:p-9 space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono text-[#5CE1E6] block">
                      GENERATED AI ARCHITECTURE BLUEPRINT
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl text-[#EAF4F8] mt-1">
                      {activeBlueprint.businessType}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[#8EA6B4] tabular-nums">
                    {activeBlueprint.estimatedEfficiencyGain}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono text-[#8EA6B4]">
                    DIAGNOSIS &amp; RECOMMENDED ASSISTANT
                  </div>
                  <p className="text-sm text-[#b8cdd8]">
                    {activeBlueprint.diagnosis}
                  </p>
                  <p className="text-sm text-[#5CE1E6] font-medium">
                    Recommended System: {activeBlueprint.recommendedAssistant}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeBlueprint.workflowSteps.map((step, idx) => (
                    <motion.div
                      key={step.stepNumber}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.06 }}
                      whileHover={{ y: -4 }}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] hover:border-[#5CE1E6]/40 transition-colors p-4 space-y-1.5"
                    >
                      <div className="text-xs font-mono text-[#5CE1E6] tabular-nums">
                        STEP 0{step.stepNumber}
                      </div>
                      <div className="font-display text-lg text-[#EAF4F8]">
                        {step.title}
                      </div>
                      <p className="text-xs text-[#8EA6B4] leading-relaxed">
                        {step.detail}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-[#8EA6B4]">
                    Stack: {activeBlueprint.recommendedStack.join(' · ')}
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        const text = `${activeBlueprint.businessType} — ${activeBlueprint.recommendedAssistant}\nDiagnosis: ${activeBlueprint.diagnosis}\n${activeBlueprint.workflowSteps
                          .map((s) => `${s.stepNumber}. ${s.title}: ${s.detail}`)
                          .join('\n')}`;
                        navigator.clipboard?.writeText(text);
                        setCopiedBlueprint(true);
                        setTimeout(() => setCopiedBlueprint(false), 2000);
                      }}
                      className="text-xs text-[#8EA6B4] hover:text-[#EAF4F8] transition-colors cursor-pointer"
                    >
                      {copiedBlueprint ? 'Copied to Clipboard ✓' : 'Copy Blueprint'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('contact')}
                      className="text-sm text-[#5CE1E6] hover:underline inline-flex items-center gap-1.5 cursor-pointer font-medium"
                    >
                      <span>Build This System With Akviora</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
            )}
          </AnimatePresence>

          {blueprints.length > 1 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#8EA6B4]">Saved Blueprints:</span>
              {blueprints.slice(0, 4).map((bp) => (
                <button
                  key={bp.id}
                  type="button"
                  onClick={() => setActiveBlueprint(bp)}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                    activeBlueprint?.id === bp.id
                      ? 'bg-[#5CE1E6]/20 text-[#5CE1E6] border border-[#5CE1E6]/40'
                      : 'bg-white/5 text-[#8EA6B4] hover:text-[#EAF4F8]'
                  }`}
                >
                  {bp.businessType}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. AI SUGGESTION ENGINE & COMMUNITY WORKFLOW WALL */}
      <section className="space-y-10 pt-8 border-t border-[rgba(255,255,255,0.11)]">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#7A86FF]">
            <Lightbulb className="w-4 h-4" />
            <span>AI SUGGESTION BOX &amp; FEASIBILITY BOARD</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl text-[#EAF4F8]">
            Share Your Workflow Suggestion. Get an Instant Akviora AI Review.
          </h2>
          <p className="text-[#8EA6B4]">
            Have an idea for an AI assistant, business automation, or SaaS tool?
            Submit your suggestion below—our backend stores it in the database
            and uses Akviora AI to evaluate the best implementation approach.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Submit Suggestion Form */}
          <form
            onSubmit={handleCreateSuggestion}
            className="lg:col-span-5 rounded-[24px] border border-[rgba(255,255,255,0.11)] bg-white/[0.025] p-6 sm:p-7 space-y-4"
          >
            <h3 className="font-display text-xl text-[#EAF4F8]">
              Submit a Workflow or Feature Idea
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative group">
                <label
                  htmlFor="sug-author"
                  className={INPUT_LABEL_CLASSES}
                >
                  Your Name &amp; Role
                </label>
                <input
                  id="sug-author"
                  type="text"
                  value={sugAuthor}
                  onChange={(e) => setSugAuthor(e.target.value)}
                  placeholder="e.g., Rohan · Operations"
                  className={INPUT_FIELD_CLASSES}
                />
                <FocusBeam />
              </div>

              <AnimatedSelect
                id="sug-cat"
                label="Category"
                value={sugCategory}
                onChange={(val) =>
                  setSugCategory(val as UserSuggestion['category'])
                }
                options={[
                  { value: 'AI Workflow', label: 'AI Workflow' },
                  { value: 'Business Automation', label: 'Business Automation' },
                  { value: 'SaaS Feature', label: 'SaaS Feature' },
                  { value: 'UI/UX Experience', label: 'UI/UX Experience' },
                ]}
              />
            </div>

            <div className="relative group">
              <label
                htmlFor="sug-text"
                className={INPUT_LABEL_CLASSES}
              >
                Your Suggestion or Problem to Automate
              </label>
              <textarea
                id="sug-text"
                rows={3}
                value={sugText}
                onChange={(e) => setSugText(e.target.value)}
                placeholder="Describe the assistant or workflow you wish your business had..."
                className={`${INPUT_FIELD_CLASSES} resize-y`}
              />
              <FocusBeam className="bottom-1.5 left-4 right-4" />
            </div>

            <div className="relative group">
              <label
                htmlFor="sug-goal"
                className={INPUT_LABEL_CLASSES}
              >
                Target Business Outcome
              </label>
              <input
                id="sug-goal"
                type="text"
                value={sugGoal}
                onChange={(e) => setSugGoal(e.target.value)}
                placeholder="e.g., Cut response time from 4 hours to 30 seconds"
                className={INPUT_FIELD_CLASSES}
              />
              <FocusBeam />
            </div>

            {sugError && <p className="text-xs text-rose-400">{sugError}</p>}
            {sugSuccess && (
              <p className="text-xs text-[#5CE1E6]">
                Suggestion saved to database with Akviora AI architectural review!
              </p>
            )}

            <MagneticButton
              type="submit"
              variant="gradient"
              disabled={submittingSug}
              className="w-full px-5 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base"
            >
              {submittingSug
                ? 'Evaluating with Akviora AI...'
                : 'Submit Suggestion & Get AI Review'}
            </MagneticButton>
          </form>

          {/* Database Suggestions Feed */}
          <div className="lg:col-span-7 space-y-4">
            {submittingSug && <SuggestionCardSkeleton />}
            {suggestions.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 20,
                  delay: idx * 0.04,
                }}
                whileHover={{ y: -4 }}
                className="rounded-[24px] border border-[rgba(255,255,255,0.11)] bg-white/[0.025] hover:border-[#5CE1E6]/40 transition-colors p-6 space-y-3 will-change-transform"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[#8EA6B4]">
                  <span>
                    {item.authorName} · {item.category}
                  </span>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={() => onUpvoteSuggestion(item.id)}
                    className="inline-flex items-center gap-1.5 text-[#5CE1E6] hover:text-[#EAF4F8] transition-colors cursor-pointer font-mono tabular-nums"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Upvote ({item.upvotes})</span>
                  </motion.button>
                </div>

                <h4 className="font-display text-xl text-[#EAF4F8]">
                  “{item.suggestionText}”
                </h4>

                <p className="text-xs text-[#8EA6B4]">
                  Goal: {item.businessGoal}
                </p>

                <div className="rounded-xl bg-[#5CE1E6]/[0.06] border border-[#5CE1E6]/25 p-4 space-y-1">
                  <div className="text-xs font-mono text-[#5CE1E6]">
                    AKVIORA AI ARCHITECTURAL ASSESSMENT · {item.recommendedPillar}
                  </div>
                  <p className="text-sm text-[#EAF4F8]/90 leading-relaxed">
                    {item.aiAssessment}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
