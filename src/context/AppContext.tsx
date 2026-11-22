import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppView, Language, Theme, translations, Translations } from '../i18n/translations';
import { languages, lessons, PlaygroundStarter, playgroundTemplates } from '../data/curriculum';
import {
  computeQualifiedAchievements,
  EarnedAchievementRecord,
} from '../data/milestones';
import { EarnedTokenRecord, getTokenForLesson } from '../data/tokens';
import {
  clearWorkspaceSnapshot,
  LessonTab,
  loadWorkspaceSnapshot,
  ResumableView,
  saveWorkspaceSnapshot,
  WorkspaceProgressPayload,
} from '../utils/progressSync';
import {
  calculateStreakStats,
  getLocalDateKey,
  sanitizeDateList,
  StreakStats,
} from '../utils/streak';

interface AppContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: Translations;
  view: AppView;
  setView: (view: AppView) => void;
  selectedLanguageId: string | null;
  setSelectedLanguageId: (languageId: string | null) => void;
  openLanguage: (languageId: string) => void;
  isLanguageUnlocked: (languageId: string) => boolean;
  activeLessonId: string;
  activeLessonTab: LessonTab;
  setActiveLessonTab: (tab: LessonTab) => void;
  openLesson: (lessonId: string) => void;
  isLessonUnlocked: (lessonId: string) => boolean;
  completedLessons: string[];
  toggleLessonComplete: (lessonId: string) => void;
  markLessonComplete: (lessonId: string) => void;
  readLessons: string[];
  markLessonRead: (lessonId: string) => void;
  isLessonRead: (lessonId: string) => boolean;
  passedExercises: string[];
  markExercisePassed: (lessonId: string) => void;
  isExercisePassed: (lessonId: string) => boolean;
  quizScores: Record<string, number>;
  recordQuizScore: (lessonId: string, scorePercent: number) => void;
  completionDates: string[];
  streakStats: StreakStats;
  earnedTokens: Record<string, EarnedTokenRecord>;
  earnedAchievements: Record<string, EarnedAchievementRecord>;
  playgroundCode: PlaygroundStarter;
  setPlaygroundCode: React.Dispatch<React.SetStateAction<PlaygroundStarter>>;
  savePlaygroundCode: (code?: PlaygroundStarter) => void;
  loadStarterInPlayground: (starter: PlaygroundStarter) => void;
  resetProgress: () => void;
}

const STORAGE_KEYS = {
  lang: 'codepath_lang',
  theme: 'codepath_theme',
  playground: 'codepath_playground_code',
};

function loadPlaygroundCode(): PlaygroundStarter {
  if (typeof window === 'undefined') return playgroundTemplates.card;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.playground);
    return raw ? (JSON.parse(raw) as PlaygroundStarter) : playgroundTemplates.card;
  } catch {
    return playgroundTemplates.card;
  }
}

function isLessonUnlockedWith(lessonId: string, doneList: string[]): boolean {
  const idx = lessons.findIndex((l) => l.id === lessonId);
  if (idx < 0) return false;
  if (idx === 0) return true;
  return doneList.includes(lessons[idx - 1].id);
}

function isLanguageUnlockedWith(languageId: string, doneList: string[]): boolean {
  const idx = languages.findIndex((item) => item.id === languageId);
  if (idx < 0) return false;
  if (idx === 0) return true;
  const prevLang = languages[idx - 1];
  const prevLangLessons = lessons.filter((l) => l.languageId === prevLang.id);
  return prevLangLessons.length > 0 && prevLangLessons.every((l) => doneList.includes(l.id));
}

function createEmptyProgress(): WorkspaceProgressPayload {
  return {
    completedLessons: [],
    readLessons: [],
    passedExercises: [],
    quizScores: {},
    completionDates: [],
    activeLessonId: lessons[0].id,
    selectedLanguageId: null,
    lastView: 'landing',
    activeLessonTab: 'learn',
  };
}

