'use client';

import React from 'react';
import { useApp } from '../../lib/app-context';
import { ServicesPage } from '../../src/pages/ServicesPage';
import { PageErrorBoundary } from '../../src/components/ErrorBoundary';

export default function ServicesRoutePage() {
  const { navigate, openAssistantWithPrompt, isBootstrapping } = useApp();

  return (
    <PageErrorBoundary
      routeName="Services & Architecture"
      onReturnHome={() => navigate('home')}
    >
      <ServicesPage
        onNavigate={navigate}
        onOpenAssistantWithPrompt={openAssistantWithPrompt}
        isLoading={isBootstrapping}
      />
    </PageErrorBoundary>
  );
}
