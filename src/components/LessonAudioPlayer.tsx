import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Pause, Play, Square, Volume2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Lesson } from '../data/types';
import { EqualizerBars, SPRING_SNAPPY } from './MotionPrimitives';

type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';
type VoiceEngine = 'gemini' | 'browser' | null;
type VoiceLang = 'ar' | 'en';

const audioCache = new Map<string, string>();

function formatNarrationText(lesson: Lesson, targetLang: VoiceLang): string {
  const cleanTags = (text: string) =>
    text
      .replace(/<!DOCTYPE html>/gi, targetLang === 'ar' ? 'تصريح دوك تايب إتش تي إم إل' : 'DOCTYPE html')
      .replace(/<([a-zA-Z0-9-]+)([^>]*)>/g, (_m, tagName) =>
        targetLang === 'ar' ? ` وسم ${tagName} ` : ` ${tagName} tag `
      )
      .replace(/<\/([a-zA-Z0-9-]+)>/g, (_m, tagName) =>
        targetLang === 'ar' ? ` إغلاق وسم ${tagName} ` : ` closing ${tagName} `
      )
      .replace(/\s+/g, ' ')
      .trim();

  const title = lesson.title[targetLang];
  const exp = lesson.explanation;

  if (!exp) {
    return cleanTags(`${title}. ${lesson.summary[targetLang]}`);
  }

  const parts = [
    title,
    exp.overview[targetLang],
    exp.howItWorks[targetLang],
    ...exp.keyPoints[targetLang],
    targetLang === 'ar'
      ? `تنبيه مهم: ${exp.commonMistake.ar}`
      : `Common mistake to avoid: ${exp.commonMistake.en}`,
  ];

  return cleanTags(parts.join('. '));
}

interface LessonAudioPlayerProps {
  lesson: Lesson;
}

