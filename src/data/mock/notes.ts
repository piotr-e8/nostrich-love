/**
 * Mock Notes/Posts Database
 * 200+ diverse Nostr posts covering all content types
 */

import type { MockNote } from './types';
import { EventKind, ContentCategory } from './types';
import { generateHex, generateRealisticTimestamp, generateSig, generateEngagement, createTags, getSampleImages, extractHashtags, extractMentions, extractUrls } from './utils';
import { mockUsers, getRandomUsers } from './users';

// Content templates for different categories
const contentTemplates: Record<ContentCategory, string[]> = {
  [ContentCategory.BITCOIN]: [
    'Just stacked some more sats today. The journey to 1 BTC continues! #Bitcoin #StackingSats',
    'The fiat system is broken beyond repair. Bitcoin is the lifeboat.',
    'Run the numbers. 21 million. That\'s all there will ever be.',
    'Lightning Network is getting faster every day. Sent 1000 sats instantly for basically free. This is the future.',
    'Block 840,000 just mined. Halving is coming. Are you ready?',
    'Not your keys, not your coins. Move your Bitcoin off exchanges.',
    'Inflation is theft. Bitcoin is hope.',
    'Educating my family about Bitcoin this weekend. Baby steps.',
    'The energy FUD around Bitcoin is so tired. Bitcoin mining is actually GOOD for the grid.',
    'Just read the whitepaper again. Still mind-blowing after all these years.',
    'Bitcoin doesn\'t care about your politics. It just works.',
    'Financial freedom is worth the volatility. Stay humble, stack sats.',
    'Every day you don\'t buy Bitcoin is a day you wish you had.',
    'The halving is priced in... said everyone before every halving.',
    'Bitcoin is freedom money. Change my mind.',
    'Imagine thinking money printing has no consequences.',
    'Just paid for coffee with Lightning. Instant settlement. No middlemen. Beautiful.',
    'The beauty of Bitcoin is that no one can stop it. Not governments, not banks, not anyone.',
    'DCA is the way. Slow and steady wins the race.',
    'Bitcoin fixes this. All of this.',
    'Watching the price action today. Zoom out, friends. We\'re still early.',
    'Bitcoin is a swarm of cyber hornets serving the goddess of wisdom.',
    'The hardest money ever created. This is why we Bitcoin.',
    'Privacy matters. Use CoinJoin. Protect yourself.',
    'Self-custody is a superpower. Learn it, practice it, teach it.',
  ],
  [ContentCategory.TECH]: [
    'Just deployed my first Nostr relay! Excited to contribute to the decentralized web. #Nostr #Decentralization',
    'The beauty of open source is that anyone can contribute. Just submitted my first PR!',
    'Nostr is what social media should have been from the start. No algorithms, no ads, just people.',
    'Running my own Bitcoin node feels like digital sovereignty. Highly recommend.',
    'Decentralized identity is the future. Your keys, your identity, your data.',
    'The tech stack for Nostr clients is getting so good. React + NDK is chef\'s kiss.',
    'Just discovered NIP-07 browser extensions. Game changer for web clients.',
    'Building on Bitcoin means building on the most secure network in the world.',
    'The interoperability of Nostr is amazing. Same identity across all clients.',
    'Web5 who? Nostr is here today, working, and simple.',
    'Key management is still the biggest UX challenge in crypto. We need better solutions.',
    'The simplicity of Nostr is its superpower. JSON over WebSockets. That\'s it.',
    'Just moved all my social media to Nostr. Feels good to own my data.',
    'Nostr relays are like email servers. Pick good ones, run your own if you want.',
    'The censorship resistance of Nostr is not theoretical. It just works.',
    'Building a Nostr client is surprisingly straightforward. Great dev experience.',
    'Zaps are revolutionary. Direct value transfer for content. No intermediaries.',
    'The Nostr ecosystem is growing so fast. New clients, new features, every day.',
    'Just implemented NIP-05 verification. So elegant.',
    'The future of social is protocols, not platforms. Nostr gets this.',
    'Mobile Nostr clients have come so far. Amethyst and Damus are both excellent.',
    'Nostr is the Twitter killer we\'ve been waiting for.',
    'The permissionless innovation on Nostr is beautiful to watch.',
    'Key rotation and recovery is still hard. We need better standards.',
    'Nostr makes me excited about social media again.',
  ],
  [ContentCategory.PROGRAMMING]: [
    'Rust is such a beautiful language. The compiler is your friend, not your enemy. #RustLang',
    'Just refactored 1000 lines of JavaScript into 200 lines of TypeScript. Type safety is worth it.',
    'Functional programming has changed how I think about code. Pure functions > side effects.',
    'Learning Rust by building a Nostr client. Best way to learn is by doing.',
    'The borrow checker is frustrating until it\'s not. Then it\'s magical.',
    'TypeScript enums are underrated. Use them more.',
    'Just discovered the beauty of pattern matching in Rust. Game changer.',
    'Clean code is not about perfection. It\'s about readability and maintainability.',
    'Writing tests first makes you think about your API design. TDD works.',
    'The async/await syntax in modern JavaScript is so clean. Remember callbacks?',
    'Rust\'s error handling with Result and Option is chef\'s kiss.',
    'Just spent 3 hours debugging. Turned out to be a typo. Classic.',
    'Documentation is code. Write it well.',
    'The NDK (Nostr Development Kit) makes building Nostr apps so much easier.',
    'Immutable data structures prevent an entire class of bugs.',
    'Code reviews are learning opportunities. Embrace them.',
    'Just learned about Rust\'s macro system. Mind = blown.',
    'Type inference in TypeScript is surprisingly powerful. Let the compiler work for you.',
    'The best code is no code. But when you must, make it readable.',
    'Functional composition is like LEGO for adults.',
    'Debugging is like being a detective in a crime movie where you are also the murderer.',
    'Rust\'s zero-cost abstractions are real. Beautiful code that runs fast.',
    'Just shipped a feature that took 2 weeks to build. The dopamine hit is real.',
    'Naming things is hard. But it\'s worth spending time on.',
    'Refactoring old code feels like archaeology. Sometimes you find treasure, sometimes skeletons.',
  ],
  [ContentCategory.PHILOSOPHY]: [
    'Freedom is not given. It is taken. Bitcoin is how we take it back.',
    'The truth doesn\'t care about your feelings. Seek it anyway.',
    'Individual sovereignty is the highest form of freedom. Protect it at all costs.',
    'Question everything, especially the things you believe most strongly.',
    'The most dangerous ideas are those that cannot be questioned.',
    'True freedom requires responsibility. You cannot have one without the other.',
    'In a world of deceit, telling the truth is a revolutionary act.',
    'The hardest battles are the ones within ourselves.',
    'Wisdom comes from experience, not age.',
    'The measure of a society is how it treats the individual.',
    'Ideas are more powerful than guns. But guns protect the ideas.',
    'Freedom of speech is meaningless if it only applies to popular opinions.',
    'The best time to plant a tree was 20 years ago. The second best time is now.',
    'Truth is treason in an empire of lies.',
    'The individual is the smallest minority. Protect minority rights.',
    'Civilization is the progress toward a society of privacy.',
    'The price of freedom is eternal vigilance.',
    'Those who would give up essential liberty for temporary safety deserve neither.',
    'The unexamined life is not worth living.',
    'Power corrupts. Absolute power corrupts absolutely. Decentralize everything.',
    'Peace is not the absence of conflict, but the ability to cope with it.',
    'The mind is everything. What you think you become.',
    'Change your thoughts and you change your world.',
    'The only true wisdom is in knowing you know nothing.',
    'Life is really simple, but we insist on making it complicated.',
  ],
  [ContentCategory.PERSONAL]: [
    'Finally finished that project I\'ve been working on for months. Feels amazing!',
    'Coffee and code. My morning ritual.',
    'Just hit the gym for the first time in months. Starting small but starting.',
    'Taking a digital detox this weekend. See you all Monday!',
    'Homemade pizza night was a success. Best dough recipe yet!',
    'Woke up early to watch the sunrise. Sometimes you need to pause and appreciate.',
    'Learning to say no has been life-changing. Protect your time.',
    'Book recommendation: The Bitcoin Standard. Changed how I think about money.',
    'Just completed my first 5K. Never thought I\'d be a runner.',
    'Meal prep Sunday. Setting myself up for a successful week.',
    'Sometimes the best thing you can do is nothing. Rest is productive.',
    'Finally organized my desk. Clear space, clear mind.',
    'Grateful for this community. You all inspire me daily.',
    'Learning guitar is harder than I thought. But I\'m not giving up.',
    'Just booked tickets to Bitcoin conference! Who else is going?',
    'Trying to read more this year. Finished book #5 today.',
    'Small wins add up. Celebrate them.',
    'My plants are thriving. Small joys.',
    'Just deleted Twitter from my phone. Nostr only now.',
    'Late night coding session. The best ideas come at 2am.',
    'Sunday reflection: What are you grateful for today?',
    'Started journaling this year. Highly recommend.',
    'Family dinner tonight. No phones allowed. Present over perfect.',
    'New personal record on my deadlift. Progress!',
    'Just moved to a new city. Excited for this new chapter.',
  ],
  [ContentCategory.MEMES]: [
    'Fiat money printer go brrrrrr',
    'Me explaining Bitcoin to my family for the 100th time',
    'When the price drops 5% and everyone panics',
    'Bitcoiners: "Just DCA and hodl" Also Bitcoiners: *checks price every 5 minutes*',
    'My face when I realize I could have bought at $100',
    'No-coiners: "Bitcoin is dead" Bitcoin: *proceeds to make new ATH*',
    'Me reading the same whitepaper for the 50th time and still learning something new',
    'Fiat: Infinite supply Bitcoin: 21 million Bitcoiners: I know which one I\'d choose',
    'When someone asks if it\'s too late to buy Bitcoin',
    'My Bitcoin strategy: Buy high, sell low, complain on Nostr',
    'The four horsemen of Bitcoin: Hodl, Stack, DCA, Repeat',
    'When you finally explain Bitcoin to someone and they get it',
    'Nobody: Bitcoiners at Thanksgiving: Let me tell you about sound money',
    'Me checking my portfolio: This is fine.',
    'Bitcoin price: Drops 50% Bitcoiners: Bullish',
    'When the Lightning payment confirms instantly',
    'Fiat bugs: "Bitcoin is too volatile" Also fiat bugs: *loses 20% purchasing power annually*',
    'Me setting up my 15th Nostr client',
    'Nostr newbies: "What client should I use?" Nostr veterans: "Yes"',
    'When you accidentally zap someone 10,000 sats instead of 100',
    'My bitcoin wallet after a bear market',
    'Explaining Nostr to normies: It\'s like Twitter but... no, wait...',
    'When you find the perfect meme to respond with',
    'Bitcoin maxis: *breathes* Altcoiners: "Why are you so toxic?"',
    'Me refreshing Nostr every 30 seconds for new zaps',
  ],
  [ContentCategory.QUESTIONS]: [
    'What\'s the best way to explain Bitcoin to a complete beginner?',
    'Which Nostr client has the best mobile experience right now?',
    'Thoughts on running your own Lightning node vs using a custodial solution?',
    'How do you secure your Bitcoin keys? Hardware wallet recommendations?',
    'What\'s the most underrated Nostr NIP?',
    'Best resources for learning Rust? Preferably project-based.',
    'How do you deal with FOMO during bull runs?',
    'What\'s your Bitcoin price prediction for end of 2024?',
    'Cold storage vs hot wallet: What\'s your ratio?',
    'Which relays are you using and why?',
    'How do you explain to family why you\'re into Bitcoin?',
    'What\'s the best Nostr client for desktop?',
    'Thoughts on Taproot and what it enables?',
    'How do you stay motivated during bear markets?',
    'Best Lightning wallet for beginners?',
    'What books changed your perspective on money?',
    'Should I learn Rust or Go for Nostr development?',
    'How do you balance privacy with convenience?',
    'What\'s your Bitcoin stack goal?',
    'Thoughts on Ordinals and inscriptions?',
    'How do you verify your Bitcoin downloads?',
    'What\'s the most secure way to store a 12-word seed?',
    'Best way to accept Bitcoin payments for a small business?',
    'How do you explain Nostr to someone who doesn\'t know what a protocol is?',
    'What\'s your daily Bitcoin routine?',
  ],
  [ContentCategory.NOSTR]: [
    'Just discovered Nostr last week and I\'m obsessed. This is how social media should work.',
    'The zaps feature is genius. Finally a way to directly support creators.',
    'Nostr feels like early Twitter. Real conversations, no algorithm manipulation.',
    'Just got my first zap! 21 sats never felt so good.',
    'The relay model is so elegant. Choose your infrastructure.',
    'NIP-05 verification is the perfect balance of user experience and decentralization.',
    'Can\'t believe how fast Nostr is growing. The protocol wars are over.',
    'Running my own relay was easier than I expected. Highly recommend.',
    'The simplicity of Nostr is beautiful. No blockchain, no token, just events.',
    'Just switched from Twitter to Nostr full time. No regrets.',
    'The Nostr developer community is so helpful.',
    'Long-form notes with NIP-23 are amazing. Hello decentralized blogging.',
    'Nostr search is getting better every day.',
    'The cross-client compatibility is seamless. Same identity everywhere.',
    'Just zapped my first note. This feels like the future of content monetization.',
    'Nostr clients are so much more fun to build than traditional apps.',
    'The censorship resistance is not just theoretical. It just works.',
    'Love how Nostr handles identity. Your keys, your identity, period.',
    'The lightning integration in Nostr clients is smooth.',
    'Nostr is what I wish the internet had been from the start.',
    'Just published my first long-form article on Nostr. Feels liberating.',
    'The Nostr protocol is beautifully simple. That\'s why it works.',
    'Discovering new people on Nostr is so organic. No algorithm needed.',
    'Nostr makes me excited about the internet again.',
    'The future of social is here and it\'s Nostr.',
  ],
  [ContentCategory.ART]: [
    'Just finished this piece. What do you think?',
    'Digital art is the future. Nostr + Lightning = artist empowerment.',
    'Working on a new collection. Stay tuned!',
    'Art is meant to be seen, not hidden away. Sharing my work here.',
    'The creative process is messy but beautiful.',
    'Just sold my first piece for sats. The future is bright.',
    'Sketching ideas for my next project.',
    'Art is how we decorate space. Music is how we decorate time.',
    'Every artist was first an amateur. Keep creating.',
    'The best art comes from authentic expression.',
    'Just tried a new technique. Learning never stops.',
    'Sharing my creative journey, one piece at a time.',
    'Art is the highest form of hope.',
    'Working on commission. DMs open for inquiries.',
    'The intersection of Bitcoin and art is fascinating.',
    'Just dropped a new series. Check it out!',
    'Creativity is intelligence having fun.',
    'Behind every piece is hours of work you don\'t see.',
    'Art speaks where words are unable to explain.',
    'Every stroke is a decision. Make them count.',
  ],
  [ContentCategory.MUSIC]: [
    'New track dropping soon. Produced entirely with open source software.',
    'Music is the universal language. What are you listening to?',
    'Just recorded a new guitar riff. Feels good.',
    'The way music and Bitcoin communities overlap is beautiful.',
    'Working on an album. Slow and steady.',
    'Music production tip: Less is often more.',
    'Just discovered a new artist through Nostr. This platform is amazing.',
    'The best songs come from authentic emotion.',
    'Practice, practice, practice. There are no shortcuts.',
    'Just jammed for 3 hours. Lost track of time.',
    'Music theory is the grammar, emotion is the poetry.',
    'New cover song uploaded. Hope you enjoy!',
    'The creative block is real. Taking a break and coming back fresh.',
    'Collaborating with another artist. Excited to share what we\'re working on.',
    'Just got my first music zap! This changes everything.',
    'Old school hip hop and Bitcoin. Name a better combo.',
    'Music is what feelings sound like.',
    'Studio session today. Chasing the perfect take.',
    'The best part of music is sharing it with others.',
    'Learning piano is humbling. Every day is day one.',
  ],
  [ContentCategory.POLITICS]: [
    'Censorship is not safety. It\'s control.',
    'Freedom of speech includes speech you disagree with.',
    'The solution to bad speech is more speech, not censorship.',
    'Privacy is not about having something to hide. It\'s about having something to protect.',
    'Decentralization is political. Embrace it.',
    'The separation of money and state is as important as the separation of church and state.',
    'Your data is being weaponized against you. Take it back.',
    'Central planning always fails. Decentralize everything.',
    'The surveillance state grows while we sleep. Wake up.',
    'Freedom is not the ability to do whatever you want. It\'s the right to be left alone.',
    'Bitcoin is protest. Silent, peaceful, unstoppable protest.',
    'The best way to predict the future is to build it.',
    'Governments should fear their people, not the other way around.',
    'In a free society, privacy is a fundamental right.',
    'The slow erosion of liberty is barely noticeable day to day. Look back 20 years.',
    'Power corrupts. Decentralize power.',
    'The right to privacy is the foundation of all other rights.',
    'When governments print money, they steal from the poor.',
    'Civil disobedience is the duty of the informed citizen.',
    'Bitcoin is the exit.',
  ],
  [ContentCategory.SCIENCE]: [
    'The universe is under no obligation to make sense to us.',
    'Quantum mechanics is weird and wonderful.',
    'Science is not about being right. It\'s about finding truth.',
    'The more we learn, the more we realize how much we don\'t know.',
    'Space exploration is the ultimate expression of human curiosity.',
    'Understanding physics changes how you see the world.',
    'The scientific method is humanity\'s greatest invention.',
    'Every answer leads to more questions. That\'s the beauty of it.',
    'The universe is vast and we are small. Perspective is everything.',
    'Curiosity is the engine of achievement.',
    'Science advances one funeral at a time.',
    'The elegance of mathematics is breathtaking.',
    'Just finished reading about the James Webb discoveries. Mind blown.',
    'The intersection of computer science and biology is fascinating.',
    'Climate science is complex. Oversimplification helps no one.',
    'The Fermi paradox keeps me up at night.',
    'Understanding evolution changes everything.',
    'The scientific consensus is not science. Science is method.',
    'Every experiment is a question to the universe.',
    'The universe is not only queerer than we suppose, but queerer than we can suppose.',
  ],
  [ContentCategory.NEWS]: [
    'Breaking: Major exchange announces Lightning integration. This is huge.',
    'Just read about the latest Bitcoin development. Exciting times ahead.',
    'Regulatory news from the EU. Mixed bag but mostly positive.',
    'New Nostr client just launched. Looking promising.',
    'Adoption news: Another country considering Bitcoin as legal tender.',
    'Tech update: New NIP proposal for improved relay discovery.',
    'Lightning Network capacity hits new all-time high.',
    'Major company adds Bitcoin to treasury. The dominoes are falling.',
    'Development update: New privacy features coming to major wallet.',
    'Conference season is here. Who\'s going to Bitcoin Miami?',
    'New research paper on Bitcoin mining energy mix released.',
    'Nostr relay software update includes performance improvements.',
    'Lightning development is accelerating. New features weekly.',
    'Bitcoin ETF approval speculation continues.',
    'New study shows Bitcoin adoption growing in developing nations.',
    'Major tech company announces Bitcoin support.',
    'Development milestone reached on important Nostr feature.',
    'Regulatory clarity improving in multiple jurisdictions.',
    'Another successful halving completed. Onward and upward.',
    'Nostr user growth accelerating. Protocol network effects kicking in.',
  ],
  [ContentCategory.OTHER]: [
    'Just had a random thought and needed to share it somewhere.',
    'Life is weird and wonderful.',
    'Sometimes I wonder about the future. Optimistic overall.',
    'The internet is both the best and worst thing to happen to humanity.',
    'Just appreciating the small things today.',
    'Random observation: People are generally good.',
    'The world is changing fast. Trying to keep up.',
    'Just enjoying the journey, wherever it leads.',
    'Thoughts on time: We never have enough of it.',
    'Appreciating the community here. Thanks for being awesome.',
    'Life update: Things are good.',
    'Random appreciation post for the developers making Nostr better every day.',
    'Just reflecting on how far we\'ve come.',
    'The future is unwritten. Let\'s write it well.',
    'Taking a moment to be grateful.',
    'Life\'s too short for bad coffee and closed protocols.',
    'Appreciating the simple things today.',
    'Just here for the good vibes and sound money.',
    'Sometimes the best content is the unplanned content.',
    'Grateful for this moment, right now.',
  ],
};

