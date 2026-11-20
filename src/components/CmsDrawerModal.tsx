import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import {
  MASTER_DOMAINS,
  RATING_TIERS,
  USACO_DIVISIONS,
} from './WorkspaceToolbar';
import type {
  CustomCmsEntry,
  MasterDomain,
  RatingTier,
  UsacoDivision,
} from '../types/vault';

interface CmsDrawerModalProps {
  open: boolean;
  onClose: () => void;
  entries: CustomCmsEntry[];
  onSaveEntry: (entry: CustomCmsEntry) => Promise<void>;
  onDeleteEntry: (id: string) => Promise<void>;
  onNavigate: (path: string) => void;
}

export function CmsDrawerModal({
  open,
  onClose,
  entries,
  onSaveEntry,
  onDeleteEntry,
  onNavigate,
}: CmsDrawerModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [entryType, setEntryType] = useState<'syllabus' | 'theory' | 'vault'>(
    'theory',
  );
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [ratingTier, setRatingTier] = useState<RatingTier>('1600–1900');
  const [usacoDivision, setUsacoDivision] = useState<UsacoDivision>('Gold');
  const [domain, setDomain] = useState<MasterDomain>('Graph & Tree Theory');
  const [summary, setSummary] = useState('');
  const [complexity, setComplexity] = useState('O(N log N)');
  const [cppTemplate, setCppTemplate] = useState('');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setSummary('');
    setComplexity('O(N log N)');
    setCppTemplate('');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      );
    }
  };

  const handleLoadEntry = (e: CustomCmsEntry) => {
    setEditingId(e.id);
    setEntryType(e.entryType);
    setTitle(e.title);
    setSlug(e.slug);
    setRatingTier(e.ratingTier);
    setUsacoDivision(e.usacoDivision);
    setDomain(e.domain);
    setSummary(e.summary);
    setComplexity(e.payload.complexity || 'O(N log N)');
    setCppTemplate(e.payload.implementations?.cpp20 || '');
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!title.trim() || !slug.trim()) return;
    setSaving(true);
    const id = editingId || `cms-${Date.now()}`;
    const nextEntry: CustomCmsEntry = {
      id,
      entryType,
      slug: slug.trim(),
      title: title.trim(),
      ratingTier,
      usacoDivision,
      domain,
      summary: summary.trim() || 'Custom Grandmaster Vault entry.',
      payload: {
        complexity,
        analogyBody: summary.trim(),
        timeComplexity: complexity,
        implementations: cppTemplate.trim()
          ? {
              cpp20: cppTemplate.trim(),
              rust: '// Add Rust implementation in CMS',
              java21: '// Add Java 21 implementation in CMS',
              python3: '# Add Python 3 implementation in CMS',
              ruby: '# Add Ruby implementation in CMS',
            }
          : undefined,
      },
      updatedAt: new Date().toISOString(),
    };
    await onSaveEntry(nextEntry);
    setSaving(false);
    resetForm();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-xl h-full bg-[#13151A] border-l border-white/15 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        aria-label="Admin CMS Editor Drawer"
      >
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Admin CMS Entry Drawer
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Publish or update Syllabus Topics, Full Theory Guides, and 5-Stage Vault Breakdowns.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close CMS drawer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {(['theory', 'syllabus', 'vault'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEntryType(t)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border capitalize cursor-pointer ${
                    entryType === t
                      ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                      : 'border-white/10 bg-[#0E1014] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t} Entry
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Heavy-Light Decomposition"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-white/10 bg-[#0B0C0E] text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="heavy-light-decomposition"
                  className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-white/10 bg-[#0B0C0E] text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Rating Tier
                </label>
                <select
                  value={ratingTier}
                  onChange={(e) => setRatingTier(e.target.value as RatingTier)}
                  className="w-full px-2.5 py-2 text-xs rounded-lg border border-white/10 bg-[#0B0C0E] text-slate-100"
                >
                  {RATING_TIERS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  USACO Division
                </label>
                <select
                  value={usacoDivision}
                  onChange={(e) =>
                    setUsacoDivision(e.target.value as UsacoDivision)
                  }
                  className="w-full px-2.5 py-2 text-xs rounded-lg border border-white/10 bg-[#0B0C0E] text-slate-100"
                >
                  {USACO_DIVISIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Complexity
                </label>
                <input
                  type="text"
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs font-mono rounded-lg border border-white/10 bg-[#0B0C0E] text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Master Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as MasterDomain)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-white/10 bg-[#0B0C0E] text-slate-100"
              >
                {MASTER_DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Core Intuition / Reduction Summary
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Explain the core invariant or reduction insight..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-white/10 bg-[#0B0C0E] text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Optional C++20 Reference Snippet
              </label>
              <textarea
                rows={4}
                value={cppTemplate}
                onChange={(e) => setCppTemplate(e.target.value)}
                placeholder="// Paste contest-ready C++20 template..."
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-white/10 bg-[#0B0C0E] text-slate-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 disabled:opacity-50 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {editingId ? 'Update Entry' : 'Publish Entry to Vault'}
                </span>
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-2 text-xs rounded-lg border border-white/10 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <div className="border-t border-white/10 pt-5 space-y-3">
            <div className="text-xs font-semibold text-slate-300">
              Published Custom Entries ({entries.length})
            </div>

            {entries.length === 0 ? (
              <div className="p-4 rounded-lg border border-white/10 bg-[#0E1014] text-xs text-slate-400">
                No custom entries published yet. Use the form above to add a live Theory Guide, Syllabus topic, or Vault reduction.
              </div>
            ) : (
              <div className="space-y-2">
                {entries.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-white/10 bg-[#0E1014] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-xs text-amber-400 font-mono">
                        {item.entryType} · {item.ratingTier} · {item.usacoDivision}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (item.entryType === 'theory') {
                            onNavigate(`/theory/${item.slug}`);
                            onClose();
                          } else if (item.entryType === 'vault') {
                            onNavigate(`/vault/${item.slug}`);
                            onClose();
                          } else {
                            onNavigate('/theory');
                            onClose();
                          }
                        }}
                        className="text-sm font-medium text-slate-100 hover:text-amber-300 truncate block text-left cursor-pointer"
                      >
                        {item.title}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleLoadEntry(item)}
                        className="px-2.5 py-1 text-xs rounded border border-white/10 text-slate-300 hover:text-white cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteEntry(item.id)}
                        aria-label={`Delete ${item.title}`}
                        className="p-1.5 rounded border border-white/10 text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
