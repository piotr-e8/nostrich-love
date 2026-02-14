import React from 'react';
import { motion } from 'framer-motion';

interface ChatListScreenProps {
  onChatSelect: (chatId: string) => void;
}

// Mock chat data
const mockChats = [
  {
    id: '1',
    name: 'Alice',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=alice',
    lastMessage: 'Hey! Did you see the Bitcoin price? 🚀',
    timestamp: '2m',
    unreadCount: 3,
    isEncrypted: true,
  },
  {
    id: '2',
    name: 'Bob',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=bob',
    lastMessage: 'Thanks for the ecash! ⚡',
    timestamp: '1h',
    unreadCount: 0,
    isEncrypted: true,
  },
  {
    id: '3',
    name: 'Nostr Group',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=NG',
    lastMessage: 'Charlie: Check out this new relay',
    timestamp: '3h',
    unreadCount: 12,
    isEncrypted: true,
    isGroup: true,
  },
  {
    id: '4',
    name: 'Diana',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=diana',
    lastMessage: 'Can you send me some sats?',
    timestamp: '1d',
    unreadCount: 0,
    isEncrypted: true,
  },
  {
    id: '5',
    name: 'Bitcoin Dev Chat',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=BD',
    lastMessage: 'Evan: New NIP proposal looks good',
    timestamp: '2d',
    unreadCount: 0,
    isEncrypted: true,
    isGroup: true,
  },
];

export function ChatListScreen({ onChatSelect }: ChatListScreenProps) {
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950" data-tour="keychat-chat-list">
      {/* Header */}
      <div className="bg-[#2D7FF9] text-white px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Chats</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {mockChats.map((chat, index) => (
          <motion.button
            key={chat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onChatSelect(chat.id)}
            className="w-full flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
            data-tour={index === 0 ? 'keychat-chat-item' : undefined}
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-12 h-12 rounded-full bg-gray-200"
              />
              {chat.isEncrypted && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {chat.name}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{chat.timestamp}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {chat.lastMessage}
              </p>
            </div>

            {/* Unread Badge */}
            {chat.unreadCount > 0 && (
              <div className="w-6 h-6 bg-[#2D7FF9] rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{chat.unreadCount}</span>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
