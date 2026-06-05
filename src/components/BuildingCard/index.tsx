import { motion } from 'framer-motion';
import { ArrowUp, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils.js';
import type { Building } from '../../../shared/types.js';
import { BUILDING_INFO } from '../../../shared/types.js';

interface BuildingCardProps {
  building: Building;
  className?: string;
  onClick?: () => void;
  onUpgrade?: () => void;
}

export default function BuildingCard({ building, className, onClick, onUpgrade }: BuildingCardProps) {
  const buildingInfo = BUILDING_INFO[building.type];

  const getBuildingGradient = () => {
    switch (building.type) {
      case 'furnace': return 'from-forge-500/30 via-forge-400/10 to-forge-500/30';
      case 'enchanting_table': return 'from-magic-500/30 via-magic-400/10 to-magic-500/30';
      case 'warehouse': return 'from-jewel-500/30 via-jewel-400/10 to-jewel-500/30';
      default: return 'from-dark-700/50 via-dark-800/30 to-dark-700/50';
    }
  };

  const getBuildingBorder = () => {
    switch (building.type) {
      case 'furnace': return 'border-forge-500/50 shadow-[0_0_15px_rgba(243,156,18,0.3)]';
      case 'enchanting_table': return 'border-magic-500/50 shadow-[0_0_15px_rgba(139,92,246,0.3)]';
      case 'warehouse': return 'border-jewel-500/50 shadow-[0_0_15px_rgba(52,152,219,0.3)]';
      default: return 'border-dark-600';
    }
  };

  const getProgressGradient = () => {
    switch (building.type) {
      case 'furnace': return 'bg-gradient-to-r from-forge-600 via-forge-500 to-forge-400';
      case 'enchanting_table': return 'bg-gradient-to-r from-magic-600 via-magic-500 to-magic-400';
      case 'warehouse': return 'bg-gradient-to-r from-jewel-600 via-jewel-500 to-jewel-400';
      default: return 'bg-gradient-to-r from-dark-600 via-dark-500 to-dark-400';
    }
  };

  const getGlowColor = () => {
    switch (building.type) {
      case 'furnace': return 'rgba(243,156,18,0.5)';
      case 'enchanting_table': return 'rgba(139,92,246,0.5)';
      case 'warehouse': return 'rgba(52,152,219,0.5)';
      default: return 'rgba(100,100,100,0.3)';
    }
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
        getBuildingGradient(),
        getBuildingBorder(),
        className
      )}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-20"
          style={{ 
            background: `radial-gradient(circle, ${getGlowColor()} 0%, transparent 70%)`,
          }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <motion.div
              className="relative"
              animate={{ 
                rotateY: building.pendingUpgrade ? [0, 360] : 0,
              }}
              transition={{ 
                duration: 3,
                repeat: building.pendingUpgrade ? Infinity : 0,
                ease: "linear"
              }}
            >
              <div className={cn(
                'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl',
                'bg-gradient-to-br from-dark-700 to-dark-800 border-2 border-gold-500/30',
                building.pendingUpgrade && 'animate-pulse'
              )}
              style={{
                boxShadow: building.pendingUpgrade ? `0 0 20px ${getGlowColor()}` : 'none'
              }}
              >
                {buildingInfo.icon}
              </div>
              {building.pendingUpgrade && (
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-magic-500 flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Clock className="w-3.5 h-3.5 text-white" />
                </motion.div>
              )}
            </motion.div>

            <div>
              <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                {buildingInfo.name}
                <span className={cn(
                  'px-2 py-0.5 rounded text-sm font-mono font-bold',
                  building.type === 'furnace' && 'bg-forge-500/20 text-forge-400',
                  building.type === 'enchanting_table' && 'bg-magic-500/20 text-magic-400',
                  building.type === 'warehouse' && 'bg-jewel-500/20 text-jewel-400'
                )}>
                  Lv.{building.level}
                </span>
              </h3>
              <p className="text-sm text-dark-400 mt-1">
                {buildingInfo.description}
              </p>
            </div>
          </div>

          {onUpgrade && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onUpgrade();
              }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm',
                'transition-all duration-300',
                building.pendingUpgrade
                  ? 'bg-dark-700 text-dark-400 cursor-not-allowed'
                  : cn(
                      'bg-gradient-to-r text-white shadow-lg',
                      building.type === 'furnace' && 'from-forge-600 to-forge-500 hover:from-forge-500 hover:to-forge-400 shadow-forge',
                      building.type === 'enchanting_table' && 'from-magic-600 to-magic-500 hover:from-magic-500 hover:to-magic-400 shadow-magic',
                      building.type === 'warehouse' && 'from-jewel-600 to-jewel-500 hover:from-jewel-500 hover:to-jewel-400 shadow-jewel'
                    )
              )}
              disabled={building.pendingUpgrade}
            >
              <ArrowUp className="w-4 h-4" />
              <span>{building.pendingUpgrade ? '升级中...' : '升级'}</span>
            </motion.button>
          )}
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-1.5 text-dark-400">
              <Sparkles className="w-4 h-4" />
              <span>升级进度</span>
            </div>
            <span className="font-mono font-medium text-gold-400">
              {building.upgradeProgress}%
            </span>
          </div>
          <div className="h-4 bg-dark-700/80 rounded-full overflow-hidden border border-dark-600/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${building.upgradeProgress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className={cn(
                'h-full rounded-full relative overflow-hidden',
                getProgressGradient()
              )}
              style={{
                boxShadow: `0 0 10px ${getGlowColor()}`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="px-4 py-3 rounded-xl bg-dark-800/50 border border-dark-600/50">
            <div className="text-xs text-dark-400 mb-1">当前等级加成</div>
            <div className="font-bold text-white">
              {building.type === 'furnace' && `+${building.level * 5}% 制造成功率`}
              {building.type === 'enchanting_table' && `+${building.level * 4}% 附魔成功率`}
              {building.type === 'warehouse' && `+${building.level * 50} 材料容量`}
            </div>
          </div>
          <div className="px-4 py-3 rounded-xl bg-dark-800/50 border border-dark-600/50">
            <div className="text-xs text-dark-400 mb-1">下一级加成</div>
            <div className="font-bold text-magic-400">
              {building.type === 'furnace' && `+${(building.level + 1) * 5}% 制造成功率`}
              {building.type === 'enchanting_table' && `+${(building.level + 1) * 4}% 附魔成功率`}
              {building.type === 'warehouse' && `+${(building.level + 1) * 50} 材料容量`}
            </div>
          </div>
        </div>

        {building.pendingUpgrade && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-3 rounded-xl bg-magic-500/10 border border-magic-500/30"
          >
            <div className="flex items-center gap-2 text-magic-400 text-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="w-4 h-4" />
              </motion.div>
              <span>正在升级中，完成后将自动解锁新功能</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
