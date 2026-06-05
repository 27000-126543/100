import { motion } from 'framer-motion';
import { cn } from '@/lib/utils.js';

type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

interface RarityBadgeProps {
  rarity: Rarity;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const rarityConfig: Record<
  Rarity,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    glowColor: string;
    icon: string;
  }
> = {
  common: {
    label: '普通',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-500/50',
    glowColor: 'rgba(156, 163, 175, 0.5)',
    icon: '◆',
  },
  uncommon: {
    label: '优秀',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
    glowColor: 'rgba(34, 197, 94, 0.5)',
    icon: '◇',
  },
  rare: {
    label: '稀有',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    icon: '◈',
  },
  epic: {
    label: '史诗',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/50',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    icon: '✦',
  },
  legendary: {
    label: '传说',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/50',
    glowColor: 'rgba(245, 158, 11, 0.7)',
    icon: '★',
  },
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-3 py-1 text-sm gap-1.5',
  lg: 'px-4 py-1.5 text-base gap-2',
};

const iconSizeStyles = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function RarityBadge({
  rarity,
  size = 'md',
  showIcon = true,
  className,
}: RarityBadgeProps) {
  const config = rarityConfig[rarity];
  const isLegendary = rarity === 'legendary';

  return (
    <motion.div
      className={cn(
        'relative inline-flex items-center font-display font-bold rounded-full border',
        'transition-all duration-300',
        config.bgColor,
        config.borderColor,
        config.color,
        sizeStyles[size],
        className
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      style={{
        boxShadow: `0 0 10px ${config.glowColor}`,
      }}
    >
      {isLegendary && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.3), transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['200% 0', '-200% 0'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {showIcon && (
        <motion.span
          className={cn(iconSizeStyles[size], 'relative z-10')}
          animate={
            isLegendary
              ? {
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }
              : {}
          }
          transition={
            isLegendary
              ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : {}
          }
        >
          {config.icon}
        </motion.span>
      )}

      <span className="relative z-10 uppercase tracking-wider">{config.label}</span>

      {isLegendary && (
        <motion.div
          className="absolute -inset-px rounded-full pointer-events-none opacity-50"
          style={{
            background:
              'conic-gradient(from 0deg, #f59e0b, #ef4444, #f59e0b, #22c55e, #3b82f6, #a855f7, #f59e0b)',
            filter: 'blur(4px)',
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </motion.div>
  );
}

export default RarityBadge;
