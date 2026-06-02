'use client';

interface InputPanelProps {
  jobDescription: string;
  isLoading: boolean;
  onJobDescriptionChange: (value: string) => void;
  onGenerate: () => void;
}

export default function InputPanel({
  jobDescription,
  isLoading,
  onJobDescriptionChange,
  onGenerate,
}: InputPanelProps) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto border-r border-slate-200 p-6">
      <div className="flex-1 flex flex-col">
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Job Description
        </label>
        <textarea
          className="flex-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Paste the full job description here..."
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
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