// Helper to create a note from template
function createNoteFromTemplate(
  template: string,
  author: typeof mockUsers[0],
  category: ContentCategory,
  timestamp: number,
  withImages: boolean = false,
  isRepost: boolean = false,
  repostedBy?: string
): MockNote {
  const id = generateHex();
  const mentions = extractMentions(template);
  const hashtags = extractHashtags(template);
  const links = extractUrls(template);
  
  // Generate engagement based on author influence
  const isHighQuality = author.isVerified || author.followersCount > 5000;
  const engagement = generateEngagement(author.followersCount, isHighQuality);
  
  const note: MockNote = {
    id,
    pubkey: author.pubkey,
    created_at: timestamp,
    kind: isRepost ? EventKind.REPOST : EventKind.TEXT_NOTE,
    tags: createTags(mentions, hashtags),
    content: template,
    sig: generateSig(),
    likes: engagement.likes,
    reposts: engagement.reposts,
    replies: engagement.replies,
    zaps: engagement.zaps,
    zapAmount: engagement.zapAmount,
    isRepost,
    repostedBy,
    images: withImages ? getSampleImages(1 + Math.floor(Math.random() * 3)) : undefined,
    mentions,
    hashtags,
    links,
    category,
  };
  
  return note;
}

// Generate all notes
function generateAllNotes(): MockNote[] {
  const notes: MockNote[] = [];
  const now = Math.floor(Date.now() / 1000);
  
  // Generate notes for each category
  Object.entries(contentTemplates).forEach(([category, templates]) => {
    const cat = category as ContentCategory;
    
    templates.forEach((template, index) => {
      // Pick random author, weighted toward more active users
      const authorIndex = Math.floor(Math.pow(Math.random(), 0.5) * mockUsers.length);
      const author = mockUsers[authorIndex];
      
      // Generate realistic timestamp within last 30 days
      const timestamp = generateRealisticTimestamp(30);
      
      // 20% chance to have images (except for memes which are 40%)
      const imageChance = cat === ContentCategory.MEMES ? 0.4 : 0.2;
      const withImages = Math.random() < imageChance;
      
      // 5% chance to be a repost
      const isRepost = Math.random() < 0.05;
      const repostedBy = isRepost ? getRandomUsers(1)[0].pubkey : undefined;
      
      notes.push(createNoteFromTemplate(
        template,
        author,
        cat,
        timestamp,
        withImages,
        isRepost,
        repostedBy
      ));
    });
  });
  
  // Add some code snippets for programming posts
  const codeSnippets = [
    `Just wrote a simple Nostr event parser in Rust:

\`\`\`rust
fn parse_event(json: &str) -> Result<Event, Error> {
    let event: Event = serde_json::from_str(json)?;
    event.verify()?;
    Ok(event)
}
\`\`\`

So clean! #Rust #Nostr`,
    `TypeScript tip for Nostr devs:

\`\`\`typescript
const validateEvent = (event: NostrEvent): boolean => {
  return event.id.length === 64 &&
         event.pubkey.length === 64 &&
         event.sig.length === 128;
};
\`\`\`

Always validate before trusting!`,
    `Python one-liner to check if a note has images:

\`\`\`python
has_images = any(tag[0] == 'imeta' for tag in event.tags)
\`\`\`

Simple and effective.`,
  ];
  
  codeSnippets.forEach((snippet, i) => {
    const author = mockUsers.find(u => u.username === 'codewiz') || mockUsers[15];
    notes.push(createNoteFromTemplate(
      snippet,
      author,
      ContentCategory.PROGRAMMING,
      now - (i * 86400),
      false
    ));
  });
  
  // Add some link preview posts
  const linkPosts = [
    'Just read this amazing article about Bitcoin\'s energy usage. Worth your time:\n\nhttps://bitcoinmagazine.com/business/bitcoin-mining-energy\n\nTL;DR: It\'s actually good for the grid.',
    'Great thread on Nostr architecture:\n\nhttps://github.com/nostr-protocol/nips/blob/master/01.md\n\nEssential reading for devs.',
    'This Lightning Network visualization is mind-blowing:\n\nhttps://mempool.space/lightning\n\nThe network is growing so fast!',
  ];
  
  linkPosts.forEach((post, i) => {
    const author = getRandomUsers(1)[0];
    notes.push(createNoteFromTemplate(
      post,
      author,
      ContentCategory.TECH,
      now - (i * 43200),
      false
    ));
  });
  
  // Sort by timestamp (newest first)
  return notes.sort((a, b) => b.created_at - a.created_at);
}

