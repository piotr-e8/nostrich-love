/**
 * Mock Threads/Conversations Database
 * 20+ nested conversation threads with realistic discussions
 */

import type { MockThread, MockNote } from './types';
import { EventKind, ContentCategory } from './types';
import { generateHex, generateRealisticTimestamp, generateSig, generateEngagement, createTags, extractHashtags, extractMentions, extractUrls } from './utils';
import { mockUsers, getRandomUsers, getUserByPubkey } from './users';

// Thread topics and structures
interface ThreadTemplate {
  rootContent: string;
  category: ContentCategory;
  replies: ReplyTemplate[];
}

interface ReplyTemplate {
  content: string;
  authorIndex?: number; // Specific author or random
  replies?: ReplyTemplate[]; // Nested replies
}

// Thread templates
const threadTemplates: ThreadTemplate[] = [
  // Thread 1: Bitcoin for Beginners
  {
    rootContent: 'I\'m new to Bitcoin and feeling overwhelmed. Where should I start? There\'s so much information out there.',
    category: ContentCategory.BITCOIN,
    replies: [
      {
        content: 'Welcome! Start with the Bitcoin Standard by Saifedean Ammous. Best introduction to the "why" of Bitcoin.',
        replies: [
          {
            content: 'Second this. It completely changed my perspective on money.',
          },
          {
            content: 'Also check out the "What is Money" podcast series by Robert Breedlove after you read it.',
          },
        ],
      },
      {
        content: 'Don\'t buy any Bitcoin until you understand what you\'re buying. Take your time.',
        replies: [
          {
            content: 'This is the best advice. I rushed in during the 2021 bull run and panic sold. Learn first.',
          },
        ],
      },
      {
        content: 'The Whitepaper is surprisingly readable. Start there: https://bitcoin.org/bitcoin.pdf',
      },
    ],
  },
  
  // Thread 2: Nostr Client Recommendations
  {
    rootContent: 'What\'s the best Nostr client for iOS? I\'ve been using Damus but curious about alternatives.',
    category: ContentCategory.NOSTR,
    replies: [
      {
        content: 'Damus is solid. Primal is also great if you want better performance.',
        replies: [
          {
            content: 'Second Primal. The caching makes it so much faster.',
          },
          {
            content: 'Primal +1. The UI is cleaner too.',
          },
        ],
      },
      {
        content: 'I switch between Damus and Nos depending on my mood. Both are good.',
      },
      {
        content: 'If you want something different, check out NostrChat for a more messaging-focused experience.',
      },
    ],
  },
  
  // Thread 3: Lightning Network Discussion
  {
    rootContent: 'Can someone explain how the Lightning Network actually works? I get the basic concept but want to understand the mechanics.',
    category: ContentCategory.TECH,
    replies: [
      {
        content: 'Think of it like opening a tab at a bar. You and the bartender agree on how much you\'re good for, then make multiple transactions off-chain.',
        replies: [
          {
            content: 'That\'s a great analogy! So simple yet accurate.',
          },
          {
            content: 'And the key is that either of you can settle up on-chain at any time.',
          },
        ],
      },
      {
        content: 'It\'s payment channels + routing. Channels are between two parties, routing allows you to pay anyone connected to the network.',
        replies: [
          {
            content: 'The routing part is what makes it powerful. You don\'t need a direct channel to pay someone.',
          },
        ],
      },
      {
        content: 'Mastering Lightning is a great free book that explains everything in detail: https://lnbook.info',
      },
    ],
  },
  
  // Thread 4: Self-Custody Security
  {
    rootContent: 'Just got a hardware wallet. What\'s the best way to backup the seed phrase? I\'m paranoid about losing it.',
    category: ContentCategory.BITCOIN,
    replies: [
      {
        content: 'Metal seed storage is the way to go. Steel or titanium. Paper degrades.',
        replies: [
          {
            content: 'Any specific brand recommendations?',
            replies: [
              {
                content: 'Cryptosteel, Billfodl, and Seedplate are all solid. I use Cryptosteel.',
              },
            ],
          },
        ],
      },
      {
        content: 'Consider a multisig setup if you have significant holdings. 2-of-3 is popular.',
      },
      {
        content: 'Don\'t store it in a safe deposit box at a bank. That\'s the first place they\'ll look.',
        replies: [
          {
            content: 'Counterpoint: a safe deposit box at a different bank than your main one is fine for part of a multisig setup.',
          },
        ],
      },
    ],
  },
  
  // Thread 5: Programming Language Discussion
  {
    rootContent: 'Learning to code and can\'t decide between Python and JavaScript. Which should I start with?',
    category: ContentCategory.PROGRAMMING,
    replies: [
      {
        content: 'What do you want to build? Python for data/AI/backend, JavaScript if you want to build websites.',
        replies: [
          {
            content: 'Good point. JavaScript is more versatile since you can do frontend and backend with it.',
          },
        ],
      },
      {
        content: 'Python is easier to learn IMO. More readable syntax.',
      },
      {
        content: 'If you\'re interested in Nostr dev, both work great. Lots of libraries in both languages.',
      },
    ],
  },
  
  // Thread 6: Bitcoin Philosophy
  {
    rootContent: 'Why do we say Bitcoin is "sound money"? What makes money "sound" vs "unsound"?',
    category: ContentCategory.PHILOSOPHY,
    replies: [
      {
        content: 'Sound money is scarce, durable, divisible, portable, and recognizable. Bitcoin is all of these.',
        replies: [
          {
            content: 'Don\'t forget fungible! Each sat is interchangeable with any other sat.',
          },
        ],
      },
      {
        content: 'Unsound money can be inflated arbitrarily. Sound money has a fixed supply that can\'t be manipulated.',
      },
      {
        content: 'The term comes from when coins were actually made of sound (pure) metal vs debased metal.',
        replies: [
          {
            content: 'TIL! The etymology makes so much sense now.',
          },
        ],
      },
    ],
  },
  
  // Thread 7: Privacy Best Practices
  {
    rootContent: 'What are people\'s privacy setups? I\'m trying to minimize my digital footprint.',
    category: ContentCategory.TECH,
    replies: [
      {
        content: 'Start with privacy-focused browsers (Firefox with uBlock, Brave, or Tor for sensitive stuff).',
      },
      {
        content: 'Use a password manager. Bitwarden or KeePassXC. Unique passwords everywhere.',
        replies: [
          {
            content: 'Second KeePassXC. Open source and you control the database.',
          },
        ],
      },
      {
        content: 'For Bitcoin: CoinJoin, avoid KYC when possible, run your own node.',
      },
      {
        content: 'Consider using Nostr over Tor. Better privacy for your social graph.',
      },
    ],
  },
  
  // Thread 8: Meme Thread
  {
    rootContent: 'Post your best Bitcoin memes. I need a laugh today.',
    category: ContentCategory.MEMES,
    replies: [
      {
        content: 'Fiat money printer go brrrrrr 🖨️💸',
      },
      {
        content: 'When you check the price after not looking for a month',
      },
      {
        content: 'Me explaining Bitcoin to my family: *insert caveman drawing meme*',
      },
      {
        content: '2021: "I\'ll never sell!" 2022: "Maybe just a little to pay rent" 2023: "DIAMOND HANDS!"',
      },
    ],
  },
  
  // Thread 9: Running a Relay
  {
    rootContent: 'Thinking about running my own Nostr relay. Is it worth it? What\'s the maintenance like?',
    category: ContentCategory.NOSTR,
    replies: [
      {
        content: 'It\'s pretty straightforward with strfry or nostr-rs-relay. Low resource usage.',
        replies: [
          {
            content: 'How much does it cost roughly per month?',
            replies: [
              {
                content: 'Can run on a $5-10 VPS easily for a personal relay.',
              },
            ],
          },
        ],
      },
      {
        content: 'Worth it for censorship resistance alone. Plus you learn a lot about how Nostr works.',
      },
      {
        content: 'Maintenance is minimal once set up. Auto-updates and monitoring help.',
      },
    ],
  },
  
  // Thread 10: Art and NFTs
  {
    rootContent: 'As a digital artist, how do you all feel about NFTs vs just accepting Bitcoin directly?',
    category: ContentCategory.ART,
    replies: [
      {
        content: 'Bitcoin > NFTs. Sell for sats, build a following, cut out the middlemen.',
      },
      {
        content: 'Nostr + Lightning is the perfect combo for artists. Instant payments, global reach, no platform fees.',
        replies: [
          {
            content: 'This! I\'ve made more in zaps on Nostr than I did on OpenSea.',
          },
        ],
      },
      {
        content: 'NFTs had potential but got ruined by speculation. Focus on building value, not scarcity.',
      },
    ],
  },
  
  // Thread 11: Travel with Bitcoin
  {
    rootContent: 'Traveling to Europe next month. How\'s Bitcoin acceptance over there? Any tips?',
    category: ContentCategory.PERSONAL,
    replies: [
      {
        content: 'Depends on the country. Switzerland and Portugal are very Bitcoin-friendly.',
      },
      {
        content: 'Get a Bitcoin debit card (like the one from Coinbase or Binance) for places that don\'t accept crypto directly.',
        replies: [
          {
            content: 'Or use a Lightning wallet with a BTC-to-fiat card. Lower fees.',
          },
        ],
      },
      {
        content: 'Check out BTCMap.org to find Bitcoin-accepting businesses.',
      },
    ],
  },
  
  // Thread 12: Coding Help
  {
    rootContent: 'Stuck on a Rust borrow checker error. Can someone help? Getting "cannot borrow `x` as mutable more than once at a time"',
    category: ContentCategory.PROGRAMMING,
    replies: [
      {
        content: 'Classic Rust error! You need to restructure so you\'re not holding multiple mutable refs. Can you share the code?',
        replies: [
          {
            content: 'Posted a gist in my next note. Thanks!',
          },
        ],
      },
      {
        content: 'Try using Rc<RefCell<T>> if you really need shared mutable state, or better yet, redesign to avoid it.',
      },
      {
        content: 'The borrow checker is trying to save you from a bug. There\'s usually a better way to structure the code.',
      },
    ],
  },
  
  // Thread 13: Fitness Motivation
  {
    rootContent: 'Finally hit my fitness goal! Down 20 pounds and feeling stronger than ever. Consistency is key.',
    category: ContentCategory.PERSONAL,
    replies: [
      {
        content: 'Congratulations! What was your routine?',
        replies: [
          {
            content: 'Thanks! Lifted 3x/week, walked daily, fixed my diet. Nothing fancy, just consistent.',
          },
        ],
      },
      {
        content: 'Inspiring! Just started my journey. Posts like this keep me going.',
      },
      {
        content: 'Health is wealth. Bitcoin will be there when you\'re healthy enough to enjoy it.',
      },
    ],
  },
  
  // Thread 14: Stoicism Discussion
  {
    rootContent: 'How do you all apply Stoic philosophy to Bitcoin investing? The volatility is testing me.',
    category: ContentCategory.PHILOSOPHY,
    replies: [
      {
        content: 'Focus on what you can control: your conviction, your stack, your education. Not the price.',
        replies: [
          {
            content: 'This is the way. Price is noise, fundamentals are signal.',
          },
        ],
      },
      {
        content: 'Premeditatio malorum - visualize the worst case. If Bitcoin goes to zero, will you be okay? If yes, hold.',
      },
      {
        content: 'Amor fati - love your fate. Whatever happens with the price, it\'s what needed to happen.',
      },
    ],
  },
  
  // Thread 15: Nostr vs Bluesky
  {
    rootContent: 'How does Nostr compare to Bluesky? They both seem to be Twitter alternatives.',
    category: ContentCategory.TECH,
    replies: [
      {
        content: 'Nostr is simpler and more decentralized. No blockchain, no company, just protocol.',
      },
      {
        content: 'Bluesky has VC backing and a company behind it. Nostr is just open source code and a community.',
        replies: [
          {
            content: 'This is the key difference. Nostr can\'t be shut down or sold.',
          },
        ],
      },
      {
        content: 'Try both, see which one resonates. Nostr feels more "authentic" to me.',
      },
    ],
  },
  
  // Thread 16: Music Sharing
  {
    rootContent: 'What\'s everyone listening to today? Need some new music recommendations.',
    category: ContentCategory.MUSIC,
    replies: [
      {
        content: 'Been on a synthwave kick lately. The Midnight and FM-84 are amazing.',
      },
      {
        content: 'If you like hip hop, check out Bitcoin-themed artists. There\'s a whole scene.',
      },
      {
        content: 'Lo-fi beats to stack sats to. Perfect for coding.',
      },
    ],
  },
  
  // Thread 17: DCA Strategy
  {
    rootContent: 'What\'s your DCA strategy? Daily, weekly, monthly? And what percentage of income?',
    category: ContentCategory.BITCOIN,
    replies: [
      {
        content: 'Weekly, 5% of take-home. Set it and forget it.',
      },
      {
        content: 'Monthly for lower fees. Stack sats on the 1st of every month.',
        replies: [
          {
            content: 'Strike and Swan both offer free automatic DCA. No need to worry about fees.',
          },
        ],
      },
      {
        content: 'I DCA when I feel like the price is "low enough". Not true DCA but works for me.',
      },
    ],
  },
  
  // Thread 18: News Discussion
  {
    rootContent: 'Another country talking about Bitcoin as legal tender. This trend is accelerating.',
    category: ContentCategory.NEWS,
    replies: [
      {
        content: 'Game theory in action. No country wants to be left behind.',
      },
      {
        content: 'Adoption is happening faster than anyone predicted.',
        replies: [
          {
            content: 'Still early though. Less than 1% global adoption.',
          },
        ],
      },
      {
        content: 'The dominoes are falling. One by one.',
      },
    ],
  },
  
  // Thread 19: Book Recommendations
  {
    rootContent: 'What books changed your life? Looking for recommendations.',
    category: ContentCategory.PERSONAL,
    replies: [
      {
        content: 'The Bitcoin Standard - Saifedean Ammous. Changed how I think about money.',
      },
      {
        content: 'Meditations by Marcus Aurelius. Ancient wisdom that\'s still relevant.',
      },
      {
        content: 'Sapiens by Yuval Noah Harari. Understanding human history puts everything in perspective.',
      },
      {
        content: 'The Sovereign Individual. Predicted so much of what\'s happening now.',
      },
    ],
  },
  
  // Thread 20: Nostr NIP Discussion
  {
    rootContent: 'Which NIP do you think is most underrated? For me it\'s NIP-05 - so simple but so useful.',
    category: ContentCategory.NOSTR,
    replies: [
      {
        content: 'NIP-57 (Zaps) is game-changing. Direct value transfer for content.',
      },
      {
        content: 'NIP-36 (Sensitive Content) is important for a mature platform.',
      },
      {
        content: 'NIP-65 (Relay List Metadata) makes client onboarding so much smoother.',
        replies: [
          {
            content: 'Yes! Having your relay list portable is huge.',
          },
        ],
      },
    ],
  },
];

