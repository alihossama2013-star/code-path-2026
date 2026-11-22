import { useEffect, useMemo, useState } from 'react';
import { Check, Code2, Columns2, Globe, Play, RefreshCw, RotateCcw, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { extractHtmlTitle } from '../data/exerciseTasks';
import { CodeQuizCheck, CodeQuizQuestion, PlaygroundStarter } from '../data/types';
import { EASE_SETTLE, SPRING_SNAPPY } from './MotionPrimitives';

type CardMode = 'code' | 'preview' | 'split';

interface AssessmentCodeQuestionCardProps {
  index: number;
  question: CodeQuizQuestion;
  value: PlaygroundStarter;
  result?: {
    passed: boolean;
    checks: CodeQuizCheck[];
  };
  disabled?: boolean;
  resetSignal?: number;
  onChange: (next: PlaygroundStarter) => void;
  onCheck: () => void;
}

export function AssessmentCodeQuestionCard({
  index,
  question,
  value,
  result,
  disabled = false,
  resetSignal = 0,
  onChange,
  onCheck,
}: AssessmentCodeQuestionCardProps) {
  const { t, lang } = useApp();
  const [mode, setMode] = useState<CardMode>('code');
  const [previewNonce, setPreviewNonce] = useState(0);

  useEffect(() => {
    setMode('code');
    setPreviewNonce((n) => n + 1);
  }, [question.id, resetSignal]);

  const activeField: keyof PlaygroundStarter =
    question.language === 'css' ? 'css' : question.language === 'javascript' ? 'js' : 'html';

  const liveTitle = useMemo(() => {
    const extracted = extractHtmlTitle(value.html);
    return extracted || t.lesson.untitledPage;
  }, [value.html, t.lesson.untitledPage]);

  const srcDoc = useMemo(() => {
    if (question.language === 'css') {
      return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body { font-family: system-ui, sans-serif; padding: 18px; color: #111111; margin: 0; background: #ffffff; }
      .harness-note { font-size: 11px; color: #777777; margin-bottom: 12px; }
      .grid > div, .card, .bar, .nav, .center { border: 1px solid #d4d4d4; padding: 10px; }
      ${value.css}
    </style>
  </head>
  <body>
    <div class="harness-note">CSS Preview Stage (.nav / .bar / .card / .center / .grid)</div>
    <header class="nav bar"><strong>CodePath</strong><span>Nav Item</span></header>
    <div class="card center" style="margin-top:12px;">
      <span>Box Item</span>
    </div>
    <section class="grid" style="margin-top:12px;">
      <div>01</div><div>02</div><div>03</div>
    </section>
  </body>
</html>`;
    }

    if (question.language === 'javascript') {
      const escapedCode = value.js;
      return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body { font-family: system-ui, sans-serif; padding: 16px; color: #111111; margin: 0; background: #ffffff; font-size: 13px; }
      button { background: #111111; color: #ffffff; border: 0; padding: 6px 12px; cursor: pointer; font-size: 12px; }
      #stage-out { margin-top: 10px; padding: 10px; background: #f5f5f5; border: 1px solid #e7e7e7; font-family: monospace; font-size: 12px; white-space: pre-wrap; min-height: 44px; }
    </style>
  </head>
  <body>
    <button id="demo-btn" type="button">Trigger Click</button>
    <p id="status" style="margin:8px 0 0;">Preview DOM target (#status / button)</p>
    <div id="stage-out">Console output appears here...</div>
    <script>
      (function () {
        var out = document.getElementById('stage-out');
        var logs = [];
        var origLog = console.log;
        console.log = function () {
          var args = Array.prototype.slice.call(arguments).map(function (a) {
            try { return typeof a === 'object' ? JSON.stringify(a) : String(a); } catch (e) { return String(a); }
          });
          logs.push(args.join(' '));
          out.textContent = logs.join('\\n');
          if (origLog) origLog.apply(console, arguments);
        };
        var app = {
          get: function (path) { console.log('Registered GET ' + path); },
          post: function (path) { console.log('Registered POST ' + path); }
        };
        var process = { env: { API_KEY: 'configured-on-server' } };
        function useState(init) { return [init, function () {}]; }
        try {
          ${escapedCode}
        } catch (err) {
          if (logs.length === 0) {
            out.textContent = 'Preview note: ' + (err && err.message ? err.message : String(err));
          }
        }
      })();
    <\/script>
  </body>
</html>`;
    }

    const trimmed = value.html.trim();
    const isFullDoc = /<!doctype/i.test(trimmed) || /<html[\s>]/i.test(trimmed);
    const baseCss = `body{font-family:system-ui,sans-serif;padding:20px;line-height:1.6;color:#111111;margin:0;background:#ffffff;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #111111;padding:6px 10px;text-align:left;}`;
    if (isFullDoc) {
      const styleTag = `<style>${baseCss}</style>`;
      return /<\/head>/i.test(value.html)
        ? value.html.replace(/<\/head>/i, `${styleTag}</head>`)
        : `${styleTag}${value.html}`;
    }
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>${baseCss}</style>
  </head>
  <body>${value.html}</body>
</html>`;
  }, [question.language, value.css, value.html, value.js, previewNonce]);

  const languageBadge =
    question.language === 'css' ? 'CSS' : question.language === 'javascript' ? 'JS' : 'HTML';

  const statusText = !result
    ? t.lesson.codeUncheckedLabel
    : result.passed
      ? t.lesson.codePassedLabel
      : t.lesson.codeNotPassedLabel;

  const questionNum = String(index).padStart(2, '0');

  return (
    <div className="rounded border border-[#E7E7E7] bg-white p-5 sm:p-6 dark:border-[#262626] dark:bg-[#191919]">
      {/* Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-base font-medium text-[#111111] dark:text-white">
          <span className="me-2 font-mono text-xs text-[#777777] tabular-nums">
            {questionNum}.
          </span>
          {question.prompt[lang]}
        </p>

        <div className="flex shrink-0 items-center gap-3 text-xs">
          <span className="code-ltr font-mono font-semibold text-[#777777] dark:text-[#A3A3A3]">
            {languageBadge}
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={statusText}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.16, ease: EASE_SETTLE }}
              className={`inline-flex items-center gap-1 font-medium ${
                result?.passed
                  ? 'text-[#111111] dark:text-white'
                  : 'text-[#777777] dark:text-[#A3A3A3]'
              }`}
            >
              {result?.passed && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
              {result && !result.passed && <X className="h-3.5 w-3.5" aria-hidden="true" />}
              <span>{statusText}</span>
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Editor + Web Preview Workspace */}
      <div className="mt-4 overflow-hidden rounded border border-[#E7E7E7] bg-white dark:border-[#262626] dark:bg-[#111111]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7E7E7] bg-[#F5F5F5] px-3 py-2 dark:border-[#262626] dark:bg-[#141414]">
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
                  className={`relative inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${responsive} ${
                    active
                      ? 'text-white dark:text-[#111111]'
                      : 'text-[#555555] hover:bg-[#EAEAEA] hover:text-[#111111] dark:text-[#A3A3A3] dark:hover:bg-[#222222] dark:hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId={`assess-mode-${question.id}`}
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

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              disabled={disabled}
              onClick={() => {
                onChange({ html: '', css: '', js: '' });
                setPreviewNonce((n) => n + 1);
              }}
              className="inline-flex items-center gap-1 rounded border border-[#E7E7E7] bg-white px-2.5 py-1 text-xs font-medium text-[#111111] transition-colors hover:bg-[#EAEAEA] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#333333] dark:bg-[#191919] dark:text-white dark:hover:bg-[#262626]"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              <span>{t.lesson.resetStarterBtn}</span>
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              disabled={disabled}
              onClick={() => {
                setPreviewNonce((n) => n + 1);
                onCheck();
              }}
              className="inline-flex items-center gap-1.5 rounded bg-[#111111] px-3 py-1 text-xs font-medium text-white whitespace-nowrap transition-colors hover:bg-[#2B2B2B] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
            >
              <Play className="h-3 w-3" aria-hidden="true" />
              <span>{t.lesson.checkCodeBtn}</span>
            </motion.button>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 ${
            mode === 'split'
              ? 'md:grid-cols-2 md:divide-x md:divide-[#E7E7E7] md:dark:divide-[#262626]'
              : ''
          }`}
        >
          {(mode === 'code' || mode === 'split') && (
            <div className="flex flex-col bg-[#111111]">
              <textarea
                value={value[activeField]}
                disabled={disabled}
                onChange={(e) => {
                  const nextText = e.target.value;
                  onChange({ ...value, [activeField]: nextText });
                }}
                placeholder={
                  lang === 'ar'
                    ? `اكتب كود ${languageBadge} هنا...`
                    : `Write your ${languageBadge} solution here...`
                }
                spellCheck={false}
                aria-label={`${questionNum} ${languageBadge}`}
                className="code-ltr min-h-[190px] w-full flex-1 resize-y bg-[#111111] p-4 font-mono text-[13px] leading-6 text-[#F5F5F5] placeholder:text-[#666666] focus:outline-none disabled:opacity-70"
              />
            </div>
          )}

          {(mode === 'preview' || mode === 'split') && (
            <div className="flex flex-col bg-white dark:bg-[#111111]">
              <div className="flex items-center justify-between border-b border-[#E7E7E7] bg-[#F5F5F5] px-3 py-1.5 dark:border-[#262626] dark:bg-[#191919]">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-[11px] font-medium text-[#777777] dark:text-[#A3A3A3]">
                    {t.lesson.browserTabLabel}:
                  </span>
                  <div className="flex max-w-[200px] items-center gap-1 rounded-t border border-[#E7E7E7] bg-white px-2.5 py-0.5 text-xs font-medium text-[#111111] dark:border-[#333333] dark:bg-[#111111] dark:text-white">
                    <Globe className="h-3 w-3 shrink-0 text-[#777777]" aria-hidden="true" />
                    <span className="truncate">{liveTitle}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewNonce((n) => n + 1)}
                  aria-label={t.lesson.refreshPreviewBtn}
                  className="inline-flex items-center gap-1 rounded border border-[#E7E7E7] bg-white px-2 py-0.5 text-[11px] text-[#111111] hover:bg-[#EAEAEA] dark:border-[#333333] dark:bg-[#111111] dark:text-white dark:hover:bg-[#222222]"
                >
                  <RefreshCw className="h-3 w-3" aria-hidden="true" />
                  <span>{t.lesson.refreshPreviewBtn}</span>
                </button>
              </div>
              <iframe
                key={previewNonce}
                title={`Assessment Q${questionNum} Preview`}
                sandbox="allow-scripts"
                srcDoc={srcDoc}
                className="min-h-[190px] w-full flex-1 bg-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* Verification Checks Feedback */}
      <AnimatePresence>
        {result && (
          <motion.ul
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: EASE_SETTLE }}
            className="mt-3 space-y-1.5 border-t border-[#E7E7E7] pt-3 dark:border-[#262626]"
          >
            {result.checks.map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: lang === 'ar' ? 6 : -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.18, ease: EASE_SETTLE }}
                className="flex items-start gap-2 text-xs"
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
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
