import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Repeat2, UserPlus, Zap, MessageCircle, AtSign } from 'lucide-react';

interface NotificationsScreenProps {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const notifications = [
  { 
    type: 'like', 
    user: 'Alice Nakamoto', 
    handle: '@alice',
    content: 'liked your post',
    time: '2m',
    icon: Heart,
    color: '#EF4444'
  },
  { 
    type: 'repost', 
    user: 'Bob Builder', 
    handle: '@bob',
    content: 'reposted your note',
    time: '15m',
    icon: Repeat2,
    color: '#22C55E'
  },
  { 
    type: 'follow', 
    user: 'Charlie Crypto', 
    handle: '@charlie',
    content: 'followed you',
    time: '1h',
    icon: UserPlus,
    color: '#7C3AED'
  },
  { 
    type: 'zap', 
    user: 'Dave BTC', 
    handle: '@dave',
    content: 'zapped you 1,000 sats',
    time: '2h',
    icon: Zap,
    color: '#F59E0B'
  },
  { 
    type: 'reply', 
    user: 'Eve Developer', 
    handle: '@eve',
    content: 'replied to your note',
    time: '3h',
    icon: MessageCircle,
    color: '#3B82F6'
  },
  { 
    type: 'mention', 
    user: 'Frank Nostr', 
    handle: '@frank',
    content: 'mentioned you in a note',
    time: '5h',
    icon: AtSign,
    color: '#7C3AED'
  },
];

export function NotificationsScreen({ showToast }: NotificationsScreenProps) {
  const [activeTab, setActiveTab] = React.useState<'all' | 'mentions' | 'zaps'>('all');

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'mentions'
    ? notifications.filter(n => n.type === 'mention' || n.type === 'reply')
    : notifications.filter(n => n.type === 'zap');

  return (
    <div className="min-h-full">
      <div className="primal-header">
        <h1 className="primal-header-title">Notifications</h1>
      </div>

      <div className="primal-tabs">
        <button
          className={`primal-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`primal-tab ${activeTab === 'mentions' ? 'active' : ''}`}
          onClick={() => setActiveTab('mentions')}
        >
          Mentions
        </button>
        <button
          className={`primal-tab ${activeTab === 'zaps' ? 'active' : ''}`}
          onClick={() => setActiveTab('zaps')}
        >
          Zaps
        </button>
      </div>

      <div>
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-[var(--primal-on-surface-muted)]">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-bold mb-2">No notifications yet</h3>
            <p>When you get notifications, they will show up here.</p>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => {
            const Icon = notification.icon;
            return (
              <motion.div
                key={index}
                className="primal-notification cursor-pointer hover:bg-[var(--primal-hover)]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => showToast(`Viewing notification from ${notification.user}`, 'info')}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${notification.color}20`, color: notification.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="primal-notification-content">
                  <div className="flex items-start gap-3">
                    <div className="primal-avatar primal-avatar-small flex-shrink-0" />
                    <div className="flex-1">
                      <span className="font-bold">{notification.user}</span>
                      {' '}{notification.content}
                      <span className="text-[var(--primal-on-surface-muted)] ml-2">
                        · {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default NotificationsScreen;
