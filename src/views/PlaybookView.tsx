import { useMemo, useState } from 'react';
import { Check, Copy, Plus, Trash2 } from 'lucide-react';
import { RATING_TIERS } from '../components/WorkspaceToolbar';
import { PLAYBOOK_PRINCIPLES } from '../data/languagesAndPlaybook';
import type { MistakeLogEntry, RatingTier } from '../types/vault';

interface PlaybookViewProps {
  mistakeLogs: MistakeLogEntry[];
  onAddMistake: (entry: MistakeLogEntry) => void;
  onDeleteMistake: (id: string) => void;
}

export function PlaybookView({
  mistakeLogs,
  onAddMistake,
  onDeleteMistake,
}: PlaybookViewProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Mistake Log form state
  const [problemTitle, setProblemTitle] = useState('');
  const [platform, setPlatform] = useState('Codeforces');
  const [ratingTier, setRatingTier] = useState<RatingTier>('1600–1900');
  const [failureType, setFailureType] =
    useState<MistakeLogEntry['failureType']>('WA');
  const [rootCause, setRootCause] = useState('');
  const [preventionRule, setPreventionRule] = useState('');

  const filteredPrinciples = useMemo(() => {
    if (categoryFilter === 'All') return PLAYBOOK_PRINCIPLES;
    return PLAYBOOK_PRINCIPLES.filter((p) => p.category === categoryFilter);
  }, [categoryFilter]);

  const handleCopy = async (id: string, snippet: string) => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1600);
    } catch {
      setCopiedId(null);
    }
  };

  const handleSubmitMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemTitle.trim() || !rootCause.trim() || !preventionRule.trim()) {
      return;
    }
    const entry: MistakeLogEntry = {
      id: `m-${Date.now()}`,
      problemTitle: problemTitle.trim(),
      platform,
      ratingTier,
      failureType,
      rootCause: rootCause.trim(),
      preventionRule: preventionRule.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    onAddMistake(entry);
    setProblemTitle('');
    setRootCause('');
    setPreventionRule('');
  };

  return (
    <div className="space-y-12">
      {/* Playbook Section */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-amber-400">
              Grandmaster Insider Playbook
            </div>
            <h1 className="font-display text-3xl font-bold text-slate-100">
              Problem-Solving Heuristics, Training Rules & Stress Testing
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Actionable mental triggers and engineering workflows used by Grandmasters to convert unfamiliar statements into clean Accepted submissions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg border border-white/10 bg-[#13151A]">
            {[
              'All',
              'Problem Solving',
              'Training Protocol',
              'Engineering & Anti-Hack',
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-amber-500 text-zinc-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPrinciples.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-white/10 bg-[#13151A] p-6 space-y-4"
            >
              <div className="space-y-1.5">
                <div className="text-xs font-mono text-amber-400">
                  {item.category}
                </div>
                <h2 className="font-display text-xl font-bold text-slate-100">
                  {item.title}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.ruleSummary}
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-400 list-disc pl-4">
                {item.actionChecklist.map((act, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {act}
                  </li>
                ))}
              </ul>

              {item.codeSnippet && (
                <div className="rounded-lg border border-white/10 bg-[#0B0C0E] overflow-hidden">
                  <div className="px-3.5 py-2 border-b border-white/10 bg-[#161920] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      stress_test.sh
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.codeSnippet!)}
                      className="inline-flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Script</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3.5 text-xs font-mono text-slate-200 overflow-x-auto">
                    <code>{item.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Personal Mistake Log Tracker */}
      <section className="rounded-xl border border-white/10 bg-[#13151A] overflow-hidden">
        <div className="px-6 py-5 border-b border-white/10">
          <div className="text-xs font-mono text-amber-400">
            Persistent Training Telemetry
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-100 mt-0.5">
            Personal Mistake Log & Prevention Rules
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Record every contest WA, TLE, or missed observation with an explicit future prevention rule. Synced automatically to Supabase or browser storage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {/* Add Mistake Form */}
          <form
            onSubmit={handleSubmitMistake}
            className="lg:col-span-5 p-6 space-y-4 bg-[#0E1014]"
          >
            <div className="text-sm font-semibold text-slate-100">
              Log New Contest Mistake
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Problem Title
              </label>
              <input
                type="text"
                required
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                placeholder="e.g. CF 1980E - Permutation of Rows"
                className="w-full px-3 py-2 text-sm rounded-lg border border-white/10 bg-[#13151A] text-slate-100"
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-lg border border-white/10 bg-[#13151A] text-slate-100"
                >
                  <option value="Codeforces">Codeforces</option>
                  <option value="AtCoder">AtCoder</option>
                  <option value="USACO">USACO</option>
                  <option value="CSES">CSES</option>
                  <option value="CodeChef">CodeChef</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Rating
                </label>
                <select
                  value={ratingTier}
                  onChange={(e) => setRatingTier(e.target.value as RatingTier)}
                  className="w-full px-2.5 py-2 text-xs rounded-lg border border-white/10 bg-[#13151A] text-slate-100"
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
                  Failure
                </label>
                <select
                  value={failureType}
                  onChange={(e) =>
                    setFailureType(
                      e.target.value as MistakeLogEntry['failureType'],
                    )
                  }
                  className="w-full px-2.5 py-2 text-xs rounded-lg border border-white/10 bg-[#13151A] text-slate-100"
                >
                  <option value="WA">WA</option>
                  <option value="TLE">TLE</option>
                  <option value="Overflow">Overflow</option>
                  <option value="Edge Case">Edge Case</option>
                  <option value="Misread">Misread</option>
                  <option value="Implementation">Implementation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Root Cause (What broke?)
              </label>
              <textarea
                rows={2}
                required
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                placeholder="e.g. Forgot to clear adjacency list across test cases..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-white/10 bg-[#13151A] text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Prevention Rule (Future Guardrail)
              </label>
              <textarea
                rows={2}
                required
                value={preventionRule}
                onChange={(e) => setPreventionRule(e.target.value)}
                placeholder="e.g. Allocate fresh vector<vector<int>> adj(n) inside solve()..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-white/10 bg-[#13151A] text-slate-100"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Mistake Entry</span>
            </button>
          </form>

          {/* Mistake History List */}
          <div className="lg:col-span-7 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-100">
                Logged Entries ({mistakeLogs.length})
              </div>
            </div>

            {mistakeLogs.length === 0 ? (
              <div className="p-8 rounded-lg border border-white/10 bg-[#0E1014] text-center text-xs text-slate-400">
                No mistakes logged yet. Add your first post-contest review entry on the left.
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {mistakeLogs.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg border border-white/10 bg-[#0E1014] p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                          <span className="text-rose-400 font-semibold">
                            {entry.failureType}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{entry.platform}</span>
                          <span aria-hidden="true">·</span>
                          <span>{entry.ratingTier}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{entry.createdAt}</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-100 mt-0.5">
                          {entry.problemTitle}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteMistake(entry.id)}
                        aria-label={`Delete ${entry.problemTitle}`}
                        className="p-1.5 rounded text-slate-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="text-slate-400 font-medium">Cause: </span>
                      {entry.rootCause}
                    </p>
                    <p className="text-xs text-emerald-300/90 leading-relaxed">
                      <span className="text-emerald-400 font-medium">Rule: </span>
                      {entry.preventionRule}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
