import { useState } from 'react';
import { LogOut, Menu, Sparkles, X } from 'lucide-react';
import type { AuthSessionState } from '../types/vault';
import { useFxMode } from './fx/FxProvider';

interface TopBarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  session: AuthSessionState;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

const NAV_ITEMS = [
  { label: 'Roadmap', path: '/' },
  { label: 'Pattern Drills', path: '/drills' },
  { label: 'Theory', path: '/theory' },
  { label: 'Vault', path: '/vault' },
  { label: 'Contest Lab', path: '/lab' },
  { label: 'Languages', path: '/languages' },
  { label: 'Playbook', path: '/playbook' },
];

export function TopBar({
  currentPath,
  onNavigate,
  session,
  onOpenAuth,
  onSignOut,
}: TopBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isFullFx, toggleFxMode } = useFxMode();

  const isActive = (itemPath: string) => {
    if (itemPath === '/') return currentPath === '/';
    return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
  };

  const actionLabel = session.isAdmin ? 'Admin Session' : 'Account';

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0C0E]/95 backdrop-blur-sm">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
            setMobileOpen(false);
          }}
          className="font-display text-lg font-bold tracking-tight text-slate-100 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
        >
          Grandmaster Vault
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.path);
                }}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                  active
                    ? 'text-amber-400 border-amber-400'
                    : 'text-slate-400 border-transparent hover:text-slate-100 hover:border-white/20'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: FX Motion Toggle + Session Drawer + Instant Sign Out */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleFxMode}
            title={
              isFullFx
                ? '60fps Visual FX active — click to switch to Reduced FX'
                : 'Reduced FX active — click to enable Full FX'
            }
            aria-label={isFullFx ? 'Switch to Reduced FX' : 'Switch to Full FX'}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isFullFx
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                : 'border-white/10 bg-[#13151A] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles
              className={`w-3.5 h-3.5 ${
                isFullFx ? 'text-amber-400' : 'text-slate-500'
              }`}
            />
            <span className="hidden sm:inline">
              {isFullFx ? 'Full FX' : 'Reduced FX'}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenAuth}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {actionLabel}
          </button>

          <button
            type="button"
            onClick={onSignOut}
            title="Sign Out and Lock Vault"
            aria-label="Sign Out and Lock Vault"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg border border-white/10 bg-[#13151A] text-slate-300 hover:text-rose-300 hover:border-rose-500/40 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Sign Out</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg border border-white/10 text-slate-300 hover:text-white cursor-pointer"
          >
            {mobileOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-white/10 bg-[#13151A] px-4 py-3 flex flex-col gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.path);
                  setMobileOpen(false);
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  active
                    ? 'bg-amber-500/15 text-amber-300'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
}
