import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useFxMode } from './FxProvider';

export interface ScrollRevealProps {
  children: ReactNode;
  index?: number;
  className?: string;
}

/**
 * Lightweight IntersectionObserver wrapper that fades and rises cards smoothly
 * (translateY(14px) -> 0, staggered by 35ms capped at 250ms) once when entering viewport.
 * Content remains 100% present and accessible in the DOM at all times.
 */
export function ScrollReveal({
  children,
  index = 0,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isFullFx } = useFxMode();
  const [visible, setVisible] = useState(!isFullFx);

  useEffect(() => {
    if (!isFullFx) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.06,
        rootMargin: '20px 0px -10px 0px',
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isFullFx]);

  const delayMs = isFullFx ? Math.min(index * 35, 250) : 0;

  return (
    <div
      ref={ref}
      className={className}
      style={
        isFullFx
          ? {
              opacity: visible ? 1 : 0.01,
              transform: visible
                ? 'translate3d(0, 0, 0)'
                : 'translate3d(0, 14px, 0)',
              transition: `opacity 340ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 340ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
