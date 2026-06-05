import express, { type Request, type Response } from 'express';
import { createResponse, createError, delay, generateId } from '../utils.js';
import { mockMarketListings, mockEquipments, mockScrolls, mockUser } from '../../shared/mockData.js';
import type { MarketListing, ListItemRequest, PriceSuggestionResponse, ItemType, Equipment, EnchantScroll } from '../../shared/types.js';

const router = express.Router();

let listings = [...mockMarketListings];
let userGold = mockUser.gold;

const calcSuggestedPrice = (item: Equipment | EnchantScroll): { min: number; max: number } => {
  const basePrice = 'score' in item ? item.score * 0.8 : item.level * 200;
  const rarityMult = item.rarity === 'legendary' ? 2.5 : item.rarity === 'epic' ? 1.8 : item.rarity === 'rare' ? 1.3 : item.rarity === 'uncommon' ? 1.1 : 1;
  const min = Math.floor(basePrice * rarityMult * 0.8);
  const max = Math.floor(basePrice * rarityMult * 1.2);
  return { min, max };
};

router.get('/list', async (req: Request, res: Response) => {
  await delay(300);
  const { itemType, genre, rarity, minPrice, maxPrice, page = 1, pageSize = 10 } = req.query;

  let filtered = listings.filter(l => l.isActive);

  if (itemType && itemType !== 'all') {
    filtered = filtered.filter(l => l.itemType === itemType);
  }

  if (genre && genre !== 'all') {
    filtered = filtered.filter(l => l.itemType === 'equipment' && (l.item as Equipment).genre === genre);
  }

  if (rarity && rarity !== 'all') {
    filtered = filtered.filter(l => l.item.rarity === rarity);
  }

  if (minPrice) {
    filtered = filtered.filter(l => l.price >= parseInt(minPrice as string));
  }

  if (maxPrice) {
    filtered = filtered.filter(l => l.price <= parseInt(maxPrice as string));
  }

  const total = filtered.length;
  const start = (parseInt(page as string) - 1) * parseInt(pageSize as string);
  const items = filtered.slice(start, start + parseInt(pageSize as string));

  res.json(createResponse({ items, total, page: parseInt(page as string), pageSize: parseInt(pageSize as string) }));
});

router.post('/list', async (req: Request, res: Response) => {
  await delay(500);
  const { itemId, itemType, price } = req.body as ListItemRequest;

  if (!itemId || !itemType || !price) {
    return res.json(createError('物品ID、类型和价格不能为空', 400));
  }

  if (price < 100) {
    return res.json(createError('价格不能低于100金币', 400));
  }

  let item: Equipment | EnchantScroll | undefined;
  if (itemType === 'equipment') {
    item = mockEquipments.find(e => e.id === itemId && !e.isListed);
  } else if (itemType === 'scroll') {
    item = mockScrolls.find(s => s.id === itemId && !s.isListed);
  }

  if (!item) {
    return res.json(createError('物品不存在或已上架', 404));
  }

  const { min, max } = calcSuggestedPrice(item);

  const newListing: MarketListing = {
    id: `listing_${generateId()}`,
    sellerId: 'user_001',
    sellerName: mockUser.username,
    itemType,
    item: { ...item, isListed: true },
    price,
    suggestedPriceMin: min,
    suggestedPriceMax: max,
    isActive: true,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  };

  listings.unshift(newListing);
  res.json(createResponse(newListing, '物品上架成功'));
});

router.post('/buy/:id', async (req: Request, res: Response) => {
  await delay(600);
  const { id } = req.params;

  const listing = listings.find(l => l.id === id && l.isActive);
  if (!listing) {
    return res.json(createError('商品不存在或已下架', 404));
  }

  if (listing.sellerId === 'user_001') {
    return res.json(createError('不能购买自己上架的商品', 400));
  }

  if (userGold < listing.price) {
    return res.json(createError('金币不足', 400));
  }

  userGold -= listing.price;
  listing.isActive = false;

  res.json(createResponse({ listing, remainingGold: userGold }, '购买成功'));
});

router.get('/price-suggestion', async (req: Request, res: Response) => {
  await delay(200);
  const { itemId, itemType } = req.query;

  if (!itemId || !itemType) {
    return res.json(createError('物品ID和类型不能为空', 400));
  }

  let item: Equipment | EnchantScroll | undefined;
  if (itemType === 'equipment') {
    item = mockEquipments.find(e => e.id === itemId);
  } else if (itemType === 'scroll') {
    item = mockScrolls.find(s => s.id === itemId);
  }

  if (!item) {
    return res.json(createError('物品不存在', 404));
  }

  const { min, max } = calcSuggestedPrice(item);
  const avgPrice = Math.floor((min + max) / 2);

  const priceHistory = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
    avgPrice: Math.floor(avgPrice * (0.9 + Math.random() * 0.2)),
    volume: Math.floor(Math.random() * 20) + 5,
  }));

  const response: PriceSuggestionResponse = {
    minPrice: min,
    maxPrice: max,
    avgPrice7d: avgPrice,
    priceHistory,
  };

  res.json(createResponse(response));
});

export default router;
