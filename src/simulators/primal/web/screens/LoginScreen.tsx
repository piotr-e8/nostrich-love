import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { MockUser } from '../../../../data/mock';
import { getRandomUsers } from '../../../../data/mock';

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
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6" data-tour="primal-login">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center shadow-lg"
          >
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </motion.div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Primal</h1>
          <p className="text-gray-400">Discover the best of Nostr</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-[#1a1a1a] rounded-2xl p-1 mb-8 border border-[#333]">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'login'
                ? 'bg-[#7C3AED] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'generate'
                ? 'bg-[#7C3AED] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Login Tab */}
        {activeTab === 'login' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-[#1a1a1a] rounded-2xl p-6 space-y-6 border border-[#333]">
              {/* Private Key Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Private Key (nsec)
                </label>
                <input
                  type="password"
                  value={nsecInput}
                  onChange={(e) => setNsecInput(e.target.value)}
                  placeholder="nsec1..."
                  className="w-full px-4 py-3 bg-[#242424] border border-[#404040] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#7C3AED] transition-colors"
                />
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#333]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#1a1a1a] text-gray-500">or</span>
                </div>
              </div>

              {/* Browser Extension Button */}
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#242424] hover:bg-[#333] border border-[#404040] rounded-xl text-white font-medium transition-colors">
                <svg className="w-5 h-5 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Use Browser Extension
              </button>

              {/* Demo Login Button */}
              <button
                onClick={handleLogin}
                className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl transition-colors"
              >
                Sign In
              </button>
            </div>

            {/* Help Text */}
            <div className="text-center text-sm text-gray-500">
              <p>Nostr uses public-key cryptography for identity.</p>
              <p className="mt-1">No email, no passwords, no tracking.</p>
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
              <div className="bg-[#1a1a1a] rounded-2xl p-6 text-center border border-[#333]">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#242424] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Create Your Account</h3>
                <p className="text-gray-400 mb-6">
                  Generate a secure key pair. Your keys = your identity on Nostr.
                  <span className="text-[#7C3AED]"> Keep your private key safe!</span>
                </p>
                <button
                  onClick={handleGenerateKeys}
                  className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl transition-colors"
                >
                  Generate New Keys
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1a1a1a] rounded-2xl p-6 space-y-4 border border-[#333]"
              >
                {/* Public Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Public Key (npub)
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-3 bg-[#242424] border border-[#404040] rounded-xl text-gray-400 text-sm break-all font-mono">
                      {generatedKeys.npub}
                    </div>
                    <button
                      onClick={() => handleCopy(generatedKeys.npub)}
                      className="px-4 py-3 bg-[#242424] hover:bg-[#333] border border-[#404040] rounded-xl text-[#7C3AED] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Private Key */}
                <div>
                  <label className="block text-sm font-medium text-red-400 mb-2">
                    Private Key (nsec) - Save This!
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300 text-sm break-all font-mono">
                      {generatedKeys.nsec}
                    </div>
                    <button
                      onClick={() => handleCopy(generatedKeys.nsec)}
                      className="px-4 py-3 bg-red-900/20 hover:bg-red-900/30 border border-red-500/30 rounded-xl text-red-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Save your private key - it cannot be recovered if lost!
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setGeneratedKeys(null)}
                    className="flex-1 py-3 bg-[#242424] hover:bg-[#333] border border-[#404040] text-white font-medium rounded-xl transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleGeneratedLogin}
                    className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-600">
          <p>Primal connects you to the Nostr protocol.</p>
          <p className="mt-1">Your data lives on relays, not our servers.</p>
        </div>
      </motion.div>

      {/* Toast */}
      {showCopiedToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2"
        >
          <div className="px-4 py-2 bg-[#7C3AED] text-white rounded-full shadow-lg text-sm font-medium">
            Copied to clipboard!
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LoginScreen;
