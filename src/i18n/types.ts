// Type definitions for translations
export type Locale = 'en' | 'pl' | 'es';

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
}