export function LessonAudioPlayer({ lesson }: LessonAudioPlayerProps) {
  const { t, lang } = useApp();

  const [voiceLang, setVoiceLang] = useState<VoiceLang>('ar');
  const [status, setStatus] = useState<PlaybackState>('idle');
  const [engine, setEngine] = useState<VoiceEngine>(null);
  const [rate, setRate] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stopAll = () => {
    abortRef.current?.abort();
    abortRef.current = null;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setStatus('idle');
    setProgress(0);
  };

  useEffect(() => {
    stopAll();
    setErrorMsg(null);
    setEngine(null);
  }, [lesson.id]);

  useEffect(() => {
    return () => {
      stopAll();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, [rate]);

  const narrationText = useMemo(
    () => formatNarrationText(lesson, voiceLang),
    [lesson, voiceLang]
  );

  const playWithBrowserSpeech = (text: string, targetLang: VoiceLang) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setStatus('error');
      setErrorMsg(t.lesson.voiceUnavailable);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith(targetLang)) ||
      voices.find((v) => v.lang.toLowerCase().includes(targetLang));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      setEngine('browser');
      setStatus('playing');
      setProgress(15);
    };
    utterance.onboundary = (event) => {
      if (text.length > 0 && typeof event.charIndex === 'number') {
        const pct = Math.min(98, Math.max(5, Math.round((event.charIndex / text.length) * 100)));
        setProgress(pct);
      }
    };
    utterance.onend = () => {
      setStatus('idle');
      setProgress(0);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setStatus('error');
      setErrorMsg(t.lesson.voiceUnavailable);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    setEngine('browser');
    setStatus('playing');
    window.speechSynthesis.speak(utterance);
  };

  const playBase64Audio = (base64Audio: string, mimeType: string) => {
    const audio = new Audio(`data:${mimeType};base64,${base64Audio}`);
    audio.playbackRate = rate;
    audioRef.current = audio;

    audio.ontimeupdate = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setProgress(Math.round((audio.currentTime / audio.duration) * 100));
      }
    };
    audio.onended = () => {
      setStatus('idle');
      setProgress(0);
      audioRef.current = null;
    };
    audio.onerror = () => {
      audioRef.current = null;
      playWithBrowserSpeech(narrationText, voiceLang);
    };

    setEngine('gemini');
    setStatus('playing');
    audio.play().catch(() => {
      audioRef.current = null;
      playWithBrowserSpeech(narrationText, voiceLang);
    });
  };

  const handlePlay = async (selectedLang: VoiceLang) => {
    if (status === 'paused' && selectedLang === voiceLang) {
      if (engine === 'gemini' && audioRef.current) {
        audioRef.current.play().catch(() => undefined);
        setStatus('playing');
        return;
      }
      if (engine === 'browser' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
        setStatus('playing');
        return;
      }
    }

    stopAll();
    setVoiceLang(selectedLang);
    setErrorMsg(null);

    const textToSpeak = formatNarrationText(lesson, selectedLang);
    const cacheKey = `${lesson.id}:${selectedLang}`;
    const cached = audioCache.get(cacheKey);
    if (cached) {
      playBase64Audio(cached, 'audio/wav');
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setStatus('loading');

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak, lang: selectedLang }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`TTS HTTP ${response.status}`);
      }

      const payload = (await response.json()) as { audioBase64?: string; mimeType?: string };
      if (!payload.audioBase64) {
        throw new Error('Missing audio payload');
      }

      audioCache.set(cacheKey, payload.audioBase64);
      if (!controller.signal.aborted) {
        playBase64Audio(payload.audioBase64, payload.mimeType || 'audio/wav');
      }
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') {
        return;
      }
      playWithBrowserSpeech(textToSpeak, selectedLang);
    }
  };

  const handlePause = () => {
    if (status !== 'playing') return;
    if (engine === 'gemini' && audioRef.current) {
      audioRef.current.pause();
      setStatus('paused');
    } else if (engine === 'browser' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setStatus('paused');
    }
  };

  const cycleRate = () => {
    const speeds = [0.85, 1, 1.15];
    const next = speeds[(speeds.indexOf(rate) + 1) % speeds.length];
    setRate(next);
  };

  const isActive = status === 'playing' || status === 'paused' || status === 'loading';

  return (
    <div className="rounded border border-[#E7E7E7] bg-[#F5F5F5] p-4 sm:p-5 dark:border-[#262626] dark:bg-[#191919]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded border border-[#E7E7E7] bg-white text-[#111111] dark:border-[#333333] dark:bg-[#111111] dark:text-white">
            {status === 'playing' ? (
              <EqualizerBars playing />
            ) : (
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-[#111111] dark:text-white">
                {t.lesson.listenArabicTitle}
              </h2>
              {engine && (
                <span className="text-[11px] font-medium text-[#777777] dark:text-[#A3A3A3]">
                  · {engine === 'gemini' ? t.lesson.voiceEngineGemini : t.lesson.voiceEngineBrowser}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-[#777777] dark:text-[#A3A3A3]">
              {status === 'loading'
                ? t.lesson.loadingVoice
                : status === 'playing'
                  ? t.lesson.playingVoice
                  : status === 'paused'
                    ? t.lesson.pausedVoice
                    : t.lesson.listenArabicSubtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isActive ? (
            <>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => handlePlay('ar')}
                className="inline-flex h-9 items-center gap-2 rounded bg-[#111111] px-4 text-xs font-medium text-white transition-colors hover:bg-[#2B2B2B] dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
              >
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t.lesson.listenBtnAr}</span>
              </motion.button>
              {lang === 'en' && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handlePlay('en')}
                  className="inline-flex h-9 items-center gap-1.5 rounded border border-[#E7E7E7] bg-white px-3 text-xs font-medium text-[#111111] transition-colors hover:bg-[#EAEAEA] dark:border-[#333333] dark:bg-[#111111] dark:text-white dark:hover:bg-[#222222]"
                >
                  <Play className="h-3 w-3" aria-hidden="true" />
                  <span>{t.lesson.listenBtnEn}</span>
                </motion.button>
              )}
            </>
          ) : (
            <>
              {status === 'loading' ? (
                <button
                  type="button"
                  disabled
                  className="inline-flex h-9 items-center gap-2 rounded bg-[#111111] px-4 text-xs font-medium text-white opacity-80 dark:bg-white dark:text-[#111111]"
                >
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  <span>{t.lesson.loadingVoice}</span>
                </button>
              ) : status === 'playing' ? (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={handlePause}
                  className="inline-flex h-9 items-center gap-1.5 rounded bg-[#111111] px-3.5 text-xs font-medium text-white transition-colors hover:bg-[#2B2B2B] dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
                >
                  <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t.lesson.pauseBtn}</span>
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handlePlay(voiceLang)}
                  className="inline-flex h-9 items-center gap-1.5 rounded bg-[#111111] px-3.5 text-xs font-medium text-white transition-colors hover:bg-[#2B2B2B] dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
                >
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t.lesson.resumeBtn}</span>
                </motion.button>
              )}

              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={stopAll}
                className="inline-flex h-9 items-center gap-1.5 rounded border border-[#E7E7E7] bg-white px-3 text-xs font-medium text-[#111111] transition-colors hover:bg-[#EAEAEA] dark:border-[#333333] dark:bg-[#111111] dark:text-white dark:hover:bg-[#222222]"
              >
                <Square className="h-3 w-3" aria-hidden="true" />
                <span>{t.lesson.stopBtn}</span>
              </motion.button>
            </>
          )}

          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={cycleRate}
            aria-label={t.lesson.speedLabel}
            className="inline-flex h-9 items-center rounded border border-[#E7E7E7] bg-white px-2.5 font-mono text-xs font-medium text-[#111111] tabular-nums transition-colors hover:bg-[#EAEAEA] dark:border-[#333333] dark:bg-[#111111] dark:text-white dark:hover:bg-[#222222]"
          >
            {rate}x
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={SPRING_SNAPPY}
            className="overflow-hidden"
          >
            <div className="mt-3 h-1 w-full overflow-hidden rounded-sm bg-[#E7E7E7] dark:bg-[#262626]">
              <motion.div
                className="h-full bg-[#111111] dark:bg-white"
                initial={{ width: '0%' }}
                animate={{ width: `${status === 'loading' ? 20 : Math.max(4, progress)}%` }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {errorMsg && (
        <p className="mt-2.5 text-xs text-[#777777] dark:text-[#A3A3A3]">{errorMsg}</p>
      )}
    </div>
  );
}
