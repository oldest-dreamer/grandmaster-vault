import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogOut,
  Mail,
  ShieldCheck,
  Terminal,
  X,
} from 'lucide-react';
import {
  ADMIN_EMAIL,
  isSupabaseConfigured,
  signInWithEmailPassword,
  signOutUser,
  signUpWithEmailPassword,
  toggleDemoAdminMode,
} from '../lib/supabase';
import type { AuthSessionState } from '../types/vault';
import { useFxMode } from './fx/FxProvider';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  session: AuthSessionState;
  onSessionChange: (next: AuthSessionState) => void;
  onOpenCms: () => void;
}

function sanitizeEmailPreview(raw: string): string {
  const cleaned = raw.trim().replace(/[^a-zA-Z0-9._+-@]/g, '');
  if (!cleaned) return 'anonymous@vault.local';
  if (cleaned.length <= 28) return cleaned;
  return `${cleaned.slice(0, 25)}...`;
}

export function AuthModal({
  open,
  onClose,
  session,
  onSessionChange,
  onOpenCms,
}: AuthModalProps) {
  const { isFullFx } = useFxMode();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Escape key closes modal
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Reset transient feedback when switching Sign In / Sign Up tabs
  const handleModeSwitch = (nextMode: 'signin' | 'signup') => {
    setMode(nextMode);
    setError(null);
    setSuccessMsg(null);
  };

  const isAuthenticated = Boolean(session.email || session.isDemoAdmin);

  // Live reactive terminal output line based on current form/auth state
  const terminalState = useMemo(() => {
    if (busy) {
      return {
        tone: 'amber' as const,
        prefix: '> status:',
        message: '> verifying session with ap-southeast-1...',
      };
    }
    if (error) {
      return {
        tone: 'crimson' as const,
        prefix: '> status:',
        message: `[ERR] Authentication failed (${error})`,
      };
    }
    if (successMsg || isAuthenticated) {
      return {
        tone: 'emerald' as const,
        prefix: '> status:',
        message: '[OK] Session verified — entering Grandmaster Vault',
      };
    }
    if (email.trim().length > 0) {
      const target = sanitizeEmailPreview(email);
      const roleHint =
        email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()
          ? 'ADMIN_RLS'
          : 'LEARNER_RLS';
      return {
        tone: 'amber' as const,
        prefix: '> status:',
        message: `> target="${target}" mode=${mode.toUpperCase()} policy=${roleHint}`,
      };
    }
    return {
      tone: 'slate' as const,
      prefix: '> status:',
      message: '> awaiting credentials...',
    };
  }, [busy, error, successMsg, isAuthenticated, email, mode]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Valid email address required for session handshake.');
      return;
    }
    if (password.length < 4) {
      setError('Password must contain at least 4 characters.');
      return;
    }

    setBusy(true);
    const result =
      mode === 'signin'
        ? await signInWithEmailPassword(trimmedEmail, password)
        : await signUpWithEmailPassword(trimmedEmail, password);
    setBusy(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccessMsg('[OK] Session verified — entering Grandmaster Vault');
    onSessionChange(result.session);
    setPassword('');
    onClose();
  };

  const handleToggleDemoAdmin = async () => {
    setError(null);
    const next = await toggleDemoAdminMode(!session.isDemoAdmin);
    onSessionChange(next);
    if (next.isDemoAdmin) {
      setSuccessMsg('[OK] Demo Admin session unlocked.');
    } else {
      setSuccessMsg(null);
    }
  };

  const handleSignOut = async () => {
    setError(null);
    setSuccessMsg(null);
    const next = await signOutUser();
    onSessionChange(next);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#07080A]/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      {/* Subtle circuit dot-grid backdrop & soft Amber Gold ambient radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(rgba(245, 158, 11, 0.16) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {isFullFx && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[360px] rounded-full bg-amber-500/10 blur-[110px]"
        />
      )}

      {/* Responsive Split-Pane IDE Card */}
      <div
        className="relative z-10 w-full max-w-4xl rounded-2xl border border-white/15 bg-[#0E1015] shadow-[0_28px_90px_rgba(0,0,0,0.85)] overflow-hidden lg:grid lg:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Grandmaster Vault Authentication Terminal"
      >
        {/* Mobile-Only Compact Terminal Header Bar */}
        <div className="flex lg:hidden items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#090A0D]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            </div>
            <span className="ml-1.5 inline-flex items-center gap-1.5 font-mono text-[11px] text-amber-300">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>vault_auth.cpp</span>
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            C++20 · RLS: PROTECTED
          </span>
        </div>

        {/* Left Pane — Live Interactive C++20 Code & Terminal Preview (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between border-r border-white/10 bg-[#090B0E]">
          {/* Top IDE Window Tab Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0C0E13]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/90 border border-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/90 border border-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60 border border-amber-400/40" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#13161E] border border-white/10 text-xs font-mono text-slate-200">
                <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                <span>vault_auth.cpp</span>
              </div>
            </div>

            <span className="font-mono text-[11px] text-slate-500">
              -O3 -std=c++20
            </span>
          </div>

          {/* Authentic C++20 Handshake Code Block */}
          <div className="p-5 font-mono text-xs leading-relaxed select-none overflow-x-auto">
            <div className="grid grid-cols-[28px_1fr] gap-y-1 text-slate-300">
              <span className="text-slate-600 text-right pr-3">01</span>
              <span>
                <span className="text-slate-500">
                  // Grandmaster Vault RLS Session Handshake
                </span>
              </span>

              <span className="text-slate-600 text-right pr-3">02</span>
              <span>
                <span className="text-amber-400">#include</span>{' '}
                <span className="text-emerald-400">&lt;vault/rls_auth.hpp&gt;</span>
              </span>

              <span className="text-slate-600 text-right pr-3">03</span>
              <span>&nbsp;</span>

              <span className="text-slate-600 text-right pr-3">04</span>
              <span>
                <span className="text-amber-400">struct</span>{' '}
                <span className="text-slate-100 font-semibold">
                  GrandmasterSession
                </span>{' '}
                &#123;
              </span>

              <span className="text-slate-600 text-right pr-3">05</span>
              <span className="pl-4">
                <span className="text-amber-300">std::string_view</span>{' '}
                subject ={' '}
                <span className="text-emerald-400">
                  &quot;
                  {isAuthenticated
                    ? sanitizeEmailPreview(session.email || ADMIN_EMAIL)
                    : sanitizeEmailPreview(email)}
                  &quot;
                </span>
                ;
              </span>

              <span className="text-slate-600 text-right pr-3">06</span>
              <span className="pl-4">
                <span className="text-amber-300">std::string_view</span>{' '}
                intent ={' '}
                <span className="text-emerald-400">
                  &quot;{mode === 'signin' ? 'SIGN_IN' : 'SIGN_UP'}&quot;
                </span>
                ;
              </span>

              <span className="text-slate-600 text-right pr-3">07</span>
              <span className="pl-4">
                <span className="text-amber-400">bool</span> rls_enforced ={' '}
                <span className="text-amber-300">true</span>;
              </span>

              <span className="text-slate-600 text-right pr-3">08</span>
              <span>&#125;;</span>

              <span className="text-slate-600 text-right pr-3">09</span>
              <span>&nbsp;</span>

              <span className="text-slate-600 text-right pr-3">10</span>
              <span>
                <span className="text-amber-400">[[nodiscard]] bool</span>{' '}
                <span className="text-slate-100 font-semibold">
                  unlock_vault
                </span>
                (<span className="text-amber-400">const</span>{' '}
                GrandmasterSession&amp; s) &#123;
              </span>

              <span className="text-slate-600 text-right pr-3">11</span>
              <span className="pl-4">
                <span className="text-amber-400">if</span> (!
                <span className="text-slate-100">verify_rls_token</span>
                (s.subject, s.intent)) &#123;
              </span>

              <span className="text-slate-600 text-right pr-3">12</span>
              <span className="pl-8">
                <span className="text-amber-400">return</span>{' '}
                <span className="text-amber-300">false</span>;{' '}
                <span className="text-slate-500">// reject unauthorized</span>
              </span>

              <span className="text-slate-600 text-right pr-3">13</span>
              <span className="pl-4">&#125;</span>

              <span className="text-slate-600 text-right pr-3">14</span>
              <span className="pl-4">
                <span className="text-amber-400">return</span>{' '}
                <span className="text-slate-100">mount_workspace_state</span>
                (s.subject);
              </span>

              <span className="text-slate-600 text-right pr-3">15</span>
              <span>&#125;</span>
            </div>
          </div>

          {/* Bottom Console Output + IDE Status Bar */}
          <div className="mt-auto border-t border-white/10 bg-[#07080B]">
            {/* Live Reactive Terminal Output Strip */}
            <div className="p-4 space-y-2 border-b border-white/10">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>TERMINAL OUTPUT</span>
                </span>
                <span className="text-slate-500">
                  {isSupabaseConfigured ? 'SUPABASE_CLOUD' : 'LOCAL_SANDBOX'}
                </span>
              </div>

              <div
                className={`rounded-lg border px-3 py-2.5 font-mono text-xs leading-relaxed break-all transition-colors ${
                  terminalState.tone === 'crimson'
                    ? 'border-rose-500/40 bg-rose-950/25 text-rose-300'
                    : terminalState.tone === 'emerald'
                      ? 'border-emerald-500/40 bg-emerald-950/25 text-emerald-300'
                      : terminalState.tone === 'amber'
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                        : 'border-white/10 bg-[#0C0E13] text-slate-300'
                }`}
              >
                <div className="text-[10px] text-slate-500 mb-0.5">
                  {terminalState.prefix}
                </div>
                <div className="flex items-center gap-1.5">
                  <span>{terminalState.message}</span>
                  {!busy && !error && (
                    <span
                      aria-hidden="true"
                      className={`inline-block w-1.5 h-3.5 bg-amber-400/80 ${
                        isFullFx ? 'animate-pulse' : ''
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom IDE Status Bar */}
            <div className="px-4 py-2 flex items-center justify-between font-mono text-[11px] text-slate-400 bg-[#050608]">
              <div className="flex items-center gap-2.5">
                <span className="text-amber-400 font-semibold">C++20</span>
                <span aria-hidden="true" className="text-slate-600">
                  |
                </span>
                <span>UTF-8</span>
                <span aria-hidden="true" className="text-slate-600">
                  |
                </span>
                <span className="text-emerald-400/90">RLS: PROTECTED</span>
              </div>
              <span className="text-slate-500">VAULT v2</span>
            </div>
          </div>
        </div>

        {/* Right Pane — Precision Sign In / Sign Up Form */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-[#0E1015]">
          <div className="space-y-6">
            {/* Top Branding & Eyebrow Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="font-mono text-[11px] tracking-wider text-amber-400">
                  // ACCESS TERMINAL
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                  Grandmaster Vault
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isSupabaseConfigured
                    ? 'Authenticate to sync 80-chapter progress, roadmap mastery, and mistake logs.'
                    : 'Local Workspace Mode active — progress syncs to browser storage with Demo Admin support.'}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close authentication modal"
                className="p-1.5 rounded-lg border border-white/10 bg-[#14171F] text-slate-400 hover:text-white hover:border-white/20 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Active Session View vs Sign In / Sign Up Form */}
            {isAuthenticated ? (
              <div className="space-y-4 rounded-xl border border-white/10 bg-zinc-950/80 p-5">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <span className="font-mono text-xs text-emerald-400 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>[OK] ACTIVE SESSION</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {session.mode.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="font-mono text-[11px] text-slate-400">
                    AUTHENTICATED IDENTITY
                  </div>
                  <div className="text-sm font-mono font-semibold text-slate-100 break-all">
                    {session.email || ADMIN_EMAIL}
                  </div>
                  <div className="text-xs text-amber-400 font-medium">
                    {session.isAdmin
                      ? 'Grandmaster Admin · Global CMS Write Privileges Unlocked'
                      : 'Competitor Profile · Progress & Mistake Log Sync Active'}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-white/10">
                  {session.isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenCms();
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors cursor-pointer"
                    >
                      <span>Open Admin CMS Drawer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-white/10 bg-[#171A22] text-slate-200 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Segmented Tab Switch: Sign In | Sign Up */}
                <div
                  className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-zinc-950/90 border border-white/10"
                  role="tablist"
                  aria-label="Authentication Mode"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'signin'}
                    onClick={() => handleModeSwitch('signin')}
                    className={`py-2 px-3 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      mode === 'signin'
                        ? 'bg-[#191D26] text-amber-300 border border-amber-500/30 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === 'signup'}
                    onClick={() => handleModeSwitch('signup')}
                    className={`py-2 px-3 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      mode === 'signup'
                        ? 'bg-[#191D26] text-amber-300 border border-amber-500/30 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="vault-auth-email"
                    className="block font-mono text-xs text-slate-300"
                  >
                    EMAIL_ADDRESS
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="vault-auth-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="handle@codeforces.org"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm font-mono rounded-xl border border-white/10 bg-zinc-950/80 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password Input with Show / Hide Eye Toggle */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="vault-auth-password"
                      className="block font-mono text-xs text-slate-300"
                    >
                      PASSWORD_KEY
                    </label>
                    <span className="font-mono text-[11px] text-slate-500">
                      min 4 chars
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="vault-auth-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={4}
                      autoComplete={
                        mode === 'signin' ? 'current-password' : 'new-password'
                      }
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-sm font-mono rounded-xl border border-white/10 bg-zinc-950/80 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Inline Terminal Feedback Banners */}
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 p-3 rounded-xl border border-rose-500/40 bg-rose-950/30 text-xs font-mono text-rose-200"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-semibold text-rose-400">
                        [ERR] AUTH_HANDSHAKE_FAILED
                      </span>
                      <p className="text-rose-200/90 leading-relaxed">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {successMsg && (
                  <div
                    role="status"
                    className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-xs font-mono text-emerald-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>{successMsg}</div>
                  </div>
                )}

                {/* Primary Amber Gold CTA Button */}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-2.5 px-4 text-xs font-mono font-bold tracking-wide rounded-xl bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.22)] hover:shadow-[0_0_32px_rgba(245,158,11,0.35)] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  {busy ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {mode === 'signin'
                          ? 'AUTHENTICATE & UNLOCK VAULT'
                          : 'INITIALIZE LEARNER ACCOUNT'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Footer Zone: Demo Admin Mode (when offline) + Guest Escape Hatch */}
          <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
            {!isSupabaseConfigured && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-950/70 px-3.5 py-2.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Demo Admin Mode</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    Unlock Admin CMS locally without Supabase keys
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleDemoAdmin}
                  className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    session.isDemoAdmin
                      ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                      : 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                  }`}
                >
                  {session.isDemoAdmin ? 'Enabled' : 'Enable Demo'}
                </button>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-slate-500">
              <span>Protected by Supabase Auth &amp; Row Level Security</span>
              <span className="text-emerald-400/90">RLS: ENFORCED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
