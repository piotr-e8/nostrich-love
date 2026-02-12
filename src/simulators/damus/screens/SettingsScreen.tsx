import React, { useState } from 'react';
import type { MockUser } from '../../../data/mock';
import type { DamusScreen } from '../DamusSimulator';
import { mockRelays, recommendedRelays } from '../../../data/mock';

interface SettingsScreenProps {
  currentUser: MockUser | null;
  onLogout: () => void;
  onNavigate: (screen: DamusScreen) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentUser,
  onLogout,
  onNavigate,
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [showImages, setShowImages] = useState(true);
  const [autoPlayGIFs, setAutoPlayGIFs] = useState(false);
  const [expandThreads, setExpandThreads] = useState(true);
  const [activeSection, setActiveSection] = useState<'general' | 'relays' | 'account'>('general');

  const handleCopyKey = (key: string, type: string) => {
    navigator.clipboard.writeText(key);
    alert(`${type} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24" data-tour="damus-settings">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-semibold text-gray-900">Settings</span>
          <div className="w-10" />
        </div>
      </div>

      {/* Section Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex px-4">
          {(['general', 'relays', 'account'] as const).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`py-3 px-4 text-sm font-medium capitalize transition-colors relative ${
                activeSection === section
                  ? 'text-purple-600'
                  : 'text-gray-500'
              }`}
            >
              {section}
              {activeSection === section && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeSection === 'general' && (
          <div className="space-y-6">
            {/* Appearance */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
                Appearance
              </h3>
              <div className="damus-list !mx-0">
                <div className="damus-list-item !px-4">
                  <div className="damus-list-item-icon !bg-gray-100">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <div className="damus-list-item-content">
                    <div className="damus-list-item-title">Dark Mode</div>
                  </div>
                  <div
                    className={`damus-toggle ${darkMode ? 'active' : ''}`}
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    <div className="damus-toggle-thumb" />
                  </div>
                </div>

                <div className="damus-list-item !px-4">
                  <div className="damus-list-item-icon !bg-gray-100">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="damus-list-item-content">
                    <div className="damus-list-item-title">Show Images</div>
                  </div>
                  <div
                    className={`damus-toggle ${showImages ? 'active' : ''}`}
                    onClick={() => setShowImages(!showImages)}
                  >
                    <div className="damus-toggle-thumb" />
                  </div>
                </div>

                <div className="damus-list-item !px-4">
                  <div className="damus-list-item-icon !bg-gray-100">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="damus-list-item-content">
                    <div className="damus-list-item-title">Auto-play GIFs</div>
                  </div>
                  <div
                    className={`damus-toggle ${autoPlayGIFs ? 'active' : ''}`}
                    onClick={() => setAutoPlayGIFs(!autoPlayGIFs)}
                  >
                    <div className="damus-toggle-thumb" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
                Content
              </h3>
              <div className="damus-list !mx-0">
                <div className="damus-list-item !px-4">
                  <div className="damus-list-item-icon !bg-gray-100">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div className="damus-list-item-content">
                    <div className="damus-list-item-title">Expand Threads</div>
                  </div>
                  <div
                    className={`damus-toggle ${expandThreads ? 'active' : ''}`}
                    onClick={() => setExpandThreads(!expandThreads)}
                  >
                    <div className="damus-toggle-thumb" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'relays' && (
          <div className="space-y-6" data-tour="damus-relays">
            {/* Connected Relays */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
                Connected Relays
              </h3>
              <div className="damus-list !mx-0">
                {mockRelays.slice(0, 5).map((relay) => (
                  <div key={relay.id} className="damus-list-item !px-4">
                    <div className={`w-2 h-2 rounded-full mr-3 ${relay.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div className="damus-list-item-content">
                      <div className="damus-list-item-title truncate">{relay.url}</div>
                      <div className="damus-list-item-subtitle">
                        {relay.isOnline ? `${relay.latency}ms • ${relay.userCount} users` : 'Offline'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Relays */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
                Recommended
              </h3>
              <div className="damus-list !mx-0">
                {recommendedRelays.slice(0, 3).map((relay) => (
                  <div key={relay.id} className="damus-list-item !px-4">
                    <div className="damus-list-item-content">
                      <div className="damus-list-item-title">{relay.name}</div>
                      <div className="damus-list-item-subtitle truncate">{relay.url}</div>
                    </div>
                    <button className="text-sm text-purple-600 font-medium px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100">
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => console.log('[Damus] Add custom relay')}
              className="damus-btn damus-btn-outline w-full"
            >
              + Add Custom Relay
            </button>
          </div>
        )}

        {activeSection === 'account' && (
          <div className="space-y-6">
            {/* Keys */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
                Keys
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Public Key (npub)
                  </label>
                  <div className="damus-key-display text-xs">
                    {currentUser?.pubkey || 'npub1...'}
                    <button
                      onClick={() => handleCopyKey(currentUser?.pubkey || '', 'Public key')}
                      className="copy-btn"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Private Key (nsec) - Keep Secret!
                  </label>
                  <div className="damus-key-display text-xs bg-red-50 border-red-200">
                    ••••••••••••••••••••••••••••••••
                    <button
                      onClick={() => console.log('[Damus] Show private key')}
                      className="copy-btn"
                    >
                      Show
                    </button>
                  </div>
                  <p className="text-xs text-red-500 mt-2">
                    ⚠️ Never share your private key with anyone!
                  </p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div>
              <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-3 px-1">
                Danger Zone
              </h3>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to log out?')) {
                    onLogout();
                  }
                }}
                className="damus-btn w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsScreen;
