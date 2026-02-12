import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { BottomNav } from './components/BottomNav';
import { ComposeSheet } from './components/ComposeSheet';
import { useParentTheme } from '../../shared/hooks/useParentTheme';
import './primal-mobile.theme.css';

export type TabId = 'home' | 'search' | 'notifications' | 'profile';

export interface PrimalMobileSimulatorProps {
  className?: string;
}

export function PrimalMobileSimulator({ className = '' }: PrimalMobileSimulatorProps) {
  const parentTheme = useParentTheme();
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
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

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    if (tab === 'notifications') {
      setNotificationCount(0);
    }
  }, []);

  const handlePost = useCallback((content: string) => {
    showToast('Posted! ⚡', 'success');
    setIsComposeOpen(false);
  }, [showToast]);

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen 
            key="home"
            onNewPost={() => setIsComposeOpen(true)}
            showToast={showToast}
          />
        );
      case 'search':
        return (
          <SearchScreen 
            key="search"
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

  return (
    <div 
      className={`primal-mobile ${parentTheme} ${className}`}
      data-theme={parentTheme}
    >
      {/* Status Bar */}
      <div className="primal-status-bar">
        <span>9:41</span>
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

      {/* Notch */}
      <div className="primal-notch" />

      {/* Main Content */}
      <div className="primal-mobile-content">
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

      {/* Floating Action Button */}
      <AnimatePresence>
        {activeTab === 'home' && !isComposeOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="primal-fab"
            onClick={() => setIsComposeOpen(true)}
            whileTap={{ scale: 0.95 }}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        notificationCount={notificationCount}
      />

      {/* Home Indicator */}
      <div className="primal-home-indicator" />

      {/* Compose Sheet */}
      <ComposeSheet
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onPost={handlePost}
      />

      {/* Modal Overlay */}
      <AnimatePresence>
        {isComposeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="primal-modal-overlay open"
            onClick={() => setIsComposeOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast.isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50"
          >
            <div 
              className="px-4 py-2 rounded-full text-sm font-medium shadow-lg"
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

export default PrimalMobileSimulator;
