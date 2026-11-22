import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Layers, Lock } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { chapters, languages, lessons } from '../data/curriculum';
import { AnimatedNumber, EASE_SETTLE, SPRING_SNAPPY } from './MotionPrimitives';

export function RoadmapView() {
  const {
    t,
    lang,
    selectedLanguageId,
    setSelectedLanguageId,
    openLanguage,
    isLanguageUnlocked,
    completedLessons,
    quizScores,
    openLesson,
    isLessonUnlocked,
  } = useApp();

  const DirectionalArrow = lang === 'ar' ? ArrowLeft : ArrowRight;
  const BackArrow = lang === 'ar' ? ArrowRight : ArrowLeft;

  const activeLanguage = languages.find((item) => item.id === selectedLanguageId) ?? null;
  const langChapters = activeLanguage
    ? chapters.filter((ch) => ch.languageId === activeLanguage.id)
    : [];
  const langLessons = activeLanguage
    ? lessons.filter((l) => l.languageId === activeLanguage.id)
    : [];

  // Determine the lesson & chapter the student is currently on
  const currentLesson =
    langLessons.find((l) => !completedLessons.includes(l.id)) ??
    langLessons[langLessons.length - 1] ??
    null;
  const currentChapter = currentLesson
    ? langChapters.find((ch) => ch.id === currentLesson.chapterId) ?? null
    : null;

  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(
    currentChapter?.id ?? null
  );

  // Auto-expand the active chapter when entering a language
  useEffect(() => {
    if (currentChapter) {
      setExpandedChapterId(currentChapter.id);
    } else if (langChapters.length > 0) {
      setExpandedChapterId(langChapters[0].id);
    }
  }, [selectedLanguageId, currentChapter?.id]);

  // ==============================================================
  // STAGE 1: LANGUAGE NAMES ROADMAP ONLY
  // ==============================================================
  if (!activeLanguage) {
    const totalLessons = lessons.length;
    const completedCount = completedLessons.length;
    const overallPercent = Math.round((completedCount / totalLessons) * 100);

    return (
      <div className="mx-auto max-w-[960px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-[#E7E7E7] pb-8 md:flex-row md:items-end dark:border-[#262626]">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#111111] dark:text-white">
              {t.roadmap.title}
            </h1>
            <p className="mt-2 text-sm text-[#777777] sm:text-base dark:text-[#A3A3A3]">
              {t.roadmap.languagesSubtitle}
            </p>
          </div>

          <div className="w-full md:w-64">
            <div className="flex items-center justify-between text-xs text-[#777777] dark:text-[#A3A3A3]">
              <span>{t.roadmap.progressLabel}</span>
              <span className="font-mono tabular-nums text-[#111111] dark:text-white">
                <AnimatedNumber value={overallPercent} suffix="%" />
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden bg-[#F5F5F5] dark:bg-[#262626]">
              <motion.div
                className="h-full bg-[#111111] dark:bg-white"
                initial={{ width: '0%' }}
                animate={{ width: `${overallPercent}%` }}
                transition={SPRING_SNAPPY}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 divide-y divide-[#E7E7E7] rounded border border-[#E7E7E7] bg-white dark:divide-[#262626] dark:border-[#262626] dark:bg-[#191919]">
          {languages.map((item, idx) => {
            const unlocked = isLanguageUnlocked(item.id);
            const itemLessons = lessons.filter((l) => l.languageId === item.id);
            const itemDone = itemLessons.filter((l) => completedLessons.includes(l.id)).length;
            const isComplete = itemLessons.length > 0 && itemDone === itemLessons.length;

            return (
              <motion.button
                key={item.id}
                type="button"
                disabled={!unlocked}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{ delay: idx * 0.04, duration: 0.26, ease: EASE_SETTLE }}
                whileHover={unlocked ? { x: lang === 'ar' ? -4 : 4 } : undefined}
                whileTap={unlocked ? { scale: 0.995 } : undefined}
                onClick={() => openLanguage(item.id)}
                className={`flex w-full items-center justify-between gap-4 px-6 py-6 text-start transition-colors ${
                  unlocked
                    ? 'hover:bg-[#F5F5F5] dark:hover:bg-[#222222]'
                    : 'cursor-not-allowed opacity-55'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded border font-mono text-xs tabular-nums ${
                      isComplete
                        ? 'border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]'
                        : 'border-[#E7E7E7] text-[#111111] dark:border-[#333333] dark:text-white'
                    }`}
                  >
                    {isComplete ? (
                      <Check className="h-4 w-4" />
                    ) : !unlocked ? (
                      <Lock className="h-3.5 w-3.5" />
                    ) : (
                      item.number
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-[#111111] dark:text-white">
                      {item.title[lang]}
                    </h2>
                    {!unlocked && (
                      <p className="mt-1 text-xs text-[#777777] dark:text-[#A3A3A3]">
                        {t.roadmap.unlockLanguageHint}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 text-xs font-medium text-[#111111] dark:text-white">
                  {unlocked ? (
                    <>
                      <span>{t.roadmap.openLanguage}</span>
                      <DirectionalArrow className="h-4 w-4" aria-hidden="true" />
                    </>
                  ) : (
                    <span className="text-[#777777] dark:text-[#A3A3A3]">
                      {t.roadmap.lockedBtn}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // ==============================================================
  // STAGE 2: SELECTED LANGUAGE CHAPTERS + CONTINUE WHERE YOU STOPPED
  // ==============================================================
  const langDoneCount = langLessons.filter((l) => completedLessons.includes(l.id)).length;
  const langPercent =
    langLessons.length > 0 ? Math.round((langDoneCount / langLessons.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-[1040px] px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Back to Languages */}
      <div className="border-b border-[#E7E7E7] pb-5 dark:border-[#262626]">
        <button
          type="button"
          onClick={() => setSelectedLanguageId(null)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#777777] hover:text-[#111111] dark:text-[#A3A3A3] dark:hover:text-white"
        >
          <BackArrow className="h-4 w-4" aria-hidden="true" />
          <span>{t.roadmap.backToLanguages}</span>
        </button>

        <div className="mt-5 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#111111] dark:text-white">
              {activeLanguage.title[lang]}
            </h1>
            <p className="mt-2 text-sm text-[#777777] sm:text-base dark:text-[#A3A3A3]">
              {activeLanguage.description[lang]}
            </p>
          </div>

          <div className="w-full md:w-64">
            <div className="flex items-center justify-between text-xs text-[#777777] dark:text-[#A3A3A3]">
              <span>{t.roadmap.progressLabel}</span>
              <span className="font-mono tabular-nums text-[#111111] dark:text-white">
                {langDoneCount} / {langLessons.length} (<AnimatedNumber value={langPercent} suffix="%" />)
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden bg-[#F5F5F5] dark:bg-[#262626]">
              <motion.div
                className="h-full bg-[#111111] dark:bg-white"
                initial={{ width: '0%' }}
                animate={{ width: `${langPercent}%` }}
                transition={SPRING_SNAPPY}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resume Current Chapter & Lesson Banner */}
      {currentChapter && currentLesson && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: EASE_SETTLE }}
          className="mt-8 flex flex-col justify-between gap-4 rounded border border-[#111111] bg-[#F5F5F5] p-6 sm:flex-row sm:items-center dark:border-white dark:bg-[#191919]"
        >
          <div>
            <p className="text-xs font-medium text-[#777777] dark:text-[#A3A3A3]">
              {t.roadmap.resumeTitle} · {t.roadmap.chapterLabel} {currentChapter.number}
              {currentLesson.isReview ? ` · ${t.roadmap.reviewCheckpoint}` : ''}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[#111111] dark:text-white">
              {currentChapter.title[lang]} — {currentLesson.title[lang]}
            </h2>
            {currentLesson.tags && currentLesson.tags.length > 0 && (
              <p className="code-ltr mt-1.5 font-mono text-xs text-[#777777] dark:text-[#A3A3A3]">
                {currentLesson.tags.slice(0, 4).join('  ')}
                {currentLesson.tags.length > 4 ? ' ...' : ''}
              </p>
            )}
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => openLesson(currentLesson.id)}
            className="inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded bg-[#111111] px-5 text-sm font-medium text-white transition-colors hover:bg-[#2B2B2B] dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
          >
            <span>{t.roadmap.resumeAction}</span>
            <DirectionalArrow className="h-4 w-4" aria-hidden="true" />
          </motion.button>
        </motion.div>
      )}

      {/* Chapters List */}
      <div className="mt-8 space-y-4">
        {langChapters.map((chapter, chIdx) => {
          const chLessons = langLessons.filter((l) => l.chapterId === chapter.id);
          const chDone = chLessons.filter((l) => completedLessons.includes(l.id)).length;
          const isChComplete = chLessons.length > 0 && chDone === chLessons.length;
          const isChUnlocked = chLessons.some((l) => isLessonUnlocked(l.id));
          const isExpanded = expandedChapterId === chapter.id;

          return (
            <motion.section
              key={chapter.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ delay: Math.min((chIdx % 4) * 0.04, 0.16), duration: 0.28, ease: EASE_SETTLE }}
              className={`overflow-hidden rounded border border-[#E7E7E7] bg-white dark:border-[#262626] dark:bg-[#191919] ${
                !isChUnlocked ? 'opacity-65' : ''
              }`}
            >
              {/* Chapter Accordion Header */}
              <button
                type="button"
                onClick={() => setExpandedChapterId(isExpanded ? null : chapter.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start transition-colors hover:bg-[#F5F5F5] dark:hover:bg-[#222222]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border font-mono text-xs tabular-nums ${
                      isChComplete
                        ? 'border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]'
                        : 'border-[#E7E7E7] text-[#777777] dark:border-[#333333] dark:text-[#A3A3A3]'
                    }`}
                  >
                    {isChComplete ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : !isChUnlocked ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      chapter.number
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-[#111111] dark:text-white">
                      {t.roadmap.chapterLabel} {chapter.number}: {chapter.title[lang]}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#777777] dark:text-[#A3A3A3]">
                      {chapter.description[lang]}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 text-xs text-[#777777] dark:text-[#A3A3A3]">
                  <span className="font-mono tabular-nums">
                    {chDone}/{chLessons.length}
                  </span>
                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={SPRING_SNAPPY}
                    className="inline-flex"
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </motion.span>
                </div>
              </button>

              {/* Chapter Lessons Accordion */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.24, ease: EASE_SETTLE }}
                    className="overflow-hidden border-t border-[#E7E7E7] dark:border-[#262626]"
                  >
                    <div className="divide-y divide-[#E7E7E7] dark:divide-[#262626]">
                      {chLessons.map((lesson, idx) => {
                        const isDone = completedLessons.includes(lesson.id);
                        const unlocked = isLessonUnlocked(lesson.id);
                        const isCurrent = currentLesson?.id === lesson.id && unlocked;
                        const score = quizScores[lesson.id];

                        return (
                          <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03, duration: 0.18, ease: EASE_SETTLE }}
                            className={`flex flex-col justify-between gap-4 px-5 py-4 sm:flex-row sm:items-center ${
                              lesson.isReview ? 'bg-[#FAFAFA] dark:bg-[#161616]' : ''
                            } ${!unlocked ? 'opacity-55' : ''}`}
                          >
                            <div className="flex items-start gap-3.5">
                              <div
                                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border font-mono text-[11px] tabular-nums ${
                                  isDone
                                    ? 'border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]'
                                    : lesson.isReview
                                      ? 'border-[#111111] text-[#111111] dark:border-[#666666] dark:text-white'
                                      : 'border-[#E7E7E7] text-[#777777] dark:border-[#333333] dark:text-[#A3A3A3]'
                                }`}
                              >
                                {isDone ? (
                                  <Check className="h-3 w-3" />
                                ) : !unlocked ? (
                                  <Lock className="h-3 w-3" />
                                ) : lesson.isReview ? (
                                  <Layers className="h-3 w-3" aria-hidden="true" />
                                ) : (
                                  `0${idx + 1}`.slice(-2)
                                )}
                              </div>

                              <div>
                                <h4 className="text-sm font-semibold text-[#111111] dark:text-white">
                                  {lesson.title[lang]}
                                </h4>
                                {lesson.tags && lesson.tags.length > 0 && (
                                  <p className="code-ltr mt-1 font-mono text-xs text-[#777777] dark:text-[#A3A3A3]">
                                    {lesson.tags.slice(0, 6).join('  ')}
                                    {lesson.tags.length > 6 ? `  (+${lesson.tags.length - 6})` : ''}
                                  </p>
                                )}
                                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-[#777777] dark:text-[#A3A3A3]">
                                  {lesson.isReview && (
                                    <>
                                      <span className="font-medium text-[#111111] dark:text-white">
                                        {t.roadmap.reviewCheckpoint}
                                      </span>
                                      <span aria-hidden="true">·</span>
                                    </>
                                  )}
                                  <span className="tabular-nums">
                                    {lesson.durationMinutes} {t.roadmap.minutes}
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-medium text-[#111111] dark:text-white">
                                    {isDone
                                      ? t.roadmap.statusCompleted
                                      : !unlocked
                                        ? t.roadmap.statusLocked
                                        : isCurrent
                                          ? t.roadmap.statusInProgress
                                          : t.roadmap.statusNotStarted}
                                  </span>
                                  {score !== undefined && (
                                    <>
                                      <span aria-hidden="true">·</span>
                                      <span className="font-mono tabular-nums">
                                        {t.roadmap.quizScore}: {score}%
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {unlocked ? (
                              <motion.button
                                type="button"
                                whileTap={{ scale: 0.96 }}
                                onClick={() => openLesson(lesson.id)}
                                className={`inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded px-4 text-xs font-medium transition-colors ${
                                  isCurrent
                                    ? 'bg-[#111111] text-white hover:bg-[#2B2B2B] dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]'
                                    : 'border border-[#E7E7E7] bg-white text-[#111111] hover:bg-[#F5F5F5] dark:border-[#333333] dark:bg-[#111111] dark:text-white dark:hover:bg-[#222222]'
                                }`}
                              >
                                <span>{isDone ? t.roadmap.reviewLesson : t.roadmap.openLesson}</span>
                                <DirectionalArrow className="h-3.5 w-3.5" aria-hidden="true" />
                              </motion.button>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className="inline-flex h-9 shrink-0 cursor-not-allowed items-center gap-1.5 whitespace-nowrap rounded border border-[#E7E7E7] bg-[#F5F5F5] px-4 text-xs font-medium text-[#777777] dark:border-[#2A2A2A] dark:bg-[#141414]"
                              >
                                <Lock className="h-3 w-3" aria-hidden="true" />
                                <span>{t.roadmap.lockedBtn}</span>
                              </button>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
