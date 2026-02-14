import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MockUser } from '../../../data/mock';

interface LoginScreenProps {
  onLogin: (user: MockUser) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [nsec, setNsec] = useState('');

  // Generate a mock user
  const generateMockUser = useCallback((): MockUser => {
    const pubkeyBase = 'npub1' + Array(58).fill(0).map(() => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');
    return {
      pubkey: pubkeyBase,
      displayName: 'Anonymous User',
      username: 'anonymous',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${pubkeyBase}`,
      bio: 'New Keychat user',
      website: '',
      location: '',
      lightningAddress: '',
      nip05: '',
      followersCount: 0,
      followingCount: 0,
      createdAt: Date.now(),
      lastActive: Date.now(),
      isVerified: false,
    };
  }, []);

  const handleCreateAccount = useCallback(() => {
    const user = generateMockUser();
    setIsCreatingAccount(true);
    setTimeout(() => {
      onLogin(user);
    }, 1500);
  }, [generateMockUser, onLogin]);

  const handleImportKey = useCallback(() => {
    if (nsec.trim().length < 10) {
      return;
    }
    const user = generateMockUser();
    setIsImporting(true);
    setTimeout(() => {
      onLogin(user);
    }, 1500);
  }, [nsec, generateMockUser, onLogin]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#1E40AF] to-[#2D7FF9]" data-tour="keychat-login">
      {/* Logo Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6"
        >
          <svg className="w-14 h-14 text-[#2D7FF9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Keychat
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/80 text-center text-sm"
        >
          Sovereign Identity. Bitcoin Wallet.<br />Secure Chat.
        </motion.p>
      </div>

      {/* Action Area */}
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl p-6 space-y-4">
        <AnimatePresence mode="wait">
          {!isCreatingAccount && !isImporting ? (
            <motion.div
              key="options"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <button
                onClick={handleCreateAccount}
                className="w-full py-4 bg-[#2D7FF9] text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/30 hover:bg-[#1E40AF] transition-colors"
                data-tour="keychat-generate-keys"
              >
                Create New Account
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">or</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <input
                  type="password"
                  value={nsec}
                  onChange={(e) => setNsec(e.target.value)}
                  placeholder="Paste your nsec private key"
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7FF9] dark:text-white"
                  data-tour="keychat-import-key"
                />
                <button
                  onClick={handleImportKey}
                  disabled={nsec.trim().length < 10}
                  className="w-full py-3 border-2 border-[#2D7FF9] text-[#2D7FF9] rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import Key
                </button>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Your keys never leave this device. You are in control.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-blue-200 border-t-[#2D7FF9] rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600 dark:text-gray-300">
                {isCreatingAccount ? 'Creating your sovereign identity...' : 'Importing your keys...'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Secured with Signal Protocol
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
