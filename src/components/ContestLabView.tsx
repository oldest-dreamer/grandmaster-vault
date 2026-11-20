import {
  AlertTriangle,
  Bug,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Code2,
  Copy,
  Cpu,
  Flame,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Terminal,
  Wrench,
} from 'lucide-react';
import {
  COMPILER_FLAG_PRESETS,
  CONTEST_TEMPLATES,
  STRESS_HARNESS_FILES,
  STRESS_RUNNER_SCRIPTS,
  VERDICT_CATEGORIES,
  type JudgeVerdictId,
  type SnippetCategory,
  type StressHarnessFile,
} from '../data/contestLab';
import { ScrollReveal } from './fx/ScrollReveal';
import { SpotlightCard } from './fx/SpotlightCard';

import { useEffect, useMemo, useState } from 'react';

type LabTabId = 'harness' | 'templates' | 'debugger';

const VERDICT_STORAGE_KEY = 'gv_contest_lab_verdict_checks_v1';

const SNIPPET_CATEGORY_FILTERS: Array<{
  id: 'All' | SnippetCategory;
  label: string;
}> = [
  { id: 'All', label: `All Templates (${CONTEST_TEMPLATES.length})` },
  { id: 'pbds', label: 'GNU PBDS Trees' },
  { id: 'hashing', label: 'Anti-Hack Hash Table' },
  { id: 'modint', label: 'Modular Arithmetic' },
  { id: 'bitmask', label: 'C++20 Bit & Submask Arsenal' },
  { id: 'fastio', label: 'Fast I/O & Interactive' },
];

