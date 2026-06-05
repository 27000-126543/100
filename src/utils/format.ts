import type { Rarity, Genre, Position, BuildingType } from '../../shared/types.js';
import { GENRE_INFO, RARITY_INFO, POSITION_INFO, BUILDING_INFO } from '../../shared/types.js';

export const formatNumber = (num: number, decimals = 0): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(decimals) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(decimals) + 'K';
  return num.toString();
};

export const formatGold = (amount: number): string => {
  return `${formatNumber(amount)} 金币`;
};

export const getRarityColor = (rarity: Rarity): string => {
  return RARITY_INFO[rarity]?.color || 'text-gray-400';
};

export const getRarityBg = (rarity: Rarity): string => {
  return RARITY_INFO[rarity]?.bg || 'bg-gray-800';
};

export const getRarityBorder = (rarity: Rarity): string => {
  return RARITY_INFO[rarity]?.border || 'border-gray-600';
};

export const getRarityName = (rarity: Rarity): string => {
  return RARITY_INFO[rarity]?.name || '普通';
};

export const getGenreName = (genre: Genre): string => {
  return GENRE_INFO[genre]?.name || '未知';
};

export const getGenreIcon = (genre: Genre): string => {
  return GENRE_INFO[genre]?.icon || '❓';
};

export const getGenreColor = (genre: Genre): string => {
  return GENRE_INFO[genre]?.color || 'text-gray-400';
};

export const getGenreBg = (genre: Genre): string => {
  return GENRE_INFO[genre]?.bg || 'bg-gray-800';
};

export const getPositionName = (position: Position): string => {
  return POSITION_INFO[position]?.name || '成员';
};

export const getBuildingName = (type: BuildingType): string => {
  return BUILDING_INFO[type]?.name || '未知';
};

export const getBuildingIcon = (type: BuildingType): string => {
  return BUILDING_INFO[type]?.icon || '🏗️';
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;
  
  return d.toLocaleDateString('zh-CN');
};

export const formatQuality = (quality: number): string => {
  if (quality >= 90) return '传说';
  if (quality >= 80) return '史诗';
  if (quality >= 70) return '稀有';
  if (quality >= 60) return '优秀';
  return '普通';
};

export const getQualityColor = (quality: number): string => {
  if (quality >= 90) return 'text-rarity-legendary';
  if (quality >= 80) return 'text-rarity-epic';
  if (quality >= 70) return 'text-rarity-rare';
  if (quality >= 60) return 'text-rarity-uncommon';
  return 'text-rarity-common';
};

export const getQualityBg = (quality: number): string => {
  if (quality >= 90) return 'bg-rarity-legendary/20';
  if (quality >= 80) return 'bg-rarity-epic/20';
  if (quality >= 70) return 'bg-rarity-rare/20';
  if (quality >= 60) return 'bg-rarity-uncommon/20';
  return 'bg-rarity-common/20';
};
