import { motion } from 'framer-motion';
import { cn } from '@/lib/utils.js';

type MagicButtonVariant = 'magic' | 'gold' | 'forge' | 'tailor' | 'jewel' | 'ghost';
type MagicButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface MagicButtonProps {
  children?: React.ReactNode;
  variant?: MagicButtonVariant;
  size?: MagicButtonSize;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantStyles: Record<MagicButtonVariant, string> = {
  magic:
    'bg-[linear-gradient(135deg,#6C3483_0%,#8b5cf6_100%)] hover:bg-[linear-gradient(135deg,#7c3aed_0%,#a78bfa_100%)] border-gold-500/50 text-white hover:shadow-magic',
  gold:
    'bg-[linear-gradient(135deg,#a8821a_0%,#D4AF37_100%)] hover:bg-[linear-gradient(135deg,#c9a227_0%,#f5d442_100%)] border-gold-400/70 text-dark-900 hover:shadow-gold',
  forge:
    'bg-[linear-gradient(135deg,#b45309_0%,#F39C12_100%)] hover:bg-[linear-gradient(135deg,#d97706_0%,#fbbf24_100%)] border-forge-400/50 text-white hover:shadow-forge',
  tailor:
    'bg-[linear-gradient(135deg,#047857_0%,#27AE60_100%)] hover:bg-[linear-gradient(135deg,#059669_0%,#34d399_100%)] border-tailor-400/50 text-white hover:shadow-tailor',
  jewel:
    'bg-[linear-gradient(135deg,#1d4ed8_0%,#3498DB_100%)] hover:bg-[linear-gradient(135deg,#2563eb_0%,#60a5fa_100%)] border-jewel-400/50 text-white hover:shadow-jewel',
  ghost:
    'bg-transparent hover:bg-white/10 border-gold-500/30 text-gold-400 hover:text-gold-300 hover:border-gold-500/50',
};

const sizeStyles: Record<MagicButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
  xl: 'px-10 py-4 text-xl',
};

export function MagicButton({
  children,
  variant = 'magic',
  size = 'md',
  className,
  onClick,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
}: MagicButtonProps) {
  return (
    <motion.button
      className={cn(
        'relative font-display font-bold rounded-lg overflow-hidden transition-all duration-300',
        'border shadow-3d active:shadow-3d active:translate-y-0',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-3d',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      whileHover={!disabled ? { y: -2, transition: { duration: 0.2 } } : {}}
      whileTap={!disabled ? { scale: 0.98, transition: { duration: 0.1 } } : {}}
      onClick={onClick}
      disabled={disabled}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          background:
            'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
        }}
        whileHover={
          !disabled
            ? {
                opacity: 1,
                backgroundPosition: ['-200% 0', '200% 0'],
                transition: { duration: 1, ease: 'linear' },
              }
            : {}
        }
      />

      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && iconPosition === 'left' && (
          <motion.span
            initial={{ x: 0 }}
            whileHover={!disabled ? { x: -2 } : {}}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <motion.span
            initial={{ x: 0 }}
            whileHover={!disabled ? { x: 2 } : {}}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}
      </span>

      {variant !== 'ghost' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        />
      )}
    </motion.button>
  );
}

export default MagicButton;
