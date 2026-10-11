'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  X,
  Send,
  Lightbulb,
  ArrowUpRight,
  ThumbsUp,
  CheckCircle2,
} from 'lucide-react';
import {
  AssistantPersonaId,
  ChatMessage,
  PageRoute,
  UserSuggestion,
} from '../lib/types';
import { AI_ASSISTANTS } from '../lib/data';
import {
  buildSmartContextualReply,
  buildSmartSuggestionEvaluation,
} from '../lib/ai-fallback';
import {
  AnimatedSelect,
  COMPACT_INPUT_FIELD_CLASSES,
  FocusBeam,
} from './FormControls';

interface FloatingAIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  initialPersona?: AssistantPersonaId;
  initialPrompt?: string;
  onPromptHandled?: () => void;
  onNavigate: (page: PageRoute) => void;
  suggestions: UserSuggestion[];
  onNewSuggestionSaved: (suggestion: UserSuggestion) => void;
  onUpvoteSuggestion: (id: string) => void;
  currentUserEmail?: string | null;
  onSignInGoogle?: () => void;
  onSignOut?: () => void;
}

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({
  isOpen,
  onToggle,
  initialPersona = 'strategy',
  initialPrompt,
  onPromptHandled,
  onNavigate,
  suggestions,
  onNewSuggestionSaved,
  onUpvoteSuggestion,
  currentUserEmail,
  onSignInGoogle,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'suggest'>('chat');
  const [selectedPersona, setSelectedPersona] =
    useState<AssistantPersonaId>(initialPersona);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      personaId: 'strategy',
      content:
        "Hello! I'm the **Akviora AI Assistant**. I can help you explore our AI solutions, design a workflow automation plan, or take your suggestions for what your business needs next.",
      timestamp: new Date().toISOString(),
      suggestions: [
        'Which AI Assistant fits my business workflow?',
        'How does Akviora automate spreadsheets & WhatsApp?',
        'Estimate timeline for a custom SaaS web app',
      ],
      recommendedService: 'AI Solutions & Business Automation',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [authorName, setAuthorName] = useState('');
  const [category, setCategory] =
    useState<UserSuggestion['category']>('AI Workflow');
  const [suggestionText, setSuggestionText] = useState('');
  const [businessGoal, setBusinessGoal] = useState('');
  const [submittingSuggestion, setSubmittingSuggestion] = useState(false);
  const [latestSavedSuggestion, setLatestSavedSuggestion] =
    useState<UserSuggestion | null>(null);
  const [suggestionError, setSuggestionError] = useState('');

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const personaStripRef = useRef<HTMLDivElement | null>(null);
  const stripDragRef = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  useEffect(() => {
    if (initialPersona) {
      setSelectedPersona(initialPersona);
    }
  }, [initialPersona]);

  useEffect(() => {
    const el = personaStripRef.current;
    if (!el || !isOpen || activeTab !== 'chat') return;

    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      const delta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta !== 0) {
        e.preventDefault();
        e.stopPropagation();
        el.scrollLeft += delta;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      setActiveTab('chat');
      handleSendMessage(initialPrompt);
      onPromptHandled?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      personaId: selectedPersona,
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    const recentHistory = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 30000);
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          personaId: selectedPersona,
          history: recentHistory,
        }),
        signal: controller.signal,
      });
      window.clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const fallback = buildSmartContextualReply({
        message: query,
        personaId: selectedPersona,
        history: recentHistory,
      });
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        personaId: selectedPersona,
        content: data.reply || fallback.reply,
        timestamp: new Date().toISOString(),
        suggestions: Array.isArray(data.suggestedFollowUps)
          ? data.suggestedFollowUps
          : fallback.suggestedFollowUps,
        recommendedService:
          data.recommendedService || fallback.recommendedService,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallback = buildSmartContextualReply({
        message: query,
        personaId: selectedPersona,
        history: recentHistory,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          personaId: selectedPersona,
          content: fallback.reply,
          timestamp: new Date().toISOString(),
          suggestions: fallback.suggestedFollowUps,
          recommendedService: fallback.recommendedService,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestionError('');
    if (!suggestionText.trim()) {
      setSuggestionError(
        'Please describe your workflow suggestion or feature idea.'
      );
      return;
    }

    const cleanAuthor = authorName.trim() || 'Website Visitor';
    const cleanText = suggestionText.trim();
    const cleanGoal =
      businessGoal.trim() ||
      'Automate operations and improve user experience';

    setSubmittingSuggestion(true);
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: cleanAuthor,
          category,
          suggestionText: cleanText,
          businessGoal: cleanGoal,
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.suggestion) {
        setLatestSavedSuggestion(data.suggestion);
        onNewSuggestionSaved(data.suggestion);
        setSuggestionText('');
        setBusinessGoal('');
      }
    } catch {
      const evalResult = buildSmartSuggestionEvaluation({
        authorName: cleanAuthor,
        category,
        suggestionText: cleanText,
        businessGoal: cleanGoal,
      });
      const localSuggestion: UserSuggestion = {
        id: `sug-${Date.now()}`,
        authorName: cleanAuthor,
        category,
        suggestionText: cleanText,
        businessGoal: cleanGoal,
        aiAssessment: evalResult.aiAssessment,
        recommendedPillar: evalResult.recommendedPillar,
        upvotes: 1,
        createdAt: new Date().toISOString(),
      };
      setLatestSavedSuggestion(localSuggestion);
      onNewSuggestionSaved(localSuggestion);
      setSuggestionText('');
      setBusinessGoal('');
    } finally {
      setSubmittingSuggestion(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40">
        <motion.button
          type="button"
          onClick={onToggle}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          aria-label={
            isOpen ? 'Close Akviora AI Assistant' : 'Open Akviora AI Assistant'
          }
          className="akviora-btn-gradient flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full shadow-[0_0_35px_rgba(92,225,230,0.38)] cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#04121c] shrink-0" />
          <span className="font-display font-bold text-xs sm:text-sm text-[#04121c] whitespace-nowrap">
            {isOpen ? 'Close AI Assistant' : 'Akviora AI Assistant'}
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Akviora AI Assistant and Suggestion Box"
            className="fixed bottom-18 sm:bottom-20 left-3 right-3 sm:left-auto sm:right-6 z-50 w-auto sm:w-[440px] max-h-[calc(100dvh-5.5rem)] flex flex-col rounded-[24px] border border-[rgba(255,255,255,0.14)] bg-[#060B14]/95 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.75)] overflow-hidden"
          >
            <div className="shrink-0 px-5 py-4 border-b border-[rgba(255,255,255,0.11)] flex items-center justify-between bg-gradient-to-r from-[#5CE1E6]/10 via-[#7A86FF]/10 to-transparent">
              <div>
                <h2 className="font-display text-lg font-bold text-[#EAF4F8]">
                  Akviora AI Assistant
                </h2>
                <p className="text-xs text-[#8EA6B4]">
                  Akviora AI · Consult &amp; Share Suggestions
                </p>
              </div>
              <div className="flex items-center gap-2">
                {currentUserEmail ? (
                  <button
                    type="button"
                    onClick={onSignOut}
                    title={`Signed in as ${currentUserEmail}`}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#5CE1E6]/15 border border-[#5CE1E6]/35 text-[#5CE1E6] hover:bg-[#5CE1E6]/25 transition-colors cursor-pointer"
                  >
                    Cloud Sync Active · Sign Out
                  </button>
                ) : (
                  onSignInGoogle && (
                    <button
                      type="button"
                      onClick={onSignInGoogle}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/15 text-[#EAF4F8] hover:border-[#5CE1E6]/50 transition-colors cursor-pointer"
                    >
                      Sign In for Cloud Sync
                    </button>
                  )
                )}
                <button
                  type="button"
                  onClick={onToggle}
                  aria-label="Close AI Assistant panel"
                  className="p-1.5 rounded-lg text-[#8EA6B4] hover:text-[#EAF4F8] hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="shrink-0 px-5 pt-3 pb-2 border-b border-[rgba(255,255,255,0.08)] flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'chat'
                    ? 'bg-[#5CE1E6] text-[#04121c] font-semibold'
                    : 'bg-white/5 text-[#8EA6B4] hover:text-[#EAF4F8]'
                }`}
              >
                AI Consultation Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('suggest')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  activeTab === 'suggest'
                    ? 'bg-[#7A86FF] text-[#04121c] font-semibold'
                    : 'bg-white/5 text-[#8EA6B4] hover:text-[#EAF4F8]'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Share Suggestion ({suggestions.length})</span>
              </button>
            </div>

            {activeTab === 'chat' ? (
              <>
                <div
                  ref={personaStripRef}
                  onMouseDown={(e) => {
                    const el = personaStripRef.current;
                    if (!el) return;
                    stripDragRef.current = {
                      isDown: true,
                      startX: e.pageX - el.offsetLeft,
                      scrollLeft: el.scrollLeft,
                      moved: false,
                    };
                  }}
                  onMouseLeave={() => {
                    stripDragRef.current.isDown = false;
                  }}
                  onMouseUp={() => {
                    stripDragRef.current.isDown = false;
                  }}
                  onMouseMove={(e) => {
                    const el = personaStripRef.current;
                    if (!el || !stripDragRef.current.isDown) return;
                    const x = e.pageX - el.offsetLeft;
                    const walk = x - stripDragRef.current.startX;
                    if (Math.abs(walk) > 4) {
                      stripDragRef.current.moved = true;
                      el.scrollLeft = stripDragRef.current.scrollLeft - walk;
                    }
                  }}
                  className="shrink-0 px-4 pt-2.5 pb-2 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-1.5 overflow-x-auto overscroll-x-contain cursor-grab active:cursor-grabbing select-none"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      if (stripDragRef.current.moved) return;
                      setSelectedPersona('strategy');
                      e.currentTarget.scrollIntoView({
                        behavior: 'smooth',
                        inline: 'center',
                        block: 'nearest',
                      });
                    }}
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap cursor-pointer transition-colors ${
                      selectedPersona === 'strategy'
                        ? 'bg-white/15 text-[#5CE1E6] font-medium'
                        : 'text-[#8EA6B4] hover:text-[#EAF4F8]'
                    }`}
                  >
                    All Strategy
                  </button>
                  {AI_ASSISTANTS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={(e) => {
                        if (stripDragRef.current.moved) return;
                        setSelectedPersona(p.id);
                        e.currentTarget.scrollIntoView({
                          behavior: 'smooth',
                          inline: 'center',
                          block: 'nearest',
                        });
                      }}
                      className={`shrink-0 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap cursor-pointer transition-colors ${
                        selectedPersona === p.id
                          ? 'bg-white/15 text-[#5CE1E6] font-medium'
                          : 'text-[#8EA6B4] hover:text-[#EAF4F8]'
                      }`}
                    >
                      {p.title.replace(' Assistant', '')}
                    </button>
                  ))}
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-4 min-h-[160px] sm:min-h-[240px] max-h-[45vh] sm:max-h-[380px]">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-[#5CE1E6] to-[#7A86FF] text-[#04121c] font-medium'
                            : 'bg-white/[0.05] border border-[rgba(255,255,255,0.1)] text-[#EAF4F8]'
                        }`}
                      >
                        <div className="whitespace-pre-line">{msg.content}</div>

                        {msg.recommendedService && msg.role === 'assistant' && (
                          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#5CE1E6]">
                            <span>Recommended: {msg.recommendedService}</span>
                            <button
                              type="button"
                              onClick={() => {
                                onNavigate('contact');
                                onToggle();
                              }}
                              className="inline-flex items-center gap-1 underline hover:text-white cursor-pointer"
                            >
                              <span>Start</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {msg.role === 'assistant' &&
                        msg.suggestions &&
                        msg.suggestions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {msg.suggestions.map((sug, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleSendMessage(sug)}
                                className="text-left text-xs text-[#8EA6B4] hover:text-[#5CE1E6] bg-white/[0.03] hover:bg-white/[0.08] border border-[rgba(255,255,255,0.09)] rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
                              >
                                {sug}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-center gap-2 text-xs text-[#5CE1E6] px-2">
                      <span className="w-2 h-2 rounded-full bg-[#5CE1E6] animate-ping" />
                      <span>Akviora AI is analyzing your workflow...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="shrink-0 p-3.5 border-t border-[rgba(255,255,255,0.11)] bg-[#060B14] flex items-center gap-2.5"
                >
                  <div className="relative flex-1 group">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about AI assistants, SaaS, automation..."
                      aria-label="Ask Akviora AI Assistant"
                      className={COMPACT_INPUT_FIELD_CLASSES}
                    />
                    <FocusBeam className="bottom-0 left-3.5 right-3.5" />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    aria-label="Send message"
                    className="akviora-btn-gradient p-2.5 rounded-xl disabled:opacity-40 cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4 text-[#04121c]" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 min-h-0 p-4 overflow-y-auto overscroll-contain space-y-4 max-h-[460px]">
                <div className="bg-white/[0.03] border border-[rgba(255,255,255,0.1)] rounded-2xl p-3.5">
                  <h3 className="font-display text-sm font-medium text-[#EAF4F8]">
                    Suggest a Feature or Workflow Problem
                  </h3>
                  <p className="text-xs text-[#8EA6B4] mt-1">
                    Share what slows your business down. Our Akviora AI Assistant
                    will evaluate your suggestion and generate an instant
                    architectural recommendation.
                  </p>

                  <form
                    onSubmit={handleSuggestionSubmit}
                    className="mt-3 space-y-2.5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="relative group">
                        <input
                          type="text"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          placeholder="Your Name / Role"
                          className={COMPACT_INPUT_FIELD_CLASSES}
                        />
                        <FocusBeam className="bottom-0 left-3.5 right-3.5" />
                      </div>
                      <AnimatedSelect
                        id="assistant-sug-category"
                        ariaLabel="Suggestion Category"
                        compact
                        value={category}
                        onChange={(val) =>
                          setCategory(val as UserSuggestion['category'])
                        }
                        options={[
                          { value: 'AI Workflow', label: 'AI Workflow' },
                          {
                            value: 'Business Automation',
                            label: 'Business Automation',
                          },
                          { value: 'SaaS Feature', label: 'SaaS Feature' },
                          {
                            value: 'UI/UX Experience',
                            label: 'UI/UX Experience',
                          },
                        ]}
                      />
                    </div>

                    <div className="relative group">
                      <textarea
                        rows={2}
                        value={suggestionText}
                        onChange={(e) => setSuggestionText(e.target.value)}
                        placeholder="What workflow or feature should we build or automate?"
                        className={`${COMPACT_INPUT_FIELD_CLASSES} resize-y`}
                      />
                      <FocusBeam className="bottom-1.5 left-3.5 right-3.5" />
                    </div>

                    <div className="relative group">
                      <input
                        type="text"
                        value={businessGoal}
                        onChange={(e) => setBusinessGoal(e.target.value)}
                        placeholder="Desired business outcome (e.g., Save 10 hrs/week)"
                        className={COMPACT_INPUT_FIELD_CLASSES}
                      />
                      <FocusBeam className="bottom-0 left-3.5 right-3.5" />
                    </div>

                    {suggestionError && (
                      <p className="text-xs text-rose-400">{suggestionError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submittingSuggestion}
                      className="w-full akviora-btn-gradient py-2.5 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
                    >
                      {submittingSuggestion
                        ? 'Analyzing with Akviora AI & Saving...'
                        : 'Submit Suggestion & Get AI Assessment'}
                    </button>
                  </form>
                </div>

                {latestSavedSuggestion && (
                  <div className="bg-[#5CE1E6]/10 border border-[#5CE1E6]/40 rounded-2xl p-3.5 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#5CE1E6]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Saved to Database · Akviora AI Assessment Ready</span>
                    </div>
                    <p className="text-xs text-[#EAF4F8]">
                      {latestSavedSuggestion.aiAssessment}
                    </p>
                    <p className="text-[11px] text-[#8EA6B4]">
                      Recommended: {latestSavedSuggestion.recommendedPillar}
                    </p>
                  </div>
                )}

                <div className="space-y-2.5">
                  <div className="text-xs font-medium text-[#8EA6B4]">
                    Recent Visitor Suggestions &amp; AI Evaluations
                  </div>
                  {suggestions.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/[0.02] border border-[rgba(255,255,255,0.08)] rounded-xl p-3 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#8EA6B4]">
                        <span>
                          {item.authorName} · {item.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpvoteSuggestion(item.id)}
                          className="inline-flex items-center gap-1 text-[#5CE1E6] hover:underline cursor-pointer tabular-nums"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{item.upvotes}</span>
                        </button>
                      </div>
                      <p className="text-xs font-medium text-[#EAF4F8]">
                        “{item.suggestionText}”
                      </p>
                      <p className="text-[11px] text-[#8EA6B4] leading-relaxed">
                        <strong className="text-[#5CE1E6] font-normal">
                          Akviora AI:
                        </strong>{' '}
                        {item.aiAssessment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
