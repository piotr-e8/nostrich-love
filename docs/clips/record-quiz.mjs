#!/usr/bin/env node
// Record the quiz being answered, as frames.
//
//   npm run build && npm run preview        # serves on 4321
//   node docs/clips/record-quiz.mjs         # -> shots/quiz-NN.png + out/quiz-beat.mp4
//
// This is NOT a screen recording. It drives headless Chrome over the DevTools
// protocol, dispatches real mouse events, and captures one frame per state. That
// is deliberate and it is better than filming a human doing it:
//
//   - deterministic: same frames every run, so the beat can be rebuilt after a
//     design change instead of re-filmed
//   - crisp: 2x device scale, clipped to the quiz card, no cursor, no OS chrome
//   - honest: the answers are actually clicked and the score on the results
//     screen is the real one, not a mock
//
// What it cannot give you is the feel of a hand moving — no cursor travel, no
// scroll momentum. For a 2-3 second beat showing that the site assesses you,
// that is not a loss.
//
// No dependencies: Node 24 ships a global WebSocket, which is all CDP needs.

import { spawn } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync, readdirSync, readFileSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SHOTS = join(HERE, 'shots');
const OUT = join(HERE, 'out');
const PORT = process.env.PORT ?? '4321';
const BASE = process.env.BASE ?? `http://localhost:${PORT}`;
const GUIDE = process.env.GUIDE ?? 'what-is-nostr';
const CHROME =
  process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CDP_PORT = 9333;
const SCALE = 2;
// Narrow on purpose. The teaser's card slot is 860x1550 (aspect 0.55) and at a
// desktop width the quiz card comes out at 0.75 — fitting that would mean
// cropping the sides off the answer text. A phone-ish viewport makes the card
// taller than it is wide, which is also how anyone actually reads this page.
const VW = Number(process.env.VW ?? 620);
const VH = Number(process.env.VH ?? 1600);

// The correct answers, read from the same locale file the quiz renders from.
//
// Without this the recorder clicked whichever option came first and the beat
// ended on "2 / 6 correct" — a promo clip of somebody failing. It is still a
// real run against the real component; it just knows the answers.
const localeKey = GUIDE.replace(/-(\w)/g, (_, c) => c.toUpperCase());
const locale = JSON.parse(readFileSync(join(HERE, '../../src/i18n/locales/en.json'), 'utf8'));
const questions = locale.guides?.[localeKey]?.quiz?.questions;
if (!Array.isArray(questions) || !questions.length) {
  throw new Error(`No quiz questions at guides.${localeKey}.quiz.questions in en.json`);
}
const CORRECT = questions.map((q) => q.options.find((o) => o.id === q.correctId)?.label).filter(Boolean);
if (CORRECT.length !== questions.length) throw new Error('A question has no option matching its correctId');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Minimal CDP client
// ---------------------------------------------------------------------------
class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data);
      const p = this.pending.get(msg.id);
      if (!p) return;
      this.pending.delete(msg.id);
      msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
    });
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
      expression,
      returnByValue: true,
      awaitPromise: true,
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
    } catch {
      /* chrome not up yet */
    }
    await sleep(250);
  }
  throw new Error('Could not reach Chrome on the debugging port');
}

// ---------------------------------------------------------------------------
// Interaction helpers
// ---------------------------------------------------------------------------

/** Centre of the first element matching a predicate, in CSS pixels. */
const BOX = (sel, filter) => `(() => {
  const root = document.querySelector('[data-quiz]');
  if (!root) return null;
  const els = [...root.querySelectorAll(${JSON.stringify(sel)})]${filter ?? ''};
  const el = els[0];
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2, text: el.textContent.trim().slice(0, 40) };
})()`;

const CONTROLS = "['Back','Next question','See results','Try again','Restart']";

