import { SKILL_LEVELS } from '../data/learning-paths';

/**
 * Topic map for the "Filter by interest" chips on /guides.
 *
 * SINGLE SOURCE OF TRUTH for which guide belongs to which topic. The guide set
 * is identical in all seven locales (same 16 slugs under src/content/guides/<locale>/),
 * so one map keyed by slug serves every locale.
 *
 * Why a map and not frontmatter: the filter used to substring-match an English
 * chip value ("privacy", "relays") against the *translated* title and
 * description. In Polish, Chinese, Arabic and Hindi that matched almost nothing,
 * so most chips rendered an empty guides page. Frontmatter tags would fix it too,
 * but at the cost of 112 files that then have to stay in sync by hand.
 *
 * How topics were assigned: by what a guide is actually about, not by what it
 * mentions in passing. Two guides are deliberately broad because they really are
 * cross-cutting references whose top-level sections map one-to-one onto these
 * topics: faq (29 questions spanning keys, clients, relays, DMs, zaps and
 * finding people) and nostr-tools (a directory whose H2 sections are Key
 * Management, Media Hosting, Identity, Relay Tools, Lightning & Zaps, Privacy &
 * Security, Community Resources).
 *
 * Two guides carry no topic on purpose: what-is-nostr and protocol-comparison
 * are orientation pieces about the protocol as a whole. Filing them under a
 * topic would be stretching. They are always reachable under "All Guides".
 */

export const GUIDE_TOPIC_IDS = [
  'bitcoin',
  'privacy',
  'security',
  'relays',
  'tools',
  'community',
] as const;

export type GuideTopicId = (typeof GUIDE_TOPIC_IDS)[number];

const GUIDE_TOPICS = {
  // Beginner
  'what-is-nostr': [],
  'keys-and-security': ['security'],
  quickstart: ['tools'],
  'finding-community': ['community'],
  faq: ['bitcoin', 'privacy', 'security', 'relays', 'tools', 'community'],
  'relays-demystified': ['relays'],
  'outbox-model': ['relays'],

  // Intermediate
  'nip05-identity': ['tools'],
  'zaps-and-lightning': ['bitcoin'],
  'nostr-tools': ['bitcoin', 'privacy', 'security', 'relays', 'tools', 'community'],
  troubleshooting: ['relays', 'tools'],
  'multi-client': ['tools'],
  'relay-guide': ['relays'],

  // Advanced
  'privacy-security': ['privacy', 'security'],
  'nip17-private-messages': ['privacy', 'security'],
  'protocol-comparison': [],
} as const satisfies Record<string, readonly GuideTopicId[]>;

export type GuideSlug = keyof typeof GUIDE_TOPICS;

/** True when `value` is one of the six chip ids (and not free text from the search box). */
export function isGuideTopicId(value: string): value is GuideTopicId {
  return (GUIDE_TOPIC_IDS as readonly string[]).includes(value);
}

/** Topics for a guide slug. Unknown slugs get an empty list rather than throwing. */
export function getGuideTopics(slug: string): readonly GuideTopicId[] {
  return (GUIDE_TOPICS as Record<string, readonly GuideTopicId[]>)[slug] ?? [];
}

export function guideMatchesTopic(slug: string, topic: GuideTopicId): boolean {
  return getGuideTopics(slug).includes(topic);
}

/**
 * Dev-only drift guard: a 17th guide added to SKILL_LEVELS without an entry here
 * would silently disappear from every chip. Warn loudly during development.
 */
if (import.meta.env?.DEV) {
  const missing = Object.values(SKILL_LEVELS)
    .flatMap((level) => level.sequence)
    .filter((slug) => !(slug in GUIDE_TOPICS));
  if (missing.length > 0) {
    console.warn(
      `[guide-topics] No topic entry for: ${missing.join(', ')}. ` +
        'These guides will never appear under an interest filter.'
    );
  }
}
