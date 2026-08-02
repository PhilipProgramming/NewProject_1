import type { ActivityInput, AssociateRole, Settings } from '@/types/models';

/** Base hourly wages by role (V0.2). */
export const BASE_HOURLY_RATES: Record<AssociateRole, number> = {
  associate: 2,
  team_lead: 4,
};

/** Default settings shown on first launch. */
export const DEFAULT_SETTINGS: Settings = {
  associateName: '',
  dailySalesGoal: 1000,
  commissionRate: 5,
  role: 'associate',
};

/** Zeroed activity used before the associate logs anything. */
export const EMPTY_ACTIVITY: ActivityInput = {
  totalSales: 0,
  transactions: 0,
  shoesSold: 0,
  accessoriesSold: 0,
  hoursWorked: 0,
};

/** Human-readable labels for role picker. */
export const ROLE_LABELS: Record<AssociateRole, string> = {
  associate: 'Associate ($2/hr)',
  team_lead: 'Team Lead ($4/hr)',
};

/** L'Étape brand hierarchy — consulting practice, not SaaS product. */
export const BRAND = {
  parent: 'Maison de Données',
  appName: "L'Étape",
  descriptor: 'Performance Intelligence',
  tagline: "for data that's out of reach",
  /** @deprecated Use `parent` — kept until Settings is redesigned. */
  company: 'Maison de Données',
} as const;
