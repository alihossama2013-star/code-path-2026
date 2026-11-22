import {
  CodeQuizQuestion,
  Lesson,
  LessonExplanation,
  LessonSection,
  PlaygroundStarter,
  QuizQuestion,
  TagSpec,
} from './types';

function mergeStarterBundles(a: PlaygroundStarter, b: PlaygroundStarter): PlaygroundStarter {
  const cleanHtmlA = (a.html || '').trim();
  const cleanHtmlB = (b.html || '').trim();

  let html = '';
  if (!cleanHtmlA) {
    html = cleanHtmlB;
  } else if (!cleanHtmlB) {
    html = cleanHtmlA;
  } else if (/<html\b/i.test(cleanHtmlB) || /<!doctype/i.test(cleanHtmlB)) {
    // Extract body content from A if A is also a full document, or keep B with A's body snippet
    const bodyMatchA = cleanHtmlA.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const snippetA = bodyMatchA ? bodyMatchA[1].trim() : cleanHtmlA;
    if (snippetA && !/<(html|head|!doctype)\b/i.test(snippetA) && /<\/body>/i.test(cleanHtmlB)) {
      html = cleanHtmlB.replace(/<\/body>/i, `  ${snippetA}\n</body>`);
    } else {
      html = cleanHtmlB;
    }
  } else {
    html = `${cleanHtmlA}\n\n${cleanHtmlB}`;
  }

  const cssParts = [a.css?.trim(), b.css?.trim()].filter(Boolean);
  const jsParts = [a.js?.trim(), b.js?.trim()].filter(Boolean);

  return {
    html,
    css: cssParts.join('\n\n'),
    js: jsParts.join('\n\n'),
  };
}

function buildReviewExplanation(lessonA: Lesson, lessonB: Lesson): LessonExplanation {
  const overviewEn = `This review checkpoint brings together "${lessonA.title.en}" and "${lessonB.title.en}" so you can verify how both concepts connect in real projects. ${lessonA.summary.en} Together with that, ${lessonB.summary.en.charAt(0).toLowerCase()}${lessonB.summary.en.slice(1)}`;
  const overviewAr = `تجمع محطة المراجعة هذه بين "${lessonA.title.ar}" و"${lessonB.title.ar}" لتتأكد من كيفية تكامل المفهومين معاً في المشاريع الحقيقية. ${lessonA.summary.ar} إلى جانب ذلك: ${lessonB.summary.ar}`;

  const howAEn = lessonA.explanation?.howItWorks.en ?? lessonA.summary.en;
  const howBEn = lessonB.explanation?.howItWorks.en ?? lessonB.summary.en;
  const howAAr = lessonA.explanation?.howItWorks.ar ?? lessonA.summary.ar;
  const howBAr = lessonB.explanation?.howItWorks.ar ?? lessonB.summary.ar;

  const keyEn: string[] = [
    ...(lessonA.explanation?.keyPoints.en.slice(0, 2) ?? [lessonA.summary.en]),
    ...(lessonB.explanation?.keyPoints.en.slice(0, 2) ?? [lessonB.summary.en]),
    `Practice combining ${lessonA.title.en} and ${lessonB.title.en} inside one unified file before moving forward.`,
  ];

  const keyAr: string[] = [
    ...(lessonA.explanation?.keyPoints.ar.slice(0, 2) ?? [lessonA.summary.ar]),
    ...(lessonB.explanation?.keyPoints.ar.slice(0, 2) ?? [lessonB.summary.ar]),
    `تدرّب على دمج "${lessonA.title.ar}" و"${lessonB.title.ar}" داخل ملف واحد متكامل قبل الانتقال للخطوة التالية.`,
  ];

  const mistakeAEn = lessonA.explanation?.commonMistake.en ?? '';
  const mistakeBEn = lessonB.explanation?.commonMistake.en ?? '';
  const mistakeAAr = lessonA.explanation?.commonMistake.ar ?? '';
  const mistakeBAr = lessonB.explanation?.commonMistake.ar ?? '';

  return {
    overview: { en: overviewEn, ar: overviewAr },
    howItWorks: {
      en: `${howAEn}\n\n${howBEn}`,
      ar: `${howAAr}\n\n${howBAr}`,
    },
    keyPoints: {
      en: keyEn,
      ar: keyAr,
    },
    commonMistake: {
      en: [mistakeAEn, mistakeBEn].filter(Boolean).join(' ') || 'Keep markup clean, semantic, and properly paired across both topics.',
      ar: [mistakeAAr, mistakeBAr].filter(Boolean).join(' ') || 'حافظ على نظافة البنية وإغلاق العناصر بشكل سليم عند الدمج بين الدرسين.',
    },
  };
}

function buildReviewAssessment(
  reviewId: string,
  lessonA: Lesson,
  lessonB: Lesson
): { quiz: QuizQuestion[]; codeQuiz: CodeQuizQuestion[] } {
  const mcqPoolA = lessonA.quiz ?? [];
  const mcqPoolB = lessonB.quiz ?? [];
  const interleavedMcq: QuizQuestion[] = [];
  const seenPrompts = new Set<string>();

  const maxMcqLen = Math.max(mcqPoolA.length, mcqPoolB.length);
  for (let i = 0; i < maxMcqLen; i += 1) {
    for (const candidate of [mcqPoolA[i], mcqPoolB[i]]) {
      if (candidate && interleavedMcq.length < 5 && !seenPrompts.has(candidate.question.en)) {
        seenPrompts.add(candidate.question.en);
        interleavedMcq.push({
          ...candidate,
          id: `${reviewId}-mcq-${interleavedMcq.length + 1}`,
        });
      }
    }
  }

  const codePoolA = lessonA.codeQuiz ?? [];
  const codePoolB = lessonB.codeQuiz ?? [];
  const interleavedCode: CodeQuizQuestion[] = [];
  const seenCodePrompts = new Set<string>();

  const maxCodeLen = Math.max(codePoolA.length, codePoolB.length);
  for (let i = 0; i < maxCodeLen; i += 1) {
    for (const candidate of [codePoolA[i], codePoolB[i]]) {
      if (candidate && interleavedCode.length < 5 && !seenCodePrompts.has(candidate.prompt.en)) {
        seenCodePrompts.add(candidate.prompt.en);
        interleavedCode.push({
          ...candidate,
          id: `${reviewId}-code-${interleavedCode.length + 1}`,
        });
      }
    }
  }

  return {
    quiz: interleavedMcq,
    codeQuiz: interleavedCode,
  };
}

