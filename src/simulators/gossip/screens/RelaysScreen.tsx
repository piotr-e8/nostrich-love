import React, { useState } from 'react';

interface Relay {
  id: string;
  url: string;
  status: 'connected' | 'connecting' | 'error';
  read: boolean;
  write: boolean;
  latency: number;
}

const initialRelays: Relay[] = [
  { id: '1', url: 'wss://relay.damus.io', status: 'connected', read: true, write: true, latency: 45 },
  { id: '2', url: 'wss://relay.nostr.band', status: 'connected', read: true, write: true, latency: 62 },
  { id: '3', url: 'wss://nos.lol', status: 'connected', read: true, write: false, latency: 38 },
  { id: '4', url: 'wss://relay.snort.social', status: 'connecting', read: true, write: true, latency: 0 },
];

export const RelaysScreen: React.FC = () => {
  const [relays, setRelays] = useState<Relay[]>(initialRelays);
  const [newRelayUrl, setNewRelayUrl] = useState('');

  const toggleRead = (id: string) => {
    setRelays(relays.map(r => r.id === id ? { ...r, read: !r.read } : r));
  };

  const toggleWrite = (id: string) => {
    setRelays(relays.map(r => r.id === id ? { ...r, write: !r.write } : r));
  };

  const removeRelay = (id: string) => {
    setRelays(relays.filter(r => r.id !== id));
  };

  const addRelay = () => {
    if (newRelayUrl.trim()) {
      const newRelay: Relay = {
        id: Date.now().toString(),
        url: newRelayUrl.trim(),
        status: 'connecting',
        read: true,
        write: true,
        latency: 0,
      };
      setRelays([...relays, newRelay]);
      setNewRelayUrl('');
    }
  };

  return (
    <div className="gossip-relays">
      <div className="gossip-header">
        <h2 className="gossip-header-title">Relays</h2>
        <div className="gossip-header-actions">
          <button className="gossip-header-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Refresh All
          </button>
        </div>
      </div>

      <div className="gossip-content">
        <div className="gossip-relays-list">
          <div className="gossip-settings-item" style={{ marginBottom: '20px' }}>
            <div style={{ flex: 1, marginRight: '12px' }}>
              <input
                type="text"
                className="gossip-compose-textarea"
                style={{ minHeight: '44px', padding: '10px 14px' }}
                placeholder="wss://relay.example.com"
                value={newRelayUrl}
                onChange={(e) => setNewRelayUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addRelay()}
              />
            </div>
            <button className="gossip-btn gossip-btn-primary" onClick={addRelay}>
              Add Relay
            </button>
          </div>

          {relays.map((relay) => (
            <div key={relay.id} className="gossip-relay-item">
              <div className={`gossip-relay-status ${relay.status}`} />
              <div className="gossip-relay-info">
                <div className="gossip-relay-url">{relay.url}</div>
                <div className="gossip-relay-meta">
                  {relay.status === 'connected' && `${relay.latency}ms • `}
                  {relay.read && 'Read '}{relay.read && relay.write && '• '}{relay.write && 'Write'}
                </div>
              </div>
              <div className="gossip-relay-actions">
                <button
                  className={`gossip-relay-btn ${!relay.read ? 'opacity-50' : ''}`}
                  onClick={() => toggleRead(relay.id)}
                >
                  {relay.read ? 'Read' : 'No Read'}
                </button>
                <button
                  className={`gossip-relay-btn ${!relay.write ? 'opacity-50' : ''}`}
                  onClick={() => toggleWrite(relay.id)}
                >
                  {relay.write ? 'Write' : 'No Write'}
                </button>
                <button
                  className="gossip-relay-btn danger"
                  onClick={() => removeRelay(relay.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelaysScreen;
