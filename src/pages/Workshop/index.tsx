import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hammer, Users, Building2, Package, Star, Plus, Trash2,
  UserPlus, ChevronDown, Check, Crown
} from 'lucide-react';
import { useAppStore } from '../../store/index.js';
import MagicCard from '../../components/MagicCard/index.js';
import MagicButton from '../../components/MagicButton/index.js';
import MemberCard from '../../components/MemberCard/index.js';
import BuildingCard from '../../components/BuildingCard/index.js';
import StatBar from '../../components/StatBar/index.js';
import Loading from '../../components/Loading/index.js';
import { api } from '../../utils/api.js';
import type { Workshop, Genre, Position, WorkshopMember } from '../../../shared/types.js';
import { GENRE_INFO, POSITION_INFO } from '../../../shared/types.js';
import { getGenreIcon, getGenreName, getGenreColor } from '../../utils/format.js';

const WorkshopPage = () => {
  const { workshop, materials, loading, loadWorkshop, loadInventory, updateWorkshop } = useAppStore();
  const [activeTab, setActiveTab] = useState<'info' | 'members' | 'buildings' | 'materials'>('info');
  const [showCreate, setShowCreate] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState<WorkshopMember | null>(null);
  const [showPosMenu, setShowPosMenu] = useState(false);
  const [newWS, setNewWS] = useState({ name: '', signboard: '', genre: 'blacksmith' as Genre });
  const [newMember, setNewMember] = useState({ name: '', position: 'apprentice' as Position, skillLevel: 30, luck: 5 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadWorkshop(); loadInventory(); }, [loadWorkshop, loadInventory]);
  const reputation = workshop ? workshop.level * 1500 + workshop.members.length * 200 : 0;

  const handleCreate = async () => {
    if (!newWS.name.trim()) return;
    setSubmitting(true);
    try {
      const data = await api.workshop.create(newWS) as Workshop;
      updateWorkshop(data);
      setShowCreate(false);
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  };

  const handleAddMember = async () => {
    if (!newMember.name.trim()) return;
    setSubmitting(true);
    try {
      const data = await api.workshop.addMember(newMember) as Workshop;
      updateWorkshop(data);
      setShowAddMember(false);
      setNewMember({ name: '', position: 'apprentice', skillLevel: 30, luck: 5 });
    } catch (e) { console.error(e); } finally { setSubmitting(false); }
  };

  const handleUpdatePos = async (id: string, pos: Position) => {
    try {
      const data = await api.workshop.updateMember(id, { position: pos }) as Workshop;
      updateWorkshop(data);
      setSelectedMember(null); setShowPosMenu(false);
    } catch (e) { console.error(e); }
  };

  const handleRemoveMember = async (id: string) => {
    try {
      const data = await api.workshop.removeMember(id) as Workshop;
      updateWorkshop(data);
      setSelectedMember(null);
    } catch (e) { console.error(e); }
  };

  const handleUpgrade = async (type: string, pending: boolean) => {
    try {
      const fn = pending ? api.workshop.approveUpgrade : api.workshop.upgradeBuilding;
      const data = await fn(type) as Workshop;
      updateWorkshop(data);
    } catch (e) { console.error(e); }
  };

  if (loading.workshop || loading.inventory) return <Loading fullScreen text="加载中..." />;

  if (!workshop) return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <MagicCard glowColor="magic" className="p-8 max-w-md w-full text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-6xl mb-4">🏰</motion.div>
        <h2 className="text-2xl font-display font-bold text-gold-400 mb-2">尚未创建工坊</h2>
        <p className="text-dark-400 mb-6">创建属于你的魔法工坊，招募工匠，锻造传奇装备！</p>
        <MagicButton variant="gold" size="lg" icon={<Hammer className="w-5 h-5" />} fullWidth onClick={() => setShowCreate(true)}>创建工坊</MagicButton>
      </MagicCard>
      <AnimatePresence>{showCreate && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <MagicCard glowColor="gold" className="p-6 max-w-lg w-full">
            <h3 className="text-xl font-display font-bold text-gold-400 mb-4">创建工坊</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-400 mb-1">工坊名称</label>
                <input type="text" value={newWS.name} onChange={(e) => setNewWS({ ...newWS, name: e.target.value })} placeholder="请输入工坊名称" className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-gold-500/30 text-white focus:border-gold-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-1">工坊招牌</label>
                <input type="text" value={newWS.signboard} onChange={(e) => setNewWS({ ...newWS, signboard: e.target.value })} placeholder="一句响亮的口号" className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-gold-500/30 text-white focus:border-gold-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-2">选择流派</label>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.keys(GENRE_INFO) as Genre[]).map((g) => (
                    <motion.button key={g} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setNewWS({ ...newWS, genre: g })} className={`p-3 rounded-xl border-2 transition-all ${newWS.genre === g ? 'border-gold-400 bg-gold-500/10' : 'border-dark-600 bg-dark-800/50 hover:border-gold-500/50'}`}>
                      <div className="text-2xl mb-1">{GENRE_INFO[g].icon}</div>
                      <div className={`text-sm font-medium ${getGenreColor(g)}`}>{GENRE_INFO[g].name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <MagicButton variant="ghost" fullWidth onClick={() => setShowCreate(false)}>取消</MagicButton>
              <MagicButton variant="gold" fullWidth icon={<Check className="w-4 h-4" />} onClick={handleCreate} disabled={submitting || !newWS.name.trim()}>{submitting ? '创建中...' : '确认创建'}</MagicButton>
            </div>
          </MagicCard>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );

  const tabs = [
    { id: 'info', label: '工坊信息', icon: <Crown className="w-4 h-4" /> },
    { id: 'members', label: '成员管理', icon: <Users className="w-4 h-4" /> },
    { id: 'buildings', label: '建筑管理', icon: <Building2 className="w-4 h-4" /> },
    { id: 'materials', label: '材料库存', icon: <Package className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-magic-700 via-purple-600 to-magic-800 p-6 border border-gold-500/30">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{getGenreIcon(workshop.genre)}</span>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">{workshop.name}</h1>
              <p className="text-gold-200/80 text-sm">{workshop.signboard}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGenreColor(workshop.genre)} bg-current/10 border border-current/30`}>{getGenreName(workshop.genre)}</span>
            <span className="text-white/70 flex items-center gap-1"><Star className="w-4 h-4 text-gold-400" />等级 {workshop.level}</span>
            <span className="text-white/70 flex items-center gap-1"><Crown className="w-4 h-4 text-purple-400" />声望 {reputation.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <MagicButton key={tab.id} variant={activeTab === tab.id ? 'gold' : 'ghost'} size="md" icon={tab.icon} onClick={() => setActiveTab(tab.id)}>{tab.label}</MagicButton>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'info' && (
          <motion.div key="info" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MagicCard glowColor="gold" className="p-6">
              <h3 className="text-lg font-display font-bold text-gold-400 mb-4 flex items-center gap-2"><Star className="w-5 h-5" />工坊状态</h3>
              <div className="space-y-4">
                <StatBar label="工坊等级" value={workshop.level} maxValue={10} color="gold" icon={<Star className="w-4 h-4" />} />
                <StatBar label="工坊声望" value={reputation} maxValue={20000} color="magic" icon={<Crown className="w-4 h-4" />} />
                <StatBar label="成员数量" value={workshop.members.length} maxValue={10} color="tailor" icon={<Users className="w-4 h-4" />} />
              </div>
            </MagicCard>
            <MagicCard glowColor="magic" className="p-6">
              <h3 className="text-lg font-display font-bold text-magic-400 mb-4 flex items-center gap-2"><Users className="w-5 h-5" />工匠统计</h3>
              <div className="grid grid-cols-2 gap-3">
                {(['master', 'journeyman', 'apprentice', 'steward'] as Position[]).map((pos, i) => (
                  <div key={pos} className={`p-3 rounded-xl bg-dark-800/50 border ${i === 0 ? 'border-gold-500/20' : i === 1 ? 'border-magic-500/20' : i === 2 ? 'border-tailor-500/20' : 'border-forge-500/20'}`}>
                    <div className={`text-2xl font-bold ${i === 0 ? 'text-gold-400' : i === 1 ? 'text-magic-400' : i === 2 ? 'text-tailor-400' : 'text-forge-400'}`}>{workshop.members.filter(m => m.position === pos).length}</div>
                    <div className="text-sm text-dark-400">{POSITION_INFO[pos].name}</div>
                  </div>
                ))}
              </div>
            </MagicCard>
          </motion.div>
        )}

        {activeTab === 'members' && (
          <motion.div key="members" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-display font-bold text-white">成员列表 ({workshop.members.length}/10)</h3>
              <MagicButton variant="gold" size="md" icon={<UserPlus className="w-4 h-4" />} onClick={() => setShowAddMember(true)} disabled={workshop.members.length >= 10}>招募成员</MagicButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workshop.members.map((m, i) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <MemberCard member={m} selected={selectedMember?.id === m.id} onClick={() => { setSelectedMember(selectedMember?.id === m.id ? null : m); setShowPosMenu(false); }} />
                  {selectedMember?.id === m.id && m.position !== 'master' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 p-3 rounded-xl bg-dark-800/80 border border-gold-500/30 space-y-2">
                      <div className="relative">
                        <MagicButton variant="ghost" size="sm" fullWidth icon={<ChevronDown className="w-4 h-4" />} onClick={() => setShowPosMenu(!showPosMenu)}>调整职位: {POSITION_INFO[m.position].name}</MagicButton>
                        {showPosMenu && (
                          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 right-0 mt-1 bg-dark-800 border border-gold-500/30 rounded-xl overflow-hidden z-10">
                            {(['journeyman', 'apprentice', 'steward'] as Position[]).map((pos) => pos !== m.position && (
                              <button key={pos} onClick={() => handleUpdatePos(m.id, pos)} className="w-full px-4 py-2 text-left text-white/80 hover:bg-gold-500/10 hover:text-gold-400 transition-colors">{POSITION_INFO[pos].name}</button>
                            ))}
                          </motion.div>
                        )}
                      </div>
                      <MagicButton variant="forge" size="sm" fullWidth icon={<Trash2 className="w-4 h-4" />} onClick={() => handleRemoveMember(m.id)}>解雇成员</MagicButton>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'buildings' && (
          <motion.div key="buildings" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            <h3 className="text-lg font-display font-bold text-white">建筑管理</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {workshop.buildings.map((b) => (
                <BuildingCard key={b.id} building={b} onUpgrade={() => handleUpgrade(b.type, b.pendingUpgrade)} />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'materials' && (
          <motion.div key="materials" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            <h3 className="text-lg font-display font-bold text-white">材料库存 ({materials.length} 种)</h3>
            <MagicCard glowColor="jewel" className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {materials.map((mat, i) => (
                  <motion.div key={mat.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} whileHover={{ scale: 1.05, y: -2 }} className="p-3 rounded-xl bg-dark-800/50 border border-gold-500/20 text-center">
                    <div className="text-3xl mb-1">{mat.icon}</div>
                    <div className="text-sm font-medium text-white truncate">{mat.name}</div>
                    <div className="text-lg font-bold font-mono text-gold-400">{mat.quantity}</div>
                  </motion.div>
                ))}
              </div>
            </MagicCard>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{showAddMember && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <MagicCard glowColor="magic" className="p-6 max-w-md w-full">
            <h3 className="text-xl font-display font-bold text-magic-400 mb-4">招募新成员</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-dark-400 mb-1">成员姓名</label>
                <input type="text" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} placeholder="请输入成员姓名" className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-gold-500/30 text-white focus:border-gold-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-2">初始职位</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['journeyman', 'apprentice', 'steward'] as Position[]).map((pos) => (
                    <button key={pos} onClick={() => setNewMember({ ...newMember, position: pos })} className={`p-2 rounded-lg text-sm font-medium transition-all ${newMember.position === pos ? 'bg-magic-500/20 text-magic-400 border border-magic-500/50' : 'bg-dark-800/50 text-dark-400 border border-dark-600 hover:border-gold-500/30'}`}>{POSITION_INFO[pos].name}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-dark-400 mb-1">技能等级</label>
                  <input type="number" min="1" max="100" value={newMember.skillLevel} onChange={(e) => setNewMember({ ...newMember, skillLevel: Math.min(100, Math.max(1, parseInt(e.target.value) || 1)) })} className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-gold-500/30 text-white focus:border-gold-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-dark-400 mb-1">幸运值</label>
                  <input type="number" min="1" max="30" value={newMember.luck} onChange={(e) => setNewMember({ ...newMember, luck: Math.min(30, Math.max(1, parseInt(e.target.value) || 1)) })} className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-gold-500/30 text-white focus:border-gold-400 focus:outline-none" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <MagicButton variant="ghost" fullWidth onClick={() => setShowAddMember(false)}>取消</MagicButton>
              <MagicButton variant="magic" fullWidth icon={<Plus className="w-4 h-4" />} onClick={handleAddMember} disabled={submitting || !newMember.name.trim()}>{submitting ? '招募中...' : '确认招募'}</MagicButton>
            </div>
          </MagicCard>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
};

export default WorkshopPage;
