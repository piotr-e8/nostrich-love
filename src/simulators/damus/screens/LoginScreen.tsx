import React, { useState } from 'react';
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

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    console.log(`[Damus] Copied ${type} to clipboard`);
    alert(`${type} copied to clipboard!`);
  };

  const handleGeneratedLogin = () => {
    if (generatedKeys) {
      // Create a new user from generated keys
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
    <div className="min-h-screen bg-white flex flex-col damus-safe-top damus-safe-bottom" data-tour="damus-login">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-8 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Damus</h1>
        <p className="text-gray-500 text-center mb-12">The decentralized social network</p>

        {/* Tabs */}
        <div className="flex w-full max-w-sm mb-8 bg-gray-100 rounded-xl p-1">
          <button
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'login' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'generate' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('generate')}
          >
            Create Account
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="w-full max-w-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public Key (npub)
              </label>
              <input
                type="text"
                value={npubInput}
                onChange={(e) => setNpubInput(e.target.value)}
                placeholder="npub1..."
                className="damus-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Private Key (nsec)
              </label>
              <input
                type="password"
                value={nsecInput}
                onChange={(e) => setNsecInput(e.target.value)}
                placeholder="nsec1..."
                className="damus-input"
              />
            </div>
            <button
              onClick={handleLogin}
              className="damus-btn damus-btn-primary w-full mt-6"
            >
              Sign In
            </button>
            <p className="text-xs text-gray-400 text-center mt-4">
              Demo: Click "Sign In" to use a mock account
            </p>
          </div>
        )}

        {/* Generate Keys Form */}
        {activeTab === 'generate' && (
          <div className="w-full max-w-sm">
            {!generatedKeys ? (
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  Create a new Nostr identity with a public/private key pair.
                </p>
                <button
                  onClick={handleGenerateKeys}
                  className="damus-btn damus-btn-primary w-full"
                >
                  Generate New Keys
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Public Key (npub)
                  </label>
                  <div className="damus-key-display">
                    <span className="text-gray-600">{generatedKeys.npub}</span>
                    <button
                      onClick={() => handleCopy(generatedKeys.npub, 'Public key')}
                      className="copy-btn text-purple-600 hover:text-purple-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Private Key (nsec) - Keep Secret!
                  </label>
                  <div className="damus-key-display bg-red-50 border-red-200">
                    <span className="text-gray-600">{generatedKeys.nsec}</span>
                    <button
                      onClick={() => handleCopy(generatedKeys.nsec, 'Private key')}
                      className="copy-btn text-purple-600 hover:text-purple-700"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-red-500 mt-2">
                    ⚠️ Save this somewhere safe! It cannot be recovered.
                  </p>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setGeneratedKeys(null)}
                    className="damus-btn damus-btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleGeneratedLogin}
                    className="damus-btn damus-btn-primary flex-1"
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
      <div className="px-6 py-4 text-center">
        <p className="text-xs text-gray-400">
          By signing in, you agree to the Terms of Service
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
