import type { ApiResponse } from '../../shared/types.js';

const API_BASE = '/api';

export const request = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const result = await response.json() as ApiResponse<T>;

  if (!result.success && result.code >= 400) {
    throw new Error(result.message || '请求失败');
  }

  return result.data as T;
};

export const api = {
  workshop: {
    getMy: () => request('/workshop/my'),
    getAll: (params?: Record<string, string | number>) => {
      const query = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
      return request(`/workshop/all${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => request(`/workshop/${id}`),
    create: (data: { name: string; signboard?: string; genre: string }) => 
      request('/workshop/create', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: { name?: string; signboard?: string }) =>
      request(`/workshop/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    upgradeBuilding: (buildingType: string) =>
      request('/workshop/building/upgrade', { method: 'POST', body: JSON.stringify({ buildingType }) }),
    approveUpgrade: (buildingType: string) =>
      request('/workshop/building/approve', { method: 'POST', body: JSON.stringify({ buildingType }) }),
    addMember: (data: { name: string; position: string; skillLevel?: number; luck?: number }) =>
      request('/workshop/member/add', { method: 'POST', body: JSON.stringify(data) }),
    updateMember: (id: string, data: { position: string }) =>
      request(`/workshop/member/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    removeMember: (id: string) =>
      request(`/workshop/member/${id}`, { method: 'DELETE' }),
  },
  crafting: {
    getRecipes: (params?: Record<string, string | number>) => {
      const query = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
      return request(`/crafting/recipes${query ? `?${query}` : ''}`);
    },
    getRecipe: (id: string) => request(`/crafting/recipes/${id}`),
    calculateSuccess: (data: { recipeId: string; craftsmanId: string }) =>
      request('/crafting/calculate-success', { method: 'POST', body: JSON.stringify(data) }),
    craft: (data: { recipeId: string; craftsmanId: string }) =>
      request('/crafting/craft', { method: 'POST', body: JSON.stringify(data) }),
    getEquipments: () => request('/crafting/equipments'),
  },
  enchanting: {
    getScrolls: () => request('/enchanting/scrolls'),
    calculate: (data: { equipmentId: string; scrollId: string }) =>
      request('/enchanting/calculate', { method: 'POST', body: JSON.stringify(data) }),
    execute: (data: { equipmentId: string; scrollId: string }) =>
      request('/enchanting/execute', { method: 'POST', body: JSON.stringify(data) }),
  },
  market: {
    getListings: (params?: Record<string, string | number>) => {
      const query = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
      return request(`/market/list${query ? `?${query}` : ''}`);
    },
    listItem: (data: { itemId: string; itemType: 'equipment' | 'scroll'; price: number }) =>
      request('/market/list', { method: 'POST', body: JSON.stringify(data) }),
    buyItem: (id: string) =>
      request(`/market/buy/${id}`, { method: 'POST' }),
    getPriceSuggestion: (params: { itemId: string; itemType: 'equipment' | 'scroll' }) => {
      const query = new URLSearchParams(params).toString();
      return request(`/market/price-suggestion?${query}`);
    },
  },
  arena: {
    getTodayCompetition: () => request('/arena/competition/today'),
    getCompetition: (id: string) => request(`/arena/competition/${id}`),
    submitEntry: (data: { competitionId: string; equipmentId: string }) =>
      request('/arena/competition/submit', { method: 'POST', body: JSON.stringify(data) }),
    getRankings: (type?: string) => request(`/arena/rankings${type ? `?type=${type}` : ''}`),
    getSeason: () => request('/arena/season'),
    getSeasonRewards: () => request('/arena/season/rewards'),
  },
  guild: {
    getInfo: () => request('/guild'),
    create: (data: { name: string; description: string }) =>
      request('/guild/create', { method: 'POST', body: JSON.stringify(data) }),
    contribute: (data: { type: 'gold' | 'material'; amount: number; materialType?: string }) =>
      request('/guild/contribute', { method: 'POST', body: JSON.stringify(data) }),
    upgradeBuilding: (data: { buildingType: string; gold: number; materials: Record<string, number> }) =>
      request('/guild/upgrade-building', { method: 'POST', body: JSON.stringify(data) }),
    challenge: (data: { targetGuildId: string; themeEquipment: string; representativeIds: string[] }) =>
      request('/guild/challenge', { method: 'POST', body: JSON.stringify(data) }),
    respondDuel: (duelId: string, accept: boolean) =>
      request(`/guild/respond/${duelId}`, { method: 'POST', body: JSON.stringify({ accept }) }),
    getDuels: (status?: string) => request(`/guild/duels${status ? `?status=${status}` : ''}`),
    getDuel: (id: string) => request(`/guild/duels/${id}`),
  },
  ranking: {
    getWeekly: (type?: string) => request(`/ranking/weekly${type ? `?type=${type}` : ''}`),
    getWeeklyReport: () => request('/ranking/weekly-report'),
  },
  user: {
    getMe: () => request('/user/me'),
    getMaterials: () => request('/user/materials'),
    getInventory: () => request('/user/inventory'),
    addGold: (amount: number) =>
      request('/user/gold/add', { method: 'POST', body: JSON.stringify({ amount }) }),
    spendGold: (amount: number) =>
      request('/user/gold/spend', { method: 'POST', body: JSON.stringify({ amount }) }),
  },
  announcements: {
    getAll: (params?: { type?: string; limit?: number }) => {
      const query = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
      return request(`/announcements${query ? `?${query}` : ''}`);
    },
    create: (data: { type: string; content: string; data?: unknown }) =>
      request('/announcements', { method: 'POST', body: JSON.stringify(data) }),
  },
};
