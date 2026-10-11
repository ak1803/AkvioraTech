'use client';

import React, { useEffect } from 'react';
import { PageRoute, RoutePath } from '../../lib/types';
import {
  AI_ASSISTANTS,
  CASE_STUDIES,
  FAQ_ITEMS,
  PROCESS_STEPS,
  SERVICE_PILLARS,
} from '../data/akvioraData';

export interface RouteSEOMetadata {
  title: string;
  description: string;
  path: RoutePath;
  keywords: string;
  ogType: 'website' | 'article';
}

export const ROUTE_SEO_CONFIG: Record<PageRoute, RouteSEOMetadata> = {
  home: {
    title: 'Akviora Technologies | AI, Web & Digital Product Development',
    description:
      'Akviora Technologies builds AI solutions, websites, SaaS products, web applications, UI/UX experiences and business automation systems for growing businesses.',
    path: '/',
    keywords:
      'Akviora Technologies, Akviora AI, AI product development, custom web applications, SaaS engineering, business workflow automation, UI/UX design agency',
    ogType: 'website',
  },
  services: {
    title: 'Services & Architecture | Akviora Technologies',
    description:
      'Explore Akviora Technologies’ 6 engineering pillars: AI solutions, web apps, SaaS platforms, UI/UX design, workflow automation, and technical SEO.',
    path: '/services',
    keywords:
      'AI engineering services, custom SaaS development, web app architecture, business process automation, UI/UX design systems, ROI calculator',
    ogType: 'website',
  },
  ai: {
    title: 'AI Assistants & Akviora AI Studio | Akviora Technologies',
    description:
      'Design custom AI workflow blueprints and test specialized Customer, Sales, Operations, Knowledge, and Document AI Assistants powered by Akviora AI.',
    path: '/ai',
    keywords:
      'Akviora AI Studio, business AI assistants, AI workflow blueprint generator, document OCR automation, WhatsApp sales assistant, enterprise knowledge base AI',
    ogType: 'website',
  },
  work: {
    title: 'Case Studies & Product Portfolio | Akviora Technologies',
    description:
      'Inspect real production systems built by Akviora Technologies across FinTech, AI tender intelligence, multi-warehouse inventory, and SaaS operations.',
    path: '/work',
    keywords:
      'software case studies, TrackPayout FinTech, TenderItNow AI, StockCard ERP, SaaS portfolio, enterprise web application examples',
    ogType: 'website',
  },
  about: {
    title: 'About & 8-Step Delivery Process | Akviora Technologies',
    description:
      'Learn how Akviora Technologies unites product strategy, UI/UX design, full-stack engineering, and AI automation in a structured 8-stage delivery lifecycle.',
    path: '/about',
    keywords:
      'about Akviora Technologies, software delivery process, 8-step product engineering, WCAG AA accessibility, full-stack studio philosophy',
    ogType: 'website',
  },
  faq: {
    title: 'FAQ — AI, SaaS & Engineering | Akviora Technologies',
    description:
      'Get clear answers on Akviora AI accuracy, project timelines, source code ownership, security compliance, and custom software pricing.',
    path: '/faq',
    keywords:
      'AI development FAQ, SaaS pricing and timelines, custom software intellectual property, AI data privacy, Akviora Technologies questions',
    ogType: 'website',
  },
  contact: {
    title: 'Start a Project or Discovery Call | Akviora Technologies',
    description:
      'Start your software, SaaS, or AI automation project with Akviora Technologies. Refine your brief with Akviora AI and schedule a 25-minute discovery call.',
    path: '/contact',
    keywords:
      'hire AI developers, start SaaS project, software discovery call, Akviora Technologies contact, hello@akvioratechnologies.com',
    ogType: 'website',
  },
};

