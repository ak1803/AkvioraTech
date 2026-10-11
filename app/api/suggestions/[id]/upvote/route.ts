import { db } from '../../../../../lib/db';

export async function POST(
  _request: Request,
  context: { params: { id: string } }
): Promise<Response> {
  const updated = db.upvoteSuggestion(context.params.id);
  if (!updated) {
    return Response.json({ error: 'Suggestion not found' }, { status: 404 });
  }
  return Response.json({ suggestion: updated });
}
