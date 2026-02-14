import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function WalletScreen() {
  const [activeTab, setActiveTab] = useState<'bitcoin' | 'ecash'>('ecash');
  const [showReceive, setShowReceive] = useState(false);
  const [balance] = useState(50000); // 50,000 sats

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950" data-tour="keychat-wallet">
      {/* Header */}
      <div className="bg-[#2D7FF9] text-white px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Wallet</h1>
          <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"
        >
          <p className="text-white/80 text-sm mb-1">Total Balance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{balance.toLocaleString()}</span>
            <span className="text-white/80">sats</span>
          </div>
          <p className="text-white/60 text-sm mt-1">≈ $20.50 USD</p>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex bg-white/20 rounded-full p-1 mt-4">
          <button
            onClick={() => setActiveTab('ecash')}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
              activeTab === 'ecash' ? 'bg-white text-[#2D7FF9]' : 'text-white/80'
            }`}
          >
            Ecash
          </button>
          <button
            onClick={() => setActiveTab('bitcoin')}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
              activeTab === 'bitcoin' ? 'bg-white text-[#2D7FF9]' : 'text-white/80'
            }`}
          >
            Bitcoin
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 -mt-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 flex gap-4">
          <button 
            onClick={() => setShowReceive(true)}
            className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Receive</span>
          </button>
          
          <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="w-12 h-12 bg-[#2D7FF9]/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#2D7FF9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Send</span>
          </button>

          <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Zap</span>
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Recent Activity</h3>
        
        <div className="space-y-2">
          {[
            { type: 'received', amount: 10000, from: 'Alice', time: '2m ago' },
            { type: 'sent', amount: 5000, to: 'Bob', time: '1h ago' },
            { type: 'received', amount: 25000, from: 'Zap', time: '3h ago' },
            { type: 'minted', amount: 5000, time: '1d ago' },
          ].map((tx, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-4 flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                tx.type === 'received' ? 'bg-green-100 dark:bg-green-900/30' : 
                tx.type === 'sent' ? 'bg-red-100 dark:bg-red-900/30' :
                'bg-blue-100 dark:bg-blue-900/30'
              }`}>
                <svg className={`w-5 h-5 ${
                  tx.type === 'received' ? 'text-green-600 dark:text-green-400' :
                  tx.type === 'sent' ? 'text-red-600 dark:text-red-400' :
                  'text-blue-600 dark:text-blue-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {tx.type === 'received' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  ) : tx.type === 'sent' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  )}
                </svg>
              </div>
              
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {tx.type === 'received' ? `From ${tx.from}` :
                   tx.type === 'sent' ? `To ${tx.to}` :
                   'Ecash Minted'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{tx.time}</p>
              </div>
              
              <span className={`font-semibold ${
                tx.type === 'received' ? 'text-green-600 dark:text-green-400' :
                tx.type === 'sent' ? 'text-red-600 dark:text-red-400' :
                'text-blue-600 dark:text-blue-400'
              }`}>
                {tx.type === 'sent' ? '-' : '+'}{tx.amount.toLocaleString()} sats
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Receive Modal */}
      <AnimatePresence>
        {showReceive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowReceive(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Receive Bitcoin</h3>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 mb-4">
                <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center">
                  <svg className="w-32 h-32 text-gray-800" viewBox="0 0 100 100">
                    <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2" />
                    <rect x="25" y="25" width="15" height="15" fill="currentColor" />
                    <rect x="60" y="25" width="15" height="15" fill="currentColor" />
                    <rect x="25" y="60" width="15" height="15" fill="currentColor" />
                  </svg>
                </div>
                <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">Scan to pay</p>
              </div>
              <button
                onClick={() => setShowReceive(false)}
                className="w-full py-3 bg-[#2D7FF9] text-white rounded-xl font-semibold"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
