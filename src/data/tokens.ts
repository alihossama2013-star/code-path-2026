import { chapters, languages, lessons } from './curriculum';
import { Lesson, LocalizedText } from './types';

export type TokenMotif =
  | 'foundation'
  | 'typography'
  | 'structure'
  | 'links'
  | 'lists'
  | 'media'
  | 'tables'
  | 'forms'
  | 'interactive'
  | 'layout'
  | 'logic'
  | 'components'
  | 'server'
  | 'review';

export interface DigitalTokenSpec {
  id: string;
  lessonId: string;
  index: number;
  tokenCode: string;
  languageId: string;
  languageTitle: LocalizedText;
  chapterId: string;
  chapterNumber: string;
  title: LocalizedText;
  tagLabel: string;
  motif: TokenMotif;
}

export interface EarnedTokenRecord {
  uid: string;
  lessonId: string;
  tokenCode: string;
  languageId: string;
  order: number;
  earnedAt: string | null;
}

const CHAPTER_MOTIF_MAP: Record<string, TokenMotif> = {
  'html-ch-01': 'foundation',
  'html-ch-02': 'typography',
  'html-ch-03': 'structure',
  'html-ch-04': 'links',
  'html-ch-05': 'lists',
  'html-ch-06': 'media',
  'html-ch-07': 'media',
  'html-ch-08': 'tables',
  'html-ch-09': 'forms',
  'html-ch-10': 'forms',
  'html-ch-11': 'interactive',
  'html-ch-12': 'interactive',
  'css-ch-01': 'layout',
  'js-ch-01': 'logic',
  'react-ch-01': 'components',
  'backend-ch-01': 'server',
};

const TRACK_FALLBACK_TAG: Record<string, string> = {
  html: '<html />',
  css: '{ grid }',
  javascript: 'fn()',
  react: '<App />',
  backend: 'REST / SQL',
};

function resolveMotif(lesson: Lesson): TokenMotif {
  if (lesson.isReview) {
    return 'review';
  }
  if (CHAPTER_MOTIF_MAP[lesson.chapterId]) {
    return CHAPTER_MOTIF_MAP[lesson.chapterId];
  }
  switch (lesson.languageId) {
    case 'css':
      return 'layout';
    case 'javascript':
      return 'logic';
    case 'react':
      return 'components';
    case 'backend':
      return 'server';
    default:
      return 'foundation';
  }
}

export function formatTokenCode(oneBasedIndex: number): string {
  return `CP-${String(oneBasedIndex).padStart(2, '0')}`;
}

export const digitalTokens: DigitalTokenSpec[] = lessons.map((lesson, idx) => {
  const oneBased = idx + 1;
  const langCourse = languages.find((l) => l.id === lesson.languageId);
  const chapter = chapters.find((ch) => ch.id === lesson.chapterId);

  return {
    id: lesson.id,
    lessonId: lesson.id,
    index: oneBased,
    tokenCode: formatTokenCode(oneBased),
    languageId: lesson.languageId,
    languageTitle: langCourse?.title ?? { en: lesson.languageId, ar: lesson.languageId },
    chapterId: lesson.chapterId,
    chapterNumber: chapter?.number ?? '01',
    title: lesson.title,
    tagLabel: lesson.isReview
      ? 'Review'
      : lesson.tags?.[0] ?? TRACK_FALLBACK_TAG[lesson.languageId] ?? 'CodePath',
    motif: resolveMotif(lesson),
  };
});

export function getTokenForLesson(lessonId: string): DigitalTokenSpec | undefined {
  return digitalTokens.find((token) => token.lessonId === lessonId);
}
