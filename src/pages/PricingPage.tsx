import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Bot,
  Calculator,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Globe,
  Layers,
  MessageSquare,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Workflow,
  Wrench,
  Zap,
} from 'lucide-react';
import { AssistantPersonaId, PageRoute } from '../types/akviora';
import {
  FadeUpReveal,
  KineticHeadline,
} from '../components/CinematicScroll';
import { MagneticButton } from '../components/MagneticButton';
import {
  ServicesPageSkeleton,
  usePageContentLoading,
} from '../components/ShimmerSkeleton';

export interface PricingService {
  id: string;
  name: string;
  priceFormatted: string;
  priceNumeric: number;
  billingType: 'one-time' | 'monthly';
  hasPlusSign?: boolean;
  category: 'web-design' | 'ai-automation' | 'growth-seo';
  categoryLabel: string;
  shortDesc: string;
  timeline: string;
  deliverables: string[];
  popular?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

export const PRICING_SERVICES: PricingService[] = [
  {
    id: 'ui-ux-design',
    name: 'UI/UX design for web or mobile app',
    priceFormatted: '₹7,999',
    priceNumeric: 7999,
    billingType: 'one-time',
    category: 'web-design',
    categoryLabel: 'Design & Web',
    shortDesc:
      'High-fidelity Figma wireframes, interactive prototypes, design system tokens, and WCAG AA compliant user flows.',
    timeline: '5–8 business days',
    popular: true,
    icon: Layers,
    deliverables: [
      'Comprehensive user journey & wireframe maps',
      'High-fidelity Figma source files with component design tokens',
      'Mobile, tablet & desktop responsive screen layouts',
      'Interactive clickable prototype for investor & stakeholder testing',
      'Full typography, contrast & WCAG 2.1 AA accessibility audit',
    ],
  },
  {
    id: 'landing-page',
    name: 'Landing page design and development',
    priceFormatted: '₹4,999',
    priceNumeric: 4999,
    billingType: 'one-time',
    category: 'web-design',
    categoryLabel: 'Design & Web',
    shortDesc:
      'High-converting, bespoke React/Tailwind landing page engineered for lightning speed, SEO, and lead capture.',
    timeline: '3–5 business days',
    popular: true,
    icon: Globe,
    deliverables: [
      'Custom React + Tailwind modern responsive layout',
      'Conversion-focused hero, feature grid & social proof sections',
      'Lead capture form with instant email / CRM webhook routing',
      '95+ Google PageSpeed score performance optimization',
      'Basic on-page SEO meta tags, OpenGraph cards & sitemap',
    ],
  },
  {
    id: 'google-business-profile',
    name: 'Google Business Profile setup',
    priceFormatted: '₹1,999',
    priceNumeric: 1999,
    billingType: 'one-time',
    category: 'growth-seo',
    categoryLabel: 'Local Growth & SEO',
    shortDesc:
      'End-to-end Google Business Profile configuration, verification guidance, category tagging, and local map optimization.',
    timeline: '1–2 business days',
    icon: Search,
    deliverables: [
      'Complete profile creation or claim & verification assistance',
      'Accurate geo-coordinates, service radius & operational hours',
      'High-intent primary & secondary category mapping',
      'High-resolution logo, cover photo & service catalog upload',
      'Review generation link setup & initial review responder template',
    ],
  },
  {
    id: 'local-seo-monthly',
    name: 'Local SEO monthly service',
    priceFormatted: '₹4,999/month',
    priceNumeric: 4999,
    billingType: 'monthly',
    category: 'growth-seo',
    categoryLabel: 'Local Growth & SEO',
    shortDesc:
      'Continuous local search dominance, citation building, Google Map pack rank tracking, and on-page geo-targeting.',
    timeline: 'Ongoing monthly retainer',
    popular: true,
    icon: Search,
    deliverables: [
      'Targeted local keyword tracking across 3-pack Google Maps',
      '15+ consistent local business directory citations per month',
      'Weekly Google Business Profile updates, posts & offer creation',
      'Local schema markup & geo-targeted landing page recommendations',
      'Comprehensive monthly keyword position & inbound traffic report',
    ],
  },
  {
    id: 'social-media-content',
    name: 'Social media content creation',
    priceFormatted: '₹3,999/month',
    priceNumeric: 3999,
    billingType: 'monthly',
    category: 'growth-seo',
    categoryLabel: 'Local Growth & SEO',
    shortDesc:
      'Brand-aligned social graphics, carousel templates, engaging copy, and hashtag strategies tailored to your industry.',
    timeline: 'Ongoing monthly retainer',
    icon: Share2,
    deliverables: [
      '12 professionally designed branded posts & carousels per month',
      'Compelling, conversion-focused copywriting with targeted hashtags',
      'Editable Figma/Canva templates for brand consistency',
      'Content calendar scheduled 14 days in advance for approval',
      'Formats optimized for Instagram, LinkedIn, Facebook & Twitter',
    ],
  },
  {
    id: 'website-maintenance',
    name: 'Website maintenance',
    priceFormatted: '₹1,499/month',
    priceNumeric: 1499,
    billingType: 'monthly',
    category: 'web-design',
    categoryLabel: 'Design & Web',
    shortDesc:
      'Proactive security monitoring, core/plugin updates, automated daily backups, and dedicated monthly content edits.',
    timeline: 'Ongoing monthly retainer',
    icon: Wrench,
    deliverables: [
      'Daily automated cloud backups with 1-click restore assurance',
      'Security firewall monitoring, SSL check & malware scanning',
      'Monthly framework, dependency & plugin version updates',
      'Up to 2 hours of priority content, banner or copy updates per month',
      '24/7 uptime monitoring with instant alert notification',
    ],
  },
  {
    id: 'whatsapp-business-setup',
    name: 'WhatsApp Business setup',
    priceFormatted: '₹1,999',
    priceNumeric: 1999,
    billingType: 'one-time',
    category: 'growth-seo',
    categoryLabel: 'Local Growth & SEO',
    shortDesc:
      'Official WhatsApp Business profile creation, verified catalog, auto-greeting templates, and quick reply shortcuts.',
    timeline: '1–2 business days',
    icon: MessageSquare,
    deliverables: [
      'Official WhatsApp Business account setup & verified catalog',
      'Automated greeting, away & out-of-office response configuration',
      'Up to 10 quick-reply keyboard shortcuts for frequently asked questions',
      'Interactive product/service catalog with direct order links',
      'Website click-to-chat button & QR code badge generation',
    ],
  },
  {
    id: 'whatsapp-workflow-automation',
    name: 'WhatsApp workflow automation',
    priceFormatted: '₹4,999+',
    priceNumeric: 4999,
    billingType: 'one-time',
    hasPlusSign: true,
    category: 'ai-automation',
    categoryLabel: 'AI & Automation',
    shortDesc:
      'Automated multi-step WhatsApp flows via Official Cloud API / webhooks: lead alerts, booking confirmations & CRM sync.',
    timeline: '3–6 business days',
    popular: true,
    icon: Workflow,
    deliverables: [
      'WhatsApp Cloud API / provider webhook architecture integration',
      'Multi-step conversational lead capture & qualification funnel',
      'Instant SMS/Email alerts to sales reps upon high-intent inbound inquiries',
      'Automated calendar appointment reminder & confirmation triggers',
      'Direct synchronization with Google Sheets, Airtable, or your CRM',
    ],
  },
  {
    id: 'ai-chatbot-integration',
    name: 'AI chatbot integration',
    priceFormatted: '₹7,999+',
    priceNumeric: 7999,
    billingType: 'one-time',
    hasPlusSign: true,
    category: 'ai-automation',
    categoryLabel: 'AI & Automation',
    shortDesc:
      'Custom LLM-powered chatbot trained on your company knowledge base, docs, FAQs, and product catalog for 24/7 support.',
    timeline: '5–8 business days',
    popular: true,
    icon: Bot,
    deliverables: [
      'Custom vector knowledge base ingestion (PDFs, URLs, FAQs, manuals)',
      'Brand persona prompt engineering with hallucination guardrails',
      'Floating website widget with mobile-optimized responsive UI',
      'Human handoff escalation trigger when complex issues arise',
      'Conversation logging, analytics dashboard & feedback capture',
    ],
  },
  {
    id: 'n8n-business-automation',
    name: 'Business process automation with n8n',
    priceFormatted: '₹7,999+',
    priceNumeric: 7999,
    billingType: 'one-time',
    hasPlusSign: true,
    category: 'ai-automation',
    categoryLabel: 'AI & Automation',
    shortDesc:
      'Enterprise-grade n8n workflow orchestration eliminating repetitive tasks across CRM, email, billing, and database systems.',
    timeline: '5–10 business days',
    popular: true,
    icon: Zap,
    deliverables: [
      'Self-hosted or cloud n8n orchestration instance configuration',
      'Multi-app workflow pipelines (Stripe/Razorpay, CRM, Gmail, Slack, DB)',
      'Automated invoice generation, PDF delivery & customer receipt emails',
      'Data cleanup, transformation & cross-platform synchronization',
      'Comprehensive error-handling, webhook fallback & retry alerting',
    ],
  },
];

interface PricingBundle {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  startingPrice: string;
  savings: string;
  serviceIds: string[];
  description: string;
  targetAudience: string;
  timeline: string;
}

const PRICING_BUNDLES: PricingBundle[] = [
  {
    id: 'starter-launch',
    name: 'Starter Digital Launchpad',
    subtitle: 'From zero to validated online presence with local search reach',
    badge: 'Popular for Local Businesses',
    startingPrice: '₹7,999',
    savings: 'Save ₹998 vs itemized list',
    serviceIds: ['landing-page', 'google-business-profile', 'whatsapp-business-setup'],
    description:
      'Everything required to establish instant credibility: a fast conversion-focused landing page, Google Business Profile ranking on Google Maps, and official WhatsApp Business onboarding.',
    targetAudience: 'Local service businesses, clinics, retail shops, freelancers & consultants',
    timeline: '5–7 business days',
  },
  {
    id: 'ai-automation-accelerator',
    name: 'AI & Workflow Automation Suite',
    subtitle: 'Autonomous 24/7 lead handling, CRM sync, and operational scale',
    badge: 'High ROI for Agencies & B2B',
    startingPrice: '₹18,999',
    savings: 'Save ₹2,000+ on bundle onboarding',
    serviceIds: [
      'ai-chatbot-integration',
      'whatsapp-workflow-automation',
      'n8n-business-automation',
    ],
    description:
      'Equip your business with an autonomous 24/7 sales agent: a custom AI chatbot answering client queries, automated WhatsApp lead qualification, and n8n backend pipes keeping all tools in sync.',
    targetAudience: 'Growing SaaS companies, B2B service firms, e-commerce & real estate brokerages',
    timeline: '10–14 business days',
  },
  {
    id: 'continuous-growth-retainer',
    name: 'Complete Growth & Care Retainer',
    subtitle: 'Continuous inbound organic reach, active branding & zero-downtime health',
    badge: 'Monthly Growth Engine',
    startingPrice: '₹8,999/month',
    savings: 'Save ₹1,498/month on recurring bundle',
    serviceIds: ['local-seo-monthly', 'social-media-content', 'website-maintenance'],
    description:
      'A dedicated digital growth team at a fraction of the cost: continuous Google 3-pack Map rankings, 12 monthly social media assets, and worry-free website security & backups.',
    targetAudience: 'Businesses wanting steady inbound leads and hands-off digital peace of mind',
    timeline: 'Ongoing monthly partnership',
  },
];

interface PricingPageProps {
  onNavigate: (page: PageRoute) => void;
  onOpenAssistantWithPrompt: (prompt: string, persona?: AssistantPersonaId) => void;
  isLoading?: boolean;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigate,
  onOpenAssistantWithPrompt,
  isLoading = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([
    'landing-page',
    'google-business-profile',
    'whatsapp-business-setup',
  ]);
  const [copiedScope, setCopiedScope] = useState(false);

