/**
 * Snort Simulator
 * Developer-friendly web Nostr client simulation
 * Desktop-first with dark theme
 */

import React, { useState, useCallback, useEffect, useMemo, useContext } from 'react';
import './snort.theme.css';
import { LoginScreen } from './screens/LoginScreen';
import { TimelineScreen } from './screens/TimelineScreen';
import { ThreadScreen } from './screens/ThreadScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { RelaysScreen } from './screens/RelaysScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ComposeScreen } from './screens/ComposeScreen';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useParentTheme } from '../shared/hooks/useParentTheme';
import type { MockUser, MockNote, MockThread } from '../../data/mock';
import { TourContext } from '../../components/tour';

export type SnortScreen = 'login' | 'timeline' | 'thread' | 'profile' | 'relays' | 'settings';

interface SnortSimulatorState {
  currentUser: MockUser | null;
  currentScreen: SnortScreen;
  selectedProfile: MockUser | null;
  selectedThread: MockThread | null;
  selectedNote: MockNote | null;
  isAuthenticated: boolean;
  isComposeOpen: boolean;
}

// Mock data loader - only loads on client
let mockDataCache: {
  users: MockUser[];
  notes: MockNote[];
  threads: MockThread[];
} | null = null;

const loadMockData = async () => {
  if (mockDataCache) return mockDataCache;
  
  if (typeof window === 'undefined') {
    // Return empty data during SSR
    return {
      users: [],
      notes: [],
      threads: [],
    };
  }
  
  // Dynamic import to avoid SSR issues
  const mockModule = await import('../../data/mock');
  mockDataCache = {
    users: mockModule.mockUsers || [],
    notes: mockModule.mockNotes || [],
    threads: mockModule.mockThreads || [],
  };
  return mockDataCache;
};

export interface SimulatorCommand {
  type: 'login' | 'navigate' | 'compose' | 'post' | 'viewProfile';
  payload?: any;
}

interface SnortSimulatorProps {
  tourCommand?: SimulatorCommand | null;
  onCommandHandled?: () => void;
}

