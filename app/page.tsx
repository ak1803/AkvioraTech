'use client';

import React from 'react';
import { useApp } from '../lib/app-context';
import { HomePage } from '../src/pages/HomePage';
import { PageErrorBoundary } from '../src/components/ErrorBoundary';

export default function Page() {
  const {
    navigate,
    openAssistantWithPrompt,
    setSelectedCaseStudy,
    isBootstrapping,
  } = useApp();

  return (
    <PageErrorBoundary
      routeName="Home Overview"
      onReturnHome={() => navigate('home')}
    >
      <HomePage
        onNavigate={navigate}
        onOpenAssistantWithPrompt={openAssistantWithPrompt}
        onSelectCaseStudy={setSelectedCaseStudy}
        isLoading={isBootstrapping}
      />
    </PageErrorBoundary>
  );
}
