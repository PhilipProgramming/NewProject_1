/**
 * Date helpers for the "Today's Activity" model.
 * We key days by local calendar date so midnight naturally rolls over.
 */

/** Returns today's key as YYYY-MM-DD in the device timezone. */
export function getTodayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Human-readable label, e.g. "Sunday, Jul 26". */
export function formatDisplayDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

/** Short label for list rows, e.g. "Jul 26, 2026". */
export function formatShortDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Sort date keys newest first. */
export function sortDateKeysDesc(keys: string[]): string[] {
  return [...keys].sort((a, b) => b.localeCompare(a));
}
