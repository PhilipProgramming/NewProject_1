/** Common walk reasons — store-specific list can replace later. */
export const WALK_REASONS = [
  'No purchase today',
  'Price concern',
  'Needed different size',
  'Browsing only',
  'Other',
] as const;

export type WalkReason = (typeof WALK_REASONS)[number];
