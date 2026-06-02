export interface PromptInputs {
  jobDescription: string;
  companyName?: string;
  roleTitle?: string;
  hiringManager?: string;
  additionalNotes?: string;
}

export function buildPrompt(inputs: PromptInputs): string {
  const { jobDescription, companyName, roleTitle, hiringManager, additionalNotes } = inputs;
  const greeting = hiringManager ? `Dear ${hiringManager},` : 'Dear Hiring Manager,';

  return `You are writing a cover letter on behalf of Jaden Path. Use the background and style rules below to write a tailored, human cover letter based on the job description provided.

## About Jaden Path

Name: Jaden Path
Education: Senior at Loyola Marymount University, majoring in Information Systems and Business Analytics, minoring in Computer Science

Interests: AI, Product, Growth, Analytics, Creator economy, Tech, Business strategy, Startups, Product marketing, Business operations, Consulting

Skills: SQL, Python, Excel, Dashboards, Data analysis, Financial analysis, Project coordination, AI tools, Content creation, Audience growth, Social media strategy, Business analysis, Growth experimentation, Research, Cross-functional collaboration

Experience:

1. Real Estate Analytics Intern: financial analysis, KPI benchmarking, year-over-year analysis, rent rolls, income statements, balance sheets, investment performance analysis, financial modeling, portfolio and business insights

2. Business Analyst / Operations Intern: audits, inventory reports, product performance analysis, website support, operations support, new product development, cross-functional collaboration

3. Creator / Growth / Social Media: content creation, audience growth, platform strategy, engagement analysis, experimentation with content formats, understanding Gen Z behavior online, digital marketing instincts

4. Technical Project: Built a Creator Matchmaking App using Expo, React Native, TypeScript, Supabase, and NativeWind

## Writing Style Rules

Tone: natural, confident, excited, slightly casual, professional, thoughtful, and tailored to the company.

NEVER use em dashes (the long dash character). This is a hard rule with no exceptions.
Do not use robotic or generic corporate phrases.
Do not use overly formal language, awkward filler, fake enthusiasm, or buzzword overload.

Length: 300 to 450 words.

Structure:
1. Opening expressing genuine excitement for the role and company
2. Why the company product or mission interests Jaden specifically
3. Two to three relevant experiences connected to the role requirements
4. Why Jaden would be a strong fit overall
5. Confident, warm closing

Hard rules:
- Do not invent experience not listed above
- Do not invent metrics or numbers unless explicitly provided
- Do not invent company facts beyond what the job description states
- Keep writing believable and human

## Job Details
${companyName ? `Company: ${companyName}` : ''}
${roleTitle ? `Role: ${roleTitle}` : ''}
${additionalNotes ? `Additional notes: ${additionalNotes}` : ''}

## Job Description

${jobDescription}

## Output Instructions

Write the cover letter now. Start with "${greeting}" on the first line. End with:

Sincerely,
Jaden Path

Output only the cover letter text. No commentary, no explanation, no preamble.`;
}
