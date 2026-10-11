'use client';

import React, { useEffect, useState } from 'react';

interface ShimmerBlockProps {
  className?: string;
}

export const ShimmerBlock: React.FC<ShimmerBlockProps> = ({
  className = 'h-4 w-full rounded-lg',
}) => (
  <div
    aria-hidden="true"
    className={`akviora-shimmer ${className}`}
  />
);

/**
 * Hook that provides a smooth shimmer skeleton window while page content
 * fetches or hydrates on initial route entry.
 */
export function usePageContentLoading(
  externalFetching: boolean = false,
  minHydrationMs: number = 280
): boolean {
  const [hydrating, setHydrating] = useState<boolean>(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHydrating(false);
    }, minHydrationMs);
    return () => window.clearTimeout(timer);
  }, [minHydrationMs]);

  return hydrating || externalFetching;
}

/**
 * Hook that triggers a crisp micro-shimmer skeleton when switching filters,
 * tabs, or personas so content transitions feel responsive and intentional.
 */
export function useSectionFilterShimmer(
  activeKey: string,
  durationMs: number = 220
): boolean {
  const [switching, setSwitching] = useState<boolean>(false);
  const firstRender = React.useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSwitching(true);
    const timer = window.setTimeout(() => {
      setSwitching(false);
    }, durationMs);
    return () => window.clearTimeout(timer);
  }, [activeKey, durationMs]);

  return switching;
}

/* ============================================================================
 * SECTION-LEVEL REUSABLE SHIMMER SKELETONS
 * ========================================================================== */

export const BlueprintCardSkeleton: React.FC = () => (
  <div
    role="status"
    aria-label="Generating AI workflow blueprint"
    className="rounded-[28px] border border-[#5CE1E6]/25 bg-gradient-to-br from-[#0A1424] to-[#060B14] p-6 sm:p-9 space-y-6"
  >
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
      <div className="space-y-2.5 flex-1 min-w-[200px]">
        <ShimmerBlock className="h-3.5 w-48 rounded-md" />
        <ShimmerBlock className="h-8 w-3/4 rounded-xl" />
      </div>
      <ShimmerBlock className="h-5 w-44 rounded-md" />
    </div>

    <div className="space-y-2.5">
      <ShimmerBlock className="h-3.5 w-56 rounded-md" />
      <ShimmerBlock className="h-4 w-full rounded-md" />
      <ShimmerBlock className="h-4 w-5/6 rounded-md" />
      <ShimmerBlock className="h-4 w-64 rounded-md mt-1" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[0, 1, 2, 3].map((idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 space-y-2.5"
        >
          <ShimmerBlock className="h-3 w-20 rounded-md" />
          <ShimmerBlock className="h-5 w-3/4 rounded-lg" />
          <ShimmerBlock className="h-3.5 w-full rounded-md" />
          <ShimmerBlock className="h-3.5 w-4/5 rounded-md" />
        </div>
      ))}
    </div>

    <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
      <ShimmerBlock className="h-4 w-60 rounded-md" />
      <ShimmerBlock className="h-5 w-44 rounded-md" />
    </div>
  </div>
);

export const SuggestionCardSkeleton: React.FC = () => (
  <div
    role="status"
    aria-label="Loading workflow suggestion"
    className="rounded-[24px] border border-[rgba(255,255,255,0.11)] bg-white/[0.025] p-6 space-y-3.5"
  >
    <div className="flex items-center justify-between gap-2">
      <ShimmerBlock className="h-3.5 w-48 rounded-md" />
      <ShimmerBlock className="h-5 w-24 rounded-md" />
    </div>
    <ShimmerBlock className="h-6 w-11/12 rounded-lg" />
    <ShimmerBlock className="h-4 w-2/3 rounded-md" />
    <div className="rounded-xl bg-[#5CE1E6]/[0.04] border border-[#5CE1E6]/20 p-4 space-y-2">
      <ShimmerBlock className="h-3 w-64 rounded-md" />
      <ShimmerBlock className="h-3.5 w-full rounded-md" />
      <ShimmerBlock className="h-3.5 w-4/5 rounded-md" />
    </div>
  </div>
);

