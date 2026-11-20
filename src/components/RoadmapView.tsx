import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Compass,
  Cpu,
  Flame,
  Layers,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import {
  CONSTRAINT_DECODER_ROWS,
  RATING_TIER_META,
  ROADMAP_TRACKS,
  type RoadmapTrack,
  type RoadmapTrackId,
  type TopicMasteryStatus,
} from '../data/roadmaps';
import type {
  RatingTier,
  SyllabusTopic,
  TheoryChapter,
  UserProgressState,
  VaultBreakdown,
} from '../types/vault';
import { AnimatedCounter } from './fx/AnimatedCounter';
import { BorderBeamCard } from './fx/BorderBeamCard';
import { triggerConfettiBurst } from './fx/ConfettiBurst';
import { ScrollReveal } from './fx/ScrollReveal';
import { SpotlightCard } from './fx/SpotlightCard';

export interface RoadmapViewProps {
  syllabus: SyllabusTopic[];
  chapters: TheoryChapter[];
  vaults: VaultBreakdown[];
  progress: UserProgressState;
  onSelectRatingTier: (tier: RatingTier) => void;
  onNavigate: (path: string) => void;
  onToggleComplete?: (slug: string) => void;
}

const MASTERY_STORAGE_KEY = 'gv_topic_mastery_v1';

