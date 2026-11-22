import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppView, Language, Theme, translations, Translations } from '../i18n/translations';
import { languages, lessons, PlaygroundStarter, playgroundTemplates } from '../data/curriculum';
import {
  computeQualifiedAchievements,
  EarnedAchievementRecord,
} from '../data/milestones';
import { EarnedTokenRecord, getTokenForLesson } from '../data/tokens';
import {
  AuthUser,
  fetchCurrentSession,
  logoutSession,
  openGoogleOAuthPopup,
} from '../utils/authApi';
import {
  AccountWorkspaceSnapshot,
  clearAccountSnapshot,
  LessonTab,
  loadAccountSnapshot,
  RemoteProgressPayload,
  ResumableView,
  saveAccountSnapshot,
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
  user: AuthUser | null;
  authLoading: boolean;
  progressReady: boolean;
  signInWithGoogle: () => Promise<void>;
  switchGoogleAccount: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const PREF_STORAGE_KEYS = {
  lang: 'codepath_lang',
  theme: 'codepath_theme',
};

const LEGACY_PROGRESS_KEYS = [
  'codepath_completed_lessons',
  'codepath_read_lessons',
  'codepath_passed_exercises',
  'codepath_quiz_scores',
  'codepath_earned_tokens',
  'codepath_earned_achievements',
  'codepath_game_high_scores',
  'codepath_completion_dates',
  'codepath_playground_code',
  'codepath_progress_epoch',
];

function clearLegacyLocalProgress(): void {
  if (typeof window === 'undefined') return;
  try {
    for (const key of LEGACY_PROGRESS_KEYS) {
      localStorage.removeItem(key);
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

clearLegacyLocalProgress();

function getPlaygroundStorageKey(uid: string): string {
  return `codepath_playground_code_${uid}`;
}

function loadUserPlaygroundCode(uid: string | null | undefined): PlaygroundStarter {
  if (!uid || typeof window === 'undefined') return playgroundTemplates.card;
  try {
    const raw = localStorage.getItem(getPlaygroundStorageKey(uid));
    return raw ? (JSON.parse(raw) as PlaygroundStarter) : playgroundTemplates.card;
  } catch {
    return playgroundTemplates.card;
  }
}

function getInitialViewFromPath(): AppView {
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/signin') return 'signin';
  return 'roadmap';
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

function createEmptyProgress(): RemoteProgressPayload {
  return {
    completedLessons: [],
    readLessons: [],
    passedExercises: [],
    quizScores: {},
    completionDates: [],
    activeLessonId: lessons[0].id,
    selectedLanguageId: null,
    lastView: 'roadmap',
    activeLessonTab: 'learn',
  };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem(PREF_STORAGE_KEYS.lang);
    return saved === 'ar' ? 'ar' : 'en';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(PREF_STORAGE_KEYS.theme);
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [view, setViewState] = useState<AppView>(getInitialViewFromPath);
  const [selectedLanguageId, setSelectedLanguageIdState] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string>(lessons[0].id);
  const [activeLessonTab, setActiveLessonTabState] = useState<LessonTab>('learn');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [progressReady, setProgressReady] = useState<boolean>(false);

  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [readLessons, setReadLessons] = useState<string[]>([]);
  const [passedExercises, setPassedExercises] = useState<string[]>([]);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [earnedTokens, setEarnedTokens] = useState<Record<string, EarnedTokenRecord>>({});
  const [completionDates, setCompletionDates] = useState<string[]>([]);
  const [earnedAchievements, setEarnedAchievements] = useState<
    Record<string, EarnedAchievementRecord>
  >({});

  const [todayKey, setTodayKey] = useState<string>(() => getLocalDateKey());
  const [playgroundCode, setPlaygroundCode] = useState<PlaygroundStarter>(playgroundTemplates.card);

  const progressRef = useRef<RemoteProgressPayload>(createEmptyProgress());
  progressRef.current = {
    completedLessons,
    readLessons,
    passedExercises,
    quizScores,
    completionDates,
    activeLessonId,
    selectedLanguageId,
    lastView: view === 'signin' ? (progressRef.current.lastView ?? 'roadmap') : view,
    activeLessonTab,
  };

  const earnedTokensRef = useRef<Record<string, EarnedTokenRecord>>(earnedTokens);
  earnedTokensRef.current = earnedTokens;

  const earnedAchievementsRef = useRef<Record<string, EarnedAchievementRecord>>(earnedAchievements);
  earnedAchievementsRef.current = earnedAchievements;

  const activeUidRef = useRef<string | null>(null);
  const initialHydrationDoneRef = useRef<string | null>(null);
  const navSyncTimerRef = useRef<number | null>(null);

  const cancelPendingNavSync = () => {
    if (navSyncTimerRef.current !== null) {
      window.clearTimeout(navSyncTimerRef.current);
      navSyncTimerRef.current = null;
    }
  };

  const resetInMemoryProgress = (nextUid?: string | null) => {
    cancelPendingNavSync();
    const empty = createEmptyProgress();
    progressRef.current = empty;
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
    setPlaygroundCode(loadUserPlaygroundCode(nextUid));
  };

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

  // Check existing Google OAuth session cookie on boot
  useEffect(() => {
    let cancelled = false;
    void fetchCurrentSession().then((sessionUser) => {
      if (cancelled) return;
      if (!sessionUser) {
        activeUidRef.current = null;
        initialHydrationDoneRef.current = null;
        resetInMemoryProgress(null);
        setProgressReady(false);
        setUser(null);
        setViewState('signin');
        if (window.location.pathname !== '/signin') {
          window.history.replaceState({}, '', '/signin');
        }
      } else {
        activeUidRef.current = sessionUser.uid;
        initialHydrationDoneRef.current = null;
        resetInMemoryProgress(sessionUser.uid);
        setProgressReady(false);
        setUser(sessionUser);
      }
      setAuthLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Hydrate account progress & exact stopping point when authenticated user changes
  useEffect(() => {
    if (!user?.uid) return;

    const uid = user.uid;
    let cancelled = false;
    activeUidRef.current = uid;
    initialHydrationDoneRef.current = null;
    resetInMemoryProgress(uid);
    setProgressReady(false);

    void loadAccountSnapshot(uid).then((snapshot) => {
      if (cancelled || activeUidRef.current !== uid) return;

      if (!snapshot) {
        // Brand new Google account — start strictly from 0
        const fresh = createEmptyProgress();
        const freshSnapshot: AccountWorkspaceSnapshot = {
          progress: fresh,
          tokens: {},
          achievements: {},
        };
        progressRef.current = fresh;
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
        setViewState('roadmap');
        if (window.location.pathname.replace(/\/+$/, '') === '/signin') {
          window.history.replaceState({}, '', '/');
        }
        initialHydrationDoneRef.current = uid;
        setProgressReady(true);
        void saveAccountSnapshot(uid, freshSnapshot);
        return;
      }

      const remote = snapshot.progress;
      const firstIncomplete =
        lessons.find((l) => !remote.completedLessons.includes(l.id))?.id ?? lessons[0].id;
      const restoredLessonId =
        remote.activeLessonId &&
        isLessonUnlockedWith(remote.activeLessonId, remote.completedLessons)
          ? remote.activeLessonId
          : firstIncomplete;
      const restoredLessonObj = lessons.find((l) => l.id === restoredLessonId) ?? lessons[0];

      let restoredLanguageId: string | null = null;
      if (
        remote.selectedLanguageId &&
        isLanguageUnlockedWith(remote.selectedLanguageId, remote.completedLessons)
      ) {
        restoredLanguageId = remote.selectedLanguageId;
      } else if (remote.lastView === 'lesson') {
        restoredLanguageId = restoredLessonObj.languageId;
      }

      const lessonIsDone = remote.completedLessons.includes(restoredLessonId);
      const lessonIsRead = lessonIsDone || remote.readLessons.includes(restoredLessonId);
      const lessonExPassed = lessonIsDone || remote.passedExercises.includes(restoredLessonId);
      let restoredTab: LessonTab = 'learn';
      if (remote.activeLessonTab === 'assessment' && lessonExPassed) {
        restoredTab = 'assessment';
      } else if (remote.activeLessonTab === 'practice' && lessonIsRead) {
        restoredTab = 'practice';
      }

      const restoredView: ResumableView = remote.lastView ?? 'roadmap';

      // Ensure any completed lessons have their digital tokens minted
      const nextTokens: Record<string, EarnedTokenRecord> = { ...(snapshot.tokens ?? {}) };
      for (const lessonId of remote.completedLessons) {
        if (!nextTokens[lessonId]) {
          const spec = getTokenForLesson(lessonId);
          if (spec) {
            nextTokens[lessonId] = {
              uid,
              lessonId,
              tokenCode: spec.tokenCode,
              languageId: spec.languageId,
              order: spec.index,
              earnedAt: new Date().toISOString(),
            };
          }
        }
      }

      const nextProgress: RemoteProgressPayload = {
        completedLessons: remote.completedLessons,
        readLessons: remote.readLessons,
        passedExercises: remote.passedExercises,
        quizScores: remote.quizScores,
        completionDates: remote.completionDates,
        activeLessonId: restoredLessonId,
        selectedLanguageId: restoredLanguageId,
        lastView: restoredView,
        activeLessonTab: restoredTab,
      };

      progressRef.current = nextProgress;
      earnedTokensRef.current = nextTokens;
      earnedAchievementsRef.current = snapshot.achievements ?? {};

      setCompletedLessons(remote.completedLessons);
      setReadLessons(remote.readLessons);
      setPassedExercises(remote.passedExercises);
      setQuizScores(remote.quizScores);
      setCompletionDates(remote.completionDates);
      setEarnedTokens(nextTokens);
      setEarnedAchievements(snapshot.achievements ?? {});
      setActiveLessonId(restoredLessonId);
      setSelectedLanguageIdState(restoredLanguageId);
      setActiveLessonTabState(restoredTab);
      setViewState(restoredView);

      if (window.location.pathname.replace(/\/+$/, '') === '/signin') {
        window.history.replaceState({}, '', '/');
      }

      initialHydrationDoneRef.current = uid;
      setProgressReady(true);
    });

    return () => {
      cancelled = true;
      cancelPendingNavSync();
    };
  }, [user?.uid]);

  // Sync browser back/forward navigation with /signin route
  useEffect(() => {
    const onPopState = () => {
      if (!activeUidRef.current) {
        setViewState('signin');
        return;
      }
      setViewState(getInitialViewFromPath());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const persistSnapshotNow = (
    nextProgress: RemoteProgressPayload,
    nextTokens: Record<string, EarnedTokenRecord> = earnedTokensRef.current,
    nextAchievements: Record<string, EarnedAchievementRecord> = earnedAchievementsRef.current
  ) => {
    const uid = user?.uid;
    if (!uid || activeUidRef.current !== uid || initialHydrationDoneRef.current !== uid) {
      return;
    }
    void saveAccountSnapshot(uid, {
      progress: nextProgress,
      tokens: nextTokens,
      achievements: nextAchievements,
    });
  };

  const scheduleNavigationSync = () => {
    const uid = user?.uid;
    if (!uid || activeUidRef.current !== uid || initialHydrationDoneRef.current !== uid) {
      return;
    }
    cancelPendingNavSync();
    navSyncTimerRef.current = window.setTimeout(() => {
      navSyncTimerRef.current = null;
      if (activeUidRef.current !== uid || initialHydrationDoneRef.current !== uid) {
        return;
      }
      persistSnapshotNow(progressRef.current);
    }, 0);
  };

  const setView = (nextView: AppView) => {
    if (!activeUidRef.current && nextView !== 'signin') {
      setViewState('signin');
      if (window.location.pathname !== '/signin') {
        window.history.pushState({}, '', '/signin');
      }
      return;
    }
    setViewState(nextView);
    if (nextView !== 'signin') {
      progressRef.current = {
        ...progressRef.current,
        lastView: nextView,
      };
      scheduleNavigationSync();
    }
    const targetPath = nextView === 'signin' ? '/signin' : '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  const setSelectedLanguageId = (languageId: string | null) => {
    setSelectedLanguageIdState(languageId);
    progressRef.current = {
      ...progressRef.current,
      selectedLanguageId: languageId,
    };
    scheduleNavigationSync();
  };

  const setActiveLessonTab = (nextTab: LessonTab) => {
    setActiveLessonTabState(nextTab);
    progressRef.current = {
      ...progressRef.current,
      activeLessonTab: nextTab,
    };
    scheduleNavigationSync();
  };

  // Sync language direction and document lang
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem(PREF_STORAGE_KEYS.lang, lang);
  }, [lang]);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(PREF_STORAGE_KEYS.theme, theme);
  }, [theme]);

  const streakStats = useMemo(() => {
    void todayKey;
    return calculateStreakStats(completionDates);
  }, [completionDates, todayKey]);

  // Automatically unlock and persist Milestone Achievements when criteria are met
  useEffect(() => {
    const uid = user?.uid;
    if (!uid || !progressReady || initialHydrationDoneRef.current !== uid) {
      return;
    }

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
          uid,
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
  }, [
    completedLessons,
    streakStats.longestStreak,
    streakStats.currentStreak,
    user?.uid,
    progressReady,
  ]);

  const setLang = (next: Language) => setLangState(next);
  const toggleLang = () => setLangState((prev) => (prev === 'en' ? 'ar' : 'en'));
  const setTheme = (next: Theme) => setThemeState(next);
  const toggleTheme = () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));

  const isLanguageUnlocked = (languageId: string) =>
    isLanguageUnlockedWith(languageId, completedLessons);

  const openLanguage = (languageId: string) => {
    if (!activeUidRef.current) {
      setView('signin');
      return;
    }
    if (!isLanguageUnlocked(languageId)) {
      return;
    }
    setSelectedLanguageIdState(languageId);
    setViewState('roadmap');
    progressRef.current = {
      ...progressRef.current,
      selectedLanguageId: languageId,
      lastView: 'roadmap',
    };
    scheduleNavigationSync();
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLessonUnlocked = (lessonId: string) =>
    isLessonUnlockedWith(lessonId, completedLessons);

  const openLesson = (lessonId: string) => {
    if (!activeUidRef.current) {
      setView('signin');
      return;
    }
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
    progressRef.current = {
      ...progressRef.current,
      selectedLanguageId: nextLangId,
      activeLessonId: lessonId,
      activeLessonTab: nextTab,
      lastView: 'lesson',
    };
    scheduleNavigationSync();
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
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
        uid: user?.uid ?? 'local',
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
    const nextProgress: RemoteProgressPayload = {
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
    cancelPendingNavSync();
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

    const nextProgress: RemoteProgressPayload = {
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
    cancelPendingNavSync();
    persistSnapshotNow(nextProgress, nextTokens);
  };

  const markLessonRead = (lessonId: string) => {
    const cur = progressRef.current;
    if (cur.readLessons.includes(lessonId)) return;
    const nextRead = [...cur.readLessons, lessonId];
    const nextProgress: RemoteProgressPayload = { ...cur, readLessons: nextRead };
    progressRef.current = nextProgress;
    setReadLessons(nextRead);
    cancelPendingNavSync();
    persistSnapshotNow(nextProgress);
  };

  const isLessonRead = (lessonId: string) =>
    readLessons.includes(lessonId) || completedLessons.includes(lessonId);

  const markExercisePassed = (lessonId: string) => {
    const cur = progressRef.current;
    if (cur.passedExercises.includes(lessonId)) return;
    const nextExercises = [...cur.passedExercises, lessonId];
    const nextProgress: RemoteProgressPayload = { ...cur, passedExercises: nextExercises };
    progressRef.current = nextProgress;
    setPassedExercises(nextExercises);
    cancelPendingNavSync();
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

    const nextProgress: RemoteProgressPayload = {
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
    cancelPendingNavSync();
    persistSnapshotNow(nextProgress, nextTokens);
  };

  const savePlaygroundCode = (codeToSave?: PlaygroundStarter) => {
    const uid = user?.uid;
    if (!uid) return;
    const payload = codeToSave ?? playgroundCode;
    try {
      localStorage.setItem(getPlaygroundStorageKey(uid), JSON.stringify(payload));
    } catch {
      // Ignore storage errors
    }
  };

  const loadStarterInPlayground = (starter: PlaygroundStarter) => {
    if (!activeUidRef.current) {
      setView('signin');
      return;
    }
    setPlaygroundCode(starter);
    savePlaygroundCode(starter);
    setView('playground');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetProgress = () => {
    cancelPendingNavSync();
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

    const uid = user?.uid;
    if (uid) {
      try {
        localStorage.removeItem(getPlaygroundStorageKey(uid));
      } catch {
        // Ignore storage errors
      }
      setPlaygroundCode(playgroundTemplates.card);
      void clearAccountSnapshot(uid);
    }
  };

  const applyAuthenticatedUser = (nextUser: AuthUser) => {
    if (activeUidRef.current !== nextUser.uid) {
      activeUidRef.current = nextUser.uid;
      initialHydrationDoneRef.current = null;
      resetInMemoryProgress(nextUser.uid);
      setProgressReady(false);
    }
    setUser(nextUser);
  };

  const signInWithGoogle = async () => {
    const nextUser = await openGoogleOAuthPopup();
    applyAuthenticatedUser(nextUser);
  };

  const switchGoogleAccount = async () => {
    cancelPendingNavSync();
    const nextUser = await openGoogleOAuthPopup();
    applyAuthenticatedUser(nextUser);
  };

  const signOutUser = async () => {
    cancelPendingNavSync();
    await logoutSession();
    activeUidRef.current = null;
    initialHydrationDoneRef.current = null;
    resetInMemoryProgress(null);
    setProgressReady(false);
    setUser(null);
    setViewState('signin');
    if (window.location.pathname !== '/signin') {
      window.history.replaceState({}, '', '/signin');
    }
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
        user,
        authLoading,
        progressReady,
        signInWithGoogle,
        switchGoogleAccount,
        signOutUser,
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
