import { useEffect, useState } from 'react';
import { useFxMode } from './FxProvider';

interface AnimatedCounterProps {
  value: number;
  durationMs?: number;
  suffix?: string;
  className?: string;
}

/**
 * Smooth 60fps requestAnimationFrame count-up counter for hero telemetry metrics.
 */
export function AnimatedCounter({
  value,
  durationMs = 750,
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const { isFullFx } = useFxMode();
  const [displayValue, setDisplayValue] = useState(isFullFx ? 0 : value);

  useEffect(() => {
    if (!isFullFx) {
      setDisplayValue(value);
      return;
    }

    let rafId = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // Ease-out cubic curve
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [value, durationMs, isFullFx]);

  return (
    <span className={`tabular-nums ${className}`}>
      {displayValue}
      {suffix}
    </span>
  );
}
