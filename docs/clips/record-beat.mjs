#!/usr/bin/env node
// Record any beat of the site, from a storyboard, by driving headless Chrome.
//
//   npm run build && npm run preview          # serves on 4321
//   BEAT=relays-simulator node docs/clips/record-beat.mjs
//
// This is the general form of record-quiz.mjs, which could only ever drive a
// [data-quiz] card and only ever produced discrete post-click stills. Here the
// interaction is data (docs/clips/beats/<name>.mjs) and there are two capture
// modes:
//
//   shoot — one frame per state, for things that change on click
//   film  — Page.startScreencast, for things that animate on their own
//
// `film` is the reason this file exists. Page.captureScreenshot tops out at
// 2.8fps for a clipped card (353ms/frame, measured), so a loop of screenshots
// cannot record motion. startScreencast pushes a frame whenever Chrome
// composites one — bursts of 20-30ms frames through each transition, silence in
// between — and each frame carries metadata.timestamp, so the encode can give
// every frame the duration it actually had. Encoding those same frames flat at
// 0.42s, the way record-quiz.mjs does, stretched a 7.3s beat to 10.1s.
//
// Everything the site stores about a reader is localStorage, so the storyboard
// can seed it. That is not faking a run: it puts the browser in the state of
// someone who has done the rest of the course, and then the run is real.

import { spawn } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '../..');
const OUT = join(HERE, 'out');
const PORT = process.env.PORT ?? '4321';
const BASE = process.env.BASE ?? `http://localhost:${PORT}`;
const BEAT = process.env.BEAT;
const CHROME =
  process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CDP_PORT = Number(process.env.CDP_PORT ?? 9340);
const SCALE = Number(process.env.SCALE ?? 2);
const KEEP_FRAMES = process.env.KEEP_FRAMES === '1';

if (!BEAT) {
  const available = readdirSync(join(HERE, 'beats')).filter((f) => f.endsWith('.mjs')).map((f) => f.replace('.mjs', ''));
  console.error(`BEAT=<name> required. Available: ${available.join(', ')}`);
  process.exit(1);
}

const board = (await import(pathToFileURL(join(HERE, 'beats', `${BEAT}.mjs`)).href)).default;
const VW = board.viewport?.w ?? 620;
const VH = board.viewport?.h ?? 1600;
const FRAMES = join(HERE, 'shots', BEAT);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Seeding
//
// loadGamificationData() normalises a partial object (gamification.ts:529-547),
// so the seed only has to carry what it wants to be true.
// ---------------------------------------------------------------------------

/** Every BadgeId, read from the file that must list all of them. */
function allBadgeIds() {
  const src = readFileSync(join(REPO, 'src/config/badge-categories.ts'), 'utf8');
  const body = src.slice(src.indexOf('BADGE_CATEGORY'));
  const ids = [...body.matchAll(/^\s+'([a-z0-9-]+)':/gm)].map((m) => m[1]);
  if (ids.length < 12) throw new Error(`Expected >=12 badge ids in badge-categories.ts, found ${ids.length}`);
  return ids;
}

function buildSeed(seed) {
  if (!seed) return null;
  const now = Date.now();
  const quizResults = {};
  for (const slug of seed.passedQuizzes ?? []) {
    quizResults[slug] = { score: 6, total: 6, attempts: 1, passedAt: now - 86400000 };
  }
  const data = {
    version: 1,
    progress: {
      completedGuides: seed.completedGuides ?? [],
      completedGuidesWithTimestamps: (seed.completedGuides ?? []).map((id) => ({
        id, completedAt: new Date(now - 86400000).toISOString(),
      })),
      quizResults,
      streakDays: 0,
      lastActive: now,
      currentLevel: seed.currentLevel ?? 'beginner',
      unlockedLevels: ['beginner', 'intermediate', 'advanced'],
      manualUnlock: false,
      completedByLevel: seed.completedByLevel ?? { beginner: [], intermediate: [], advanced: [] },
      lastInterestFilter: null,
    },
  };

  // Pre-earn every badge except the one this beat is about. Otherwise an
  // unrelated award fires mid-take: recon hit a full-screen "BADGE EARNED! Zap
  // Receiver" modal that dimmed the page and swallowed clicks on the quiz.
  if (seed.earnAllBadgesExcept) {
    const except = new Set(seed.earnAllBadgesExcept);
    data.badges = Object.fromEntries(
      allBadgeIds().map((id) => [id, except.has(id) ? { earned: false, earnedAt: 0 } : { earned: true, earnedAt: now - 86400000 }])
    );
    for (const id of except) if (!allBadgeIds().includes(id)) throw new Error(`Unknown badge id in earnAllBadgesExcept: ${id}`);
  }
  return data;
}

