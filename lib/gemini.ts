import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { AI_ASSISTANTS } from './data';
import {
  buildSmartBlueprint,
  buildSmartContextualReply,
  buildSmartSuggestionEvaluation,
} from './ai-fallback';

// Ensure .env.local and .env are loaded in local dev and standalone serverless invocations
try {
  dotenv.config({ path: '.env.local' });
  dotenv.config();
} catch {
  // Ignore if dotenv file reading is restricted in edge/serverless runtime
}

function resolveApiKey(): string | null {
  const candidates = [
    process.env.GEMINI_API_KEY,
    process.env.GOOGLE_API_KEY,
    process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    process.env.VITE_GEMINI_API_KEY,
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    const cleaned = raw.trim().replace(/^["']|["']$/g, '');
    if (
      cleaned &&
      cleaned !== 'MY_GEMINI_API_KEY' &&
      cleaned !== 'your_free_gemini_api_key' &&
      cleaned !== 'YOUR_GEMINI_API_KEY'
    ) {
      return cleaned;
    }
  }
  return null;
}

export function getGenAIClient(): GoogleGenAI | null {
  const apiKey = resolveApiKey();
  if (!apiKey) {
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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Gemini request timed out after ${ms}ms`));
    }, ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function generateWithModelFallback(
  ai: GoogleGenAI,
  contents: string,
  config: Record<string, any>
) {
  const modelsToTry: { model: string; extraConfig?: Record<string, any> }[] = [
    {
      model: 'gemini-3.8-flash',
      extraConfig: { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } },
    },
    {
      model: 'gemini-flash-latest',
    },
    {
      model: 'gemini-3.1-flash-lite',
      extraConfig: { thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL } },
    },
  ];

  let lastError: unknown;
  for (const candidate of modelsToTry) {
    try {
      return await withTimeout(
        ai.models.generateContent({
          model: candidate.model,
          contents,
          config: {
            ...config,
            ...(candidate.extraConfig || {}),
          },
        }),
        24000
      );
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

export const AKVIORA_SYSTEM_INSTRUCTION = `You are the official Akviora AI Solutions Architect & Assistant (always refer to yourself as "Akviora AI", never "Gemini").
Akviora Technologies ("Design the experience. Automate the work. Build what's next.") builds:
1. AI Solutions (Customer Assistant, Sales Assistant, Knowledge Assistant, Document Assistant, Operations Assistant, Appointment Assistant)
2. Web & SaaS Products (Next.js, React, Node.js, scalable multi-tenant SaaS, custom portals)
3. UI/UX Design (User journeys, prototypes, design systems, WCAG AA accessible dashboards)
4. Business Automation (Connecting forms, email, WhatsApp, CRM, spreadsheets, and approval flows)
5. SEO & Digital Growth (Technical SEO, Schema.org JSON-LD, Core Web Vitals, local & organic growth)

Our flagship products/case studies include:
- PayTrack (FinTech & Smart Invoicing Platform, +48% faster collections)
- NextGen IOT (Industrial IoT & Telemetry Platform, -65% machine downtime prevented)
- NeuroNova (AI Cognitive Intelligence & Neural Platform, 3.8x focus and recovery lift)
- OmniFlow (Enterprise Workflow Orchestration Engine, 22 hrs/wk saved per manager)
- Cosmic Compass (AI Astrology & Astrocartography Platform, 62% Day-30 retention)
- EasyMart (Hyperlocal Grocery & Quick-Commerce App, +38% cart conversion, 11.4 min delivery cycle)

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

      const response = await generateWithModelFallback(
        ai,
        `${personaContext}

Recent Conversation:
${recentHistory}

User Message: ${message}

Respond in JSON with:
1. "reply": Clear, helpful, well-structured response (use bullet points where helpful, max 140 words).
2. "suggestedFollowUps": Array of 3 short follow-up questions or actions the user can click next.
3. "recommendedService": The single most relevant Akviora service or assistant name.`,
        {
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
        }
      );

      if (response.text) {
        return JSON.parse(response.text.trim());
      }
    } catch (err) {
      console.error('Gemini chat fallback triggered:', err);
    }
  }

  return buildSmartContextualReply({ message, personaId, history });
}

export async function evaluateUserSuggestion(params: {
  authorName?: string;
  category?: string;
  suggestionText: string;
  businessGoal?: string;
}) {
  const { authorName, category, suggestionText, businessGoal } = params;
  const fallback = buildSmartSuggestionEvaluation(params);
  let aiAssessment = fallback.aiAssessment;
  let recommendedPillar = fallback.recommendedPillar;

  const ai = getGenAIClient();
  if (ai) {
    try {
      const response = await generateWithModelFallback(
        ai,
        `A user submitted this workflow/product suggestion to Akviora Technologies:
Author: ${authorName || 'Founder'}
Category: ${category || 'AI Workflow'}
Suggestion: ${suggestionText}
Business Goal: ${businessGoal || 'Improve operational speed'}

Return a JSON object with:
1. "aiAssessment": A concise 2-sentence architectural assessment explaining how Akviora can build or automate this for maximum ROI.
2. "recommendedPillar": Which Akviora service pillar + AI assistant fits best (e.g., "AI Solutions (Document Assistant) + Web & SaaS").`,
        {
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
        }
      );

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
      const response = await generateWithModelFallback(
        ai,
        `Summarize this new client inquiry for Akviora Technologies into a 2-sentence actionable Discovery Call preparation note:
Client: ${name} (${company || 'Startup'})
Service: ${serviceInterest}
Timeline: ${timeline}, Budget: ${budgetRange}
Problem Statement: ${problemStatement}`,
        {
          systemInstruction: AKVIORA_SYSTEM_INSTRUCTION,
        }
      );
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
      const response = await generateWithModelFallback(
        ai,
        `Create a practical Akviora Technologies AI & Automation Blueprint for:
Business Type: ${businessType}
Workflow Bottleneck: ${bottleneck}

Return a structured JSON blueprint with:
- diagnosis (1-2 sentences)
- recommendedAssistant (which of our 6 assistants + web/automation pillars fit best)
- workflowSteps (array of 4 steps with stepNumber, title, detail)
- estimatedEfficiencyGain (concrete time/cost/conversion metric)
- recommendedStack (array of 4 technologies)`,
        {
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
        }
      );

      if (response.text) {
        return JSON.parse(response.text.trim());
      }
    } catch (err) {
      console.error('Gemini blueprint fallback triggered:', err);
    }
  }

  return buildSmartBlueprint({ businessType, bottleneck });
}

export async function generateVoiceAssistantResponse(params: {
  message: string;
  personaId?: string;
  voiceName?: string;
  language?: string;
  history?: { role: string; content: string }[];
}) {
  const {
    message,
    personaId,
    voiceName = 'Zephyr',
    language = 'English',
    history,
  } = params;
  const persona = AI_ASSISTANTS.find((p) => p.id === personaId);
  const personaTitle = persona?.title || 'Lead AI Architect';

  const ai = getGenAIClient();
  let replyText = '';
  let audioBase64: string | null = null;
  let suggestedFollowUps: string[] = [
    'How do we get started?',
    'What is the estimated timeline?',
    'Can this integrate with WhatsApp and CRM?',
  ];

  if (ai) {
    try {
      const recentHistory = Array.isArray(history)
        ? history
            .slice(-6)
            .map((m) => `${m.role === 'user' ? 'User' : 'Akviora AI'}: ${m.content}`)
            .join('\n')
        : '';

      const isHindi =
        language.toLowerCase().includes('hindi') ||
        language.toLowerCase().includes('hi') ||
        /[\u0900-\u097F]/.test(message);

      const languageInstruction = isHindi
        ? 'Language Requirement: You MUST reply fluently, idiomatically, warmly, and completely in conversational Hindi (Devanagari script). Use natural, everyday business Hindi that sounds pleasant when spoken aloud. Do NOT reply in English.'
        : `Language Requirement: You MUST reply fluently, idiomatically, and completely in the "${language}" language.`;

      const voicePrompt = `You are speaking aloud as the Akviora Gemini Voice Assistant in the role of "${personaTitle}".
${languageInstruction}
Keep your response conversational, engaging, concise, and natural to listen to (2 to 4 sentences maximum, strictly under 70 words).
Do NOT include markdown asterisks, bullet points, headers, or URL links, as this will be read directly by text-to-speech.

Recent Dialogue:
${recentHistory}

User Query: ${message}`;

      const textRes = await generateWithModelFallback(
        ai,
        voicePrompt,
        {
          systemInstruction: AKVIORA_SYSTEM_INSTRUCTION,
        }
      );

      if (textRes.text) {
        replyText = textRes.text.trim().replace(/[*_#`~\[\]]/g, '');
      }

      // Try synthesizing voice audio with gemini-3.8-flash-tts with fast timeout
      if (replyText) {
        try {
          const ttsResponse = await withTimeout(
            ai.models.generateContent({
              model: 'gemini-3.8-flash-tts',
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: replyText,
                      speechMetadata: {
                        style: 'Clear, engaging, professional voice assistant',
                      },
                    },
                  ],
                },
              ],
              config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voiceName || 'Zephyr' },
                  },
                },
              },
            }),
            3500
          );

          const candData =
            ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (candData) {
            audioBase64 = candData;
          }
        } catch (ttsErr: any) {
          console.warn('TTS fast fallback to browser speech synthesis:', ttsErr?.message || ttsErr);
        }
      }
    } catch (err) {
      console.error('Gemini voice generation fallback:', err);
    }
  }

  let phoneticReply = '';
  // Fallback if no reply generated (or offline/missing API key)
  if (!replyText) {
    const fallback = buildSmartContextualReply({ message, personaId, language, history });
    replyText = fallback.reply.replace(/[*_#`~\[\]]/g, '');
    phoneticReply = fallback.phoneticReply || '';
    if (fallback.suggestedFollowUps?.length) {
      suggestedFollowUps = fallback.suggestedFollowUps;
    }
  }

  return {
    reply: replyText,
    phoneticReply,
    audioData: audioBase64,
    audioMime: 'audio/wav',
    voiceName,
    language,
    personaTitle,
    suggestedFollowUps,
  };
}

