// Type definitions for translations
export type Locale = 'en' | 'pl' | 'es' | 'de' | 'zh' | 'ar' | 'hi';

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
}

export interface QuizQuestion {
  id: string;
  title: string;
  prompt: string;
  options: QuizOption[];
  correctId: string;
  explanation: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface QuizTranslation {
  title: string;
  questions: QuizQuestion[];
}

export interface GuideTranslation {
  title: string;
  description: string;
  content: {
    [key: string]: string;
  };
  quiz: QuizTranslation | {};
}

export interface Translations {
  guides: {
    [guideId: string]: GuideTranslation;
  };
  ui: {
    buttons: {
      submit: string;
      next: string;
      previous: string;
      checkAnswer: string;
      startLearning: string;
      learnMore: string;
    };
    search: {
      placeholder: string;
      noResults: string;
      searching: string;
    };
    common: {
      loading: string;
      error: string;
      success: string;
      minutes: string;
    };
    navigation: {
      nextGuide: string;
      previousGuide: string;
      backToGuides: string;
    };
    badges: {
      earned: string;
      locked: string;
      viewAll: string;
    };
    progress: {
      completed: string;
      of: string;
      guidesCompleted: string;
      currentStreak: string;
    };
    quiz: {
      loading: string;
      gradeTitle: string;
      scoreDisplay: string;
      conceptsMastered: string;
      nextSteps: string;
      perfectScore: string;
      reviewSections: string;
      retakeQuiz: string;
      questionCounter: string;
      backButton: string;
      nextButton: string;
      seeResults: string;
      severity: {
        critical: string;
        warning: string;
        info: string;
      };
      feedback: {
        correct: string;
        incorrect: string;
      };
    };
  };
  guidesPage?: {
    hero: {
      title: string;
      description: string;
      yourProgress: string;
      startFirstGuide: string;
    };
    cta: {
      notSure: string;
      beginnerDescription: string;
      startLearning: string;
    };
    filter: {
      filterByInterest: string;
    };
  };
  skillLevels?: {
    beginner: {
      label: string;
      title: string;
      subtitle: string;
      description: string;
    };
    intermediate: {
      label: string;
      title: string;
      subtitle: string;
      description: string;
    };
    advanced: {
      label: string;
      title: string;
      subtitle: string;
      description: string;
    };
  };
  interestFilter?: {
    allGuides: string;
    bitcoin: string;
    privacy: string;
    security: string;
    relays: string;
    tools: string;
    community: string;
  };
  guideCard?: {
    difficulty: {
      beginner: string;
      intermediate: string;
      advanced: string;
    };
    status: {
      completed: string;
      continueReading: string;
      startLearning: string;
    };
  };
  guideSection?: {
    startHere: string;
    complete: string;
  };
}
