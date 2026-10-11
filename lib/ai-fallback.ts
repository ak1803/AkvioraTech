import { AI_ASSISTANTS } from './data';

export function buildSmartContextualReply(params: {
  message: string;
  personaId?: string;
  history?: { role: string; content: string }[];
}): {
  reply: string;
  suggestedFollowUps: string[];
  recommendedService: string;
} {
  const { message, personaId } = params;
  const q = message.toLowerCase();
  const persona = AI_ASSISTANTS.find((p) => p.id === personaId);
  const activeTitle = persona
    ? persona.title
    : 'Akviora AI Solutions Architect';

  // 1. Pricing / Cost / Budget inquiries
  if (
    q.includes('price') ||
    q.includes('pricing') ||
    q.includes('cost') ||
    q.includes('budget') ||
    q.includes('quote') ||
    q.includes('how much')
  ) {
    return {
      reply: `As your **${activeTitle}**, we scope every system around measurable business ROI rather than bloated retainers:\n\n• **AI Assistant & Workflow Automation MVP ($3k – $8k)**: Targeted assistant (Customer, Sales, or Document OCR) connected to WhatsApp, CRM, or Google Sheets in **2–4 weeks**.\n• **Custom SaaS / Web Platform ($8k – $25k)**: Full-stack Next.js + Node.js application with role-based dashboards, database architecture, and embedded AI workflows in **4–8 weeks**.\n• **Enterprise Ecosystem ($25k+)**: Multi-tenant architecture, ERP/webhook integrations, and dedicated SLA support.\n\nShare your core bottleneck and target timeline, and I can outline a phased scope for your team.`,
      suggestedFollowUps: [
        'Estimate timeline for a custom SaaS web app',
        'What can we launch in a 3-week AI MVP sprint?',
        'Open Contact Page to request a fixed-scope proposal',
      ],
      recommendedService: persona
        ? `${persona.title} & Custom Scoping`
        : 'AI Solutions & Web Platform Scoping',
    };
  }

  // 2. Timeline / Delivery / Process inquiries
  if (
    q.includes('timeline') ||
    q.includes('how long') ||
    q.includes('time') ||
    q.includes('weeks') ||
    q.includes('process') ||
    q.includes('launch') ||
    q.includes('fast')
  ) {
    return {
      reply: `We follow Akviora's **8-Step Delivery Architecture** (*Discover → Define → Design → Build → Connect → Test → Launch → Improve*) for rapid, predictable launches:\n\n• **Week 1 (Discover & Define)**: Audit manual bottlenecks, map data schemas, and lock interactive Figma wireframes.\n• **Weeks 2–4 (Build & Connect)**: Engineer the Next.js + Node.js stack, integrate your **${
        persona ? persona.title : 'Akviora AI Assistant'
      }**, and wire up WhatsApp/CRM/database webhooks.\n• **Weeks 5–6 (Test & Launch)**: Security rules audit, load testing, team onboarding, and production deployment.\n\nFocused AI workflow automations typically go live in **2–4 weeks**, while full SaaS platforms ship in **4–8 weeks**.`,
      suggestedFollowUps: [
        'What are the pricing tiers for a 4-week build?',
        'How does Akviora automate spreadsheets & WhatsApp?',
        'Show me case studies like TrackPayout or TenderItNow',
      ],
      recommendedService: 'Web & SaaS Product Engineering',
    };
  }

  // 3. WhatsApp / Spreadsheets / Excel / CRM / Manual Automation
  if (
    q.includes('whatsapp') ||
    q.includes('spreadsheet') ||
    q.includes('excel') ||
    q.includes('sheet') ||
    q.includes('crm') ||
    q.includes('manual') ||
    q.includes('automate') ||
    q.includes('automation')
  ) {
    return {
      reply: `Eliminating fragmented **WhatsApp + Spreadsheet** handoffs is one of Akviora's highest-ROI specialties:\n\n• **Automated Intake & Triage**: Incoming WhatsApp messages, web forms, and emails are parsed automatically—no more manual copy-pasting into Excel.\n• **One-Click Approvals & Alerts**: When a quote, dispatch, or invoice needs sign-off, managers receive an instant interactive alert that updates the central database in real time.\n• **Live Owner Dashboard**: Replace fragile sheets with a secure Next.js + Cloud Firestore portal tracking every lead, payment, and SLA.\n\nTeams typically save **15–22 hours per week** and cut response times from hours to under 30 seconds.`,
      suggestedFollowUps: [
        'Generate a 4-step automation blueprint for my business',
        'How does RenewalHelp prevent missed contract expirations?',
        'Which AI Assistant fits my business workflow?',
      ],
      recommendedService: 'Business Automation & Operations Assistant',
    };
  }

  // 4. Case Studies / Portfolio (TrackPayout, Stockcard, TenderItNow, RenewalHelp, Cost Management)
  if (
    q.includes('case stud') ||
    q.includes('trackpayout') ||
    q.includes('tenderitnow') ||
    q.includes('stockcard') ||
    q.includes('renewalhelp') ||
    q.includes('portfolio') ||
    q.includes('example') ||
    q.includes('work')
  ) {
    return {
      reply: `Here are flagship production systems engineered by **Akviora Technologies**:\n\n• **TrackPayout (FinTech SaaS)**: Automated invoice follow-ups and aging analytics—delivering **+44% faster collections**.\n• **TenderItNow (AI Document Engine)**: Automated PDF tender ingestion, eligibility extraction, and BOQ table parsing—**6.5× faster bid screening**.\n• **Stockcard (Inventory Platform)**: Real-time multi-warehouse reorder intelligence that reduced stockouts by **62%**.\n• **RenewalHelp (Lifecycle Automation)**: Automated 60/30/7-day AMC & contract renewal workflows with **0 missed expirations**.\n\nWhich of these architectures is closest to what you want to build?`,
      suggestedFollowUps: [
        'How can we build a document parser like TenderItNow?',
        'How much does a SaaS platform like TrackPayout cost?',
        'Estimate timeline for a custom SaaS web app',
      ],
      recommendedService: 'Custom SaaS & AI Product Development',
    };
  }

  // 5. Document / PDF / OCR / Tender / Invoice / Contract parsing
  if (
    q.includes('pdf') ||
    q.includes('document') ||
    q.includes('invoice') ||
    q.includes('tender') ||
    q.includes('ocr') ||
    q.includes('contract') ||
    q.includes('extract') ||
    personaId === 'document'
  ) {
    return {
      reply: `With Akviora's **AI Document Assistant**, we turn unstructured PDFs, invoices, RFPs, and contracts into structured database records automatically:\n\n• **Structured Field Extraction**: Automatically pull line items, BOQ tables, dates, clauses, and compliance risks with schema-validated accuracy.\n• **Exception Flagging**: Highlight missing signatures, price variances, or risky terms for human review.\n• **Direct ERP/Database Sync**: Push verified JSON data straight into your portal, CRM, or accounting ledger—cutting manual review time by **70%+**.`,
      suggestedFollowUps: [
        'How did TenderItNow achieve 6.5x faster PDF screening?',
        'Can it extract data from scanned invoices and WhatsApp PDFs?',
        'Estimate timeline and budget for a Document Assistant',
      ],
      recommendedService: 'AI Document Assistant & Workflow Portal',
    };
  }

  // 6. Which AI Assistant fits my business / Overview of 6 Assistants
  if (
    q.includes('which ai') ||
    q.includes('assistants') ||
    q.includes('fit') ||
    q.includes('services') ||
    q.includes('what do you') ||
    q.includes('hello') ||
    q.includes('hi ') ||
    q === 'hi'
  ) {
    return {
      reply: `Welcome to **Akviora Technologies**! We design and engineer 6 specialized **AI Assistants** alongside custom Web & SaaS platforms:\n\n• **Customer & Sales Assistants**: 24/7 grounded support, instant lead qualification, and automated CRM/quote handoffs.\n• **Document & Knowledge Assistants**: Instant PDF/RFP extraction and verified answers from your internal SOPs & docs.\n• **Operations & Appointment Assistants**: Automated task routing, SLA reminders, and conflict-free calendar booking.\n\nTell me a bit about your industry and what manual task takes up the most time—I'll recommend the exact architecture for you.`,
      suggestedFollowUps: [
        'How does Akviora automate spreadsheets & WhatsApp?',
        'Estimate timeline for a custom SaaS web app',
        'What are your typical project pricing ranges?',
      ],
      recommendedService: persona
        ? persona.title
        : 'AI Solutions & Business Automation',
    };
  }

  // 7. Persona-specific tailored response for any custom domain query
  if (persona) {
    return {
      reply: `As your **${persona.title}** (${persona.shortDesc}), here is how we would architect a solution for *"${message.slice(0, 70)}"*:\n\n• **Core Capability**: ${persona.capabilities[0]} and ${persona.capabilities[1].toLowerCase()}.\n• **Workflow Integration**: We connect this assistant directly into your web portal, WhatsApp/email channels, and backend database so every action is logged and auditable.\n• **Proven Outcome**: Similar deployments achieve **${persona.metrics}** within 3–6 weeks of launch.\n\nWould you like to test a live **4-Step Workflow Blueprint** for your industry or scope this on a discovery call?`,
      suggestedFollowUps: [
        ...persona.samplePrompts.slice(0, 2),
        'Estimate timeline and cost to deploy this assistant',
      ],
      recommendedService: persona.title,
    };
  }

  // 8. General Strategy Architect response
  return {
    reply: `As your **${activeTitle}**, here is how we recommend approaching *"${message.slice(0, 70)}"*:\n\n• **1. Centralize Intake**: Replace scattered messages, forms, and manual spreadsheets with a unified Next.js + Node.js workflow portal.\n• **2. Grounded AI Triage**: Deploy a tailored Akviora AI Assistant to classify incoming requests, extract structured data, and draft instant responses.\n• **3. Automated Execution**: Trigger real-time WhatsApp/email notifications, approval routing, and live owner KPI tracking.\n\nShare your industry or current team bottleneck, and I will tailor a specific implementation roadmap and timeline.`,
    suggestedFollowUps: [
      'What are your typical project pricing ranges?',
      'Estimate timeline for a custom SaaS web app',
      'Show me similar case studies like TrackPayout or TenderItNow',
    ],
    recommendedService: 'AI Solutions & Business Automation',
  };
}

