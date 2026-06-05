import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Crown, Star, Swords, Building2, Gift, ChevronRight, Check, X, Shield, Zap } from 'lucide-react';
import { useAppStore } from '../../store/index.js';
import { api } from '../../utils/api.js';
import MagicCard from '../../components/MagicCard/index.js';
import MagicButton from '../../components/MagicButton/index.js';
import Loading from '../../components/Loading/index.js';
import Empty from '../../components/Empty.js';
import { formatDate } from '../../utils/format.js';
import { GUILD_BUILDING_INFO } from '../../../shared/types.js';
import type { GuildMember, GuildBuilding, Duel, DuelStatus } from '../../../shared/types.js';

const Guild = () => {
  const { guild, duels, user, loading, loadGuild, loadDuels } = useAppStore();
  const [contributeAmount, setContributeAmount] = useState(100);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [showDuelModal, setShowDuelModal] = useState(false);
  const [targetGuildId, setTargetGuildId] = useState('');
  const [themeEquipment, setThemeEquipment] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'members' | 'buildings' | 'duels'>('info');

  useEffect(() => { loadGuild(); loadDuels(); }, [loadGuild, loadDuels]);

  const myRole = useMemo(() => guild && user ? guild.members.find(m => m.playerId === user.id)?.role : null, [guild, user]);
  const canManage = myRole === 'president' || myRole === 'vice_president';
  const myMember = guild?.members.find(m => m.playerId === user?.id);

  const handleContribute = async () => {
    if (!guild || contributeAmount <= 0) return;
    try { await api.guild.contribute({ type: 'gold', amount: contributeAmount } as any); await loadGuild(); setShowContributeModal(false); setContributeAmount(100); }
    catch (e: any) { alert(e.message || '贡献失败'); }
  };

  const handleUpgradeBuilding = async (buildingType: string) => {
    if (!canManage) return;
    try { await api.guild.upgradeBuilding({ buildingType, gold: 0, materials: {} } as any); await loadGuild(); }
    catch (e: any) { alert(e.message || '升级失败'); }
  };

  const handleChallenge = async () => {
    if (!targetGuildId || !themeEquipment || selectedMembers.length === 0) return;
    try { await api.guild.challenge({ targetGuildId, themeEquipment, representativeIds: selectedMembers }); await loadDuels(); setShowDuelModal(false); setTargetGuildId(''); setThemeEquipment(''); setSelectedMembers([]); }
    catch (e: any) { alert(e.message || '发起对决失败'); }
  };

  const handleRespondDuel = async (duelId: string, accept: boolean) => {
    try { await api.guild.respondDuel(duelId, accept); await loadDuels(); }
    catch (e: any) { alert(e.message || '操作失败'); }
  };

  const toggleMemberSelect = (memberId: string) => {
    if (selectedMembers.includes(memberId)) setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    else if (selectedMembers.length < 3) setSelectedMembers([...selectedMembers, memberId]);
  };

  const getRoleIcon = (role: string) => role === 'president' ? <Crown className="w-4 h-4 text-yellow-400" /> : role === 'vice_president' ? <Star className="w-4 h-4 text-purple-400" /> : <Users className="w-4 h-4 text-dark-400" />;
  const getRoleName = (role: string) => role === 'president' ? '会长' : role === 'vice_president' ? '副会长' : '成员';
  const getDuelStatusColor = (status: DuelStatus) => ({ pending: 'text-yellow-400 bg-yellow-400/20', accepted: 'text-green-400 bg-green-400/20', rejected: 'text-red-400 bg-red-400/20', completed: 'text-blue-400 bg-blue-400/20' }[status] || 'text-dark-400 bg-dark-400/20');
  const getDuelStatusName = (status: DuelStatus) => ({ pending: '待响应', accepted: '进行中', rejected: '已拒绝', completed: '已完成' }[status] || status);

  if (loading.guild || loading.duels) return <Loading fullScreen text="正在加载公会信息..." />;

  if (!guild) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <MagicCard glowColor="magic" className="p-8 text-center max-w-md">
        <Users className="w-16 h-16 text-magic-400 mx-auto mb-4" />
        <h2 className="text-2xl font-display font-bold text-white mb-2">尚未加入公会</h2>
        <p className="text-dark-400 mb-6">创建或加入一个公会，与其他工匠一起成长！</p>
        <MagicButton variant="magic" size="lg" fullWidth>创建公会</MagicButton>
      </MagicCard>
    </div>
  );

  const tabs = [
    { id: 'info', label: '公会信息', icon: <Shield className="w-4 h-4" /> },
    { id: 'members', label: '成员列表', icon: <Users className="w-4 h-4" /> },
    { id: 'buildings', label: '公会建筑', icon: <Building2 className="w-4 h-4" /> },
    { id: 'duels', label: '对决列表', icon: <Swords className="w-4 h-4" /> },
  ];

  const renderModal = (show: boolean, onClose: () => void, title: string, color: string, content: React.ReactNode) => (
    <AnimatePresence>{show && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className={`bg-dark-900 rounded-2xl border border-${color}-500/30 p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto`}>
          <h3 className={`text-xl font-display font-bold text-${color}-400 mb-4`}>{title}</h3>
          {content}
        </motion.div>
      </motion.div>
    )}</AnimatePresence>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-jewel-600 via-purple-600 to-jewel-700 p-8 border border-gold-500/30">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3"><Shield className="w-8 h-8" />{guild.name}</h1>
              <div className="flex items-center gap-6 mt-4 flex-wrap">
                <div className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400" /><span className="text-white/90">等级: <span className="font-bold text-white">{guild.level}</span></span></div>
                <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" /><span className="text-white/90">声望: <span className="font-bold text-white">{guild.reputation.toLocaleString()}</span></span></div>
                <div className="flex items-center gap-2"><Users className="w-5 h-5 text-white/80" /><span className="text-white/90">成员: <span className="font-bold text-white">{guild.members.length}</span></span></div>
                {myRole && <div className="flex items-center gap-2"><Crown className="w-5 h-5 text-yellow-400" /><span className="text-white/90">职位: <span className="font-bold text-yellow-300">{getRoleName(myRole)}</span></span></div>}
              </div>
            </div>
            <div className="flex gap-3">
              <MagicButton variant="gold" onClick={() => setShowContributeModal(true)} icon={<Gift className="w-5 h-5" />}>贡献资源</MagicButton>
              {canManage && <MagicButton variant="forge" onClick={() => setShowDuelModal(true)} icon={<Swords className="w-5 h-5" />}>发起对决</MagicButton>}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-magic-500 text-white' : 'bg-dark-800 text-dark-400 hover:bg-dark-700 hover:text-white'}`}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MagicCard glowColor="jewel" className="p-6">
            <h2 className="text-xl font-display font-bold text-jewel-400 mb-4 flex items-center gap-2"><Shield className="w-5 h-5" />公会信息</h2>
            <div className="space-y-4">
              {[['会长', guild.presidentName], ['创建时间', formatDate(guild.createdAt)], ['成员数量', `${guild.members.length} / ${50 + guild.level * 10}`], ['公会声望', <span className="text-gold-400 font-bold">{guild.reputation.toLocaleString()}</span>], ['副会长', guild.vicePresidentIds.length > 0 ? guild.members.filter(m => m.role === 'vice_president').map(m => m.playerName).join('、') : '暂无']].map(([label, value], i) => (
                <div key={i} className="flex justify-between py-3 border-b border-dark-700 last:border-0">
                  <span className="text-dark-400">{label}</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
          </MagicCard>
          <MagicCard glowColor="gold" className="p-6">
            <h2 className="text-xl font-display font-bold text-gold-400 mb-4 flex items-center gap-2"><Star className="w-5 h-5" />我的贡献</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-gold-500/10 to-transparent border border-gold-500/30">
                <div className="text-sm text-dark-400 mb-1">累计贡献</div>
                <div className="text-3xl font-bold text-gold-400 font-mono">{myMember?.contribution?.toLocaleString() || 0}</div>
              </div>
              <div className="flex items-center gap-2 text-sm text-dark-400">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span>公会排名: #{guild.members.slice().sort((a, b) => b.contribution - a.contribution).findIndex(m => m.playerId === user?.id) + 1}</span>
              </div>
              <MagicButton variant="gold" fullWidth onClick={() => setShowContributeModal(true)} icon={<Gift className="w-5 h-5" />}>立即贡献</MagicButton>
            </div>
          </MagicCard>
        </div>
      )}

      {activeTab === 'members' && (
        <MagicCard glowColor="magic" className="p-6">
          <h2 className="text-xl font-display font-bold text-magic-400 mb-4 flex items-center gap-2"><Users className="w-5 h-5" />成员列表</h2>
          <div className="space-y-3">
            {guild.members.slice().sort((a, b) => { const o = { president: 0, vice_president: 1, member: 2 }; const d = o[a.role] - o[b.role]; return d !== 0 ? d : b.contribution - a.contribution; }).map((member: GuildMember, i) => (
              <motion.div key={member.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/50 border border-dark-700 hover:border-magic-500/50 transition-all">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-magic-500 to-jewel-600 flex items-center justify-center text-xl font-bold text-white">{member.playerName.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium truncate">{member.playerName}</p>
                    {getRoleIcon(member.role)}
                    <span className="text-xs px-2 py-0.5 rounded bg-dark-700 text-dark-300">{getRoleName(member.role)}</span>
                  </div>
                  <p className="text-sm text-dark-400">贡献: <span className="text-gold-400 font-mono">{member.contribution.toLocaleString()}</span><span className="mx-2">·</span>加入: {formatDate(member.joinedAt)}</p>
                </div>
                <div className="text-right"><div className="text-sm text-dark-400">排名</div><div className="text-white font-bold">#{i + 1}</div></div>
              </motion.div>
            ))}
          </div>
        </MagicCard>
      )}

      {activeTab === 'buildings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guild.buildings.map((b: GuildBuilding, i) => {
            const info = GUILD_BUILDING_INFO[b.type];
            return (
              <motion.div key={b.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <MagicCard glowColor="forge" className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-forge-500/30 to-forge-600/30 flex items-center justify-center text-3xl border border-forge-500/30">{info.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">{info.name}<span className="px-2 py-0.5 rounded text-sm font-mono font-bold bg-forge-500/20 text-forge-400">Lv.{b.level}</span></h3>
                        <p className="text-sm text-dark-400 mt-1">{info.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1"><span className="text-dark-400">升级进度</span><span className="text-gold-400 font-mono">{b.upgradeProgress}%</span></div>
                      <div className="h-3 bg-dark-700 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${b.upgradeProgress}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-forge-500 to-forge-400 rounded-full" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-2 rounded-lg bg-dark-800/50"><div className="text-dark-400">所需金币</div><div className="text-gold-400 font-mono">{b.currentGold} / {b.requiredGold}</div></div>
                      <div className="p-2 rounded-lg bg-dark-800/50"><div className="text-dark-400">当前加成</div><div className="text-forge-400 font-medium">+{b.level * 3}% 全体加成</div></div>
                    </div>
                    {canManage && <MagicButton variant="forge" fullWidth onClick={() => handleUpgradeBuilding(b.type)} icon={<ChevronRight className="w-5 h-5" />}>贡献升级</MagicButton>}
                  </div>
                </MagicCard>
              </motion.div>
            );
          })}
          {guild.buildings.length === 0 && <Empty text="暂无公会建筑" />}
        </div>
      )}

      {activeTab === 'duels' && (
        <MagicCard glowColor="forge" className="p-6">
          <h2 className="text-xl font-display font-bold text-forge-400 mb-4 flex items-center gap-2"><Swords className="w-5 h-5" />对决列表</h2>
          <div className="space-y-3">
            {duels.slice(0, 10).map((duel: Duel, i) => {
              const isMine = duel.challengerGuildId === guild.id;
              const needRespond = duel.status === 'pending' && duel.challengedGuildId === guild.id && canManage;
              return (
                <motion.div key={duel.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-4 rounded-xl bg-dark-800/50 border border-dark-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Swords className={`w-5 h-5 ${isMine ? 'text-forge-400' : 'text-jewel-400'}`} />
                      <div><p className="text-white font-medium">{isMine ? duel.challengedGuildName : duel.challengerGuildName}</p><p className="text-xs text-dark-400">主题: {duel.themeEquipment}</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDuelStatusColor(duel.status)}`}>{getDuelStatusName(duel.status)}</span>
                      {needRespond && (
                        <div className="flex gap-2">
                          <button onClick={() => handleRespondDuel(duel.id, true)} className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"><Check className="w-4 h-4" /></button>
                          <button onClick={() => handleRespondDuel(duel.id, false)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm"><span className="text-dark-400">代表:</span>{duel.representatives.filter(r => r.guildId === guild.id).map(rep => <span key={rep.id} className="px-2 py-0.5 rounded bg-dark-700 text-dark-300 text-xs">{rep.playerName}</span>)}</div>
                </motion.div>
              );
            })}
            {duels.length === 0 && <Empty text="暂无对决记录" />}
          </div>
        </MagicCard>
      )}

      {renderModal(showContributeModal, () => setShowContributeModal(false), '贡献资源', 'gold', (
        <div className="space-y-4">
          <div><label className="block text-sm text-dark-400 mb-2">贡献金币</label><input type="number" value={contributeAmount} onChange={(e) => setContributeAmount(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-600 text-white focus:border-gold-500 focus:outline-none" min="1" /></div>
          <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30"><div className="text-sm text-dark-400 mb-1">预计获得贡献值</div><div className="text-2xl font-bold text-gold-400 font-mono">+{contributeAmount}</div></div>
          <div className="flex justify-end gap-3"><MagicButton variant="ghost" onClick={() => setShowContributeModal(false)}>取消</MagicButton><MagicButton variant="gold" onClick={handleContribute} icon={<Gift className="w-5 h-5" />}>确认贡献</MagicButton></div>
        </div>
      ))}

      {renderModal(showDuelModal, () => setShowDuelModal(false), '发起工艺对决', 'forge', (
        <div className="space-y-4">
          <div><label className="block text-sm text-dark-400 mb-2">目标公会ID</label><input type="text" value={targetGuildId} onChange={(e) => setTargetGuildId(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-600 text-white focus:border-forge-500 focus:outline-none" placeholder="输入目标公会ID" /></div>
          <div><label className="block text-sm text-dark-400 mb-2">对决主题装备</label><input type="text" value={themeEquipment} onChange={(e) => setThemeEquipment(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-600 text-white focus:border-forge-500 focus:outline-none" placeholder="例如：烈焰巨剑" /></div>
          <div><label className="block text-sm text-dark-400 mb-2">选择代表 ({selectedMembers.length}/3)</label><div className="space-y-2 max-h-48 overflow-y-auto">{guild.members.slice(0, 10).map(member => (
            <div key={member.id} onClick={() => toggleMemberSelect(member.playerId)} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${selectedMembers.includes(member.playerId) ? 'bg-forge-500/20 border border-forge-500/50' : 'bg-dark-800/50 border border-dark-700 hover:border-dark-600'}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-magic-500 to-jewel-600 flex items-center justify-center text-sm font-bold text-white">{member.playerName.charAt(0)}</div>
              <span className="text-white">{member.playerName}</span>
            </div>
          ))}</div></div>
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-700"><MagicButton variant="ghost" onClick={() => setShowDuelModal(false)}>取消</MagicButton><MagicButton variant="forge" onClick={handleChallenge} disabled={!targetGuildId || !themeEquipment || selectedMembers.length === 0} icon={<Swords className="w-5 h-5" />}>发起对决</MagicButton></div>
        </div>
      ))}
    </div>
  );
};

export default Guild;
