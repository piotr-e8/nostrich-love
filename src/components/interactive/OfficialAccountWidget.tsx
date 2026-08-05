import React, { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  ExternalLink,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";

interface NostrProfile {
  name?: string;
  display_name?: string;
  picture?: string;
  about?: string;
  nip05?: string;
  lud16?: string;
  website?: string;
}

interface NostrNote {
  id: string;
  pubkey: string;
  created_at: number;
  content: string;
  sig: string;
}

interface OfficialAccountWidgetProps {
  className?: string;
  expanded?: boolean;
  onExpandToggle?: () => void;
}

const OFFICIAL_NIP05 = "_@nostrich.love";

// Bootstrap relays to query for relay list (kind:10002) and profile (kind:0)
const BOOTSTRAP_RELAYS = [
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://relay.snort.social",
];

const CACHE_KEY = "nostrich-official-account";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function OfficialAccountWidget({
  className,
  expanded = false,
  onExpandToggle,
}: OfficialAccountWidgetProps) {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<NostrProfile | null>(null);
  const [notes, setNotes] = useState<NostrNote[]>([]);
  const [npub, setNpub] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Resolve NIP-05 to get npub
  const resolveNIP05 = useCallback(async (): Promise<string | null> => {
    try {
      const [name, domain] = OFFICIAL_NIP05.split("@");
      const response = await fetch(
        `https://${domain}/.well-known/nostr.json?name=${name}`
      );
      if (!response.ok) throw new Error("Failed to resolve NIP-05");
      const data = await response.json();
      const pubkey = data.names?.[name];
      if (!pubkey) throw new Error("NIP-05 not found");
      return pubkey;
    } catch (err) {
      console.error("NIP-05 resolution error:", err);
      return null;
    }
  }, []);

  // Query a single relay and return events
  const queryRelay = useCallback(
    (relayUrl: string, filters: object[]): Promise<any[]> => {
      return new Promise((resolve) => {
        const events: any[] = [];
        const timeout = setTimeout(() => {
          resolve(events);
        }, 4000);

        try {
          const ws = new WebSocket(relayUrl);
          
          ws.onopen = () => {
            ws.send(
              JSON.stringify([
                "REQ",
                `req-${Math.random().toString(36).substr(2, 9)}`,
                ...filters,
              ])
            );
          };

          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              if (data[0] === "EVENT") {
                events.push(data[2]);
              } else if (data[0] === "EOSE") {
                clearTimeout(timeout);
                ws.close();
                resolve(events);
              }
            } catch (e) {
              console.error("WebSocket parse error:", e);
            }
          };

          ws.onerror = () => {
            clearTimeout(timeout);
            ws.close();
            resolve(events);
          };

          ws.onclose = () => {
            clearTimeout(timeout);
            resolve(events);
          };
        } catch (e) {
          clearTimeout(timeout);
          resolve(events);
        }
      });
    },
    []
  );

  // Fetch relay list (kind:10002) and profile (kind:0) from bootstrap relays
  const fetchRelayListAndProfile = useCallback(
    async (pubkey: string): Promise<{ relayList: string[]; profile: NostrProfile | null }> => {
      console.log("[Outbox] Querying bootstrap relays for relay list and profile...");
      
      const results = await Promise.all(
        BOOTSTRAP_RELAYS.map(async (relayUrl) => {
          const events = await queryRelay(relayUrl, [
            { kinds: [10002], authors: [pubkey], limit: 1 },
            { kinds: [0], authors: [pubkey], limit: 1 },
          ]);
          return { relayUrl, events };
        })
      );

      let profile: NostrProfile | null = null;
      const relayList: string[] = [];

      for (const result of results) {
        for (const event of result.events) {
          if (event.kind === 10002 && relayList.length === 0) {
            // Parse relay list from tags
            // Tags format: ["r", "wss://relay.url", "write"] or ["r", "wss://relay.url"]
            for (const tag of event.tags) {
              if (tag[0] === "r" && tag[1]) {
                const url = tag[1];
                const marker = tag[2]; // "write", "read", or undefined
                // Include if it's a write relay or no marker (both)
                if (!marker || marker === "write") {
                  relayList.push(url);
                }
              }
            }
            console.log(`[Outbox] Found relay list from ${result.relayUrl}:`, relayList);
          }
          if (event.kind === 0 && !profile) {
            try {
              profile = JSON.parse(event.content);
              console.log(`[Outbox] Got profile from ${result.relayUrl}:`, profile?.name);
            } catch (e) {
              console.error("Failed to parse profile:", e);
            }
          }
        }
      }

      return { relayList, profile };
    },
    [queryRelay]
  );

  // Check if an event is a reply (has 'e' tags or starts with mention)
  const isReply = (event: any): boolean => {
    // Check for 'e' tags (reply to event) or 'p' tags (mention) in first position
    const hasReplyTag = event.tags?.some((tag: string[]) => 
      tag[0] === 'e' || (tag[0] === 'p' && event.tags.indexOf(tag) === 0)
    );
    
    // Check if content starts with @mention (reply to someone)
    const startsWithMention = event.content?.trim().startsWith('@');
    
    return hasReplyTag || startsWithMention;
  };

  // Fetch notes (kind:1) from user's write relays (outbox model)
  const fetchNotesFromRelays = useCallback(
    async (pubkey: string, relayList: string[]): Promise<NostrNote[]> => {
      // If no relay list found, fall back to bootstrap relays
      const relaysToQuery = relayList.length > 0 ? relayList : BOOTSTRAP_RELAYS;
      console.log(`[Outbox] Querying ${relaysToQuery.length} relays for notes:`, relaysToQuery);
      
      const results = await Promise.all(
        relaysToQuery.map(async (relayUrl) => {
          const events = await queryRelay(relayUrl, [
            { kinds: [1], authors: [pubkey], limit: 20 },
          ]);
          return { relayUrl, events };
        })
      );

      const allNotes: NostrNote[] = [];
      for (const result of results) {
        console.log(`[Outbox] Got ${result.events.length} notes from ${result.relayUrl}`);
        for (const event of result.events) {
          // Skip replies
          if (isReply(event)) {
            console.log(`[Outbox] Skipping reply: ${event.id.slice(0, 8)}...`);
            continue;
          }
          allNotes.push({
            id: event.id,
            pubkey: event.pubkey,
            created_at: event.created_at,
            content: event.content,
            sig: event.sig,
          });
        }
      }

      // Remove duplicates and sort by created_at descending
      const uniqueNotes = allNotes.filter((note, index, self) => 
        index === self.findIndex(n => n.id === note.id)
      );
      uniqueNotes.sort((a, b) => b.created_at - a.created_at);
      
      console.log(`[Outbox] Total unique notes (excluding replies): ${uniqueNotes.length}`);
      return uniqueNotes.slice(0, 20);
    },
    [queryRelay]
  );

  // Load data with caching
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          console.log("Using cached official account data");
          setProfile(data.profile);
          setNotes(data.notes);
          setNpub(data.npub);
          setLoading(false);
          return;
        }
      }

      // Resolve NIP-05
      console.log("Resolving NIP-05:", OFFICIAL_NIP05);
      const pubkey = await resolveNIP05();
      console.log("Resolved pubkey:", pubkey);
      if (!pubkey) {
        setError(t("officialAccount.errors.nip05Failed") || "Failed to resolve NIP-05");
        setLoading(false);
        return;
      }

      setNpub(pubkey);

      // Step 1: Fetch relay list and profile from bootstrap relays
      const { relayList, profile: fetchedProfile } = await fetchRelayListAndProfile(pubkey);
      setProfile(fetchedProfile);

      // Step 2: Fetch notes from user's write relays (outbox model)
      const fetchedNotes = await fetchNotesFromRelays(pubkey, relayList);
      setNotes(fetchedNotes);

      console.log("Fetched:", { profile: fetchedProfile, notesCount: fetchedNotes.length });

      // Cache results
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: { profile: fetchedProfile, notes: fetchedNotes, npub: pubkey },
          timestamp: Date.now(),
        })
      );
    } catch (err) {
      setError(t("officialAccount.errors.loadFailed") || "Failed to load account data");
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolveNIP05, fetchRelayListAndProfile, fetchNotesFromRelays]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);
    if (seconds < 60) return t("time.justNow") || "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  // Simple URL auto-linking
  const linkifyText = (text: string): React.ReactNode => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, i) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 underline"
            onClick={(e) => e.stopPropagation()}
          >
            {part.length > 40 ? part.slice(0, 40) + "..." : part}
          </a>
        );
      }
      return part;
    });
  };

  const displayName = profile?.display_name || profile?.name || OFFICIAL_NIP05;
  const displayPicture = profile?.picture || null;
  const visibleNotes = expanded ? notes : notes.slice(0, 3);

  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          {displayPicture ? (
            <img
              src={displayPicture}
              alt={displayName}
              // Matches w-12/h-12 (48px) so the row does not reflow when this
              // remote avatar arrives. See AccountCard for the same reasoning.
              width={48}
              height={48}
              loading="lazy"
              decoding="async"
              className="w-12 h-12 rounded-full object-cover border-2 border-orange-200 dark:border-orange-900"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <div
            className={cn(
              "w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center border-2 border-orange-200 dark:border-orange-900",
              displayPicture ? "hidden" : ""
            )}
          >
            <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {displayName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {OFFICIAL_NIP05}
          </p>
        </div>
        <a
          href={`https://njump.me/${OFFICIAL_NIP05}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title={t("officialAccount.viewProfile") || "View profile on Njump"}
        >
          <ExternalLink className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </a>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin motion-reduce:animate-none">
            <RefreshCw className="w-6 h-6 text-orange-500" />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center gap-3 py-6 animate-slide-down motion-reduce:animate-none">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {error}
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900 transition-colors text-sm font-medium"
          >
            {t("officialAccount.tryAgain") || "Try Again"}
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Profile Bio */}
          {profile?.about && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {profile.about}
            </p>
          )}

          {/* Recent Posts */}
          {visibleNotes.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t("officialAccount.recentPosts") || "Recent Posts"}
              </h4>
              {visibleNotes.map((note, index) => (
                  <div
                    key={note.id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group animate-slide-up motion-reduce:animate-none"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() =>
                      window.open(
                        `https://njump.me/${note.id}`,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:line-clamp-none transition-all">
                      {linkifyText(note.content)}
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
                      {formatTimeAgo(note.created_at)}
                    </span>
                  </div>
              ))}
            </div>
          )}

          {/* Expand/Collapse Button */}
          {notes.length > 3 && (
            <button
              onClick={onExpandToggle}
              className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  {t("officialAccount.showLess") || "Show Less"}
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  {t("officialAccount.showMore") || "Show More"}
                </>
              )}
            </button>
          )}

          {/* No Posts State */}
          {notes.length === 0 && profile && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("officialAccount.noPosts") || "No recent posts"}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Follow @_@nostrich.love on Nostr to see new posts
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
