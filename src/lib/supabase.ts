import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type {
  AuthSessionState,
  CustomCmsEntry,
  UserProgressState,
} from '../types/vault';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined;

export const ADMIN_EMAIL =
  (import.meta.env.VITE_ADMIN_EMAIL as string | undefined) ||
  'randomboy4016@gmail.com';

function isValidHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function initSupabaseClient(): SupabaseClient | null {
  if (!isValidHttpUrl(SUPABASE_URL) || !SUPABASE_KEY || !SUPABASE_KEY.trim()) {
    return null;
  }
  try {
    return createClient(SUPABASE_URL.trim(), SUPABASE_KEY.trim());
  } catch {
    return null;
  }
}

export const supabase: SupabaseClient | null = initSupabaseClient();
export const isSupabaseConfigured = Boolean(supabase);

const LS_PROGRESS_KEY = 'gv_user_progress_v1';
const LS_CUSTOM_KEY = 'gv_custom_entries_v1';
const LS_LOCAL_AUTH_KEY = 'gv_local_auth_v1';

export const DEFAULT_PROGRESS: UserProgressState = {
  completedTopics: ['prefix-sums-difference-arrays'],
  bookmarkedSlugs: ['general-graph-matching-blossom', 'shortest-even-simple-path-blossom'],
  solvedProblems: [],
  projectChecklists: {},
  mistakeLogs: [
    {
      id: 'seed-mistake-1',
      problemTitle: 'Static Range Sum Queries Edge Case',
      platform: 'CSES',
      ratingTier: '800–1100',
      failureType: 'Overflow',
      rootCause:
        'Used 32-bit int for prefix sums when N = 2e5 and a_i = 1e9; total sum reaches 2e14.',
      preventionRule:
        'Default to long long (i64 in Rust) for all cumulative sums unless N * max(a_i) is proven < 2e9.',
      createdAt: '2026-11-12',
    },
    {
      id: 'seed-mistake-2',
      problemTitle: 'Unordered Map Hack on Codeforces Round',
      platform: 'Codeforces',
      ratingTier: '1600–1900',
      failureType: 'TLE',
      rootCause:
        'Used std::unordered_map<long long, int> without splitmix64 custom hash; adversarial anti-hash test caused O(N^2) collisions.',
      preventionRule:
        'Always attach splitmix64 custom_hash in C++ and XOR random 64-bit salt in Python dicts.',
      createdAt: '2026-11-15',
    },
  ],
};

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

function normalizeProgress(raw: Partial<UserProgressState> | null | undefined): UserProgressState {
  if (!raw || typeof raw !== 'object') return DEFAULT_PROGRESS;
  return {
    completedTopics: Array.isArray(raw.completedTopics)
      ? raw.completedTopics
      : DEFAULT_PROGRESS.completedTopics,
    bookmarkedSlugs: Array.isArray(raw.bookmarkedSlugs)
      ? raw.bookmarkedSlugs
      : DEFAULT_PROGRESS.bookmarkedSlugs,
    solvedProblems: Array.isArray(raw.solvedProblems)
      ? raw.solvedProblems
      : DEFAULT_PROGRESS.solvedProblems,
    projectChecklists:
      raw.projectChecklists && typeof raw.projectChecklists === 'object'
        ? raw.projectChecklists
        : DEFAULT_PROGRESS.projectChecklists,
    mistakeLogs: Array.isArray(raw.mistakeLogs)
      ? raw.mistakeLogs
      : DEFAULT_PROGRESS.mistakeLogs,
  };
}

function safeWriteJson<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors in restricted sandboxes
  }
}

export async function getSessionState(): Promise<AuthSessionState> {
  if (supabase) {
    try {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      const email = user?.email ?? null;
      return {
        email,
        userId: user?.id ?? null,
        isAdmin: email?.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
        isDemoAdmin: false,
        mode: 'supabase',
      };
    } catch {
      // Fall back to local mode if network/Supabase call fails
    }
  }

  const localAuth = safeReadJson<{
    email: string | null;
    isDemoAdmin: boolean;
  }>(LS_LOCAL_AUTH_KEY, { email: null, isDemoAdmin: false });

  return {
    email: localAuth?.email ?? null,
    userId: localAuth?.email ? 'local-user' : null,
    isAdmin:
      Boolean(localAuth?.isDemoAdmin) ||
      localAuth?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
    isDemoAdmin: Boolean(localAuth?.isDemoAdmin),
    mode: 'local',
  };
}

export async function signInWithEmailPassword(
  email: string,
  password: string,
): Promise<{ error: string | null; session: AuthSessionState }> {
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { error: error.message, session: await getSessionState() };
    }
    const userEmail = data.user?.email ?? null;
    return {
      error: null,
      session: {
        email: userEmail,
        userId: data.user?.id ?? null,
        isAdmin: userEmail?.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
        isDemoAdmin: false,
        mode: 'supabase',
      },
    };
  }

  if (!email.includes('@') || password.length < 4) {
    return {
      error: 'Enter a valid email and password (minimum 4 characters).',
      session: await getSessionState(),
    };
  }

  const isDemoAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  safeWriteJson(LS_LOCAL_AUTH_KEY, { email, isDemoAdmin });
  return {
    error: null,
    session: {
      email,
      userId: 'local-user',
      isAdmin: isDemoAdmin,
      isDemoAdmin,
      mode: 'local',
    },
  };
}

