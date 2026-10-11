import { GoogleGenAI, Type } from '@google/genai';
import { AI_ASSISTANTS } from './data';

export function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export const AKVIORA_SYSTEM_INSTRUCTION = `You are the official Akviora AI Solutions Architect & Assistant (always refer to yourself as "Akviora AI", never "Gemini").
Akviora Technologies ("Design the experience. Automate the work. Build what's next.") builds:
1. AI Solutions (Customer Assistant, Sales Assistant, Knowledge Assistant, Document Assistant, Operations Assistant, Appointment Assistant)
2. Web & SaaS Products (Next.js, React, Node.js, scalable multi-tenant SaaS, custom portals)
3. UI/UX Design (User journeys, prototypes, design systems, WCAG AA accessible dashboards)
4. Business Automation (Connecting forms, email, WhatsApp, CRM, spreadsheets, and approval flows)
5. SEO & Digital Growth (Technical SEO, Schema.org JSON-LD, Core Web Vitals, local & organic growth)

Our flagship products/case studies include:
- TrackPayout (Finance & Receivable Automation Platform, +44% faster collections)
- Stockcard (Inventory Management Experience, -62% stockouts)
- TenderItNow (Tender & Business Opportunity Platform with AI PDF screening, 6.5x faster screening)
- RenewalHelp (Contract & AMC Renewal Lifecycle Workflow, 0 missed expirations)
- Cost Management (Real Estate & Construction BOQ Cost Platform)
- AI Astrology Guide (Conversational AI Product Experience)

Our 8-step delivery process: 1. Discover, 2. Define, 3. Design, 4. Build, 5. Connect, 6. Test, 7. Launch, 8. Improve.
Contact email: hello@akvioratechnologies.com.

Always be practical, clear, business-first, and concise. Avoid fluff. Help the user diagnose their workflow bottleneck, suggest concrete automation or product ideas, and recommend specific Akviora capabilities.`;

export async function generateChatReply(params: {
  message: string;
  personaId?: string;
  history?: { role: string; content: string }[];
}) {
  const { message, personaId, history } = params;
  const persona = AI_ASSISTANTS.find((p) => p.id === personaId);
  const personaContext = persona
    ? `You are currently acting in the "${persona.title}" mode (${persona.fullDesc}). Highlight how this specific assistant solves the user's request.`
    : `You are acting as Akviora's Lead AI Strategy & Solutions Assistant.`;

  const ai = getGenAIClient();
  if (ai) {
    try {
      const recentHistory = Array.isArray(history)
        ? history
            .slice(-6)
            .map(
              (m) => `${m.role === 'user' ? 'User' : 'Akviora AI'}: ${m.content}`
            )
            .join('\n')
        : '';

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${personaContext}

Recent Conversation:
${recentHistory}

User Message: ${message}

Respond in JSON with:
1. "reply": Clear, helpful, well-structured response (use bullet points where helpful, max 140 words).
2. "suggestedFollowUps": Array of 3 short follow-up questions or actions the user can click next.
3. "recommendedService": The single most relevant Akviora service or assistant name.`,
        config: {
          systemInstruction: AKVIORA_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: { type: Type.STRING },
              suggestedFollowUps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendedService: { type: Type.STRING },
            },
            required: ['reply', 'suggestedFollowUps', 'recommendedService'],
          },
        },
      });

      if (response.text) {
        return JSON.parse(response.text.trim());
      }
    } catch (err) {
      console.error('Gemini chat fallback triggered:', err);
    }
  }

  const activeTitle = persona ? persona.title : 'Akviora AI Solutions Architect';
  return {
    reply: `As your **${activeTitle}**, here is how we approach "${message.slice(0, 80)}":\n\n• **Workflow First**: We map where your team or customers lose time across spreadsheets, WhatsApp, or manual forms.\n• **Connected Architecture**: We deploy a tailored ${
      persona ? persona.title : 'Akviora AI-powered layer'
    } integrated directly with your Next.js + Node.js database and approval flows.\n• **Measurable Impact**: Typical deployments launch in 3–6 weeks and reduce manual triage by 60%+.\n\nWould you like me to generate a step-by-step **Automation Blueprint** or capture a suggestion for your workflow?`,
    suggestedFollowUps: [
      'Generate a 4-step automation blueprint for my business',
      'How long does it take to build and launch?',
      'Show me similar case studies like TrackPayout or TenderItNow',
    ],
    recommendedService: persona
      ? persona.title
      : 'AI Solutions & Business Automation',
  };
}

export async function evaluateUserSuggestion(params: {
  authorName?: string;
  category?: string;
  suggestionText: string;
  businessGoal?: string;
}) {
  const { authorName, category, suggestionText, businessGoal } = params;
  let aiAssessment =
    'Strong practical workflow opportunity. We recommend starting with a 4-day Discovery sprint to map data inputs, user permissions, and automated notification triggers.';
  let recommendedPillar = 'AI Solutions + Business Automation';

  const ai = getGenAIClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `A user submitted this workflow/product suggestion to Akviora Technologies:
Author: ${authorName || 'Founder'}
Category: ${category || 'AI Workflow'}
Suggestion: ${suggestionText}
Business Goal: ${businessGoal || 'Improve operational speed'}

Return a JSON object with:
1. "aiAssessment": A concise 2-sentence architectural assessment explaining how Akviora can build or automate this for maximum ROI.
2. "recommendedPillar": Which Akviora service pillar + AI assistant fits best (e.g., "AI Solutions (Document Assistant) + Web & SaaS").`,
        config: {
          systemInstruction: AKVIORA_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              aiAssessment: { type: Type.STRING },
              recommendedPillar: { type: Type.STRING },
            },
            required: ['aiAssessment', 'recommendedPillar'],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        if (parsed.aiAssessment) aiAssessment = parsed.aiAssessment;
        if (parsed.recommendedPillar) recommendedPillar = parsed.recommendedPillar;
      }
    } catch (err) {
      console.error('Gemini suggestion assessment fallback:', err);
    }
  }

  return { aiAssessment, recommendedPillar };
}

export async function generateInquirySummary(params: {
  name: string;
  company?: string;
  serviceInterest?: string;
  timeline?: string;
  budgetRange?: string;
  problemStatement: string;
}) {
  const { name, company, serviceInterest, timeline, budgetRange, problemStatement } =
    params;
  let aiSummary = `Discovery Roadmap prepared for ${
    company || name
  }: Focus on ${
    serviceInterest || 'Digital Product & Automation'
  } within ${timeline || '4–8 Weeks'}.`;

  const ai = getGenAIClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Summarize this new client inquiry for Akviora Technologies into a 2-sentence actionable Discovery Call preparation note:
Client: ${name} (${company || 'Startup'})
Service: ${serviceInterest}
Timeline: ${timeline}, Budget: ${budgetRange}
Problem Statement: ${problemStatement}`,
        config: {
          systemInstruction: AKVIORA_SYSTEM_INSTRUCTION,
        },
      });
      if (response.text) {
        aiSummary = response.text.trim();
      }
    } catch (err) {
      console.error('Gemini inquiry summary fallback:', err);
    }
  }

  return aiSummary;
}

