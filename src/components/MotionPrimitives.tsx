import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';

export const SPRING_SNAPPY = {
  type: 'spring' as const,
  stiffness: 440,
  damping: 32,
  mass: 0.75,
};

export const SPRING_GENTLE = {
  type: 'spring' as const,
  stiffness: 310,
  damping: 28,
  mass: 0.9,
};

export const EASE_SETTLE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface PageRevealProps {
  children: ReactNode;
  className?: string;
}

export function PageReveal({ children, className }: PageRevealProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -6 }}
      transition={{ duration: prefersReduced ? 0 : 0.22, ease: EASE_SETTLE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollProgressLine({ className = '' }: { className?: string }) {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 320,
    damping: 38,
    restDelta: 0.001,
  });

  if (prefersReduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className={`pointer-events-none h-[2px] w-full origin-left bg-[#111111] rtl:origin-right dark:bg-white ${className}`}
    />
  );
}

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  delay = 0,
  y = 16,
  className = '',
}: ScrollRevealProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y, scale: 0.992 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: prefersReduced ? 0 : 0.34, delay, ease: EASE_SETTLE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScrollParallaxProps {
  children: ReactNode;
  offset?: number;
  className?: string;
}

export function ScrollParallax({
  children,
  offset = 16,
  className = '',
}: ScrollParallaxProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const smoothY = useSpring(rawY, { stiffness: 260, damping: 32, mass: 0.8 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={prefersReduced ? undefined : { y: smoothY }}>{children}</motion.div>
    </div>
  );
}

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedNumber({
  value,
  suffix = '',
  prefix = '',
  className = '',
}: AnimatedNumberProps) {
  const prefersReduced = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(0);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayValue(value);
      prevValueRef.current = value;
      return;
    }

    const from = prevValueRef.current;
    prevValueRef.current = value;

    const controls = animate(from, value, {
      duration: 0.55,
      ease: EASE_SETTLE,
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [value, prefersReduced]);

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

interface MilestoneCelebrationProps {
  active: boolean;
  triggerKey: string | number;
  title: string;
  subtitle?: string;
}

const BURST_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export function MilestoneCelebration({
  active,
  triggerKey,
  title,
  subtitle,
}: MilestoneCelebrationProps) {
  const prefersReduced = useReducedMotion();

  if (!active) return null;

  return (
    <motion.div
      key={triggerKey}
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={SPRING_SNAPPY}
      className="flex items-center gap-3.5 rounded border border-[#111111] bg-[#F5F5F5] px-4 py-3 dark:border-white dark:bg-[#191919]"
    >
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
        {!prefersReduced &&
          BURST_ANGLES.map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const tx = Math.cos(rad) * 20;
            const ty = Math.sin(rad) * 20;
            return (
              <motion.span
                key={deg}
                aria-hidden="true"
                initial={{ opacity: 0.95, scale: 1, x: 0, y: 0 }}
                animate={{ opacity: 0, scale: 0.3, x: tx, y: ty }}
                transition={{ duration: 0.65, ease: EASE_SETTLE }}
                className="absolute h-1.5 w-1.5 rotate-45 bg-[#111111] dark:bg-white"
              />
            );
          })}

        <motion.div
          initial={prefersReduced ? false : { scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={SPRING_SNAPPY}
          className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#111111] text-white dark:bg-white dark:text-[#111111]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-none stroke-current"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <motion.path
              d="M5 12.5l4.2 4.2L19 7"
              initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: prefersReduced ? 0 : 0.38, ease: EASE_SETTLE, delay: 0.06 }}
            />
          </svg>
        </motion.div>
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-[#111111] dark:text-white">{title}</p>
        {subtitle && (
          <p className="mt-0.5 text-xs text-[#777777] dark:text-[#A3A3A3]">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}

interface EqualizerBarsProps {
  playing: boolean;
}

const BAR_HEIGHTS = [
  [0.35, 0.95, 0.45, 0.85],
  [0.85, 0.4, 1.0, 0.5],
  [0.5, 0.9, 0.35, 0.95],
  [0.75, 0.3, 0.85, 0.4],
];

export function EqualizerBars({ playing }: EqualizerBarsProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="flex h-4 items-end gap-0.5" aria-hidden="true">
      {BAR_HEIGHTS.map((seq, idx) => (
        <motion.span
          key={idx}
          className="w-0.5 origin-bottom rounded-t-sm bg-[#111111] dark:bg-white"
          style={{ height: '14px' }}
          animate={
            playing && !prefersReduced
              ? { scaleY: seq }
              : { scaleY: 0.28 + idx * 0.08 }
          }
          transition={
            playing && !prefersReduced
              ? {
                  duration: 0.72 + idx * 0.09,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
}
