import React, { useState } from 'react';

interface Setting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const initialSettings: Setting[] = [
  { id: '1', label: 'Show media previews', description: 'Display images and videos inline', enabled: true },
  { id: '2', label: 'Auto-load new notes', description: 'Automatically fetch new notes', enabled: true },
  { id: '3', label: 'Compact mode', description: 'Show more notes with less spacing', enabled: false },
  { id: '4', label: 'Hide reply counts', description: 'Don\'t show reply counts on notes', enabled: false },
  { id: '5', label: 'Anonymous zaps', description: 'Send zaps without revealing identity', enabled: false },
];

export const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>(initialSettings);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <div className="gossip-settings-screen">
      <div className="gossip-header">
        <h2 className="gossip-header-title">Settings</h2>
      </div>

      <div className="gossip-content">
        <div className="gossip-settings">
          <div className="gossip-settings-section">
            <h3 className="gossip-settings-title">General</h3>
            {settings.map((setting) => (
              <div key={setting.id} className="gossip-settings-item">
                <div>
                  <div className="gossip-settings-label">{setting.label}</div>
                  <div className="gossip-settings-description">{setting.description}</div>
                </div>
                <div
                  className={`gossip-toggle ${setting.enabled ? 'active' : ''}`}
                  onClick={() => toggleSetting(setting.id)}
                >
                  <div className="gossip-toggle-thumb" />
                </div>
              </div>
            ))}
          </div>

          <div className="gossip-settings-section">
            <h3 className="gossip-settings-title">Privacy</h3>
            <div className="gossip-settings-item">
              <div>
                <div className="gossip-settings-label">Private mode</div>
                <div className="gossip-settings-description">Hide your online status</div>
              </div>
              <div className="gossip-toggle">
                <div className="gossip-toggle-thumb" />
              </div>
            </div>
            <div className="gossip-settings-item">
              <div>
                <div className="gossip-settings-label">Tor connection</div>
                <div className="gossip-settings-description">Route all traffic through Tor</div>
              </div>
              <div className="gossip-toggle">
                <div className="gossip-toggle-thumb" />
              </div>
            </div>
          </div>

          <div className="gossip-settings-section">
            <h3 className="gossip-settings-title">Account</h3>
            <div className="gossip-settings-item">
              <div>
                <div className="gossip-settings-label">Export private key</div>
                <div className="gossip-settings-description">Backup your account</div>
              </div>
              <button className="gossip-relay-btn">Export</button>
            </div>
            <div className="gossip-settings-item">
              <div>
                <div className="gossip-settings-label">Delete account</div>
                <div className="gossip-settings-description">Remove all local data</div>
              </div>
              <button className="gossip-relay-btn danger">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
