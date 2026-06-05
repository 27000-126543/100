import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Building2, Users, X, ChevronDown, Star, Crown, MapPin } from 'lucide-react';
import { api } from '../../utils/api.js';
import MagicCard from '../../components/MagicCard/index.js';
import MagicButton from '../../components/MagicButton/index.js';
import Loading from '../../components/Loading/index.js';
import BuildingCard from '../../components/BuildingCard/index.js';
import MemberCard from '../../components/MemberCard/index.js';
import { getGenreName, getGenreIcon, getGenreColor } from '../../utils/format.js';
import type { Workshop, PaginatedResponse } from '../../../shared/types.js';
import { GENRE_INFO } from '../../../shared/types.js';

const genreOptions = [
  { value: 'all', label: '全部流派', icon: '🏰' },
  ...Object.values(GENRE_INFO).map(g => ({ value: g.id, label: g.name, icon: g.icon })),
];

const levelOptions = [
  { value: 0, label: '全部等级' },
  { value: 5, label: 'Lv.5+' },
  { value: 8, label: 'Lv.8+' },
  { value: 10, label: 'Lv.10+' },
];

const getGlowColor = (genre: string) => getGenreColor(genre as 'blacksmith' | 'tailor' | 'jeweler') as 'magic' | 'gold' | 'forge' | 'tailor' | 'jewel';
const getGenreBadge = (genre: string) => {
  if (genre === 'blacksmith') return 'bg-forge-500/20 text-forge-400';
  if (genre === 'tailor') return 'bg-tailor-500/20 text-tailor-400';
  return 'bg-jewel-500/20 text-jewel-400';
};

