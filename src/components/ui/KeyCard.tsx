import React, { useState, useCallback } from 'react';
import { Lock, Eye, EyeOff, Copy, Check, Shield, AlertTriangle, Download } from 'lucide-react';
import { cn, copyToClipboard, formatNpub } from '../../lib/utils';

export interface KeyCardProps {
  npub: string;
  nsec: string;
  className?: string;
  onCopy?: (type: 'npub' | 'nsec') => void;
}

export function KeyCard({ npub, nsec, className, onCopy }: KeyCardProps) {
  const [showNsec, setShowNsec] = useState(false);
  const [copiedNpub, setCopiedNpub] = useState(false);
  const [copiedNsec, setCopiedNsec] = useState(false);
  const [understood, setUnderstood] = useState(false);

  const handleCopyNpub = useCallback(async () => {
    await copyToClipboard(npub);
    setCopiedNpub(true);
    onCopy?.('npub');
    setTimeout(() => setCopiedNpub(false), 2000);
  }, [npub, onCopy]);

  const handleCopyNsec = useCallback(async () => {
    await copyToClipboard(nsec);
    setCopiedNsec(true);
    onCopy?.('nsec');
    setTimeout(() => setCopiedNsec(false), 2000);
  }, [nsec, onCopy]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([`Nostr Private Key (nsec)\n${nsec}\n\nKeep this secret and safe!\n`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nostr-private-key.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [nsec]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Public Key Card */}
      <div className="relative overflow-hidden rounded-lg border border-success-200 bg-success-50 dark:border-success-900 dark:bg-success-950">
        <div className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Lock
              className="h-5 w-5 shrink-0 text-success-700 dark:text-success-400"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div>
              <h3 className="text-h4 font-semibold text-gray-900 dark:text-white">Public Identity (npub)</h3>
              <p className="text-body-sm text-gray-600 dark:text-gray-400">Safe to share with anyone</p>
            </div>
          </div>
          
          <div className="mb-4 rounded-md border border-success-200 bg-white p-4 font-mono text-body-sm dark:border-success-900 dark:bg-gray-900">
            <code className="break-all text-success-800 dark:text-success-300">{formatNpub(npub)}</code>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopyNpub}
              className={cn(
                'inline-flex items-center gap-2 rounded-md px-4 py-2 text-body-sm font-medium transition-colors',
                copiedNpub
                  ? 'bg-success-700 text-white'
                  : 'border border-success-200 text-success-800 hover:bg-success-100 dark:border-success-900 dark:text-success-300 dark:hover:bg-success-900'
              )}
              aria-label={copiedNpub ? 'Copied!' : 'Copy public key'}
            >
              {copiedNpub ? (
                <Check className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              )}
              {copiedNpub ? 'Copied!' : 'Copy'}
            </button>
          </div>
          
          <div className="mt-4 flex items-start gap-2 text-body-sm text-success-800 dark:text-success-300">
            <Shield className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
            <span>This is your public identifier. Others can use it to follow you and see your posts.</span>
          </div>
        </div>
      </div>

      {/* Private Key Card */}
      <div className="relative overflow-hidden rounded-lg border border-danger-300 bg-danger-50 dark:border-danger-800 dark:bg-danger-950">
        <div className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <AlertTriangle
              className="h-5 w-5 shrink-0 text-danger-600 dark:text-danger-400"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div>
              <h3 className="text-h4 font-semibold text-gray-900 dark:text-white">Private Key (nsec)</h3>
              <p className="text-body-sm font-medium text-danger-700 dark:text-danger-400">KEEP SECRET - NEVER SHARE</p>
            </div>
          </div>
          
          <div className="mb-4 rounded-md border border-danger-200 bg-white p-4 font-mono text-body-sm dark:border-danger-900 dark:bg-gray-900">
            <div className="flex items-center justify-between gap-4">
              <code className={cn('break-all text-danger-800 dark:text-danger-300', !showNsec && 'select-none blur-sm')}>
                {showNsec ? formatNpub(nsec, true) : 'nsec1••••••••••••••••••••••••••••••••'}
              </code>
              <button
                onClick={() => setShowNsec(!showNsec)}
                className="flex-shrink-0 rounded-md p-1.5 text-gray-500 transition-colors hover:bg-danger-100 hover:text-danger-700 dark:text-gray-400 dark:hover:bg-danger-900 dark:hover:text-danger-300"
                aria-label={showNsec ? 'Hide private key' : 'Show private key'}
              >
                {showNsec ? (
                  <EyeOff className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopyNsec}
              disabled={!showNsec}
              className={cn(
                'inline-flex items-center gap-2 rounded-md px-4 py-2 text-body-sm font-medium transition-colors',
                !showNsec && 'cursor-not-allowed opacity-50',
                copiedNsec
                  ? 'bg-danger-700 text-white'
                  : 'border border-danger-200 text-danger-800 hover:bg-danger-100 dark:border-danger-900 dark:text-danger-300 dark:hover:bg-danger-900'
              )}
              aria-label={copiedNsec ? 'Copied!' : 'Copy private key'}
            >
              {copiedNsec ? (
                <Check className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              )}
              {copiedNsec ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-body-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Download className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Download Backup
            </button>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2 text-body-sm text-danger-800 dark:text-danger-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
              <span>This is your password. Anyone with this key can post as you and access your account.</span>
            </div>
            <div className="flex items-start gap-2 text-body-sm text-danger-800 dark:text-danger-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
              <span>Save it in a password manager or write it down on paper. If you lose it, you cannot recover your account.</span>
            </div>
          </div>
          
          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-md border border-danger-200 bg-white p-4 dark:border-danger-900 dark:bg-gray-900">
            <input
              type="checkbox"
              checked={understood}
              onChange={(e) => setUnderstood(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-danger-300 text-danger-600"
            />
            <span className="text-body-sm font-medium text-danger-800 dark:text-danger-300">
              I understand that this key cannot be recovered if lost. I have saved it safely.
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