async function click(cdp, box) {
  for (const type of ['mousePressed', 'mouseReleased']) {
    await cdp.send('Input.dispatchMouseEvent', {
      type,
      x: box.x,
      y: box.y,
      button: 'left',
      clickCount: 1,
    });
  }
  // React flushes discrete events synchronously, but the CSS transition that
  // reveals the answer feedback does not — hold for it, or the frame catches
  // the card mid-fade.
  await sleep(450);
}

async function shot(cdp, name, clip) {
  // `clip` is in PAGE coordinates, but getBoundingClientRect() is viewport-
  // relative. The quiz sits ~7000px down the document, so passing the rect
  // straight through aimed the camera at blank space near the top and wrote
  // eight identical white PNGs — while the run logged a real 6/6 read from the
  // DOM. Logs are not output. Add the scroll offset and allow the capture to
  // reach outside the viewport.
  const { data } = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    // scale: 1, NOT SCALE — Emulation.setDeviceMetricsOverride already applies
    // deviceScaleFactor, and passing it again here multiplied out to 4x frames.
    ...(clip ? { clip: { ...clip, scale: 1 } } : {}),
  });
  writeFileSync(join(SHOTS, `${name}.png`), Buffer.from(data, 'base64'));
  return name;
}


/** Card rect in PAGE coordinates, at whatever height the card currently is. */
const rectExpr = () => `(() => {
  const r = document.querySelector('[data-quiz]').getBoundingClientRect();
  return {
    x: Math.max(0, r.x + window.scrollX - 8),
    y: Math.max(0, r.y + window.scrollY - 8),
    width: r.width + 16,
    height: r.height + 16,
  };
})()`;


// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${CDP_PORT}`,
    '--user-data-dir=' + join(HERE, '.chrome-profile'),
    `--window-size=${VW},${VH}`,
    `--force-device-scale-factor=${SCALE}`,
    'about:blank',
  ],
  { stdio: 'ignore', detached: false }
);

const frames = [];
let cdp;
try {
  mkdirSync(SHOTS, { recursive: true });
  mkdirSync(OUT, { recursive: true });

  cdp = await connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: VW,
    height: VH,
    deviceScaleFactor: SCALE,
    mobile: false,
  });

  const url = `${BASE}/guides/${GUIDE}/`;
  console.log(`· ${url}`);
  await cdp.send('Page.navigate', { url });
  await sleep(3500); // load + client:idle hydration

  // Bring the quiz into view and let the scroll settle.
  const found = await cdp.eval(`(() => {
    const q = document.querySelector('[data-quiz]');
    if (!q) return false;
    q.scrollIntoView({ block: 'center', behavior: 'instant' });
    return true;
  })()`);
  if (!found) throw new Error(`No [data-quiz] on ${url} — does this guide have a quiz?`);
  await sleep(600);

  // Each frame is clipped to the card at its CURRENT height. One fixed height
  // does not work: the card grows when an answer reveals its explanation, and
  // the results screen is shorter than every question — forcing the biggest
  // height onto it dragged the page BELOW the card into frame, and the teaser
  // beat rendered as white space and a "Want to dive deeper?" paragraph.
  // Uniform size is still required by the concat demuxer, so it is imposed
  // afterwards by padding with white, which is the card's own background.
  frames.push(await shot(cdp, 'quiz-00-start', await cdp.eval(rectExpr())));
  console.log('  · start');

  // Answer every question, capturing the state after each click.
  for (let q = 1; q <= 12; q++) {
    const option = await cdp.eval(
      BOX(
        'button',
        `.filter(b => !b.disabled && ${JSON.stringify(CORRECT)}.some(label => b.textContent.trim().startsWith(label)))`
      )
    );
    if (option) {
      await click(cdp, option);
      frames.push(await shot(cdp, `quiz-${String(q).padStart(2, '0')}-answered`, await cdp.eval(rectExpr())));
      console.log(`  · q${q} answered`);
    }

    const results = await cdp.eval(
      BOX('button', `.filter(b => b.textContent.trim() === 'See results')`)
    );
    if (results) {
      await click(cdp, results);
      await sleep(700); // results screen animates in
      frames.push(await shot(cdp, 'quiz-99-results', await cdp.eval(rectExpr())));
      console.log('  · results');
      break;
    }

    const next = await cdp.eval(
      BOX('button', `.filter(b => b.textContent.trim() === 'Next question' && !b.disabled)`)
    );
    if (!next) break;
    await click(cdp, next);
  }

  // The score on that last frame is real — report it so the caption cannot lie.
  const score = await cdp.eval(
    `(document.querySelector('[data-quiz]')?.textContent.match(/(\\d+)\\s*\\/\\s*(\\d+)/) || [])[0] || 'n/a'`
  );
  console.log(`\n${frames.length} frames, final score on screen: ${score}`);
} finally {
  try {
    cdp?.ws.close();
  } catch {}
  chrome.kill('SIGKILL');
  rmSync(join(HERE, '.chrome-profile'), { recursive: true, force: true });
}

