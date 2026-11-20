import { useState } from 'react';
import { Megaphone, Pause, Play, TrendingUp } from 'lucide-react';

interface TopTickerBarProps {
  onNavigate: (path: string) => void;
  onOpenSearch?: () => void;
}

interface AlgoTickerItem {
  code: string;
  title: string;
  slug: string;
  rating: string;
  complexity: string;
  tierColor: 'emerald' | 'amber' | 'rose';
}

const FEATURED_TICKER_ITEMS: AlgoTickerItem[] = [
  {
    code: 'SEGTREE-LAZY',
    title: 'LAZY SEGMENT TREE',
    slug: 'lazy-propagation-segment-tree',
    rating: '1600–1900',
    complexity: 'O(log N)',
    tierColor: 'emerald',
  },
  {
    code: 'HLD-EULER',
    title: 'HEAVY-LIGHT DECOMP',
    slug: 'heavy-light-decomposition',
    rating: '1900–2200',
    complexity: 'O(log² N)',
    tierColor: 'amber',
  },
  {
    code: 'DINIC-FLOW',
    title: 'DINIC MAX FLOW & MIN CUT',
    slug: 'max-flow-dinic-min-cut',
    rating: '2200–2600',
    complexity: 'O(V²E)',
    tierColor: 'amber',
  },
  {
    code: 'BLOSSOM-MATCH',
    title: 'EDMONDS BLOSSOM',
    slug: 'general-graph-matching-blossom',
    rating: '2600–3300+',
    complexity: 'O(V³)',
    tierColor: 'rose',
  },
  {
    code: 'FFT-NTT',
    title: 'FFT & NTT CONVOLUTION',
    slug: 'fft-ntt-polynomial-convolution',
    rating: '2200–2600',
    complexity: 'O(N log N)',
    tierColor: 'amber',
  },
  {
    code: 'LCT-SPLAY',
    title: 'LINK-CUT TREES',
    slug: 'link-cut-tree',
    rating: '2600–3300+',
    complexity: 'O(log N) amort',
    tierColor: 'rose',
  },
  {
    code: 'LI-CHAO-CHT',
    title: 'CONVEX HULL TRICK & LI CHAO',
    slug: 'li-chao-tree-convex-hull-trick',
    rating: '2200–2600',
    complexity: 'O(log X)',
    tierColor: 'amber',
  },
  {
    code: 'SAM-EERTREE',
    title: 'SUFFIX AUTOMATON & EERTREE',
    slug: 'suffix-automaton-sam',
    rating: '2200–2600',
    complexity: 'O(|S|)',
    tierColor: 'amber',
  },
  {
    code: 'MATROID-INT',
    title: 'MATROID INTERSECTION',
    slug: 'matroid-intersection',
    rating: '2600–3300+',
    complexity: 'O(R²N)',
    tierColor: 'rose',
  },
  {
    code: 'LP-SIMPLEX',
    title: 'LP DUALITY & SIMPLEX',
    slug: 'lp-duality-simplex-method',
    rating: '2600–3300+',
    complexity: '2-Phase Bland',
    tierColor: 'rose',
  },
  {
    code: 'SMAWK-MONGE',
    title: 'SMAWK & MONGE ALGEBRA',
    slug: 'smawk-monotone-minima',
    rating: '2600–3300+',
    complexity: 'O(N + M)',
    tierColor: 'rose',
  },
  {
    code: 'DU-SIEVE',
    title: 'DIRICHLET & DU SIEVE',
    slug: 'dirichlet-convolution-du-sieve',
    rating: '2600–3300+',
    complexity: 'O(N^{2/3})',
    tierColor: 'rose',
  },
  {
    code: 'DELAUNAY-3D',
    title: '3D HULL & DELAUNAY',
    slug: '3d-convex-hull-voronoi',
    rating: '2600–3300+',
    complexity: 'O(N log N)',
    tierColor: 'rose',
  },
  {
    code: 'COLOR-FPT',
    title: 'COLOR CODING FPT',
    slug: 'color-coding-random-bipartition',
    rating: '2200–2600',
    complexity: 'O(e^K · 2^K E)',
    tierColor: 'amber',
  },
  {
    code: 'SIM-ANNEAL',
    title: 'SIMULATED ANNEALING 2-OPT',
    slug: 'simulated-annealing-local-search',
    rating: '2200–2600',
    complexity: 'O(1) ΔE',
    tierColor: 'amber',
  },
  {
    code: 'SWAG-UNDO',
    title: 'SWAG & ROLLBACK UNDO',
    slug: 'online-offline-amortized-potential',
    rating: '2600–3300+',
    complexity: 'O(1) / O(log Q)',
    tierColor: 'rose',
  },
];

interface NoticeAnnouncement {
  tag: string;
  text: string;
  path: string;
  isSearchTrigger?: boolean;
}

const NOTICE_ANNOUNCEMENTS: NoticeAnnouncement[] = [
  {
    tag: '80/80 LIVE',
    text: 'All 80 Master Syllabus Theory Chapters are live with 5-tab interactive guides, formal proofs & 240 progressive practice problems',
    path: '/theory',
  },
  {
    tag: 'CONTEST LAB',
    text: 'Launch the Contest Survival & Stress-Testing Lab: mt19937_64 counterexample generator, GNU PBDS / SplitMix64 templates & 30-point WA/TLE/RE Verdict Debugger',
    path: '/lab',
  },
  {
    tag: 'PATTERN DRILLS',
    text: 'Train contest pattern recognition with 30 interactive "Spot the Algorithm" drills across 800–3300+ rating tiers & 60s rapid-fire timer',
    path: '/drills',
  },
  {
    tag: 'VAULT 3300',
    text: 'Explore 10 five-stage Grandmaster problem reductions (1900 to 3300 rated) with interactive dry-run steppers & 5-language solutions',
    path: '/vault',
  },
  {
    tag: '5-LANG MATRIX',
    text: 'Every chapter & problem ships with zero-placeholder C++20, Rust, Java 21, Python 3 / PyPy3, and Ruby contest implementations',
    path: '/languages',
  },
  {
    tag: '10⁸ DECODER',
    text: 'Use the Constraint Reverse-Engineering Decoder on the Roadmap to map input size N directly to AC time complexities',
    path: '/',
  },
  {
    tag: 'CTRL+K SEARCH',
    text: 'Press Ctrl+K / Cmd+K anywhere to launch instant command search across all 80 chapters, 240 problems & Mistake Log playbooks',
    path: '/playbook',
    isSearchTrigger: true,
  },
];

