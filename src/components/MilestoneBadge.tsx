import { useId } from 'react';
import { ArrowLeft, ArrowRight, Check, Lock } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  AchievementCategory,
  AchievementTier,
  MilestoneProgress,
  MilestoneSpec,
} from '../data/milestones';
import { Language } from '../i18n/translations';
import { SPRING_GENTLE, SPRING_SNAPPY } from './MotionPrimitives';

function CategoryCrestGlyph({ category }: { category: AchievementCategory }) {
  switch (category) {
    case 'chapter':
      return (
        <g stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M38 48 L60 37 L82 48 L60 59 Z" />
          <path d="M38 59 L60 70 L82 59" />
          <path d="M38 70 L60 81 L82 70" />
        </g>
      );
    case 'track':
      return (
        <g stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M39 77 H81" />
          <rect x="42" y="61" width="10" height="16" rx="1" />
          <rect x="55" y="51" width="10" height="26" rx="1" />
          <rect x="68" y="40" width="10" height="37" rx="1" />
        </g>
      );
    case 'series':
      return (
        <g stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <polygon points="46,45 57,56 46,67 35,56" />
          <polygon points="74,45 85,56 74,67 63,56" />
          <line x1="57" y1="56" x2="63" y2="56" />
          <path d="M46 75 H74" />
        </g>
      );
    case 'streak':
      return (
        <g stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <polygon points="63,37 44,61 58,61 54,81 76,55 62,55" />
        </g>
      );
  }
}

function getTierPipCount(tier: AchievementTier): number {
  switch (tier) {
    case 'bronze':
      return 1;
    case 'silver':
      return 2;
    case 'gold':
      return 3;
    case 'apex':
      return 4;
  }
}

interface MilestoneCrestSvgProps {
  spec: MilestoneSpec;
  earned: boolean;
  className?: string;
}

export function MilestoneCrestSvg({
  spec,
  earned,
  className = 'h-20 w-20',
}: MilestoneCrestSvgProps) {
  const uid = useId().replace(/:/g, '');
  const gradId = `cp-crest-grad-${uid}`;
  const pipCount = getTierPipCount(spec.tier);
  const pipSpacing = 8;
  const startX = 60 - ((pipCount - 1) * pipSpacing) / 2;

  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity={earned ? '0.16' : '0.03'} />
          <stop offset="55%" stopColor="currentColor" stopOpacity={earned ? '0.04' : '0.01'} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={earned ? '0.18' : '0.05'} />
        </linearGradient>
      </defs>

      {/* Outer Hexagonal Shield Frame */}
      <polygon
        points="60,5 108,30 108,82 60,115 12,82 12,30"
        fill={`url(#${gradId})`}
        stroke="currentColor"
        strokeWidth={earned ? '2.2' : '1.4'}
        strokeDasharray={earned ? undefined : '4 3'}
        strokeOpacity={earned ? 1 : 0.42}
      />

      {/* Inner Architectural Bezel */}
      <polygon
        points="60,13 100,34 100,78 60,106 20,78 20,34"
        fill="none"
        stroke="currentColor"
        strokeWidth={earned ? '1.3' : '1'}
        strokeOpacity={earned ? 0.55 : 0.25}
      />

      {/* Tier Notch Pips */}
      {Array.from({ length: pipCount }).map((_, idx) => (
        <circle
          key={idx}
          cx={startX + idx * pipSpacing}
          cy="24"
          r="2.1"
          fill="currentColor"
          opacity={earned ? 0.9 : 0.35}
        />
      ))}

      {/* Category Glyph */}
      <g opacity={earned ? 1 : 0.36}>
        <CategoryCrestGlyph category={spec.category} />
      </g>

      {/* Engraved Crest Code */}
      <text
        x="60"
        y="96"
        textAnchor="middle"
        fill="currentColor"
        opacity={earned ? 0.92 : 0.42}
        style={{
          fontSize: '8.5px',
          fontWeight: 700,
          letterSpacing: '0.09em',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        }}
      >
        {spec.code}
      </text>
    </svg>
  );
}

interface MilestoneBadgeCardProps {
  spec: MilestoneSpec;
  progress: MilestoneProgress;
  index: number;
  lang: Language;
  tierLabel: string;
  categoryLabel: string;
  earnedLabel: string;
  lockedLabel: string;
  earnedAt?: string | null;
  canJump?: boolean;
  jumpLabel?: string;
  onJump?: () => void;
}

