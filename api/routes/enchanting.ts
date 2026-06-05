import express, { type Request, type Response } from 'express';
import { createResponse, createError, delay, generateId } from '../utils.js';
import { mockScrolls, mockEquipments, mockUser, mockWorkshop } from '../../shared/mockData.js';
import { AFFIX_POOL } from '../../shared/types.js';
import type { EnchantScroll, Equipment, Affix, EnchantRequest, EnchantResponse, CalculateEnchantRequest, CalculateEnchantResponse } from '../../shared/types.js';

const router = express.Router();

let scrolls = [...mockScrolls];
let equipments = [...mockEquipments];
let user = { ...mockUser };

const calcScore = (attrs: Record<string, number>, affixes: Affix[]): number => {
  const attrSum = Object.values(attrs).reduce((a, b) => a + b, 0);
  const affixSum = affixes.reduce((sum, a) => {
    const rarityMult = a.rarity === 'legendary' ? 3 : a.rarity === 'epic' ? 2 : a.rarity === 'rare' ? 1.5 : 1;
    return sum + Object.values(a.effect).reduce((s, v) => s + v, 0) * rarityMult;
  }, 0);
  return Math.floor(attrSum + affixSum * 10);
};

const calcEnchantSuccessRate = (equipment: Equipment, scroll: EnchantScroll): number => {
  const baseRate = 60;
  const affixCount = equipment.affixes.length;
  const affixPenalty = affixCount * 10;
  const qualityBonus = (equipment.quality - 70) * 0.3;
  const scrollBonus = scroll.successRateBonus;
  const enchantingTable = mockWorkshop.buildings.find(b => b.type === 'enchanting_table');
  const buildingBonus = enchantingTable ? enchantingTable.level * 3 : 0;
  const rate = baseRate - affixPenalty + qualityBonus + scrollBonus + buildingBonus + user.luck;
  return Math.max(5, Math.min(95, rate));
};

router.get('/scrolls', async (req: Request, res: Response) => {
  await delay(300);
  const { rarity, isListed } = req.query;
  let filtered = scrolls.filter(s => s.ownerId === 'user_001');
  if (rarity && rarity !== 'all') {
    filtered = filtered.filter(s => s.rarity === rarity);
  }
  if (isListed !== undefined) {
    filtered = filtered.filter(s => s.isListed === (isListed === 'true'));
  }
  res.json(createResponse(filtered));
});

router.post('/calculate', async (req: Request, res: Response) => {
  await delay(400);
  const { equipmentId, scrollId } = req.body as CalculateEnchantRequest;
  const equipment = equipments.find(e => e.id === equipmentId);
  const scroll = scrolls.find(s => s.id === scrollId);
  if (!equipment) {
    return res.json(createError('装备不存在', 404));
  }
  if (!scroll) {
    return res.json(createError('附魔卷轴不存在', 404));
  }
  const successRate = calcEnchantSuccessRate(equipment, scroll);
  const possibleAffixes = AFFIX_POOL.filter(a => scroll.possibleAffixes.includes(a.id));
  const maxAffixes = 5;
  const replaceChance = equipment.affixes.length >= maxAffixes ? 100 : Math.min(30 + equipment.affixes.length * 15, 80);
  const response: CalculateEnchantResponse = {
    successRate,
    possibleAffixes,
    replaceChance
  };
  res.json(createResponse(response));
});

router.post('/execute', async (req: Request, res: Response) => {
  await delay(800);
  const { equipmentId, scrollId } = req.body as EnchantRequest;
  const equipmentIndex = equipments.findIndex(e => e.id === equipmentId);
  const scrollIndex = scrolls.findIndex(s => s.id === scrollId);
  if (equipmentIndex === -1) {
    return res.json(createError('装备不存在', 404));
  }
  if (scrollIndex === -1) {
    return res.json(createError('附魔卷轴不存在', 404));
  }
  const equipment = { ...equipments[equipmentIndex] };
  const scroll = scrolls[scrollIndex];
  const successRate = calcEnchantSuccessRate(equipment, scroll);
  const roll = Math.random() * 100;
  if (roll > successRate) {
    scrolls.splice(scrollIndex, 1);
    const response: EnchantResponse = {
      success: false,
      equipment,
      message: `附魔失败！成功率：${successRate.toFixed(1)}%，卷轴已消耗`
    };
    return res.json(createResponse(response));
  }
  const possibleAffixes = AFFIX_POOL.filter(a => scroll.possibleAffixes.includes(a.id));
  const existingAffixIds = new Set(equipment.affixes.map(a => a.id.replace(/affix_inst_.+_/, '')));
  let newAffixPool = possibleAffixes.filter(a => !existingAffixIds.has(a.id));
  if (newAffixPool.length === 0) {
    newAffixPool = possibleAffixes;
  }
  const selectedAffix = newAffixPool[Math.floor(Math.random() * newAffixPool.length)];
  const newAffix: Affix = {
    ...selectedAffix,
    id: `affix_inst_${generateId()}_${selectedAffix.id}`
  };
  const maxAffixes = 5;
  let replacedAffix: Affix | undefined;
  if (equipment.affixes.length >= maxAffixes) {
    const replaceIndex = Math.floor(Math.random() * equipment.affixes.length);
    replacedAffix = equipment.affixes[replaceIndex];
    equipment.affixes = [...equipment.affixes];
    equipment.affixes[replaceIndex] = newAffix;
  } else {
    const replaceRoll = Math.random() * 100;
    const replaceChance = Math.min(30 + equipment.affixes.length * 15, 80);
    if (replaceRoll < replaceChance && equipment.affixes.length > 0) {
      const replaceIndex = Math.floor(Math.random() * equipment.affixes.length);
      replacedAffix = equipment.affixes[replaceIndex];
      equipment.affixes = [...equipment.affixes];
      equipment.affixes[replaceIndex] = newAffix;
    } else {
      equipment.affixes = [...equipment.affixes, newAffix];
    }
  }
  equipment.score = calcScore(equipment.attributes, equipment.affixes);
  if (equipment.score >= 10000) equipment.rarity = 'legendary';
  else if (equipment.score >= 7000) equipment.rarity = 'epic';
  else if (equipment.score >= 4000) equipment.rarity = 'rare';
  else if (equipment.score >= 2000) equipment.rarity = 'uncommon';
  equipments[equipmentIndex] = equipment;
  scrolls.splice(scrollIndex, 1);
  const response: EnchantResponse = {
    success: true,
    equipment,
    addedAffix: newAffix,
    replacedAffix,
    message: replacedAffix 
      ? `附魔成功！【${newAffix.name}】替换了【${replacedAffix.name}】`
      : `附魔成功！获得新词缀【${newAffix.name}】`
  };
  res.json(createResponse(response));
});

export default router;
