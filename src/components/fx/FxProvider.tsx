import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type FxMode = 'full' | 'reduced';

interface FxContextValue {
  fxMode: FxMode;
  isFullFx: boolean;
  toggleFxMode: () => void;
  setFxMode: (mode: FxMode) => void;
}

const FX_STORAGE_KEY = 'gv_fx_mode_v1';

const FxContext = createContext<FxContextValue>({
  fxMode: 'full',
  isFullFx: true,
  toggleFxMode: () => {},
  setFxMode: () => {},
});

function getInitialFxMode(): FxMode {
  try {
    const saved = localStorage.getItem(FX_STORAGE_KEY);
    if (saved === 'full' || saved === 'reduced') {
      return saved;
    }
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return 'reduced';
    }
  } catch {
    // Fallback to full FX
  }
  return 'full';
}

export function FxProvider({ children }: { children: ReactNode }) {
  const [fxMode, setFxModeState] = useState<FxMode>(() => getInitialFxMode());

  useEffect(() => {
    try {
      localStorage.setItem(FX_STORAGE_KEY, fxMode);
    } catch {
      // Ignore storage errors
    }
    const root = document.documentElement;
    if (fxMode === 'reduced') {
      root.classList.add('gv-reduced-fx');
    } else {
      root.classList.remove('gv-reduced-fx');
    }
  }, [fxMode]);

  const setFxMode = useCallback((mode: FxMode) => {
    setFxModeState(mode);
  }, []);

  const toggleFxMode = useCallback(() => {
    setFxModeState((prev) => (prev === 'full' ? 'reduced' : 'full'));
  }, []);

  const value = useMemo(
    () => ({
      fxMode,
      isFullFx: fxMode === 'full',
      toggleFxMode,
      setFxMode,
    }),
    [fxMode, toggleFxMode, setFxMode],
  );

  return <FxContext.Provider value={value}>{children}</FxContext.Provider>;
}

export function useFxMode(): FxContextValue {
  return useContext(FxContext);
}
