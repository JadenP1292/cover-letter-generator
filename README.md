# Cover Letter Generator

A personal desktop web app that generates tailored cover letters from a job description.

## Run Locally

**1. Install dependencies**

```bash
npm install
```

**2. Set up environment**

```bash
cp .env.example .env.local
```

To use real AI generation, open `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Get a key at https://console.anthropic.com — requires a separate paid account.

Leave the key blank to run in **mock mode**: fully functional UI, placeholder cover letter, no cost.

**3. Start the dev server**

```bash
npm run dev
```

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

```
lib/promptTemplate.ts
```

The `buildPrompt()` function contains all background information and writing rules passed to the AI.
