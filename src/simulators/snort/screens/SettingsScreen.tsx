/**
 * Snort Settings Screen
 * Preferences, keys, and appearance settings
 */

import React, { useState } from 'react';
import type { MockUser } from '../../../data/mock';

interface SettingsScreenProps {
  currentUser: MockUser | null;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentUser,
  theme,
  onToggleTheme,
  onBack,
}) => {
  const [activeSection, setActiveSection] = useState<'general' | 'keys' | 'privacy' | 'about'>('general');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [settings, setSettings] = useState({
    autoRefresh: true,
    mediaPreviews: true,
    threadView: true,
    codeHighlighting: true,
    notifications: true,
    soundEffects: false,
    compactMode: false,
    showNipBadges: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyKey = (key: string, type: string) => {
    navigator.clipboard.writeText(key);
    console.log(`[Snort] Copied ${type} to clipboard`);
  };

  const sections = [
    { id: 'general', label: 'General', icon: CogIcon },
    { id: 'keys', label: 'Keys', icon: KeyIcon },
    { id: 'privacy', label: 'Privacy', icon: ShieldIcon },
    { id: 'about', label: 'About', icon: InfoIcon },
  ] as const;

  return (
    <div className="flex flex-col h-full" data-tour="snort-settings">
      {/* Header */}
      <div className="snort-header">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="snort-btn snort-btn-ghost snort-btn-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="snort-header-title">Settings</h1>
        </div>
      </div>

      {/* Settings Navigation */}
      <div className="flex border-b border-slate-700">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'text-teal-400 border-b-2 border-teal-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Settings Content */}
      <div className="snort-content flex-1">
        {/* General Settings */}
        {activeSection === 'general' && (
          <div className="space-y-4">
            <div className="snort-settings-group">
              <div className="snort-settings-header">Appearance</div>
              <div className="snort-setting">
                <div className="snort-setting-info">
                  <div className="snort-setting-label">Dark Mode</div>
                  <div className="snort-setting-desc">Use dark color scheme</div>
                </div>
                <button
                  onClick={onToggleTheme}
                  className={`snort-toggle ${theme === 'dark' ? 'active' : ''}`}
                >
                  <div className="snort-toggle-thumb" />
                </button>
              </div>
              <div className="snort-setting">
                <div className="snort-setting-info">
                  <div className="snort-setting-label">Compact Mode</div>
                  <div className="snort-setting-desc">Reduce spacing between elements</div>
                </div>
                <button
                  onClick={() => toggleSetting('compactMode')}
                  className={`snort-toggle ${settings.compactMode ? 'active' : ''}`}
                >
                  <div className="snort-toggle-thumb" />
                </button>
              </div>
            </div>

            <div className="snort-settings-group">
              <div className="snort-settings-header">Content</div>
              <div className="snort-setting">
                <div className="snort-setting-info">
                  <div className="snort-setting-label">Auto Refresh</div>
                  <div className="snort-setting-desc">Automatically refresh timeline</div>
                </div>
                <button
                  onClick={() => toggleSetting('autoRefresh')}
                  className={`snort-toggle ${settings.autoRefresh ? 'active' : ''}`}
                >
                  <div className="snort-toggle-thumb" />
                </button>
              </div>
              <div className="snort-setting">
                <div className="snort-setting-info">
                  <div className="snort-setting-label">Media Previews</div>
                  <div className="snort-setting-desc">Show preview of linked media</div>
                </div>
                <button
                  onClick={() => toggleSetting('mediaPreviews')}
                  className={`snort-toggle ${settings.mediaPreviews ? 'active' : ''}`}
                >
                  <div className="snort-toggle-thumb" />
                </button>
              </div>
              <div className="snort-setting">
                <div className="snort-setting-info">
                  <div className="snort-setting-label">Thread View</div>
                  <div className="snort-setting-desc">Show threaded conversation view</div>
                </div>
                <button
                  onClick={() => toggleSetting('threadView')}
                  className={`snort-toggle ${settings.threadView ? 'active' : ''}`}
                >
                  <div className="snort-toggle-thumb" />
                </button>
              </div>
              <div className="snort-setting">
                <div className="snort-setting-info">
                  <div className="snort-setting-label">Code Highlighting</div>
                  <div className="snort-setting-desc">Syntax highlighting for code blocks</div>
                </div>
                <button
                  onClick={() => toggleSetting('codeHighlighting')}
                  className={`snort-toggle ${settings.codeHighlighting ? 'active' : ''}`}
                >
                  <div className="snort-toggle-thumb" />
                </button>
              </div>
            </div>

            <div className="snort-settings-group">
              <div className="snort-settings-header">Notifications</div>
              <div className="snort-setting">
                <div className="snort-setting-info">
                  <div className="snort-setting-label">Enable Notifications</div>
                  <div className="snort-setting-desc">Receive browser notifications</div>
                </div>
                <button
                  onClick={() => toggleSetting('notifications')}
                  className={`snort-toggle ${settings.notifications ? 'active' : ''}`}
                >
                  <div className="snort-toggle-thumb" />
                </button>
              </div>
              <div className="snort-setting">
                <div className="snort-setting-info">
                  <div className="snort-setting-label">Sound Effects</div>
                  <div className="snort-setting-desc">Play sounds for actions</div>
                </div>
                <button
                  onClick={() => toggleSetting('soundEffects')}
                  className={`snort-toggle ${settings.soundEffects ? 'active' : ''}`}
                >
                  <div className="snort-toggle-thumb" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Keys Settings */}
        {activeSection === 'keys' && currentUser && (
          <div className="space-y-4">
            <div className="snort-settings-group">
              <div className="snort-settings-header">Public Key</div>
              <div className="p-4">
                <p className="text-sm text-slate-400 mb-2">Your public key (npub) can be shared with others.</p>
                <div className="flex gap-2">
                  <code className="flex-1 p-3 bg-gray-100 dark:bg-slate-900 rounded-lg text-sm text-teal-600 dark:text-teal-400 break-all font-mono">
                    {currentUser.pubkey}
                  </code>
                  <button
                    onClick={() => handleCopyKey(currentUser.pubkey, 'public key')}
                    className="snort-btn snort-btn-secondary snort-btn-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="snort-settings-group">
              <div className="snort-settings-header flex justify-between items-center">
                <span>Private Key</span>
                <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">KEEP SECRET</span>
              </div>
              <div className="p-4">
                <p className="text-sm text-red-400 mb-2">
                  Warning: Never share your private key with anyone!
                </p>
                <div className="flex gap-2">
                  <code className="flex-1 p-3 bg-gray-100 dark:bg-slate-900 rounded-lg text-sm text-gray-600 dark:text-slate-500 break-all font-mono">
                    {showPrivateKey ? 'nsec1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' : '••••••••••••••••••••••••••••••••••••••••••••••••••'}
                  </code>
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="snort-btn snort-btn-secondary snort-btn-sm"
                  >
                    {showPrivateKey ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleCopyKey('nsec1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'private key')}
                    className="snort-btn snort-btn-secondary snort-btn-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="snort-settings-group">
              <div className="snort-settings-header">Advanced</div>
              <div className="p-4 space-y-3">
                <button className="w-full snort-btn snort-btn-secondary justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Change Password
                </button>
                <button className="w-full snort-btn snort-btn-secondary justify-start">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Export Data
                </button>
                <button className="w-full snort-btn snort-btn-secondary justify-start text-red-400 hover:text-red-300">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Settings */}
        {activeSection === 'privacy' && (
          <div className="space-y-4">
            <div className="snort-settings-group">
              <div className="snort-settings-header">Privacy</div>
              <div className="snort-setting">
                <div className="snort-setting-info">
                  <div className="snort-setting-label">Show NIP Badges</div>
                  <div className="snort-setting-desc">Display NIP support indicators</div>
                </div>
                <button
                  onClick={() => toggleSetting('showNipBadges')}
                  className={`snort-toggle ${settings.showNipBadges ? 'active' : ''}`}
                >
                  <div className="snort-toggle-thumb" />
                </button>
              </div>
            </div>

            <div className="snort-settings-group">
              <div className="snort-settings-header">Blocked Content</div>
              <div className="p-4 space-y-2">
                <button className="w-full snort-btn snort-btn-secondary justify-between">
                  <span>Muted Users</span>
                  <span className="text-slate-500">0</span>
                </button>
                <button className="w-full snort-btn snort-btn-secondary justify-between">
                  <span>Muted Words</span>
                  <span className="text-slate-500">0</span>
                </button>
                <button className="w-full snort-btn snort-btn-secondary justify-between">
                  <span>Blocked Relays</span>
                  <span className="text-slate-500">0</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* About Settings */}
        {activeSection === 'about' && (
          <div className="space-y-4">
            <div className="snort-settings-group">
              <div className="snort-settings-header">About Snort</div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center">
                    <svg className="w-7 h-7 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Snort</h3>
                    <p className="text-sm text-slate-400">Version 1.0.0 (Simulator)</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400">
                  Snort is a developer-friendly web Nostr client with advanced features like thread visualization, code highlighting, and keyboard shortcuts.
                </p>
              </div>
            </div>

            <div className="snort-settings-group">
              <div className="snort-settings-header">Links</div>
              <div className="p-4 space-y-2">
                <a href="https://snort.social" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-teal-400 hover:underline">
                  <span>Official Website</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <a href="https://github.com/v0l/snort" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-teal-400 hover:underline">
                  <span>GitHub Repository</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="snort-settings-group">
              <div className="snort-settings-header">Simulator Info</div>
              <div className="p-4 space-y-2 text-sm text-slate-400">
                <p>This is a simulated version of Snort for educational purposes.</p>
                <p>All data shown is mock data and not connected to real Nostr relays.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Icons
function CogIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default SettingsScreen;
