import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_SETTINGS } from '@/constants/defaults';
import { STORAGE_KEYS } from '@/storage/keys';
import type { DayActivity, Settings } from '@/types/models';

/**
 * Storage layer — the only module that talks to AsyncStorage.
 * Screens and context call these functions; when a backend arrives,
 * swap this file for an API client without rewriting UI code.
 */

/** Backfill hoursWorked on days saved before V0.2. */
function normalizeDay(raw: DayActivity): DayActivity {
  return {
    ...raw,
    hoursWorked: raw.hoursWorked ?? 0,
  };
}

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export async function loadDays(): Promise<Record<string, DayActivity>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.days);
    if (!raw) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(JSON.parse(raw) as Record<string, DayActivity>).map(
        ([key, day]) => [key, normalizeDay(day)],
      ),
    );
  } catch {
    return {};
  }
}

export async function saveDays(
  days: Record<string, DayActivity>,
): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.days, JSON.stringify(days));
}

/** Convenience: load both slices in parallel on app start. */
export async function loadAppData(): Promise<{
  settings: Settings;
  days: Record<string, DayActivity>;
}> {
  const [settings, days] = await Promise.all([loadSettings(), loadDays()]);
  return { settings, days };
}
