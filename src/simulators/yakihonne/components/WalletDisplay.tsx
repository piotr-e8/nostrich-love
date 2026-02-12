import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowDownLeft, ArrowUpRight, Bitcoin } from 'lucide-react';

interface WalletDisplayProps {
  balance: number;
  onReceive: () => void;
  onSend: () => void;
}

export function WalletDisplay({ balance, onReceive, onSend }: WalletDisplayProps) {
  const [showBalance, setShowBalance] = useState(true);

  const formatSats = (sats: number): string => {
    if (showBalance) {
      return sats.toLocaleString();
    }
    return '••••••';
  };

  const formatBTC = (sats: number): string => {
    if (showBalance) {
      return (sats / 100000000).toFixed(8);
    }
    return '••••••';
  };

  return (
    <div className="yakihonne-wallet">
      {/* Header */}
      <div className="yakihonne-wallet-header">
        <div className="flex items-center gap-2">
          <Bitcoin className="w-6 h-6" />
          <span className="font-semibold">Bitcoin Wallet</span>
        </div>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          {showBalance ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Balance */}
      <div>
        <p className="yakihonne-wallet-label">Total Balance</p>
        <motion.h2 
          key={showBalance ? balance : 'hidden'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="yakihonne-wallet-balance"
        >
          {formatSats(balance)}
          <span className="text-2xl ml-2 font-medium">sats</span>
        </motion.h2>
        <p className="yakihonne-wallet-balance-sats">
          ≈ {formatBTC(balance)} BTC
        </p>
      </div>

      {/* Actions */}
      <div className="yakihonne-wallet-actions">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReceive}
          className="yakihonne-wallet-btn"
        >
          <ArrowDownLeft className="w-5 h-5" />
          Receive
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSend}
          className="yakihonne-wallet-btn"
        >
          <ArrowUpRight className="w-5 h-5" />
          Send
        </motion.button>
      </div>
    </div>
  );
}

export default WalletDisplay;