export async function signUpWithEmailPassword(
  email: string,
  password: string,
): Promise<{ error: string | null; session: AuthSessionState }> {
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return { error: error.message, session: await getSessionState() };
    }
    const userEmail = data.user?.email ?? null;
    return {
      error: null,
      session: {
        email: userEmail,
        userId: data.user?.id ?? null,
        isAdmin: userEmail?.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
        isDemoAdmin: false,
        mode: 'supabase',
      },
    };
  }

  return signInWithEmailPassword(email, password);
}

export async function toggleDemoAdminMode(
  enabled: boolean,
): Promise<AuthSessionState> {
  if (supabase) {
    return getSessionState();
  }
  const current = safeReadJson<{ email: string | null; isDemoAdmin: boolean }>(
    LS_LOCAL_AUTH_KEY,
    { email: null, isDemoAdmin: false },
  );
  const nextEmail = enabled
    ? current?.email || ADMIN_EMAIL
    : current?.email === ADMIN_EMAIL
      ? null
      : current?.email ?? null;
  safeWriteJson(LS_LOCAL_AUTH_KEY, {
    email: nextEmail,
    isDemoAdmin: enabled,
  });
  return getSessionState();
}

export async function signOutUser(): Promise<AuthSessionState> {
  if (supabase) {
    await supabase.auth.signOut();
    return getSessionState();
  }
  safeWriteJson(LS_LOCAL_AUTH_KEY, { email: null, isDemoAdmin: false });
  return getSessionState();
}

export async function loadUserProgress(
  userId: string | null,
): Promise<UserProgressState> {
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) {
        return normalizeProgress({
          completedTopics: data.completed_topics ?? [],
          bookmarkedSlugs: data.bookmarked_slugs ?? [],
          solvedProblems: data.solved_problems ?? [],
          projectChecklists: data.project_checklists ?? {},
          mistakeLogs: data.mistake_logs ?? [],
        });
      }
    } catch {
      // Fall through to localStorage
    }
  }
  return normalizeProgress(
    safeReadJson<UserProgressState>(LS_PROGRESS_KEY, DEFAULT_PROGRESS),
  );
}

export async function saveUserProgress(
  userId: string | null,
  progress: UserProgressState,
): Promise<void> {
  safeWriteJson(LS_PROGRESS_KEY, progress);
  if (supabase && userId) {
    try {
      await supabase.from('user_progress').upsert(
        {
          user_id: userId,
          completed_topics: progress.completedTopics,
          bookmarked_slugs: progress.bookmarkedSlugs,
          solved_problems: progress.solvedProblems,
          project_checklists: progress.projectChecklists,
          mistake_logs: progress.mistakeLogs,
        },
        { onConflict: 'user_id' },
      );
    } catch {
      // Ignore transient network errors; localStorage is already saved
    }
  }
}

export async function loadCustomEntries(): Promise<CustomCmsEntry[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('custom_entries')
        .select('*')
        .order('updated_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map((row) => ({
          id: row.id,
          entryType: row.entry_type,
          slug: row.slug,
          title: row.title,
          ratingTier: row.rating_tier,
          usacoDivision: row.usaco_division,
          domain: row.domain,
          summary: row.payload?.summary ?? '',
          payload: row.payload ?? {},
          updatedAt: row.updated_at,
        }));
      }
    } catch {
      // Fall back to localStorage
    }
  }
  const stored = safeReadJson<CustomCmsEntry[]>(LS_CUSTOM_KEY, []);
  return Array.isArray(stored) ? stored : [];
}

export async function upsertCustomEntry(
  entry: CustomCmsEntry,
  authorEmail: string,
): Promise<CustomCmsEntry[]> {
  if (supabase) {
    await supabase.from('custom_entries').upsert(
      {
        id: entry.id,
        entry_type: entry.entryType,
        slug: entry.slug,
        title: entry.title,
        rating_tier: entry.ratingTier,
        usaco_division: entry.usacoDivision,
        domain: entry.domain,
        payload: { ...entry.payload, summary: entry.summary },
        author_email: authorEmail,
      },
      { onConflict: 'slug' },
    );
    return loadCustomEntries();
  }

  const existing = safeReadJson<CustomCmsEntry[]>(LS_CUSTOM_KEY, []);
  const idx = existing.findIndex(
    (item) => item.id === entry.id || item.slug === entry.slug,
  );
  const next =
    idx >= 0
      ? existing.map((item, i) => (i === idx ? entry : item))
      : [entry, ...existing];
  safeWriteJson(LS_CUSTOM_KEY, next);
  return next;
}

export async function deleteCustomEntry(id: string): Promise<CustomCmsEntry[]> {
  if (supabase) {
    await supabase.from('custom_entries').delete().eq('id', id);
    return loadCustomEntries();
  }
  const existing = safeReadJson<CustomCmsEntry[]>(LS_CUSTOM_KEY, []);
  const next = existing.filter((item) => item.id !== id);
  safeWriteJson(LS_CUSTOM_KEY, next);
  return next;
}
