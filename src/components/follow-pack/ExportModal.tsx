import React, { useState, useMemo, useEffect, useRef, useCallback, useId } from 'react';
import QRCode from 'qrcode';
import { nip19 } from 'nostr-tools';
import type { CuratedAccount } from '../../types/follow-pack';
import { getCategoryById } from '../../data/follow-pack';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { PUBLISH_RELAYS, STARTER_PACK_KIND, signStarterPack } from './starterPackEvent';

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

const RELAYS: readonly string[] = PUBLISH_RELAYS;

const pendingResults = (): RelayResult[] =>
  RELAYS.map(url => ({ url, status: 'pending' as RelayStatus }));

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
  const [relayResults, setRelayResults] = useState<RelayResult[]>(pendingResults);
  const [burnerNpub, setBurnerNpub] = useState<string | null>(null);
  const [burnerPk, setBurnerPk] = useState<string | null>(null);
  const [listId, setListId] = useState<string | null>(null);
  const [naddr, setNaddr] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'checking' | 'verified' | 'not_found'>('idle');
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRefs = useRef<WebSocket[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isMountedRef = useRef(true);
  const hasPublishedRef = useRef(false);
  const packNameId = useId();
  const consentHeadingId = useId();
  const tabsId = useId();
  // Trap focus inside the dialog; Escape closes, focus returns to the opener.
  // Initial focus lands on the first focusable element, which is the header's
  // close button — never the publish button.
  const modalRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  // NOTHING is published on open. Publishing happens only from the confirm
  // button in the consent panel (audit finding #112: this used to be a mount
  // effect that fired a signed event at three relays before the user had seen
  // the dialog). tests/follow-pack.test.ts guards against its return.

  // Reset state when modal closes and cleanup resources
  useEffect(() => {
    if (!isOpen) {
      hasPublishedRef.current = false;
      setPublishStatus('idle');
      setRelayResults(pendingResults());
      setBurnerNpub(null);
      setBurnerPk(null);
      setListId(null);
      setNaddr(null);
      setQrDataUrl(null);
      setVerificationStatus('idle');
      setDebugInfo([]);
      setActiveTab('qr');
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

  /**
   * Re-query the relays for the event that was just published.
   *
   * Both arguments are optional so the "Check again" button can call this with
   * none and fall back to state. It used to bail out on `if (!eventId &&
   * !pubkey) return` before reaching that fallback, which made the button a
   * no-op — invisible while the whole block hid inside a <details>.
   */
  const verifyEventOnRelays = useCallback(async (pubkey?: string, identifier?: string) => {
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
            // Query by the 'd' tag (identifier) for starter packs
            const filter = {
              kinds: [STARTER_PACK_KIND],
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

  /**
   * Publish the pack as a public NIP-51 list.
   *
   * Only ever invoked by the confirm button in the consent panel below. Reads
   * `packName` at call time, so the title the user typed is the title that
   * ships — when this ran from a mount effect it always published the default.
   */
  const publishToNostr = useCallback(async () => {
    if (selectedAccounts.length === 0 || hasPublishedRef.current) return;
    hasPublishedRef.current = true;

    setPublishStatus('publishing');
    setRelayResults(pendingResults());
    addDebug('Starting publish...');

    try {
      const { event: signedEvent, identifier, pubkey, npub, undecodable } = signStarterPack(
        selectedAccounts,
        packName
      );

      setBurnerNpub(npub);
      setBurnerPk(pubkey);
      setListId(identifier);
      addDebug(`Generated burner key: ${npub.slice(0, 20)}...`);
      addDebug(`Creating event with listId: ${identifier}`);
      undecodable.forEach(name => addDebug(`Failed to decode npub for ${name}`));
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

                  // NIP-01: ["OK", <id>, <accepted:bool>, <message>]. The
                  // boolean is the verdict and it MUST be read — matching on
                  // the id alone reported `["OK", id, false, "blocked"]` as
                  // "Saved" and then told the user their list was public on
                  // relays that had refused it.
                  if (data[0] === 'OK' && data[1] === signedEvent.id) {
                    if (!resolved) {
                      resolved = true;
                      clearTimeout(responseTimeout);
                      clearTimeout(timeout);
                      ws.close();
                      resolve(
                        data[2] === true
                          ? { url: relayUrl, status: 'success' }
                          : {
                              url: relayUrl,
                              status: 'error',
                              error: data[3] || 'Relay rejected event',
                            }
                      );
                    }
                  }
                } catch (e) {
                  addDebug(`[${relayUrl}] Error parsing message: ${e}`);
                }
              };
            };

            ws.onerror = () => {
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
        const successfulRelays = results
          .filter(r => r.status === 'success')
          .map(r => r.url.replace('wss://', ''));

        const naddrEncoded = nip19.naddrEncode({
          kind: STARTER_PACK_KIND,
          pubkey,
          identifier,
          relays: successfulRelays.slice(0, 2), // Include up to 2 relay hints
        });
        setNaddr(naddrEncoded);
        addDebug(`Generated naddr: ${naddrEncoded.slice(0, 30)}...`);
        addDebug(`Relay hints: ${successfulRelays.slice(0, 2).join(', ')}`);

        setPublishStatus('published');

        // Wait a moment then verify
        const verifyTimeout = setTimeout(() => {
          if (isMountedRef.current) {
            verifyEventOnRelays(pubkey, identifier);
          }
        }, 2000);
        timeoutsRef.current.push(verifyTimeout);
      } else {
        setPublishStatus('error');
        // Nothing landed anywhere — let the user try again.
        hasPublishedRef.current = false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      addDebug(`Fatal error: ${errorMsg}`);
      console.error('Failed to publish:', err);
      setPublishStatus('error');
      hasPublishedRef.current = false;
    }
  }, [selectedAccounts, packName, addDebug, verifyEventOnRelays]);

  // Generate npub list for copy
  const npubList = useMemo(() => {
    return selectedAccounts.map(a => a.npub).join('\n');
  }, [selectedAccounts]);

  // Generate NIP-02 format.
  //
  // NIP-02 p tags are ["p", <32-byte hex pubkey>, <relay>, <petname>]. This used
  // to emit the bech32 `npub1...` instead, so the file labelled "NIP-02" was not
  // NIP-02 and a client importing it follows nobody. buildStarterPackEvent
  // already decodes for the NIP-51 path; this one did not.
  const nip02Data = useMemo(() => {
    return {
      kind: 3,
      tags: selectedAccounts.flatMap(account => {
        try {
          const { data } = nip19.decode(account.npub);
          return [['p', data as string, '', account.name]];
        } catch {
          // Shipping an invalid tag is worse than one missing row.
          return [];
        }
      }),
      content: '',
    };
  }, [selectedAccounts]);

  // The QR encodes nostr:<naddr> — a published list clients can actually
  // fetch. There is no pre-publish QR: the old nostr:list?d=<base64> payload
  // was not a valid NIP-21 URI (no client parses it) and overflowed QR
  // capacity at ~19 accounts, inside the 20-50 range this page recommends.
  // Before publishing, the QR tab shows a chooser instead.
  const nostrUrl = useMemo(() => (naddr ? `nostr:${naddr}` : null), [naddr]);

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
          // An naddr is ~120 chars, far under QR capacity — this path should
          // be unreachable, but if it fires, point somewhere that works.
          setQrError('Could not generate the QR code. Use the "Copy List" tab instead.');
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
      .sort(([, a], [, b]) => b - a)
      .map(([catId, count]) => ({
        category: getCategoryById(catId),
        count,
      }))
      .filter(item => item.category);
  }, [selectedAccounts]);

  const successfulRelayCount = relayResults.filter(r => r.status === 'success').length;

  if (!isOpen) return null;

  const localOnlyNote = (
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
      Nothing leaves your browser on this tab.
    </p>
  );

  // Offline exports first, publishing last — the three that touch no network are
  // the ones a beginner should reach for.
  const tabs: Array<{ id: ExportMethod; label: string }> = [
    { id: 'qr', label: 'QR Code' },
    { id: 'copy', label: 'Copy List' },
    { id: 'nip02', label: 'NIP-02' },
    { id: 'nip51', label: 'Publish (optional)' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-raised dark:border-gray-800 dark:bg-gray-900"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <h2 id="export-modal-title" className="text-h2 text-gray-900 dark:text-white">
                Export Follow Pack
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {selectedAccounts.length} accounts ready to export
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close export dialog"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Pack name input */}
          <div className="mt-4">
            <label htmlFor={packNameId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pack Name
            </label>
            <input
              id={packNameId}
              type="text"
              value={packName}
              onChange={(e) => setPackName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter a name for your follow pack"
            />
          </div>

          {/* Category breakdown. The category colour is a 700-level shade: it
              reads as a fill (white on it clears AA) but NOT as text — as
              `color` over a 10%-alpha tint of itself on a dark surface it lands
              at 1.4-2.7:1. So it stays in the dot, and the label uses neutrals,
              which is what PackSidebar already does. */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categoryBreakdown.map(({ category, count }) => (
              <span
                key={category!.id}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2 py-1 text-caption font-medium text-gray-700 dark:border-gray-800 dark:text-gray-200"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category!.color }}
                  aria-hidden="true"
                />
                {category!.name}: {count}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex" role="tablist" aria-label="Export method">
            {tabs.map(tab => (
              <button
                key={tab.id}
                id={`${tabsId}-tab-${tab.id}`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tabsId}-panel`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onKeyDown={(e) => {
                  const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
                  if (step === 0) return;
                  e.preventDefault();
                  // Arrow keys follow reading order, so they flip with `dir`.
                  const dir = document.documentElement.dir === 'rtl' ? -step : step;
                  const index = tabs.findIndex(t => t.id === activeTab);
                  const next = tabs[(index + dir + tabs.length) % tabs.length];
                  setActiveTab(next.id);
                  document.getElementById(`${tabsId}-tab-${next.id}`)?.focus();
                }}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-center
                  border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-primary-600 text-primary-text dark:border-primary-400 dark:text-primary-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div
          id={`${tabsId}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabsId}-tab-${activeTab}`}
          className="flex-1 overflow-y-auto p-6"
        >
          {activeTab === 'qr' && naddr && (
            <div className="text-center">
              <div className="mb-4 inline-block rounded-lg border border-gray-200 bg-white p-4" style={{ maxWidth: 'min(100%, 280px)' }}>
                {qrError ? (
                  <div className="flex h-64 w-64 items-center justify-center text-danger-700">
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
                Scan this QR code to subscribe to the list you published
              </p>

              <div className="flex justify-center gap-2 mb-4">
                <button
                  onClick={handleDownloadQR}
                  disabled={!qrDataUrl}
                  className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Download QR
                </button>
              </div>

              <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-start dark:border-gray-800 dark:bg-gray-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">List address (naddr):</p>
                <p className="text-xs font-mono break-all">{naddr}</p>
              </div>

              <div className="border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950 rounded-lg p-4 text-start">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <span className="font-medium">How to import:</span>
                </p>
                <ol className="text-sm text-blue-800 dark:text-blue-200 mt-2 ms-4 list-decimal space-y-1">
                  <li>Open your Nostr client (Amethyst, Damus, etc.)</li>
                  <li>Find its QR scanner or "Import follows" screen</li>
                  <li>Scan this code</li>
                  <li>Confirm the follows in your client</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'qr' && !naddr && (
            <div className="text-center">
              <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-6 text-start dark:border-gray-800 dark:bg-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  A scannable QR needs the list published first
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  The QR code carries the address of your list on nostr relays, so your
                  client can fetch it. Publish the list (you review exactly what goes
                  out first), then come back here to scan.
                </p>
                <button
                  onClick={() => setActiveTab('nip51')}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Review &amp; publish to get a QR
                </button>
              </div>

              <div className="border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950 rounded-lg p-4 text-start">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <span className="font-medium">Prefer not to publish anything?</span>{' '}
                  The "Copy List" tab works right now, however many accounts you picked.
                  Nothing leaves your browser.
                </p>
              </div>

              {localOnlyNote}
            </div>
          )}

          {activeTab === 'copy' && (
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Copy this list and paste it into your client's "Import follows" feature:
              </p>
              <div className="relative">
                <textarea
                  readOnly
                  aria-label="Follow pack npub list to copy"
                  value={npubList}
                  className="w-full h-48 p-4 text-sm font-mono bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-300 resize-none"
                />
                <button
                  onClick={() => handleCopy(npubList)}
                  className="absolute top-2 end-2 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              {localOnlyNote}
            </div>
          )}

          {activeTab === 'nip02' && (
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                NIP-02 formatted follow list (kind 3), for clients that import a file:
              </p>
              <div className="relative">
                <pre className="w-full h-48 p-4 text-xs font-mono bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-300 overflow-auto">
                  {JSON.stringify(nip02Data, null, 2)}
                </pre>
                <div className="absolute top-2 end-2 flex gap-2">
                  <button
                    onClick={() => handleCopy(JSON.stringify(nip02Data, null, 2))}
                    className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              {localOnlyNote}
            </div>
          )}

          {activeTab === 'nip51' && (
            <div>
              {/* ---------------- CONSENT GATE ---------------- */}
              {publishStatus === 'idle' && (
                <div role="group" aria-labelledby={consentHeadingId} className="space-y-4">
                  <div>
                    <h3 id={consentHeadingId} className="text-h3 text-gray-900 dark:text-white">
                      Publish this pack as a public Nostr list?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      This is optional. Every other tab here works without it, and none of
                      them send anything anywhere.
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                    <div className="p-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        What gets published
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        A NIP-51 starter pack (kind {STARTER_PACK_KIND}) containing the public
                        keys of the {selectedAccounts.length} account
                        {selectedAccounts.length === 1 ? '' : 's'} you selected, the pack name
                        “{packName}”, and one line noting it came from nostrich.love. Your
                        selection <strong>is</strong> the content: anyone reading the list learns
                        exactly which accounts you picked.
                      </p>
                    </div>

                    <div className="p-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Where it goes
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        These {RELAYS.length} public relays:
                      </p>
                      <ul className="mt-2 space-y-1">
                        {RELAYS.map(relay => (
                          <li key={relay} className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
                            {relay}
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        Relays copy events to each other, so expect it to spread further than
                        this list.
                      </p>
                    </div>

                    <div className="p-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Who signs it
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        A throwaway key generated in your browser and discarded right after.
                        It is not linked to any account you own. Nobody keeps it,{' '}
                        <strong>not even you</strong>, so you will not be able to edit or
                        delete this list later.
                      </p>
                    </div>

                    <div className="p-4 bg-warning-50 dark:bg-warning-950">
                      <p className="text-sm font-semibold text-warning-900 dark:text-warning-100 mb-1">
                        It is public and effectively permanent
                      </p>
                      <p className="text-sm text-warning-900 dark:text-warning-100">
                        Anyone can read it. Nostr has no reliable delete: a deletion request is
                        only a hint that relays may ignore, and copies already made stay.
                        Treat this as permanent.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row-reverse gap-3 pt-2">
                    {/* Keep it local is the primary, low-risk action. */}
                    <button
                      onClick={() => setActiveTab('qr')}
                      className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Keep it local
                    </button>
                    <button
                      onClick={publishToNostr}
                      disabled={selectedAccounts.length === 0}
                      className="flex-1 px-4 py-2.5 rounded-lg font-medium border border-danger-300 dark:border-danger-800 text-danger-800 dark:text-danger-300 hover:bg-danger-50 dark:hover:bg-danger-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Publish to {RELAYS.length} public relays
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------- IN FLIGHT ---------------- */}
              {publishStatus === 'publishing' && (
                <div
                  className="border border-warning-200 bg-warning-50 dark:border-warning-900 dark:bg-warning-950 rounded-lg p-4 flex items-center gap-3"
                  role="status"
                  aria-live="polite"
                >
                  <div className="animate-spin w-5 h-5 border-2 border-warning-600 border-t-transparent rounded-full" aria-hidden="true"></div>
                  <p className="text-sm text-warning-900 dark:text-warning-100">
                    Publishing your list to {RELAYS.length} relays…
                  </p>
                </div>
              )}

              {/* ---------------- RESULT ---------------- */}
              {(publishStatus === 'published' || publishStatus === 'error') && (
                <div className="space-y-4" role="status" aria-live="polite">
                  {publishStatus === 'published' ? (
                    <div className="border border-success-200 bg-success-50 dark:border-success-900 dark:bg-success-950 rounded-lg p-4">
                      <p className="text-sm font-semibold text-success-900 dark:text-success-100">
                        Published.
                      </p>
                      <p className="text-sm text-success-900 dark:text-success-100 mt-1">
                        This list is now public on {successfulRelayCount} of {RELAYS.length}{' '}
                        relays. It cannot be edited or removed.
                      </p>
                    </div>
                  ) : (
                    <div className="border border-danger-200 bg-danger-50 dark:border-danger-900 dark:bg-danger-950 rounded-lg p-4">
                      <p className="text-sm font-semibold text-danger-900 dark:text-danger-100">
                        Nothing was published.
                      </p>
                      <p className="text-sm text-danger-900 dark:text-danger-100 mt-1">
                        No relay accepted the event, so no list exists. The other export
                        tabs still work.
                      </p>
                      <button
                        onClick={publishToNostr}
                        className="mt-2 text-sm text-danger-800 dark:text-danger-200 underline"
                      >
                        Try publishing again
                      </button>
                    </div>
                  )}

                  {/* Relay results, expanded — not hidden behind a disclosure */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Relay results
                    </p>
                    <div className="space-y-1">
                      {relayResults.map((relay) => (
                        <div key={relay.url} className="flex items-center justify-between gap-2 text-sm">
                          <span className="text-gray-700 dark:text-gray-300 font-mono truncate flex-1">{relay.url}</span>
                          {relay.status === 'success' && (
                            <span className="text-success-800 dark:text-success-300 ms-2 flex-shrink-0">Saved</span>
                          )}
                          {relay.status === 'error' && (
                            <span className="text-danger-800 dark:text-danger-300 ms-2 flex-shrink-0" title={relay.error}>Failed</span>
                          )}
                          {relay.status === 'pending' && (
                            <span className="text-gray-600 dark:text-gray-400 ms-2 flex-shrink-0">Pending</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {naddr && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        List address (naddr). Share it so other people can subscribe:
                      </p>
                      <div className="flex gap-2">
                        <code className="flex-1 text-xs font-mono bg-white dark:bg-gray-800 p-2 rounded break-all">{naddr}</code>
                        <button
                          onClick={() => handleCopy(naddr)}
                          className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                        >
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  )}

                  {burnerNpub && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Published by (throwaway key, already discarded):
                      </p>
                      <p className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all">{burnerNpub}</p>
                    </div>
                  )}

                  {/* Verification */}
                  {verificationStatus !== 'idle' && (
                    <div className={`rounded-lg p-3 ${
                      verificationStatus === 'verified' ? 'border border-success-200 bg-success-50 dark:border-success-900 dark:bg-success-950' :
                      verificationStatus === 'not_found' ? 'border border-warning-200 bg-warning-50 dark:border-warning-900 dark:bg-warning-950' :
                      'border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950'
                    }`}>
                      {verificationStatus === 'checking' && (
                        <p className="text-sm text-blue-900 dark:text-blue-100 flex items-center gap-2">
                          <span className="animate-spin inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" aria-hidden="true"></span>
                          Checking that the event is really there…
                        </p>
                      )}
                      {verificationStatus === 'verified' && (
                        <p className="text-sm text-success-900 dark:text-success-100">
                          Confirmed on at least one relay.
                        </p>
                      )}
                      {verificationStatus === 'not_found' && (
                        <div>
                          <p className="text-sm text-warning-900 dark:text-warning-100">
                            Not found yet. It may still be spreading between relays.
                          </p>
                          <button
                            onClick={() => verifyEventOnRelays()}
                            className="mt-2 text-xs text-warning-800 dark:text-warning-200 underline"
                          >
                            Check again
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Debug Info */}
                  {debugInfo.length > 0 && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                        Technical log ({debugInfo.length} entries)
                      </summary>
                      <div className="mt-2 bg-gray-100 dark:bg-gray-900 p-2 rounded max-h-32 overflow-y-auto font-mono">
                        {debugInfo.map((msg, i) => (
                          <div key={i} className="text-gray-600 dark:text-gray-400">{msg}</div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedAccounts.length} accounts
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
