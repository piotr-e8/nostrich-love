import React, { useState, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNav } from './components/BottomNav';
import { FloatingActionButton } from './components/FloatingActionButton';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { MessagesScreen } from './screens/MessagesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ComposeScreen } from './screens/ComposeScreen';
import { useParentTheme } from '../shared/hooks/useParentTheme';
import './amethyst.theme.css';
import type { MockUser } from '../../data/mock';
import { TourContext } from '../../components/tour';

// Types
export type TabId = 'home' | 'search' | 'notifications' | 'messages' | 'profile';

export interface AmethystSimulatorProps {
  className?: string;
}

export function AmethystSimulator({ className = '' }: AmethystSimulatorProps) {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, isVisible: true, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 2500);
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((tab: string) => {
    if (tab === 'settings') {
      setIsSettingsOpen(true);
      registerAction('navigate_settings');
    } else {
      setActiveTab(tab as TabId);
      if (tab === 'home') registerAction('navigate_home');
      if (tab === 'profile') registerAction('view_profile');
    }
  }, [registerAction]);

  // Handle new post
  const handleNewPost = useCallback((content: string) => {
    registerAction('post');
    showToast('Post published successfully! 🎉', 'success');
  }, [showToast, registerAction]);

  // Handle login
  const handleLogin = useCallback((user: MockUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    registerAction('login');
    registerAction('navigate_home');
    showToast(`Welcome, ${user.displayName}!`, 'success');
  }, [showToast, registerAction]);

  // Get theme classes based on parent site theme
  const getThemeClass = () => {
    return parentTheme === 'dark' ? 'dark' : '';
  };

  // Render active screen
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen 
            key="home" 
            onOpenCompose={() => setIsComposeOpen(true)} 
          />
        );
      case 'search':
        return <SearchScreen key="search" />;
      case 'notifications':
        return <NotificationsScreen key="notifications" />;
      case 'messages':
        return <MessagesScreen key="messages" />;
      case 'profile':
        return (
          <ProfileScreen 
            key="profile" 
            onBack={() => setActiveTab('home')}
          />
        );
      default:
        return null;
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div 
        className={`amethyst-simulator mobile-frame ${getThemeClass()} ${className}`}
        data-theme={parentTheme}
      >
        <LoginScreen onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div 
      className={`amethyst-simulator mobile-frame ${getThemeClass()} ${className}`}
      data-theme={parentTheme}
    >
      {/* Android Status Bar */}
      <div className="android-status-bar">
        <span className="text-sm font-medium">9:41</span>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div className="flex items-center">
            <div className="w-6 h-3 border border-current rounded-sm relative">
              <div className="absolute inset-0.5 bg-current rounded-sm" style={{ width: '70%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Notch */}
      <div className="mobile-notch" />

      {/* Main Content Area */}
      <div className="amethyst-simulator-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FAB - Only show on Home tab */}
      <AnimatePresence>
        {activeTab === 'home' && !isComposeOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-24 right-4 z-20"
          >
            <FloatingActionButton
              onClick={() => {
                registerAction('compose');
                setIsComposeOpen(true);
              }}
              variant="primary"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation - Only show on main tabs */}
      {activeTab !== 'profile' && (
        <BottomNav 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
        />
      )}

      {/* Compose Modal */}
      <ComposeScreen
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onPost={handleNewPost}
      />

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[var(--md-background)]"
              onClick={(e) => e.stopPropagation()}
            >
              <SettingsScreen onBack={() => setIsSettingsOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="md-snackbar">
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-[var(--md-on-surface-variant)]/30 rounded-full z-50" />
    </div>
  );
}

export default AmethystSimulator;
