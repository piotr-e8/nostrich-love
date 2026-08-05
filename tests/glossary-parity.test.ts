import { describe, it, expect } from 'vitest';
import {
  GLOSSARY_LOCALES,
  TERM_IDS,
  type GlossaryData,
  type GlossaryMeta,
} from '../src/data/glossary';
import { locales } from '../src/config/locales';
import en, { meta as metaEn } from '../src/data/glossary/en';
import pl, { meta as metaPl } from '../src/data/glossary/pl';
import es, { meta as metaEs } from '../src/data/glossary/es';
import de, { meta as metaDe } from '../src/data/glossary/de';

/**
 * Glossary localization parity (pattern of content-integrity.test.ts).
 *
 * TypeScript already forces Record<TermId, ...> completeness at compile time;
 * these tests are the runtime backstop (against `as` casts) and the honesty
 * check: a "localized" glossary that leaks English definitions into
 * /pl/glossary/ would pass typecheck but not this file.
 */

const DATA: Record<string, { terms: GlossaryData; meta: GlossaryMeta }> = {
  en: { terms: en, meta: metaEn },
  pl: { terms: pl, meta: metaPl },
  es: { terms: es, meta: metaEs },
  de: { terms: de, meta: metaDe },
};

describe('glossary locale set', () => {
  it('every shipped glossary locale is a real site locale', () => {
    for (const l of GLOSSARY_LOCALES) {
      expect(locales).toContain(l);
    }
  });

  it('English is shipped and is the x-default anchor', () => {
    expect(GLOSSARY_LOCALES).toContain('en');
  });

  it('every shipped locale has a data file wired into this test', () => {
    // If GLOSSARY_LOCALES grows without a data file (or without extending
    // DATA above and the page's data map), this fails before the build does.
    expect(Object.keys(DATA).sort()).toEqual([...GLOSSARY_LOCALES].sort());
  });
});

describe('term-id parity across locales', () => {
  const enIds = Object.keys(en).sort();

  it('en covers exactly the shared TERM_IDS set', () => {
    expect(enIds).toEqual([...TERM_IDS].sort());
  });

  for (const locale of GLOSSARY_LOCALES) {
    it(`${locale}: covers exactly the en id set — no silent English leakage, no extras`, () => {
      expect(Object.keys(DATA[locale].terms).sort()).toEqual(enIds);
    });
  }
});

describe('entries are complete and actually translated', () => {
  for (const locale of GLOSSARY_LOCALES) {
    it(`${locale}: every term and definition is non-empty`, () => {
      for (const [id, entry] of Object.entries(DATA[locale].terms)) {
        expect(entry.term.trim(), `${locale}/${id} term`).not.toBe('');
        expect(entry.definition.trim(), `${locale}/${id} definition`).not.toBe('');
      }
      expect(DATA[locale].meta.seoTitle.trim()).not.toBe('');
      expect(DATA[locale].meta.description.trim()).not.toBe('');
    });
  }

  for (const locale of GLOSSARY_LOCALES.filter((l) => l !== 'en')) {
    it(`${locale}: no definition is a verbatim copy of English (abridging/leakage guard)`, () => {
      const copies = Object.entries(DATA[locale].terms)
        .filter(([id, entry]) => entry.definition === en[id as keyof GlossaryData].definition)
        .map(([id]) => id);
      expect(copies, `untranslated definitions in ${locale}: ${copies.join(', ')}`).toEqual([]);
    });

    it(`${locale}: seoTitle differs from en (locale-specific query targeting)`, () => {
      expect(DATA[locale].meta.seoTitle).not.toBe(metaEn.seoTitle);
    });
  }
});
