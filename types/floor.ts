/** Outcome when a customer interaction ends. */
export type InteractionOutcome = 'sale' | 'walk';

export type FloorAssociate = {
  id: string;
  name: string;
};

export type ActiveInteraction = {
  id: string;
  associateId: string;
  assignedAt: string;
};

export type CompletedInteraction = ActiveInteraction & {
  outcome: InteractionOutcome;
  completedAt: string;
  walkReason?: string;
};

/** One calendar day's live Up Sheet state. */
export type FloorSession = {
  date: string;
  roster: FloorAssociate[];
  /** Associate IDs available in rotation order — first is "up". */
  rotation: string[];
  active: ActiveInteraction[];
  completed: CompletedInteraction[];
  updatedAt: string;
};
