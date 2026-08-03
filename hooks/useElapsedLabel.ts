import { useEffect, useState } from 'react';

/** Human-readable elapsed time since assignment, refreshing periodically. */
export function useElapsedLabel(isoTimestamp: string): string {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const minutes = Math.max(
    0,
    Math.floor((now - new Date(isoTimestamp).getTime()) / 60_000),
  );

  if (minutes < 1) {
    return 'Just now';
  }
  if (minutes === 1) {
    return '1 min';
  }
  return `${minutes} min`;
}
