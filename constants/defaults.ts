import type { ActivityInput, Settings } from '@/types/models';

/** Default settings shown on first launch. */
export const DEFAULT_SETTINGS: Settings = {
  associateName: '',
  dailySalesGoal: 1000,
  commissionRate: 5,
};

/** Zeroed activity used before the associate logs anything. */
export const EMPTY_ACTIVITY: ActivityInput = {
  totalSales: 0,
  transactions: 0,
  shoesSold: 0,
  accessoriesSold: 0,
};

/** Brand copy for About sections. */
export const BRAND = {
  appName: 'Pomegranate',
  company: 'Tantalus Incorporated',
  tagline: 'Track today. Grow tomorrow.',
} as const;
