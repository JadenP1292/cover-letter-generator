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

export async function downloadPdf(text: string, filename = 'cover-letter.pdf'): Promise<void> {
  const { default: jsPDF } = await import('jspdf');

  const doc = new jsPDF({ unit: 'pt', format: 'letter' });

  const marginLeft = 72;
  const marginTop = 72;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - marginLeft - 72;

  doc.setFont('times', 'normal');
  doc.setFontSize(11);

  const lineHeight = 15;
  const blankLineHeight = 13;

  let y = marginTop;

  const addLine = (line: string) => {
    const wrapped = doc.splitTextToSize(line, maxWidth) as string[];
    for (const wl of wrapped) {
      doc.text(wl, marginLeft, y);
      y += lineHeight;
    }
  };

  const addBlank = () => {
    y += blankLineHeight;
  };

  // Header: date, name, email, phone
  addLine(formatDate(new Date()));
  addLine('Jaden Path');
  addLine('jadenp1292@gmail.com');
  addLine('(949) 396-4969');
  addBlank();

  // Cover letter body — blank lines become paragraph spacing
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.trim() === '') {
      addBlank();
    } else {
      addLine(line);
    }
  }

  doc.save(filename);
}