// ---------------------------------------------------------------------------
// Minimal CDP client, with events
// ---------------------------------------------------------------------------
class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
    ws.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data);
      if (msg.method) {
        for (const fn of this.listeners.get(msg.method) ?? []) fn(msg.params);
        return;
      }
      const p = this.pending.get(msg.id);
      if (!p) return;
      this.pending.delete(msg.id);
      msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
    });
  }
  on(method, fn) {
    if (!this.listeners.has(method)) this.listeners.set(method, []);
    this.listeners.get(method).push(fn);
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.delete(id)) reject(new Error(`${method} timed out`));
      }, 30000);
    });
  }
  async eval(expression) {
    const { result, exceptionDetails } = await this.send('Runtime.evaluate', {
      expression, returnByValue: true, awaitPromise: true,
    });
    if (exceptionDetails) throw new Error(exceptionDetails.text);
    return result.value;
  }
}

async function connect() {
  for (let i = 0; i < 40; i++) {
    try {
      const list = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`).then((r) => r.json());
      const page = list.find((t) => t.type === 'page');
      if (page?.webSocketDebuggerUrl) {
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((res, rej) => {
          ws.addEventListener('open', res, { once: true });
          ws.addEventListener('error', rej, { once: true });
        });
        return new CDP(ws);
      }
    } catch { /* chrome not up yet */ }
    await sleep(250);
  }
  throw new Error('Could not reach Chrome on the debugging port');
}

// ---------------------------------------------------------------------------
// Selectors
//
// "text:Play" matches a button by its exact label — the storyboards are written
// against what is on screen, not against class names that a redesign will move.
// ---------------------------------------------------------------------------
function resolver(sel) {
  if (sel.startsWith('text:')) {
    const label = sel.slice(5);
    return `[...document.querySelectorAll('button, a')].find(e => e.textContent.trim() === ${JSON.stringify(label)})`;
  }
  if (sel.startsWith('contains:')) {
    const label = sel.slice(9);
    return `[...document.querySelectorAll('button, a')].find(e => e.textContent.trim().includes(${JSON.stringify(label)}))`;
  }
  // "find:figure|No shared relay" — the first element matching the CSS whose text
  // contains the phrase. Needed for crop targets that are not controls: the three
  // diagrams on this guide are all `figure.not-prose` and only their text tells
  // them apart, while :nth-of-type counts within each figure's own parent.
  if (sel.startsWith('find:')) {
    const [css, phrase] = sel.slice(5).split('|');
    return `[...document.querySelectorAll(${JSON.stringify(css)})].find(e => e.textContent.includes(${JSON.stringify(phrase)}))`;
  }
  return `document.querySelector(${JSON.stringify(sel)})`;
}

// The crop target is pinned to the ELEMENT, not to the selector that found it.
// A label-based selector stops matching the moment the beat changes it: pinning
// the crop to `text:Play` lost the card as soon as the button became "Pause",
// and the post-take drift check blew up on a null rect.
function pinExpr() {
  const closest = board.cardFrom ? `.closest(${JSON.stringify(board.cardFrom)})` : '';
  return `(() => {
    const el = ${resolver(board.card)};
    if (!el) return false;
    const card = el${closest} || el;
    window.__beatCard = card;

    // The crop has to hold the card in its LARGEST state, and the card grows
    // mid-take: the zap simulator's green confirmation slides in on click and
    // auto-dismisses 3s later, so measuring before and after the take both
    // return the small card and the confirmation gets cropped off the bottom.
    // Watch it instead, and keep the union of every size it takes.
    const grow = () => {
      const r = card.getBoundingClientRect();
      const b = window.__beatBox;
      window.__beatBox = b
        ? { x0: Math.min(b.x0, r.x), y0: Math.min(b.y0, r.y), x1: Math.max(b.x1, r.right), y1: Math.max(b.y1, r.bottom) }
        : { x0: r.x, y0: r.y, x1: r.right, y1: r.bottom };
    };
    grow();
    new ResizeObserver(grow).observe(card);
    window.__beatGrow = grow;
    return true;
  })()`;
}

/** Union of every size the card has taken since it was pinned, in CSS px. */
const BOX = `(() => {
  if (window.__beatGrow) window.__beatGrow();
  const b = window.__beatBox;
  if (!b) return null;
  return { x: Math.round(b.x0), y: Math.round(b.y0), w: Math.round(b.x1 - b.x0), h: Math.round(b.y1 - b.y0) };
})()`;

/** Rect of the pinned crop target, viewport-relative, in CSS px. */
const RECT = `(() => {
  const t = window.__beatCard;
  if (!t || !t.isConnected) return null;
  const r = t.getBoundingClientRect();
  return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
})()`;

// Clicking must not scroll. An earlier version called scrollIntoView({block:
// 'center'}) here, which centred the *button* — and since Play sits low in the
// simulator card, that shoved the card 104px up and invalidated the crop that
// had just been measured. By the time a step runs, the crop is already framed:
// if the target is not on screen, that is a storyboard bug, not something to
// silently correct.
async function clickSel(cdp, sel) {
  const probe = `(() => {
    const el = ${resolver(sel)};
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const x = r.x + r.width / 2, y = r.y + r.height / 2;
    // Being on screen is not the same as being clickable. The floating
    // "continue learning" bar sits over the bottom of the viewport, and a click
    // aimed at the quiz's "Next question" landed on it instead — the quiz stayed
    // on question 1 with every option disabled, and the failure only surfaced
    // three steps later. Ask the page what is actually under the cursor.
    const hit = document.elementFromPoint(x, y);
    return {
      x, y,
      onScreen: r.y >= 0 && r.y + r.height <= window.innerHeight && r.x >= 0,
      covered: !(hit && (el === hit || el.contains(hit) || hit.contains(el))),
      coveredBy: hit ? (hit.textContent || '').trim().slice(0, 40) || hit.tagName : 'nothing',
      text: el.textContent.trim().slice(0, 40),
    };
  })()`;

  // Overlays here are usually transient — RelayExplorer's toast dismisses itself
  // after 3s (RelayExplorer.tsx:399) — so wait one out before giving up. What
  // does not clear (a modal) still fails the run rather than mis-clicking.
  let box = await cdp.eval(probe);
  for (let waited = 0; box?.covered && waited < 6000; waited += 250) {
    await sleep(250);
    box = await cdp.eval(probe);
  }

  if (!box) {
    const labels = await cdp.eval(
      `[...document.querySelectorAll('button, a')].map(e => e.textContent.trim().slice(0, 24)).filter(Boolean).slice(0, 40)`
    );
    throw new Error(`Nothing matches ${sel}.\nClickable labels present: ${JSON.stringify(labels)}`);
  }
  if (!box.onScreen) throw new Error(`${sel} is outside the viewport — widen the crop or add a step to bring it in`);
  if (box.covered) throw new Error(`${sel} is still covered by "${box.coveredBy}" after 6s — the click would land on that instead`);
  for (const type of ['mousePressed', 'mouseReleased']) {
    await cdp.send('Input.dispatchMouseEvent', { type, x: box.x, y: box.y, button: 'left', clickCount: 1 });
  }
  return box.text;
}

// ---------------------------------------------------------------------------
// Quizzes
//
// The answer key comes from the same locale file the quiz renders from, so the
// run is real — it just knows the answers. Without this the recorder clicks
// whichever option comes first and the beat ends on a promo clip of somebody
// failing.
// ---------------------------------------------------------------------------
function correctAnswers(guide, locale = 'en') {
  const key = guide.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  const json = JSON.parse(readFileSync(join(REPO, `src/i18n/locales/${locale}.json`), 'utf8'));
  const questions = json.guides?.[key]?.quiz?.questions;
  if (!Array.isArray(questions) || !questions.length) {
    throw new Error(`No quiz questions at guides.${key}.quiz.questions in ${locale}.json`);
  }
  const labels = questions.map((q) => q.options.find((o) => o.id === q.correctId)?.label);
  if (labels.some((l) => !l)) throw new Error('A question has no option matching its correctId');
  return labels;
}

const ff = (args) => new Promise((res, rej) => {
  spawn('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' })
    .on('exit', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg exited ${c}`))));
});
const ffprobe = (f) => new Promise((res) => {
  const p = spawn('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=width,height',
    '-select_streams', 'v:0', '-of', 'default=nw=1', f]);
  let buf = '';
  p.stdout.on('data', (d) => (buf += d));
  p.on('exit', () => res(buf.trim().replace(/\n/g, ' ')));
});

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
rmSync(FRAMES, { recursive: true, force: true });
mkdirSync(FRAMES, { recursive: true });
mkdirSync(OUT, { recursive: true });

