const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function splitDate(ymd: string) {
  if (!ymd) return { day: '', month: '', year: '' };
  const [y, m, d] = ymd.split('-').map(Number);
  return {
    day: String(d).padStart(2, '0'),
    month: MONTHS[m - 1] ?? '',
    year: String(y),
  };
}

// true if the announcement date is within the last 7 days
export function isNewAnnouncement(ymd: string, days = 7) {
  if (!ymd) return false;
  const [y, m, d] = ymd.split('-').map(Number);
  const then = Date.UTC(y, m - 1, d);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = (today - then) / 86400000;
  return diff >= 0 && diff <= days;
}
