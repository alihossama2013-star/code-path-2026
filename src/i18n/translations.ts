export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';
export type AppView = 'landing' | 'roadmap' | 'lesson' | 'playground' | 'stack3d' | 'dashboard';

export interface Translations {
  brand: string;
  tagline: string;
  philosophy: string;
  nav: {
    overview: string;
    roadmap: string;
    playground: string;
    stack3d: string;
    dashboard: string;
    startLearning: string;
    continueLearning: string;
  };
  theme: {
    light: string;
    dark: string;
    toggleLabel: string;
  };
  language: {
    label: string;
    switchTo: string;
    english: string;
    arabic: string;
  };
  hero: {
    kicker: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    editorFileHtml: string;
    editorFileJs: string;
    editorFileReact: string;
    editorOutputLabel: string;
    editorRun: string;
  };
  pillars: {
    heading: string;
    subheading: string;
    items: {
      index: string;
      title: string;
      description: string;
    }[];
  };
  tracksOverview: {
    heading: string;
    subheading: string;
    lessonsCount: string;
    exploreTrack: string;
  };
  roadmap: {
    title: string;
    subtitle: string;
    languagesSubtitle: string;
    chaptersCount: string;
    lessonsCount: string;
    backToLanguages: string;
    resumeTitle: string;
    resumeAction: string;
    chapterLabel: string;
    unlockLanguageHint: string;
    filterAll: string;
    progressLabel: string;
    completedOf: string;
    statusCompleted: string;
    statusInProgress: string;
    statusNotStarted: string;
    statusLocked: string;
    lockedBtn: string;
    unlockHint: string;
    openLanguage: string;
    openLesson: string;
    reviewLesson: string;
    minutes: string;
    quizScore: string;
    reviewCheckpoint: string;
  };
  lesson: {
    backToRoadmap: string;
    backToChapters: string;
    tagsTaughtLabel: string;
    syntaxLabel: string;
    attributesLabel: string;
    exampleLabel: string;
    tabLearn: string;
    tabPractice: string;
    tabAssessment: string;
    copyCode: string;
    copied: string;
    tryInPlayground: string;
    markComplete: string;
    completed: string;
    previousLesson: string;
    nextLesson: string;
    challengeTitle: string;
    openInPlayground: string;
    assessmentTitle: string;
    assessmentSubtitle: string;
    submitQuiz: string;
    retakeQuiz: string;
    scoreResult: string;
    passedMessage: string;
    tryAgainMessage: string;
    correctLabel: string;
    incorrectLabel: string;
    explanationLabel: string;
    writtenExplanationHeading: string;
    overviewHeading: string;
    howItWorksHeading: string;
    keyTakeawaysHeading: string;
    commonMistakeHeading: string;
    visualGuideHeading: string;
    tagAnatomyHeading: string;
    openingTagLabel: string;
    attributeLabel: string;
    contentLabel: string;
    closingTagLabel: string;
    voidTagNote: string;
    listenArabicTitle: string;
    listenArabicSubtitle: string;
    listenBtnAr: string;
    listenBtnEn: string;
    pauseBtn: string;
    resumeBtn: string;
    stopBtn: string;
    loadingVoice: string;
    playingVoice: string;
    pausedVoice: string;
    speedLabel: string;
    voiceEngineGemini: string;
    voiceEngineBrowser: string;
    voiceUnavailable: string;
    finishReadingBtn: string;
    readingDoneLabel: string;
    exerciseLockedTitle: string;
    exerciseLockedDesc: string;
    goToLessonBtn: string;
    assessmentLockedTitle: string;
    assessmentLockedDesc: string;
    goToExerciseBtn: string;
    completeStepsFirst: string;
    exerciseEditorTab: string;
    exerciseWebPreviewTab: string;
    exerciseSplitTab: string;
    verifyTaskBtn: string;
    resetStarterBtn: string;
    browserTabLabel: string;
    untitledPage: string;
    taskPassedTitle: string;
    taskFailedTitle: string;
    proceedToAssessmentBtn: string;
    requirementsTitle: string;
    refreshPreviewBtn: string;
    assessmentPartAMcq: string;
    assessmentPartBCode: string;
    assessmentProgressLabel: string;
    checkCodeBtn: string;
    codePassedLabel: string;
    codeNotPassedLabel: string;
    codeUncheckedLabel: string;
    mixedVisualDiagramLabel: string;
    mixedVisualConceptLabel: string;
    submitAssessmentNote: string;
    visualModeShowcase: string;
    visualMode3D: string;
    visual3DExplode: string;
    visual3DReset: string;
    visual3DFlow: string;
    visual3DClickHint: string;
    visual3DOverviewPart: string;
    tokenMintedToast: string;
    reviewCheckpointLabel: string;
    reviewingPairHeading: string;
  };
  simulator: {
    title: string;
    simulateBtn: string;
    hideBtn: string;
    editCodeTab: string;
    previewTab: string;
    splitTab: string;
    runBtn: string;
    resetBtn: string;
    consoleTitle: string;
    clearConsole: string;
    headInfoLabel: string;
    interactiveLabel: string;
  };
  playground: {
    title: string;
    subtitle: string;
    templatesLabel: string;
    runCode: string;
    resetCode: string;
    saveCode: string;
    saved: string;
    tabHtml: string;
    tabCss: string;
    tabJs: string;
    previewTitle: string;
    consoleTitle: string;
    clearConsole: string;
    consoleEmpty: string;
    templates: {
      id: string;
      name: string;
    }[];
  };
  stack3d: {
    title: string;
    subtitle: string;
    hideControls: string;
    showControls: string;
    explodeLabel: string;
    cameraLabel: string;
    viewIsometric: string;
    viewClient: string;
    viewApi: string;
    viewDatabase: string;
    flowToggle: string;
    flowActive: string;
    flowPaused: string;
    inspectHint: string;
    layers: {
      client: { title: string; detail: string };
      api: { title: string; detail: string };
      database: { title: string; detail: string };
    };
  };
  dashboard: {
    title: string;
    subtitle: string;
    overallProgress: string;
    lessonsCompleted: string;
    averageScore: string;
    currentTrack: string;
    nextUpTitle: string;
    continueBtn: string;
    allCompletedTitle: string;
    allCompletedDesc: string;
    trackBreakdown: string;
    settingsTitle: string;
    settingsDesc: string;
    appearanceLabel: string;
    languageLabel: string;
    resetProgressLabel: string;
    resetProgressBtn: string;
    resetConfirmText: string;
    cancelBtn: string;
    confirmResetBtn: string;
    tokensEarnedKpi: string;
    tokensSectionTitle: string;
    tokensSectionDesc: string;
    filterAll: string;
    filterEarned: string;
    filterLocked: string;
    trackAll: string;
    tokenMintedLabel: string;
    tokenLockedLabel: string;
    earnedOnLabel: string;
    unlockRequirementLabel: string;
    reviewLessonBtn: string;
    openLessonBtn: string;
    lockedPrevHint: string;
    emptyEarnedTitle: string;
    emptyEarnedDesc: string;
    startFirstLessonBtn: string;
    tokenCodeLabel: string;
    tokenTrackLabel: string;
    tokenConceptLabel: string;
    dailyStreakLabel: string;
    streakDaySingular: string;
    streakDayPlural: string;
    streakTodayDone: string;
    streakKeepGoing: string;
    streakStartHint: string;
    longestStreakLabel: string;
    activeDaysLabel: string;
    last7DaysLabel: string;
    todayShortLabel: string;
    milestonesSectionTitle: string;
    milestonesSectionDesc: string;
    milestoneAll: string;
    milestoneUnlocked: string;
    milestoneInProgress: string;
    milestoneCatAll: string;
    milestoneCatChapter: string;
    milestoneCatTrack: string;
    milestoneCatSeries: string;
    milestoneCatStreak: string;
    milestoneEarnedLabel: string;
    milestoneLockedLabel: string;
    milestoneProgressLabel: string;
    tierBronze: string;
    tierSilver: string;
    tierGold: string;
    tierApex: string;
    milestoneEmptyTitle: string;
    milestoneEmptyDesc: string;
    milestoneJumpBtn: string;
  };
  footer: {
    copyright: string;
    builtFor: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    brand: 'CodePath',
    tagline: 'From Zero to Developer.',
    philosophy: 'Learn. Practice. Build. Deploy.',
    nav: {
      overview: 'Overview',
      roadmap: 'Roadmap',
      playground: 'Playground',
      stack3d: '3D Architecture',
      dashboard: 'Dashboard',
      startLearning: 'Start Learning',
      continueLearning: 'Continue',
    },
    theme: {
      light: 'Light',
      dark: 'Dark',
      toggleLabel: 'Switch theme',
    },
    language: {
      label: 'Language',
      switchTo: 'العربية',
      english: 'English',
      arabic: 'العربية',
    },
    hero: {
      kicker: 'Structured Web Development Curriculum',
      headline: 'From Zero to Developer.',
      subheadline:
        'A disciplined, step-by-step path for complete beginners. Understand how the web works, write real code in the browser, pass practical assessments, and ship full-stack applications.',
      primaryCta: 'Start the Curriculum',
      secondaryCta: 'Explore Roadmap',
      editorFileHtml: 'index.html',
      editorFileJs: 'app.js',
      editorFileReact: 'App.tsx',
      editorOutputLabel: 'Live Output',
      editorRun: 'Run',
    },
    pillars: {
      heading: 'How CodePath Works',
      subheading: 'Four deliberate stages designed to turn absolute beginners into confident engineers.',
      items: [
        {
          index: '01',
          title: 'Learn',
          description:
            'Clear, jargon-free explanations written in both English and Arabic. Every concept starts from first principles.',
        },
        {
          index: '02',
          title: 'Practice',
          description:
            'Write HTML, CSS, and JavaScript directly in the built-in browser playground with instant preview and console output.',
        },
        {
          index: '03',
          title: 'Build',
          description:
            'Apply each lesson to real components, interactive interfaces, and client-server data flows.',
        },
        {
          index: '04',
          title: 'Deploy',
          description:
            'Understand HTTP, databases, and production deployment so your applications run reliably for real users.',
        },
      ],
    },
    tracksOverview: {
      heading: 'Four Progressive Tracks',
      subheading: 'Start with zero programming knowledge and progress systematically to full-stack architecture.',
      lessonsCount: 'lessons',
      exploreTrack: 'View Track',
    },
    roadmap: {
      title: 'Learning Roadmap',
      subtitle: 'Select a language to view its chapters and continue from where you stopped.',
      languagesSubtitle: 'Choose a language to open its structured chapters.',
      chaptersCount: 'Chapters',
      lessonsCount: 'Lessons',
      backToLanguages: 'All Languages',
      resumeTitle: 'Current Chapter',
      resumeAction: 'Continue Chapter',
      chapterLabel: 'Chapter',
      unlockLanguageHint: 'Finish the previous language to unlock',
      filterAll: 'All Tracks',
      progressLabel: 'Overall Completion',
      completedOf: 'of',
      statusCompleted: 'Completed',
      statusInProgress: 'Next Up',
      statusNotStarted: 'Not Started',
      statusLocked: 'Locked',
      lockedBtn: 'Locked',
      unlockHint: 'Complete the previous lesson to unlock',
      openLanguage: 'Open Chapters',
      openLesson: 'Start Lesson',
      reviewLesson: 'Review',
      minutes: 'min',
      quizScore: 'Assessment',
      reviewCheckpoint: 'Review Lesson',
    },
    lesson: {
      backToRoadmap: 'Back to Roadmap',
      backToChapters: 'Back to Chapters',
      tagsTaughtLabel: 'Tags Covered',
      syntaxLabel: 'Syntax',
      attributesLabel: 'Attributes',
      exampleLabel: 'HTML Example',
      tabLearn: 'Lesson',
      tabPractice: 'Exercise',
      tabAssessment: 'Assessment',
      copyCode: 'Copy',
      copied: 'Copied',
      tryInPlayground: 'Open in Playground',
      markComplete: 'Mark as Complete',
      completed: 'Completed',
      previousLesson: 'Previous',
      nextLesson: 'Next Lesson',
      challengeTitle: 'Hands-On Exercise',
      openInPlayground: 'Open Exercise in Playground',
      assessmentTitle: '10-Question Mastery Assessment',
      assessmentSubtitle: 'Complete 5 multiple-choice questions and 5 live coding tasks. Score 70% or higher (7/10) to pass.',
      submitQuiz: 'Submit Assessment',
      retakeQuiz: 'Retake Assessment',
      scoreResult: 'Your Score',
      passedMessage: 'Well done. This lesson has been marked as complete.',
      tryAgainMessage: 'Review the explanations below and try again to master this topic.',
      correctLabel: 'Correct',
      incorrectLabel: 'Incorrect',
      explanationLabel: 'Explanation',
      writtenExplanationHeading: 'Lesson Explanation',
      overviewHeading: 'What It Is & Why It Matters',
      howItWorksHeading: 'How the Browser Handles It',
      keyTakeawaysHeading: 'Key Takeaways',
      commonMistakeHeading: 'Common Mistake to Avoid',
      visualGuideHeading: 'Visual Architecture & Tag Anatomy',
      tagAnatomyHeading: 'Tag Structure Breakdown',
      openingTagLabel: 'Opening Tag',
      attributeLabel: 'Attribute',
      contentLabel: 'Inner Content',
      closingTagLabel: 'Closing Tag',
      voidTagNote: 'Void element — self-contained with no closing tag',
      listenArabicTitle: 'Listen to Explanation',
      listenArabicSubtitle: 'Hear the full lesson explanation read aloud clearly in Arabic or English.',
      listenBtnAr: 'Listen in Arabic',
      listenBtnEn: 'Listen in English',
      pauseBtn: 'Pause',
      resumeBtn: 'Resume',
      stopBtn: 'Stop',
      loadingVoice: 'Preparing audio...',
      playingVoice: 'Reading aloud...',
      pausedVoice: 'Paused',
      speedLabel: 'Speed',
      voiceEngineGemini: 'HD Studio Voice',
      voiceEngineBrowser: 'Device Voice',
      voiceUnavailable: 'Speech playback is not available in this browser.',
      finishReadingBtn: 'I Finished Reading — Unlock Exercise',
      readingDoneLabel: 'Reading Completed — Open Exercise',
      exerciseLockedTitle: 'Exercise Locked Until Lesson Reading Is Complete',
      exerciseLockedDesc: 'Read through the explanation, diagrams, and examples in the Lesson tab, then confirm completion to unlock the hands-on Exercise.',
      goToLessonBtn: 'Return to Lesson',
      assessmentLockedTitle: 'Assessment Locked Until Exercise Task Passes',
      assessmentLockedDesc: 'Complete and verify the practical coding task in the Exercise tab before taking the Assessment.',
      goToExerciseBtn: 'Go to Exercise',
      completeStepsFirst: 'Complete Exercise & Assessment',
      exerciseEditorTab: 'Code Editor',
      exerciseWebPreviewTab: 'Web Preview',
      exerciseSplitTab: 'Split View',
      verifyTaskBtn: 'Run & Verify Task',
      resetStarterBtn: 'Reset Starter',
      browserTabLabel: 'Browser Tab',
      untitledPage: 'Untitled Page',
      taskPassedTitle: 'Exercise Task Passed',
      taskFailedTitle: 'Task Requirements Not Met Yet',
      proceedToAssessmentBtn: 'Continue to Assessment',
      requirementsTitle: 'Task Verification',
      refreshPreviewBtn: 'Refresh Preview',
      assessmentPartAMcq: 'Part A · Multiple-Choice Questions (5)',
      assessmentPartBCode: 'Part B · Real Coding Questions (5)',
      assessmentProgressLabel: 'Progress',
      checkCodeBtn: 'Check Code',
      codePassedLabel: 'Code Passed',
      codeNotPassedLabel: 'Needs Fix',
      codeUncheckedLabel: 'Not Checked Yet',
      mixedVisualDiagramLabel: 'Technical Diagram',
      mixedVisualConceptLabel: 'Concept Illustration',
      submitAssessmentNote: 'Answer all 5 multiple-choice questions and check all 5 coding questions to submit.',
      visualModeShowcase: 'Concept & Diagram',
      visualMode3D: 'Interactive 3D Model',
      visual3DExplode: 'Explode Layers',
      visual3DReset: 'Reset View',
      visual3DFlow: 'Animate Flow',
      visual3DClickHint: 'Drag to orbit · Scroll to zoom · Click any 3D layer to inspect',
      visual3DOverviewPart: 'Overview',
      tokenMintedToast: 'Digital Token Minted',
      reviewCheckpointLabel: 'Review Checkpoint',
      reviewingPairHeading: 'Consolidating the Previous 2 Lessons',
    },
    simulator: {
      title: 'Web Simulator',
      simulateBtn: 'Simulate Code',
      hideBtn: 'Hide Simulator',
      editCodeTab: 'Edit & Simulate',
      previewTab: 'Web Output',
      splitTab: 'Split View',
      runBtn: 'Run',
      resetBtn: 'Reset',
      consoleTitle: 'Console',
      clearConsole: 'Clear',
      headInfoLabel: 'Document Metadata',
      interactiveLabel: 'Interactive Preview',
    },
    playground: {
      title: 'Coding Playground',
      subtitle: 'Write, test, and experiment with HTML, CSS, and JavaScript in real time.',
      templatesLabel: 'Starter Templates',
      runCode: 'Run',
      resetCode: 'Reset',
      saveCode: 'Save',
      saved: 'Saved',
      tabHtml: 'index.html',
      tabCss: 'styles.css',
      tabJs: 'script.js',
      previewTitle: 'Browser Preview',
      consoleTitle: 'Console',
      clearConsole: 'Clear',
      consoleEmpty: 'Console output will appear here when your JavaScript runs.',
      templates: [
        { id: 'card', name: 'HTML Profile Card' },
        { id: 'layout', name: 'CSS Grid Layout' },
        { id: 'counter', name: 'JS Counter App' },
        { id: 'api', name: 'Async Data Fetch' },
      ],
    },
    stack3d: {
      title: 'Full-Stack 3D Architecture',
      subtitle: 'Inspect how Client, API Server, and Database layers communicate in a modern web application.',
      hideControls: 'Hide Controls',
      showControls: 'Show Controls',
      explodeLabel: 'Layer Separation',
      cameraLabel: 'Camera',
      viewIsometric: 'Overview',
      viewClient: 'Client',
      viewApi: 'API Server',
      viewDatabase: 'Database',
      flowToggle: 'Data Flow',
      flowActive: 'Active',
      flowPaused: 'Paused',
      inspectHint: 'Click any 3D tier in the scene to focus & inspect',
      layers: {
        client: {
          title: 'Client Layer (Browser)',
          detail: 'Renders HTML, CSS, and React UI. Sends HTTP requests to the API server.',
        },
        api: {
          title: 'Application Layer (API Server)',
          detail: 'Validates requests, runs business logic, and queries the database.',
        },
        database: {
          title: 'Data Layer (Database)',
          detail: 'Persists structured records reliably and returns query results.',
        },
      },
    },
    dashboard: {
      title: 'Student Dashboard',
      subtitle: 'Track your progress across the curriculum and manage your learning preferences.',
      overallProgress: 'Curriculum Progress',
      lessonsCompleted: 'Lessons Completed',
      averageScore: 'Average Assessment',
      currentTrack: 'Active Track',
      nextUpTitle: 'Recommended Next Lesson',
      continueBtn: 'Continue Lesson',
      allCompletedTitle: 'Curriculum Completed',
      allCompletedDesc: 'You have completed every lesson in the CodePath full-stack curriculum.',
      trackBreakdown: 'Progress by Track',
      settingsTitle: 'Preferences',
      settingsDesc: 'Changes apply immediately and preserve all of your learning progress.',
      appearanceLabel: 'Appearance',
      languageLabel: 'Interface & Curriculum Language',
      resetProgressLabel: 'Learning Progress',
      resetProgressBtn: 'Reset Progress',
      resetConfirmText: 'This will clear all completed lessons and quiz scores. Continue?',
      cancelBtn: 'Cancel',
      confirmResetBtn: 'Confirm Reset',
      tokensEarnedKpi: 'Digital Tokens',
      tokensSectionTitle: 'Digital Token Vault',
      tokensSectionDesc: 'Every completed lesson mints a unique digital token. Earned tokens float actively in your collection.',
      filterAll: 'All',
      filterEarned: 'Earned',
      filterLocked: 'Locked',
      trackAll: 'All Tracks',
      tokenMintedLabel: 'Token Minted',
      tokenLockedLabel: 'Locked',
      earnedOnLabel: 'Minted on',
      unlockRequirementLabel: 'Complete this lesson and pass its assessment to mint this token.',
      reviewLessonBtn: 'Review Lesson',
      openLessonBtn: 'Start Lesson',
      lockedPrevHint: 'Complete earlier lessons first to unlock',
      emptyEarnedTitle: 'No Digital Tokens Minted Yet',
      emptyEarnedDesc: 'Complete your first lesson to mint token CP-01 and see it float in your collection.',
      startFirstLessonBtn: 'Open Lesson 01',
      tokenCodeLabel: 'Token ID',
      tokenTrackLabel: 'Track',
      tokenConceptLabel: 'Concept',
      dailyStreakLabel: 'Daily Streak',
      streakDaySingular: 'day',
      streakDayPlural: 'days',
      streakTodayDone: 'Today completed',
      streakKeepGoing: 'Complete a lesson today to extend your streak',
      streakStartHint: 'Complete a lesson today to start day 1',
      longestStreakLabel: 'Best streak',
      activeDaysLabel: 'Active days',
      last7DaysLabel: 'Last 7 days',
      todayShortLabel: 'Today',
      milestonesSectionTitle: 'Milestone Achievements',
      milestonesSectionDesc:
        'Unlock architectural crest badges by finishing modules, 2-lesson review series, track completions, and daily streaks.',
      milestoneAll: 'All',
      milestoneUnlocked: 'Unlocked',
      milestoneInProgress: 'Locked',
      milestoneCatAll: 'All Categories',
      milestoneCatChapter: 'Modules',
      milestoneCatTrack: 'Tracks',
      milestoneCatSeries: 'Series',
      milestoneCatStreak: 'Streaks',
      milestoneEarnedLabel: 'Unlocked',
      milestoneLockedLabel: 'Locked',
      milestoneProgressLabel: 'Progress',
      tierBronze: 'Bronze',
      tierSilver: 'Silver',
      tierGold: 'Gold',
      tierApex: 'Apex',
      milestoneEmptyTitle: 'No Milestone Badges Match This Filter',
      milestoneEmptyDesc:
        'Keep completing modules, 2-lesson review checkpoints, and daily streaks to unlock crests here.',
      milestoneJumpBtn: 'Open Related Track',
    },
    footer: {
      copyright: '© 2026 CodePath. All rights reserved.',
      builtFor: 'Learn. Practice. Build. Deploy.',
    },
  },
  ar: {
    brand: 'CodePath',
    tagline: 'من الصفر إلى مطوّر.',
    philosophy: 'تعلّم. تدرّب. ابنِ. انشر.',
    nav: {
      overview: 'نظرة عامة',
      roadmap: 'خارطة الطريق',
      playground: 'ساحة الكود',
      stack3d: 'البنية ثلاثية الأبعاد',
      dashboard: 'لوحة الطالب',
      startLearning: 'ابدأ التعلّم',
      continueLearning: 'متابعة',
    },
    theme: {
      light: 'فاتح',
      dark: 'داكن',
      toggleLabel: 'تبديل المظهر',
    },
    language: {
      label: 'اللغة',
      switchTo: 'English',
      english: 'English',
      arabic: 'العربية',
    },
    hero: {
      kicker: 'منهج متكامل لتطوير الويب',
      headline: 'من الصفر إلى مطوّر.',
      subheadline:
        'مسار تعليمي منظم خطوة بخطوة للمبتدئين تماماً. افهم كيف يعمل الويب، اكتب كوداً حقيقياً في المتصفح، اجتز الاختبارات العملية، وانشر تطبيقات ويب متكاملة.',
      primaryCta: 'ابدأ المنهج الآن',
      secondaryCta: 'استكشف خارطة الطريق',
      editorFileHtml: 'index.html',
      editorFileJs: 'app.js',
      editorFileReact: 'App.tsx',
      editorOutputLabel: 'النتيجة المباشرة',
      editorRun: 'تشغيل',
    },
    pillars: {
      heading: 'كيف تعمل منصة CodePath',
      subheading: 'أربع مراحل مدروسة لنقلك من مبتدئ بالكامل إلى مهندس ويب واثق.',
      items: [
        {
          index: '01',
          title: 'تعلّم',
          description:
            'شروحات واضحة وخالية من التعقيد باللغتين العربية والإنجليزية. كل مفهوم يبدأ من الأساسيات الأولى.',
        },
        {
          index: '02',
          title: 'تدرّب',
          description:
            'اكتب HTML و CSS و JavaScript مباشرة في ساحة الكود المدمجة مع معاينة فورية ومخرجات وحدة التحكم.',
        },
        {
          index: '03',
          title: 'ابنِ',
          description:
            'طبّق كل درس في بناء مكونات حقيقية وواجهات تفاعلية وتدفقات بيانات بين العميل والخادم.',
        },
        {
          index: '04',
          title: 'انشر',
          description:
            'افهم بروتوكول HTTP وقواعد البيانات ونشر الإنتاج لتشغيل تطبيقاتك بكفاءة للمستخدمين الحقيقيين.',
        },
      ],
    },
    tracksOverview: {
      heading: 'أربعة مسارات تدريجية',
      subheading: 'ابدأ بدون أي خبرة برمجية سابقة وتدرّج بشكل منهجي حتى بناء التطبيقات المتكاملة.',
      lessonsCount: 'دروس',
      exploreTrack: 'عرض المسار',
    },
    roadmap: {
      title: 'خارطة طريق اللغات',
      subtitle: 'اختر اللغة لفتح الشباتر واستكمال التعلّم من الشابتر الذي توقفت عنده.',
      languagesSubtitle: 'اختر اللغة لعرض الشباتر الخاصة بها.',
      chaptersCount: 'شباتر',
      lessonsCount: 'دروس',
      backToLanguages: 'جميع اللغات',
      resumeTitle: 'الشابتر الحالي',
      resumeAction: 'أكمل من هنا',
      chapterLabel: 'شابتر',
      unlockLanguageHint: 'أكمل اللغة السابقة لفتح هذه اللغة',
      filterAll: 'جميع المسارات',
      progressLabel: 'نسبة الإنجاز الكلية',
      completedOf: 'من',
      statusCompleted: 'مكتمل',
      statusInProgress: 'الدرس التالي',
      statusNotStarted: 'لم يبدأ',
      statusLocked: 'مغلق',
      lockedBtn: 'مغلق',
      unlockHint: 'أكمل الدرس السابق لفتح هذا الدرس',
      openLanguage: 'عرض الشباتر',
      openLesson: 'ابدأ الدرس',
      reviewLesson: 'مراجعة',
      minutes: 'دقيقة',
      quizScore: 'الاختبار',
      reviewCheckpoint: 'درس مراجعة',
    },
    lesson: {
      backToRoadmap: 'العودة إلى خارطة الطريق',
      backToChapters: 'العودة إلى الشباتر',
      tagsTaughtLabel: 'الوسوم المشروحة',
      syntaxLabel: 'الصيغة',
      attributesLabel: 'السمات (Attributes)',
      exampleLabel: 'مثال HTML',
      tabLearn: 'الدرس',
      tabPractice: 'التمرين العملي',
      tabAssessment: 'الاختبار',
      copyCode: 'نسخ',
      copied: 'تم النسخ',
      tryInPlayground: 'فتح في ساحة الكود',
      markComplete: 'تحديد كمكتمل',
      completed: 'مكتمل',
      previousLesson: 'السابق',
      nextLesson: 'الدرس التالي',
      challengeTitle: 'التمرين العملي',
      openInPlayground: 'فتح التمرين في ساحة الكود',
      assessmentTitle: 'الاختبار الشامل (10 أسئلة)',
      assessmentSubtitle: 'أجب عن 5 أسئلة اختيار من متعدد و5 أسئلة كتابة كود عملي. مطلوب 70% فأكثر (7 من 10) للنجاح.',
      submitQuiz: 'إرسال الاختبار',
      retakeQuiz: 'إعادة الاختبار',
      scoreResult: 'نتيجتك',
      passedMessage: 'أحسنت. تم تسجيل هذا الدرس كمكتمل.',
      tryAgainMessage: 'راجع الشروحات أدناه وحاول مرة أخرى لإتقان هذا الموضوع.',
      correctLabel: 'إجابة صحيحة',
      incorrectLabel: 'إجابة غير صحيحة',
      explanationLabel: 'التوضيح',
      writtenExplanationHeading: 'الشرح النصي للدرس',
      overviewHeading: 'ما هو وما أهميته؟',
      howItWorksHeading: 'كيف يتعامل معه المتصفح؟',
      keyTakeawaysHeading: 'أهم النقاط العملية',
      commonMistakeHeading: 'خطأ شائع يجب تجنبه',
      visualGuideHeading: 'المخطط البصري وتشريح الوسوم',
      tagAnatomyHeading: 'تشريح بنية الوسم',
      openingTagLabel: 'وسم البداية',
      attributeLabel: 'السمة',
      contentLabel: 'المحتوى الداخلي',
      closingTagLabel: 'وسم الإغلاق',
      voidTagNote: 'وسم مفرد — يكتفي بنفسه ولا يملك وسم إغلاق',
      listenArabicTitle: 'استمع إلى شرح الدرس',
      listenArabicSubtitle: 'استمع إلى قراءة صوتية واضحة لشرح الدرس باللغة العربية أو الإنجليزية.',
      listenBtnAr: 'استمع بالصوت العربي',
      listenBtnEn: 'استمع بالإنجليزية',
      pauseBtn: 'إيقاف مؤقت',
      resumeBtn: 'استئناف',
      stopBtn: 'إيقاف',
      loadingVoice: 'جاري تجهيز الصوت...',
      playingVoice: 'جاري القراءة الصوتية...',
      pausedVoice: 'متوقف مؤقتاً',
      speedLabel: 'السرعة',
      voiceEngineGemini: 'صوت عالي الوضوح',
      voiceEngineBrowser: 'صوت المتصفح',
      voiceUnavailable: 'القراءة الصوتية غير مدعومة في هذا المتصفح حالياً.',
      finishReadingBtn: 'أتممت قراءة الدرس — افتح التمرين',
      readingDoneLabel: 'تمت قراءة الدرس — الانتقال إلى التمرين',
      exerciseLockedTitle: 'التمرين مغلق حتى إتمام قراءة الدرس',
      exerciseLockedDesc: 'اقرأ الشرح والمخططات والأمثلة في تبويب الدرس أولاً، ثم اضغط زر إتمام القراءة لفتح التمرين العملي.',
      goToLessonBtn: 'العودة إلى الدرس',
      assessmentLockedTitle: 'الاختبار مغلق حتى تنجح في التمرين العملي',
      assessmentLockedDesc: 'أنجز المهمة المطلوبة في تبويب التمرين العملي واضغط "تشغيل والتحقق من المهمة" بنجاح لفتح الاختبار.',
      goToExerciseBtn: 'الانتقال إلى التمرين',
      completeStepsFirst: 'أكمل التمرين والاختبار أولاً',
      exerciseEditorTab: 'محرر الكود',
      exerciseWebPreviewTab: 'معاينة الويب',
      exerciseSplitTab: 'عرض مزدوج',
      verifyTaskBtn: 'تشغيل والتحقق من المهمة',
      resetStarterBtn: 'إعادة الكود الأصلي',
      browserTabLabel: 'تبويب المتصفح',
      untitledPage: 'صفحة بدون عنوان',
      taskPassedTitle: 'تم اجتياز التمرين بنجاح',
      taskFailedTitle: 'لم تكتمل متطلبات التمرين بعد',
      proceedToAssessmentBtn: 'الانتقال إلى الاختبار',
      requirementsTitle: 'التحقق من المهمة',
      refreshPreviewBtn: 'تحديث المعاينة',
      assessmentPartAMcq: 'القسم الأول · أسئلة الاختيار من متعدد (5)',
      assessmentPartBCode: 'القسم الثاني · أسئلة كتابة الكود العملي (5)',
      assessmentProgressLabel: 'التقدم',
      checkCodeBtn: 'التحقق من الكود',
      codePassedLabel: 'الكود صحيح',
      codeNotPassedLabel: 'يحتاج تعديل',
      codeUncheckedLabel: 'لم يتم التحقق بعد',
      mixedVisualDiagramLabel: 'المخطط التقني للدرس',
      mixedVisualConceptLabel: 'البطاقة التصويرية للمفهوم',
      submitAssessmentNote: 'أجب عن جميع أسئلة الاختيار الخمسة واضغط التحقق على جميع أسئلة الكود الخمسة قبل الإرسال.',
      visualModeShowcase: 'الصورة والمخطط',
      visualMode3D: 'نموذج 3D تفاعلي',
      visual3DExplode: 'تفكيك الطبقات',
      visual3DReset: 'إعادة الزاوية',
      visual3DFlow: 'التدفق',
      visual3DClickHint: 'اسحب للتدوير · حرّك العجلة للتقريب · انقر على أي طبقة لفحصها',
      visual3DOverviewPart: 'نظرة شاملة',
      tokenMintedToast: 'تم منح الرمز الرقمي',
      reviewCheckpointLabel: 'محطة مراجعة',
      reviewingPairHeading: 'مراجعة ودمج الدرسين السابقين',
    },
    simulator: {
      title: 'محاكي الويب',
      simulateBtn: 'محاكاة الكود',
      hideBtn: 'إخفاء المحاكي',
      editCodeTab: 'تعديل ومزامنة',
      previewTab: 'نتيجة العرض',
      splitTab: 'عرض مزدوج',
      runBtn: 'تشغيل',
      resetBtn: 'إعادة',
      consoleTitle: 'وحدة التحكم',
      clearConsole: 'مسح',
      headInfoLabel: 'بيانات المستند',
      interactiveLabel: 'معاينة تفاعلية',
    },
    playground: {
      title: 'ساحة الكود التفاعلية',
      subtitle: 'اكتب وجرّب HTML و CSS و JavaScript مع معاينة فورية في المتصفح.',
      templatesLabel: 'قوالب جاهزة',
      runCode: 'تشغيل',
      resetCode: 'إعادة ضبط',
      saveCode: 'حفظ',
      saved: 'تم الحفظ',
      tabHtml: 'index.html',
      tabCss: 'styles.css',
      tabJs: 'script.js',
      previewTitle: 'معاينة المتصفح',
      consoleTitle: 'وحدة التحكم',
      clearConsole: 'مسح',
      consoleEmpty: 'ستظهر مخرجات وحدة التحكم هنا عند تشغيل كود JavaScript.',
      templates: [
        { id: 'card', name: 'بطاقة تعريف HTML' },
        { id: 'layout', name: 'تخطيط CSS Grid' },
        { id: 'counter', name: 'تطبيق عدّاد JS' },
        { id: 'api', name: 'محاكاة جلب البيانات' },
      ],
    },
    stack3d: {
      title: 'البنية المعمارية ثلاثية الأبعاد',
      subtitle: 'استكشف كيف تتواصل طبقات الواجهة والخادم وقاعدة البيانات في تطبيقات الويب الحديثة.',
      hideControls: 'إخفاء التحكم',
      showControls: 'إظهار التحكم',
      explodeLabel: 'فصل الطبقات',
      cameraLabel: 'الكاميرا',
      viewIsometric: 'نظرة شاملة',
      viewClient: 'الواجهة',
      viewApi: 'الخادم API',
      viewDatabase: 'قاعدة البيانات',
      flowToggle: 'تدفق البيانات',
      flowActive: 'نشط',
      flowPaused: 'متوقف',
      inspectHint: 'انقر على أي مجسّم في المشهد للتركيز وفحص وظيفته',
      layers: {
        client: {
          title: 'طبقة العميل (المتصفح)',
          detail: 'تعرض واجهة HTML و CSS و React وترسل طلبات HTTP إلى الخادم.',
        },
        api: {
          title: 'طبقة التطبيق (خادم API)',
          detail: 'تتحقق من الطلبات وتنفذ منطق العمل وتستعلم من قاعدة البيانات.',
        },
        database: {
          title: 'طبقة البيانات (قاعدة البيانات)',
          detail: 'تحفظ السجلات المنظمة بموثوقية وتعيد نتائج الاستعلامات.',
        },
      },
    },
    dashboard: {
      title: 'لوحة الطالب',
      subtitle: 'تابع تقدمك في المنهج وأدر تفضيلات بيئة التعلّم الخاصة بك.',
      overallProgress: 'تقدم المنهج',
      lessonsCompleted: 'الدروس المكتملة',
      averageScore: 'متوسط الاختبارات',
      currentTrack: 'المسار النشط',
      nextUpTitle: 'الدرس الموصى به تالياً',
      continueBtn: 'متابعة الدرس',
      allCompletedTitle: 'تم إكمال المنهج بالكامل',
      allCompletedDesc: 'لقد أكملت جميع الدروس في منهج CodePath لتطوير الويب المتكامل.',
      trackBreakdown: 'التقدم حسب المسار',
      settingsTitle: 'الإعدادات والتفضيلات',
      settingsDesc: 'تُطبّق التغييرات فوراً مع الحفاظ الكامل على تقدمك الدراسي.',
      appearanceLabel: 'المظهر',
      languageLabel: 'لغة الواجهة والمنهج',
      resetProgressLabel: 'تقدم التعلّم',
      resetProgressBtn: 'إعادة تعيين التقدم',
      resetConfirmText: 'سيؤدي هذا إلى مسح جميع الدروس المكتملة ونتائج الاختبارات. هل تريد المتابعة؟',
      cancelBtn: 'إلغاء',
      confirmResetBtn: 'تأكيد المسح',
      tokensEarnedKpi: 'الرموز الرقمية',
      tokensSectionTitle: 'خزنة الرموز الرقمية',
      tokensSectionDesc: 'يمنحك كل درس مكتمل رمزاً رقمياً فريداً. تطفو الرموز المكتسبة بحركة سلسة داخل مجموعتك.',
      filterAll: 'الكل',
      filterEarned: 'المكتسبة',
      filterLocked: 'المقفلة',
      trackAll: 'جميع المسارات',
      tokenMintedLabel: 'رمز مكتسب',
      tokenLockedLabel: 'مقفل',
      earnedOnLabel: 'تاريخ الاكتساب',
      unlockRequirementLabel: 'أكمل هذا الدرس واجتز اختباره لفتح واكتساب هذا الرمز.',
      reviewLessonBtn: 'مراجعة الدرس',
      openLessonBtn: 'بدء الدرس',
      lockedPrevHint: 'أكمل الدروس السابقة أولاً لفتح هذا الدرس',
      emptyEarnedTitle: 'لا توجد رموز رقمية مكتسبة بعد',
      emptyEarnedDesc: 'أكمل درسك الأول لاكتساب الرمز CP-01 ومشاهدته يطفو في مجموعتك.',
      startFirstLessonBtn: 'افتح الدرس الأول',
      tokenCodeLabel: 'معرّف الرمز',
      tokenTrackLabel: 'المسار',
      tokenConceptLabel: 'المفهوم',
      dailyStreakLabel: 'السلسلة اليومية',
      streakDaySingular: 'يوم',
      streakDayPlural: 'أيام',
      streakTodayDone: 'تم إنجاز درس اليوم',
      streakKeepGoing: 'أكمل درساً اليوم لمواصلة السلسلة',
      streakStartHint: 'أكمل درساً اليوم لبدء اليوم الأول',
      longestStreakLabel: 'أطول سلسلة',
      activeDaysLabel: 'أيام النشاط',
      last7DaysLabel: 'آخر 7 أيام',
      todayShortLabel: 'اليوم',
      milestonesSectionTitle: 'أوسمة الإنجازات والمراحل',
      milestonesSectionDesc:
        'افتح أوسمة الدروع الهندسية عند إتمام الشباتر، سلاسل المراجعة، المسارات الكاملة، والسلاسل اليومية.',
      milestoneAll: 'الكل',
      milestoneUnlocked: 'المفتوحة',
      milestoneInProgress: 'المقفلة',
      milestoneCatAll: 'كل الفئات',
      milestoneCatChapter: 'الشباتر',
      milestoneCatTrack: 'المسارات',
      milestoneCatSeries: 'السلاسل',
      milestoneCatStreak: 'الاستمرارية',
      milestoneEarnedLabel: 'مفتوح',
      milestoneLockedLabel: 'مقفل',
      milestoneProgressLabel: 'التقدم',
      tierBronze: 'برونزي',
      tierSilver: 'فضي',
      tierGold: 'ذهبي',
      tierApex: 'نهائي',
      milestoneEmptyTitle: 'لا توجد أوسمة مطابقة لهذا الفلتر',
      milestoneEmptyDesc:
        'استمر في إتمام الشباتر ومحطات المراجعة والسلاسل اليومية لفتح الأوسمة هنا.',
      milestoneJumpBtn: 'انتقل للمسار المرتبط',
    },
    footer: {
      copyright: '© 2026 CodePath. جميع الحقوق محفوظة.',
      builtFor: 'تعلّم. تدرّب. ابنِ. انشر.',
    },
  },
};
