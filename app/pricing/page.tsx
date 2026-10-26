'use client';

import React from 'react';
import { useApp } from '../../lib/app-context';
import { PricingPage } from '../../src/pages/PricingPage';
import { PageErrorBoundary } from '../../src/components/ErrorBoundary';

export default function PricingRoutePage() {
  const { navigate, openAssistantWithPrompt, isBootstrapping } = useApp();

  return (
    <PageErrorBoundary
      routeName="Pricing & Packages"
      onReturnHome={() => navigate('home')}
    >
      <PricingPage
        onNavigate={navigate}
        onOpenAssistantWithPrompt={openAssistantWithPrompt}
        isLoading={isBootstrapping}
      />
    </PageErrorBoundary>
  );
}