function createReviewLesson(reviewNumber: number, lessonA: Lesson, lessonB: Lesson): Lesson {
  const padded = String(reviewNumber).padStart(2, '0');
  const reviewId = `review-${padded}`;

  const mergedTags = Array.from(
    new Set([...(lessonA.tags ?? []).slice(0, 3), ...(lessonB.tags ?? []).slice(0, 3)])
  );

  const mergedTagSpecs: TagSpec[] = [
    ...(lessonA.tagSpecs?.slice(0, 2) ?? []),
    ...(lessonB.tagSpecs?.slice(0, 2) ?? []),
  ];

  const sections: LessonSection[] = [];
  const firstCodeA = lessonA.sections.find((s) => Boolean(s.code));
  const firstCodeB = lessonB.sections.find((s) => Boolean(s.code));

  if (firstCodeA) {
    sections.push({
      heading: {
        en: `Part 1 Recap · ${lessonA.title.en}`,
        ar: `مراجعة الجزء الأول · ${lessonA.title.ar}`,
      },
      body: firstCodeA.body,
      code: firstCodeA.code,
      codeLanguage: firstCodeA.codeLanguage,
    });
  }
  if (firstCodeB) {
    sections.push({
      heading: {
        en: `Part 2 Recap · ${lessonB.title.en}`,
        ar: `مراجعة الجزء الثاني · ${lessonB.title.ar}`,
      },
      body: firstCodeB.body,
      code: firstCodeB.code,
      codeLanguage: firstCodeB.codeLanguage,
    });
  }
  if (sections.length === 0) {
    sections.push({
      heading: {
        en: `Combined Review: ${lessonA.title.en} & ${lessonB.title.en}`,
        ar: `مراجعة مدمجة: ${lessonA.title.ar} و${lessonB.title.ar}`,
      },
      body: {
        en: `${lessonA.summary.en} ${lessonB.summary.en}`,
        ar: `${lessonA.summary.ar} ${lessonB.summary.ar}`,
      },
    });
  }

  const assessment = buildReviewAssessment(reviewId, lessonA, lessonB);

  return {
    id: reviewId,
    languageId: lessonB.languageId,
    chapterId: lessonB.chapterId,
    order: lessonB.order + 0.5,
    durationMinutes: Math.min(
      20,
      Math.max(10, Math.round((lessonA.durationMinutes + lessonB.durationMinutes) * 0.45))
    ),
    isReview: true,
    reviewedLessonIds: [lessonA.id, lessonB.id],
    reviewedLessonTitles: [lessonA.title, lessonB.title],
    tags: mergedTags.length > 0 ? mergedTags : undefined,
    tagSpecs: mergedTagSpecs.length > 0 ? mergedTagSpecs : undefined,
    title: {
      en: `Review ${padded}: ${lessonA.title.en} & ${lessonB.title.en}`,
      ar: `مراجعة ${padded}: ${lessonA.title.ar} و${lessonB.title.ar}`,
    },
    summary: {
      en: `Hands-on review consolidating the previous two lessons: "${lessonA.title.en}" and "${lessonB.title.en}".`,
      ar: `درس مراجعة وتثبيت يجمع المفاهيم والمهارات من الدرسين السابقين: "${lessonA.title.ar}" و"${lessonB.title.ar}".`,
    },
    explanation: buildReviewExplanation(lessonA, lessonB),
    imageUrl: lessonB.imageUrl ?? lessonA.imageUrl,
    imageAlt: {
      en: `Review visual combining ${lessonA.title.en} and ${lessonB.title.en}`,
      ar: `بطاقة مراجعة تجمع بين ${lessonA.title.ar} و${lessonB.title.ar}`,
    },
    imageCaption: {
      en: `Review ${padded}: bridging "${lessonA.title.en}" with "${lessonB.title.en}".`,
      ar: `مراجعة ${padded}: الربط العملي بين "${lessonA.title.ar}" و"${lessonB.title.ar}".`,
    },
    sections,
    challenge: {
      en: `Combine both lessons in one solution: (1) ${lessonA.challenge.en} (2) ${lessonB.challenge.en}`,
      ar: `اجمع الدرسين في حل واحد: (1) ${lessonA.challenge.ar} (2) ${lessonB.challenge.ar}`,
    },
    starterCode: mergeStarterBundles(lessonA.starterCode, lessonB.starterCode),
    quiz: assessment.quiz,
    codeQuiz: assessment.codeQuiz,
  };
}

export function buildCurriculumWithReviews(baseLessons: Lesson[]): Lesson[] {
  const result: Lesson[] = [];
  let reviewCount = 0;

  for (let i = 0; i < baseLessons.length; i += 1) {
    result.push(baseLessons[i]);
    if (i % 2 === 1) {
      reviewCount += 1;
      const lessonA = baseLessons[i - 1];
      const lessonB = baseLessons[i];
      result.push(createReviewLesson(reviewCount, lessonA, lessonB));
    }
  }

  return result;
}
