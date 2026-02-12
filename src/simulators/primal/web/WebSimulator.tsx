import React, { useState, useCallback, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { MessagesScreen } from './screens/MessagesScreen';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { ComposeModal } from './components/ComposeModal';
import { useParentTheme } from '../../shared/hooks/useParentTheme';
import type { MockUser } from '../../../../data/mock';
import { TourContext } from '../../../components/tour';
import './primal-web.theme.css';

export type TabId = 'home' | 'explore' | 'notifications' | 'messages' | 'profile';

export interface PrimalWebSimulatorProps {
  className?: string;
}

export function PrimalWebSimulator({ className = '' }: PrimalWebSimulatorProps) {
  const parentTheme = useParentTheme();
  const tourContext = useContext(TourContext);
  const registerAction = (actionType: string) => {
    if (tourContext?.registerAction) {
      tourContext.registerAction(actionType);
    }
  };
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    isVisible: boolean;
    type: 'success' | 'error' | 'info';
  }>({ message: '', isVisible: false, type: 'info' });

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, isVisible: true, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  }, []);

  const handleLogin = useCallback((user: MockUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    registerAction('login');
    registerAction('navigate_home');
    console.log('[Primal] Logged in as:', user.displayName);
  }, [registerAction]);

  const handleTabChange = useCallback((tab: TabId) => {
    if (tab === 'profile') {
      setIsSettingsOpen(false);
      registerAction('view_profile');
    }
    if (tab === 'home') registerAction('navigate_home');
    setActiveTab(tab);
  }, [registerAction]);

  const handlePost = useCallback((content: string) => {
    registerAction('post');
    showToast('Your note has been published! ⚡', 'success');
    setIsComposeOpen(false);
  }, [showToast, registerAction]);

  const handleNewPost = useCallback(() => {
    registerAction('compose');
    setIsComposeOpen(true);
  }, [registerAction]);

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen 
            key="home" 
            onNewPost={handleNewPost}
            showToast={showToast}
          />
        );
      case 'explore':
        return (
          <ExploreScreen 
            key="explore"
            showToast={showToast}
          />
        );
      case 'notifications':
        return (
          <NotificationsScreen 
            key="notifications"
            showToast={showToast}
          />
        );
      case 'messages':
        return (
          <MessagesScreen 
            key="messages"
            showToast={showToast}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            key="profile"
            showToast={showToast}
          />
        );
      default:
        return null;
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div 
      className={`primal-web ${parentTheme} ${className}`}
      data-theme={parentTheme}
    >
      <div className="primal-layout">
        {/* Left Sidebar */}
        <LeftSidebar 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onNewPost={handleNewPost}
          theme={parentTheme}
        />

        {/* Main Content */}
        <main className="primal-main">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Right Sidebar */}
        <RightSidebar theme={parentTheme} />
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {isComposeOpen && (
          <ComposeModal
            isOpen={isComposeOpen}
            onClose={() => setIsComposeOpen(false)}
            onPost={handlePost}
          />
        )}
      </AnimatePresence>

        {/* Settings Modal */}
        <AnimatePresence>
          {isSettingsOpen && (
            <SettingsScreen
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              theme={parentTheme}
            />
          )}
        </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div 
              className="px-6 py-3 rounded-full font-medium shadow-lg"
              style={{ 
                backgroundColor: toast.type === 'success' ? '#22C55E' : toast.type === 'error' ? '#EF4444' : '#7C3AED',
                color: 'white'
              }}
            >
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PrimalWebSimulator;
