import AsyncStorage from '@react-native-async-storage/async-storage';

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
    return JSON.parse(raw) as Record<string, FloorSession>;
  } catch {
    return {};
  }
}

export async function loadFloorSession(date: string): Promise<FloorSession> {
  const sessions = await loadFloorSessions();
  return sessions[date] ?? createEmptyFloorSession(date);
}

export async function saveFloorSession(session: FloorSession): Promise<void> {
  const sessions = await loadFloorSessions();
  sessions[session.date] = session;
  await AsyncStorage.setItem(
    STORAGE_KEYS.floorSessions,
    JSON.stringify(sessions),
  );
}
