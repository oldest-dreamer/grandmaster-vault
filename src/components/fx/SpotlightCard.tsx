import {
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { useFxMode } from './FxProvider';

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  borderGlowColor?: string;
  radiusPx?: number;
}

/**
 * Raycast-Style Cursor Glow Card.
 * Tracks pointer coordinates (--mx, --my) directly via DOM style properties
 * on mousemove (zero React state re-renders per pixel) for locked 60fps performance.
 */
export function SpotlightCard({
  children,
  className = '',
  glowColor = 'rgba(245, 158, 11, 0.11)',
  borderGlowColor = 'rgba(245, 158, 11, 0.42)',
  radiusPx = 280,
  onMouseMove,
  ...rest
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { isFullFx } = useFxMode();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isFullFx && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cardRef.current.style.setProperty('--mx', `${x}px`);
      cardRef.current.style.setProperty('--my', `${y}px`);
    }
    if (onMouseMove) {
      onMouseMove(e);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group/spotlight relative overflow-hidden ${className}`}
      {...rest}
    >
      {isFullFx && (
        <>
          {/* Soft radial Amber Gold glow inside the card surface */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
            style={{
              background: `radial-gradient(${radiusPx}px circle at var(--mx, 50%) var(--my, 50%), ${glowColor}, transparent 75%)`,
            }}
          />
          {/* Crisp 1px perimeter border glow near the cursor */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
            style={{
              padding: '1px',
              background: `radial-gradient(${Math.round(
                radiusPx * 0.72,
              )}px circle at var(--mx, 50%) var(--my, 50%), ${borderGlowColor}, transparent 75%)`,
              WebkitMask:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        </>
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
