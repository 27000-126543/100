import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  Bell,
  User,
  Settings,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useAppStore } from '@/store/index.js';
import { cn } from '@/lib/utils.js';
import { formatNumber } from '@/utils/format.js';

export default function Header() {
  const { user, announcements, loadUser, loadAnnouncements } = useAppStore();
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    loadUser();
    loadAnnouncements();
  }, [loadUser, loadAnnouncements]);

  useEffect(() => {
    if (announcements.length === 0) return;
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return '💰';
      case 'competition':
        return '🏆';
      case 'duel':
        return '⚔️';
      case 'crafting':
        return '🔨';
      case 'enchanting':
        return '✨';
      case 'system':
        return '📢';
      default:
        return '📜';
    }
  };

  return (
    <header className="relative h-16 bg-dark-900/80 backdrop-blur-xl border-b border-gold-500/20 flex items-center justify-between px-6">
      <div className="absolute inset-0 bg-rune-pattern opacity-20 pointer-events-none" />
      
      <div className="relative z-10 flex items-center gap-4 flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input
            type="text"
            placeholder="搜索装备、材料、玩家..."
            className="w-72 pl-10 pr-4 py-2 bg-dark-800/50 border border-gold-500/20 rounded-lg text-sm text-white placeholder-dark-500 focus:outline-none focus:border-magic-500/50 focus:shadow-magic transition-all"
          />
        </div>

        <div className="relative flex-1 max-w-xl h-8 overflow-hidden">
          <AnimatePresence mode="wait">
            {announcements[currentAnnouncement] && (
              <motion.div
                key={currentAnnouncement}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="absolute inset-0 flex items-center gap-2"
              >
                <span className="text-lg">
                  {getAnnouncementIcon(announcements[currentAnnouncement].type)}
                </span>
                <p className="text-sm text-dark-300 truncate">
                  {announcements[currentAnnouncement].content}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative flex items-center gap-2 px-4 py-2 bg-glass border border-gold-500/30 rounded-lg overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="relative w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
            <Coins className="w-4 h-4 text-dark-900" />
          </div>
          <div className="relative">
            <p className="text-xs text-dark-400">金币</p>
            <motion.p
              key={user?.gold}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-sm font-bold text-gold-400 font-mono"
            >
              {formatNumber(user?.gold || 0)}
            </motion.p>
          </div>
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="relative w-6 h-6 rounded-full bg-magic-gradient/20 flex items-center justify-center cursor-pointer"
          >
            <TrendingUp className="w-3 h-3 text-magic-400" />
          </motion.div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative flex items-center gap-2 px-3 py-2 bg-glass border border-magic-500/30 rounded-lg overflow-hidden group"
        >
          <div className="absolute inset-0 bg-magic-gradient opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="relative w-8 h-8 rounded-full bg-magic-gradient flex items-center justify-center shadow-magic">
            <Sparkles className="w-4 h-4 text-gold-300" />
          </div>
          <div className="relative">
            <p className="text-xs text-dark-400">幸运值</p>
            <p className="text-sm font-bold text-magic-400">+{user?.luck || 0}</p>
          </div>
        </motion.div>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 rounded-lg bg-dark-800/50 border border-gold-500/20 flex items-center justify-center text-dark-400 hover:text-gold-400 hover:border-gold-500/40 transition-all"
          >
            <Bell className="w-5 h-5" />
            {announcements.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 bg-dark-900/95 backdrop-blur-xl border border-gold-500/30 rounded-xl shadow-magic-lg overflow-hidden z-50"
              >
                <div className="p-3 border-b border-gold-500/20">
                  <h3 className="font-display font-bold text-gold-400">公告通知</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {announcements.map((ann, index) => (
                    <motion.div
                      key={ann.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 border-b border-dark-700/50 hover:bg-magic-700/10 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{getAnnouncementIcon(ann.type)}</span>
                        <p className="text-sm text-dark-300">{ann.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-lg bg-dark-800/50 border border-gold-500/20 flex items-center justify-center text-dark-400 hover:text-gold-400 hover:border-gold-500/40 transition-all"
        >
          <Settings className="w-5 h-5" />
        </motion.button>

        <div className="h-8 w-px bg-gold-500/20" />

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 px-3 py-1.5 bg-glass border border-gold-500/20 rounded-lg cursor-pointer group"
        >
          <div className="relative w-9 h-9 rounded-full bg-magic-gradient flex items-center justify-center shadow-magic">
            <User className="w-5 h-5 text-gold-300" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-900" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white group-hover:text-gold-400 transition-colors">
              {user?.username || '冒险者'}
            </p>
            <p className="text-xs text-dark-400">魔法工匠</p>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
