/**
 * What the end-of-guide panel should offer a reader next.
 *
 * Split out of ContinueLearning.tsx so the decision can be tested without a DOM.
 * The panel is the last thing a reader sees on every guide, and it has to answer
 * one question honestly: what now? Three things it used to get wrong, each now
 * covered by a case in tests/continue-learning-plan.test.ts:
 *
 *  - It declared the level complete whenever the sequence had no later guide, so
 *    anyone landing on the last guide of a level with no progress at all was
 *    congratulated on finishing it. Completion is now measured, never inferred
 *    from position.
 *  - "Complete" now means what the level certificate means: every guide read AND
 *    every quiz passed (mirrors getLevelCompletion in utils/gamification.ts, and
 *    is fed the same two arrays it reads).
 *  - With nothing recorded — a first-time visitor, or a reader with progress
 *    tracking switched off — it must not send anyone backwards to guide one
 *    under a "0/7" counter. Absence of data is not evidence of a gap.
 */

import {
  SKILL_LEVELS,
  type SkillLevel,
  getNextLevel,
  getGuideLevel,
  getLevelQuizzes,
} from '../../data/learning-paths';

export interface ContinueLearningPlanInput {
  /** Slug of the guide being read. */
  slug: string;
  /** Every guide the reader has read, any level (gamification getCompletedGuides). */
  readGuides: readonly string[];
  /** Every guide whose quiz the reader has passed (gamification getPassedQuizzes). */
  passedQuizzes: readonly string[];
  /** Does this guide end in a quiz? */
  hasQuiz: boolean;
  /** Has the reader reached this quiz's results screen at least once? */
  quizAttempted: boolean;
}

/**
 * Where the reader goes after this page.
 *
 * `forward`  — the next unread guide in this level, the ordinary case.
 * `backfill` — something skipped earlier in this level, a guide or a quiz.
 * `level`    — the first guide of the next level.
 */
export interface ContinueLearningTarget {
  kind: 'forward' | 'backfill' | 'level';
  /** What is missing, for a backfill target. */
  missing?: 'guide' | 'quiz';
  slug: string;
  /** The level a `level` target belongs to. */
  level?: SkillLevel;
}

export interface ContinueLearningPlan {
  level: SkillLevel;
  guidesRead: number;
  guidesTotal: number;
  quizzesPassed: number;
  quizzesTotal: number;
  /** Every guide read AND every quiz passed. */
  levelComplete: boolean;
  /** True only once every level is finished on that same rule. */
  allLevelsComplete: boolean;
  nextLevel: SkillLevel | null;
  /** This guide's quiz, or null when it has none. */
  quiz: { attempted: boolean; passed: boolean } | null;
  target: ContinueLearningTarget | null;
}

function countsFor(
  level: SkillLevel,
  read: ReadonlySet<string>,
  passed: ReadonlySet<string>
) {
  const sequence = SKILL_LEVELS[level].sequence;
  const quizzes = getLevelQuizzes(level);
  const guidesRead = sequence.filter((s) => read.has(s)).length;
  const quizzesPassed = quizzes.filter((s) => passed.has(s)).length;
  return {
    guidesRead,
    guidesTotal: sequence.length,
    quizzesPassed,
    quizzesTotal: quizzes.length,
    complete: guidesRead === sequence.length && quizzesPassed === quizzes.length,
  };
}

/** Null when the slug belongs to no level, in which case the panel stays hidden. */
export function planContinueLearning(
  input: ContinueLearningPlanInput
): ContinueLearningPlan | null {
  const level = getGuideLevel(input.slug);
  if (!level) return null;

  const read = new Set(input.readGuides);
  const passed = new Set(input.passedQuizzes);
  const sequence = SKILL_LEVELS[level].sequence;
  const counts = countsFor(level, read, passed);
  const nextLevel = getNextLevel(level);

  const quiz = input.hasQuiz
    ? { attempted: input.quizAttempted, passed: passed.has(input.slug) }
    : null;

  // Nothing recorded for this level means we know nothing about it, not that
  // the reader skipped everything.
  const hasAnyProgress = counts.guidesRead > 0 || counts.quizzesPassed > 0;

  let target: ContinueLearningTarget | null = null;

  // 1. Forward through the rest of this level.
  const index = sequence.indexOf(input.slug);
  for (let i = index + 1; i < sequence.length && !target; i++) {
    if (!read.has(sequence[i])) target = { kind: 'forward', slug: sequence[i] };
  }

  // 2. Nothing left ahead: name what was skipped.
  if (!target && hasAnyProgress) {
    const unread = sequence.find((s) => s !== input.slug && !read.has(s));
    if (unread) {
      target = { kind: 'backfill', missing: 'guide', slug: unread };
    } else {
      const openQuiz = getLevelQuizzes(level).find((s) => s !== input.slug && !passed.has(s));
      if (openQuiz) target = { kind: 'backfill', missing: 'quiz', slug: openQuiz };
    }
  }

  // 3. This level is done with, so the next one is what comes next.
  if (!target && nextLevel) {
    target = { kind: 'level', slug: SKILL_LEVELS[nextLevel].sequence[0], level: nextLevel };
  }

  const allLevelsComplete = (['beginner', 'intermediate', 'advanced'] as SkillLevel[]).every(
    (l) => countsFor(l, read, passed).complete
  );

  return {
    level,
    guidesRead: counts.guidesRead,
    guidesTotal: counts.guidesTotal,
    quizzesPassed: counts.quizzesPassed,
    quizzesTotal: counts.quizzesTotal,
    levelComplete: counts.complete,
    allLevelsComplete,
    nextLevel,
    quiz,
    target,
  };
}
