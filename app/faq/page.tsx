'use client';

import React from 'react';
import { useApp } from '../../lib/app-context';
import { FAQPage } from '../../src/pages/FAQPage';
import { PageErrorBoundary } from '../../src/components/ErrorBoundary';

export default function FAQRoutePage() {
  const { navigate, openAssistantWithPrompt, isBootstrapping } = useApp();

  return (
    <PageErrorBoundary
      routeName="FAQ & Architecture Answers"
      onReturnHome={() => navigate('home')}
    >
      <FAQPage
        onNavigate={navigate}
        onOpenAssistantWithPrompt={openAssistantWithPrompt}
        isLoading={isBootstrapping}
      />
    </PageErrorBoundary>
  );
}
