import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Layers,
  Search,
  Terminal,
  X,
} from 'lucide-react';
import type {
  SyllabusTopic,
  TheoryChapter,
  VaultBreakdown,
} from '../types/vault';

interface CommandSearchModalProps {
  open: boolean;
  onClose: () => void;
  syllabus: SyllabusTopic[];
  chapters: TheoryChapter[];
  vaults: VaultBreakdown[];
  onNavigate: (path: string) => void;
}

interface SearchHit {
  id: string;
  kind:
    | 'Theory Guide'
    | 'Syllabus Topic'
    | 'Vault Reduction'
    | 'Workspace View';
  title: string;
  meta: string;
  path: string;
}

const WORKSPACE_VIEW_HITS: SearchHit[] = [
  {
    id: 'view-roadmap',
    kind: 'Workspace View',
    title: 'Rating-Climb Roadmaps & Constraint Decoder',
    meta: '5 Progression Tracks · 80-Topic Mastery Tracker · 10⁸ Ops/Sec Decoder',
    path: '/',
  },
  {
    id: 'view-drills',
    kind: 'Workspace View',
    title: '"Spot the Algorithm" Contest Pattern Drills (30 Scenarios)',
    meta: '800–3300+ Rating Tiers · 60-Second Rapid-Fire Timer · Streak Tracker',
    path: '/drills',
  },
  {
    id: 'view-lab',
    kind: 'Workspace View',
    title: 'Contest Survival & Stress-Testing Lab',
    meta: 'mt19937_64 Generator · Bash/PS1/Python Runners · GNU PBDS · 30-Point Verdict Debugger',
    path: '/lab',
  },
  {
    id: 'view-vault',
    kind: 'Workspace View',
    title: '1900–3300+ Grandmaster Problem Reduction Vault (10 Case Studies)',
    meta: '5-Stage Multi-Topic Breakdowns · Interactive Dry Runs · 5-Language Solutions',
    path: '/vault',
  },
  {
    id: 'view-languages',
    kind: 'Workspace View',
    title: '5-Language Contest Matrix & Fast I/O Lab',
    meta: 'C++20 · Rust · Java 21 · Python 3 / PyPy3 · Ruby',
    path: '/languages',
  },
  {
    id: 'view-playbook',
    kind: 'Workspace View',
    title: 'Contest Strategy Playbook & Persistent Mistake Log',
    meta: 'Pre-Submit Checklists · Anti-Hash Rules · Personal Bug Tracker',
    path: '/playbook',
  },
];

export function CommandSearchModal({
  open,
  onClose,
  syllabus,
  chapters,
  vaults,
  onNavigate,
}: CommandSearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  const allHits = useMemo<SearchHit[]>(() => {
    const chapterSlugs = new Set(chapters.map((c) => c.slug));
    const list: SearchHit[] = [...WORKSPACE_VIEW_HITS];

    for (const v of vaults) {
      list.push({
        id: `vault-${v.slug}`,
        kind: 'Vault Reduction',
        title: v.title,
        meta: `Rating ${v.rating} · USACO ${v.usacoDivision} · ${v.domain}`,
        path: `/vault/${v.slug}`,
      });
    }

    for (const topic of syllabus) {
      const hasGuide = chapterSlugs.has(topic.slug);
      list.push({
        id: `topic-${topic.id}`,
        kind: hasGuide ? 'Theory Guide' : 'Syllabus Topic',
        title: `${String(topic.number).padStart(2, '0')}. ${topic.title}`,
        meta: `${topic.ratingTier} · USACO ${topic.usacoDivision} · ${topic.domain}`,
        path: hasGuide ? `/theory/${topic.slug}` : `/theory`,
      });
    }

    return list;
  }, [syllabus, chapters, vaults]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allHits.slice(0, 14);
    return allHits
      .filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.meta.toLowerCase().includes(q) ||
          h.kind.toLowerCase().includes(q),
      )
      .slice(0, 16);
  }, [allHits, query]);

  if (!open) return null;

  const choose = (hit: SearchHit) => {
    onNavigate(hit.path);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl border border-white/15 bg-[#13151A] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Global algorithm search"
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="w-4 h-4 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((i) =>
                  filtered.length ? (i + 1) % filtered.length : 0,
                );
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((i) =>
                  filtered.length
                    ? (i - 1 + filtered.length) % filtered.length
                    : 0,
                );
              }
              if (e.key === 'Enter' && filtered[activeIndex]) {
                e.preventDefault();
                choose(filtered[activeIndex]);
              }
            }}
            placeholder="Search 80 chapters, 10 Vault studies, Contest Lab, Pattern Drills, HLD, Dinic..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[420px] overflow-y-auto divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No syllabus topics, vault reductions, or views match “{query}”.
            </div>
          ) : (
            filtered.map((hit, idx) => {
              const selected = idx === activeIndex;
              return (
                <button
                  key={hit.id}
                  type="button"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => choose(hit)}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                    selected ? 'bg-amber-500/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-0.5">
                      {hit.kind === 'Vault Reduction' ? (
                        <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      ) : hit.kind === 'Workspace View' ? (
                        hit.id === 'view-lab' ? (
                          <Terminal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )
                      ) : (
                        <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      <span className="font-medium text-slate-300">
                        {hit.kind}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{hit.meta}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-100 truncate">
                      {hit.title}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
