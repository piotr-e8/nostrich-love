import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Repeat, 
  Zap, 
  UserPlus, 
  AtSign,
  Check,
  Settings
} from 'lucide-react';
import '../amethyst.theme.css';

interface Notification {
  id: string;
  type: 'like' | 'repost' | 'zap' | 'reply' | 'follow' | 'mention';
  user: {
    name: string;
    avatar: string;
    handle: string;
  };
  content?: string;
  amount?: number;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'zap',
    user: {
      name: 'fiatjaf',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=fiatjaf',
      handle: 'fiatjaf@fiatjaf.com',
    },
    amount: 1000,
    content: 'Great post about Nostr!',
    timestamp: '2m',
    read: false,
  },
  {
    id: '2',
    type: 'like',
    user: {
      name: 'PabloF7z',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=pablo',
      handle: 'pablo@damus.io',
    },
    content: 'Just shipped a new feature...',
    timestamp: '15m',
    read: false,
  },
  {
    id: '3',
    type: 'repost',
    user: {
      name: 'Will Casarin',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=jb55',
      handle: 'jb55@jb55.com',
    },
    content: 'Bitcoin fixes this. Nostr fixes the rest.',
    timestamp: '1h',
    read: false,
  },
  {
    id: '4',
    type: 'follow',
    user: {
      name: 'Vitor Pamplona',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=vitor',
      handle: 'vitor@vitorpamplona.com',
    },
    timestamp: '2h',
    read: true,
  },
  {
    id: '5',
    type: 'reply',
    user: {
      name: 'ODELL',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=odell',
      handle: '@odell',
    },
    content: 'This is the way.',
    timestamp: '3h',
    read: true,
  },
  {
    id: '6',
    type: 'mention',
    user: {
      name: 'Stacker News',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sn',
      handle: 'sn@stacker.news',
    },
    content: '@you check this out!',
    timestamp: '5h',
    read: true,
  },
];

const notificationIcons = {
  like: { icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
  repost: { icon: Repeat, color: 'text-green-500', bg: 'bg-green-500/10' },
  zap: { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  reply: { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  follow: { icon: UserPlus, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  mention: { icon: AtSign, color: 'text-orange-500', bg: 'bg-orange-500/10' },
};

export function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'mentions'>('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full bg-[var(--md-background)]">
      {/* App Bar */}
      <div className="md-app-bar">
        <h1 className="flex-1 text-xl font-semibold text-[var(--md-on-surface)]">
          Notifications
        </h1>
        {unreadCount > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={markAllRead}
            className="text-[var(--md-primary)] text-sm font-medium"
          >
            Mark all read
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-[var(--md-surface-variant)] ml-2"
        >
          <Settings className="w-5 h-5 text-[var(--md-on-surface)]" />
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="md-tabs">
        <button
          onClick={() => setActiveTab('all')}
          className={`md-tab ${activeTab === 'all' ? 'active' : ''}`}
        >
          All
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-[var(--md-error)] text-[var(--md-on-error)] text-xs rounded-full">
              {unreadCount}
            </span>
          )}
          {activeTab === 'all' && (
            <motion.div
              layoutId="notif-tab-indicator"
              className="md-tab-indicator"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('mentions')}
          className={`md-tab ${activeTab === 'mentions' ? 'active' : ''}`}
        >
          Mentions
          {activeTab === 'mentions' && (
            <motion.div
              layoutId="notif-tab-indicator"
              className="md-tab-indicator"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'all' ? (
            <motion.div
              key="all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {notifications.map((notification, index) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="mentions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {notifications
                .filter(n => n.type === 'mention' || n.type === 'reply')
                .map((notification, index) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    index={index}
                  />
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NotificationItem({ 
  notification, 
  index 
}: { 
  notification: Notification; 
  index: number;
}) {
  const config = notificationIcons[notification.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
      className={`p-4 border-b border-[var(--md-outline-variant)] ${
        !notification.read ? 'bg-[var(--md-primary-container)]/30' : ''
      }`}
    >
      <div className="flex gap-3">
        {/* User Avatar */}
        <div className="relative">
          <img
            src={notification.user.avatar}
            alt={notification.user.name}
            className="w-10 h-10 rounded-full"
          />
          {/* Icon Badge */}
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${config.bg} flex items-center justify-center`}>
            <Icon className={`w-3 h-3 ${config.color}`} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-[var(--md-on-surface)]">
                <span className="font-semibold">{notification.user.name}</span>
                {' '}
                {getNotificationText(notification.type)}
              </p>
              
              {notification.content && (
                <p className="text-[var(--md-on-surface-variant)] mt-1 line-clamp-2">
                  {notification.content}
                </p>
              )}
              
              {notification.amount && (
                <div className="flex items-center gap-1 mt-1 text-yellow-600">
                  <Zap className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{notification.amount.toLocaleString()} sats</span>
                </div>
              )}
              
              <span className="text-[var(--md-on-surface-variant)] text-sm mt-1 block">
                {notification.timestamp}
              </span>
            </div>

            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-[var(--md-primary)] mt-2" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getNotificationText(type: Notification['type']): string {
  switch (type) {
    case 'like':
      return 'liked your post';
    case 'repost':
      return 'reposted your post';
    case 'zap':
      return 'zapped you';
    case 'reply':
      return 'replied to your post';
    case 'follow':
      return 'followed you';
    case 'mention':
      return 'mentioned you';
    default:
      return 'interacted with you';
  }
}
