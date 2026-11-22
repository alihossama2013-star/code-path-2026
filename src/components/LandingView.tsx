import { useState } from 'react';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { languages, lessons } from '../data/curriculum';
import { CodeSimulator } from './CodeSimulator';
import { EASE_SETTLE, ScrollParallax, ScrollReveal, SPRING_SNAPPY } from './MotionPrimitives';

type EditorTab = 'html' | 'js' | 'react';

const HERO_SNIPPETS: Record<EditorTab, { code: string; output: string }> = {
  html: {
    code: `<main class="profile">
  <h1>CodePath</h1>
  <p>From Zero to Developer.</p>
  <button>Start Learning</button>
</main>`,
    output: 'Rendered semantic <main> landmark with 1 heading, 1 paragraph, 1 action.',
  },
  js: {
    code: `const tracks = ['Foundations', 'JavaScript', 'Frontend', 'Backend'];

function getProgress(completed) {
  return Math.round((completed / 12) * 100) + '%';
}

console.log('Tracks:', tracks.length, '· Progress:', getProgress(4));`,
    output: 'Tracks: 4 · Progress: 33%',
  },
  react: {
    code: `export function CourseStatus({ completed }: { completed: number }) {
  return (
    <section>
      <h2>Curriculum Progress</h2>
      <p>{completed} of 12 lessons completed</p>
    </section>
  );
}`,
    output: 'Mounted <CourseStatus completed={4} /> → "4 of 12 lessons completed"',
  },
};

