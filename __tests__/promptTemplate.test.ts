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
