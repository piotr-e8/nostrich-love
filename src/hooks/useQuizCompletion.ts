import { useEffect, useRef } from 'react';
import { recordQuizResult } from '../utils/gamification';

/** The shape every quiz on the site uses for a question. */
interface ScorableQuestion {
  id: string;
  correctId: string;
}

/**
 * Records a quiz result once, the moment its results screen appears.
 *
 * Every quiz here is the same component with different questions, and until this
 * hook existed twelve of the thirteen recorded nothing at all — only
 * PrivacySecurityQuiz reported anything, and only to award a single badge. A
 * reader could answer every question in the course correctly and the site would
 * still know nothing beyond which pages had been opened.
 *
 * Call this ABOVE the "translations not loaded yet" early return in each quiz.
 * That guard sits before the `score` useMemo, so hooks placed after it are
 * conditional: a locale switch to a language missing this quiz's questions would
 * change the hook count between renders and crash the island. Taking `questions`
 * and `answers` rather than a precomputed score is what lets the call sit up
 * there without duplicating the scoring logic.
 *
 * The guard is a ref, not state: persisting must not re-render the quiz. It
 * resets when the results screen closes so that "try again" (which sets
 * showResults back to false) records the next attempt too.
 *
 * @param guideSlug   Slug of the guide this quiz belongs to, e.g. 'what-is-nostr'.
 *                    Must match a slug in SKILL_LEVELS or the result counts
 *                    toward no level. Checked in content-integrity.test.ts.
 * @param showResults Whether the quiz is showing its results screen.
 * @param questions   The quiz's questions, in any order.
 * @param answers     Reader's answers, keyed by question id.
 */
export function useQuizCompletion(
  guideSlug: string,
  showResults: boolean,
  questions: ScorableQuestion[],
  answers: Record<string, string>
): void {
  const recorded = useRef(false);

  useEffect(() => {
    if (!showResults) {
      recorded.current = false;
      return;
    }
    if (recorded.current || !Array.isArray(questions) || questions.length === 0) return;

    const score = questions.reduce(
      (acc, question) => (answers[question.id] === question.correctId ? acc + 1 : acc),
      0
    );

    recorded.current = true;
    recordQuizResult(guideSlug, score, questions.length);
    // `answers` is intentionally not a dependency: the effect fires on the
    // transition into the results screen, and the answers behind that screen
    // cannot change while it is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guideSlug, showResults, questions]);
}
