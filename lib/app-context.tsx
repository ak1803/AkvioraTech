'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import {
  auth,
  firestoreDb,
  handleFirestoreError,
  OperationType,
  saveBlueprintToFirestore,
  saveInquiryToFirestore,
  saveSuggestionToFirestore,
  signInWithGoogle,
  signOutUser,
  upvoteSuggestionInFirestore,
} from './firebase';
import {
  AIBlueprint,
  AssistantPersonaId,
  CaseStudy,
  PageRoute,
  ProjectInquiry,
  RoutePath,
  UserSuggestion,
} from './types';

const ROUTE_TO_PAGE: Record<string, PageRoute> = {
  '/': 'home',
  '/services': 'services',
  '/ai': 'ai',
  '/work': 'work',
  '/about': 'about',
  '/faq': 'faq',
  '/contact': 'contact',
};

const PAGE_TO_ROUTE: Record<PageRoute, RoutePath> = {
  home: '/',
  services: '/services',
  ai: '/ai',
  work: '/work',
  about: '/about',
  faq: '/faq',
  contact: '/contact',
};

const PAGE_TITLES: Record<PageRoute, string> = {
  home: 'Akviora Technologies | AI, Web & Digital Product Development',
  services: 'Services & Architecture | Akviora Technologies',
  ai: 'AI Assistants & Akviora AI Workflow Studio | Akviora Technologies',
  work: 'Case Studies & Product Portfolio | Akviora Technologies',
  about: 'About & 8-Step Process | Akviora Technologies',
  faq: 'FAQ — AI, SaaS & Engineering | Akviora Technologies',
  contact: 'Start a Project | Akviora Technologies',
};