export function buildSmartBlueprint(params: {
  businessType: string;
  bottleneck: string;
}) {
  const { businessType, bottleneck } = params;
  const b = `${businessType} ${bottleneck}`.toLowerCase();

  let recommendedAssistant = 'Operations Assistant + Custom Next.js Portal';
  if (b.includes('pdf') || b.includes('document') || b.includes('tender') || b.includes('invoice') || b.includes('contract')) {
    recommendedAssistant = 'AI Document Assistant + Automated Verification Portal';
  } else if (b.includes('lead') || b.includes('sales') || b.includes('quote') || b.includes('pricing') || b.includes('whatsapp')) {
    recommendedAssistant = 'AI Sales Assistant + WhatsApp & CRM Automation Bridge';
  } else if (b.includes('support') || b.includes('customer') || b.includes('ticket') || b.includes('faq')) {
    recommendedAssistant = 'AI Customer Assistant + Grounded Knowledge Base';
  } else if (b.includes('book') || b.includes('schedule') || b.includes('appointment') || b.includes('clinic') || b.includes('calendar')) {
    recommendedAssistant = 'AI Appointment Assistant + Automated Reminder Engine';
  }

  return {
    diagnosis: `Manual handoffs and unstructured steps around "${bottleneck.slice(0, 90)}" in your ${businessType} workflow are causing response delays and limiting real-time visibility.`,
    recommendedAssistant,
    workflowSteps: [
      {
        stepNumber: 1,
        title: 'Unified Multi-Channel Intake',
        detail: `Capture incoming ${businessType} requests from web forms, WhatsApp, email, and uploaded files into a single structured pipeline.`,
      },
      {
        stepNumber: 2,
        title: 'Grounded Akviora AI Processing',
        detail: `Deploy ${recommendedAssistant.split(' + ')[0]} to validate inputs, extract key fields, and resolve routine inquiries in under 15 seconds.`,
      },
      {
        stepNumber: 3,
        title: 'Automated Routing & One-Click Approval',
        detail:
          'Sync verified records to your database/CRM and send instant mobile approval triggers for high-value exceptions.',
      },
      {
        stepNumber: 4,
        title: 'Live Operations & ROI Dashboard',
        detail:
          'Give leadership real-time visibility into turnaround speed, conversion rates, and SLA bottlenecks.',
      },
    ],
    estimatedEfficiencyGain:
      '15–22 hours saved per week · 3.2× faster turnaround',
    recommendedStack: [
      'Akviora AI Engine',
      'Next.js + React Portal',
      'Node.js Automation API',
      'Cloud Firestore / SQL',
    ],
  };
}

