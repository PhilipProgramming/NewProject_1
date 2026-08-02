import type { ActivityInput, CalculatedMetrics } from '@/types/models';

/**
 * Generates one editorial observation for the daily briefing.
 * Keeps the dashboard calm — a single insight, not a wall of metrics.
 */
export function generateDailyObservation(
  activity: ActivityInput,
  metrics: CalculatedMetrics,
  hasData: boolean,
): string {
  if (!hasData) {
    return 'No performance recorded yet. Add today\'s figures to open your briefing.';
  }

  const pace = metrics.goalProgress;

  if (pace >= 1) {
    return 'You are ahead of today\'s pace. Momentum is strong relative to goal.';
  }

  if (pace >= 0.8) {
    return 'Performance is tracking close to today\'s goal. Steady progress.';
  }

  if (activity.shoesSold > 0 && metrics.far < 0.5) {
    return 'Sales are building. Attachment rate suggests room to deepen each transaction.';
  }

  if (pace > 0) {
    return 'Sales are accumulating. Goal pace indicates continued progress is needed.';
  }

  return 'Figures recorded. Review progress as the day continues.';
}
