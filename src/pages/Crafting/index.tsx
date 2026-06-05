import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hammer, Shirt, Gem, Sparkles, Percent, ChevronRight, CheckCircle, XCircle, Package, History, Zap, Clover, Flame } from 'lucide-react';
import { useAppStore } from '../../store/index.js';
import { api } from '../../utils/api.js';
import MagicCard from '../../components/MagicCard/index.js';
import MagicButton from '../../components/MagicButton/index.js';
import EquipmentCard from '../../components/EquipmentCard/index.js';
import MemberCard from '../../components/MemberCard/index.js';
import StatBar from '../../components/StatBar/index.js';
import Loading from '../../components/Loading/index.js';
import type { Recipe, WorkshopMember, CalculateSuccessResponse, CraftResponse, Equipment } from '../../../shared/types.js';
import { GENRE_INFO } from '../../../shared/types.js';

interface CraftHistoryItem { id: string; recipeName: string; success: boolean; timestamp: Date; equipment?: Equipment; }

export default function Crafting() {
  const { workshop, loading, loadWorkshop, addEquipment } = useAppStore();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedCraftsman, setSelectedCraftsman] = useState<WorkshopMember | null>(null);
  const [successData, setSuccessData] = useState<CalculateSuccessResponse | null>(null);
  const [isCrafting, setIsCrafting] = useState(false);
  const [craftResult, setCraftResult] = useState<CraftResponse | null>(null);
  const [craftHistory, setCraftHistory] = useState<CraftHistoryItem[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  useEffect(() => { loadWorkshop(); loadRecipes(); }, [loadWorkshop]);
  useEffect(() => { selectedRecipe && selectedCraftsman ? calculateSuccess() : setSuccessData(null); }, [selectedRecipe, selectedCraftsman]);

  const loadRecipes = async () => {
    setLoadingRecipes(true);
    try { const data = await api.crafting.getRecipes() as { items: Recipe[] }; setRecipes(data.items || []); }
    catch (e) { console.error('Failed to load recipes:', e); }
    finally { setLoadingRecipes(false); }
  };

  const filteredRecipes = useMemo(() => selectedGenre === 'all' ? recipes : recipes.filter(r => r.genre === selectedGenre), [recipes, selectedGenre]);

  const calculateSuccess = async () => {
    if (!selectedRecipe || !selectedCraftsman) return;
    try {
      const data = await api.crafting.calculateSuccess({ recipeId: selectedRecipe.id, craftsmanId: selectedCraftsman.id }) as CalculateSuccessResponse;
      setSuccessData(data);
    } catch (e) { console.error('Failed to calculate success:', e); }
  };

  const handleCraft = async () => {
    if (!selectedRecipe || !selectedCraftsman || isCrafting) return;
    setIsCrafting(true); setCraftResult(null);
    try {
      const result = await api.crafting.craft({ recipeId: selectedRecipe.id, craftsmanId: selectedCraftsman.id }) as CraftResponse;
      setCraftResult(result);
      if (result.success && result.equipment) addEquipment(result.equipment);
      setCraftHistory(prev => [{ id: Math.random().toString(36).substring(2, 9), recipeName: selectedRecipe.name, success: result.success, timestamp: new Date(), equipment: result.equipment }, ...prev.slice(0, 9)]);
    } catch (e) { console.error('Craft failed:', e); }
    finally { setIsCrafting(false); }
  };

  const craftsmen = useMemo(() => workshop?.members || [], [workshop]);
  const buildingBonus = useMemo(() => {
    if (!selectedRecipe || !workshop) return 0;
    const buildingType = selectedRecipe.genre === 'jeweler' ? 'enchanting_table' : 'furnace';
    const building = workshop.buildings.find(b => b.type === buildingType);
    return building ? building.level * 2 : 0;
  }, [selectedRecipe, workshop]);

  const getGenreIcon = (g: string) => g === 'blacksmith' ? <Hammer className="w-5 h-5" /> : g === 'tailor' ? <Shirt className="w-5 h-5" /> : g === 'jeweler' ? <Gem className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />;
  const getGlowColor = (g: string) => g === 'blacksmith' ? 'forge' : g === 'tailor' ? 'tailor' : 'jewel';
  const getGenreBg = (g: string) => g === 'blacksmith' ? 'bg-forge-500/20 text-forge-400' : g === 'tailor' ? 'bg-tailor-500/20 text-tailor-400' : 'bg-jewel-500/20 text-jewel-400';
  const getSuccessRateColor = (r: number) => r >= 80 ? 'text-tailor-400' : r >= 60 ? 'text-gold-400' : r >= 40 ? 'text-forge-400' : 'text-red-400';

  if (loading.workshop || loadingRecipes) return <Loading fullScreen text="正在加载制造数据..." />;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3"><Hammer className="w-8 h-8 text-forge-400" /> 装备制造</h1>
        <p className="text-dark-400 mt-1">选择配方和工匠，开始锻造你的传奇装备</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <MagicCard glowColor="forge" className="p-4">
            <h2 className="text-lg font-display font-bold text-forge-400 mb-3 flex items-center gap-2"><Package className="w-5 h-5" /> 配方列表</h2>
            <div className="flex gap-2 mb-4 flex-wrap">
              {['all', 'blacksmith', 'tailor', 'jeweler'].map(genre => (
                <MagicButton key={genre} variant={selectedGenre === genre ? (genre === 'all' ? 'magic' : genre as 'forge' | 'tailor' | 'jewel') : 'ghost'} size="sm" onClick={() => setSelectedGenre(genre)} icon={genre === 'all' ? <Sparkles className="w-4 h-4" /> : getGenreIcon(genre)}>
                  {genre === 'all' ? '全部' : GENRE_INFO[genre as keyof typeof GENRE_INFO]?.name}
                </MagicButton>
              ))}
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
              <AnimatePresence mode="popLayout">
                {filteredRecipes.map((recipe, i) => (
                  <motion.div key={recipe.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.03 }}>
                    <MagicCard glowColor={getGlowColor(recipe.genre) as 'forge' | 'tailor' | 'jewel'} className={`p-3 cursor-pointer ${selectedRecipe?.id === recipe.id ? 'ring-2 ring-gold-400' : ''}`} onClick={() => setSelectedRecipe(recipe)}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${getGenreBg(recipe.genre)}`}>{getGenreIcon(recipe.genre)}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white truncate">{recipe.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-dark-400">
                            <span>等级 {recipe.level}</span>
                            <span className="flex items-center gap-1"><Percent className="w-3 h-3" /> {recipe.baseSuccessRate}%</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-dark-500" />
                      </div>
                    </MagicCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </MagicCard>

          <MagicCard glowColor="gold" className="p-4">
            <h2 className="text-lg font-display font-bold text-gold-400 mb-3 flex items-center gap-2"><History className="w-5 h-5" /> 制造记录</h2>
            <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
              {craftHistory.length === 0 ? <p className="text-dark-500 text-sm text-center py-4">暂无制造记录</p> : craftHistory.map(item => (
                <motion.div key={item.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-2 rounded-lg bg-dark-800/50 border border-dark-700">
                  {item.success ? <CheckCircle className="w-5 h-5 text-tailor-400 flex-shrink-0" /> : <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.recipeName}</p>
                    <p className="text-dark-500 text-xs">{new Date(item.timestamp).toLocaleTimeString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </MagicCard>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {selectedRecipe ? (
              <motion.div key="recipe-detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <MagicCard glowColor={getGlowColor(selectedRecipe.genre) as 'forge' | 'tailor' | 'jewel'} className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${getGenreBg(selectedRecipe.genre)}`}>{getGenreIcon(selectedRecipe.genre)}</div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-display font-bold text-white mb-1">{selectedRecipe.name}</h2>
                      <p className="text-dark-400 mb-2">{selectedRecipe.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="px-2 py-1 rounded bg-dark-700 text-dark-300">等级 {selectedRecipe.level}</span>
                        <span className="flex items-center gap-1 text-dark-400"><Flame className="w-4 h-4 text-forge-400" />{GENRE_INFO[selectedRecipe.genre]?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-bold text-gold-400 mb-3 flex items-center gap-2"><Package className="w-4 h-4" /> 所需材料</h3>
                      <div className="space-y-2">
                        {selectedRecipe.materials.map((mat, i) => (
                          <motion.div key={mat.materialId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 p-2 rounded-lg bg-dark-800/50 border border-dark-700">
                            <div className="w-8 h-8 rounded bg-dark-700 flex items-center justify-center text-lg">📦</div>
                            <div className="flex-1"><p className="text-white text-sm">{mat.materialName}</p></div>
                            <span className="text-gold-400 font-bold font-mono">×{mat.amount}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gold-400 mb-3 flex items-center gap-2"><Zap className="w-4 h-4" /> 属性范围</h3>
                      <div className="space-y-2">
                        {successData?.attributeRanges.map((attr, i) => (
                          <motion.div key={attr.attribute} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="p-2 rounded-lg bg-dark-800/50 border border-dark-700">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-dark-300 text-sm">{attr.attributeName}</span>
                              <span className="text-magic-300 font-mono text-sm">{attr.min} ~ {attr.max}</span>
                            </div>
                            <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-magic-600 to-magic-400 rounded-full" style={{ width: `${((attr.max - attr.min) / attr.max) * 100}%`, marginLeft: `${(attr.min / attr.max) * 100}%` }} />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </MagicCard>

                <MagicCard glowColor="magic" className="p-6">
                  <h3 className="text-lg font-display font-bold text-magic-400 mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5" /> 选择工匠</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {craftsmen.map(craftsman => (
                      <MemberCard key={craftsman.id} member={craftsman} selected={selectedCraftsman?.id === craftsman.id} onClick={() => setSelectedCraftsman(craftsman)} />
                    ))}
                  </div>
                </MagicCard>

                {selectedCraftsman && successData && (
                  <MagicCard glowColor="gold" className="p-6">
                    <h3 className="text-lg font-display font-bold text-gold-400 mb-4 flex items-center gap-2"><Percent className="w-5 h-5" /> 成功率计算</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 rounded-lg bg-dark-800/50 border border-dark-700">
                          <p className="text-dark-400 text-sm mb-1">基础成功率</p>
                          <p className="text-2xl font-bold text-white">{selectedRecipe.baseSuccessRate}%</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-dark-800/50 border border-dark-700">
                          <p className="text-dark-400 text-sm mb-1 flex items-center justify-center gap-1"><Zap className="w-3 h-3 text-forge-400" /> 工匠加成</p>
                          <p className="text-2xl font-bold text-forge-400">+{Math.floor((selectedCraftsman.skillLevel - selectedRecipe.level * 5) / 10)}%</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-dark-800/50 border border-dark-700">
                          <p className="text-dark-400 text-sm mb-1 flex items-center justify-center gap-1"><Flame className="w-3 h-3 text-jewel-400" /> 建筑加成</p>
                          <p className="text-2xl font-bold text-jewel-400">+{buildingBonus}%</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-dark-800/70 border border-gold-500/30">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2"><Clover className="w-5 h-5 text-gold-400" /><span className="text-gold-400 font-bold">预计成功率</span></div>
                          <span className={`text-3xl font-bold font-mono ${getSuccessRateColor(successData.successRate)}`}>{successData.successRate}%</span>
                        </div>
                        <StatBar value={successData.successRate} maxValue={100} color="gold" size="lg" showValue={false} />
                      </div>
                      <MagicButton variant="forge" size="lg" fullWidth onClick={handleCraft} disabled={isCrafting} icon={isCrafting ? <Loading /> : <Hammer className="w-5 h-5" />}>
                        {isCrafting ? '锻造中...' : '开始锻造'}
                      </MagicButton>
                    </div>
                  </MagicCard>
                )}
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 rounded-full bg-dark-800/50 flex items-center justify-center mb-4"><Hammer className="w-12 h-12 text-dark-600" /></div>
                <h3 className="text-xl font-display font-bold text-dark-500 mb-2">选择一个配方</h3>
                <p className="text-dark-600">从左侧列表中选择你想要制造的装备配方</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isCrafting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
              <motion.div className="w-32 h-32 mx-auto mb-6 relative" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                <div className="absolute inset-0 rounded-full border-4 border-forge-500/30 border-t-forge-500" />
                <div className="absolute inset-4 rounded-full border-4 border-gold-500/30 border-t-gold-500" />
                <div className="absolute inset-0 flex items-center justify-center text-5xl">🔥</div>
              </motion.div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">锻造进行中</h2>
              <p className="text-dark-400">工匠正在精心打造你的装备...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {craftResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setCraftResult(null)}>
            <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }} onClick={e => e.stopPropagation()} className="max-w-md w-full">
              {craftResult.success && craftResult.equipment ? (
                <div>
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-6xl mb-2">✨</motion.div>
                    <h2 className="text-3xl font-display font-bold text-gold-400 mb-1">锻造成功！</h2>
                    <p className="text-dark-400">{craftResult.message}</p>
                  </motion.div>
                  <EquipmentCard equipment={craftResult.equipment} />
                </div>
              ) : (
                <MagicCard glowColor="magic" className="p-6 text-center">
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, repeat: 2 }} className="text-6xl mb-4">💔</motion.div>
                    <h2 className="text-2xl font-display font-bold text-red-400 mb-2">锻造失败</h2>
                    <p className="text-dark-400 mb-4">{craftResult.message}</p>
                    {craftResult.returnedMaterials && craftResult.returnedMaterials.length > 0 && (
                      <div className="p-4 rounded-lg bg-dark-800/50 border border-dark-700">
                        <p className="text-dark-400 text-sm mb-2">返还材料：</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {craftResult.returnedMaterials.map(mat => (
                            <span key={mat.materialId} className="px-3 py-1 rounded-full bg-dark-700 text-dark-300 text-sm">{mat.materialName} ×{mat.amount}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </MagicCard>
              )}
              <div className="mt-4 flex justify-center">
                <MagicButton variant="magic" onClick={() => setCraftResult(null)}>确定</MagicButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
