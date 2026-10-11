import { db } from '../../../lib/db';

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

  let id = req?.query?.id;
  if (Array.isArray(id)) id = id[0];
  if (!id && typeof req?.url === 'string') {
    const match = req.url.match(/\/api\/suggestions\/([^/?]+)\/upvote/);
    if (match) id = match[1];
  }

  if (!id) {
    return sendJson(res, 400, { error: 'Suggestion ID is required' });
  }

  const updated = db.upvoteSuggestion(String(id));
  if (!updated) {
    return sendJson(res, 404, { error: 'Suggestion not found' });
  }
  return sendJson(res, 200, { suggestion: updated });
}
