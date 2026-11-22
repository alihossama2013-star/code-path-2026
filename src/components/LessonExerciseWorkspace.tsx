import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Columns2,
  Globe,
  Play,
  RefreshCw,
  RotateCcw,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { lessons } from '../data/curriculum';
import {
  ExerciseValidationResult,
  extractHtmlTitle,
  getExerciseStarter,
  validateExercise,
} from '../data/exerciseTasks';
import { Lesson, PlaygroundStarter } from '../data/types';
import { EASE_SETTLE, MilestoneCelebration, SPRING_SNAPPY } from './MotionPrimitives';

type WorkspaceMode = 'code' | 'preview' | 'split';
type CodeLangTab = 'html' | 'css' | 'js';

interface LessonExerciseWorkspaceProps {
  lesson: Lesson;
  isPassed: boolean;
  onExercisePassed: () => void;
  onProceedToAssessment: () => void;
}

export function LessonExerciseWorkspace({
  lesson,
  isPassed,
  onExercisePassed,
  onProceedToAssessment,
}: LessonExerciseWorkspaceProps) {
  const { t, lang, loadStarterInPlayground } = useApp();

  const [mode, setMode] = useState<WorkspaceMode>('code');
  const [codeTab, setCodeTab] = useState<CodeLangTab>(
    lesson.languageId === 'css' ? 'css' : lesson.languageId === 'javascript' ? 'js' : 'html'
  );
  const [code, setCode] = useState<PlaygroundStarter>(() => getExerciseStarter(lesson));
  const [previewNonce, setPreviewNonce] = useState(0);
  const [result, setResult] = useState<ExerciseValidationResult | null>(null);

  useEffect(() => {
    setCode(getExerciseStarter(lesson));
    setCodeTab(
      lesson.languageId === 'css' ? 'css' : lesson.languageId === 'javascript' ? 'js' : 'html'
    );
    setMode('code');
    setResult(null);
    setPreviewNonce((n) => n + 1);
  }, [lesson.id, lesson.languageId]);

  const ForwardArrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const liveTitle = useMemo(() => {
    const extracted = extractHtmlTitle(code.html);
    return extracted || t.lesson.untitledPage;
  }, [code.html, t.lesson.untitledPage]);

  const srcDoc = useMemo(() => {
    const trimmed = code.html.trim();
    const isFullDoc = /<!doctype/i.test(trimmed) || /<html[\s>]/i.test(trimmed);
    const isTableLesson =
      lesson.chapterId === 'html-ch-08' ||
      Boolean(lesson.reviewedLessonIds?.some((id) => id.startsWith('html-08-')));
    const basePreviewCss =
      lesson.languageId === 'html'
        ? `body{font-family:system-ui,sans-serif;padding:24px;line-height:1.6;color:#111111;}${
            isTableLesson
              ? 'table{border-collapse:collapse;width:100%;}th,td{border:1px solid #111111;padding:8px 12px;text-align:left;}'
              : ''
          }`
        : '';
    const combinedCss = `${basePreviewCss}${code.css}`;

    if (isFullDoc) {
      let docHtml = code.html;
      if (combinedCss.trim()) {
        const styleTag = `<style>${combinedCss}</style>`;
        docHtml = /<\/head>/i.test(docHtml)
          ? docHtml.replace(/<\/head>/i, `${styleTag}</head>`)
          : `${styleTag}${docHtml}`;
      }
      if (code.js.trim()) {
        const scriptTag = `<script>try{${code.js}}catch(e){console.error(e);}<\/script>`;
        docHtml = /<\/body>/i.test(docHtml)
          ? docHtml.replace(/<\/body>/i, `${scriptTag}</body>`)
          : `${docHtml}${scriptTag}`;
      }
      return docHtml;
    }

    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>${combinedCss}</style>
  </head>
  <body>
    ${code.html}
    <script>try{${code.js}}catch(e){console.error(e);}<\/script>
  </body>
</html>`;
  }, [code, lesson.chapterId, lesson.languageId, previewNonce]);

  const handleVerify = () => {
    setPreviewNonce((n) => n + 1);
    const checkResult = validateExercise(lesson, code, lang, lessons);
    setResult(checkResult);
    if (checkResult.passed) {
      onExercisePassed();
    }
  };

  const handleReset = () => {
    setCode(getExerciseStarter(lesson));
    setResult(null);
    setPreviewNonce((n) => n + 1);
  };

  return (
    <div className="space-y-6">
      {/* Task Brief */}
      <div className="rounded border border-[#E7E7E7] bg-[#F5F5F5] p-5 sm:p-6 dark:border-[#262626] dark:bg-[#191919]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#111111] dark:text-white">
            {t.lesson.challengeTitle}
          </h2>
          {isPassed && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111] dark:text-white">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.lesson.taskPassedTitle}</span>
            </span>
          )}
        </div>
        <p className="mt-2.5 text-[15px] leading-relaxed text-[#333333] dark:text-[#D4D4D4]">
          {lesson.challenge[lang]}
        </p>
      </div>

      {/* Workspace Mode Tabs: Code Editor | Web Preview | Split View */}
      <div className="overflow-hidden rounded border border-[#E7E7E7] bg-white dark:border-[#262626] dark:bg-[#191919]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7E7E7] bg-[#F5F5F5] px-4 py-2.5 dark:border-[#262626] dark:bg-[#141414]">
          <div className="flex items-center gap-1.5">
            {(
              [
                { id: 'code', label: t.lesson.exerciseEditorTab, Icon: Code2, responsive: '' },
                { id: 'preview', label: t.lesson.exerciseWebPreviewTab, Icon: Globe, responsive: '' },
                { id: 'split', label: t.lesson.exerciseSplitTab, Icon: Columns2, responsive: 'hidden md:inline-flex' },
              ] as const
            ).map(({ id, label, Icon, responsive }) => {
              const active = mode === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    if (id !== 'code') setPreviewNonce((n) => n + 1);
                    setMode(id);
                  }}
                  className={`relative inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${responsive} ${
                    active
                      ? 'text-white dark:text-[#111111]'
                      : 'text-[#555555] hover:bg-[#EAEAEA] hover:text-[#111111] dark:text-[#A3A3A3] dark:hover:bg-[#222222] dark:hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId={`exercise-mode-${lesson.id}`}
                      transition={SPRING_SNAPPY}
                      className="absolute inset-0 rounded bg-[#111111] dark:bg-white"
                    />
                  )}
                  <Icon className="relative z-10 h-3.5 w-3.5" aria-hidden="true" />
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded border border-[#E7E7E7] bg-white px-3 py-1.5 text-xs font-medium text-[#111111] transition-colors hover:bg-[#EAEAEA] dark:border-[#333333] dark:bg-[#191919] dark:text-white dark:hover:bg-[#262626]"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              <span>{t.lesson.resetStarterBtn}</span>
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={handleVerify}
              className="inline-flex items-center gap-1.5 rounded bg-[#111111] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#2B2B2B] dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
            >
              <Play className="h-3 w-3" aria-hidden="true" />
              <span>{t.lesson.verifyTaskBtn}</span>
            </motion.button>
          </div>
        </div>

        {/* Workspace Content */}
        <div
          className={`grid grid-cols-1 ${
            mode === 'split' ? 'md:grid-cols-2 md:divide-x md:divide-[#E7E7E7] md:dark:divide-[#262626]' : ''
          }`}
        >
          {/* Code Editor Pane */}
          {(mode === 'code' || mode === 'split') && (
            <div className="flex flex-col bg-[#111111]">
              <div
                className="flex items-center justify-between border-b border-[#262626] bg-[#191919] px-3 py-2"
                dir="ltr"
              >
                <div className="flex items-center gap-1">
                  {(
                    [
                      { id: 'html', label: t.playground.tabHtml },
                      { id: 'css', label: t.playground.tabCss },
                      { id: 'js', label: t.playground.tabJs },
                    ] as const
                  ).map((item) => {
                    const active = codeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCodeTab(item.id)}
                        className={`relative rounded px-2.5 py-1 font-mono text-xs transition-colors ${
                          active ? 'text-[#111111]' : 'text-[#A3A3A3] hover:text-white'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId={`exercise-codetab-${lesson.id}`}
                            transition={SPRING_SNAPPY}
                            className="absolute inset-0 rounded bg-white"
                          />
                        )}
                        <span className="relative z-10">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => loadStarterInPlayground(code)}
                  className="text-xs text-[#A3A3A3] hover:text-white"
                >
                  {t.lesson.tryInPlayground}
                </button>
              </div>

              <textarea
                value={code[codeTab]}
                onChange={(e) => {
                  const nextVal = e.target.value;
                  setCode((prev) => ({ ...prev, [codeTab]: nextVal }));
                }}
                placeholder={
                  lang === 'ar'
                    ? `اكتب كود ${codeTab.toUpperCase()} هنا...`
                    : `Write your ${codeTab.toUpperCase()} code here...`
                }
                spellCheck={false}
                aria-label={codeTab}
                className="code-ltr min-h-[340px] w-full flex-1 resize-y bg-[#111111] p-4 font-mono text-[13px] leading-6 text-[#F5F5F5] placeholder:text-[#666666] focus:outline-none"
              />
            </div>
          )}

          {/* Direct Web Preview Tab Pane */}
          {(mode === 'preview' || mode === 'split') && (
            <div className="flex flex-col bg-white dark:bg-[#111111]">
              {/* Browser Tab Chrome showing live <title> */}
              <div className="flex items-center justify-between border-b border-[#E7E7E7] bg-[#F5F5F5] px-3 py-2 dark:border-[#262626] dark:bg-[#191919]">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-[11px] font-medium text-[#777777] dark:text-[#A3A3A3]">
                    {t.lesson.browserTabLabel}:
                  </span>
                  <div className="flex max-w-[260px] items-center gap-1.5 rounded-t border border-[#E7E7E7] bg-white px-3 py-1 text-xs font-medium text-[#111111] dark:border-[#333333] dark:bg-[#111111] dark:text-white">
                    <Globe className="h-3 w-3 shrink-0 text-[#777777]" aria-hidden="true" />
                    <span className="truncate">{liveTitle}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewNonce((n) => n + 1)}
                  aria-label={t.lesson.refreshPreviewBtn}
                  className="inline-flex items-center gap-1 rounded border border-[#E7E7E7] bg-white px-2.5 py-1 text-xs text-[#111111] hover:bg-[#EAEAEA] dark:border-[#333333] dark:bg-[#111111] dark:text-white dark:hover:bg-[#222222]"
                >
                  <RefreshCw className="h-3 w-3" aria-hidden="true" />
                  <span>{t.lesson.refreshPreviewBtn}</span>
                </button>
              </div>

              <iframe
                key={previewNonce}
                title={`Exercise Web Preview — ${liveTitle}`}
                sandbox="allow-scripts"
                srcDoc={srcDoc}
                className="min-h-[340px] w-full flex-1 bg-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* Verification Checklist & Gate to Assessment */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={`result-${result.passed}-${previewNonce}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.24, ease: EASE_SETTLE }}
            className="space-y-4"
          >
            {result.passed && (
              <MilestoneCelebration
                active={result.passed}
                triggerKey={`ex-pass-${lesson.id}-${previewNonce}`}
                title={t.lesson.taskPassedTitle}
                subtitle={result.feedback}
              />
            )}

            <div
              className={`rounded border p-5 ${
                result.passed
                  ? 'border-[#111111] bg-[#F5F5F5] dark:border-white dark:bg-[#191919]'
                  : 'border-[#E7E7E7] bg-white dark:border-[#333333] dark:bg-[#191919]'
              }`}
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-sm font-semibold text-[#111111] dark:text-white">
                    {result.passed ? t.lesson.taskPassedTitle : t.lesson.taskFailedTitle}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#555555] dark:text-[#A3A3A3]">
                    {result.feedback}
                  </p>
                </div>

                {result.passed && (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={onProceedToAssessment}
                    className="inline-flex h-9 shrink-0 items-center gap-2 rounded bg-[#111111] px-4 text-xs font-medium text-white transition-colors hover:bg-[#2B2B2B] dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
                  >
                    <span>{t.lesson.proceedToAssessmentBtn}</span>
                    <ForwardArrow className="h-3.5 w-3.5" aria-hidden="true" />
                  </motion.button>
                )}
              </div>

              <ul className="mt-4 space-y-2 border-t border-[#E7E7E7] pt-4 dark:border-[#262626]">
                {result.checks.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: lang === 'ar' ? 8 : -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.045, duration: 0.2, ease: EASE_SETTLE }}
                    className="flex items-start gap-2.5 text-xs"
                  >
                    {item.ok ? (
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#111111] dark:text-white"
                        aria-hidden="true"
                      />
                    ) : (
                      <X
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#777777] dark:text-[#A3A3A3]"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={
                        item.ok
                          ? 'font-medium text-[#111111] dark:text-white'
                          : 'text-[#777777] dark:text-[#A3A3A3]'
                      }
                    >
                      {item.label}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* If already passed on a previous visit, allow quick jump to Assessment */}
      {!result && isPassed && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING_SNAPPY}
          className="flex flex-wrap items-center justify-between gap-4 rounded border border-[#111111] bg-[#F5F5F5] p-4 dark:border-white dark:bg-[#191919]"
        >
          <span className="text-xs font-medium text-[#111111] dark:text-white">
            {t.lesson.taskPassedTitle}
          </span>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={onProceedToAssessment}
            className="inline-flex h-9 items-center gap-2 rounded bg-[#111111] px-4 text-xs font-medium text-white transition-colors hover:bg-[#2B2B2B] dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
          >
            <span>{t.lesson.proceedToAssessmentBtn}</span>
            <ForwardArrow className="h-3.5 w-3.5" aria-hidden="true" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
