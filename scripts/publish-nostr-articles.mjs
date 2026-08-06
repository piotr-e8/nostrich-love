#!/usr/bin/env node
/**
 * Publish the long-form articles in content/nostr/ to Nostr as NIP-23 events.
 *
 * These are NOT copies of the site's guides. njump, habla and yakihonne render
 * kind 30023 as indexable web pages, so republishing a guide verbatim would put
 * a worse copy — no quizzes, no simulators, one language — on a domain with more
 * authority than nostrich.love has, competing with the original. The files in
 * content/nostr/ are written for a reader already inside a Nostr client, and
 * each one closes with a link to the full guide.
 *
 * SAFETY
 *   The secret key is read from the NOSTR_NSEC environment variable or from
 *   stdin — never from an argument, because arguments are visible to every
 *   other process on the machine via `ps`. It is never logged, never written to
 *   disk, and the derived pubkey is checked against the site's published
 *   identity before anything is signed.
 *
 * IDEMPOTENCE
 *   Kind 30023 is addressable: a re-publish with the same `d` tag REPLACES the
 *   previous version rather than creating a second article. The `d` value comes
 *   from frontmatter and must never be edited after first publish, or readers
 *   end up with two copies and the old one wins on some relays.
 *
 * USAGE
 *   node scripts/publish-nostr-articles.mjs                 # dry run, prints the events
 *   node scripts/publish-nostr-articles.mjs --publish       # actually publishes
 *   node scripts/publish-nostr-articles.mjs --only=what-is-nostr
 *
 *   NOSTR_NSEC=nsec1... node scripts/publish-nostr-articles.mjs --publish
 *   or leave it unset and paste when prompted.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { finalizeEvent, getPublicKey, nip19, SimplePool } from 'nostr-tools';

const ARTICLE_DIR = 'content/nostr';

/** The site's own identity, from public/.well-known/nostr.json. */
const EXPECTED_PUBKEY = JSON.parse(
  readFileSync('public/.well-known/nostr.json', 'utf8')
).names._;

/**
 * Fallback relays, used only if the account publishes no kind 10002 relay list.
 * Kept deliberately short and mainstream — a wrong relay set means the article
 * is signed correctly and read by nobody.
 */
const FALLBACK_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.nostr.band',
  'wss://relay.primal.net',
];

const args = process.argv.slice(2);
const shouldPublish = args.includes('--publish');
const only = args.find((a) => a.startsWith('--only='))?.slice('--only='.length);

/** Strip a surrounding quote PAIR only — a value that merely ends in a quote keeps it. */
const unquote = (v) => {
  const m = v.match(/^"([\s\S]*)"$|^'([\s\S]*)'$/);
  return m ? (m[1] ?? m[2]) : v;
};

