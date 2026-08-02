import { useEffect, useState } from 'react';

type UseTypewriterOptions = {
  /** Milliseconds before typing begins. */
  delay?: number;
  /** Milliseconds between each character. */
  charDelay?: number;
  /** When false, typing does not start. */
  enabled?: boolean;
};

/**
 * Reveals text one character at a time for cinematic copy entrances.
 */
export function useTypewriter(
  text: string,
  { delay = 0, charDelay = 80, enabled = true }: UseTypewriterOptions = {},
) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayed('');
      setDone(false);
      return;
    }

    setDisplayed('');
    setDone(false);

    let index = 0;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const startId = setTimeout(() => {
      intervalId = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          if (intervalId) {
            clearInterval(intervalId);
          }
          setDone(true);
        }
      }, charDelay);
    }, delay);

    return () => {
      clearTimeout(startId);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [text, delay, charDelay, enabled]);

  return { displayed, done };
}
