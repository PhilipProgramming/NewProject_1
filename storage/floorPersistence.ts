import AsyncStorage from '@react-native-async-storage/async-storage';

import { createEmptyFloorSession } from '@/lib/floorRotation';
import { STORAGE_KEYS } from '@/storage/keys';
import type { ActiveInteraction, CompletedInteraction, FloorSession } from '@/types/floor';

function normalizeInteraction<T extends ActiveInteraction>(
  interaction: T & { customerCount?: number },
): T {
  return {
    ...interaction,
    customerCount:
      typeof interaction.customerCount === 'number' &&
      interaction.customerCount >= 1
        ? interaction.customerCount
        : 1,
  };
}

function normalizeFloorSession(session: FloorSession): FloorSession {
  return {
    ...session,
    active: session.active.map((item) => normalizeInteraction(item)),
    completed: session.completed.map((item) =>
      normalizeInteraction(item as CompletedInteraction),
    ),
  };
}

export async function loadFloorSessions(): Promise<
  Record<string, FloorSession>
> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.floorSessions);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as Record<string, FloorSession>;
    return Object.fromEntries(
      Object.entries(parsed).map(([date, session]) => [
        date,
        normalizeFloorSession(session),
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
  const sessions = await loadFloorSessions();
  sessions[session.date] = session;
  await AsyncStorage.setItem(
    STORAGE_KEYS.floorSessions,
    JSON.stringify(sessions),
  );
}
