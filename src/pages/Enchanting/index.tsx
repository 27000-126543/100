import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Sword, ScrollText, Target, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useAppStore } from '../../store/index.js';
import { api } from '../../utils/api.js';
import MagicCard from '../../components/MagicCard/index.js';
import MagicButton from '../../components/MagicButton/index.js';
import EquipmentCard from '../../components/EquipmentCard/index.js';
import RarityBadge from '../../components/RarityBadge/index.js';
import AffixDisplay from '../../components/AffixDisplay/index.js';
import Loading from '../../components/Loading/index.js';
import type { Equipment, EnchantScroll, CalculateEnchantResponse, EnchantResponse, Affix } from '../../../shared/types.js';

const Enchanting = () => {
  const { equipments, scrolls, loadInventory, updateEquipment, loading } = useAppStore();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [selectedScroll, setSelectedScroll] = useState<EnchantScroll | null>(null);
  const [calcResult, setCalcResult] = useState<CalculateEnchantResponse | null>(null);
  const [enchantResult, setEnchantResult] = useState<EnchantResponse | null>(null);
  const [isEnchanting, setIsEnchanting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const availableEquipments = equipments.filter(e => !e.isListed);
  const availableScrolls = scrolls.filter(s => !s.isListed);

  useEffect(() => {
    if (selectedEquipment && selectedScroll) {
      calculateEnchant();
    } else {
      setCalcResult(null);
      setEnchantResult(null);
    }
  }, [selectedEquipment, selectedScroll]);

  const calculateEnchant = async () => {
    if (!selectedEquipment || !selectedScroll) return;
    setIsCalculating(true);
    setEnchantResult(null);
    try {
      const result = await api.enchanting.calculate({
        equipmentId: selectedEquipment.id,
        scrollId: selectedScroll.id,
      }) as CalculateEnchantResponse;
      setCalcResult(result);
    } catch (e) {
      console.error('Failed to calculate enchant:', e);
    } finally {
      setIsCalculating(false);
    }
  };

  const executeEnchant = async () => {
    if (!selectedEquipment || !selectedScroll || !calcResult) return;
    setIsEnchanting(true);
    setEnchantResult(null);
    try {
      const result = await api.enchanting.execute({
        equipmentId: selectedEquipment.id,
        scrollId: selectedScroll.id,
      }) as EnchantResponse;
      setEnchantResult(result);
      updateEquipment(result.equipment);
      setSelectedEquipment(result.equipment);
      await loadInventory();
    } catch (e) {
      console.error('Failed to execute enchant:', e);
    } finally {
      setIsEnchanting(false);
    }
  };

  const resetSelection = () => {
    setSelectedEquipment(null);
    setSelectedScroll(null);
    setCalcResult(null);
    setEnchantResult(null);
  };

  if (loading.inventory) {
    return <Loading fullScreen text="正在加载魔法物品..." />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-800 via-magic-700 to-indigo-800 p-6 border border-gold-500/30"
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-gold-400" />
            装备附魔
          </h1>
          <p className="text-gold-200/80">为你的装备注入神秘魔力，获得强大的魔法词缀</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MagicCard glowColor="magic" className="p-5">
          <h2 className="text-xl font-display font-bold text-magic-400 mb-4 flex items-center gap-2">
            <Sword className="w-5 h-5" />
            选择装备
          </h2>
          <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
            {availableEquipments.length === 0 ? (
              <p className="text-dark-400 text-center py-8">暂无可附魔的装备</p>
            ) : (
              availableEquipments.map((eq) => (
                <motion.div
                  key={eq.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedEquipment(eq)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedEquipment?.id === eq.id
                      ? 'border-magic-500 bg-magic-500/20 shadow-magic'
                      : 'border-dark-600 bg-dark-800/50 hover:border-magic-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white">{eq.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <RarityBadge rarity={eq.rarity} size="sm" />
                        <span className="text-dark-400 text-sm">词缀: {eq.affixes.length}/5</span>
                      </div>
                    </div>
                    <span className="text-gold-400 font-mono">{eq.score}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </MagicCard>

        <MagicCard glowColor="jewel" className="p-5">
          <h2 className="text-xl font-display font-bold text-jewel-400 mb-4 flex items-center gap-2">
            <ScrollText className="w-5 h-5" />
            选择附魔卷轴
          </h2>
          <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
            {availableScrolls.length === 0 ? (
              <p className="text-dark-400 text-center py-8">暂无附魔卷轴</p>
            ) : (
              availableScrolls.map((scroll) => (
                <motion.div
                  key={scroll.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedScroll(scroll)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedScroll?.id === scroll.id
                      ? 'border-jewel-500 bg-jewel-500/20 shadow-jewel'
                      : 'border-dark-600 bg-dark-800/50 hover:border-jewel-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white">{scroll.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <RarityBadge rarity={scroll.rarity} size="sm" />
                        <span className="text-green-400 text-sm">成功率 +{scroll.successRateBonus}%</span>
                      </div>
                    </div>
                    <span className="text-jewel-400 text-sm">Lv.{scroll.level}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </MagicCard>
      </div>

      <AnimatePresence mode="wait">
        {calcResult && (
          <motion.div
            key="calc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MagicCard glowColor="gold" className="p-6">
              <h2 className="text-xl font-display font-bold text-gold-400 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                附魔预测
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-dark-800/50 rounded-xl">
                  <p className="text-dark-400 text-sm mb-1">成功率</p>
                  <p className={`text-3xl font-bold ${calcResult.successRate >= 70 ? 'text-green-400' : calcResult.successRate >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {calcResult.successRate.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center p-4 bg-dark-800/50 rounded-xl">
                  <p className="text-dark-400 text-sm mb-1">替换概率</p>
                  <p className="text-3xl font-bold text-orange-400">{calcResult.replaceChance}%</p>
                </div>
                <div className="text-center p-4 bg-dark-800/50 rounded-xl">
                  <p className="text-dark-400 text-sm mb-1">可能词缀</p>
                  <p className="text-3xl font-bold text-magic-400">{calcResult.possibleAffixes.length}</p>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-dark-400 text-sm mb-2">可获得词缀：</p>
                <AffixDisplay affixes={calcResult.possibleAffixes as Affix[]} />
              </div>
              <div className="flex gap-4 justify-center">
                <MagicButton
                  variant="magic"
                  size="lg"
                  onClick={executeEnchant}
                  disabled={isEnchanting || isCalculating}
                  icon={isEnchanting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                >
                  {isEnchanting ? '附魔中...' : '执行附魔'}
                </MagicButton>
                <MagicButton variant="ghost" onClick={resetSelection}>重选</MagicButton>
              </div>
            </MagicCard>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {enchantResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <MagicCard glowColor={enchantResult.success ? 'gold' : 'forge'} className="p-6">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
                  style={{ background: enchantResult.success ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)' }}
                >
                  {enchantResult.success ? (
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-400" />
                  )}
                </motion.div>
                <h2 className={`text-2xl font-display font-bold mb-2 ${enchantResult.success ? 'text-green-400' : 'text-red-400'}`}>
                  {enchantResult.success ? '附魔成功！' : '附魔失败'}
                </h2>
                <p className="text-dark-300">{enchantResult.message}</p>
              </div>
              {enchantResult.success && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {enchantResult.addedAffix && (
                    <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                      <p className="text-green-400 text-sm mb-2">✨ 获得词缀</p>
                      <AffixDisplay affixes={[enchantResult.addedAffix]} />
                    </div>
                  )}
                  {enchantResult.replacedAffix && (
                    <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/30">
                      <p className="text-orange-400 text-sm mb-2">🔄 替换词缀</p>
                      <AffixDisplay affixes={[enchantResult.replacedAffix]} />
                    </div>
                  )}
                </div>
              )}
              <div className="mt-6">
                <EquipmentCard equipment={enchantResult.equipment} />
              </div>
            </MagicCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Enchanting;
