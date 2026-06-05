import express, { type Request, type Response } from 'express';
import { createResponse, createError, delay, getUserId } from '../utils.js';
import {
  mockRecipes,
  mockEquipments,
  mockBuildings,
  mockMembers,
  mockUser,
  calculateSuccessRate,
  generateEquipment
} from '../../shared/mockData.js';
import type {
  Recipe,
  Equipment,
  CraftRequest,
  CraftResponse,
  CalculateSuccessRequest,
  CalculateSuccessResponse
} from '../../shared/types.js';

const router = express.Router();

let userEquipments = [...mockEquipments];

router.get('/recipes', async (req: Request, res: Response) => {
  await delay(300);
  const { genre, level, page = 1, pageSize = 10 } = req.query;

  let filtered: Recipe[] = [...mockRecipes];

  if (genre && genre !== 'all') {
    filtered = filtered.filter(r => r.genre === genre);
  }

  if (level) {
    const minLevel = parseInt(level as string);
    filtered = filtered.filter(r => r.level >= minLevel);
  }

  const total = filtered.length;
  const start = (parseInt(page as string) - 1) * parseInt(pageSize as string);
  const items = filtered.slice(start, start + parseInt(pageSize as string));

  res.json(createResponse({
    items,
    total,
    page: parseInt(page as string),
    pageSize: parseInt(pageSize as string)
  }));
});

router.get('/recipes/:id', async (req: Request, res: Response) => {
  await delay(200);
  const { id } = req.params;
  const recipe = mockRecipes.find(r => r.id === id);

  if (!recipe) {
    return res.json(createError('配方不存在', 404));
  }

  res.json(createResponse(recipe));
});

router.post('/calculate-success', async (req: Request, res: Response) => {
  await delay(200);
  const { recipeId, craftsmanId } = req.body as CalculateSuccessRequest;

  const recipe = mockRecipes.find(r => r.id === recipeId);
  if (!recipe) {
    return res.json(createError('配方不存在', 404));
  }

  const craftsman = mockMembers.find(m => m.id === craftsmanId);
  if (!craftsman) {
    return res.json(createError('工匠不存在', 404));
  }

  const buildingType = recipe.genre === 'jeweler' ? 'enchanting_table' : 'furnace';
  const building = mockBuildings.find(b => b.type === buildingType)!;

  const successRate = calculateSuccessRate(
    recipe.baseSuccessRate,
    craftsman.skillLevel,
    building.level,
    recipe.level
  );

  const response: CalculateSuccessResponse = {
    successRate,
    attributeRanges: recipe.baseAttributes,
    possibleAffixes: recipe.possibleAffixes
  };

  res.json(createResponse(response));
});

router.post('/craft', async (req: Request, res: Response) => {
  await delay(800);
  const { recipeId, craftsmanId } = req.body as CraftRequest;

  const recipe = mockRecipes.find(r => r.id === recipeId);
  if (!recipe) {
    return res.json(createError('配方不存在', 404));
  }

  const craftsman = mockMembers.find(m => m.id === craftsmanId);
  if (!craftsman) {
    return res.json(createError('工匠不存在', 404));
  }

  const buildingType = recipe.genre === 'jeweler' ? 'enchanting_table' : 'furnace';
  const building = mockBuildings.find(b => b.type === buildingType)!;

  const userId = getUserId(req as { headers?: Record<string, string> });
  const equipment = generateEquipment(recipe, craftsman, building, userId, mockUser.username);

  let response: CraftResponse;

  if (equipment) {
    userEquipments.unshift(equipment);
    response = {
      success: true,
      equipment,
      message: `制造成功！获得【${equipment.name}】`
    };
  } else {
    const returnedMaterials = recipe.materials.map(m => ({
      ...m,
      amount: Math.floor(m.amount * 0.5)
    }));
    response = {
      success: false,
      returnedMaterials,
      message: '制造失败！返还了50%的材料'
    };
  }

  res.json(createResponse(response));
});

router.get('/equipments', async (req: Request, res: Response) => {
  await delay(300);
  res.json(createResponse(userEquipments));
});

export default router;
