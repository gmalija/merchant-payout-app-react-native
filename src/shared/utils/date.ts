/**
 * Format date as DD Mon YYYY
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "23 Jan 2026")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const day = date.getUTCDate();
  const month = date.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}