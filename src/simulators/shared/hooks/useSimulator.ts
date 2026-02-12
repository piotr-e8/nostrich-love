/**
 * useSimulator Hook - Core State Management
 * React Context + useReducer pattern for simulator state
 */

import { 
  createContext, 
  useContext, 
  useReducer, 
  useCallback, 
  useMemo,
  type ReactNode,
  type Dispatch
} from 'react';
import type { 
  SimulatorState, 
  SimulatorAction, 
  SimulatorContextValue,
  SimulatorConfig,
  SimulatorUser,
  SimulatorView,
  SimulatorModal,
  SimulatorFeedItem,
  SimulatorNotification,
  SimulatorThread,
  SimulatorSearchResult,
  MockNote,
} from '../types';
import { now } from '../utils/mockEvents';

// ============================================
// INITIAL STATE
// ============================================

const createInitialState = (): SimulatorState => ({
  // Identity
  currentUser: null,
  isLoggedIn: false,
  
  // Navigation
  currentView: SimulatorView.FEED,
  previousView: null,
  activeModal: SimulatorModal.NONE,
  modalData: null,
  
  // Content
  feed: [],
  notifications: [],
  messages: [],
  currentThread: null,
  
  // Social
  following: [],
  followers: [],
  mutedUsers: [],
  mutedWords: [],
  pinnedNotes: [],
  
  // Relays
  connectedRelays: [],
  relayConfigs: {},
  
  // UI State
  isLoading: false,
  error: null,
  searchQuery: '',
  searchResults: null,
  
  // Session metadata
  sessionStartTime: now(),
  lastActivityTime: now(),
});

// ============================================
// REDUCER
// ============================================

