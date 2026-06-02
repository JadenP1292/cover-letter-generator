import { NextRequest, NextResponse } from 'next/server';
import { buildPrompt } from '@/lib/promptTemplate';

const MOCK_LETTER = `Dear Hiring Manager,

I'm really excited about the opportunity to join [Company Name] as a [Role Title]. The role sounds like a great fit for where I am right now, and from what I've read, it's the kind of work I genuinely enjoy doing.

What draws me to [Company Name] is the product you're building and the problems you're solving. I spend a lot of time thinking about how products grow and how businesses actually work, so finding a team where that curiosity is an asset sounds exciting.

Over the past couple of years, I've built a solid cross-functional foundation. During my real estate analytics internship, I worked with financial models, income statements, rent rolls, and KPI benchmarks across a portfolio of properties, which taught me how to move from raw numbers to real business insights. I also worked in a business analyst and operations role, running product performance audits, supporting new product development, and collaborating across teams to get things shipped. And on the technical side, I built a Creator Matchmaking App from scratch using React Native, TypeScript, and Supabase, which gave me strong hands-on experience going from idea to working product.

I also have a background in the creator and growth space. I've studied audience behavior, experimented with content formats, and thought carefully about what drives real engagement. That gives me a sharper lens on users and growth than most candidates at my stage.

I'd love to bring all of this to [Company Name] and grow with the team. Thanks for your time, and I hope to connect soon.

Sincerely,
Jaden Path`;

export async function POST(request: NextRequest) {
  let body: {
    jobDescription?: string;
    companyName?: string;
    roleTitle?: string;
    hiringManager?: string;
    additionalNotes?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { jobDescription, companyName, roleTitle, hiringManager, additionalNotes } = body;

  if (!jobDescription?.trim()) {
    return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    const mockLetter = MOCK_LETTER
      .replaceAll('[Company Name]', companyName || '[Company Name]')
      .replaceAll('[Role Title]', roleTitle || '[Role Title]');
    return NextResponse.json({ coverLetter: mockLetter });
  }

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: buildPrompt({ jobDescription, companyName, roleTitle, hiringManager, additionalNotes }),
        },
      ],
    });

    const coverLetter =
      message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error('Anthropic API error:', error);
    return NextResponse.json(
      { error: 'Generation failed. Check your API key and try again.' },
      { status: 500 }
    );
  }
}
