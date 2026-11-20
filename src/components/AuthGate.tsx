import { useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Shield,
} from 'lucide-react';
import {
  signInWithEmailPassword,
  signUpWithEmailPassword,
} from '../lib/supabase';
import type { AuthSessionState } from '../types/vault';
import { useFxMode } from './fx/FxProvider';

interface AuthGateProps {
  onSessionAuthenticated: (nextSession: AuthSessionState) => void;
}

interface EloMilestone {
  id: string;
  rating: string;
  tier: string;
  focus: string;
  x: number;
  y: number;
  isPeak?: boolean;
}

const ELO_MILESTONES: EloMilestone[] = [
  {
    id: 'newbie',
    rating: '800',
    tier: 'Newbie',
    focus: 'Prefix Sums · Two Pointers · Greedy Invariants',
    x: 56,
    y: 148,
  },
  {
    id: 'expert',
    rating: '1600',
    tier: 'Expert',
    focus: 'Dijkstra · Tree DP · Lazy Segment Trees',
    x: 192,
    y: 112,
  },
  {
    id: 'gm',
    rating: '2400',
    tier: 'Grandmaster',
    focus: 'Heavy-Light Decomposition · Dinic Max-Flow · Li Chao',
    x: 336,
    y: 66,
  },
  {
    id: 'lgm',
    rating: '3300+',
    tier: 'LGM',
    focus: 'Edmonds Blossom · Suffix Automaton · Matroid Intersection',
    x: 472,
    y: 28,
    isPeak: true,
  },
];

const MASTERY_TRACK_PILLS = [
  'Graph Theory',
  'Dynamic Programming',
  'Segment Trees',
  'Flows & Matching',
];

function computePasswordStrength(pw: string): {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  tone: string;
  barClass: string;
} {
  if (!pw) {
    return {
      score: 0,
      label: 'Minimum 6 characters required',
      tone: 'text-slate-500',
      barClass: 'bg-white/10',
    };
  }
  if (pw.length < 6) {
    return {
      score: 1,
      label: 'Weak · Minimum 6 characters',
      tone: 'text-rose-400',
      barClass: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.45)]',
    };
  }

  let points = 1;
  if (pw.length >= 8) points++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) points++;
  if (/[0-9]/.test(pw) || /[^A-Za-z0-9]/.test(pw)) points++;

  const clamped = Math.min(4, Math.max(2, points)) as 2 | 3 | 4;
  if (clamped === 2) {
    return {
      score: 2,
      label: 'Fair · Add numbers or mixed case',
      tone: 'text-amber-400',
      barClass: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.45)]',
    };
  }
  if (clamped === 3) {
    return {
      score: 3,
      label: 'Strong · Contest-ready entropy',
      tone: 'text-amber-300',
      barClass: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]',
    };
  }
  return {
    score: 4,
    label: 'Grandmaster · High security passphrase',
    tone: 'text-emerald-400',
    barClass: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.55)]',
  };
}

