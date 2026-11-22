import { useApp } from '../context/AppContext';
import { getLessonDiagramSpec } from '../data/lessonDiagrams';
import { Lesson } from '../data/types';

interface LessonDiagramProps {
  lesson: Lesson;
}

export function LessonDiagram({ lesson }: LessonDiagramProps) {
  const { lang, t } = useApp();
  const spec = getLessonDiagramSpec(lesson);

  if (!spec) {
    return null;
  }

  return (
    <div className="flex h-full flex-col justify-between rounded border border-[#E7E7E7] bg-white p-5 dark:border-[#262626] dark:bg-[#191919]">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7E7E7] pb-3 dark:border-[#262626]">
          <div>
            <p className="text-[11px] font-medium tracking-wide text-[#777777] dark:text-[#A3A3A3]">
              {t.lesson.mixedVisualDiagramLabel}
            </p>
            <h3 className="mt-0.5 text-sm font-semibold text-[#111111] dark:text-white">
              {spec.heading[lang]}
            </h3>
          </div>
          <span className="code-ltr font-mono text-[11px] font-medium text-[#555555] dark:text-[#D4D4D4]">
            {spec.badge}
          </span>
        </div>

        {/* Archetype Visual Renderer */}
        <div className="my-5">
          {spec.archetype === 'tree' && (
            <div className="flex flex-col items-center">
              {spec.nodes[0] && (
                <div className="w-full max-w-[260px] rounded border border-[#111111] bg-[#111111] px-4 py-2.5 text-center text-white dark:border-white dark:bg-white dark:text-[#111111]">
                  <div className="code-ltr font-mono text-xs font-bold">{spec.nodes[0].tag}</div>
                  <div className="mt-0.5 text-[11px] opacity-85">{spec.nodes[0].label[lang]}</div>
                  {spec.nodes[0].sub && (
                    <div className="code-ltr mt-0.5 font-mono text-[10px] opacity-70">
                      {spec.nodes[0].sub}
                    </div>
                  )}
                </div>
              )}

              {/* Connector Stem & Branch Bar */}
              <div className="flex w-full max-w-[360px] flex-col items-center">
                <div className="h-4 w-px bg-[#111111] dark:bg-[#777777]" />
                <div className="h-px w-3/4 bg-[#111111] dark:bg-[#777777]" />
                <div className="flex w-3/4 justify-between">
                  <div className="h-4 w-px bg-[#111111] dark:bg-[#777777]" />
                  <div className="h-4 w-px bg-[#111111] dark:bg-[#777777]" />
                </div>
              </div>

              <div
                className={`grid w-full gap-3 ${
                  spec.nodes.slice(1).length >= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
                }`}
              >
                {spec.nodes.slice(1).map((node, i) => (
                  <div
                    key={i}
                    className="rounded border border-[#E7E7E7] bg-[#F5F5F5] p-3 text-center dark:border-[#333333] dark:bg-[#111111]"
                  >
                    <div className="code-ltr font-mono text-xs font-semibold text-[#111111] dark:text-white">
                      {node.tag}
                    </div>
                    <div className="mt-1 text-xs text-[#555555] dark:text-[#D4D4D4]">
                      {node.label[lang]}
                    </div>
                    {node.sub && (
                      <div className="code-ltr mt-1 font-mono text-[10px] text-[#777777] dark:text-[#A3A3A3]">
                        {node.sub}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {spec.archetype === 'flow' && (
            <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
              {spec.nodes.map((node, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2.5 sm:flex-row">
                  <div
                    className={`w-full flex-1 rounded border p-3.5 ${
                      i === 0
                        ? 'border-[#111111] bg-[#111111] text-white dark:border-white dark:bg-white dark:text-[#111111]'
                        : 'border-[#E7E7E7] bg-[#F5F5F5] text-[#111111] dark:border-[#333333] dark:bg-[#111111] dark:text-white'
                    }`}
                  >
                    <div className="code-ltr font-mono text-xs font-bold break-words">
                      {node.tag}
                    </div>
                    <div className="mt-1 text-xs opacity-90">{node.label[lang]}</div>
                    {node.sub && (
                      <div className="code-ltr mt-1 font-mono text-[10px] opacity-70">
                        {node.sub}
                      </div>
                    )}
                  </div>

                  {i < spec.nodes.length - 1 && (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 shrink-0 rotate-90 text-[#777777] sm:rotate-0 dark:text-[#A3A3A3]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}

          {spec.archetype === 'layout' && (
            <div className="space-y-2.5 rounded border border-dashed border-[#CCCCCC] bg-[#FAFAFA] p-3.5 dark:border-[#333333] dark:bg-[#111111]">
              {spec.nodes.map((node, i) => (
                <div
                  key={i}
                  className={`flex flex-wrap items-center justify-between gap-2 rounded border px-3.5 py-2.5 ${
                    i === 0
                      ? 'border-[#111111] bg-white dark:border-white dark:bg-[#191919]'
                      : 'border-[#E7E7E7] bg-white dark:border-[#2A2A2A] dark:bg-[#161616]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] text-[#777777] tabular-nums dark:text-[#A3A3A3]">
                      0{i + 1}
                    </span>
                    <span className="code-ltr font-mono text-xs font-semibold text-[#111111] dark:text-white">
                      {node.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#555555] dark:text-[#D4D4D4]">
                    <span>{node.label[lang]}</span>
                    {node.sub && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="code-ltr font-mono text-[10px] text-[#777777] dark:text-[#A3A3A3]">
                          {node.sub}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {spec.archetype === 'pair' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {spec.nodes.map((node, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between rounded border border-[#E7E7E7] bg-[#F5F5F5] p-3.5 dark:border-[#2A2A2A] dark:bg-[#111111]"
                >
                  <div className="code-ltr font-mono text-xs font-bold text-[#111111] dark:text-white">
                    {node.tag}
                  </div>
                  <div className="mt-1.5 text-xs leading-relaxed text-[#555555] dark:text-[#D4D4D4]">
                    {node.label[lang]}
                  </div>
                  {node.sub && (
                    <div className="code-ltr mt-1.5 font-mono text-[10px] text-[#777777] dark:text-[#A3A3A3]">
                      {node.sub}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="border-t border-[#E7E7E7] pt-3 text-xs leading-relaxed text-[#777777] dark:border-[#262626] dark:text-[#A3A3A3]">
        {spec.footerNote[lang]}
      </p>
    </div>
  );
}