export async function generateWorkflowBlueprint(params: {
  businessType: string;
  bottleneck: string;
}) {
  const { businessType, bottleneck } = params;
  const ai = getGenAIClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Create a practical Akviora Technologies AI & Automation Blueprint for:
Business Type: ${businessType}
Workflow Bottleneck: ${bottleneck}

Return a structured JSON blueprint with:
- diagnosis (1-2 sentences)
- recommendedAssistant (which of our 6 assistants + web/automation pillars fit best)
- workflowSteps (array of 4 steps with stepNumber, title, detail)
- estimatedEfficiencyGain (concrete time/cost/conversion metric)
- recommendedStack (array of 4 technologies)`,
        config: {
          systemInstruction: AKVIORA_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              diagnosis: { type: Type.STRING },
              recommendedAssistant: { type: Type.STRING },
              workflowSteps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    detail: { type: Type.STRING },
                  },
                  required: ['stepNumber', 'title', 'detail'],
                },
              },
              estimatedEfficiencyGain: { type: Type.STRING },
              recommendedStack: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              'diagnosis',
              'recommendedAssistant',
              'workflowSteps',
              'estimatedEfficiencyGain',
              'recommendedStack',
            ],
          },
        },
      });

      if (response.text) {
        return JSON.parse(response.text.trim());
      }
    } catch (err) {
      console.error('Gemini blueprint fallback triggered:', err);
    }
  }

  return {
    diagnosis: `Manual handoffs and fragmented data in ${businessType} are creating avoidable response delays and limiting owner visibility.`,
    recommendedAssistant: 'Operations Assistant + Custom Next.js Portal',
    workflowSteps: [
      {
        stepNumber: 1,
        title: 'Centralize Intake & Data Capture',
        detail:
          'Replace scattered WhatsApp messages and spreadsheets with a structured web intake & webhook pipeline.',
      },
      {
        stepNumber: 2,
        title: 'Deploy Grounded AI Triage',
        detail:
          'Use an Akviora AI-powered Assistant to classify requests, extract key fields, and answer routine queries immediately.',
      },
      {
        stepNumber: 3,
        title: 'Automated Approval & Notification Routing',
        detail:
          'Route exceptions to decision-makers with one-click mobile approval and instant customer status updates.',
      },
      {
        stepNumber: 4,
        title: 'Live Owner Visibility Dashboard',
        detail:
          'Track turnaround times, conversion rates, and SLA bottlenecks in real time.',
      },
    ],
    estimatedEfficiencyGain:
      '15–22 hours saved per week · 3x faster customer turnaround',
    recommendedStack: [
      'Akviora AI Engine',
      'Next.js App Router',
      'Node.js Automation API',
      'Relational Database',
    ],
  };
}