const PROFILE = join(HERE, `.chrome-profile-${BEAT}`);
const chrome = spawn(CHROME, [
  '--headless=new',
  // GPU off by default: it is one less source of machine-to-machine variation.
  // Turn it on per beat (`gpu: true`) when the scene is expensive to composite —
  // the badge modal stacks 50 animated confetti particles over a
  // `backdrop-blur-sm` backdrop, and software rasterising that starves the
  // screencast of frames.
  ...(board.gpu ? [] : ['--disable-gpu']),
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  // Components call toLocaleString() with no locale argument, so numbers follow
  // the BROWSER locale: on a Polish Mac the zap presets render "10 000" on an
  // English page. Pin it.
  '--lang=en-US',
  `--remote-debugging-port=${CDP_PORT}`,
  `--user-data-dir=${PROFILE}`,
  `--window-size=${VW},${VH}`,
  // Screencast frames come back at CSS-pixel size unless this is set; the
  // emulation override's deviceScaleFactor does not affect them.
  `--force-device-scale-factor=${SCALE}`,
  'about:blank',
], { stdio: 'ignore' });

/** [{ file, ts }] in capture order; ts is seconds, monotonic within a take. */
const timeline = [];
let shotIndex = 0;
/** The crop, in viewport CSS px. Set once the layout settles; used after the
 *  browser is gone, so it lives out here. */
