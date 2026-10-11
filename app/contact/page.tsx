'use client';

import React from 'react';
import { useApp } from '../../lib/app-context';
import { ContactPage } from '../../src/pages/ContactPage';
import { PageErrorBoundary } from '../../src/components/ErrorBoundary';

export default function ContactRoutePage() {
  const {
    inquiries,
    addInquiryState,
    openAssistantWithPrompt,
    isBootstrapping,
    navigate,
  } = useApp();

  return (
    <PageErrorBoundary
      routeName="Start a Project"
      onReturnHome={() => navigate('home')}
    >
      <ContactPage
        inquiries={inquiries}
        onNewInquirySaved={addInquiryState}
        onOpenAssistantWithPrompt={openAssistantWithPrompt}
        isLoading={isBootstrapping}
      />
    </PageErrorBoundary>
  );
}
