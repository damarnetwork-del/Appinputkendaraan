// Because jspdf and its plugin are loaded from a script tag, we need to declare it for TypeScript.
declare const jspdf: any;

/**
 * Exports data to a PDF file and triggers a download.
 * @param head The table headers, e.g., [['Column 1', 'Column 2']]
 * @param body The table body data, e.g., [['Row 1 Cell 1', 'Row 1 Cell 2'], ['Row 2 Cell 1', 'Row 2 Cell 2']]
 * @param title The title to be displayed at the top of the PDF.
 * @param filename The name of the file to be downloaded.
 */
export const exportToPDF = (
  head: string[][],
  body: (string | number)[][],
  title: string,
  filename: string
) => {
  if (!body || body.length === 0) {
    alert("Tidak ada data untuk diekspor.");
    return;
  }

  try {
    const { jsPDF } = jspdf;
    const doc = new jsPDF({
      orientation: 'landscape',
    });

    doc.setFontSize(18);
    doc.text(title, 14, 22);

    (doc as any).autoTable({
      head,
      body,
      startY: 30,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [30, 144, 255], // Dodger Blue
        textColor: 255,
        fontStyle: 'bold',
      },
    });

    doc.save(filename);
  } catch (error) {
    console.error("Gagal membuat PDF:", error);
    alert("Gagal membuat PDF. Pastikan pustaka jspdf berhasil dimuat.");
  }
};