import { db } from '../../lib/db';
import { generateInquirySummary } from '../../lib/gemini';

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
    return sendJson(res, 200, { inquiries: db.getInquiries() });
  }

  if (method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const body = await parseBody(req);
    const {
      name,
      email,
      company,
      serviceInterest,
      budgetRange,
      timeline,
      problemStatement,
    } = body || {};

    if (!name || !email || !problemStatement) {
      return sendJson(res, 400, {
        error: 'Name, email, and project description are required.',
      });
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
      name: String(name).trim(),
      email: String(email).trim(),
      company: String(company || 'Growing Business').trim(),
      serviceInterest: serviceInterest || 'AI Solutions & Web Platform',
      budgetRange: budgetRange || '$5k – $15k',
      timeline: timeline || '4 – 8 Weeks',
      problemStatement: String(problemStatement).trim(),
      aiSummary,
    });

    return sendJson(res, 201, { inquiry: saved });
  } catch (error) {
    console.error('Error in /api/inquiries:', error);
    return sendJson(res, 500, { error: 'Failed to submit project inquiry.' });
  }
}
