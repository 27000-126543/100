import { motion } from 'framer-motion';
import { cn } from '@/lib/utils.js';

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'magic' | 'gold' | 'forge' | 'tailor' | 'jewel';
  hoverLift?: boolean;
  onClick?: () => void;
}

const glowStyles = {
  magic: 'shadow-magic hover:shadow-magic-lg',
  gold: 'shadow-gold hover:shadow-gold-lg',
  forge: 'shadow-forge hover:shadow-[0_0_60px_rgba(243,156,18,0.6)]',
  tailor: 'shadow-tailor hover:shadow-[0_0_60px_rgba(39,174,96,0.6)]',
  jewel: 'shadow-jewel hover:shadow-[0_0_60px_rgba(52,152,219,0.6)]',
};

export function MagicCard({
  children,
  className,
  glowColor = 'magic',
  hoverLift = true,
  onClick,
}: MagicCardProps) {
  return (
    <motion.div
      className={cn(
        'relative bg-glass backdrop-blur-md rounded-xl border border-gold-500/30 overflow-hidden',
        'transition-all duration-500',
        glowStyles[glowColor],
        onClick && 'cursor-pointer',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={
        hoverLift
          ? {
              y: -8,
              transition: { duration: 0.3, ease: 'easeOut' },
            }
          : {}
      }
      onClick={onClick}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(212, 175, 55, 0.1) 100%)',
        }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="absolute top-0 left-0 w-full h-1 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, #D4AF37, #8b5cf6, transparent)',
        }}
        initial={{ opacity: 0.5 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">{children}</div>

      <motion.div
        className="absolute -inset-1 pointer-events-none opacity-0"
        style={{
          background:
            'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }}
      />
    </motion.div>
  );
}

export default MagicCard;