let rect = null;
/** Set between `record: 'start'` and `record: 'stop'`. */
let rolling = null;

let cdp;
try {
  cdp = await connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: VW, height: VH, deviceScaleFactor: SCALE, mobile: false,
  });
  // Components call toLocaleString() with no locale argument, so numbers follow
  // the browser's locale: a Polish host renders the zap presets as "10 000" on
  // an English page. Chrome's --lang flag does not reach the renderer (it still
  // reports --lang=pl), so override it over CDP, which does.
  try {
    await cdp.send('Emulation.setLocaleOverride', { locale: board.locale ?? 'en-US' });
  } catch (e) {
    console.warn(`  ! locale override failed (${e.message}); numbers will follow the host locale`);
  }

  // Block relay sockets unless a beat asks for them. RelayExplorer opens real
  // WebSockets on mount and, when they settle, slides a "Relay status check
  // complete!" toast up from the bottom of the viewport — which covered the
  // quiz's "Next question" button, so the click landed on the toast and the quiz
  // silently stayed on question 1. It is also the page's only source of
  // run-to-run variation: how many relays answer differs every time.
  if (!board.network) {
    await cdp.send('Network.enable');
    await cdp.send('Network.setBlockedURLs', { urls: ['wss://*', 'ws://*'] });
  }

  const seed = buildSeed(board.seed);
  if (seed) {
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
      source: `try { localStorage.setItem('nostrich-gamification-v1', ${JSON.stringify(JSON.stringify(seed))}); } catch (e) {}`,
    });
    console.log(`· seeded ${seed.progress.completedGuides.length} guides read, ` +
      `${Object.keys(seed.progress.quizResults).length} quizzes passed` +
      (seed.badges ? `, ${Object.values(seed.badges).filter((b) => !b.earned).length} badge(s) left to earn` : ''));
  }

  const url = `${BASE}/guides/${board.guide}/`;
  console.log(`· ${url}`);
  await cdp.send('Page.navigate', { url });

  // The page keeps growing after load as the below-fold islands hydrate —
  // measured 11,697px -> 21,101px on relays-demystified, settling ~4.7s in.
  // Recording before that reframes the crop mid-take.
  await sleep(board.settleMs ?? 6500);

  // The site scrolls smoothly, so a rect read right after scrollBy catches the
  // page mid-glide — measured 117px short. Make every scroll instant.
  await cdp.eval(`(() => {
    const s = document.createElement('style');
    s.textContent = 'html, body { scroll-behavior: auto !important; }';
    document.head.appendChild(s);
  })()`);

  // `card: 'viewport'` frames the whole window rather than one element. That is
  // what a full-screen overlay needs — the badge modal is `fixed inset-0` with
  // confetti falling across the entire page, so cropping to any element inside
  // it would cut the effect that makes the beat.
  if (board.card === 'viewport') {
    rect = { x: 0, y: 0, w: VW, h: VH };
    console.log(`· framing the whole ${VW}x${VH} viewport`);
  } else if (!(await cdp.eval(pinExpr()))) {
    const labels = await cdp.eval(
      `[...document.querySelectorAll('button, a')].map(e => e.textContent.trim().slice(0, 24)).filter(Boolean).slice(0, 40)`
    );
    throw new Error(`Crop target ${board.card} not found on ${url}.\nClickable labels present: ${JSON.stringify(labels)}`);
  }

  if (board.card !== 'viewport') {
    // Park the crop target in the viewport and hold until it stops moving.
    for (let attempt = 1; attempt <= 8; attempt++) {
      await cdp.eval(`(() => {
        const r = window.__beatCard.getBoundingClientRect();
        const margin = Math.max(24, (${VH} - r.height) / 2);
        window.scrollBy(0, Math.round(r.y - margin));
      })()`);
      await sleep(500);
      const a = await cdp.eval(RECT);
      await sleep(700);
      const b = await cdp.eval(RECT);
      if (a.y === b.y && a.h === b.h && b.y >= 0 && b.y + b.h <= VH) { rect = b; break; }
      if (attempt === 8) throw new Error(`Layout never settled around ${board.card} (y=${b.y} h=${b.h} vh=${VH})`);
    }
    console.log(`· crop target settled at ${rect.x},${rect.y} ${rect.w}x${rect.h} css px`);

    // The box is measured in VIEWPORT coordinates, and the settling loop above
    // scrolled the page several times — so the readings taken while the card was
    // still off-screen belong to a different frame of reference. Start it over
    // now that the page is where it will stay.
    await cdp.eval(`(() => { window.__beatBox = null; window.__beatGrow(); })()`);
  }

  // Nothing full-screen may be covering the page when the take starts.
  const blocker = await cdp.eval(`(() => {
    const el = [...document.querySelectorAll('div,section')].find(e => {
      const s = getComputedStyle(e);
      return s.position === 'fixed' && e.getBoundingClientRect().height > ${VH * 0.6} && s.display !== 'none';
    });
    return el ? (el.className || '').slice(0, 80) : null;
  })()`);
  if (blocker) throw new Error(`Something full-screen is covering the page: ${blocker}`);

  // -------------------------------------------------------------------------
  // Run the storyboard
  // -------------------------------------------------------------------------
  let clock = 0; // seconds into the beat
  for (const step of board.steps) {
    if (step.wait) { await sleep(step.wait); clock += step.wait / 1000; continue; }

    // Only meaningful with `card: 'viewport'`. With an element crop the frame is
    // already parked and scrolling would invalidate it, which the drift check
    // catches — so refuse it there rather than produce a quietly broken take.
    if (step.scrollTo) {
      if (board.card !== 'viewport') throw new Error('scrollTo needs `card: "viewport"` — scrolling moves an element crop');
      // 'top' is its own case: scrollIntoView on the h1 leaves it tucked under
      // the sticky site header, which reads as a page opened halfway.
      const ok = await cdp.eval(step.scrollTo === 'top'
        ? `(() => { window.scrollTo(0, 0); return true; })()`
        : `(() => {
        const el = ${resolver(step.scrollTo)};
        if (!el) return false;
        el.scrollIntoView({ block: ${JSON.stringify(step.block ?? 'center')}, behavior: 'instant' });
        return true;
      })()`);
      if (!ok) throw new Error(`scrollTo target ${step.scrollTo} not found`);
      await sleep(step.after ?? 600);
      console.log(`  · scrollTo ${step.scrollTo}`);
      continue;
    }

    // Answer the current question correctly. Options are unique per question,
    // so matching against the whole answer key is stateless and cannot fall out
    // of step with the quiz.
    // `answer: true` picks the right option, `answer: 'wrong'` a wrong one.
    // Both matter on camera: a run that never misses hides the thing the quiz is
    // actually for, which is telling you what you got wrong and why.
    if (step.answer) {
      const KEY = correctAnswers(board.guide, board.locale?.startsWith('en') === false ? board.locale : 'en');
      const wanted = step.answer === 'wrong';
      const CORRECT = KEY;
      // Wait for the option rather than assuming a fixed delay after "Next
      // question" was enough. It was not, intermittently: React had not painted
      // the next question yet and the run died on roughly one attempt in three.
      let box = null;
      for (let waited = 0; waited < 4000; waited += 150) {
        box = await cdp.eval(`(() => {
          const root = document.querySelector('[data-quiz]');
          if (!root) return null;
          const key = ${JSON.stringify(CORRECT)};
          const isAnswer = (b) => key.some((l) => b.textContent.trim().startsWith(l));
          // Options are the buttons carrying an answer; the controls (Back, Next
          // question, See results) are excluded by name so a wrong pick cannot
          // land on one of them.
          const controls = ['Back', 'Next question', 'See results', 'Retake quiz'];
          const options = [...root.querySelectorAll('button')].filter(
            (b) => !b.disabled && !controls.includes(b.textContent.trim())
          );
          const el = ${wanted} ? options.find((b) => !isAnswer(b)) : options.find(isAnswer);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: r.x + r.width / 2, y: r.y + r.height / 2, onScreen: r.y >= 0 && r.y + r.height <= window.innerHeight };
        })()`);
        if (box) break;
        await sleep(150);
      }
      if (!box) {
        if (wanted) throw new Error('No wrong option available — does this question have only one choice?');
        const state = await cdp.eval(`(() => {
          const root = document.querySelector('[data-quiz]');
          if (!root) return { card: 'no [data-quiz] in the DOM' };
          const r = root.getBoundingClientRect();
          return {
            cardY: Math.round(r.y), cardH: Math.round(r.height), innerH: window.innerHeight,
            heading: root.querySelector('h3')?.textContent.trim().slice(0, 40),
            buttons: [...root.querySelectorAll('button')].map((b) => ({ t: b.textContent.trim().slice(0, 40), off: b.disabled })),
          };
        })()`);
        throw new Error(`No unanswered correct option appeared within 4s.\nQuiz state: ${JSON.stringify(state, null, 1)}`);
      }
      if (!box.onScreen) throw new Error('The correct option is outside the viewport — the quiz card is taller than the window');
      for (const type of ['mousePressed', 'mouseReleased']) {
        await cdp.send('Input.dispatchMouseEvent', { type, x: box.x, y: box.y, button: 'left', clickCount: 1 });
      }
      // The answer feedback fades in; a frame taken too early catches it mid-transition.
      await sleep(step.after ?? 450);
      clock += (step.after ?? 450) / 1000;
      console.log(`  · answer${wanted ? ' (wrong, on purpose)' : ''}`);
      continue;
    }

    if (step.click) {
      const label = await clickSel(cdp, step.click);
      console.log(`  · click ${step.click}${label && label !== step.click.slice(5) ? ` ("${label}")` : ''}`);
      await sleep(step.after ?? 450);
      clock += (step.after ?? 450) / 1000;
      continue;
    }

    if (step.shoot) {
      // Deliberately NOT clipped. Screencast can only give whole viewports, so
      // stills are captured the same way and both are cropped once, in ffmpeg —
      // otherwise the two frame sizes cannot go in one concat list.
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 92 });
      const file = join(FRAMES, `${String(shotIndex++).padStart(4, '0')}.jpg`);
      writeFileSync(file, Buffer.from(data, 'base64'));
      timeline.push({ file, ts: clock, hold: step.hold ?? 0.42 });
      clock += step.hold ?? 0.42;
      console.log(`  · shoot ${step.shoot}`);
      continue;
    }

    // `record: 'start'` … other steps … `record: 'stop'` films across a whole
    // sequence of interactions instead of one. The quiz needed it: shooting a
    // frame per answer skipped four of the six questions and then cut hard to
    // the result, while filming it straight through keeps the component's own
    // slide-in between questions and there is nothing to jump over.
    if (step.record === 'start') {
      rolling = { frames: [], startedAt: clock };
      cdp.on('Page.screencastFrame', async (p) => {
        rolling?.frames.push({ ts: p.metadata.timestamp, buf: Buffer.from(p.data, 'base64') });
        try { await cdp.send('Page.screencastFrameAck', { sessionId: p.sessionId }); } catch {}
      });
      await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, everyNthFrame: 1 });
      await sleep(200);
      console.log('  · record start');
      continue;
    }

    if (step.record === 'stop') {
      if (!rolling) throw new Error("record: 'stop' without a matching start");
      await cdp.send('Page.stopScreencast');
      await sleep(300);
      cdp.listeners.delete('Page.screencastFrame');
      const { frames } = rolling;
      rolling = null;
      if (frames.length < 4) throw new Error(`record "${step.name}" captured only ${frames.length} frames`);
      const t0 = frames[0].ts;
      const tail = step.hold ?? 0.2;
      frames.forEach((f, i) => {
        const file = join(FRAMES, `${String(shotIndex++).padStart(4, '0')}.jpg`);
        writeFileSync(file, f.buf);
        const next = i + 1 < frames.length ? frames[i + 1].ts : f.ts + tail;
        timeline.push({ file, ts: f.ts - t0, hold: Math.max(0.02, next - f.ts) });
      });
      const span = frames.at(-1).ts - t0;
      console.log(`  · record stop ${step.name}: ${frames.length} frames over ${span.toFixed(2)}s`);
      continue;
    }

    if (step.film) {
      const frames = [];
      cdp.on('Page.screencastFrame', async (p) => {
        frames.push({ ts: p.metadata.timestamp, buf: Buffer.from(p.data, 'base64') });
        try { await cdp.send('Page.screencastFrameAck', { sessionId: p.sessionId }); } catch {}
      });
      await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, everyNthFrame: 1 });
      await sleep(200);
      if (step.film.click) await clickSel(cdp, step.film.click);

      // A scroll beat: ease the page down inside the take. Driven by rAF in the
      // page rather than by scrollBy from here, so the motion is frame-paced and
      // the screencast has something new to send on every composite.
      if (step.film.scrollTo) {
        const started = await cdp.eval(`(() => {
          const el = ${resolver(step.film.scrollTo)};
          if (!el) return false;
          const start = window.scrollY;
          const target = start + el.getBoundingClientRect().y - ${step.film.stopAt ?? 80};
          const dur = ${step.film.ms};
          const t0 = performance.now();
          // easeInOutCubic: starts and ends still, so the beat does not jerk at
          // either end.
          const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
          return new Promise((done) => {
            const tick = (now) => {
              const t = Math.min(1, (now - t0) / dur);
              window.scrollTo(0, Math.round(start + (target - start) * ease(t)));
              t < 1 ? requestAnimationFrame(tick) : done(true);
            };
            requestAnimationFrame(tick);
          });
        })()`);
        if (!started) throw new Error(`film.scrollTo target ${step.film.scrollTo} not found`);
      }

      await sleep(step.film.ms);
      await cdp.send('Page.stopScreencast');
      await sleep(300);
      cdp.listeners.delete('Page.screencastFrame');

      if (frames.length < 4) throw new Error(`film "${step.film.name}" captured only ${frames.length} frames`);
      const t0 = frames[0].ts;
      // `hold` extends the LAST frame. Screencast stops emitting the moment the
      // page goes still, so a beat whose payoff is a static card — the badge
      // modal after the confetti settles — otherwise cuts a fifth of a second
      // after the last particle moves.
      const tail = step.film.hold ?? 0.2;
      frames.forEach((f, i) => {
        const file = join(FRAMES, `${String(shotIndex++).padStart(4, '0')}.jpg`);
        writeFileSync(file, f.buf);
        const next = i + 1 < frames.length ? frames[i + 1].ts : f.ts + tail;
        timeline.push({ file, ts: clock + (f.ts - t0), hold: Math.max(0.02, next - f.ts) });
      });
      const span = frames.at(-1).ts - t0;
      clock += span;
      const unique = new Set(frames.map((f) => f.buf.length)).size;
      console.log(`  · film ${step.film.name}: ${frames.length} frames over ${span.toFixed(2)}s, ${unique} distinct sizes`);
      if (unique < 3) throw new Error('Frames are nearly all identical — the camera is pointed at nothing moving');
      continue;
    }

    throw new Error(`Unknown step: ${JSON.stringify(step)}`);
  }

  // The crop target must not have moved, or the early and late frames want
  // different crops and one fixed crop serves neither.
  if (board.card !== 'viewport') {
    const after = await cdp.eval(RECT);
    if (!after) throw new Error('The crop target left the DOM during the take');
    // A card that GREW is fine — the crop is the union and already covers it.
    // A card that MOVED is not: the early and late frames want different crops.
    if (after.y !== rect.y) {
      throw new Error(`Crop target moved during the take (dy=${after.y - rect.y}) — take unusable`);
    }
    const box = await cdp.eval(BOX);
    if (box.h > rect.h) console.log(`· card grew to ${box.w}x${box.h} during the take; cropping to that`);
    rect = box;
  }

  if (board.assert) {
    const got = await cdp.eval(board.assert.expr);
    if (String(got) !== String(board.assert.equals)) {
      throw new Error(`Assertion failed: ${board.assert.expr} => ${JSON.stringify(got)}, expected ${JSON.stringify(board.assert.equals)}`);
    }
    console.log(`· asserted ${board.assert.equals}`);
  }
} finally {
  try { cdp?.ws.close(); } catch {}
  // SIGKILL on the launcher leaves the renderer helpers running — they outlive
  // the run, hold the debugging port's siblings open and pile up across takes.
  // Ask Chrome to close itself first, then kill anything still holding this
  // run's profile.
  try { await cdp?.send('Browser.close'); } catch {}
  chrome.kill('SIGKILL');
  await sleep(300);
  try { spawn('pkill', ['-f', PROFILE], { stdio: 'ignore' }); } catch {}
  await sleep(200);
  rmSync(PROFILE, { recursive: true, force: true });
}

