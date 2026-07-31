/** Display helpers for currency, percentages, and counts. */

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatFar(value: number): string {
  return value.toFixed(2);
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(value);
}

/** Hours with up to one decimal, e.g. "7.5 hrs". */
export function formatHours(value: number): string {
  if (value <= 0) {
    return '0 hrs';
  }
  const formatted =
    value % 1 === 0 ? String(value) : value.toFixed(1).replace(/\.0$/, '');
  return `${formatted} hrs`;
}

/** Effective hourly rate, or em dash when not calculable. */
export function formatHourlyRate(value: number, hoursWorked: number): string {
  if (hoursWorked <= 0) {
    return '—';
  }
  return `${formatCurrency(value)}/hr`;
}
