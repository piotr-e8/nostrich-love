import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Repeat2, UserPlus, Zap, MessageCircle, AtSign, Settings } from 'lucide-react';

interface NotificationsScreenProps {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const notifications = [
  { type: 'zap', user: 'Alice', content: 'zapped you 1,000 sats', time: '2m', icon: Zap, color: '#F59E0B' },
  { type: 'like', user: 'Bob', content: 'liked your post', time: '15m', icon: Heart, color: '#EF4444' },
  { type: 'repost', user: 'Charlie', content: 'reposted your note', time: '1h', icon: Repeat2, color: '#22C55E' },
  { type: 'follow', user: 'David', content: 'followed you', time: '3h', icon: UserPlus, color: '#7C3AED' },
  { type: 'reply', user: 'Eve', content: 'replied to your note', time: '5h', icon: MessageCircle, color: '#3B82F6' },
  { type: 'mention', user: 'Frank', content: 'mentioned you', time: '1d', icon: AtSign, color: '#7C3AED' },
];

export function NotificationsScreen({ showToast }: NotificationsScreenProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'mentions' | 'zaps'>('all');

  const filtered = activeTab === 'all' 
    ? notifications 
    : activeTab === 'mentions'
    ? notifications.filter(n => n.type === 'mention' || n.type === 'reply')
    : notifications.filter(n => n.type === 'zap');

  return (
    <div className="min-h-full pb-20">
      {/* Header */}
      <div className="primal-mobile-header">
        <h1 className="primal-mobile-header-title">Notifications</h1>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => showToast('Settings', 'info')}>
          <Settings className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Tab Pills */}
      <div className="primal-tab-pills border-b border-[var(--primal-mobile-border)]">
        <button
          className={`primal-tab-pill ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`primal-tab-pill ${activeTab === 'mentions' ? 'active' : ''}`}
          onClick={() => setActiveTab('mentions')}
        >
          Mentions
        </button>
        <button
          className={`primal-tab-pill ${activeTab === 'zaps' ? 'active' : ''}`}
          onClick={() => setActiveTab('zaps')}
        >
          Zaps
        </button>
      </div>

      {/* Notifications */}
      <div>
        {filtered.map((notification, index) => {
          const Icon = notification.icon;
          return (
            <motion.div
              key={index}
              className="p-4 border-b border-[var(--primal-mobile-border)] flex gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => showToast(`View ${notification.user}'s profile`, 'info')}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${notification.color}20`, color: notification.color }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="primal-avatar-mobile-small" />
                </div>
                <div>
                  <span className="font-bold">{notification.user}</span>
                  {' '}{notification.content}
                  <span className="text-[var(--primal-mobile-on-surface-muted)] ml-1">
                    · {notification.time}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default NotificationsScreen;