export function LandingView() {
  const { t, lang, setView, openLesson, openLanguage, isLanguageUnlocked, completedLessons } =
    useApp();
  const [activeTab, setActiveTab] = useState<EditorTab>('js');
  const [runCount, setRunCount] = useState(0);

  const DirectionalArrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const handleStart = () => {
    const next = lessons.find((l) => !completedLessons.includes(l.id)) ?? lessons[0];
    openLesson(next.id);
  };

  return (
    <div className="bg-white dark:bg-[#111111]">
      {/* Split-Layout Hero */}
      <section className="border-b border-[#E7E7E7] dark:border-[#262626]">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-stretch gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-24 lg:px-8">
          {/* Left Copy Column */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: EASE_SETTLE }}
              className="mb-4 text-xs font-medium tracking-wide text-[#777777] dark:text-[#A3A3A3]"
            >
              {t.hero.kicker}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: 0.05, ease: EASE_SETTLE }}
              className="max-w-xl text-4xl font-bold tracking-tight text-[#111111] [text-wrap:balance] sm:text-5xl lg:text-[54px] lg:leading-[1.1] dark:text-white"
            >
              {t.hero.headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: 0.1, ease: EASE_SETTLE }}
              className="mt-6 max-w-xl text-base leading-relaxed text-[#777777] sm:text-lg dark:text-[#A3A3A3]"
            >
              {t.hero.subheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15, ease: EASE_SETTLE }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded bg-[#111111] px-6 text-sm font-medium text-white transition-colors hover:bg-[#2B2B2B] dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
              >
                <span>{t.hero.primaryCta}</span>
                <DirectionalArrow className="h-4 w-4" aria-hidden="true" />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setView('roadmap')}
                className="inline-flex h-11 items-center whitespace-nowrap rounded border border-[#E7E7E7] bg-white px-6 text-sm font-medium text-[#111111] transition-colors hover:bg-[#F5F5F5] dark:border-[#2A2A2A] dark:bg-[#111111] dark:text-white dark:hover:bg-[#191919]"
              >
                {t.hero.secondaryCta}
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.22 }}
              className="mt-10 flex flex-wrap items-center gap-3 text-xs text-[#777777] dark:text-[#A3A3A3]"
            >
              <span>{t.philosophy}</span>
              <span aria-hidden="true">·</span>
              <span>
                {languages.length} {t.tracksOverview.exploreTrack === 'View Track' ? 'Tracks' : 'مسارات'}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {lessons.length} {t.tracksOverview.lessonsCount}
              </span>
            </motion.div>
          </div>

          {/* Right Authentic Code Editor Visual + Live Web Simulator */}
          <ScrollParallax offset={14} className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, delay: 0.12, ease: EASE_SETTLE }}
              className="flex flex-col gap-3"
            >
            <div className="flex flex-col overflow-hidden rounded border border-[#E7E7E7] bg-[#F5F5F5] dark:border-[#262626] dark:bg-[#191919]">
              {/* Editor Tab Bar */}
              <div className="flex items-center justify-between border-b border-[#E7E7E7] bg-white px-3 py-2 dark:border-[#262626] dark:bg-[#141414]">
                <div className="flex items-center gap-1" dir="ltr">
                  {(
                    [
                      { id: 'html', label: t.hero.editorFileHtml },
                      { id: 'js', label: t.hero.editorFileJs },
                      { id: 'react', label: t.hero.editorFileReact },
                    ] as const
                  ).map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative rounded px-2.5 py-1 font-mono text-xs transition-colors ${
                          isActive
                            ? 'text-white dark:text-[#111111]'
                            : 'text-[#777777] hover:text-[#111111] dark:text-[#A3A3A3] dark:hover:text-white'
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="hero-editor-tab-bg"
                            transition={SPRING_SNAPPY}
                            className="absolute inset-0 rounded bg-[#111111] dark:bg-white"
                          />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setRunCount((c) => c + 1)}
                  className="inline-flex items-center gap-1.5 rounded border border-[#E7E7E7] px-2.5 py-1 text-xs font-medium text-[#111111] transition-colors hover:bg-[#F5F5F5] dark:border-[#2A2A2A] dark:text-white dark:hover:bg-[#222222]"
                >
                  <Play className="h-3 w-3" aria-hidden="true" />
                  <span>{t.hero.editorRun}</span>
                </motion.button>
              </div>

              {/* Code Area (Always LTR) */}
              <div className="code-ltr overflow-x-auto bg-[#111111] p-5 text-[13px] leading-6 text-[#E7E7E7]">
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={activeTab}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16, ease: EASE_SETTLE }}
                    className="m-0"
                  >
                    <code>
                      {HERO_SNIPPETS[activeTab].code.split('\n').map((line, idx) => (
                        <div key={idx} className="flex">
                          <span className="w-8 shrink-0 select-none text-[#555555] tabular-nums">
                            {idx + 1}
                          </span>
                          <span>{line || ' '}</span>
                        </div>
                      ))}
                    </code>
                  </motion.pre>
                </AnimatePresence>
              </div>
            </div>

            <CodeSimulator
              key={activeTab}
              initialCode={HERO_SNIPPETS[activeTab].code}
              language={
                activeTab === 'html' ? 'html' : activeTab === 'js' ? 'javascript' : 'tsx'
              }
              defaultOpen={true}
              compact
              hideCollapse
              externalRunNonce={runCount}
              titleLabel={t.hero.editorOutputLabel}
            />
            </motion.div>
          </ScrollParallax>
        </div>
      </section>

      {/* 4-Stage Philosophy Section */}
      <section className="border-b border-[#E7E7E7] py-16 sm:py-20 dark:border-[#262626]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl dark:text-white">
              {t.pillars.heading}
            </h2>
            <p className="mt-3 text-base text-[#777777] dark:text-[#A3A3A3]">
              {t.pillars.subheading}
            </p>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.pillars.items.map((item, idx) => (
              <motion.div
                key={item.index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{ duration: 0.3, delay: idx * 0.06, ease: EASE_SETTLE }}
                whileHover={{ y: -3 }}
                className="border-t border-[#E7E7E7] pt-5 transition-colors hover:border-[#111111] dark:border-[#262626] dark:hover:border-white"
              >
                <span className="font-mono text-xs text-[#777777] tabular-nums dark:text-[#A3A3A3]">
                  {item.index}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-[#111111] dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#777777] dark:text-[#A3A3A3]">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks Overview */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-[#111111] sm:text-3xl dark:text-white">
              {t.tracksOverview.heading}
            </h2>
            <p className="mt-3 text-base text-[#777777] dark:text-[#A3A3A3]">
              {t.tracksOverview.subheading}
            </p>
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {languages.map((item, idx) => {
              const itemLessons = lessons.filter((l) => l.languageId === item.id);
              const unlocked = isLanguageUnlocked(item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 'some' }}
                  transition={{ duration: 0.3, delay: idx * 0.05, ease: EASE_SETTLE }}
                  whileHover={unlocked ? { y: -3 } : undefined}
                  className="flex flex-col justify-between rounded border border-[#E7E7E7] bg-white p-6 transition-colors hover:border-[#111111] dark:border-[#262626] dark:bg-[#191919] dark:hover:border-white"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#777777] dark:text-[#A3A3A3]">
                      <span className="font-mono tabular-nums">{item.number}</span>
                      <span className="tabular-nums">
                        {itemLessons.length} {t.tracksOverview.lessonsCount}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-[#111111] dark:text-white">
                      {item.title[lang]}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#777777] dark:text-[#A3A3A3]">
                      {item.description[lang]}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#E7E7E7] pt-4 dark:border-[#262626]">
                    <motion.button
                      type="button"
                      disabled={!unlocked}
                      whileTap={unlocked ? { scale: 0.97 } : undefined}
                      onClick={() => openLanguage(item.id)}
                      className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                        unlocked
                          ? 'text-[#111111] hover:underline dark:text-white'
                          : 'cursor-not-allowed text-[#777777] opacity-50'
                      }`}
                    >
                      <span>{unlocked ? t.tracksOverview.exploreTrack : t.roadmap.lockedBtn}</span>
                      <DirectionalArrow className="h-4 w-4" aria-hidden="true" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
