import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Flame, Lock, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { chapters, languages, lessons } from '../data/curriculum';
import {
  AchievementCategory,
  AchievementTier,
  milestoneSpecs,
} from '../data/milestones';
import { digitalTokens } from '../data/tokens';
import { dateKeyToLocalDate } from '../utils/streak';
import { DigitalTokenBadge, TokenMedallionSvg } from './DigitalTokenBadge';
import { MilestoneBadgeCard } from './MilestoneBadge';
import { AnimatedNumber, EASE_SETTLE, ScrollReveal, SPRING_SNAPPY } from './MotionPrimitives';

type TokenStatusFilter = 'all' | 'earned' | 'locked';
type MilestoneCategoryFilter = 'all' | AchievementCategory;

export function DashboardView() {
  const {
    t,
    lang,
    setLang,
    theme,
    setTheme,
    completedLessons,
    earnedTokens,
    earnedAchievements,
    quizScores,
    streakStats,
    openLesson,
    openLanguage,
    isLessonUnlocked,
    isLanguageUnlocked,
    resetProgress,
  } = useApp();

  const prefersReduced = useReducedMotion();
  const [confirmReset, setConfirmReset] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TokenStatusFilter>('all');
  const [trackFilter, setTrackFilter] = useState<string>('all');
  const [milestoneStatusFilter, setMilestoneStatusFilter] = useState<TokenStatusFilter>('all');
  const [milestoneCategoryFilter, setMilestoneCategoryFilter] =
    useState<MilestoneCategoryFilter>('all');
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(() => {
    const firstCompleted = [...completedLessons].reverse()[0];
    return firstCompleted ?? digitalTokens[0]?.id ?? null;
  });

  const DirectionalArrow = lang === 'ar' ? ArrowLeft : ArrowRight;
  const totalLessons = lessons.length;
  const completedCount = completedLessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const earnedSet = useMemo(() => {
    const set = new Set<string>(completedLessons);
    Object.keys(earnedTokens).forEach((id) => set.add(id));
    return set;
  }, [completedLessons, earnedTokens]);

  const earnedCount = digitalTokens.filter((tok) => earnedSet.has(tok.lessonId)).length;
  const lockedCount = digitalTokens.length - earnedCount;

  const scoreValues = Object.values(quizScores);
  const avgScore =
    scoreValues.length > 0
      ? Math.round(scoreValues.reduce((acc, v) => acc + v, 0) / scoreValues.length)
      : 0;

  const nextLesson = lessons.find((l) => !completedLessons.includes(l.id)) ?? null;
  const activeLanguage =
    languages.find(
      (item) => item.id === (nextLesson?.languageId ?? languages[languages.length - 1].id)
    ) ?? languages[0];

  const filteredTokens = useMemo(() => {
    return digitalTokens.filter((tok) => {
      const isEarned = earnedSet.has(tok.lessonId);
      if (statusFilter === 'earned' && !isEarned) return false;
      if (statusFilter === 'locked' && isEarned) return false;
      if (trackFilter !== 'all' && tok.languageId !== trackFilter) return false;
      return true;
    });
  }, [earnedSet, statusFilter, trackFilter]);

  const inspectedToken = useMemo(() => {
    if (!selectedTokenId) return null;
    return digitalTokens.find((tok) => tok.id === selectedTokenId) ?? null;
  }, [selectedTokenId]);

  const inspectedChapter = inspectedToken
    ? chapters.find((ch) => ch.id === inspectedToken.chapterId)
    : null;
  const inspectedEarned = inspectedToken ? earnedSet.has(inspectedToken.lessonId) : false;
  const inspectedRecord = inspectedToken ? earnedTokens[inspectedToken.lessonId] : undefined;
  const inspectedUnlocked = inspectedToken ? isLessonUnlocked(inspectedToken.lessonId) : false;

  const formattedEarnedDate = useMemo(() => {
    if (!inspectedRecord?.earnedAt) return null;
    const parsed = new Date(inspectedRecord.earnedAt);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [inspectedRecord?.earnedAt, lang]);

  const weekdayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
        weekday: 'short',
      }),
    [lang]
  );

  const evaluatedMilestones = useMemo(() => {
    return milestoneSpecs.map((spec) => {
      const evaluated = spec.evaluate({
        completedLessons,
        longestStreak: streakStats.longestStreak,
        currentStreak: streakStats.currentStreak,
      });
      const persisted = earnedAchievements[spec.id];
      const unlocked = evaluated.unlocked || Boolean(persisted);
      return {
        spec,
        progress: {
          current: unlocked ? evaluated.target : evaluated.current,
          target: evaluated.target,
          unlocked,
        },
        earnedAt: persisted?.earnedAt ?? null,
      };
    });
  }, [
    completedLessons,
    streakStats.longestStreak,
    streakStats.currentStreak,
    earnedAchievements,
  ]);

  const unlockedMilestoneCount = evaluatedMilestones.filter((m) => m.progress.unlocked).length;
  const lockedMilestoneCount = evaluatedMilestones.length - unlockedMilestoneCount;

  const filteredMilestones = useMemo(() => {
    return evaluatedMilestones.filter((item) => {
      if (milestoneStatusFilter === 'earned' && !item.progress.unlocked) return false;
      if (milestoneStatusFilter === 'locked' && item.progress.unlocked) return false;
      if (milestoneCategoryFilter !== 'all' && item.spec.category !== milestoneCategoryFilter) {
        return false;
      }
      return true;
    });
  }, [evaluatedMilestones, milestoneStatusFilter, milestoneCategoryFilter]);

  const getTierLabel = (tier: AchievementTier) => {
    switch (tier) {
      case 'bronze':
        return t.dashboard.tierBronze;
      case 'silver':
        return t.dashboard.tierSilver;
      case 'gold':
        return t.dashboard.tierGold;
      case 'apex':
        return t.dashboard.tierApex;
    }
  };

  const getCategoryLabel = (cat: AchievementCategory) => {
    switch (cat) {
      case 'chapter':
        return t.dashboard.milestoneCatChapter;
      case 'track':
        return t.dashboard.milestoneCatTrack;
      case 'series':
        return t.dashboard.milestoneCatSeries;
      case 'streak':
        return t.dashboard.milestoneCatStreak;
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-[#E7E7E7] pb-6 dark:border-[#262626]">
        <h1 className="text-3xl font-bold tracking-tight text-[#111111] dark:text-white">
          {t.dashboard.title}
        </h1>
        <p className="mt-2 text-sm text-[#777777] sm:text-base dark:text-[#A3A3A3]">
          {t.dashboard.subtitle}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.24, ease: EASE_SETTLE }}
          className="rounded border border-[#E7E7E7] bg-white p-5 dark:border-[#262626] dark:bg-[#191919]"
        >
          <p className="text-xs text-[#777777] dark:text-[#A3A3A3]">
            {t.dashboard.overallProgress}
          </p>
          <p className="mt-2 font-mono text-2xl font-bold text-[#111111] tabular-nums dark:text-white">
            <AnimatedNumber value={progressPercent} suffix="%" />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04, duration: 0.24, ease: EASE_SETTLE }}
          className="rounded border border-[#E7E7E7] bg-white p-5 dark:border-[#262626] dark:bg-[#191919]"
        >
          <p className="text-xs text-[#777777] dark:text-[#A3A3A3]">
            {t.dashboard.lessonsCompleted}
          </p>
          <p className="mt-2 font-mono text-2xl font-bold text-[#111111] tabular-nums dark:text-white">
            <AnimatedNumber value={completedCount} /> / {totalLessons}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.24, ease: EASE_SETTLE }}
          className="rounded border border-[#E7E7E7] bg-white p-5 dark:border-[#262626] dark:bg-[#191919]"
        >
          <p className="text-xs text-[#777777] dark:text-[#A3A3A3]">
            {t.dashboard.tokensEarnedKpi}
          </p>
          <p className="mt-2 font-mono text-2xl font-bold text-[#111111] tabular-nums dark:text-white">
            <AnimatedNumber value={earnedCount} /> / {digitalTokens.length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.24, ease: EASE_SETTLE }}
          className="rounded border border-[#E7E7E7] bg-white p-5 dark:border-[#262626] dark:bg-[#191919]"
        >
          <p className="text-xs text-[#777777] dark:text-[#A3A3A3]">{t.dashboard.averageScore}</p>
          <p className="mt-2 font-mono text-2xl font-bold text-[#111111] tabular-nums dark:text-white">
            {scoreValues.length > 0 ? <AnimatedNumber value={avgScore} suffix="%" /> : '—'}
          </p>
        </motion.div>
      </div>

      {/* Daily Streak Counter */}
      <motion.section
        aria-label={t.dashboard.dailyStreakLabel}
        initial={prefersReduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, duration: 0.24, ease: EASE_SETTLE }}
        className="mt-6 rounded border border-[#E7E7E7] bg-white p-5 sm:p-6 dark:border-[#262626] dark:bg-[#191919]"
      >
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          {/* Left: Streak Figure & Unboxed Metadata */}
          <div className="flex items-start gap-4 sm:items-center">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded border transition-colors ${
                streakStats.currentStreak > 0
                  ? 'border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]'
                  : 'border-[#E7E7E7] bg-[#F5F5F5] text-[#777777] dark:border-[#333333] dark:bg-[#141414] dark:text-[#A3A3A3]'
              }`}
            >
              <motion.div
                animate={
                  streakStats.completedToday && !prefersReduced
                    ? { scale: [1, 1.12, 1], y: [0, -1.5, 0] }
                    : undefined
                }
                transition={
                  streakStats.completedToday && !prefersReduced
                    ? {
                        duration: 2.4,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                      }
                    : undefined
                }
              >
                <Flame className="h-5 w-5" aria-hidden="true" />
              </motion.div>
            </div>

            <div className="min-w-0">
              <p className="text-xs text-[#777777] dark:text-[#A3A3A3]">
                {t.dashboard.dailyStreakLabel}
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                <p className="font-mono text-2xl font-bold text-[#111111] tabular-nums dark:text-white">
                  <AnimatedNumber value={streakStats.currentStreak} />
                </p>
                <span className="text-sm font-medium text-[#111111] dark:text-white">
                  {streakStats.currentStreak === 1
                    ? t.dashboard.streakDaySingular
                    : t.dashboard.streakDayPlural}
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-[#777777] dark:text-[#A3A3A3]">
                <span
                  className={
                    streakStats.completedToday
                      ? 'font-medium text-[#111111] dark:text-white'
                      : undefined
                  }
                >
                  {streakStats.completedToday
                    ? t.dashboard.streakTodayDone
                    : streakStats.atRiskToday
                      ? t.dashboard.streakKeepGoing
                      : t.dashboard.streakStartHint}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {t.dashboard.longestStreakLabel}: {streakStats.longestStreak}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {t.dashboard.activeDaysLabel}: {streakStats.totalActiveDays}
                </span>
              </div>
            </div>
          </div>

          {/* Right: 7-Day Activity Strip + Quick Action */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:justify-end">
            <div>
              <p className="mb-2 text-[11px] font-medium text-[#777777] dark:text-[#A3A3A3]">
                {t.dashboard.last7DaysLabel}
              </p>
              <div className="flex items-center gap-2">
                {streakStats.lastSevenDays.map((day, idx) => {
                  const weekdayLabel = day.isToday
                    ? t.dashboard.todayShortLabel
                    : weekdayFormatter.format(dateKeyToLocalDate(day.dateKey));

                  return (
                    <div key={day.dateKey} className="flex flex-col items-center gap-1.5">
                      <motion.div
                        initial={prefersReduced ? false : { scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ ...SPRING_SNAPPY, delay: idx * 0.03 }}
                        title={day.dateKey}
                        aria-label={`${day.dateKey}: ${
                          day.completed ? t.roadmap.statusCompleted : t.roadmap.statusNotStarted
                        }`}
                        className={`flex h-9 w-9 items-center justify-center rounded border text-xs transition-colors ${
                          day.completed
                            ? 'border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]'
                            : day.isToday
                              ? 'border-dashed border-[#111111] bg-[#F5F5F5] text-[#111111] dark:border-white dark:bg-[#141414] dark:text-white'
                              : 'border-[#E7E7E7] bg-[#F5F5F5] text-[#A3A3A3] dark:border-[#262626] dark:bg-[#141414] dark:text-[#666666]'
                        }`}
                      >
                        {day.completed ? (
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <span className="font-mono text-[10px] leading-none" aria-hidden="true">
                            {day.isToday ? '·' : '—'}
                          </span>
                        )}
                      </motion.div>
                      <span
                        className={`text-[11px] whitespace-nowrap ${
                          day.isToday
                            ? 'font-semibold text-[#111111] dark:text-white'
                            : 'text-[#777777] dark:text-[#A3A3A3]'
                        }`}
                      >
                        {weekdayLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {!streakStats.completedToday && nextLesson && (
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => openLesson(nextLesson.id)}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded bg-[#111111] px-4 text-xs font-medium whitespace-nowrap text-white transition-colors hover:bg-[#2B2B2B] dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
              >
                <span>
                  {completedCount === 0
                    ? t.dashboard.startFirstLessonBtn
                    : t.dashboard.continueBtn}
                </span>
                <DirectionalArrow className="h-3.5 w-3.5" aria-hidden="true" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.section>

      {/* Milestone Achievements Showcase Section */}
      <ScrollReveal y={18}>
        <section
          aria-label={t.dashboard.milestonesSectionTitle}
          className="mt-8 rounded border border-[#E7E7E7] bg-white p-6 sm:p-8 dark:border-[#262626] dark:bg-[#191919]"
        >
          <div className="flex flex-col justify-between gap-4 border-b border-[#E7E7E7] pb-5 md:flex-row md:items-end dark:border-[#262626]">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight text-[#111111] dark:text-white">
                  {t.dashboard.milestonesSectionTitle}
                </h2>
                <span className="font-mono text-xs font-semibold text-[#777777] tabular-nums dark:text-[#A3A3A3]">
                  <AnimatedNumber value={unlockedMilestoneCount} /> / {milestoneSpecs.length}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-[#777777] dark:text-[#A3A3A3]">
                {t.dashboard.milestonesSectionDesc}
              </p>
            </div>

            {/* Milestone Status Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'all', label: t.dashboard.milestoneAll, count: milestoneSpecs.length },
                  { id: 'earned', label: t.dashboard.milestoneUnlocked, count: unlockedMilestoneCount },
                  { id: 'locked', label: t.dashboard.milestoneInProgress, count: lockedMilestoneCount },
                ] as const
              ).map((btn) => {
                const active = milestoneStatusFilter === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setMilestoneStatusFilter(btn.id)}
                    className={`inline-flex h-8 items-center gap-1.5 rounded border px-3 text-xs font-medium transition-colors ${
                      active
                        ? 'border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]'
                        : 'border-[#E7E7E7] bg-white text-[#777777] hover:text-[#111111] dark:border-[#333333] dark:bg-[#141414] dark:text-[#A3A3A3] dark:hover:text-white'
                    }`}
                  >
                    <span>{btn.label}</span>
                    <span className="font-mono tabular-nums opacity-80">({btn.count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {(
              [
                { id: 'all', label: t.dashboard.milestoneCatAll },
                { id: 'chapter', label: t.dashboard.milestoneCatChapter },
                { id: 'series', label: t.dashboard.milestoneCatSeries },
                { id: 'track', label: t.dashboard.milestoneCatTrack },
                { id: 'streak', label: t.dashboard.milestoneCatStreak },
              ] as const
            ).map((cat) => {
              const active = milestoneCategoryFilter === cat.id;
              const catUnlocked =
                cat.id === 'all'
                  ? unlockedMilestoneCount
                  : evaluatedMilestones.filter(
                      (m) => m.spec.category === cat.id && m.progress.unlocked
                    ).length;
              const catTotal =
                cat.id === 'all'
                  ? evaluatedMilestones.length
                  : evaluatedMilestones.filter((m) => m.spec.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setMilestoneCategoryFilter(cat.id)}
                  className={`inline-flex h-7 items-center gap-1.5 rounded border px-2.5 text-xs font-medium transition-colors ${
                    active
                      ? 'border-[#111111] bg-[#F5F5F5] text-[#111111] dark:border-white dark:bg-[#262626] dark:text-white'
                      : 'border-transparent text-[#777777] hover:text-[#111111] dark:text-[#A3A3A3] dark:hover:text-white'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="font-mono text-[11px] tabular-nums opacity-75">
                    {catUnlocked}/{catTotal}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredMilestones.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredMilestones.map((item, idx) => {
                const canJumpLesson =
                  item.spec.targetLessonId && isLessonUnlocked(item.spec.targetLessonId);
                const canJumpLang =
                  !canJumpLesson &&
                  item.spec.targetLanguageId &&
                  isLanguageUnlocked(item.spec.targetLanguageId);
                const canJump = Boolean(canJumpLesson || canJumpLang);

                return (
                  <MilestoneBadgeCard
                    key={item.spec.id}
                    spec={item.spec}
                    progress={item.progress}
                    index={idx}
                    lang={lang}
                    tierLabel={getTierLabel(item.spec.tier)}
                    categoryLabel={getCategoryLabel(item.spec.category)}
                    earnedLabel={t.dashboard.milestoneEarnedLabel}
                    lockedLabel={t.dashboard.milestoneLockedLabel}
                    earnedAt={item.earnedAt}
                    canJump={canJump}
                    jumpLabel={
                      canJumpLesson ? t.dashboard.openLessonBtn : t.dashboard.milestoneJumpBtn
                    }
                    onJump={() => {
                      if (canJumpLesson && item.spec.targetLessonId) {
                        openLesson(item.spec.targetLessonId);
                      } else if (canJumpLang && item.spec.targetLanguageId) {
                        openLanguage(item.spec.targetLanguageId);
                      }
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded border border-[#E7E7E7] bg-[#F5F5F5] p-8 text-center dark:border-[#262626] dark:bg-[#141414]">
              <p className="text-sm font-semibold text-[#111111] dark:text-white">
                {t.dashboard.milestoneEmptyTitle}
              </p>
              <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-[#777777] dark:text-[#A3A3A3]">
                {t.dashboard.milestoneEmptyDesc}
              </p>
            </div>
          )}
        </section>
      </ScrollReveal>

      {/* Digital Token Vault Section */}
      <ScrollReveal y={18}>
        <section className="mt-8 rounded border border-[#E7E7E7] bg-white p-6 sm:p-8 dark:border-[#262626] dark:bg-[#191919]">
        <div className="flex flex-col justify-between gap-4 border-b border-[#E7E7E7] pb-5 md:flex-row md:items-end dark:border-[#262626]">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-[#111111] dark:text-white">
                {t.dashboard.tokensSectionTitle}
              </h2>
              <span className="font-mono text-xs font-semibold text-[#777777] tabular-nums dark:text-[#A3A3A3]">
                <AnimatedNumber value={earnedCount} /> / {digitalTokens.length}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-[#777777] dark:text-[#A3A3A3]">
              {t.dashboard.tokensSectionDesc}
            </p>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: t.dashboard.filterAll, count: digitalTokens.length },
                { id: 'earned', label: t.dashboard.filterEarned, count: earnedCount },
                { id: 'locked', label: t.dashboard.filterLocked, count: lockedCount },
              ] as const
            ).map((btn) => {
              const active = statusFilter === btn.id;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setStatusFilter(btn.id)}
                  className={`inline-flex h-8 items-center gap-1.5 rounded border px-3 text-xs font-medium transition-colors ${
                    active
                      ? 'border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]'
                      : 'border-[#E7E7E7] bg-white text-[#777777] hover:text-[#111111] dark:border-[#333333] dark:bg-[#141414] dark:text-[#A3A3A3] dark:hover:text-white'
                  }`}
                >
                  <span>{btn.label}</span>
                  <span className="font-mono tabular-nums opacity-80">({btn.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Track Filter Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTrackFilter('all')}
            className={`h-7 rounded border px-2.5 text-xs font-medium transition-colors ${
              trackFilter === 'all'
                ? 'border-[#111111] bg-[#F5F5F5] text-[#111111] dark:border-white dark:bg-[#262626] dark:text-white'
                : 'border-transparent text-[#777777] hover:text-[#111111] dark:text-[#A3A3A3] dark:hover:text-white'
            }`}
          >
            {t.dashboard.trackAll}
          </button>
          {languages.map((track) => {
            const active = trackFilter === track.id;
            const trackTotal = digitalTokens.filter((tok) => tok.languageId === track.id).length;
            const trackEarned = digitalTokens.filter(
              (tok) => tok.languageId === track.id && earnedSet.has(tok.lessonId)
            ).length;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => setTrackFilter(track.id)}
                className={`inline-flex h-7 items-center gap-1.5 rounded border px-2.5 text-xs font-medium transition-colors ${
                  active
                    ? 'border-[#111111] bg-[#F5F5F5] text-[#111111] dark:border-white dark:bg-[#262626] dark:text-white'
                    : 'border-transparent text-[#777777] hover:text-[#111111] dark:text-[#A3A3A3] dark:hover:text-white'
                }`}
              >
                <span>{track.title[lang]}</span>
                <span className="font-mono text-[11px] tabular-nums opacity-75">
                  {trackEarned}/{trackTotal}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Token Inspector Panel */}
        <AnimatePresence mode="wait">
          {inspectedToken && (
            <motion.div
              key={inspectedToken.id}
              initial={prefersReduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: EASE_SETTLE }}
              className="mt-6 rounded border border-[#E7E7E7] bg-[#F5F5F5] p-5 sm:p-6 dark:border-[#262626] dark:bg-[#141414]"
            >
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                  {/* Enlarged Medallion Preview (Floats when earned) */}
                  <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded border border-[#E7E7E7] bg-white dark:border-[#262626] dark:bg-[#191919]">
                    {inspectedEarned ? (
                      <motion.div
                        className="text-[#111111] dark:text-white"
                        animate={
                          prefersReduced
                            ? undefined
                            : { y: [0, -6, 0], rotate: [0, 0.8, 0, -0.8, 0] }
                        }
                        transition={
                          prefersReduced
                            ? undefined
                            : {
                                duration: 3.4,
                                repeat: Infinity,
                                repeatType: 'mirror',
                                ease: 'easeInOut',
                              }
                        }
                      >
                        <TokenMedallionSvg
                          spec={inspectedToken}
                          earned
                          className="h-20 w-20"
                        />
                      </motion.div>
                    ) : (
                      <div className="text-[#777777] dark:text-[#666666]">
                        <TokenMedallionSvg
                          spec={inspectedToken}
                          earned={false}
                          className="h-20 w-20"
                        />
                      </div>
                    )}
                  </div>

                  {/* Token Metadata (Zero-Pill Inline Layout) */}
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#777777] dark:text-[#A3A3A3]">
                      <span className="font-mono font-semibold text-[#111111] tabular-nums dark:text-white">
                        {inspectedToken.tokenCode}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{inspectedToken.languageTitle[lang]}</span>
                      {inspectedChapter && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>
                            {t.roadmap.chapterLabel} {inspectedChapter.number}
                          </span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span className="code-ltr font-mono">{inspectedToken.tagLabel}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-[#111111] dark:text-white">
                      {inspectedToken.title[lang]}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {inspectedEarned ? (
                        <span className="inline-flex items-center gap-1.5 font-medium text-[#111111] dark:text-white">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{t.dashboard.tokenMintedLabel}</span>
                          {formattedEarnedDate && (
                            <span className="font-normal text-[#777777] dark:text-[#A3A3A3]">
                              · {t.dashboard.earnedOnLabel} {formattedEarnedDate}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[#777777] dark:text-[#A3A3A3]">
                          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{t.dashboard.unlockRequirementLabel}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inspector Actions */}
                <div className="flex w-full shrink-0 items-center justify-between gap-2 sm:w-auto sm:justify-end">
                  {inspectedUnlocked ? (
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => openLesson(inspectedToken.lessonId)}
                      className="inline-flex h-9 items-center gap-1.5 rounded bg-[#111111] px-4 text-xs font-medium text-white transition-colors hover:bg-[#2B2B2B] dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
                    >
                      <span>
                        {inspectedEarned ? t.dashboard.reviewLessonBtn : t.dashboard.openLessonBtn}
                      </span>
                      <DirectionalArrow className="h-3.5 w-3.5" aria-hidden="true" />
                    </motion.button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#777777] dark:text-[#A3A3A3]">
                      <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{t.dashboard.lockedPrevHint}</span>
                    </span>
                  )}

                  <button
                    type="button"
                    aria-label={t.dashboard.cancelBtn}
                    onClick={() => setSelectedTokenId(null)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded border border-[#E7E7E7] bg-white text-[#777777] transition-colors hover:text-[#111111] dark:border-[#333333] dark:bg-[#191919] dark:text-[#A3A3A3] dark:hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Token Grid */}
        {filteredTokens.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filteredTokens.map((spec, idx) => (
              <DigitalTokenBadge
                key={spec.id}
                spec={spec}
                index={idx}
                earned={earnedSet.has(spec.lessonId)}
                selected={selectedTokenId === spec.id}
                lang={lang}
                mintedLabel={t.dashboard.tokenMintedLabel}
                lockedLabel={t.dashboard.tokenLockedLabel}
                onSelect={() =>
                  setSelectedTokenId((cur) => (cur === spec.id ? null : spec.id))
                }
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded border border-[#E7E7E7] bg-[#F5F5F5] p-8 text-center dark:border-[#262626] dark:bg-[#141414]">
            <p className="text-sm font-semibold text-[#111111] dark:text-white">
              {t.dashboard.emptyEarnedTitle}
            </p>
            <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-[#777777] dark:text-[#A3A3A3]">
              {t.dashboard.emptyEarnedDesc}
            </p>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => openLesson(lessons[0].id)}
              className="mt-4 inline-flex h-9 items-center gap-1.5 rounded bg-[#111111] px-4 text-xs font-medium text-white transition-colors hover:bg-[#2B2B2B] dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
            >
              <span>{t.dashboard.startFirstLessonBtn}</span>
              <DirectionalArrow className="h-3.5 w-3.5" aria-hidden="true" />
            </motion.button>
          </div>
        )}
        </section>
      </ScrollReveal>

      {/* Main 2-Column Content */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Next Lesson & Language Breakdown */}
        <div className="space-y-8 lg:col-span-7">
          <ScrollReveal>
            <section className="rounded border border-[#E7E7E7] bg-[#F5F5F5] p-6 dark:border-[#262626] dark:bg-[#191919]">
            <p className="text-xs font-medium text-[#777777] dark:text-[#A3A3A3]">
              {t.dashboard.nextUpTitle} · {t.dashboard.currentTrack}: {activeLanguage.title[lang]}
            </p>
            {nextLesson ? (
              <>
                <h2 className="mt-2 text-xl font-semibold text-[#111111] dark:text-white">
                  {nextLesson.title[lang]}
                </h2>
                <p className="mt-2 text-sm text-[#777777] dark:text-[#A3A3A3]">
                  {nextLesson.summary[lang]}
                </p>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => openLesson(nextLesson.id)}
                  className="mt-5 inline-flex h-10 items-center gap-2 rounded bg-[#111111] px-5 text-sm font-medium text-white transition-colors hover:bg-[#2B2B2B] dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
                >
                  <span>{t.dashboard.continueBtn}</span>
                  <DirectionalArrow className="h-4 w-4" aria-hidden="true" />
                </motion.button>
              </>
            ) : (
              <>
                <h2 className="mt-2 text-xl font-semibold text-[#111111] dark:text-white">
                  {t.dashboard.allCompletedTitle}
                </h2>
                <p className="mt-2 text-sm text-[#777777] dark:text-[#A3A3A3]">
                  {t.dashboard.allCompletedDesc}
                </p>
              </>
            )}
            </section>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <section>
              <h2 className="text-lg font-semibold text-[#111111] dark:text-white">
                {t.dashboard.trackBreakdown}
              </h2>
              <div className="mt-4 divide-y divide-[#E7E7E7] rounded border border-[#E7E7E7] bg-white dark:divide-[#262626] dark:border-[#262626] dark:bg-[#191919]">
                {languages.map((item, idx) => {
                  const itemLessons = lessons.filter((l) => l.languageId === item.id);
                  const done = itemLessons.filter((l) => completedLessons.includes(l.id)).length;
                  const pct =
                    itemLessons.length > 0 ? Math.round((done / itemLessons.length) * 100) : 0;
                  return (
                    <div key={item.id} className="p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-[#111111] dark:text-white">
                          {item.number}. {item.title[lang]}
                        </span>
                        <span className="font-mono text-xs text-[#777777] tabular-nums dark:text-[#A3A3A3]">
                          {done}/{itemLessons.length} ({pct}%)
                        </span>
                      </div>
                      <div className="mt-2.5 h-1.5 w-full overflow-hidden bg-[#F5F5F5] dark:bg-[#262626]">
                        <motion.div
                          className="h-full w-full origin-left bg-[#111111] rtl:origin-right dark:bg-white"
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: pct / 100 }}
                          viewport={{ once: true, amount: 'some' }}
                          transition={{ ...SPRING_SNAPPY, delay: idx * 0.05 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </ScrollReveal>
        </div>

        {/* Right: Preferences / Settings */}
        <div className="lg:col-span-5">
          <ScrollReveal delay={0.08}>
            <section className="rounded border border-[#E7E7E7] bg-white p-6 dark:border-[#262626] dark:bg-[#191919]">
            <h2 className="text-lg font-semibold text-[#111111] dark:text-white">
              {t.dashboard.settingsTitle}
            </h2>
            <p className="mt-1 text-xs text-[#777777] dark:text-[#A3A3A3]">
              {t.dashboard.settingsDesc}
            </p>

            {/* Language Preference */}
            <div className="mt-6 border-t border-[#E7E7E7] pt-5 dark:border-[#262626]">
              <p className="text-sm font-medium text-[#111111] dark:text-white">
                {t.dashboard.languageLabel}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`h-9 rounded border text-xs font-medium transition-colors ${
                    lang === 'en'
                      ? 'border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]'
                      : 'border-[#E7E7E7] text-[#777777] hover:text-[#111111] dark:border-[#333333] dark:text-[#A3A3A3] dark:hover:text-white'
                  }`}
                >
                  {t.language.english} (LTR)
                </button>
                <button
                  type="button"
                  onClick={() => setLang('ar')}
                  className={`h-9 rounded border text-xs font-medium transition-colors ${
                    lang === 'ar'
                      ? 'border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]'
                      : 'border-[#E7E7E7] text-[#777777] hover:text-[#111111] dark:border-[#333333] dark:text-[#A3A3A3] dark:hover:text-white'
                  }`}
                >
                  {t.language.arabic} (RTL)
                </button>
              </div>
            </div>

            {/* Theme Preference */}
            <div className="mt-6 border-t border-[#E7E7E7] pt-5 dark:border-[#262626]">
              <p className="text-sm font-medium text-[#111111] dark:text-white">
                {t.dashboard.appearanceLabel}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`h-9 rounded border text-xs font-medium transition-colors ${
                    theme === 'light'
                      ? 'border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]'
                      : 'border-[#E7E7E7] text-[#777777] hover:text-[#111111] dark:border-[#333333] dark:text-[#A3A3A3] dark:hover:text-white'
                  }`}
                >
                  {t.theme.light}
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`h-9 rounded border text-xs font-medium transition-colors ${
                    theme === 'dark'
                      ? 'border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]'
                      : 'border-[#E7E7E7] text-[#777777] hover:text-[#111111] dark:border-[#333333] dark:text-[#A3A3A3] dark:hover:text-white'
                  }`}
                >
                  {t.theme.dark}
                </button>
              </div>
            </div>

            {/* Reset Progress */}
            <div className="mt-6 border-t border-[#E7E7E7] pt-5 dark:border-[#262626]">
              <p className="text-sm font-medium text-[#111111] dark:text-white">
                {t.dashboard.resetProgressLabel}
              </p>
              <AnimatePresence mode="wait">
                {!confirmReset ? (
                  <motion.button
                    key="reset-btn"
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => setConfirmReset(true)}
                    className="mt-3 inline-flex h-9 items-center rounded border border-[#E7E7E7] px-4 text-xs font-medium text-[#777777] hover:border-[#111111] hover:text-[#111111] dark:border-[#333333] dark:text-[#A3A3A3] dark:hover:border-white dark:hover:text-white"
                  >
                    {t.dashboard.resetProgressBtn}
                  </motion.button>
                ) : (
                  <motion.div
                    key="reset-confirm"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: EASE_SETTLE }}
                    className="mt-3 space-y-3 rounded border border-[#E7E7E7] bg-[#F5F5F5] p-3 dark:border-[#333333] dark:bg-[#111111]"
                  >
                    <p className="text-xs text-[#333333] dark:text-[#D4D4D4]">
                      {t.dashboard.resetConfirmText}
                    </p>
                    <div className="flex items-center gap-2">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          resetProgress();
                          setConfirmReset(false);
                          setStatusFilter('all');
                          setTrackFilter('all');
                          setMilestoneStatusFilter('all');
                          setMilestoneCategoryFilter('all');
                          setSelectedTokenId(digitalTokens[0]?.id ?? null);
                        }}
                        className="h-8 rounded bg-[#111111] px-3 text-xs font-medium text-white dark:bg-white dark:text-[#111111]"
                      >
                        {t.dashboard.confirmResetBtn}
                      </motion.button>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setConfirmReset(false)}
                        className="h-8 rounded border border-[#E7E7E7] px-3 text-xs text-[#777777] dark:border-[#333333] dark:text-[#A3A3A3]"
                      >
                        {t.dashboard.cancelBtn}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