export const InquiryCardSkeleton: React.FC = () => (
  <div
    role="status"
    aria-label="Loading project inquiry brief"
    className="rounded-xl border border-white/10 bg-[#060B14]/70 p-4 space-y-2"
  >
    <div className="flex items-center justify-between gap-2">
      <ShimmerBlock className="h-3.5 w-40 rounded-md" />
      <ShimmerBlock className="h-3.5 w-24 rounded-md" />
    </div>
    <ShimmerBlock className="h-4 w-3/4 rounded-md" />
    <ShimmerBlock className="h-3.5 w-full rounded-md" />
    <ShimmerBlock className="h-3.5 w-5/6 rounded-md" />
  </div>
);

export const ServicePillarPanelSkeleton: React.FC = () => (
  <div
    role="status"
    aria-label="Loading service pillar architecture"
    className="akviora-service-panel p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
  >
    <div className="lg:col-span-7 space-y-5">
      <ShimmerBlock className="h-3.5 w-52 rounded-md" />
      <ShimmerBlock className="h-10 sm:h-12 w-3/4 rounded-xl" />
      <ShimmerBlock className="h-5 w-5/6 rounded-lg" />
      <div className="space-y-2">
        <ShimmerBlock className="h-4 w-full rounded-md" />
        <ShimmerBlock className="h-4 w-11/12 rounded-md" />
        <ShimmerBlock className="h-4 w-4/5 rounded-md" />
      </div>
      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ShimmerBlock key={i} className="h-5 w-full rounded-md" />
        ))}
      </div>
      <div className="pt-3 flex flex-wrap gap-4">
        <ShimmerBlock className="h-12 w-52 rounded-full" />
        <ShimmerBlock className="h-12 w-48 rounded-full" />
      </div>
    </div>
    <div className="lg:col-span-5 space-y-5 bg-[#060B14]/70 border border-[rgba(255,255,255,0.11)] rounded-2xl p-6">
      <ShimmerBlock className="h-3.5 w-48 rounded-md" />
      <div className="space-y-3">
        <ShimmerBlock className="h-12 w-full rounded-xl" />
        <ShimmerBlock className="h-12 w-full rounded-xl" />
        <ShimmerBlock className="h-12 w-full rounded-xl" />
      </div>
      <div className="pt-3 border-t border-white/10 space-y-2">
        <ShimmerBlock className="h-3.5 w-44 rounded-md" />
        <ShimmerBlock className="h-4 w-full rounded-md" />
      </div>
    </div>
  </div>
);

export const CaseStudyCardSkeleton: React.FC<{ isWide?: boolean }> = ({
  isWide = false,
}) => (
  <div
    role="status"
    aria-label="Loading case study"
    className={`${
      isWide ? 'md:col-span-6 lg:col-span-7' : 'md:col-span-6 lg:col-span-5'
    } rounded-[28px] border border-[rgba(255,255,255,0.11)] bg-white/[0.02] overflow-hidden flex flex-col justify-between`}
  >
    <ShimmerBlock className="w-full aspect-[16/10] rounded-none border-0 border-b border-white/10" />
    <div className="p-5 sm:p-8 space-y-6">
      <div className="space-y-3">
        <ShimmerBlock className="h-3.5 w-40 rounded-md" />
        <ShimmerBlock className="h-8 sm:h-10 w-3/4 rounded-xl" />
        <ShimmerBlock className="h-4 w-full rounded-md" />
        <ShimmerBlock className="h-4 w-5/6 rounded-md" />
      </div>
      <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <ShimmerBlock className="h-7 w-20 rounded-lg" />
            <ShimmerBlock className="h-3 w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const FAQItemSkeleton: React.FC = () => (
  <div
    role="status"
    aria-label="Loading FAQ item"
    className="rounded-[22px] border border-[rgba(255,255,255,0.11)] bg-white/[0.025] p-6 flex items-center justify-between gap-4"
  >
    <div className="space-y-2.5 flex-1">
      <ShimmerBlock className="h-3 w-32 rounded-md" />
      <ShimmerBlock className="h-6 w-4/5 rounded-lg" />
    </div>
    <ShimmerBlock className="h-6 w-6 rounded-full shrink-0" />
  </div>
);

