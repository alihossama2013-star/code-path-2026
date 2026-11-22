import { useId } from 'react';
import { Check, Lock } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { DigitalTokenSpec, TokenMotif } from '../data/tokens';
import { Language } from '../i18n/translations';
import { SPRING_GENTLE, SPRING_SNAPPY } from './MotionPrimitives';

function MotifGlyph({ motif }: { motif: TokenMotif }) {
  switch (motif) {
    case 'foundation':
      return (
        <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M44 48 L35 60 L44 72" />
          <path d="M76 48 L85 60 L76 72" />
          <path d="M64 44 L56 76" />
        </g>
      );
    case 'typography':
      return (
        <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M40 46 H80" />
          <path d="M60 46 V76" />
          <path d="M51 76 H69" />
          <path d="M40 52 V46" />
          <path d="M80 52 V46" />
        </g>
      );
    case 'structure':
      return (
        <g stroke="currentColor" strokeWidth="2" fill="none">
          <rect x="40" y="42" width="40" height="8" rx="1" />
          <rect x="40" y="54" width="17" height="22" rx="1" />
          <rect x="61" y="54" width="19" height="22" rx="1" />
        </g>
      );
    case 'links':
      return (
        <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <rect x="38" y="52" width="22" height="14" rx="7" transform="rotate(-25 49 59)" />
          <rect x="60" y="54" width="22" height="14" rx="7" transform="rotate(-25 71 61)" />
        </g>
      );
    case 'lists':
      return (
        <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <circle cx="42" cy="47" r="2" fill="currentColor" />
          <line x1="50" y1="47" x2="79" y2="47" />
          <circle cx="42" cy="60" r="2" fill="currentColor" />
          <line x1="50" y1="60" x2="79" y2="60" />
          <circle cx="42" cy="73" r="2" fill="currentColor" />
          <line x1="50" y1="73" x2="79" y2="73" />
        </g>
      );
    case 'media':
      return (
        <g stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none">
          <rect x="38" y="43" width="44" height="34" rx="2" />
          <circle cx="49" cy="54" r="3.5" fill="currentColor" />
          <path d="M42 73 L55 59 L64 67 L70 61 L78 73" />
        </g>
      );
    case 'tables':
      return (
        <g stroke="currentColor" strokeWidth="2" fill="none">
          <rect x="39" y="43" width="42" height="34" rx="1.5" />
          <line x1="39" y1="54" x2="81" y2="54" />
          <line x1="39" y1="65" x2="81" y2="65" />
          <line x1="54" y1="43" x2="54" y2="77" />
          <line x1="68" y1="43" x2="68" y2="77" />
        </g>
      );
    case 'forms':
      return (
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
          <rect x="38" y="43" width="44" height="14" rx="2" />
          <line x1="44" y1="50" x2="60" y2="50" />
          <rect x="38" y="63" width="26" height="12" rx="2" fill="currentColor" opacity="0.2" />
          <path d="M45 69 H57" />
          <circle cx="75" cy="69" r="5" />
        </g>
      );
    case 'interactive':
      return (
        <g stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none">
          <polygon points="60,39 78,60 60,81 42,60" />
          <circle cx="60" cy="60" r="6" fill="currentColor" />
        </g>
      );
    case 'layout':
      return (
        <g stroke="currentColor" strokeWidth="2" fill="none">
          <rect x="39" y="42" width="19" height="16" rx="1" />
          <rect x="62" y="42" width="19" height="36" rx="1" />
          <rect x="39" y="62" width="19" height="16" rx="1" />
        </g>
      );
    case 'logic':
      return (
        <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M47 43 C42 43 42 56 37 60 C42 64 42 77 47 77" />
          <path d="M73 43 C78 43 78 56 83 60 C78 64 78 77 73 77" />
          <circle cx="60" cy="60" r="4.5" fill="currentColor" />
        </g>
      );
    case 'components':
      return (
        <g stroke="currentColor" strokeWidth="1.9" fill="none">
          <ellipse cx="60" cy="60" rx="22" ry="9" transform="rotate(28 60 60)" />
          <ellipse cx="60" cy="60" rx="22" ry="9" transform="rotate(-28 60 60)" />
          <circle cx="60" cy="60" r="4" fill="currentColor" />
        </g>
      );
    case 'server':
      return (
        <g stroke="currentColor" strokeWidth="2" fill="none">
          <ellipse cx="60" cy="46" rx="19" ry="5.5" />
          <path d="M41 46 V60 C41 63 49.5 65.5 60 65.5 C70.5 65.5 79 63 79 60 V46" />
          <path d="M41 60 V73 C41 76 49.5 78.5 60 78.5 C70.5 78.5 79 76 79 73 V60" />
        </g>
      );
    case 'review':
      return (
        <g stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none">
          <polygon points="50,43 63,60 50,77 37,60" />
          <polygon points="70,43 83,60 70,77 57,60" />
          <circle cx="60" cy="60" r="3" fill="currentColor" />
        </g>
      );
  }
}

interface TokenMedallionSvgProps {
  spec: DigitalTokenSpec;
  earned: boolean;
  className?: string;
}

