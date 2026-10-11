import { db } from '../../lib/db';
import { generateWorkflowBlueprint } from '../../lib/gemini';

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
  const method = req?.method || 'POST';
  if (method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }
  if (method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const body = await parseBody(req);
    const { businessType, bottleneck } = body || {};

    if (!businessType || !bottleneck) {
      return sendJson(res, 400, {
        error:
          'Please provide both your business type and current workflow bottleneck.',
      });
    }

    const generated = await generateWorkflowBlueprint({
      businessType,
      bottleneck,
    });

    const saved = db.addBlueprint({
      businessType: String(businessType).trim(),
      bottleneck: String(bottleneck).trim(),
      diagnosis: generated.diagnosis,
      recommendedAssistant: generated.recommendedAssistant,
      workflowSteps: generated.workflowSteps,
      estimatedEfficiencyGain: generated.estimatedEfficiencyGain,
      recommendedStack: generated.recommendedStack,
    });

    return sendJson(res, 201, { blueprint: saved });
  } catch (error) {
    console.error('Error in /api/ai/blueprint:', error);
    return sendJson(res, 500, { error: 'Failed to generate AI blueprint.' });
  }
}
