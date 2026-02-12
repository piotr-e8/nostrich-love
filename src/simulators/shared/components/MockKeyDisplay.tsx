/**
 * MockKeyDisplay - Display npub/nsec keys with copy functionality
 * Visual simulation only - no real cryptography
 */

import React, { useState, useCallback } from 'react';
import { Copy, Check, Eye, EyeOff, QrCode } from 'lucide-react';
import type { KeyDisplayProps } from '../types';
import { truncateNpub, truncateNsec } from '../utils/mockKeys';
import { cn } from '../../../utils/cn';

interface MockKeyDisplayProps extends KeyDisplayProps {
  label?: string;
}

/**
 * MockKeyDisplay - Renders mock Nostr keys with visual effects
 */
export function MockKeyDisplay({
  npub,
  nsec,
  showCopy = true,
  showQr = false,
  compact = false,
  label,
}: MockKeyDisplayProps) {
  const [copiedNpub, setCopiedNpub] = useState(false);
  const [copiedNsec, setCopiedNsec] = useState(false);
  const [showNsec, setShowNsec] = useState(false);

  const handleCopy = useCallback(async (text: string, type: 'npub' | 'nsec') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'npub') {
        setCopiedNpub(true);
        setTimeout(() => setCopiedNpub(false), 2000);
      } else {
        setCopiedNsec(true);
        setTimeout(() => setCopiedNsec(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const displayNpub = compact ? truncateNpub(npub) : npub;
  const displayNsec = nsec ? (compact ? truncateNsec(nsec) : nsec) : null;

  return (
    <div className={cn(
      'mock-key-display space-y-3',
      compact && 'space-y-2'
    )}>
      {label && (
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </p>
      )}
      
      {/* Public Key (npub) */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Public Key (npub)</span>
          {showQr && (
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <QrCode className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <code className={cn(
            'flex-1 font-mono text-sm bg-gray-100 dark:bg-gray-800',
            'px-3 py-2 rounded-lg break-all',
            'text-gray-900 dark:text-gray-100'
          )}>
            {displayNpub}
          </code>
          {showCopy && (
            <button
              onClick={() => handleCopy(npub, 'npub')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'active:scale-95'
              )}
              title="Copy public key"
            >
              {copiedNpub ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Secret Key (nsec) */}
      {displayNsec && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Secret Key (nsec)</span>
            <span className="text-amber-600 text-[10px] font-medium">KEEP SECRET</span>
          </div>
          <div className="flex items-center gap-2">
            <code className={cn(
              'flex-1 font-mono text-sm bg-amber-50 dark:bg-amber-950/30',
              'px-3 py-2 rounded-lg break-all',
              'text-gray-900 dark:text-gray-100',
              !showNsec && 'blur-sm select-none'
            )}>
              {showNsec ? displayNsec : '•'.repeat(displayNsec.length)}
            </code>
            <button
              onClick={() => setShowNsec(!showNsec)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'active:scale-95'
              )}
              title={showNsec ? 'Hide secret key' : 'Show secret key'}
            >
              {showNsec ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
              ) : (
                <Eye className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {showCopy && (
              <button
                onClick={() => nsec && handleCopy(nsec, 'nsec')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'active:scale-95'
                )}
                title="Copy secret key"
              >
                {copiedNsec ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            Never share your secret key. Anyone with this key can access your account.
          </p>
        </div>
      )}
    </div>
  );
}

export default MockKeyDisplay;
