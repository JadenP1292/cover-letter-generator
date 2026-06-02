# Cover Letter Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a desktop-only Next.js web app where Jaden Path can paste a job description and instantly generate a tailored cover letter, displayed in an editable output box with copy and DOCX download.

**Architecture:** Two-column fixed desktop layout — inputs left (45%), output right (55%). State lives in `page.tsx`. A Next.js API route handles generation, calling `claude-sonnet-4-6` when `ANTHROPIC_API_KEY` is set and returning a realistic mock otherwise. DOCX export runs entirely client-side via the `docx` npm package with dynamic import.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, @anthropic-ai/sdk, docx, Jest + @next/jest

---

## File Map

| File | Responsibility |
|------|----------------|
| `app/layout.tsx` | Root layout, metadata |
| `app/page.tsx` | Main page — all state, two-column layout, generate/clear logic |
| `app/api/generate/route.ts` | POST endpoint — calls Claude or returns mock |
| `components/Header.tsx` | App name + tagline |
| `components/InputPanel.tsx` | Left panel — all form fields + Generate button |
| `components/OutputPanel.tsx` | Right panel — editable output + action buttons + warning |
| `lib/promptTemplate.ts` | Prompt builder with Jaden's full background and style rules |
| `lib/docxExport.ts` | Client-side DOCX generation (browser only, dynamic import) |
| `__tests__/promptTemplate.test.ts` | Tests for buildPrompt() |
| `.env.example` | Environment variable template |
| `README.md` | Setup, run locally, Vercel deployment |

---

### Task 1: Scaffold the Next.js project and install dependencies

**Files:**
- Create: entire project scaffold via create-next-app
- Create: `jest.config.ts`

- [ ] **Step 1: Scaffold the project**

Run from `/Users/bpath/Documents/Cover Letter Generator/cover-letter-generator`:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
```

Expected: Project files created. Output ends with a success message and lists created files including `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `app/`, etc.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install @anthropic-ai/sdk docx
npm install --save-dev jest @types/jest @next/jest jest-environment-node
```

Expected: `node_modules` populated, `package.json` updated with the new entries.

- [ ] **Step 3: Create `jest.config.ts`**

```typescript
import type { Config } from 'jest';
import nextJest from '@next/jest';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
};

export default createJestConfig(config);
```

- [ ] **Step 4: Add test script to `package.json`**

Open `package.json`. In the `"scripts"` object, add:

```json
"test": "jest"
```

- [ ] **Step 5: Strip boilerplate from `app/globals.css`**

Replace the entire contents of `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 6: Delete unused boilerplate files**

```bash
rm -f app/page.module.css public/vercel.svg public/next.svg
```

- [ ] **Step 7: Replace `app/page.tsx` with empty placeholder**

```typescript
export default function Home() {
  return <div />;
}
```

(We will fill this in Task 9.)

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with dependencies"
```

---

### Task 2: Environment setup

**Files:**
- Create: `.env.example`
- Create: `.env.local`

- [ ] **Step 1: Create `.env.example`**

```
# Anthropic API key — get yours at https://console.anthropic.com
# Leave blank to run in mock mode (no cost, no signup required)
ANTHROPIC_API_KEY=
```

- [ ] **Step 2: Create `.env.local`**

```
# Leave blank for mock mode
ANTHROPIC_API_KEY=
```

- [ ] **Step 3: Verify `.gitignore` excludes `.env.local`**

```bash
grep -n "\.env" .gitignore
```

Expected: You see a line like `.env.local` or `.env.*`. If `.env.local` is NOT listed, add it manually. `.env.example` should NOT be excluded (it's safe to commit).

- [ ] **Step 4: Commit**

```bash
git add .env.example
git commit -m "feat: add environment variable setup"
```

---

### Task 3: Prompt template

**Files:**
- Create: `lib/promptTemplate.ts`
- Create: `__tests__/promptTemplate.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/promptTemplate.test.ts`:

```typescript
import { buildPrompt } from '@/lib/promptTemplate';

