import { EMPTY_ACTIVITY } from '@/constants/defaults';
import { useAppState } from '@/context/AppContext';
import { calculateMetrics, hasActivityData } from '@/lib/calculations';
import { getTodayKey } from '@/lib/dates';
import type { ActivityInput, CalculatedMetrics } from '@/types/models';

type TodayMetrics = {
  dateKey: string;
  activity: ActivityInput;
  metrics: CalculatedMetrics;
  hasData: boolean;
};

/**
 * Derived KPI hook — reads today's raw inputs and settings,
 * then runs pure calculation functions. No stored KPIs needed.
 */
export function useTodayMetrics(): TodayMetrics {
  const { settings, days } = useAppState();
  const dateKey = getTodayKey();
  const stored = days[dateKey];

  const activity: ActivityInput = stored
    ? {
        totalSales: stored.totalSales,
        transactions: stored.transactions,
        shoesSold: stored.shoesSold,
        accessoriesSold: stored.accessoriesSold,
        hoursWorked: stored.hoursWorked ?? 0,
      }
    : EMPTY_ACTIVITY;

  const metrics = calculateMetrics(activity, settings);

  return {
    dateKey,
    activity,
    metrics,
    hasData: hasActivityData(activity),
  };
}
