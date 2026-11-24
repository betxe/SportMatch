import { useEffect, useRef, useState } from 'react';

export function CounterBadge({
  count,
  spots,
  testId,
}: {
  count: number;
  spots: number;
  testId?: string;
}) {
  const previous = useRef(count);
  const [tick, setTick] = useState(false);

  useEffect(() => {
    if (previous.current === count) return;
    previous.current = count;
    setTick(true);
    const timer = window.setTimeout(() => setTick(false), 200);
    return () => window.clearTimeout(timer);
  }, [count]);

  return (
    <span data-testid={testId} className={`text-xl font-bold text-ink ${tick ? 'motion-safe:animate-tick' : ''}`}>
      <span className="sr-only">Live counter </span>
      <span aria-live="polite">
        {count}/{spots}
      </span>
    </span>
  );
}
