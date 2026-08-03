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
  assignCustomer as assignCustomerOp,
  completeInteraction as completeInteractionOp,
  getAssociateName,
  getUpAssociateId,
  initSessionWithRoster,
} from '@/lib/floorRotation';
import {
  loadFloorSession,
  saveFloorSession,
} from '@/storage/floorPersistence';
import type { FloorSession, InteractionOutcome } from '@/types/floor';

type FloorState = {
  session: FloorSession;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
};

type HydrateAction = { type: 'HYDRATE'; payload: FloorSession };
type SetSessionAction = { type: 'SET_SESSION'; payload: FloorSession };
type SetSavingAction = { type: 'SET_SAVING'; payload: boolean };
type SetErrorAction = { type: 'SET_ERROR'; payload: string | null };

type FloorAction =
  | HydrateAction
  | SetSessionAction
  | SetSavingAction
  | SetErrorAction;

type FloorContextValue = FloorState & {
  upAssociateId: string | undefined;
  getName: (associateId: string) => string;
  startRoster: (names: string[]) => Promise<void>;
  assignCustomer: () => Promise<void>;
  completeInteraction: (
    interactionId: string,
    outcome: InteractionOutcome,
    walkReason?: string,
  ) => Promise<void>;
};

const FloorContext = createContext<FloorContextValue | null>(null);

function floorReducer(state: FloorState, action: FloorAction): FloorState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        session: action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_SESSION':
      return { ...state, session: action.payload, error: null };
    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

function emptyState(): FloorState {
  const date = getTodayKey();
  return {
    session: {
      date,
      roster: [],
      rotation: [],
      active: [],
      completed: [],
      updatedAt: new Date().toISOString(),
    },
    isLoading: true,
    isSaving: false,
    error: null,
  };
}

type FloorProviderProps = {
  children: ReactNode;
};

export function FloorProvider({ children }: FloorProviderProps) {
  const [state, dispatch] = useReducer(floorReducer, undefined, emptyState);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      try {
        const session = await loadFloorSession(getTodayKey());
        if (mounted) {
          dispatch({ type: 'HYDRATE', payload: session });
        }
      } catch {
        if (mounted) {
          dispatch({
            type: 'HYDRATE',
            payload: emptyState().session,
          });
          dispatch({
            type: 'SET_ERROR',
            payload: 'Could not load floor data.',
          });
        }
      }
    }

    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  const persistSession = useCallback(async (session: FloorSession) => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      await saveFloorSession(session);
      dispatch({ type: 'SET_SESSION', payload: session });
    } catch {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Could not save floor changes.',
      });
      throw new Error('save floor failed');
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, []);

  const startRoster = useCallback(
    async (names: string[]) => {
      const session = initSessionWithRoster(getTodayKey(), names);
      await persistSession(session);
    },
    [persistSession],
  );

  const assignCustomer = useCallback(async () => {
    const next = assignCustomerOp(state.session);
    if (next === state.session) {
      return;
    }
    await persistSession(next);
  }, [persistSession, state.session]);

  const completeInteraction = useCallback(
    async (
      interactionId: string,
      outcome: InteractionOutcome,
      walkReason?: string,
    ) => {
      const next = completeInteractionOp(
        state.session,
        interactionId,
        outcome,
        walkReason,
      );
      if (next === state.session) {
        return;
      }
      await persistSession(next);
    },
    [persistSession, state.session],
  );

  const value = useMemo<FloorContextValue>(
    () => ({
      ...state,
      upAssociateId: getUpAssociateId(state.session),
      getName: (id) => getAssociateName(state.session, id),
      startRoster,
      assignCustomer,
      completeInteraction,
    }),
    [state, startRoster, assignCustomer, completeInteraction],
  );

  return (
    <FloorContext.Provider value={value}>{children}</FloorContext.Provider>
  );
}

export function useFloorState(): FloorContextValue {
  const context = useContext(FloorContext);
  if (!context) {
    throw new Error('useFloorState must be used within FloorProvider');
  }
  return context;
}
