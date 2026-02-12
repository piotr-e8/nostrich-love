import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Bell, Shield, User, Key, ExternalLink, ChevronRight } from 'lucide-react';

interface SettingsScreenProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

const settingsSections = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Account information', description: 'See your account info' },
      { icon: Key, label: 'Change your password', description: 'Update your security' },
      { icon: Shield, label: 'Privacy and safety', description: 'Manage your privacy settings' },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', description: 'Select notification types' },
    ]
  },
  {
    title: 'Relays',
    items: [
      { icon: ExternalLink, label: 'Relay browser', description: 'Browse and manage relays' },
    ]
  },
];

export function SettingsScreen({ isOpen, onClose, theme, onThemeChange }: SettingsScreenProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--primal-surface)] z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-[var(--primal-surface)]/80 backdrop-blur-md border-b border-[var(--primal-border)] p-4 flex items-center gap-4">
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-[var(--primal-hover)] rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
              <h2 className="text-xl font-bold">Settings</h2>
            </div>

            {/* Theme Toggle */}
            <div className="p-4 border-b border-[var(--primal-border-subtle)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <span className="font-medium">Theme</span>
                </div>
                <div className="flex bg-[var(--primal-surface-variant)] rounded-full p-1">
                  <button
                    onClick={() => onThemeChange?.('light')}
                    disabled={!onThemeChange}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      theme === 'light' ? 'bg-[#7C3AED] text-white' : 'text-[var(--primal-on-surface-variant)]'
                    } ${!onThemeChange ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => onThemeChange?.('dark')}
                    disabled={!onThemeChange}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      theme === 'dark' ? 'bg-[#7C3AED] text-white' : 'text-[var(--primal-on-surface-variant)]'
                    } ${!onThemeChange ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>

            {/* Settings Sections */}
            {settingsSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="py-4">
                <h3 className="px-4 text-sm font-medium text-[var(--primal-on-surface-muted)] mb-2">
                  {section.title}
                </h3>
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={itemIndex}
                      className="w-full px-4 py-3 flex items-center gap-4 hover:bg-[var(--primal-hover)] transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      <Icon className="w-5 h-5 text-[var(--primal-on-surface-variant)]" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-[var(--primal-on-surface-muted)]">
                          {item.description}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--primal-on-surface-muted)]" />
                    </motion.button>
                  );
                })}
              </div>
            ))}

            {/* Version */}
            <div className="p-4 text-center text-sm text-[var(--primal-on-surface-muted)] mt-auto">
              Primal Web v1.0.0
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SettingsScreen;
