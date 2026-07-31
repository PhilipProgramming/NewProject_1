/**
 * Shared data shapes for Pomegranate.
 * These types are the contract between UI, storage, and (future) backend.
 */

/** One calendar day's manually entered performance data. */
export type DayActivity = {
  /** Local calendar key, e.g. "2026-07-26". */
  date: string;
  /** Total sales in dollars. */
  totalSales: number;
  transactions: number;
  shoesSold: number;
  accessoriesSold: number;
  /** Hours worked this day (decimals ok, e.g. 7.5). */
  hoursWorked: number;
  /** ISO timestamp of the last save. Useful for future sync. */
  updatedAt: string;
};

/** Associate role determines the base hourly wage. */
export type AssociateRole = 'associate' | 'team_lead';

/** User-configurable app settings. */
export type Settings = {
  associateName: string;
  /** Daily sales target in dollars. */
  dailySalesGoal: number;
  /** Commission percentage, e.g. 5 means 5%. */
  commissionRate: number;
  /** Associate ($2/hr) or team lead ($4/hr). */
  role: AssociateRole;
};

/** KPI values derived from activity + settings (never stored directly). */
export type CalculatedMetrics = {
  /** Ratio toward goal; can exceed 1 when goal is beaten. */
  goalProgress: number;
  averageTransactionValue: number;
  commissionEarned: number;
  /** Footwear Attach Rate: accessories / shoes. */
  far: number;
  /** Base hourly rate from role ($2 or $4). */
  baseHourlyRate: number;
  /** Base pay for the day: base rate × hours worked. */
  basePay: number;
  /** Base pay + commission earned. */
  totalEarnings: number;
  /** Blended rate: total earnings ÷ hours (0 when no hours logged). */
  effectiveHourlyRate: number;
};

/** Full persisted app payload shape. */
export type AppData = {
  settings: Settings;
  days: Record<string, DayActivity>;
};

/** Empty activity used when no data exists for a day. */
export type ActivityInput = Pick<
  DayActivity,
  | 'totalSales'
  | 'transactions'
  | 'shoesSold'
  | 'accessoriesSold'
  | 'hoursWorked'
>;
