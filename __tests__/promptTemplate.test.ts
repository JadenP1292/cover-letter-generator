import { buildPrompt } from '@/lib/promptTemplate';

describe('buildPrompt', () => {
  it('includes the job description in the output', () => {
    const result = buildPrompt({ jobDescription: 'Looking for a data analyst at Acme Corp' });
    expect(result).toContain('Looking for a data analyst at Acme Corp');
  });

  it('includes Jaden Path by name', () => {
    const result = buildPrompt({ jobDescription: 'Any job' });
    expect(result).toContain('Jaden Path');
  });

  it('includes LMU in the prompt', () => {
    const result = buildPrompt({ jobDescription: 'Any job' });
    expect(result).toContain('Loyola Marymount University');
  });

  it('instructs AI to extract company name from job description', () => {
    const result = buildPrompt({ jobDescription: 'Any job' });
    expect(result).toContain('Extract the company name');
  });

  it('includes the no-em-dash rule', () => {
    const result = buildPrompt({ jobDescription: 'Any job' });
    expect(result.toLowerCase()).toContain('em dash');
  });

  it('signs off with Best regards', () => {
    const result = buildPrompt({ jobDescription: 'Any job' });
    expect(result).toContain('Best regards,');
  });

  it('includes style reference examples', () => {
    const result = buildPrompt({ jobDescription: 'Any job' });
    expect(result).toContain('Hi Supio Team,');
  });
});
