/**
 * Gamification system unit tests — regression coverage for the July 2026
 * repair of audit findings:
 *   #48  streak pinned at 0 for guide readers (write-ordering bug)
 *   #49  badge-earned event: shared constant + every award path dispatches
 *   #50  level-unlock threshold: one canonical formula
 *   #51  privacy toggle gates every gamification write
 *   #52  export/import round-trips the FULL persisted state
 *   #54  first-post / zap-receiver repurposed to earnable criteria
 *   #111 corrupt localStorage value must not latch writes off forever
 *
 * Environment: plain node (no jsdom). localStorage and window are stubbed
 * BEFORE the modules under test are imported, because progressService
 * snapshots `typeof window` at module scope.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Browser stubs (must exist before the dynamic imports below)
// ---------------------------------------------------------------------------

function createLocalStorageMock() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (i: number) => [...store.keys()][i] ?? null,
    get length() {
      return store.size;
    },
  };
}

const localStorageMock = createLocalStorageMock();
// A real EventTarget gives us addEventListener/dispatchEvent semantics for
// the badge-earned CustomEvent without pulling in jsdom.
const windowMock = new EventTarget();

vi.stubGlobal('localStorage', localStorageMock);
vi.stubGlobal('window', windowMock);

const {
  BADGE_EARNED_EVENT,
  BADGE_DEFINITIONS,
  GAMIFICATION_STORAGE_KEY,
  loadGamificationData,
  saveGamificationData,
  awardBadge,
  hasBadge,
  recordActivity,
  getStreakInfo,
  getCompletedGuides,
  recordFirstPost,
  recordZapReceived,
  recordKeysGenerated,
  recordKeysBackedUp,
  updateFollowedAccounts,
  updateConnectedRelays,
  recordPrivacyQuizPerfectScore,
  checkAndAwardBadges,
  completeGuideInLevel,
  getLevelUnlockThreshold,
  getLevelProgress,
  recordQuizResult,
  getQuizResult,
  hasPassedQuiz,
  getPassedQuizzes,
  getLevelCompletion,
  getActiveLevel,
  QUIZ_PASS_RATIO,
} = await import('../src/utils/gamification');

const engine = await import('../src/utils/gamificationEngine');
const progressService = await import('../src/lib/progressService');
const progressLib = await import('../src/lib/progress');
const { SKILL_LEVELS } = await import('../src/data/learning-paths');

const STORAGE_KEY = GAMIFICATION_STORAGE_KEY;
const PRIVACY_KEY = 'nostrich-privacy-settings';

function storedState(): any | null {
  const raw = localStorageMock.getItem(STORAGE_KEY);
  return raw === null ? null : JSON.parse(raw);
}

function setPrivacySettings(overrides: Record<string, unknown>) {
  localStorageMock.setItem(
    PRIVACY_KEY,
    JSON.stringify({
      trackingEnabled: true,
      dataRetention: 'forever',
      showProgressIndicators: true,
      toursEnabled: true,
      ...overrides,
    })
  );
}

beforeEach(() => {
  localStorageMock.clear();
  // saveGamificationData and the engine log on every mutation — keep the
  // test output readable. console.warn stays observable via its own spy.
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// #48 — streak
// ---------------------------------------------------------------------------

describe('#48 streak: reading a guide updates the streak', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-01-15T12:00:00'));
  });

  it('first ever activity starts a 1-day streak', () => {
    recordActivity();
    const { streakDays, lastActive } = getStreakInfo();
    expect(streakDays).toBe(1);
    expect(lastActive).toBe(Date.now());
  });

  it('repeat activity on the same day keeps the streak unchanged', () => {
    recordActivity();
    vi.setSystemTime(new Date('2026-01-15T20:00:00'));
    recordActivity();
    expect(getStreakInfo().streakDays).toBe(1);
  });

  it('activity on the next calendar day increments the streak', () => {
    recordActivity();
    vi.setSystemTime(new Date('2026-01-16T09:00:00'));
    recordActivity();
    expect(getStreakInfo().streakDays).toBe(2);
    vi.setSystemTime(new Date('2026-01-17T23:00:00'));
    recordActivity();
    expect(getStreakInfo().streakDays).toBe(3);
  });

  it('a gap of more than one day resets the streak to 1', () => {
    recordActivity();
    vi.setSystemTime(new Date('2026-01-16T12:00:00'));
    recordActivity();
    expect(getStreakInfo().streakDays).toBe(2);
    vi.setSystemTime(new Date('2026-01-19T12:00:00'));
    recordActivity();
    expect(getStreakInfo().streakDays).toBe(1);
  });

  it('regression: the guide-page write order (setLastViewedGuide, then viewGuide) still increments the streak', () => {
    // Day 1: user reads a guide — the exact ProgressTracker call order.
    progressLib.setLastViewedGuide('quickstart', 'Quickstart');
    engine.recordActivity('viewGuide');
    expect(getStreakInfo().streakDays).toBe(1);

    // Day 2, first write: setLastViewedGuide must NOT touch lastActive.
    // Pre-fix it stamped Date.now() here, so recordActivity always saw a
    // same-day repeat and the streak was pinned at 0 forever.
    vi.setSystemTime(new Date('2026-01-16T08:00:00'));
    const lastActiveBefore = getStreakInfo().lastActive;
    progressLib.setLastViewedGuide('what-is-nostr', 'What is Nostr');
    expect(getStreakInfo().lastActive).toBe(lastActiveBefore);

    engine.recordActivity('viewGuide');
    expect(getStreakInfo().streakDays).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// #49 — badge-earned event
// ---------------------------------------------------------------------------

describe('#49 badge-earned event reaches the modal listener', () => {
  let seen: Array<Record<string, any>>;
  const handler = (event: Event) => {
    seen.push((event as CustomEvent).detail);
  };

  beforeEach(() => {
    seen = [];
    windowMock.addEventListener(BADGE_EARNED_EVENT, handler);
  });

  afterEach(() => {
    windowMock.removeEventListener(BADGE_EARNED_EVENT, handler);
  });

  it('the shared constant pins the public event name', () => {
    // BadgeEarnedModalListener binds this constant; the persisted event name
    // is public API for any page script listening to it.
    expect(BADGE_EARNED_EVENT).toBe('badge-earned');
  });

  it('awardBadge dispatches the event with the full badge payload', () => {
    awardBadge('privacy-expert');

    expect(seen).toHaveLength(1);
    expect(seen[0]).toMatchObject({
      id: 'privacy-expert',
      name: 'Privacy Expert',
      rarity: 'epic',
    });
    expect(seen[0].emoji).toBeTruthy();
    expect(seen[0].description).toBeTruthy();
    expect(seen[0].requirement).toBeTruthy();
    expect(seen[0].unlockedAt).toBeInstanceOf(Date);
  });

  it('badges earned through guide completion dispatch the event too', () => {
    completeGuideInLevel('what-is-nostr', 'beginner');
    completeGuideInLevel('keys-and-security', 'beginner');
    completeGuideInLevel('finding-community', 'beginner');

    expect(seen.map((d) => d.id)).toContain('knowledge-seeker');
  });

  it('the config-driven engine path dispatches the same event', () => {
    engine.recordActivity('generateKeys');

    expect(seen.map((d) => d.id)).toContain('key-master');
    expect(hasBadge('key-master')).toBe(true);
  });

  it('an already-earned badge does not dispatch again', () => {
    awardBadge('privacy-expert');
    awardBadge('privacy-expert');
    expect(seen).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// #54 — repurposed badges
// ---------------------------------------------------------------------------

describe('#54 first-post and zap-receiver are earnable again', () => {
  it('completing the Quickstart guide earns first-post', () => {
    engine.markGuideComplete('quickstart');
    expect(hasBadge('first-post')).toBe(true);
    expect(storedState()!.progress.completedByLevel.beginner).toContain('quickstart');
  });

  it('completing the Zaps guide earns zap-receiver', () => {
    engine.markGuideComplete('zaps-and-lightning');
    expect(hasBadge('zap-receiver')).toBe(true);
    expect(storedState()!.progress.completedByLevel.intermediate).toContain('zaps-and-lightning');
  });

  it('the guides backing the repurposed badges exist in the skill-level sequences', () => {
    const allSlugs = Object.values(SKILL_LEVELS).flatMap((l: any) => l.sequence);
    expect(allSlugs).toContain('quickstart');
    expect(allSlugs).toContain('zaps-and-lightning');
  });

  it('the legacy client stats still earn the repurposed badges', () => {
    recordFirstPost();
    recordZapReceived();
    expect(hasBadge('first-post')).toBe(true);
    expect(hasBadge('zap-receiver')).toBe(true);
  });

  it('every defined badge is earnable through an in-app path (no dead badges)', () => {
    recordKeysGenerated(); // key-master
    recordKeysBackedUp(); // security-conscious
    updateFollowedAccounts(10); // community-builder
    updateConnectedRelays(3); // relay-explorer
    recordPrivacyQuizPerfectScore(); // privacy-expert (via check below)

    const nineGuides = [
      ...SKILL_LEVELS.beginner.sequence, // 7 guides, includes quickstart
      'nip05-identity',
      'zaps-and-lightning',
    ];
    nineGuides.forEach((slug) => engine.markGuideComplete(slug));

    checkAndAwardBadges();

    const data = loadGamificationData();
    const unearned = BADGE_DEFINITIONS.filter((b) => !data.badges[b.id].earned).map((b) => b.id);
    expect(unearned).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// #50 — level threshold
// ---------------------------------------------------------------------------

describe('#50 level-unlock threshold has one canonical source', () => {
  it('getLevelUnlockThreshold is the canonical formula', () => {
    expect(getLevelUnlockThreshold(0)).toBe(4); // floor of 4
    expect(getLevelUnlockThreshold(6)).toBe(5); // ceil(4.2)
    expect(getLevelUnlockThreshold(7)).toBe(5); // ceil(4.9)
    expect(getLevelUnlockThreshold(10)).toBe(7); // ceil(7.0)
  });

  it('getLevelProgress derives canUnlockNext from the canonical threshold', () => {
    const level = 'beginner' as const;
    const total = SKILL_LEVELS[level].sequence.length;
    const threshold = getLevelUnlockThreshold(total);

    SKILL_LEVELS[level].sequence
      .slice(0, threshold - 1)
      .forEach((slug: string) => completeGuideInLevel(slug, level));
    expect(getLevelProgress(level).canUnlockNext).toBe(false);

    completeGuideInLevel(SKILL_LEVELS[level].sequence[threshold - 1], level);
    const progress = getLevelProgress(level);
    expect(progress.completed).toBe(threshold);
    expect(progress.total).toBe(total);
    expect(progress.canUnlockNext).toBe(true);
  });

  it('the wrapper in lib/progress delegates instead of re-deriving', () => {
    completeGuideInLevel('what-is-nostr', 'beginner');
    expect(progressLib.getLevelProgressLocal('beginner')).toEqual(getLevelProgress('beginner'));
  });
});

// ---------------------------------------------------------------------------
// #52 — export / import
// ---------------------------------------------------------------------------

describe('#52 export/import round-trips the full state', () => {
  function buildRichState() {
    recordKeysGenerated(); // key-master badge + stat
    updateConnectedRelays(3); // relay-explorer badge + stat
    engine.markGuideComplete('quickstart'); // first-post badge + per-level progress
    engine.markGuideComplete('what-is-nostr');
    recordQuizResult('what-is-nostr', 5, 5); // a passed quiz
    recordQuizResult('outbox-model', 1, 5); // an attempted-but-failed quiz
    recordActivity(); // streak 1 + lastActive
  }

  it('the export contains the full gamification state', () => {
    buildRichState();
    const exported = JSON.parse(progressService.exportProgressData());

    // legacy fields kept for backwards compatibility
    expect(exported.schemaVersion).toBe(1);
    expect(exported.guides.quickstart.status).toBe('completed');

    // the full state rides along (#52)
    expect(exported.gamification.badges['key-master'].earned).toBe(true);
    expect(exported.gamification.progress.completedByLevel.beginner).toContain('quickstart');
    expect(exported.gamification.progress.streakDays).toBe(1);
    expect(exported.gamification.stats.relaysConnected).toBe(3);
    expect(exported.gamification.version).toBe(1);
    // Quiz results are the only record of understanding, so an export that drops
    // them loses the reader's levels while looking complete.
    expect(exported.gamification.progress.quizResults['what-is-nostr'].score).toBe(5);
    expect(exported.gamification.progress.quizResults['what-is-nostr'].passedAt).toBeGreaterThan(0);
    expect(exported.gamification.progress.quizResults['outbox-model'].passedAt).toBe(0);
  });

  it('a full export round-trips onto a fresh browser', () => {
    buildRichState();
    const exported = progressService.exportProgressData();
    const before = storedState()!;

    localStorageMock.clear(); // fresh browser

    expect(progressService.importProgressData(exported)).toBe(true);

    const after = storedState()!;
    expect(after.badges['key-master'].earned).toBe(true);
    expect(after.badges['relay-explorer'].earned).toBe(true);
    expect(after.badges['first-post'].earned).toBe(true);
    expect([...after.progress.completedGuides].sort()).toEqual(
      [...before.progress.completedGuides].sort()
    );
    expect(after.progress.completedByLevel).toEqual(before.progress.completedByLevel);
    expect(after.progress.streakDays).toBe(before.progress.streakDays);
    expect(after.stats.keysGenerated).toBe(true);
    expect(after.stats.relaysConnected).toBe(3);
    expect(after.progress.quizResults).toEqual(before.progress.quizResults);
    expect(hasPassedQuiz('what-is-nostr')).toBe(true);
    expect(hasPassedQuiz('outbox-model')).toBe(false);
  });

  it('the old partial export shape still imports the completed guides', () => {
    const oldShape = {
      deviceId: 'legacy-device',
      schemaVersion: 1,
      guides: {
        quickstart: {
          guideId: 'quickstart',
          status: 'completed',
          timeSpentSeconds: 0,
          maxScrollDepth: 100,
          checklistCompleted: [],
          lastVisitedAt: '2026-01-01T00:00:00.000Z',
          completedAt: '2026-01-01T00:00:00.000Z',
        },
      },
      preferences: {
        trackingEnabled: true,
        dataRetention: 'forever',
        showProgressIndicators: true,
        toursEnabled: true,
      },
      lastUpdatedAt: '2026-01-01T00:00:00.000Z',
    };

    expect(progressService.importProgressData(JSON.stringify(oldShape))).toBe(true);
    expect(getCompletedGuides()).toContain('quickstart');
    // the persisted state must be the full schema, not a badges-less torso
    // that the loader would have to repair (or quarantine) later
    const state = storedState()!;
    expect(state.badges['key-master']).toEqual({ earned: false, earnedAt: 0 });
    expect(state.stats.keysGenerated).toBe(false);
  });

  it('importing merges with local progress instead of overwriting it', () => {
    engine.markGuideComplete('what-is-nostr');
    recordKeysGenerated(); // local: key-master

    const snapshot = JSON.parse(progressService.exportProgressData());
    localStorageMock.clear();

    // a different browser earned different things
    engine.markGuideComplete('faq');
    recordKeysBackedUp(); // local: security-conscious

    expect(progressService.importProgressData(JSON.stringify(snapshot))).toBe(true);

    const state = storedState()!;
    expect(state.progress.completedGuides).toContain('what-is-nostr');
    expect(state.progress.completedGuides).toContain('faq');
    expect(state.badges['key-master'].earned).toBe(true);
    expect(state.badges['security-conscious'].earned).toBe(true);
  });

  it('invalid JSON and unrecognized shapes are rejected', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(progressService.importProgressData('not json at all')).toBe(false);
    expect(progressService.importProgressData('{}')).toBe(false);
    expect(progressService.importProgressData('{"foo": 1}')).toBe(false);
    expect(storedState()).toBeNull();
  });

  it('import restores data even when tracking is disabled, including newly satisfied badges', () => {
    setPrivacySettings({ trackingEnabled: false });

    const snapshot = {
      deviceId: 'other-device',
      schemaVersion: 1,
      guides: {},
      preferences: {},
      lastUpdatedAt: '2026-01-01T00:00:00.000Z',
      gamification: {
        ...JSON.parse(JSON.stringify(loadGamificationData())),
      },
    };
    // three completed guides, but the exporting browser never ran the badge
    // check — the import must award knowledge-seeker itself, inside its
    // forced write (a plain checkAndAwardBadges save would be gated off).
    snapshot.gamification.progress.completedGuides = ['what-is-nostr', 'faq', 'quickstart'];

    expect(progressService.importProgressData(JSON.stringify(snapshot))).toBe(true);

    const state = storedState()!;
    expect(state.progress.completedGuides).toHaveLength(3);
    expect(state.badges['knowledge-seeker'].earned).toBe(true);
    expect(state.badges['first-post'].earned).toBe(true); // quickstart is in the list
  });
});

// ---------------------------------------------------------------------------
// #111 — corrupt storage latch
// ---------------------------------------------------------------------------

describe('#111 corrupt localStorage value cannot latch writes off', () => {
  it('a corrupt stored value is quarantined on load', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorageMock.setItem(STORAGE_KEY, '{corrupt json!!!');

    const data = loadGamificationData();

    expect(data.progress.completedGuides).toEqual([]);
    expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();
    expect(warn).toHaveBeenCalled();
  });

  it('non-object JSON (a bare string) is quarantined too', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorageMock.setItem(STORAGE_KEY, '"just a string"');

    const data = loadGamificationData();

    expect(data.badges['key-master'].earned).toBe(false);
    expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();
  });

  it('a partial-but-valid state is normalized, NOT quarantined', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // shape an old-style partial writer could have left: progress only
    localStorageMock.setItem(
      STORAGE_KEY,
      JSON.stringify({ progress: { completedGuides: ['faq'] }, version: 1 })
    );

    const data = loadGamificationData();

    expect(data.progress.completedGuides).toEqual(['faq']);
    expect(data.progress.streakDays).toBe(0);
    expect(data.badges['key-master'].earned).toBe(false);
    expect(localStorageMock.getItem(STORAGE_KEY)).not.toBeNull(); // kept
    expect(warn).not.toHaveBeenCalled();
  });

  it('a corrupt stored value does not block the next write (the old latch)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Corruption appears AFTER the load (e.g. another tab) — this isolates
    // the save-side quarantine: pre-fix, every save re-parsed the corrupt
    // value, threw, and bailed before setItem — permanently.
    const data = loadGamificationData();
    data.badges['key-master'] = { earned: true, earnedAt: 123 };
    localStorageMock.setItem(STORAGE_KEY, '{corrupt json!!!');

    saveGamificationData(data);

    const state = storedState();
    expect(state).not.toBeNull();
    expect(state!.badges['key-master'].earned).toBe(true);
    expect(warn).toHaveBeenCalled();

    // and the system keeps working afterwards
    recordActivity();
    expect(getStreakInfo().streakDays).toBe(1);
  });

  it('the full award flow recovers from a corrupt value end to end', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorageMock.setItem(STORAGE_KEY, '{corrupt json!!!');

    expect(awardBadge('key-master')).toBe(true);
    expect(storedState()!.badges['key-master'].earned).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// #51 — privacy gate
// ---------------------------------------------------------------------------

describe('#51 the privacy toggle gates every gamification write', () => {
  it('tracking disabled blocks streak, badge and completion writes', () => {
    setPrivacySettings({ trackingEnabled: false });

    recordActivity();
    completeGuideInLevel('quickstart', 'beginner');
    engine.recordActivity('generateKeys');

    expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();
  });

  it('setLastViewedGuide respects the toggle', () => {
    setPrivacySettings({ trackingEnabled: false });

    progressLib.setLastViewedGuide('quickstart', 'Quickstart');

    expect(localStorageMock.getItem('nostrich-last-viewed')).toBeNull();
    expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();
  });

  it('tracking defaults to enabled when no settings are stored', () => {
    recordActivity();
    expect(storedState()).not.toBeNull();
  });

  it('force-writes for explicit user restores bypass the gate', () => {
    setPrivacySettings({ trackingEnabled: false });

    const data = loadGamificationData();
    data.progress.completedGuides = ['faq'];
    saveGamificationData(data, { force: true });

    expect(storedState()!.progress.completedGuides).toEqual(['faq']);
  });

  it('re-enabling tracking lets writes through again', () => {
    setPrivacySettings({ trackingEnabled: false });
    recordActivity();
    expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();

    setPrivacySettings({ trackingEnabled: true });
    recordActivity();
    expect(getStreakInfo().streakDays).toBe(1);
  });

  it('the legacy shouldShowProgressIndicators honors the settings (used to hard-return true)', () => {
    expect(progressLib.shouldShowProgressIndicators()).toBe(true);
    setPrivacySettings({ trackingEnabled: false });
    expect(progressLib.shouldShowProgressIndicators()).toBe(false);
    setPrivacySettings({ trackingEnabled: true, showProgressIndicators: false });
    expect(progressLib.shouldShowProgressIndicators()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Review follow-ups (2026-07-28): phantom celebrations, the residual
// lastActive stamp, and the lying session-retention import.
// ---------------------------------------------------------------------------

describe('review: no phantom celebration when tracking is disabled', () => {
  it('awardBadge with tracking off neither persists nor dispatches', () => {
    setPrivacySettings({ trackingEnabled: false });
    const events: Event[] = [];
    const listener = (e: Event) => events.push(e);
    windowMock.addEventListener(BADGE_EARNED_EVENT, listener);

    const result = awardBadge('privacy-expert');

    windowMock.removeEventListener(BADGE_EARNED_EVENT, listener);
    expect(result).toBe(false);
    expect(events).toHaveLength(0);
    expect(storedState()).toBeNull();
  });

  it('recordQuizResult with tracking off neither persists nor announces a pass', () => {
    setPrivacySettings({ trackingEnabled: false });
    const events: Event[] = [];
    const listener = (e: Event) => events.push(e);
    windowMock.addEventListener('quiz-completed', listener);

    // A perfect score, which would otherwise pass and could complete a level.
    const result = recordQuizResult('what-is-nostr', 5, 5);

    windowMock.removeEventListener('quiz-completed', listener);
    expect(result).toBe(false);
    expect(events).toHaveLength(0);
    expect(storedState()).toBeNull();
  });

  it('checkAndAwardBadges with tracking off reports no awards and stays silent', () => {
    recordKeysGenerated();
    setPrivacySettings({ trackingEnabled: false });
    // wipe the persisted award so the criterion is satisfied but unearned
    localStorageMock.removeItem(STORAGE_KEY);

    const events: Event[] = [];
    const listener = (e: Event) => events.push(e);
    windowMock.addEventListener(BADGE_EARNED_EVENT, listener);

    const result = checkAndAwardBadges();

    windowMock.removeEventListener(BADGE_EARNED_EVENT, listener);
    expect(result.newlyEarned).toHaveLength(0);
    expect(events).toHaveLength(0);
  });

  it('the engine path with tracking off does not dispatch either', () => {
    setPrivacySettings({ trackingEnabled: false });
    const events: Event[] = [];
    const listener = (e: Event) => events.push(e);
    windowMock.addEventListener(BADGE_EARNED_EVENT, listener);

    engine.recordActivity('selectRelays', { count: 5 });

    windowMock.removeEventListener(BADGE_EARNED_EVENT, listener);
    expect(events).toHaveLength(0);
    expect(storedState()).toBeNull();
  });
});

describe('review: recordActivity() is the sole owner of lastActive', () => {
  it('a scroll-progress write before the day\'s first recordActivity does not eat the streak increment', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-27T10:00:00Z'));
    recordActivity('viewGuide');
    expect(getStreakInfo().streakDays).toBe(1);

    // Next calendar day: the scroll tracker fires FIRST (the race from the
    // review) — updateGuideProgress -> saveProgressData used to stamp
    // lastActive with "now", making recordActivity see a same-day repeat.
    vi.setSystemTime(new Date('2026-07-28T09:00:00Z'));
    progressService.updateGuideProgress('what-is-nostr', { scrollProgress: 42 });
    recordActivity('viewGuide');

    expect(getStreakInfo().streakDays).toBe(2);
    vi.useRealTimers();
  });
});

describe('review: session-retention import reports honestly', () => {
  it('an old-shape import that persists nothing returns false', () => {
    setPrivacySettings({ dataRetention: 'session' });
    const oldShape = JSON.stringify({
      schemaVersion: 1,
      guides: { 'what-is-nostr': { completed: true } },
    });
    expect(progressService.importProgressData(oldShape)).toBe(false);
    expect(storedState()).toBeNull();
  });

  it('a full-shape import still succeeds under session retention (forced gamification restore)', () => {
    recordKeysGenerated();
    completeGuideInLevel('what-is-nostr', 'beginner');
    const exported = progressService.exportProgressData();

    localStorageMock.clear();
    setPrivacySettings({ dataRetention: 'session' });

    expect(progressService.importProgressData(exported)).toBe(true);
    expect(storedState()?.stats?.keysGenerated).toBe(true);
  });
});

describe('review: threshold counters persist for badge progress display', () => {
  it('select-relays stores relaysConnected so progress is not stuck at 0/3', () => {
    engine.recordActivity('selectRelays', { count: 2 });
    expect(storedState()?.stats?.relaysConnected).toBe(2);
    // a lower later count must not regress the high-water mark
    engine.recordActivity('selectRelays', { count: 1 });
    expect(storedState()?.stats?.relaysConnected).toBe(2);
  });

  it('followAccounts stores accountsFollowed', () => {
    engine.recordActivity('followAccounts', { count: 4 });
    expect(storedState()?.stats?.accountsFollowed).toBe(4);
  });
});
// ---------------------------------------------------------------------------
// Quiz results — the site's only record of comprehension
// ---------------------------------------------------------------------------

describe('quiz results record understanding, not attendance', () => {
  it('a passing score is stored and marked passed', () => {
    expect(recordQuizResult('what-is-nostr', 4, 5)).toBe(true);

    const result = getQuizResult('what-is-nostr');
    expect(result).toMatchObject({ score: 4, total: 5, attempts: 1 });
    expect(result!.passedAt).toBeGreaterThan(0);
    expect(hasPassedQuiz('what-is-nostr')).toBe(true);
  });

  it('a failing score is stored but does not count as passed', () => {
    expect(recordQuizResult('what-is-nostr', 1, 5)).toBe(false);
    expect(hasPassedQuiz('what-is-nostr')).toBe(false);
    expect(getQuizResult('what-is-nostr')?.passedAt).toBe(0);
  });

  it('the pass mark is the shared constant, not a hard-coded number', () => {
    const total = 10;
    const justBelow = Math.ceil(QUIZ_PASS_RATIO * total) - 1;

    expect(recordQuizResult('outbox-model', justBelow, total)).toBe(false);
    expect(recordQuizResult('outbox-model', Math.ceil(QUIZ_PASS_RATIO * total), total)).toBe(true);
  });

  it('retaking a quiz can only improve the stored result', () => {
    recordQuizResult('relay-guide', 5, 5);
    recordQuizResult('relay-guide', 1, 5); // a careless retake

    const result = getQuizResult('relay-guide');
    expect(result).toMatchObject({ score: 5, total: 5, attempts: 2 });
    expect(hasPassedQuiz('relay-guide')).toBe(true);
  });

  it('a pass, once earned, is never revoked by a later attempt', () => {
    recordQuizResult('nip05-identity', 5, 5);
    const passedAt = getQuizResult('nip05-identity')!.passedAt;

    recordQuizResult('nip05-identity', 0, 5);
    expect(getQuizResult('nip05-identity')!.passedAt).toBe(passedAt);
  });

  it('getPassedQuizzes lists only quizzes actually passed', () => {
    recordQuizResult('what-is-nostr', 5, 5);
    recordQuizResult('outbox-model', 0, 5);

    expect(getPassedQuizzes()).toEqual(['what-is-nostr']);
  });

  it('nonsense input is refused rather than persisted', () => {
    expect(recordQuizResult('', 1, 1)).toBe(false);
    expect(recordQuizResult('what-is-nostr', 0, 0)).toBe(false);
    expect(getQuizResult('what-is-nostr')).toBeNull();
  });
});

describe('level completion needs guides read AND quizzes passed', () => {
  it('reading every guide is not enough on its own', async () => {
    const { SKILL_LEVELS: levels, getLevelQuizzes } = await import(
      '../src/data/learning-paths'
    );
    for (const slug of levels.beginner.sequence) completeGuideInLevel(slug, 'beginner');

    const completion = getLevelCompletion('beginner');
    expect(completion.guidesRead).toBe(levels.beginner.sequence.length);
    expect(completion.quizzesPassed).toBe(0);
    expect(completion.complete).toBe(false);
    expect(getLevelQuizzes('beginner').length).toBeGreaterThan(0);
  });

  it('reading everything and passing every quiz completes the level', async () => {
    const { SKILL_LEVELS: levels, getLevelQuizzes } = await import(
      '../src/data/learning-paths'
    );
    for (const slug of levels.beginner.sequence) completeGuideInLevel(slug, 'beginner');
    for (const slug of getLevelQuizzes('beginner')) recordQuizResult(slug, 5, 5);

    const completion = getLevelCompletion('beginner');
    expect(completion.complete).toBe(true);
    expect(completion.percent).toBe(100);
  });

  it('the active level is the first unfinished one, derived not stored', async () => {
    const { SKILL_LEVELS: levels, getLevelQuizzes } = await import(
      '../src/data/learning-paths'
    );
    expect(getActiveLevel()).toBe('beginner');

    for (const slug of levels.beginner.sequence) completeGuideInLevel(slug, 'beginner');
    for (const slug of getLevelQuizzes('beginner')) recordQuizResult(slug, 5, 5);

    expect(getActiveLevel()).toBe('intermediate');
  });

  it('a quiz passed in one level does not count toward another', () => {
    recordQuizResult('privacy-security', 5, 5); // an advanced-level quiz

    expect(getLevelCompletion('beginner').quizzesPassed).toBe(0);
    expect(getLevelCompletion('advanced').quizzesPassed).toBe(1);
  });
});
