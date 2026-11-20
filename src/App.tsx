import { useCallback, useEffect, useMemo, useState } from 'react';
import { Shield } from 'lucide-react';
import { AuthGate } from './components/AuthGate';
import { AuthModal } from './components/AuthModal';
import { CmsDrawerModal } from './components/CmsDrawerModal';
import { CommandSearchModal } from './components/CommandSearchModal';
import { ContestLabView } from './components/ContestLabView';
import { FxProvider } from './components/fx/FxProvider';
import { PatternDrillView } from './components/PatternDrillView';
import { TopBar } from './components/TopBar';
import { TopTickerBar } from './components/TopTickerBar';
import { WorkspaceToolbar } from './components/WorkspaceToolbar';
import {
  getAllChapters,
  getAllVaultBreakdowns,
  mergeSyllabusWithCustom,
} from './data/contentRegistry';
import {
  ADMIN_EMAIL,
  DEFAULT_PROGRESS,
  deleteCustomEntry,
  getSessionState,
  loadCustomEntries,
  loadUserProgress,
  saveUserProgress,
  signOutUser,
  subscribeToAuthChanges,
  upsertCustomEntry,
} from './lib/supabase';
import type {
  AuthSessionState,
  CustomCmsEntry,
  MasterDomain,
  MistakeLogEntry,
  RatingTier,
  UsacoDivision,
  UserProgressState,
} from './types/vault';
import { LanguagesView } from './views/LanguagesView';
import { PlaybookView } from './views/PlaybookView';
import { RoadmapView } from './views/RoadmapView';
import { TheoryView } from './views/TheoryView';
import { VaultView } from './views/VaultView';

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '') return '/';
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() =>
    normalizePath(window.location.pathname),
  );
  const [selectedTier, setSelectedTier] = useState<RatingTier | 'All'>('All');
  const [selectedUsaco, setSelectedUsaco] = useState<UsacoDivision | 'All'>(
    'All',
  );
  const [selectedDomain, setSelectedDomain] = useState<MasterDomain | 'All'>(
    'All',
  );

  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(false);

  const [authInitializing, setAuthInitializing] = useState(true);
  const [session, setSession] = useState<AuthSessionState>({
    email: null,
    userId: null,
    isAdmin: false,
    isDemoAdmin: false,
    mode: 'local',
  });
  const [progress, setProgress] = useState<UserProgressState>(DEFAULT_PROGRESS);
  const [customEntries, setCustomEntries] = useState<CustomCmsEntry[]>([]);

  const isAuthenticated = Boolean(session.email || session.isDemoAdmin);

  // Initial hydration from Supabase or localStorage fallback (Zero Content Flash)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await getSessionState();
        const [prog, custom] = await Promise.all([
          loadUserProgress(s.userId),
          loadCustomEntries(),
        ]);
        if (!mounted) return;
        setSession(s);
        setProgress(prog);
        setCustomEntries(custom);
      } finally {
        if (mounted) {
          setAuthInitializing(false);
        }
      }
    })();

    const unsubscribe = subscribeToAuthChanges((nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      void loadUserProgress(nextSession.userId).then((prog) => {
        if (mounted) setProgress(prog);
      });
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Browser back/forward navigation support
  useEffect(() => {
    const onPop = () => setCurrentPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Global Ctrl+K / Cmd+K instant search shortcut (active only when authenticated)
  useEffect(() => {
    if (!isAuthenticated || authInitializing) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isAuthenticated, authInitializing]);

  const navigate = useCallback((path: string) => {
    const next = normalizePath(path);
    if (next !== normalizePath(window.location.pathname)) {
      window.history.pushState({}, '', next);
    }
    setCurrentPath(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const syllabus = useMemo(
    () => mergeSyllabusWithCustom(customEntries),
    [customEntries],
  );
  const chapters = useMemo(
    () => getAllChapters(customEntries),
    [customEntries],
  );
  const vaults = useMemo(
    () => getAllVaultBreakdowns(customEntries),
    [customEntries],
  );

  const updateProgress = useCallback(
    (updater: (prev: UserProgressState) => UserProgressState) => {
      setProgress((prev) => {
        const next = updater(prev);
        void saveUserProgress(session.userId, next);
        return next;
      });
    },
    [session.userId],
  );

  const handleToggleComplete = (slug: string) => {
    updateProgress((prev) => {
      const exists = prev.completedTopics.includes(slug);
      return {
        ...prev,
        completedTopics: exists
          ? prev.completedTopics.filter((s) => s !== slug)
          : [...prev.completedTopics, slug],
      };
    });
  };

  const handleToggleBookmark = (slug: string) => {
    updateProgress((prev) => {
      const exists = prev.bookmarkedSlugs.includes(slug);
      return {
        ...prev,
        bookmarkedSlugs: exists
          ? prev.bookmarkedSlugs.filter((s) => s !== slug)
          : [...prev.bookmarkedSlugs, slug],
      };
    });
  };

  const handleToggleSolvedProblem = (problemId: string) => {
    updateProgress((prev) => {
      const exists = prev.solvedProblems.includes(problemId);
      return {
        ...prev,
        solvedProblems: exists
          ? prev.solvedProblems.filter((id) => id !== problemId)
          : [...prev.solvedProblems, problemId],
      };
    });
  };

  const handleToggleProjectMilestone = (
    chapterSlug: string,
    milestoneId: string,
  ) => {
    updateProgress((prev) => {
      const currentList = prev.projectChecklists[chapterSlug] ?? [];
      const exists = currentList.includes(milestoneId);
      const nextList = exists
        ? currentList.filter((id) => id !== milestoneId)
        : [...currentList, milestoneId];
      return {
        ...prev,
        projectChecklists: {
          ...prev.projectChecklists,
          [chapterSlug]: nextList,
        },
      };
    });
  };

  const handleAddMistake = (entry: MistakeLogEntry) => {
    updateProgress((prev) => ({
      ...prev,
      mistakeLogs: [entry, ...prev.mistakeLogs],
    }));
  };

  const handleDeleteMistake = (id: string) => {
    updateProgress((prev) => ({
      ...prev,
      mistakeLogs: prev.mistakeLogs.filter((m) => m.id !== id),
    }));
  };

  const handleSaveCmsEntry = async (entry: CustomCmsEntry) => {
    const updated = await upsertCustomEntry(
      entry,
      session.email || ADMIN_EMAIL,
    );
    setCustomEntries(updated);
  };

  const handleDeleteCmsEntry = async (id: string) => {
    const updated = await deleteCustomEntry(id);
    setCustomEntries(updated);
  };

  const handleSessionChange = async (nextSession: AuthSessionState) => {
    setSession(nextSession);
    const prog = await loadUserProgress(nextSession.userId);
    setProgress(prog);
  };

  const handleSignOut = async () => {
    setAuthOpen(false);
    setCmsOpen(false);
    setSearchOpen(false);
    const clearedSession = await signOutUser();
    setSession(clearedSession);
  };

  // Route dispatch
  const renderView = () => {
    if (currentPath === '/' || currentPath === '/roadmap') {
      return (
        <RoadmapView
          syllabus={syllabus}
          chapters={chapters}
          vaults={vaults}
          progress={progress}
          onSelectRatingTier={(tier) => setSelectedTier(tier)}
          onNavigate={navigate}
          onToggleComplete={handleToggleComplete}
        />
      );
    }

    if (currentPath === '/drills') {
      return <PatternDrillView onNavigate={navigate} />;
    }

    if (currentPath === '/theory' || currentPath.startsWith('/theory/')) {
      const slug = currentPath.startsWith('/theory/')
        ? currentPath.slice('/theory/'.length)
        : undefined;
      return (
        <TheoryView
          slug={slug}
          syllabus={syllabus}
          chapters={chapters}
          selectedTier={selectedTier}
          selectedUsaco={selectedUsaco}
          selectedDomain={selectedDomain}
          progress={progress}
          onToggleComplete={handleToggleComplete}
          onToggleBookmark={handleToggleBookmark}
          onToggleSolvedProblem={handleToggleSolvedProblem}
          onToggleProjectMilestone={handleToggleProjectMilestone}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/vault' || currentPath.startsWith('/vault/')) {
      const slug = currentPath.startsWith('/vault/')
        ? currentPath.slice('/vault/'.length)
        : undefined;
      return (
        <VaultView
          slug={slug}
          vaults={vaults}
          selectedTier={selectedTier}
          selectedUsaco={selectedUsaco}
          selectedDomain={selectedDomain}
          progress={progress}
          onToggleBookmark={handleToggleBookmark}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/lab') {
      return <ContestLabView />;
    }

    if (currentPath === '/languages') {
      return <LanguagesView />;
    }

    if (currentPath === '/playbook') {
      return (
        <PlaybookView
          mistakeLogs={progress.mistakeLogs}
          onAddMistake={handleAddMistake}
          onDeleteMistake={handleDeleteMistake}
        />
      );
    }

    return (
      <RoadmapView
        syllabus={syllabus}
        chapters={chapters}
        vaults={vaults}
        progress={progress}
        onSelectRatingTier={(tier) => setSelectedTier(tier)}
        onNavigate={navigate}
        onToggleComplete={handleToggleComplete}
      />
    );
  };

  // 1. Zero Content Flash on Reload while verifying initial session
  if (authInitializing) {
    return (
      <FxProvider>
        <div className="min-h-screen w-full bg-[#06070A] text-[#E5E7EB] flex flex-col items-center justify-center p-6 select-none">
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-center shadow-[0_0_32px_rgba(245,158,11,0.25)] animate-pulse">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-center space-y-1">
              <div className="font-mono text-xs font-semibold tracking-wider text-amber-300">
                Verifying Vault Session...
              </div>
              <div className="font-mono text-[11px] text-slate-500">
                GRANDMASTER VAULT
              </div>
            </div>
          </div>
        </div>
      </FxProvider>
    );
  }

  // 2. Strict Mandatory Full-Screen Auth Gate when unauthenticated
  if (!isAuthenticated) {
    return (
      <FxProvider>
        <AuthGate onSessionAuthenticated={handleSessionChange} />
      </FxProvider>
    );
  }

  // 3. Authenticated Grandmaster Vault Workspace
  return (
    <FxProvider>
      <div className="min-h-screen flex flex-col bg-[#0B0C0E] text-[#E5E7EB]">
        <TopTickerBar
          onNavigate={navigate}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <TopBar
          currentPath={currentPath}
          onNavigate={navigate}
          session={session}
          onOpenAuth={() => setAuthOpen(true)}
          onSignOut={handleSignOut}
        />

        <WorkspaceToolbar
          selectedTier={selectedTier}
          onTierChange={setSelectedTier}
          selectedUsaco={selectedUsaco}
          onUsacoChange={setSelectedUsaco}
          selectedDomain={selectedDomain}
          onDomainChange={setSelectedDomain}
          onOpenSearch={() => setSearchOpen(true)}
          isAdmin={session.isAdmin}
          onOpenCms={() => setCmsOpen(true)}
        />

        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div key={currentPath} className="gv-view-enter">
            {renderView()}
          </div>
        </main>

        <footer className="border-t border-white/10 bg-[#0B0C0E] py-6">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>
              Grandmaster Vault · Competitive Programming Encyclopedia (800–3300+)
            </span>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => navigate('/theory')}
                className="hover:text-slate-300 cursor-pointer"
              >
                80-Topic Syllabus
              </button>
              <button
                type="button"
                onClick={() => navigate('/vault')}
                className="hover:text-slate-300 cursor-pointer"
              >
                Reduction Vault
              </button>
              <button
                type="button"
                onClick={() => navigate('/lab')}
                className="hover:text-slate-300 cursor-pointer"
              >
                Contest Lab
              </button>
              <button
                type="button"
                onClick={() => navigate('/languages')}
                className="hover:text-slate-300 cursor-pointer"
              >
                5-Language Matrix
              </button>
            </div>
          </div>
        </footer>

        <CommandSearchModal
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          syllabus={syllabus}
          chapters={chapters}
          vaults={vaults}
          onNavigate={navigate}
        />

        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          session={session}
          onSessionChange={handleSessionChange}
          onOpenCms={() => setCmsOpen(true)}
        />

        <CmsDrawerModal
          open={cmsOpen}
          onClose={() => setCmsOpen(false)}
          entries={customEntries}
          onSaveEntry={handleSaveCmsEntry}
          onDeleteEntry={handleDeleteCmsEntry}
          onNavigate={navigate}
        />
      </div>
    </FxProvider>
  );
}
