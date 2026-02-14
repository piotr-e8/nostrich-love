import React, { useState, useContext, useEffect } from 'react';
import './damus.theme.css';
import { mockUsers, mockNotes } from '../../data/mock';
import type { MockUser, MockNote } from '../../data/mock';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ComposeScreen } from './screens/ComposeScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TabBar } from './components/TabBar';
import { useParentTheme } from '../shared/hooks/useParentTheme';
import { TourContext } from '../../components/tour';

export type DamusScreen = 'login' | 'home' | 'profile' | 'compose' | 'settings';

// Types for tour command system
export interface DamusSimulatorCommand {
  type: 'login' | 'navigate' | 'compose' | 'post' | 'viewProfile' | 'back';
  payload?: any;
}

interface DamusSimulatorState {
  currentUser: MockUser | null;
  currentScreen: DamusScreen;
  selectedProfile: MockUser | null;
  isAuthenticated: boolean;
  replyingToNote: MockNote | null;
}

export interface DamusSimulatorProps {
  className?: string;
  tourCommand?: DamusSimulatorCommand | null;
  onCommandHandled?: () => void;
}

export const DamusSimulator: React.FC<DamusSimulatorProps> = ({ 
  className = '', 
  tourCommand, 
  onCommandHandled 
}) => {
  const parentTheme = useParentTheme();
  const tourContext = useContext(TourContext);
  const registerAction = (actionType: string) => {
    if (tourContext?.registerAction) {
      tourContext.registerAction(actionType);
    }
  };
  const [state, setState] = useState<DamusSimulatorState>({
    currentUser: null,
    currentScreen: 'login',
    selectedProfile: null,
    isAuthenticated: false,
    replyingToNote: null,
  });

  // Handle tour commands
  useEffect(() => {
    if (!tourCommand) return;
    
    console.log('[DamusSimulator] Processing command:', tourCommand);
    
    switch (tourCommand.type) {
      case 'login':
        if (!state.isAuthenticated) {
          // Simulate login with mock user
          const mockUser = mockUsers[0];
          setState(prev => ({
            ...prev,
            currentUser: mockUser,
            isAuthenticated: true,
            currentScreen: 'home',
          }));
          console.log('[Damus] Auto-logged in as:', mockUser.username);
        }
        break;
        
      case 'navigate':
        const screen = tourCommand.payload as DamusScreen;
        if (['home', 'profile', 'settings'].includes(screen)) {
          setState(prev => ({ ...prev, currentScreen: screen }));
          console.log('[Damus] Navigated to:', screen);
        }
        break;
        
      case 'compose':
        setState(prev => ({ ...prev, currentScreen: 'compose' }));
        console.log('[Damus] Opened compose screen');
        break;
        
      case 'post':
        // Simulate posting
        setState(prev => ({ 
          ...prev, 
          currentScreen: 'home',
          replyingToNote: null 
        }));
        console.log('[Damus] Posted content');
        break;
        
      case 'viewProfile':
        if (state.isAuthenticated) {
          setState(prev => ({
            ...prev,
            selectedProfile: state.currentUser,
            currentScreen: 'profile',
          }));
          console.log('[Damus] Viewing profile');
        }
        break;
        
      case 'back':
        setState(prev => ({ 
          ...prev, 
          currentScreen: 'home',
          selectedProfile: null 
        }));
        break;
    }
    
    // Mark command as handled
    onCommandHandled?.();
  }, [tourCommand, state.isAuthenticated, state.currentUser, onCommandHandled]);

  const handleLogin = (user: MockUser) => {
    setState(prev => ({
      ...prev,
      currentUser: user,
      isAuthenticated: true,
      currentScreen: 'home',
    }));
    registerAction('login');
    registerAction('navigate_home');
    console.log('[Damus] Logged in as:', user.username);
  };

  const handleLogout = () => {
    setState({
      currentUser: null,
      currentScreen: 'login',
      selectedProfile: null,
      isAuthenticated: false,
      replyingToNote: null,
    });
    console.log('[Damus] Logged out');
  };

  const navigateTo = (screen: DamusScreen) => {
    setState(prev => ({ ...prev, currentScreen: screen }));
    if (screen === 'home') registerAction('navigate_home');
    if (screen === 'settings') registerAction('navigate_settings');
    if (screen === 'compose') registerAction('compose');
    console.log('[Damus] Navigate to:', screen);
  };

  const navigateToProfile = (user: MockUser) => {
    setState(prev => ({
      ...prev,
      selectedProfile: user,
      currentScreen: 'profile',
    }));
    registerAction('view_profile');
    console.log('[Damus] View profile:', user.username);
  };

  const handlePost = (content: string) => {
    if (state.replyingToNote) {
      console.log('[Damus] Reply to', state.replyingToNote.id.slice(0, 8), ':', content);
    } else {
      console.log('[Damus] New post:', content);
    }
    registerAction('post');
    setState(prev => ({ 
      ...prev, 
      currentScreen: 'home',
      replyingToNote: null 
    }));
  };

  const handleReply = (note: MockNote) => {
    setState(prev => ({
      ...prev,
      replyingToNote: note,
      currentScreen: 'compose',
    }));
    console.log('[Damus] Replying to note:', note.id.slice(0, 8));
  };

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'home':
        return (
          <HomeScreen
            currentUser={state.currentUser}
            notes={mockNotes}
            users={mockUsers}
            onNavigate={navigateTo}
            onViewProfile={navigateToProfile}
            onReply={handleReply}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            user={state.selectedProfile || state.currentUser}
            currentUser={state.currentUser}
            notes={mockNotes}
            onNavigate={navigateTo}
            onViewProfile={navigateToProfile}
          />
        );
      case 'compose':
        return (
          <ComposeScreen
            currentUser={state.currentUser}
            onPost={handlePost}
            onCancel={() => {
              setState(prev => ({ ...prev, replyingToNote: null }));
              navigateTo('home');
            }}
            replyTo={state.replyingToNote}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            currentUser={state.currentUser}
            onLogout={handleLogout}
            onNavigate={navigateTo}
          />
        );
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div 
      className={`damus-simulator h-full ${parentTheme === 'dark' ? 'dark' : ''} ${className}`}
      data-theme={parentTheme}
    >
      <div className="damus-content h-full pb-20">
        {renderScreen()}
      </div>
      {state.isAuthenticated && state.currentScreen !== 'compose' && (
        <TabBar
          activeTab={state.currentScreen}
          onNavigate={navigateTo}
          onCompose={() => navigateTo('compose')}
        />
      )}
    </div>
  );
};

export default DamusSimulator;
