import {
  User, Workshop, Recipe, Equipment, EnchantScroll, Material,
  MarketListing, Competition, Season, Guild, Duel, RankingEntry,
  WeeklyReport, Announcement, WorkshopMember, Building,
  Genre, Rarity, Position, BuildingType, AFFIX_POOL, Affix
} from './types';

const generateId = () => Math.random().toString(36).substring(2, 11);

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

export const mockUser: User = {
  id: 'user_001',
  username: '魔法工匠大师',
  email: 'player@magicworkshop.com',
  gold: 15680,
  luck: 15,
  createdAt: daysAgo(30),
  stats: {
    todayCrafts: 12,
    todayEnchants: 5,
    weeklyIncome: 8560,
    totalCrafts: 156,
    totalEnchants: 78,
    rank: 23
  }
};

export const mockMembers: WorkshopMember[] = [
  { id: 'member_001', name: '老匠师·艾伦', position: 'master', skillLevel: 95, luck: 18, avatar: '👨‍🦳' },
  { id: 'member_002', name: '莉娜', position: 'journeyman', skillLevel: 72, luck: 12, avatar: '👩' },
  { id: 'member_003', name: '小铁匠·托尔', position: 'apprentice', skillLevel: 45, luck: 8, avatar: '👦' },
  { id: 'member_004', name: '管家·莫里斯', position: 'steward', skillLevel: 60, luck: 15, avatar: '🧔' },
  { id: 'member_005', name: '神秘铸造师', position: 'journeyman', skillLevel: 80, luck: 22, avatar: '🧙' },
];

export const mockBuildings: Building[] = [
  { id: 'building_001', type: 'furnace', level: 5, upgradeProgress: 65, pendingUpgrade: false },
  { id: 'building_002', type: 'enchanting_table', level: 4, upgradeProgress: 30, pendingUpgrade: true },
  { id: 'building_003', type: 'warehouse', level: 3, upgradeProgress: 0, pendingUpgrade: false },
];

export const mockWorkshop: Workshop = {
  id: 'workshop_001',
  name: '星辰熔炉工坊',
  signboard: '✨ 以星辰之名，锻造传世神兵 ✨',
  genre: 'blacksmith',
  level: 8,
  reputation: 1250,
  ownerId: 'user_001',
  ownerName: '魔法工匠大师',
  buildings: mockBuildings,
  members: mockMembers,
  materials: [],
  createdAt: daysAgo(25)
};

const makeRecipe = (
  id: string, name: string, genre: Genre, level: number,
  materials: { id: string; name: string; amount: number }[],
  baseSuccessRate: number,
  attributes: { attr: string; name: string; min: number; max: number }[],
  affixes: string[],
  description: string
): Recipe => ({
  id, name, genre, level,
  materials: materials.map(m => ({ materialId: m.id, materialName: m.name, amount: m.amount })),
  baseSuccessRate,
  baseAttributes: attributes.map(a => ({ attribute: a.attr, attributeName: a.name, min: a.min, max: a.max })),
  possibleAffixes: affixes,
  description
});

