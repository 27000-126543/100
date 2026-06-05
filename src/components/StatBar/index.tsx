import { motion } from 'framer-motion';
import { cn } from '@/lib/utils.js';

type StatColor = 'magic' | 'gold' | 'forge' | 'tailor' | 'jewel' | 'health' | 'mana' | 'stamina';
type StatSize = 'sm' | 'md' | 'lg';

interface StatBarProps {
  value: number;
  maxValue: number;
  label?: string;
  showValue?: boolean;
  color?: StatColor;
  size?: StatSize;
  icon?: React.ReactNode;
  animated?: boolean;
  className?: string;
  barClassName?: string;
}

const colorConfig: Record<
  StatColor,
  {
    gradient: string;
    glow: string;
    text: string;
    bg: string;
  }
> = {
  magic: {
    gradient: 'linear-gradient(90deg, #6C3483, #8b5cf6, #a78bfa)',
    glow: 'rgba(139, 92, 246, 0.6)',
    text: 'text-purple-400',
    bg: 'bg-purple-500/20',
  },
  gold: {
    gradient: 'linear-gradient(90deg, #a8821a, #D4AF37, #f5d442)',
    glow: 'rgba(212, 175, 55, 0.6)',
    text: 'text-amber-400',
    bg: 'bg-amber-500/20',
  },
  forge: {
    gradient: 'linear-gradient(90deg, #b45309, #F39C12, #fbbf24)',
    glow: 'rgba(243, 156, 18, 0.6)',
    text: 'text-orange-400',
    bg: 'bg-orange-500/20',
  },
  tailor: {
    gradient: 'linear-gradient(90deg, #047857, #27AE60, #34d399)',
    glow: 'rgba(39, 174, 96, 0.6)',
    text: 'text-green-400',
    bg: 'bg-green-500/20',
  },
  jewel: {
    gradient: 'linear-gradient(90deg, #1d4ed8, #3498DB, #60a5fa)',
    glow: 'rgba(52, 152, 219, 0.6)',
    text: 'text-blue-400',
    bg: 'bg-blue-500/20',
  },
  health: {
    gradient: 'linear-gradient(90deg, #991b1b, #ef4444, #f87171)',
    glow: 'rgba(239, 68, 68, 0.6)',
    text: 'text-red-400',
    bg: 'bg-red-500/20',
  },
  mana: {
    gradient: 'linear-gradient(90deg, #1e3a8a, #3b82f6, #60a5fa)',
    glow: 'rgba(59, 130, 246, 0.6)',
    text: 'text-blue-400',
    bg: 'bg-blue-500/20',
  },
  stamina: {
    gradient: 'linear-gradient(90deg, #166534, #22c55e, #4ade80)',
    glow: 'rgba(34, 197, 94, 0.6)',
    text: 'text-green-400',
    bg: 'bg-green-500/20',
  },
};

const sizeConfig: Record<StatSize, { bar: string; text: string; label: string }> = {
  sm: { bar: 'h-1.5', text: 'text-xs', label: 'text-xs' },
  md: { bar: 'h-2.5', text: 'text-sm', label: 'text-sm' },
  lg: { bar: 'h-4', text: 'text-base', label: 'text-base' },
};

export function StatBar({
  value,
  maxValue,
  label,
  showValue = true,
  color = 'magic',
  size = 'md',
  icon,
  animated = true,
  className,
  barClassName,
}: StatBarProps) {
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);
  const colors = colorConfig[color];
  const sizes = sizeConfig[size];
  const isLow = percentage < 25;

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            {icon && <span className={colors.text}>{icon}</span>}
            {label && (
              <span className={cn('font-display font-medium', colors.text, sizes.label)}>
                {label}
              </span>
            )}
          </div>
          {showValue && (
            <motion.span
              className={cn(
                'font-mono font-bold tabular-nums',
                sizes.text,
                isLow ? 'text-red-400' : colors.text
              )}
              key={value}
              initial={animated ? { opacity: 0, y: -5 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {Math.floor(value)} / {maxValue}
            </motion.span>
          )}
        </div>
      )}

      <div
        className={cn(
          'relative w-full rounded-full overflow-hidden bg-dark-700/80',
          sizes.bar,
          barClassName
        )}
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
        }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: colors.gradient,
            boxShadow: `0 0 10px ${colors.glow}`,
          }}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 0.8 : 0,
            ease: 'easeOut',
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.3) 50%, transparent)',
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['-200% 0', '200% 0'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {isLow && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'rgba(239, 68, 68, 0.3)',
              }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </motion.div>

        {percentage > 5 && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-full"
            style={{
              right: `calc(100% - ${percentage}% - 2px)`,
              background: 'rgba(255,255,255,0.5)',
              boxShadow: `0 0 8px ${colors.glow}`,
            }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>
    </div>
  );
}

export default StatBar;
