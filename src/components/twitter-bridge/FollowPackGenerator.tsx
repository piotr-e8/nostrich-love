import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import type { FollowPackGeneratorProps, MatchedAccount } from '../../types/twitter-bridge';

// QRCode module will be loaded dynamically to avoid hydration issues
let QRCodeModule: typeof import('qrcode') | null = null;

type ExportMethod = 'qr' | 'copy' | 'nip02';

const RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://nostr.mom',
];

export const FollowPackGenerator: React.FC<FollowPackGeneratorProps> = ({
  selectedAccounts,
  onClose,
  isOpen,
}) => {
  const [activeTab, setActiveTab] = useState<ExportMethod>('qr');
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [packName, setPackName] = useState('My Twitter Friends on Nostr');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate npub list for copy
  const npubList = useMemo(() => {
    return selectedAccounts.map(a => a.nostr.npub).join('\n');
  }, [selectedAccounts]);

  // Generate NIP-02 format
  const nip02Data = useMemo(() => {
    return {
      kind: 3,
      tags: selectedAccounts.map(account => [
        'p',
        account.nostr.npub,
        '',
        account.nostr.name,
      ]),
      content: '',
    };
  }, [selectedAccounts]);

  // Generate nostr: URI
  const nostrUri = useMemo(() => {
    const jsonData = JSON.stringify({
      name: packName,
      accounts: selectedAccounts.map(a => ({
        npub: a.nostr.npub,
        name: a.nostr.name,
        twitter: a.twitter.twitterHandle,
      })),
    });
    const base64Data = btoa(encodeURIComponent(jsonData).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
    return `nostr:followpack?d=${base64Data}`;
  }, [packName, selectedAccounts]);

  // Generate QR code
  useEffect(() => {
    const generateQR = async () => {
      if (activeTab === 'qr' && canvasRef.current && nostrUri) {
        try {
          // Dynamically import QRCode to avoid hydration issues
          if (!QRCodeModule) {
            QRCodeModule = await import('qrcode');
          }
          
          await QRCodeModule.toCanvas(canvasRef.current, nostrUri, {
            width: 256,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#ffffff',
            },
          });
          
          const dataUrl = await QRCodeModule.toDataURL(nostrUri, {
            width: 512,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#ffffff',
            },
          });
          setQrDataUrl(dataUrl);
        } catch (err) {
          console.error('QR generation error:', err);
        }
      }
    };

    generateQR();
  }, [activeTab, nostrUri]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
      copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadQR = () => {
    if (qrDataUrl) {
      const a = document.createElement('a');
      a.href = qrDataUrl;
      a.download = `twitter-friends-nostr-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Import Your Friends
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {selectedAccounts.length} friend{selectedAccounts.length !== 1 ? 's' : ''} selected
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Pack name input */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pack Name
            </label>
            <input
              type="text"
              value={packName}
              onChange={(e) => setPackName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-friendly-purple-500"
              placeholder="Enter a name for your follow pack"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('qr')}
              className={`
                flex-1 py-3 px-4 text-sm font-medium text-center
                border-b-2 transition-colors
                ${activeTab === 'qr'
                  ? 'border-friendly-purple-600 text-friendly-purple-600 dark:text-friendly-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 20h2v-2H6v2zm6-2h-2v2h2v-2zm-6-6h2v-2H6v2zm12 0h-2v2h2v-2zM6 8h2V6H6v2zm12 0h-2V6h2v2zM8 12h2v-2H8v2zm8 0h-2v2h2v-2z" />
                </svg>
                QR Code
              </span>
            </button>
            <button
              onClick={() => setActiveTab('copy')}
              className={`
                flex-1 py-3 px-4 text-sm font-medium text-center
                border-b-2 transition-colors
                ${activeTab === 'copy'
                  ? 'border-friendly-purple-600 text-friendly-purple-600 dark:text-friendly-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy List
              </span>
            </button>
            <button
              onClick={() => setActiveTab('nip02')}
              className={`
                flex-1 py-3 px-4 text-sm font-medium text-center
                border-b-2 transition-colors
                ${activeTab === 'nip02'
                  ? 'border-friendly-purple-600 text-friendly-purple-600 dark:text-friendly-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                NIP-02
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'qr' && (
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl inline-block mb-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <canvas 
                  ref={canvasRef}
                  className="rounded-lg"
                  width={256}
                  height={256}
                  style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
                />
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Scan this QR code with your Nostr client to follow all selected accounts
              </p>
              
              <div className="flex justify-center gap-2 mb-4">
                <button
                  onClick={handleDownloadQR}
                  disabled={!qrDataUrl}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Download QR
                </button>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <span className="font-medium">💡 How to import:</span>
                </p>
                <ol className="text-sm text-blue-700 dark:text-blue-300 mt-2 ml-4 list-decimal space-y-1">
                  <li>Open your Nostr client (Damus, Amethyst, etc.)</li>
                  <li>Go to Settings or Profile → Import</li>
                  <li>Scan this QR code or paste the link</li>
                  <li>Confirm to follow all accounts</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'copy' && (
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Copy this list and paste it into your client's "Import Follows" feature:
              </p>
              <div className="relative">
                <textarea
                  readOnly
                  value={npubList}
                  className="w-full h-48 p-4 text-sm font-mono bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-300 resize-none"
                />
                <button
                  onClick={() => handleCopy(npubList)}
                  className="absolute top-2 right-2 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'nip02' && (
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                NIP-02 formatted follow list for advanced users:
              </p>
              <div className="relative">
                <pre className="w-full h-48 p-4 text-xs font-mono bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-300 overflow-auto">
                  {JSON.stringify(nip02Data, null, 2)}
                </pre>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleCopy(JSON.stringify(nip02Data, null, 2))}
                    className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                This format can be imported into most Nostr clients that support NIP-02 contact lists.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedAccounts.length} account{selectedAccounts.length !== 1 ? 's' : ''} selected
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-friendly-purple-600 hover:bg-friendly-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
