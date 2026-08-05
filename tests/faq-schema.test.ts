import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  extractFaqs,
  countAccordions,
  toPlainText,
  faqPageSchema,
} from '../src/lib/faq-schema';

const GUIDES = 'src/content/guides';
const LOCALES = readdirSync(GUIDES).filter((d) => !d.startsWith('.'));

describe('toPlainText', () => {
  it('unwraps links to their label and drops the URL', () => {
    expect(toPlainText('See [Keys & Security](/guides/keys-and-security) first.')).toBe(
      'See Keys & Security first.'
    );
  });

  it('strips bold, inline code, bullets and JSX', () => {
    expect(toPlainText('- **npub** starts with `npub1...` <Note>hi</Note>')).toBe(
      'npub starts with npub1... hi'
    );
  });

  it('collapses whitespace so the answer is one machine-readable string', () => {
    expect(toPlainText('a\n\n   b\t\tc')).toBe('a b c');
  });
});

describe('extractFaqs', () => {
  it('reads the question prop and the block body', () => {
    const body = `
<FAQAccordion question="What is an npub?" category="security">
  Your **public** key.
</FAQAccordion>`;
    expect(extractFaqs(body)).toEqual([
      { question: 'What is an npub?', answer: 'Your public key.' },
    ]);
  });

  it('keeps document order across multiple blocks', () => {
    const body = `
<FAQAccordion question="First?">one</FAQAccordion>
<FAQAccordion question="Second?">two</FAQAccordion>`;
    expect(extractFaqs(body).map((f) => f.question)).toEqual(['First?', 'Second?']);
  });

  it('skips a block with no question rather than emitting an invalid Question node', () => {
    expect(extractFaqs('<FAQAccordion category="basics">orphan</FAQAccordion>')).toEqual([]);
  });

  it('returns nothing for a guide that authors no accordions', () => {
    expect(extractFaqs('# Just prose\n\nNo components here.')).toEqual([]);
  });
});

// The regression this file exists for: the extractor parses MDX, so an authoring
// change (renaming the component, moving `question` to a template literal, using
// a self-closing tag) would quietly yield fewer entries and ship a half-empty
// FAQPage. Pin the parsed count to the authored count, in every locale.
describe('every locale FAQ guide parses completely', () => {
  for (const locale of LOCALES) {
    it(`${locale}/faq.mdx: parsed count equals authored count`, () => {
      const body = readFileSync(join(GUIDES, locale, 'faq.mdx'), 'utf8');
      const authored = countAccordions(body);
      expect(authored).toBeGreaterThan(0);
      expect(extractFaqs(body)).toHaveLength(authored);
    });

    it(`${locale}/faq.mdx: emits a valid FAQPage with non-empty answers`, () => {
      const body = readFileSync(join(GUIDES, locale, 'faq.mdx'), 'utf8');
      const schema = faqPageSchema(body, `https://nostrich.love/${locale}/guides/faq/`, locale);
      expect(schema).not.toBeNull();
      expect(schema!['@type']).toBe('FAQPage');
      for (const entry of schema!.mainEntity) {
        expect(entry.name.length).toBeGreaterThan(0);
        expect(entry.acceptedAnswer.text.length).toBeGreaterThan(0);
        // A leaked tag or unresolved markdown link means the stripper regressed.
        expect(entry.acceptedAnswer.text).not.toMatch(/[<>]|\]\(/);
      }
    });
  }
});
