import { BASE_HOURLY_RATES } from '@/constants/defaults';
import type {
  ActivityInput,
  AssociateRole,
  CalculatedMetrics,
  Settings,
} from '@/types/models';

/**
 * Pure KPI calculations — no React, no storage.
 * Keeping formulas here makes them easy to test and swap when a backend arrives.
 */

/** Base hourly rate from role. */
export function getBaseHourlyRate(role: AssociateRole): number {
  return BASE_HOURLY_RATES[role];
}

/** Progress toward daily goal (0+). Returns 0 if goal is unset. */
export function calculateGoalProgress(
  totalSales: number,
  dailySalesGoal: number,
): number {
  if (dailySalesGoal <= 0) {
    return 0;
  }
  return totalSales / dailySalesGoal;
}

/** Average transaction value. Returns 0 when there are no transactions. */
export function calculateAverageTransactionValue(
  totalSales: number,
  transactions: number,
): number {
  if (transactions <= 0) {
    return 0;
  }
  return totalSales / transactions;
}

/** Commission earned from total sales and rate percentage. */
export function calculateCommissionEarned(
  totalSales: number,
  commissionRate: number,
): number {
  return totalSales * (commissionRate / 100);
}

/**
 * Attachment rate = accessories sold / shoes sold (formula configurable per store later).
 * V0.1 formula is defined here so it can evolve without UI changes.
 */
export function calculateFar(
  accessoriesSold: number,
  shoesSold: number,
): number {
  if (shoesSold <= 0) {
    return 0;
  }
  return accessoriesSold / shoesSold;
}

/** Base pay for the day: role rate × hours worked. */
export function calculateBasePay(
  hoursWorked: number,
  role: AssociateRole,
): number {
  return getBaseHourlyRate(role) * hoursWorked;
}

/** Total daily earnings: base pay + commission. */
export function calculateTotalEarnings(
  basePay: number,
  commissionEarned: number,
): number {
  return basePay + commissionEarned;
}

/**
 * Effective hourly rate = base rate + (commission ÷ hours).
 * Returns 0 when hours worked is 0 (avoid divide-by-zero).
 */
export function calculateEffectiveHourlyRate(
  totalEarnings: number,
  hoursWorked: number,
): number {
  if (hoursWorked <= 0) {
    return 0;
  }
  return totalEarnings / hoursWorked;
}

/** Combine all KPIs for a given activity + settings snapshot. */
export function calculateMetrics(
  activity: ActivityInput,
  settings: Settings,
): CalculatedMetrics {
  const baseHourlyRate = getBaseHourlyRate(settings.role);
  const commissionEarned = calculateCommissionEarned(
    activity.totalSales,
    settings.commissionRate,
  );
  const basePay = calculateBasePay(activity.hoursWorked, settings.role);
  const totalEarnings = calculateTotalEarnings(basePay, commissionEarned);

  return {
    goalProgress: calculateGoalProgress(
      activity.totalSales,
      settings.dailySalesGoal,
    ),
    averageTransactionValue: calculateAverageTransactionValue(
      activity.totalSales,
      activity.transactions,
    ),
    commissionEarned,
    far: calculateFar(activity.accessoriesSold, activity.shoesSold),
    baseHourlyRate,
    basePay,
    totalEarnings,
    effectiveHourlyRate: calculateEffectiveHourlyRate(
      totalEarnings,
      activity.hoursWorked,
    ),
  };
}

/** True when the associate has entered any non-zero data. */
export function hasActivityData(activity: ActivityInput): boolean {
  return (
    activity.totalSales > 0 ||
    activity.transactions > 0 ||
    activity.shoesSold > 0 ||
    activity.accessoriesSold > 0 ||
    activity.hoursWorked > 0
  );
}
