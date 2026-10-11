import { db } from '../lib/db';
import {
  AI_ASSISTANTS,
  CASE_STUDIES,
  FAQ_ITEMS,
  PROCESS_STEPS,
  SERVICE_PILLARS,
} from '../lib/data';

function sendJson(res: any, status: number, payload: any) {
  if (res && typeof res.status === 'function') {
    return res.status(status).json(payload);
  }
  return Response.json(payload, { status });
}

export default async function handler(_req: any, res?: any) {
  return sendJson(res, 200, {
    services: SERVICE_PILLARS,
    assistants: AI_ASSISTANTS,
    caseStudies: CASE_STUDIES,
    processSteps: PROCESS_STEPS,
    faqs: FAQ_ITEMS,
    suggestions: db.getSuggestions(),
    inquiries: db.getInquiries(),
    blueprints: db.getBlueprints(),
  });
}