export function TokenMedallionSvg({ spec, earned, className = 'h-20 w-20' }: TokenMedallionSvgProps) {
  const uid = useId().replace(/:/g, '');
  const gradId = `cp-token-grad-${uid}`;

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity={earned ? '0.14' : '0.03'} />
          <stop offset="50%" stopColor="currentColor" stopOpacity={earned ? '0.03' : '0.01'} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={earned ? '0.16' : '0.04'} />
        </linearGradient>
      </defs>

      {/* Outer Octagonal Mint Ring */}
      <polygon
        points="60,5 99,21 115,60 99,99 60,115 21,99 5,60 21,21"
        fill={`url(#${gradId})`}
        stroke="currentColor"
        strokeWidth={earned ? '2.2' : '1.4'}
        strokeDasharray={earned ? undefined : '4 3'}
        strokeOpacity={earned ? 1 : 0.45}
      />

      {/* Precision Radial Tick Marks */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="60"
          y1="11"
          x2="60"
          y2="16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity={earned ? 0.65 : 0.25}
          transform={`rotate(${angle} 60 60)`}
        />
      ))}

      {/* Inner Engraved Bezel */}
      <circle
        cx="60"
        cy="60"
        r="39"
        fill="none"
        stroke="currentColor"
        strokeWidth={earned ? '1.6' : '1.2'}
        strokeOpacity={earned ? 0.85 : 0.35}
      />

      {/* Central Architectural Glyph */}
      <g opacity={earned ? 1 : 0.35}>
        <MotifGlyph motif={spec.motif} />
      </g>

      {/* Engraved Serial Stamp */}
      <text
        x="60"
        y="94"
        textAnchor="middle"
        fill="currentColor"
        opacity={earned ? 0.9 : 0.4}
        style={{
          fontSize: '8.5px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        }}
      >
        {spec.tokenCode}
      </text>
    </svg>
  );
}

interface DigitalTokenBadgeProps {
  spec: DigitalTokenSpec;
  index: number;
  earned: boolean;
  selected: boolean;
  lang: Language;
  mintedLabel: string;
  lockedLabel: string;
  onSelect: () => void;
}

export function DigitalTokenBadge({
  spec,
  index,
  earned,
  selected,
  lang,
  mintedLabel,
  lockedLabel,
  onSelect,
}: DigitalTokenBadgeProps) {
  const prefersReduced = useReducedMotion();

  const floatDuration = 3.2 + (index % 4) * 0.42;
  const floatDelay = (index % 6) * 0.26;
  const tiltDirection = index % 2 === 0 ? 1 : -1;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={prefersReduced ? false : { opacity: 0, scale: 0.9, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ ...SPRING_GENTLE, delay: Math.min((index % 6) * 0.035, 0.2) }}
      whileHover={earned && !prefersReduced ? { y: -5, transition: SPRING_SNAPPY } : undefined}
      whileTap={{ scale: 0.97 }}
      aria-pressed={selected}
      className={`group relative flex flex-col items-center rounded border p-4 text-center transition-colors focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:outline-none dark:focus-visible:ring-white ${
        selected
          ? 'border-[#111111] bg-[#F5F5F5] dark:border-white dark:bg-[#222222]'
          : earned
            ? 'border-[#D4D4D4] bg-white hover:border-[#111111] dark:border-[#333333] dark:bg-[#191919] dark:hover:border-white'
            : 'border-[#E7E7E7] bg-[#FAFAFA] hover:border-[#BDBDBD] dark:border-[#242424] dark:bg-[#141414] dark:hover:border-[#3A3A3A]'
      }`}
    >
      {/* Top Index & Status Indicator */}
      <div className="flex w-full items-center justify-between text-[11px] text-[#777777] dark:text-[#A3A3A3]">
        <span className="font-mono font-semibold tabular-nums">{spec.tokenCode}</span>
        {earned ? (
          <Check className="h-3.5 w-3.5 text-[#111111] dark:text-white" aria-hidden="true" />
        ) : (
          <Lock className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
        )}
      </div>

      {/* Floating Token Medallion Stage */}
      <div className="relative my-3 flex h-24 w-full flex-col items-center justify-center">
        {earned ? (
          <>
            <motion.div
              className="relative z-10 text-[#111111] dark:text-white"
              animate={
                prefersReduced
                  ? undefined
                  : {
                      y: [0, -7, 0],
                      rotate: [0, 0.9 * tiltDirection, 0, -0.7 * tiltDirection, 0],
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
              <TokenMedallionSvg spec={spec} earned className="h-[78px] w-[78px]" />
            </motion.div>

            {/* Synchronized Ground Shadow for Floating Depth */}
            <motion.div
              aria-hidden="true"
              className="mt-0.5 h-1.5 w-11 rounded-full bg-[#111111] dark:bg-white"
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
            <TokenMedallionSvg spec={spec} earned={false} className="h-[78px] w-[78px]" />
          </div>
        )}
      </div>

      {/* Token Title & Unboxed Inline Metadata */}
      <p
        className={`line-clamp-2 min-h-[2.25rem] text-xs leading-snug font-semibold ${
          earned
            ? 'text-[#111111] dark:text-white'
            : 'text-[#777777] dark:text-[#8E8E8E]'
        }`}
      >
        {spec.title[lang]}
      </p>

      <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#777777] dark:text-[#A3A3A3]">
        <span className="code-ltr font-mono">{spec.tagLabel}</span>
        <span aria-hidden="true">·</span>
        <span className={earned ? 'font-medium text-[#111111] dark:text-white' : ''}>
          {earned ? mintedLabel : lockedLabel}
        </span>
      </div>
    </motion.button>
  );
}
