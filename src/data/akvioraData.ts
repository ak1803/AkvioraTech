import {
  AssistantPersona,
  CaseStudy,
  FAQItem,
  ProcessStep,
  ServicePillar,
} from '../types/akviora';
import heroStudioImg from '../assets/images/hero_akviora_studio_1791414586807.jpg';
import workKinetixImg from '../assets/images/work_kinetix_spatial_1791414610322.jpg';
import workVeloxImg from '../assets/images/work_velox_automotive_1791414598887.jpg';
import workAetherImg from '../assets/images/work_aether_chronograph_1791414632639.jpg';
import workSolarisImg from '../assets/images/work_solaris_architecture_1791414620871.jpg';

export const PAIN_POINTS: string[] = [
  'Scattered information',
  'Hard-to-track processes',
  'Repetitive manual work',
  'Customers waiting for answers',
  'Little visibility for owners',
];

export const MARQUEE_ITEMS: string[] = [
  'AI Solutions',
  'Web & SaaS',
  'UI/UX Design',
  'Business Automation',
  'SEO & Digital Growth',
];

export const SERVICE_PILLARS: ServicePillar[] = [
  {
    id: 'ai-solutions',
    number: '01',
    title: 'AI Solutions',
    tagline: 'Intelligent digital layers engineered around your real business processes.',
    description:
      'Give your business an intelligent digital layer: AI assistants, document workflows, knowledge assistants, lead qualification and customer-support experiences.',
    accentColor: '#5CE1E6',
    targetPage: 'ai',
    deliverables: [
      'Custom Akviora AI-Powered Knowledge & Support Assistants',
      'Automated Lead Qualification & CRM Routing Agents',
      'Document Extraction, Summarization & Approval Pipelines',
      'Internal Operations & SOP Copilot Systems',
    ],
    outcomes: [
      '-68% average reduction in manual ticket triage time within 60 days',
      '24/7 instant response coverage with verified company knowledge citations',
      '+42% qualified discovery call conversion from inbound web traffic',
    ],
    timeline: '3 – 6 Weeks',
    architectureStack: ['Akviora AI API', 'Node.js', 'Vector Retrieval', 'Webhook Pipelines', 'TypeScript'],
  },
  {
    id: 'web-saas',
    number: '02',
    title: 'Web & SaaS',
    tagline: 'High-performance web applications, portals, and multi-tenant SaaS products.',
    description:
      'From professional business websites to complex web applications and SaaS platforms, built for real users and real workflows.',
    accentColor: '#7A86FF',
    targetPage: 'work',
    deliverables: [
      'Full-Stack Next.js & React Web Applications',
      'Multi-Tenant SaaS Architectures & Subscription Billing',
      'Customer Portals, Admin Dashboards & Role-Based Access',
      'REST / GraphQL APIs & Relational Database Schemas',
    ],
    outcomes: [
      '99.9% production uptime with sub-100ms API response latency',
      'WCAG AA accessible interfaces with 98+ Lighthouse performance scores',
      'Modular database architecture built for 10x user growth',
    ],
    timeline: '4 – 10 Weeks',
    architectureStack: ['React 19', 'Next.js', 'Node.js & Express', 'SQLite / PostgreSQL', 'Tailwind CSS'],
  },
  {
    id: 'ui-ux-design',
    number: '03',
    title: 'UI/UX Design',
    tagline: 'Clarity-driven product interfaces, interactive prototypes, and design systems.',
    description:
      'Interfaces should look good, but they also need to make sense. User journeys, prototypes, dashboards and design systems that reduce friction.',
    accentColor: '#4FB3FF',
    targetPage: 'work',
    deliverables: [
      'User Journey Mapping & Information Architecture',
      'Interactive High-Fidelity Prototypes & Design Systems',
      'Complex Data Dashboard & Workflow Simplification',
      'WCAG 2.1 AA Contrast, Keyboard & Screen-Reader Compliance',
    ],
    outcomes: [
      '-45% task completion time across core operational dashboards',
      '+38% user onboarding completion rate in first 30 days',
      'Unified component library reducing frontend build time by 35%',
    ],
    timeline: '2 – 5 Weeks',
    architectureStack: ['Design Tokens', 'Figma Systems', 'Framer Motion', 'WCAG AA Audits', 'Responsive Grids'],
  },
  {
    id: 'business-automation',
    number: '04',
    title: 'Business Automation',
    tagline: 'Connected operational workflows replacing spreadsheets and manual follow-ups.',
    description:
      'Replace repetitive operational work with connected workflows across forms, email, WhatsApp, CRM, spreadsheets and approvals.',
    accentColor: '#9B7BFF',
    targetPage: 'contact',
    deliverables: [
      'End-to-End Lead Capture to CRM & WhatsApp Notification Flows',
      'Automated Invoice, Renewal & Payment Reminder Engines',
      'Multi-Stage Internal Approval & Vendor Onboarding Systems',
      'Real-Time Executive KPI & Operations Visibility Dashboards',
    ],
    outcomes: [
      '18+ hours saved per team member every week on manual data entry',
      'Zero missed contract renewals or delayed vendor follow-ups',
      'Single source of truth replacing scattered spreadsheets',
    ],
    timeline: '2 – 4 Weeks',
    architectureStack: ['Node.js Workers', 'REST Webhooks', 'WhatsApp & Email APIs', 'CRM Sync', 'Event Queues'],
  },
  {
    id: 'seo-digital-growth',
    number: '05',
    title: 'SEO & Digital Growth',
    tagline: 'Technical SEO, Schema.org structured data, and conversion-focused architecture.',
    description:
      'A website is only useful when the right people can find it. Technical foundations, local presence and useful content.',
    accentColor: '#38D6B0',
    targetPage: 'contact',
    deliverables: [
      'Technical SEO Audits, Core Web Vitals & Crawl Optimization',
      'Schema.org JSON-LD Structured Data (Organization, FAQ, Product)',
      'Search-Intent Landing Pages & Conversion Rate Optimization',
      'Local Search Presence & Analytics Attribution Tracking',
    ],
    outcomes: [
      '+140% organic search impressions within 4 months of launch',
      'Sub-1.2s Largest Contentful Paint (LCP) across mobile devices',
      'Rich snippet eligibility via validated JSON-LD structured metadata',
    ],
    timeline: 'Ongoing / 3 Weeks Setup',
    architectureStack: ['Schema.org JSON-LD', 'OpenGraph Protocol', 'Core Web Vitals', 'Semantic HTML5', 'Search Console'],
  },
];

