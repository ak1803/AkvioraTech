'use client';

import React from 'react';
import { useApp } from '../../lib/app-context';
import { AboutPage } from '../../src/pages/AboutPage';
import { PageErrorBoundary } from '../../src/components/ErrorBoundary';

export default function AboutRoutePage() {
  const { navigate, isBootstrapping } = useApp();

  return (
    <PageErrorBoundary
      routeName="About & 8-Step Process"
      onReturnHome={() => navigate('home')}
    >
      <AboutPage onNavigate={navigate} isLoading={isBootstrapping} />
    </PageErrorBoundary>
  );
}