export function MilestoneBadgeCard({
  spec,
  progress,
  index,
  lang,
  tierLabel,
  categoryLabel,
  earnedLabel,
  lockedLabel,
  earnedAt,
  canJump = false,
  jumpLabel,
  onJump,
}: MilestoneBadgeCardProps) {
  const prefersReduced = useReducedMotion();
  const earned = progress.unlocked;
  const pct = Math.max(0, Math.min(100, Math.round((progress.current / Math.max(1, progress.target)) * 100)));
  const floatDuration = 3.4 + (index % 4) * 0.38;
  const floatDelay = (index % 5) * 0.24;
  const tiltDirection = index % 2 === 0 ? 1 : -1;
  const DirectionalArrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const formattedDate =
    earnedAt && !Number.isNaN(new Date(earnedAt).getTime())
      ? new Date(earnedAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
          month: 'short',
          day: 'numeric',
        })
      : null;

  return (
    <motion.article
      initial={prefersReduced ? false : { opacity: 0, y: 14, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ ...SPRING_GENTLE, delay: Math.min((index % 6) * 0.04, 0.22) }}
      whileHover={earned && !prefersReduced ? { y: -4, transition: SPRING_SNAPPY } : undefined}
      className={`flex flex-col justify-between rounded border p-4 transition-colors ${
        earned
          ? 'border-[#111111] bg-white dark:border-[#4A4A4A] dark:bg-[#191919]'
          : 'border-[#E7E7E7] bg-[#FAFAFA] dark:border-[#242424] dark:bg-[#141414]'
      }`}
    >
      <div>
        {/* Top Metadata Line (Zero-Pill Inline Layout) */}
        <div className="flex items-center justify-between gap-2 text-[11px] text-[#777777] dark:text-[#A3A3A3]">
          <div className="flex min-w-0 items-center gap-1.5 truncate">
            <span className="font-mono font-semibold text-[#111111] tabular-nums dark:text-white">
              {spec.code}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium">{tierLabel}</span>
          </div>
          {earned ? (
            <Check className="h-3.5 w-3.5 shrink-0 text-[#111111] dark:text-white" aria-hidden="true" />
          ) : (
            <Lock className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />
          )}
        </div>

        {/* Hexagonal Shield Crest Stage */}
        <div className="my-4 flex h-24 flex-col items-center justify-center">
          {earned ? (
            <>
              <motion.div
                className="relative z-10 text-[#111111] dark:text-white"
                animate={
                  prefersReduced
                    ? undefined
                    : {
                        y: [0, -6, 0],
                        rotate: [0, 0.7 * tiltDirection, 0, -0.6 * tiltDirection, 0],
                      }
                }
                transition={
                  prefersReduced
                    ? undefined
                    : {
                        duration: floatDuration,
                        delay: floatDelay,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                      }
                }
              >
                <MilestoneCrestSvg spec={spec} earned className="h-[78px] w-[78px]" />
              </motion.div>

              <motion.div
                aria-hidden="true"
                className="mt-0.5 h-1.5 w-10 rounded-full bg-[#111111] dark:bg-white"
                initial={{ opacity: 0.14, scaleX: 1 }}
                animate={
                  prefersReduced
                    ? { opacity: 0.14, scaleX: 1 }
                    : {
                        opacity: [0.16, 0.06, 0.16],
                        scaleX: [1, 0.78, 1],
                      }
                }
                transition={
                  prefersReduced
                    ? undefined
                    : {
                        duration: floatDuration,
                        delay: floatDelay,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                      }
                }
              />
            </>
          ) : (
            <div className="text-[#777777] dark:text-[#666666]">
              <MilestoneCrestSvg spec={spec} earned={false} className="h-[78px] w-[78px]" />
            </div>
          )}
        </div>

        {/* Title & Description */}
        <h3
          className={`text-sm leading-snug font-semibold ${
            earned ? 'text-[#111111] dark:text-white' : 'text-[#555555] dark:text-[#A3A3A3]'
          }`}
        >
          {spec.title[lang]}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-[#777777] dark:text-[#8E8E8E]">
          {spec.description[lang]}
        </p>
      </div>

      {/* Footer Progress & Optional Jump */}
      <div className="mt-4 border-t border-[#E7E7E7] pt-3 dark:border-[#262626]">
        <div className="flex items-center justify-between text-[11px]">
          <span
            className={
              earned
                ? 'font-semibold text-[#111111] dark:text-white'
                : 'text-[#777777] dark:text-[#A3A3A3]'
            }
          >
            {earned
              ? formattedDate
                ? `${earnedLabel} · ${formattedDate}`
                : earnedLabel
              : lockedLabel}
          </span>
          <span className="font-mono text-[#777777] tabular-nums dark:text-[#A3A3A3]">
            {progress.current}/{progress.target}
          </span>
        </div>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#ECECEC] dark:bg-[#262626]">
          <div
            className={`h-full transition-all duration-300 ${
              earned
                ? 'bg-[#111111] dark:bg-white'
                : 'bg-[#8E8E8E] dark:bg-[#666666]'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {canJump && onJump && jumpLabel && (
          <button
            type="button"
            onClick={onJump}
            className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-[#111111] hover:underline dark:text-white"
          >
            <span>{jumpLabel}</span>
            <DirectionalArrow className="h-3 w-3" aria-hidden="true" />
          </button>
        )}
      </div>
    </motion.article>
  );
}
