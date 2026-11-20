import {
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { useFxMode } from './FxProvider';

export interface BorderBeamCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  enableTilt?: boolean;
  maxTiltDeg?: number;
  beamTone?: 'amber' | 'emerald';
}

/**
 * Linear-Style Rotating Light Beam + Subtle 3D Perspective Tilt Card.
 * Traces a luminous conic-gradient beam around the perimeter of the card
 * and applies an optional ±4deg perspective tilt with specular glare.
 */
export function BorderBeamCard({
  children,
  className = '',
  innerClassName = '',
  enableTilt = true,
  maxTiltDeg = 3.5,
  beamTone = 'amber',
  onMouseMove,
  onMouseLeave,
  ...rest
}: BorderBeamCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFullFx } = useFxMode();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isFullFx && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      containerRef.current.style.setProperty('--mx', `${x}px`);
      containerRef.current.style.setProperty('--my', `${y}px`);

      if (enableTilt) {
        const normX = (x / Math.max(1, rect.width) - 0.5) * 2;
        const normY = (y / Math.max(1, rect.height) - 0.5) * 2;
        const rotX = (-normY * maxTiltDeg).toFixed(2);
        const rotY = (normX * maxTiltDeg).toFixed(2);
        containerRef.current.style.transform = `perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
      }
    }
    if (onMouseMove) {
      onMouseMove(e);
    }
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      containerRef.current.style.transform =
        'perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    }
    if (onMouseLeave) {
      onMouseLeave(e);
    }
  };

  const beamGradient =
    beamTone === 'emerald'
      ? 'conic-gradient(from 0deg, transparent 0deg 265deg, rgba(16, 185, 129, 0.25) 295deg, rgba(245, 158, 11, 0.85) 335deg, #6EE7B7 355deg, transparent 360deg)'
      : 'conic-gradient(from 0deg, transparent 0deg 265deg, rgba(245, 158, 11, 0.22) 295deg, rgba(251, 191, 36, 0.9) 338deg, #FEF3C7 355deg, transparent 360deg)';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`group/beam relative rounded-xl p-[1px] overflow-hidden bg-white/[0.09] hover:bg-amber-500/20 ${className}`}
      {...rest}
    >
      {/* Rotating Conic-Gradient Light Beam along the 1px Perimeter */}
      {isFullFx && (
        <div
          aria-hidden="true"
          className="gv-border-beam-rotor pointer-events-none absolute left-1/2 top-1/2 h-[240%] w-[240%] opacity-65 transition-opacity duration-300 group-hover/beam:opacity-100"
          style={{
            background: beamGradient,
          }}
        />
      )}

      {/* Inner Card Surface */}
      <div
        className={`relative z-10 h-full w-full rounded-[11px] bg-[#13151A] overflow-hidden ${innerClassName}`}
      >
        {/* Subtle Specular Glare following cursor */}
        {isFullFx && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover/beam:opacity-100"
            style={{
              background:
                'radial-gradient(320px circle at var(--mx, 50%) var(--my, 30%), rgba(245, 158, 11, 0.10), transparent 72%)',
            }}
          />
        )}
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </div>
  );
}