function CopyButton({
  text,
  label = 'Copy Code',
  compact = false,
}: {
  text: string;
  label?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-md border transition-all cursor-pointer font-mono ${
        compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
      } ${
        copied
          ? 'gv-copy-ripple bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
          : 'bg-[#13151A] border-white/10 text-slate-300 hover:text-amber-300 hover:border-amber-500/40'
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
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

export function ContestLabView() {
  const [activeTab, setActiveTab] = useState<LabTabId>('harness');

  // Tab 1 states
  const [selectedHarnessFileId, setSelectedHarnessFileId] =
    useState<StressHarnessFile['id']>('gen');
  const [selectedRunnerId, setSelectedRunnerId] = useState<
    'bash' | 'powershell' | 'python3'
  >('bash');

  // Tab 2 state
  const [selectedCategory, setSelectedCategory] = useState<
    'All' | SnippetCategory
  >('All');

  // Tab 3 states
  const [selectedVerdictId, setSelectedVerdictId] =
    useState<JudgeVerdictId>('wa-early');
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>(
    {},
  );
  const [checkedDiagnostics, setCheckedDiagnostics] = useState<
    Record<string, boolean>
  >(() => {
    try {
      const raw = localStorage.getItem(VERDICT_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as Record<string, boolean>;
      }
    } catch {
      // Fallback to empty object
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        VERDICT_STORAGE_KEY,
        JSON.stringify(checkedDiagnostics),
      );
    } catch {
      // Ignore storage quota issues
    }
  }, [checkedDiagnostics]);

  const activeHarnessFile = useMemo(
    () =>
      STRESS_HARNESS_FILES.find((f) => f.id === selectedHarnessFileId) ??
      STRESS_HARNESS_FILES[0],
    [selectedHarnessFileId],
  );

  const activeRunnerScript = useMemo(
    () =>
      STRESS_RUNNER_SCRIPTS.find((r) => r.id === selectedRunnerId) ??
      STRESS_RUNNER_SCRIPTS[0],
    [selectedRunnerId],
  );

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'All') return CONTEST_TEMPLATES;
    return CONTEST_TEMPLATES.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  const activeVerdict = useMemo(
    () =>
      VERDICT_CATEGORIES.find((v) => v.id === selectedVerdictId) ??
      VERDICT_CATEGORIES[0],
    [selectedVerdictId],
  );

  const toggleDiagnosticCheck = (diagId: string) => {
    setCheckedDiagnostics((prev) => ({
      ...prev,
      [diagId]: !prev[diagId],
    }));
  };

  const resetCurrentVerdictChecks = () => {
    setCheckedDiagnostics((prev) => {
      const next = { ...prev };
      for (const item of activeVerdict.diagnostics) {
        delete next[item.id];
      }
      return next;
    });
  };

  const resetAllVerdictChecks = () => {
    setCheckedDiagnostics({});
  };

  const getVerdictToneClasses = (
    tone: 'rose' | 'amber' | 'violet' | 'sky' | 'emerald',
    isSelected: boolean,
  ) => {
    if (isSelected) {
      if (tone === 'rose') {
        return 'bg-rose-500/20 border-rose-500/50 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.15)]';
      }
      if (tone === 'amber') {
        return 'bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.15)]';
      }
      if (tone === 'violet') {
        return 'bg-violet-500/20 border-violet-500/50 text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.15)]';
      }
      if (tone === 'emerald') {
        return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.15)]';
      }
      return 'bg-sky-500/20 border-sky-500/50 text-sky-200 shadow-[0_0_20px_rgba(14,165,233,0.15)]';
    }
    return 'bg-[#13151A] border-white/10 text-slate-300 hover:border-white/25 hover:text-white';
  };

  const totalCheckedAcrossAll = useMemo(
    () => Object.values(checkedDiagnostics).filter(Boolean).length,
    [checkedDiagnostics],
  );

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#13151A] via-[#13151A] to-[#191C23] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span>CONTEST SURVIVAL & STRESS-TESTING LAB</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Counterexample Harness, Battle-Tested C++20 Arsenal & Live Verdict
              Triage
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Eliminate blind debugging during live rounds. Generate 10,000+
              adversarial random tests per second with{' '}
              <code className="font-mono text-amber-300">mt19937_64</code>,
              drop in zero-overhead GNU PBDS / SplitMix64 / ModInt templates, or
              walk through ranked diagnostic checklists for{' '}
              <span className="text-rose-300 font-mono">
                WA / TLE / MLE / RE / ILE
              </span>
              .
            </p>
          </div>

          {/* Quick Telemetry Stat Cards */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="rounded-xl border border-white/10 bg-[#0E1014] px-4 py-3">
              <div className="font-mono text-[11px] uppercase text-slate-400">
                Stress Engine
              </div>
              <div className="font-display text-lg font-bold text-amber-400 mt-0.5">
                3 Runners
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Bash · PS1 · Py3
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0E1014] px-4 py-3">
              <div className="font-mono text-[11px] uppercase text-slate-400">
                C++20 Arsenal
              </div>
              <div className="font-display text-lg font-bold text-emerald-400 mt-0.5">
                5 Modules
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                PBDS · Hash · Mint
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#0E1014] px-4 py-3">
              <div className="font-mono text-[11px] uppercase text-slate-400">
                Verdict Triage
              </div>
              <div className="font-display text-lg font-bold text-rose-400 mt-0.5">
                30 Checks
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {totalCheckedAcrossAll}/30 verified
              </div>
            </div>
          </div>
        </div>

        {/* 3-Tab Switcher */}
        <div className="mt-7 pt-6 border-t border-white/10 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('harness')}
            className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer border ${
              activeTab === 'harness'
                ? 'bg-amber-500 text-zinc-950 border-amber-400 font-semibold shadow-[0_0_24px_rgba(245,158,11,0.25)]'
                : 'bg-[#0E1014] text-slate-300 border-white/10 hover:border-amber-500/40 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>1. Automated Stress-Testing Harness</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer border ${
              activeTab === 'templates'
                ? 'bg-amber-500 text-zinc-950 border-amber-400 font-semibold shadow-[0_0_24px_rgba(245,158,11,0.25)]'
                : 'bg-[#0E1014] text-slate-300 border-white/10 hover:border-amber-500/40 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>2. C++20 Contest Templates & Speed Snippets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('debugger')}
            className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer border ${
              activeTab === 'debugger'
                ? 'bg-amber-500 text-zinc-950 border-amber-400 font-semibold shadow-[0_0_24px_rgba(245,158,11,0.25)]'
                : 'bg-[#0E1014] text-slate-300 border-white/10 hover:border-amber-500/40 hover:text-white'
            }`}
          >
            <Bug className="w-4 h-4" />
            <span>3. Interactive Verdict Debugger (WA / TLE / MLE / RE)</span>
          </button>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* TAB 1: AUTOMATED STRESS-TESTING HARNESS                               */}
      {/* ===================================================================== */}
      {activeTab === 'harness' && (
        <div className="space-y-8">
          {/* Workflow Overview Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-[#13151A] p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">
                  STEP 01 · GENERATOR (gen.cpp)
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  N ≤ 8..12
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Emit small, adversarial inputs seeded deterministically via{' '}
                <code className="font-mono text-amber-300">argv[1]</code>. Keep{' '}
                <code className="font-mono text-slate-200">N ≤ 8</code> so the
                first failing test case is tiny enough to trace by hand on paper
                in 30 seconds.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#13151A] p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-400">
                  STEP 02 · ORACLE (brute.cpp)
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  O(N³) / O(2^N)
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Write the dumbest possible ground-truth brute force with zero
                clever optimizations. Prioritize 100% mathematical certainty
                over runtime speed.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#13151A] p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-rose-400">
                  STEP 03 · AUTO-DIFF LOOP
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  1,000+ tests/sec
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Run the loop until outputs diverge (or custom checker fails).
                The exact failing input remains saved in{' '}
                <code className="font-mono text-rose-300">in.txt</code> for
                instant GDB or printf inspection.
              </p>
            </div>
          </div>

          {/* Section 1A: Harness Source Files (gen.cpp / brute.cpp / sol.cpp) */}
          <section className="rounded-2xl border border-white/10 bg-[#13151A] overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>
                    Core Stress-Testing Triad (gen.cpp · brute.cpp · sol.cpp)
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Includes uniform/chain/star/caterpillar tree generators,
                  connected undirected graphs, random acyclic DAGs, and
                  controllable-alphabet strings.
                </p>
              </div>

              {/* File Sub-Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {STRESS_HARNESS_FILES.map((file) => {
                  const active = file.id === activeHarnessFile.id;
                  return (
                    <button
                      key={file.id}
                      type="button"
                      onClick={() => setSelectedHarnessFileId(file.id)}
                      className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold transition-colors cursor-pointer border ${
                        active
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-[#0E1014] border-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {file.filename}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Harness File Meta + Compile Bar */}
            <div className="px-5 sm:px-6 py-4 bg-[#191C23] border-b border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 font-mono text-xs font-bold text-amber-300">
                    {activeHarnessFile.filename}
                  </span>
                  <span className="font-display text-sm font-semibold text-slate-100">
                    {activeHarnessFile.title}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {activeHarnessFile.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="px-3 py-1.5 rounded-md bg-[#0E1014] border border-white/10 font-mono text-xs text-emerald-300">
                  $ {activeHarnessFile.compileCmd}
                </div>
                <CopyButton
                  text={activeHarnessFile.compileCmd}
                  label="Copy Compile Cmd"
                  compact
                />
                <CopyButton
                  text={activeHarnessFile.code}
                  label={`Copy ${activeHarnessFile.filename}`}
                  compact
                />
              </div>
            </div>

            {/* Code Block */}
            <div className="p-4 sm:p-6 bg-[#0E1014] overflow-x-auto">
              <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200">
                <code>{activeHarnessFile.code}</code>
              </pre>
            </div>
          </section>

          {/* Section 1B: Cross-Platform Auto-Diff Runners */}
          <section className="rounded-2xl border border-white/10 bg-[#13151A] overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>
                    Cross-Platform Auto-Diff Runner Scripts (Bash · PowerShell ·
                    Python 3 Custom Checker)
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Switch between Linux/macOS Bash, Windows PowerShell, or Python
                  3 (recommended for problems with non-unique valid outputs or
                  floating-point epsilon tolerance).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {STRESS_RUNNER_SCRIPTS.map((runner) => {
                  const active = runner.id === activeRunnerScript.id;
                  return (
                    <button
                      key={runner.id}
                      type="button"
                      onClick={() => setSelectedRunnerId(runner.id)}
                      className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold transition-colors cursor-pointer border ${
                        active
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-[#0E1014] border-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {runner.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-5 sm:px-6 py-4 bg-[#191C23] border-b border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 font-mono text-xs font-bold text-emerald-300">
                    {activeRunnerScript.filename}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[11px] text-slate-300">
                    {activeRunnerScript.platform}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Launch:{' '}
                    <strong className="text-slate-200">
                      {activeRunnerScript.runCmd}
                    </strong>
                  </span>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  {activeRunnerScript.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <CopyButton
                  text={activeRunnerScript.runCmd}
                  label="Copy Run Cmd"
                  compact
                />
                <CopyButton
                  text={activeRunnerScript.code}
                  label={`Copy ${activeRunnerScript.filename}`}
                  compact
                />
              </div>
            </div>

            <div className="relative p-4 sm:p-6 bg-[#0E1014] overflow-x-auto">
              <div
                aria-hidden="true"
                className="gv-crt-scanlines pointer-events-none absolute inset-0 opacity-35"
              />
              <div className="relative z-10 mb-3 flex items-center justify-between border-b border-white/10 pb-2.5 font-mono text-xs text-emerald-300">
                <span>
                  root@grandmaster-lab:~/stress${' '}
                  <strong className="text-amber-300">
                    {activeRunnerScript.runCmd}
                  </strong>
                  <span aria-hidden="true" className="gv-crt-cursor" />
                </span>
                <span className="text-[11px] text-slate-500">
                  1000+ tests/sec · auto-halt on diff
                </span>
              </div>
              <pre className="relative z-10 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200">
                <code>{activeRunnerScript.code}</code>
              </pre>
            </div>
          </section>

          {/* Section 1C: Sanitizer & Compiler Flags Cheat Card */}
          <section className="space-y-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Sanitizer & Compiler Flags Cheat Card</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Know exactly when to enable Address/Undefined-Behavior
                Sanitizers vs. full{' '}
                <code className="font-mono text-amber-300">-O2</code>{' '}
                hardware-throughput benchmarking.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {COMPILER_FLAG_PRESETS.map((preset) => {
                const isDebug = preset.id.includes('debug');
                return (
                  <div
                    key={preset.id}
                    className="rounded-2xl border border-white/10 bg-[#13151A] p-5 sm:p-6 flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded font-mono text-[11px] font-bold border ${
                              isDebug
                                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                            }`}
                          >
                            {preset.badge}
                          </span>
                          <h3 className="font-display text-base font-bold text-slate-100 mt-2">
                            {preset.mode}
                          </h3>
                        </div>
                        <CopyButton
                          text={preset.command}
                          label="Copy g++ Cmd"
                          compact
                        />
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0E1014] border border-white/10 font-mono text-xs text-amber-300 overflow-x-auto">
                        $ {preset.command}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        <strong className="text-slate-100">When to use:</strong>{' '}
                        {preset.whenToUse}
                      </p>

                      <div className="space-y-2 pt-1">
                        <div className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                          Flag-by-Flag Breakdown
                        </div>
                        <div className="space-y-2">
                          {preset.flagsExplained.map((fb) => (
                            <div
                              key={fb.flag}
                              className="p-2.5 rounded-lg bg-[#0E1014] border border-white/[0.06] flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-3"
                            >
                              <code className="font-mono text-xs font-bold text-amber-400 shrink-0">
                                {fb.flag}
                              </code>
                              <span className="text-xs text-slate-300">
                                {fb.meaning}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: BATTLE-TESTED C++20 CONTEST TEMPLATES & SPEED SNIPPETS         */}
      {/* ===================================================================== */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* Category Filter Bar */}
          <div className="rounded-2xl border border-white/10 bg-[#13151A] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {SNIPPET_CATEGORY_FILTERS.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold transition-colors cursor-pointer border ${
                      active
                        ? 'bg-amber-500 text-zinc-950 border-amber-400'
                        : 'bg-[#0E1014] border-white/10 text-slate-300 hover:border-amber-500/40 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="font-mono text-xs text-slate-400">
              Showing{' '}
              <strong className="text-amber-400">
                {filteredTemplates.length}
              </strong>{' '}
              drop-in contest modules
            </div>
          </div>

          {/* Template Cards wrapped in SpotlightCard + ScrollReveal */}
          <div className="space-y-6">
            {filteredTemplates.map((tpl, idx) => (
              <ScrollReveal key={tpl.id} index={idx}>
                <SpotlightCard className="rounded-2xl border border-white/10 bg-[#13151A] overflow-hidden">
                  <div className="p-5 sm:p-6 border-b border-white/10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 font-mono text-[11px] font-bold text-amber-300">
                          {tpl.categoryLabel}
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 font-mono text-[11px] font-semibold text-emerald-300">
                          {tpl.complexity}
                        </span>
                      </div>

                      <h3 className="font-display text-lg sm:text-xl font-bold text-slate-100">
                        {tpl.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {tpl.summary}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <CopyButton text={tpl.code} label="Copy Full Template" />
                    </div>
                  </div>

                  {/* Critical Pitfall Strip */}
                  <div className="px-5 sm:px-6 py-3.5 bg-rose-500/10 border-b border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-200">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-mono uppercase text-rose-300">
                        Critical Contest Trap:{' '}
                      </strong>
                      <span>{tpl.pitfallWarning}</span>
                    </div>
                  </div>

                  {/* Source Code */}
                  <div className="p-4 sm:p-6 bg-[#0E1014] overflow-x-auto">
                    <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200">
                      <code>{tpl.code}</code>
                    </pre>
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: INTERACTIVE VERDICT DEBUGGER (WA / TLE / MLE / RE / ILE)       */}
      {/* ===================================================================== */}
      {activeTab === 'debugger' && (
        <div className="space-y-6">
          {/* Verdict Selector Grid */}
          <section className="rounded-2xl border border-white/10 bg-[#13151A] p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>Select Your Judge Verdict to Triage</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Each verdict ranks the top 5 root causes by real contest
                  frequency. Tick off items as you verify them in your submission
                  — your checklist state persists automatically in localStorage.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={resetCurrentVerdictChecks}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#0E1014] text-xs font-mono text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Current Verdict</span>
                </button>
                {totalCheckedAcrossAll > 0 && (
                  <button
                    type="button"
                    onClick={resetAllVerdictChecks}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs font-mono text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
                  >
                    <span>Reset All ({totalCheckedAcrossAll})</span>
                  </button>
                )}
              </div>
            </div>

            {/* 6 Verdict Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {VERDICT_CATEGORIES.map((verdict) => {
                const isSelected = verdict.id === activeVerdict.id;
                const checkedCount = verdict.diagnostics.filter(
                  (d) => checkedDiagnostics[d.id],
                ).length;

                return (
                  <button
                    key={verdict.id}
                    type="button"
                    onClick={() => setSelectedVerdictId(verdict.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${getVerdictToneClasses(
                      verdict.badgeColor,
                      isSelected,
                    )}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm font-bold tracking-tight">
                        {verdict.shortCode} · {verdict.label}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold ${
                          checkedCount === verdict.diagnostics.length
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-black/30 text-slate-300 border border-white/10'
                        }`}
                      >
                        {checkedCount}/{verdict.diagnostics.length} checked
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-medium">
                      {verdict.tagline}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Active Verdict Header Banner */}
          <div className="rounded-xl border border-white/10 bg-[#191C23] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="font-mono text-xs uppercase text-amber-400 font-bold">
                ACTIVE TRIAGE CHECKLIST · {activeVerdict.shortCode}
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-slate-100 mt-0.5">
                {activeVerdict.label} — {activeVerdict.tagline}
              </h3>
            </div>
            <div className="font-mono text-xs text-slate-400">
              Click{' '}
              <strong className="text-emerald-300">
                &quot;Mark Verified&quot;
              </strong>{' '}
              on each card after auditing your code
            </div>
          </div>

          {/* 5 Ranked Diagnostic Cards with Smooth Expand/Collapse & SpotlightCard */}
          <div key={activeVerdict.id} className="gv-view-enter space-y-4">
            {activeVerdict.diagnostics.map((item, idx) => {
              const isChecked = Boolean(checkedDiagnostics[item.id]);
              const isCollapsed = Boolean(collapsedCards[item.id]);

              return (
                <ScrollReveal key={item.id} index={idx}>
                  <SpotlightCard
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isChecked
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : 'border-white/10 bg-[#13151A]'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="p-5 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <span
                          className={`w-8 h-8 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 border ${
                            isChecked
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          }`}
                        >
                          #{item.rank}
                        </span>
                        <div>
                          <h4
                            className={`font-display text-base sm:text-lg font-bold ${
                              isChecked
                                ? 'text-emerald-300 line-through decoration-emerald-500/60'
                                : 'text-slate-100'
                            }`}
                          >
                            {item.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                            <strong className="text-slate-100">Symptom:</strong>{' '}
                            {item.symptom}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setCollapsedCards((prev) => ({
                              ...prev,
                              [item.id]: !prev[item.id],
                            }))
                          }
                          aria-label={
                            isCollapsed
                              ? 'Expand diagnostic details'
                              : 'Collapse diagnostic details'
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl border border-white/10 bg-[#0E1014] text-xs font-mono text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          {isCollapsed ? (
                            <>
                              <span>Expand</span>
                              <ChevronDown className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <>
                              <span>Collapse</span>
                              <ChevronUp className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleDiagnosticCheck(item.id)}
                          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-semibold border transition-colors cursor-pointer shrink-0 ${
                            isChecked
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                              : 'bg-[#0E1014] border-white/15 text-slate-300 hover:border-amber-500/40 hover:text-amber-300'
                          }`}
                        >
                          {isChecked ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Verified & Ruled Out</span>
                            </>
                          ) : (
                            <>
                              <Circle className="w-4 h-4 text-slate-400" />
                              <span>Mark Verified</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Side-by-Side Buggy Pattern vs Exact Fix */}
                    {!isCollapsed && (
                      <div className="gv-view-enter grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                        {/* Buggy Code Pattern */}
                        <div className="p-5 bg-[#0E1014]/60 space-y-2">
                          <div className="flex items-center gap-2 font-mono text-xs font-bold text-rose-400 uppercase">
                            <Cpu className="w-3.5 h-3.5" />
                            <span>Buggy Code Pattern</span>
                          </div>
                          <pre className="font-mono text-xs leading-relaxed text-rose-200/90 whitespace-pre-wrap break-words bg-rose-950/20 border border-rose-500/20 rounded-xl p-3.5">
                            <code>{item.buggyPattern}</code>
                          </pre>
                        </div>

                        {/* Exact Fix */}
                        <div className="p-5 bg-[#0E1014]/60 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase">
                              <Wrench className="w-3.5 h-3.5" />
                              <span>Exact Contest Fix</span>
                            </div>
                            <CopyButton
                              text={item.exactFix}
                              label="Copy Fix"
                              compact
                            />
                          </div>
                          <pre className="font-mono text-xs leading-relaxed text-emerald-100 whitespace-pre-wrap break-words bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3.5">
                            <code>{item.exactFix}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </SpotlightCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
