import { useEffect, useRef } from 'react';
import type { MasterDomain } from '../../types/vault';
import { useFxMode } from './FxProvider';

export interface DomainHeroBackdropProps {
  domain: MasterDomain;
  variant?: 'hero' | 'banner';
}

const MATH_GLYPHS: Array<{
  char: string;
  left: string;
  top: string;
  size: string;
  delay: string;
  blur: string;
}> = [
  { char: 'Σ', left: '8%', top: '22%', size: '24px', delay: '0s', blur: '0px' },
  { char: 'π', left: '21%', top: '58%', size: '19px', delay: '1.2s', blur: '0.5px' },
  { char: 'φ', left: '36%', top: '28%', size: '22px', delay: '2.4s', blur: '0px' },
  { char: 'μ', left: '51%', top: '64%', size: '20px', delay: '0.8s', blur: '0.5px' },
  { char: '⊕', left: '66%', top: '20%', size: '23px', delay: '1.9s', blur: '0px' },
  { char: 'λ', left: '78%', top: '54%', size: '21px', delay: '3.1s', blur: '0.5px' },
  { char: '≡', left: '89%', top: '26%', size: '20px', delay: '1.5s', blur: '0px' },
  { char: '∀', left: '94%', top: '66%', size: '18px', delay: '2.7s', blur: '0.5px' },
];

const METEOR_TRACKS: Array<{
  left: string;
  top: string;
  delay: string;
  duration: string;
}> = [
  { left: '22%', top: '-8%', delay: '0.2s', duration: '4.4s' },
  { left: '46%', top: '-12%', delay: '1.7s', duration: '5.1s' },
  { left: '70%', top: '-6%', delay: '0.9s', duration: '4.7s' },
  { left: '88%', top: '-10%', delay: '2.8s', duration: '5.4s' },
  { left: '96%', top: '12%', delay: '3.5s', duration: '4.9s' },
];

/**
 * Interactive Constellation Canvas for "Graph & Tree Theory" domain.
 * Capped at <= 22 nodes and DPR <= 2; automatically pauses when off-screen via IntersectionObserver.
 */
function GraphConstellationCanvas({ isFullFx }: { isFullFx: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let inView = true;
    const pointer = { x: -9999, y: -9999 };

    interface Vertex {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }

    const nodeCount = 20;
    const vertices: Vertex[] = [];
    let width = 800;
    let height = 180;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(300, rect.width);
      height = Math.max(80, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (vertices.length === 0) {
        for (let i = 0; i < nodeCount; i++) {
          vertices.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.34,
            vy: (Math.random() - 0.5) * 0.28,
            r: i % 4 === 0 ? 2.6 : 1.9,
          });
        }
      }
    };

    resize();

    const drawStaticOrFrame = () => {
      ctx.clearRect(0, 0, width, height);

      if (isFullFx) {
        for (const v of vertices) {
          v.x += v.vx;
          v.y += v.vy;
          if (v.x < 8 || v.x > width - 8) v.vx *= -1;
          if (v.y < 8 || v.y > height - 8) v.vy *= -1;
        }
      }

      // Draw edges between nearby vertices
      const maxDist = 140;
      for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
          const a = vertices[i];
          const b = vertices[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            const midX = (a.x + b.x) * 0.5;
            const midY = (a.y + b.y) * 0.5;
            const cursorDist = Math.hypot(midX - pointer.x, midY - pointer.y);
            const nearCursor = cursorDist < 140;
            const alpha = (1 - dist / maxDist) * (nearCursor ? 0.55 : 0.22);

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = nearCursor
              ? `rgba(245, 158, 11, ${alpha.toFixed(3)})`
              : `rgba(148, 163, 184, ${alpha.toFixed(3)})`;
            ctx.lineWidth = nearCursor ? 1.25 : 0.85;
            ctx.stroke();
          }
        }
      }

      // Draw vertices
      for (const v of vertices) {
        const cursorDist = Math.hypot(v.x - pointer.x, v.y - pointer.y);
        const near = cursorDist < 125;
        ctx.beginPath();
        ctx.arc(v.x, v.y, near ? v.r + 0.9 : v.r, 0, Math.PI * 2);
        ctx.fillStyle = near
          ? 'rgba(251, 191, 36, 0.88)'
          : 'rgba(245, 158, 11, 0.45)';
        ctx.fill();
      }
    };

    const loop = () => {
      if (inView && isFullFx) {
        drawStaticOrFrame();
        rafId = requestAnimationFrame(loop);
      }
    };

    drawStaticOrFrame();
    if (isFullFx) {
      rafId = requestAnimationFrame(loop);
    }

    const parent = canvas.parentElement;
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    parent?.addEventListener('mousemove', onMove);
    parent?.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', resize);

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            inView = entry.isIntersecting;
            if (inView && isFullFx) {
              cancelAnimationFrame(rafId);
              rafId = requestAnimationFrame(loop);
            } else {
              cancelAnimationFrame(rafId);
            }
          }
        },
        { threshold: 0.05 },
      );
      observer.observe(canvas);
    }

    return () => {
      cancelAnimationFrame(rafId);
      parent?.removeEventListener('mousemove', onMove);
      parent?.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
      observer?.disconnect();
    };
  }, [isFullFx]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-75"
    />
  );
}