// ---------------------------------------------------------------------------
// Encode: every frame is a whole viewport, cropped to the card once here.
// ---------------------------------------------------------------------------
if (!timeline.length) throw new Error('Storyboard captured nothing');

// The capture scale is whatever Chrome sent, not what was asked for.
const dims = (await ffprobe(timeline[0].file)).match(/width=(\d+)\s+height=(\d+)/);
const k = Number(dims[1]) / VW;
if (![1, 2, 3].includes(k)) throw new Error(`Unexpected capture scale ${k} (frames ${dims[1]}px for a ${VW}px viewport)`);
console.log(`· frames ${dims[1]}x${dims[2]}, capture scale ${k}`);

const pad = board.padding ?? 0;
const even = (n) => Math.max(2, Math.floor(n / 2) * 2);

// `maxHeight` keeps the crop to the top N css px of the card. Two reasons: a
// card can grow taller than the window (the wizard's solution card reaches
// 1676px in a 1600px viewport, and a crop past the frame edge is an ffmpeg
// error), and a very tall card scaled into the teaser's 860x1550 slot becomes an
// unreadable ribbon — the wizard at full height is aspect 0.29 against the
// slot's 0.55.
const wantH = board.maxHeight ? Math.min(rect.h, board.maxHeight) : rect.h;

