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
