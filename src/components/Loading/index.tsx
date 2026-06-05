import { motion } from 'framer-motion';
import { cn } from '@/lib/utils.js';

type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';
type LoadingVariant = 'circle' | 'dots' | 'pulse' | 'spinner';

interface LoadingProps {
  size?: LoadingSize;
  variant?: LoadingVariant;
  color?: 'magic' | 'gold' | 'forge' | 'tailor' | 'jewel';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeConfig: Record<LoadingSize, { container: string; circle: string; dot: string }> = {
  sm: { container: 'gap-2', circle: 'w-12 h-12', dot: 'w-2 h-2' },
  md: { container: 'gap-3', circle: 'w-20 h-20', dot: 'w-3 h-3' },
  lg: { container: 'gap-4', circle: 'w-32 h-32', dot: 'w-4 h-4' },
  xl: { container: 'gap-6', circle: 'w-48 h-48', dot: 'w-5 h-5' },
};

const colorConfig = {
  magic: { primary: '#8b5cf6', secondary: '#a78bfa', glow: 'rgba(139, 92, 246, 0.6)' },
  gold: { primary: '#D4AF37', secondary: '#f5d442', glow: 'rgba(212, 175, 55, 0.6)' },
  forge: { primary: '#F39C12', secondary: '#fbbf24', glow: 'rgba(243, 156, 18, 0.6)' },
  tailor: { primary: '#27AE60', secondary: '#34d399', glow: 'rgba(39, 174, 96, 0.6)' },
  jewel: { primary: '#3498DB', secondary: '#60a5fa', glow: 'rgba(52, 152, 219, 0.6)' },
};

const runeSymbols = ['✧', '◇', '◈', '✦', '★', '⬡', '⬢', '◎'];

function MagicCircle({
  size,
  color,
}: {
  size: LoadingSize;
  color: keyof typeof colorConfig;
}) {
  const colors = colorConfig[color];
  const sizes = sizeConfig[size];

  return (
    <div className={cn('relative', sizes.circle)}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 0deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})`,
          boxShadow: `0 0 30px ${colors.glow}`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute inset-1 rounded-full bg-dark-900"
        style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}
      />

      <motion.div
        className="absolute inset-3 rounded-full border-2"
        style={{ borderColor: `${colors.primary}40` }}
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: colors.primary,
              left: '50%',
              top: '50%',
              transform: `rotate(${angle}deg) translateY(-${parseInt(sizes.circle.split(' ')[0].replace('w-', '')) * 2 + 8}px) translateX(-50%)`,
              boxShadow: `0 0 8px ${colors.glow}`,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="absolute inset-6 rounded-full border"
        style={{ borderColor: `${colors.secondary}30` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      >
        {runeSymbols.slice(0, 6).map((rune, i) => (
          <motion.span
            key={i}
            className="absolute text-xs font-bold"
            style={{
              color: colors.secondary,
              left: '50%',
              top: '50%',
              transform: `rotate(${i * 60}deg) translateY(-${parseInt(sizes.circle.split(' ')[0].replace('w-', '')) + 6}px) translateX(-50%) rotate(${-i * 60}deg)`,
              textShadow: `0 0 6px ${colors.glow}`,
            }}
          >
            {rune}
          </motion.span>
        ))}
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      >
        <motion.div
          className="text-3xl"
          style={{
            color: colors.primary,
            textShadow: `0 0 15px ${colors.glow}`,
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          ✧
        </motion.div>
      </motion.div>

      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: colors.secondary,
            left: '50%',
            top: '50%',
            boxShadow: `0 0 6px ${colors.glow}`,
          }}
          animate={{
            x: [0, Math.cos((i * Math.PI) / 2) * 60, 0],
            y: [0, Math.sin((i * Math.PI) / 2) * 60, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function DotsLoader({
  size,
  color,
}: {
  size: LoadingSize;
  color: keyof typeof colorConfig;
}) {
  const colors = colorConfig[color];
  const sizes = sizeConfig[size];

  return (
    <div className={cn('flex items-center', sizes.container)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn('rounded-full', sizes.dot)}
          style={{
            backgroundColor: colors.primary,
            boxShadow: `0 0 10px ${colors.glow}`,
          }}
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function PulseLoader({
  size,
  color,
}: {
  size: LoadingSize;
  color: keyof typeof colorConfig;
}) {
  const colors = colorConfig[color];
  const sizes = sizeConfig[size];

  return (
    <div className={cn('relative', sizes.circle)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${colors.primary}`,
          }}
          animate={{
            scale: [0.5, 1.2, 1.5],
            opacity: [0.8, 0.4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 m-auto rounded-full"
        style={{
          width: '30%',
          height: '30%',
          backgroundColor: colors.primary,
          boxShadow: `0 0 20px ${colors.glow}`,
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function SpinnerLoader({
  size,
  color,
}: {
  size: LoadingSize;
  color: keyof typeof colorConfig;
}) {
  const colors = colorConfig[color];
  const sizes = sizeConfig[size];

  return (
    <motion.div
      className={cn('rounded-full border-4 border-t-transparent', sizes.circle)}
      style={{
        borderColor: `${colors.primary}30`,
        borderTopColor: colors.primary,
        boxShadow: `0 0 15px ${colors.glow}`,
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export function Loading({
  size = 'md',
  variant = 'circle',
  color = 'magic',
  text,
  className,
  fullScreen = false,
}: LoadingProps) {
  const renderVariant = () => {
    switch (variant) {
      case 'circle':
        return <MagicCircle size={size} color={color} />;
      case 'dots':
        return <DotsLoader size={size} color={color} />;
      case 'pulse':
        return <PulseLoader size={size} color={color} />;
      case 'spinner':
        return <SpinnerLoader size={size} color={color} />;
      default:
        return <MagicCircle size={size} color={color} />;
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        fullScreen && 'fixed inset-0 bg-dark-900/90 backdrop-blur-sm z-50',
        className
      )}
    >
      {renderVariant()}
      {text && (
        <motion.p
          className="mt-4 font-display text-lg"
          style={{ color: colorConfig[color].primary }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

export default Loading;
