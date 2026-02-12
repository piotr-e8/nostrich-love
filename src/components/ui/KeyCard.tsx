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
      <div className="relative overflow-hidden rounded-2xl border border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
        <div className="absolute left-0 top-0 h-full w-1 bg-green-500" />
        <div className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Public Identity (npub)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Safe to share with anyone</p>
            </div>
          </div>
          
          <div className="mb-4 rounded-lg border border-green-200 bg-white p-4 font-mono text-sm dark:border-green-800 dark:bg-gray-900">
            <code className="break-all text-green-700 dark:text-green-400">{formatNpub(npub)}</code>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopyNpub}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                copiedNpub
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
              )}
              aria-label={copiedNpub ? 'Copied!' : 'Copy public key'}
            >
              {copiedNpub ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiedNpub ? 'Copied!' : 'Copy'}
            </button>
          </div>
          
          <div className="mt-4 flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
            <Shield className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>This is your public identifier. Others can use it to follow you and see your posts.</span>
          </div>
        </div>
      </div>

      {/* Private Key Card */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
        {/* Danger stripes */}
        <div className="absolute -right-8 -top-8 h-24 w-24 rotate-45 bg-red-500/10" />
        <div className="absolute -left-8 -bottom-8 h-24 w-24 rotate-45 bg-red-500/10" />
        
        <div className="absolute left-0 top-0 h-full w-1.5 bg-red-500" />
        <div className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Private Key (nsec)</h3>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">KEEP SECRET - NEVER SHARE</p>
            </div>
          </div>
          
          <div className="mb-4 rounded-lg border border-red-200 bg-white p-4 font-mono text-sm dark:border-red-800 dark:bg-gray-900">
            <div className="flex items-center justify-between gap-4">
              <code className={cn('break-all text-red-700 dark:text-red-400', !showNsec && 'blur-sm select-none')}>
                {showNsec ? formatNpub(nsec, true) : 'nsec1••••••••••••••••••••••••••••••••'}
              </code>
              <button
                onClick={() => setShowNsec(!showNsec)}
                className="flex-shrink-0 rounded-md p-1.5 text-gray-500 hover:bg-red-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900 dark:hover:text-red-400"
                aria-label={showNsec ? 'Hide private key' : 'Show private key'}
              >
                {showNsec ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopyNsec}
              disabled={!showNsec}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                !showNsec && 'opacity-50 cursor-not-allowed',
                copiedNsec
                  ? 'bg-red-500 text-white'
                  : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
              )}
              aria-label={copiedNsec ? 'Copied!' : 'Copy private key'}
            >
              {copiedNsec ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiedNsec ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              Download Backup
            </button>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>This is your password. Anyone with this key can post as you and access your account.</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>Save it in a password manager or write it down on paper. If you lose it, you cannot recover your account.</span>
            </div>
          </div>
          
          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg border border-red-200 bg-white/50 p-4 dark:border-red-800 dark:bg-gray-900/50">
            <input
              type="checkbox"
              checked={understood}
              onChange={(e) => setUnderstood(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm font-medium text-red-800 dark:text-red-300">
              I understand that this key cannot be recovered if lost. I have saved it safely.
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
