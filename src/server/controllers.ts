import { db } from '../../lib/db';
import {
  AKVIORA_SYSTEM_INSTRUCTION,
  evaluateUserSuggestion,
  generateChatReply,
  generateInquirySummary,
  generateWorkflowBlueprint,
} from '../../lib/gemini';
import {
  AI_ASSISTANTS,
  CASE_STUDIES,
  FAQ_ITEMS,
  PROCESS_STEPS,
  SERVICE_PILLARS,
} from '../data/akvioraData.ts';
import { UserSuggestion } from '../types/akviora.ts';

export { AKVIORA_SYSTEM_INSTRUCTION };

export const controllers = {
  getBootstrapData() {
    return {
      services: SERVICE_PILLARS,
      assistants: AI_ASSISTANTS,
      caseStudies: CASE_STUDIES,
      processSteps: PROCESS_STEPS,
      faqs: FAQ_ITEMS,
      suggestions: db.getSuggestions(),
      inquiries: db.getInquiries(),
      blueprints: db.getBlueprints(),
    };
  },

  getSuggestions() {
    return { suggestions: db.getSuggestions() };
  },

  async createSuggestion(body: {
    authorName?: string;
    category?: UserSuggestion['category'];
    suggestionText?: string;
    businessGoal?: string;
  }) {
    const { authorName, category, suggestionText, businessGoal } = body;
    if (!suggestionText || typeof suggestionText !== 'string') {
      throw new Error('Please provide your suggestion or workflow idea.');
    }

    const { aiAssessment, recommendedPillar } = await evaluateUserSuggestion({
      authorName,
      category,
      suggestionText,
      businessGoal,
    });

    const saved = db.addSuggestion({
      authorName: (authorName || 'Anonymous Innovator').trim(),
      category: category || 'AI Workflow',
      suggestionText: suggestionText.trim(),
      businessGoal: (
        businessGoal || 'Streamline daily operations and customer experience'
      ).trim(),
      aiAssessment,
      recommendedPillar,
    });

    return { suggestion: saved };
  },

  upvoteSuggestion(id: string) {
    return db.upvoteSuggestion(id);
  },

  getInquiries() {
    return { inquiries: db.getInquiries() };
  },

  async createInquiry(body: {
    name?: string;
    email?: string;
    company?: string;
    serviceInterest?: string;
    budgetRange?: string;
    timeline?: string;
    problemStatement?: string;
  }) {
    const {
      name,
      email,
      company,
      serviceInterest,
      budgetRange,
      timeline,
      problemStatement,
    } = body;
    if (!name || !email || !problemStatement) {
      throw new Error('Name, email, and project description are required.');
    }

    const aiSummary = await generateInquirySummary({
      name,
      company,
      serviceInterest,
      timeline,
      budgetRange,
      problemStatement,
    });

    const saved = db.addInquiry({
      name: name.trim(),
      email: email.trim(),
      company: (company || 'Growing Business').trim(),
      serviceInterest: serviceInterest || 'AI Solutions & Web Platform',
      budgetRange: budgetRange || '$5k – $15k',
      timeline: timeline || '4 – 8 Weeks',
      problemStatement: problemStatement.trim(),
      aiSummary,
    });

    return { inquiry: saved };
  },

  async handleAIChat(body: {
    message?: string;
    personaId?: string;
    history?: { role: string; content: string }[];
  }) {
    const { message, personaId, history } = body;
    if (!message || typeof message !== 'string') {
      throw new Error('Message is required.');
    }

    return generateChatReply({
      message,
      personaId,
      history,
    });
  },

  async generateAIBlueprint(body: {
    businessType?: string;
    bottleneck?: string;
  }) {
    const { businessType, bottleneck } = body;
    if (!businessType || !bottleneck) {
      throw new Error(
        'Please provide both your business type and current workflow bottleneck.'
      );
    }

    const generated = await generateWorkflowBlueprint({
      businessType,
      bottleneck,
    });

    const saved = db.addBlueprint({
      businessType: businessType.trim(),
      bottleneck: bottleneck.trim(),
      diagnosis: generated.diagnosis,
      recommendedAssistant: generated.recommendedAssistant,
      workflowSteps: generated.workflowSteps,
      estimatedEfficiencyGain: generated.estimatedEfficiencyGain,
      recommendedStack: generated.recommendedStack,
    });

    return { blueprint: saved };
  },
};
