import { lazy, Suspense } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { SignInView } from './components/SignInView';
import { PageReveal } from './components/MotionPrimitives';
import { ErrorBoundary } from './components/ErrorBoundary';

const LandingView = lazy(() =>
  import('./components/LandingView').then((m) => ({ default: m.LandingView }))
);
const RoadmapView = lazy(() =>
  import('./components/RoadmapView').then((m) => ({ default: m.RoadmapView }))
);
const LessonView = lazy(() =>
  import('./components/LessonView').then((m) => ({ default: m.LessonView }))
);
const PlaygroundView = lazy(() =>
  import('./components/PlaygroundView').then((m) => ({ default: m.PlaygroundView }))
);
const Stack3DView = lazy(() =>
  import('./components/Stack3DView').then((m) => ({ default: m.Stack3DView }))
);
const DashboardView = lazy(() =>
  import('./components/DashboardView').then((m) => ({ default: m.DashboardView }))
);

function ViewFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <span className="font-mono text-xs text-[#777777] dark:text-[#A3A3A3]">CodePath...</span>
    </div>
  );
}

function AppShell() {
  const { view, t, user, authLoading, progressReady } = useApp();

  if (authLoading || (user && !progressReady)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-[#111111] dark:bg-[#111111] dark:text-white">
        <span className="font-mono text-xs text-[#777777] dark:text-[#A3A3A3]">
          {user ? t.auth.loadingWorkspace : 'CodePath...'}
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-[#111111] transition-colors duration-150 dark:bg-[#111111] dark:text-white">
        <Navbar />
        <main className="flex-1">
          <PageReveal>
            <SignInView />
          </PageReveal>
        </main>
        <footer className="border-t border-[#E7E7E7] bg-white py-6 dark:border-[#262626] dark:bg-[#111111]">
          <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-2 px-4 text-xs text-[#777777] sm:flex-row sm:px-6 lg:px-8 dark:text-[#A3A3A3]">
            <span>{t.footer.copyright}</span>
            <span>{t.footer.builtFor}</span>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111] transition-colors duration-150 dark:bg-[#111111] dark:text-white">
      <Navbar />

      <main className="flex-1">
        <Suspense fallback={<ViewFallback />}>
          <AnimatePresence mode="wait">
            <PageReveal key={view}>
              {view === 'landing' && <LandingView />}
              {view === 'roadmap' && <RoadmapView />}
              {view === 'lesson' && <LessonView />}
              {view === 'playground' && <PlaygroundView />}
              {view === 'stack3d' && <Stack3DView />}
              {view === 'dashboard' && <DashboardView />}
              {view === 'signin' && <SignInView />}
            </PageReveal>
          </AnimatePresence>
        </Suspense>
      </main>

      {view !== 'stack3d' && (
        <footer className="border-t border-[#E7E7E7] bg-white py-8 dark:border-[#262626] dark:bg-[#111111]">
          <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-2 px-4 text-xs text-[#777777] sm:flex-row sm:px-6 lg:px-8 dark:text-[#A3A3A3]">
            <span>{t.footer.copyright}</span>
            <span>{t.footer.builtFor}</span>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <AppProvider>
          <AppShell />
        </AppProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
