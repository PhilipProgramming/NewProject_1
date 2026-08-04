/** AsyncStorage key constants — single source of truth for persistence. */

export const STORAGE_KEYS = {
  settings: '@pomegranate/settings',
  days: '@pomegranate/days',
  floorSessions: '@letape/floor/sessions',
  floorReportSequence: '@letape/floor/report-sequence',
} as const;
