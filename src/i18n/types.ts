// Type definitions for translations
export type Locale = 'en' | 'pl' | 'es';

export interface GuideTranslation {
  title: string;
  description: string;
  content: {
    [key: string]: string;
  };
  quiz?: {
    [key: string]: {
      question: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    };
  };
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
  };
}
