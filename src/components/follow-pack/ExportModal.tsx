import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { generateSecretKey, getPublicKey, finalizeEvent, nip19 } from 'nostr-tools';
import type { CuratedAccount } from '../../types/follow-pack';
import { getCategoryById } from '../../data/follow-pack';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAccounts: CuratedAccount[];
}

type ExportMethod = 'qr' | 'copy' | 'nip02' | 'nip51';
type PublishStatus = 'idle' | 'publishing' | 'published' | 'error';
type RelayStatus = 'pending' | 'success' | 'error';

interface RelayResult {
  url: string;
  status: RelayStatus;
  error?: string;
}

const RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://nostr.mom',
];

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  selectedAccounts,
}) => {
  const [activeTab, setActiveTab] = useState<ExportMethod>('qr');
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [packName, setPackName] = useState('My Nostr Starter Pack');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<PublishStatus>('idle');
  const [relayResults, setRelayResults] = useState<RelayResult[]>(RELAYS.map(r => ({ url: r, status: 'pending' })));
  const [burnerNpub, setBurnerNpub] = useState<string | null>(null);
  const [burnerPk, setBurnerPk] = useState<string | null>(null);
  const [listId, setListId] = useState<string | null>(null);
  const [naddr, setNaddr] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'checking' | 'verified' | 'not_found'>('idle');
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRefs = useRef<WebSocket[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isMountedRef = useRef(true);
  const hasPublishedRef = useRef(false);

  // Generate burner keypair and publish when modal opens - only once
  useEffect(() => {
    if (isOpen && selectedAccounts.length > 0 && !hasPublishedRef.current) {
      hasPublishedRef.current = true;
      publishToNostr();
    }
  }, [isOpen, selectedAccounts.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset state when modal closes and cleanup resources
  useEffect(() => {
    if (!isOpen) {
      hasPublishedRef.current = false;
      setPublishStatus('idle');
      setRelayResults(RELAYS.map(r => ({ url: r, status: 'pending' })));
      setBurnerNpub(null);
      setBurnerPk(null);
      setListId(null);
      setNaddr(null);
      setQrDataUrl(null);
      setVerificationStatus('idle');
      setDebugInfo([]);
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Close all WebSocket connections
      wsRefs.current.forEach(ws => {
        try {
          ws.close();
        } catch (e) {
          // Ignore errors on close
        }
      });
      wsRefs.current = [];
      // Clear all timeouts
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current = [];
      // Clear copied timeout
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  const addDebug = useCallback((msg: string) => {
    setDebugInfo(prev => {
      const newEntry = `${new Date().toLocaleTimeString()}: ${msg}`;
      // Keep only last 100 entries to prevent memory leak
      return [...prev.slice(-99), newEntry];
    });
  }, []);

  const publishToNostr = useCallback(async () => {
    if (selectedAccounts.length === 0) return;

    setPublishStatus('publishing');
    addDebug('Starting publish...');

    try {
      // Generate burner keypair
      const sk = generateSecretKey();
      const pk = getPublicKey(sk);
      const npub = nip19.npubEncode(pk);
      setBurnerNpub(npub);
      setBurnerPk(pk);
      addDebug(`Generated burner key: ${npub.slice(0, 20)}...`);

      // Create NIP-51 starter pack event (kind 39089)
      const newListId = `followpack-${Date.now()}`;
      setListId(newListId);
      
      const eventTemplate = {
        kind: 39089,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ['d', newListId],
          ['title', packName],
          ['description', `Curated follow pack with ${selectedAccounts.length} accounts from nostrich.love`],
          ...selectedAccounts.map(account => {
            // Decode npub to hex pubkey for NIP-51 format
            try {
              const decoded = nip19.decode(account.npub);
              const pubkeyHex = decoded.data as string;
              return ['p', pubkeyHex];
            } catch (e) {
              addDebug(`Failed to decode npub for ${account.name}: ${e}`);
              // Fallback to npub (will likely fail relay validation)
              return ['p', account.npub];
            }
          }),
        ],
        content: '',
      };

      addDebug(`Creating event with listId: ${newListId}`);

      // Sign the event
      const signedEvent = finalizeEvent(eventTemplate, sk);
      addDebug(`Event signed. ID: ${signedEvent.id.slice(0, 16)}...`);

      // Publish to relays
      const results: RelayResult[] = [];
      
      for (const relayUrl of RELAYS) {
        if (!isMountedRef.current) break;
        
        addDebug(`Connecting to ${relayUrl}...`);
        try {
          const ws = new WebSocket(relayUrl);
          wsRefs.current.push(ws);
          
          const result = await new Promise<RelayResult>((resolve) => {
            let resolved = false;
            
            const timeout = setTimeout(() => {
              if (!resolved) {
                resolved = true;
                addDebug(`[${relayUrl}] Connection timeout`);
                ws.close();
                resolve({ url: relayUrl, status: 'error', error: 'Connection timeout' });
              }
            }, 8000);
            timeoutsRef.current.push(timeout);

            ws.onopen = () => {
              addDebug(`[${relayUrl}] Connected`);
              ws.send(JSON.stringify(['EVENT', signedEvent]));
              addDebug(`[${relayUrl}] Event sent`);
              
              const responseTimeout = setTimeout(() => {
                if (!resolved) {
                  resolved = true;
                  addDebug(`[${relayUrl}] No OK response received`);
                  ws.close();
                  resolve({ url: relayUrl, status: 'error', error: 'No OK response' });
                }
              }, 5000);
              timeoutsRef.current.push(responseTimeout);

              ws.onmessage = (msg) => {
                try {
                  const data = JSON.parse(msg.data);
                  addDebug(`[${relayUrl}] Received: ${JSON.stringify(data).slice(0, 100)}`);
                  
                  if (data[0] === 'OK' && data[1] === signedEvent.id) {
                    if (!resolved) {
                      resolved = true;
                      clearTimeout(responseTimeout);
                      clearTimeout(timeout);
                      ws.close();
                      resolve({ url: relayUrl, status: 'success' });
                    }
                  } else if (data[0] === 'OK' && data[2] === false) {
                    if (!resolved) {
                      resolved = true;
                      clearTimeout(responseTimeout);
                      clearTimeout(timeout);
                      ws.close();
                      resolve({ url: relayUrl, status: 'error', error: data[3] || 'Relay rejected event' });
                    }
                  }
                } catch (e) {
                  addDebug(`[${relayUrl}] Error parsing message: ${e}`);
                }
              };
            };

            ws.onerror = (e) => {
              if (!resolved) {
                resolved = true;
                addDebug(`[${relayUrl}] WebSocket error`);
                clearTimeout(timeout);
                resolve({ url: relayUrl, status: 'error', error: 'WebSocket error' });
              }
            };

            ws.onclose = () => {
              addDebug(`[${relayUrl}] Connection closed`);
            };
          });

          results.push(result);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          addDebug(`[${relayUrl}] Exception: ${errorMsg}`);
          results.push({ url: relayUrl, status: 'error', error: errorMsg });
        }
      }

      setRelayResults(results);
      const successful = results.filter(r => r.status === 'success').length;
      addDebug(`Publish complete. ${successful}/${RELAYS.length} relays successful`);

      if (successful > 0) {
        // Generate naddr with relay hints for better discoverability
        // Include relays where the event was successfully published
        const successfulRelays = results
          .filter(r => r.status === 'success')
          .map(r => r.url.replace('wss://', ''));
        
        const naddrEncoded = nip19.naddrEncode({
          kind: 39089,
          pubkey: pk,
          identifier: newListId,
          relays: successfulRelays.slice(0, 2), // Include up to 2 relay hints
        });
        setNaddr(naddrEncoded);
        addDebug(`Generated naddr: ${naddrEncoded.slice(0, 30)}...`);
        addDebug(`Relay hints: ${successfulRelays.slice(0, 2).join(', ')}`);
        
        setPublishStatus('published');
        
        // Wait a moment then verify
        const verifyTimeout = setTimeout(() => {
          if (isMountedRef.current) {
            verifyEventOnRelays(signedEvent.id, pk, newListId);
          }
        }, 2000);
        timeoutsRef.current.push(verifyTimeout);
      } else {
        setPublishStatus('error');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      addDebug(`Fatal error: ${errorMsg}`);
      console.error('Failed to publish:', err);
      setPublishStatus('error');
    }
  }, [selectedAccounts, packName, addDebug]);

  const verifyEventOnRelays = useCallback(async (eventId?: string, pubkey?: string, identifier?: string) => {
    if (!eventId && !pubkey) return;
    
    setVerificationStatus('checking');
    addDebug('Verifying event on relays...');

    const pk = pubkey || burnerPk;
    const id = identifier || listId;
    
    if (!pk || !id) {
      addDebug('Missing pubkey or listId for verification');
      setVerificationStatus('not_found');
      return;
    }

    let foundCount = 0;

    for (const relayUrl of RELAYS) {
      if (!isMountedRef.current) break;
      
      try {
        addDebug(`[${relayUrl}] Querying for event...`);
        const ws = new WebSocket(relayUrl);
        wsRefs.current.push(ws);
        
        const found = await new Promise<boolean>((resolve) => {
          let resolved = false;
          
          const timeout = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              ws.close();
              resolve(false);
            }
          }, 5000);
          timeoutsRef.current.push(timeout);

          ws.onopen = () => {
            // Query by the 'd' tag (identifier) for starter packs (kind 39089)
            const filter = {
              kinds: [39089],
              authors: [pk],
              '#d': [id],
            };
            ws.send(JSON.stringify(['REQ', 'verify', filter]));
            addDebug(`[${relayUrl}] Sent REQ filter for starter pack`);
          };

          ws.onmessage = (msg) => {
            try {
              const data = JSON.parse(msg.data);
              if (data[0] === 'EVENT' && data[2]) {
                if (!resolved) {
                  resolved = true;
                  addDebug(`[${relayUrl}] Found event!`);
                  clearTimeout(timeout);
                  ws.close();
                  resolve(true);
                }
              } else if (data[0] === 'EOSE') {
                if (!resolved) {
                  resolved = true;
                  addDebug(`[${relayUrl}] EOSE received (no event found)`);
                  clearTimeout(timeout);
                  ws.close();
                  resolve(false);
                }
              }
            } catch (e) {
              addDebug(`[${relayUrl}] Error: ${e}`);
            }
          };

          ws.onerror = () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              resolve(false);
            }
          };
        });

        if (found) foundCount++;
      } catch (err) {
        addDebug(`[${relayUrl}] Verification error: ${err}`);
      }
    }

    addDebug(`Verification complete. Found on ${foundCount}/${RELAYS.length} relays`);
    setVerificationStatus(foundCount > 0 ? 'verified' : 'not_found');
  }, [burnerPk, listId, addDebug]);

  // Generate npub list for copy
  const npubList = useMemo(() => {
    return selectedAccounts.map(a => a.npub).join('\n');
  }, [selectedAccounts]);

  // Generate NIP-02 format
  const nip02Data = useMemo(() => {
    return {
      kind: 3,
      tags: selectedAccounts.map(account => [
        'p',
        account.npub,
        '',
        account.name,
      ]),
      content: '',
    };
  }, [selectedAccounts]);

  // Generate nostr: URL for QR code using naddr
  const nostrUrl = useMemo(() => {
    if (naddr) {
      return `nostr:${naddr}`;
    }
    // Fallback to raw data if not published yet
    const jsonData = JSON.stringify({
      name: packName,
      accounts: selectedAccounts.map(a => ({ npub: a.npub, name: a.name })),
    });
    const base64Data = btoa(encodeURIComponent(jsonData).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
    return `nostr:list?d=${base64Data}`;
  }, [naddr, packName, selectedAccounts]);

  // Generate QR code
  useEffect(() => {
    const generateQR = async () => {
      if (activeTab === 'qr' && canvasRef.current && nostrUrl) {
        try {
          setQrError(null);
          await QRCode.toCanvas(canvasRef.current, nostrUrl, {
            width: 256,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#ffffff',
            },
          });
          
          const dataUrl = await QRCode.toDataURL(nostrUrl, {
            width: 512,
            margin: 2,
          });
          setQrDataUrl(dataUrl);
        } catch (err) {
          console.error('QR generation error:', err);
          setQrError('Failed to generate QR code. Please try again.');
        }
      }
    };

    generateQR();
  }, [activeTab, nostrUrl]);

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

  const handleDownload = (data: object, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadQR = () => {
    if (qrDataUrl) {
      const a = document.createElement('a');
      a.href = qrDataUrl;
      a.download = `nostr-follow-pack-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    selectedAccounts.forEach(account => {
      account.categories.forEach(cat => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .map(([catId, count]) => ({
        category: getCategoryById(catId),
        count,
      }))
      .filter(item => item.category);
  }, [selectedAccounts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Export Follow Pack
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {selectedAccounts.length} accounts ready to export
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter a name for your follow pack"
            />
          </div>
          
          {/* Category breakdown */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categoryBreakdown.map(({ category, count }) => (
              <span
                key={category!.id}
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ 
                  backgroundColor: `${category!.color}20`, 
                  color: category!.color 
                }}
              >
                {category!.name}: {count}
              </span>
            ))}
          </div>

          {/* Publish Status */}
          {publishStatus !== 'idle' && (
            <div className="mt-4 space-y-2">
              {publishStatus === 'publishing' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-center gap-3">
                  <div className="animate-spin w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Publishing list to Nostr relays...
                  </p>
                </div>
              )}
              

              
              {publishStatus === 'error' && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <span className="font-medium">⚠ Failed to publish</span> to relays. See details below.
                  </p>
                </div>
              )}

              {/* Collapsible Details Section */}
              {relayResults.length > 0 && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-2 py-1">
                    <span>Details ({relayResults.filter(r => r.status === 'success').length}/{relayResults.length} relays)</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  
                  <div className="mt-2 space-y-2">
                    {/* Published Status */}
                    {publishStatus === 'published' && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          <span className="font-medium">✓ Published!</span> Your follow pack has been published.
                        </p>
                      </div>
                    )}

                    {/* Relay Status */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Relay Status:</p>
                      <div className="space-y-1">
                        {relayResults.map((relay) => (
                          <div key={relay.url} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 truncate flex-1">{relay.url}</span>
                            {relay.status === 'success' && (
                              <span className="text-green-600 ml-2">✓ Saved</span>
                            )}
                            {relay.status === 'error' && (
                              <span className="text-red-600 ml-2" title={relay.error}>✗ Failed</span>
                            )}
                            {relay.status === 'pending' && (
                              <span className="text-yellow-600 ml-2">⏳ Pending</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Verification Status */}
                    {verificationStatus !== 'idle' && (
                      <div className={`rounded-lg p-3 ${
                        verificationStatus === 'verified' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                        verificationStatus === 'not_found' ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800' :
                        'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                      }`}>
                        {verificationStatus === 'checking' && (
                          <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                            <span className="animate-spin inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></span>
                            Verifying event exists on relays...
                          </p>
                        )}
                        {verificationStatus === 'verified' && (
                          <p className="text-sm text-green-800 dark:text-green-200">
                            <span className="font-medium">✓ Verified!</span> Event confirmed on at least one relay.
                          </p>
                        )}
                        {verificationStatus === 'not_found' && (
                          <div>
                            <p className="text-sm text-orange-800 dark:text-orange-200">
                              <span className="font-medium">⚠ Not found yet.</span> Event may still be propagating.
                            </p>
                            <button
                              onClick={() => verifyEventOnRelays()}
                              className="mt-2 text-xs text-orange-600 dark:text-orange-300 underline"
                            >
                              Try verifying again
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Debug Info */}
                    {debugInfo.length > 0 && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          Debug Log ({debugInfo.length} entries)
                        </summary>
                        <div className="mt-2 bg-gray-100 dark:bg-gray-900 p-2 rounded max-h-32 overflow-y-auto font-mono">
                          {debugInfo.map((msg, i) => (
                            <div key={i} className="text-gray-600 dark:text-gray-400">{msg}</div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                </details>
              )}
            </div>
          )}
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
                  ? 'border-primary text-primary'
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
                  ? 'border-primary text-primary'
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
                  ? 'border-primary text-primary'
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
            <button
              onClick={() => setActiveTab('nip51')}
              className={`
                flex-1 py-3 px-4 text-sm font-medium text-center
                border-b-2 transition-colors
                ${activeTab === 'nip51'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                NIP-51
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'qr' && (
            <div className="text-center">
              <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-sm" style={{ maxWidth: 'min(100%, 280px)' }}>
                {qrError ? (
                  <div className="w-64 h-64 flex items-center justify-center text-red-500">
                    <p>{qrError}</p>
                  </div>
                ) : (
                  <div className="w-64 h-64 flex items-center justify-center">
                    <canvas 
                      ref={canvasRef}
                      className="rounded-lg max-w-full max-h-full object-contain"
                      width={256}
                      height={256}
                    />
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {naddr 
                  ? "Scan this QR code to subscribe to this NIP-51 list on Nostr"
                  : "Scan this QR code to import these follows"
                }
              </p>
              
              <div className="flex justify-center gap-2 mb-4">
                <button
                  onClick={handleDownloadQR}
                  disabled={!qrDataUrl}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Download QR
                </button>
              </div>
              
              {naddr && (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">List Address (naddr):</p>
                  <p className="text-xs font-mono break-all">{naddr}</p>
                </div>
              )}
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <span className="font-medium">💡 How to import:</span>
                </p>
                <ol className="text-sm text-blue-700 dark:text-blue-300 mt-2 ml-4 list-decimal space-y-1">
                  <li>Open your Nostr client (Amethyst, Damus, etc.)</li>
                  <li>Go to Lists or search for the list address</li>
                  <li>Scan this QR code or enter the naddr</li>
                  <li>Subscribe to the list to follow all accounts</li>
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
                NIP-02 formatted follow list:
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
            </div>
          )}

          {activeTab === 'nip51' && (
            <div>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <span className="font-medium">✨ NIP-51 List Published!</span>
                </p>
              </div>
              
              {naddr && (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">List Address (naddr):</p>
                  <div className="flex gap-2">
                    <code className="flex-1 text-xs font-mono bg-white dark:bg-gray-800 p-2 rounded break-all">{naddr}</code>
                    <button
                      onClick={() => handleCopy(naddr)}
                      className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
              
              {burnerNpub && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Published by (burner):</p>
                  <p className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all">{burnerNpub}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedAccounts.length} accounts
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