/* ============================================================================
 * FULL-PAGE LAYOUT-MATCHED SHIMMER SKELETONS FOR ALL 7 ROUTES
 * ========================================================================== */

export const HomePageSkeleton: React.FC = () => (
  <div
    role="status"
    aria-label="Loading Home page content"
    className="pt-24 sm:pt-28 pb-16 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto space-y-20 overflow-hidden"
  >
    {/* Hero Split Skeleton */}
    <section className="min-h-[82svh] grid grid-cols-1 lg:grid-cols-[1.2fr_0.95fr] gap-8 lg:gap-10 items-center">
      <div className="space-y-5">
        <ShimmerBlock className="h-12 sm:h-16 lg:h-20 w-11/12 rounded-2xl" />
        <ShimmerBlock className="h-12 sm:h-16 lg:h-20 w-4/5 rounded-2xl" />
        <ShimmerBlock className="h-12 sm:h-16 lg:h-20 w-2/3 rounded-2xl" />
        <div className="space-y-2.5 pt-2 max-w-[54ch]">
          <ShimmerBlock className="h-4 w-full rounded-md" />
          <ShimmerBlock className="h-4 w-11/12 rounded-md" />
          <ShimmerBlock className="h-4 w-3/4 rounded-md" />
        </div>
        <div className="flex flex-wrap gap-4 pt-3">
          <ShimmerBlock className="h-13 w-48 rounded-full" />
          <ShimmerBlock className="h-13 w-44 rounded-full" />
        </div>
      </div>

      <div className="rounded-[28px] border border-[rgba(255,255,255,0.11)] bg-white/[0.02] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <ShimmerBlock className="h-4 w-40 rounded-md" />
          <ShimmerBlock className="h-4 w-24 rounded-md" />
        </div>
        <ShimmerBlock className="h-56 sm:h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-3">
          <ShimmerBlock className="h-16 w-full rounded-xl" />
          <ShimmerBlock className="h-16 w-full rounded-xl" />
          <ShimmerBlock className="h-16 w-full rounded-xl" />
        </div>
      </div>
    </section>

    {/* Problem / Diagnostic Section Skeleton */}
    <section className="rounded-[32px] border border-[rgba(255,255,255,0.11)] bg-white/[0.02] p-6 sm:p-12 space-y-8">
      <div className="space-y-3 max-w-2xl">
        <ShimmerBlock className="h-3.5 w-44 rounded-md" />
        <ShimmerBlock className="h-10 sm:h-12 w-4/5 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <ShimmerBlock key={i} className="h-14 w-full rounded-2xl" />
          ))}
        </div>
        <div className="lg:col-span-7">
          <ShimmerBlock className="h-72 w-full rounded-3xl" />
        </div>
      </div>
    </section>

    {/* Service Pillars Bento Grid Skeleton */}
    <section className="space-y-6">
      <ShimmerBlock className="h-10 w-72 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <ShimmerBlock key={i} className="h-64 w-full rounded-[28px]" />
        ))}
      </div>
    </section>
  </div>
);

export const ServicesPageSkeleton: React.FC = () => (
  <div
    role="status"
    aria-label="Loading Services page content"
    className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-12 max-w-[1360px] mx-auto space-y-16 sm:space-y-24 overflow-hidden"
  >
    <section className="pt-4 sm:pt-8 space-y-4">
      <ShimmerBlock className="h-3.5 w-64 rounded-md" />
      <ShimmerBlock className="h-12 sm:h-16 w-4/5 max-w-3xl rounded-2xl" />
      <ShimmerBlock className="h-12 sm:h-16 w-3/5 max-w-2xl rounded-2xl" />
      <div className="space-y-2 pt-2 max-w-[62ch]">
        <ShimmerBlock className="h-4 w-full rounded-md" />
        <ShimmerBlock className="h-4 w-5/6 rounded-md" />
      </div>
    </section>

    <section className="space-y-6">
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-[rgba(255,255,255,0.1)] w-full sm:w-fit">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ShimmerBlock key={i} className="h-10 w-36 rounded-xl" />
        ))}
      </div>
      <ServicePillarPanelSkeleton />
    </section>
  </div>
);

