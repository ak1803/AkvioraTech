'use client';

import React from 'react';
import { useApp } from '../../lib/app-context';
import { AIPage } from '../../src/pages/AIPage';
import { PageErrorBoundary } from '../../src/components/ErrorBoundary';

export default function AIRoutePage() {
  const {
    navigate,
    openAssistantWithPrompt,
    suggestions,
    addSuggestionState,
    upvoteSuggestion,
    blueprints,
    addBlueprintState,
    isBootstrapping,
  } = useApp();

  return (
    <PageErrorBoundary
      routeName="AI Assistants & Workflow Studio"
      onReturnHome={() => navigate('home')}
    >
      <AIPage
        onNavigate={navigate}
        onOpenAssistantWithPrompt={openAssistantWithPrompt}
        suggestions={suggestions}
        onNewSuggestionSaved={addSuggestionState}
        onUpvoteSuggestion={upvoteSuggestion}
        blueprints={blueprints}
        onNewBlueprintSaved={addBlueprintState}
        isLoading={isBootstrapping}
      />
    </PageErrorBoundary>
  );
}
