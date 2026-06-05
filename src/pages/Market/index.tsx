import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Filter, Plus, ShoppingCart, Coins, TrendingUp, Sword, ScrollText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/index.js';
import { api } from '../../utils/api.js';
import MagicCard from '../../components/MagicCard/index.js';
import MagicButton from '../../components/MagicButton/index.js';
import EquipmentCard from '../../components/EquipmentCard/index.js';
import RarityBadge from '../../components/RarityBadge/index.js';
import Loading from '../../components/Loading/index.js';
import type { MarketListing, Equipment, EnchantScroll, ItemType, PriceSuggestionResponse } from '../../../shared/types.js';

const Market = () => {
  const { marketListings, equipments, scrolls, user, loadMarket, loadInventory, loadUser, loading } = useAppStore();
  const [filters, setFilters] = useState({ itemType: 'all', rarity: 'all', genre: 'all', minPrice: '', maxPrice: '' });
  const [showListModal, setShowListModal] = useState(false);
  const [listItemType, setListItemType] = useState<ItemType>('equipment');
  const [selectedListItem, setSelectedListItem] = useState<string | null>(null);
  const [listPrice, setListPrice] = useState('');
  const [priceSuggestion, setPriceSuggestion] = useState<PriceSuggestionResponse | null>(null);
  const [isListing, setIsListing] = useState(false);
  const [isBuying, setIsBuying] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => { loadMarket(); loadInventory(); loadUser(); }, [loadMarket, loadInventory, loadUser]);

  const filteredListings = marketListings.filter((l) => {
    if (filters.itemType !== 'all' && l.itemType !== filters.itemType) return false;
    if (filters.rarity !== 'all' && l.item.rarity !== filters.rarity) return false;
    if (filters.genre !== 'all' && l.itemType === 'equipment' && (l.item as Equipment).genre !== filters.genre) return false;
    if (filters.minPrice && l.price < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && l.price > parseInt(filters.maxPrice)) return false;
    return true;
  });

  const listableItems = listItemType === 'equipment'
    ? equipments.filter(e => !e.isListed)
    : scrolls.filter(s => !s.isListed);

  useEffect(() => {
    if (!selectedListItem) { setPriceSuggestion(null); return; }
    (async () => {
      try {
        const r = await api.market.getPriceSuggestion({ itemId: selectedListItem, itemType: listItemType }) as PriceSuggestionResponse;
        setPriceSuggestion(r); setListPrice(r.avgPrice7d.toString());
      } catch (e) { console.error(e); }
    })();
  }, [selectedListItem, listItemType]);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleListItem = async () => {
    if (!selectedListItem || !listPrice) return;
    setIsListing(true);
    try {
      await api.market.listItem({ itemId: selectedListItem, itemType: listItemType, price: parseInt(listPrice) });
      showMsg('success', '物品上架成功！');
      setShowListModal(false); setSelectedListItem(null); setListPrice('');
      await loadMarket(); await loadInventory();
    } catch (e: unknown) {
      showMsg('error', (e as Error).message || '上架失败');
    } finally { setIsListing(false); }
  };

  const handleBuyItem = async (id: string) => {
    setIsBuying(id);
    try {
      await api.market.buyItem(id);
      showMsg('success', '购买成功！');
      await loadMarket(); await loadInventory(); await loadUser();
    } catch (e: unknown) {
      showMsg('error', (e as Error).message || '购买失败');
    } finally { setIsBuying(null); }
  };

  const resetListForm = () => { setSelectedListItem(null); setListPrice(''); setPriceSuggestion(null); };

  if (loading.market || loading.inventory || loading.user) {
    return <Loading fullScreen text="正在加载市场数据..." />;
  }

  const SelectField = ({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string }) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-white focus:border-gold-500 focus:outline-none">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  const priceWarning = listPrice && priceSuggestion ? (
    parseInt(listPrice) < priceSuggestion.minPrice ? { text: '⚠️ 价格低于建议区间', color: 'text-red-400' } :
    parseInt(listPrice) > priceSuggestion.maxPrice ? { text: '⚠️ 价格高于建议区间', color: 'text-orange-400' } :
    { text: '✓ 价格在建议区间内', color: 'text-green-400' }
  ) : null;

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg ${
              message.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
            }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-800 via-gold-700 to-orange-800 p-6 border border-gold-500/30">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
              <Store className="w-8 h-8 text-gold-300" />
              交易市场
            </h1>
            <p className="text-gold-200/80">买卖装备与附魔卷轴，积累财富</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-gold-300">
              <Coins className="w-6 h-6" />
              <span className="text-2xl font-bold">{user?.gold.toLocaleString() || 0}</span>
            </div>
            <p className="text-gold-200/60 text-sm">我的金币</p>
          </div>
        </div>
      </motion.div>

      <MagicCard glowColor="gold" className="p-5">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h2 className="text-xl font-display font-bold text-gold-400 flex items-center gap-2">
            <Filter className="w-5 h-5" /> 筛选
          </h2>
          <div className="flex flex-wrap gap-3 flex-1">
            <SelectField value={filters.itemType} onChange={(v) => setFilters({ ...filters, itemType: v })}
              options={[{ value: 'all', label: '全部类型' }, { value: 'equipment', label: '装备' }, { value: 'scroll', label: '卷轴' }]} />
            <SelectField value={filters.rarity} onChange={(v) => setFilters({ ...filters, rarity: v })}
              options={[{ value: 'all', label: '全部稀有度' }, { value: 'legendary', label: '传说' }, { value: 'epic', label: '史诗' }, { value: 'rare', label: '稀有' }, { value: 'uncommon', label: '优秀' }, { value: 'common', label: '普通' }]} />
            {filters.itemType !== 'scroll' && (
              <SelectField value={filters.genre} onChange={(v) => setFilters({ ...filters, genre: v })}
                options={[{ value: 'all', label: '全部类型' }, { value: 'blacksmith', label: '铁匠' }, { value: 'tailor', label: '裁缝' }, { value: 'jeweler', label: '珠宝' }]} />
            )}
            <input type="number" placeholder="最低价" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="w-28 px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-white focus:border-gold-500 focus:outline-none" />
            <input type="number" placeholder="最高价" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="w-28 px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-white focus:border-gold-500 focus:outline-none" />
          </div>
          <MagicButton variant="gold" icon={<Plus className="w-5 h-5" />} onClick={() => setShowListModal(true)}>上架物品</MagicButton>
        </div>
      </MagicCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.length === 0 ? (
          <div className="col-span-full text-center py-16 text-dark-400">
            <Store className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">暂无符合条件的商品</p>
          </div>
        ) : filteredListings.map((listing, index) => (
          <motion.div key={listing.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <MagicCard glowColor={listing.itemType === 'equipment' ? 'forge' : 'jewel'} className="p-4 h-full flex flex-col">
              {listing.itemType === 'equipment' ? (
                <EquipmentCard equipment={listing.item as Equipment} className="mb-4" />
              ) : (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ScrollText className="w-5 h-5 text-jewel-400" />
                      <span className="font-bold text-white">{(listing.item as EnchantScroll).name}</span>
                    </div>
                    <RarityBadge rarity={listing.item.rarity} size="sm" />
                  </div>
                  <div className="text-sm text-dark-400">
                    <p>等级: Lv.{(listing.item as EnchantScroll).level}</p>
                    <p>成功率加成: +{(listing.item as EnchantScroll).successRateBonus}%</p>
                  </div>
                </div>
              )}
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-dark-400">卖家: {listing.sellerName}</p>
                    <div className="flex items-center gap-1 text-xs text-dark-500">
                      <TrendingUp className="w-3 h-3" />
                      建议: {listing.suggestedPriceMin.toLocaleString()} - {listing.suggestedPriceMax.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-gold-400">
                      <Coins className="w-4 h-4" />
                      <span className="text-xl font-bold">{listing.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <MagicButton variant="gold" fullWidth icon={<ShoppingCart className="w-4 h-4" />}
                  onClick={() => handleBuyItem(listing.id)}
                  disabled={isBuying === listing.id || listing.sellerId === 'user_001'}>
                  {isBuying === listing.id ? '购买中...' : listing.sellerId === 'user_001' ? '我的商品' : '购买'}
                </MagicButton>
              </div>
            </MagicCard>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showListModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => { setShowListModal(false); resetListForm(); }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-900 rounded-2xl border border-gold-500/30 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-gold-400">上架物品</h2>
                <button onClick={() => { setShowListModal(false); resetListForm(); }} className="text-dark-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex gap-3 mb-4">
                <MagicButton variant={listItemType === 'equipment' ? 'forge' : 'ghost'} fullWidth icon={<Sword className="w-4 h-4" />}
                  onClick={() => { setListItemType('equipment'); resetListForm(); }}>装备</MagicButton>
                <MagicButton variant={listItemType === 'scroll' ? 'jewel' : 'ghost'} fullWidth icon={<ScrollText className="w-4 h-4" />}
                  onClick={() => { setListItemType('scroll'); resetListForm(); }}>卷轴</MagicButton>
              </div>
              <div className="mb-4">
                <label className="block text-dark-300 text-sm mb-2">选择物品</label>
                <select value={selectedListItem || ''} onChange={(e) => setSelectedListItem(e.target.value || null)}
                  className="w-full px-4 py-3 rounded-lg bg-dark-800 border border-dark-600 text-white focus:border-gold-500 focus:outline-none">
                  <option value="">请选择{listItemType === 'equipment' ? '装备' : '卷轴'}</option>
                  {listableItems.map((item) => (
                    <option key={item.id} value={item.id}>{item.name} ({item.rarity})</option>
                  ))}
                </select>
              </div>
              {priceSuggestion && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4 p-4 bg-gold-500/10 rounded-xl border border-gold-500/30">
                  <p className="text-sm text-gold-400 mb-2 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> 价格建议区间</p>
                  <div className="flex items-center justify-between text-white">
                    <span>最低: {priceSuggestion.minPrice.toLocaleString()}</span>
                    <span className="text-gold-400 font-bold">均价: {priceSuggestion.avgPrice7d.toLocaleString()}</span>
                    <span>最高: {priceSuggestion.maxPrice.toLocaleString()}</span>
                  </div>
                </motion.div>
              )}
              <div className="mb-6">
                <label className="block text-dark-300 text-sm mb-2">出售价格</label>
                <div className="relative">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-400" />
                  <input type="number" placeholder="输入价格" value={listPrice} onChange={(e) => setListPrice(e.target.value)} min="100"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-dark-800 border border-dark-600 text-white focus:border-gold-500 focus:outline-none text-lg font-mono" />
                </div>
                {priceWarning && <p className={`text-xs mt-1 ${priceWarning.color}`}>{priceWarning.text}</p>}
              </div>
              <MagicButton variant="gold" size="lg" fullWidth icon={<Plus className="w-5 h-5" />} onClick={handleListItem}
                disabled={!selectedListItem || !listPrice || parseInt(listPrice) < 100 || isListing}>
                {isListing ? '上架中...' : '确认上架'}
              </MagicButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Market;
