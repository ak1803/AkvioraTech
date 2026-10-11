import { db } from '../../../lib/db';
import { evaluateUserSuggestion } from '../../../lib/gemini';

export async function GET(): Promise<Response> {
  return Response.json({ suggestions: db.getSuggestions() });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { authorName, category, suggestionText, businessGoal } = body;

    if (!suggestionText || typeof suggestionText !== 'string') {
      return Response.json(
        { error: 'Please provide your suggestion or workflow idea.' },
        { status: 400 }
      );
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

    return Response.json({ suggestion: saved }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/suggestions:', error);
    return Response.json(
      { error: 'Failed to save suggestion.' },
      { status: 500 }
    );
  }
}
