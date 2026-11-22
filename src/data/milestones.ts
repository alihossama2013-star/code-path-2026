import { chapters, languages, lessons } from './curriculum';
import { LocalizedText } from './types';

export type AchievementCategory = 'chapter' | 'track' | 'series' | 'streak';
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'apex';

export interface EarnedAchievementRecord {
  uid: string;
  achievementId: string;
  category: AchievementCategory;
  tier: AchievementTier;
  earnedAt: string | null;
}

export interface MilestoneEvaluationInput {
  completedLessons: string[];
  longestStreak: number;
  currentStreak: number;
}

export interface MilestoneProgress {
  current: number;
  target: number;
  unlocked: boolean;
}

export interface MilestoneSpec {
  id: string;
  code: string;
  category: AchievementCategory;
  tier: AchievementTier;
  title: LocalizedText;
  description: LocalizedText;
  targetLessonId?: string;
  targetLanguageId?: string;
  evaluate: (input: MilestoneEvaluationInput) => MilestoneProgress;
}

const chapterMilestones: MilestoneSpec[] = chapters.map((ch, idx) => {
  const chLessons = lessons.filter((l) => l.chapterId === ch.id);
  const langCourse = languages.find((item) => item.id === ch.languageId);
  const targetCount = Math.max(1, chLessons.length);
  const tier: AchievementTier =
    ch.languageId === 'backend' || ch.languageId === 'react'
      ? 'gold'
      : chLessons.length >= 5
        ? 'silver'
        : 'bronze';

  return {
    id: `mod-${ch.id}`,
    code: `M-${String(idx + 1).padStart(2, '0')}`,
    category: 'chapter',
    tier,
    targetLessonId: chLessons[0]?.id,
    targetLanguageId: ch.languageId,
    title: {
      en: `${langCourse?.name ?? ch.languageId} · Ch. ${ch.number} Mastery`,
      ar: `إتقان ${langCourse?.title.ar ?? ch.languageId} · شابتر ${ch.number}`,
    },
    description: {
      en: `Complete all ${targetCount} lessons in "${ch.title.en}".`,
      ar: `أكمل جميع دروس "${ch.title.ar}" (${targetCount} دروس).`,
    },
    evaluate: ({ completedLessons }) => {
      const done = chLessons.filter((l) => completedLessons.includes(l.id)).length;
      return {
        current: done,
        target: targetCount,
        unlocked: done >= targetCount,
      };
    },
  };
});

const htmlLessons = lessons.filter((l) => l.languageId === 'html');
const cssLessons = lessons.filter((l) => l.languageId === 'css');
const jsReactLessons = lessons.filter(
  (l) => l.languageId === 'javascript' || l.languageId === 'react'
);
const reviewLessons = lessons.filter((l) => l.isReview);

