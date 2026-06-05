import { motion } from 'framer-motion';
import { Award, Clover, Zap, User } from 'lucide-react';
import { cn } from '@/lib/utils.js';
import type { WorkshopMember } from '../../../shared/types.js';
import { POSITION_INFO } from '../../../shared/types.js';

interface MemberCardProps {
  member: WorkshopMember;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export default function MemberCard({ member, className, onClick, selected = false }: MemberCardProps) {
  const positionInfo = POSITION_INFO[member.position];

  const getPositionGradient = () => {
    switch (member.position) {
      case 'master': return 'from-gold-500/30 via-gold-400/10 to-gold-500/30';
      case 'journeyman': return 'from-magic-500/30 via-magic-400/10 to-magic-500/30';
      case 'apprentice': return 'from-tailor-500/30 via-tailor-400/10 to-tailor-500/30';
      case 'steward': return 'from-forge-500/30 via-forge-400/10 to-forge-500/30';
      default: return 'from-dark-700/50 via-dark-800/30 to-dark-700/50';
    }
  };

  const getPositionBorder = () => {
    switch (member.position) {
      case 'master': return 'border-gold-500/50 shadow-[0_0_15px_rgba(212,175,55,0.3)]';
      case 'journeyman': return 'border-magic-500/50 shadow-[0_0_12px_rgba(139,92,246,0.25)]';
      case 'apprentice': return 'border-tailor-500/50';
      case 'steward': return 'border-forge-500/50';
      default: return 'border-dark-600';
    }
  };

  const getPositionIcon = () => {
    switch (member.position) {
      case 'master': return '👑';
      case 'journeyman': return '⚒️';
      case 'apprentice': return '📚';
      case 'steward': return '📋';
      default: return '👤';
    }
  };

  const getSkillColor = (level: number) => {
    if (level >= 90) return 'text-gold-400';
    if (level >= 75) return 'text-magic-400';
    if (level >= 60) return 'text-forge-400';
    if (level >= 45) return 'text-tailor-400';
    return 'text-dark-400';
  };

  const getLuckColor = (luck: number) => {
    if (luck >= 20) return 'text-gold-400';
    if (luck >= 15) return 'text-magic-400';
    if (luck >= 10) return 'text-tailor-400';
    return 'text-dark-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -3, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'magic-card relative overflow-hidden cursor-pointer',
        'bg-gradient-to-br',
        getPositionGradient(),
        getPositionBorder(),
        selected && 'ring-2 ring-gold-400 ring-offset-2 ring-offset-dark-900',
        className
      )}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="80" cy="20" r="60" fill="currentColor" className="text-gold-400" />
          </svg>
        </div>
      </div>

      <div className="relative p-4">
        <div className="flex items-start gap-4">
          <motion.div
            className="relative"
            whileHover={{ rotate: [0, -3, 3, 0] }}
            transition={{ duration: 0.5 }}
          >
            <div className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl',
              'bg-gradient-to-br from-dark-700 to-dark-800 border-2',
              selected ? 'border-gold-400' : 'border-gold-500/30'
            )}>
              {member.avatar || <User className="w-8 h-8 text-dark-500" />}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-dark-800 border border-gold-500/30 flex items-center justify-center text-sm">
              {getPositionIcon()}
            </div>
            {selected && (
              <motion.div
                className="absolute -inset-1 rounded-2xl border-2 border-gold-400"
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity
                }}
              />
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-bold text-lg text-white truncate">
                {member.name}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <span className={cn(
                'px-2 py-0.5 rounded text-xs font-medium',
                member.position === 'master' && 'bg-gold-500/20 text-gold-400',
                member.position === 'journeyman' && 'bg-magic-500/20 text-magic-400',
                member.position === 'apprentice' && 'bg-tailor-500/20 text-tailor-400',
                member.position === 'steward' && 'bg-forge-500/20 text-forge-400'
              )}>
                {positionInfo.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800/50 border border-dark-600/50">
                <motion.div
                  animate={{ rotate: selected ? [0, 360] : 0 }}
                  transition={{ duration: 1, repeat: selected ? Infinity : 0 }}
                >
                  <Zap className={cn('w-4 h-4', getSkillColor(member.skillLevel))} />
                </motion.div>
                <div>
                  <div className="text-xs text-dark-400">技能等级</div>
                  <div className={cn('font-bold font-mono', getSkillColor(member.skillLevel))}>
                    {member.skillLevel}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800/50 border border-dark-600/50">
                <motion.div
                  animate={{ 
                    scale: member.luck >= 15 ? [1, 1.2, 1] : 1,
                    rotate: member.luck >= 15 ? [0, 10, -10, 0] : 0
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: member.luck >= 15 ? Infinity : 0
                  }}
                >
                  <Clover className={cn('w-4 h-4', getLuckColor(member.luck))} />
                </motion.div>
                <div>
                  <div className="text-xs text-dark-400">幸运值</div>
                  <div className={cn('font-bold font-mono', getLuckColor(member.luck))}>
                    {member.luck}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-dark-600/30">
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-magic-400" />
            <span className="text-xs text-dark-400">{positionInfo.description}</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-dark-400">综合能力</span>
            <span className="text-magic-300 font-mono">{member.skillLevel + member.luck}</span>
          </div>
          <div className="progress-bar-magic">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (member.skillLevel + member.luck) / 1.2)}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