export const mockRecipes: Recipe[] = [
  makeRecipe('recipe_001', '烈焰巨剑', 'blacksmith', 5,
    [
      { id: 'mat_001', name: '魔铁矿石', amount: 15 },
      { id: 'mat_002', name: '火焰精华', amount: 5 },
      { id: 'mat_003', name: '龙之鳞片', amount: 3 }
    ],
    75,
    [
      { attr: 'attack', name: '攻击力', min: 120, max: 180 },
      { attr: 'fireDamage', name: '火焰伤害', min: 30, max: 60 }
    ],
    ['affix_2', 'affix_3', 'affix_16'],
    '蕴含烈焰之力的双手巨剑，挥舞时可召唤火焰风暴'
  ),
  makeRecipe('recipe_002', '暗影匕首', 'blacksmith', 3,
    [
      { id: 'mat_001', name: '魔铁矿石', amount: 8 },
      { id: 'mat_004', name: '暗影水晶', amount: 4 }
    ],
    85,
    [
      { attr: 'attack', name: '攻击力', min: 45, max: 75 },
      { attr: 'critChance', name: '暴击率', min: 5, max: 12 }
    ],
    ['affix_2', 'affix_4', 'affix_13'],
    '来自暗影位面的神秘匕首，擅长偷袭和暗杀'
  ),
  makeRecipe('recipe_003', '守护者之盾', 'blacksmith', 4,
    [
      { id: 'mat_001', name: '魔铁矿石', amount: 20 },
      { id: 'mat_005', name: '大地结晶', amount: 6 }
    ],
    70,
    [
      { attr: 'defense', name: '防御力', min: 80, max: 130 },
      { attr: 'blockChance', name: '格挡率', min: 10, max: 18 }
    ],
    ['affix_5', 'affix_14', 'affix_18'],
    '矮人大师铸造的神圣盾牌，据说可以抵挡巨龙的吐息'
  ),
  makeRecipe('recipe_004', '星辰法袍', 'tailor', 6,
    [
      { id: 'mat_006', name: '星辰丝绸', amount: 12 },
      { id: 'mat_007', name: '月光布料', amount: 8 },
      { id: 'mat_008', name: '魔法丝线', amount: 20 }
    ],
    65,
    [
      { attr: 'intelligence', name: '智力', min: 40, max: 65 },
      { attr: 'mana', name: '魔法值', min: 200, max: 350 },
      { attr: 'manaRegen', name: '魔法回复', min: 5, max: 10 }
    ],
    ['affix_7', 'affix_11', 'affix_19'],
    '汲取星光精华编织而成的法袍，穿戴者可召唤流星雨'
  ),
  makeRecipe('recipe_005', '疾风皮甲', 'tailor', 4,
    [
      { id: 'mat_009', name: '风狼皮革', amount: 10 },
      { id: 'mat_010', name: '鹰羽', amount: 15 }
    ],
    80,
    [
      { attr: 'agility', name: '敏捷', min: 30, max: 50 },
      { attr: 'dodgeChance', name: '闪避率', min: 8, max: 15 },
      { attr: 'attackSpeed', name: '攻击速度', min: 5, max: 12 }
    ],
    ['affix_4', 'affix_9', 'affix_15'],
    '轻盈如风的皮甲，穿上后仿佛能与风融为一体'
  ),
  makeRecipe('recipe_006', '生命护符', 'jeweler', 5,
    [
      { id: 'mat_011', name: '生命宝石', amount: 1 },
      { id: 'mat_012', name: '秘银链', amount: 1 },
      { id: 'mat_013', name: '生命精华', amount: 10 }
    ],
    72,
    [
      { attr: 'health', name: '生命值', min: 300, max: 500 },
      { attr: 'healthRegen', name: '生命回复', min: 8, max: 15 }
    ],
    ['affix_10', 'affix_12', 'affix_17'],
    '蕴含生命本源力量的护符，佩戴者伤口会快速愈合'
  ),
  makeRecipe('recipe_007', '毁灭之戒', 'jeweler', 7,
    [
      { id: 'mat_014', name: '毁灭原石', amount: 1 },
      { id: 'mat_015', name: '暗金底座', amount: 1 },
      { id: 'mat_016', name: '混沌能量', amount: 5 }
    ],
    55,
    [
      { attr: 'attack', name: '攻击力', min: 80, max: 120 },
      { attr: 'critDamage', name: '暴击伤害', min: 25, max: 45 }
    ],
    ['affix_3', 'affix_13', 'affix_16'],
    '蕴含毁灭法则的戒指，使用者将获得毁天灭地的力量'
  ),
  makeRecipe('recipe_008', '元素吊坠', 'jeweler', 4,
    [
      { id: 'mat_017', name: '四元素水晶', amount: 1 },
      { id: 'mat_018', name: '白银链', amount: 1 }
    ],
    78,
    [
      { attr: 'elementDamage', name: '元素伤害', min: 20, max: 40 },
      { attr: 'intelligence', name: '智力', min: 15, max: 25 }
    ],
    ['affix_7', 'affix_19', 'affix_20'],
    '融合四元素之力的吊坠，可随意操控元素魔法'
  ),
];

