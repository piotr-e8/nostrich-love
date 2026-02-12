/**
 * Snort Relays Screen
 * Advanced relay management
 */

import React, { useState, useEffect } from 'react';
import type { MockRelay } from '../../../data/mock';

interface RelaysScreenProps {
  onBack: () => void;
}

interface RelayState extends MockRelay {
  isConnected: boolean;
  isConnecting: boolean;
  readPolicy: boolean;
  writePolicy: boolean;
}

// Sample relay data for demo
const sampleRelays: MockRelay[] = [
  {
    id: 'wss://relay.damus.io',
    url: 'wss://relay.damus.io',
    name: 'Damus Relay',
    description: 'Main relay for Damus iOS app',
    isPaid: false,
    isOnline: true,
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40],
    latency: 45,
    userCount: 15000,
    lastSeen: Date.now(),
    restrictions: { authRequired: false, paymentRequired: false, writeRestricted: false },
    software: 'strfry',
    version: '1.0.0',
  },
  {
    id: 'wss://relay.snort.social',
    url: 'wss://relay.snort.social',
    name: 'Snort Relay',
    description: 'Official Snort web client relay',
    isPaid: false,
    isOnline: true,
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40],
    latency: 32,
    userCount: 8000,
    lastSeen: Date.now(),
    restrictions: { authRequired: false, paymentRequired: false, writeRestricted: false },
    software: 'strfry',
    version: '1.0.0',
  },
  {
    id: 'wss://nos.lol',
    url: 'wss://nos.lol',
    name: 'nos.lol',
    description: 'General purpose public relay',
    isPaid: false,
    isOnline: true,
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40],
    latency: 58,
    userCount: 12000,
    lastSeen: Date.now(),
    restrictions: { authRequired: false, paymentRequired: false, writeRestricted: false },
    software: 'strfry',
    version: '1.0.0',
  },
  {
    id: 'wss://relay.nostr.band',
    url: 'wss://relay.nostr.band',
    name: 'Nostr Band',
    description: 'High-performance relay with search',
    isPaid: false,
    isOnline: true,
    supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40, 50],
    latency: 28,
    userCount: 20000,
    lastSeen: Date.now(),
    restrictions: { authRequired: false, paymentRequired: false, writeRestricted: false },
    features: ['search', 'trending'],
    software: 'strfry',
    version: '1.0.0',
  },
];

