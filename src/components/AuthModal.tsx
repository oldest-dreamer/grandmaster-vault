import { useState } from 'react';
import { LogOut, ShieldCheck, X } from 'lucide-react';
import {
  ADMIN_EMAIL,
  isSupabaseConfigured,
  signInWithEmailPassword,
  signOutUser,
  signUpWithEmailPassword,
  toggleDemoAdminMode,
} from '../lib/supabase';
import type { AuthSessionState } from '../types/vault';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  session: AuthSessionState;
  onSessionChange: (next: AuthSessionState) => void;
  onOpenCms: () => void;
}

export function AuthModal({
  open,
  onClose,
  session,
  onSessionChange,
  onOpenCms,
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result =
      mode === 'signin'
        ? await signInWithEmailPassword(email.trim(), password)
        : await signUpWithEmailPassword(email.trim(), password);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onSessionChange(result.session);
    onClose();
  };

  const handleToggleDemoAdmin = async () => {
    const next = await toggleDemoAdminMode(!session.isDemoAdmin);
    onSessionChange(next);
  };

  const handleSignOut = async () => {
    const next = await signOutUser();
    onSessionChange(next);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-white/15 bg-[#13151A] p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Account and Admin Access"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              Vault Account & Persistence
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isSupabaseConfigured
                ? 'Connected to Supabase Auth & Row-Level Security.'
                : 'Preview Mode: localStorage active with instant Demo Admin support.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {session.email || session.isDemoAdmin ? (
          <div className="space-y-4 rounded-lg border border-white/10 bg-[#0E1014] p-4">
            <div className="space-y-1">
              <div className="text-xs text-slate-400">Signed in as</div>
              <div className="text-sm font-mono text-slate-100">
                {session.email || ADMIN_EMAIL}
              </div>
              <div className="text-xs text-amber-400 font-medium">
                {session.isAdmin
                  ? 'Admin CMS Write Access Enabled'
                  : 'Standard Learner Profile'}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
              {session.isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCms();
                  }}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 cursor-pointer"
                >
                  Open CMS Drawer
                </button>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-white/10 bg-[#191C23] text-slate-200 hover:text-white cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="flex gap-1 p-1 rounded-lg bg-[#0B0C0E] border border-white/10">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-[#191C23] text-amber-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-[#191C23] text-amber-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-3 py-2 text-sm rounded-lg border border-white/10 bg-[#0B0C0E] text-slate-100 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm rounded-lg border border-white/10 bg-[#0B0C0E] text-slate-100 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-lg border border-rose-500/40 bg-rose-500/10 text-xs text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 text-xs font-semibold rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {busy
                ? 'Authenticating...'
                : mode === 'signin'
                  ? 'Sign In with Email'
                  : 'Create Learner Account'}
            </button>
          </form>
        )}

        {!isSupabaseConfigured && (
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Demo Admin Mode</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Test Admin CMS creation & editing locally without Supabase env keys.
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleDemoAdmin}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                session.isDemoAdmin
                  ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                  : 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
              }`}
            >
              {session.isDemoAdmin ? 'Enabled' : 'Enable Demo'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