const makeAffixes = (count: number): Affix[] => {
  const shuffled = [...AFFIX_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const calcScore = (attrs: Record<string, number>, affixes: Affix[]): number => {
  const attrSum = Object.values(attrs).reduce((a, b) => a + b, 0);
  const affixSum = affixes.reduce((sum, a) => {
    const rarityMult = a.rarity === 'legendary' ? 3 : a.rarity === 'epic' ? 2 : a.rarity === 'rare' ? 1.5 : 1;
    return sum + Object.values(a.effect).reduce((s, v) => s + v, 0) * rarityMult;
  }, 0);
  return Math.floor(attrSum + affixSum * 10);
};

export const mockEquipments: Equipment[] = [
  {
    id: 'equip_001',
    ownerId: 'user_001',
    creatorId: 'user_001',
    creatorName: '魔法工匠大师',
    recipeId: 'recipe_001',
    name: '烈焰巨剑·炎狱',
    rarity: 'legendary',
    quality: 95,
    attributes: { attack: 175, fireDamage: 58 },
    affixes: [AFFIX_POOL[1], AFFIX_POOL[2], AFFIX_POOL[15]],
    score: 12580,
    genre: 'blacksmith',
    isListed: false,
    createdAt: daysAgo(3)
  },
  {
    id: 'equip_002',
    ownerId: 'user_001',
    creatorId: 'user_001',
    creatorName: '魔法工匠大师',
    recipeId: 'recipe_004',
    name: '星辰法袍·银河',
    rarity: 'epic',
    quality: 88,
    attributes: { intelligence: 60, mana: 320, manaRegen: 9 },
    affixes: [AFFIX_POOL[6], AFFIX_POOL[10]],
    score: 9875,
    genre: 'tailor',
    isListed: false,
    createdAt: daysAgo(5)
  },
  {
    id: 'equip_003',
    ownerId: 'user_001',
    creatorId: 'user_001',
    creatorName: '魔法工匠大师',
    recipeId: 'recipe_006',
    name: '生命护符·永恒',
    rarity: 'epic',
    quality: 82,
    attributes: { health: 450, healthRegen: 13 },
    affixes: [AFFIX_POOL[9], AFFIX_POOL[11]],
    score: 8650,
    genre: 'jeweler',
    isListed: true,
    createdAt: daysAgo(7)
  },
  {
    id: 'equip_004',
    ownerId: 'user_001',
    creatorId: 'user_001',
    creatorName: '魔法工匠大师',
    recipeId: 'recipe_002',
    name: '暗影匕首·夜刃',
    rarity: 'rare',
    quality: 78,
    attributes: { attack: 68, critChance: 11 },
    affixes: [AFFIX_POOL[1], AFFIX_POOL[3]],
    score: 5420,
    genre: 'blacksmith',
    isListed: false,
    createdAt: daysAgo(10)
  },
  {
    id: 'equip_005',
    ownerId: 'user_001',
    creatorId: 'user_001',
    creatorName: '魔法工匠大师',
    recipeId: 'recipe_003',
    name: '守护者之盾·磐石',
    rarity: 'rare',
    quality: 75,
    attributes: { defense: 115, blockChance: 16 },
    affixes: [AFFIX_POOL[4]],
    score: 4890,
    genre: 'blacksmith',
    isListed: false,
    createdAt: daysAgo(12)
  },
  {
    id: 'equip_006',
    ownerId: 'user_001',
    creatorId: 'user_001',
    creatorName: '魔法工匠大师',
    recipeId: 'recipe_005',
    name: '疾风皮甲·风行',
    rarity: 'uncommon',
    quality: 65,
    attributes: { agility: 42, dodgeChance: 13, attackSpeed: 10 },
    affixes: [AFFIX_POOL[8]],
    score: 3560,
    genre: 'tailor',
    isListed: true,
    createdAt: daysAgo(15)
  },
];

export const mockScrolls: EnchantScroll[] = [
  {
    id: 'scroll_001',
    ownerId: 'user_001',
    name: '高级攻击附魔卷轴',
    level: 5,
    possibleAffixes: ['affix_6', 'affix_1', 'affix_16'],
    successRateBonus: 15,
    isListed: false,
    rarity: 'epic',
    createdAt: daysAgo(2)
  },
  {
    id: 'scroll_002',
    ownerId: 'user_001',
    name: '暴击强化卷轴',
    level: 4,
    possibleAffixes: ['affix_2', 'affix_3'],
    successRateBonus: 12,
    isListed: false,
    rarity: 'rare',
    createdAt: daysAgo(4)
  },
  {
    id: 'scroll_003',
    ownerId: 'user_001',
    name: '生命祝福卷轴',
    level: 3,
    possibleAffixes: ['affix_10', 'affix_12', 'affix_17'],
    successRateBonus: 10,
    isListed: true,
    rarity: 'rare',
    createdAt: daysAgo(6)
  },
  {
    id: 'scroll_004',
    ownerId: 'user_001',
    name: '传说词缀附魔卷轴',
    level: 8,
    possibleAffixes: ['affix_16', 'affix_17'],
    successRateBonus: 8,
    isListed: false,
    rarity: 'legendary',
    createdAt: daysAgo(1)
  },
];

export const mockMaterials: Material[] = [
  { id: 'mat_001', ownerId: 'user_001', name: '魔铁矿石', quantity: 156, rarity: 'uncommon', description: '蕴含魔力的铁矿石，是锻造高级装备的基础材料', icon: '🪨' },
  { id: 'mat_002', ownerId: 'user_001', name: '火焰精华', quantity: 45, rarity: 'rare', description: '从火元素位面提取的纯净能量', icon: '🔥' },
  { id: 'mat_003', ownerId: 'user_001', name: '龙之鳞片', quantity: 12, rarity: 'epic', description: '远古巨龙脱落的鳞片，坚硬无比', icon: '🐉' },
  { id: 'mat_004', ownerId: 'user_001', name: '暗影水晶', quantity: 28, rarity: 'rare', description: '吸收了暗影力量的神秘水晶', icon: '💜' },
  { id: 'mat_005', ownerId: 'user_001', name: '大地结晶', quantity: 33, rarity: 'uncommon', description: '大地深处形成的能量结晶', icon: '🟤' },
  { id: 'mat_006', ownerId: 'user_001', name: '星辰丝绸', quantity: 67, rarity: 'rare', description: '用星光能量编织的神奇布料', icon: '✨' },
  { id: 'mat_007', ownerId: 'user_001', name: '月光布料', quantity: 89, rarity: 'uncommon', description: '在月光下织成的魔法布料', icon: '🌙' },
  { id: 'mat_008', ownerId: 'user_001', name: '魔法丝线', quantity: 234, rarity: 'common', description: '附魔后的丝线，是裁缝的基础材料', icon: '🧵' },
  { id: 'mat_009', ownerId: 'user_001', name: '风狼皮革', quantity: 56, rarity: 'uncommon', description: '风狼的皮革，轻盈而坚韧', icon: '🐺' },
  { id: 'mat_010', ownerId: 'user_001', name: '鹰羽', quantity: 178, rarity: 'common', description: '疾风鹰的羽毛，蕴含风元素', icon: '🪶' },
  { id: 'mat_011', ownerId: 'user_001', name: '生命宝石', quantity: 8, rarity: 'epic', description: '蕴含强大生命力的稀有宝石', icon: '💚' },
  { id: 'mat_012', ownerId: 'user_001', name: '秘银链', quantity: 5, rarity: 'rare', description: '用秘银打造的项链底座', icon: '📿' },
  { id: 'mat_014', ownerId: 'user_001', name: '毁灭原石', quantity: 2, rarity: 'legendary', description: '蕴含毁灭法则的神秘原石', icon: '💀' },
  { id: 'mat_015', ownerId: 'user_001', name: '暗金底座', quantity: 3, rarity: 'epic', description: '用暗金打造的戒指底座', icon: '💍' },
];

mockWorkshop.materials = mockMaterials;

export const mockMarketListings: MarketListing[] = [
  {
    id: 'listing_001',
    sellerId: 'user_002',
    sellerName: '烈焰铸造师',
    itemType: 'equipment',
    item: {
      id: 'equip_market_001',
      ownerId: 'user_002',
      creatorId: 'user_002',
      creatorName: '烈焰铸造师',
      recipeId: 'recipe_001',
      name: '烈焰巨剑·焚天',
      rarity: 'epic',
      quality: 85,
      attributes: { attack: 160, fireDamage: 50 },
      affixes: [AFFIX_POOL[1], AFFIX_POOL[2]],
      score: 8950,
      genre: 'blacksmith',
      isListed: true,
      createdAt: daysAgo(1)
    } as Equipment,
    price: 8500,
    suggestedPriceMin: 7000,
    suggestedPriceMax: 9500,
    isActive: true,
    createdAt: daysAgo(0),
    expiresAt: daysAgo(-2)
  },
  {
    id: 'listing_002',
    sellerId: 'user_003',
    sellerName: '月影裁缝',
    itemType: 'equipment',
    item: {
      id: 'equip_market_002',
      ownerId: 'user_003',
      creatorId: 'user_003',
      creatorName: '月影裁缝',
      recipeId: 'recipe_004',
      name: '星辰法袍·月影',
      rarity: 'rare',
      quality: 72,
      attributes: { intelligence: 50, mana: 280, manaRegen: 7 },
      affixes: [AFFIX_POOL[6]],
      score: 5680,
      genre: 'tailor',
      isListed: true,
      createdAt: daysAgo(2)
    } as Equipment,
    price: 3800,
    suggestedPriceMin: 3000,
    suggestedPriceMax: 4500,
    isActive: true,
    createdAt: daysAgo(0.5),
    expiresAt: daysAgo(-2)
  },
  {
    id: 'listing_003',
    sellerId: 'user_004',
    sellerName: '宝石工匠',
    itemType: 'scroll',
    item: {
      id: 'scroll_market_001',
      ownerId: 'user_004',
      name: '稀有词缀随机卷轴',
      level: 5,
      possibleAffixes: ['affix_1', 'affix_2', 'affix_3', 'affix_16'],
      successRateBonus: 12,
      isListed: true,
      rarity: 'epic',
      createdAt: daysAgo(1)
    } as EnchantScroll,
    price: 2500,
    suggestedPriceMin: 2000,
    suggestedPriceMax: 3000,
    isActive: true,
    createdAt: daysAgo(0.3),
    expiresAt: daysAgo(-3)
  },
  {
    id: 'listing_004',
    sellerId: 'user_005',
    sellerName: '神秘商人',
    itemType: 'equipment',
    item: {
      id: 'equip_market_003',
      ownerId: 'user_005',
      creatorId: 'user_005',
      creatorName: '神秘商人',
      recipeId: 'recipe_006',
      name: '生命护符·不朽',
      rarity: 'legendary',
      quality: 92,
      attributes: { health: 480, healthRegen: 14 },
      affixes: [AFFIX_POOL[11], AFFIX_POOL[16]],
      score: 11200,
      genre: 'jeweler',
      isListed: true,
      createdAt: daysAgo(0.5)
    } as Equipment,
    price: 15800,
    suggestedPriceMin: 12000,
    suggestedPriceMax: 18000,
    isActive: true,
    createdAt: daysAgo(0.1),
    expiresAt: daysAgo(-5)
  },
];

export const mockCompetition: Competition = {
  id: 'comp_001',
  seasonId: 'season_001',
  theme: '🔥 今日主题：最强攻击装备 🔥',
  requiredGenre: 'all',
  startTime: new Date(now.getTime() - 3600000 * 2),
  endTime: new Date(now.getTime() + 3600000 * 10),
  entries: [
    { id: 'entry_001', competitionId: 'comp_001', playerId: 'user_001', playerName: '魔法工匠大师', equipment: mockEquipments[0], score: 12580, rank: 1 },
    { id: 'entry_002', competitionId: 'comp_001', playerId: 'user_002', playerName: '烈焰铸造师', equipment: mockMarketListings[0].item as Equipment, score: 8950, rank: 2 },
    { id: 'entry_003', competitionId: 'comp_001', playerId: 'user_006', playerName: '雷霆铁匠', equipment: mockEquipments[2], score: 8650, rank: 3 },
    { id: 'entry_004', competitionId: 'comp_001', playerId: 'user_007', playerName: '寒冰工匠', equipment: mockEquipments[3], score: 5420, rank: 4 },
  ]
};

export const mockSeason: Season = {
  id: 'season_001',
  name: '🌟 第一赛季：创世之初 🌟',
  startDate: daysAgo(15),
  endDate: daysAgo(-15),
  isActive: true,
  rewards: [
    { rank: 1, itemName: '限定传说附魔图纸：创世之力', itemType: 'enchant_recipe', quantity: 1 },
    { rank: 2, itemName: '限定史诗附魔图纸：神之祝福', itemType: 'enchant_recipe', quantity: 1 },
    { rank: 3, itemName: '传说材料：星辰之核', itemType: 'material', quantity: 5 },
    { rank: 10, itemName: '高级附魔卷轴礼包', itemType: 'scroll', quantity: 10 },
    { rank: 50, itemName: '稀有材料宝箱', itemType: 'material', quantity: 1 },
  ]
};

export const mockGuild: Guild = {
  id: 'guild_001',
  name: '✨ 星辰铸造联盟 ✨',
  level: 5,
  reputation: 12580,
  presidentId: 'user_001',
  presidentName: '魔法工匠大师',
  vicePresidentIds: ['user_002', 'user_003'],
  members: [
    { id: 'gm_001', guildId: 'guild_001', playerId: 'user_001', playerName: '魔法工匠大师', role: 'president', contribution: 5680, joinedAt: daysAgo(20) },
    { id: 'gm_002', guildId: 'guild_001', playerId: 'user_002', playerName: '烈焰铸造师', role: 'vice_president', contribution: 4200, joinedAt: daysAgo(18) },
    { id: 'gm_003', guildId: 'guild_001', playerId: 'user_003', playerName: '月影裁缝', role: 'vice_president', contribution: 3800, joinedAt: daysAgo(18) },
    { id: 'gm_004', guildId: 'guild_001', playerId: 'user_006', playerName: '雷霆铁匠', role: 'member', contribution: 2100, joinedAt: daysAgo(15) },
    { id: 'gm_005', guildId: 'guild_001', playerId: 'user_007', playerName: '寒冰工匠', role: 'member', contribution: 1850, joinedAt: daysAgo(12) },
    { id: 'gm_006', guildId: 'guild_001', playerId: 'user_008', playerName: '宝石猎人', role: 'member', contribution: 1200, joinedAt: daysAgo(10) },
  ],
  buildings: [
    {
      id: 'gb_001',
      type: 'union_furnace',
      level: 4,
      upgradeProgress: 75,
      requiredMaterials: [
        { materialId: 'mat_001', materialName: '魔铁矿石', amount: 500 },
        { materialId: 'mat_002', materialName: '火焰精华', amount: 200 },
      ],
      requiredGold: 10000,
      currentMaterials: [
        { materialId: 'mat_001', materialName: '魔铁矿石', amount: 380 },
        { materialId: 'mat_002', materialName: '火焰精华', amount: 150 },
      ],
      currentGold: 8500
    },
    {
      id: 'gb_002',
      type: 'master_enchanting_table',
      level: 3,
      upgradeProgress: 40,
      requiredMaterials: [
        { materialId: 'mat_004', materialName: '暗影水晶', amount: 300 },
        { materialId: 'mat_011', materialName: '生命宝石', amount: 10 },
      ],
      requiredGold: 15000,
      currentMaterials: [
        { materialId: 'mat_004', materialName: '暗影水晶', amount: 120 },
        { materialId: 'mat_011', materialName: '生命宝石', amount: 4 },
      ],
      currentGold: 6200
    }
  ],
  createdAt: daysAgo(20)
};

export const mockDuels: Duel[] = [
  {
    id: 'duel_001',
    challengerGuildId: 'guild_001',
    challengerGuildName: '✨ 星辰铸造联盟 ✨',
    challengedGuildId: 'guild_002',
    challengedGuildName: '🔥 烈焰兄弟会 🔥',
    status: 'in_progress',
    themeEquipment: '烈焰巨剑',
    startTime: new Date(now.getTime() - 3600000 * 0.5),
    endTime: new Date(now.getTime() + 3600000 * 0.25),
    representatives: [
      { id: 'dr_001', duelId: 'duel_001', guildId: 'guild_001', playerId: 'user_001', playerName: '魔法工匠大师' },
      { id: 'dr_002', duelId: 'duel_001', guildId: 'guild_001', playerId: 'user_002', playerName: '烈焰铸造师' },
      { id: 'dr_003', duelId: 'duel_001', guildId: 'guild_001', playerId: 'user_006', playerName: '雷霆铁匠' },
      { id: 'dr_004', duelId: 'duel_001', guildId: 'guild_002', playerId: 'user_010', playerName: '烈焰主宰' },
      { id: 'dr_005', duelId: 'duel_001', guildId: 'guild_002', playerId: 'user_011', playerName: '熔岩大师' },
      { id: 'dr_006', duelId: 'duel_001', guildId: 'guild_002', playerId: 'user_012', playerName: '炽焰工匠' },
    ],
    scores: [
      { id: 'ds_001', duelId: 'duel_001', playerId: 'user_001', quality: 88, speed: 92, affixCount: 3, total: 91 },
      { id: 'ds_002', duelId: 'duel_001', playerId: 'user_002', quality: 82, speed: 88, affixCount: 2, total: 84 },
      { id: 'ds_003', duelId: 'duel_001', playerId: 'user_006', quality: 75, speed: 70, affixCount: 2, total: 72 },
      { id: 'ds_004', duelId: 'duel_001', playerId: 'user_010', quality: 85, speed: 90, affixCount: 2, total: 86 },
      { id: 'ds_005', duelId: 'duel_001', playerId: 'user_011', quality: 78, speed: 85, affixCount: 2, total: 80 },
      { id: 'ds_006', duelId: 'duel_001', playerId: 'user_012', quality: 80, speed: 82, affixCount: 1, total: 76 },
    ],
    createdAt: daysAgo(0)
  },
  {
    id: 'duel_002',
    challengerGuildId: 'guild_002',
    challengerGuildName: '🔥 烈焰兄弟会 🔥',
    challengedGuildId: 'guild_001',
    challengedGuildName: '✨ 星辰铸造联盟 ✨',
    status: 'completed',
    themeEquipment: '守护者之盾',
    startTime: daysAgo(2),
    endTime: daysAgo(2),
    winnerId: 'guild_001',
    winnerName: '✨ 星辰铸造联盟 ✨',
    representatives: [
      { id: 'dr_007', duelId: 'duel_002', guildId: 'guild_002', playerId: 'user_010', playerName: '烈焰主宰' },
      { id: 'dr_008', duelId: 'duel_002', guildId: 'guild_001', playerId: 'user_001', playerName: '魔法工匠大师' },
    ],
    scores: [
      { id: 'ds_007', duelId: 'duel_002', playerId: 'user_010', quality: 78, speed: 75, affixCount: 1, total: 76 },
      { id: 'ds_008', duelId: 'duel_002', playerId: 'user_001', quality: 90, speed: 85, affixCount: 2, total: 88 },
    ],
    createdAt: daysAgo(3)
  }
];

const rankingScore = [
  { id: 'r1', rank: 1, playerId: 'user_001', playerName: '魔法工匠大师', workshopName: '星辰熔炉工坊', value: 12580, score: 12580, craftCount: 156, enchantCount: 76, trend: 'up' as const },
  { id: 'r2', rank: 2, playerId: 'user_010', playerName: '烈焰主宰', workshopName: '烈焰之心工坊', value: 11850, score: 11850, craftCount: 98, enchantCount: 58, trend: 'up' as const },
  { id: 'r3', rank: 3, playerId: 'user_020', playerName: '星空编织者', workshopName: '银河裁缝铺', value: 10920, score: 10920, craftCount: 87, enchantCount: 65, trend: 'stable' as const },
  { id: 'r4', rank: 4, playerId: 'user_030', playerName: '宝石大师', workshopName: '永恒珠宝店', value: 9870, score: 9870, craftCount: 65, enchantCount: 89, trend: 'down' as const },
  { id: 'r5', rank: 5, playerId: 'user_002', playerName: '烈焰铸造师', workshopName: '熔岩锻造坊', value: 8950, score: 8950, craftCount: 128, enchantCount: 34, trend: 'up' as const },
];

const rankingCraftCount = [
  { id: 'r1', rank: 1, playerId: 'user_001', playerName: '魔法工匠大师', workshopName: '星辰熔炉工坊', value: 156, score: 12580, craftCount: 156, enchantCount: 76, trend: 'up' as const },
  { id: 'r2', rank: 2, playerId: 'user_007', playerName: '寒冰工匠', workshopName: '北境工坊', value: 142, score: 7650, craftCount: 142, enchantCount: 23, trend: 'stable' as const },
  { id: 'r3', rank: 3, playerId: 'user_002', playerName: '烈焰铸造师', workshopName: '熔岩锻造坊', value: 128, score: 8950, craftCount: 128, enchantCount: 34, trend: 'up' as const },
  { id: 'r4', rank: 4, playerId: 'user_015', playerName: '勤劳小裁缝', workshopName: '彩云裁缝铺', value: 115, score: 6540, craftCount: 115, enchantCount: 45, trend: 'down' as const },
  { id: 'r5', rank: 5, playerId: 'user_025', playerName: '珠宝学徒', workshopName: '星光珠宝店', value: 98, score: 4560, craftCount: 98, enchantCount: 56, trend: 'up' as const },
];

const rankingEnchantCount = [
  { id: 'r1', rank: 1, playerId: 'user_030', playerName: '宝石大师', workshopName: '永恒珠宝店', value: 89, score: 9870, craftCount: 65, enchantCount: 89, trend: 'up' as const },
  { id: 'r2', rank: 2, playerId: 'user_001', playerName: '魔法工匠大师', workshopName: '星辰熔炉工坊', value: 76, score: 12580, craftCount: 156, enchantCount: 76, trend: 'up' as const },
  { id: 'r3', rank: 3, playerId: 'user_020', playerName: '星空编织者', workshopName: '银河裁缝铺', value: 65, score: 10920, craftCount: 87, enchantCount: 65, trend: 'stable' as const },
  { id: 'r4', rank: 4, playerId: 'user_010', playerName: '烈焰主宰', workshopName: '烈焰之心工坊', value: 58, score: 11850, craftCount: 98, enchantCount: 58, trend: 'down' as const },
  { id: 'r5', rank: 5, playerId: 'user_005', playerName: '神秘商人', workshopName: '神秘小屋', value: 52, score: 5670, craftCount: 45, enchantCount: 52, trend: 'up' as const },
];

export const mockRankings: { byScore: RankingEntry[]; byCraftCount: RankingEntry[]; byEnchantCount: RankingEntry[] } = {
  byScore: rankingScore,
  byCraftCount: rankingCraftCount,
  byEnchantCount: rankingEnchantCount,
};

export const mockWeeklyReport: WeeklyReport = {
  weekStart: daysAgo(7),
  weekEnd: now,
  topEquipment: mockEquipments[0],
  attributeDistribution: {
    attack: [20, 35, 25, 15, 5],
    defense: [15, 30, 30, 18, 7],
    intelligence: [10, 25, 35, 22, 8],
    agility: [25, 30, 25, 15, 5],
    health: [30, 35, 20, 10, 5],
  },
  craftingTrend: Array.from({ length: 7 }, (_, i) => ({
    date: daysAgo(6 - i),
    count: Math.floor(Math.random() * 50) + 80
  })),
  byScore: rankingScore,
  byCraftCount: rankingCraftCount,
  byEnchantCount: rankingEnchantCount,
  rankings: mockRankings
};

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann_001',
    type: 'transaction',
    content: '🎉 恭喜玩家【魔法工匠大师】以 15,800 金币售出【生命护符·不朽】！',
    createdAt: new Date(now.getTime() - 300000)
  },
  {
    id: 'ann_002',
    type: 'competition',
    content: '🏆 今日装备评分赛进行中！当前第一名：【魔法工匠大师】评分 12,580',
    createdAt: new Date(now.getTime() - 600000)
  },
  {
    id: 'ann_003',
    type: 'duel',
    content: '⚔️ 工艺对决：【星辰铸造联盟】VS【烈焰兄弟会】正在激烈对决中！',
    createdAt: new Date(now.getTime() - 1800000)
  },
  {
    id: 'ann_004',
    type: 'system',
    content: '📢 系统公告：新赛季限定附魔图纸已上线，排名靠前的玩家可获得！',
    createdAt: new Date(now.getTime() - 3600000)
  },
  {
    id: 'ann_005',
    type: 'transaction',
    content: '🎉 恭喜玩家【烈焰铸造师】以 8,500 金币售出【烈焰巨剑·焚天】！',
    createdAt: new Date(now.getTime() - 7200000)
  },
];

