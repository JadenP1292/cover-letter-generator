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
