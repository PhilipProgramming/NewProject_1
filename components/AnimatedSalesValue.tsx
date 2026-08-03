import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Text, type TextStyle } from 'react-native';

import { formatCurrency } from '@/lib/format';

type AnimatedSalesValueProps = {
  value: number;
  /** When false, shows the em dash placeholder instead. */
  active: boolean;
  style?: TextStyle;
};

const DURATION_MS = 600;

function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3;
}

/**
 * Today's Sales hero — counts from $0.00 to the target on each visit.
 * rAF-driven for fluid ~60 FPS motion; finishes on the exact value.
 */
export function AnimatedSalesValue({
  value,
  active,
  style,
}: AnimatedSalesValueProps) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number | undefined>(undefined);
  const runIdRef = useRef(0);

  const runAnimation = useCallback(() => {
    runIdRef.current += 1;
    const runId = runIdRef.current;

    if (frameRef.current !== undefined) {
      cancelAnimationFrame(frameRef.current);
    }

    if (!active) {
      setDisplay(value);
      return;
    }

    setDisplay(0);
    const startTime = Date.now();

    const tick = () => {
      if (runId !== runIdRef.current) {
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      const eased = easeOutCubic(progress);
      const current = value * eased;

      if (progress >= 1) {
        setDisplay(value);
        return;
      }

      setDisplay(current);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [active, value]);

  useFocusEffect(
    useCallback(() => {
      runAnimation();

      return () => {
        runIdRef.current += 1;
        if (frameRef.current !== undefined) {
          cancelAnimationFrame(frameRef.current);
        }
      };
    }, [runAnimation]),
  );

  if (!active) {
    return <Text style={style}>—</Text>;
  }

  return <Text style={style}>{formatCurrency(display)}</Text>;
}
