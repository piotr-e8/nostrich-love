import React, { useState } from 'react';
import type { MockUser } from '../../../data/mock';
import type { CoracleScreen } from '../CoracleSimulator';

interface SettingsScreenProps {
  currentUser: MockUser | null;
  onLogout: () => void;
  onNavigate: (screen: CoracleScreen) => void;
  onStartTour: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentUser,
  onLogout,
  onNavigate,
  onStartTour,
}) => {
  const [activeSection, setActiveSection] = useState<'general' | 'privacy' | 'appearance' | 'advanced'>('general');
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    autoPlayVideos: true,
    showNotifications: true,
    compactMode: false,
    darkMode: false,
    defaultZapAmount: 100,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLogoutClick = () => {
    if (confirm('Are you sure you want to log out?')) {
      onLogout();
    }
  };

  return (
    <div className="coracle-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Customize your Coracle experience
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setActiveSection('general')}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  activeSection === 'general' 
                    ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                General
              </button>
              <button
                onClick={() => setActiveSection('privacy')}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  activeSection === 'privacy' 
                    ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Privacy
              </button>
              <button
                onClick={() => setActiveSection('appearance')}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  activeSection === 'appearance' 
                    ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Appearance
              </button>
              <button
                onClick={() => setActiveSection('advanced')}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  activeSection === 'advanced' 
                    ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Advanced
              </button>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <button
                onClick={onStartTour}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2 mb-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Restart Guided Tour
              </button>
              <button
                onClick={() => onNavigate('profile')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeSection === 'general' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">General Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Notifications</h3>
                      <p className="text-sm text-gray-500">Show notification badges and alerts</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('showNotifications', !settings.showNotifications)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.showNotifications ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.showNotifications ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Auto-play Videos</h3>
                      <p className="text-sm text-gray-500">Automatically play videos in feed</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('autoPlayVideos', !settings.autoPlayVideos)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.autoPlayVideos ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.autoPlayVideos ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Compact Mode</h3>
                      <p className="text-sm text-gray-500">Show more content with less spacing</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('compactMode', !settings.compactMode)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.compactMode ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.compactMode ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="font-medium text-gray-900 mb-3">Default Zap Amount</h3>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="10000"
                        value={settings.defaultZapAmount}
                        onChange={(e) => handleSettingChange('defaultZapAmount', parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-lg font-semibold text-indigo-600 min-w-[80px]">
                        {settings.defaultZapAmount} sats
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Privacy Settings</h2>
                
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-900 mb-1">Privacy on Nostr</h3>
                    <p className="text-sm text-yellow-800">
                      Nostr is a public protocol. All your posts are visible to anyone. 
                      Use direct messages for private communication.
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Show Online Status</h3>
                      <p className="text-sm text-gray-500">Let others see when you're active</p>
                    </div>
                    <button
                      onClick={() => {}}
                      className="relative w-12 h-6 rounded-full bg-indigo-600"
                    >
                      <span className="absolute top-1 w-4 h-4 bg-white rounded-full translate-x-7" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Allow Mentions</h3>
                      <p className="text-sm text-gray-500">Others can mention you in posts</p>
                    </div>
                    <button
                      onClick={() => {}}
                      className="relative w-12 h-6 rounded-full bg-indigo-600"
                    >
                      <span className="absolute top-1 w-4 h-4 bg-white rounded-full translate-x-7" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Appearance Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Dark Mode</h3>
                      <p className="text-sm text-gray-500">Use dark color scheme</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.darkMode ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.darkMode ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">High Contrast</h3>
                      <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('highContrast', !settings.highContrast)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.highContrast ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.highContrast ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Large Text</h3>
                      <p className="text-sm text-gray-500">Increase text size throughout the app</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('largeText', !settings.largeText)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.largeText ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.largeText ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Reduce Motion</h3>
                      <p className="text-sm text-gray-500">Minimize animations</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('reduceMotion', !settings.reduceMotion)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.reduceMotion ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.reduceMotion ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'advanced' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Advanced Settings</h2>
                
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-medium text-red-900 mb-1">Danger Zone</h3>
                    <p className="text-sm text-red-800">
                      These actions cannot be undone. Please be careful.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Export Account Data</h3>
                        <p className="text-sm text-gray-500">Download all your data as JSON</p>
                      </div>
                      <button className="coracle-btn-secondary">
                        Export
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Clear Cache</h3>
                        <p className="text-sm text-gray-500">Remove cached images and data</p>
                      </div>
                      <button className="coracle-btn-secondary">
                        Clear
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <h3 className="font-medium text-red-900">Log Out</h3>
                        <p className="text-sm text-red-700">Sign out of your account</p>
                      </div>
                      <button 
                        onClick={handleLogoutClick}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="font-medium text-gray-900 mb-4">Account Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Public Key</span>
                        <code className="text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                          {currentUser?.pubkey.slice(0, 20)}...
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Client</span>
                        <span className="text-gray-700">Coracle Simulator</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Version</span>
                        <span className="text-gray-700">1.0.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
