function getOrdinal(n: number): string {
  if (n > 3 && n < 21) return 'th';
  switch (n % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

function formatDate(date: Date): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const day = date.getDate();
  return `${months[date.getMonth()]} ${day}${getOrdinal(day)}, ${date.getFullYear()}`;
}

function extractCompanyName(text: string): string {
  const firstLine = text.split('\n')[0].trim();
  const match = firstLine.match(/^Hi (.+?) Team,?$/);
  return match ? match[1] : 'Company';
}

export async function downloadPdf(text: string): Promise<void> {
  const company = extractCompanyName(text);
  const filename = `Jaden Path - ${company} Cover Letter.pdf`;
  const { default: jsPDF } = await import('jspdf');

  const doc = new jsPDF({ unit: 'pt', format: 'letter' });

  const marginLeft = 72;
  const marginTop = 72;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - marginLeft - 72;

  doc.setFont('times', 'normal');
  doc.setFontSize(12);

  const lineHeight = 16;
  const blankLineHeight = 13;

  const pageHeight = doc.internal.pageSize.getHeight();
  const marginBottom = 72;

  // Reserve space at the bottom for "Best regards,\n\nJaden Path"
  const signOffHeight = lineHeight + blankLineHeight + lineHeight + blankLineHeight;
  const bodyMaxY = pageHeight - marginBottom - signOffHeight;

  let y = marginTop;

  const addLine = (line: string) => {
    const wrapped = doc.splitTextToSize(line, maxWidth) as string[];
    for (const wl of wrapped) {
      if (y <= bodyMaxY) {
        doc.text(wl, marginLeft, y);
        y += lineHeight;
      }
    }
  };

  const addBlank = () => {
    if (y + blankLineHeight <= bodyMaxY) y += blankLineHeight;
  };

  // Header: date, name, email, phone
  addLine(formatDate(new Date()));
  addLine('Jaden Path');
  addLine('jadenp1292@gmail.com');
  addLine('(949) 396-4969');
  addBlank();

  // Split sign-off from body so we can pin it at the bottom
  const signOffMarker = 'Best regards,';
  const signOffIndex = text.indexOf(signOffMarker);
  const body = signOffIndex >= 0 ? text.slice(0, signOffIndex).trimEnd() : text;

  // Render body
  const lines = body.split('\n');
  for (const line of lines) {
    if (line.trim() === '') {
      addBlank();
    } else {
      addLine(line);
    }
  }

  // Always render sign-off with guaranteed spacing at the bottom
  const signOffY = pageHeight - marginBottom - lineHeight - blankLineHeight - lineHeight;
  doc.text(signOffMarker, marginLeft, signOffY);
  doc.text('Jaden Path', marginLeft, signOffY + blankLineHeight + lineHeight);

  doc.save(filename);
}
