import { lazy, Suspense, useEffect, useState } from 'react';
import { Box, ChevronDown, ChevronUp, ImageOff } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Lesson } from '../data/types';
import { LessonDiagram } from './LessonDiagram';
import { EASE_SETTLE, SPRING_SNAPPY } from './MotionPrimitives';

const Lesson3DConceptStage = lazy(() =>
  import('./Lesson3DConceptStage').then((m) => ({ default: m.Lesson3DConceptStage }))
);

interface ParsedAnatomy {
  opening: string;
  attributeExample: string | null;
  contentExample: string | null;
  closing: string | null;
  isVoid: boolean;
}

function parseTagAnatomy(syntax: string): ParsedAnatomy {
  const firstLine = syntax.split('\n')[0].trim();

  if (firstLine.startsWith('<!DOCTYPE')) {
    return {
      opening: '<!DOCTYPE html>',
      attributeExample: null,
      contentExample: null,
      closing: null,
      isVoid: true,
    };
  }

  const voidMatch = firstLine.match(/^<([a-zA-Z0-9-]+)([^>]*)\/?>$/);
  const pairedMatch = firstLine.match(/^<([a-zA-Z0-9-]+)([^>]*)>(.*)<\/([a-zA-Z0-9-]+)>$/);

  if (pairedMatch) {
    const [, tagName, rawAttrs, innerText, closeTag] = pairedMatch;
    return {
      opening: `<${tagName}>`,
      attributeExample: rawAttrs.trim() || null,
      contentExample: innerText.trim() || '...',
      closing: `</${closeTag}>`,
      isVoid: false,
    };
  }

  if (voidMatch) {
    const [, tagName, rawAttrs] = voidMatch;
    const isSelfClosing =
      firstLine.endsWith('/>') ||
      ['meta', 'link', 'base', 'br', 'hr', 'img', 'source', 'track', 'col', 'input', 'area', 'embed', 'wbr'].includes(
        tagName.toLowerCase()
      );
    return {
      opening: `<${tagName}>`,
      attributeExample: rawAttrs.trim() || null,
      contentExample: isSelfClosing ? null : '...',
      closing: isSelfClosing ? null : `</${tagName}>`,
      isVoid: isSelfClosing,
    };
  }

  return {
    opening: firstLine,
    attributeExample: null,
    contentExample: null,
    closing: null,
    isVoid: false,
  };
}

interface LessonVisualProps {
  lesson: Lesson;
}

