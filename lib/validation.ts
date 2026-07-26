import type { ActivityInput } from '@/types/models';

export type FieldErrors = Partial<Record<keyof ActivityInput, string>>;

/** Parse a string to a non-negative number, or null if invalid. */
function parseNonNegative(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') {
    return 0;
  }
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num < 0) {
    return null;
  }
  return num;
}

/** Validate log form strings and return parsed numbers + field errors. */
export function validateActivityForm(input: {
  totalSales: string;
  transactions: string;
  shoesSold: string;
  accessoriesSold: string;
}): { data: ActivityInput | null; errors: FieldErrors } {
  const errors: FieldErrors = {};

  const totalSales = parseNonNegative(input.totalSales);
  if (totalSales === null) {
    errors.totalSales = 'Enter a valid dollar amount (0 or more).';
  }

  const transactions = parseNonNegative(input.transactions);
  if (transactions === null) {
    errors.transactions = 'Enter a valid count (0 or more).';
  }

  const shoesSold = parseNonNegative(input.shoesSold);
  if (shoesSold === null) {
    errors.shoesSold = 'Enter a valid count (0 or more).';
  }

  const accessoriesSold = parseNonNegative(input.accessoriesSold);
  if (accessoriesSold === null) {
    errors.accessoriesSold = 'Enter a valid count (0 or more).';
  }

  if (Object.keys(errors).length > 0) {
    return { data: null, errors };
  }

  return {
    data: {
      totalSales: totalSales!,
      transactions: Math.floor(transactions!),
      shoesSold: Math.floor(shoesSold!),
      accessoriesSold: Math.floor(accessoriesSold!),
    },
    errors: {},
  };
}

/** Convert stored numbers back to strings for controlled inputs. */
export function activityToFormValues(activity: ActivityInput): {
  totalSales: string;
  transactions: string;
  shoesSold: string;
  accessoriesSold: string;
} {
  return {
    totalSales: activity.totalSales > 0 ? String(activity.totalSales) : '',
    transactions:
      activity.transactions > 0 ? String(activity.transactions) : '',
    shoesSold: activity.shoesSold > 0 ? String(activity.shoesSold) : '',
    accessoriesSold:
      activity.accessoriesSold > 0 ? String(activity.accessoriesSold) : '',
  };
}
