import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, Sword, Star, Gift, ChevronRight, Crown, Medal, Award } from 'lucide-react';
import { useAppStore } from '../../store/index.js';
import { api } from '../../utils/api.js';
import MagicCard from '../../components/MagicCard/index.js';
import MagicButton from '../../components/MagicButton/index.js';
import EquipmentCard from '../../components/EquipmentCard/index.js';
import Loading from '../../components/Loading/index.js';
import Empty from '../../components/Empty.js';
import { formatGold, formatDate, getGenreName, getGenreIcon } from '../../utils/format.js';
import type { Equipment, SeasonReward, CompetitionEntry } from '../../../shared/types.js';

const Arena = () => {
  const { competition, equipments, rankings, loading, user, loadCompetition, loadInventory, loadRankings } = useAppStore();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [seasonInfo, setSeasonInfo] = useState<any>(null);
  const [seasonRewards, setSeasonRewards] = useState<SeasonReward[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCompetition();
    loadInventory();
    loadRankings();
    loadSeasonData();
  }, [loadCompetition, loadInventory, loadRankings]);

  const loadSeasonData = async () => {
    try {
      const [season, rewards] = await Promise.all([
        api.arena.getSeason(),
        api.arena.getSeasonRewards(),
      ]);
      setSeasonInfo(season);
      setSeasonRewards(rewards as SeasonReward[]);
    } catch (e) {
      console.error('Failed to load season data:', e);
    }
  };

  const myEntry = useMemo(() => {
    if (!competition || !user) return null;
    return competition.entries.find(e => e.playerId === user.id);
  }, [competition, user]);

  const eligibleEquipments = useMemo(() => {
    if (!competition) return [];
    return equipments.filter(e => 
      !e.isListed && (competition.requiredGenre === 'all' || e.genre === competition.requiredGenre)
    );
  }, [equipments, competition]);

  const handleSubmitEntry = async () => {
    if (!competition || !selectedEquipment) return;
    setSubmitting(true);
    try {
      await api.arena.submitEntry({
        competitionId: competition.id,
        equipmentId: selectedEquipment.id,
      });
      await loadCompetition();
      setShowEquipmentModal(false);
      setSelectedEquipment(null);
    } catch (e: any) {
      console.error('Failed to submit entry:', e);
      alert(e.message || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  const getTimeRemaining = () => {
    if (!competition) return '';
    const now = Date.now();
    const end = new Date(competition.endTime).getTime();
    const diff = end - now;
    if (diff <= 0) return '已结束';
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}时${minutes}分`;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-dark-400">{rank}</span>;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <span className="text-green-400">↑</span>;
    if (trend === 'down') return <span className="text-red-400">↓</span>;
    return <span className="text-dark-400">—</span>;
  };

  if (loading.competition || loading.inventory || loading.rankings) {
    return <Loading fullScreen text="正在加载赛事信息..." />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gold-600 via-yellow-500 to-gold-600 p-8 border border-gold-400/50"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                装备评分赛
              </h1>
              <p className="text-white/80 text-lg">
                {seasonInfo?.name || '🌟 第一赛季：创世之初 🌟'}
              </p>
              {competition && (
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-white/80" />
                    <span className="text-white/90">剩余时间: <span className="font-bold text-white">{getTimeRemaining()}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sword className="w-5 h-5 text-white/80" />
                    <span className="text-white/90">参赛人数: <span className="font-bold text-white">{competition.entries.length}</span></span>
                  </div>
                  {myEntry && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                      <span className="text-white/90">当前排名: <span className="font-bold text-yellow-300">#{myEntry.rank}</span></span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <MagicButton
              variant="gold"
              size="lg"
              onClick={() => setShowEquipmentModal(true)}
              icon={<Sword className="w-5 h-5" />}
            >
              {myEntry ? '更新参赛装备' : '提交装备参赛'}
            </MagicButton>
          </div>
        </div>
      </motion.div>

      {competition && (
        <MagicCard glowColor="gold" className="p-6">
          <h2 className="text-xl font-display font-bold text-gold-400 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            今日赛事
          </h2>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gold-500/10 to-transparent border border-gold-500/30">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{competition.theme}</h3>
              <p className="text-dark-400">
                装备要求: {competition.requiredGenre === 'all' ? '全部流派' : getGenreName(competition.requiredGenre as any)} {getGenreIcon(competition.requiredGenre as any)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-dark-400 mb-1">参赛截止</div>
              <div className="text-gold-400 font-mono font-bold">
                {formatDate(competition.endTime)}
              </div>
            </div>
          </div>
        </MagicCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MagicCard glowColor="magic" className="p-6">
            <h2 className="text-xl font-display font-bold text-magic-400 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              今日排行榜
            </h2>
            {competition?.entries.length ? (
              <div className="space-y-3">
                {competition.entries.slice(0, 10).map((entry: CompetitionEntry, index: number) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      myEntry?.id === entry.id
                        ? 'bg-gold-500/10 border-gold-500/50'
                        : 'bg-dark-800/50 border-dark-700 hover:border-magic-500/50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-dark-800">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{entry.playerName}</p>
                      <p className="text-sm text-dark-400">{entry.equipment.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gold-400 font-bold font-mono text-lg">{entry.score.toLocaleString()}</p>
                      <p className="text-xs text-dark-500">评分</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Empty text="暂无参赛选手" />
            )}
          </MagicCard>
        </div>

        <div className="space-y-6">
          <MagicCard glowColor="forge" className="p-6">
            <h2 className="text-xl font-display font-bold text-forge-400 mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5" />
              赛季奖励
            </h2>
            <div className="space-y-2">
              {seasonRewards.slice(0, 5).map((reward, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-dark-800/50 border border-dark-700"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    reward.rank === 1 ? 'bg-yellow-500 text-black' :
                    reward.rank === 2 ? 'bg-gray-400 text-black' :
                    reward.rank === 3 ? 'bg-amber-700 text-white' :
                    'bg-dark-700 text-dark-400'
                  }`}>
                    {reward.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{reward.itemName}</p>
                    <p className="text-dark-500 text-xs">x{reward.quantity}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </MagicCard>

          <MagicCard glowColor="jewel" className="p-6">
            <h2 className="text-xl font-display font-bold text-jewel-400 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              全服排名
            </h2>
            <div className="space-y-2">
              {rankings.slice(0, 5).map((rank: any, index: number) => (
                <motion.div
                  key={rank.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-dark-800/50 border border-dark-700"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-dark-700">
                    {getRankIcon(rank.rank)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{rank.playerName}</p>
                    <p className="text-dark-500 text-xs">{rank.workshopName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(rank.trend)}
                    <span className="text-gold-400 font-mono font-bold">{rank.value}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </MagicCard>
        </div>
      </div>

      <AnimatePresence>
        {showEquipmentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowEquipmentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-900 rounded-2xl border border-gold-500/30 p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display font-bold text-gold-400">选择参赛装备</h3>
                <button
                  onClick={() => setShowEquipmentModal(false)}
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {eligibleEquipments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {eligibleEquipments.map((eq) => (
                      <div
                        key={eq.id}
                        onClick={() => setSelectedEquipment(eq)}
                        className={`cursor-pointer transition-all ${
                          selectedEquipment?.id === eq.id ? 'ring-2 ring-gold-400 rounded-xl' : ''
                        }`}
                      >
                        <EquipmentCard equipment={eq} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty text="没有符合条件的装备" />
                )}
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-dark-700">
                <MagicButton
                  variant="ghost"
                  onClick={() => setShowEquipmentModal(false)}
                >
                  取消
                </MagicButton>
                <MagicButton
                  variant="gold"
                  onClick={handleSubmitEntry}
                  disabled={!selectedEquipment || submitting}
                  icon={<ChevronRight className="w-5 h-5" />}
                >
                  {submitting ? '提交中...' : '确认参赛'}
                </MagicButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Arena;