function setOrCreateMeta(
  attrName: 'name' | 'property',
  attrValue: string,
  content: string
) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attrName}="${attrValue}"]`
  );
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setOrCreateLink(rel: string, href: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function buildRouteStructuredData(page: PageRoute, origin: string) {
  const meta = ROUTE_SEO_CONFIG[page] || ROUTE_SEO_CONFIG.home;
  const canonicalUrl = `${origin}${meta.path === '/' ? '' : meta.path}`;

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${origin}/`,
      },
      ...(page !== 'home'
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: meta.title.split('|')[0].trim(),
              item: canonicalUrl,
            },
          ]
        : []),
    ],
  };

  const baseOrganization = {
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    name: 'Akviora Technologies',
    url: `${origin}/`,
    email: 'hello@akvioratechnologies.com',
    slogan: "Design the experience. Automate the work. Build what's next.",
    description: ROUTE_SEO_CONFIG.home.description,
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@akvioratechnologies.com',
      contactType: 'sales and technical discovery',
      availableLanguage: ['English'],
    },
  };

  const baseWebSite = {
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    url: `${origin}/`,
    name: 'Akviora Technologies',
    description: 'Technology built around the way your business works.',
    publisher: { '@id': `${origin}/#organization` },
  };

  const graph: Record<string, unknown>[] = [
    baseOrganization,
    baseWebSite,
    breadcrumbSchema,
  ];

  if (page === 'home') {
    graph.push({
      '@type': 'WebApplication',
      name: 'Akviora Technologies — AI & Product Engineering Platform',
      url: canonicalUrl,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      description: meta.description,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free 25-minute workflow discovery and AI blueprint consultation',
      },
    });
  } else if (page === 'services') {
    graph.push({
      '@type': 'ItemList',
      name: 'Akviora Technologies Core Engineering Pillars',
      description: meta.description,
      itemListElement: SERVICE_PILLARS.map((pillar, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Service',
          name: pillar.title,
          description: pillar.description,
          provider: { '@id': `${origin}/#organization` },
        },
      })),
    });
  } else if (page === 'ai') {
    graph.push({
      '@type': 'WebApplication',
      name: 'Akviora AI Workflow Studio',
      url: canonicalUrl,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      description: meta.description,
      featureList: AI_ASSISTANTS.map((a) => `${a.title}: ${a.shortDesc}`),
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    });
  } else if (page === 'work') {
    graph.push({
      '@type': 'CollectionPage',
      name: meta.title,
      url: canonicalUrl,
      description: meta.description,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: CASE_STUDIES.map((cs, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: cs.title,
          description: cs.summary,
        })),
      },
    });
  } else if (page === 'about') {
    graph.push({
      '@type': 'HowTo',
      name: 'Akviora Technologies 8-Stage Delivery Lifecycle',
      description:
        'Structured engineering workflow from business discovery to launch and ongoing evolution.',
      step: PROCESS_STEPS.map((st, idx) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        name: st.title,
        text: st.description,
      })),
    });
  } else if (page === 'faq') {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    });
  } else if (page === 'contact') {
    graph.push({
      '@type': 'ContactPage',
      name: meta.title,
      url: canonicalUrl,
      description: meta.description,
      mainEntity: { '@id': `${origin}/#organization` },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export const SEOHead: React.FC<{ activePage: PageRoute }> = ({ activePage }) => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const meta = ROUTE_SEO_CONFIG[activePage] || ROUTE_SEO_CONFIG.home;
    const origin = window.location.origin;
    const canonicalUrl = `${origin}${meta.path}`;
    const ogImageUrl = `${origin}/og-card.svg`;

    // 1. Document Title
    document.title = meta.title;

    // 2. Standard Meta Tags
    setOrCreateMeta('name', 'description', meta.description);
    setOrCreateMeta('name', 'keywords', meta.keywords);
    setOrCreateMeta(
      'name',
      'robots',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    setOrCreateMeta('name', 'author', 'Akviora Technologies');

    // 3. Canonical URL
    setOrCreateLink('canonical', canonicalUrl);

    // 4. OpenGraph Tags
    setOrCreateMeta('property', 'og:type', meta.ogType);
    setOrCreateMeta('property', 'og:site_name', 'Akviora Technologies');
    setOrCreateMeta('property', 'og:locale', 'en_US');
    setOrCreateMeta('property', 'og:title', meta.title);
    setOrCreateMeta('property', 'og:description', meta.description);
    setOrCreateMeta('property', 'og:url', canonicalUrl);
    setOrCreateMeta('property', 'og:image', ogImageUrl);
    setOrCreateMeta(
      'property',
      'og:image:alt',
      'Akviora Technologies — AI, Web & Digital Product Development'
    );

    // 5. Twitter / X Card Tags
    setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    setOrCreateMeta('name', 'twitter:title', meta.title);
    setOrCreateMeta('name', 'twitter:description', meta.description);
    setOrCreateMeta('name', 'twitter:image', ogImageUrl);
    setOrCreateMeta(
      'name',
      'twitter:image:alt',
      'Akviora Technologies — AI, Web & Digital Product Development'
    );

    // 6. Dynamic Route-Specific Schema.org JSON-LD
    const scriptId = 'akviora-dynamic-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(
      buildRouteStructuredData(activePage, origin)
    );
  }, [activePage]);

  return null;
};

export default SEOHead;
