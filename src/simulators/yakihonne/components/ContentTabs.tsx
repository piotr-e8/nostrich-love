import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface ContentTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function ContentTabs({ tabs, activeTab, onTabChange }: ContentTabsProps) {
  return (
    <div className="yakihonne-tabs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`yakihonne-tab ${isActive ? 'active' : ''}`}
          >
            <span className="flex items-center gap-1.5">
              {Icon && <Icon className="w-4 h-4" />}
              {tab.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--yh-primary)] rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default ContentTabs;
