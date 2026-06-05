import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Sword, ScrollText, Layers, Filter, X, CheckCircle, AlertCircle, Sparkles, ShoppingCart, Coins } from 'lucide-react';
import { useAppStore } from '../../store/index.js';
import { api } from '../../utils/api.js';
import MagicCard from '../../components/MagicCard/index.js';
import MagicButton from '../../components/MagicButton/index.js';
import EquipmentCard from '../../components/EquipmentCard/index.js';
import RarityBadge from '../../components/RarityBadge/index.js';
import Loading from '../../components/Loading/index.js';
import type { Equipment, EnchantScroll, Material, Rarity, Genre } from '../../../shared/types.js';

type TabType = 'equipment' | 'scroll' | 'material';
type SelectedItem = Equipment | EnchantScroll | Material | null;

const Inventory = () => {
  const { equipments, scrolls, materials, user, loadInventory, loadUser, loading } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('equipment');
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'all'>('all');
  const [genreFilter, setGenreFilter] = useState<Genre | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => { loadInventory(); loadUser(); }, [loadInventory, loadUser]);

  const showMsg = (type: 'success' | 'error', text: string) => { setMessage({ type, text }); setTimeout(() => setMessage(null), 3000); };

  const filteredEquipments = equipments.filter(e => (rarityFilter === 'all' || e.rarity === rarityFilter) && (genreFilter === 'all' || e.genre === genreFilter));

  const handleItemClick = (item: SelectedItem) => { setSelectedItem(item); setShowDetailModal(true); };

  const toggleSelect = (id: string) => setSelectedIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });

  const handleList = async (item: SelectedItem) => {
    if (!item || 'quantity' in item) return;
    setIsProcessing(true);
    try {
      const itemType = 'genre' in item ? 'equipment' : 'scroll';
      const price = Math.floor(('score' in item ? item.score : 1000) * 0.8);
      await api.market.listItem({ itemId: item.id, itemType, price });
      showMsg('success', `${item.name} 已上架`);
      setShowDetailModal(false);
      await loadInventory();
    } catch (e) { showMsg('error', '上架失败'); }
    finally { setIsProcessing(false); }
  };

  const handleBatchList = async () => {
    if (selectedIds.size === 0) return;
    setIsProcessing(true);
    try {
      for (const id of selectedIds) {
        const item = [...equipments, ...scrolls].find(i => i.id === id);
        if (item && !item.isListed) {
          const itemType = 'genre' in item ? 'equipment' : 'scroll';
          const price = Math.floor(('score' in item ? item.score : 1000) * 0.8);
          await api.market.listItem({ itemId: item.id, itemType, price });
        }
      }
      showMsg('success', `已批量上架 ${selectedIds.size} 件物品`);
      setSelectedIds(new Set());
      await loadInventory();
    } catch (e) { showMsg('error', '批量上架失败'); }
    finally { setIsProcessing(false); }
  };

  const handleBatchUse = async () => {
    if (selectedIds.size === 0 || activeTab !== 'scroll') return;
    setIsProcessing(true);
    try { await new Promise(r => setTimeout(r, 1000)); showMsg('success', `已批量使用 ${selectedIds.size} 张卷轴`); setSelectedIds(new Set()); await loadInventory(); }
    catch (e) { showMsg('error', '批量使用失败'); }
    finally { setIsProcessing(false); }
  };

  if (loading.inventory || loading.user) return <Loading fullScreen text="正在加载背包..." />;

  const tabs = [
    { id: 'equipment' as TabType, label: '装备', icon: Sword, count: equipments.length, color: 'forge' as const },
    { id: 'scroll' as TabType, label: '卷轴', icon: ScrollText, count: scrolls.length, color: 'jewel' as const },
    { id: 'material' as TabType, label: '材料', icon: Layers, count: materials.length, color: 'tailor' as const },
  ];

  const SelectField = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-white focus:border-gold-500 focus:outline-none">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  const getListableCount = () => {
    if (activeTab === 'equipment') return [...selectedIds].filter(id => equipments.find(e => e.id === id && !e.isListed)).length;
    if (activeTab === 'scroll') return [...selectedIds].filter(id => scrolls.find(s => s.id === id && !s.isListed)).length;
    return 0;
  };

  const isEquipment = (item: SelectedItem): item is Equipment => item !== null && 'genre' in item;
  const isScroll = (item: SelectedItem): item is EnchantScroll => item !== null && 'possibleAffixes' in item;
  const isMaterial = (item: SelectedItem): item is Material => item !== null && 'quantity' in item;
  const getListableItems = () => activeTab === 'equipment' ? filteredEquipments.filter(i => !i.isListed) : scrolls.filter(i => !i.isListed);

  const handleUseScroll = async (item: EnchantScroll) => {
    setIsProcessing(true);
    try { await new Promise(r => setTimeout(r, 500)); showMsg('success', `已使用 ${item.name}`); setShowDetailModal(false); await loadInventory(); }
    catch (e) { showMsg('error', '使用失败'); }
    finally { setIsProcessing(false); }
  };

  const renderEmpty = (Icon: typeof Package, text: string) => (
    <div className="col-span-full text-center py-16 text-dark-400"><Icon className="w-16 h-16 mx-auto mb-4 opacity-30" /><p className="text-lg">{text}</p></div>
  );

  const rarityOpts = [{ value: 'all', label: '全部稀有度' }, { value: 'legendary', label: '传说' }, { value: 'epic', label: '史诗' }, { value: 'rare', label: '稀有' }, { value: 'uncommon', label: '优秀' }, { value: 'common', label: '普通' }];
  const genreOpts = [{ value: 'all', label: '全部流派' }, { value: 'blacksmith', label: '铁匠' }, { value: 'tailor', label: '裁缝' }, { value: 'jeweler', label: '珠宝' }];

  const renderCheckbox = (id: string) => (
    <input type="checkbox" checked={selectedIds.has(id)} onChange={() => toggleSelect(id)} className="absolute top-3 left-3 z-20 w-5 h-5 rounded border-dark-600 bg-dark-800 text-magic-500" />
  );

  const renderListedBadge = () => (
    <div className="absolute top-3 right-3 z-10 px-2 py-1 bg-gold-500/90 text-white text-xs font-bold rounded-full">已上架</div>
  );

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg ${message.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-800 via-magic-700 to-indigo-800 p-6 border border-gold-500/30">
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3"><Package className="w-8 h-8 text-gold-300" />我的背包</h1>
            <p className="text-gold-200/80">管理你的装备、卷轴和材料</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-gold-300"><Coins className="w-6 h-6" /><span className="text-2xl font-bold">{user?.gold.toLocaleString() || 0}</span></div>
            <p className="text-gold-200/60 text-sm">我的金币</p>
          </div>
        </div>
      </motion.div>

      <MagicCard glowColor="magic" className="p-5">
        <div className="flex flex-wrap gap-2 mb-5">
          {tabs.map((tab) => (
            <motion.button key={tab.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setActiveTab(tab.id); setSelectedIds(new Set()); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-display font-bold transition-all ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color === 'forge' ? 'from-forge-600 to-orange-500' : tab.color === 'jewel' ? 'from-jewel-600 to-blue-500' : 'from-tailor-600 to-green-500'} text-white shadow-lg`
                  : 'bg-dark-800 text-dark-400 hover:bg-dark-700 hover:text-white'
              }`}>
              <tab.icon className="w-5 h-5" />{tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-dark-700'}`}>{tab.count}</span>
            </motion.button>
          ))}
        </div>

        {activeTab === 'equipment' && (
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Filter className="w-4 h-4 text-dark-400" />
            <SelectField value={rarityFilter} onChange={(v) => setRarityFilter(v as Rarity | 'all')} options={rarityOpts} />
            <SelectField value={genreFilter} onChange={(v) => setGenreFilter(v as Genre | 'all')} options={genreOpts} />
          </div>
        )}

        {(activeTab === 'equipment' || activeTab === 'scroll') && (
          <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-dark-700">
            <MagicButton variant="ghost" size="sm" onClick={() => {
              const listable = getListableItems();
              setSelectedIds(selectedIds.size === listable.length ? new Set() : new Set(listable.map(i => i.id)));
            }}>
              {selectedIds.size === getListableItems().length ? '取消全选' : '全选可上架'}
            </MagicButton>
            {selectedIds.size > 0 && (
              <>
                <span className="text-sm text-dark-400">已选 {selectedIds.size} 件</span>
                <MagicButton variant="gold" size="sm" icon={<ShoppingCart className="w-4 h-4" />} onClick={handleBatchList} disabled={isProcessing || getListableCount() === 0}>批量上架 ({getListableCount()})</MagicButton>
                {activeTab === 'scroll' && <MagicButton variant="jewel" size="sm" icon={<Sparkles className="w-4 h-4" />} onClick={handleBatchUse} disabled={isProcessing}>批量使用</MagicButton>}
              </>
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'equipment' && (
            <motion.div key="equipment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEquipments.length === 0 ? renderEmpty(Package, '暂无装备') :
                filteredEquipments.map((item, index) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="relative">
                    {renderCheckbox(item.id)}
                    <EquipmentCard equipment={item} onClick={() => handleItemClick(item)} />
                    {item.isListed && renderListedBadge()}
                  </motion.div>
                ))}
            </motion.div>
          )}

          {activeTab === 'scroll' && (
            <motion.div key="scroll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scrolls.length === 0 ? renderEmpty(ScrollText, '暂无卷轴') :
                scrolls.map((item, index) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="relative">
                    {renderCheckbox(item.id)}
                    <MagicCard glowColor="jewel" className="p-5 cursor-pointer" onClick={() => handleItemClick(item)}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-jewel-500/20 flex items-center justify-center text-2xl">📜</div>
                          <div>
                            <h3 className="font-display font-bold text-white">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-1"><RarityBadge rarity={item.rarity} size="sm" /><span className="text-dark-400 text-sm">Lv.{item.level}</span></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-dark-400 space-y-1">
                        <p>成功率加成: <span className="text-magic-300">+{item.successRateBonus}%</span></p>
                        <p>可能词缀: <span className="text-jewel-300">{item.possibleAffixes.length} 种</span></p>
                      </div>
                      {item.isListed && renderListedBadge()}
                    </MagicCard>
                  </motion.div>
                ))}
            </motion.div>
          )}

          {activeTab === 'material' && (
            <motion.div key="material" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {materials.length === 0 ? renderEmpty(Layers, '暂无材料') :
                materials.map((item, index) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} onClick={() => handleItemClick(item)}>
                    <MagicCard glowColor="tailor" className="p-4 text-center cursor-pointer">
                      <div className="text-4xl mb-2">{item.icon}</div>
                      <h3 className="font-display font-bold text-white text-sm mb-1 truncate">{item.name}</h3>
                      <div className="flex items-center justify-center gap-2"><RarityBadge rarity={item.rarity} size="sm" showIcon={false} /><span className="text-lg font-mono font-bold text-gold-400">x{item.quantity}</span></div>
                    </MagicCard>
                  </motion.div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </MagicCard>

      <AnimatePresence>
        {showDetailModal && selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-dark-900 rounded-2xl border border-gold-500/30 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-display font-bold text-gold-400">物品详情</h2>
                <button onClick={() => setShowDetailModal(false)} className="text-dark-400 hover:text-white"><X className="w-6 h-6" /></button>
              </div>

              {isEquipment(selectedItem) && (
                <>
                  <EquipmentCard equipment={selectedItem} className="mb-4" />
                  <div className="flex gap-3">
                    <MagicButton variant="magic" fullWidth icon={<Sparkles className="w-4 h-4" />} onClick={() => { showMsg('success', `已为 ${selectedItem.name} 打开附魔页面`); setShowDetailModal(false); }}>去附魔</MagicButton>
                    <MagicButton variant="gold" fullWidth icon={<ShoppingCart className="w-4 h-4" />} onClick={() => handleList(selectedItem)} disabled={selectedItem.isListed || isProcessing}>{selectedItem.isListed ? '已上架' : '上架'}</MagicButton>
                  </div>
                </>
              )}

              {isScroll(selectedItem) && (
                <>
                  <MagicCard glowColor="jewel" className="p-5 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-16 h-16 rounded-xl bg-jewel-500/20 flex items-center justify-center text-3xl">📜</div>
                      <div>
                        <h3 className="font-display font-bold text-xl text-white">{selectedItem.name}</h3>
                        <div className="flex items-center gap-2 mt-1"><RarityBadge rarity={selectedItem.rarity} /><span className="text-dark-400">Lv.{selectedItem.level}</span></div>
                      </div>
                    </div>
                    <div className="space-y-2 text-dark-300">
                      <p>成功率加成: <span className="text-magic-300 font-bold">+{selectedItem.successRateBonus}%</span></p>
                      <p>可能词缀: <span className="text-jewel-300">{selectedItem.possibleAffixes.length} 种</span></p>
                    </div>
                  </MagicCard>
                  <div className="flex gap-3">
                    <MagicButton variant="jewel" fullWidth icon={<Sparkles className="w-4 h-4" />} onClick={() => handleUseScroll(selectedItem)} disabled={isProcessing}>使用</MagicButton>
                    <MagicButton variant="gold" fullWidth icon={<ShoppingCart className="w-4 h-4" />} onClick={() => handleList(selectedItem)} disabled={selectedItem.isListed || isProcessing}>{selectedItem.isListed ? '已上架' : '上架'}</MagicButton>
                  </div>
                </>
              )}

              {isMaterial(selectedItem) && (
                <MagicCard glowColor="tailor" className="p-5 text-center">
                  <div className="text-6xl mb-4">{selectedItem.icon}</div>
                  <h3 className="font-display font-bold text-2xl text-white mb-2">{selectedItem.name}</h3>
                  <div className="flex items-center justify-center gap-3 mb-4"><RarityBadge rarity={selectedItem.rarity} /><span className="text-2xl font-mono font-bold text-gold-400">x{selectedItem.quantity}</span></div>
                  <p className="text-dark-400">{selectedItem.description}</p>
                </MagicCard>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
