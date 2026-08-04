import { WALK_REASONS } from '@/constants/floorDefaults';
import { VALIDATION_LIMITS } from '@/constants/validationLimits';
import { createFloorId } from '@/lib/floorIds';
import { isWalkReason, sanitizeRosterNames } from '@/lib/validation';
import type {
  ActiveInteraction,
  CompletedInteraction,
  FloorAssociate,
  FloorSession,
  InteractionOutcome,
} from '@/types/floor';

export function createAssociatesFromNames(names: string[]): FloorAssociate[] {
  return sanitizeRosterNames(names).map((name) => ({
    id: createFloorId(),
    name,
  }));
}

export function createEmptyFloorSession(date: string): FloorSession {
  return {
    date,
    roster: [],
    rotation: [],
    active: [],
    completed: [],
    updatedAt: new Date().toISOString(),
  };
}

export function initSessionWithRoster(
  date: string,
  names: string[],
): FloorSession {
  const roster = createAssociatesFromNames(names);
  return {
    date,
    roster,
    rotation: roster.map((a) => a.id),
    active: [],
    completed: [],
    updatedAt: new Date().toISOString(),
  };
}

/** Assign the current "up" associate to a customer. */
export function assignCustomer(
  session: FloorSession,
  customerCount: number,
): FloorSession {
  const [upId, ...rest] = session.rotation;
  if (
    !upId ||
    !Number.isInteger(customerCount) ||
    customerCount < VALIDATION_LIMITS.customerCountMin ||
    customerCount > VALIDATION_LIMITS.customerCountMax
  ) {
    return session;
  }

  const interaction: ActiveInteraction = {
    id: createFloorId(),
    associateId: upId,
    assignedAt: new Date().toISOString(),
    customerCount,
  };

  return {
    ...session,
    rotation: rest,
    active: [...session.active, interaction],
    updatedAt: new Date().toISOString(),
  };
}

/** Complete an active interaction and return associate to bottom of rotation. */
export function completeInteraction(
  session: FloorSession,
  interactionId: string,
  outcome: InteractionOutcome,
  walkReason?: string,
): FloorSession {
  const interaction = session.active.find((item) => item.id === interactionId);
  if (!interaction) {
    return session;
  }

  const safeWalkReason =
    outcome === 'walk' && walkReason && isWalkReason(walkReason)
      ? walkReason
      : WALK_REASONS[0];

  const completed: CompletedInteraction = {
    ...interaction,
    outcome,
    completedAt: new Date().toISOString(),
    walkReason: outcome === 'walk' ? safeWalkReason : undefined,
  };

  return {
    ...session,
    active: session.active.filter((item) => item.id !== interactionId),
    completed: [...session.completed, completed],
    rotation: [...session.rotation, interaction.associateId],
    updatedAt: new Date().toISOString(),
  };
}

export function getAssociateName(
  session: FloorSession,
  associateId: string,
): string {
  return session.roster.find((a) => a.id === associateId)?.name ?? 'Unknown';
}

export function getUpAssociateId(session: FloorSession): string | undefined {
  return session.rotation[0];
}
