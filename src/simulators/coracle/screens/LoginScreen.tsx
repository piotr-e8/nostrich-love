import React, { useState } from 'react';
import type { MockUser } from '../../../data/mock';
import { getRandomUsers } from '../../../data/mock';

interface LoginScreenProps {
  onLogin: (user: MockUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'create'>('login');
  const [npubInput, setNpubInput] = useState('');
  const [generatedKeys, setGeneratedKeys] = useState<{ npub: string; nsec: string } | null>(null);
  const [showCopied, setShowCopied] = useState<string | null>(null);

  const handleLogin = () => {
    const randomUser = getRandomUsers(1)[0];
    onLogin(randomUser);
  };

  const handleGenerateKeys = () => {
    const mockNpub = 'npub1' + Array(59).fill(0).map(() => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    const mockNsec = 'nsec1' + Array(59).fill(0).map(() => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
    setGeneratedKeys({ npub: mockNpub, nsec: mockNsec });
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setShowCopied(type);
    setTimeout(() => setShowCopied(null), 2000);
  };

  const handleGeneratedLogin = () => {
    if (generatedKeys) {
      const newUser: MockUser = {
        pubkey: generatedKeys.npub,
        displayName: 'New Coracle User',
        username: 'newuser',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${generatedKeys.npub}`,
        bio: 'Just joined Nostr with Coracle!',
        followersCount: 0,
        followingCount: 0,
        createdAt: Math.floor(Date.now() / 1000),
        lastActive: Math.floor(Date.now() / 1000),
      };
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto">
        {/* Logo */}
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center mb-6 shadow-lg">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Coracle</h1>
        <p className="text-lg text-gray-600 text-center mb-2">Simple. Accessible. Nostr.</p>
        <p className="text-sm text-gray-400 text-center mb-12">The beginner-friendly Nostr client</p>

        {/* Tabs */}
        <div className="flex w-full mb-8 bg-gray-100 rounded-xl p-1">
          <button
            className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'login' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'create' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('create')}
          >
            Create Account
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="w-full space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Public Key (npub)
              </label>
              <input
                type="text"
                value={npubInput}
                onChange={(e) => setNpubInput(e.target.value)}
                placeholder="npub1..."
                className="coracle-input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Or use a Nostr extension
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button className="coracle-btn-secondary">
                  <span className="text-lg mr-2">🔑</span>
                  Extension
                </button>
                <button className="coracle-btn-secondary">
                  <span className="text-lg mr-2">📱</span>
                  QR Code
                </button>
              </div>
            </div>
            <button
              onClick={handleLogin}
              className="coracle-btn-primary w-full mt-6"
            >
              Sign In
            </button>
            <p className="text-xs text-gray-400 text-center mt-4">
              Demo: Click "Sign In" to explore with a mock account
            </p>
          </div>
        )}

        {/* Create Account Form */}
        {activeTab === 'create' && (
          <div className="w-full">
            {!generatedKeys ? (
              <div className="text-center">
                <div className="bg-indigo-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-indigo-900 mb-2">Welcome to Nostr!</h3>
                  <p className="text-sm text-indigo-700">
                    We'll create a secure key pair for you. Your public key is your identity, 
                    and your private key is your password. Keep it safe!
                  </p>
                </div>
                <button
                  onClick={handleGenerateKeys}
                  className="coracle-btn-primary w-full"
                >
                  Generate My Keys
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-800 font-medium mb-2">
                    ✓ Keys generated successfully!
                  </p>
                  <p className="text-xs text-green-600">
                    Save these somewhere safe before continuing.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Public Key (npub)
                  </label>
                  <div className="coracle-key-display">
                    <code className="text-xs text-gray-600 break-all">{generatedKeys.npub}</code>
                    <button
                      onClick={() => handleCopy(generatedKeys.npub, 'npub')}
                      className="coracle-copy-btn"
                    >
                      {showCopied === 'npub' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Private Key (nsec) 
                    <span className="text-red-500 ml-1">- Keep Secret!</span>
                  </label>
                  <div className="coracle-key-display bg-red-50 border-red-200">
                    <code className="text-xs text-gray-600 break-all">{generatedKeys.nsec}</code>
                    <button
                      onClick={() => handleCopy(generatedKeys.nsec, 'nsec')}
                      className="coracle-copy-btn"
                    >
                      {showCopied === 'nsec' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-red-500 mt-2">
                    ⚠️ Never share this key! It controls your account.
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setGeneratedKeys(null)}
                    className="coracle-btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleGeneratedLogin}
                    className="coracle-btn-primary flex-1"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-6 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400">
          By using Coracle, you agree to the Terms of Service and Privacy Policy
        </p>
        <p className="text-xs text-gray-300 mt-2">
          New to Nostr? <button className="text-indigo-500 hover:underline">Learn more</button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