// Generate the notes
export const mockNotes: MockNote[] = generateAllNotes();

// Export filtered notes
export const notesByCategory: Record<ContentCategory, MockNote[]> = {
  [ContentCategory.BITCOIN]: mockNotes.filter(n => n.category === ContentCategory.BITCOIN),
  [ContentCategory.TECH]: mockNotes.filter(n => n.category === ContentCategory.TECH),
  [ContentCategory.PROGRAMMING]: mockNotes.filter(n => n.category === ContentCategory.PROGRAMMING),
  [ContentCategory.PHILOSOPHY]: mockNotes.filter(n => n.category === ContentCategory.PHILOSOPHY),
  [ContentCategory.PERSONAL]: mockNotes.filter(n => n.category === ContentCategory.PERSONAL),
  [ContentCategory.MEMES]: mockNotes.filter(n => n.category === ContentCategory.MEMES),
  [ContentCategory.QUESTIONS]: mockNotes.filter(n => n.category === ContentCategory.QUESTIONS),
  [ContentCategory.NOSTR]: mockNotes.filter(n => n.category === ContentCategory.NOSTR),
  [ContentCategory.ART]: mockNotes.filter(n => n.category === ContentCategory.ART),
  [ContentCategory.MUSIC]: mockNotes.filter(n => n.category === ContentCategory.MUSIC),
  [ContentCategory.POLITICS]: mockNotes.filter(n => n.category === ContentCategory.POLITICS),
  [ContentCategory.SCIENCE]: mockNotes.filter(n => n.category === ContentCategory.SCIENCE),
  [ContentCategory.NEWS]: mockNotes.filter(n => n.category === ContentCategory.NEWS),
  [ContentCategory.OTHER]: mockNotes.filter(n => n.category === ContentCategory.OTHER),
};

