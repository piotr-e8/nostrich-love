import React, { useState, useContext } from 'react';
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

interface DamusSimulatorState {
  currentUser: MockUser | null;
  currentScreen: DamusScreen;
  selectedProfile: MockUser | null;
  isAuthenticated: boolean;
  replyingToNote: MockNote | null;
}

export const DamusSimulator: React.FC = () => {
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
      className={`damus-simulator min-h-screen ${parentTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
      data-theme={parentTheme}
    >
      {renderScreen()}
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
