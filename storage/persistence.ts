import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_SETTINGS } from '@/constants/defaults';
import { VALIDATION_LIMITS } from '@/constants/validationLimits';
import {
  isValidDateKey,
  sanitizeDayActivity,
  sanitizeSettings,
} from '@/lib/validation';
import { sortDateKeysDesc } from '@/lib/dates';
import { STORAGE_KEYS } from '@/storage/keys';
import type { DayActivity, Settings } from '@/types/models';

/**
 * Storage layer — the only module that talks to AsyncStorage.
 * Screens and context call these functions; when a backend arrives,
 * swap this file for an API client without rewriting UI code.
 */

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return sanitizeSettings(parsed);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEYS.settings,
    JSON.stringify(sanitizeSettings(settings)),
  );
}

export async function loadDays(): Promise<Record<string, DayActivity>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.days);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as Record<string, Partial<DayActivity>>;
    const sanitizedEntries = Object.entries(parsed)
      .filter(([key]) => isValidDateKey(key))
      .map(([key, day]) => [key, sanitizeDayActivity({ ...day, date: key })] as const);

    const sortedKeys = sortDateKeysDesc(
      sanitizedEntries.map(([key]) => key),
    ).slice(0, VALIDATION_LIMITS.dayHistoryMax);

    const allowed = new Set(sortedKeys);
    return Object.fromEntries(
      sanitizedEntries.filter(([key]) => allowed.has(key)),
    );
  } catch {
    return {};
  }
}

export async function saveDays(
  days: Record<string, DayActivity>,
): Promise<void> {
  const sanitizedEntries = Object.entries(days)
    .filter(([key]) => isValidDateKey(key))
    .map(([key, day]) => [key, sanitizeDayActivity({ ...day, date: key })] as const);

  const sortedKeys = sortDateKeysDesc(
    sanitizedEntries.map(([key]) => key),
  ).slice(0, VALIDATION_LIMITS.dayHistoryMax);

  const allowed = new Set(sortedKeys);
  const sanitized = Object.fromEntries(
    sanitizedEntries.filter(([key]) => allowed.has(key)),
  );

  await AsyncStorage.setItem(STORAGE_KEYS.days, JSON.stringify(sanitized));
}

/** Convenience: load both slices in parallel on app start. */
export async function loadAppData(): Promise<{
  settings: Settings;
  days: Record<string, DayActivity>;
}> {
  const [settings, days] = await Promise.all([loadSettings(), loadDays()]);
  return { settings, days };
}