export const AIPageSkeleton: React.FC = () => (
  <div
    role="status"
    aria-label="Loading AI Studio page content"
    className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-12 max-w-[1360px] mx-auto space-y-16 sm:space-y-24 overflow-hidden"
  >
    <section className="pt-4 sm:pt-8 space-y-4">
      <ShimmerBlock className="h-3.5 w-72 rounded-md" />
      <ShimmerBlock className="h-12 sm:h-16 w-4/5 max-w-3xl rounded-2xl" />
      <ShimmerBlock className="h-12 sm:h-16 w-2/3 max-w-2xl rounded-2xl" />
      <div className="space-y-2 pt-2 max-w-[62ch]">
        <ShimmerBlock className="h-4 w-full rounded-md" />
        <ShimmerBlock className="h-4 w-4/5 rounded-md" />
      </div>
    </section>

    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <ShimmerBlock
          key={i}
          className={`h-48 rounded-[24px] ${i < 2 ? 'lg:col-span-2' : ''}`}
        />
      ))}
    </section>

    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 rounded-[28px] border border-[rgba(255,255,255,0.11)] bg-white/[0.025] p-6 sm:p-8 space-y-4">
        <ShimmerBlock className="h-4 w-48 rounded-md" />
        <ShimmerBlock className="h-8 w-4/5 rounded-xl" />
        <ShimmerBlock className="h-4 w-full rounded-md" />
        <ShimmerBlock className="h-12 w-full rounded-xl" />
        <ShimmerBlock className="h-24 w-full rounded-xl" />
        <ShimmerBlock className="h-12 w-full rounded-full" />
      </div>
      <div className="lg:col-span-7">
        <BlueprintCardSkeleton />
      </div>
    </section>
  </div>
);

export const WorkPageSkeleton: React.FC = () => (
  <div
    role="status"
    aria-label="Loading Work portfolio page content"
    className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-12 max-w-[1360px] mx-auto space-y-14 sm:space-y-20 overflow-hidden"
  >
    <section className="pt-4 sm:pt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
      <div className="space-y-4 flex-1">
        <ShimmerBlock className="h-3.5 w-64 rounded-md" />
        <ShimmerBlock className="h-12 sm:h-16 w-4/5 max-w-2xl rounded-2xl" />
        <ShimmerBlock className="h-12 sm:h-16 w-3/5 max-w-xl rounded-2xl" />
      </div>
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-[rgba(255,255,255,0.11)]">
        {[0, 1, 2, 3].map((i) => (
          <ShimmerBlock key={i} className="h-9 w-32 rounded-xl" />
        ))}
      </div>
    </section>

    <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <CaseStudyCardSkeleton isWide />
      <CaseStudyCardSkeleton />
      <CaseStudyCardSkeleton />
      <CaseStudyCardSkeleton isWide />
    </section>
  </div>
);