function buildInitialWorkspace() {
  const saved = loadWorkspaceSnapshot();
  if (!saved) {
    return {
      progress: createEmptyProgress(),
      tokens: {} as Record<string, EarnedTokenRecord>,
      achievements: {} as Record<string, EarnedAchievementRecord>,
    };
  }

  const remote = saved.progress;
  const completedLessons = Array.isArray(remote.completedLessons) ? remote.completedLessons : [];
  const readLessons = Array.isArray(remote.readLessons) ? remote.readLessons : [];
  const passedExercises = Array.isArray(remote.passedExercises) ? remote.passedExercises : [];
  const quizScores =
    remote.quizScores && typeof remote.quizScores === 'object' ? remote.quizScores : {};
  const completionDates = sanitizeDateList(remote.completionDates);

  const firstIncomplete =
    lessons.find((l) => !completedLessons.includes(l.id))?.id ?? lessons[0].id;
  const restoredLessonId =
    remote.activeLessonId && isLessonUnlockedWith(remote.activeLessonId, completedLessons)
      ? remote.activeLessonId
      : firstIncomplete;
  const restoredLessonObj = lessons.find((l) => l.id === restoredLessonId) ?? lessons[0];

  let restoredLanguageId: string | null = null;
  if (
    remote.selectedLanguageId &&
    isLanguageUnlockedWith(remote.selectedLanguageId, completedLessons)
  ) {
    restoredLanguageId = remote.selectedLanguageId;
  } else if (remote.lastView === 'lesson') {
    restoredLanguageId = restoredLessonObj.languageId;
  }

  const lessonIsDone = completedLessons.includes(restoredLessonId);
  const lessonIsRead = lessonIsDone || readLessons.includes(restoredLessonId);
  const lessonExPassed = lessonIsDone || passedExercises.includes(restoredLessonId);
  let restoredTab: LessonTab = 'learn';
  if (remote.activeLessonTab === 'assessment' && lessonExPassed) {
    restoredTab = 'assessment';
  } else if (remote.activeLessonTab === 'practice' && lessonIsRead) {
    restoredTab = 'practice';
  }

  const nextTokens: Record<string, EarnedTokenRecord> = { ...(saved.tokens ?? {}) };
  for (const lessonId of completedLessons) {
    if (!nextTokens[lessonId]) {
      const spec = getTokenForLesson(lessonId);
      if (spec) {
        nextTokens[lessonId] = {
          uid: 'local',
          lessonId,
          tokenCode: spec.tokenCode,
          languageId: spec.languageId,
          order: spec.index,
          earnedAt: new Date().toISOString(),
        };
      }
    }
  }

  return {
    progress: {
      completedLessons,
      readLessons,
      passedExercises,
      quizScores,
      completionDates,
      activeLessonId: restoredLessonId,
      selectedLanguageId: restoredLanguageId,
      lastView: remote.lastView ?? 'landing',
      activeLessonTab: restoredTab,
    },
    tokens: nextTokens,
    achievements: saved.achievements ?? {},
  };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const initialRef = useRef<ReturnType<typeof buildInitialWorkspace> | null>(null);
  if (!initialRef.current) {
    initialRef.current = buildInitialWorkspace();
  }
  const initial = initialRef.current;

  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.lang);
    return saved === 'ar' ? 'ar' : 'en';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.theme);
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [view, setViewState] = useState<AppView>(initial.progress.lastView ?? 'landing');
  const [selectedLanguageId, setSelectedLanguageIdState] = useState<string | null>(
    initial.progress.selectedLanguageId ?? null
  );
  const [activeLessonId, setActiveLessonId] = useState<string>(
    initial.progress.activeLessonId ?? lessons[0].id
  );
  const [activeLessonTab, setActiveLessonTabState] = useState<LessonTab>(
    initial.progress.activeLessonTab ?? 'learn'
  );

  const [completedLessons, setCompletedLessons] = useState<string[]>(
    initial.progress.completedLessons
  );
  const [readLessons, setReadLessons] = useState<string[]>(initial.progress.readLessons);
  const [passedExercises, setPassedExercises] = useState<string[]>(
    initial.progress.passedExercises
  );
  const [quizScores, setQuizScores] = useState<Record<string, number>>(initial.progress.quizScores);
  const [earnedTokens, setEarnedTokens] = useState<Record<string, EarnedTokenRecord>>(
    initial.tokens
  );
  const [completionDates, setCompletionDates] = useState<string[]>(
    initial.progress.completionDates
  );
  const [earnedAchievements, setEarnedAchievements] = useState<
    Record<string, EarnedAchievementRecord>
  >(initial.achievements);

  const [todayKey, setTodayKey] = useState<string>(() => getLocalDateKey());
  const [playgroundCode, setPlaygroundCode] = useState<PlaygroundStarter>(loadPlaygroundCode);

  const progressRef = useRef<WorkspaceProgressPayload>(initial.progress);
  progressRef.current = {
    completedLessons,
    readLessons,
    passedExercises,
    quizScores,
    completionDates,
    activeLessonId,
    selectedLanguageId,
    lastView: view,
    activeLessonTab,
  };

  const earnedTokensRef = useRef<Record<string, EarnedTokenRecord>>(earnedTokens);
  earnedTokensRef.current = earnedTokens;

  const earnedAchievementsRef = useRef<Record<string, EarnedAchievementRecord>>(earnedAchievements);
  earnedAchievementsRef.current = earnedAchievements;

  // Normalize old /signin URL if present
  useEffect(() => {
    if (window.location.pathname.replace(/\/+$/, '') === '/signin') {
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // Keep today's local date synced if the tab remains open across midnight
  useEffect(() => {
    const syncDay = () => {
      const next = getLocalDateKey();
      setTodayKey((prev) => (prev === next ? prev : next));
    };
    const intervalId = window.setInterval(syncDay, 60_000);
    window.addEventListener('focus', syncDay);
    document.addEventListener('visibilitychange', syncDay);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', syncDay);
      document.removeEventListener('visibilitychange', syncDay);
    };
  }, []);

  const persistSnapshotNow = (
    nextProgress: WorkspaceProgressPayload,
    nextTokens: Record<string, EarnedTokenRecord> = earnedTokensRef.current,
    nextAchievements: Record<string, EarnedAchievementRecord> = earnedAchievementsRef.current
  ) => {
    saveWorkspaceSnapshot({
      progress: nextProgress,
      tokens: nextTokens,
      achievements: nextAchievements,
    });
  };

  const setView = (nextView: AppView) => {
    setViewState(nextView);
    const nextProgress: WorkspaceProgressPayload = {
      ...progressRef.current,
      lastView: nextView as ResumableView,
    };
    progressRef.current = nextProgress;
    persistSnapshotNow(nextProgress);
  };

  const setSelectedLanguageId = (languageId: string | null) => {
    setSelectedLanguageIdState(languageId);
    const nextProgress: WorkspaceProgressPayload = {
      ...progressRef.current,
      selectedLanguageId: languageId,
    };
    progressRef.current = nextProgress;
    persistSnapshotNow(nextProgress);
  };

  const setActiveLessonTab = (nextTab: LessonTab) => {
    setActiveLessonTabState(nextTab);
    const nextProgress: WorkspaceProgressPayload = {
      ...progressRef.current,
      activeLessonTab: nextTab,
    };
    progressRef.current = nextProgress;
    persistSnapshotNow(nextProgress);
  };

  // Sync language direction and document lang
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem(STORAGE_KEYS.lang, lang);
  }, [lang]);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const streakStats = useMemo(() => {
    void todayKey;
    return calculateStreakStats(completionDates);
  }, [completionDates, todayKey]);

  // Automatically unlock and persist Milestone Achievements when criteria are met
  useEffect(() => {
    const qualified = computeQualifiedAchievements({
      completedLessons,
      longestStreak: streakStats.longestStreak,
      currentStreak: streakStats.currentStreak,
    });

    const newlyUnlocked = qualified.filter((spec) => !earnedAchievementsRef.current[spec.id]);
    if (newlyUnlocked.length === 0) return;

    const nowIso = new Date().toISOString();
    const nextAchievements = { ...earnedAchievementsRef.current };
    for (const spec of newlyUnlocked) {
      if (!nextAchievements[spec.id]) {
        nextAchievements[spec.id] = {
          uid: 'local',
          achievementId: spec.id,
          category: spec.category,
          tier: spec.tier,
          earnedAt: nowIso,
        };
      }
    }

    earnedAchievementsRef.current = nextAchievements;
    setEarnedAchievements(nextAchievements);
    persistSnapshotNow(progressRef.current, earnedTokensRef.current, nextAchievements);
  }, [completedLessons, streakStats.longestStreak, streakStats.currentStreak]);

  const setLang = (next: Language) => setLangState(next);
  const toggleLang = () => setLangState((prev) => (prev === 'en' ? 'ar' : 'en'));
  const setTheme = (next: Theme) => setThemeState(next);
  const toggleTheme = () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));

  const isLanguageUnlocked = (languageId: string) =>
    isLanguageUnlockedWith(languageId, completedLessons);

  const openLanguage = (languageId: string) => {
    if (!isLanguageUnlocked(languageId)) {
      return;
    }
    setSelectedLanguageIdState(languageId);
    setViewState('roadmap');
    const nextProgress: WorkspaceProgressPayload = {
      ...progressRef.current,
      selectedLanguageId: languageId,
      lastView: 'roadmap',
    };
    progressRef.current = nextProgress;
    persistSnapshotNow(nextProgress);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLessonUnlocked = (lessonId: string) =>
    isLessonUnlockedWith(lessonId, completedLessons);

  const openLesson = (lessonId: string) => {
    if (!isLessonUnlocked(lessonId)) {
      return;
    }
    const targetLesson = lessons.find((l) => l.id === lessonId);
    const nextLangId = targetLesson ? targetLesson.languageId : selectedLanguageId;
    const isSameLesson = lessonId === activeLessonId;
    const nextTab: LessonTab = isSameLesson ? activeLessonTab : 'learn';

    if (targetLesson) {
      setSelectedLanguageIdState(targetLesson.languageId);
    }
    setActiveLessonId(lessonId);
    if (!isSameLesson) {
      setActiveLessonTabState('learn');
    }
    setViewState('lesson');
    const nextProgress: WorkspaceProgressPayload = {
      ...progressRef.current,
      selectedLanguageId: nextLangId,
      activeLessonId: lessonId,
      activeLessonTab: nextTab,
      lastView: 'lesson',
    };
    progressRef.current = nextProgress;
    persistSnapshotNow(nextProgress);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mintTokenIntoMap = (
    currentTokens: Record<string, EarnedTokenRecord>,
    lessonId: string
  ): Record<string, EarnedTokenRecord> => {
    if (currentTokens[lessonId]) return currentTokens;
    const spec = getTokenForLesson(lessonId);
    if (!spec) return currentTokens;
    return {
      ...currentTokens,
      [lessonId]: {
        uid: 'local',
        lessonId,
        tokenCode: spec.tokenCode,
        languageId: spec.languageId,
        order: spec.index,
        earnedAt: new Date().toISOString(),
      },
    };
  };

  const revokeTokenFromMap = (
    currentTokens: Record<string, EarnedTokenRecord>,
    lessonId: string
  ): Record<string, EarnedTokenRecord> => {
    if (!currentTokens[lessonId]) return currentTokens;
    const copy = { ...currentTokens };
    delete copy[lessonId];
    return copy;
  };

  const markLessonComplete = (lessonId: string) => {
    const cur = progressRef.current;
    const alreadyDone = cur.completedLessons.includes(lessonId);
    const nextCompleted = alreadyDone ? cur.completedLessons : [...cur.completedLessons, lessonId];
    const currentDayKey = getLocalDateKey();
    const nextDates = !alreadyDone
      ? sanitizeDateList([currentDayKey, ...cur.completionDates])
      : cur.completionDates;
    const nextProgress: WorkspaceProgressPayload = {
      ...cur,
      completedLessons: nextCompleted,
      completionDates: nextDates,
    };
    const nextTokens = mintTokenIntoMap(earnedTokensRef.current, lessonId);

    progressRef.current = nextProgress;
    earnedTokensRef.current = nextTokens;
    setCompletedLessons(nextCompleted);
    if (nextDates !== cur.completionDates) {
      setCompletionDates(nextDates);
    }
    setEarnedTokens(nextTokens);
    persistSnapshotNow(nextProgress, nextTokens);
  };

  const toggleLessonComplete = (lessonId: string) => {
    const cur = progressRef.current;
    const isCurrentlyCompleted = cur.completedLessons.includes(lessonId);
    const nextCompleted = isCurrentlyCompleted
      ? cur.completedLessons.filter((id) => id !== lessonId)
      : [...cur.completedLessons, lessonId];
    const currentDayKey = getLocalDateKey();
    const nextDates = !isCurrentlyCompleted
      ? sanitizeDateList([currentDayKey, ...cur.completionDates])
      : cur.completionDates;

    const nextProgress: WorkspaceProgressPayload = {
      ...cur,
      completedLessons: nextCompleted,
      completionDates: nextDates,
    };
    const nextTokens = isCurrentlyCompleted
      ? revokeTokenFromMap(earnedTokensRef.current, lessonId)
      : mintTokenIntoMap(earnedTokensRef.current, lessonId);

    progressRef.current = nextProgress;
    earnedTokensRef.current = nextTokens;
    setCompletedLessons(nextCompleted);
    if (nextDates !== cur.completionDates) {
      setCompletionDates(nextDates);
    }
    setEarnedTokens(nextTokens);
    persistSnapshotNow(nextProgress, nextTokens);
  };

  const markLessonRead = (lessonId: string) => {
    const cur = progressRef.current;
    if (cur.readLessons.includes(lessonId)) return;
    const nextRead = [...cur.readLessons, lessonId];
    const nextProgress: WorkspaceProgressPayload = { ...cur, readLessons: nextRead };
    progressRef.current = nextProgress;
    setReadLessons(nextRead);
    persistSnapshotNow(nextProgress);
  };

  const isLessonRead = (lessonId: string) =>
    readLessons.includes(lessonId) || completedLessons.includes(lessonId);

  const markExercisePassed = (lessonId: string) => {
    const cur = progressRef.current;
    if (cur.passedExercises.includes(lessonId)) return;
    const nextExercises = [...cur.passedExercises, lessonId];
    const nextProgress: WorkspaceProgressPayload = { ...cur, passedExercises: nextExercises };
    progressRef.current = nextProgress;
    setPassedExercises(nextExercises);
    persistSnapshotNow(nextProgress);
  };

  const isExercisePassed = (lessonId: string) =>
    passedExercises.includes(lessonId) || completedLessons.includes(lessonId);

  const recordQuizScore = (lessonId: string, scorePercent: number) => {
    const cur = progressRef.current;
    const nextScores: Record<string, number> = {
      ...cur.quizScores,
      [lessonId]: Math.max(cur.quizScores[lessonId] ?? 0, scorePercent),
    };
    const shouldComplete = scorePercent >= 70 && !cur.completedLessons.includes(lessonId);
    const nextCompleted = shouldComplete
      ? [...cur.completedLessons, lessonId]
      : cur.completedLessons;
    const currentDayKey = getLocalDateKey();
    const nextDates = shouldComplete
      ? sanitizeDateList([currentDayKey, ...cur.completionDates])
      : cur.completionDates;

    const nextProgress: WorkspaceProgressPayload = {
      ...cur,
      quizScores: nextScores,
      completedLessons: nextCompleted,
      completionDates: nextDates,
    };
    const nextTokens = shouldComplete
      ? mintTokenIntoMap(earnedTokensRef.current, lessonId)
      : earnedTokensRef.current;

    progressRef.current = nextProgress;
    earnedTokensRef.current = nextTokens;
    setQuizScores(nextScores);
    if (shouldComplete) {
      setCompletedLessons(nextCompleted);
      setCompletionDates(nextDates);
      setEarnedTokens(nextTokens);
    }
    persistSnapshotNow(nextProgress, nextTokens);
  };

  const savePlaygroundCode = (codeToSave?: PlaygroundStarter) => {
    const payload = codeToSave ?? playgroundCode;
    try {
      localStorage.setItem(STORAGE_KEYS.playground, JSON.stringify(payload));
    } catch {
      // Ignore storage errors
    }
  };

  const loadStarterInPlayground = (starter: PlaygroundStarter) => {
    setPlaygroundCode(starter);
    savePlaygroundCode(starter);
    setView('playground');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetProgress = () => {
    const emptyProgress = createEmptyProgress();
    progressRef.current = emptyProgress;
    earnedTokensRef.current = {};
    earnedAchievementsRef.current = {};
    setCompletedLessons([]);
    setReadLessons([]);
    setPassedExercises([]);
    setQuizScores({});
    setCompletionDates([]);
    setEarnedTokens({});
    setEarnedAchievements({});
    setActiveLessonId(lessons[0].id);
    setActiveLessonTabState('learn');
    setSelectedLanguageIdState(null);

    try {
      localStorage.removeItem(STORAGE_KEYS.playground);
    } catch {
      // Ignore storage errors
    }
    setPlaygroundCode(playgroundTemplates.card);
    clearWorkspaceSnapshot();
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        theme,
        setTheme,
        toggleTheme,
        t: translations[lang],
        view,
        setView,
        selectedLanguageId,
        setSelectedLanguageId,
        openLanguage,
        isLanguageUnlocked,
        activeLessonId,
        activeLessonTab,
        setActiveLessonTab,
        openLesson,
        isLessonUnlocked,
        completedLessons,
        toggleLessonComplete,
        markLessonComplete,
        readLessons,
        markLessonRead,
        isLessonRead,
        passedExercises,
        markExercisePassed,
        isExercisePassed,
        quizScores,
        recordQuizScore,
        completionDates,
        streakStats,
        earnedTokens,
        earnedAchievements,
        playgroundCode,
        setPlaygroundCode,
        savePlaygroundCode,
        loadStarterInPlayground,
        resetProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