export function TopTickerBar({ onNavigate, onOpenSearch }: TopTickerBarProps) {
  const [paused, setPaused] = useState(false);

  const duplicatedTicker = [...FEATURED_TICKER_ITEMS, ...FEATURED_TICKER_ITEMS];
  const duplicatedNotices = [...NOTICE_ANNOUNCEMENTS, ...NOTICE_ANNOUNCEMENTS];

  const getTierPillStyle = (color: AlgoTickerItem['tierColor']) => {
    if (color === 'emerald') {
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
    if (color === 'amber') {
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    }
    return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
  };

  return (
    <div
      role="region"
      aria-label="Live algorithm ticker and platform announcements"
      className="w-full select-none bg-[#0B0C0E] text-xs"
    >
      {/* Row 1: DSE-Style Live Algorithm & Complexity Ticker */}
      <div className="gv-ticker-wrapper relative h-8 w-full overflow-hidden border-b border-white/[0.08] bg-[#0B0C0E] flex items-center">
        {/* Pinned Left LIVE Badge */}
        <div className="relative z-10 h-full px-3 flex items-center gap-2 bg-[#0B0C0E] border-r border-white/10 shrink-0 shadow-[8px_0_16px_rgba(11,12,14,0.95)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <TrendingUp className="w-3.5 h-3.5 text-amber-400 hidden sm:inline" />
          <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-slate-100">
            LIVE <span className="text-amber-400 hidden xs:inline">VAULT</span>
          </span>
        </div>

        {/* Infinite Horizontal Scrolling Track */}
        <div className="flex-1 overflow-hidden h-full flex items-center">
          <div
            className={`gv-ticker-track items-center ${
              paused ? 'gv-ticker-paused' : ''
            }`}
          >
            {duplicatedTicker.map((item, idx) => (
              <button
                key={`${item.slug}-${idx}`}
                type="button"
                onClick={() => onNavigate(`/theory/${item.slug}`)}
                className="group inline-flex items-center gap-2 px-3.5 h-8 border-r border-white/[0.06] hover:bg-white/[0.04] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span className="text-[10px] text-emerald-400 font-mono">
                  ▲
                </span>
                <span className="font-mono text-[11px] font-bold tracking-tight text-slate-200 group-hover:text-amber-400 transition-colors">
                  {item.title}
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold border ${getTierPillStyle(
                    item.tierColor,
                  )}`}
                >
                  {item.rating}
                </span>
                <span className="font-mono text-[10px] text-slate-400 group-hover:text-slate-200">
                  {item.complexity}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Pinned Right Pause / Play Toggle Button */}
        <div className="relative z-10 h-full px-2.5 flex items-center bg-[#0B0C0E] border-l border-white/10 shrink-0 shadow-[-8px_0_16px_rgba(11,12,14,0.95)]">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Resume live ticker' : 'Pause live ticker'}
            title={paused ? 'Resume ticker' : 'Pause ticker'}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-white/10 bg-[#13151A] hover:border-amber-500/40 hover:text-amber-300 text-slate-300 font-mono text-[10px] font-semibold transition-colors cursor-pointer"
          >
            {paused ? (
              <>
                <Play className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400" />
                <span className="hidden sm:inline">PLAY</span>
              </>
            ) : (
              <>
                <Pause className="w-2.5 h-2.5 text-amber-400" />
                <span className="hidden sm:inline">PAUSE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Row 2: Notice / Announcement Bar */}
      <div className="gv-notice-wrapper relative h-7 w-full overflow-hidden border-b border-white/10 bg-[#111318] flex items-center">
        {/* Pinned Left NOTICE Badge */}
        <div className="relative z-10 h-full px-3 flex items-center gap-1.5 bg-[#111318] border-r border-white/10 shrink-0 shadow-[8px_0_16px_rgba(17,19,24,0.95)]">
          <Megaphone className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-amber-400">
            NOTICE
          </span>
        </div>

        {/* Infinite Horizontal Scrolling Announcements */}
        <div className="flex-1 overflow-hidden h-full flex items-center">
          <div
            className={`gv-notice-track items-center ${
              paused ? 'gv-ticker-paused' : ''
            }`}
          >
            {duplicatedNotices.map((notice, idx) => (
              <button
                key={`${notice.tag}-${idx}`}
                type="button"
                onClick={() => {
                  if (notice.isSearchTrigger && onOpenSearch) {
                    onOpenSearch();
                  } else {
                    onNavigate(notice.path);
                  }
                }}
                className="group inline-flex items-center gap-2 px-5 h-7 hover:bg-white/[0.03] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span className="px-1.5 py-0.2 rounded bg-amber-500/15 border border-amber-500/30 font-mono text-[9px] font-bold text-amber-300 uppercase tracking-wider">
                  {notice.tag}
                </span>
                <span className="text-[11px] text-slate-300 group-hover:text-white transition-colors">
                  {notice.text}
                </span>
                <span className="text-slate-600 pl-2">•</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
