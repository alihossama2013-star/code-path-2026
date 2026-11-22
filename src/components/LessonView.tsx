import { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, BookOpen, Check, Code2, Copy, Layers, Lock } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { chapters, languages, lessons } from '../data/curriculum';
import { getTokenForLesson } from '../data/tokens';
import { CodeQuizCheck, PlaygroundStarter } from '../data/types';
import { AssessmentCodeQuestionCard } from './AssessmentCodeQuestionCard';
import { LessonAudioPlayer } from './LessonAudioPlayer';
import { CodeSimulator } from './CodeSimulator';
import { LessonExerciseWorkspace } from './LessonExerciseWorkspace';
import { LessonVisual } from './LessonVisual';
import {
  AnimatedNumber,
  EASE_SETTLE,
  MilestoneCelebration,
  ScrollReveal,
  SPRING_SNAPPY,
} from './MotionPrimitives';

type LessonTab = 'learn' | 'practice' | 'assessment';

const EMPTY_CODE: PlaygroundStarter = { html: '', css: '', js: '' };

export function LessonView() {
  const {
    t,
    lang,
    activeLessonId,
    activeLessonTab: tab,
    setActiveLessonTab: setTab,
    openLesson,
    openLanguage,
    completedLessons,
    toggleLessonComplete,
    isLessonRead,
    markLessonRead,
    isExercisePassed,
    markExercisePassed,
    recordQuizScore,
    loadStarterInPlayground,
  } = useApp();

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [codeAnswers, setCodeAnswers] = useState<Record<string, PlaygroundStarter>>({});
  const [codeResults, setCodeResults] = useState<
    Record<string, { passed: boolean; checks: CodeQuizCheck[] }>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [assessmentResetNonce, setAssessmentResetNonce] = useState(0);
  const [completionBurstNonce, setCompletionBurstNonce] = useState(0);

  const lessonIndex = lessons.findIndex((l) => l.id === activeLessonId);
  const lesson = lessons[lessonIndex] ?? lessons[0];
  const language = languages.find((item) => item.id === lesson.languageId);
  const chapter = chapters.find((ch) => ch.id === lesson.chapterId);
  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;
  const isCompleted = completedLessons.includes(lesson.id);
  const lessonRead = isLessonRead(lesson.id);
  const exercisePassed = isExercisePassed(lesson.id);
  const codeQuestions = lesson.codeQuiz ?? [];
  const lessonToken = getTokenForLesson(lesson.id);

  useEffect(() => {
    setAnswers({});
    setCodeAnswers({});
    setCodeResults({});
    setSubmitted(false);
    setCompletionBurstNonce(0);
    setAssessmentResetNonce((n) => n + 1);
  }, [activeLessonId]);

  const BackArrow = lang === 'ar' ? ArrowRight : ArrowLeft;
  const ForwardArrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard?.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleCheckCodeQuestion = (qId: string) => {
    const q = codeQuestions.find((item) => item.id === qId);
    if (!q) return;
    const currentCode = codeAnswers[qId] ?? EMPTY_CODE;
    const res = q.validate(currentCode, lang);
    setCodeResults((prev) => ({ ...prev, [qId]: res }));
  };

  const handleSubmitQuiz = () => {
    let correctMcq = 0;
    lesson.quiz.forEach((q) => {
      if (answers[q.id] === q.correctIndex) correctMcq += 1;
    });

    const evaluatedCode: Record<string, { passed: boolean; checks: CodeQuizCheck[] }> = {};
    let passedCode = 0;
    codeQuestions.forEach((q) => {
      const res = q.validate(codeAnswers[q.id] ?? EMPTY_CODE, lang);
      evaluatedCode[q.id] = res;
      if (res.passed) passedCode += 1;
    });
    setCodeResults(evaluatedCode);

    const totalQuestions = lesson.quiz.length + codeQuestions.length;
    const score = totalQuestions > 0 ? Math.round(((correctMcq + passedCode) / totalQuestions) * 100) : 0;
    recordQuizScore(lesson.id, score);
    setSubmitted(true);
  };

  const correctMcqCount = lesson.quiz.filter((q) => answers[q.id] === q.correctIndex).length;
  const passedCodeCount = codeQuestions.filter((q) => codeResults[q.id]?.passed).length;
  const totalQuestionCount = lesson.quiz.length + codeQuestions.length;
  const totalCorrectCount = correctMcqCount + passedCodeCount;
  const quizScore =
    submitted && totalQuestionCount > 0
      ? Math.round((totalCorrectCount / totalQuestionCount) * 100)
      : 0;

  const answeredMcqCount = lesson.quiz.filter((q) => answers[q.id] !== undefined).length;
  const checkedCodeCount = codeQuestions.filter((q) => codeResults[q.id] !== undefined).length;
  const totalPreparedCount = answeredMcqCount + checkedCodeCount;
  const canSubmitAssessment =
    answeredMcqCount >= lesson.quiz.length && checkedCodeCount >= codeQuestions.length;

  const totalLessonsCount = lessons.length;
  const completedLessonsCount = lessons.filter((l) => completedLessons.includes(l.id)).length;
  const overallPercent =
    totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

  return (
    <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Curriculum Completion Progress Bar (across all curriculum lessons) */}
      <div className="mb-6 rounded border border-[#E7E7E7] bg-white px-4 py-3 dark:border-[#262626] dark:bg-[#191919]">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-medium text-[#777777] dark:text-[#A3A3A3]">
            {t.roadmap.progressLabel}
          </span>
          <span className="font-mono font-medium text-[#111111] tabular-nums dark:text-white">
            {completedLessonsCount} {t.roadmap.completedOf} {totalLessonsCount} ·{' '}
            <AnimatedNumber value={overallPercent} suffix="%" />
          </span>
        </div>
        <div
          role="progressbar"
          aria-label={t.roadmap.progressLabel}
          aria-valuemin={0}
          aria-valuemax={totalLessonsCount}
          aria-valuenow={completedLessonsCount}
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F5F5F5] dark:bg-[#262626]"
        >
          <motion.div
            className="h-full bg-[#111111] dark:bg-white"
            initial={false}
            animate={{ width: `${overallPercent}%` }}
            transition={SPRING_SNAPPY}
          />
        </div>
      </div>

      {/* Top Breadcrumb & Complete Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7E7E7] pb-6 dark:border-[#262626]">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => openLanguage(lesson.languageId)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#777777] hover:text-[#111111] dark:text-[#A3A3A3] dark:hover:text-white"
        >
          <BackArrow className="h-4 w-4" aria-hidden="true" />
          <span>
            {t.lesson.backToChapters} ({language?.title[lang]})
          </span>
        </motion.button>

        <motion.button
          type="button"
          whileTap={exercisePassed || isCompleted ? { scale: 0.96 } : undefined}
          disabled={!exercisePassed && !isCompleted}
          onClick={() => {
            if (!isCompleted) {
              setCompletionBurstNonce((n) => n + 1);
            }
            toggleLessonComplete(lesson.id);
          }}
          className={`inline-flex h-9 items-center gap-1.5 rounded border px-3.5 text-xs font-medium transition-colors ${
            isCompleted
              ? 'border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]'
              : exercisePassed
                ? 'border-[#E7E7E7] bg-white text-[#111111] hover:bg-[#F5F5F5] dark:border-[#333333] dark:bg-[#111111] dark:text-white dark:hover:bg-[#191919]'
                : 'cursor-not-allowed border-[#E7E7E7] bg-[#F5F5F5] text-[#777777] opacity-70 dark:border-[#262626] dark:bg-[#191919] dark:text-[#A3A3A3]'
          }`}
        >
          {isCompleted ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : !exercisePassed ? (
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>
            {isCompleted
              ? t.lesson.completed
              : exercisePassed
                ? t.lesson.markComplete
                : t.lesson.completeStepsFirst}
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isCompleted && completionBurstNonce > 0 && (
          <div className="mt-4">
            <MilestoneCelebration
              active
              triggerKey={`lesson-done-${lesson.id}-${completionBurstNonce}`}
              title={t.lesson.completed}
              subtitle={
                lessonToken
                  ? `${lesson.title[lang]} · ${t.lesson.tokenMintedToast}: ${lessonToken.tokenCode}`
                  : lesson.title[lang]
              }
            />
          </div>
        )}
      </AnimatePresence>

      {/* Lesson Title & Metadata */}
      <div className="mt-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#777777] dark:text-[#A3A3A3]">
          <span>{language?.title[lang]}</span>
          <span aria-hidden="true">·</span>
          <span>
            {t.roadmap.chapterLabel} {chapter?.number}: {chapter?.title[lang]}
          </span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">
            {lesson.durationMinutes} {t.roadmap.minutes}
          </span>
          {lesson.isReview && (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-medium text-[#111111] dark:text-white">
                <Layers className="h-3 w-3" aria-hidden="true" />
                <span>{t.lesson.reviewCheckpointLabel}</span>
              </span>
            </>
          )}
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#111111] dark:text-white">
          {lesson.title[lang]}
        </h1>
        <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-[#777777] dark:text-[#A3A3A3]">
          {lesson.summary[lang]}
        </p>

        {lesson.tags && lesson.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#777777] dark:text-[#A3A3A3]">
            <span>{t.lesson.tagsTaughtLabel}:</span>
            <span className="code-ltr font-mono font-medium text-[#111111] dark:text-white">
              {lesson.tags.join('  ·  ')}
            </span>
          </div>
        )}

        {lesson.isReview && lesson.reviewedLessonIds && lesson.reviewedLessonTitles && (
          <div className="mt-5 rounded border border-[#E7E7E7] bg-[#F5F5F5] p-4 dark:border-[#262626] dark:bg-[#191919]">
            <div className="flex items-center gap-2 text-xs font-medium text-[#777777] dark:text-[#A3A3A3]">
              <Layers className="h-3.5 w-3.5 text-[#111111] dark:text-white" aria-hidden="true" />
              <span>{t.lesson.reviewingPairHeading}</span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {lesson.reviewedLessonIds.map((revId, idx) => {
                const revTitle = lesson.reviewedLessonTitles![idx];
                return (
                  <button
                    key={revId}
                    type="button"
                    onClick={() => openLesson(revId)}
                    className="flex items-center justify-between gap-3 rounded border border-[#E7E7E7] bg-white px-3.5 py-2.5 text-start transition-colors hover:border-[#111111] dark:border-[#2A2A2A] dark:bg-[#141414] dark:hover:border-white"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="font-mono text-[11px] text-[#777777] tabular-nums dark:text-[#A3A3A3]">
                        0{idx + 1}
                      </span>
                      <span className="truncate text-xs font-medium text-[#111111] dark:text-white">
                        {revTitle[lang]}
                      </span>
                    </div>
                    <ForwardArrow className="h-3.5 w-3.5 shrink-0 text-[#777777] dark:text-[#A3A3A3]" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mode Tabs */}
      <div className="mt-8 flex items-center gap-6 border-b border-[#E7E7E7] dark:border-[#262626]">
        {(
          [
            { id: 'learn', label: t.lesson.tabLearn, locked: false, done: lessonRead },
            { id: 'practice', label: t.lesson.tabPractice, locked: !lessonRead, done: exercisePassed },
            { id: 'assessment', label: t.lesson.tabAssessment, locked: !exercisePassed, done: isCompleted },
          ] as const
        ).map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              disabled={item.locked}
              onClick={() => {
                if (!item.locked) setTab(item.id);
              }}
              className={`relative inline-flex items-center gap-1.5 pb-3 text-sm font-medium whitespace-nowrap transition-colors ${
                item.locked
                  ? 'cursor-not-allowed text-[#999999] opacity-60 dark:text-[#666666]'
                  : active
                    ? 'text-[#111111] dark:text-white'
                    : 'text-[#777777] hover:text-[#111111] dark:text-[#A3A3A3] dark:hover:text-white'
              }`}
            >
              {item.locked ? (
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              ) : item.done ? (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              ) : null}
              <span>{item.label}</span>
              {active && !item.locked && (
                <motion.span
                  layoutId={`lesson-tab-underline-${lesson.id}`}
                  transition={SPRING_SNAPPY}
                  className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-[#111111] dark:bg-white"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Area with Smooth Switch */}
      <AnimatePresence mode="wait">
        {tab === 'learn' && (
          <motion.div
            key="tab-learn"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: EASE_SETTLE }}
            className="mt-8 space-y-12"
          >
          {/* Arabic / English Read-Aloud Audio Player */}
          <ScrollReveal y={14}>
            <LessonAudioPlayer lesson={lesson} />
          </ScrollReveal>

          {/* Clear, Scannable Written Explanation */}
          {lesson.explanation && (
            <ScrollReveal y={16}>
              <section className="space-y-6 rounded border border-[#E7E7E7] bg-white p-6 sm:p-8 dark:border-[#262626] dark:bg-[#191919]">
              <div className="flex items-center gap-2.5 border-b border-[#E7E7E7] pb-4 dark:border-[#262626]">
                <BookOpen className="h-4 w-4 text-[#111111] dark:text-white" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-[#111111] dark:text-white">
                  {t.lesson.writtenExplanationHeading}
                </h2>
              </div>

              <div className="max-w-[74ch] space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#111111] dark:text-white">
                    {t.lesson.overviewHeading}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.85] text-[#333333] dark:text-[#D4D4D4]">
                    {lesson.explanation.overview[lang]}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#111111] dark:text-white">
                    {t.lesson.howItWorksHeading}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.85] text-[#333333] dark:text-[#D4D4D4]">
                    {lesson.explanation.howItWorks[lang]}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#111111] dark:text-white">
                    {t.lesson.keyTakeawaysHeading}
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {lesson.explanation.keyPoints[lang].map((point, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: lang === 'ar' ? 8 : -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 'some' }}
                        transition={{ delay: i * 0.05, duration: 0.25, ease: EASE_SETTLE }}
                        className="flex items-start gap-3 text-[15px] leading-[1.75] text-[#333333] dark:text-[#D4D4D4]"
                      >
                        <span className="mt-1 font-mono text-xs font-semibold text-[#777777] tabular-nums dark:text-[#A3A3A3]">
                          0{i + 1}.
                        </span>
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="rounded border border-[#E7E7E7] bg-[#F5F5F5] p-4 dark:border-[#262626] dark:bg-[#111111]">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-[#111111] dark:text-white" aria-hidden="true" />
                    <h3 className="text-xs font-semibold tracking-wide text-[#111111] uppercase dark:text-white">
                      {t.lesson.commonMistakeHeading}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#333333] dark:text-[#D4D4D4]">
                    {lesson.explanation.commonMistake[lang]}
                  </p>
                </div>
              </div>
              </section>
            </ScrollReveal>
          )}

          {/* Visual Guide: Architectural Diagram + Tag Anatomy */}
          <ScrollReveal y={18}>
            <LessonVisual lesson={lesson} />
          </ScrollReveal>

          {/* Tag Syntax & Attributes Reference */}
          {lesson.tagSpecs && lesson.tagSpecs.length > 0 && (
            <ScrollReveal y={16}>
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-[#111111] dark:text-white">
                  {t.lesson.syntaxLabel} &amp; {t.lesson.attributesLabel}
                </h2>
                <div className="divide-y divide-[#E7E7E7] rounded border border-[#E7E7E7] bg-white dark:divide-[#262626] dark:border-[#262626] dark:bg-[#191919]">
                  {lesson.tagSpecs.map((spec, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 'some' }}
                      transition={{ delay: idx * 0.05, duration: 0.25, ease: EASE_SETTLE }}
                      className="space-y-3 p-5 sm:p-6"
                    >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="code-ltr font-mono text-base font-bold text-[#111111] dark:text-white">
                        {spec.tag}
                      </h3>
                    </div>
                    <p className="text-[15px] leading-relaxed text-[#333333] dark:text-[#D4D4D4]">
                      {spec.description[lang]}
                    </p>
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-[#777777] dark:text-[#A3A3A3]">
                        {t.lesson.syntaxLabel}
                      </p>
                      <pre className="code-ltr overflow-x-auto rounded border border-[#E7E7E7] bg-[#F5F5F5] p-3.5 text-xs leading-6 text-[#111111] dark:border-[#262626] dark:bg-[#111111] dark:text-[#E7E7E7]">
                        <code>{spec.syntax}</code>
                      </pre>
                      <CodeSimulator
                        key={`${lesson.id}-spec-${idx}`}
                        initialCode={spec.syntax}
                        language="html"
                        defaultOpen={false}
                        compact
                      />
                    </div>
                    <p className="text-xs leading-relaxed text-[#777777] dark:text-[#A3A3A3]">
                      <span className="font-semibold text-[#111111] dark:text-white">
                        {t.lesson.attributesLabel}:{' '}
                      </span>
                      {spec.attributes[lang]}
                    </p>
                    </motion.div>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          )}

          {/* Code Examples */}
          {lesson.sections.map((section, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.04} y={16}>
              <section className="space-y-4">
              <h2 className="text-lg font-semibold text-[#111111] dark:text-white">
                {section.code ? t.lesson.exampleLabel : section.heading[lang]}
              </h2>
              {!lesson.explanation && !lesson.tagSpecs && (
                <p className="text-base leading-relaxed text-[#333333] dark:text-[#D4D4D4]">
                  {section.body[lang]}
                </p>
              )}

              {section.code && (
                <div className="overflow-hidden rounded border border-[#E7E7E7] dark:border-[#262626]">
                  <div
                    className="flex items-center justify-between border-b border-[#262626] bg-[#191919] px-4 py-2 text-xs text-[#A3A3A3]"
                    dir="ltr"
                  >
                    <span className="font-mono">{section.codeLanguage ?? 'html'}</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleCopy(section.code!, idx)}
                        className="inline-flex items-center gap-1 text-xs text-[#E7E7E7] hover:text-white"
                      >
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{copiedIndex === idx ? t.lesson.copied : t.lesson.copyCode}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => loadStarterInPlayground(lesson.starterCode)}
                        className="inline-flex items-center gap-1 text-xs text-[#E7E7E7] hover:text-white"
                      >
                        <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t.lesson.tryInPlayground}</span>
                      </button>
                    </div>
                  </div>
                  <pre className="code-ltr m-0 overflow-x-auto bg-[#111111] p-5 text-[13px] leading-6 text-[#E7E7E7]">
                    <code>{section.code}</code>
                  </pre>
                </div>
              )}

              {section.code && (
                <CodeSimulator
                  key={`${lesson.id}-sec-${idx}`}
                  initialCode={section.code}
                  language={section.codeLanguage ?? 'html'}
                  starterBundle={lesson.starterCode}
                  defaultOpen={true}
                />
              )}
              </section>
            </ScrollReveal>
          ))}

          {/* Reading Confirmation Bar to Unlock Exercise */}
          <ScrollReveal y={14}>
            <div className="flex flex-col justify-between gap-4 rounded border border-[#111111] bg-[#F5F5F5] p-6 sm:flex-row sm:items-center dark:border-white dark:bg-[#191919]">
              <div>
                <p className="text-sm font-semibold text-[#111111] dark:text-white">
                  {lessonRead ? t.lesson.readingDoneLabel : t.lesson.finishReadingBtn}
                </p>
                <p className="mt-1 text-xs text-[#777777] dark:text-[#A3A3A3]">
                  {lesson.challenge[lang]}
                </p>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  markLessonRead(lesson.id);
                  setTab('practice');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded bg-[#111111] px-5 text-xs font-medium text-white whitespace-nowrap transition-colors hover:bg-[#2B2B2B] dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
              >
                <span>{lessonRead ? t.lesson.readingDoneLabel : t.lesson.finishReadingBtn}</span>
                <ForwardArrow className="h-3.5 w-3.5" aria-hidden="true" />
              </motion.button>
            </div>
          </ScrollReveal>
        </motion.div>
      )}

      {/* Tab 2: Practice Exercise (Gated behind Lesson Reading + Live Code & Web Preview Tabs) */}
      {tab === 'practice' && (
        <motion.div
          key="tab-practice"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: EASE_SETTLE }}
          className="mt-8"
        >
          {!lessonRead ? (
            <div className="rounded border border-[#E7E7E7] bg-[#F5F5F5] p-6 sm:p-8 dark:border-[#262626] dark:bg-[#191919]">
              <div className="flex items-center gap-2.5 text-[#111111] dark:text-white">
                <Lock className="h-4 w-4" aria-hidden="true" />
                <h2 className="text-base font-semibold">{t.lesson.exerciseLockedTitle}</h2>
              </div>
              <p className="mt-2 text-sm text-[#777777] dark:text-[#A3A3A3]">
                {t.lesson.exerciseLockedDesc}
              </p>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setTab('learn')}
                className="mt-5 inline-flex h-9 items-center rounded bg-[#111111] px-4 text-xs font-medium text-white dark:bg-white dark:text-[#111111]"
              >
                {t.lesson.goToLessonBtn}
              </motion.button>
            </div>
          ) : (
            <LessonExerciseWorkspace
              lesson={lesson}
              isPassed={exercisePassed}
              onExercisePassed={() => markExercisePassed(lesson.id)}
              onProceedToAssessment={() => {
                setTab('assessment');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </motion.div>
      )}

      {/* Tab 3: Assessment (Gated behind Exercise Task Verification) */}
      {tab === 'assessment' && (
        <motion.div
          key="tab-assessment"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: EASE_SETTLE }}
          className="mt-8 space-y-6"
        >
          {!exercisePassed ? (
            <div className="rounded border border-[#E7E7E7] bg-[#F5F5F5] p-6 sm:p-8 dark:border-[#262626] dark:bg-[#191919]">
              <div className="flex items-center gap-2.5 text-[#111111] dark:text-white">
                <Lock className="h-4 w-4" aria-hidden="true" />
                <h2 className="text-base font-semibold">{t.lesson.assessmentLockedTitle}</h2>
              </div>
              <p className="mt-2 text-sm text-[#777777] dark:text-[#A3A3A3]">
                {t.lesson.assessmentLockedDesc}
              </p>
              <button
                type="button"
                onClick={() => setTab(lessonRead ? 'practice' : 'learn')}
                className="mt-5 inline-flex h-9 items-center rounded bg-[#111111] px-4 text-xs font-medium text-white dark:bg-white dark:text-[#111111]"
              >
                {lessonRead ? t.lesson.goToExerciseBtn : t.lesson.goToLessonBtn}
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E7E7E7] pb-4 dark:border-[#262626]">
                <div>
                  <h2 className="text-xl font-semibold text-[#111111] dark:text-white">
                    {t.lesson.assessmentTitle}
                  </h2>
                  <p className="mt-1 text-sm text-[#777777] dark:text-[#A3A3A3]">
                    {t.lesson.assessmentSubtitle}
                  </p>
                </div>
                <span className="font-mono text-xs font-medium text-[#111111] tabular-nums dark:text-white">
                  {t.lesson.assessmentProgressLabel}: {totalPreparedCount} / {totalQuestionCount}
                </span>
              </div>

              {/* Part A: 5 Multiple-Choice Questions */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wide text-[#777777] uppercase dark:text-[#A3A3A3]">
                  {t.lesson.assessmentPartAMcq}
                </h3>

                {lesson.quiz.map((q, qIdx) => {
                  const selected = answers[q.id];
                  const isCorrect = selected === q.correctIndex;
                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 'some' }}
                      transition={{ delay: qIdx * 0.04, duration: 0.25, ease: EASE_SETTLE }}
                      className="rounded border border-[#E7E7E7] bg-white p-6 dark:border-[#262626] dark:bg-[#191919]"
                    >
                      <p className="text-base font-medium text-[#111111] dark:text-white">
                        <span className="me-2 font-mono text-xs text-[#777777] tabular-nums">
                          {String(qIdx + 1).padStart(2, '0')}.
                        </span>
                        {q.question[lang]}
                      </p>

                      <div className="mt-4 space-y-2.5">
                        {q.options.map((opt, optIdx) => {
                          const checked = selected === optIdx;
                          return (
                            <motion.button
                              key={optIdx}
                              type="button"
                              whileTap={!submitted ? { scale: 0.99 } : undefined}
                              disabled={submitted}
                              onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                              className={`flex w-full items-center justify-between rounded border px-4 py-3 text-start text-sm transition-colors ${
                                checked
                                  ? 'border-[#111111] bg-[#F5F5F5] font-medium text-[#111111] dark:border-white dark:bg-[#262626] dark:text-white'
                                  : 'border-[#E7E7E7] text-[#333333] hover:bg-[#F5F5F5] dark:border-[#2A2A2A] dark:text-[#D4D4D4] dark:hover:bg-[#222222]'
                              }`}
                            >
                              <span>{opt[lang]}</span>
                              {submitted && optIdx === q.correctIndex && (
                                <span className="text-xs font-medium text-[#111111] dark:text-white">
                                  {t.lesson.correctLabel}
                                </span>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>

                      <AnimatePresence>
                        {submitted && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: EASE_SETTLE }}
                            className="mt-4 border-t border-[#E7E7E7] pt-3 text-xs text-[#777777] dark:border-[#262626] dark:text-[#A3A3A3]"
                          >
                            <span className="font-semibold text-[#111111] dark:text-white">
                              {isCorrect ? t.lesson.correctLabel : t.lesson.incorrectLabel} ·{' '}
                              {t.lesson.explanationLabel}:{' '}
                            </span>
                            {q.explanation[lang]}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* Part B: 5 Live Coding Questions */}
              {codeQuestions.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-semibold tracking-wide text-[#777777] uppercase dark:text-[#A3A3A3]">
                    {t.lesson.assessmentPartBCode}
                  </h3>

                  {codeQuestions.map((cq, cqIdx) => (
                    <ScrollReveal key={cq.id} delay={cqIdx * 0.04} y={14}>
                      <AssessmentCodeQuestionCard
                        index={lesson.quiz.length + cqIdx + 1}
                        question={cq}
                        value={codeAnswers[cq.id] ?? EMPTY_CODE}
                        result={codeResults[cq.id]}
                        disabled={submitted}
                        resetSignal={assessmentResetNonce}
                        onChange={(nextCode) => {
                          setCodeAnswers((prev) => ({ ...prev, [cq.id]: nextCode }));
                          setCodeResults((prev) => {
                            if (!prev[cq.id]) return prev;
                            const copy = { ...prev };
                            delete copy[cq.id];
                            return copy;
                          });
                        }}
                        onCheck={() => handleCheckCodeQuestion(cq.id)}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              )}

              {!submitted ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#777777] dark:text-[#A3A3A3]">
                    {t.lesson.submitAssessmentNote}
                  </p>
                  <motion.button
                    type="button"
                    whileTap={canSubmitAssessment ? { scale: 0.97 } : undefined}
                    disabled={!canSubmitAssessment}
                    onClick={handleSubmitQuiz}
                    className="inline-flex h-10 shrink-0 items-center rounded bg-[#111111] px-6 text-sm font-medium text-white whitespace-nowrap transition-colors hover:bg-[#2B2B2B] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
                  >
                    {t.lesson.submitQuiz}
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={SPRING_SNAPPY}
                  className="space-y-4"
                >
                  {quizScore >= 70 && (
                    <MilestoneCelebration
                      active
                      triggerKey={`assess-pass-${lesson.id}-${assessmentResetNonce}`}
                      title={t.lesson.passedMessage}
                      subtitle={`${t.lesson.scoreResult}: ${quizScore}% (${totalCorrectCount}/${totalQuestionCount})${
                        lessonToken ? ` · ${t.lesson.tokenMintedToast}: ${lessonToken.tokenCode}` : ''
                      }`}
                    />
                  )}

                  <div className="flex flex-col justify-between gap-4 rounded border border-[#111111] bg-[#F5F5F5] p-5 sm:flex-row sm:items-center dark:border-white dark:bg-[#191919]">
                    <div>
                      <p className="font-mono text-sm font-semibold text-[#111111] tabular-nums dark:text-white">
                        {t.lesson.scoreResult}: <AnimatedNumber value={quizScore} suffix="%" /> (
                        {totalCorrectCount}/{totalQuestionCount} ·{' '}
                        {lang === 'ar'
                          ? `اختيار: ${correctMcqCount}/${lesson.quiz.length} · كود: ${passedCodeCount}/${codeQuestions.length}`
                          : `MCQ: ${correctMcqCount}/${lesson.quiz.length} · Code: ${passedCodeCount}/${codeQuestions.length}`}
                        )
                      </p>
                      <p className="mt-1 text-sm text-[#777777] dark:text-[#A3A3A3]">
                        {quizScore >= 70 ? t.lesson.passedMessage : t.lesson.tryAgainMessage}
                      </p>
                    </div>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        setAnswers({});
                        setCodeAnswers({});
                        setCodeResults({});
                        setSubmitted(false);
                        setAssessmentResetNonce((n) => n + 1);
                      }}
                      className="inline-flex h-9 shrink-0 items-center rounded border border-[#111111] px-4 text-xs font-medium text-[#111111] whitespace-nowrap dark:border-white dark:text-white"
                    >
                      {t.lesson.retakeQuiz}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      )}
      </AnimatePresence>

      {/* Footer Lesson Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-[#E7E7E7] pt-6 dark:border-[#262626]">
        {prevLesson ? (
          <button
            type="button"
            onClick={() => openLesson(prevLesson.id)}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#777777] hover:text-[#111111] dark:text-[#A3A3A3] dark:hover:text-white"
          >
            <BackArrow className="h-4 w-4" aria-hidden="true" />
            <span>{t.lesson.previousLesson}</span>
          </button>
        ) : (
          <span />
        )}

        {nextLesson && (
          <button
            type="button"
            disabled={!isCompleted}
            onClick={() => openLesson(nextLesson.id)}
            className={`inline-flex items-center gap-2 text-sm font-medium ${
              isCompleted
                ? 'text-[#111111] hover:underline dark:text-white'
                : 'cursor-not-allowed text-[#777777] opacity-50 dark:text-[#777777]'
            }`}
          >
            <span>{t.lesson.nextLesson}</span>
            <ForwardArrow className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