export function LessonVisual({ lesson }: LessonVisualProps) {
  const { t, lang } = useApp();
  const [imgError, setImgError] = useState(false);
  const [show3D, setShow3D] = useState(true);

  useEffect(() => {
    setImgError(false);
  }, [lesson.id, lesson.imageUrl]);

  const primarySpecs = lesson.tagSpecs?.slice(0, 2) ?? [];

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#111111] dark:text-white">
          {t.lesson.visualGuideHeading}
        </h2>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => setShow3D((v) => !v)}
          className="inline-flex h-8 items-center gap-1.5 rounded border border-[#E7E7E7] bg-white px-3 text-xs font-medium text-[#111111] transition-colors hover:bg-[#F5F5F5] dark:border-[#333333] dark:bg-[#191919] dark:text-white dark:hover:bg-[#222222]"
        >
          <Box className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t.lesson.visualMode3D}</span>
          {show3D ? (
            <ChevronUp className="h-3.5 w-3.5 text-[#777777]" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-[#777777]" aria-hidden="true" />
          )}
        </motion.button>
      </div>

      {/* Interactive 3D Architecture Concept Stage */}
      <AnimatePresence initial={false}>
        {show3D && (
          <motion.div
            key={`3d-${lesson.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: EASE_SETTLE }}
          >
            <Suspense
              fallback={
                <div className="flex h-[320px] items-center justify-center rounded border border-[#E7E7E7] bg-[#F5F5F5] font-mono text-xs text-[#777777] dark:border-[#262626] dark:bg-[#141414] dark:text-[#A3A3A3]">
                  3D...
                </div>
              }
            >
              <Lesson3DConceptStage lesson={lesson} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mixed Visual Showcase: Illustrated Concept Card + Unique Per-Lesson Technical Diagram */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
        {lesson.imageUrl && (
          <motion.figure
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.28, ease: EASE_SETTLE }}
            className="flex flex-col justify-between overflow-hidden rounded border border-[#E7E7E7] bg-white lg:col-span-5 dark:border-[#262626] dark:bg-[#191919]"
          >
            <div>
              <div className="border-b border-[#E7E7E7] bg-[#F5F5F5] px-4 py-2 text-[11px] font-medium text-[#777777] dark:border-[#262626] dark:bg-[#141414] dark:text-[#A3A3A3]">
                {t.lesson.mixedVisualConceptLabel}
              </div>
              {!imgError ? (
                <div className="bg-[#F5F5F5] p-3 dark:bg-[#111111]">
                  <img
                    src={lesson.imageUrl}
                    alt={lesson.imageAlt?.[lang] ?? lesson.title[lang]}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-48 w-full rounded-sm border border-[#E7E7E7] object-cover dark:border-[#262626]"
                  />
                </div>
              ) : (
                <div className="flex h-48 flex-col items-center justify-center gap-2 bg-[#F5F5F5] text-[#777777] dark:bg-[#111111] dark:text-[#A3A3A3]">
                  <ImageOff className="h-6 w-6" aria-hidden="true" />
                  <span className="px-4 text-center text-xs">
                    {lesson.imageAlt?.[lang] ?? lesson.title[lang]}
                  </span>
                </div>
              )}
            </div>
            {lesson.imageCaption && (
              <figcaption className="border-t border-[#E7E7E7] px-4 py-3 text-xs leading-relaxed text-[#777777] dark:border-[#262626] dark:text-[#A3A3A3]">
                {lesson.imageCaption[lang]}
              </figcaption>
            )}
          </motion.figure>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.28, delay: 0.05, ease: EASE_SETTLE }}
          className={lesson.imageUrl ? 'lg:col-span-7' : 'lg:col-span-12'}
        >
          <LessonDiagram lesson={lesson} />
        </motion.div>
      </div>

      {/* Structural Tag Anatomy Visual */}
      {primarySpecs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.28, ease: EASE_SETTLE }}
          className="rounded border border-[#E7E7E7] bg-white p-5 dark:border-[#262626] dark:bg-[#191919]"
        >
          <p className="text-xs font-semibold tracking-wide text-[#777777] uppercase dark:text-[#A3A3A3]">
            {t.lesson.tagAnatomyHeading}
          </p>

          <div className="mt-4 space-y-5">
            {primarySpecs.map((spec, idx) => {
              const anatomy = parseTagAnatomy(spec.syntax);
              return (
                <div
                  key={idx}
                  className="rounded border border-[#E7E7E7] bg-[#F5F5F5] p-4 dark:border-[#262626] dark:bg-[#111111]"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="code-ltr font-mono text-xs font-bold text-[#111111] dark:text-white">
                      {spec.tag}
                    </span>
                    {anatomy.isVoid && (
                      <span className="text-[11px] text-[#777777] dark:text-[#A3A3A3]">
                        {t.lesson.voidTagNote}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-stretch gap-2 text-xs" dir="ltr">
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={SPRING_SNAPPY}
                      className="flex flex-col justify-between rounded border border-[#111111] bg-white px-3 py-2 dark:border-[#E7E7E7] dark:bg-[#191919]"
                    >
                      <span className="text-[10px] font-medium text-[#777777] dark:text-[#A3A3A3]">
                        {t.lesson.openingTagLabel}
                      </span>
                      <code className="mt-1 font-mono font-bold text-[#111111] dark:text-white">
                        {anatomy.opening}
                      </code>
                    </motion.div>

                    {anatomy.attributeExample && (
                      <motion.div
                        whileHover={{ y: -2 }}
                        transition={SPRING_SNAPPY}
                        className="flex flex-col justify-between rounded border border-[#E7E7E7] bg-white px-3 py-2 dark:border-[#333333] dark:bg-[#191919]"
                      >
                        <span className="text-[10px] font-medium text-[#777777] dark:text-[#A3A3A3]">
                          {t.lesson.attributeLabel}
                        </span>
                        <code className="mt-1 font-mono text-[#333333] dark:text-[#D4D4D4]">
                          {anatomy.attributeExample}
                        </code>
                      </motion.div>
                    )}

                    {anatomy.contentExample && (
                      <motion.div
                        whileHover={{ y: -2 }}
                        transition={SPRING_SNAPPY}
                        className="flex flex-col justify-between rounded border border-dashed border-[#777777] bg-white px-3 py-2 dark:border-[#555555] dark:bg-[#191919]"
                      >
                        <span className="text-[10px] font-medium text-[#777777] dark:text-[#A3A3A3]">
                          {t.lesson.contentLabel}
                        </span>
                        <code className="mt-1 font-mono text-[#333333] dark:text-[#D4D4D4]">
                          {anatomy.contentExample}
                        </code>
                      </motion.div>
                    )}

                    {anatomy.closing && (
                      <motion.div
                        whileHover={{ y: -2 }}
                        transition={SPRING_SNAPPY}
                        className="flex flex-col justify-between rounded border border-[#111111] bg-white px-3 py-2 dark:border-[#E7E7E7] dark:bg-[#191919]"
                      >
                        <span className="text-[10px] font-medium text-[#777777] dark:text-[#A3A3A3]">
                          {t.lesson.closingTagLabel}
                        </span>
                        <code className="mt-1 font-mono font-bold text-[#111111] dark:text-white">
                          {anatomy.closing}
                        </code>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </section>
  );
}

