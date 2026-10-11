import { generateChatReply } from '../../lib/gemini';

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
    const { message, personaId, history } = body || {};

    if (!message || typeof message !== 'string') {
      return sendJson(res, 400, { error: 'Message is required.' });
    }

    const result = await generateChatReply({
      message,
      personaId,
      history,
    });

    return sendJson(res, 200, result);
  } catch (error) {
    console.error('Error in /api/ai/chat:', error);
    return sendJson(res, 500, {
      error: 'AI Assistant encountered an unexpected error.',
    });
  }
}