export const AI_ASSISTANTS: AssistantPersona[] = [
  {
    id: 'customer',
    title: 'Customer Assistant',
    shortDesc: 'Answers product, service and support questions.',
    fullDesc:
      'Resolves customer inquiries 24/7 using your verified service catalog, pricing policies, and troubleshooting guides while escalating complex edge cases to human teams with full context.',
    accentColor: '#5CE1E6',
    gridSpan: 'sm:col-span-2 lg:col-span-2 lg:row-span-2',
    capabilities: [
      'Instant answers grounded in your approved documentation',
      'Order status, renewal lookup, and policy clarification',
      'Seamless handoff to human support with conversation summary',
    ],
    samplePrompts: [
      'How can a Customer Assistant reduce our support response time?',
      'What happens when a customer asks a complex billing question?',
      'Design a 24/7 support flow for a B2B SaaS platform.',
    ],
    metrics: '82% First-Contact Resolution · < 1.8s Response Latency',
  },
  {
    id: 'sales',
    title: 'Sales Assistant',
    shortDesc: 'Captures enquiries, qualifies prospects, routes leads.',
    fullDesc:
      'Engages visitors in natural conversation, identifies budget, timeline, and technical scope, recommends the right service tier, and routes qualified leads directly to your sales pipeline.',
    accentColor: '#7A86FF',
    capabilities: [
      'Conversational lead qualification without rigid 20-field forms',
      'Automatic scope estimation and service recommendation',
      'Instant CRM logging and discovery call scheduling',
    ],
    samplePrompts: [
      'Qualify my startup for a custom SaaS MVP build.',
      'We need an automated B2B lead qualification workflow.',
      'Estimate scope for a web portal + CRM automation project.',
    ],
    metrics: '+46% Lead-to-Call Conversion · 100% Automated CRM Sync',
  },
  {
    id: 'knowledge',
    title: 'Knowledge Assistant',
    shortDesc: 'Searches approved company information.',
    fullDesc:
      'Gives your internal team instant, accurate answers across SOPs, engineering wikis, HR policies, and past project archives without digging through folders.',
    accentColor: '#4FB3FF',
    capabilities: [
      'Instant semantic search across internal SOPs and playbooks',
      'Role-aware access controls and source document citations',
      'Onboarding acceleration for new hires and operations staff',
    ],
    samplePrompts: [
      'How do we connect our internal SOPs to a Knowledge Assistant?',
      'Prevent AI hallucinations when querying company policies.',
      'Build an internal onboarding assistant for a 50-person team.',
    ],
    metrics: '3.4x Faster Internal Lookups · Zero Unverified Answers',
  },
  {
    id: 'document',
    title: 'Document Assistant',
    shortDesc: 'Extracts and summarizes information from business documents.',
    fullDesc:
      'Reads tenders, invoices, contracts, and construction BOQs, extracting structured fields, flagging risks, and pushing clean data directly into your database.',
    accentColor: '#9B7BFF',
    gridSpan: 'sm:col-span-2 lg:col-span-2',
    capabilities: [
      'Automated PDF/DOCX extraction for tenders, invoices, and contracts',
      'Structured JSON output validated against your database schema',
      'Executive summary generation and compliance clause checks',
    ],
    samplePrompts: [
      'How can AI extract key dates and line items from RFP tenders?',
      'Automate invoice and purchase order matching for finance teams.',
      'Summarize 80-page real estate construction contracts automatically.',
    ],
    metrics: '91% Faster Document Processing · 99.2% Field Accuracy',
  },
  {
    id: 'operations',
    title: 'Operations Assistant',
    shortDesc: 'Helps teams finish repetitive tasks.',
    fullDesc:
      'Monitors daily operational queues, drafts status updates, triggers approval requests across WhatsApp and email, and alerts owners before bottlenecks occur.',
    accentColor: '#38D6B0',
    capabilities: [
      'Automated daily standup & project bottleneck digests',
      'Cross-tool task triggering (Forms → Database → Notifications)',
      'Exception detection for delayed deliveries or approvals',
    ],
    samplePrompts: [
      'Replace our manual daily Excel reporting with an Operations Assistant.',
      'Automate vendor follow-ups and approval reminders.',
      'How do we get real-time visibility into team bottlenecks?',
    ],
    metrics: '18+ Hours Saved Weekly · Real-Time Owner Visibility',
  },
  {
    id: 'appointment',
    title: 'Appointment Assistant',
    shortDesc: 'Enquiries, availability and booking journeys.',
    fullDesc:
      'Handles availability checks, timezone conversion, pre-call intake questionnaires, rescheduling, and automated reminders to eliminate no-shows.',
    accentColor: '#5CE1E6',
    capabilities: [
      'Conversational slot matching and timezone-intelligent booking',
      'Automated pre-call discovery brief collection',
      'SMS/WhatsApp/Email reminders reducing no-shows',
    ],
    samplePrompts: [
      'Design an automated consultation booking flow for our clinic/agency.',
      'How can an Appointment Assistant collect pre-meeting requirements?',
      'Reduce discovery call no-shows with automated follow-ups.',
    ],
    metrics: '-54% Meeting No-Shows · 2-Minute Booking Journey',
  },
];

