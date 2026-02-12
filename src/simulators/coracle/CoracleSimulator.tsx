import React, { useState, useEffect, useCallback } from 'react';
import './coracle.theme.css';
import { mockUsers, mockNotes, mockRelays, getUserByPubkey, getNotesByAuthor, type MockUser, type MockNote, type MockRelay } from '../../data/mock';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { RelaysScreen } from './screens/RelaysScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ComposeModal } from './components/ComposeModal';
import { Navigation } from './components/Navigation';
import { GuidedTour } from './components/GuidedTour';
import { useParentTheme } from '../shared/hooks/useParentTheme';

export type CoracleScreen = 'login' | 'home' | 'profile' | 'relays' | 'settings';

interface CoracleState {
  currentUser: MockUser | null;
  currentScreen: CoracleScreen;
  selectedProfile: MockUser | null;
  isAuthenticated: boolean;
  following: string[];
  likedNotes: string[];
  repostedNotes: string[];
  zappedNotes: { [noteId: string]: number };
  connectedRelays: string[];
  showCompose: boolean;
  showTour: boolean;
  tourStep: number;
}

export const CoracleSimulator: React.FC = () => {
  const parentTheme = useParentTheme();
  const [state, setState] = useState<CoracleState>({
    currentUser: null,
    currentScreen: 'login',
    selectedProfile: null,
    isAuthenticated: false,
    following: [],
    likedNotes: [],
    repostedNotes: [],
    zappedNotes: {},
    connectedRelays: ['wss://relay.damus.io', 'wss://relay.nostr.band'],
    showCompose: false,
    showTour: false,
    tourStep: 0,
  });

  // Authentication
  const handleLogin = useCallback((user: MockUser) => {
    setState(prev => ({
      ...prev,
      currentUser: user,
      isAuthenticated: true,
      currentScreen: 'home',
      showTour: true,
      following: mockUsers.slice(0, 5).map(u => u.pubkey), // Auto-follow some users
    }));
    console.log('[Coracle] Logged in as:', user.displayName);
  }, []);

  const handleLogout = useCallback(() => {
    setState({
      currentUser: null,
      currentScreen: 'login',
      selectedProfile: null,
      isAuthenticated: false,
      following: [],
      likedNotes: [],
      repostedNotes: [],
      zappedNotes: {},
      connectedRelays: ['wss://relay.damus.io', 'wss://relay.nostr.band'],
      showCompose: false,
      showTour: false,
      tourStep: 0,
    });
    console.log('[Coracle] Logged out');
  }, []);

  // Navigation
  const navigateTo = useCallback((screen: CoracleScreen) => {
    setState(prev => ({
      ...prev,
      currentScreen: screen,
      selectedProfile: screen === 'profile' ? prev.selectedProfile : null,
    }));
    console.log('[Coracle] Navigate to:', screen);
  }, []);

  const navigateToProfile = useCallback((user: MockUser) => {
    setState(prev => ({
      ...prev,
      selectedProfile: user,
      currentScreen: 'profile',
    }));
    console.log('[Coracle] View profile:', user.displayName);
  }, []);

  // Post notes
  const handlePost = useCallback((content: string) => {
    console.log('[Coracle] New post:', content);
    setState(prev => ({ ...prev, showCompose: false }));
  }, []);

  // Reply to notes
  const handleReply = useCallback((noteId: string) => {
    console.log('[Coracle] Reply to note:', noteId);
    setState(prev => ({ ...prev, showCompose: true }));
  }, []);

  // Follow/Unfollow
  const handleFollow = useCallback((pubkey: string) => {
    setState(prev => {
      const isFollowing = prev.following.includes(pubkey);
      const newFollowing = isFollowing
        ? prev.following.filter(p => p !== pubkey)
        : [...prev.following, pubkey];
      console.log(`[Coracle] ${isFollowing ? 'Unfollowed' : 'Followed'}:`, pubkey.slice(0, 20) + '...');
      return { ...prev, following: newFollowing };
    });
  }, []);

  const isFollowing = useCallback((pubkey: string) => {
    return state.following.includes(pubkey);
  }, [state.following]);

  // Like notes
  const handleLike = useCallback((noteId: string) => {
    setState(prev => {
      const isLiked = prev.likedNotes.includes(noteId);
      const newLikedNotes = isLiked
        ? prev.likedNotes.filter(id => id !== noteId)
        : [...prev.likedNotes, noteId];
      console.log(`[Coracle] ${isLiked ? 'Unliked' : 'Liked'} note:`, noteId.slice(0, 20) + '...');
      return { ...prev, likedNotes: newLikedNotes };
    });
  }, []);

  const isLiked = useCallback((noteId: string) => {
    return state.likedNotes.includes(noteId);
  }, [state.likedNotes]);

  // Repost notes
  const handleRepost = useCallback((noteId: string) => {
    setState(prev => {
      const isReposted = prev.repostedNotes.includes(noteId);
      const newRepostedNotes = isReposted
        ? prev.repostedNotes.filter(id => id !== noteId)
        : [...prev.repostedNotes, noteId];
      console.log(`[Coracle] ${isReposted ? 'Removed repost' : 'Reposted'} note:`, noteId.slice(0, 20) + '...');
      return { ...prev, repostedNotes: newRepostedNotes };
    });
  }, []);

  const isReposted = useCallback((noteId: string) => {
    return state.repostedNotes.includes(noteId);
  }, [state.repostedNotes]);

  // Zap notes
  const handleZap = useCallback((noteId: string, amount: number) => {
    setState(prev => {
      const currentZaps = prev.zappedNotes[noteId] || 0;
      const newZappedNotes = {
        ...prev.zappedNotes,
        [noteId]: currentZaps + amount,
      };
      console.log(`[Coracle] Zapped note with ${amount} sats:`, noteId.slice(0, 20) + '...');
      return { ...prev, zappedNotes: newZappedNotes };
    });
  }, []);

  const getZapAmount = useCallback((noteId: string) => {
    return state.zappedNotes[noteId] || 0;
  }, [state.zappedNotes]);

  // Relay management
  const handleConnectRelay = useCallback((relayUrl: string) => {
    setState(prev => {
      const isConnected = prev.connectedRelays.includes(relayUrl);
      const newConnectedRelays = isConnected
        ? prev.connectedRelays.filter(url => url !== relayUrl)
        : [...prev.connectedRelays, relayUrl];
      console.log(`[Coracle] ${isConnected ? 'Disconnected from' : 'Connected to'} relay:`, relayUrl);
      return { ...prev, connectedRelays: newConnectedRelays };
    });
  }, []);

  const isRelayConnected = useCallback((relayUrl: string) => {
    return state.connectedRelays.includes(relayUrl);
  }, [state.connectedRelays]);

  // Profile editing
  const handleUpdateProfile = useCallback((updates: Partial<MockUser>) => {
    setState(prev => {
      if (!prev.currentUser) return prev;
      const updatedUser = { ...prev.currentUser, ...updates };
      console.log('[Coracle] Updated profile:', updates);
      return { ...prev, currentUser: updatedUser };
    });
  }, []);

  // Tour management
  const handleStartTour = useCallback(() => {
    setState(prev => ({ ...prev, showTour: true, tourStep: 0 }));
  }, []);

  const handleNextTourStep = useCallback(() => {
    setState(prev => {
      const nextStep = prev.tourStep + 1;
      if (nextStep >= 5) {
        return { ...prev, showTour: false, tourStep: 0 };
      }
      return { ...prev, tourStep: nextStep };
    });
  }, []);

  const handleSkipTour = useCallback(() => {
    setState(prev => ({ ...prev, showTour: false, tourStep: 0 }));
  }, []);

  // Render screen
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
            following={state.following}
            likedNotes={state.likedNotes}
            repostedNotes={state.repostedNotes}
            zappedNotes={state.zappedNotes}
            onNavigate={navigateTo}
            onViewProfile={navigateToProfile}
            onLike={handleLike}
            onRepost={handleRepost}
            onZap={handleZap}
            onReply={handleReply}
            isLiked={isLiked}
            isReposted={isReposted}
            getZapAmount={getZapAmount}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            user={state.selectedProfile || state.currentUser}
            currentUser={state.currentUser}
            notes={mockNotes}
            isFollowing={isFollowing(state.selectedProfile?.pubkey || '')}
            onNavigate={navigateTo}
            onViewProfile={navigateToProfile}
            onFollow={() => state.selectedProfile && handleFollow(state.selectedProfile.pubkey)}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case 'relays':
        return (
          <RelaysScreen
            relays={mockRelays}
            connectedRelays={state.connectedRelays}
            onConnectRelay={handleConnectRelay}
            onNavigate={navigateTo}
            isRelayConnected={isRelayConnected}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            currentUser={state.currentUser}
            onLogout={handleLogout}
            onNavigate={navigateTo}
            onStartTour={handleStartTour}
          />
        );
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div 
      className={`coracle-simulator min-h-screen relative overflow-hidden ${parentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
      data-theme={parentTheme}
    >
      <div className="coracle-container flex flex-col h-full">
      {state.isAuthenticated && (
        <Navigation
          activeScreen={state.currentScreen}
          onNavigate={navigateTo}
          onCompose={() => setState(prev => ({ ...prev, showCompose: true }))}
          currentUser={state.currentUser}
        />
      )}
      
      <main className={`flex-1 overflow-y-auto ${state.isAuthenticated ? '' : ''}`}>
        {renderScreen()}
        </main>
      </div>

      {state.showCompose && (
        <ComposeModal
          currentUser={state.currentUser}
          onPost={handlePost}
          onClose={() => setState(prev => ({ ...prev, showCompose: false }))}
        />
      )}

      {state.showTour && state.isAuthenticated && (
        <GuidedTour
          currentStep={state.tourStep}
          onNext={handleNextTourStep}
          onSkip={handleSkipTour}
          currentScreen={state.currentScreen}
        />
      )}
    </div>
  );
};

export default CoracleSimulator;