// Helper functions
export function getNoteById(id: string): MockNote | undefined {
  return mockNotes.find(n => n.id === id);
}

export function getNotesByAuthor(pubkey: string): MockNote[] {
  return mockNotes.filter(n => n.pubkey === pubkey);
}

export function getNotesWithImages(): MockNote[] {
  return mockNotes.filter(n => n.images && n.images.length > 0);
}

export function getMostLikedNotes(count: number = 10): MockNote[] {
  return [...mockNotes]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, count);
}

export function getMostZappedNotes(count: number = 10): MockNote[] {
  return [...mockNotes]
    .sort((a, b) => b.zapAmount - a.zapAmount)
    .slice(0, count);
}

export function getRecentNotes(hours: number = 24): MockNote[] {
  const cutoff = Math.floor(Date.now() / 1000) - (hours * 3600);
  return mockNotes.filter(n => n.created_at >= cutoff);
}

// Statistics
export const noteStats = {
  total: mockNotes.length,
  byCategory: Object.fromEntries(
    Object.entries(notesByCategory).map(([cat, notes]) => [cat, notes.length])
  ) as Record<ContentCategory, number>,
  withImages: mockNotes.filter(n => n.images && n.images.length > 0).length,
  reposts: mockNotes.filter(n => n.isRepost).length,
  totalLikes: mockNotes.reduce((acc, n) => acc + n.likes, 0),
  totalReposts: mockNotes.reduce((acc, n) => acc + n.reposts, 0),
  totalZaps: mockNotes.reduce((acc, n) => acc + n.zaps, 0),
  totalZapAmount: mockNotes.reduce((acc, n) => acc + n.zapAmount, 0),
};

export default mockNotes;
