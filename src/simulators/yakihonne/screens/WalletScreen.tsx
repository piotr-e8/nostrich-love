import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, Zap, Copy, QrCode, History, Bitcoin } from 'lucide-react';
import { WalletDisplay } from '../components/WalletDisplay';
import { ContentTabs } from '../components/ContentTabs';

interface WalletScreenProps {
  balance: number;
  onZap: (amount: number) => void;
  onReceive: (amount: number) => void;
}

// Mock transactions
const mockTransactions = [
  {
    id: 'tx1',
    type: 'receive' as const,
    amount: 21000,
    description: 'From alice@nostr.com',
    timestamp: Date.now() / 1000 - 300,
    status: 'confirmed' as const,
  },
  {
    id: 'tx2',
    type: 'zap' as const,
    amount: 500,
    description: 'Zap to Jack Dorsey',
    timestamp: Date.now() / 1000 - 1800,
    status: 'confirmed' as const,
  },
  {
    id: 'tx3',
    type: 'zap' as const,
    amount: 1000,
    description: 'Zap to article author',
    timestamp: Date.now() / 1000 - 3600,
    status: 'confirmed' as const,
  },
  {
    id: 'tx4',
    type: 'receive' as const,
    amount: 5000,
    description: 'From bob@nostr.com',
    timestamp: Date.now() / 1000 - 7200,
    status: 'confirmed' as const,
  },
  {
    id: 'tx5',
    type: 'zap' as const,
    amount: 21,
    description: 'Zap to meme post',
    timestamp: Date.now() / 1000 - 14400,
    status: 'confirmed' as const,
  },
  {
    id: 'tx6',
    type: 'receive' as const,
    amount: 100000,
    description: 'Lightning deposit',
    timestamp: Date.now() / 1000 - 86400,
    status: 'confirmed' as const,
  },
];

export function WalletScreen({ balance, onZap, onReceive }: WalletScreenProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'zaps' | 'receives'>('all');
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  const filteredTransactions = mockTransactions.filter(tx => {
    if (activeTab === 'zaps') return tx.type === 'zap';
    if (activeTab === 'receives') return tx.type === 'receive';
    return true;
  });

  const formatSats = (sats: number): string => {
    return sats.toLocaleString();
  };

  const formatBTC = (sats: number): string => {
    return (sats / 100000000).toFixed(8);
  };

  const formatTime = (timestamp: number): string => {
    const diff = Date.now() / 1000 - timestamp;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="yakihonne-header">
        <div className="flex items-center gap-2">
          <Bitcoin className="w-6 h-6 text-[var(--yh-primary)]" />
          <span className="yakihonne-header-title">Wallet</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Wallet Card */}
        <WalletDisplay 
          balance={balance}
          onReceive={() => setShowReceiveModal(true)}
          onSend={() => setShowSendModal(true)}
        />

        {/* Quick Actions */}
        <div className="px-4 mt-4">
          <h3 className="text-sm font-semibold text-[var(--yh-text-secondary)] mb-3 uppercase tracking-wide">
            Quick Actions
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => setShowReceiveModal(true)}
              className="flex flex-col items-center gap-2 p-4 bg-[var(--yh-surface)] rounded-xl hover:bg-[var(--yh-surface-variant)] transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <ArrowDownLeft className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-[var(--yh-text-primary)]">Receive</span>
            </button>
            
            <button 
              onClick={() => setShowSendModal(true)}
              className="flex flex-col items-center gap-2 p-4 bg-[var(--yh-surface)] rounded-xl hover:bg-[var(--yh-surface-variant)] transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-[var(--yh-text-primary)]">Send</span>
            </button>
            
            <button className="flex flex-col items-center gap-2 p-4 bg-[var(--yh-surface)] rounded-xl hover:bg-[var(--yh-surface-variant)] transition-colors">
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <QrCode className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-sm font-medium text-[var(--yh-text-primary)]">QR Code</span>
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-6">
          <ContentTabs
            tabs={[
              { id: 'all', label: 'All', icon: History },
              { id: 'zaps', label: 'Zaps', icon: Zap },
              { id: 'receives', label: 'Received', icon: ArrowDownLeft },
            ]}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
          />

          <div className="p-4 space-y-3">
            {filteredTransactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="yakihonne-transaction"
              >
                <div className={`yakihonne-transaction-icon ${tx.type}`}>
                  {tx.type === 'receive' && <ArrowDownLeft className="w-5 h-5" />}
                  {tx.type === 'send' && <ArrowUpRight className="w-5 h-5" />}
                  {tx.type === 'zap' && <Zap className="w-5 h-5" />}
                </div>
                
                <div className="yakihonne-transaction-details">
                  <div className="yakihonne-transaction-title">
                    {tx.type === 'receive' ? 'Received' : tx.type === 'zap' ? 'Zapped' : 'Sent'}
                  </div>
                  <div className="yakihonne-transaction-subtitle">
                    {tx.description} • {formatTime(tx.timestamp)}
                  </div>
                </div>
                
                <div className={`yakihonne-transaction-amount ${tx.type === 'receive' ? 'positive' : 'negative'}`}>
                  {tx.type === 'receive' ? '+' : '-'}{formatSats(tx.amount)} sats
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Receive Modal */}
      {showReceiveModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowReceiveModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[var(--yh-surface)] rounded-2xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[var(--yh-text-primary)] mb-4">Receive Bitcoin</h3>
            
            <div className="bg-white p-4 rounded-xl mb-4">
              <div className="aspect-square bg-gradient-to-br from-[var(--yh-primary)] to-[var(--yh-primary-dark)] rounded-lg flex items-center justify-center">
                <QrCode className="w-32 h-32 text-white" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-[var(--yh-surface-variant)] rounded-lg mb-4">
              <code className="flex-1 text-xs text-[var(--yh-text-secondary)] truncate">
                lnbc1u1p3l8dxupp5n9s5j9w4...
              </code>
              <button className="p-2 text-[var(--yh-primary)] hover:bg-[var(--yh-surface)] rounded-lg transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={() => {
                onReceive(10000);
                setShowReceiveModal(false);
              }}
              className="w-full yakihonne-btn yakihonne-btn-primary"
            >
              Simulate Receive 10,000 sats
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Send Modal */}
      {showSendModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSendModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[var(--yh-surface)] rounded-2xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[var(--yh-text-primary)] mb-4">Send Bitcoin</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--yh-text-secondary)] mb-1">
                  Lightning Invoice
                </label>
                <input 
                  type="text"
                  placeholder="Paste invoice here..."
                  className="yakihonne-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--yh-text-secondary)] mb-1">
                  Or Enter Amount
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    placeholder="0"
                    className="yakihonne-input pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--yh-text-secondary)]">
                    sats
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowSendModal(false)}
              className="w-full yakihonne-btn yakihonne-btn-primary mt-6"
            >
              Send Payment
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default WalletScreen;
