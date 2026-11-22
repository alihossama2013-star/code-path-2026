import { useEffect, useMemo, useState } from 'react';
import { Check, Play, RotateCcw, Save, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { playgroundTemplates } from '../data/curriculum';
import { EASE_SETTLE, SPRING_SNAPPY } from './MotionPrimitives';

type CodeTab = 'html' | 'css' | 'js';

export function PlaygroundView() {
  const { t, playgroundCode, setPlaygroundCode, savePlaygroundCode } = useApp();
  const [activeTab, setActiveTab] = useState<CodeTab>('html');
  const [runNonce, setRunNonce] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [savedNotice, setSavedNotice] = useState(false);

  // Listen to console messages posted from sandboxed preview iframe
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data && event.data.source === 'codepath-sandbox') {
        setLogs((prev) => [...prev, String(event.data.message)]);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const srcDoc = useMemo(() => {
    const bridge = `
      <script>
        (function() {
          const send = (prefix, args) => {
            const text = args.map(a => {
              try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
              catch { return String(a); }
            }).join(' ');
            window.parent.postMessage({ source: 'codepath-sandbox', message: prefix + text }, '*');
          };
          const origLog = console.log;
          console.log = function(...args) { send('', args); origLog.apply(console, args); };
          console.error = function(...args) { send('[error] ', args); };
          window.onerror = function(msg) { send('[error] ', [msg]); };
        })();
      </script>
    `;
    return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>${playgroundCode.css}</style>
  </head>
  <body>
    ${playgroundCode.html}
    ${bridge}
    <script>
      try {
        ${playgroundCode.js}
      } catch (err) {
        console.error(err.message || err);
      }
    </script>
  </body>
</html>`;
  }, [playgroundCode, runNonce]);

  const handleRun = () => {
    setLogs([]);
    setRunNonce((n) => n + 1);
  };

  const handleSave = () => {
    savePlaygroundCode(playgroundCode);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1500);
  };

  const handleTemplate = (id: string) => {
    const tpl = playgroundTemplates[id];
    if (tpl) {
      setLogs([]);
      setPlaygroundCode(tpl);
      setRunNonce((n) => n + 1);
    }
  };

  const handleReset = () => {
    setLogs([]);
    setPlaygroundCode(playgroundTemplates.card);
    setRunNonce((n) => n + 1);
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header & Template Controls */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#E7E7E7] pb-6 lg:flex-row lg:items-end dark:border-[#262626]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl dark:text-white">
            {t.playground.title}
          </h1>
          <p className="mt-1 text-sm text-[#777777] dark:text-[#A3A3A3]">{t.playground.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {t.playground.templates.map((tpl) => (
            <motion.button
              key={tpl.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => handleTemplate(tpl.id)}
              className="rounded border border-[#E7E7E7] bg-white px-3 py-1.5 text-xs font-medium text-[#111111] transition-colors hover:bg-[#F5F5F5] dark:border-[#262626] dark:bg-[#191919] dark:text-white dark:hover:bg-[#262626]"
            >
              {tpl.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Code Editor (Always LTR) */}
        <div className="flex flex-col overflow-hidden rounded border border-[#E7E7E7] bg-[#111111] lg:col-span-6 dark:border-[#262626]">
          <div className="flex items-center justify-between border-b border-[#262626] bg-[#191919] px-3 py-2">
            <div className="flex items-center gap-1" dir="ltr">
              {(
                [
                  { id: 'html', label: t.playground.tabHtml },
                  { id: 'css', label: t.playground.tabCss },
                  { id: 'js', label: t.playground.tabJs },
                ] as const
              ).map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative rounded px-2.5 py-1 font-mono text-xs transition-colors ${
                      active ? 'text-[#111111]' : 'text-[#A3A3A3] hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="playground-code-tab"
                        transition={SPRING_SNAPPY}
                        className="absolute inset-0 rounded bg-white"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={handleSave}
                className="inline-flex items-center gap-1 rounded border border-[#333333] px-2.5 py-1 text-xs text-[#E7E7E7] hover:bg-[#262626]"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={savedNotice ? 'saved' : 'save'}
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 3 }}
                    transition={{ duration: 0.14 }}
                    className="inline-flex items-center gap-1"
                  >
                    {savedNotice ? (
                      <Check className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <Save className="h-3 w-3" aria-hidden="true" />
                    )}
                    <span>{savedNotice ? t.playground.saved : t.playground.saveCode}</span>
                  </motion.span>
                </AnimatePresence>
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={handleReset}
                className="inline-flex items-center gap-1 rounded border border-[#333333] px-2.5 py-1 text-xs text-[#E7E7E7] hover:bg-[#262626]"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                <span>{t.playground.resetCode}</span>
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={handleRun}
                className="inline-flex items-center gap-1 rounded bg-white px-3 py-1 text-xs font-medium text-[#111111] hover:bg-[#E7E7E7]"
              >
                <Play className="h-3 w-3" aria-hidden="true" />
                <span>{t.playground.runCode}</span>
              </motion.button>
            </div>
          </div>

          <textarea
            value={playgroundCode[activeTab]}
            onChange={(e) =>
              setPlaygroundCode((prev) => ({ ...prev, [activeTab]: e.target.value }))
            }
            spellCheck={false}
            aria-label={activeTab}
            className="code-ltr min-h-[420px] w-full flex-1 resize-none bg-[#111111] p-4 font-mono text-[13px] leading-6 text-[#F5F5F5] focus:outline-none"
          />
        </div>

        {/* Right: Live Preview + Console */}
        <div className="flex flex-col gap-4 lg:col-span-6">
          <div className="flex flex-1 flex-col overflow-hidden rounded border border-[#E7E7E7] bg-white dark:border-[#262626]">
            <div className="border-b border-[#E7E7E7] bg-[#F5F5F5] px-4 py-2 text-xs font-medium text-[#777777] dark:border-[#262626] dark:bg-[#191919] dark:text-[#A3A3A3]">
              {t.playground.previewTitle}
            </div>
            <iframe
              key={runNonce}
              title="CodePath Live Preview"
              sandbox="allow-scripts"
              srcDoc={srcDoc}
              className="min-h-[280px] w-full flex-1 bg-white"
            />
          </div>

          <div className="overflow-hidden rounded border border-[#E7E7E7] bg-[#111111] dark:border-[#262626]">
            <div className="flex items-center justify-between border-b border-[#262626] bg-[#191919] px-4 py-2 text-xs text-[#A3A3A3]">
              <span className="font-mono">{t.playground.consoleTitle}</span>
              <button
                type="button"
                onClick={() => setLogs([])}
                className="inline-flex items-center gap-1 text-xs text-[#A3A3A3] hover:text-white"
              >
                <Trash2 className="h-3 w-3" aria-hidden="true" />
                <span>{t.playground.clearConsole}</span>
              </button>
            </div>
            <div className="code-ltr h-32 overflow-y-auto p-3 font-mono text-xs text-[#E7E7E7]">
              {logs.length === 0 ? (
                <span className="text-[#777777]">{t.playground.consoleEmpty}</span>
              ) : (
                logs.map((line, i) => (
                  <motion.div
                    key={`${i}-${line}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16, ease: EASE_SETTLE }}
                    className="border-b border-[#1E1E1E] py-1 last:border-b-0"
                  >
                    {line}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
