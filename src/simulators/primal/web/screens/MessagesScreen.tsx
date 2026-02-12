import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MoreHorizontal } from 'lucide-react';

interface MessagesScreenProps {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const conversations = [
  {
    id: '1',
    user: 'Alice Nakamoto',
    handle: '@alice',
    lastMessage: 'Hey! Did you see the latest NIP?',
    time: '2m',
    unread: true,
  },
  {
    id: '2',
    user: 'Bob Builder',
    handle: '@bob',
    lastMessage: 'Thanks for the zap! ⚡',
    time: '1h',
    unread: false,
  },
  {
    id: '3',
    user: 'Charlie Crypto',
    handle: '@charlie',
    lastMessage: 'Want to collaborate on a project?',
    time: '3h',
    unread: true,
  },
  {
    id: '4',
    user: 'Dave BTC',
    handle: '@dave',
    lastMessage: 'Check out this article on Bitcoin',
    time: '1d',
    unread: false,
  },
  {
    id: '5',
    user: 'Eve Developer',
    handle: '@eve',
    lastMessage: 'Great meeting you at the conference!',
    time: '2d',
    unread: false,
  },
];

export function MessagesScreen({ showToast }: MessagesScreenProps) {
  return (
    <div className="min-h-full">
      <div className="primal-header flex items-center justify-between">
        <h1 className="primal-header-title">Messages</h1>
        <motion.button
          className="p-2 hover:bg-[var(--primal-hover)] rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => showToast('New message', 'info')}
        >
          <Mail className="w-5 h-5" />
        </motion.button>
      </div>

      <div>
        {conversations.map((conv, index) => (
          <motion.div
            key={conv.id}
            className="p-4 border-b border-[var(--primal-border-subtle)] cursor-pointer hover:bg-[var(--primal-hover)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => showToast(`Opening conversation with ${conv.user}`, 'info')}
          >
            <div className="flex items-center gap-3">
              <div className="primal-avatar primal-avatar-small flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{conv.user}</span>
                    <span className="text-[var(--primal-on-surface-variant)] text-sm">{conv.handle}</span>
                  </div>
                  <span className="text-[var(--primal-on-surface-muted)] text-sm">{conv.time}</span>
                </div>
                <div className={`truncate mt-1 ${conv.unread ? 'font-medium text-[var(--primal-on-surface)]' : 'text-[var(--primal-on-surface-variant)]'}`}>
                  {conv.lastMessage}
                </div>
              </div>
              {conv.unread && (
                <div className="w-2 h-2 bg-[#7C3AED] rounded-full flex-shrink-0" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-8 text-center text-[var(--primal-on-surface-muted)]">
        <p className="text-sm">End of conversations</p>
      </div>
    </div>
  );
}

export default MessagesScreen;
