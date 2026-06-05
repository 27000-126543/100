import express, { type Request, type Response } from 'express';
import { createResponse, delay } from '../utils.js';
import { mockUser } from '../../shared/mockData.js';
import type { User } from '../../shared/types.js';

const router = express.Router();

let currentUser: User = { ...mockUser };

router.get('/me', async (req: Request, res: Response) => {
  await delay(200);
  res.json(createResponse(currentUser));
});

router.get('/materials', async (req: Request, res: Response) => {
  await delay(300);
  const { mockMaterials } = await import('../../shared/mockData.js');
  res.json(createResponse(mockMaterials));
});

router.get('/inventory', async (req: Request, res: Response) => {
  await delay(300);
  const { mockEquipments, mockScrolls, mockMaterials } = await import('../../shared/mockData.js');
  res.json(createResponse({
    equipments: mockEquipments,
    scrolls: mockScrolls,
    materials: mockMaterials
  }));
});

router.post('/gold/add', async (req: Request, res: Response) => {
  await delay(200);
  const { amount } = req.body;
  currentUser.gold += amount;
  res.json(createResponse(currentUser, `获得 ${amount} 金币`));
});

router.post('/gold/spend', async (req: Request, res: Response) => {
  await delay(200);
  const { amount } = req.body;
  if (currentUser.gold < amount) {
    return res.json({ code: 400, message: '金币不足', data: null, timestamp: Date.now() });
  }
  currentUser.gold -= amount;
  res.json(createResponse(currentUser, `消费 ${amount} 金币`));
});

export default router;
