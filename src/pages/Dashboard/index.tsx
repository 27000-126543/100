import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Hammer,
  Shirt,
  Gem,
  Coins,
  TrendingUp,
  Package,
  Sparkles,
  Trophy,
  Users,
  Clock,
  Star,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../../store/index.js';
import MagicCard from '../../components/MagicCard/index.js';
import MagicButton from '../../components/MagicButton/index.js';
import EquipmentCard from '../../components/EquipmentCard/index.js';
import Loading from '../../components/Loading/index.js';
import { formatGold, formatDate, getGenreIcon, getGenreName, getGenreColor } from '../../utils/format.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    workshop,
    equipments,
    rankings,
    announcements,
    loading,
    loadUser,
    loadWorkshop,
    loadInventory,
    loadRankings,
    loadAnnouncements,
  } = useAppStore();

  useEffect(() => {
    loadUser();
    loadWorkshop();
    loadInventory();
    loadRankings();
    loadAnnouncements();
  }, [loadUser, loadWorkshop, loadInventory, loadRankings, loadAnnouncements]);

  const stats = useMemo(() => {
    if (!user || !workshop) return null;
    return [
      {
        icon: <Hammer className="w-6 h-6" />,
        label: '今日制造',
        value: user.stats.todayCrafts,
        trend: '+12%',
        color: 'forge',
      },
      {
        icon: <Sparkles className="w-6 h-6" />,
        label: '今日附魔',
        value: user.stats.todayEnchants,
        trend: '+8%',
        color: 'magic',
      },
      {
        icon: <Package className="w-6 h-6" />,
        label: '材料种类',
        value: workshop.materials.length,
        trend: '+3',
        color: 'tailor',
      },
      {
        icon: <Coins className="w-6 h-6" />,
        label: '周收入',
        value: formatGold(user.stats.weeklyIncome),
        trend: '+25%',
        color: 'gold',
      },
    ];
  }, [user, workshop]);

  const quickActions = [
    { icon: <Hammer className="w-5 h-5" />, label: '开始制造', path: '/crafting', color: 'forge' as const },
    { icon: <Sparkles className="w-5 h-5" />, label: '装备附魔', path: '/enchanting', color: 'magic' as const },
    { icon: <Trophy className="w-5 h-5" />, label: '参加赛事', path: '/arena', color: 'gold' as const },
    { icon: <Users className="w-5 h-5" />, label: '公会大厅', path: '/guild', color: 'jewel' as const },
  ];

  if (loading.user || loading.workshop || loading.inventory) {
    return <Loading fullScreen text="正在加载魔法数据..." />;
  }

  if (!user || !workshop) return null;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-magic-700 via-purple-600 to-magic-800 p-8 border border-gold-500/30"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">
                欢迎回来，{user.username} {getGenreIcon(workshop.genre)}
              </h1>
              <p className="text-gold-200/80 text-lg">
                {getGenreName(workshop.genre)}工坊 · {workshop.name} · 等级 {workshop.level}
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-gold-400" />
                  <span className="text-gold-300 font-bold text-xl">{formatGold(user.gold)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/80">幸运值: {user.luck}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-white/80">排名: #{user.stats.rank}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getGenreColor(workshop.genre)} bg-opacity-20 border border-current`}>
                {getGenreIcon(workshop.genre)}
                <span className="font-bold">{getGenreName(workshop.genre)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MagicCard glowColor={stat.color as 'magic' | 'gold' | 'forge' | 'tailor' | 'jewel'} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                    stat.color === 'forge' ? 'bg-forge-500/20 text-forge-400' :
                    stat.color === 'tailor' ? 'bg-tailor-500/20 text-tailor-400' :
                    stat.color === 'jewel' ? 'bg-jewel-500/20 text-jewel-400' :
                    stat.color === 'gold' ? 'bg-gold-500/20 text-gold-400' :
                    'bg-magic-500/20 text-magic-400'
                  }`}>
                    {stat.icon}
                  </div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {stat.trend}
                </span>
              </div>
            </MagicCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MagicCard glowColor="gold" className="p-6">
            <h2 className="text-xl font-display font-bold text-gold-400 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              快捷操作
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action, index) => (
                <MagicButton
                  key={action.label}
                  variant={action.color}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center justify-center py-4 h-auto"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="mb-2"
                  >
                    {action.icon}
                  </motion.div>
                  <span className="text-sm">{action.label}</span>
                </MagicButton>
              ))}
            </div>
          </MagicCard>

          <MagicCard glowColor="magic" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-magic-400 flex items-center gap-2">
                <Package className="w-5 h-5" />
                最新装备
              </h2>
              <button
                onClick={() => navigate('/inventory')}
                className="text-sm text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors"
              >
                查看全部 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipments.slice(0, 3).map((equipment, index) => (
                <EquipmentCard key={equipment.id} equipment={equipment} />
              ))}
            </div>
          </MagicCard>
        </div>

        <div className="space-y-6">
          <MagicCard glowColor="forge" className="p-6">
            <h2 className="text-xl font-display font-bold text-forge-400 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              全服排行榜
            </h2>
            <div className="space-y-3">
              {rankings.slice(0, 5).map((rank, index) => (
                <motion.div
                  key={rank.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/50 border border-dark-700 hover:border-magic-500/50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-amber-700 text-white' :
                    'bg-dark-700 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{rank.playerName}</p>
                    <p className="text-gray-400 text-sm">评分: {rank.score}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold-400 font-bold">{rank.score}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </MagicCard>

          <MagicCard glowColor="tailor" className="p-6">
            <h2 className="text-xl font-display font-bold text-tailor-400 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              最新公告
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
              {announcements.slice(0, 5).map((ann, index) => (
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg bg-dark-800/50 border-l-2 border-magic-500"
                >
                  <p className="text-white/90 text-sm">{ann.content}</p>
                  <p className="text-gray-500 text-xs mt-1">{formatDate(ann.createdAt)}</p>
                </motion.div>
              ))}
            </div>
          </MagicCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
