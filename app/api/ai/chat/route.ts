import { generateChatReply } from '../../../../lib/gemini';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { message, personaId, history } = body;

    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Message is required.' }, { status: 400 });
    }

    const result = await generateChatReply({
      message,
      personaId,
      history,
    });

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/ai/chat:', error);
    return Response.json(
      { error: 'AI Assistant encountered an unexpected error.' },
      { status: 500 }
    );
  }
}
