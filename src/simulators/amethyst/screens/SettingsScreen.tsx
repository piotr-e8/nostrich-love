import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Monitor,
  Bell,
  Shield,
  Database,
  Zap,
  Globe,
  Key,
  FileText,
  HelpCircle,
  ChevronRight,
  LogOut,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';
import { mockRelays, recommendedRelays } from '../../../data/mock';
import '../amethyst.theme.css';

interface SettingsScreenProps {
  onBack?: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [expandedSection, setExpandedSection] = useState<string | null>('relays');
  const [notifications, setNotifications] = useState({
    likes: true,
    mentions: true,
    zaps: true,
    follows: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--md-background)]">
      {/* App Bar */}
      <div className="md-app-bar sticky top-0 z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="p-2 rounded-full hover:bg-[var(--md-surface-variant)]"
        >
          <ArrowLeft className="w-6 h-6 text-[var(--md-on-surface)]" />
        </motion.button>
        <h1 className="flex-1 text-xl font-semibold text-[var(--md-on-surface)] ml-2">
          Settings
        </h1>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto">
        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsItem
            icon={<Key className="w-5 h-5" />}
            title="Keys & Backup"
            subtitle="Manage your private keys"
            onClick={() => {}}
          />
          <SettingsItem
            icon={<Shield className="w-5 h-5" />}
            title="Privacy"
            subtitle="Control your privacy settings"
            onClick={() => {}}
          />
          <SettingsItem
            icon={<FileText className="w-5 h-5" />}
            title="NIP-05 Identifier"
            subtitle="you@nostr.local"
            onClick={() => {}}
          />
        </SettingsSection>

        {/* Appearance Section */}
        <SettingsSection title="Appearance">
          <div className="px-4 py-3">
            <p className="text-sm text-[var(--md-on-surface-variant)] mb-3">Theme</p>
            <div className="flex gap-2">
              <ThemeButton
                icon={<Sun className="w-5 h-5" />}
                label="Light"
                isActive={theme === 'light'}
                onClick={() => setTheme('light')}
              />
              <ThemeButton
                icon={<Moon className="w-5 h-5" />}
                label="Dark"
                isActive={theme === 'dark'}
                onClick={() => setTheme('dark')}
              />
              <ThemeButton
                icon={<Monitor className="w-5 h-5" />}
                label="Auto"
                isActive={theme === 'auto'}
                onClick={() => setTheme('auto')}
              />
            </div>
          </div>
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title="Notifications">
          <ToggleItem
            icon={<Bell className="w-5 h-5" />}
            title="Likes"
            isOn={notifications.likes}
            onToggle={() => setNotifications(prev => ({ ...prev, likes: !prev.likes }))}
          />
          <ToggleItem
            icon={<Zap className="w-5 h-5" />}
            title="Zaps"
            isOn={notifications.zaps}
            onToggle={() => setNotifications(prev => ({ ...prev, zaps: !prev.zaps }))}
          />
          <ToggleItem
            icon={<Globe className="w-5 h-5" />}
            title="Mentions"
            isOn={notifications.mentions}
            onToggle={() => setNotifications(prev => ({ ...prev, mentions: !prev.mentions }))}
          />
        </SettingsSection>

        {/* Relays Section */}
        <div className="mt-6">
          <button
            onClick={() => toggleSection('relays')}
            className="w-full px-4 py-3 flex items-center justify-between bg-[var(--md-surface-variant)]/30"
          >
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-[var(--md-on-surface)]" />
              <span className="font-medium text-[var(--md-on-surface)]">Relays</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--md-on-surface-variant)]">
                {recommendedRelays.length} connected
              </span>
              {expandedSection === 'relays' ? (
                <ChevronUp className="w-5 h-5 text-[var(--md-on-surface-variant)]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[var(--md-on-surface-variant)]" />
              )}
            </div>
          </button>
          
          <AnimatePresence>
            {expandedSection === 'relays' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  {recommendedRelays.slice(0, 4).map((relay, index) => (
                    <div
                      key={relay.id}
                      className="flex items-center justify-between p-3 bg-[var(--md-surface)] rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${relay.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="font-medium text-[var(--md-on-surface)] text-sm">{relay.name}</p>
                          <p className="text-xs text-[var(--md-on-surface-variant)]">{relay.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--md-on-surface-variant)]">
                          {relay.latency}ms
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="p-1.5 rounded-full bg-[var(--md-surface-variant)] text-[var(--md-on-surface-variant)]"
                        >
                          <Check className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </div>
                  ))}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 text-[var(--md-primary)] font-medium text-sm hover:bg-[var(--md-surface-variant)] rounded-xl transition-colors"
                  >
                    + Add Relay
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Support Section */}
        <SettingsSection title="Support">
          <SettingsItem
            icon={<HelpCircle className="w-5 h-5" />}
            title="Help & Support"
            onClick={() => {}}
          />
          <SettingsItem
            icon={<FileText className="w-5 h-5" />}
            title="Terms of Service"
            onClick={() => {}}
          />
        </SettingsSection>

        {/* Danger Zone */}
        <div className="mt-6 px-4 pb-8 space-y-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 text-red-600"
          >
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">Delete Account</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="px-4 text-xs font-medium text-[var(--md-on-surface-variant)] uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="bg-[var(--md-surface)] rounded-2xl mx-4 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function SettingsItem({ 
  icon, 
  title, 
  subtitle, 
  onClick 
}: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle?: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 hover:bg-[var(--md-surface-variant)] transition-colors"
    >
      <span className="text-[var(--md-on-surface-variant)]">{icon}</span>
      <div className="flex-1 text-left">
        <p className="font-medium text-[var(--md-on-surface)]">{title}</p>
        {subtitle && (
          <p className="text-sm text-[var(--md-on-surface-variant)]">{subtitle}</p>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-[var(--md-on-surface-variant)]" />
    </motion.button>
  );
}

function ToggleItem({ 
  icon, 
  title, 
  isOn, 
  onToggle 
}: { 
  icon: React.ReactNode; 
  title: string; 
  isOn: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-[var(--md-surface-variant)] transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-[var(--md-on-surface-variant)]">{icon}</span>
        <span className="font-medium text-[var(--md-on-surface)]">{title}</span>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`md-switch ${isOn ? 'checked' : ''}`}
      >
        <div className="md-switch-thumb" />
      </motion.button>
    </div>
  );
}

function ThemeButton({ 
  icon, 
  label, 
  isActive, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
        isActive 
          ? 'bg-[var(--md-secondary-container)] text-[var(--md-on-secondary-container)]' 
          : 'bg-[var(--md-surface-variant)] text-[var(--md-on-surface-variant)]'
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </motion.button>
  );
}
