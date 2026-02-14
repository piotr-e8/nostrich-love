import React, { useState, useCallback, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Image, 
  User, 
  Wallet, 
  Settings, 
  Plus,
  Zap
} from 'lucide-react';
import { LoginScreen } from './screens/LoginScreen';
import { FeedScreen } from './screens/FeedScreen';
import { ArticlesScreen } from './screens/ArticlesScreen';
import { MediaScreen } from './screens/MediaScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { WalletScreen } from './screens/WalletScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ComposeScreen } from './screens/ComposeScreen';
import { useParentTheme } from '../shared/hooks/useParentTheme';
import type { MockUser } from '../../data/mock';
import { TourContext } from '../../components/tour';
import './yakihonne.theme.css';

export type TabId = 'feed' | 'articles' | 'media' | 'profile' | 'wallet' | 'settings';

export interface SimulatorCommand {
  type: 'login' | 'navigate' | 'compose' | 'post' | 'viewProfile';
  payload?: any;
}

export interface YakiHonneSimulatorProps {
  className?: string;
  tourCommand?: SimulatorCommand | null;
  onCommandHandled?: () => void;
}

export function YakiHonneSimulator({ className = '', tourCommand, onCommandHandled }: YakiHonneSimulatorProps) {
  const parentTheme = useParentTheme();
  const tourContext = useContext(TourContext);
  const registerAction = (actionType: string) => {
    if (tourContext?.registerAction) {
      tourContext.registerAction(actionType);
    }
  };
  const [activeTab, setActiveTab] = useState<TabId>('feed');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeType, setComposeType] = useState<'post' | 'article' | 'media'>('post');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    isVisible: boolean;
    type: 'success' | 'error' | 'info';
  }>({ message: '', isVisible: false, type: 'info' });
  const [walletBalance, setWalletBalance] = useState(500000); // 500k sats

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, isVisible: true, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  }, []);

  // Handle login
  const handleLogin = useCallback((user: MockUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    registerAction('login');
    registerAction('navigate_home');
    console.log('[YakiHonne] Logged in as:', user.displayName);
  }, [registerAction]);

  // Handle tab change
  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    if (tab === 'feed') registerAction('navigate_home');
    if (tab === 'profile') registerAction('view_profile');
    if (tab === 'settings') registerAction('navigate_settings');
  }, [registerAction]);

  // Handle compose open
  const handleOpenCompose = useCallback((type: 'post' | 'article' | 'media' = 'post') => {
    setComposeType(type);
    setIsComposeOpen(true);
    registerAction('compose');
  }, [registerAction]);

  // Handle new post
  const handleNewPost = useCallback((content: string, type: 'post' | 'article' | 'media') => {
    registerAction('post');
    showToast(
      type === 'article' ? 'Article published! 📝' : 
      type === 'media' ? 'Media shared! 📸' : 
      'Post published! 🎉', 
      'success'
    );
    setIsComposeOpen(false);
  }, [showToast, registerAction]);

  // Handle zap
  const handleZap = useCallback((amount: number) => {
    setWalletBalance(prev => prev - amount);
    showToast(`Zapped ${amount.toLocaleString()} sats! ⚡`, 'success');
  }, [showToast]);

  // Handle receive
  const handleReceive = useCallback((amount: number) => {
    setWalletBalance(prev => prev + amount);
    showToast(`Received ${amount.toLocaleString()} sats! ⚡`, 'success');
  }, [showToast]);

  // Handle tour commands
  useEffect(() => {
    if (!tourCommand) return;
    
    console.log('[YakiHonneSimulator] Processing command:', tourCommand);
    
    switch (tourCommand.type) {
      case 'login':
        if (!isAuthenticated) {
          // Create mock user
          const mockUser: MockUser = {
            pubkey: 'npub1yakihonne123',
            displayName: 'YakiHonne User',
            username: 'yakihonneuser',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=yakihonne',
            bio: 'Exploring Nostr with YakiHonne',
            followersCount: 88,
            followingCount: 44,
            createdAt: Date.now() / 1000,
            lastActive: Date.now() / 1000,
          };
          handleLogin(mockUser);
        }
        break;
        
      case 'navigate':
        const tab = tourCommand.payload as TabId;
        if (['feed', 'articles', 'media', 'profile', 'wallet', 'settings'].includes(tab)) {
          setActiveTab(tab);
        }
        break;
        
      case 'compose':
        if (isAuthenticated) {
          setComposeType('post');
          setIsComposeOpen(true);
        }
        break;
        
      case 'post':
        if (isAuthenticated) {
          setComposeType('post');
          setIsComposeOpen(true);
          // Simulate post after a short delay
          setTimeout(() => {
            handleNewPost('Tour test post!', 'post');
          }, 500);
        }
        break;
        
      case 'viewProfile':
        if (isAuthenticated) {
          setActiveTab('profile');
        }
        break;
    }
    
    // Mark command as handled
    onCommandHandled?.();
  }, [tourCommand, isAuthenticated, handleLogin, handleNewPost, onCommandHandled]);

  // Render active screen
  const renderScreen = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <FeedScreen 
            key="feed" 
            onOpenCompose={() => handleOpenCompose('post')}
            onZap={handleZap}
          />
        );
      case 'articles':
        return (
          <ArticlesScreen 
            key="articles"
            onOpenCompose={() => handleOpenCompose('article')}
          />
        );
      case 'media':
        return (
          <MediaScreen 
            key="media"
            onOpenCompose={() => handleOpenCompose('media')}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            key="profile"
            user={currentUser || undefined}
            onOpenSettings={() => setActiveTab('settings')}
          />
        );
      case 'wallet':
        return (
          <WalletScreen 
            key="wallet"
            balance={walletBalance}
            onZap={handleZap}
            onReceive={handleReceive}
          />
        );
      case 'settings':
        return (
          <SettingsScreen 
            key="settings"
            theme={parentTheme}
            onThemeChange={(newTheme: string) => console.log('Theme change:', newTheme)}
            onBack={() => setActiveTab('profile')}
          />
        );
      default:
        return null;
    }
  };

  const navItems: { id: TabId; icon: React.ElementType; label: string }[] = [
    { id: 'feed', icon: Home, label: 'Feed' },
    { id: 'articles', icon: FileText, label: 'Articles' },
    { id: 'media', icon: Image, label: 'Media' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className={`yakihonne-simulator ${parentTheme === 'dark' ? 'dark' : ''} ${className}`}>
        <LoginScreen onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div 
      className={`yakihonne-simulator ${parentTheme === 'dark' ? 'dark' : ''} ${className}`}
      data-theme={parentTheme}
    >
      {/* Main Content Area */}
      <div className="yakihonne-content pb-20">
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

      {/* Floating Action Button - Only show on Feed, Articles, Media */}
      <AnimatePresence>
        {(activeTab === 'feed' || activeTab === 'articles' || activeTab === 'media') && !isComposeOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="yakihonne-fab"
            onClick={() => handleOpenCompose(
              activeTab === 'articles' ? 'article' : 
              activeTab === 'media' ? 'media' : 
              'post'
            )}
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="yakihonne-bottom-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`yakihonne-nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              <Icon className="w-6 h-6" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Compose Modal */}
      <ComposeScreen
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onPost={handleNewPost}
        initialType={composeType}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="yakihonne-toast"
          >
            {toast.type === 'success' && <Zap className="w-4 h-4 text-yellow-400" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default YakiHonneSimulator;
