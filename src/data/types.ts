export interface LocalizedText {
  en: string;
  ar: string;
}

export interface LocalizedList {
  en: string[];
  ar: string[];
}

export interface TagSpec {
  tag: string;
  syntax: string;
  attributes: LocalizedText;
  description: LocalizedText;
}

export interface LessonExplanation {
  overview: LocalizedText;
  howItWorks: LocalizedText;
  keyPoints: LocalizedList;
  commonMistake: LocalizedText;
}

export interface LessonSection {
  heading: LocalizedText;
  body: LocalizedText;
  code?: string;
  codeLanguage?: string;
}

export interface QuizQuestion {
  id: string;
  question: LocalizedText;
  options: LocalizedText[];
  correctIndex: number;
  explanation: LocalizedText;
}

export interface PlaygroundStarter {
  html: string;
  css: string;
  js: string;
}

export interface CodeQuizCheck {
  label: string;
  ok: boolean;
}

export interface CodeQuizQuestion {
  id: string;
  prompt: LocalizedText;
  language: 'html' | 'css' | 'javascript';
  validate: (code: PlaygroundStarter, lang: 'en' | 'ar') => {
    passed: boolean;
    checks: CodeQuizCheck[];
  };
}

export interface Lesson {
  id: string;
  languageId: string;
  chapterId: string;
  order: number;
  durationMinutes: number;
  tags?: string[];
  tagSpecs?: TagSpec[];
  title: LocalizedText;
  summary: LocalizedText;
  explanation?: LessonExplanation;
  imageUrl?: string;
  imageAlt?: LocalizedText;
  imageCaption?: LocalizedText;
  sections: LessonSection[];
  challenge: LocalizedText;
  starterCode: PlaygroundStarter;
  quiz: QuizQuestion[];
  codeQuiz?: CodeQuizQuestion[];
  isReview?: boolean;
  reviewedLessonIds?: [string, string];
  reviewedLessonTitles?: [LocalizedText, LocalizedText];
}

export interface Chapter {
  id: string;
  languageId: string;
  number: string;
  title: LocalizedText;
  description: LocalizedText;
}

export interface LanguageCourse {
  id: string;
  number: string;
  name: string;
  title: LocalizedText;
  description: LocalizedText;
}
