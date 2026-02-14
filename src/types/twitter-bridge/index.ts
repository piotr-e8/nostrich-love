// Twitter Bridge - Type Definitions

export interface TwitterAccount {
  twitterHandle: string;
  twitterName?: string;
  twitterAvatar?: string;
  twitterBio?: string;
  twitterFollowers?: number;
}

export interface NostrMatch {
  npub: string;
  name: string;
  username?: string;
  picture?: string;
  bio: string;
  nip05?: string;
  lud16?: string;
  verified?: boolean;
}

export interface MatchedAccount {
  twitter: TwitterAccount;
  nostr: NostrMatch;
  confidence: 'high' | 'medium' | 'low'; // How confident the match is
  matchSource: 'nip05' | 'bio' | 'manual' | 'directory'; // How the match was found
}

export interface BridgeSearchState {
  twitterHandle: string;
  isLoading: boolean;
  error: string | null;
  results: MatchedAccount[];
  hasSearched: boolean;
}

export interface TwitterSearchProps {
  onSearch: (handle: string) => void;
  onUploadCSV?: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

export interface ResultsListProps {
  results: MatchedAccount[];
  selectedAccounts: Set<string>;
  onToggleSelection: (npub: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onViewProfile: (account: MatchedAccount) => void;
  onFollowAll: () => void;
}

export interface FollowPackGeneratorProps {
  selectedAccounts: MatchedAccount[];
  onClose: () => void;
  isOpen: boolean;
}

export interface CSVUploadResult {
  handles: string[];
  total: number;
  valid: number;
  errors: string[];
}
