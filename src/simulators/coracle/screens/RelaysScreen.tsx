import React, { useState } from 'react';
import type { MockRelay } from '../../../data/mock';
import type { CoracleScreen } from '../CoracleSimulator';

interface RelaysScreenProps {
  relays: MockRelay[];
  connectedRelays: string[];
  onConnectRelay: (relayUrl: string) => void;
  onNavigate: (screen: CoracleScreen) => void;
  isRelayConnected: (relayUrl: string) => boolean;
}

export const RelaysScreen: React.FC<RelaysScreenProps> = ({
  relays,
  connectedRelays,
  onConnectRelay,
  onNavigate,
  isRelayConnected,
}) => {
  const [filter, setFilter] = useState<'all' | 'connected' | 'paid' | 'free'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRelayUrl, setNewRelayUrl] = useState('');

  const filteredRelays = relays.filter(relay => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'connected' ? isRelayConnected(relay.url) :
      filter === 'paid' ? relay.isPaid :
      !relay.isPaid;
    
    const matchesSearch = 
      relay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      relay.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      relay.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleAddRelay = () => {
    if (newRelayUrl.trim()) {
      console.log('[Coracle] Adding relay:', newRelayUrl);
      setNewRelayUrl('');
      setShowAddModal(false);
    }
  };

  const getStatusColor = (relay: MockRelay) => {
    if (!relay.isOnline) return 'bg-red-500';
    if (isRelayConnected(relay.url)) return 'bg-green-500';
    return 'bg-gray-400';
  };

  const getStatusText = (relay: MockRelay) => {
    if (!relay.isOnline) return 'Offline';
    if (isRelayConnected(relay.url)) return 'Connected';
    return 'Available';
  };

  return (
    <div className="coracle-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Relay Manager</h1>
          <p className="text-gray-600">
            Connect to relays to send and receive notes. You're currently connected to{' '}
            <span className="font-semibold text-indigo-600">{connectedRelays.length}</span> relays.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-indigo-600">{connectedRelays.length}</p>
            <p className="text-xs text-gray-500 mt-1">Connected</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-green-600">
              {relays.filter(r => r.isOnline).length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Online</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-orange-600">
              {relays.filter(r => r.isPaid).length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Paid</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-blue-600">
              {relays.filter(r => !r.isPaid).length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Free</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search relays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="coracle-input"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="coracle-input"
              >
                <option value="all">All Relays</option>
                <option value="connected">Connected</option>
                <option value="paid">Paid Only</option>
                <option value="free">Free Only</option>
              </select>
              <button
                onClick={() => setShowAddModal(true)}
                className="coracle-btn-primary whitespace-nowrap"
              >
                Add Relay
              </button>
            </div>
          </div>
        </div>

        {/* Relay List */}
        <div className="space-y-4">
          {filteredRelays.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <p className="text-gray-500">No relays found matching your criteria</p>
            </div>
          ) : (
            filteredRelays.map(relay => (
              <div
                key={relay.id}
                className={`bg-white rounded-xl p-6 shadow-sm border transition-all ${
                  isRelayConnected(relay.url) 
                    ? 'border-indigo-300 ring-1 ring-indigo-200' 
                    : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{relay.name}</h3>
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(relay)}`} />
                      <span className="text-xs text-gray-500">{getStatusText(relay)}</span>
                      {relay.isPaid && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                          Paid
                        </span>
                      )}
                    </div>
                    
                    <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {relay.url}
                    </code>
                    
                    <p className="text-sm text-gray-600 mt-2">{relay.description}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {relay.userCount.toLocaleString()} users
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {relay.latency}ms latency
                      </span>
                      {relay.software && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          {relay.software}
                        </span>
                      )}
                    </div>

                    {/* Supported NIPs */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {relay.supportedNips.slice(0, 8).map(nip => (
                        <span
                          key={nip}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          NIP-{nip}
                        </span>
                      ))}
                      {relay.supportedNips.length > 8 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          +{relay.supportedNips.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="ml-4">
                    <button
                      onClick={() => onConnectRelay(relay.url)}
                      disabled={!relay.isOnline}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        !relay.isOnline
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isRelayConnected(relay.url)
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      }`}
                    >
                      {!relay.isOnline 
                        ? 'Offline' 
                        : isRelayConnected(relay.url) 
                        ? 'Disconnect' 
                        : 'Connect'}
                    </button>
                  </div>
                </div>

                {/* Payment Info */}
                {relay.isPaid && relay.paymentTerms && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-orange-600">
                      <span className="font-medium">Payment Required:</span> {relay.paymentTerms}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About Relays
          </h4>
          <p className="text-sm text-blue-800">
            Relays are servers that store and distribute Nostr events. Connecting to more relays 
            increases your reach, but may slow down loading. Paid relays often offer better 
            performance and spam protection.
          </p>
        </div>
      </div>

      {/* Add Relay Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add Custom Relay</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter the WebSocket URL of the relay you want to connect to.
            </p>
            <input
              type="text"
              value={newRelayUrl}
              onChange={(e) => setNewRelayUrl(e.target.value)}
              placeholder="wss://relay.example.com"
              className="coracle-input mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="coracle-btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRelay}
                className="coracle-btn-primary flex-1"
              >
                Add Relay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelaysScreen;
