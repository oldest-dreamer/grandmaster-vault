import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  RotateCcw,
  Shuffle,
  Sparkles,
  Target,
  Trophy,
  XCircle,
  Zap,
} from 'lucide-react';
import {
  DRILL_SCENARIOS,
  type DrillRatingTier,
  type DrillScenario,
} from '../data/drills';
import { triggerConfettiBurst } from './fx/ConfettiBurst';

export interface PatternDrillViewProps {
  onNavigate: (path: string) => void;
}

interface StoredDrillProgress {
  solvedIds: string[];
  attemptedIds: string[];
  correctCount: number;
  totalAttempts: number;
  currentStreak: number;
  bestStreak: number;
}

const DRILL_STORAGE_KEY = 'gv_pattern_drills_v1';

const DEFAULT_DRILL_PROGRESS: StoredDrillProgress = {
  solvedIds: [],
  attemptedIds: [],
  correctCount: 0,
  totalAttempts: 0,
  currentStreak: 0,
  bestStreak: 0,
};

function loadDrillProgress(): StoredDrillProgress {
  try {
    const raw = localStorage.getItem(DRILL_STORAGE_KEY);
    if (!raw) return DEFAULT_DRILL_PROGRESS;
    return {
      ...DEFAULT_DRILL_PROGRESS,
      ...(JSON.parse(raw) as Partial<StoredDrillProgress>),
    };
  } catch {
    return DEFAULT_DRILL_PROGRESS;
  }
}