export const WHY_AKVIORA_ITEMS = [
  {
    title: 'Business first',
    description: 'We start with the problem, workflow and desired outcome before choosing technology.',
  },
  {
    title: 'Design + development',
    description: 'They work together from day one, so what is designed is what gets built.',
  },
  {
    title: 'AI where it makes sense',
    description: 'For productivity, decisions, customer experience or automation, not decoration.',
  },
  {
    title: 'Built for growth',
    description: 'Scalability, security, maintainability and future integrations are considered early.',
  },
  {
    title: 'One connected process',
    description: 'Discovery, UX, development, automation and improvement in one workflow.',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'trackpayout',
    title: 'TrackPayout',
    category: 'Finance & Business Management Platform',
    sector: 'FinTech & B2B SaaS',
    year: '2026',
    duration: '8 Weeks',
    image: heroStudioImg,
    summary:
      'End-to-end accounts receivable, invoice tracking, and automated payment follow-up platform built for growing SMEs and finance teams.',
    challenge:
      'Finance teams were losing track of overdue invoices across disconnected spreadsheets and manual email follow-ups, delaying cash flow visibility for company owners.',
    solution:
      'We engineered a unified financial command center with automated multi-stage payment reminders, aging ledger analytics, and real-time cash flow forecasting.',
    impactMetrics: [
      { label: 'Faster Collections', value: '+44%', context: 'Average reduction in Days Sales Outstanding (DSO) within 90 days' },
      { label: 'Manual Follow-Ups', value: '-75%', context: 'Automated via scheduled email & WhatsApp reminder workflows' },
      { label: 'Owner Visibility', value: '100%', context: 'Real-time receivable aging & settlement dashboard' },
    ],
    stack: ['React', 'Node.js', 'Relational DB', 'Automated Reminders', 'Analytics Engine'],
    featured: true,
  },
  {
    id: 'stockcard',
    title: 'Stockcard',
    category: 'Inventory Management Experience',
    sector: 'Supply Chain & Retail Operations',
    year: '2026',
    duration: '6 Weeks',
    image: workKinetixImg,
    summary:
      'High-speed multi-warehouse stock tracking, low-inventory alert automation, and supplier reorder workflow system.',
    challenge:
      'Warehouse managers relied on delayed end-of-day stock sheets, causing frequent stockouts on high-velocity SKUs and over-ordering on slow-moving inventory.',
    solution:
      'Designed an intuitive, mobile-ready inventory UI with instant barcode/SKU lookup, automated reorder threshold triggers, and movement audit logs.',
    impactMetrics: [
      { label: 'Stockout Incidents', value: '-62%', context: 'Prevented via predictive reorder threshold alerts' },
      { label: 'Audit Reconciliation', value: '3.8x', context: 'Faster monthly physical-to-digital stock reconciliation' },
      { label: 'Task Latency', value: '<120ms', context: 'Instant SKU search across 50,000+ inventory records' },
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Real-Time Sync', 'UI/UX System'],
    featured: true,
  },
  {
    id: 'tenderitnow',
    title: 'TenderItNow',
    category: 'Tender & Business Opportunity Platform',
    sector: 'B2B Procurement & AI Document Intelligence',
    year: '2026',
    duration: '9 Weeks',
    image: workVeloxImg,
    summary:
      'AI-assisted tender discovery, eligibility matching, and bid compliance workflow platform for enterprise contractors.',
    challenge:
      'Bidding teams spent dozens of hours manually reading 100-page tender PDFs just to determine eligibility criteria, deadlines, and required compliance documents.',
    solution:
      'Built an intelligent tender portal with Document Assistant extraction that summarizes key eligibility clauses, deadlines, and BOQ items automatically.',
    impactMetrics: [
      { label: 'Bid Screening Speed', value: '6.5x', context: 'Automated extraction of tender deadlines and eligibility criteria' },
      { label: 'Qualified Submissions', value: '+58%', context: 'Increase in on-time, fully compliant bid submissions' },
      { label: 'Document Accuracy', value: '99.1%', context: 'Structured checklist generation from raw tender PDFs' },
    ],
    stack: ['Akviora Document AI', 'React', 'Node.js', 'Search Indexing', 'Workflow Automation'],
    featured: true,
  },
  {
    id: 'renewalhelp',
    title: 'RenewalHelp',
    category: 'Renewal Management Workflow',
    sector: 'SaaS Operations & Subscription Lifecycle',
    year: '2025',
    duration: '5 Weeks',
    image: workAetherImg,
    summary:
      'Automated contract, license, AMC, and policy renewal lifecycle engine that eliminates missed expirations.',
    challenge:
      'Growing businesses managed vendor contracts, software licenses, and client AMCs in static sheets, resulting in surprise auto-renewals or lapsed client contracts.',
    solution:
      'Created a centralized renewal timeline with 90/60/30-day automated escalation workflows, approval routing, and customer self-service renewal links.',
    impactMetrics: [
      { label: 'Retention Rate', value: '+29%', context: 'Higher on-time client AMC and subscription renewals' },
      { label: 'Missed Expirations', value: '0', context: 'Across 4,200+ tracked contracts and compliance certificates' },
      { label: 'Admin Hours Saved', value: '14 hrs/wk', context: 'Eliminated manual calendar checking and status chasing' },
    ],
    stack: ['React', 'Node.js Cron Engine', 'Multi-Channel Alerts', 'Role-Based Dashboard'],
  },
  {
    id: 'cost-management',
    title: 'Cost Management',
    category: 'Real Estate & Construction Cost Platform',
    sector: 'Real Estate & Infrastructure Engineering',
    year: '2025',
    duration: '10 Weeks',
    image: workSolarisImg,
    summary:
      'Budget-vs-actual cost tracking, BOQ milestone verification, and vendor payout approval system for real estate developers.',
    challenge:
      'Project directors lacked real-time visibility into site-level material cost overruns and contractor billing variations until weeks after expenses occurred.',
    solution:
      'Engineered a multi-project cost control system linking BOQ estimates, purchase orders, site goods receipts, and multi-tier management approvals.',
    impactMetrics: [
      { label: 'Cost Overrun Reduction', value: '-31%', context: 'Early variance alerts before purchase orders exceed BOQ limits' },
      { label: 'Approval Turnaround', value: '24 hrs', context: 'Down from 6 days using mobile-friendly approval workflows' },
      { label: 'Project Visibility', value: '$42M+', context: 'Active construction budget tracked with live variance reports' },
    ],
    stack: ['Full-Stack Web App', 'Relational Database', 'Approval Workflows', 'Executive BI'],
  },
  {
    id: 'ai-astrology-guide',
    title: 'AI Astrology Guide',
    category: 'Conversational AI Product Experience',
    sector: 'Consumer AI & Interactive Digital Product',
    year: '2026',
    duration: '6 Weeks',
    image: heroStudioImg,
    summary:
      'Personalized conversational AI experience combining deterministic ephemeris calculations with natural-language guidance.',
    challenge:
      'Users wanted deeply personalized, context-aware consultations in natural language without generic static templates or slow human wait times.',
    solution:
      'Combined a precision calculation backend with a custom-tuned Akviora AI conversational layer, interactive chart visualizations, and session memory.',
    impactMetrics: [
      { label: 'Session Engagement', value: '11.4 min', context: 'Average interactive consultation duration per user visit' },
      { label: 'User Return Rate', value: '64%', context: '30-day repeat engagement driven by personalized memory' },
      { label: 'Response Speed', value: '1.4s', context: 'Streaming conversational insights across mobile and web' },
    ],
    stack: ['Akviora AI Engine', 'React', 'Streaming UI', 'Custom Calculation Engine'],
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: 'Discover',
    description: 'We understand your business, users, workflow, problems and goals.',
    deliverable: 'Workflow Audit & Problem Definition Brief',
    duration: 'Days 1 – 4',
  },
  {
    step: 2,
    title: 'Define',
    description: 'Requirements become features, priorities, user journeys and a roadmap.',
    deliverable: 'Prioritized Feature Spec & System Architecture',
    duration: 'Days 5 – 8',
  },
  {
    step: 3,
    title: 'Design',
    description: 'Interface and information architecture come before development.',
    deliverable: 'Interactive UI/UX Prototypes & Design System',
    duration: 'Weeks 2 – 3',
  },
  {
    step: 4,
    title: 'Build',
    description: 'Frontend, backend, database, APIs and integrations.',
    deliverable: 'Production-Grade Full-Stack Codebase',
    duration: 'Weeks 3 – 6',
  },
  {
    step: 5,
    title: 'Connect',
    description: 'AI, automation, communication and payments where required.',
    deliverable: 'Akviora AI Agents, Webhooks & CRM Pipelines',
    duration: 'Week 6',
  },
  {
    step: 6,
    title: 'Test',
    description: 'Functionality, usability, responsiveness and key user flows.',
    deliverable: 'WCAG AA Accessibility, Cross-Device & QA Report',
    duration: 'Week 7',
  },
  {
    step: 7,
    title: 'Launch',
    description: 'Production release with documentation and access handover.',
    deliverable: 'Zero-Downtime Deployment, SEO & Team Training',
    duration: 'Week 8',
  },
  {
    step: 8,
    title: 'Improve',
    description: 'Monitoring, maintenance, optimization and new features.',
    deliverable: 'Continuous Performance Telemetry & Iterative Growth',
    duration: 'Ongoing Partnership',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'AI & Automation',
    question: 'How do you ensure an AI assistant gives accurate answers about our business without hallucinating?',
    answer:
      'We ground every Akviora AI assistant in your approved company knowledge base (SOPs, pricing tables, product catalogs, and policies) using structured retrieval and strict system guardrails. When a question falls outside approved rules, the assistant politely captures the lead details and escalates to your team.',
  },
  {
    id: 'faq-2',
    category: 'AI & Automation',
    question: 'Can your AI and automation systems connect with our existing spreadsheets, CRM, or WhatsApp workflows?',
    answer:
      'Yes. We design around your current operational reality. Whether your team uses Google Sheets, HubSpot, Zoho, custom SQL databases, email, or WhatsApp Business APIs, we build clean webhook and API bridges so information flows automatically without double data entry.',
  },
  {
    id: 'faq-3',
    category: 'Web & SaaS',
    question: 'Do you build custom web applications from scratch or use rigid templates?',
    answer:
      'Every product is custom-engineered around your workflow using modern, scalable stacks (React, Next.js, TypeScript, Node.js, and relational databases). We never force your business logic into bloated off-the-shelf templates.',
  },
  {
    id: 'faq-4',
    category: 'Web & SaaS',
    question: 'How do you handle mobile responsiveness, page speed, and WCAG accessibility?',
    answer:
      'Every interface is tested across mobile, tablet, laptop, and ultrawide viewports. We enforce WCAG 2.1 AA contrast ratios, full keyboard focus navigation, reduced-motion support, and semantic HTML with JSON-LD structured data for search engine visibility.',
  },
  {
    id: 'faq-5',
    category: 'Process & Pricing',
    question: 'Do we need a complete technical specification document before starting a project with Akviora?',
    answer:
      'No. You only need to share the business problem, bottleneck, or product idea you want to solve. In Step 1 (Discover) and Step 2 (Define), our team translates your goals into a clear technical roadmap, user journey, and milestone plan.',
  },
  {
    id: 'faq-6',
    category: 'Process & Pricing',
    question: 'How long does a typical AI assistant, website, or SaaS MVP take to launch?',
    answer:
      'Focused AI assistants and workflow automations typically launch in 2 to 4 weeks. High-conversion marketing websites take 3 to 5 weeks, and full-stack SaaS platforms or custom operational portals take 6 to 10 weeks with weekly interactive milestones.',
  },
  {
    id: 'faq-7',
    category: 'Security & SEO',
    question: 'Who owns the source code, database, and intellectual property after launch?',
    answer:
      'You retain 100% ownership of your custom source code, database schemas, design assets, and domain configurations upon project completion, complete with full documentation and access handover in Step 7 (Launch).',
  },
  {
    id: 'faq-8',
    category: 'Security & SEO',
    question: 'Is our company data used to train public AI models?',
    answer:
      'No. We architect server-side AI integrations with strict data privacy boundaries so your proprietary documents, customer inquiries, and internal workflows remain private and isolated to your organization.',
  },
];

export const CLIENT_TESTIMONIALS = [
  {
    id: 'test-1',
    quote:
      'Before Akviora, our finance team spent every Friday chasing overdue invoices across three spreadsheets. TrackPayout automated our entire reminder workflow and cut overdue receivables by 44% in three months.',
    author: 'Rajesh Sharma',
    role: 'Director of Finance',
    organization: 'Apex Industrial Supply',
    metric: '+44% Faster Collections in 90 Days',
  },
  {
    id: 'test-2',
    quote:
      'Akviora built our AI Document Assistant to screen 120-page procurement tenders. What used to take our engineers two full days of reading now takes 15 minutes with a verified compliance checklist.',
    author: 'Meera Nair',
    role: 'Head of Bid Operations',
    organization: 'Vanguard Infrastructure Group',
    metric: '6.5x Faster Tender Screening',
  },
  {
    id: 'test-3',
    quote:
      'They did not just hand us a pretty UI—they mapped our entire warehouse stock movement process first. Stockcard reduced our SKU stockouts by 62% during our busiest quarter.',
    author: 'Vikram Desai',
    role: 'VP of Operations',
    organization: 'Meridian Logistics & Retail',
    metric: '-62% Warehouse Stockout Incidents',
  },
];
