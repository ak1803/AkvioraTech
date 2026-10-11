import { db } from '../../../lib/db';
import { generateInquirySummary } from '../../../lib/gemini';

export async function GET(): Promise<Response> {
  return Response.json({ inquiries: db.getInquiries() });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const {
      name,
      email,
      company,
      serviceInterest,
      budgetRange,
      timeline,
      problemStatement,
    } = body;

    if (!name || !email || !problemStatement) {
      return Response.json(
        { error: 'Name, email, and project description are required.' },
        { status: 400 }
      );
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

    return Response.json({ inquiry: saved }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/inquiries:', error);
    return Response.json(
      { error: 'Failed to submit project inquiry.' },
      { status: 500 }
    );
  }
}
