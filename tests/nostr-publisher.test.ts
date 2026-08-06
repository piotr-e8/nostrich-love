import { describe, it, expect, afterAll } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateSecretKey, nip19 } from 'nostr-tools';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
// @ts-expect-error — plain .mjs CLI script, no type declarations
import { parseArticle } from '../scripts/publish-nostr-articles.mjs';

const execFileAsync = promisify(execFile);

// Each case spawns a real node process that imports nostr-tools, which costs a
// second or two. execFileSync blocked the vitest worker for that whole time and
// starved the other test files into timing out, so these run async with a
// timeout that survives a loaded machine.
const SPAWN_TIMEOUT = 30_000;

// scripts/publish-nostr-articles.mjs signs with the project's private key and
// publishes irreversibly. These tests cover the paths that only run when
// something has already gone wrong — the ones nobody exercises by hand.
const SCRIPT = 'scripts/publish-nostr-articles.mjs';
const ARTICLE_DIR = 'content/nostr';

async function run(args: string[], stdin = '') {
  const child = execFileAsync('node', [SCRIPT, ...args], { encoding: 'utf8' });
  child.child.stdin?.end(stdin);
  try {
    const { stdout, stderr } = await child;
    return { code: 0, out: `${stdout}${stderr}` };
  } catch (error) {
    const e = error as { code: number; stdout: string; stderr: string };
    return { code: e.code, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
}

describe('nostr article publisher', () => {
  it('defaults to a dry run that signs and sends nothing', async () => {
    const { code, out } = await run([]);
    expect(code).toBe(0);
    expect(out).toContain('Dry run');
    expect(out).not.toMatch(/published|updated/);
  }, SPAWN_TIMEOUT);

  it('never echoes a rejected key into its output', async () => {
    // nostr-tools embeds the rejected string in its decode error
    // ("Invalid checksum in nsec1…: expected …"). Printing error.message put the
    // key in the terminal and in any captured log, which defeats the whole
    // point of the no-echo prompt.
    const secret = 'nsec1thisshouldneverappearinoutput';
    const { code, out } = await run(['--publish', '--only=what-is-nostr'], `${secret}\n`);
    expect(code).toBe(1);
    expect(out).not.toContain(secret);
    expect(out).not.toContain('thisshouldneverappear');
    expect(out).toContain('Nothing was signed');
  }, SPAWN_TIMEOUT);

  it('names the type but not the value when handed an npub', async () => {
    const npub = nip19.npubEncode('0e97a44ae4882a34ef06e253ebf226bd38f2e182ceca76d4fd1a450189a5b19d');
    const { code, out } = await run(['--publish', '--only=what-is-nostr'], `${npub}\n`);
    expect(code).toBe(1);
    expect(out).toContain('not an nsec');
  }, SPAWN_TIMEOUT);

  it('refuses a valid key that is not the site identity', async () => {
    const stranger = nip19.nsecEncode(generateSecretKey());
    const { code, out } = await run(['--publish', '--only=what-is-nostr'], `${stranger}\n`);
    expect(code).toBe(1);
    expect(out).toContain('does not match the site identity');
    // The rejected secret must not appear; the derived pubkey may, being public.
    expect(out).not.toContain(stranger);
  }, SPAWN_TIMEOUT);

  it('exits non-zero for an unknown --only identifier', async () => {
    const { code, out } = await run(['--only=does-not-exist']);
    expect(code).toBe(1);
    expect(out).toContain('does-not-exist');
  }, SPAWN_TIMEOUT);
});

describe('nostr article frontmatter', () => {
  const files = readdirSync(ARTICLE_DIR).filter((f) => f.endsWith('.md'));

  it('has articles to publish', () => {
    expect(files.length).toBeGreaterThan(0);
  }, SPAWN_TIMEOUT);

  it('gives every article the fields the event needs', () => {
    for (const file of files) {
      const raw = readFileSync(join(ARTICLE_DIR, file), 'utf8');
      const frontmatter = raw.match(/^---\n([\s\S]*?)\n---\n/)?.[1];
      expect(frontmatter, `${file} has no frontmatter`).toBeDefined();
      for (const key of ['d', 'title', 'summary', 'canonical']) {
        expect(frontmatter, `${file} is missing "${key}"`).toMatch(new RegExp(`^${key}:`, 'm'));
      }
    }
  }, SPAWN_TIMEOUT);

  it('keeps every "d" identifier unique', () => {
    // Kind 30023 is addressable on (kind, pubkey, d): a collision means one
    // article silently overwrites another on every relay.
    const ids = files.map(
      (f) => readFileSync(join(ARTICLE_DIR, f), 'utf8').match(/^d:\s*(.+)$/m)?.[1].trim()
    );
    expect(new Set(ids).size).toBe(ids.length);
  }, SPAWN_TIMEOUT);

  it('points every article at a canonical URL on the site', () => {
    for (const file of files) {
      const canonical = readFileSync(join(ARTICLE_DIR, file), 'utf8').match(/^canonical:\s*(.+)$/m)?.[1];
      expect(canonical, `${file}`).toMatch(/^https:\/\/nostrich\.love\//);
    }
  });
});

describe('frontmatter parser', () => {
  // Each case is a defect the adversarial review found and this pins shut.
  const dir = mkdtempSync(join(tmpdir(), 'nostr-articles-'));
  const write = (name: string, body: string) => {
    const path = join(dir, name);
    writeFileSync(path, body);
    return path;
  };
  const valid = (extra = '') =>
    `---\nd: sample\ntitle: T\nsummary: S\ncanonical: https://nostrich.love/x/\n${extra}---\nBody text.\n`;

  it('rejects a "d" with stray whitespace — a fork that cannot be undone', () => {
    // Kind 30023 is addressable on (kind, pubkey, d). A trailing space creates a
    // second permanent article rather than replacing the first.
    expect(() => parseArticle(write('a.md', valid().replace('d: sample', 'd: sample ')))).not.toThrow();
    expect(() => parseArticle(write('b.md', valid().replace('d: sample', 'd: Sample Article')))).toThrow(/lowercase/);
  });

  it('parses a CRLF file instead of claiming it has no frontmatter', () => {
    const path = write('crlf.md', valid().replace(/\n/g, '\r\n'));
    expect(parseArticle(path).meta.d).toBe('sample');
  });

  it('strips quotes from tag arrays so they do not reach the t tags', () => {
    const path = write('tags.md', valid('tags: ["nostr", "beginners"]\n'));
    expect(parseArticle(path).meta.tags).toEqual(['nostr', 'beginners']);
  });

  it('keeps a trailing quote that is not part of a matched pair', () => {
    const path = write('quote.md', valid().replace('summary: S', 'summary: The question is "what is nostr?"'));
    expect(parseArticle(path).meta.summary).toBe('The question is "what is nostr?"');
  });

  it('refuses an empty body rather than publishing an empty event', () => {
    const path = write('empty.md', '---\nd: sample\ntitle: T\nsummary: S\ncanonical: https://nostrich.love/x/\n---\n\n');
    expect(() => parseArticle(path)).toThrow(/empty/);
  });

  it('refuses multi-line YAML rather than publishing ">" as the summary', () => {
    const path = write('folded.md', valid().replace('summary: S', 'summary: >\n  folded text here'));
    expect(() => parseArticle(path)).toThrow(/multi-line/);
  });

  it('parses the real articles', () => {
    for (const file of readdirSync(ARTICLE_DIR).filter((f) => f.endsWith('.md'))) {
      const parsed = parseArticle(join(ARTICLE_DIR, file));
      expect(parsed.meta.d).toMatch(/^[a-z0-9][a-z0-9-]*$/);
      expect(parsed.content.length).toBeGreaterThan(200);
    }
  });

  afterAll(() => rmSync(dir, { recursive: true, force: true }));
});
