import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Globe, 
  Shield, 
  Key, 
  Server, 
  Bell, 
  Lock,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  Palette
} from 'lucide-react';

interface SettingsScreenProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  onBack: () => void;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

interface SettingItem {
  id: string;
  icon: React.ElementType;
  label: string;
  description?: string;
  type: 'toggle' | 'link' | 'action';
  value?: boolean;
  onClick?: () => void;
}

export function SettingsScreen({ theme, onThemeChange, onBack }: SettingsScreenProps) {
  const [notifications, setNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showKeys, setShowKeys] = useState(false);

  const settingsSections: SettingSection[] = [
    {
      title: 'Appearance',
      items: [
        {
          id: 'theme',
          icon: theme === 'dark' ? Moon : Sun,
          label: theme === 'dark' ? 'Dark Mode' : 'Light Mode',
          description: 'Toggle between light and dark theme',
          type: 'toggle',
          value: theme === 'dark',
          onClick: () => onThemeChange(theme === 'dark' ? 'light' : 'dark'),
        },
        {
          id: 'accent',
          icon: Palette,
          label: 'Accent Color',
          description: 'Bitcoin Orange (Default)',
          type: 'link',
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'notifications',
          icon: Bell,
          label: 'Push Notifications',
          description: 'Get notified about zaps and mentions',
          type: 'toggle',
          value: notifications,
          onClick: () => setNotifications(!notifications),
        },
        {
          id: 'zaps',
          icon: Key,
          label: 'Zap Notifications',
          description: 'Notify when someone zaps you',
          type: 'toggle',
          value: true,
        },
      ],
    },
    {
      title: 'Content',
      items: [
        {
          id: 'autoplay',
          icon: Globe,
          label: 'Auto-play Videos',
          description: 'Play videos automatically in feed',
          type: 'toggle',
          value: autoPlay,
          onClick: () => setAutoPlay(!autoPlay),
        },
      ],
    },
    {
      title: 'Security & Privacy',
      items: [
        {
          id: 'keys',
          icon: Lock,
          label: 'Private Keys',
          description: 'View and backup your keys',
          type: 'link',
          onClick: () => setShowKeys(true),
        },
        {
          id: 'relays',
          icon: Server,
          label: 'Relay Connections',
          description: 'Manage connected relays',
          type: 'link',
        },
        {
          id: 'privacy',
          icon: Shield,
          label: 'Privacy Settings',
          description: 'Control your data and visibility',
          type: 'link',
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          id: 'terms',
          icon: FileText,
          label: 'Terms of Service',
          type: 'link',
        },
        {
          id: 'help',
          icon: HelpCircle,
          label: 'Help & Support',
          type: 'link',
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[var(--yh-background)]" data-tour="yakihonne-unique">
      {/* Header */}
      <div className="yakihonne-header">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[var(--yh-text-primary)]" />
        </button>
        <span className="yakihonne-header-title">Settings</span>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      <div className="flex-1 overflow-y-auto">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="mb-6"
          >
            <h3 className="px-4 py-2 text-xs font-semibold text-[var(--yh-text-tertiary)] uppercase tracking-wide">
              {section.title}
            </h3>
            
            <div className="bg-[var(--yh-surface)]">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`yakihonne-setting-item ${
                      itemIndex < section.items.length - 1 ? 'border-b border-[var(--yh-border-light)]' : ''
                    }`}
                  >
                    <div className="yakihonne-setting-label">
                      <div className="yakihonne-setting-icon">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="yakihonne-setting-text">{item.label}</div>
                        {item.description && (
                          <div className="text-sm text-[var(--yh-text-tertiary)]">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {item.type === 'toggle' && (
                      <button
                        onClick={item.onClick}
                        className={`w-12 h-7 rounded-full transition-colors relative ${
                          item.value ? 'bg-[var(--yh-primary)]' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${
                            item.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}
                    
                    {item.type === 'link' && (
                      <ChevronRight className="w-5 h-5 text-[var(--yh-text-tertiary)]" />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="px-4 pb-8"
        >
          <button className="w-full yakihonne-btn yakihonne-btn-outline text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600">
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </motion.div>
      </div>

      {/* Keys Modal */}
      {showKeys && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowKeys(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[var(--yh-surface)] rounded-2xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--yh-text-primary)]">Your Keys</h3>
                <p className="text-sm text-[var(--yh-text-tertiary)]">Keep these safe!</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--yh-text-secondary)] uppercase mb-1">
                  Public Key (npub)
                </label>
                <div className="flex items-center gap-2 p-3 bg-[var(--yh-surface-variant)] rounded-lg">
                  <code className="flex-1 text-xs text-[var(--yh-text-primary)] truncate font-mono">
                    npub1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                  </code>
                  <button className="p-1.5 text-[var(--yh-primary)] hover:bg-[var(--yh-surface)] rounded transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[var(--yh-text-secondary)] uppercase mb-1">
                  Private Key (nsec)
                </label>
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <code className="flex-1 text-xs text-red-600 dark:text-red-400 truncate font-mono">
                    nsec1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                  </code>
                  <button className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-red-500 mt-1">
                  Never share your private key with anyone!
                </p>
              </div>
            </div>

            <button 
              onClick={() => setShowKeys(false)}
              className="w-full yakihonne-btn yakihonne-btn-primary mt-6"
            >
              I Understand
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default SettingsScreen;
