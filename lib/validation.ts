import { WALK_REASONS } from '@/constants/floorDefaults';
import { DEFAULT_SETTINGS } from '@/constants/defaults';
import { VALIDATION_LIMITS } from '@/constants/validationLimits';
import type {
  ActiveInteraction,
  CompletedInteraction,
  FloorAssociate,
  FloorSession,
  InteractionOutcome,
} from '@/types/floor';
import type { ActivityInput, AssociateRole, DayActivity, Settings } from '@/types/models';

export type FieldErrors = Partial<Record<keyof ActivityInput, string>>;

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const VALID_ROLES: AssociateRole[] = ['associate', 'team_lead'];
const VALID_OUTCOMES: InteractionOutcome[] = ['sale', 'walk'];

/** Strip control characters and cap length for person names. */
export function sanitizePersonName(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .slice(0, VALIDATION_LIMITS.personNameMaxLength);
}

/** Keep digits only — for integer fields as the user types. */
export function sanitizeIntegerInput(value: string, maxDigits = 6): string {
  return value.replace(/\D/g, '').slice(0, maxDigits);
}

/** Keep digits and at most one decimal point while typing. */
export function sanitizeDecimalInput(value: string, maxLength = 12): string {
  let cleaned = value.replace(/[^\d.]/g, '');
  const firstDot = cleaned.indexOf('.');
  if (firstDot !== -1) {
    const before = cleaned.slice(0, firstDot + 1);
    const after = cleaned.slice(firstDot + 1).replace(/\./g, '');
    cleaned = before + after;
  }

  if (firstDot !== -1) {
    const [whole, fraction = ''] = cleaned.split('.');
    cleaned = `${whole}.${fraction.slice(0, VALIDATION_LIMITS.decimalPlaces)}`;
  }

  return cleaned.slice(0, maxLength);
}

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

function parseNonNegative(value: string, max: number): number | null {
  const trimmed = value.trim();
  if (trimmed === '') {
    return 0;
  }
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num < 0 || num > max) {
    return null;
  }
  return num;
}

function parsePositive(value: string, max: number): number | null {
  const trimmed = value.trim();
  if (trimmed === '') {
    return null;
  }
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num <= 0 || num > max) {
    return null;
  }
  return num;
}

export function isValidDateKey(value: string): boolean {
  return DATE_KEY_PATTERN.test(value);
}

export function validateCustomerCount(value: string): {
  data: number | null;
  error?: string;
} {
  const trimmed = value.trim();
  if (trimmed === '') {
    return { data: null, error: 'Enter at least 1 customer.' };
  }

  const count = Number(trimmed);
  if (
    !Number.isInteger(count) ||
    count < VALIDATION_LIMITS.customerCountMin ||
    count > VALIDATION_LIMITS.customerCountMax
  ) {
    return {
      data: null,
      error: `Enter a whole number from ${VALIDATION_LIMITS.customerCountMin} to ${VALIDATION_LIMITS.customerCountMax}.`,
    };
  }

  return { data: count };
}

export type SettingsFieldErrors = Partial<
  Record<'associateName' | 'dailySalesGoal' | 'commissionRate', string>
>;

export function validateSettingsForm(input: {
  associateName: string;
  dailySalesGoal: string;
  commissionRate: string;
  role: AssociateRole;
}): { data: Settings | null; errors: SettingsFieldErrors } {
  const errors: SettingsFieldErrors = {};

  const associateName = sanitizePersonName(input.associateName.trim());
  const dailySalesGoal = parsePositive(
    input.dailySalesGoal,
    VALIDATION_LIMITS.dailyGoalMax,
  );
  if (dailySalesGoal === null) {
    errors.dailySalesGoal = 'Enter a goal greater than 0.';
  }

  const commissionRate = parseNonNegative(
    input.commissionRate,
    VALIDATION_LIMITS.commissionRateMax,
  );
  if (commissionRate === null) {
    errors.commissionRate = 'Enter a rate between 0 and 100.';
  }

  const role = VALID_ROLES.includes(input.role) ? input.role : 'associate';

  if (Object.keys(errors).length > 0) {
    return { data: null, errors };
  }

  return {
    data: {
      associateName,
      dailySalesGoal: dailySalesGoal!,
      commissionRate: commissionRate!,
      role,
    },
    errors: {},
  };
}