// Helper function to create a reply note
function createReplyNote(
  content: string,
  authorPubkey: string,
  rootEventId: string,
  replyToEventId: string,
  timestamp: number
): MockNote {
  const id = generateHex();
  const mentions = extractMentions(content);
  const hashtags = extractHashtags(content);
  const links = extractUrls(content);
  const author = getUserByPubkey(authorPubkey);
  
  const engagement = generateEngagement(author?.followersCount || 500);
  
  return {
    id,
    pubkey: authorPubkey,
    created_at: timestamp,
    kind: EventKind.TEXT_NOTE,
    tags: createTags(mentions, hashtags, replyToEventId, rootEventId),
    content,
    sig: generateSig(),
    likes: engagement.likes,
    reposts: engagement.reposts,
    replies: 0, // Replies don't track their own replies in this simple model
    zaps: engagement.zaps,
    zapAmount: engagement.zapAmount,
    mentions,
    hashtags,
    links,
    category: ContentCategory.OTHER,
  };
}

// Build threads from templates
function buildThreads(): MockThread[] {
  const threads: MockThread[] = [];
  
  threadTemplates.forEach((template, index) => {
    // Pick a random author for the root note
    const rootAuthor = mockUsers[index % mockUsers.length];
    const rootTimestamp = generateRealisticTimestamp(30);
    
    // Create root note
    const rootNote: MockNote = {
      id: generateHex(),
      pubkey: rootAuthor.pubkey,
      created_at: rootTimestamp,
      kind: EventKind.TEXT_NOTE,
      tags: createTags(extractMentions(template.rootContent), extractHashtags(template.rootContent)),
      content: template.rootContent,
      sig: generateSig(),
      likes: Math.floor(Math.random() * 50) + 10,
      reposts: Math.floor(Math.random() * 20) + 5,
      replies: template.replies.length,
      zaps: Math.floor(Math.random() * 10),
      zapAmount: Math.floor(Math.random() * 50000),
      mentions: extractMentions(template.rootContent),
      hashtags: extractHashtags(template.rootContent),
      links: extractUrls(template.rootContent),
      category: template.category,
    };
    
    const threadNotes: MockNote[] = [rootNote];
    const participants = new Set<string>([rootAuthor.pubkey]);
    
    // Process replies recursively
    function processReplies(
      replyTemplates: ReplyTemplate[],
      parentId: string,
      depth: number = 1
      ): void {
      replyTemplates.forEach((reply, i) => {
        // Get reply author
        let replyAuthor: typeof mockUsers[0];
        if (reply.authorIndex !== undefined) {
          replyAuthor = mockUsers[reply.authorIndex % mockUsers.length];
        } else {
          // Pick random author, preferring different from parent
          const available = mockUsers.filter(u => u.pubkey !== rootAuthor.pubkey);
          replyAuthor = available[Math.floor(Math.random() * available.length)];
        }
        
        participants.add(replyAuthor.pubkey);
        
        // Generate timestamp after parent
        const replyTimestamp = parentId === rootNote.id 
          ? rootTimestamp + (i + 1) * 1800 // 30 min intervals for top level
          : rootTimestamp + (depth * 3600) + (i * 600); // Nested replies later
        
        const replyNote = createReplyNote(
          reply.content,
          replyAuthor.pubkey,
          rootNote.id,
          parentId,
          replyTimestamp
        );
        
        threadNotes.push(replyNote);
        
        // Process nested replies
        if (reply.replies && reply.replies.length > 0) {
          processReplies(reply.replies, replyNote.id, depth + 1);
        }
      });
    }
    
    processReplies(template.replies, rootNote.id);
    
    // Sort notes by timestamp
    threadNotes.sort((a, b) => a.created_at - b.created_at);
    
    threads.push({
      id: generateHex(),
      rootNoteId: rootNote.id,
      participants: Array.from(participants),
      notes: threadNotes,
      replyCount: threadNotes.length - 1,
      lastActivity: threadNotes[threadNotes.length - 1].created_at,
      category: template.category,
    });
  });
  
  // Sort by last activity (newest first)
  return threads.sort((a, b) => b.lastActivity - a.lastActivity);
}

