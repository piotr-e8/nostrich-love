import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { MockUser } from '../../../data/mock';
import { getRandomUsers } from '../../../data/mock';

interface LoginScreenProps {
  onLogin: (user: MockUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [npubInput, setNpubInput] = useState('');
  const [nsecInput, setNsecInput] = useState('');
  const [activeTab, setActiveTab] = useState<'login' | 'generate'>('login');
  const [generatedKeys, setGeneratedKeys] = useState<{ npub: string; nsec: string } | null>(null);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const handleLogin = () => {
    const randomUser = getRandomUsers(1)[0];
    onLogin(randomUser);
  };

  const handleGenerateKeys = () => {
    const mockNpub = 'npub1' + Array(64).fill(0).map(() => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    const mockNsec = 'nsec1' + Array(64).fill(0).map(() => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    setGeneratedKeys({ npub: mockNpub, nsec: mockNsec });
  };

  const handleCopy = (text: string, type: string) => {
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
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${generatedKeys.npub}`,
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
    <div className="min-h-full bg-[var(--md-background)] flex flex-col" data-tour="amethyst-login">
      {/* Material Design App Bar */}
      <div className="bg-[var(--md-primary)] text-[var(--md-on-primary)] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--md-on-primary)]/20 flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Amethyst</h1>
            <p className="text-sm text-[var(--md-on-primary)]/70">Nostr Client</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Logo */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--md-primary)] to-[var(--md-tertiary)] flex items-center justify-center mb-6 shadow-lg"
        >
          <svg className="w-12 h-12 text-[var(--md-on-primary)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </motion.div>
        
        <h2 className="text-2xl font-bold text-[var(--md-on-background)] mb-2">Welcome</h2>
        <p className="text-[var(--md-on-surface-variant)] text-center mb-8">Sign in to join the decentralized network</p>

        {/* Material Design Tabs */}
        <div className="flex w-full max-w-sm mb-6 bg-[var(--md-surface-variant)] rounded-full p-1">
          <button
            className={`flex-1 py-3 text-sm font-medium rounded-full transition-all ${
              activeTab === 'login' 
                ? 'bg-[var(--md-primary)] text-[var(--md-on-primary)] shadow-md' 
                : 'text-[var(--md-on-surface-variant)]'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium rounded-full transition-all ${
              activeTab === 'generate' 
                ? 'bg-[var(--md-primary)] text-[var(--md-on-primary)] shadow-md' 
                : 'text-[var(--md-on-surface-variant)]'
            }`}
            onClick={() => setActiveTab('generate')}
          >
            Create Account
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-[var(--md-on-surface)] mb-2 ml-1">
                Public Key (npub)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={npubInput}
                  onChange={(e) => setNpubInput(e.target.value)}
                  placeholder="npub1..."
                  className="md-input w-full pr-12"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--md-on-surface-variant)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--md-on-surface)] mb-2 ml-1">
                Private Key (nsec)
              </label>
              <input
                type="password"
                value={nsecInput}
                onChange={(e) => setNsecInput(e.target.value)}
                placeholder="nsec1..."
                className="md-input w-full"
              />
            </div>
            <button
              onClick={handleLogin}
              className="md-btn md-btn-primary w-full mt-6"
            >
              Sign In
            </button>
            <p className="text-xs text-[var(--md-on-surface-variant)] text-center mt-4">
              Demo: Click "Sign In" to use a mock account
            </p>
          </motion.div>
        )}

        {/* Generate Keys Form */}
        {activeTab === 'generate' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm"
          >
            {!generatedKeys ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--md-secondary-container)] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--md-on-secondary-container)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <p className="text-[var(--md-on-surface-variant)] mb-6">
                  Create a new Nostr identity with a public/private key pair.
                </p>
                <button
                  onClick={handleGenerateKeys}
                  className="md-btn md-btn-primary w-full"
                >
                  Generate New Keys
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--md-on-surface)] mb-2 ml-1">
                    Public Key (npub)
                  </label>
                  <div className="flex items-center gap-2 bg-[var(--md-surface-variant)] rounded-xl p-3">
                    <span className="flex-1 text-sm text-[var(--md-on-surface-variant)] truncate">{generatedKeys.npub}</span>
                    <button
                      onClick={() => handleCopy(generatedKeys.npub, 'Public key')}
                      className="p-2 hover:bg-[var(--md-primary)]/10 rounded-lg text-[var(--md-primary)]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--md-on-surface)] mb-2 ml-1">
                    Private Key (nsec) - Keep Secret!
                  </label>
                  <div className="flex items-center gap-2 bg-[var(--md-error-container)] rounded-xl p-3">
                    <span className="flex-1 text-sm text-[var(--md-on-error-container)] truncate">{generatedKeys.nsec}</span>
                    <button
                      onClick={() => handleCopy(generatedKeys.nsec, 'Private key')}
                      className="p-2 hover:bg-[var(--md-error)]/10 rounded-lg text-[var(--md-error)]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-[var(--md-error)] mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Save this somewhere safe! It cannot be recovered.
                  </p>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setGeneratedKeys(null)}
                    className="md-btn md-btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleGeneratedLogin}
                    className="md-btn md-btn-primary flex-1"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 text-center border-t border-[var(--md-outline-variant)]">
        <p className="text-xs text-[var(--md-on-surface-variant)]">
          By signing in, you agree to the Terms of Service
        </p>
      </div>

      {/* Toast */}
      {showCopiedToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2"
        >
          <div className="md-snackbar">
            <span>Copied to clipboard!</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LoginScreen;
