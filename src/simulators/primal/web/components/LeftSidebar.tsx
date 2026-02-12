import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, Bell, Mail, User, Feather, Zap } from 'lucide-react';
import type { TabId } from '../WebSimulator';

interface LeftSidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onNewPost: () => void;
  theme: 'light' | 'dark';
}

export function LeftSidebar({ activeTab, onTabChange, onNewPost, theme }: LeftSidebarProps) {
  const navItems: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home /> },
    { id: 'explore', label: 'Explore', icon: <Search /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell /> },
    { id: 'messages', label: 'Messages', icon: <Mail /> },
    { id: 'profile', label: 'Profile', icon: <User /> },
  ];

  return (
    <aside className="primal-left-sidebar">
      {/* Logo */}
      <div className="mb-6 px-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="cursor-pointer"
          onClick={() => onTabChange('home')}
        >
          <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#7C3AED">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`primal-nav-item w-full ${activeTab === item.id ? 'active' : ''}`}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={activeTab === item.id ? 'text-[#7C3AED]' : ''}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>

      {/* Post Button */}
      <motion.button
        className="primal-btn-primary"
        onClick={onNewPost}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="flex items-center justify-center gap-2">
          <Feather className="w-5 h-5" />
          Post
        </span>
      </motion.button>

      {/* User Profile */}
      <div className="mt-auto pt-4 border-t border-[var(--primal-border)]">
        <motion.div
          className="flex items-center gap-3 p-3 rounded-full cursor-pointer hover:bg-[var(--primal-hover)] transition-colors"
          whileHover={{ scale: 1.02 }}
        >
          <div className="primal-avatar primal-avatar-small" />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm truncate">Your Name</div>
            <div className="text-[var(--primal-on-surface-variant)] text-sm truncate">@handle</div>
          </div>
        </motion.div>
      </div>
    </aside>
  );
}

export default LeftSidebar;
