import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, Bell, Mail, User } from 'lucide-react';
import '../amethyst.theme.css';

interface BottomNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems: BottomNavItem[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-6 h-6" /> },
  { id: 'search', label: 'Search', icon: <Search className="w-6 h-6" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-6 h-6" />, badge: 3 },
  { id: 'messages', label: 'Messages', icon: <Mail className="w-6 h-6" />, badge: 1 },
  { id: 'profile', label: 'Profile', icon: <User className="w-6 h-6" /> },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="md-bottom-nav safe-area-bottom" data-tour="amethyst-nav">
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`md-bottom-nav-item ${activeTab === item.id ? 'active' : ''}`}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {activeTab === item.id && (
            <motion.div
              layoutId="bottom-nav-indicator"
              className="md-bottom-nav-indicator"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{
                backgroundColor: activeTab === item.id ? 'var(--md-secondary-container)' : 'transparent',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute w-12 h-8 rounded-full"
              style={{ zIndex: -1 }}
            />
            <div className="relative">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <span className="notification-badge">{item.badge > 99 ? '99+' : item.badge}</span>
              )}
            </div>
          </div>
          <span className="text-xs mt-0.5">{item.label}</span>
        </motion.button>
      ))}
    </nav>
  );
}