export const mockAllWorkshops: Workshop[] = [
  {
    ...mockWorkshop,
  },
  {
    id: 'workshop_002',
    name: '烈焰之心工坊',
    signboard: '🔥 熔炼一切，锻造神兵 🔥',
    genre: 'blacksmith',
    level: 10,
    reputation: 1890,
    ownerId: 'user_010',
    ownerName: '烈焰主宰',
    buildings: [
      { id: 'b2_1', type: 'furnace', level: 8, upgradeProgress: 0, pendingUpgrade: false },
      { id: 'b2_2', type: 'enchanting_table', level: 6, upgradeProgress: 0, pendingUpgrade: false },
      { id: 'b2_3', type: 'warehouse', level: 5, upgradeProgress: 0, pendingUpgrade: false },
    ],
    members: [
      { id: 'm2_1', name: '烈焰主宰', position: 'master', skillLevel: 99, luck: 20, avatar: '🔥' },
      { id: 'm2_2', name: '熔岩大师', position: 'journeyman', skillLevel: 85, luck: 15, avatar: '🌋' },
      { id: 'm2_3', name: '炽焰工匠', position: 'journeyman', skillLevel: 82, luck: 12, avatar: '💥' },
    ],
    materials: mockMaterials,
    createdAt: daysAgo(60)
  },
  {
    id: 'workshop_003',
    name: '银河裁缝铺',
    signboard: '✨ 编织星辰，缝制传奇 ✨',
    genre: 'tailor',
    level: 9,
    reputation: 1560,
    ownerId: 'user_020',
    ownerName: '星空编织者',
    buildings: [
      { id: 'b3_1', type: 'furnace', level: 3, upgradeProgress: 0, pendingUpgrade: false },
      { id: 'b3_2', type: 'enchanting_table', level: 7, upgradeProgress: 50, pendingUpgrade: true },
      { id: 'b3_3', type: 'warehouse', level: 6, upgradeProgress: 0, pendingUpgrade: false },
    ],
    members: [
      { id: 'm3_1', name: '星空编织者', position: 'master', skillLevel: 96, luck: 25, avatar: '🌟' },
      { id: 'm3_2', name: '月光织女', position: 'journeyman', skillLevel: 80, luck: 18, avatar: '🌙' },
      { id: 'm3_3', name: '彩云学徒', position: 'apprentice', skillLevel: 55, luck: 10, avatar: '🌈' },
    ],
    materials: mockMaterials,
    createdAt: daysAgo(45)
  },
  {
    id: 'workshop_004',
    name: '永恒珠宝店',
    signboard: '💎 一颗宝石，一段传说 💎',
    genre: 'jeweler',
    level: 8,
    reputation: 1320,
    ownerId: 'user_030',
    ownerName: '宝石大师',
    buildings: [
      { id: 'b4_1', type: 'furnace', level: 4, upgradeProgress: 0, pendingUpgrade: false },
      { id: 'b4_2', type: 'enchanting_table', level: 8, upgradeProgress: 0, pendingUpgrade: false },
      { id: 'b4_3', type: 'warehouse', level: 7, upgradeProgress: 0, pendingUpgrade: false },
    ],
    members: [
      { id: 'm4_1', name: '宝石大师', position: 'master', skillLevel: 94, luck: 22, avatar: '💎' },
      { id: 'm4_2', name: '珠宝猎手', position: 'journeyman', skillLevel: 78, luck: 16, avatar: '💍' },
      { id: 'm4_3', name: '宝石切割师', position: 'steward', skillLevel: 70, luck: 14, avatar: '🔪' },
    ],
    materials: mockMaterials,
    createdAt: daysAgo(50)
  },
];

