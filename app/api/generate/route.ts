import { NextRequest, NextResponse } from 'next/server';
import { buildPrompt } from '@/lib/promptTemplate';

const MOCK_LETTER = `Hi [Company] Team,

I'm excited to apply for this role. Your work immediately stood out to me, especially because it sits at the intersection of technology, strategy, and real-world impact. The opportunity to contribute to a team building something meaningful is exactly the type of work I'm looking to be a part of.

I'm currently a senior at Loyola Marymount University studying Information Systems and Business Analytics with a minor in Computer Science. My background combines analytical thinking, financial problem-solving, and operational experience across both academic and professional settings. In my current role as a Real Estate Analytics Intern, I work extensively with financial statements, portfolio analysis, KPI benchmarking, and performance tracking to support data-driven business decisions. I've also built and maintained financial models, identified trends from complex datasets, and worked in a business analyst and operations role where I coordinated cross-functional projects and supported new product development.

What excites me most about this opportunity is the chance to operate at the intersection of technology and business strategy. I enjoy roles where analytical thinking connects directly to broader organizational goals, and where the work has a real impact on the product and team. I'm especially drawn to contributing to a company where I can take ownership early and grow alongside the business.

I'm also deeply interested in AI, product strategy, and growth, and I actively incorporate AI tools into my own workflows. Outside of my professional experience, I built a Creator Matchmaking App from scratch using React Native, TypeScript, and Supabase, which gave me direct hands-on experience with the full product development cycle.

Thank you for your time and consideration. I would welcome the opportunity to contribute my analytical mindset, operational thinking, and enthusiasm to the team.

Best regards,

Jaden Path

---
Note: This is a preview. Add your Anthropic API key to .env.local to generate a fully tailored letter.`;

export async function POST(request: NextRequest) {
  let body: { jobDescription?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { jobDescription } = body;

  if (!jobDescription?.trim()) {
    return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ coverLetter: MOCK_LETTER });
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
          content: buildPrompt({ jobDescription }),
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