export const AboutPageSkeleton: React.FC = () => (
  <div
    role="status"
    aria-label="Loading About page content"
    className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-12 max-w-[1360px] mx-auto space-y-16 sm:space-y-24 overflow-hidden"
  >
    <section className="pt-4 sm:pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
      <div className="lg:col-span-8 space-y-4">
        <ShimmerBlock className="h-3.5 w-56 rounded-md" />
        <ShimmerBlock className="h-12 sm:h-16 w-11/12 rounded-2xl" />
        <ShimmerBlock className="h-12 sm:h-16 w-3/4 rounded-2xl" />
        <div className="space-y-2 pt-2 max-w-[60ch]">
          <ShimmerBlock className="h-4 w-full rounded-md" />
          <ShimmerBlock className="h-4 w-11/12 rounded-md" />
          <ShimmerBlock className="h-4 w-4/5 rounded-md" />
        </div>
      </div>
      <div className="lg:col-span-4">
        <ShimmerBlock className="w-full h-[380px] sm:h-[440px] rounded-[28px]" />
      </div>
    </section>

    <section className="py-10 border-y border-[rgba(255,255,255,0.11)] space-y-3">
      <ShimmerBlock className="h-10 w-4/5 rounded-xl" />
      <ShimmerBlock className="h-10 w-3/5 rounded-xl" />
    </section>

    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[0, 1, 2].map((i) => (
        <ShimmerBlock key={i} className="h-48 w-full rounded-2xl" />
      ))}
    </section>
  </div>
);

export const FAQPageSkeleton: React.FC = () => (
  <div
    role="status"
    aria-label="Loading FAQ page content"
    className="pt-28 pb-20 px-5 sm:px-8 lg:px-12 max-w-[1160px] mx-auto space-y-16"
  >
    <section className="pt-8 space-y-5">
      <ShimmerBlock className="h-3.5 w-72 rounded-md" />
      <ShimmerBlock className="h-12 sm:h-16 w-4/5 max-w-2xl rounded-2xl" />
      <ShimmerBlock className="h-4 w-2/3 max-w-xl rounded-md" />
      <div className="flex flex-col md:flex-row gap-4 pt-2">
        <ShimmerBlock className="h-12 flex-1 rounded-2xl" />
        <div className="flex flex-wrap gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <ShimmerBlock key={i} className="h-12 w-28 rounded-xl" />
          ))}
        </div>
      </div>
    </section>

    <section className="space-y-3.5">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <FAQItemSkeleton key={i} />
      ))}
    </section>
  </div>
);

export const ContactPageSkeleton: React.FC = () => (
  <div
    role="status"
    aria-label="Loading Contact page content"
    className="pt-28 pb-20 px-5 sm:px-8 lg:px-12 max-w-[1360px] mx-auto space-y-20"
  >
    <section className="pt-8 space-y-4">
      <ShimmerBlock className="h-3.5 w-64 rounded-md" />
      <ShimmerBlock className="h-12 sm:h-16 w-4/5 max-w-2xl rounded-2xl" />
      <ShimmerBlock className="h-4 w-2/3 max-w-xl rounded-md" />
    </section>

    <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      <div className="lg:col-span-7 rounded-[28px] border border-[rgba(255,255,255,0.12)] bg-white/[0.025] p-6 sm:p-10 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ShimmerBlock className="h-12 w-full rounded-xl" />
          <ShimmerBlock className="h-12 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ShimmerBlock className="h-12 w-full rounded-xl" />
          <ShimmerBlock className="h-12 w-full rounded-xl" />
          <ShimmerBlock className="h-12 w-full rounded-xl" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <ShimmerBlock key={i} className="h-9 w-40 rounded-xl" />
          ))}
        </div>
        <ShimmerBlock className="h-28 w-full rounded-xl" />
        <ShimmerBlock className="h-12 w-56 rounded-full" />
      </div>

      <div className="lg:col-span-5 space-y-6">
        <div className="rounded-[24px] border border-[rgba(255,255,255,0.11)] bg-white/[0.025] p-6 space-y-4">
          <ShimmerBlock className="h-3.5 w-44 rounded-md" />
          <ShimmerBlock className="h-8 w-4/5 rounded-xl" />
          <ShimmerBlock className="h-4 w-full rounded-md" />
          <ShimmerBlock className="h-10 w-full rounded-xl" />
        </div>
        <div className="rounded-[24px] border border-[rgba(255,255,255,0.11)] bg-white/[0.02] p-6 space-y-3">
          <ShimmerBlock className="h-4 w-48 rounded-md" />
          <InquiryCardSkeleton />
          <InquiryCardSkeleton />
        </div>
      </div>
    </section>
  </div>
);
