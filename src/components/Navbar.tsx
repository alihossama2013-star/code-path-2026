import { useState } from 'react';
import { Globe, LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useApp } from '../context/AppContext';
import { AppView } from '../i18n/translations';
import { EASE_SETTLE, ScrollProgressLine, SPRING_SNAPPY } from './MotionPrimitives';

export function Navbar() {
  const {
    t,
    toggleLang,
    theme,
    toggleTheme,
    view,
    setView,
    setSelectedLanguageId,
    user,
    signOutUser,
  } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 12);
  });

  const navItems: { id: AppView; label: string }[] = [
    { id: 'landing', label: t.nav.overview },
    { id: 'roadmap', label: t.nav.roadmap },
    { id: 'playground', label: t.nav.playground },
    { id: 'stack3d', label: t.nav.stack3d },
    { id: 'dashboard', label: t.nav.dashboard },
  ];

  const handleNav = (id: AppView) => {
    if (id === 'roadmap') {
      setSelectedLanguageId(null);
    }
    setView(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b border-[#E7E7E7] transition-colors duration-200 dark:border-[#262626] ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md dark:bg-[#111111]/90'
          : 'bg-white dark:bg-[#111111]'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Brand Zone */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => handleNav('landing')}
          className="shrink-0 whitespace-nowrap text-lg font-bold tracking-tight text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] dark:text-white dark:focus-visible:outline-white"
        >
          {t.brand}
        </motion.button>

        {/* Center Navigation Links (only when signed in) */}
        {user && (
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = view === item.id || (item.id === 'roadmap' && view === 'lesson');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`relative shrink-0 whitespace-nowrap py-1.5 text-sm font-medium transition-colors duration-150 ${
                    active
                      ? 'text-[#111111] dark:text-white'
                      : 'text-[#777777] hover:text-[#111111] dark:text-[#A3A3A3] dark:hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <motion.span
                      layoutId="navbar-active-indicator"
                      transition={SPRING_SNAPPY}
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-[#111111] dark:bg-white"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Controls & Auth Action */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={toggleLang}
            aria-label={t.language.label}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded border border-[#E7E7E7] px-2.5 text-xs font-medium text-[#111111] transition-colors hover:bg-[#F5F5F5] dark:border-[#2A2A2A] dark:text-white dark:hover:bg-[#191919]"
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t.language.switchTo}</span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            aria-label={t.theme.toggleLabel}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded border border-[#E7E7E7] text-[#111111] transition-colors hover:bg-[#F5F5F5] dark:border-[#2A2A2A] dark:text-white dark:hover:bg-[#191919]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -25, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 25, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.16, ease: EASE_SETTLE }}
                className="inline-flex"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {user && (
            <>
              <span
                title={user.email ?? user.displayName ?? undefined}
                className="hidden max-w-[160px] truncate text-xs text-[#777777] xl:inline-block dark:text-[#A3A3A3]"
              >
                {user.email ?? user.displayName}
              </span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={signOutUser}
                className="hidden h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded border border-[#E7E7E7] px-3 text-xs font-medium text-[#111111] transition-colors hover:bg-[#F5F5F5] sm:inline-flex dark:border-[#2A2A2A] dark:text-white dark:hover:bg-[#191919]"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t.auth.signOut}</span>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label="Toggle menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded border border-[#E7E7E7] text-[#111111] md:hidden dark:border-[#2A2A2A] dark:text-white"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_SETTLE }}
            className="overflow-hidden border-t border-[#E7E7E7] bg-white md:hidden dark:border-[#262626] dark:bg-[#111111]"
          >
            <nav className="flex flex-col gap-2 px-4 py-4">
              {navItems.map((item) => {
                const active = view === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.id)}
                    className={`rounded px-3 py-2.5 text-start text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#F5F5F5] text-[#111111] dark:bg-[#191919] dark:text-white'
                        : 'text-[#777777] hover:bg-[#F5F5F5] dark:text-[#A3A3A3] dark:hover:bg-[#191919]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    signOutUser();
                    setMobileOpen(false);
                  }}
                  className="mt-2 rounded border border-[#E7E7E7] px-4 py-2.5 text-center text-sm font-medium text-[#111111] dark:border-[#2A2A2A] dark:text-white"
                >
                  {t.auth.signOut}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleNav('signin')}
                  className="mt-2 rounded bg-[#111111] px-4 py-2.5 text-center text-sm font-medium text-white dark:bg-white dark:text-[#111111]"
                >
                  {t.auth.signInNav}
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {user && view !== 'stack3d' && (
        <div className="absolute inset-x-0 bottom-0">
          <ScrollProgressLine />
        </div>
      )}
    </header>
  );
}
