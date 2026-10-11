'use client';

import React from 'react';
import { useApp } from '../../lib/app-context';
import { WorkPage } from '../../src/pages/WorkPage';
import { PageErrorBoundary } from '../../src/components/ErrorBoundary';

export default function WorkRoutePage() {
  const { navigate, setSelectedCaseStudy, isBootstrapping } = useApp();

  return (
    <PageErrorBoundary
      routeName="Selected Work & Case Studies"
      onReturnHome={() => navigate('home')}
    >
      <WorkPage
        onNavigate={navigate}
        onSelectCaseStudy={setSelectedCaseStudy}
        isLoading={isBootstrapping}
      />
    </PageErrorBoundary>
  );
}
