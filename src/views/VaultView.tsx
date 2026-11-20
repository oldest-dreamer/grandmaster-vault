import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import { CodeViewer } from '../components/CodeViewer';
import { BorderBeamCard } from '../components/fx/BorderBeamCard';
import { DomainHeroBackdrop } from '../components/fx/DomainHeroBackdrop';
import { ScrollReveal } from '../components/fx/ScrollReveal';
import { TracePlayer } from '../components/TracePlayer';
import type {
  MasterDomain,
  RatingTier,
  UsacoDivision,
  UserProgressState,
  VaultBreakdown,
} from '../types/vault';

interface VaultViewProps {
  slug?: string;
  vaults: VaultBreakdown[];
  selectedTier: RatingTier | 'All';
  selectedUsaco: UsacoDivision | 'All';
  selectedDomain: MasterDomain | 'All';
  progress: UserProgressState;
  onToggleBookmark: (slug: string) => void;
  onNavigate: (path: string) => void;
}

const DEFAULT_LINKED_CHAPTERS: Record<
  string,
  { number: number; slug: string; title: string }[]
> = {
  'range-affine-update-sum-query': [
    {
      number: 8,
      slug: 'lazy-propagation-segment-tree',
      title: 'Segment Tree with Lazy Propagation',
    },
    {
      number: 7,
      slug: 'segment-tree-point-range',
      title: 'Segment Tree (Point & Range Queries)',
    },
  ],
  'dynamic-tree-path-rerooting-hld': [
    {
      number: 37,
      slug: 'heavy-light-decomposition',
      title: 'Heavy-Light Decomposition (HLD)',
    },
    {
      number: 33,
      slug: 'lca-binary-lifting-euler-tour',
      title: 'LCA, Binary Lifting & Euler Tour',
    },
  ],
  'project-selection-max-weight-closure-dinic': [
    {
      number: 40,
      slug: 'max-flow-dinic-min-cut',
      title: 'Max-Flow (Dinic) & Min-Cut Reductions',
    },
  ],
  'shortest-even-simple-path-blossom': [
    {
      number: 42,
      slug: 'general-graph-matching-blossom',
      title: 'General Graph Matching (Edmonds Blossom)',
    },
  ],
};

