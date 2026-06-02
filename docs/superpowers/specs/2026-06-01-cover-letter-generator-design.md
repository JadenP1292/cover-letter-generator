# Cover Letter Generator — Design Spec
**Date:** 2026-06-01  
**Status:** Approved

---

## Overview

A personal desktop web app that takes a pasted job description and generates a tailored cover letter in Jaden Path's writing style. The generated letter appears in an editable output box and can be copied to clipboard or downloaded as a `.docx` file.

This is a single-user personal tool — no auth, no mobile layout, no multi-user concerns.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (no component library)
- **AI Provider:** Anthropic Claude (`claude-sonnet-4-6`) — falls back to mock if no API key
- **DOCX Export:** `docx` npm package (client-side, no server call)
- **Package Manager:** npm
- **Deployment Target:** Vercel

---

## Folder Structure

```
cover-letter-generator/
├── app/
│   ├── layout.tsx              # root layout, fonts, metadata
│   ├── page.tsx                # main page — two-column desktop layout
│   └── api/
│       └── generate/
│           └── route.ts        # POST endpoint — calls Claude or returns mock
├── components/
│   ├── Header.tsx              # app name + tagline
│   ├── InputPanel.tsx          # left column — form fields + Generate button
│   └── OutputPanel.tsx         # right column — editable output + action buttons
├── lib/
│   ├── promptTemplate.ts       # prompt builder — edit this to tune output
│   └── docxExport.ts           # DOCX generation (client-side)
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-06-01-cover-letter-generator-design.md
├── .env.example
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## UI Layout

**Desktop-only.** Fixed-width centered container. No responsive breakpoints.

### Header
- App name: "Cover Letter Generator"
- Short tagline below
- Minimal — no navigation

### Two-Column Layout (fixed, side by side)
- **Left panel (~45% width):** All input fields + Generate button
- **Right panel (~55% width):** Output textarea + action buttons
- Both panels are independently scrollable if content overflows
- White background, slate-700 text, subtle slate borders between panels

### Left Panel — InputPanel
Fields (top to bottom):
1. **Job Description** — large textarea, most prominent field, tallest
2. **Company Name** — compact text input
3. **Role Title** — compact text input
4. **Hiring Manager** — compact text input
5. **Additional Notes** — smaller textarea
6. **Generate Cover Letter** — full-width primary button (indigo-600)

### Right Panel — OutputPanel
- **Output textarea** — full panel height, editable, clean readable font
- **Empty state** — placeholder text: "Your cover letter will appear here. Fill in the job description and click Generate."
- **Action buttons** (below output):
  - Copy to Clipboard
  - Download DOCX
  - Regenerate (re-sends same inputs without clearing fields)
  - Clear All (clears both input fields and output)
- **Warning banner** below buttons: *"Review before submitting to confirm details are accurate."*

### Color Scheme
- Background: white
- Text: slate-700
- Primary button (Generate): indigo-600, white text
- Secondary buttons: neutral gray
- Warning banner: amber/yellow subtle background

---

## Data Flow

1. User fills InputPanel fields
2. User clicks **Generate Cover Letter**
3. `page.tsx` POSTs to `/api/generate` with `{ jobDescription, companyName, roleTitle, hiringManager, additionalNotes }`
4. API route checks for `ANTHROPIC_API_KEY`:
   - **Key present:** calls `claude-sonnet-4-6` with the built prompt, returns generated text
   - **No key:** returns mock cover letter with `[Company Name]` / `[Role Title]` placeholders
5. Response populates the OutputPanel textarea
6. User edits, copies, downloads, or regenerates

---

## Generation Logic

### `/api/generate` route (POST)
- Input: `{ jobDescription, companyName, roleTitle, hiringManager, additionalNotes }`
- Output: `{ coverLetter: string }`
- Uses `buildPrompt()` from `lib/promptTemplate.ts`
- Calls Anthropic API with `claude-sonnet-4-6` if `ANTHROPIC_API_KEY` is set
- Returns mock letter if no key — makes the app fully functional for UI testing

### `lib/promptTemplate.ts`
The single file to edit when tuning output. Exports:
```ts
export function buildPrompt(inputs: {
  jobDescription: string;
  companyName?: string;
  roleTitle?: string;
  hiringManager?: string;
  additionalNotes?: string;
}): string
```

The prompt hardcodes Jaden's full background:
- Name, school, major, minor
- All experience (real estate analytics, business analyst/ops, creator/social, Creator Matchmaking App)
- Writing style rules (natural, confident, slightly casual, no em dashes, 300-450 words)
- Structural rules (5-paragraph structure)
- Guardrails (no invented metrics, no invented company facts)

---

## DOCX Export

- Implemented in `lib/docxExport.ts`
- Runs entirely in the browser using the `docx` npm package
- Called directly from the Download DOCX button click handler in OutputPanel
- Produces a `.docx` with clean paragraph formatting and standard margins
- No server call required

---

## Environment Variables

```
ANTHROPIC_API_KEY=           # optional — app works without it in mock mode
```

`.env.example` committed to repo. `.env` excluded via `.gitignore`.

---

## Mock Mode

When `ANTHROPIC_API_KEY` is not set, the API route returns a realistic placeholder cover letter. Placeholders like `[Company Name]` and `[Role Title]` appear where real data would go. The full UI (edit, copy, download DOCX) works normally in mock mode.

---

## Out of Scope

- Authentication / login
- Saved letter history
- Mobile / responsive layout
- Multiple user support
- Letter templates or style presets
- OpenAI or Ollama integration (Anthropic is pre-wired; others can be added later)
