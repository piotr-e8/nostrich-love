import React, { useState, useCallback } from 'react';
import './gossip.theme.css';
import { Sidebar } from './components/Sidebar';
import { FeedScreen } from './screens/FeedScreen';
import { ThreadScreen } from './screens/ThreadScreen';
import { PeopleScreen } from './screens/PeopleScreen';
import { RelaysScreen } from './screens/RelaysScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ComposeModal } from './components/ComposeModal';
import { OnboardingTour } from './components/OnboardingTour';
import { useParentTheme } from '../shared/hooks/useParentTheme';
import type { MockNote, MockUser } from '../../data/mock';
import { mockNotes, mockUsers, getUserByPubkey } from '../../data/mock';

export type GossipView = 'feed' | 'thread' | 'people' | 'relays' | 'settings';

interface GossipState {
  currentView: GossipView;
  selectedNote: MockNote | null;
  selectedUser: MockUser | null;
  isComposeOpen: boolean;
  sidebarWidth: number;
  showTour: boolean;
  notes: MockNote[];
}

export const GossipSimulator: React.FC = () => {
  const parentTheme = useParentTheme();
  const [state, setState] = useState<GossipState>({
    currentView: 'feed',
    selectedNote: null,
    selectedUser: null,
    isComposeOpen: false,
    sidebarWidth: 280,
    showTour: true,
    notes: mockNotes,
  });

  const navigateTo = useCallback((view: GossipView) => {
    setState(prev => ({ ...prev, currentView: view }));
  }, []);

  const openThread = useCallback((note: MockNote) => {
    setState(prev => ({
      ...prev,
      currentView: 'thread',
      selectedNote: note,
    }));
  }, []);

  const viewProfile = useCallback((user: MockUser) => {
    setState(prev => ({
      ...prev,
      selectedUser: user,
    }));
  }, []);

  const openCompose = useCallback(() => {
    setState(prev => ({ ...prev, isComposeOpen: true }));
  }, []);

  const closeCompose = useCallback(() => {
    setState(prev => ({ ...prev, isComposeOpen: false }));
  }, []);

  const handlePost = useCallback((content: string) => {
    const currentUser = mockUsers[0];
    const newNote: MockNote = {
      id: `note-${Date.now()}`,
      content,
      pubkey: currentUser.pubkey,
      created_at: Math.floor(Date.now() / 1000),
      kind: 1,
      tags: [],
      sig: 'mock-sig',
      likes: 0,
      reposts: 0,
      replies: 0,
      zaps: 0,
      zapAmount: 0,
      category: 'other' as any,
    };
    setState(prev => ({
      ...prev,
      notes: [newNote, ...prev.notes],
      isComposeOpen: false,
    }));
  }, []);

  const handleSidebarResize = useCallback((width: number) => {
    setState(prev => ({ ...prev, sidebarWidth: width }));
  }, []);

  const closeTour = useCallback(() => {
    setState(prev => ({ ...prev, showTour: false }));
  }, []);

  const renderContent = () => {
    switch (state.currentView) {
      case 'feed':
        return (
          <FeedScreen
            notes={state.notes}
            users={mockUsers}
            onOpenThread={openThread}
            onViewProfile={viewProfile}
            onCompose={openCompose}
          />
        );
      case 'thread':
        return state.selectedNote ? (
          <ThreadScreen
            note={state.selectedNote}
            users={mockUsers}
            onBack={() => navigateTo('feed')}
            onViewProfile={viewProfile}
          />
        ) : (
          <FeedScreen
            notes={state.notes}
            users={mockUsers}
            onOpenThread={openThread}
            onViewProfile={viewProfile}
            onCompose={openCompose}
          />
        );
      case 'people':
        return (
          <PeopleScreen
            users={mockUsers}
            onViewProfile={viewProfile}
          />
        );
      case 'relays':
        return <RelaysScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return (
          <FeedScreen
            notes={state.notes}
            users={mockUsers}
            onOpenThread={openThread}
            onViewProfile={viewProfile}
            onCompose={openCompose}
          />
        );
    }
  };

  return (
    <div 
      className={`gossip-simulator ${parentTheme === 'dark' ? 'dark' : ''}`}
      data-theme={parentTheme}
    >
      <div className="gossip-container">
        <Sidebar
          activeView={state.currentView}
          onNavigate={navigateTo}
          onCompose={openCompose}
          width={state.sidebarWidth}
          onResize={handleSidebarResize}
        />
        <main className="gossip-main">
          {renderContent()}
        </main>
      </div>
      
      <ComposeModal
        isOpen={state.isComposeOpen}
        onClose={closeCompose}
        onPost={handlePost}
      />

      {state.showTour && (
        <OnboardingTour onClose={closeTour} />
      )}
    </div>
  );
};

export default GossipSimulator;
