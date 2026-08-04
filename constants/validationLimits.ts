/** Shared input and storage bounds for the local app. */
export const VALIDATION_LIMITS = {
  personNameMaxLength: 80,
  rosterMaxSize: 50,
  customerCountMin: 1,
  customerCountMax: 99,
  salesMax: 9_999_999.99,
  countMax: 9_999,
  hoursMax: 24,
  dailyGoalMax: 9_999_999,
  commissionRateMax: 100,
  /** Keep roughly one year of day records on device. */
  dayHistoryMax: 400,
  floorCompletedMax: 500,
  decimalPlaces: 2,
} as const;
