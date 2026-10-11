import { db } from '../../lib/db';
import { evaluateUserSuggestion } from '../../lib/gemini';

async function parseBody(req: any): Promise<any> {
  if (!req) return {};
  if (typeof req.json === 'function') {
    try {
      return await req.json();
    } catch {
      return {};
    }
  }
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string' && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

function sendJson(res: any, status: number, payload: any) {
  if (res && typeof res.status === 'function') {
    return res.status(status).json(payload);
  }
  return Response.json(payload, { status });
}

export default async function handler(req: any, res?: any) {
  const method = req?.method || 'GET';
  if (method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  if (method === 'GET') {
    return sendJson(res, 200, { suggestions: db.getSuggestions() });
  }

  if (method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const body = await parseBody(req);
    const { authorName, category, suggestionText, businessGoal } = body || {};

    if (!suggestionText || typeof suggestionText !== 'string') {
      return sendJson(res, 400, {
        error: 'Please provide your suggestion or workflow idea.',
      });
    }

    const { aiAssessment, recommendedPillar } = await evaluateUserSuggestion({
      authorName,
      category,
      suggestionText,
      businessGoal,
    });

    const saved = db.addSuggestion({
      authorName: String(authorName || 'Anonymous Innovator').trim(),
      category: category || 'AI Workflow',
      suggestionText: suggestionText.trim(),
      businessGoal: String(
        businessGoal || 'Streamline daily operations and customer experience'
      ).trim(),
      aiAssessment,
      recommendedPillar,
    });

    return sendJson(res, 201, { suggestion: saved });
  } catch (error) {
    console.error('Error in /api/suggestions:', error);
    return sendJson(res, 500, { error: 'Failed to save suggestion.' });
  }
}
