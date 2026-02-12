import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { MockUser } from '../../../data/mock';
import { getRandomUsers } from '../../../data/mock';

interface LoginScreenProps {
  onLogin: (user: MockUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'generate'>('login');
  const [nsecInput, setNsecInput] = useState('');
  const [generatedKeys, setGeneratedKeys] = useState<{ npub: string; nsec: string } | null>(null);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const handleLogin = () => {
    // For demo, pick a random user
    const randomUser = getRandomUsers(1)[0];
    onLogin(randomUser);
  };

  const handleGenerateKeys = () => {
    // Generate mock keys
    const mockNpub = 'npub1' + Array(64).fill(0).map(() => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    const mockNsec = 'nsec1' + Array(64).fill(0).map(() => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    setGeneratedKeys({ npub: mockNpub, nsec: mockNsec });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopiedToast(true);
    setTimeout(() => setShowCopiedToast(false), 2000);
  };

  const handleGeneratedLogin = () => {
    if (generatedKeys) {
      const newUser: MockUser = {
        pubkey: generatedKeys.npub,
        displayName: 'New User',
        username: 'newuser',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${generatedKeys.npub}`,
        bio: 'Just joined Nostr!',
        followersCount: 0,
        followingCount: 0,
        createdAt: Math.floor(Date.now() / 1000),
        lastActive: Math.floor(Date.now() / 1000),
      };
      onLogin(newUser);
    }
  };

  return (
    <div 
      className="min-h-full bg-gradient-to-b from-[#F8F9FA] to-[#FFFFFF] flex flex-col items-center justify-center p-6"
      data-tour="yakihonne-login"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-[#F7931A] to-[#C7760D] flex items-center justify-center shadow-xl"
          >
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </motion.div>
          
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-1">YakiHonne</h1>
          <p className="text-[#5F6368] text-sm">焼き本音 - Your voice, uncensored</p>
        </div>

        {/* Decorative Line */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-0.5 bg-[#E0E0E0]" />
          <div className="w-2 h-2 rounded-full bg-[#F7931A]" />
          <div className="w-12 h-0.5 bg-[#E0E0E0]" />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 mb-6 shadow-sm border border-[#E0E0E0]">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'login'
                ? 'bg-[#F7931A] text-white shadow-md'
                : 'text-[#5F6368] hover:text-[#1A1A1A]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'generate'
                ? 'bg-[#F7931A] text-white shadow-md'
                : 'text-[#5F6368] hover:text-[#1A1A1A]'
            }`}
          >
            Create Keys
          </button>
        </div>

        {/* Login Tab */}
        {activeTab === 'login' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl p-5 space-y-5 shadow-sm border border-[#E0E0E0]">
              {/* Private Key Input */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  Private Key (nsec)
                </label>
                <input
                  type="password"
                  value={nsecInput}
                  onChange={(e) => setNsecInput(e.target.value)}
                  placeholder="nsec1..."
                  className="w-full px-4 py-3 bg-[#F8F9FA] border border-[#E0E0E0] rounded-xl text-[#1A1A1A] placeholder-[#9AA0A6] focus:outline-none focus:border-[#F7931A] focus:ring-2 focus:ring-[#F7931A]/20 transition-all"
                />
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E0E0E0]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-[#9AA0A6]">or</span>
                </div>
              </div>

              {/* Browser Extension Button */}
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#F8F9FA] hover:bg-[#F1F3F4] border border-[#E0E0E0] rounded-xl text-[#1A1A1A] font-semibold transition-colors">
                <svg className="w-5 h-5 text-[#F7931A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Use Extension
              </button>

              {/* Demo Login Button */}
              <button
                onClick={handleLogin}
                className="w-full py-3.5 bg-[#F7931A] hover:bg-[#C7760D] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Sign In
              </button>
            </div>

            {/* Help Text */}
            <div className="text-center text-sm text-[#5F6368]">
              <p>Nostr uses cryptographic keys instead of passwords.</p>
              <p className="mt-1">You own your identity.</p>
            </div>
          </motion.div>
        )}

        {/* Generate Keys Tab */}
        {activeTab === 'generate' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {!generatedKeys ? (
              <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-[#E0E0E0]">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#F7931A]/20 to-[#C7760D]/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#F7931A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Generate Keys</h3>
                <p className="text-[#5F6368] mb-5 text-sm leading-relaxed">
                  Create your Nostr identity with a unique key pair. 
                  <span className="text-[#F7931A] font-semibold"> Save your private key securely!</span>
                </p>
                <button
                  onClick={handleGenerateKeys}
                  className="w-full py-3.5 bg-[#F7931A] hover:bg-[#C7760D] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Create Keys
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-5 space-y-4 shadow-sm border border-[#E0E0E0]"
              >
                {/* Public Key */}
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    Public Key (npub)
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 px-3 py-2.5 bg-[#F8F9FA] border border-[#E0E0E0] rounded-xl text-[#5F6368] text-xs break-all font-mono">
                      {generatedKeys.npub}
                    </div>
                    <button
                      onClick={() => handleCopy(generatedKeys.npub)}
                      className="px-3 py-2.5 bg-[#F8F9FA] hover:bg-[#F1F3F4] border border-[#E0E0E0] rounded-xl text-[#F7931A] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Private Key */}
                <div>
                  <label className="block text-sm font-semibold text-red-500 mb-2">
                    Private Key (nsec) - Keep Secret!
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs break-all font-mono">
                      {generatedKeys.nsec}
                    </div>
                    <button
                      onClick={() => handleCopy(generatedKeys.nsec)}
                      className="px-3 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-red-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Save this somewhere safe - it cannot be recovered!
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setGeneratedKeys(null)}
                    className="flex-1 py-3 bg-[#F8F9FA] hover:bg-[#F1F3F4] border border-[#E0E0E0] text-[#1A1A1A] font-semibold rounded-xl transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleGeneratedLogin}
                    className="flex-1 py-3 bg-[#F7931A] hover:bg-[#C7760D] text-white font-bold rounded-xl shadow-md transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-xs text-[#5F6368]">Decentralized & Censorship Resistant</span>
          </div>
          <p className="text-xs text-[#9AA0A6]">
            YakiHonne runs on the Nostr protocol
          </p>
        </div>
      </motion.div>

      {/* Toast */}
      {showCopiedToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2"
        >
          <div className="px-4 py-2 bg-[#1A1A1A] text-white rounded-full shadow-lg text-sm font-medium">
            Copied to clipboard!
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LoginScreen;