export const SnortSimulator: React.FC<SnortSimulatorProps> = ({ tourCommand, onCommandHandled }) => {
  const parentTheme = useParentTheme();
  const tourContext = useContext(TourContext);
  const registerAction = (actionType: string) => {
    if (tourContext?.registerAction) {
      tourContext.registerAction(actionType);
    }
  };
  const [state, setState] = useState<SnortSimulatorState>({
    currentUser: null,
    currentScreen: 'login',
    selectedProfile: null,
    selectedThread: null,
    selectedNote: null,
    isAuthenticated: false,
    isComposeOpen: false,
  });

  const [mockData, setMockData] = useState<{
    users: MockUser[];
    notes: MockNote[];
    threads: MockThread[];
  }>({ users: [], notes: [], threads: [] });

  // Handle login
  const handleLogin = useCallback((user: MockUser) => {
    setState(prev => ({
      ...prev,
      currentUser: user,
      isAuthenticated: true,
      currentScreen: 'timeline',
    }));
    registerAction('login');
    registerAction('navigate_home');
    console.log('[Snort] Logged in as:', user.displayName);
  }, [registerAction]);

  // Load mock data on client side
  useEffect(() => {
    let isMounted = true;
    
    const initData = async () => {
      const data = await loadMockData();
      if (isMounted) {
        setMockData(data);
      }
    };

    initData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const navigateTo = useCallback((screen: SnortScreen) => {
    setState(prev => ({ ...prev, currentScreen: screen }));
    if (screen === 'timeline') registerAction('navigate_home');
    if (screen === 'settings') registerAction('navigate_settings');
    console.log('[Snort] Navigate to:', screen);
  }, [registerAction]);

  const navigateToProfile = useCallback((user: MockUser) => {
    setState(prev => ({
      ...prev,
      selectedProfile: user,
      currentScreen: 'profile',
    }));
    registerAction('view_profile');
    console.log('[Snort] View profile:', user.displayName);
  }, [registerAction]);

  const navigateToThread = useCallback((note: MockNote) => {
    const thread = mockData.threads.find(t => 
      t.rootNoteId === note.id || t.notes.some(n => n.id === note.id)
    );
    
    setState(prev => ({
      ...prev,
      selectedThread: thread || null,
      selectedNote: note,
      currentScreen: 'thread',
    }));
    console.log('[Snort] View thread:', note.id);
  }, [mockData.threads]);

  const openCompose = useCallback(() => {
    setState(prev => ({ ...prev, isComposeOpen: true }));
    registerAction('compose');
  }, [registerAction]);

  const closeCompose = useCallback(() => {
    setState(prev => ({ ...prev, isComposeOpen: false }));
  }, []);

  const handlePost = useCallback((content: string) => {
    console.log('[Snort] New post:', content);
    registerAction('post');
    closeCompose();
  }, [closeCompose, registerAction]);

  const handleReply = useCallback((parentId: string, content: string) => {
    console.log('[Snort] Reply to', parentId, ':', content);
  }, []);

  // Handle tour commands
  useEffect(() => {
    if (!tourCommand) return;

    console.log('[SnortSimulator] Processing command:', tourCommand);

    switch (tourCommand.type) {
      case 'login':
        if (!state.isAuthenticated) {
          // Create mock user
          const mockUser: MockUser = {
            pubkey: 'npub1snort123',
            displayName: 'Snort User',
            username: 'snortuser',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=snort',
            bio: 'Exploring Nostr with Snort',
            followersCount: 256,
            followingCount: 128,
            createdAt: Date.now() / 1000,
            lastActive: Date.now() / 1000,
          };
          handleLogin(mockUser);
        }
        break;

      case 'navigate':
        const screen = tourCommand.payload as SnortScreen;
        if (['login', 'timeline', 'thread', 'profile', 'relays', 'settings'].includes(screen)) {
          setState(prev => ({ ...prev, currentScreen: screen }));
        }
        break;

      case 'compose':
        if (state.isAuthenticated) {
          setState(prev => ({ ...prev, isComposeOpen: true }));
        }
        break;

      case 'post':
        if (state.isAuthenticated) {
          setState(prev => ({ ...prev, isComposeOpen: true }));
          // Simulate post after a short delay
          setTimeout(() => {
            handlePost('Tour test post!');
            setState(prev => ({ ...prev, isComposeOpen: false }));
          }, 500);
        }
        break;

      case 'viewProfile':
        if (state.isAuthenticated) {
          setState(prev => ({
            ...prev,
            selectedProfile: state.currentUser,
            currentScreen: 'profile',
          }));
        }
        break;
    }

    // Mark command as handled
    onCommandHandled?.();
  }, [tourCommand, state.isAuthenticated, state.currentUser, handleLogin, handlePost, onCommandHandled]);

  const toggleTheme = useCallback(() => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNewPost: openCompose,
    onSearch: () => console.log('[Snort] Search shortcut'),
    onGoHome: () => navigateTo('timeline'),
    onRefresh: () => console.log('[Snort] Refresh shortcut'),
  });

  const renderScreen = () => {
    // Show login screen if not authenticated
    if (!state.isAuthenticated || state.currentScreen === 'login') {
      return <LoginScreen onLogin={handleLogin} />;
    }

    switch (state.currentScreen) {
      case 'timeline':
        return (
          <TimelineScreen
            currentUser={state.currentUser}
            notes={mockData.notes}
            users={mockData.users}
            onNavigate={navigateTo}
            onViewProfile={navigateToProfile}
            onViewThread={navigateToThread}
            onOpenCompose={openCompose}
          />
        );
      case 'thread':
        return (
          <ThreadScreen
            thread={state.selectedThread}
            rootNote={state.selectedNote}
            currentUser={state.currentUser}
            users={mockData.users}
            onBack={() => navigateTo('timeline')}
            onViewProfile={navigateToProfile}
            onReply={handleReply}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            user={state.selectedProfile || state.currentUser}
            currentUser={state.currentUser}
            notes={mockData.notes}
            users={mockData.users}
            onBack={() => navigateTo('timeline')}
            onViewProfile={navigateToProfile}
          />
        );
      case 'relays':
        return <RelaysScreen onBack={() => navigateTo('timeline')} />;
      case 'settings':
        return (
          <SettingsScreen
            currentUser={state.currentUser}
            theme={state.theme}
            onToggleTheme={toggleTheme}
            onBack={() => navigateTo('timeline')}
          />
        );
      default:
        return (
          <TimelineScreen
            currentUser={state.currentUser}
            notes={mockData.notes}
            users={mockData.users}
            onNavigate={navigateTo}
            onViewProfile={navigateToProfile}
            onViewThread={navigateToThread}
            onOpenCompose={openCompose}
          />
        );
    }
  };

  const navItems = [
    { id: 'timeline', label: 'Timeline', icon: HomeIcon },
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'relays', label: 'Relays', icon: ServerIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ] as const;

  return (
    <div className={`snort-simulator ${parentTheme}`} data-theme={parentTheme}>
      <div className="snort-layout">
        {/* Left Sidebar - Navigation */}
        <aside className="snort-sidebar snort-left-sidebar">
          <div className="snort-sidebar-header">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Snort</h1>
                <p className="text-xs text-slate-400">Web Nostr Client</p>
              </div>
            </div>
          </div>

          <nav className="snort-nav flex-1 p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = state.currentScreen === item.id || 
                (item.id === 'timeline' && state.currentScreen === 'thread');
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id as SnortScreen)}
                  className={`snort-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="snort-nav-icon" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Card */}
          {state.currentUser && (
            <div className="p-3 border-t border-slate-700">
              <button 
                onClick={() => navigateToProfile(state.currentUser!)}
                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${state.currentUser?.pubkey || state.currentUser?.username || 'default'}`}
                  alt={state.currentUser.displayName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-white truncate">{state.currentUser.displayName}</p>
                  <p className="text-sm text-slate-400 truncate">@{state.currentUser.username}</p>
                </div>
              </button>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="snort-main">
          {renderScreen()}
        </main>

        {/* Right Sidebar - Trends/Info */}
        <aside className="snort-sidebar snort-sidebar-right snort-right-sidebar">
          <div className="snort-sidebar-section">
            <div className="snort-sidebar-title">Trending</div>
            <div className="px-3">
              {['#nostr', '#bitcoin', '#dev', '#privacy'].map((tag) => (
                <div
                  key={tag}
                  className="py-2 px-3 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <p className="text-teal-400 font-medium">{tag}</p>
                  <p className="text-xs text-slate-500">{Math.floor(Math.random() * 1000)} posts</p>
                </div>
              ))}
            </div>
          </div>

          <div className="snort-sidebar-section">
            <div className="snort-sidebar-title">NIP Support</div>
            <div className="px-3 flex flex-wrap gap-2">
              {[1, 5, 7, 10, 19, 57].map((nip) => (
                <span key={nip} className="snort-nip-badge">
                  NIP-{nip}
                </span>
              ))}
            </div>
          </div>

          <div className="snort-sidebar-section">
            <div className="snort-sidebar-title">Keyboard Shortcuts</div>
            <div className="px-3 space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>New post</span>
                <span><kbd className="snort-kbd">N</kbd></span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Search</span>
                <span><kbd className="snort-kbd">/</kbd></span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Home</span>
                <span><kbd className="snort-kbd">G</kbd> <kbd className="snort-kbd">H</kbd></span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Refresh</span>
                <span><kbd className="snort-kbd">R</kbd></span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Compose Modal */}
      {state.isComposeOpen && (
        <ComposeScreen
          isOpen={state.isComposeOpen}
          onClose={closeCompose}
          onPost={handlePost}
          currentUser={state.currentUser}
        />
      )}
    </div>
  );
};

// Icons
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function ServerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export default SnortSimulator;
