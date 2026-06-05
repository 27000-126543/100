export type Genre = 'blacksmith' | 'tailor' | 'jeweler';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type Position = 'master' | 'journeyman' | 'apprentice' | 'steward';
export type BuildingType = 'furnace' | 'enchanting_table' | 'warehouse';
export type GuildBuildingType = 'union_furnace' | 'master_enchanting_table';
export type DuelStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'in_progress';
export type Trend = 'up' | 'down' | 'stable';
export type RankingType = 'score' | 'craft_count' | 'enchant_count';
export type ItemType = 'equipment' | 'scroll';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserStats {
  todayCrafts: number;
  todayEnchants: number;
  weeklyIncome: number;
  totalCrafts: number;
  totalEnchants: number;
  rank: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  gold: number;
  luck: number;
  createdAt: Date;
  stats: UserStats;
}

export interface MaterialRequirement {
  materialId: string;
  materialName: string;
  amount: number;
}

export interface AttributeRange {
  attribute: string;
  attributeName: string;
  min: number;
  max: number;
}

export interface Building {
  id: string;
  type: BuildingType;
  level: number;
  upgradeProgress: number;
  pendingUpgrade: boolean;
}

export interface WorkshopMember {
  id: string;
  name: string;
  position: Position;
  skillLevel: number;
  luck: number;
  avatar: string;
}

export interface Workshop {
  id: string;
  name: string;
  signboard: string;
  genre: Genre;
  level: number;
  reputation: number;
  ownerId: string;
  ownerName: string;
  buildings: Building[];
  members: WorkshopMember[];
  materials: Material[];
  createdAt: Date;
}

export interface CreateWorkshopRequest {
  name: string;
  signboard: string;
  genre: Genre;
}

export interface UpgradeBuildingRequest {
  buildingType: BuildingType;
}

export interface ApproveUpgradeRequest {
  buildingType: BuildingType;
}

export interface Affix {
  id: string;
  name: string;
  description: string;
  effect: Record<string, number>;
  rarity: Rarity;
}

export interface Recipe {
  id: string;
  name: string;
  genre: Genre;
  level: number;
  materials: MaterialRequirement[];
  baseSuccessRate: number;
  baseAttributes: AttributeRange[];
  possibleAffixes: string[];
  description: string;
}

export interface Equipment {
  id: string;
  ownerId: string;
  creatorId: string;
  creatorName: string;
  recipeId: string;
  name: string;
  rarity: Rarity;
  quality: number;
  attributes: Record<string, number>;
  affixes: Affix[];
  score: number;
  genre: Genre;
  isListed: boolean;
  createdAt: Date;
}

export interface EnchantScroll {
  id: string;
  ownerId: string;
  name: string;
  level: number;
  possibleAffixes: string[];
  successRateBonus: number;
  isListed: boolean;
  rarity: Rarity;
  createdAt: Date;
}

export interface CraftRequest {
  recipeId: string;
  craftsmanId: string;
}

export interface CraftResponse {
  success: boolean;
  equipment?: Equipment;
  returnedMaterials?: MaterialRequirement[];
  message: string;
}

export interface CalculateSuccessRequest {
  recipeId: string;
  craftsmanId: string;
}

export interface CalculateSuccessResponse {
  successRate: number;
  attributeRanges: AttributeRange[];
  possibleAffixes: string[];
}

export interface EnchantRequest {
  equipmentId: string;
  scrollId: string;
}

export interface EnchantResponse {
  success: boolean;
  equipment: Equipment;
  addedAffix?: Affix;
  replacedAffix?: Affix;
  message: string;
}

export interface CalculateEnchantRequest {
  equipmentId: string;
  scrollId: string;
}

export interface CalculateEnchantResponse {
  successRate: number;
  possibleAffixes: Affix[];
  replaceChance: number;
}

