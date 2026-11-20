import { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  ExternalLink,
  Lightbulb,
} from 'lucide-react';
import { CodeViewer } from '../components/CodeViewer';
import { DomainHeroBackdrop } from '../components/fx/DomainHeroBackdrop';
import { ScrollReveal } from '../components/fx/ScrollReveal';
import { SpotlightCard } from '../components/fx/SpotlightCard';
import { TracePlayer } from '../components/TracePlayer';
import { MASTER_DOMAINS } from '../components/WorkspaceToolbar';
import type {
  MasterDomain,
  RatingTier,
  SyllabusTopic,
  TheoryChapter,
  UsacoDivision,
  UserProgressState,
} from '../types/vault';

interface TheoryViewProps {
  slug?: string;
  syllabus: SyllabusTopic[];
  chapters: TheoryChapter[];
  selectedTier: RatingTier | 'All';
  selectedUsaco: UsacoDivision | 'All';
  selectedDomain: MasterDomain | 'All';
  progress: UserProgressState;
  onToggleComplete: (slug: string) => void;
  onToggleBookmark: (slug: string) => void;
  onToggleSolvedProblem: (problemId: string) => void;
  onToggleProjectMilestone: (chapterSlug: string, milestoneId: string) => void;
  onNavigate: (path: string) => void;
}

type ChapterTab = 'intuition' | 'code' | 'practice' | 'radar' | 'project';

