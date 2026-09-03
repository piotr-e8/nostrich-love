import { describe, it, expect } from 'vitest';
import {
  planContinueLearning,
  type ContinueLearningPlanInput,
} from '../src/components/navigation/continueLearningPlan';
import { SKILL_LEVELS, getLevelQuizzes } from '../src/data/learning-paths';

/**
 * The panel at the bottom of every guide answers one question: what now?
 *
 * Three ways it used to answer wrongly, each pinned below:
 *   - position in the sequence read as completion, so a first-time reader who
 *     landed on the last guide of a level was congratulated on finishing it;
 *   - "complete" measured on guides alone while the level certificate also
 *     needs the quizzes, so a reader was congratulated and handed nothing;
 *   - a quiz the reader had just finished still advertised as the next thing
 *     to do.
 */

const BEGINNER = SKILL_LEVELS.beginner.sequence;
const INTERMEDIATE = SKILL_LEVELS.intermediate.sequence;

const plan = (over: Partial<ContinueLearningPlanInput> & { slug: string }) =>
  planContinueLearning({
    readGuides: [],
    passedQuizzes: [],
    hasQuiz: false,
    quizAttempted: false,
    ...over,
  });

describe('continue-learning plan', () => {
  it('ignores a slug that belongs to no level', () => {
    expect(plan({ slug: 'glossary' })).toBeNull();
  });

  it('points a fresh reader at the next guide in the level', () => {
    const p = plan({ slug: 'what-is-nostr' })!;
    expect(p.target).toEqual({ kind: 'forward', slug: 'keys-and-security' });
    expect(p.levelComplete).toBe(false);
  });

  it('does not congratulate a reader who merely landed on the last guide', () => {
    const last = BEGINNER[BEGINNER.length - 1];
    const p = plan({ slug: last })!;
    expect(p.levelComplete).toBe(false);
    expect(p.guidesRead).toBe(0);
    // Nothing recorded, so no walking backwards to guide one under a 0/7 count.
    expect(p.target).toEqual({
      kind: 'level',
      slug: INTERMEDIATE[0],
      level: 'intermediate',
    });
  });

  it('holds back "complete" while a quiz in the level is unpassed', () => {
    const quizzes = getLevelQuizzes('beginner');
    const p = plan({
      slug: BEGINNER[BEGINNER.length - 1],
      readGuides: [...BEGINNER],
      passedQuizzes: quizzes.slice(1),
    })!;
    expect(p.guidesRead).toBe(p.guidesTotal);
    expect(p.levelComplete).toBe(false);
    expect(p.quizzesPassed).toBe(p.quizzesTotal - 1);
    expect(p.target).toEqual({ kind: 'backfill', missing: 'quiz', slug: quizzes[0] });
  });

  it('names a guide skipped earlier in the level', () => {
    const p = plan({
      slug: BEGINNER[BEGINNER.length - 1],
      readGuides: BEGINNER.filter((s) => s !== 'quickstart'),
      passedQuizzes: getLevelQuizzes('beginner'),
    })!;
    expect(p.target).toEqual({ kind: 'backfill', missing: 'guide', slug: 'quickstart' });
    expect(p.levelComplete).toBe(false);
  });

  it('sends a finished level on to the next one', () => {
    const p = plan({
      slug: BEGINNER[BEGINNER.length - 1],
      readGuides: [...BEGINNER],
      passedQuizzes: getLevelQuizzes('beginner'),
    })!;
    expect(p.levelComplete).toBe(true);
    expect(p.allLevelsComplete).toBe(false);
    expect(p.target).toEqual({ kind: 'level', slug: INTERMEDIATE[0], level: 'intermediate' });
  });

  it('only calls the whole course finished when every level is', () => {
    const everything = [...BEGINNER, ...INTERMEDIATE, ...SKILL_LEVELS.advanced.sequence];
    const allQuizzes = [
      ...getLevelQuizzes('beginner'),
      ...getLevelQuizzes('intermediate'),
      ...getLevelQuizzes('advanced'),
    ];

    const advancedOnly = plan({
      slug: SKILL_LEVELS.advanced.sequence[0],
      readGuides: [...SKILL_LEVELS.advanced.sequence],
      passedQuizzes: getLevelQuizzes('advanced'),
    })!;
    expect(advancedOnly.levelComplete).toBe(true);
    expect(advancedOnly.allLevelsComplete).toBe(false);
    expect(advancedOnly.nextLevel).toBeNull();

    const done = plan({
      slug: SKILL_LEVELS.advanced.sequence[0],
      readGuides: everything,
      passedQuizzes: allQuizzes,
    })!;
    expect(done.allLevelsComplete).toBe(true);
  });

  describe("this guide's quiz", () => {
    it('is offered while it has not been attempted', () => {
      const p = plan({ slug: 'what-is-nostr', hasQuiz: true })!;
      expect(p.quiz).toEqual({ attempted: false, passed: false });
    });

    it('stops being the headline once the results screen has been reached', () => {
      const p = plan({
        slug: 'what-is-nostr',
        hasQuiz: true,
        quizAttempted: true,
        passedQuizzes: ['what-is-nostr'],
      })!;
      expect(p.quiz).toEqual({ attempted: true, passed: true });
      expect(p.target).toEqual({ kind: 'forward', slug: 'keys-and-security' });
    });

    it('separates a failed attempt from an unattempted one', () => {
      const p = plan({ slug: 'what-is-nostr', hasQuiz: true, quizAttempted: true })!;
      expect(p.quiz).toEqual({ attempted: true, passed: false });
    });
  });
});

/**
 * The plan's completion rule has to stay the one the level certificate uses,
 * or the site congratulates a reader it will not award. utils/gamification's
 * getLevelCompletion reads exactly the two arrays fed in here.
 */
describe('completion rule matches the level certificate', () => {
  it('requires every guide read and every quiz passed', () => {
    const quizzes = getLevelQuizzes('intermediate');
    const guidesOnly = plan({
      slug: INTERMEDIATE[0],
      readGuides: [...INTERMEDIATE],
      passedQuizzes: [],
    })!;
    expect(guidesOnly.levelComplete).toBe(false);

    const quizzesOnly = plan({
      slug: INTERMEDIATE[0],
      readGuides: [],
      passedQuizzes: quizzes,
    })!;
    expect(quizzesOnly.levelComplete).toBe(false);

    const both = plan({
      slug: INTERMEDIATE[0],
      readGuides: [...INTERMEDIATE],
      passedQuizzes: quizzes,
    })!;
    expect(both.levelComplete).toBe(true);
  });
});