// Generate threads
export const mockThreads: MockThread[] = buildThreads();

// Helper functions
export function getThreadById(id: string): MockThread | undefined {
  return mockThreads.find(t => t.id === id);
}

export function getThreadByRootNoteId(rootNoteId: string): MockThread | undefined {
  return mockThreads.find(t => t.rootNoteId === rootNoteId);
}

export function getThreadsByCategory(category: ContentCategory): MockThread[] {
  return mockThreads.filter(t => t.category === category);
}

export function getThreadsByParticipant(pubkey: string): MockThread[] {
  return mockThreads.filter(t => t.participants.includes(pubkey));
}

export function getMostActiveThreads(count: number = 5): MockThread[] {
  return [...mockThreads]
    .sort((a, b) => b.replyCount - a.replyCount)
    .slice(0, count);
}

export function getRecentThreads(hours: number = 24): MockThread[] {
  const cutoff = Math.floor(Date.now() / 1000) - (hours * 3600);
  return mockThreads.filter(t => t.lastActivity >= cutoff);
}

// Thread statistics
export const threadStats = {
  total: mockThreads.length,
  byCategory: Object.fromEntries(
    Object.values(ContentCategory).map(cat => [
      cat,
      mockThreads.filter(t => t.category === cat).length
    ])
  ) as Record<ContentCategory, number>,
  totalReplies: mockThreads.reduce((acc, t) => acc + t.replyCount, 0),
  avgRepliesPerThread: Math.floor(
    mockThreads.reduce((acc, t) => acc + t.replyCount, 0) / mockThreads.length
  ),
  avgParticipants: Math.floor(
    mockThreads.reduce((acc, t) => acc + t.participants.length, 0) / mockThreads.length
  ),
};

export default mockThreads;
