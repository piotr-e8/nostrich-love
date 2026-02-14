import React from 'react';

interface Notification {
  id: string;
  type: 'like' | 'follow' | 'comment' | 'mention';
  username: string;
  avatar: string;
  content?: string;
  preview?: string;
  timestamp: string;
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    username: 'alice_photo',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=alice',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop',
    timestamp: '5m',
  },
  {
    id: '2',
    type: 'follow',
    username: 'bob_snaps',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=bob',
    timestamp: '1h',
  },
  {
    id: '3',
    type: 'comment',
    username: 'carol_lens',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=carol',
    content: 'Amazing shot! Love the lighting 🔥',
    preview: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=100&h=100&fit=crop',
    timestamp: '2h',
  },
  {
    id: '4',
    type: 'like',
    username: 'dave_focus',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dave',
    preview: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=100&h=100&fit=crop',
    timestamp: '3h',
  },
  {
    id: '5',
    type: 'mention',
    username: 'eve_filter',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=eve',
    content: 'Hey @photolover, check this out!',
    timestamp: '5h',
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'like':
      return (
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      );
    case 'follow':
      return (
        <svg className="w-6 h-6 text-[#4ECDC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      );
    case 'comment':
      return (
        <svg className="w-6 h-6 text-[#FF6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case 'mention':
      return (
        <svg className="w-6 h-6 text-[#4ECDC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>
      );
    default:
      return null;
  }
};

const getNotificationText = (notification: Notification) => {
  switch (notification.type) {
    case 'like':
      return 'liked your photo';
    case 'follow':
      return 'started following you';
    case 'comment':
      return `commented: ${notification.content}`;
    case 'mention':
      return `mentioned you: ${notification.content}`;
    default:
      return '';
  }
};

export function NotificationsScreen() {
  return (
    <div className="olas-notifications bg-white min-h-full" data-tour="olas-notifications">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">Activity</h1>
      </div>

      {/* Follow Requests */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Follow Requests</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <img src="https://api.dicebear.com/7.x/bottts/svg?seed=user1" alt="" className="w-10 h-10 rounded-full border-2 border-white" />
              <img src="https://api.dicebear.com/7.x/bottts/svg?seed=user2" alt="" className="w-10 h-10 rounded-full border-2 border-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">new_follower + 2 others</p>
              <p className="text-xs text-gray-500">Requested to follow you</p>
            </div>
          </div>
          <button className="text-[#FF6B6B] text-sm font-semibold">Confirm</button>
        </div>
      </div>

      {/* Notifications List */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 px-4 py-3">This Week</h2>
        {notifications.map((notification) => (
          <div key={notification.id} className="olas-notification">
            <div className="relative">
              <img
                src={notification.avatar}
                alt={notification.username}
                className="olas-notification-avatar"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                {getNotificationIcon(notification.type)}
              </div>
            </div>
            <div className="olas-notification-content">
              <p className="text-sm">
                <span className="font-semibold text-gray-900">{notification.username}</span>{' '}
                <span className="text-gray-700">{getNotificationText(notification)}</span>{' '}
                <span className="text-gray-400">{notification.timestamp}</span>
              </p>
            </div>
            {notification.preview && (
              <img
                src={notification.preview}
                alt="Preview"
                className="olas-notification-preview"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
