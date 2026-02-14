import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SettingsItem {
  icon: string;
  label: string;
  type: 'toggle' | 'link';
  value?: boolean | string;
  onChange?: (value: boolean) => void;
}

interface SettingsGroup {
  title: string;
  items: SettingsItem[];
}

export function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [encryption, setEncryption] = useState(true);

  const settingsGroups: SettingsGroup[] = [
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: '🔐',
          label: 'End-to-End Encryption',
          value: encryption,
          onChange: setEncryption,
          type: 'toggle',
        },
        {
          icon: '🔑',
          label: 'Backup Keys',
          type: 'link',
        },
        {
          icon: '🛡️',
          label: 'Privacy Settings',
          type: 'link',
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: '🔔',
          label: 'Push Notifications',
          value: notifications,
          onChange: setNotifications,
          type: 'toggle',
        },
        {
          icon: '💬',
          label: 'Message Preview',
          type: 'link',
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          icon: '🌙',
          label: 'Dark Mode',
          value: darkMode,
          onChange: setDarkMode,
          type: 'toggle',
        },
        {
          icon: '🎨',
          label: 'Theme Color',
          type: 'link',
        },
      ],
    },
    {
      title: 'Wallet',
      items: [
        {
          icon: '⚡',
          label: 'Default Mint',
          value: 'mint.keychat.io',
          type: 'link',
        },
        {
          icon: '📊',
          label: 'Transaction History',
          type: 'link',
        },
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950" data-tour="keychat-settings">
      {/* Header */}
      <div className="bg-[#2D7FF9] text-white px-4 pt-12 pb-4">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      {/* Profile Card */}
      <div className="px-4 -mt-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 flex items-center gap-4"
        >
          <img
            src="https://api.dicebear.com/7.x/bottts/svg?seed=keychat"
            alt="Profile"
            className="w-16 h-16 rounded-full bg-gray-200"
          />
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 dark:text-white">Anonymous User</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">npub1...8x2k</p>
            <div className="flex items-center gap-1 text-xs text-[#2D7FF9] mt-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Verified via NIP-05</span>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Settings Groups */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            className="mb-6"
          >
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
              {group.title}
            </h3>
            <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
              {group.items.map((item, itemIndex) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 p-4 ${
                    itemIndex !== group.items.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="flex-1 font-medium text-gray-900 dark:text-white">{item.label}</span>
                  
                  {item.type === 'toggle' && typeof item.value === 'boolean' && item.onChange ? (
                    <button
                      onClick={() => item.onChange && item.onChange(!item.value)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        item.value ? 'bg-[#2D7FF9]' : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          item.value ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      {item.value && typeof item.value === 'string' && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">{item.value}</span>
                      )}
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <button className="w-full py-3 border-2 border-red-500 text-red-500 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            Log Out
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Keychat v2.1.0 • AGPL-3.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}
