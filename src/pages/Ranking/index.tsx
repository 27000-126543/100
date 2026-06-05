import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus, Download, Star, Hammer, Sparkles, BarChart3 } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { api } from '../../utils/api.js';
import { generateRadarData, generateTrendData, exportPDF } from '../../utils/pdf.js';
import MagicCard from '../../components/MagicCard/index.js';
import MagicButton from '../../components/MagicButton/index.js';
import Loading from '../../components/Loading/index.js';
import type { RankingEntry, WeeklyReport, RankingType } from '../../../shared/types.js';

const tabConfig = [
  { type: 'score' as RankingType, label: '评分榜', icon: <Star className="w-4 h-4" />, color: 'gold' as const },
  { type: 'craft_count' as RankingType, label: '制造榜', icon: <Hammer className="w-4 h-4" />, color: 'forge' as const },
  { type: 'enchant_count' as RankingType, label: '附魔榜', icon: <Sparkles className="w-4 h-4" />, color: 'magic' as const },
];

const trendIcons = {
  up: <TrendingUp className="w-4 h-4 text-green-400" />,
  down: <TrendingDown className="w-4 h-4 text-red-400" />,
  stable: <Minus className="w-4 h-4 text-gray-400" />,
};

const getRankBg = (rank: number) => {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-500/30 to-yellow-600/10 border-yellow-500/50';
  if (rank === 2) return 'bg-gradient-to-r from-gray-400/30 to-gray-500/10 border-gray-400/50';
  if (rank === 3) return 'bg-gradient-to-r from-amber-700/30 to-amber-800/10 border-amber-700/50';
  return 'bg-dark-800/50 border-dark-700';
};

const getRankText = (rank: number) => {
  if (rank === 1) return 'text-yellow-400';
  if (rank === 2) return 'text-gray-300';
  if (rank === 3) return 'text-amber-600';
  return 'text-gray-400';
};

const Ranking = () => {
  const [activeTab, setActiveTab] = useState<RankingType>('score');
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const radarChartRef = useRef<HTMLDivElement>(null);
  const trendChartRef = useRef<HTMLDivElement>(null);

  const fetchRankings = async (type: RankingType) => {
    try {
      const data = await api.ranking.getWeekly(type) as RankingEntry[];
      setRankings(data);
    } catch (e) {
      console.error('获取排行榜失败:', e);
    }
  };

  const fetchWeeklyReport = async () => {
    try {
      const data = await api.ranking.getWeeklyReport() as WeeklyReport;
      setWeeklyReport(data);
    } catch (e) {
      console.error('获取周报告失败:', e);
    }
  };

  useEffect(() => {
    fetchRankings(activeTab);
    fetchWeeklyReport();
    setLoading(false);
  }, [activeTab]);

  const handleTabChange = (type: RankingType) => {
    setActiveTab(type);
  };

  const handleExportPDF = async () => {
    if (!weeklyReport) return;
    setExporting(true);
    try {
      await exportPDF(weeklyReport, radarChartRef, trendChartRef);
    } catch (e) {
      console.error('导出PDF失败:', e);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="正在加载排行榜数据..." />;
  }

  const topEquipment = weeklyReport?.topEquipment?.[0];
  const radarData = topEquipment ? generateRadarData(topEquipment.attributes) : [];
  const trendData = weeklyReport ? generateTrendData(weeklyReport.craftingTrend.map(t => ({
    date: new Date(t.date).toISOString(),
    count: t.count
  }))) : [];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-gold-400" />
            周排行榜
          </h1>
          <p className="text-gray-400 mt-1">查看全服工匠的本周表现</p>
        </div>
        <MagicButton
          variant="gold"
          icon={<Download className="w-4 h-4" />}
          onClick={handleExportPDF}
          disabled={exporting || !weeklyReport}
        >
          {exporting ? '导出中...' : '导出周报PDF'}
        </MagicButton>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <MagicCard glowColor="gold" className="p-4">
            <div className="flex gap-2 mb-4">
              {tabConfig.map((tab) => (
                <MagicButton
                  key={tab.type}
                  variant={activeTab === tab.type ? tab.color : 'ghost'}
                  size="sm"
                  icon={tab.icon}
                  onClick={() => handleTabChange(tab.type)}
                  className="flex-1"
                >
                  {tab.label}
                </MagicButton>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2"
              >
                {rankings.map((entry, index) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:border-gold-500/50 ${getRankBg(entry.rank)}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      entry.rank === 1 ? 'bg-yellow-500 text-black' :
                      entry.rank === 2 ? 'bg-gray-400 text-black' :
                      entry.rank === 3 ? 'bg-amber-700 text-white' :
                      'bg-dark-700 text-gray-400'
                    }`}>
                      {entry.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{entry.playerName}</p>
                      <p className="text-gray-500 text-sm truncate">{entry.workshopName}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getRankText(entry.rank)}`}>
                        {entry.value.toLocaleString()}
                      </p>
                      {trendIcons[entry.trend]}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </MagicCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <MagicCard glowColor="magic" className="p-6">
            <h2 className="text-xl font-display font-bold text-magic-400 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              周数据分析报告
            </h2>

            {weeklyReport && topEquipment && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-gold-400 font-medium mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    本周热门装备属性
                  </h3>
                  <div className="mb-3 p-3 bg-dark-800/50 rounded-lg">
                    <p className="text-white font-medium">{topEquipment.name}</p>
                    <p className="text-sm text-gray-400">评分: {topEquipment.score} | 品质: {topEquipment.quality}/100</p>
                  </div>
                  <div ref={radarChartRef} className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#444" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#D4AF37', fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#888', fontSize: 10 }} />
                        <Radar name="属性值" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-gold-400 font-medium mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    本周制造趋势
                  </h3>
                  <div ref={trendChartRef} className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#888', fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1C1C28', border: '1px solid #D4AF3750', borderRadius: '8px' }}
                          labelStyle={{ color: '#D4AF37' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Legend wrapperStyle={{ color: '#888', fontSize: 12 }} />
                        <Line type="monotone" dataKey="制造数量" stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#D4AF37', r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </MagicCard>

          {weeklyReport && (
            <MagicCard glowColor="forge" className="p-6">
              <h3 className="text-xl font-display font-bold text-forge-400 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                🏆 本周排行榜 TOP 5 汇总
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tabConfig.map((tab) => {
                  const data = tab.type === 'score' ? weeklyReport.rankings.byScore :
                              tab.type === 'craft_count' ? weeklyReport.rankings.byCraftCount :
                              weeklyReport.rankings.byEnchantCount;
                  return (
                    <div key={tab.type} className="bg-dark-800/50 rounded-lg p-4 border border-dark-700">
                      <div className="flex items-center gap-2 mb-3">
                        {tab.icon}
                        <span className={`font-bold ${
                          tab.color === 'gold' ? 'text-gold-400' :
                          tab.color === 'forge' ? 'text-forge-400' : 'text-magic-400'
                        }`}>{tab.label}</span>
                      </div>
                      <div className="space-y-2">
                        {data.slice(0, 5).map((entry, i) => (
                          <div key={entry.rank} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                i === 0 ? 'bg-yellow-500 text-black' :
                                i === 1 ? 'bg-gray-400 text-black' :
                                i === 2 ? 'bg-amber-700 text-white' :
                                'bg-dark-700 text-gray-400'
                              }`}>
                                {entry.rank}
                              </span>
                              <span className="text-gray-300 truncate max-w-[100px]">{entry.playerName}</span>
                            </div>
                            <span className="text-gold-400 font-medium">{entry.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </MagicCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ranking;
