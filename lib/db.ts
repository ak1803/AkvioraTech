import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  AIBlueprint,
  ProjectInquiry,
  UserSuggestion,
} from './types';

interface DatabaseSchema {
  inquiries: ProjectInquiry[];
  suggestions: UserSuggestion[];
  blueprints: AIBlueprint[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'akviora_db.json');
const TMP_DB_FILE = path.join(os.tmpdir(), 'akviora_db.json');

let memoryStore: DatabaseSchema | null = null;

const INITIAL_SUGGESTIONS: UserSuggestion[] = [
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
  {
    id: 'sug-103',
    authorName: 'Karan Verma · Real Estate Director',
    category: 'SaaS Feature',
    suggestionText:
      'Multi-site construction material rate comparison and automated PO variance alert before approval.',
    businessGoal:
      'Prevent procurement cost overruns across 6 active residential towers.',
    aiAssessment:
      'Matches our Cost Management platform architecture: real-time BOQ threshold checks with mobile-first two-tap executive approval flows.',
    recommendedPillar: 'Web & SaaS + Operations Assistant',
    upvotes: 11,
    createdAt: '2026-10-07T08:45:00.000Z',
  },
];

const INITIAL_INQUIRIES: ProjectInquiry[] = [
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
];

const INITIAL_BLUEPRINTS: AIBlueprint[] = [
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
];

function ensureDbFile(): DatabaseSchema {
  if (memoryStore) {
    return memoryStore;
  }

  const candidateFiles = [TMP_DB_FILE, DB_FILE];
  for (const filePath of candidateFiles) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
        memoryStore = {
          inquiries: Array.isArray(parsed.inquiries)
            ? parsed.inquiries
            : [...INITIAL_INQUIRIES],
          suggestions: Array.isArray(parsed.suggestions)
            ? parsed.suggestions
            : [...INITIAL_SUGGESTIONS],
          blueprints: Array.isArray(parsed.blueprints)
            ? parsed.blueprints
            : [...INITIAL_BLUEPRINTS],
        };
        return memoryStore;
      }
    } catch {
      // Ignore read errors and try next candidate
    }
  }

  memoryStore = {
    inquiries: [...INITIAL_INQUIRIES],
    suggestions: [...INITIAL_SUGGESTIONS],
    blueprints: [...INITIAL_BLUEPRINTS],
  };
  saveDbFile(memoryStore);
  return memoryStore;
}

function saveDbFile(data: DatabaseSchema): void {
  memoryStore = data;
  const serialized = JSON.stringify(data, null, 2);

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, serialized, 'utf-8');
    return;
  } catch {
    // Primary directory is read-only (e.g., Vercel /var/task); fall back to os.tmpdir()
  }

  try {
    fs.writeFileSync(TMP_DB_FILE, serialized, 'utf-8');
  } catch {
    // Keep state in memoryStore if both paths are non-writable
  }
}

export const db = {
  getInquiries(): ProjectInquiry[] {
    return ensureDbFile().inquiries;
  },

  addInquiry(
    inquiry: Omit<ProjectInquiry, 'id' | 'createdAt' | 'status'>
  ): ProjectInquiry {
    const state = ensureDbFile();
    const record: ProjectInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'New',
    };
    state.inquiries.unshift(record);
    saveDbFile(state);
    return record;
  },

  getSuggestions(): UserSuggestion[] {
    return ensureDbFile().suggestions;
  },

  addSuggestion(
    suggestion: Omit<UserSuggestion, 'id' | 'upvotes' | 'createdAt'>
  ): UserSuggestion {
    const state = ensureDbFile();
    const record: UserSuggestion = {
      ...suggestion,
      id: `sug-${Date.now()}`,
      upvotes: 1,
      createdAt: new Date().toISOString(),
    };
    state.suggestions.unshift(record);
    saveDbFile(state);
    return record;
  },

  upvoteSuggestion(id: string): UserSuggestion | null {
    const state = ensureDbFile();
    const item = state.suggestions.find((s) => s.id === id);
    if (!item) return null;
    item.upvotes += 1;
    saveDbFile(state);
    return item;
  },

  getBlueprints(): AIBlueprint[] {
    return ensureDbFile().blueprints;
  },

  addBlueprint(blueprint: Omit<AIBlueprint, 'id' | 'createdAt'>): AIBlueprint {
    const state = ensureDbFile();
    const record: AIBlueprint = {
      ...blueprint,
      id: `bp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    state.blueprints.unshift(record);
    saveDbFile(state);
    return record;
  },
};