describe('buildPrompt', () => {
  it('includes the job description in the output', () => {
    const result = buildPrompt({ jobDescription: 'Looking for a data analyst' });
    expect(result).toContain('Looking for a data analyst');
  });

  it('includes Jaden Path by name', () => {
    const result = buildPrompt({ jobDescription: 'Any job' });
    expect(result).toContain('Jaden Path');
  });

  it('includes all optional fields when provided', () => {
    const result = buildPrompt({
      jobDescription: 'Any job',
      companyName: 'Acme Corp',
      roleTitle: 'Product Analyst',
      hiringManager: 'Jane Smith',
      additionalNotes: 'Referral from John',
    });
    expect(result).toContain('Acme Corp');
    expect(result).toContain('Product Analyst');
    expect(result).toContain('Jane Smith');
    expect(result).toContain('Referral from John');
  });

  it('uses hiring manager name in greeting when provided', () => {
    const result = buildPrompt({ jobDescription: 'Any job', hiringManager: 'Jane Smith' });
    expect(result).toContain('Dear Jane Smith,');
  });

  it('uses generic greeting when no hiring manager provided', () => {
    const result = buildPrompt({ jobDescription: 'Any job' });
    expect(result).toContain('Dear Hiring Manager,');
  });

  it('includes the no-em-dash rule', () => {
    const result = buildPrompt({ jobDescription: 'Any job' });
    expect(result.toLowerCase()).toContain('em dash');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test
```

Expected: FAIL — `Cannot find module '@/lib/promptTemplate'`

- [ ] **Step 3: Create `lib/promptTemplate.ts`**

```typescript
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/promptTemplate.ts __tests__/promptTemplate.test.ts jest.config.ts
git commit -m "feat: add prompt template with Jaden's background and style rules"
```

---

### Task 4: API route

**Files:**
- Create: `app/api/generate/route.ts`

- [ ] **Step 1: Create the directory**

```bash
mkdir -p app/api/generate
```

- [ ] **Step 2: Create `app/api/generate/route.ts`**

```typescript
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
```

- [ ] **Step 3: Commit**

```bash
git add app/api/generate/route.ts
git commit -m "feat: add generate API route with mock and Anthropic modes"
```

---

### Task 5: DOCX export

**Files:**
- Create: `lib/docxExport.ts`

- [ ] **Step 1: Create `lib/docxExport.ts`**

```typescript
export async function downloadDocx(
  text: string,
  filename = 'cover-letter.docx'
): Promise<void> {
  const { Document, Paragraph, TextRun, Packer } = await import('docx');

  const lines = text.split('\n');

  const children = lines.map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line,
            size: 24,
            font: 'Times New Roman',
          }),
        ],
        spacing: { after: line.trim() === '' ? 80 : 160 },
      })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/docxExport.ts
