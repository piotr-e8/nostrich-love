/**
 * Keychat Simulator - Debug Version
 * Testing without TourWrapper to isolate blank screen issue
 */

import React, { useState, useCallback, useContext } from 'react';
import { motion } from 'framer-motion';
import { LoginScreen } from './screens/LoginScreen';
import { ChatListScreen } from './screens/ChatListScreen';
import { ChatRoomScreen } from './screens/ChatRoomScreen';
import { WalletScreen } from './screens/WalletScreen';
import { MiniAppsScreen } from './screens/MiniAppsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { BottomNav } from './components/BottomNav';
import { useParentTheme } from '../shared/hooks/useParentTheme';
import type { MockUser } from '../../data/mock';
import { TourContext } from '../../components/tour';
import './keychat.theme.css';

// Types
export type TabId = 'chats' | 'wallet' | 'apps' | 'settings';

export interface SimulatorCommand {
  type: 'login' | 'navigate' | 'selectChat' | 'back';
  payload?: any;
}

export interface KeychatSimulatorProps {
  className?: string;
  tourCommand?: SimulatorCommand | null;
  onCommandHandled?: () => void;
}

export function KeychatSimulator({ className = '', tourCommand, onCommandHandled }: KeychatSimulatorProps) {
  const [activeTab, setActiveTab] = useState<TabId>('chats');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const parentTheme = useParentTheme();
  
  // Tour context for registering actions
  const tourContext = useContext(TourContext);
  const registerAction = (actionType: string) => {
    if (tourContext?.registerAction) {
      console.log('[Keychat] Registering action:', actionType);
      tourContext.registerAction(actionType);
    }
  };
  
  // Simple console log for debugging
  console.log('KeychatSimulator render - selectedChat:', selectedChat, 'activeTab:', activeTab);
  
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    isVisible: boolean;
    type: 'success' | 'error' | 'info';
  }>({ message: '', isVisible: false, type: 'info' });

  // Handle tour commands
  React.useEffect(() => {
    if (!tourCommand) return;
    
    console.log('[KeychatSimulator] Processing command:', tourCommand);
    
    switch (tourCommand.type) {
      case 'login':
        if (!isAuthenticated) {
          // Simulate login with mock user
          const mockUser: MockUser = {
            pubkey: 'npub1mockuser123',
            username: 'DemoUser',
            displayName: 'Demo User',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=demo',
            bio: 'Demo user for Keychat tour',
            followersCount: 42,
            followingCount: 10,
            createdAt: Date.now() / 1000,
            lastActive: Date.now() / 1000,
          };
          setCurrentUser(mockUser);
          setIsAuthenticated(true);
          showToast('Welcome to Keychat! 🔐', 'success');
        }
        break;
        
      case 'navigate':
        const tab = tourCommand.payload as TabId;
        if (['chats', 'wallet', 'apps', 'settings'].includes(tab)) {
          setActiveTab(tab);
          setSelectedChat(null);
        }
        break;
        
      case 'selectChat':
        if (isAuthenticated) {
          setSelectedChat(tourCommand.payload || '1');
        }
        break;
        
      case 'back':
        setSelectedChat(null);
        break;
    }
    
    // Mark command as handled
    onCommandHandled?.();
  }, [tourCommand, isAuthenticated, onCommandHandled]);

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, isVisible: true, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 2500);
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((tab: TabId) => {
    console.log('Tab changed to:', tab);
    setActiveTab(tab);
    setSelectedChat(null);
    
    // Register tour actions for tab navigation
    if (tab === 'chats') registerAction('navigate_chats');
    if (tab === 'wallet') registerAction('view_wallet');
    if (tab === 'apps') registerAction('view_apps');
    if (tab === 'settings') registerAction('navigate_settings');
  }, []);

  // Handle chat selection
  const handleChatSelect = useCallback((chatId: string) => {
    console.log('Chat selected:', chatId);
    setSelectedChat(chatId);
    registerAction('open_chat');
  }, []);

  // Handle login - SIMPLIFIED
  const handleLogin = useCallback((user: MockUser) => {
    console.log('=== LOGIN HANDLER CALLED ===');
    console.log('User:', user);
    setCurrentUser(user);
    setIsAuthenticated(true);
    console.log('isAuthenticated set to TRUE');
    showToast(`Welcome to Keychat! 🔐`, 'success');
    registerAction('login');
  }, [showToast]);

  // Handle back from chat
  const handleBackFromChat = useCallback(() => {
    setSelectedChat(null);
  }, []);

  // Get theme classes based on parent site theme
  const getThemeClass = () => {
    return parentTheme === 'dark' ? 'dark' : '';
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    console.log('=== RENDERING LOGIN SCREEN ===');
    return (
      <div 
        className={`keychat-simulator ${getThemeClass()} ${className}`}
        data-theme={parentTheme}
      >
        <LoginScreen onLogin={handleLogin} />
      </div>
    );
  }

  console.log('=== RENDERING AUTHENTICATED VIEW ===');

  return (
    <div 
      className={`keychat-simulator ${getThemeClass()} ${className}`}
      data-theme={parentTheme}
    >
      {/* Main Content Area */}
      <div className="keychat-simulator-content">
        {selectedChat ? (
          <ChatRoomScreen 
            chatId={selectedChat}
            onBack={handleBackFromChat}
          />
        ) : (
          <>
            {activeTab === 'chats' && (
              <ChatListScreen 
                onChatSelect={handleChatSelect}
              />
            )}
            {activeTab === 'wallet' && <WalletScreen />}
            {activeTab === 'apps' && <MiniAppsScreen />}
            {activeTab === 'settings' && <SettingsScreen />}
          </>
        )}
      </div>

      {/* Bottom Navigation - Only show on main tabs */}
      {!selectedChat && (
        <BottomNav 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
        />
      )}

      {/* Toast Notification */}
      {toast.isVisible && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default KeychatSimulator;
