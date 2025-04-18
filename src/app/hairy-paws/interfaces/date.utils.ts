export function formatDateForAPI(date: Date): string {
  if (!date) return '';
  return date.toISOString();
}