export function buildSmartSuggestionEvaluation(params: {
  authorName?: string;
  category?: string;
  suggestionText: string;
  businessGoal?: string;
}) {
  const { category, suggestionText, businessGoal } = params;
  const text = `${category || ''} ${suggestionText} ${businessGoal || ''}`.toLowerCase();

  let recommendedPillar = 'AI Solutions + Business Automation';
  if (text.includes('pdf') || text.includes('document') || text.includes('invoice') || text.includes('ocr')) {
    recommendedPillar = 'AI Solutions (Document Assistant) + Web & SaaS';
  } else if (text.includes('ui') || text.includes('ux') || text.includes('design') || text.includes('dashboard')) {
    recommendedPillar = 'UI/UX Design + Web & SaaS Engineering';
  } else if (text.includes('sales') || text.includes('lead') || text.includes('crm') || text.includes('whatsapp')) {
    recommendedPillar = 'AI Solutions (Sales Assistant) + Business Automation';
  } else if (text.includes('saas') || text.includes('portal') || text.includes('platform')) {
    recommendedPillar = 'Web & SaaS + Operations Assistant';
  }

  const aiAssessment = `High-impact ${
    category || 'AI Workflow'
  } opportunity: We recommend pairing ${recommendedPillar} with structured webhook intake and automated status triggers to achieve "${
    businessGoal || 'faster operational turnaround'
  }" within a 3–5 week delivery sprint.`;

  return { aiAssessment, recommendedPillar };
}