/** Validate log form strings and return parsed numbers + field errors. */
export function validateActivityForm(input: {
  totalSales: string;
  transactions: string;
  shoesSold: string;
  accessoriesSold: string;
  hoursWorked: string;
}): { data: ActivityInput | null; errors: FieldErrors } {
  const errors: FieldErrors = {};

  const totalSales = parseNonNegative(
    input.totalSales,
    VALIDATION_LIMITS.salesMax,
  );
  if (totalSales === null) {
    errors.totalSales = 'Enter a valid dollar amount (0 or more).';
  }

  const transactions = parseNonNegative(
    input.transactions,
    VALIDATION_LIMITS.countMax,
  );
  if (transactions === null) {
    errors.transactions = 'Enter a valid count (0 or more).';
  }

  const shoesSold = parseNonNegative(input.shoesSold, VALIDATION_LIMITS.countMax);
  if (shoesSold === null) {
    errors.shoesSold = 'Enter a valid count (0 or more).';
  }

  const accessoriesSold = parseNonNegative(
    input.accessoriesSold,
    VALIDATION_LIMITS.countMax,
  );
  if (accessoriesSold === null) {
    errors.accessoriesSold = 'Enter a valid count (0 or more).';
  }

  const hoursWorked = parseNonNegative(
    input.hoursWorked,
    VALIDATION_LIMITS.hoursMax,
  );
  if (hoursWorked === null) {
    errors.hoursWorked = `Enter valid hours (0–${VALIDATION_LIMITS.hoursMax}).`;
  }

  if (Object.keys(errors).length > 0) {
    return { data: null, errors };
  }

  return {
    data: {
      totalSales: totalSales!,
      transactions: Math.floor(transactions!),
      shoesSold: Math.floor(shoesSold!),
      accessoriesSold: Math.floor(accessoriesSold!),
      hoursWorked: hoursWorked!,
    },
    errors: {},
  };
}

/** Convert stored numbers back to strings for controlled inputs. */
export function activityToFormValues(activity: ActivityInput): {
  totalSales: string;
  transactions: string;
  shoesSold: string;
  accessoriesSold: string;
  hoursWorked: string;
} {
  return {
    totalSales: activity.totalSales > 0 ? String(activity.totalSales) : '',
    transactions:
      activity.transactions > 0 ? String(activity.transactions) : '',
    shoesSold: activity.shoesSold > 0 ? String(activity.shoesSold) : '',
    accessoriesSold:
      activity.accessoriesSold > 0 ? String(activity.accessoriesSold) : '',
    hoursWorked:
      activity.hoursWorked > 0 ? String(activity.hoursWorked) : '',
  };
}

export function sanitizeSettings(raw: Partial<Settings> | null | undefined): Settings {
  const role = VALID_ROLES.includes(raw?.role as AssociateRole)
    ? (raw!.role as AssociateRole)
    : DEFAULT_SETTINGS.role;

  const goal = Number(raw?.dailySalesGoal);
  const rate = Number(raw?.commissionRate);

  return {
    associateName: sanitizePersonName(
      String(raw?.associateName ?? DEFAULT_SETTINGS.associateName),
    ),
    dailySalesGoal: Number.isFinite(goal)
      ? clampNumber(goal, 1, VALIDATION_LIMITS.dailyGoalMax)
      : DEFAULT_SETTINGS.dailySalesGoal,
    commissionRate: Number.isFinite(rate)
      ? clampNumber(rate, 0, VALIDATION_LIMITS.commissionRateMax)
      : DEFAULT_SETTINGS.commissionRate,
    role,
  };
}

export function sanitizeDayActivity(raw: Partial<DayActivity>): DayActivity {
  const date =
    typeof raw.date === 'string' && isValidDateKey(raw.date)
      ? raw.date
      : getFallbackDateKey(raw.date);

  return {
    date,
    totalSales: clampNumber(
      Number(raw.totalSales),
      0,
      VALIDATION_LIMITS.salesMax,
    ),
    transactions: Math.floor(
      clampNumber(Number(raw.transactions), 0, VALIDATION_LIMITS.countMax),
    ),
    shoesSold: Math.floor(
      clampNumber(Number(raw.shoesSold), 0, VALIDATION_LIMITS.countMax),
    ),
    accessoriesSold: Math.floor(
      clampNumber(Number(raw.accessoriesSold), 0, VALIDATION_LIMITS.countMax),
    ),
    hoursWorked: clampNumber(
      Number(raw.hoursWorked ?? 0),
      0,
      VALIDATION_LIMITS.hoursMax,
    ),
    updatedAt:
      typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
  };
}