/** Minimal frontmatter parser — these files are ours and the shape is fixed. */
export function parseArticle(path) {
  // Normalize CRLF: the frontmatter regex wants bare LF, and a CRLF file would
  // otherwise be reported as having no frontmatter at all.
  const raw = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${path}: no frontmatter block`);

  const meta = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rawValue] = kv;
    const value = rawValue.trim();
    // Multi-line YAML would be silently captured as ">" or "|" and the
    // continuation lines skipped, publishing a one-character summary.
    if (value === '>' || value === '|') {
      throw new Error(`${path}: multi-line YAML is not supported for "${key}" — put it on one line`);
    }
    meta[key] =
      value.startsWith('[') && value.endsWith(']')
        ? value.slice(1, -1).split(',').map((v) => unquote(v.trim())).filter(Boolean)
        : unquote(value);
  }

  for (const required of ['d', 'title', 'summary', 'canonical']) {
    if (!meta[required]) throw new Error(`${path}: frontmatter is missing "${required}"`);
  }
  // `d` is the one field where a typo is unrecoverable: a stray space or a
  // changed character forks the article into a second, permanent copy.
  if (!/^[a-z0-9][a-z0-9-]*$/.test(meta.d)) {
    throw new Error(`${path}: "d" must be lowercase letters, digits and hyphens — got ${JSON.stringify(meta.d)}`);
  }

  const content = match[2].trim();
  if (!content) throw new Error(`${path}: article body is empty`);
  return { meta, content, path };
}

/**
 * A NIP-23 long-form event. `published_at` is the FIRST publication time and
 * must survive edits, so it is only set when the article is new — on a
 * re-publish the existing value is carried over from the relay copy.
 */
function buildEvent({ meta, content }, publishedAt) {
  const tags = [
    ['d', meta.d],
    ['title', meta.title],
    ['summary', meta.summary],
    ['published_at', String(publishedAt)],
    // NIP-24 web reference recording where the full version lives. It is
    // machine-readable but NOT honoured as a canonical by any renderer — the
    // in-content link at the end of each article is what actually sends readers back.
    ['r', meta.canonical],
    ...(meta.image ? [['image', meta.image]] : []),
    // NIP-24: a `t` value MUST be lowercase.
    ...(meta.tags ?? []).map((tag) => ['t', String(tag).toLowerCase()]),
  ];
  return { kind: 30023, created_at: Math.floor(Date.now() / 1000), tags, content };
}

/**
 * Read a secret from the terminal WITHOUT echoing it.
 *
 * readline echoes every keystroke back to its output — verified: piping a key
 * through `rl.question` renders it in the terminal, where it lands in
 * scrollback, in a screen recording, and in anything scraping the pane. Raw
 * mode collects the keystrokes and prints nothing.
 */
function readSecret(prompt) {
  const { stdin, stderr } = process;

  // Piped or redirected input: nothing is echoed anyway, so just read a line.
  if (!stdin.isTTY) {
    return new Promise((resolve) => {
      let data = '';
      stdin.setEncoding('utf8');
      stdin.on('data', (chunk) => {
        data += chunk;
      });
      stdin.on('end', () => resolve(data));
    });
  }

  return new Promise((resolve, reject) => {
    stderr.write(prompt);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    let buffer = '';
    const finish = (fn, value) => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener('data', onData);
      stderr.write('\n');
      fn(value);
    };
    // Compared by char code so no raw control bytes live in this source —
    // they render as invisible characters and a careless edit silently drops them.
    const onData = (char) => {
      const code = char.charCodeAt(0);
      if (char === '\n' || char === '\r' || code === 4) return finish(resolve, buffer); // Enter, Ctrl-D
      if (code === 3) return finish(reject, new Error('cancelled')); // Ctrl-C
      if (code === 127 || char === '\b') {
        buffer = buffer.slice(0, -1);
        return;
      }
      buffer += char;
    };
    stdin.on('data', onData);
  });
}

/** Tolerate the ways a key arrives from a paste: quotes, a nostr: prefix, stray whitespace. */
function normalizeNsec(raw) {
  return raw
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/^nostr:/i, '')
    .trim();
}

async function readSecretKey() {
  const fromEnv = process.env.NOSTR_NSEC;
  if (fromEnv?.trim()) return normalizeNsec(fromEnv);
  return normalizeNsec(
    await readSecret('nsec (not echoed, not stored, not logged): ')
  );
}

async function main() {
  const files = readdirSync(ARTICLE_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parseArticle(join(ARTICLE_DIR, f)))
    .filter((a) => !only || a.meta.d === only);

  if (files.length === 0) {
    console.error(only ? `No article with d="${only}"` : `No articles in ${ARTICLE_DIR}`);
    process.exit(1);
  }

  const duplicates = files.map((a) => a.meta.d).filter((d, i, all) => all.indexOf(d) !== i);
  if (duplicates.length) {
    console.error(`Duplicate "d" identifiers: ${duplicates.join(', ')} — these would overwrite each other.`);
    process.exit(1);
  }

  console.log(`${files.length} article(s) in ${ARTICLE_DIR}:\n`);
  for (const a of files) {
    console.log(`  ${a.meta.d}`);
    console.log(`    title    ${a.meta.title}`);
    console.log(`    summary  ${a.meta.summary.slice(0, 76)}${a.meta.summary.length > 76 ? '…' : ''}`);
    console.log(`    words    ${a.content.split(/\s+/).filter(Boolean).length}`);
    console.log(`    canonical ${a.meta.canonical}\n`);
  }

  if (!shouldPublish) {
    console.log('Dry run — nothing was signed or sent. Re-run with --publish to go live.');
    console.log('Read the articles first: they publish under your identity, as your words.');
    return;
  }

  const nsec = await readSecretKey();
  if (!nsec) {
    console.error('No key provided.');
    process.exit(1);
  }

  let secretKey;
  try {
    const decoded = nip19.decode(nsec);
    if (decoded.type !== 'nsec') {
      // Report the TYPE, never the value — an npub here is a user error worth
      // naming, and the value itself might still be the secret.
      console.error(`That is a ${decoded.type}, not an nsec. Refusing to continue.`);
      process.exit(1);
    }
    secretKey = decoded.data;
  } catch {
    // Deliberately NOT surfacing error.message: nostr-tools embeds the rejected
    // string in it ("Invalid checksum in nsec1…: expected …"), so printing it
    // would put the key in the terminal and in any captured log — the exact
    // leak this script's no-echo prompt exists to prevent.
    console.error('Could not decode that as a bech32 nsec. Nothing was signed.');
    process.exit(1);
  }

  // Refuse to sign with the wrong identity. Publishing these under a personal
  // key by accident is not undoable — the events are signed and propagated.
  const pubkey = getPublicKey(secretKey);
  if (pubkey !== EXPECTED_PUBKEY) {
    console.error('That key does not match the site identity in public/.well-known/nostr.json.');
    console.error(`  expected ${EXPECTED_PUBKEY}`);
    console.error(`  got      ${pubkey}`);
    console.error('Refusing to publish. Set the right key, or update nostr.json if the identity moved.');
    process.exit(1);
  }

  // Track which relays we actually reached. pool.get() returns null both when
  // an article genuinely does not exist and when no relay could be contacted,
  // and that ambiguity would silently mint a fresh published_at on every
  // network hiccup — rewriting the article's first-publication date forever.
  const reached = new Set();
  const pool = new SimplePool();
  pool.onRelayConnectionSuccess = (url) => reached.add(url);

  // Publish where this account says it writes (NIP-65), not where we guess.
  let relays = FALLBACK_RELAYS;
  try {
    const relayList = await pool.get(FALLBACK_RELAYS, { kinds: [10002], authors: [pubkey] });
    const declared = relayList?.tags
      .filter((t) => t[0] === 'r' && (t.length < 3 || t[2] === 'write'))
      .map((t) => t[1]);
    if (declared?.length) {
      relays = declared;
      console.log(`\nUsing the account's declared write relays (kind 10002): ${relays.length}`);
    } else {
      console.log('\nNo kind 10002 relay list found — using fallback relays.');
    }
  } catch {
    console.log('\nCould not fetch the relay list — using fallback relays.');
  }
  for (const relay of relays) console.log(`  ${relay}`);

  console.log('');
  let failed = 0;
  for (const article of files) {
    reached.clear();
    const existing = await pool.get(relays, {
      kinds: [30023],
      authors: [pubkey],
      '#d': [article.meta.d],
    });

    // Absence is only meaningful if we actually spoke to a relay.
    if (!existing && reached.size === 0) {
      console.log(`skipped   ${article.meta.d}  could not reach any relay — refusing to guess it is new`);
      failed++;
      continue;
    }

    const publishedAt =
      Number(existing?.tags.find((t) => t[0] === 'published_at')?.[1]) ||
      Math.floor(Date.now() / 1000);

    const event = finalizeEvent(buildEvent(article, publishedAt), secretKey);
    const settled = await Promise.allSettled(pool.publish(relays, event));

    // A publish promise FULFILLS with the string "connection failure: …" when
    // the relay could not be reached (nostr-tools abstract-pool.js), so status
    // alone over-reports success — it would print 6/6 having sent nothing.
    const outcomes = settled.map((result, i) => {
      const detail = result.status === 'fulfilled' ? String(result.value) : String(result.reason);
      return { relay: relays[i], accepted: result.status === 'fulfilled' && !detail.startsWith('connection failure'), detail };
    });
    const accepted = outcomes.filter((o) => o.accepted).length;

    const naddr = nip19.naddrEncode({ kind: 30023, pubkey, identifier: article.meta.d, relays });
    const verb = accepted === 0 ? 'FAILED   ' : existing ? 'updated  ' : 'published';
    console.log(`${verb} ${article.meta.d}  ${accepted}/${relays.length} relays`);
    if (accepted > 0) console.log(`          https://njump.me/${naddr}`);
    for (const o of outcomes.filter((x) => !x.accepted)) {
      console.log(`          ${o.relay}: ${o.detail}`);
    }
    if (accepted === 0) failed++;
  }

  // destroy(), not close(relays): the kind 10002 lookup opened sockets to the
  // FALLBACK_RELAYS, which are not in `relays` once a declared list is found,
  // and close() only shuts the URLs it is handed — the script would hang.
  pool.destroy();

  if (failed > 0) {
    console.log(`\n${failed} article(s) did not publish. Nothing was half-written — re-run when the network is back.`);
    process.exitCode = 1;
    return;
  }
  console.log('\nDone. Give relays a minute, then open the njump links above to check rendering.');
}

// Only run when invoked directly, so tests can import parseArticle without
// the CLI firing on import.
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
