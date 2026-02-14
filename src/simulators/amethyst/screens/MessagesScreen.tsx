import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  MoreVertical,
  CheckCheck,
  Clock
} from 'lucide-react';
import '../amethyst.theme.css';

interface Conversation {
  id: string;
  user: {
    name: string;
    avatar: string;
    handle: string;
    isVerified?: boolean;
    isOnline?: boolean;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isEncrypted: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    user: {
      name: 'fiatjaf',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=fiatjaf',
      handle: 'fiatjaf@fiatjaf.com',
      isVerified: true,
      isOnline: true,
    },
    lastMessage: 'Check out this new NIP proposal',
    timestamp: '2m',
    unreadCount: 2,
    isEncrypted: true,
  },
  {
    id: '2',
    user: {
      name: 'PabloF7z',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=pablo',
      handle: 'pablo@damus.io',
      isVerified: true,
      isOnline: false,
    },
    lastMessage: 'The new update is looking great!',
    timestamp: '1h',
    unreadCount: 0,
    isEncrypted: true,
  },
  {
    id: '3',
    user: {
      name: 'Will Casarin',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=jb55',
      handle: 'jb55@jb55.com',
      isVerified: true,
      isOnline: true,
    },
    lastMessage: 'Thanks for the zap! ⚡️',
    timestamp: '3h',
    unreadCount: 0,
    isEncrypted: true,
  },
  {
    id: '4',
    user: {
      name: 'Vitor Pamplona',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=vitor',
      handle: 'vitor@vitorpamplona.com',
      isVerified: true,
      isOnline: false,
    },
    lastMessage: 'Material Design 3 looks amazing',
    timestamp: '1d',
    unreadCount: 0,
    isEncrypted: true,
  },
  {
    id: '5',
    user: {
      name: 'ODELL',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=odell',
      handle: '@odell',
      isOnline: true,
    },
    lastMessage: 'Keep stacking sats',
    timestamp: '2d',
    unreadCount: 0,
    isEncrypted: true,
  },
];

export function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState(mockConversations);

  const filteredConversations = conversations.filter(
    conv => 
      conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[var(--md-background)]">
      {/* App Bar */}
      <div className="md-app-bar">
        <h1 className="flex-1 text-xl font-semibold text-[var(--md-on-surface)]">
          Messages
        </h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-[var(--md-surface-variant)]"
        >
          <Plus className="w-6 h-6 text-[var(--md-on-surface)]" />
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-[var(--md-surface)]">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="w-5 h-5 text-[var(--md-on-surface-variant)]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages"
            className="w-full bg-[var(--md-surface-variant)] text-[var(--md-on-surface)] pl-10 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--md-primary)]"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation, index) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              index={index}
            />
          ))
        ) : (
          <div className="text-center py-12 text-[var(--md-on-surface-variant)]">
            No conversations found
          </div>
        )}
      </div>

      {/* Encryption Notice */}
      <div className="p-3 bg-[var(--md-surface-variant)]/50 text-center">
        <p className="text-xs text-[var(--md-on-surface-variant)]">
          All messages are end-to-end encrypted
        </p>
      </div>
    </div>
  );
}

function ConversationItem({ 
  conversation, 
  index 
}: { 
  conversation: Conversation; 
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, type: 'spring', stiffness: 300, damping: 25 }}
      whileTap={{ scale: 0.98 }}
      className="p-4 border-b border-[var(--md-outline-variant)] hover:bg-[var(--md-surface-variant)]/50 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {/* Avatar with online indicator */}
        <div className="relative">
          <img
            src={conversation.user.avatar}
            alt={conversation.user.name}
            className="w-12 h-12 rounded-full"
          />
          {conversation.user.isOnline && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[var(--md-surface)] rounded-full" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[var(--md-on-surface)]">
                {conversation.user.name}
              </span>
              {conversation.user.isVerified && (
                <CheckCheck className="w-4 h-4 text-[var(--md-primary)]" />
              )}
            </div>
            <span className="text-sm text-[var(--md-on-surface-variant)] whitespace-nowrap">
              {conversation.timestamp}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-0.5">
            <p className={`truncate ${
              conversation.unreadCount > 0 
                ? 'text-[var(--md-on-surface)] font-medium' 
                : 'text-[var(--md-on-surface-variant)]'
            }`}>
              {conversation.lastMessage}
            </p>
            {conversation.isEncrypted && (
              <svg className="w-3 h-3 text-[var(--md-on-surface-variant)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>

        {/* Unread Badge */}
        {conversation.unreadCount > 0 && (
          <div className="w-5 h-5 rounded-full bg-[var(--md-primary)] text-[var(--md-on-primary)] text-xs flex items-center justify-center font-medium">
            {conversation.unreadCount}
          </div>
        )}
      </div>
    </motion.div>
  );
}