const WorkshopBrowse = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [filters, setFilters] = useState({ genre: 'all', level: 0, search: '' });
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {};
      if (filters.genre !== 'all') params.genre = filters.genre;
      if (filters.level > 0) params.level = filters.level;
      const data = await api.workshop.getAll(params) as PaginatedResponse<Workshop>;
      setWorkshops(data.items || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchWorkshopDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const data = await api.workshop.getById(id) as Workshop;
      setSelectedWorkshop(data);
      setShowDetail(true);
    } catch (e) { console.error(e); } finally { setDetailLoading(false); }
  };

  useEffect(() => { fetchWorkshops(); }, [filters.genre, filters.level]);

  const filteredWorkshops = workshops.filter(w =>
    w.name.toLowerCase().includes(filters.search.toLowerCase()) ||
    w.ownerName.toLowerCase().includes(filters.search.toLowerCase())
  );

  const selectedGenre = genreOptions.find(g => g.value === filters.genre) || genreOptions[0];
  const selectedLevel = levelOptions.find(l => l.value === filters.level) || levelOptions[0];

  if (loading) return <Loading fullScreen text="正在加载工坊列表..." />;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
          <Building2 className="w-8 h-8 text-forge-400" />
          工坊浏览
        </h1>
        <p className="text-gray-400 mt-1">探索全服优秀的魔法工坊</p>
      </motion.div>

      <MagicCard glowColor="forge" className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="搜索工坊名称或工坊主..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-dark-800 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-400 focus:outline-none"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <MagicButton
                variant="ghost"
                icon={<Filter className="w-4 h-4" />}
                onClick={() => { setShowGenreDropdown(!showGenreDropdown); setShowLevelDropdown(false); }}
              >
                {selectedGenre.icon} {selectedGenre.label}
                <ChevronDown className="w-4 h-4 ml-1" />
              </MagicButton>
              <AnimatePresence>
                {showGenreDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-40 bg-dark-800 border border-gold-500/30 rounded-lg overflow-hidden z-20 shadow-xl"
                  >
                    {genreOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setFilters({ ...filters, genre: option.value }); setShowGenreDropdown(false); }}
                        className={`w-full px-4 py-2.5 text-left hover:bg-dark-700 flex items-center gap-2 ${
                          filters.genre === option.value ? 'bg-gold-500/20 text-gold-400' : 'text-white'
                        }`}
                      >
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative">
              <MagicButton
                variant="ghost"
                icon={<Star className="w-4 h-4" />}
                onClick={() => { setShowLevelDropdown(!showLevelDropdown); setShowGenreDropdown(false); }}
              >
                {selectedLevel.label}
                <ChevronDown className="w-4 h-4 ml-1" />
              </MagicButton>
              <AnimatePresence>
                {showLevelDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-32 bg-dark-800 border border-gold-500/30 rounded-lg overflow-hidden z-20 shadow-xl"
                  >
                    {levelOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setFilters({ ...filters, level: option.value }); setShowLevelDropdown(false); }}
                        className={`w-full px-4 py-2.5 text-left hover:bg-dark-700 ${
                          filters.level === option.value ? 'bg-gold-500/20 text-gold-400' : 'text-white'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </MagicCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkshops.map((workshop, index) => (
          <motion.div
            key={workshop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <MagicCard
              glowColor={getGlowColor(workshop.genre)}
              className="p-5 h-full"
              onClick={() => fetchWorkshopDetail(workshop.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{getGenreIcon(workshop.genre)}</span>
                    <h3 className="text-lg font-display font-bold text-white">{workshop.name}</h3>
                  </div>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-gold-400" />
                    {workshop.ownerName}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${getGenreBadge(workshop.genre)}`}>
                  Lv.{workshop.level}
                </div>
              </div>
              {workshop.signboard && (
                <p className="text-sm text-gold-300/80 italic mb-4 px-3 py-2 bg-dark-800/50 rounded-lg border-l-2 border-gold-500/50">
                  {workshop.signboard}
                </p>
              )}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800/50">
                  <Building2 className="w-4 h-4 text-forge-400" />
                  <div>
                    <p className="text-xs text-gray-500">建筑</p>
                    <p className="text-white font-bold">{workshop.buildings.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800/50">
                  <Users className="w-4 h-4 text-magic-400" />
                  <div>
                    <p className="text-xs text-gray-500">工匠</p>
                    <p className="text-white font-bold">{workshop.members.length}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getGenreBadge(workshop.genre)}`}>
                  <MapPin className="w-3.5 h-3.5" />
                  {getGenreName(workshop.genre)}
                </span>
                <MagicButton variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); fetchWorkshopDetail(workshop.id); }}>
                  查看详情
                </MagicButton>
              </div>
            </MagicCard>
          </motion.div>
        ))}
      </div>

      {filteredWorkshops.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="text-6xl mb-4">🏰</div>
          <h3 className="text-xl font-display font-bold text-gray-400 mb-2">暂无符合条件的工坊</h3>
          <p className="text-gray-500">尝试调整筛选条件</p>
        </motion.div>
      )}

      <AnimatePresence>
        {showDetail && selectedWorkshop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <MagicCard glowColor={getGlowColor(selectedWorkshop.genre)} className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{getGenreIcon(selectedWorkshop.genre)}</span>
                      <div>
                        <h2 className="text-2xl font-display font-bold text-white">{selectedWorkshop.name}</h2>
                        <p className="text-gray-400 flex items-center gap-1">
                          <Crown className="w-4 h-4 text-gold-400" />
                          工坊主: {selectedWorkshop.ownerName}
                          <span className="mx-2">·</span>
                          <span className={`px-2 py-0.5 rounded text-sm ${getGenreBadge(selectedWorkshop.genre)}`}>
                            Lv.{selectedWorkshop.level} {getGenreName(selectedWorkshop.genre)}
                          </span>
                        </p>
                      </div>
                    </div>
                    {selectedWorkshop.signboard && (
                      <p className="text-gold-300/80 italic mt-2 px-4 py-2 bg-dark-800/50 rounded-lg border-l-3 border-gold-500/50">
                        {selectedWorkshop.signboard}
                      </p>
                    )}
                  </div>
                  <MagicButton variant="ghost" size="sm" icon={<X className="w-5 h-5" />} onClick={() => setShowDetail(false)} />
                </div>
                {detailLoading ? (
                  <Loading text="加载工坊详情..." />
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-forge-400 mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        工坊布局
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedWorkshop.buildings.map((building) => (
                          <BuildingCard key={building.id} building={building} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-magic-400 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        工匠阵容
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedWorkshop.members.map((member) => (
                          <MemberCard key={member.id} member={member} />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center pt-4">
                      <MagicButton variant="gold" size="lg" onClick={() => setShowDetail(false)}>
                        关闭
                      </MagicButton>
                    </div>
                  </div>
                )}
              </MagicCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkshopBrowse;