export interface MarketListing {
  id: string;
  sellerId: string;
  sellerName: string;
  itemType: ItemType;
  item: Equipment | EnchantScroll;
  price: number;
  suggestedPriceMin: number;
  suggestedPriceMax: number;
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export interface PriceHistory {
  date: Date;
  avgPrice: number;
  volume: number;
}

export interface ListItemRequest {
  itemId: string;
  itemType: ItemType;
  price: number;
}

export interface PriceSuggestionResponse {
  minPrice: number;
  maxPrice: number;
  avgPrice7d: number;
  priceHistory: PriceHistory[];
}

export interface Competition {
  id: string;
  seasonId: string;
  theme: string;
  requiredGenre: Genre | 'all';
  startTime: Date;
  endTime: Date;
  entries: CompetitionEntry[];
}

export interface CompetitionEntry {
  id: string;
  competitionId: string;
  playerId: string;
  playerName: string;
  equipment: Equipment;
  score: number;
  rank: number;
}

export interface Season {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  rewards: SeasonReward[];
  isActive: boolean;
}

export interface SeasonReward {
  rank: number;
  itemName: string;
  itemType: 'enchant_recipe' | 'material' | 'scroll';
  quantity: number;
}

export interface SubmitEntryRequest {
  equipmentId: string;
}

export interface GuildMember {
  id: string;
  guildId: string;
  playerId: string;
  playerName: string;
  role: 'president' | 'vice_president' | 'member';
  contribution: number;
  joinedAt: Date;
}

export interface GuildBuilding {
  id: string;
  type: GuildBuildingType;
  level: number;
  upgradeProgress: number;
  requiredMaterials: MaterialRequirement[];
  requiredGold: number;
  currentMaterials: MaterialRequirement[];
  currentGold: number;
}

export interface Guild {
  id: string;
  name: string;
  level: number;
  reputation: number;
  presidentId: string;
  presidentName: string;
  vicePresidentIds: string[];
  members: GuildMember[];
  buildings: GuildBuilding[];
  createdAt: Date;
}

export interface CreateGuildRequest {
  name: string;
}

export interface ContributeRequest {
  materials: MaterialRequirement[];
  gold: number;
}

export interface DuelRepresentative {
  id: string;
  duelId: string;
  guildId: string;
  playerId: string;
  playerName: string;
}

export interface DuelScore {
  id: string;
  duelId: string;
  playerId: string;
  quality: number;
  speed: number;
  affixCount: number;
  total: number;
}

export interface Duel {
  id: string;
  challengerGuildId: string;
  challengerGuildName: string;
  challengedGuildId: string;
  challengedGuildName: string;
  status: DuelStatus;
  themeEquipment: string;
  representatives: DuelRepresentative[];
  startTime?: Date;
  endTime?: Date;
  winnerId?: string;
  winnerName?: string;
  scores: DuelScore[];
  createdAt: Date;
}

export interface ChallengeRequest {
  targetGuildId: string;
  themeEquipment: string;
  representativeIds: string[];
}

export interface RespondDuelRequest {
  accept: boolean;
  representativeIds?: string[];
}

export interface RankingEntry {
  id: string;
  rank: number;
  playerId: string;
  playerName: string;
  workshopName: string;
  value: number;
  score: number;
  craftCount: number;
  enchantCount: number;
  trend: Trend;
}

export interface Ranking {
  id: string;
  rank: number;
  playerId: string;
  playerName: string;
  workshopName: string;
  score: number;
  craftCount: number;
  enchantCount: number;
  trend: Trend;
}

export interface WeeklyReport {
  weekStart: Date;
  weekEnd: Date;
  topEquipment: Equipment;
  attributeDistribution: Record<string, number[]>;
  craftingTrend: { date: Date; count: number }[];
  byScore: RankingEntry[];
  byCraftCount: RankingEntry[];
  byEnchantCount: RankingEntry[];
  rankings: {
    byScore: RankingEntry[];
    byCraftCount: RankingEntry[];
    byEnchantCount: RankingEntry[];
  };
}

export interface Material {
  id: string;
  ownerId: string;
  name: string;
  quantity: number;
  rarity: Rarity;
  description: string;
  icon: string;
}

export interface Announcement {
  id: string;
  type: 'transaction' | 'competition' | 'duel' | 'system';
  content: string;
  data?: Record<string, unknown>;
  createdAt: Date;
}

export interface GenreInfo {
  id: Genre;
  name: string;
  description: string;
  color: string;
  bg: string;
  icon: string;
}

export const GENRE_INFO: Record<Genre, GenreInfo> = {
  blacksmith: {
    id: 'blacksmith',
    name: '铁匠',
    description: '打造坚固的武器和护甲，擅长力量型装备',
    color: 'text-forge-500',
    bg: 'bg-forge-500/20',
    icon: '⚒️'
  },
  tailor: {
    id: 'tailor',
    name: '裁缝',
    description: '缝制轻盈的法袍和布甲，擅长敏捷型装备',
    color: 'text-tailor-500',
    bg: 'bg-tailor-500/20',
    icon: '🧵'
  },
  jeweler: {
    id: 'jeweler',
    name: '珠宝',
    description: '镶嵌神秘的首饰和饰品，擅长智力型装备',
    color: 'text-jewel-500',
    bg: 'bg-jewel-500/20',
    icon: '💎'
  }
};

export const RARITY_INFO: Record<Rarity, { name: string; color: string; bg: string; bgColor: string; border: string }> = {
  common: { name: '普通', color: 'text-rarity-common', bg: 'bg-rarity-common/20', bgColor: 'bg-rarity-common/20', border: 'border-rarity-common' },
  uncommon: { name: '优秀', color: 'text-rarity-uncommon', bg: 'bg-rarity-uncommon/20', bgColor: 'bg-rarity-uncommon/20', border: 'border-rarity-uncommon' },
  rare: { name: '稀有', color: 'text-rarity-rare', bg: 'bg-rarity-rare/20', bgColor: 'bg-rarity-rare/20', border: 'border-rarity-rare' },
  epic: { name: '史诗', color: 'text-rarity-epic', bg: 'bg-rarity-epic/20', bgColor: 'bg-rarity-epic/20', border: 'border-rarity-epic' },
  legendary: { name: '传说', color: 'text-rarity-legendary', bg: 'bg-rarity-legendary/20', bgColor: 'bg-rarity-legendary/20', border: 'border-rarity-legendary' }
};

export const POSITION_INFO: Record<Position, { name: string; description: string }> = {
  master: { name: '工匠大师', description: '最高等级工匠，制造成功率最高' },
  journeyman: { name: '熟练工匠', description: '经验丰富的工匠，稳定的制造质量' },
  apprentice: { name: '学徒', description: '正在学习中的工匠，潜力巨大' },
  steward: { name: '管事', description: '管理工坊日常，提升整体效率' }
};

export const BUILDING_INFO: Record<BuildingType, { name: string; description: string; icon: string }> = {
  furnace: { name: '熔炉', description: '提升制造成功率和最高品质', icon: '🔥' },
  enchanting_table: { name: '附魔台', description: '提升附魔成功率和词缀品质', icon: '✨' },
  warehouse: { name: '材料仓库', description: '增加材料存储上限', icon: '📦' }
};

export const GUILD_BUILDING_INFO: Record<GuildBuildingType, { name: string; description: string; icon: string }> = {
  union_furnace: { name: '联合熔炉', description: '全体公会成员共享制造加成', icon: '🏭' },
  master_enchanting_table: { name: '大师附魔台', description: '全体公会成员共享附魔加成', icon: '🔮' }
};

export const AFFIX_POOL: Affix[] = [
  { id: 'affix_1', name: '吸血', description: '攻击时吸取生命', effect: { lifeSteal: 5 }, rarity: 'rare' },
  { id: 'affix_2', name: '暴击', description: '增加暴击概率', effect: { critChance: 10 }, rarity: 'rare' },
  { id: 'affix_3', name: '重击', description: '增加暴击伤害', effect: { critDamage: 20 }, rarity: 'epic' },
  { id: 'affix_4', name: '迅捷', description: '增加攻击速度', effect: { attackSpeed: 8 }, rarity: 'uncommon' },
  { id: 'affix_5', name: '坚固', description: '增加防御力', effect: { defense: 15 }, rarity: 'common' },
  { id: 'affix_6', name: '锐利', description: '增加攻击力', effect: { attack: 12 }, rarity: 'common' },
  { id: 'affix_7', name: '智慧', description: '增加智力', effect: { intelligence: 10 }, rarity: 'uncommon' },
  { id: 'affix_8', name: '力量', description: '增加力量', effect: { strength: 10 }, rarity: 'uncommon' },
  { id: 'affix_9', name: '敏捷', description: '增加敏捷', effect: { agility: 10 }, rarity: 'uncommon' },
  { id: 'affix_10', name: '耐力', description: '增加生命值', effect: { health: 50 }, rarity: 'common' },
  { id: 'affix_11', name: '魔法回复', description: '增加魔法回复速度', effect: { manaRegen: 3 }, rarity: 'rare' },
  { id: 'affix_12', name: '生命回复', description: '增加生命回复速度', effect: { healthRegen: 2 }, rarity: 'rare' },
  { id: 'affix_13', name: '破甲', description: '无视部分防御', effect: { armorPenetration: 8 }, rarity: 'epic' },
  { id: 'affix_14', name: '格挡', description: '增加格挡概率', effect: { blockChance: 10 }, rarity: 'uncommon' },
  { id: 'affix_15', name: '闪避', description: '增加闪避概率', effect: { dodgeChance: 8 }, rarity: 'uncommon' },
  { id: 'affix_16', name: '毁灭', description: '大幅增加伤害', effect: { damage: 25 }, rarity: 'legendary' },
  { id: 'affix_17', name: '不朽', description: '死亡时有概率复活', effect: { reviveChance: 5 }, rarity: 'legendary' },
  { id: 'affix_18', name: '荆棘', description: '反弹部分伤害', effect: { thorns: 15 }, rarity: 'epic' },
  { id: 'affix_19', name: '元素精通', description: '增加元素伤害', effect: { elementDamage: 12 }, rarity: 'rare' },
  { id: 'affix_20', name: '诅咒抵抗', description: '抵抗负面效果', effect: { curseResist: 20 }, rarity: 'rare' }
];
