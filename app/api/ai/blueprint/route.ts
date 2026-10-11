import { db } from '../../../../lib/db';
import { generateWorkflowBlueprint } from '../../../../lib/gemini';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { businessType, bottleneck } = body;

    if (!businessType || !bottleneck) {
      return Response.json(
        {
          error:
            'Please provide both your business type and current workflow bottleneck.',
        },
        { status: 400 }
      );
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

    return Response.json({ blueprint: saved }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/ai/blueprint:', error);
    return Response.json(
      { error: 'Failed to generate AI blueprint.' },
      { status: 500 }
    );
  }
}
