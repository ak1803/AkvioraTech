/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import RootLayout from '../app/layout';
import HomePageRoute from '../app/page';
import ServicesRoutePage from '../app/services/page';
import AIRoutePage from '../app/ai/page';
import WorkRoutePage from '../app/work/page';
import AboutRoutePage from '../app/about/page';
import FAQRoutePage from '../app/faq/page';
import ContactRoutePage from '../app/contact/page';
import PricingRoutePage from '../app/pricing/page';
import { useApp } from '../lib/app-context';
import { PAGE_TRANSITION_VARIANTS } from './components/CinematicScroll';
import { PageErrorBoundary } from './components/ErrorBoundary';

const ROUTE_LABELS: Record<string, string> = {
  home: 'Home Overview',
  services: 'Services & Architecture',
  pricing: 'Transparent Pricing & Packages',
  ai: 'AI Assistants & Workflow Studio',
  work: 'Selected Work & Case Studies',
  about: 'About & 8-Step Process',
  faq: 'FAQ & Architecture Answers',
  contact: 'Start a Project',
};

const ActiveRouteRenderer: React.FC = () => {
  const { activePage, navigate } = useApp();
  const prefersReducedMotion = useReducedMotion();

  const renderPage = () => {
    switch (activePage) {
      case 'services':
        return <ServicesRoutePage />;
      case 'pricing':
        return <PricingRoutePage />;
      case 'ai':
        return <AIRoutePage />;
      case 'work':
        return <WorkRoutePage />;
      case 'about':
        return <AboutRoutePage />;
      case 'faq':
        return <FAQRoutePage />;
      case 'contact':
        return <ContactRoutePage />;
      case 'home':
      default:
        return <HomePageRoute />;
    }
  };

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        }
      }}
    >
      <motion.div
        key={activePage}
        variants={prefersReducedMotion ? undefined : PAGE_TRANSITION_VARIANTS}
        initial={prefersReducedMotion ? false : 'initial'}
        animate="animate"
        exit={prefersReducedMotion ? undefined : 'exit'}
        className="w-full will-change-[transform,opacity]"
      >
        <PageErrorBoundary
          resetKey={activePage}
          routeName={ROUTE_LABELS[activePage] || 'Page'}
          onReturnHome={() => navigate('home')}
        >
          {renderPage()}
        </PageErrorBoundary>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <PageErrorBoundary routeName="Application Shell">
      <RootLayout>
        <ActiveRouteRenderer />
      </RootLayout>
    </PageErrorBoundary>
  );
}