export function AuthGate({ onSessionAuthenticated }: AuthGateProps) {
  const { isFullFx } = useFxMode();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationBanner, setConfirmationBanner] = useState<string | null>(
    null,
  );
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>('lgm');

  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{
    x: number;
    y: number;
    active: boolean;
  }>({
    x: 220,
    y: 220,
    active: false,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFullFx || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, active: false }));
  };

  const switchMode = (nextMode: 'signin' | 'signup') => {
    setMode(nextMode);
    setError(null);
    setConfirmationBanner(null);
  };

  const strength = useMemo(() => computePasswordStrength(password), [password]);
  const activeMilestone = useMemo(
    () =>
      ELO_MILESTONES.find((m) => m.id === activeMilestoneId) ??
      ELO_MILESTONES[ELO_MILESTONES.length - 1],
    [activeMilestoneId],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setConfirmationBanner(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Enter a valid email address to continue.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setBusy(true);
    if (mode === 'signin') {
      const result = await signInWithEmailPassword(trimmedEmail, password);
      setBusy(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      onSessionAuthenticated(result.session);
      return;
    }

    const result = await signUpWithEmailPassword(trimmedEmail, password);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.requiresEmailConfirmation) {
      setConfirmationBanner(
        `Verification link sent to ${trimmedEmail}. Please confirm your email, then sign in below.`,
      );
      setMode('signin');
      setPassword('');
      return;
    }

    onSessionAuthenticated(result.session);
  };

  return (
    <div className="relative min-h-screen lg:h-screen w-full bg-[#06070A] text-[#E5E7EB] flex items-center justify-center overflow-x-hidden lg:overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Cinematic Layered Backdrop (Aceternity + Raycast Style) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-35 [mask-image:radial-gradient(ellipse_80%_75%_at_50%_45%,#000_35%,transparent_100%)]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            radial-gradient(rgba(245, 158, 11, 0.22) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px, 48px 48px, 24px 24px',
        }}
      />

      {/* Diagonal Amber Gold Volumetric Light Streak from Top-Left */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-44 -left-40 w-[760px] h-[500px] rotate-[-18deg] opacity-30 blur-[120px]"
        style={{
          background:
            'radial-gradient(ellipse at 30% 30%, rgba(245, 158, 11, 0.44), rgba(217, 119, 6, 0.14) 55%, transparent 80%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[-180px] right-[-120px] w-[600px] h-[420px] opacity-20 blur-[130px]"
        style={{
          background:
            'radial-gradient(circle, rgba(251, 191, 36, 0.30), rgba(245, 158, 11, 0.08) 60%, transparent 80%)',
        }}
      />

      {/* Subtle Animated Light Beams Drifting Quietly Along Grid Lines */}
      {isFullFx && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 overflow-hidden opacity-40"
        >
          <div className="gv-beam-x-1 absolute top-[22%] left-0 h-[1px] w-56 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
          <div className="gv-beam-x-2 absolute top-[76%] left-0 h-[1px] w-72 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          <div className="gv-beam-y-1 absolute top-0 left-[26%] w-[1px] h-56 bg-gradient-to-b from-transparent via-amber-400/60 to-transparent" />
          <div className="gv-beam-y-2 absolute top-0 left-[74%] w-[1px] h-64 bg-gradient-to-b from-transparent via-amber-300/40 to-transparent" />
        </div>
      )}

      {/* Ultra-Subtle SVG Tactile Noise/Grain Overlay */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.03]"
      >
        <filter id="gv-auth-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#gv-auth-noise)" />
      </svg>

      {/* Main Centered Split Stage — Sized for Zero-Scroll Desktop Fit */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Mobile & Tablet Header (Hidden on Desktop where Full Left Showcase renders) */}
          <div className="lg:hidden text-center space-y-2.5 max-w-md mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
              <span className="font-mono text-[11px] font-semibold tracking-widest text-amber-300">
                GRANDMASTER VAULT
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 text-balance">
              Master the Algorithms Behind{' '}
              <span className="gv-shimmer-gold-text">Grandmaster.</span>
            </h1>
            <p className="text-xs text-slate-400">
              Sign in or create an account to unlock all 80 theory chapters, 10 reduction case studies, and the contest lab.
            </p>
          </div>

          {/* Left Pane — Algorithmic Visual Centerpiece (Desktop lg:col-span-7) */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-center space-y-4 pr-2">
            {/* Minimal Brand Eyebrow Pill */}
            <div>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-amber-500/25 bg-[#0D1017]/85 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.95)]" />
                <span className="font-mono text-[11px] font-semibold tracking-widest text-amber-300">
                  GRANDMASTER VAULT
                </span>
              </div>
            </div>

            {/* Tight Editorial Headline */}
            <div className="space-y-2">
              <h1 className="font-display text-4xl xl:text-[2.6rem] font-bold tracking-tight text-slate-100 leading-[1.12] text-balance">
                Master the Algorithms Behind{' '}
                <span className="gv-shimmer-gold-text">Grandmaster.</span>
              </h1>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                Structured competitive-programming encyclopedia spanning Elo 800 to 3300+ with interactive memory traces, multi-topic reductions, and 5-language implementations.
              </p>
            </div>

            {/* Interactive "Grandmaster Ascent" Visual Card */}
            <div className="rounded-2xl border border-white/10 bg-[#0B0D14]/80 backdrop-blur-xl shadow-[0_22px_65px_rgba(0,0,0,0.75)] overflow-hidden">
              {/* Card Top Header Strip with Active Milestone Readout */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#080A0F]/70">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold tracking-wider text-slate-300">
                    GRANDMASTER ASCENT
                  </span>
                  <span aria-hidden="true" className="text-slate-600">
                    ·
                  </span>
                  <span className="font-mono text-[11px] text-amber-400">
                    ELO {activeMilestone.rating} ({activeMilestone.tier})
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-400 truncate max-w-[270px]">
                  {activeMilestone.focus}
                </span>
              </div>

              {/* Layered Animated SVG Visualization: Background Graph Network + Foreground Elo Curve */}
              <div className="relative px-3 pt-2 pb-1">
                <svg
                  viewBox="0 0 530 176"
                  className="w-full h-[176px] select-none overflow-visible"
                  role="img"
                  aria-label="Grandmaster Elo Rating Progression Curve and Shortest-Path Graph Network"
                >
                  <defs>
                    {/* Area fill under the Elo curve */}
                    <linearGradient
                      id="gv-elo-area-grad"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.28" />
                      <stop offset="65%" stopColor="#D97706" stopOpacity="0.06" />
                      <stop offset="100%" stopColor="#0B0D14" stopOpacity="0" />
                    </linearGradient>

                    {/* Stroke gradient for the Elo progression curve */}
                    <linearGradient
                      id="gv-elo-line-grad"
                      x1="0%"
                      y1="100%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#94A3B8" />
                      <stop offset="35%" stopColor="#F59E0B" />
                      <stop offset="75%" stopColor="#FBBF24" />
                      <stop offset="100%" stopColor="#FEF3C7" />
                    </linearGradient>

                    {/* Glow filter for curve and peak beacon */}
                    <filter
                      id="gv-amber-glow"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feComposite
                        in="SourceGraphic"
                        in2="blur"
                        operator="over"
                      />
                    </filter>
                  </defs>

                  {/* Subtle Horizontal Coordinate Grid Lines */}
                  {[34, 72, 110, 148].map((y) => (
                    <line
                      key={y}
                      x1="28"
                      y1={y}
                      x2="504"
                      y2={y}
                      stroke="rgba(255,255,255,0.05)"
                      strokeDasharray="3 5"
                    />
                  ))}

                  {/* Background Layer: Interconnected Graph & Shortest-Path Network */}
                  <g className="opacity-45">
                    {/* Background Graph Edges */}
                    <line
                      x1="56"
                      y1="148"
                      x2="122"
                      y2="92"
                      stroke="rgba(148,163,184,0.22)"
                      strokeWidth="1"
                    />
                    <line
                      x1="122"
                      y1="92"
                      x2="192"
                      y2="112"
                      stroke="rgba(148,163,184,0.22)"
                      strokeWidth="1"
                    />
                    <line
                      x1="122"
                      y1="92"
                      x2="255"
                      y2="46"
                      stroke="rgba(148,163,184,0.18)"
                      strokeWidth="1"
                    />
                    <line
                      x1="192"
                      y1="112"
                      x2="268"
                      y2="132"
                      stroke="rgba(148,163,184,0.2)"
                      strokeWidth="1"
                    />
                    <line
                      x1="268"
                      y1="132"
                      x2="336"
                      y2="66"
                      stroke="rgba(148,163,184,0.22)"
                      strokeWidth="1"
                    />
                    <line
                      x1="255"
                      y1="46"
                      x2="336"
                      y2="66"
                      stroke="rgba(148,163,184,0.22)"
                      strokeWidth="1"
                    />
                    <line
                      x1="336"
                      y1="66"
                      x2="404"
                      y2="104"
                      stroke="rgba(148,163,184,0.2)"
                      strokeWidth="1"
                    />
                    <line
                      x1="404"
                      y1="104"
                      x2="472"
                      y2="28"
                      stroke="rgba(148,163,184,0.22)"
                      strokeWidth="1"
                    />
                    <line
                      x1="255"
                      y1="46"
                      x2="392"
                      y2="30"
                      stroke="rgba(148,163,184,0.16)"
                      strokeWidth="1"
                    />
                    <line
                      x1="392"
                      y1="30"
                      x2="472"
                      y2="28"
                      stroke="rgba(148,163,184,0.22)"
                      strokeWidth="1"
                    />

                    {/* Highlighted Shortest-Path Subgraph with Animated Energy Flow */}
                    <path
                      d="M 56 148 L 122 92 L 255 46 L 336 66 L 392 30 L 472 28"
                      fill="none"
                      stroke="rgba(245, 158, 11, 0.35)"
                      strokeWidth="1.25"
                      strokeDasharray="5 7"
                      className={isFullFx ? 'gv-energy-flow-line' : ''}
                    />

                    {/* Auxiliary Graph Nodes */}
                    {[
                      { cx: 122, cy: 92 },
                      { cx: 255, cy: 46 },
                      { cx: 268, cy: 132 },
                      { cx: 404, cy: 104 },
                      { cx: 392, cy: 30 },
                    ].map((node, idx) => (
                      <circle
                        key={idx}
                        cx={node.cx}
                        cy={node.cy}
                        r="2.8"
                        fill="#1E293B"
                        stroke="#F59E0B"
                        strokeOpacity="0.55"
                        strokeWidth="1.2"
                      />
                    ))}
                  </g>

                  {/* Foreground Layer: Elo Rating Progression Area & Smooth Bezier Curve */}
                  <path
                    d="M 56 148 C 110 144, 145 126, 192 112 C 248 95, 285 82, 336 66 C 390 49, 428 38, 472 28 L 472 162 L 56 162 Z"
                    fill="url(#gv-elo-area-grad)"
                  />

                  <path
                    d="M 56 148 C 110 144, 145 126, 192 112 C 248 95, 285 82, 336 66 C 390 49, 428 38, 472 28"
                    fill="none"
                    stroke="url(#gv-elo-line-grad)"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                    filter="url(#gv-amber-glow)"
                  />

                  {/* Animated Traveling Pulse Along the Elo Curve */}
                  {isFullFx && (
                    <path
                      d="M 56 148 C 110 144, 145 126, 192 112 C 248 95, 285 82, 336 66 C 390 49, 428 38, 472 28"
                      fill="none"
                      stroke="#FEF3C7"
                      strokeWidth="2.5"
                      strokeDasharray="10 26"
                      strokeLinecap="round"
                      className="gv-energy-flow-line opacity-80"
                    />
                  )}

                  {/* Interactive Elo Milestone Nodes (800 -> 1600 -> 2400 -> 3300+) */}
                  {ELO_MILESTONES.map((m) => {
                    const isSelected = activeMilestone.id === m.id;
                    return (
                      <g
                        key={m.id}
                        className="cursor-pointer"
                        onMouseEnter={() => setActiveMilestoneId(m.id)}
                        onClick={() => setActiveMilestoneId(m.id)}
                      >
                        {/* Outer Halo for Peak or Active Node */}
                        {(m.isPeak || isSelected) && (
                          <circle
                            cx={m.x}
                            cy={m.y}
                            r={m.isPeak ? '13' : '10'}
                            fill="rgba(245, 158, 11, 0.16)"
                            className={isFullFx ? 'animate-pulse' : ''}
                          />
                        )}
                        <circle
                          cx={m.x}
                          cy={m.y}
                          r={m.isPeak ? '5.5' : isSelected ? '5' : '4'}
                          fill={m.isPeak || isSelected ? '#FBBF24' : '#0F172A'}
                          stroke={m.isPeak ? '#FEF3C7' : '#F59E0B'}
                          strokeWidth="2"
                        />

                        {/* Rating & Tier Labels */}
                        <text
                          x={m.x}
                          y={m.y - 12}
                          textAnchor="middle"
                          className="font-mono text-[11px] font-bold fill-amber-300"
                        >
                          {m.rating}
                        </text>
                        <text
                          x={m.x}
                          y={m.y + 18}
                          textAnchor="middle"
                          className={`font-mono text-[10px] ${
                            isSelected ? 'fill-slate-100 font-semibold' : 'fill-slate-400'
                          }`}
                        >
                          {m.tier}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Bottom Feature Strip Inside Card: Core Mastery Track Pills */}
              <div className="border-t border-white/10 bg-[#07090E]/90 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {MASTERY_TRACK_PILLS.map((track) => (
                    <span
                      key={track}
                      className="px-2.5 py-0.5 rounded-full border border-white/10 bg-white/[0.03] font-mono text-[11px] text-slate-300"
                    >
                      {track}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[10px] text-amber-400/90">
                  5 LANGUAGES
                </span>
              </div>
            </div>

            {/* Compact Metrics Bar Below */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md px-3.5 py-2.5 flex items-baseline justify-between gap-2">
                <div>
                  <div className="font-display text-lg font-bold text-amber-400 tabular-nums">
                    80+ Chapters
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Full Syllabus Live
                  </div>
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  01–80
                </span>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md px-3.5 py-2.5 flex items-baseline justify-between gap-2">
                <div>
                  <div className="font-display text-lg font-bold text-slate-100 tabular-nums">
                    10 Vault Studies
                  </div>
                  <div className="text-[11px] text-slate-400">
                    5-Stage Reductions
                  </div>
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  2400+
                </span>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md px-3.5 py-2.5 flex items-baseline justify-between gap-2">
                <div>
                  <div className="font-display text-lg font-bold text-emerald-400 tabular-nums">
                    30 Pattern Drills
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Active Recall Lab
                  </div>
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  DRILL
                </span>
              </div>
            </div>
          </div>

          {/* Right Pane — The Auth Vault Card (Magic UI Border Beam + Linear Precision) */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative rounded-2xl p-[1px] overflow-hidden shadow-[0_28px_90px_rgba(0,0,0,0.85)]"
            >
              {/* Animated Amber Gold Border Beam */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
              >
                <div
                  className="gv-border-beam-rotor absolute left-1/2 top-1/2 w-[220%] aspect-square opacity-85"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent 0deg, transparent 265deg, #F59E0B 315deg, #FEF3C7 345deg, transparent 360deg)',
                  }}
                />
              </div>

              {/* Static Hairline Border Base */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl border border-white/12"
              />

              {/* Inner Frosted Glass Card Surface */}
              <div className="relative z-10 rounded-[15px] bg-[#0C0E14]/90 backdrop-blur-2xl p-6 sm:p-7 space-y-5 overflow-hidden">
                {/* Cursor-Tracking Radial Amber Sheen */}
                {isFullFx && mousePos.active && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(340px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245, 158, 11, 0.11), transparent 70%)`,
                    }}
                  />
                )}

                {/* Header & Emblem */}
                <div className="relative z-10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shadow-[0_0_18px_rgba(245,158,11,0.2)]">
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span className="font-mono text-[11px] font-semibold tracking-wider text-amber-400">
                        // AUTHENTICATION REQUIRED
                      </span>
                    </div>
                  </div>

                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                      {mode === 'signin'
                        ? 'Unlock Grandmaster Vault'
                        : 'Create Competitor Account'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {mode === 'signin'
                        ? 'Sign in with your account credentials to enter the workspace.'
                        : 'Register your email and password to sync progress and mistake logs.'}
                    </p>
                  </div>
                </div>

                {/* Sliding Pill Segmented Control: Sign In | Create Account */}
                <div
                  className="relative z-10 grid grid-cols-2 p-1 rounded-xl bg-black/60 border border-white/10"
                  role="tablist"
                  aria-label="Authentication Mode"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'signin'}
                    onClick={() => switchMode('signin')}
                    className={`py-2 px-3 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      mode === 'signin'
                        ? 'bg-[#171B26] text-amber-300 border border-amber-500/35 shadow-[0_0_16px_rgba(245,158,11,0.15)]'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'signup'}
                    onClick={() => switchMode('signup')}
                    className={`py-2 px-3 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      mode === 'signup'
                        ? 'bg-[#171B26] text-amber-300 border border-amber-500/35 shadow-[0_0_16px_rgba(245,158,11,0.15)]'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Auth Form */}
                <form
                  onSubmit={handleSubmit}
                  className="relative z-10 space-y-3.5"
                  noValidate
                >
                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="gv-gate-email"
                      className="block font-mono text-xs text-slate-300"
                    >
                      EMAIL ADDRESS
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="gv-gate-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono rounded-xl border border-white/10 bg-black/50 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 focus:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="gv-gate-password"
                        className="block font-mono text-xs text-slate-300"
                      >
                        PASSWORD
                      </label>
                      <span className="font-mono text-[11px] text-slate-500">
                        min 6 chars
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="gv-gate-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        autoComplete={
                          mode === 'signin'
                            ? 'current-password'
                            : 'new-password'
                        }
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 text-sm font-mono rounded-xl border border-white/10 bg-black/50 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 focus:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Live Password Strength Meter in Create Account Mode */}
                    {mode === 'signup' && (
                      <div className="pt-1 space-y-1">
                        <div className="grid grid-cols-4 gap-1.5">
                          {[1, 2, 3, 4].map((bar) => (
                            <div
                              key={bar}
                              className={`h-1 rounded-full transition-all duration-300 ${
                                strength.score >= bar
                                  ? strength.barClass
                                  : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                        <div
                          className={`font-mono text-[11px] ${strength.tone}`}
                        >
                          {strength.label}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Error Banner */}
                  {error && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 p-2.5 rounded-xl border border-rose-500/40 bg-rose-950/35 text-xs font-mono text-rose-200"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-semibold text-rose-400">
                          [ERR] AUTHENTICATION FAILED
                        </span>
                        <p className="text-rose-200/90 leading-relaxed">
                          {error}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Email Verification Confirmation Banner */}
                  {confirmationBanner && (
                    <div
                      role="status"
                      className="flex items-start gap-2.5 p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/35 text-xs font-mono text-emerald-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-semibold text-emerald-400">
                          [OK] VERIFICATION SENT
                        </span>
                        <p className="text-emerald-200/90 leading-relaxed">
                          {confirmationBanner}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Gleaming Primary CTA Button (Magic UI Shiny Sweep) */}
                  <button
                    type="submit"
                    disabled={busy}
                    className="group relative w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 font-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_28px_rgba(245,158,11,0.3)] hover:shadow-[0_0_38px_rgba(245,158,11,0.5)] active:scale-[0.99] transition-all overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {/* Diagonal Light-Shimmer Sweep on Hover */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out"
                    />
                    <span className="relative z-10 inline-flex items-center justify-center gap-2">
                      {busy ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Unlocking Vault...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {mode === 'signin'
                              ? 'Enter the Vault'
                              : 'Create Vault Account'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Ultra-Minimal Security Footer */}
                <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between gap-2 font-mono text-[11px] text-slate-500">
                  <span>Protected by Supabase Auth &amp; RLS</span>
                  <span className="text-slate-400">Enter ↵</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