export function TheoryView({
  slug,
  syllabus,
  chapters,
  selectedTier,
  selectedUsaco,
  selectedDomain,
  progress,
  onToggleComplete,
  onToggleBookmark,
  onToggleSolvedProblem,
  onToggleProjectMilestone,
  onNavigate,
}: TheoryViewProps) {
  const [liveOnly, setLiveOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<ChapterTab>('intuition');
  const [openHints, setOpenHints] = useState<Record<string, boolean>>({});
  const [openSolutions, setOpenSolutions] = useState<Record<string, boolean>>({});

  const chapter = useMemo(
    () => (slug ? chapters.find((c) => c.slug === slug) : undefined),
    [slug, chapters],
  );

  const chapterSlugs = useMemo(
    () => new Set(chapters.map((c) => c.slug)),
    [chapters],
  );

  const filteredSyllabus = useMemo(() => {
    return syllabus.filter((topic) => {
      if (selectedTier !== 'All' && topic.ratingTier !== selectedTier)
        return false;
      if (selectedUsaco !== 'All' && topic.usacoDivision !== selectedUsaco)
        return false;
      if (selectedDomain !== 'All' && topic.domain !== selectedDomain)
        return false;
      if (liveOnly && !chapterSlugs.has(topic.slug)) return false;
      return true;
    });
  }, [
    syllabus,
    selectedTier,
    selectedUsaco,
    selectedDomain,
    liveOnly,
    chapterSlugs,
  ]);

  if (slug && !chapter) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#13151A] p-8 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
        <div className="space-y-1">
          <h1 className="font-display text-xl font-bold text-slate-100">
            Theory Chapter Not Found
          </h1>
          <p className="text-sm text-slate-400">
            No chapter matching slug <code className="font-mono text-amber-300">{slug}</code> was found in the 80-Topic Master Syllabus.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('/theory')}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to 80-Topic Master Syllabus</span>
        </button>
      </div>
    );
  }

  if (slug && chapter) {
    const isCompleted = progress.completedTopics.includes(chapter.slug);
    const isBookmarked = progress.bookmarkedSlugs.includes(chapter.slug);
    const checkedMilestones = progress.projectChecklists[chapter.slug] ?? [];

    const tabs: { id: ChapterTab; label: string }[] = [
      { id: 'intuition', label: '1. Intuition & Trace' },
      { id: 'code', label: '2. 5-Lang Code & Pitfalls' },
      { id: 'practice', label: '3. Practice (3 Tiers)' },
      { id: 'radar', label: '4. Multi-Platform Radar' },
      { id: 'project', label: '5. Real Project Blueprint' },
    ];

    return (
      <div className="space-y-8">
        {/* Chapter Header */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => onNavigate('/theory')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to 80-Topic Master Syllabus</span>
          </button>

          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#13151A] p-6 sm:p-8 flex flex-wrap items-start justify-between gap-6">
            <DomainHeroBackdrop domain={chapter.domain} variant="hero" />

            <div className="relative z-10 space-y-2.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-amber-400 font-semibold">
                  {chapter.domain}
                </span>
                <span aria-hidden="true">·</span>
                <span>Rating {chapter.ratingTier}</span>
                <span aria-hidden="true">·</span>
                <span>USACO {chapter.usacoDivision}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400">Full Guide Live</span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 text-balance">
                {chapter.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {chapter.subtitle}
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onToggleBookmark(chapter.slug)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isBookmarked
                    ? 'border-amber-500/60 bg-amber-500/15 text-amber-300'
                    : 'border-white/10 bg-[#191C23] text-slate-300 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleComplete(chapter.slug)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isCompleted
                    ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                    : 'border-amber-500 bg-amber-500 text-zinc-950 hover:bg-amber-400'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5-Tab Bar with Smooth Sliding Active-Tab Pill Indicator */}
        <div className="relative grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1.5 rounded-xl border border-white/10 bg-[#13151A]">
          <div
            aria-hidden="true"
            className="hidden sm:block pointer-events-none absolute top-1.5 bottom-1.5 rounded-lg bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-transform duration-200 ease-out"
            style={{
              width: 'calc((100% - 12px - 24px) / 5)',
              transform: `translate3d(calc(${Math.max(
                0,
                tabs.findIndex((t) => t.id === activeTab),
              )} * (100% + 6px)), 0, 0)`,
            }}
          />
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap truncate cursor-pointer ${
                  active
                    ? 'bg-amber-500 sm:bg-transparent text-zinc-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div key={activeTab} className="gv-view-enter space-y-8">
        {/* Tab 1: Intuition & Trace Player */}
        {activeTab === 'intuition' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 rounded-xl border border-white/10 bg-[#13151A] p-6 space-y-3">
                <div className="text-xs font-mono text-amber-400">
                  First-Principles Mental Model
                </div>
                <h2 className="font-display text-xl font-bold text-slate-100">
                  {chapter.analogyTitle}
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-[72ch]">
                  {chapter.analogyBody}
                </p>
              </div>

              <div className="lg:col-span-4 rounded-xl border border-white/10 bg-[#13151A] p-6 space-y-4">
                <div className="text-xs font-mono text-slate-400">
                  Prerequisites & Complexity
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between gap-2 py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Time</span>
                    <span className="font-mono text-slate-200 text-right">
                      {chapter.timeComplexity}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2 py-1.5 border-b border-white/5">
                    <span className="text-slate-400">Space</span>
                    <span className="font-mono text-slate-200 text-right">
                      {chapter.spaceComplexity}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="text-xs font-medium text-slate-300">
                    Prerequisites
                  </div>
                  {chapter.prerequisites.length === 0 ? (
                    <div className="text-xs text-slate-400">
                      None — Entry-level foundation module.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {chapter.prerequisites.map((pre) => (
                        <button
                          key={pre.slug}
                          type="button"
                          onClick={() =>
                            onNavigate(
                              chapterSlugs.has(pre.slug)
                                ? `/theory/${pre.slug}`
                                : '/theory',
                            )
                          }
                          className="text-left px-3 py-2 rounded-lg border border-white/10 bg-[#0E1014] text-xs text-amber-300 hover:border-amber-500/50 flex items-center justify-between cursor-pointer"
                        >
                          <span className="truncate">{pre.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <TracePlayer
              key={chapter.slug}
              title={chapter.traceTitle}
              subtitle={chapter.traceSubtitle}
              steps={chapter.traceSteps}
              allowDynamicGraphEdit={chapter.allowDynamicGraphEdit}
            />

            <section className="rounded-xl border border-white/10 bg-[#13151A] p-6 space-y-4">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-100">
                  How Contest Problems Hide This Pattern
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Signal phrases in problem statements that translate directly into this technique.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chapter.reductionClues.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-white/10 bg-[#0E1014] p-4 space-y-2"
                  >
                    <div className="text-xs font-mono text-amber-400">
                      {item.clue}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {item.translation}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: 5-Language Code & Pitfalls */}
        {activeTab === 'code' && (
          <div className="space-y-8">
            <CodeViewer
              implementations={chapter.implementations}
              defaultLang="cpp20"
              title={chapter.title}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {chapter.pitfalls.map((pit, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/10 bg-[#13151A] p-5 space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-rose-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{pit.type} Trap</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100">
                    {pit.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pit.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: 3 Built-In Progressive Practice Problems */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            {chapter.practiceProblems.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-[#13151A] p-8 text-center text-sm text-slate-400">
                No practice problems attached to this custom entry yet.
              </div>
            ) : (
              chapter.practiceProblems.map((prob) => {
                const solved = progress.solvedProblems.includes(prob.id);
                const hintOpen = Boolean(openHints[prob.id]);
                const solOpen = Boolean(openSolutions[prob.id]);

                return (
                  <article
                    key={prob.id}
                    className="rounded-xl border border-white/10 bg-[#13151A] p-6 space-y-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-xs font-mono text-amber-400">
                          {prob.tier} Tier · Rating {prob.ratingRange}
                        </div>
                        <h3 className="font-display text-xl font-bold text-slate-100">
                          {prob.title}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => onToggleSolvedProblem(prob.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
                          solved
                            ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                            : 'border-white/10 bg-[#191C23] text-slate-200 hover:border-amber-500/50'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{solved ? 'Solved' : 'Mark Solved'}</span>
                      </button>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed max-w-[75ch]">
                      {prob.statement}
                    </p>

                    <div className="text-xs font-mono text-slate-400">
                      Constraints: {prob.constraints}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-white/10 bg-[#0E1014] p-3.5">
                        <div className="text-[11px] font-mono text-slate-400 mb-1">
                          Sample Input
                        </div>
                        <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap">
                          {prob.sampleInput}
                        </pre>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-[#0E1014] p-3.5">
                        <div className="text-[11px] font-mono text-slate-400 mb-1">
                          Sample Output
                        </div>
                        <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap">
                          {prob.sampleOutput}
                        </pre>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenHints((prev) => ({
                            ...prev,
                            [prob.id]: !prev[prob.id],
                          }))
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-white/10 bg-[#191C23] text-amber-300 hover:border-amber-500/50 cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>
                          {hintOpen ? 'Hide Progressive Hints' : 'Show Hints'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setOpenSolutions((prev) => ({
                            ...prev,
                            [prob.id]: !prev[prob.id],
                          }))
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-white/10 bg-[#191C23] text-slate-200 hover:border-amber-500/50 cursor-pointer"
                      >
                        {solOpen ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {solOpen
                            ? 'Hide 5-Language Solutions'
                            : 'View 5-Language Solutions'}
                        </span>
                      </button>
                    </div>

                    {hintOpen && (
                      <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-4 space-y-2">
                        {prob.hints.map((h, i) => (
                          <div key={i} className="text-xs text-slate-200">
                            <span className="font-mono text-amber-400 mr-2">
                              Hint {i + 1}:
                            </span>
                            {h}
                          </div>
                        ))}
                      </div>
                    )}

                    {solOpen && (
                      <CodeViewer
                        implementations={prob.solutions}
                        defaultLang="cpp20"
                        title={prob.title}
                      />
                    )}
                  </article>
                );
              })
            )}
          </div>
        )}

        {/* Tab 4: Multi-Platform & Job Interview Radar */}
        {activeTab === 'radar' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chapter.platformRadar.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/10 bg-[#13151A] p-5 hover:border-amber-500/60 transition-colors flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span className="text-amber-400 font-semibold">
                        {item.platform}
                      </span>
                      <span>{item.difficulty}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-100">
                      {item.title}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.patternNote}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                    <span>Open Platform Problem</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))}
            </div>

            <section className="rounded-xl border border-white/10 bg-[#13151A] p-6 space-y-3">
              <h3 className="font-display text-lg font-bold text-slate-100">
                How Technical Interviews Test This Pattern
              </h3>
              <ul className="space-y-2 text-sm text-slate-300 list-disc pl-5">
                {chapter.interviewNotes.map((note, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {note}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {/* Tab 5: Real Project Blueprint */}
        {activeTab === 'project' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-[#13151A] p-6 space-y-4">
              <div className="text-xs font-mono text-amber-400">
                Algorithm-to-Portfolio Engineering Blueprint ·{' '}
                {chapter.projectBlueprint.stackSummary}
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-100">
                {chapter.projectBlueprint.title}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                {chapter.projectBlueprint.tagline}
              </p>
              <pre className="p-4 rounded-lg border border-white/10 bg-[#0B0C0E] text-xs font-mono text-amber-200/90 overflow-x-auto">
                {chapter.projectBlueprint.asciiDiagram}
              </pre>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 rounded-xl border border-white/10 bg-[#13151A] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-100">
                    Implementation Milestones
                  </h3>
                  <span className="text-xs font-mono text-amber-400 tabular-nums">
                    {checkedMilestones.length} /{' '}
                    {chapter.projectBlueprint.milestones.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {chapter.projectBlueprint.milestones.map((m) => {
                    const checked = checkedMilestones.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() =>
                          onToggleProjectMilestone(chapter.slug, m.id)
                        }
                        className={`w-full text-left p-3.5 rounded-lg border transition-colors flex items-start gap-3 cursor-pointer ${
                          checked
                            ? 'border-emerald-500/40 bg-emerald-500/10'
                            : 'border-white/10 bg-[#0E1014] hover:border-white/25'
                        }`}
                      >
                        {checked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="text-xs font-semibold text-slate-100">
                            {m.title}
                          </div>
                          <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {m.detail}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-7 rounded-xl border border-white/10 bg-[#0E1014] overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 bg-[#13151A] text-xs font-mono text-slate-300">
                  Starter Architecture Module (TypeScript Core)
                </div>
                <pre className="p-4 text-[13px] leading-6 font-mono text-slate-200 overflow-x-auto max-h-[460px]">
                  <code>{chapter.projectBlueprint.starterCode}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    );
  }

  // Syllabus Index View (/theory)
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="text-xs font-mono text-amber-400">
            80-Topic Master Curriculum · 6 Core Domains
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-100">
            Competitive Programming Syllabus & Theory Encyclopedia
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Every topic is indexed by Codeforces rating tier and USACO division. Open any “Full Guide Live” chapter for interactive state visualizers, 5-language templates, and project blueprints.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setLiveOnly((v) => !v)}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            liveOnly
              ? 'border-amber-500 bg-amber-500 text-zinc-950'
              : 'border-white/15 bg-[#13151A] text-slate-200 hover:border-amber-500/50'
          }`}
        >
          {liveOnly ? 'Showing Full Guides Only' : 'Filter: Full Guides Live'}
        </button>
      </div>

      {filteredSyllabus.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#13151A] p-10 text-center space-y-2">
          <div className="text-base font-semibold text-slate-200">
            No syllabus topics match the active filters
          </div>
          <p className="text-xs text-slate-400">
            Adjust Rating Tier, USACO Division, or Domain in the workspace toolbar above.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {MASTER_DOMAINS.map((domainName, domIdx) => {
            const items = filteredSyllabus.filter(
              (t) => t.domain === domainName,
            );
            if (items.length === 0) return null;

            return (
              <ScrollReveal key={domainName} index={domIdx}>
                <section className="rounded-xl border border-white/10 bg-[#13151A] overflow-hidden">
                  <div className="relative overflow-hidden px-5 py-4 border-b border-white/10 bg-[#161920] flex flex-wrap items-center justify-between gap-2">
                    <DomainHeroBackdrop domain={domainName} variant="banner" />
                    <h2 className="relative z-10 font-display text-lg font-bold text-slate-100">
                      0{domIdx + 1}. {domainName}
                    </h2>
                    <span className="relative z-10 text-xs font-mono text-slate-300 tabular-nums">
                      {items.length} topics
                    </span>
                  </div>

                  <div className="divide-y divide-white/5">
                    {items.map((topic) => {
                      const isLive = chapterSlugs.has(topic.slug);
                      const done = progress.completedTopics.includes(
                        topic.slug,
                      );

                      return (
                        <SpotlightCard
                          key={topic.id}
                          className="px-5 py-3.5 transition-colors"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-start gap-3.5 min-w-0 flex-1">
                              <button
                                type="button"
                                onClick={() => onToggleComplete(topic.slug)}
                                aria-label={`Mark ${topic.title} completed`}
                                className="mt-0.5 text-slate-500 hover:text-emerald-400 shrink-0 cursor-pointer"
                              >
                                {done ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Circle className="w-4 h-4" />
                                )}
                              </button>

                              <div className="min-w-0 space-y-1">
                                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                                  <span className="tabular-nums text-slate-500">
                                    {String(topic.number).padStart(2, '0')}
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span>{topic.ratingTier}</span>
                                  <span aria-hidden="true">·</span>
                                  <span>USACO {topic.usacoDivision}</span>
                                  <span aria-hidden="true">·</span>
                                  <span className="text-slate-300">
                                    {topic.complexity}
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span
                                    className={
                                      isLive
                                        ? 'text-emerald-400 font-semibold'
                                        : 'text-slate-500'
                                    }
                                  >
                                    {isLive
                                      ? 'Full Guide Live'
                                      : 'Syllabus Mapped'}
                                  </span>
                                </div>

                                <div className="text-sm font-semibold text-slate-100">
                                  {topic.title}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {topic.summary}
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0">
                              {isLive ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onNavigate(`/theory/${topic.slug}`)
                                  }
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                                >
                                  <span>Open Guide</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span className="text-xs font-mono text-slate-500">
                                  Mapped
                                </span>
                              )}
                            </div>
                          </div>
                        </SpotlightCard>
                      );
                    })}
                  </div>
                </section>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