function simulatorReducer(state: SimulatorState, action: SimulatorAction): SimulatorState {
  const updateActivity = (s: SimulatorState): SimulatorState => ({
    ...s,
    lastActivityTime: now(),
  });

  switch (action.type) {
    case 'LOGIN': {
      return updateActivity({
        ...state,
        currentUser: action.payload.user,
        isLoggedIn: true,
        following: [], // Reset for new session
      });
    }

    case 'LOGOUT': {
      return createInitialState();
    }

    case 'SET_VIEW': {
      return updateActivity({
        ...state,
        previousView: state.currentView,
        currentView: action.payload.view,
      });
    }

    case 'GO_BACK': {
      if (!state.previousView) return state;
      return updateActivity({
        ...state,
        currentView: state.previousView,
        previousView: null,
      });
    }

    case 'OPEN_MODAL': {
      return updateActivity({
        ...state,
        activeModal: action.payload.modal,
        modalData: action.payload.data || null,
      });
    }

    case 'CLOSE_MODAL': {
      return updateActivity({
        ...state,
        activeModal: SimulatorModal.NONE,
        modalData: null,
      });
    }

    case 'SET_FEED': {
      return updateActivity({
        ...state,
        feed: action.payload.feed,
      });
    }

    case 'ADD_FEED_ITEMS': {
      return updateActivity({
        ...state,
        feed: [...state.feed, ...action.payload.items],
      });
    }

    case 'LIKE_NOTE': {
      return updateActivity({
        ...state,
        feed: state.feed.map(item => 
          item.note.id === action.payload.noteId
            ? { ...item, note: { ...item.note, likes: item.note.likes + 1 } }
            : item
        ),
      });
    }

    case 'UNLIKE_NOTE': {
      return updateActivity({
        ...state,
        feed: state.feed.map(item => 
          item.note.id === action.payload.noteId
            ? { ...item, note: { ...item.note, likes: Math.max(0, item.note.likes - 1) } }
            : item
        ),
      });
    }

    case 'REPOST_NOTE': {
      return updateActivity({
        ...state,
        feed: state.feed.map(item => 
          item.note.id === action.payload.noteId
            ? { ...item, note: { ...item.note, reposts: item.note.reposts + 1 } }
            : item
        ),
      });
    }

    case 'UNREPOST_NOTE': {
      return updateActivity({
        ...state,
        feed: state.feed.map(item => 
          item.note.id === action.payload.noteId
            ? { ...item, note: { ...item.note, reposts: Math.max(0, item.note.reposts - 1) } }
            : item
        ),
      });
    }

    case 'CREATE_NOTE': {
      // In a real app, this would create and broadcast the event
      // For simulation, we'll just log it
      console.log('[Simulator] Creating note:', action.payload);
      return updateActivity(state);
    }

    case 'CREATE_REPLY': {
      console.log('[Simulator] Creating reply:', action.payload);
      return updateActivity(state);
    }

    case 'FOLLOW_USER': {
      if (state.following.includes(action.payload.pubkey)) return state;
      return updateActivity({
        ...state,
        following: [...state.following, action.payload.pubkey],
      });
    }

    case 'UNFOLLOW_USER': {
      return updateActivity({
        ...state,
        following: state.following.filter(p => p !== action.payload.pubkey),
      });
    }

    case 'MUTE_USER': {
      if (state.mutedUsers.includes(action.payload.pubkey)) return state;
      return updateActivity({
        ...state,
        mutedUsers: [...state.mutedUsers, action.payload.pubkey],
      });
    }

    case 'UNMUTE_USER': {
      return updateActivity({
        ...state,
        mutedUsers: state.mutedUsers.filter(p => p !== action.payload.pubkey),
      });
    }

    case 'PIN_NOTE': {
      if (state.pinnedNotes.includes(action.payload.noteId)) return state;
      return updateActivity({
        ...state,
        pinnedNotes: [...state.pinnedNotes, action.payload.noteId],
      });
    }

    case 'UNPIN_NOTE': {
      return updateActivity({
        ...state,
        pinnedNotes: state.pinnedNotes.filter(id => id !== action.payload.noteId),
      });
    }

    case 'CONNECT_RELAY': {
      const { url } = action.payload;
      if (state.connectedRelays.includes(url)) return state;
      return updateActivity({
        ...state,
        connectedRelays: [...state.connectedRelays, url],
        relayConfigs: {
          ...state.relayConfigs,
          [url]: {
            ...state.relayConfigs[url],
            url,
            isConnected: true,
          },
        },
      });
    }

    case 'DISCONNECT_RELAY': {
      const { url } = action.payload;
      return updateActivity({
        ...state,
        connectedRelays: state.connectedRelays.filter(r => r !== url),
        relayConfigs: {
          ...state.relayConfigs,
          [url]: {
            ...state.relayConfigs[url],
            url,
            isConnected: false,
          },
        },
      });
    }

    case 'SET_RELAY_POLICY': {
      const { url, read, write } = action.payload;
      return updateActivity({
        ...state,
        relayConfigs: {
          ...state.relayConfigs,
          [url]: {
            ...state.relayConfigs[url],
            url,
            readPolicy: read,
            writePolicy: write,
          },
        },
      });
    }

    case 'MARK_NOTIFICATIONS_READ': {
      return updateActivity({
        ...state,
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      });
    }

    case 'MARK_MESSAGES_READ': {
      const { pubkey } = action.payload;
      return updateActivity({
        ...state,
        messages: state.messages.map(m => 
          m.pubkey === pubkey && !m.isOutgoing
            ? { ...m, isRead: true }
            : m
        ),
      });
    }

    case 'SEARCH': {
      return updateActivity({
        ...state,
        searchQuery: action.payload.query,
        isLoading: true,
      });
    }

    case 'SET_SEARCH_RESULTS': {
      return updateActivity({
        ...state,
        searchResults: action.payload.results,
        isLoading: false,
      });
    }

    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    }

    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload.error,
        isLoading: false,
      };
    }

    case 'SET_THREAD': {
      return updateActivity({
        ...state,
        currentThread: action.payload.thread,
      });
    }

    case 'UPDATE_USER_PROFILE': {
      if (!state.currentUser) return state;
      return updateActivity({
        ...state,
        currentUser: {
          ...state.currentUser,
          ...action.payload.updates,
        },
      });
    }

    case 'ZAP_NOTE': {
      const { noteId, amount } = action.payload;
      return updateActivity({
        ...state,
        feed: state.feed.map(item => 
          item.note.id === noteId
            ? { 
                ...item, 
                note: { 
                  ...item.note, 
                  zaps: item.note.zaps + 1,
                  zapAmount: item.note.zapAmount + amount,
                } 
              }
            : item
        ),
      });
    }

    case 'UPDATE_TIMESTAMP': {
      return {
        ...state,
        lastActivityTime: now(),
      };
    }

    default:
      return state;
  }
}

// ============================================
// CONTEXT
// ============================================

interface SimulatorContextState {
  state: SimulatorState;
  dispatch: Dispatch<SimulatorAction>;
  config: SimulatorConfig;
}

const SimulatorContext = createContext<SimulatorContextState | null>(null);

// ============================================
// PROVIDER
// ============================================

interface SimulatorProviderProps {
  children: ReactNode;
  config: SimulatorConfig;
  initialState?: Partial<SimulatorState>;
}