function loadStoredMasteryMap(): Record<string, TopicMasteryStatus> {
  try {
    const raw = localStorage.getItem(MASTERY_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, TopicMasteryStatus>;
  } catch {
    return {};
  }
}

function saveStoredMasteryMap(map: Record<string, TopicMasteryStatus>) {
  try {
    localStorage.setItem(MASTERY_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore storage quota errors
  }
}

export function RoadmapView({
  syllabus,
  chapters,
  vaults,
  progress,
  onSelectRatingTier,
  onNavigate,
  onToggleComplete,
}: RoadmapViewProps) {
  const [selectedConstraintIdx, setSelectedConstraintIdx] = useState(4); // N <= 2 * 10^5 default
  const [activeTrackId, setActiveTrackId] = useState<RoadmapTrackId>(
    'track-1-foundation',
  );
  const [statusFilter, setStatusFilter] = useState<
    'all' | TopicMasteryStatus
  >('all');
  const [masteryMap, setMasteryMap] = useState<
    Record<string, TopicMasteryStatus>
  >(() => loadStoredMasteryMap());

  // Sync progress.completedTopics (from Supabase / main progress state) into masteryMap
  useEffect(() => {
    setMasteryMap((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const slug of progress.completedTopics) {
        if (next[slug] !== 'mastered') {
          next[slug] = 'mastered';
          changed = true;
        }
      }
      if (changed) {
        saveStoredMasteryMap(next);
        return next;
      }
      return prev;
    });
  }, [progress.completedTopics]);

  const activeConstraint = CONSTRAINT_DECODER_ROWS[selectedConstraintIdx];

  const syllabusBySlug = useMemo(() => {
    const map = new Map<string, SyllabusTopic>();
    for (const item of syllabus) {
      map.set(item.slug, item);
    }
    return map;
  }, [syllabus]);

  const getTopicStatus = (slug: string): TopicMasteryStatus => {
    if (progress.completedTopics.includes(slug)) return 'mastered';
    return masteryMap[slug] ?? 'not_started';
  };

  const cycleTopicStatus = (
    slug: string,
    e?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const current = getTopicStatus(slug);
    const nextStatus: TopicMasteryStatus =
      current === 'not_started'
        ? 'learning'
        : current === 'learning'
          ? 'mastered'
          : 'not_started';

    setMasteryMap((prev) => {
      const updated = { ...prev, [slug]: nextStatus };
      saveStoredMasteryMap(updated);
      return updated;
    });

    if (nextStatus === 'mastered') {
      triggerConfettiBurst(e?.clientX, e?.clientY);
    }

    if (onToggleComplete) {
      const isCurrentlyCompleted = progress.completedTopics.includes(slug);
      if (nextStatus === 'mastered' && !isCurrentlyCompleted) {
        onToggleComplete(slug);
      } else if (nextStatus !== 'mastered' && isCurrentlyCompleted) {
        onToggleComplete(slug);
      }
    }
  };

  const setExplicitTopicStatus = (
    slug: string,
    nextStatus: TopicMasteryStatus,
    e?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setMasteryMap((prev) => {
      const updated = { ...prev, [slug]: nextStatus };
      saveStoredMasteryMap(updated);
      return updated;
    });

    if (nextStatus === 'mastered') {
      triggerConfettiBurst(e?.clientX, e?.clientY);
    }

    if (onToggleComplete) {
      const isCurrentlyCompleted = progress.completedTopics.includes(slug);
      if (nextStatus === 'mastered' && !isCurrentlyCompleted) {
        onToggleComplete(slug);
      } else if (nextStatus !== 'mastered' && isCurrentlyCompleted) {
        onToggleComplete(slug);
      }
    }
  };

  // Compute global and per-track statistics
  const masteryStats = useMemo(() => {
    let masteredCount = 0;
    let learningCount = 0;
    const totalCount = syllabus.length;

    const perTrack: Record<
      RoadmapTrackId,
      {
        mastered: number;
        learning: number;
        total: number;
        percent: number;
        nextTopic: SyllabusTopic | null;
      }
    > = {
      'track-1-foundation': {
        mastered: 0,
        learning: 0,
        total: 0,
        percent: 0,
        nextTopic: null,
      },
      'track-2-gold-core': {
        mastered: 0,
        learning: 0,
        total: 0,
        percent: 0,
        nextTopic: null,
      },
      'track-3-platinum-cm': {
        mastered: 0,
        learning: 0,
        total: 0,
        percent: 0,
        nextTopic: null,
      },
      'track-4-master-icpc': {
        mastered: 0,
        learning: 0,
        total: 0,
        percent: 0,
        nextTopic: null,
      },
      'track-5-grandmaster-wf': {
        mastered: 0,
        learning: 0,
        total: 0,
        percent: 0,
        nextTopic: null,
      },
    };

    for (const topic of syllabus) {
      const st = getTopicStatus(topic.slug);
      if (st === 'mastered') masteredCount++;
      else if (st === 'learning') learningCount++;
    }

    for (const track of ROADMAP_TRACKS) {
      let tMastered = 0;
      let tLearning = 0;
      let firstLearning: SyllabusTopic | null = null;
      let firstNotStarted: SyllabusTopic | null = null;

      for (const slug of track.topicSlugs) {
        const topic = syllabusBySlug.get(slug);
        if (!topic) continue;
        const st = getTopicStatus(slug);
        if (st === 'mastered') {
          tMastered++;
        } else if (st === 'learning') {
          tLearning++;
          if (!firstLearning) firstLearning = topic;
        } else if (!firstNotStarted) {
          firstNotStarted = topic;
        }
      }

      const total = track.topicSlugs.length;
      const percent = total > 0 ? Math.round((tMastered / total) * 100) : 0;
      perTrack[track.id] = {
        mastered: tMastered,
        learning: tLearning,
        total,
        percent,
        nextTopic: firstLearning ?? firstNotStarted,
      };
    }

    const overallPercent =
      totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

    return {
      masteredCount,
      learningCount,
      notStartedCount: Math.max(0, totalCount - masteredCount - learningCount),
      totalCount,
      overallPercent,
      perTrack,
    };
  }, [syllabus, syllabusBySlug, masteryMap, progress.completedTopics]);

  const activeTrack: RoadmapTrack =
    ROADMAP_TRACKS.find((t) => t.id === activeTrackId) ?? ROADMAP_TRACKS[0];
  const activeTrackStats = masteryStats.perTrack[activeTrack.id];

  // Recommended Next Topic: prefer active track's first unmastered topic, or fall back to first global unmastered topic
  const recommendedNextTopic = useMemo(() => {
    if (activeTrackStats?.nextTopic) return activeTrackStats.nextTopic;
    for (const track of ROADMAP_TRACKS) {
      const candidate = masteryStats.perTrack[track.id]?.nextTopic;
      if (candidate) return candidate;
    }
    return syllabus[0] ?? null;
  }, [activeTrackStats, masteryStats, syllabus]);

  const activeTrackTopics = useMemo(() => {
    const list: SyllabusTopic[] = [];
    for (const slug of activeTrack.topicSlugs) {
      const t = syllabusBySlug.get(slug);
      if (t) list.push(t);
    }
    if (statusFilter === 'all') return list;
    return list.filter((t) => getTopicStatus(t.slug) === statusFilter);
  }, [
    activeTrack,
    syllabusBySlug,
    statusFilter,
    masteryMap,
    progress.completedTopics,
  ]);

  const getTrackAccentClasses = (
    accent: RoadmapTrack['accentColor'],
    isSelected: boolean,
  ) => {
    const map = {
      emerald: {
        border: isSelected
          ? 'border-emerald-500/60 bg-emerald-500/10'
          : 'border-white/10 bg-[#13151A] hover:border-emerald-500/30',
        badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        bar: 'bg-emerald-400',
        text: 'text-emerald-400',
      },
      sky: {
        border: isSelected
          ? 'border-sky-500/60 bg-sky-500/10'
          : 'border-white/10 bg-[#13151A] hover:border-sky-500/30',
        badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
        bar: 'bg-sky-400',
        text: 'text-sky-400',
      },
      violet: {
        border: isSelected
          ? 'border-violet-500/60 bg-violet-500/10'
          : 'border-white/10 bg-[#13151A] hover:border-violet-500/30',
        badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
        bar: 'bg-violet-400',
        text: 'text-violet-400',
      },
      amber: {
        border: isSelected
          ? 'border-amber-500/60 bg-amber-500/10'
          : 'border-white/10 bg-[#13151A] hover:border-amber-500/30',
        badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        bar: 'bg-amber-400',
        text: 'text-amber-400',
      },
      rose: {
        border: isSelected
          ? 'border-rose-500/60 bg-rose-500/10'
          : 'border-white/10 bg-[#13151A] hover:border-rose-500/30',
        badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        bar: 'bg-rose-400',
        text: 'text-rose-400',
      },
    };
    return map[accent];
  };

  return (
    <div className="space-y-12">
      {/* Hero Featured Card with Overhead Spotlight Beam, Shimmer Gold Headline & Count-Up Counters */}
      <BorderBeamCard
        enableTilt={false}
        innerClassName="relative p-6 sm:p-8"
      >
        {/* Overhead Soft Spotlight Beam */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/3 h-64 w-[520px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.20) 0%, rgba(245, 158, 11, 0.04) 55%, transparent 80%)',
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-amber-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30">
                <Zap className="w-3.5 h-3.5" />
                Active-Recall Learning Engine
              </span>
              <span className="text-slate-400">
                Codeforces 800 → 3300+ · USACO Bronze → Platinum · ICPC World Finals
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-slate-100 text-balance">
              From Brute-Force Intuition to{' '}
              <span className="gv-shimmer-gold-text">
                Grandmaster Invariants.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              Every competitive programming problem is a series of formal state
              reductions. Track your progression across 5 structured Rating-Climb
              Roadmaps covering all 80 master chapters, reverse-engineer time
              complexities from <code className="font-mono text-amber-300">N</code>,
              and test your pattern intuition with 30 interactive contest drills.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/drills')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-zinc-950 font-semibold text-sm hover:bg-amber-400 transition-colors cursor-pointer"
              >
                <Target className="w-4 h-4" />
                Launch &ldquo;Spot the Algorithm&rdquo; Pattern Drills (30)
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/theory')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/15 bg-[#191C23] text-slate-200 font-medium text-sm hover:border-white/30 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                Browse All 80 Theory Guides
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/vault')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/15 bg-[#191C23] text-slate-200 font-medium text-sm hover:border-white/30 transition-colors cursor-pointer"
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                3300+ Problem Reduction Vault
              </button>
            </div>
          </div>

          {/* 4 Animated Count-Up Stat Counters */}
          <div className="grid grid-cols-2 gap-3 sm:min-w-[290px] shrink-0">
            <div className="rounded-xl border border-white/10 bg-[#0B0C0E]/90 p-3.5">
              <div className="font-display text-2xl font-bold text-amber-400">
                <AnimatedCounter value={80} />
              </div>
              <div className="text-xs font-mono text-slate-300 mt-0.5">
                Full Theory Guides
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                240 Practice Tiers
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0B0C0E]/90 p-3.5">
              <div className="font-display text-2xl font-bold text-emerald-400">
                <AnimatedCounter value={10} />
              </div>
              <div className="text-xs font-mono text-slate-300 mt-0.5">
                Vault Breakdowns
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                1900–3300+ Rated
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0B0C0E]/90 p-3.5">
              <div className="font-display text-2xl font-bold text-slate-100">
                <AnimatedCounter value={5} />
              </div>
              <div className="text-xs font-mono text-slate-300 mt-0.5">
                Contest Languages
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                C++20 · Rust · Java
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0B0C0E]/90 p-3.5">
              <div className="font-display text-2xl font-bold text-amber-300">
                <AnimatedCounter value={30} />
              </div>
              <div className="text-xs font-mono text-slate-300 mt-0.5">
                Contest Drills
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                60s Rapid-Fire
              </div>
            </div>
          </div>
        </div>
      </BorderBeamCard>

      {/* Feature 1: Rating-Climb Roadmaps & Interactive Mastery Tracker */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
              <Compass className="w-3.5 h-3.5" />
              5-Track Rating-Climb Progression
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
              Rating-Climb Roadmaps &amp; 80-Topic Mastery Tracker
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Click any topic’s status badge to cycle{' '}
              <span className="font-mono text-slate-300">Not Started</span> →{' '}
              <span className="font-mono text-amber-300">Learning</span> →{' '}
              <span className="font-mono text-emerald-300">Mastered</span>, or
              open its full 5-tab theory guide and practice suite.
            </p>
          </div>

          {/* Global 80-Topic Mastery Progress Summary Card */}
          <div className="rounded-xl border border-white/10 bg-[#13151A] p-4 sm:min-w-[360px]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Overall Vault Mastery
              </span>
              <span className="font-mono font-bold text-slate-100">
                {masteryStats.masteredCount} / {masteryStats.totalCount} Mastered (
                {masteryStats.overallPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#0B0C0E] border border-white/10 overflow-hidden flex">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{
                  width: `${
                    (masteryStats.masteredCount /
                      Math.max(1, masteryStats.totalCount)) *
                    100
                  }%`,
                }}
              />
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{
                  width: `${
                    (masteryStats.learningCount /
                      Math.max(1, masteryStats.totalCount)) *
                    100
                  }%`,
                }}
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {masteryStats.masteredCount} Mastered
              </span>
              <span className="inline-flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {masteryStats.learningCount} Learning
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-600" />
                {masteryStats.notStartedCount} Not Started
              </span>
            </div>
          </div>
        </div>

        {/* Recommended Next Topic Spotlight Card wrapped in BorderBeamCard */}
        {recommendedNextTopic && (
          <BorderBeamCard
            enableTilt={true}
            maxTiltDeg={2.5}
            innerClassName="bg-gradient-to-r from-amber-500/10 via-[#13151A] to-[#13151A] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 font-mono text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  Recommended Next Topic
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {activeTrack.title} · #{String(recommendedNextTopic.number).padStart(2, '0')}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[11px] text-slate-300">
                  {recommendedNextTopic.ratingTier} · {recommendedNextTopic.complexity}
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-slate-100">
                {recommendedNextTopic.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                {recommendedNextTopic.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={(e) => cycleTopicStatus(recommendedNextTopic.slug, e)}
                className="px-3.5 py-2 rounded-lg border border-white/15 bg-[#191C23] hover:border-amber-500/40 text-xs font-mono font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                {getTopicStatus(recommendedNextTopic.slug) === 'learning'
                  ? 'Mark Mastered ✓'
                  : 'Start Learning →'}
              </button>
              <button
                type="button"
                onClick={() =>
                  onNavigate(`/theory/${recommendedNextTopic.slug}`)
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-zinc-950 font-semibold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Open 5-Tab Chapter Guide
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </BorderBeamCard>
        )}

        {/* 5 Track Selector Cards + Animated SVG Dashed-Energy Flow Connectors */}
        <div className="relative">
          {/* Desktop Animated SVG Dashed-Energy Flow Pipeline behind the 5 Tracks */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 32"
            preserveAspectRatio="none"
            className="hidden lg:block pointer-events-none absolute -top-4 left-0 right-0 w-full h-5"
          >
            {[0, 1, 2, 3].map((segIdx) => {
              const segTrack = ROADMAP_TRACKS[segIdx];
              const segStats = masteryStats.perTrack[segTrack.id];
              const isTrackComplete = segStats.percent === 100;
              const isTrackStarted =
                segStats.mastered > 0 || segStats.learning > 0;
              const x1 = 100 + segIdx * 200;
              const x2 = 100 + (segIdx + 1) * 200;
              return (
                <g key={segTrack.id}>
                  <line
                    x1={x1}
                    y1="16"
                    x2={x2}
                    y2="16"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="2"
                  />
                  <line
                    x1={x1}
                    y1="16"
                    x2={x2}
                    y2="16"
                    stroke={
                      isTrackComplete
                        ? '#10B981'
                        : isTrackStarted
                          ? '#F59E0B'
                          : 'rgba(148,163,184,0.35)'
                    }
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    className={
                      isTrackComplete || isTrackStarted
                        ? 'gv-energy-flow-line'
                        : ''
                    }
                  />
                  <circle
                    cx={x1}
                    cy="16"
                    r="4.5"
                    fill={
                      isTrackComplete
                        ? '#10B981'
                        : isTrackStarted
                          ? '#F59E0B'
                          : '#334155'
                    }
                  />
                  {segIdx === 3 && (
                    <circle
                      cx={x2}
                      cy="16"
                      r="4.5"
                      fill={
                        masteryStats.perTrack[ROADMAP_TRACKS[4].id].percent ===
                        100
                          ? '#10B981'
                          : '#F59E0B'
                      }
                    />
                  )}
                </g>
              );
            })}
          </svg>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
            {ROADMAP_TRACKS.map((track) => {
              const isSelected = track.id === activeTrack.id;
              const stats = masteryStats.perTrack[track.id];
              const accent = getTrackAccentClasses(
                track.accentColor,
                isSelected,
              );

              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => setActiveTrackId(track.id)}
                  className={`text-left rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between gap-3 ${accent.border}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${accent.badge}`}
                      >
                        {track.ratingRange}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-200">
                        {stats.percent}%
                      </span>
                    </div>
                    <div className="font-display text-sm font-bold text-slate-100 leading-snug">
                      Track {track.trackNumber}:{' '}
                      {track.title.replace(/^Track \d+ — /, '')}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {track.subtitle}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="w-full h-1.5 rounded-full bg-[#0B0C0E] overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${accent.bar}`}
                        style={{ width: `${stats.percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>
                        {stats.mastered}/{stats.total} Mastered
                      </span>
                      {stats.learning > 0 && (
                        <span className="text-amber-400">
                          {stats.learning} Active
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Track Detail Header + Status Filters */}
        <div className="rounded-xl border border-white/10 bg-[#13151A] p-5 sm:p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                  {activeTrack.usacoDivision}
                </span>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-xs text-slate-400">
                  {activeTrackStats.mastered} of {activeTrackStats.total} topics
                  mastered ({activeTrackStats.percent}%)
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-slate-100">
                {activeTrack.title} ({activeTrack.ratingRange})
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
                {activeTrack.targetMilestone}
              </p>
            </div>

            {/* Filter by status */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {(
                [
                  { id: 'all', label: `All (${activeTrack.topicSlugs.length})` },
                  { id: 'not_started', label: 'Not Started' },
                  { id: 'learning', label: 'Learning' },
                  { id: 'mastered', label: 'Mastered' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors cursor-pointer border ${
                    statusFilter === tab.id
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-semibold'
                      : 'bg-[#191C23] border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Core Track Competencies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {activeTrack.coreSkills.map((skill, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-white/10 bg-[#0B0C0E]/70 px-3.5 py-2.5 text-xs text-slate-300 flex items-start gap-2"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{skill}</span>
              </div>
            ))}
          </div>

          {/* Ordered Topic Nodes Grid for Active Track with SpotlightCard & SVG Energy Connectors */}
          {activeTrackTopics.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-[#0B0C0E] p-8 text-center text-sm text-slate-400">
              No topics in this track match the selected filter. Switch to{' '}
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className="text-amber-400 underline cursor-pointer"
              >
                All topics
              </button>
              .
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {activeTrackTopics.map((topic, index) => {
                const status = getTopicStatus(topic.slug);
                const isRecommended =
                  recommendedNextTopic?.slug === topic.slug;

                return (
                  <ScrollReveal key={topic.slug} index={index}>
                    <SpotlightCard
                      className={`h-full rounded-xl border p-4 transition-all ${
                        status === 'mastered'
                          ? 'border-emerald-500/35 bg-emerald-500/[0.04]'
                          : status === 'learning'
                            ? 'border-amber-500/40 bg-amber-500/[0.05]'
                            : isRecommended
                              ? 'border-amber-500/30 bg-[#191C23]'
                              : 'border-white/10 bg-[#191C23]/80 hover:border-white/20'
                      }`}
                    >
                      <div className="flex flex-col justify-between gap-3 h-full">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                                Step {index + 1} · #
                                {String(topic.number).padStart(2, '0')}
                              </span>
                              <span className="font-mono text-[11px] text-amber-400">
                                {topic.complexity}
                              </span>
                            </div>

                            {/* Interactive 3-state cycle button */}
                            <button
                              type="button"
                              onClick={(e) => cycleTopicStatus(topic.slug, e)}
                              title="Click to cycle: Not Started → Learning → Mastered"
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold border transition-colors cursor-pointer ${
                                status === 'mastered'
                                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                                  : status === 'learning'
                                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                                    : 'bg-[#0B0C0E] border-white/15 text-slate-400 hover:text-slate-200 hover:border-white/30'
                              }`}
                            >
                              {status === 'mastered' ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  Mastered
                                </>
                              ) : status === 'learning' ? (
                                <>
                                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                                  Learning
                                </>
                              ) : (
                                <>
                                  <Circle className="w-3.5 h-3.5 text-slate-500" />
                                  Not Started
                                </>
                              )}
                            </button>
                          </div>

                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                onNavigate(`/theory/${topic.slug}`)
                              }
                              className="text-left font-display text-base font-bold text-slate-100 hover:text-amber-400 transition-colors cursor-pointer"
                            >
                              {topic.title}
                            </button>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                              {topic.summary}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-mono text-slate-400">
                              {topic.domain}
                            </span>
                            <span className="text-slate-600">·</span>
                            <span className="text-[11px] font-mono text-slate-400">
                              USACO {topic.usacoDivision}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {status !== 'mastered' && (
                              <button
                                type="button"
                                onClick={(e) =>
                                  setExplicitTopicStatus(
                                    topic.slug,
                                    'mastered',
                                    e,
                                  )
                                }
                                className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 cursor-pointer"
                              >
                                Mark Mastered
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                onNavigate(`/theory/${topic.slug}`)
                              }
                              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
                            >
                              Open Guide
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Reverse-Engineering Constraints Decoder ($10^8$ ops/sec) */}
      <section className="rounded-xl border border-white/10 bg-[#13151A] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
              <Cpu className="w-3.5 h-3.5" />
              10⁸ Operations / Second Rule
            </div>
            <h2 className="font-display text-xl font-bold text-slate-100">
              Reverse-Engineering Constraints Decoder
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Select the input bound <code className="font-mono text-slate-200">N</code> from a
            problem statement to see which time complexities pass within a 1.0s–2.0s contest limit.
          </p>
        </div>

        {/* Selector buttons */}
        <div className="flex flex-wrap gap-2">
          {CONSTRAINT_DECODER_ROWS.map((row, idx) => (
            <button
              key={row.constraint}
              type="button"
              onClick={() => setSelectedConstraintIdx(idx)}
              className={`px-3.5 py-2 rounded-lg font-mono text-xs transition-all cursor-pointer border ${
                selectedConstraintIdx === idx
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-semibold'
                  : 'bg-[#191C23] border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
              }`}
            >
              {row.constraint}
            </button>
          ))}
        </div>

        {/* Active decoded card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="rounded-lg border border-white/10 bg-[#0B0C0E] p-4">
            <div className="text-xs font-mono uppercase text-slate-500 mb-1">
              Input Bound &amp; Max Complexity
            </div>
            <div className="font-mono text-lg font-bold text-amber-400">
              {activeConstraint.constraint}
            </div>
            <div className="font-mono text-sm text-emerald-400 mt-1">
              Target: {activeConstraint.maxComplexity}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#0B0C0E] p-4">
            <div className="text-xs font-mono uppercase text-slate-500 mb-1">
              Canonical Algorithm Paradigms
            </div>
            <div className="text-sm font-medium text-slate-200 leading-snug">
              {activeConstraint.targetParadigms}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#0B0C0E] p-4">
            <div className="text-xs font-mono uppercase text-slate-500 mb-1">
              Why Slower Approaches Fail
            </div>
            <div className="text-sm text-rose-300 leading-snug">
              {activeConstraint.warning}
            </div>
          </div>
        </div>
      </section>

      {/* 6 Rating Tier Progression Matrix */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-100">
              6-Tier Rating Syllabus Filter (800 → 3300+)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any rating tier to jump directly into its filtered theory
              catalog.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/theory')}
            className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            View all {syllabus.length} topics <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RATING_TIER_META.map((item) => {
            const count = syllabus.filter(
              (s) => s.ratingTier === item.tier,
            ).length;
            return (
              <button
                key={item.tier}
                type="button"
                onClick={() => {
                  onSelectRatingTier(item.tier);
                  onNavigate('/theory');
                }}
                className="text-left rounded-xl border border-white/10 bg-[#13151A] hover:bg-[#191C23] hover:border-amber-500/40 p-5 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-white/5 text-amber-300 border border-white/10">
                    {item.tier}
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    {count} topics · USACO {item.usaco}
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors mb-1.5">
                  {item.label}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {item.focus}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Flagship Deep-Dives & Vault Reductions */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flagship Theory Guides */}
        <div className="rounded-xl border border-white/10 bg-[#13151A] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h2 className="font-display text-lg font-bold text-slate-100">
                Flagship 5-Tab Theory Guides ({chapters.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/theory')}
              className="text-xs text-amber-400 hover:underline cursor-pointer"
            >
              All chapters →
            </button>
          </div>

          <div className="space-y-2.5">
            {chapters.slice(0, 5).map((ch) => (
              <button
                key={ch.slug}
                type="button"
                onClick={() => onNavigate(`/theory/${ch.slug}`)}
                className="w-full text-left rounded-lg border border-white/10 bg-[#0B0C0E] hover:border-amber-500/40 p-3.5 transition-all flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="font-medium text-sm text-slate-100 truncate">
                    {ch.title}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {ch.domain} · {ch.ratingTier} · {ch.timeComplexity}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* 1900-3300 Problem Vault */}
        <div className="rounded-xl border border-white/10 bg-[#13151A] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h2 className="font-display text-lg font-bold text-slate-100">
                1900–3300 Problem Reduction Vault ({vaults.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/vault')}
              className="text-xs text-amber-400 hover:underline cursor-pointer"
            >
              Open Vault →
            </button>
          </div>

          <div className="space-y-2.5">
            {vaults.map((v) => (
              <button
                key={v.slug}
                type="button"
                onClick={() => onNavigate(`/vault/${v.slug}`)}
                className="w-full text-left rounded-lg border border-white/10 bg-[#0B0C0E] hover:border-emerald-500/40 p-3.5 transition-all flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="font-medium text-sm text-slate-100 truncate">
                    {v.title}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {v.sourceTag} · Rated {v.rating} · {v.stage5Solutions.timeComplexity}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
