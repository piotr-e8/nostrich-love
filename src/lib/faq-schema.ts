// Extract FAQPage structured data from a guide whose Q&As are authored as
// <FAQAccordion question="..."> blocks in MDX.
//
// The FAQ guide carries the site's largest block of question-shaped content and
// declared none of it. Note what this is and is not worth: Google restricted FAQ
// rich results to authoritative government and health sites in 2023, so this
// will not produce SERP accordions. The value is that answer engines and
// non-Google crawlers get an explicit question -> answer mapping instead of
// having to infer it from <details> markup. That is unmeasurable but close to
// free, and it applies to all seven locales at once because every locale
// authors the same component with translated props.
//
// Parsing MDX with a regex is acceptable here precisely because the input is
// not arbitrary: it is one authored file per locale using one component with a
// fixed prop. tests/faq-schema.test.ts pins the extracted count to the number of
// <FAQAccordion openings in the source, so a format change fails the build
// rather than silently emitting a half-empty FAQPage.

const ACCORDION = /<FAQAccordion\b([^>]*)>([\s\S]*?)<\/FAQAccordion>/g;
const QUESTION_PROP = /\bquestion=(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\})/;

/** Count of authored blocks, used to assert the parse did not silently drop any. */
export function countAccordions(body: string): number {
  return (body.match(/<FAQAccordion\b/g) || []).length;
}

/** Markdown/MDX answer body -> the plain sentence a machine should read. */
export function toPlainText(md: string): string {
  return md
    .replace(/<[^>]+>/g, ' ')                       // JSX/HTML tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')          // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')        // links -> label
    .replace(/```[\s\S]*?```/g, ' ')                // fenced code
    .replace(/`([^`]*)`/g, '$1')                    // inline code
    .replace(/\*\*([^*]*)\*\*/g, '$1')              // bold
    .replace(/(^|\s)[*_]([^*_]+)[*_](?=\s|$)/g, '$1$2') // emphasis
    .replace(/^\s{0,3}[-*+]\s+/gm, '')              // list bullets
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')             // headings
    .replace(/^\s{0,3}>\s?/gm, '')                  // blockquotes
    .replace(/\s+/g, ' ')
    .trim();
}

export interface FaqEntry {
  question: string;
  answer: string;
}

/** Every <FAQAccordion> in the source, in document order. */
export function extractFaqs(body: string): FaqEntry[] {
  const out: FaqEntry[] = [];
  for (const match of body.matchAll(ACCORDION)) {
    const attrs = match[1];
    const q = QUESTION_PROP.exec(attrs);
    const question = (q?.[1] ?? q?.[2] ?? q?.[3] ?? '').trim();
    const answer = toPlainText(match[2]);
    // A block with no question, or with no answer left after stripping, would
    // produce an invalid Question node — skip rather than emit a broken one.
    if (question && answer) out.push({ question, answer });
  }
  return out;
}

/** FAQPage JSON-LD, or null when the guide has no extractable Q&As. */
export function faqPageSchema(body: string, url: string, inLanguage: string) {
  const faqs = extractFaqs(body);
  if (faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url,
    inLanguage,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