git commit -m "feat: add client-side DOCX export"
```

---

### Task 6: Header component

**Files:**
- Create: `components/Header.tsx`

- [ ] **Step 1: Create `components/Header.tsx`**

```typescript
export default function Header() {
  return (
    <header className="shrink-0 border-b border-slate-200 bg-white px-8 py-4">
      <h1 className="text-xl font-semibold text-slate-800">Cover Letter Generator</h1>
      <p className="mt-0.5 text-sm text-slate-500">
        Paste a job description and get a tailored cover letter instantly.
      </p>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Header.tsx
git commit -m "feat: add Header component"
```

---

### Task 7: InputPanel component

**Files:**
- Create: `components/InputPanel.tsx`

- [ ] **Step 1: Create `components/InputPanel.tsx`**

```typescript
'use client';

interface InputPanelProps {
  jobDescription: string;
  companyName: string;
  roleTitle: string;
  hiringManager: string;
  additionalNotes: string;
  isLoading: boolean;
  onJobDescriptionChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
  onRoleTitleChange: (value: string) => void;
  onHiringManagerChange: (value: string) => void;
  onAdditionalNotesChange: (value: string) => void;
  onGenerate: () => void;
}

export default function InputPanel({
  jobDescription,
  companyName,
  roleTitle,
  hiringManager,
  additionalNotes,
  isLoading,
  onJobDescriptionChange,
  onCompanyNameChange,
  onRoleTitleChange,
  onHiringManagerChange,
  onAdditionalNotesChange,
  onGenerate,
}: InputPanelProps) {
  const labelClass = 'block text-xs font-medium text-slate-600 mb-1';
  const inputClass =
    'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto border-r border-slate-200 p-6">
      <div>
        <label className={labelClass}>Job Description *</label>
        <textarea
          className={`${inputClass} h-52 resize-none`}
          placeholder="Paste the full job description here..."
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Company Name</label>
          <input
            type="text"
            className={inputClass}
            placeholder="Acme Corp"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Role Title</label>
          <input
            type="text"
            className={inputClass}
            placeholder="Product Analyst"
            value={roleTitle}
            onChange={(e) => onRoleTitleChange(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Hiring Manager</label>
          <input
            type="text"
            className={inputClass}
            placeholder="Jane Smith"
            value={hiringManager}
            onChange={(e) => onHiringManagerChange(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Additional Notes</label>
        <textarea
          className={`${inputClass} h-24 resize-none`}
          placeholder="Any specific points to emphasize, referrals, or context..."
          value={additionalNotes}
          onChange={(e) => onAdditionalNotesChange(e.target.value)}
        />
      </div>

      <button
        className="w-full rounded-md bg-indigo-600 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={onGenerate}
        disabled={isLoading || !jobDescription.trim()}
      >
        {isLoading ? 'Generating...' : 'Generate Cover Letter'}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/InputPanel.tsx
git commit -m "feat: add InputPanel component"
```

---

### Task 8: OutputPanel component

**Files:**
- Create: `components/OutputPanel.tsx`

- [ ] **Step 1: Create `components/OutputPanel.tsx`**

```typescript
'use client';

import { useState } from 'react';

interface OutputPanelProps {
  coverLetter: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onRegenerate: () => void;
  onClearAll: () => void;
}

export default function OutputPanel({
  coverLetter,
  isLoading,
  onChange,
  onRegenerate,
  onClearAll,
}: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!coverLetter) return;
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDocx = async () => {
    if (!coverLetter) return;
    const { downloadDocx } = await import('@/lib/docxExport');
    await downloadDocx(coverLetter);
  };

  const btnBase =
    'rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40';
  const btnSecondary = `${btnBase} bg-slate-100 text-slate-700 hover:bg-slate-200`;

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-6">
      <textarea
        className="min-h-[420px] w-full flex-1 rounded-md border border-slate-300 p-4 text-sm leading-relaxed text-slate-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
        style={{ fontFamily: 'Georgia, serif', resize: 'none' }}
        placeholder={
          isLoading
            ? 'Generating your cover letter...'
            : 'Your cover letter will appear here. Fill in the job description and click Generate.'
        }
        value={coverLetter}
        onChange={(e) => onChange(e.target.value)}
        readOnly={isLoading}
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          className={btnSecondary}
          onClick={handleCopy}
          disabled={!coverLetter || isLoading}
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        <button
          className={btnSecondary}
          onClick={handleDownloadDocx}
          disabled={!coverLetter || isLoading}
        >
          Download DOCX
        </button>
        <button
          className={btnSecondary}
          onClick={onRegenerate}
          disabled={isLoading}
        >
          Regenerate
        </button>
        <button
          className={`${btnBase} ml-auto bg-slate-100 text-slate-700 hover:bg-slate-200`}
          onClick={onClearAll}
        >
          Clear All
        </button>
      </div>

      {coverLetter && !isLoading && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Review before submitting to confirm details are accurate.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/OutputPanel.tsx
git commit -m "feat: add OutputPanel component"
```

---

### Task 9: Main page and layout

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace `app/layout.tsx`**

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cover Letter Generator',
  description: 'Generate tailored cover letters instantly.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Replace `app/page.tsx`**

```typescript
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import InputPanel from '@/components/InputPanel';
import OutputPanel from '@/components/OutputPanel';

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!jobDescription.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          companyName,
          roleTitle,
          hiringManager,
          additionalNotes,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
      } else {
        setCoverLetter(data.coverLetter);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setJobDescription('');
    setCompanyName('');
    setRoleTitle('');
    setHiringManager('');
    setAdditionalNotes('');
    setCoverLetter('');
    setError('');
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      <Header />
      {error && (
        <div className="shrink-0 border-b border-red-200 bg-red-50 px-8 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="mx-auto flex w-full max-w-7xl flex-1 overflow-hidden">
        <div className="h-full w-[45%]">
          <InputPanel
            jobDescription={jobDescription}
            companyName={companyName}
            roleTitle={roleTitle}
            hiringManager={hiringManager}
            additionalNotes={additionalNotes}
            isLoading={isLoading}
            onJobDescriptionChange={setJobDescription}
            onCompanyNameChange={setCompanyName}
            onRoleTitleChange={setRoleTitle}
            onHiringManagerChange={setHiringManager}
            onAdditionalNotesChange={setAdditionalNotes}
            onGenerate={generate}
          />
        </div>
        <div className="h-full w-[55%]">
          <OutputPanel
            coverLetter={coverLetter}
            isLoading={isLoading}
            onChange={setCoverLetter}
            onRegenerate={generate}
            onClearAll={clearAll}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat: add main page with two-column layout and state management"
```

---

### Task 10: README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Write `README.md`**

```markdown
# Cover Letter Generator

A personal desktop web app that generates tailored cover letters from a job description.

## Run Locally

**1. Install dependencies**

\`\`\`bash
npm install
\`\`\`

**2. Set up environment**

\`\`\`bash
cp .env.example .env.local
\`\`\`

To use real AI generation, open `.env.local` and add your Anthropic API key:

\`\`\`
ANTHROPIC_API_KEY=sk-ant-...
\`\`\`

Get a key at https://console.anthropic.com — requires a separate paid account.

Leave the key blank to run in **mock mode**: fully functional UI, placeholder cover letter, no cost.

**3. Start the dev server**

\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:3000

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to vercel.com and import the repo
3. In Vercel project settings, add the environment variable `ANTHROPIC_API_KEY` (or leave blank for mock mode)
4. Click Deploy

---

## Editing the Prompt

To tune cover letter output — adjust tone, add experience, or change structure — edit:

\`\`\`
lib/promptTemplate.ts
\`\`\`

The `buildPrompt()` function contains all background information and writing rules passed to the AI.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with setup and deployment instructions"
```

---

### Task 11: Run and verify

- [ ] **Step 1: Run tests**

```bash
npm test
```

Expected: All 6 tests PASS with no errors.

- [ ] **Step 2: Build to check for TypeScript errors**

```bash
npm run build
```

Expected: Build completes successfully. If TypeScript errors appear, fix them before proceeding.

- [ ] **Step 3: Start the dev server**

```bash
npm run dev
```

Expected: Output includes `Ready in Xms` and `Local: http://localhost:3000`

- [ ] **Step 4: Test mock generation**

Open http://localhost:3000 in the browser.

- Paste any text into the Job Description field (minimum: any non-empty string)
- Fill in Company Name: `Test Company`
- Fill in Role Title: `Product Analyst`
- Click Generate Cover Letter

Expected: Within 1 second, a cover letter appears in the right panel. The letter addresses "Test Company" and "Product Analyst" instead of `[Company Name]`/`[Role Title]` placeholders. The warning banner appears below the buttons.

- [ ] **Step 5: Test Copy to Clipboard**

Click Copy to Clipboard. Open a text editor and paste. Expected: full cover letter text appears.

- [ ] **Step 6: Test Download DOCX**

Click Download DOCX. Expected: `cover-letter.docx` downloads. Open it — contains the cover letter with paragraph formatting.

- [ ] **Step 7: Test Regenerate**

Click Regenerate without changing inputs. Expected: the same cover letter re-appears (identical in mock mode).

- [ ] **Step 8: Test Clear All**

Click Clear All. Expected: all input fields (job description, company name, role title, hiring manager, additional notes) and the output textarea all become empty.

- [ ] **Step 9: Test error state**

Clear the job description field completely. Verify the Generate button is disabled (greyed out, not clickable).

- [ ] **Step 10: Final commit**

```bash
git add -A
git commit -m "chore: verify all features working in mock mode"
```
