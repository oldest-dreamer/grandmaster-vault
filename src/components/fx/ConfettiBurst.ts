/**
 * Zero-dependency lightweight <canvas> confetti burst (30 amber/gold/emerald particles).
 * Auto-destroys after 900ms. Respects Reduced FX mode and prefers-reduced-motion.
 */
export function triggerConfettiBurst(originX?: number, originY?: number): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (document.documentElement.classList.contains('gv-reduced-fx')) return;
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  const startX = originX ?? window.innerWidth * 0.5;
  const startY = originY ?? window.innerHeight * 0.38;

  const palette = [
    '#F59E0B', // Amber 500
    '#FBBF24', // Amber 400
    '#FDE68A', // Amber 200
    '#10B981', // Emerald 500
    '#34D399', // Emerald 400
    '#FFFBEB', // Warm Gold White
  ];

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    vRot: number;
    shape: 'rect' | 'circle';
  }

  const count = 32;
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
    const speed = 3.8 + Math.random() * 6.5;
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.4,
      size: 4 + Math.random() * 4.5,
      color: palette[i % palette.length],
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.24,
      shape: i % 3 === 0 ? 'circle' : 'rect',
    });
  }

  const startTime = performance.now();
  const durationMs = 900;

  const tick = (now: number) => {
    const elapsed = now - startTime;
    if (elapsed >= durationMs) {
      canvas.remove();
      return;
    }

    const progress = elapsed / durationMs;
    const alpha = Math.max(0, 1 - Math.pow(progress, 1.6));

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.vx *= 0.985; // drag
      p.rotation += p.vRot;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.55, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
      }
      ctx.restore();
    }

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}