// ---------------------------------------------------------------------------
// Normalise frame sizes.
//
// The concat demuxer refuses a sequence whose frames differ in size, and every
// consumer of these PNGs wants them uniform. Padding with white — the card's own
// background — keeps a short state (the results screen) reading as a card with
// generous margins, instead of dragging the page below it into shot.
// ---------------------------------------------------------------------------
const sizes = await Promise.all(
  readdirSync(SHOTS)
    .filter((f) => /^quiz-\d+.*\.png$/.test(f))
    .sort()
    .map(async (f) => {
      const p = join(SHOTS, f);
      const out = await new Promise((res) => {
        const ff = spawn('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height',
          '-of', 'csv=p=0', p]);
        let buf = '';
        ff.stdout.on('data', (d) => (buf += d));
        ff.on('exit', () => res(buf.trim()));
      });
      const [w, h] = out.split(',').map(Number);
      return { file: p, w, h };
    })
);
const maxW = Math.max(...sizes.map((s) => s.w));
const maxH = Math.max(...sizes.map((s) => s.h));
for (const { file, w, h } of sizes) {
  if (w === maxW && h === maxH) continue;
  const tmp = `${file}.pad.png`;
  await new Promise((res, rej) => {
    spawn('ffmpeg', ['-v', 'error', '-y', '-i', file, '-vf',
      `pad=${maxW}:${maxH}:(ow-iw)/2:(oh-ih)/2:color=white`, tmp], { stdio: 'inherit' })
      .on('exit', (c) => (c === 0 ? res() : rej(new Error('pad failed'))));
  });
  renameSync(tmp, file);
}
console.log(`frames normalised to ${maxW}x${maxH}`);

// ---------------------------------------------------------------------------
// Frames -> clip. Held on the results screen, which is the point of the beat.
// ---------------------------------------------------------------------------
const list = readdirSync(SHOTS)
  .filter((f) => /^quiz-\d+.*\.png$/.test(f))
  .sort();
if (list.length < 2) {
  console.error('Not enough frames to build a clip.');
  process.exit(1);
}
const concat = list
  .map((f, i) => {
    const last = i === list.length - 1;
    return `file '${join(SHOTS, f)}'\nduration ${last ? 1.6 : 0.42}`;
  })
  .join('\n');
writeFileSync(join(OUT, 'quiz-frames.txt'), `${concat}\nfile '${join(SHOTS, list.at(-1))}'\n`);

const ff = spawn(
  'ffmpeg',
  [
    '-v', 'error', '-y',
    '-f', 'concat', '-safe', '0', '-i', join(OUT, 'quiz-frames.txt'),
    '-vf', 'scale=1080:-2:flags=lanczos,format=yuv420p',
    '-c:v', 'libx264', '-profile:v', 'high', '-movflags', '+faststart',
    '-r', '30',
    join(OUT, 'quiz-beat.mp4'),
  ],
  { stdio: 'inherit' }
);
ff.on('exit', (code) => {
  console.log(code === 0 ? `\nout/quiz-beat.mp4 written (${list.length} frames)` : '\nffmpeg failed');
  process.exit(code ?? 1);
});
