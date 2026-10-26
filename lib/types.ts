export type PageRoute = 'home' | 'services' | 'pricing' | 'ai' | 'work' | 'about' | 'faq' | 'contact';

export type RoutePath =
  | '/'
  | '/services'
  | '/pricing'
  | '/ai'
  | '/work'
  | '/about'
  | '/faq'
  | '/contact';

export type AssistantPersonaId =
  | 'strategy'
  | 'customer'
  | 'sales'
  | 'knowledge'
  | 'document'
  | 'operations'
  | 'appointment';

export interface AssistantPersona {
  id: AssistantPersonaId;
  title: string;
  shortDesc: string;
  fullDesc: string;
  accentColor: string;
  gridSpan?: string;
  capabilities: string[];
  samplePrompts: string[];
  metrics: string;
}

export interface ServicePillar {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  accentColor: string;
  targetPage: PageRoute;
  targetHref: RoutePath;
  deliverables: string[];
  outcomes: string[];
  timeline: string;
  architectureStack: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  sector: string;
  year: string;
  duration: string;
  image: string;
  summary: string;
  challenge: string;
  solution: string;
  impactMetrics: {
    label: string;
    value: string;
    context: string;
  }[];
  stack: string[];
  featured?: boolean;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  deliverable: string;
  duration: string;
}

export interface FAQItem {
  id: string;
  category: 'AI & Automation' | 'Web & SaaS' | 'Process & Pricing' | 'Security & SEO';
  question: string;
  answer: string;
}

export interface ProjectInquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  serviceInterest: string;
  budgetRange: string;
  timeline: string;
  problemStatement: string;
  aiSummary?: string;
  createdAt: string;
  status: 'New' | 'Reviewed' | 'Discovery Scheduled';
}

export interface UserSuggestion {
  id: string;
  authorName: string;
  category: 'AI Workflow' | 'SaaS Feature' | 'UI/UX Experience' | 'Business Automation';
  suggestionText: string;
  businessGoal: string;
  aiAssessment: string;
  recommendedPillar: string;
  upvotes: number;
  createdAt: string;
}

export interface AIBlueprint {
  id: string;
  businessType: string;
  bottleneck: string;
  diagnosis: string;
  recommendedAssistant: string;
  workflowSteps: {
    stepNumber: number;
    title: string;
    detail: string;
  }[];
  estimatedEfficiencyGain: string;
  recommendedStack: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  personaId: AssistantPersonaId;
  timestamp: string;
  suggestions?: string[];
  recommendedService?: string;
}