interface AppContextValue {
  activePage: PageRoute;
  pathname: RoutePath;
  navigate: (page: PageRoute) => void;
  push: (href: RoutePath) => void;
  currentUser: User | null;
  authReady: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signOutUser: () => Promise<void>;
  assistantOpen: boolean;
  setAssistantOpen: React.Dispatch<React.SetStateAction<boolean>>;
  assistantPersona: AssistantPersonaId;
  assistantPrompt?: string;
  openAssistantWithPrompt: (prompt: string, persona?: AssistantPersonaId) => void;
  clearAssistantPrompt: () => void;
  selectedCaseStudy: CaseStudy | null;
  setSelectedCaseStudy: (study: CaseStudy | null) => void;
  suggestions: UserSuggestion[];
  addSuggestionState: (s: UserSuggestion) => void;
  upvoteSuggestion: (id: string) => void;
  inquiries: ProjectInquiry[];
  addInquiryState: (inq: ProjectInquiry) => void;
  blueprints: AIBlueprint[];
  addBlueprintState: (bp: AIBlueprint) => void;
  isBootstrapping: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activePage, setActivePage] = useState<PageRoute>(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname.toLowerCase();
      return ROUTE_TO_PAGE[currentPath] || 'home';
    }
    return 'home';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [isBootstrapping, setIsBootstrapping] = useState<boolean>(true);
  const [assistantOpen, setAssistantOpen] = useState<boolean>(false);
  const [assistantPersona, setAssistantPersona] =
    useState<AssistantPersonaId>('strategy');
  const [assistantPrompt, setAssistantPrompt] = useState<string | undefined>(
    undefined
  );
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(
    null
  );

  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([
    {
      id: 'sug-101',
      authorName: 'Aarav Mehta · Logistics Founder',
      category: 'Business Automation',
      suggestionText:
        'Automate WhatsApp dispatch updates and POD (Proof of Delivery) PDF extraction into our ERP ledger.',
      businessGoal:
        'Eliminate 3 hours of daily manual dispatch status calls and speed up invoice release.',
      aiAssessment:
        'High-ROI workflow: Combine Akviora Document Assistant (for POD OCR extraction) with a webhook automation bridge to trigger instant WhatsApp status notifications and ERP ledger entries.',
      recommendedPillar: 'Business Automation + Document Assistant',
      upvotes: 19,
      createdAt: '2026-10-05T10:30:00.000Z',
    },
    {
      id: 'sug-102',
      authorName: 'Priya Nair · SaaS Product Lead',
      category: 'AI Workflow',
      suggestionText:
        'An interactive onboarding assistant that reads our technical API docs and generates starter code snippets for new developers.',
      businessGoal:
        'Reduce developer time-to-first-API-call from 2 days to under 15 minutes.',
      aiAssessment:
        'Ideal fit for a grounded Knowledge Assistant connected to your OpenAPI spec and markdown docs, paired with copy-ready code blocks and sandbox validation.',
      recommendedPillar: 'AI Solutions (Knowledge Assistant)',
      upvotes: 14,
      createdAt: '2026-10-06T14:15:00.000Z',
    },
  ]);

  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([
    {
      id: 'inq-201',
      name: 'Siddharth Rao',
      email: 'siddharth@vanguardinfra.in',
      company: 'Vanguard Infrastructure',
      serviceInterest: 'AI Solutions & Document Automation',
      budgetRange: '$10k – $25k',
      timeline: '4 – 6 Weeks',
      problemStatement:
        'We process 40+ government and private RFP tenders monthly and need an AI Document Assistant to extract eligibility criteria and BOQ tables.',
      aiSummary:
        'Priority B2B Document Assistant + Tender Workflow portal. Estimated 6-week delivery using Akviora AI structured extraction.',
      createdAt: '2026-10-06T11:20:00.000Z',
      status: 'Discovery Scheduled',
    },
  ]);

  const [blueprints, setBlueprints] = useState<AIBlueprint[]>([
    {
      id: 'bp-301',
      businessType: 'B2B Industrial Equipment Distributor',
      bottleneck:
        'Sales reps spend 4 hours a day answering repetitive technical spec questions and manually preparing PDF quotes.',
      diagnosis:
        'High friction between inbound buyer intent and technical quote generation due to fragmented PDF catalogs.',
      recommendedAssistant: 'Sales Assistant + Knowledge Assistant',
      workflowSteps: [
        {
          stepNumber: 1,
          title: 'Unified Spec Indexing',
          detail:
            'Ingest all equipment spec sheets and pricing tiers into a verified Akviora Knowledge Assistant.',
        },
        {
          stepNumber: 2,
          title: 'Conversational Buyer Qualification',
          detail:
            'Sales Assistant captures operating requirements, volume, and delivery location on web and WhatsApp.',
        },
        {
          stepNumber: 3,
          title: 'Automated Quote Draft & CRM Sync',
          detail:
            'Generate a pre-filled draft quote and notify the assigned regional sales engineer for 1-click approval.',
        },
        {
          stepNumber: 4,
          title: 'Automated Follow-Up Sequence',
          detail:
            'Trigger polite 3-day and 7-day check-ins with instant calendar booking links.',
        },
      ],
      estimatedEfficiencyGain:
        '16+ hours saved per rep weekly · 3.2x faster quote turnaround',
      recommendedStack: [
        'Akviora AI Engine',
        'Next.js App Router Portal',
        'Node.js API',
        'CRM Webhook Sync',
      ],
      createdAt: '2026-10-07T09:00:00.000Z',
    },
  ]);

  // Track Firebase Authentication readiness
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Attach real-time Firestore listeners once auth is ready and user is authenticated
  useEffect(() => {
    if (!authReady || !currentUser || !currentUser.emailVerified) return;

    const suggestionsQuery = query(
      collection(firestoreDb, 'suggestions'),
      where('upvotes', '>=', 1)
    );
    const unsubSuggestions = onSnapshot(
      suggestionsQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudItems: UserSuggestion[] = snapshot.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              id: docSnap.id,
              authorName: d.authorName || 'Innovator',
              category: d.category || 'AI Workflow',
              suggestionText: d.suggestionText || '',
              businessGoal: d.businessGoal || '',
              aiAssessment: d.aiAssessment || '',
              recommendedPillar: d.recommendedPillar || 'AI Solutions',
              upvotes: typeof d.upvotes === 'number' ? d.upvotes : 1,
              createdAt:
                d.createdAt?.toDate?.()?.toISOString?.() ||
                new Date().toISOString(),
            };
          });
          setSuggestions((prev) => {
            const existingIds = new Set(cloudItems.map((c) => c.id));
            return [
              ...cloudItems,
              ...prev.filter((p) => !existingIds.has(p.id)),
            ];
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'suggestions');
      }
    );

    const inquiriesQuery = query(
      collection(firestoreDb, 'inquiries'),
      where('authorId', '==', currentUser.uid)
    );
    const unsubInquiries = onSnapshot(
      inquiriesQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudInquiries: ProjectInquiry[] = snapshot.docs.map(
            (docSnap) => {
              const d = docSnap.data();
              return {
                id: docSnap.id,
                name: d.name || '',
                email: d.email || '',
                company: d.company || '',
                serviceInterest: d.serviceInterest || '',
                budgetRange: d.budgetRange || '',
                timeline: d.timeline || '',
                problemStatement: d.problemStatement || '',
                aiSummary: d.aiSummary || '',
                status: d.status || 'New',
                createdAt:
                  d.createdAt?.toDate?.()?.toISOString?.() ||
                  new Date().toISOString(),
              };
            }
          );
          setInquiries((prev) => {
            const existingIds = new Set(cloudInquiries.map((c) => c.id));
            return [
              ...cloudInquiries,
              ...prev.filter((p) => !existingIds.has(p.id)),
            ];
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'inquiries');
      }
    );

    return () => {
      unsubSuggestions();
      unsubInquiries();
    };
  }, [authReady, currentUser]);

  // Sync browser history popstate (Back/Forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      setActivePage(ROUTE_TO_PAGE[path] || 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load initial data from /api/bootstrap
  useEffect(() => {
    let active = true;
    const startTime = Date.now();
    fetch('/api/bootstrap')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        if (Array.isArray(data.suggestions)) {
          setSuggestions((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            return [
              ...prev,
              ...data.suggestions.filter(
                (s: UserSuggestion) => !existingIds.has(s.id)
              ),
            ];
          });
        }
        if (Array.isArray(data.inquiries)) setInquiries(data.inquiries);
        if (Array.isArray(data.blueprints)) setBlueprints(data.blueprints);
      })
      .catch(() => {
        // Fallback to seeded state
      })
      .finally(() => {
        if (!active) return;
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 240 - elapsed);
        window.setTimeout(() => {
          if (active) setIsBootstrapping(false);
        }, remaining);
      });
    return () => {
      active = false;
    };
  }, []);

  // Update SEO page title
  useEffect(() => {
    document.title = PAGE_TITLES[activePage] || PAGE_TITLES.home;
  }, [activePage]);

  const navigate = (page: PageRoute) => {
    if (page === activePage) {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    setActivePage(page);
    const route = PAGE_TO_ROUTE[page] || '/';
    if (typeof window !== 'undefined' && window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }
  };

  const push = (href: RoutePath) => {
    const targetPage = ROUTE_TO_PAGE[href] || 'home';
    navigate(targetPage);
  };

  const openAssistantWithPrompt = (
    prompt: string,
    persona: AssistantPersonaId = 'strategy'
  ) => {
    setAssistantPersona(persona);
    setAssistantPrompt(prompt);
    setAssistantOpen(true);
  };

  const clearAssistantPrompt = () => {
    setAssistantPrompt(undefined);
  };

  const upvoteSuggestion = async (id: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s))
    );
    try {
      await fetch(`/api/suggestions/${id}/upvote`, { method: 'POST' });
      if (currentUser && currentUser.emailVerified && !id.startsWith('sug-10')) {
        await upvoteSuggestionInFirestore(id);
      }
    } catch {
      // ignore offline error
    }
  };

  const addSuggestionState = (s: UserSuggestion) => {
    setSuggestions((prev) => [s, ...prev]);
    if (currentUser && currentUser.emailVerified) {
      saveSuggestionToFirestore(s, currentUser).catch(() => {});
    }
  };

  const addInquiryState = (inq: ProjectInquiry) => {
    setInquiries((prev) => [inq, ...prev]);
    if (currentUser && currentUser.emailVerified) {
      saveInquiryToFirestore(inq, currentUser).catch(() => {});
    }
  };

  const addBlueprintState = (bp: AIBlueprint) => {
    setBlueprints((prev) => [bp, ...prev]);
    if (currentUser && currentUser.emailVerified) {
      saveBlueprintToFirestore(bp, currentUser).catch(() => {});
    }
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        pathname: PAGE_TO_ROUTE[activePage],
        navigate,
        push,
        currentUser,
        authReady,
        signInWithGoogle,
        signOutUser,
        assistantOpen,
        setAssistantOpen,
        assistantPersona,
        assistantPrompt,
        openAssistantWithPrompt,
        clearAssistantPrompt,
        selectedCaseStudy,
        setSelectedCaseStudy,
        suggestions,
        addSuggestionState,
        upvoteSuggestion,
        inquiries,
        addInquiryState,
        blueprints,
        addBlueprintState,
        isBootstrapping,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
