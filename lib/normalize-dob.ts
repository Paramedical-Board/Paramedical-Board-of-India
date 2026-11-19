/** Normalises DD-MM-YYYY, DD/MM/YYYY, YYYY/MM/DD or YYYY-MM-DD into YYYY-MM-DD. Returns the trimmed input if unrecognised. */
export function normalizeDob(dobInput: string): string {
  const trimmed = dobInput.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const dmy = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;

  const ymd = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (ymd) return `${ymd[1]}-${ymd[2].padStart(2, "0")}-${ymd[3].padStart(2, "0")}`;

  return trimmed;
}