export function SimulatorProvider({ 
  children, 
  config, 
  initialState 
}: SimulatorProviderProps) {
  const [state, dispatch] = useReducer(
    simulatorReducer,
    createInitialState(),
    (init) => ({ ...init, ...initialState })
  );

  const value = useMemo(() => ({
    state,
    dispatch,
    config,
  }), [state, dispatch, config]);

  return (
    <SimulatorContext.Provider value={value}>
      {children}
    </SimulatorContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useSimulator(): SimulatorContextValue {
  const context = useContext(SimulatorContext);
  
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }

  const { state, dispatch, config } = context;

  // Convenience methods
  const login = useCallback((user: SimulatorUser) => {
    dispatch({ type: 'LOGIN', payload: { user } });
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, [dispatch]);

  const navigateTo = useCallback((view: SimulatorView) => {
    dispatch({ type: 'SET_VIEW', payload: { view } });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, [dispatch]);

  const openModal = useCallback((modal: SimulatorModal, data?: Record<string, unknown>) => {
    dispatch({ type: 'OPEN_MODAL', payload: { modal, data } });
  }, [dispatch]);

  const closeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, [dispatch]);

  const likeNote = useCallback((noteId: string) => {
    dispatch({ type: 'LIKE_NOTE', payload: { noteId } });
  }, [dispatch]);

  const unlikeNote = useCallback((noteId: string) => {
    dispatch({ type: 'UNLIKE_NOTE', payload: { noteId } });
  }, [dispatch]);

  const repostNote = useCallback((noteId: string) => {
    dispatch({ type: 'REPOST_NOTE', payload: { noteId } });
  }, [dispatch]);

  const unrepostNote = useCallback((noteId: string) => {
    dispatch({ type: 'UNREPOST_NOTE', payload: { noteId } });
  }, [dispatch]);

  const createNote = useCallback((content: string, tags?: string[][]) => {
    dispatch({ type: 'CREATE_NOTE', payload: { content, tags } });
  }, [dispatch]);

  const createReply = useCallback((parentId: string, content: string) => {
    dispatch({ type: 'CREATE_REPLY', payload: { parentId, content } });
  }, [dispatch]);

  const followUser = useCallback((pubkey: string) => {
    dispatch({ type: 'FOLLOW_USER', payload: { pubkey } });
  }, [dispatch]);

  const unfollowUser = useCallback((pubkey: string) => {
    dispatch({ type: 'UNFOLLOW_USER', payload: { pubkey } });
  }, [dispatch]);

  const muteUser = useCallback((pubkey: string) => {
    dispatch({ type: 'MUTE_USER', payload: { pubkey } });
  }, [dispatch]);

  const unmuteUser = useCallback((pubkey: string) => {
    dispatch({ type: 'UNMUTE_USER', payload: { pubkey } });
  }, [dispatch]);

  const pinNote = useCallback((noteId: string) => {
    dispatch({ type: 'PIN_NOTE', payload: { noteId } });
  }, [dispatch]);

  const unpinNote = useCallback((noteId: string) => {
    dispatch({ type: 'UNPIN_NOTE', payload: { noteId } });
  }, [dispatch]);

  const connectRelay = useCallback((url: string) => {
    dispatch({ type: 'CONNECT_RELAY', payload: { url } });
  }, [dispatch]);

  const disconnectRelay = useCallback((url: string) => {
    dispatch({ type: 'DISCONNECT_RELAY', payload: { url } });
  }, [dispatch]);

  const search = useCallback((query: string) => {
    dispatch({ type: 'SEARCH', payload: { query } });
  }, [dispatch]);

  const zapNote = useCallback((noteId: string, amount: number, message?: string) => {
    dispatch({ type: 'ZAP_NOTE', payload: { noteId, amount, message } });
  }, [dispatch]);

  return useMemo(() => ({
    state,
    dispatch,
    config,
    login,
    logout,
    navigateTo,
    goBack,
    openModal,
    closeModal,
    likeNote,
    unlikeNote,
    repostNote,
    unrepostNote,
    createNote,
    createReply,
    followUser,
    unfollowUser,
    muteUser,
    unmuteUser,
    pinNote,
    unpinNote,
    connectRelay,
    disconnectRelay,
    search,
    zapNote,
  }), [
    state, dispatch, config,
    login, logout, navigateTo, goBack, openModal, closeModal,
    likeNote, unlikeNote, repostNote, unrepostNote,
    createNote, createReply, followUser, unfollowUser,
    muteUser, unmuteUser, pinNote, unpinNote,
    connectRelay, disconnectRelay, search, zapNote,
  ]);
}

// ============================================
// SELECTOR HOOKS
// ============================================

export function useSimulatorState(): SimulatorState {
  const { state } = useContext(SimulatorContext) || {};
  if (!state) throw new Error('useSimulatorState must be used within SimulatorProvider');
  return state;
}

export function useCurrentUser(): SimulatorUser | null {
  return useSimulatorState().currentUser;
}

export function useIsLoggedIn(): boolean {
  return useSimulatorState().isLoggedIn;
}

export function useCurrentView(): SimulatorView {
  return useSimulatorState().currentView;
}

export function useActiveModal(): SimulatorModal {
  return useSimulatorState().activeModal;
}

export function useFeed(): SimulatorFeedItem[] {
  return useSimulatorState().feed;
}

export function useNotifications(): SimulatorNotification[] {
  return useSimulatorState().notifications;
}

export function useUnreadNotificationsCount(): number {
  return useSimulatorState().notifications.filter(n => !n.isRead).length;
}

export function useFollowing(): string[] {
  return useSimulatorState().following;
}

export function useConnectedRelays(): string[] {
  return useSimulatorState().connectedRelays;
}

export function useIsLoading(): boolean {
  return useSimulatorState().isLoading;
}

export function useSimulatorError(): string | null {
  return useSimulatorState().error;
}

export { SimulatorContext, SimulatorProvider };
export default useSimulator;
