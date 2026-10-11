import { db } from '../../../lib/db';
import {
  AI_ASSISTANTS,
  CASE_STUDIES,
  FAQ_ITEMS,
  PROCESS_STEPS,
  SERVICE_PILLARS,
} from '../../../lib/data';

export async function GET(): Promise<Response> {
  return Response.json({
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
