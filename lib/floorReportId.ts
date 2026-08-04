import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/storage/keys';

type ReportSequenceStore = Record<string, number>;

/** Issue the next sequential Floor Summary report ID for a calendar day. */
export async function nextFloorReportId(dateKey: string): Promise<string> {
  const ymd = dateKey.replace(/-/g, '');

  let sequence = 1;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.floorReportSequence);
    const store = raw ? (JSON.parse(raw) as ReportSequenceStore) : {};
    sequence = (store[dateKey] ?? 0) + 1;
    store[dateKey] = sequence;
    await AsyncStorage.setItem(
      STORAGE_KEYS.floorReportSequence,
      JSON.stringify(store),
    );
  } catch {
    sequence = 1;
  }

  return `MDD-LFS-${ymd}-${String(sequence).padStart(4, '0')}`;
}
