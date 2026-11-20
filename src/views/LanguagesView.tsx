import { useState } from 'react';
import { Check, Copy, Cpu } from 'lucide-react';
import { LANGUAGE_MATRIX } from '../data/languagesAndPlaybook';
import type { LanguageId } from '../types/vault';

export function LanguagesView() {
  const [selectedLang, setSelectedLang] = useState<LanguageId>('cpp20');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeProfile =
    LANGUAGE_MATRIX.find((l) => l.id === selectedLang) ?? LANGUAGE_MATRIX[0];

  const handleCopy = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1600);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <div className="space-y-10">
      <div className="space-y-1.5">
        <div className="text-xs font-mono text-amber-400">
          5-Language Competitive Programming Runtime & Workaround Matrix
        </div>
        <h1 className="font-display text-3xl font-bold text-slate-100">
          C++20, Rust, Java 21, Python 3 / PyPy3 & Ruby
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          Compare practical rating ceilings, execution multipliers, standard-library blind spots, and copy-paste anti-hack workarounds across all five languages.
        </p>
      </div>

      {/* Comparison Matrix Table */}
      <section className="rounded-xl border border-white/10 bg-[#13151A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#0E1014] text-xs font-medium text-slate-400">
                <th className="py-3.5 px-4">Language</th>
                <th className="py-3.5 px-4">Relative Speed</th>
                <th className="py-3.5 px-4">Practical CF Ceiling</th>
                <th className="py-3.5 px-4">Primary Strengths</th>
                <th className="py-3.5 px-4">Critical Trap / Workaround</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
              {LANGUAGE_MATRIX.map((lang) => {
                const active = lang.id === selectedLang;
                return (
                  <tr
                    key={lang.id}
                    onClick={() => setSelectedLang(lang.id)}
                    className={`cursor-pointer transition-colors ${
                      active ? 'bg-amber-500/10' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <td className="py-4 px-4 font-semibold text-slate-100 whitespace-nowrap">
                      {lang.name}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-amber-300 whitespace-nowrap">
                      {lang.speedIndex}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-emerald-300 whitespace-nowrap">
                      {lang.cfCeiling}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-300 max-w-xs">
                      {lang.strengths}
                    </td>
                    <td className="py-4 px-4 text-xs text-rose-300/90 max-w-xs">
                      {lang.bottleneck}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Template Inspector */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {LANGUAGE_MATRIX.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => setSelectedLang(lang.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedLang === lang.id
                  ? 'border-amber-500 bg-amber-500 text-zinc-950'
                  : 'border-white/10 bg-[#13151A] text-slate-300 hover:border-white/25'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 rounded-xl border border-white/10 bg-[#13151A] p-6 space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <Cpu className="w-3.5 h-3.5" />
                <span>Contest Runtime Profile</span>
              </div>
              <h2 className="font-display text-xl font-bold text-slate-100">
                {activeProfile.templateTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                {activeProfile.templateDescription}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-white/10">
              <div className="text-xs font-semibold text-slate-200">
                Go-To Built-In Structures
              </div>
              <ul className="space-y-1.5 text-xs font-mono text-slate-400">
                {activeProfile.builtinStructures.map((st, idx) => (
                  <li key={idx}>· {st}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-8 rounded-xl border border-white/10 bg-[#0E1014] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 bg-[#13151A] flex items-center justify-between gap-4">
              <span className="text-xs font-mono text-slate-300 truncate">
                {activeProfile.templateTitle}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCopy(activeProfile.id, activeProfile.templateCode)
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-white/10 bg-[#191C23] text-slate-200 hover:border-amber-500/50 cursor-pointer shrink-0"
              >
                {copiedId === activeProfile.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Template</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-[13px] leading-6 font-mono text-slate-200 overflow-x-auto max-h-[500px]">
              <code>{activeProfile.templateCode}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
