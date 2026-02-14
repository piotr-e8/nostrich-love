import React, { useState, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { UploadScreen } from './screens/UploadScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { useParentTheme } from '../shared/hooks/useParentTheme';
import './olas.theme.css';
import type { MockUser } from '../../data/mock';
import { TourContext } from '../../components/tour';

// Types
export type TabId = 'home' | 'discover' | 'upload' | 'notifications' | 'profile';
export type OlasScreen = TabId;

export interface OlasSimulatorProps {
  className?: string;
}

export function OlasSimulator({ className = '' }: OlasSimulatorProps) {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const parentTheme = useParentTheme();
  const tourContext = useContext(TourContext);
  
  const registerAction = (actionType: string) => {
    if (tourContext?.registerAction) {
      tourContext.registerAction(actionType);
    }
  };

  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    isVisible: boolean;
    type: 'success' | 'error' | 'info';
  }>({ message: '', isVisible: false, type: 'info' });

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, isVisible: true, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 2500);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    if (tab === 'upload') {
      setIsUploadOpen(true);
      registerAction('compose');
    } else {
      setActiveTab(tab as TabId);
      if (tab === 'home') registerAction('navigate_home');
      if (tab === 'discover') registerAction('navigate_discover');
      if (tab === 'notifications') registerAction('view_notifications');
      if (tab === 'profile') registerAction('view_profile');
    }
  }, [registerAction]);

  const handleUpload = useCallback((mediaUrl: string, caption: string) => {
    registerAction('post');
    showToast('Photo shared successfully! 🎉', 'success');
    setIsUploadOpen(false);
    setActiveTab('home');
  }, [showToast, registerAction]);

  const handleLogin = useCallback((user: MockUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    registerAction('login');
    registerAction('navigate_home');
    showToast(`Welcome to Olas, ${user.displayName}!`, 'success');
  }, [showToast, registerAction]);

  const getThemeClass = () => {
    return parentTheme === 'dark' ? 'dark' : '';
  };

  const renderScreen = () => {
    if (!isAuthenticated) {
      return (
        <div className="olas-login flex items-center justify-center h-full p-6" data-tour="olas-keys">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Olas</h2>
            <p className="text-gray-600 mb-6">Share your photos on Nostr</p>
            <button
              onClick={() => handleLogin({
                pubkey: 'test-pubkey',
                npub: 'npub1test',
                displayName: 'Photo Lover',
                name: 'photolover',
                picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=photo',
                about: 'Capturing moments on Nostr',
                website: '',
                lud16: '',
                nip05: 'photo@olas.app',
                followers: 128,
                following: 56,
                relays: ['wss://relay.olas.app']
              } as MockUser)}
              className="w-full py-3 px-6 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Start Exploring
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen key="home" currentUser={currentUser} />;
      case 'discover':
        return <DiscoverScreen key="discover" />;
      case 'notifications':
        return <NotificationsScreen key="notifications" />;
      case 'profile':
        return <ProfileScreen key="profile" currentUser={currentUser} />;
      default:
        return <HomeScreen key="home" currentUser={currentUser} />;
    }
  };

  return (
    <div className={`olas-simulator w-full h-full flex flex-col bg-white ${getThemeClass()} ${className}`}>
      <AnimatePresence mode="wait">
        {isUploadOpen ? (
          <UploadScreen
            key="upload"
            onClose={() => setIsUploadOpen(false)}
            onUpload={handleUpload}
          />
        ) : (
          <motion.div
            key="main"
            className="flex-1 overflow-hidden relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="h-full overflow-y-auto pb-16">
              {renderScreen()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isUploadOpen && isAuthenticated && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`absolute bottom-24 left-4 right-4 py-3 px-4 rounded-xl text-center font-medium z-50 ${
              toast.type === 'success' ? 'bg-green-500 text-white' :
              toast.type === 'error' ? 'bg-red-500 text-white' :
              'bg-gray-800 text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
