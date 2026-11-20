import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { LanguageId, LanguageImplementation } from '../types/vault';

interface CodeViewerProps {
  implementations: LanguageImplementation;
  defaultLang?: LanguageId;
  title?: string;
}

const LANG_META: { id: LanguageId; label: string; badge: string }[] = [
  { id: 'cpp20', label: 'C++20', badge: 'GCC 13 · Fast I/O' },
  { id: 'rust', label: 'Rust', badge: 'Safe Vec Arena' },
  { id: 'java21', label: 'Java 21', badge: 'FastScanner' },
  { id: 'python3', label: 'Python 3 / PyPy3', badge: 'Sys Stdin Buffer' },
  { id: 'ruby', label: 'Ruby', badge: 'YJIT 3.3' },
];

export function CodeViewer({
  implementations,
  defaultLang = 'cpp20',
  title,
}: CodeViewerProps) {
  const [activeLang, setActiveLang] = useState<LanguageId>(defaultLang);
  const [copied, setCopied] = useState(false);

  const code = implementations[activeLang] || '';
  const meta = LANG_META.find((l) => l.id === activeLang) ?? LANG_META[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#0E1014] overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-[#13151A]">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {LANG_META.map((lang) => {
            const active = lang.id === activeLang;
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => setActiveLang(lang.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-zinc-950 font-semibold shadow-[0_0_16px_rgba(245,158,11,0.22)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {title && (
            <span className="hidden lg:inline text-xs text-slate-400 truncate max-w-[220px]">
              {title}
            </span>
          )}
          <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
            {meta.badge}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              copied
                ? 'gv-copy-ripple border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                : 'border-white/10 bg-[#191C23] text-slate-200 hover:border-amber-500/50 hover:text-amber-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 transition-transform duration-200 scale-110" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <pre
        key={activeLang}
        className="gv-view-enter p-4 overflow-x-auto text-[13px] leading-6 font-mono text-slate-200 max-h-[520px]"
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
