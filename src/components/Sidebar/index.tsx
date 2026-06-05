import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Factory,
  Hammer,
  Sparkles,
  ShoppingCart,
  Swords,
  Users,
  Trophy,
  Store,
  Backpack,
  ScrollText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils.js';

const menuItems = [
  { path: '/dashboard', label: '仪表盘', icon: LayoutDashboard, color: 'text-magic-400' },
  { path: '/workshop', label: '工坊', icon: Factory, color: 'text-forge-400' },
  { path: '/crafting', label: '制造', icon: Hammer, color: 'text-forge-500' },
  { path: '/enchanting', label: '附魔', icon: Sparkles, color: 'text-magic-400' },
  { path: '/market', label: '交易', icon: ShoppingCart, color: 'text-gold-400' },
  { path: '/arena', label: '赛事', icon: Swords, color: 'text-red-400' },
  { path: '/guild', label: '公会', icon: Users, color: 'text-tailor-400' },
  { path: '/ranking', label: '排行榜', icon: Trophy, color: 'text-gold-500' },
  { path: '/browse', label: '工坊浏览', icon: Store, color: 'text-jewel-400' },
  { path: '/inventory', label: '背包', icon: Backpack, color: 'text-forge-400' },
  { path: '/quests', label: '任务', icon: ScrollText, color: 'text-magic-400' },
];

const sidebarVariants = {
  expanded: { width: 240 },
  collapsed: { width: 72 },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
};

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.aside
      initial={false}
      animate={isExpanded ? 'expanded' : 'collapsed'}
      variants={sidebarVariants}
      className="relative h-screen bg-dark-900/80 backdrop-blur-xl border-r border-gold-500/20 flex flex-col"
    >
      <div className="absolute inset-0 bg-rune-pattern opacity-30 pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-gold-500/20">
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-magic-gradient flex items-center justify-center shadow-magic">
                <Sparkles className="w-6 h-6 text-gold-300" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-gold-400 glow-text">
                  魔法工坊
                </h1>
                <p className="text-xs text-dark-400">Mystic Forge</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isExpanded && (
          <div className="w-10 h-10 rounded-lg bg-magic-gradient flex items-center justify-center shadow-magic mx-auto">
            <Sparkles className="w-6 h-6 text-gold-300" />
          </div>
        )}
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full",
            "bg-dark-800 border border-gold-500/50 flex items-center justify-center",
            "text-gold-400 hover:text-gold-300 transition-colors shadow-magic",
            !isExpanded && "left-1/2 -translate-x-1/2"
          )}
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      <nav className="relative z-10 flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group",
                  "hover:bg-magic-700/20",
                  isActive
                    ? "bg-magic-gradient text-white shadow-magic"
                    : "text-dark-300 hover:text-white"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold-400 rounded-r-full shadow-gold"
                    />
                  )}
                  
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className={cn(
                      "relative z-10",
                      isActive ? "text-gold-300" : item.color
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                  </motion.div>
                  
                  <AnimatePresence mode="wait">
                    {isExpanded && (
                      <motion.span
                        key="label"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className={cn(
                          "relative z-10 text-sm font-medium whitespace-nowrap overflow-hidden",
                          isActive && "text-shadow-glow"
                        )}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute inset-0 rounded-lg bg-magic-500/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="relative z-10 p-3 border-t border-gold-500/20">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative p-3 rounded-lg bg-glass border border-gold-500/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-magic-gradient opacity-10" />
          <div className="relative flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
              <Trophy className="w-4 h-4 text-dark-900" />
            </div>
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs text-dark-400">当前排名</p>
                  <p className="text-sm font-bold text-gold-400">#42</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  );
}
