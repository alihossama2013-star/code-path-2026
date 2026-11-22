import { useState } from 'react';
import { ArrowLeft, ArrowRight, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { OAuthError } from '../utils/authApi';
import { EASE_SETTLE, SPRING_SNAPPY } from './MotionPrimitives';

function GoogleMark() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.08 3.56-5.15 3.56-8.65z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.95H1.29v3.1A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.29A7.22 7.22 0 0 1 4.9 12c0-.8.14-1.57.38-2.29V6.61H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.39l3.99-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.61l3.99 3.1C6.23 6.87 8.88 4.76 12 4.76z"
      />
    </svg>
  );
}

export function SignInView() {
  const {
    t,
    lang,
    user,
    authLoading,
    signInWithGoogle,
    switchGoogleAccount,
    signOutUser,
    setView,
  } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const DirectionalArrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const mapAuthError = (err: unknown): string => {
    if (err instanceof OAuthError) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return t.auth.errorCancelled;
      }
      if (err.code === 'auth/popup-blocked') {
        return t.auth.errorPopupBlocked;
      }
      if (err.code === 'OAUTH_NOT_CONFIGURED') {
        return err.redirectUri
          ? `${t.auth.errorNotConfigured} (${err.redirectUri})`
          : t.auth.errorNotConfigured;
      }
    }
    return t.auth.errorGeneric;
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      setError(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={SPRING_SNAPPY}
        className="w-full max-w-[420px] rounded border border-[#E7E7E7] bg-white p-8 dark:border-[#262626] dark:bg-[#191919]"
      >
        <div className="border-b border-[#E7E7E7] pb-6 dark:border-[#262626]">
          <p className="font-mono text-xs text-[#777777] dark:text-[#A3A3A3]">/signin</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
            {t.auth.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#777777] dark:text-[#A3A3A3]">
            {t.auth.subtitle}
          </p>
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {authLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-11 w-full rounded bg-[#F5F5F5] dark:bg-[#262626]"
              />
            ) : user ? (
              <motion.div
                key="signed-in"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE_SETTLE }}
                className="space-y-4"
              >
                <div className="rounded border border-[#E7E7E7] bg-[#F5F5F5] p-4 dark:border-[#262626] dark:bg-[#111111]">
                  <p className="text-xs text-[#777777] dark:text-[#A3A3A3]">
                    {t.auth.signedInAs}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#111111] dark:text-white">
                    {user.displayName ?? user.email}
                  </p>
                  {user.email && (
                    <p className="font-mono text-xs text-[#777777] dark:text-[#A3A3A3]">
                      {user.email}
                    </p>
                  )}
                </div>

                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('dashboard')}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-[#111111] px-4 text-sm font-medium text-white transition-colors hover:bg-[#2B2B2B] dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
                >
                  <span>{t.auth.goToDashboard}</span>
                  <DirectionalArrow className="h-4 w-4" aria-hidden="true" />
                </motion.button>

                <motion.button
                  type="button"
                  disabled={submitting}
                  whileTap={{ scale: 0.98 }}
                  onClick={async () => {
                    setError(null);
                    setSubmitting(true);
                    try {
                      await switchGoogleAccount();
                    } catch (err: unknown) {
                      setError(mapAuthError(err));
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-[#E7E7E7] px-4 text-xs font-medium text-[#111111] transition-colors hover:border-[#111111] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#333333] dark:text-white dark:hover:border-white"
                >
                  <GoogleMark />
                  <span>{submitting ? t.auth.switchingAccount : t.auth.switchAccount}</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={signOutUser}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-[#E7E7E7] px-4 text-xs font-medium text-[#777777] transition-colors hover:border-[#111111] hover:text-[#111111] dark:border-[#333333] dark:text-[#A3A3A3] dark:hover:border-white dark:hover:text-white"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t.auth.signOut}</span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="signed-out"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE_SETTLE }}
                className="space-y-4"
              >
                <motion.button
                  type="button"
                  disabled={submitting}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleSignIn}
                  className="inline-flex h-11 w-full items-center justify-center gap-3 rounded border border-[#111111] bg-[#111111] px-4 text-sm font-medium text-white transition-colors hover:bg-[#2B2B2B] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
                >
                  <GoogleMark />
                  <span>{submitting ? t.auth.signingIn : t.auth.continueWithGoogle}</span>
                </motion.button>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded border border-[#E7E7E7] bg-[#F5F5F5] px-3 py-2 text-xs text-[#111111] dark:border-[#333333] dark:bg-[#111111] dark:text-[#E7E7E7]"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <p className="text-xs leading-relaxed text-[#777777] dark:text-[#A3A3A3]">
                  {t.auth.googleOnlyNote}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
