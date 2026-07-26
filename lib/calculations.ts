import type { ActivityInput, CalculatedMetrics, Settings } from '@/types/models';

/**
 * Pure KPI calculations — no React, no storage.
 * Keeping formulas here makes them easy to test and swap when a backend arrives.
 */

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
 * FAR (Footwear Attach Rate) = accessories sold / shoes sold.
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

/** Combine all KPIs for a given activity + settings snapshot. */
export function calculateMetrics(
  activity: ActivityInput,
  settings: Settings,
): CalculatedMetrics {
  return {
    goalProgress: calculateGoalProgress(
      activity.totalSales,
      settings.dailySalesGoal,
    ),
    averageTransactionValue: calculateAverageTransactionValue(
      activity.totalSales,
      activity.transactions,
    ),
    commissionEarned: calculateCommissionEarned(
      activity.totalSales,
      settings.commissionRate,
    ),
    far: calculateFar(activity.accessoriesSold, activity.shoesSold),
  };
}

/** True when the associate has entered any non-zero data. */
export function hasActivityData(activity: ActivityInput): boolean {
  return (
    activity.totalSales > 0 ||
    activity.transactions > 0 ||
    activity.shoesSold > 0 ||
    activity.accessoriesSold > 0
  );
}