/**
 * 6 Unique Domain-Specific Ambient Hero Backdrops.
 * Kept subtle (opacity 0.25-0.45) with an obsidian bottom fade mask so all foreground text stays razor-sharp.
 */
export function DomainHeroBackdrop({
  domain,
  variant = 'hero',
}: DomainHeroBackdropProps) {
  const { isFullFx } = useFxMode();
  const opacityClass = variant === 'hero' ? 'opacity-40' : 'opacity-30';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${opacityClass}`}
    >
      {/* 1. Data Structures: Glowing Orthogonal Grid Beams */}
      {domain === 'Data Structures' && (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />
          {isFullFx && (
            <>
              <div
                className="gv-beam-x-1 absolute left-0 top-[36px] h-[1.5px] w-36"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, #F59E0B, #FDE68A, transparent)',
                }}
              />
              <div
                className="gv-beam-x-2 absolute left-0 top-[108px] h-[1.5px] w-44"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, #10B981, #F59E0B, transparent)',
                }}
              />
              <div
                className="gv-beam-y-1 absolute left-[22%] top-0 h-28 w-[1.5px]"
                style={{
                  background:
                    'linear-gradient(180deg, transparent, #F59E0B, #FDE68A, transparent)',
                }}
              />
              <div
                className="gv-beam-y-2 absolute left-[68%] top-0 h-28 w-[1.5px]"
                style={{
                  background:
                    'linear-gradient(180deg, transparent, #FBBF24, transparent)',
                }}
              />
            </>
          )}
        </div>
      )}

      {/* 2. Search, Greedy & DP: Flowing Aurora State Mesh */}
      {domain === 'Search, Greedy & DP' && (
        <div className="absolute inset-0">
          <div
            className="gv-aurora-blob-1 absolute -left-16 -top-16 h-64 w-96 rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(245, 158, 11, 0.34) 0%, rgba(217, 119, 6, 0.08) 60%, transparent 80%)',
            }}
          />
          <div
            className="gv-aurora-blob-2 absolute right-0 -bottom-20 h-64 w-96 rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(16, 185, 129, 0.24) 0%, rgba(245, 158, 11, 0.14) 55%, transparent 80%)',
            }}
          />
        </div>
      )}

      {/* 3. Graph & Tree Theory: Interactive Constellation Canvas */}
      {domain === 'Graph & Tree Theory' && (
        <GraphConstellationCanvas isFullFx={isFullFx} />
      )}

      {/* 4. Math, Number Theory & Algebra: Floating Prime & Algebra Lattice */}
      {domain === 'Math, Number Theory & Algebra' && (
        <div className="absolute inset-0 font-mono">
          {MATH_GLYPHS.map((g, idx) => (
            <span
              key={idx}
              className="gv-glyph-float absolute font-bold text-amber-400/50"
              style={{
                left: g.left,
                top: g.top,
                fontSize: g.size,
                animationDelay: g.delay,
                filter: `blur(${g.blur})`,
              }}
            >
              {g.char}
            </span>
          ))}
        </div>
      )}

      {/* 5. Strings & Geometry: Convex Hull Wireframe & Laser Sweep */}
      {domain === 'Strings & Geometry' && (
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 900 180"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <polygon
              points="70,135 210,32 420,24 650,52 825,120 570,158 265,152"
              fill="rgba(245, 158, 11, 0.03)"
              stroke="rgba(245, 158, 11, 0.32)"
              strokeWidth="1.2"
              strokeDasharray="5 4"
            />
            <polyline
              points="70,135 420,24 570,158 825,120"
              fill="none"
              stroke="rgba(251, 191, 36, 0.2)"
              strokeWidth="1"
            />
            <polyline
              points="210,32 265,152 650,52"
              fill="none"
              stroke="rgba(16, 185, 129, 0.22)"
              strokeWidth="1"
            />
            {[
              [70, 135],
              [210, 32],
              [420, 24],
              [650, 52],
              [825, 120],
              [570, 158],
              [265, 152],
            ].map(([cx, cy], idx) => (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r="3.2"
                fill="#FBBF24"
                stroke="#0B0C0E"
                strokeWidth="1"
              />
            ))}
          </svg>
          {isFullFx && (
            <div
              className="gv-laser-line absolute inset-x-0 top-0 h-[1.5px]"
              style={{
                background:
                  'linear-gradient(90deg, transparent 5%, rgba(245, 158, 11, 0.75) 50%, transparent 95%)',
                boxShadow: '0 0 12px rgba(245, 158, 11, 0.5)',
              }}
            />
          )}
        </div>
      )}

      {/* 6. Theoretical & Randomized: Diagonal Meteor Shower + Dot Matrix */}
      {domain === 'Theoretical & Randomized' && (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          {isFullFx &&
            METEOR_TRACKS.map((m, idx) => (
              <span
                key={idx}
                className="gv-meteor absolute h-[1.5px] w-24 rounded-full"
                style={{
                  left: m.left,
                  top: m.top,
                  animationDelay: m.delay,
                  animationDuration: m.duration,
                  background:
                    'linear-gradient(90deg, #FDE68A, rgba(245, 158, 11, 0.45), transparent)',
                }}
              />
            ))}
        </div>
      )}

      {/* Bottom & radial obsidian fade mask so text remains 100% razor-sharp */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(19, 21, 26, 0.15) 0%, rgba(19, 21, 26, 0.78) 100%)',
        }}
      />
    </div>
  );
}
