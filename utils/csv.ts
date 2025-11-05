/**
 * Escapes a value for CSV format. If the value contains a comma, double quote, or newline,
 * it will be wrapped in double quotes. Existing double quotes will be escaped by doubling them.
 * @param value The value to escape.
 * @returns The escaped string.
 */
const escapeCSV = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  let str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Exports an array of objects to a CSV file and triggers a download.
 * @param data The array of data objects.
 * @param headers An object mapping object keys to CSV header display names.
 * @param filename The name of the file to be downloaded.
 */
export const exportToCSV = (data: Record<string, any>[], headers: Record<string, string>, filename: string) => {
  if (!data || data.length === 0) {
    alert("Tidak ada data untuk diekspor.");
    return;
  }
  
  const headerKeys = Object.keys(headers);
  const headerValues = Object.values(headers);

  const csvRows = [headerValues.join(',')]; // Header row

  data.forEach(row => {
    const values = headerKeys.map(key => escapeCSV(row[key]));
    csvRows.push(values.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Create a link and trigger the download
  const link = document.createElement('a');
  if (link.download !== undefined) { // Check for download attribute support
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};