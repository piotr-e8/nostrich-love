import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Home, 
  Search, 
  Bell, 
  Mail, 
  User, 
  Settings, 
  Bookmark,
  Database,
  Shield,
  Moon,
  LogOut,
  Zap
} from 'lucide-react';
import '../amethyst.theme.css';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenSettings: () => void;
}

interface DrawerItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const mainItems: DrawerItem[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-6 h-6" /> },
  { id: 'search', label: 'Discover', icon: <Search className="w-6 h-6" /> },
  { id: 'video', label: 'Video', icon: <Zap className="w-6 h-6" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-6 h-6" />, badge: 3 },
  { id: 'messages', label: 'Messages', icon: <Mail className="w-6 h-6" />, badge: 1 },
];

const libraryItems: DrawerItem[] = [
  { id: 'profile', label: 'Profile', icon: <User className="w-6 h-6" /> },
  { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark className="w-6 h-6" /> },
];

export function Drawer({ isOpen, onClose, activeTab, onTabChange, onOpenSettings }: DrawerProps) {
  const handleItemClick = (id: string) => {
    if (id === 'settings') {
      onOpenSettings();
    } else {
      onTabChange(id);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-[var(--md-surface)] z-50 shadow-2xl overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="p-4 flex items-center justify-between border-b border-[var(--md-outline-variant)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--md-primary-container)] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-[var(--md-primary)]">
                    <path
                      fill="currentColor"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-[var(--md-on-surface)]">Amethyst</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[var(--md-surface-variant)]"
              >
                <X className="w-6 h-6 text-[var(--md-on-surface)]" />
              </motion.button>
            </div>

            {/* Main Navigation */}
            <div className="p-2">
              <p className="px-4 py-2 text-xs font-medium text-[var(--md-on-surface-variant)] uppercase tracking-wider">
                Main
              </p>
              {mainItems.map((item) => (
                <DrawerNavItem
                  key={item.id}
                  item={item}
                  isActive={activeTab === item.id}
                  onClick={() => handleItemClick(item.id)}
                />
              ))}
            </div>

            {/* Library Section */}
            <div className="p-2 border-t border-[var(--md-outline-variant)]">
              <p className="px-4 py-2 text-xs font-medium text-[var(--md-on-surface-variant)] uppercase tracking-wider">
                Library
              </p>
              {libraryItems.map((item) => (
                <DrawerNavItem
                  key={item.id}
                  item={item}
                  isActive={activeTab === item.id}
                  onClick={() => handleItemClick(item.id)}
                />
              ))}
            </div>

            {/* Settings & Tools */}
            <div className="p-2 border-t border-[var(--md-outline-variant)]">
              <p className="px-4 py-2 text-xs font-medium text-[var(--md-on-surface-variant)] uppercase tracking-wider">
                Settings
              </p>
              <DrawerNavItem
                item={{ id: 'relays', label: 'Relays', icon: <Database className="w-6 h-6" /> }}
                isActive={false}
                onClick={() => handleItemClick('relays')}
              />
              <DrawerNavItem
                item={{ id: 'security', label: 'Security', icon: <Shield className="w-6 h-6" /> }}
                isActive={false}
                onClick={() => handleItemClick('security')}
              />
              <DrawerNavItem
                item={{ id: 'settings', label: 'Settings', icon: <Settings className="w-6 h-6" /> }}
                isActive={false}
                onClick={() => handleItemClick('settings')}
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--md-outline-variant)]">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--md-surface-variant)] text-[var(--md-on-surface)]"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DrawerNavItem({ 
  item, 
  isActive, 
  onClick 
}: { 
  item: DrawerItem; 
  isActive: boolean; 
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
        isActive 
          ? 'bg-[var(--md-secondary-container)] text-[var(--md-on-secondary-container)]' 
          : 'text-[var(--md-on-surface)] hover:bg-[var(--md-surface-variant)]'
      }`}
    >
      <div className="relative">
        {item.icon}
        {item.badge && item.badge > 0 && (
          <span className="notification-badge">{item.badge}</span>
        )}
      </div>
      <span className="font-medium flex-1 text-left">{item.label}</span>
    </motion.button>
  );
}
