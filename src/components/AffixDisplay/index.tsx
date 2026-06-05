import { motion } from 'framer-motion';
import { cn } from '@/lib/utils.js';
import type { Affix } from '../../../shared/types.js';
import { RARITY_INFO } from '../../../shared/types.js';

interface AffixDisplayProps {
  affixes: Affix[];
  className?: string;
  showDescription?: boolean;
}

export default function AffixDisplay({ affixes, className, showDescription = false }: AffixDisplayProps) {
  if (!affixes || affixes.length === 0) {
    return null;
  }

  const getRarityBorderClass = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-rarity-legendary shadow-[0_0_10px_rgba(245,158,11,0.5)]';
      case 'epic': return 'border-rarity-epic shadow-[0_0_8px_rgba(168,85,247,0.4)]';
      case 'rare': return 'border-rarity-rare shadow-[0_0_6px_rgba(59,130,246,0.3)]';
      case 'uncommon': return 'border-rarity-uncommon';
      default: return 'border-rarity-common';
    }
  };

  const getRarityGlowClass = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'animate-[pulse_2s_ease-in-out_infinite]';
      case 'epic': return 'animate-[pulse_3s_ease-in-out_infinite]';
      default: return '';
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {affixes.map((affix, index) => {
        const rarityInfo = RARITY_INFO[affix.rarity];
        return (
          <motion.div
            key={affix.id}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className={cn(
              'relative px-3 py-1.5 rounded-lg border text-sm font-medium',
              'bg-dark-800/80 backdrop-blur-sm',
              rarityInfo.color,
              getRarityBorderClass(affix.rarity),
              getRarityGlowClass(affix.rarity)
            )}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-lg">✦</span>
              <span>{affix.name}</span>
            </div>
            {showDescription && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-1 text-xs opacity-80 font-normal"
              >
                {affix.description}
              </motion.p>
            )}
            {affix.rarity === 'legendary' && (
              <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