export const RelaysScreen: React.FC<RelaysScreenProps> = ({ onBack }) => {
  const [relays, setRelays] = useState<RelayState[]>(
    sampleRelays.map(relay => ({
      ...relay,
      isConnected: relay.isOnline,
      isConnecting: false,
      readPolicy: true,
      writePolicy: !relay.restrictions?.writeRestricted,
    }))
  );
  const [newRelayUrl, setNewRelayUrl] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleConnect = (relayId: string) => {
    setRelays(prev => prev.map(relay => {
      if (relay.id === relayId) {
        if (relay.isConnected) {
          return { ...relay, isConnected: false };
        } else {
          return { ...relay, isConnecting: true };
        }
      }
      return relay;
    }));

    // Simulate connection delay
    setTimeout(() => {
      setRelays(prev => prev.map(relay => 
        relay.id === relayId 
          ? { ...relay, isConnecting: false, isConnected: true }
          : relay
      ));
    }, 1000);
  };

  const handleTogglePolicy = (relayId: string, policy: 'read' | 'write') => {
    setRelays(prev => prev.map(relay => {
      if (relay.id === relayId) {
        return {
          ...relay,
          [policy === 'read' ? 'readPolicy' : 'writePolicy']: 
            !relay[policy === 'read' ? 'readPolicy' : 'writePolicy'],
        };
      }
      return relay;
    }));
  };

  const handleAddRelay = () => {
    if (newRelayUrl.trim()) {
      const url = newRelayUrl.startsWith('wss://') ? newRelayUrl : `wss://${newRelayUrl}`;
      const newRelay: RelayState = {
        id: `custom-${Date.now()}`,
        url,
        name: url.replace('wss://', ''),
        description: 'Custom relay',
        isPaid: false,
        isOnline: true,
        supportedNips: [1, 2, 4, 9, 11, 12, 15, 16, 20, 22, 28, 33, 40],
        latency: 0,
        userCount: 0,
        lastSeen: Date.now(),
        isConnected: false,
        isConnecting: false,
        readPolicy: true,
        writePolicy: true,
      };
      setRelays(prev => [...prev, newRelay]);
      setNewRelayUrl('');
      setShowAddForm(false);
    }
  };

  const handleRemoveRelay = (relayId: string) => {
    setRelays(prev => prev.filter(r => r.id !== relayId));
  };

  const connectedCount = relays.filter(r => r.isConnected).length;
  const totalCount = relays.length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="snort-header">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="snort-btn snort-btn-ghost snort-btn-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="snort-header-title">Relays</h1>
            <p className="text-sm text-slate-400">{connectedCount} of {totalCount} connected</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="snort-btn snort-btn-primary snort-btn-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Relay
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 border-b border-slate-700">
        <div className="bg-slate-800 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-teal-400">{connectedCount}</p>
          <p className="text-xs text-slate-400">Connected</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-white">{relays.filter(r => r.isPaid).length}</p>
          <p className="text-xs text-slate-400">Paid</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-white">
            {Math.round(relays.filter(r => r.isConnected).reduce((acc, r) => acc + r.latency, 0) / Math.max(connectedCount, 1))}ms
          </p>
          <p className="text-xs text-slate-400">Avg Latency</p>
        </div>
      </div>

      {/* Add Relay Form */}
      {showAddForm && (
        <div className="p-4 border-b border-slate-700 bg-slate-800/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={newRelayUrl}
              onChange={(e) => setNewRelayUrl(e.target.value)}
              placeholder="wss://relay.example.com"
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={handleAddRelay}
              className="snort-btn snort-btn-primary snort-btn-sm"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="snort-btn snort-btn-ghost snort-btn-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Relays List */}
      <div className="snort-content flex-1">
        {relays.map((relay) => (
          <div key={relay.id} className="snort-relay">
            <div className="snort-relay-header">
              <div>
                <div className="snort-relay-name">
                  {relay.name}
                  {relay.isPaid && (
                    <span className="ml-2 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                      Paid
                    </span>
                  )}
                </div>
                <p className="snort-relay-url">{relay.url}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`snort-relay-status ${relay.isConnecting ? 'connecting' : relay.isConnected ? 'connected' : 'disconnected'}`}>
                  <span className="snort-relay-status-dot" />
                  {relay.isConnecting ? 'Connecting...' : relay.isConnected ? 'Connected' : 'Disconnected'}
                </span>
                <button
                  onClick={() => handleConnect(relay.id)}
                  className={`snort-btn snort-btn-sm ${relay.isConnected ? 'snort-btn-secondary' : 'snort-btn-primary'}`}
                >
                  {relay.isConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>

            {relay.description && (
              <p className="text-sm text-slate-400 mb-3">{relay.description}</p>
            )}

            <div className="snort-relay-stats">
              <span>Latency: {relay.latency}ms</span>
              <span>Users: {relay.userCount.toLocaleString()}</span>
              <span>NIPs: {relay.supportedNips.slice(0, 5).join(', ')}{relay.supportedNips.length > 5 ? '...' : ''}</span>
            </div>

            <div className="snort-relay-policies">
              <button
                onClick={() => handleTogglePolicy(relay.id, 'read')}
                className={`snort-relay-policy ${relay.readPolicy ? 'active' : ''}`}
              >
                Read {relay.readPolicy ? '✓' : '✗'}
              </button>
              <button
                onClick={() => handleTogglePolicy(relay.id, 'write')}
                className={`snort-relay-policy ${relay.writePolicy ? 'active' : ''}`}
              >
                Write {relay.writePolicy ? '✓' : '✗'}
              </button>
              {relay.restrictions?.authRequired && (
                <span className="snort-relay-policy">Auth Required</span>
              )}
              {relay.restrictions?.paymentRequired && (
                <span className="snort-relay-policy">Payment Required</span>
              )}
            </div>

            {/* Remove button for custom relays */}
            {relay.id.startsWith('custom-') && (
              <button
                onClick={() => handleRemoveRelay(relay.id)}
                className="mt-3 text-red-400 hover:text-red-300 text-sm"
              >
                Remove relay
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelaysScreen;