const seriesAndTrackMilestones: MilestoneSpec[] = [
  {
    id: 'series-first-step',
    code: 'S-01',
    category: 'series',
    tier: 'bronze',
    targetLessonId: lessons[0]?.id,
    title: {
      en: 'First Principle',
      ar: 'الخطوة الأولى',
    },
    description: {
      en: 'Complete your very first lesson and mint token CP-01.',
      ar: 'أكمل درسك الأول في المنهج واحصل على الرمز CP-01.',
    },
    evaluate: ({ completedLessons }) => {
      const done = Math.min(1, completedLessons.length);
      return { current: done, target: 1, unlocked: done >= 1 };
    },
  },
  {
    id: 'series-review-initiate',
    code: 'S-02',
    category: 'series',
    tier: 'bronze',
    targetLessonId: reviewLessons[0]?.id,
    title: {
      en: 'Checkpoint Solver',
      ar: 'مجتاز محطة المراجعة',
    },
    description: {
      en: 'Finish a 2-lesson series and pass your first Review Checkpoint.',
      ar: 'أنهِ سلسلة من درسين واجتز أول درس مراجعة مدمج بنجاح.',
    },
    evaluate: ({ completedLessons }) => {
      const done = reviewLessons.filter((l) => completedLessons.includes(l.id)).length;
      return { current: Math.min(1, done), target: 1, unlocked: done >= 1 };
    },
  },
  {
    id: 'series-ten-lessons',
    code: 'S-03',
    category: 'series',
    tier: 'silver',
    title: {
      en: 'Decathlon Builder',
      ar: 'باني العشرة دروس',
    },
    description: {
      en: 'Complete 10 lessons across the curriculum.',
      ar: 'أكمل 10 دروس متتالية في المنهج.',
    },
    evaluate: ({ completedLessons }) => {
      const done = completedLessons.length;
      return { current: Math.min(10, done), target: 10, unlocked: done >= 10 };
    },
  },
  {
    id: 'series-twentyfive',
    code: 'S-04',
    category: 'series',
    tier: 'gold',
    title: {
      en: 'Quarter-Century Architect',
      ar: 'مهندس الـ 25 درساً',
    },
    description: {
      en: 'Complete 25 lessons including exercises and assessments.',
      ar: 'أكمل 25 درساً شاملة التمارين والاختبارات العملية.',
    },
    evaluate: ({ completedLessons }) => {
      const done = completedLessons.length;
      return { current: Math.min(25, done), target: 25, unlocked: done >= 25 };
    },
  },
  {
    id: 'series-halfway',
    code: 'S-05',
    category: 'series',
    tier: 'gold',
    title: {
      en: 'Halfway Summit',
      ar: 'قمة منتصف المسار',
    },
    description: {
      en: 'Reach 35 completed lessons (50% of the entire CodePath curriculum).',
      ar: 'أكمل 35 درساً (نصف منهج CodePath بالكامل).',
    },
    evaluate: ({ completedLessons }) => {
      const done = completedLessons.length;
      return { current: Math.min(35, done), target: 35, unlocked: done >= 35 };
    },
  },
  {
    id: 'streak-3-days',
    code: 'K-01',
    category: 'streak',
    tier: 'bronze',
    title: {
      en: '3-Day Rhythm',
      ar: 'إيقاع 3 أيام متواصلة',
    },
    description: {
      en: 'Maintain a 3-day consecutive learning streak.',
      ar: 'حافظ على سلسلة تعلّم يومية لمدة 3 أيام متتالية.',
    },
    evaluate: ({ longestStreak, currentStreak }) => {
      const best = Math.max(longestStreak, currentStreak);
      return { current: Math.min(3, best), target: 3, unlocked: best >= 3 };
    },
  },
  {
    id: 'streak-7-days',
    code: 'K-02',
    category: 'streak',
    tier: 'silver',
    title: {
      en: 'Unbroken Week',
      ar: 'أسبوع بلا انقطاع',
    },
    description: {
      en: 'Reach a 7-day consecutive daily learning streak.',
      ar: 'حقّق سلسلة تعلّم يومية متصلة لمدة 7 أيام.',
    },
    evaluate: ({ longestStreak, currentStreak }) => {
      const best = Math.max(longestStreak, currentStreak);
      return { current: Math.min(7, best), target: 7, unlocked: best >= 7 };
    },
  },
  {
    id: 'track-html-master',
    code: 'T-01',
    category: 'track',
    tier: 'gold',
    targetLanguageId: 'html',
    targetLessonId: htmlLessons[0]?.id,
    title: {
      en: 'HTML5 Semantic Architect',
      ar: 'مهندس HTML5 الدلالي',
    },
    description: {
      en: `Complete all ${htmlLessons.length} lessons and review checkpoints in HTML5.`,
      ar: `أكمل جميع دروس ومحطات المراجعة في مسار HTML5 (${htmlLessons.length} درساً).`,
    },
    evaluate: ({ completedLessons }) => {
      const done = htmlLessons.filter((l) => completedLessons.includes(l.id)).length;
      return {
        current: done,
        target: Math.max(1, htmlLessons.length),
        unlocked: htmlLessons.length > 0 && done >= htmlLessons.length,
      };
    },
  },
  {
    id: 'track-css-master',
    code: 'T-02',
    category: 'track',
    tier: 'silver',
    targetLanguageId: 'css',
    targetLessonId: cssLessons[0]?.id,
    title: {
      en: 'CSS3 Layout Engineer',
      ar: 'مهندس تخطيطات CSS3',
    },
    description: {
      en: 'Complete Box Model, Flexbox, CSS Grid, and review checkpoints.',
      ar: 'أكمل مسار CSS3 بالكامل (نموذج الصندوق والشبكات والمراجعة).',
    },
    evaluate: ({ completedLessons }) => {
      const done = cssLessons.filter((l) => completedLessons.includes(l.id)).length;
      return {
        current: done,
        target: Math.max(1, cssLessons.length),
        unlocked: cssLessons.length > 0 && done >= cssLessons.length,
      };
    },
  },
  {
    id: 'track-js-react-master',
    code: 'T-03',
    category: 'track',
    tier: 'gold',
    targetLanguageId: 'javascript',
    targetLessonId: jsReactLessons[0]?.id,
    title: {
      en: 'Interactive Frontend Builder',
      ar: 'مطوّر الواجهات التفاعلية',
    },
    description: {
      en: 'Complete both JavaScript and React & TypeScript tracks.',
      ar: 'أكمل مساري JavaScript و React & TypeScript بالكامل.',
    },
    evaluate: ({ completedLessons }) => {
      const done = jsReactLessons.filter((l) => completedLessons.includes(l.id)).length;
      return {
        current: done,
        target: Math.max(1, jsReactLessons.length),
        unlocked: jsReactLessons.length > 0 && done >= jsReactLessons.length,
      };
    },
  },
  {
    id: 'track-fullstack-graduate',
    code: 'T-04',
    category: 'track',
    tier: 'apex',
    title: {
      en: 'CodePath Full-Stack Graduate',
      ar: 'خرّيج مسار CodePath المتكامل',
    },
    description: {
      en: `Complete every lesson and milestone across all ${lessons.length} steps in CodePath.`,
      ar: `أتمم جميع الدروس الـ ${lessons.length} عبر كافة المسارات من HTML إلى Backend.`,
    },
    evaluate: ({ completedLessons }) => {
      const done = lessons.filter((l) => completedLessons.includes(l.id)).length;
      return {
        current: done,
        target: lessons.length,
        unlocked: lessons.length > 0 && done >= lessons.length,
      };
    },
  },
];

export const milestoneSpecs: MilestoneSpec[] = [
  ...seriesAndTrackMilestones,
  ...chapterMilestones,
];

export function getMilestoneSpec(achievementId: string): MilestoneSpec | undefined {
  return milestoneSpecs.find((m) => m.id === achievementId);
}

export function computeQualifiedAchievements(input: MilestoneEvaluationInput): MilestoneSpec[] {
  return milestoneSpecs.filter((spec) => spec.evaluate(input).unlocked);
}