function getFallbackDateKey(value: unknown): string {
  if (typeof value === 'string' && isValidDateKey(value)) {
    return value;
  }
  return new Date().toISOString().slice(0, 10);
}

function sanitizeAssociate(raw: Partial<FloorAssociate>): FloorAssociate | null {
  const id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : null;
  const name = sanitizePersonName(String(raw.name ?? '').trim());
  if (!id || !name) {
    return null;
  }
  return { id, name };
}

function sanitizeInteraction(
  raw: Partial<ActiveInteraction>,
): ActiveInteraction | null {
  const id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : null;
  const associateId =
    typeof raw.associateId === 'string' && raw.associateId.trim()
      ? raw.associateId.trim()
      : null;
  const assignedAt =
    typeof raw.assignedAt === 'string' ? raw.assignedAt : new Date().toISOString();

  if (!id || !associateId) {
    return null;
  }

  return {
    id,
    associateId,
    assignedAt,
    customerCount: Math.floor(
      clampNumber(
        Number(raw.customerCount),
        VALIDATION_LIMITS.customerCountMin,
        VALIDATION_LIMITS.customerCountMax,
      ),
    ),
  };
}

function sanitizeCompletedInteraction(
  raw: Partial<CompletedInteraction>,
): CompletedInteraction | null {
  const base = sanitizeInteraction(raw);
  if (!base) {
    return null;
  }

  const outcome = VALID_OUTCOMES.includes(raw.outcome as InteractionOutcome)
    ? (raw.outcome as InteractionOutcome)
    : 'walk';
  const completedAt =
    typeof raw.completedAt === 'string'
      ? raw.completedAt
      : new Date().toISOString();

  let walkReason: string | undefined;
  if (outcome === 'walk') {
    walkReason = WALK_REASONS.includes(raw.walkReason as (typeof WALK_REASONS)[number])
      ? raw.walkReason
      : WALK_REASONS[0];
  }

  return {
    ...base,
    outcome,
    completedAt,
    walkReason,
  };
}

export function sanitizeFloorSession(raw: Partial<FloorSession>): FloorSession {
  const date =
    typeof raw.date === 'string' && isValidDateKey(raw.date)
      ? raw.date
      : new Date().toISOString().slice(0, 10);

  const roster = Array.isArray(raw.roster)
    ? raw.roster
        .map((item) => sanitizeAssociate(item))
        .filter((item): item is FloorAssociate => item !== null)
        .slice(0, VALIDATION_LIMITS.rosterMaxSize)
    : [];

  const rosterIds = new Set(roster.map((item) => item.id));

  const active = Array.isArray(raw.active)
    ? raw.active
        .map((item) => sanitizeInteraction(item))
        .filter(
          (item): item is ActiveInteraction =>
            item !== null && rosterIds.has(item.associateId),
        )
    : [];

  const activeIds = new Set(active.map((item) => item.associateId));

  const completed = Array.isArray(raw.completed)
    ? raw.completed
        .map((item) => sanitizeCompletedInteraction(item))
        .filter(
          (item): item is CompletedInteraction =>
            item !== null && rosterIds.has(item.associateId),
        )
        .slice(-VALIDATION_LIMITS.floorCompletedMax)
    : [];

  const validRotation = Array.isArray(raw.rotation)
    ? raw.rotation.filter(
        (id): id is string =>
          typeof id === 'string' &&
          rosterIds.has(id) &&
          !activeIds.has(id),
      )
    : [];

  const assignedIds = new Set([
    ...active.map((item) => item.associateId),
    ...completed.map((item) => item.associateId),
  ]);
  const missingFromRotation = roster
    .map((item) => item.id)
    .filter((id) => !assignedIds.has(id) && !validRotation.includes(id));

  return {
    date,
    roster,
    rotation: [...validRotation, ...missingFromRotation].slice(
      0,
      roster.length,
    ),
    active,
    completed,
    updatedAt:
      typeof raw.updatedAt === 'string'
        ? raw.updatedAt
        : new Date().toISOString(),
  };
}

export function sanitizeRosterNames(names: string[]): string[] {
  return names
    .map((name) => sanitizePersonName(name.trim()))
    .filter(Boolean)
    .slice(0, VALIDATION_LIMITS.rosterMaxSize);
}

export function isWalkReason(value: string): value is (typeof WALK_REASONS)[number] {
  return WALK_REASONS.includes(value as (typeof WALK_REASONS)[number]);
}
