import { motion } from 'framer-motion';
import { Sparkles, Star, Sword } from 'lucide-react';
import { cn } from '@/lib/utils.js';
import AffixDisplay from '../AffixDisplay/index.js';
import type { Equipment } from '../../../shared/types.js';
import { RARITY_INFO, GENRE_INFO } from '../../../shared/types.js';

interface EquipmentCardProps {
  equipment: Equipment;
  className?: string;
  onClick?: () => void;
}

export default function EquipmentCard({ equipment, className, onClick }: EquipmentCardProps) {
  const rarityInfo = RARITY_INFO[equipment.rarity];
  const genreInfo = GENRE_INFO[equipment.genre];

  const getRarityGradient = () => {
    switch (equipment.rarity) {
      case 'legendary': return 'from-rarity-legendary/20 via-gold-500/10 to-rarity-legendary/20';
      case 'epic': return 'from-rarity-epic/20 via-magic-500/10 to-rarity-epic/20';
      case 'rare': return 'from-rarity-rare/20 via-jewel-500/10 to-rarity-rare/20';
      case 'uncommon': return 'from-rarity-uncommon/20 via-tailor-500/10 to-rarity-uncommon/20';
      default: return 'from-dark-700/50 via-dark-800/30 to-dark-700/50';
    }
  };

  const getRarityBorder = () => {
    switch (equipment.rarity) {
      case 'legendary': return 'border-rarity-legendary shadow-[0_0_20px_rgba(245,158,11,0.4)]';
      case 'epic': return 'border-rarity-epic shadow-[0_0_15px_rgba(168,85,247,0.3)]';
      case 'rare': return 'border-rarity-rare shadow-[0_0_10px_rgba(59,130,246,0.2)]';
      case 'uncommon': return 'border-rarity-uncommon';
      default: return 'border-dark-600';
    }
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 90) return 'text-rarity-legendary';
    if (quality >= 80) return 'text-rarity-epic';
    if (quality >= 70) return 'text-rarity-rare';
    if (quality >= 60) return 'text-rarity-uncommon';
    return 'text-rarity-common';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        y: -4, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'magic-card relative overflow-hidden cursor-pointer',
        'bg-gradient-to-br',
        getRarityGradient(),
        getRarityBorder(),
        className
      )}
    >
      {equipment.rarity === 'legendary' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          <motion.div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-30"
            style={{ 
              background: 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)',
            }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      )}

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ 
                background: `linear-gradient(135deg, ${genreInfo.color === 'forge' ? '#F39C12' : genreInfo.color === 'tailor' ? '#27AE60' : '#3498DB'}33, ${genreInfo.color === 'forge' ? '#F39C12' : genreInfo.color === 'tailor' ? '#27AE60' : '#3498DB'}11)`
              }}
              animate={{ 
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {genreInfo.icon}
            </motion.div>
            <div>
              <h3 className={cn('font-display font-bold text-lg', rarityInfo.color)}>
                {equipment.name}
              </h3>
              <div className="flex items-center gap-2 text-sm">
                <span className={cn('px-2 py-0.5 rounded text-xs font-medium', rarityInfo.bgColor, rarityInfo.color)}>
                  {rarityInfo.name}
                </span>
                <span className="text-dark-400">
                  {genreInfo.name}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
              <span className={cn('font-bold', getQualityColor(equipment.quality))}>
                {equipment.quality}
              </span>
              <span className="text-dark-500 text-sm">/100</span>
            </div>
            <div className="flex items-center gap-1 text-gold-400">
              <Sword className="w-4 h-4" />
              <span className="font-mono font-bold">{equipment.score.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-dark-400 mb-2">基础属性</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(equipment.attributes).map(([key, value], index) => (
              <motion.span
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="px-2.5 py-1 rounded-lg bg-dark-800/60 text-sm border border-dark-600/50"
              >
                <span className="text-dark-400 mr-1">
                  {key === 'attack' && '攻击'}
                  {key === 'defense' && '防御'}
                  {key === 'intelligence' && '智力'}
                  {key === 'agility' && '敏捷'}
                  {key === 'health' && '生命'}
                  {key === 'mana' && '法力'}
                  {key === 'critChance' && '暴击'}
                  {key === 'critDamage' && '暴伤'}
                  {key === 'fireDamage' && '火伤'}
                  {key === 'manaRegen' && '法力回复'}
                  {key === 'healthRegen' && '生命回复'}
                  {key === 'attackSpeed' && '攻速'}
                  {key === 'dodgeChance' && '闪避'}
                  {key === 'blockChance' && '格挡'}
                  {key === 'elementDamage' && '元素伤'}
                </span>
                <span className="text-magic-300 font-medium">+{value}</span>
              </motion.span>
            ))}
          </div>
        </div>

        {equipment.affixes.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs text-dark-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-magic-400" />
              <span>魔法词缀</span>
            </div>
            <AffixDisplay affixes={equipment.affixes} />
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-dark-600/30 flex items-center justify-between text-xs text-dark-500">
          <span>铸造者: {equipment.creatorName}</span>
          <span>{new Date(equipment.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
}
