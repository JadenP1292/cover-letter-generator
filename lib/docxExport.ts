export async function downloadDocx(
  text: string,
  filename = 'cover-letter.docx'
): Promise<void> {
  const { Document, Paragraph, TextRun, Packer } = await import('docx');

  const lines = text.split('\n');

  const children = lines.map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line,
            size: 24,
            font: 'Times New Roman',
          }),
        ],
        spacing: { after: line.trim() === '' ? 80 : 160 },
      })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
