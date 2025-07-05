export async function parseCsvFile<T extends Record<string, string | number | boolean>>(file: File): Promise<T[]> {
  const csvContent = await readFileAsText(file);
  const lines = csvContent.split('\n').filter(line => line.trim() !== '');

  if (lines.length < 2) {
    throw new Error('File must contain at least a header row and one data row');
  }

  const headers = parseCsvRow(lines[0]);
  const dataRows = lines.slice(1).map(parseCsvRow);

  return dataRows.map((row) => {
    const obj: Partial<T> = {};
    headers.forEach((header, index) => {
      const key = header as keyof T;
      obj[key] = coerceValue(row[index]) as T[keyof T];
    });
    return obj as T;
  });
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

function parseCsvRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++; 
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {

      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
} 

function coerceValue(value: string | undefined): string | number | boolean {
  if (value === undefined) return '';
  const trimmed = value.trim();

  const num = Number(trimmed);
  if (!Number.isNaN(num) && trimmed !== '') return num;

  if (trimmed.toLowerCase() === 'true') return true;
  if (trimmed.toLowerCase() === 'false') return false;

  return trimmed;
}
