import { Edit3, RotateCcw, Search } from 'lucide-react';
import type {
  MasterDomain,
  RatingTier,
  UsacoDivision,
} from '../types/vault';

export const RATING_TIERS: RatingTier[] = [
  '800–1100',
  '1200–1400',
  '1400–1600',
  '1600–1900',
  '1900–2200',
  '2200–2600',
  '2600–3300+',
];

export const USACO_DIVISIONS: UsacoDivision[] = [
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Advanced',
];

export const MASTER_DOMAINS: MasterDomain[] = [
  'Data Structures',
  'Search, Greedy & DP',
  'Graph & Tree Theory',
  'Math, Number Theory & Algebra',
  'Strings & Geometry',
  'Theoretical & Randomized',
];

interface WorkspaceToolbarProps {
  selectedTier: RatingTier | 'All';
  onTierChange: (tier: RatingTier | 'All') => void;
  selectedUsaco: UsacoDivision | 'All';
  onUsacoChange: (div: UsacoDivision | 'All') => void;
  selectedDomain: MasterDomain | 'All';
  onDomainChange: (domain: MasterDomain | 'All') => void;
  onOpenSearch: () => void;
  isAdmin: boolean;
  onOpenCms: () => void;
}

export function WorkspaceToolbar({
  selectedTier,
  onTierChange,
  selectedUsaco,
  onUsacoChange,
  selectedDomain,
  onDomainChange,
  onOpenSearch,
  isAdmin,
  onOpenCms,
}: WorkspaceToolbarProps) {
  const hasFilters =
    selectedTier !== 'All' ||
    selectedUsaco !== 'All' ||
    selectedDomain !== 'All';

  return (
    <div className="border-b border-white/10 bg-[#13151A]/80">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex items-center gap-2.5 px-3 py-1.5 text-xs rounded-lg border border-white/10 bg-[#0B0C0E] text-slate-300 hover:border-amber-500/50 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#191C23] text-slate-400 border border-white/10">
              Ctrl+K
            </kbd>
          </button>

          <select
            value={selectedTier}
            onChange={(e) => onTierChange(e.target.value as RatingTier | 'All')}
            aria-label="Filter by rating tier"
            className="px-2.5 py-1.5 text-xs rounded-lg border border-white/10 bg-[#0B0C0E] text-slate-200 focus:outline-none focus:border-amber-500/60"
          >
            <option value="All">All Ratings (800–3300+)</option>
            {RATING_TIERS.map((t) => (
              <option key={t} value={t}>
                Rating {t}
              </option>
            ))}
          </select>

          <select
            value={selectedUsaco}
            onChange={(e) =>
              onUsacoChange(e.target.value as UsacoDivision | 'All')
            }
            aria-label="Filter by USACO division"
            className="px-2.5 py-1.5 text-xs rounded-lg border border-white/10 bg-[#0B0C0E] text-slate-200 focus:outline-none focus:border-amber-500/60"
          >
            <option value="All">All USACO Divisions</option>
            {USACO_DIVISIONS.map((d) => (
              <option key={d} value={d}>
                USACO {d}
              </option>
            ))}
          </select>

          <select
            value={selectedDomain}
            onChange={(e) =>
              onDomainChange(e.target.value as MasterDomain | 'All')
            }
            aria-label="Filter by master domain"
            className="px-2.5 py-1.5 text-xs rounded-lg border border-white/10 bg-[#0B0C0E] text-slate-200 focus:outline-none focus:border-amber-500/60 max-w-[230px]"
          >
            <option value="All">All 6 Master Domains</option>
            {MASTER_DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                onTierChange('All');
                onUsacoChange('All');
                onDomainChange('All');
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-amber-400 hover:text-amber-300 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={onOpenCms}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-amber-500/50 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>CMS Drawer</span>
          </button>
        )}
      </div>
    </div>
  );
}
