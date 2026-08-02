/**
 * Data dictionary — plain-language definitions for every metric in Pomegranate.
 * Single source of truth for the "How is this calculated?" reference screen.
 * Formulas here should stay in sync with lib/calculations.ts.
 */

export type MetricCategory = 'inputs' | 'sales' | 'earnings';

export type MetricDefinition = {
  id: string;
  name: string;
  category: MetricCategory;
  /** What the number means in plain language. */
  description: string;
  /** How Pomegranate calculates it (journal reference, not payroll). */
  formula: string;
  /** Optional note about edge cases or store-specific config. */
  note?: string;
};

export const METRIC_CATEGORY_LABELS: Record<MetricCategory, string> = {
  inputs: 'What you enter',
  sales: 'Sales metrics',
  earnings: 'Earnings guide',
};

/** Intro copy framing Pomegranate as a journal, not a paycheck system. */
export const DICTIONARY_INTRO = {
  title: 'Data dictionary',
  disclaimer:
    "L'Étape is a performance journal — not a payment processor. " +
    'Figures here help you track and understand your day. Your store\'s ' +
    'official payroll system is the source of truth for what you are paid.',
  subtitle:
    'Each entry shows what a metric means and how the app calculates it from ' +
    'the numbers you log.',
};

export const METRICS_DICTIONARY: MetricDefinition[] = [
  {
    id: 'total-sales',
    name: 'Total sales',
    category: 'inputs',
    description:
      'The dollar value of everything you sold during the day, from your receipts or end-of-day report.',
    formula: 'Entered manually on the Log screen.',
  },
  {
    id: 'transactions',
    name: 'Transactions',
    category: 'inputs',
    description: 'How many separate sales you completed.',
    formula: 'Entered manually on the Log screen.',
  },
  {
    id: 'shoes-sold',
    name: 'Shoes sold',
    category: 'inputs',
    description:
      'Count of footwear units sold. Used for attachment rate; your store may relabel this later.',
    formula: 'Entered manually on the Log screen.',
  },
  {
    id: 'accessories-sold',
    name: 'Accessories sold',
    category: 'inputs',
    description:
      'Count of accessory units sold (bags, socks, care kits, etc.).',
    formula: 'Entered manually on the Log screen.',
  },
  {
    id: 'hours-worked',
    name: 'Hours worked',
    category: 'inputs',
    description:
      'Time on the floor for the day. Decimals are OK (e.g. 7.5 for seven and a half hours).',
    formula: 'Entered manually on the Log screen.',
  },
  {
    id: 'daily-goal',
    name: 'Daily sales goal',
    category: 'inputs',
    description: 'Your target sales amount for the day, set in Settings.',
    formula: 'Configured in Settings.',
  },
  {
    id: 'commission-rate',
    name: 'Commission rate',
    category: 'inputs',
    description:
      'The percentage of sales used to estimate commission. Stores may use tiered rates later.',
    formula: 'Configured in Settings (single flat rate in V0.2).',
  },
  {
    id: 'role',
    name: 'Role (Associate / Team Lead)',
    category: 'inputs',
    description:
      'Determines base hourly pay: $2/hr for associates, $4/hr for team leads.',
    formula: 'Configured in Settings.',
  },
  {
    id: 'goal-progress',
    name: 'Daily goal progress',
    category: 'sales',
    description: 'How far you are toward your daily sales target.',
    formula: 'Total sales ÷ daily sales goal',
    note: 'Can exceed 100% when you beat your goal.',
  },
  {
    id: 'atv',
    name: 'Average transaction (ATV)',
    category: 'sales',
    description: 'Average dollars per transaction — a common retail KPI.',
    formula: 'Total sales ÷ number of transactions',
    note: 'Shows $0 when there are no transactions.',
  },
  {
    id: 'commission',
    name: 'Commission earned',
    category: 'sales',
    description:
      'Estimated commission based on total sales and your configured rate.',
    formula: 'Total sales × (commission rate ÷ 100)',
    note: 'Estimate only — actual commission may differ by store policy.',
  },
  {
    id: 'attachment-rate',
    name: 'Attachment rate',
    category: 'sales',
    description:
      'How many accessories you sell relative to footwear — a common add-on KPI.',
    formula: 'Accessories sold ÷ shoes sold',
    note: 'Shows 0 when no shoes were sold. Formula may be customized per store.',
  },
  {
    id: 'base-rate',
    name: 'Base rate',
    category: 'earnings',
    description: 'Guaranteed hourly base pay from your role.',
    formula: '$2/hr (Associate) or $4/hr (Team Lead)',
  },
  {
    id: 'base-pay',
    name: 'Base pay',
    category: 'earnings',
    description: 'Base wages for the day before commission.',
    formula: 'Base rate × hours worked',
  },
  {
    id: 'total-earnings',
    name: 'Total earnings',
    category: 'earnings',
    description:
      'Combined estimate of base pay plus commission for the day.',
    formula: 'Base pay + commission earned',
    note: 'Journal total — not an official paycheck amount.',
  },
  {
    id: 'effective-rate',
    name: 'Effective hourly rate',
    category: 'earnings',
    description:
      'Your blended hourly rate when commission is spread across hours worked.',
    formula: 'Total earnings ÷ hours worked',
    note: 'Same as: base rate + (commission ÷ hours). Shows — when hours are 0.',
  },
];

/** Metrics grouped by category for the dictionary screen. */
export function getMetricsByCategory(): Record<
  MetricCategory,
  MetricDefinition[]
> {
  return METRICS_DICTIONARY.reduce(
    (acc, metric) => {
      acc[metric.category].push(metric);
      return acc;
    },
    {
      inputs: [] as MetricDefinition[],
      sales: [] as MetricDefinition[],
      earnings: [] as MetricDefinition[],
    },
  );
}
