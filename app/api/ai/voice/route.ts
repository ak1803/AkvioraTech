import { generateVoiceAssistantResponse } from '../../../../lib/gemini';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { message, personaId, voiceName, language, history } = body;

    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Message is required.' }, { status: 400 });
    }

    const result = await generateVoiceAssistantResponse({
      message,
      personaId,
      voiceName,
      language,
      history,
    });

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/ai/voice:', error);
    return Response.json(
      { error: 'Voice Assistant encountered an unexpected error.' },
      { status: 500 }
    );
  }
}
