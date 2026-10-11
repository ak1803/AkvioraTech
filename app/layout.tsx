'use client';

import React from 'react';
import { AppProvider, useApp } from '../lib/app-context';
import { WebGLBackground } from '../components/WebGLBackground';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CaseStudyModal } from '../components/CaseStudyModal';
import { FloatingAIAssistant } from '../components/FloatingAIAssistant';
import { CustomScrollbar } from '../components/CustomScrollbar';
import { PageErrorBoundary } from '../components/ErrorBoundary';
import { SEOHead } from '../components/SEOHead';

export const metadata = {
  title: 'Akviora Technologies | AI, Web & Digital Product Development',
  description:
    'Akviora Technologies builds AI solutions, websites, SaaS products, web applications, UI/UX experiences and business automation systems for growing businesses.',
};

const LayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activePage,
    navigate,
    assistantOpen,
    setAssistantOpen,
    assistantPersona,
    assistantPrompt,
    openAssistantWithPrompt,
    clearAssistantPrompt,
    selectedCaseStudy,
    setSelectedCaseStudy,
    suggestions,
    addSuggestionState,
    upvoteSuggestion,
    currentUser,
    signInWithGoogle,
    signOutUser,
  } = useApp();

  return (
    <div id="top" className="min-h-screen flex flex-col relative">
      <SEOHead activePage={activePage} />
      <WebGLBackground />
      <CustomScrollbar />

      <Header
        activePage={activePage}
        onNavigate={navigate}
        onOpenAssistant={() => setAssistantOpen(true)}
      />

      <main className="flex-1 relative z-10">
        <PageErrorBoundary
          resetKey={activePage}
          routeName={activePage}
          onReturnHome={() => navigate('home')}
        >
          {children}
        </PageErrorBoundary>
      </main>

      <Footer onNavigate={navigate} />

      <CaseStudyModal
        study={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
        onNavigate={navigate}
        onAskAI={(prompt) => openAssistantWithPrompt(prompt)}
      />

      <FloatingAIAssistant
        isOpen={assistantOpen}
        onToggle={() => setAssistantOpen((prev) => !prev)}
        initialPersona={assistantPersona}
        initialPrompt={assistantPrompt}
        onPromptHandled={clearAssistantPrompt}
        onNavigate={navigate}
        suggestions={suggestions}
        onNewSuggestionSaved={addSuggestionState}
        onUpvoteSuggestion={upvoteSuggestion}
        currentUserEmail={currentUser?.email}
        onSignInGoogle={() => {
          signInWithGoogle().catch(() => {});
        }}
        onSignOut={() => {
          signOutUser().catch(() => {});
        }}
      />
    </div>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <LayoutShell>{children}</LayoutShell>
    </AppProvider>
  );
}
