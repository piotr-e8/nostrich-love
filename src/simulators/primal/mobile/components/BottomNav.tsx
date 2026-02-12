import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, Bell, User } from 'lucide-react';
import type { TabId } from '../MobileSimulator';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  notificationCount: number;
}

export function BottomNav({ activeTab, onTabChange, notificationCount }: BottomNavProps) {
  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home /> },
    { id: 'search', label: 'Search', icon: <Search /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell /> },
    { id: 'profile', label: 'Profile', icon: <User /> },
  ];

  return (
    <nav className="primal-bottom-nav">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            className={`primal-nav-tab ${isActive ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              {React.cloneElement(tab.icon as React.ReactElement, {
                strokeWidth: isActive ? 2.5 : 2,
              })}
              {tab.id === 'notifications' && notificationCount > 0 && (
                <span className="primal-nav-badge">{notificationCount}</span>
              )}
            </div>
            <span className="primal-nav-tab-label">{tab.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
