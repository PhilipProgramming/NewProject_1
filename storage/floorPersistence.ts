import AsyncStorage from '@react-native-async-storage/async-storage';

import { sanitizeFloorSession } from '@/lib/validation';
import { createEmptyFloorSession } from '@/lib/floorRotation';
import { STORAGE_KEYS } from '@/storage/keys';
import type { FloorSession } from '@/types/floor';

export async function loadFloorSessions(): Promise<
  Record<string, FloorSession>
> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.floorSessions);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as Record<string, Partial<FloorSession>>;
    return Object.fromEntries(
      Object.entries(parsed).map(([date, session]) => [
        date,
        sanitizeFloorSession({ ...session, date }),
      ]),
    );
  } catch {
    return {};
  }
}

export async function loadFloorSession(date: string): Promise<FloorSession> {
  const sessions = await loadFloorSessions();
  return sessions[date] ?? createEmptyFloorSession(date);
}

export async function saveFloorSession(session: FloorSession): Promise<void> {
  const sanitized = sanitizeFloorSession(session);
  const sessions = await loadFloorSessions();
  sessions[sanitized.date] = sanitized;
  await AsyncStorage.setItem(
    STORAGE_KEYS.floorSessions,
    JSON.stringify(sessions),
  );
}