export const calculateSuccessRate = (
  baseRate: number,
  craftsmanSkill: number,
  buildingLevel: number,
  recipeLevel: number
): number => {
  const skillBonus = (craftsmanSkill - recipeLevel * 10) * 0.5;
  const buildingBonus = (buildingLevel - 1) * 5;
  const rate = baseRate + skillBonus + buildingBonus;
  return Math.max(10, Math.min(98, rate));
};

export const generateEquipment = (
  recipe: Recipe,
  craftsman: WorkshopMember,
  building: Building,
  creatorId: string,
  creatorName: string
): Equipment | null => {
  const successRate = calculateSuccessRate(recipe.baseSuccessRate, craftsman.skillLevel, building.level, recipe.level);
  const roll = Math.random() * 100;

  if (roll > successRate) {
    return null;
  }

  const quality = Math.floor(Math.random() * 31) + 70;
  const qualityMult = 0.85 + (quality / 100) * 0.3;

  const attributes: Record<string, number> = {};
  recipe.baseAttributes.forEach(attr => {
    const base = Math.floor(Math.random() * (attr.max - attr.min + 1)) + attr.min;
    attributes[attr.attribute] = Math.floor(base * qualityMult);
  });

  const affixCount = quality >= 90 ? 3 : quality >= 75 ? 2 : 1;
  const possibleAffixes = AFFIX_POOL.filter(a => recipe.possibleAffixes.includes(a.id));
  const affixes: Affix[] = [];
  const usedAffixes = new Set<string>();

  for (let i = 0; i < affixCount && usedAffixes.size < possibleAffixes.length; i++) {
    let affix: Affix;
    do {
      const rarityRoll = Math.random();
      if (rarityRoll < 0.05 && quality >= 90) {
        const legendary = possibleAffixes.filter(a => a.rarity === 'legendary' && !usedAffixes.has(a.id));
        affix = legendary.length > 0 ? legendary[Math.floor(Math.random() * legendary.length)] : possibleAffixes[0];
      } else if (rarityRoll < 0.2 && quality >= 80) {
        const epic = possibleAffixes.filter(a => a.rarity === 'epic' && !usedAffixes.has(a.id));
        affix = epic.length > 0 ? epic[Math.floor(Math.random() * epic.length)] : possibleAffixes[0];
      } else if (rarityRoll < 0.5) {
        const rare = possibleAffixes.filter(a => a.rarity === 'rare' && !usedAffixes.has(a.id));
        affix = rare.length > 0 ? rare[Math.floor(Math.random() * rare.length)] : possibleAffixes[0];
      } else {
        const common = possibleAffixes.filter(a => (a.rarity === 'common' || a.rarity === 'uncommon') && !usedAffixes.has(a.id));
        affix = common.length > 0 ? common[Math.floor(Math.random() * common.length)] : possibleAffixes[0];
      }
    } while (usedAffixes.has(affix.id) && usedAffixes.size < possibleAffixes.length);
    
    usedAffixes.add(affix.id);
    affixes.push({ ...affix, id: `affix_inst_${generateId()}` });
  }

  const score = calcScore(attributes, affixes);

  let rarity: Rarity = 'common';
  if (score >= 10000) rarity = 'legendary';
  else if (score >= 7000) rarity = 'epic';
  else if (score >= 4000) rarity = 'rare';
  else if (score >= 2000) rarity = 'uncommon';

  return {
    id: `equip_${generateId()}`,
    ownerId: creatorId,
    creatorId,
    creatorName,
    recipeId: recipe.id,
    name: `${recipe.name}·${['炎狱', '星辰', '月影', '雷霆', '不朽', '永恒', '毁灭', '创世'][Math.floor(Math.random() * 8)]}`,
    rarity,
    quality,
    attributes,
    affixes,
    score,
    genre: recipe.genre,
    isListed: false,
    createdAt: new Date()
  };
};