function saveDrillProgress(state: StoredDrillProgress) {
  try {
    localStorage.setItem(DRILL_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

const TIER_FILTERS: Array<{ label: string; value: 'All' | DrillRatingTier }> = [
  { label: 'All Tiers (30)', value: 'All' },
  { label: '800–1400 (6)', value: '800–1400' },
  { label: '1400–1800 (6)', value: '1400–1800' },
  { label: '1800–2200 (6)', value: '1800–2200' },
  { label: '2200–2600 (6)', value: '2200–2600' },
  { label: '2600–3300+ (6)', value: '2600–3300+' },
];

export function PatternDrillView({ onNavigate }: PatternDrillViewProps) {
  const [selectedTier, setSelectedTier] = useState<'All' | DrillRatingTier>(
    'All',
  );
  const [shuffledOrder, setShuffledOrder] = useState<string[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  // 60-Second Rapid-Fire Timer state
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  const [stats, setStats] = useState<StoredDrillProgress>(() =>
    loadDrillProgress(),
  );

  // Build active deck based on tier filter + optional shuffle order
  const activeDeck: DrillScenario[] = useMemo(() => {
    const base =
      selectedTier === 'All'
        ? DRILL_SCENARIOS
        : DRILL_SCENARIOS.filter((d) => d.ratingTier === selectedTier);

    if (!shuffledOrder) return base;
    const byId = new Map(base.map((d) => [d.id, d]));
    const ordered: DrillScenario[] = [];
    for (const id of shuffledOrder) {
      const item = byId.get(id);
      if (item) ordered.push(item);
    }
    for (const item of base) {
      if (!ordered.some((o) => o.id === item.id)) {
        ordered.push(item);
      }
    }
    return ordered;
  }, [selectedTier, shuffledOrder]);

  const activeScenario = activeDeck[currentIndex] ?? activeDeck[0];
  const isRevealed = selectedOption !== null || timedOut;
  const isCorrect =
    selectedOption !== null &&
    activeScenario &&
    selectedOption === activeScenario.correctIndex;

  const resetQuestionState = useCallback(() => {
    setSelectedOption(null);
    setTimedOut(false);
    setSecondsLeft(60);
  }, []);

  // Countdown effect when 60s Rapid-Fire Timer is enabled
  useEffect(() => {
    if (!timerEnabled || isRevealed) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setTimedOut(true);
          setStats((old) => {
            const next: StoredDrillProgress = {
              ...old,
              attemptedIds: old.attemptedIds.includes(activeScenario.id)
                ? old.attemptedIds
                : [...old.attemptedIds, activeScenario.id],
              totalAttempts: old.totalAttempts + 1,
              currentStreak: 0,
            };
            saveDrillProgress(next);
            return next;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerEnabled, isRevealed, activeScenario]);

  const handleSelectTier = (tier: 'All' | DrillRatingTier) => {
    setSelectedTier(tier);
    setShuffledOrder(null);
    setCurrentIndex(0);
    resetQuestionState();
  };

  const handleShuffleDeck = () => {
    const base =
      selectedTier === 'All'
        ? DRILL_SCENARIOS
        : DRILL_SCENARIOS.filter((d) => d.ratingTier === selectedTier);
    const ids = base.map((d) => d.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setShuffledOrder(ids);
    setCurrentIndex(0);
    resetQuestionState();
  };

  const handleChooseOption = (
    idx: number,
    e?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (isRevealed || !activeScenario) return;
    setSelectedOption(idx);

    const won = idx === activeScenario.correctIndex;
    setStats((prev) => {
      const nextStreak = won ? prev.currentStreak + 1 : 0;
      if (won && nextStreak > 0 && nextStreak % 5 === 0) {
        triggerConfettiBurst(e?.clientX, e?.clientY);
      }
      const next: StoredDrillProgress = {
        solvedIds:
          won && !prev.solvedIds.includes(activeScenario.id)
            ? [...prev.solvedIds, activeScenario.id]
            : prev.solvedIds,
        attemptedIds: prev.attemptedIds.includes(activeScenario.id)
          ? prev.attemptedIds
          : [...prev.attemptedIds, activeScenario.id],
        correctCount: won ? prev.correctCount + 1 : prev.correctCount,
        totalAttempts: prev.totalAttempts + 1,
        currentStreak: nextStreak,
        bestStreak: Math.max(prev.bestStreak, nextStreak),
      };
      saveDrillProgress(next);
      return next;
    });
  };

  const handleResetStats = () => {
    setStats(DEFAULT_DRILL_PROGRESS);
    saveDrillProgress(DEFAULT_DRILL_PROGRESS);
    resetQuestionState();
  };

  const accuracyPercent =
    stats.totalAttempts > 0
      ? Math.round((stats.correctCount / stats.totalAttempts) * 100)
      : 0;

  const getTierBadgeStyle = (tier: DrillRatingTier) => {
    switch (tier) {
      case '800–1400':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case '1400–1800':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      case '1800–2200':
        return 'bg-violet-500/15 text-violet-300 border-violet-500/30';
      case '2200–2600':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case '2600–3300+':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    }
  };

  const getVerdictBadgeStyle = (verdict: 'TLE' | 'WA' | 'MLE') => {
    if (verdict === 'TLE') {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
    if (verdict === 'MLE') {
      return 'bg-violet-500/20 text-violet-300 border-violet-500/40';
    }
    return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Live Telemetry Bar */}
      <section className="rounded-xl border border-white/10 bg-[#13151A] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <Target className="w-3.5 h-3.5" />
              Active-Recall Contest Pattern Recognition
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
              &ldquo;Spot the Algorithm&rdquo; Contest Pattern Drills
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              In a live contest, 70% of solving a problem is decoding its input
              constraints and structural invariants into the exact right algorithm
              before writing a single line of code. Test yourself across 30 realistic
              Codeforces &amp; ICPC scenarios (800 to 3300+).
            </p>
          </div>

          {/* Live Score / Streak / Solved Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="rounded-xl border border-white/10 bg-[#0B0C0E] px-4 py-3">
              <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Solved Drills
              </div>
              <div className="font-mono text-xl font-bold text-slate-100 mt-1">
                {stats.solvedIds.length}{' '}
                <span className="text-xs text-slate-500">/ 30</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0B0C0E] px-4 py-3">
              <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Streak
              </div>
              <div className="font-mono text-xl font-bold text-amber-400 mt-1">
                {stats.currentStreak}{' '}
                <span className="text-xs text-slate-500">
                  (Best {stats.bestStreak})
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0B0C0E] px-4 py-3">
              <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-sky-400" />
                Accuracy
              </div>
              <div className="font-mono text-xl font-bold text-slate-100 mt-1">
                {accuracyPercent}%{' '}
                <span className="text-xs text-slate-500">
                  ({stats.correctCount}/{stats.totalAttempts})
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0B0C0E] px-4 py-3 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>60s Timer</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTimerEnabled((v) => !v);
                    setSecondsLeft(60);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition-colors cursor-pointer ${
                    timerEnabled
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-[#13151A] border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {timerEnabled ? `ON · ${secondsLeft}s` : 'Rapid-Fire OFF'}
                </button>
              </div>

              {/* Animated SVG Radial Ring around 60-Second Timer */}
              <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="3.5"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke={
                      !timerEnabled
                        ? '#475569'
                        : secondsLeft > 20
                          ? '#10B981'
                          : secondsLeft > 10
                            ? '#F59E0B'
                            : '#F43F5E'
                    }
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={113.1}
                    strokeDashoffset={
                      timerEnabled ? 113.1 * (1 - secondsLeft / 60) : 0
                    }
                    className="transition-all duration-700 ease-linear"
                  />
                </svg>
                <span className="absolute font-mono text-[10px] font-bold tabular-nums text-slate-200">
                  {timerEnabled ? `${secondsLeft}` : '60'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar + Mixed Contest Shuffle + Reset */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {TIER_FILTERS.map((tf) => (
              <button
                key={tf.value}
                type="button"
                onClick={() => handleSelectTier(tf.value)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer border ${
                  selectedTier === tf.value && !shuffledOrder
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-semibold'
                    : 'bg-[#191C23] border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleShuffleDeck}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold border transition-colors cursor-pointer ${
                shuffledOrder
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-[#191C23] border-white/15 text-slate-200 hover:border-amber-500/40'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-400" />
              Mixed Contest Shuffle
            </button>

            <button
              type="button"
              onClick={handleResetStats}
              title="Reset drill statistics"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#191C23] text-xs font-mono text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Score
            </button>
          </div>
        </div>
      </section>

      {/* Scenario Number Strip (1..N quick navigation pills) */}
      <div className="flex flex-wrap items-center gap-1.5">
        {activeDeck.map((item, idx) => {
          const isCurrent = idx === currentIndex;
          const isSolved = stats.solvedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setCurrentIndex(idx);
                resetQuestionState();
              }}
              className={`h-8 min-w-[2.25rem] px-2 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-sm'
                  : isSolved
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                    : 'bg-[#13151A] border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/25'
              }`}
            >
              #{String(item.number).padStart(2, '0')}
            </button>
          );
        })}
      </div>

      {/* Main Active Drill Card with Question Entrance & Verdict Feedback FX */}
      {activeScenario && (
        <section
          key={activeScenario.id}
          className={`gv-view-enter rounded-xl border border-white/10 bg-[#13151A] overflow-hidden ${
            isRevealed
              ? isCorrect
                ? 'gv-pulse-correct'
                : 'gv-shake-wrong'
              : ''
          }`}
        >
          {/* Optional 60s Countdown Progress Bar */}
          {timerEnabled && (
            <div className="w-full h-1.5 bg-[#0B0C0E]">
              <div
                className={`h-full transition-all duration-1000 ${
                  secondsLeft > 20
                    ? 'bg-emerald-400'
                    : secondsLeft > 10
                      ? 'bg-amber-400'
                      : 'bg-rose-500'
                }`}
                style={{ width: `${(secondsLeft / 60) * 100}%` }}
              />
            </div>
          )}

          <div className="p-6 sm:p-8 space-y-6">
            {/* Scenario Metadata Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-200">
                  Scenario #{String(activeScenario.number).padStart(2, '0')} of{' '}
                  {DRILL_SCENARIOS.length}
                </span>
                <span
                  className={`font-mono text-xs font-bold px-2.5 py-1 rounded border ${getTierBadgeStyle(
                    activeScenario.ratingTier,
                  )}`}
                >
                  Rated {activeScenario.ratingTier}
                </span>
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#0B0C0E] border border-white/10 text-slate-400">
                  {activeScenario.domain}
                </span>
                {stats.solvedIds.includes(activeScenario.id) && (
                  <span className="inline-flex items-center gap-1 font-mono text-xs px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Solved
                  </span>
                )}
              </div>

              {/* Prev / Next Navigation */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => {
                    setCurrentIndex((i) => Math.max(0, i - 1));
                    resetQuestionState();
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 bg-[#191C23] text-xs font-mono text-slate-300 hover:border-white/25 disabled:opacity-40 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Prev
                </button>
                <span className="font-mono text-xs text-slate-400 px-1">
                  {currentIndex + 1} / {activeDeck.length}
                </span>
                <button
                  type="button"
                  disabled={currentIndex >= activeDeck.length - 1}
                  onClick={() => {
                    setCurrentIndex((i) =>
                      Math.min(activeDeck.length - 1, i + 1),
                    );
                    resetQuestionState();
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 bg-[#191C23] text-xs font-mono text-slate-300 hover:border-white/25 disabled:opacity-40 cursor-pointer"
                >
                  Next
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Problem Title & Statement */}
            <div className="space-y-3">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
                {activeScenario.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {activeScenario.problemSummary}
              </p>
            </div>

            {/* Explicit Contest Constraints Box */}
            <div className="rounded-xl border border-amber-500/30 bg-[#0B0C0E] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Contest Constraints &amp; Bottleneck Clue
                </div>
                <div className="font-mono text-sm font-bold text-slate-100">
                  {activeScenario.constraints}
                </div>
              </div>
              {isRevealed && (
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 font-mono text-xs font-bold text-emerald-300 shrink-0">
                  Target Complexity: {activeScenario.targetComplexity}
                </div>
              )}
            </div>

            {/* 4 Algorithm Options */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Select the Optimal Algorithm &amp; Data Structure Reduction:
              </div>
              <div className="grid grid-cols-1 gap-3">
                {activeScenario.options.map((optionText, idx) => {
                  const isThisCorrect = idx === activeScenario.correctIndex;
                  const isThisSelected = selectedOption === idx;

                  let cardStyle =
                    'border-white/10 bg-[#191C23] hover:border-amber-500/50 hover:bg-[#1E222B] text-slate-200';
                  if (isRevealed) {
                    if (isThisCorrect) {
                      cardStyle =
                        'border-emerald-500/60 bg-emerald-500/10 text-emerald-200';
                    } else if (isThisSelected) {
                      cardStyle =
                        'border-rose-500/60 bg-rose-500/10 text-rose-200';
                    } else {
                      cardStyle =
                        'border-white/10 bg-[#0B0C0E]/60 text-slate-400 opacity-75';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isRevealed}
                      onClick={(e) => handleChooseOption(idx, e)}
                      className={`w-full text-left rounded-xl border p-4 transition-all flex items-center justify-between gap-4 cursor-pointer disabled:cursor-default ${
                        isRevealed && isThisCorrect ? 'gv-pulse-correct ' : ''
                      }${
                        isRevealed && isThisSelected && !isThisCorrect
                          ? 'gv-shake-wrong '
                          : ''
                      }${cardStyle}`}
                    >
                      <div className="flex items-start gap-3.5">
                        <span
                          className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 border ${
                            isRevealed && isThisCorrect
                              ? 'bg-emerald-500 text-zinc-950 border-emerald-400'
                              : isRevealed && isThisSelected && !isThisCorrect
                                ? 'bg-rose-500 text-white border-rose-400'
                                : 'bg-[#0B0C0E] text-slate-300 border-white/15'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm sm:text-base font-medium leading-snug pt-0.5">
                          {optionText}
                        </span>
                      </div>

                      {isRevealed && isThisCorrect && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 font-mono text-xs font-bold text-emerald-300 shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                          AC · Optimal
                        </span>
                      )}
                      {isRevealed && isThisSelected && !isThisCorrect && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/40 font-mono text-xs font-bold text-rose-300 shrink-0">
                          <XCircle className="w-4 h-4" />
                          Your Choice
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Post-Selection Detailed Explanation & Proof Breakdown */}
            {isRevealed && (
              <div className="pt-4 border-t border-white/10 space-y-5 animate-fadeIn">
                {/* Verdict Banner */}
                <div
                  className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCorrect
                      ? 'border-emerald-500/40 bg-emerald-500/10'
                      : 'border-rose-500/40 bg-rose-500/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <div
                        className={`font-display text-base font-bold ${
                          isCorrect ? 'text-emerald-300' : 'text-rose-300'
                        }`}
                      >
                        {isCorrect
                          ? 'Accepted (AC) — Exact Complexity & Invariant Match!'
                          : timedOut
                            ? 'Time Limit Exceeded (60s Rapid-Fire Timer Expired)'
                            : 'Suboptimal Reduction — Review the Bottleneck Proof Below'}
                      </div>
                      <div className="text-xs text-slate-300 font-mono mt-0.5">
                        Optimal Paradigm:{' '}
                        {activeScenario.options[activeScenario.correctIndex]} (
                        {activeScenario.targetComplexity})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        onNavigate(
                          `/theory/${activeScenario.linkedChapterSlug}`,
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-zinc-950 font-semibold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Study Full 5-Tab Chapter
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {currentIndex < activeDeck.length - 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentIndex((i) => i + 1);
                          resetQuestionState();
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/15 bg-[#191C23] text-slate-100 font-semibold text-xs hover:border-white/30 transition-colors cursor-pointer"
                      >
                        Next Drill
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Why the Correct Algorithm Works */}
                <div className="rounded-xl border border-emerald-500/30 bg-[#0B0C0E] p-5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      Why the Optimal Algorithm Works (Invariant &amp; Complexity Proof)
                    </span>
                    <span className="font-mono text-xs text-emerald-300">
                      {activeScenario.targetComplexity}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {activeScenario.whyCorrect}
                  </p>
                </div>

                {/* Why the Other 3 Options Fail (TLE / WA / MLE) */}
                <div className="space-y-3">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-rose-400">
                    Why the Other 3 Approaches Fail (TLE / WA / MLE Analysis):
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {activeScenario.whyOthersFail.map((fail) => (
                      <div
                        key={fail.optionIndex}
                        className="rounded-xl border border-white/10 bg-[#0B0C0E] p-4 space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs font-bold text-slate-400">
                              Option {String.fromCharCode(65 + fail.optionIndex)}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold border ${getVerdictBadgeStyle(
                                fail.failureVerdict,
                              )}`}
                            >
                              {fail.failureVerdict}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-200 leading-snug">
                            {fail.optionLabel}
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {fail.reason}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Linked Theory Chapter Footer Callout */}
                <div className="rounded-xl border border-white/10 bg-[#191C23] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-mono uppercase text-amber-400">
                      Linked Master Syllabus Chapter
                    </div>
                    <div className="font-display text-base font-bold text-slate-100">
                      {activeScenario.linkedChapterTitle}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate(`/theory/${activeScenario.linkedChapterSlug}`)
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 font-mono text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Open 5-Tab Chapter + 5-Language Templates
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