export function VaultView({
  slug,
  vaults,
  selectedTier,
  selectedUsaco,
  selectedDomain,
  progress,
  onToggleBookmark,
  onNavigate,
}: VaultViewProps) {
  const [openStages, setOpenStages] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: false,
    5: false,
  });

  const activeVault = useMemo(() => {
    if (slug) return vaults.find((v) => v.slug === slug);
    return undefined;
  }, [slug, vaults]);

  const filteredVaults = useMemo(() => {
    return vaults.filter((v) => {
      if (selectedTier !== 'All' && v.ratingTier !== selectedTier) return false;
      if (selectedUsaco !== 'All' && v.usacoDivision !== selectedUsaco)
        return false;
      if (selectedDomain !== 'All' && v.domain !== selectedDomain) return false;
      return true;
    });
  }, [vaults, selectedTier, selectedUsaco, selectedDomain]);

  const toggleStage = (num: number) => {
    setOpenStages((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const setAllStages = (open: boolean) => {
    setOpenStages({ 1: open, 2: open, 3: open, 4: open, 5: open });
  };

  const getLinkedChapters = (v: VaultBreakdown) =>
    v.linkedChapters ?? DEFAULT_LINKED_CHAPTERS[v.slug] ?? [];

  if (slug && !activeVault) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#13151A] p-8 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <div className="space-y-1">
          <h1 className="font-display text-xl font-bold text-slate-100">
            Vault Case Study Not Found
          </h1>
          <p className="text-sm text-slate-400">
            No reduction case study matching slug <code className="font-mono text-amber-300">{slug}</code> was found in the Reduction Vault.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('/vault')}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to All {vaults.length} Vault Case Studies</span>
        </button>
      </div>
    );
  }

  if (activeVault) {
    const bookmarked = progress.bookmarkedSlugs.includes(activeVault.slug);
    const linkedChapters = getLinkedChapters(activeVault);

    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => onNavigate('/vault')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-amber-400 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All {vaults.length} Multi-Topic Vault Breakdowns</span>
          </button>

          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#13151A] p-6 sm:p-8 space-y-5">
            <DomainHeroBackdrop domain={activeVault.domain} variant="hero" />
            <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-2.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="text-amber-400 font-semibold">
                    Rating {activeVault.rating}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeVault.sourceTag}</span>
                  <span aria-hidden="true">·</span>
                  <span>USACO {activeVault.usacoDivision}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeVault.domain}</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 text-balance">
                  {activeVault.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {activeVault.reductionHeadline}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onToggleBookmark(activeVault.slug)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border cursor-pointer ${
                    bookmarked
                      ? 'border-amber-500/60 bg-amber-500/15 text-amber-300'
                      : 'border-white/10 bg-[#191C23] text-slate-300 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAllStages(true)}
                  className="px-3.5 py-2 text-xs font-medium rounded-lg border border-white/10 bg-[#191C23] text-slate-200 hover:border-amber-500/50 cursor-pointer"
                >
                  Expand All 5 Stages
                </button>
                <button
                  type="button"
                  onClick={() => setAllStages(false)}
                  className="px-3.5 py-2 text-xs font-medium rounded-lg border border-white/10 bg-[#191C23] text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Collapse
                </button>
              </div>
            </div>

            {linkedChapters.length > 0 && (
              <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mr-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  Linked Syllabus Chapters:
                </span>
                {linkedChapters.map((ch) => (
                  <button
                    key={ch.slug}
                    type="button"
                    onClick={() => onNavigate(`/theory/${ch.slug}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 text-xs font-mono text-amber-300 transition-colors cursor-pointer"
                  >
                    <span className="font-bold">
                      #{String(ch.number).padStart(2, '0')}
                    </span>
                    <span>{ch.title}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 5 Progressive Collapsible Stages */}
        <div className="space-y-4">
          {/* Stage 1 */}
          <section className="rounded-xl border border-white/10 bg-[#13151A] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleStage(1)}
              className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/[0.02] cursor-pointer"
            >
              <div>
                <div className="text-xs font-mono text-amber-400">Stage 01</div>
                <h2 className="text-base sm:text-lg font-bold text-slate-100">
                  Deceptively Short Problem Statement &amp; Constraints
                </h2>
              </div>
              {openStages[1] ? (
                <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>

            {openStages[1] && (
              <div className="px-6 pb-6 pt-2 border-t border-white/10 space-y-5">
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-[75ch]">
                  {activeVault.stage1Statement.statement}
                </p>

                <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400">
                  {activeVault.stage1Statement.constraints.map((c, i) => (
                    <span key={i}>
                      {c}
                      {i < activeVault.stage1Statement.constraints.length - 1
                        ? '  ·'
                        : ''}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-white/10 bg-[#0E1014] p-4">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">
                      Sample Input
                    </div>
                    <pre className="text-xs font-mono text-slate-200">
                      {activeVault.stage1Statement.sampleInput}
                    </pre>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-[#0E1014] p-4">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">
                      Sample Output
                    </div>
                    <pre className="text-xs font-mono text-emerald-300">
                      {activeVault.stage1Statement.sampleOutput}
                    </pre>
                  </div>
                </div>

                {activeVault.stage1Statement.sampleExplanation && (
                  <div className="rounded-lg border border-white/10 bg-[#0E1014] p-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <span className="font-mono font-semibold text-amber-400">
                      Sample Trace Explanation:{' '}
                    </span>
                    {activeVault.stage1Statement.sampleExplanation}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Stage 2 */}
          <section className="rounded-xl border border-white/10 bg-[#13151A] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleStage(2)}
              className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/[0.02] cursor-pointer"
            >
              <div>
                <div className="text-xs font-mono text-amber-400">Stage 02</div>
                <h2 className="text-base sm:text-lg font-bold text-slate-100">
                  Why Naive Approaches Fail (and What Constraints Whisper)
                </h2>
              </div>
              {openStages[2] ? (
                <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>

            {openStages[2] && (
              <div className="px-6 pb-6 pt-3 border-t border-white/10 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeVault.stage2NaiveFailure.naiveApproaches.map(
                    (na, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-white/10 bg-[#0E1014] p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-rose-400 font-semibold inline-flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {na.verdict}
                          </span>
                          <span className="text-slate-400">{na.complexity}</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-100">
                          {na.approach}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {na.reason}
                        </p>
                      </div>
                    ),
                  )}
                </div>

                <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-4 space-y-2">
                  <div className="text-xs font-mono font-semibold text-amber-400">
                    What the Constraints Whisper
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200 list-disc pl-5">
                    {activeVault.stage2NaiveFailure.constraintWhispers.map(
                      (w, i) => (
                        <li key={i}>{w}</li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Stage 3 */}
          <section className="rounded-xl border border-white/10 bg-[#13151A] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleStage(3)}
              className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/[0.02] cursor-pointer"
            >
              <div>
                <div className="text-xs font-mono text-amber-400">Stage 03</div>
                <h2 className="text-base sm:text-lg font-bold text-slate-100">
                  The “Aha!” Reduction Chain &amp; Pitfall Audit
                </h2>
              </div>
              {openStages[3] ? (
                <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>

            {openStages[3] && (
              <div className="px-6 pb-6 pt-3 border-t border-white/10 space-y-5">
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-slate-100 leading-relaxed">
                  <span className="font-semibold text-emerald-300">
                    Core Reduction Insight:{' '}
                  </span>
                  {activeVault.stage3AhaReduction.coreInsight}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeVault.stage3AhaReduction.steps.map((st, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-white/10 bg-[#0E1014] p-4 space-y-2"
                    >
                      <div className="text-sm font-semibold text-amber-300">
                        {st.title}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {st.proofNote}
                      </p>
                    </div>
                  ))}
                </div>

                {activeVault.keyTraps && activeVault.keyTraps.length > 0 && (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-4 space-y-3">
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      Critical Implementation Traps &amp; Contest Pitfalls
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeVault.keyTraps.map((trap, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-white/10 bg-[#0B0C0E] p-3.5 space-y-1"
                        >
                          <div className="text-xs font-bold text-rose-300">
                            {trap.title}
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {trap.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Stage 4 */}
          <section className="rounded-xl border border-white/10 bg-[#13151A] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleStage(4)}
              className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/[0.02] cursor-pointer"
            >
              <div>
                <div className="text-xs font-mono text-amber-400">Stage 04</div>
                <h2 className="text-base sm:text-lg font-bold text-slate-100">
                  Concrete Hand-Traced Dry Run (Interactive Step Visualizer)
                </h2>
              </div>
              {openStages[4] ? (
                <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>

            {openStages[4] && (
              <div className="px-6 pb-6 pt-3 border-t border-white/10 space-y-4">
                <p className="text-sm text-slate-300">
                  {activeVault.stage4DryRun.intro}
                </p>
                <TracePlayer
                  key={activeVault.slug}
                  title={`${activeVault.title} — Interactive Reduction Trace`}
                  subtitle="Step through state transitions and inspect intermediate invariants at each stage."
                  steps={activeVault.stage4DryRun.traceSteps}
                  allowDynamicGraphEdit={true}
                />
              </div>
            )}
          </section>

          {/* Stage 5 */}
          <section className="rounded-xl border border-white/10 bg-[#13151A] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleStage(5)}
              className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/[0.02] cursor-pointer"
            >
              <div>
                <div className="text-xs font-mono text-amber-400">Stage 05</div>
                <h2 className="text-base sm:text-lg font-bold text-slate-100">
                  Complete Runnable Solutions (C++20, Rust, Java 21, Python 3, Ruby)
                </h2>
              </div>
              {openStages[5] ? (
                <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>

            {openStages[5] && (
              <div className="px-6 pb-6 pt-3 border-t border-white/10 space-y-4">
                <div className="flex flex-wrap gap-6 text-xs font-mono text-slate-300">
                  <span>Time: {activeVault.stage5Solutions.timeComplexity}</span>
                  <span>Space: {activeVault.stage5Solutions.spaceComplexity}</span>
                </div>
                <CodeViewer
                  implementations={activeVault.stage5Solutions.implementations}
                  defaultLang="cpp20"
                  title={activeVault.title}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

  // Vault Catalog Index (/vault)
  return (
    <div className="space-y-8">
      <div className="space-y-1.5">
        <div className="text-xs font-mono text-amber-400">
          5-Stage Multi-Topic Problem Reduction Vault ({vaults.length} Case Studies)
        </div>
        <h1 className="font-display text-3xl font-bold text-slate-100">
          Grandmaster Reduction Breakdowns (1900–3300+)
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          Multi-topic contest problems deconstructed into 5 progressive stages—from
          naive TLE/WA baselines and constraint clues to formal reduction chains,
          linked syllabus chapters, interactive dry runs, and 5-language AC templates.
        </p>
      </div>

      {filteredVaults.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#13151A] p-10 text-center text-sm text-slate-400">
          No vault entries match the active workspace filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredVaults.map((v, idx) => {
            const linked = getLinkedChapters(v);
            return (
              <ScrollReveal key={v.slug} index={idx}>
                <BorderBeamCard
                  enableTilt={true}
                  innerClassName="p-6 flex flex-col justify-between gap-5"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                      <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                        <Layers className="w-3.5 h-3.5" />
                        Rating {v.rating} ({v.ratingTier})
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>USACO {v.usacoDivision}</span>
                      <span aria-hidden="true">·</span>
                      <span>{v.domain}</span>
                    </div>

                    <h2 className="font-display text-xl font-bold text-slate-100">
                      {v.title}
                    </h2>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {v.reductionHeadline}
                    </p>

                    {linked.length > 0 && (
                      <div className="pt-1 flex flex-wrap items-center gap-1.5">
                        {linked.map((ch) => (
                          <button
                            key={ch.slug}
                            type="button"
                            onClick={() => onNavigate(`/theory/${ch.slug}`)}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/40 font-mono text-[11px] text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                          >
                            <span className="text-amber-400 font-bold">
                              #{String(ch.number).padStart(2, '0')}
                            </span>
                            <span>{ch.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4 mt-5">
                    <span className="text-xs font-mono text-slate-400 truncate">
                      {v.stage5Solutions.timeComplexity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate(`/vault/${v.slug}`)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Open 5-Stage Breakdown</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </BorderBeamCard>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