const frameW = Number(dims[1]), frameH = Number(dims[2]);
const cx = Math.max(0, Math.round((rect.x - pad) * k));
const cy = Math.max(0, Math.round((rect.y - pad) * k));
const cw = Math.min(even((rect.w + pad * 2) * k), frameW - cx);
const ch = Math.min(even((wantH + pad * 2) * k), frameH - cy);
if (ch < even((wantH + pad * 2) * k)) {
  console.log(`· crop clamped to the frame: ${ch}px tall instead of ${even((wantH + pad * 2) * k)}`);
}
const crop = [cw, ch, cx, cy].join(':');

const list = timeline.map((f) => `file '${f.file}'\nduration ${f.hold.toFixed(3)}`).join('\n');
writeFileSync(join(OUT, `${BEAT}-frames.txt`), `${list}\nfile '${timeline.at(-1).file}'\n`);

const target = board.output ?? { w: 1080 };
const vf = `crop=${crop},scale=${target.w}:-2:flags=lanczos,format=yuv420p`;

await ff(['-f', 'concat', '-safe', '0', '-i', join(OUT, `${BEAT}-frames.txt`),
  '-vf', vf, '-r', '30', '-c:v', 'libx264', '-profile:v', 'high', '-movflags', '+faststart',
  join(OUT, `${BEAT}.mp4`)]);

console.log(`\nout/${BEAT}.mp4 — ${await ffprobe(join(OUT, `${BEAT}.mp4`))}`);
console.log(`${timeline.length} frames from ${board.steps.length} steps`);
if (!KEEP_FRAMES) console.log(`frames kept in shots/${BEAT}/ (KEEP_FRAMES=0 to prune)`);
