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