  const showPageSkeleton = usePageContentLoading(isLoading, 220);

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'all') return PRICING_SERVICES;
    if (selectedCategory === 'monthly') {
      return PRICING_SERVICES.filter((s) => s.billingType === 'monthly');
    }
    return PRICING_SERVICES.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectBundle = (bundle: PricingBundle) => {
    setSelectedServiceIds(bundle.serviceIds);
    // Smooth scroll to estimator
    const el = document.getElementById('package-estimator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculations for custom estimator
  const estimatorSummary = useMemo(() => {
    const selectedServices = PRICING_SERVICES.filter((s) =>
      selectedServiceIds.includes(s.id)
    );
    const oneTimeServices = selectedServices.filter(
      (s) => s.billingType === 'one-time'
    );
    const monthlyServices = selectedServices.filter(
      (s) => s.billingType === 'monthly'
    );

    const oneTimeTotal = oneTimeServices.reduce(
      (sum, s) => sum + s.priceNumeric,
      0
    );
    const monthlyTotal = monthlyServices.reduce(
      (sum, s) => sum + s.priceNumeric,
      0
    );
    const hasPlus = selectedServices.some((s) => s.hasPlusSign);

    return {
      selectedCount: selectedServices.length,
      selectedServices,
      oneTimeServices,
      monthlyServices,
      oneTimeTotal,
      monthlyTotal,
      hasPlus,
    };
  }, [selectedServiceIds]);

  const handleCopyScopeSummary = () => {
    if (estimatorSummary.selectedCount === 0) return;
    const lines = [
      'Akviora Technologies - Custom Scope Estimate:',
      `Selected Services (${estimatorSummary.selectedCount}):`,
      ...estimatorSummary.selectedServices.map(
        (s) => `• ${s.name} (${s.priceFormatted})`
      ),
      '',
      `Estimated One-Time Build: ₹${estimatorSummary.oneTimeTotal.toLocaleString('en-IN')}${
        estimatorSummary.hasPlus ? '+' : ''
      }`,
      estimatorSummary.monthlyTotal > 0
        ? `Estimated Monthly Retainer: ₹${estimatorSummary.monthlyTotal.toLocaleString('en-IN')}/month`
        : 'Monthly Retainer: None',
      'Generated via akvioratechnologies.com/pricing',
    ];
    navigator.clipboard?.writeText(lines.join('\n'));
    setCopiedScope(true);
    setTimeout(() => setCopiedScope(false), 2400);
  };

  const handleInquireWithEstimate = () => {
    if (estimatorSummary.selectedCount === 0) {
      onNavigate('contact');
      return;
    }
    const serviceNames = estimatorSummary.selectedServices
      .map((s) => s.name)
      .join(', ');
    const prompt = `Hello Akviora, I am interested in building a package with: ${serviceNames}. Estimated one-time investment is ₹${estimatorSummary.oneTimeTotal.toLocaleString('en-IN')}${
      estimatorSummary.hasPlus ? '+' : ''
    }${
      estimatorSummary.monthlyTotal > 0
        ? ` and monthly retainer ₹${estimatorSummary.monthlyTotal.toLocaleString('en-IN')}/month`
        : ''
    }. Can you review this scope and advise on architecture and kickoff timeline?`;

    onOpenAssistantWithPrompt(prompt, 'strategy');
  };

  if (showPageSkeleton) {
    return <ServicesPageSkeleton />;
  }

  return (
    <div className="pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto space-y-16 sm:space-y-24">
      {/* 1. Page Hero */}
      <section className="pt-4 sm:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-xs font-mono text-[#5CE1E6] mb-4 uppercase tracking-wider"
        >
          02 · TRANSPARENT INVESTMENT &amp; PACKAGES
        </motion.div>
        <KineticHeadline
          text="Clear, scope-backed pricing for fast-growing businesses."
          className="font-display font-bold text-[clamp(32px,6vw,84px)] max-w-[16ch] leading-[1.04] text-[#EAF4F8] break-words"
        />
        <p className="mt-6 text-base sm:text-lg text-[#8EA6B4] max-w-3xl leading-relaxed">
          No vague ranges or unexpected invoices. Every service is backed by transparent
          milestones, production-grade deliverables, and 100% intellectual property ownership
          from day one.
        </p>

        {/* Guarantees banner */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#EAF4F8]">
            <ShieldCheck className="w-4 h-4 text-[#5CE1E6] shrink-0" />
            <span>Fixed-Scope Guarantee</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#EAF4F8]">
            <CheckCircle2 className="w-4 h-4 text-[#7A86FF] shrink-0" />
            <span>100% Source Code IP</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#EAF4F8]">
            <Clock className="w-4 h-4 text-[#5CE1E6] shrink-0" />
            <span>Milestone-Based Delivery</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#EAF4F8]">
            <Zap className="w-4 h-4 text-[#7A86FF] shrink-0" />
            <span>Dedicated Tech Stack</span>
          </div>
        </div>
      </section>

      {/* 2. High-ROI Curated Bundles */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-[#5CE1E6] uppercase tracking-wider block">
              Curated Starter Suites
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#EAF4F8] tracking-tight mt-1">
              Popular Solution Bundles
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#8EA6B4] max-w-md">
            Packaged scopes designed to solve end-to-end commercial goals with preferential
            multi-service pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {PRICING_BUNDLES.map((bundle, idx) => {
            const isCurrentlySelected =
              bundle.serviceIds.every((id) => selectedServiceIds.includes(id)) &&
              bundle.serviceIds.length === selectedServiceIds.length;

            return (
              <motion.div
                key={bundle.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 border backdrop-blur-md transition-all ${
                  idx === 2 ? 'md:col-span-2 lg:col-span-1' : ''
                } ${
                  isCurrentlySelected
                    ? 'bg-gradient-to-b from-[#5CE1E6]/10 via-[#0B1424] to-[#060B14] border-[#5CE1E6] shadow-[0_0_30px_rgba(92,225,230,0.18)]'
                    : 'bg-gradient-to-b from-[#0B1424]/90 to-[#060B14]/95 border-white/[0.12] hover:border-white/[0.24]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#5CE1E6]/10 text-[#5CE1E6] border border-[#5CE1E6]/25">
                      {bundle.badge}
                    </span>
                    <span className="text-[11px] font-mono text-[#7A86FF]">
                      {bundle.timeline}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#EAF4F8]">
                    {bundle.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8EA6B4] mt-1 line-clamp-2">
                    {bundle.subtitle}
                  </p>

                  <div className="mt-5 pb-5 border-b border-white/[0.08]">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-3xl sm:text-4xl font-bold text-[#5CE1E6]">
                        {bundle.startingPrice}
                      </span>
                    </div>
                    <span className="text-xs text-[#7A86FF] font-medium block mt-1">
                      {bundle.savings}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#8EA6B4] mt-4 leading-relaxed">
                    {bundle.description}
                  </p>

                  {/* Included Services Checklist */}
                  <div className="mt-5 space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#8EA6B4]/80 block">
                      Included In This Scope:
                    </span>
                    {bundle.serviceIds.map((sid) => {
                      const service = PRICING_SERVICES.find((s) => s.id === sid);
                      if (!service) return null;
                      return (
                        <div
                          key={sid}
                          className="flex items-center gap-2 text-xs sm:text-sm text-[#EAF4F8]"
                        >
                          <Check className="w-3.5 h-3.5 text-[#5CE1E6] shrink-0" />
                          <span className="font-medium">{service.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-7 pt-4 border-t border-white/[0.08]">
                  <MagneticButton
                    variant="gradient"
                    onClick={() => selectBundle(bundle)}
                    className="w-full py-2.5 px-5 text-sm font-medium rounded-full"
                  >
                    <span>Configure In Scope Builder</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </MagneticButton>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Interactive Custom Package Estimator */}
      <section
        id="package-estimator"
        className="rounded-3xl p-6 sm:p-10 border border-[#5CE1E6]/30 bg-gradient-to-b from-[#0B172D]/90 via-[#0B1424]/95 to-[#060B14] shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5CE1E6]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.12]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5CE1E6]/10 border border-[#5CE1E6]/25 text-xs font-mono text-[#5CE1E6] mb-3">
                <Calculator className="w-3.5 h-3.5" />
                <span>LIVE SCOPE &amp; COST ESTIMATOR</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#EAF4F8]">
                Custom Package Estimator
              </h2>
              <p className="text-sm text-[#8EA6B4] mt-1 max-w-xl">
                Select the individual capabilities your project requires. Our live calculator
                instantly tallies your one-time build cost and optional monthly retainers.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() =>
                  setSelectedServiceIds(PRICING_SERVICES.map((s) => s.id))
                }
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#8EA6B4] hover:text-[#5CE1E6] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] transition-colors cursor-pointer"
              >
                Select All (10)
              </button>
              <button
                type="button"
                onClick={() => setSelectedServiceIds([])}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#8EA6B4] hover:text-rose-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Service Toggle Pills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRICING_SERVICES.map((svc) => {
              const isChecked = selectedServiceIds.includes(svc.id);
              const IconComp = svc.icon;

              return (
                <div
                  key={svc.id}
                  onClick={() => toggleService(svc.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-[#5CE1E6]/10 border-[#5CE1E6]/60 shadow-[0_0_15px_rgba(92,225,230,0.12)]'
                      : 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.05]'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all ${
                      isChecked
                        ? 'bg-[#5CE1E6] border-[#5CE1E6] text-[#060B14]'
                        : 'border-white/[0.3] bg-transparent text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <span
                        className={`text-xs sm:text-sm font-medium line-clamp-1 ${
                          isChecked ? 'text-[#EAF4F8]' : 'text-[#8EA6B4]'
                        }`}
                      >
                        {svc.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs font-bold text-[#5CE1E6]">
                        {svc.priceFormatted}
                      </span>
                      <span className="text-[10px] font-mono text-[#8EA6B4]/80 uppercase">
                        {svc.billingType === 'monthly' ? 'Monthly' : 'One-time'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calculator Bottom Summary Bar */}
          <div className="pt-6 border-t border-white/[0.12] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Total Readouts */}
            <div className="lg:col-span-7 flex flex-wrap items-center gap-6 sm:gap-10">
              <div>
                <span className="text-xs font-mono text-[#8EA6B4] uppercase tracking-wider block">
                  Estimated One-Time Build
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-3xl sm:text-4xl font-bold text-[#5CE1E6]">
                    ₹{estimatorSummary.oneTimeTotal.toLocaleString('en-IN')}
                  </span>
                  {estimatorSummary.hasPlus && (
                    <span className="text-sm font-mono text-[#5CE1E6]">+</span>
                  )}
                </div>
                <span className="text-[11px] text-[#8EA6B4] block mt-0.5">
                  {estimatorSummary.oneTimeServices.length} one-time deliverable(s)
                </span>
              </div>

              <div className="h-10 w-[1px] bg-white/[0.12] hidden sm:block" />

              <div>
                <span className="text-xs font-mono text-[#8EA6B4] uppercase tracking-wider block">
                  Monthly Retainer
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-3xl sm:text-4xl font-bold text-[#7A86FF]">
                    ₹{estimatorSummary.monthlyTotal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-mono text-[#7A86FF]">/mo</span>
                </div>
                <span className="text-[11px] text-[#8EA6B4] block mt-0.5">
                  {estimatorSummary.monthlyServices.length} ongoing care service(s)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleCopyScopeSummary}
                disabled={estimatorSummary.selectedCount === 0}
                className="w-full sm:w-auto px-5 py-3 rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.03)] hover:border-[#5CE1E6] hover:text-[#5CE1E6] text-sm font-medium text-[#EAF4F8] flex items-center justify-center gap-2 transition-colors disabled:opacity-40 cursor-pointer"
                title="Copy scope summary to clipboard"
              >
                {copiedScope ? (
                  <>
                    <Check className="w-4 h-4 text-[#5CE1E6]" />
                    <span>Copied Scope!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Summary</span>
                  </>
                )}
              </button>

              <MagneticButton
                variant="gradient"
                onClick={handleInquireWithEstimate}
                disabled={estimatorSummary.selectedCount === 0}
                className="w-full flex-1 py-3 px-6 text-sm font-medium rounded-full"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Talk to Akviora AI</span>
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Complete Services Directory & Deliverable Deep-Dive */}
      <section className="space-y-8">
        <div className="lg:flex lg:flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="mb-6 md:mb-8 lg:mb-0 ">
            <span className="text-xs font-mono text-[#5CE1E6] uppercase tracking-wider block">
              Itemized Catalog
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#EAF4F8] tracking-tight mt-1">
              All 10 Services &amp; Starting Scopes
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-col md:flex-row gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-[rgba(255,255,255,0.1)] w-full lg:w-fit">
            {[
              { id: 'all', label: 'All Services (10)' },
              { id: 'web-design', label: 'Design & Web (3)' },
              { id: 'ai-automation', label: 'AI & Automation (3)' },
              { id: 'growth-seo', label: 'Local Growth (4)' },
              { id: 'monthly', label: 'Retainers Only (3)' },
            ].map((tab) => {
              const active = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`relative w-full lg:w-auto px-4 py-2.5 sm:py-3 lg:py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer text-center flex items-center justify-center ${
                    active
                      ? 'text-[#060B14]'
                      : 'text-[#8EA6B4] hover:text-[#EAF4F8]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="pricingCategoryActiveTab"
                      transition={{
                        type: 'spring',
                        stiffness: 340,
                        damping: 28,
                      }}
                      className="absolute inset-0 rounded-xl bg-[#EAF4F8] shadow-sm"
                    />
                  )}
                  <span className="relative z-10 font-semibold">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((svc) => {
              const IconComp = svc.icon;
              const isSelectedInEstimator = selectedServiceIds.includes(svc.id);

              return (
                <motion.div
                  layout
                  key={svc.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className={`flex flex-col justify-between rounded-2xl p-6 sm:p-7 border backdrop-blur-md transition-all ${
                    isSelectedInEstimator
                      ? 'bg-gradient-to-b from-[#0B172E]/90 to-[#060B14] border-[#5CE1E6]/40 shadow-[0_0_20px_rgba(92,225,230,0.08)]'
                      : 'bg-gradient-to-b from-[#0B1424]/85 to-[#060B14]/90 border-white/[0.1] hover:border-white/[0.2]'
                  }`}
                >
                  <div>
                    {/* Top Row: Category + Suggested Starting Price */}
                    <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-3 sm:gap-4 mb-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-[#5CE1E6] shrink-0">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-mono text-[#8EA6B4] uppercase tracking-wider block truncate">
                            {svc.categoryLabel}
                          </span>
                          <span className="text-[11px] font-mono text-[#7A86FF] flex items-center gap-1 mt-0.5 whitespace-nowrap">
                            <Clock className="w-3 h-3 shrink-0" />
                            {svc.timeline}
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[10px] sm:text-[11px] font-mono text-[#8EA6B4] uppercase block">
                          Suggested Starting
                        </span>
                        <div className="font-mono text-xl sm:text-2xl font-bold text-[#5CE1E6] leading-tight">
                          {svc.priceFormatted}
                        </div>
                      </div>
                    </div>

                    <h3 className="font-display text-lg sm:text-xl font-bold text-[#EAF4F8]">
                      {svc.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8EA6B4] mt-2 leading-relaxed">
                      {svc.shortDesc}
                    </p>

                    {/* Deliverables Checklist */}
                    <div className="mt-5 space-y-2 pt-4 border-t border-white/[0.08]">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#8EA6B4]/80 block">
                        Core Deliverables Included:
                      </span>
                      {svc.deliverables.map((del, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#EAF4F8]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#5CE1E6] shrink-0 mt-0.5" />
                          <span className="leading-snug">{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Row */}
                  <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => toggleService(svc.id)}
                      className={`px-4 py-2 rounded-full text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                        isSelectedInEstimator
                          ? 'bg-[#5CE1E6]/15 text-[#5CE1E6] border border-[#5CE1E6]/40 font-semibold'
                          : 'bg-white/[0.04] text-[#8EA6B4] hover:text-[#EAF4F8] border border-white/[0.1] hover:border-white/[0.2]'
                      }`}
                    >
                      <Check
                        className={`w-3.5 h-3.5 ${
                          isSelectedInEstimator ? 'opacity-100' : 'opacity-30'
                        }`}
                      />
                      <span>
                        {isSelectedInEstimator
                          ? 'In Package Estimator'
                          : '+ Add to Estimator'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const prompt = `I would like to start a project for: "${svc.name}" (Suggested starting price ${svc.priceFormatted}). Can you outline the deliverables and kickoff requirements?`;
                        onOpenAssistantWithPrompt(prompt, 'sales');
                      }}
                      className="text-xs font-medium text-[#5CE1E6] hover:text-[#7A86FF] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inquire Scope</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* 5. Transparent Pricing FAQ */}
      <section className="rounded-3xl p-6 sm:p-10 border border-white/[0.1] bg-[#0B1424]/70 space-y-8">
        <div>
          <span className="text-xs font-mono text-[#5CE1E6] uppercase tracking-wider block">
            Pricing FAQ &amp; Commercial Terms
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#EAF4F8] mt-1">
            How Akviora Commercial Engagements Work
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h4 className="font-display text-base font-bold text-[#EAF4F8]">
              Are starting prices fixed or subject to change?
            </h4>
            <p className="text-xs sm:text-sm text-[#8EA6B4] leading-relaxed">
              Our starting prices cover standard scope deliverables specified above. For custom
              or complex business logic, you receive a detailed, fixed-price statement of work
              prior to any payment. We never bill surprise overages.
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h4 className="font-display text-base font-bold text-[#EAF4F8]">
              Who owns the source code and design assets?
            </h4>
            <p className="text-xs sm:text-sm text-[#8EA6B4] leading-relaxed">
              You own 100% of all code, Figma files, documentation, workflows, and database
              credentials. We transfer repository admin rights directly to your team upon final
              delivery.
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h4 className="font-display text-base font-bold text-[#EAF4F8]">
              What payment structures do you support?
            </h4>
            <p className="text-xs sm:text-sm text-[#8EA6B4] leading-relaxed">
              For one-time projects, we typically use milestone invoicing: 50% mobilization deposit
              upon kickoff and 50% upon successful QA staging deployment. Monthly retainers are
              billed on a 30-day recurring cycle with no long-term lock-in.
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <h4 className="font-display text-base font-bold text-[#EAF4F8]">
              What if our business needs a tailored enterprise architecture?
            </h4>
            <p className="text-xs sm:text-sm text-[#8EA6B4] leading-relaxed">
              We frequently build custom full-stack SaaS apps, real-time IoT dashboards, and
              multi-agent AI systems. Contact our engineering team for a dedicated discovery call
              and custom architectural quote.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
