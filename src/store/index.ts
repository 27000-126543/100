import { create } from 'zustand';
import type { User, Workshop, Equipment, EnchantScroll, Material, MarketListing, Competition, Guild, Duel, RankingEntry, WeeklyReport, Announcement } from '../../shared/types.js';
import { api } from '../utils/api.js';
import { mockWorkshop, mockUser, mockEquipments, mockScrolls, mockMaterials, mockMarketListings, mockCompetition, mockGuild, mockDuels, mockRankings, mockWeeklyReport, mockAnnouncements } from '../../shared/mockData.js';

interface AppState {
  user: User | null;
  workshop: Workshop | null;
  equipments: Equipment[];
  scrolls: EnchantScroll[];
  materials: Material[];
  marketListings: MarketListing[];
  competition: Competition | null;
  guild: Guild | null;
  duels: Duel[];
  rankings: RankingEntry[];
  weeklyReport: WeeklyReport | null;
  announcements: Announcement[];
  loading: Record<string, boolean>;
  error: string | null;
  loadUser: () => Promise<void>;
  loadWorkshop: () => Promise<void>;
  loadInventory: () => Promise<void>;
  loadMarket: () => Promise<void>;
  loadCompetition: () => Promise<void>;
  loadGuild: () => Promise<void>;
  loadDuels: () => Promise<void>;
  loadRankings: (type?: string) => Promise<void>;
  loadWeeklyReport: () => Promise<void>;
  loadAnnouncements: () => Promise<void>;
  setLoading: (key: string, value: boolean) => void;
  setError: (error: string | null) => void;
  addGold: (amount: number) => Promise<void>;
  spendGold: (amount: number) => Promise<void>;
  updateWorkshop: (workshop: Workshop) => void;
  updateEquipment: (equipment: Equipment) => void;
  addEquipment: (equipment: Equipment) => void;
  refreshAll: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  workshop: null,
  equipments: [],
  scrolls: [],
  materials: [],
  marketListings: [],
  competition: null,
  guild: null,
  duels: [],
  rankings: [],
  weeklyReport: null,
  announcements: [],
  loading: {},
  error: null,

  setLoading: (key, value) => set(state => ({
    loading: { ...state.loading, [key]: value }
  })),

  setError: (error) => set({ error }),

  loadUser: async () => {
    set({ loading: { ...get().loading, user: true } });
    try {
      const data = await api.user.getMe() as User;
      set({ user: data });
    } catch (e) {
      console.error('Failed to load user:', e);
      set({ user: mockUser });
    } finally {
      set({ loading: { ...get().loading, user: false } });
    }
  },

  loadWorkshop: async () => {
    set({ loading: { ...get().loading, workshop: true } });
    try {
      const data = await api.workshop.getMy() as Workshop;
      set({ workshop: data });
    } catch (e) {
      console.error('Failed to load workshop:', e);
      set({ workshop: mockWorkshop });
    } finally {
      set({ loading: { ...get().loading, workshop: false } });
    }
  },

  loadInventory: async () => {
    set({ loading: { ...get().loading, inventory: true } });
    try {
      const data = await api.user.getInventory() as { equipments: Equipment[]; scrolls: EnchantScroll[]; materials: Material[] };
      set({
        equipments: data.equipments,
        scrolls: data.scrolls,
        materials: data.materials
      });
    } catch (e) {
      console.error('Failed to load inventory:', e);
      set({
        equipments: mockEquipments,
        scrolls: mockScrolls,
        materials: mockMaterials
      });
    } finally {
      set({ loading: { ...get().loading, inventory: false } });
    }
  },

  loadMarket: async () => {
    set({ loading: { ...get().loading, market: true } });
    try {
      const data = await api.market.getListings() as MarketListing[];
      set({ marketListings: data });
    } catch (e) {
      console.error('Failed to load market:', e);
      set({ marketListings: mockMarketListings });
    } finally {
      set({ loading: { ...get().loading, market: false } });
    }
  },

  loadCompetition: async () => {
    set({ loading: { ...get().loading, competition: true } });
    try {
      const data = await api.arena.getTodayCompetition() as Competition;
      set({ competition: data });
    } catch (e) {
      console.error('Failed to load competition:', e);
      set({ competition: mockCompetition });
    } finally {
      set({ loading: { ...get().loading, competition: false } });
    }
  },

  loadGuild: async () => {
    set({ loading: { ...get().loading, guild: true } });
    try {
      const data = await api.guild.getInfo() as Guild;
      set({ guild: data });
    } catch (e) {
      console.error('Failed to load guild:', e);
      set({ guild: mockGuild });
    } finally {
      set({ loading: { ...get().loading, guild: false } });
    }
  },

  loadDuels: async () => {
    set({ loading: { ...get().loading, duels: true } });
    try {
      const data = await api.guild.getDuels() as Duel[];
      set({ duels: data });
    } catch (e) {
      console.error('Failed to load duels:', e);
      set({ duels: mockDuels });
    } finally {
      set({ loading: { ...get().loading, duels: false } });
    }
  },

  loadRankings: async (type?: string) => {
    set({ loading: { ...get().loading, rankings: true } });
    try {
      const data = await api.ranking.getWeekly(type) as RankingEntry[];
      set({ rankings: data });
    } catch (e) {
      console.error('Failed to load rankings:', e);
      set({ rankings: mockRankings.byScore });
    } finally {
      set({ loading: { ...get().loading, rankings: false } });
    }
  },

  loadWeeklyReport: async () => {
    set({ loading: { ...get().loading, weeklyReport: true } });
    try {
      const data = await api.ranking.getWeeklyReport() as WeeklyReport;
      set({ weeklyReport: data });
    } catch (e) {
      console.error('Failed to load weekly report:', e);
      set({ weeklyReport: mockWeeklyReport });
    } finally {
      set({ loading: { ...get().loading, weeklyReport: false } });
    }
  },

  loadAnnouncements: async () => {
    set({ loading: { ...get().loading, announcements: true } });
    try {
      const data = await api.announcements.getAll() as Announcement[];
      set({ announcements: data });
    } catch (e) {
      console.error('Failed to load announcements:', e);
      set({ announcements: mockAnnouncements });
    } finally {
      set({ loading: { ...get().loading, announcements: false } });
    }
  },

  addGold: async (amount: number) => {
    try {
      const data = await api.user.addGold(amount) as User;
      set({ user: data });
    } catch (e) {
      console.error('Failed to add gold:', e);
      const user = get().user;
      if (user) {
        set({ user: { ...user, gold: user.gold + amount } });
      }
    }
  },

  spendGold: async (amount: number) => {
    try {
      const data = await api.user.spendGold(amount) as User;
      set({ user: data });
    } catch (e) {
      console.error('Failed to spend gold:', e);
      throw e;
    }
  },

  updateWorkshop: (workshop: Workshop) => {
    set({ workshop });
  },

  updateEquipment: (equipment: Equipment) => {
    set(state => ({
      equipments: state.equipments.map(e => e.id === equipment.id ? equipment : e)
    }));
  },

  addEquipment: (equipment: Equipment) => {
    set(state => ({
      equipments: [equipment, ...state.equipments]
    }));
  },

  refreshAll: async () => {
    await Promise.all([
      get().loadUser(),
      get().loadWorkshop(),
      get().loadInventory(),
      get().loadMarket(),
      get().loadCompetition(),
      get().loadGuild(),
      get().loadDuels(),
      get().loadRankings(),
      get().loadWeeklyReport(),
      get().loadAnnouncements(),
    ]);
  },
}));
