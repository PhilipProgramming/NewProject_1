/** Lightweight unique id for floor associates and interactions. */
export function createFloorId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}
