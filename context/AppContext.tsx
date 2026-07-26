import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import { getTodayKey } from '@/lib/dates';
import {
  loadAppData,
  saveDays,
  saveSettings,
} from '@/storage/persistence';
import type {
  ActivityInput,
  DayActivity,
  Settings,
} from '@/types/models';

/** Everything the app keeps in memory. */
type AppState = {
  settings: Settings;
  days: Record<string, DayActivity>;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
};

type HydrateAction = {
  type: 'HYDRATE';
  payload: { settings: Settings; days: Record<string, DayActivity> };
};

type UpdateSettingsAction = {
  type: 'UPDATE_SETTINGS';
  payload: Settings;
};

type UpsertTodayAction = {
  type: 'UPSERT_TODAY';
  payload: ActivityInput;
};

type SetSavingAction = { type: 'SET_SAVING'; payload: boolean };
type SetErrorAction = { type: 'SET_ERROR'; payload: string | null };

type AppAction =
  | HydrateAction
  | UpdateSettingsAction
  | UpsertTodayAction
  | SetSavingAction
  | SetErrorAction;

/** Actions exposed to screens via the useAppState hook. */
type AppContextValue = AppState & {
  updateSettings: (settings: Settings) => Promise<void>;
  upsertToday: (input: ActivityInput) => Promise<void>;
  getTodayActivity: () => DayActivity | undefined;
};

const AppContext = createContext<AppContextValue | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        settings: action.payload.settings,
        days: action.payload.days,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: action.payload, error: null };
    case 'UPSERT_TODAY': {
      const date = getTodayKey();
      const entry: DayActivity = {
        date,
        ...action.payload,
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        days: { ...state.days, [date]: entry },
        error: null,
      };
    }
    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const initialState: AppState = {
  settings: {
    associateName: '',
    dailySalesGoal: 1000,
    commissionRate: 5,
  },
  days: {},
  isLoading: true,
  isSaving: false,
  error: null,
};

type AppProviderProps = {
  children: ReactNode;
};

/**
 * AppProvider wraps the navigation tree and owns global state.
 * React Context is a good fit here: one user, small state, great for learning.
 */
export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Hydrate from AsyncStorage once when the app mounts.
  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      try {
        const data = await loadAppData();
        if (mounted) {
          dispatch({ type: 'HYDRATE', payload: data });
        }
      } catch {
        if (mounted) {
          dispatch({
            type: 'HYDRATE',
            payload: { settings: initialState.settings, days: {} },
          });
          dispatch({
            type: 'SET_ERROR',
            payload: 'Could not load saved data. Using defaults.',
          });
        }
      }
    }

    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  const getTodayActivity = useCallback(() => {
    return state.days[getTodayKey()];
  }, [state.days]);

  const updateSettings = useCallback(async (settings: Settings) => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      await saveSettings(settings);
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    } catch {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Could not save settings. Please try again.',
      });
      throw new Error('save settings failed');
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, []);

  const upsertToday = useCallback(
    async (input: ActivityInput) => {
      dispatch({ type: 'SET_SAVING', payload: true });
      const date = getTodayKey();
      const entry: DayActivity = {
        date,
        ...input,
        updatedAt: new Date().toISOString(),
      };
      const nextDays = { ...state.days, [date]: entry };

      try {
        await saveDays(nextDays);
        dispatch({ type: 'UPSERT_TODAY', payload: input });
      } catch {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Could not save today\'s activity. Please try again.',
        });
        throw new Error('save activity failed');
      } finally {
        dispatch({ type: 'SET_SAVING', payload: false });
      }
    },
    [state.days],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      updateSettings,
      upsertToday,
      getTodayActivity,
    }),
    [state, updateSettings, upsertToday, getTodayActivity],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/** Hook to read/write global app state. Must be used inside AppProvider. */
export function useAppState(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}
