import express, { type Request, type Response } from 'express';
import { createResponse, createError, delay } from '../utils.js';
import { mockWorkshop, mockAllWorkshops, mockBuildings, mockMembers } from '../../shared/mockData.js';
import type { Workshop, CreateWorkshopRequest, UpgradeBuildingRequest, ApproveUpgradeRequest } from '../../shared/types.js';

const router = express.Router();

let currentWorkshop = { ...mockWorkshop };

router.get('/my', async (req: Request, res: Response) => {
  await delay(300);
  res.json(createResponse(currentWorkshop));
});

router.get('/all', async (req: Request, res: Response) => {
  await delay(400);
  const { genre, level, page = 1, pageSize = 10 } = req.query;
  
  let filtered = [...mockAllWorkshops];
  
  if (genre && genre !== 'all') {
    filtered = filtered.filter(w => w.genre === genre);
  }
  
  if (level) {
    const minLevel = parseInt(level as string);
    filtered = filtered.filter(w => w.level >= minLevel);
  }
  
  const total = filtered.length;
  const start = (parseInt(page as string) - 1) * parseInt(pageSize as string);
  const items = filtered.slice(start, start + parseInt(pageSize as string));
  
  res.json(createResponse({ items, total, page: parseInt(page as string), pageSize: parseInt(pageSize as string) }));
});

router.get('/:id', async (req: Request, res: Response) => {
  await delay(300);
  const { id } = req.params;
  const workshop = mockAllWorkshops.find(w => w.id === id);
  
  if (!workshop) {
    return res.json(createError('工坊不存在', 404));
  }
  
  res.json(createResponse(workshop));
});

router.post('/create', async (req: Request, res: Response) => {
  await delay(500);
  const { name, signboard, genre } = req.body as CreateWorkshopRequest;
  
  if (!name || !genre) {
    return res.json(createError('工坊名称和流派不能为空', 400));
  }
  
  const newWorkshop: Workshop = {
    ...currentWorkshop,
    name,
    signboard: signboard || '',
    genre,
    buildings: mockBuildings,
    members: mockMembers,
  };
  
  currentWorkshop = newWorkshop;
  res.json(createResponse(newWorkshop, '工坊创建成功'));
});

router.put('/:id', async (req: Request, res: Response) => {
  await delay(400);
  const { name, signboard } = req.body;
  
  if (name) currentWorkshop.name = name;
  if (signboard !== undefined) currentWorkshop.signboard = signboard;
  
  res.json(createResponse(currentWorkshop, '工坊信息更新成功'));
});

router.post('/building/upgrade', async (req: Request, res: Response) => {
  await delay(500);
  const { buildingType } = req.body as UpgradeBuildingRequest;
  
  const building = currentWorkshop.buildings.find(b => b.type === buildingType);
  if (!building) {
    return res.json(createError('建筑不存在', 404));
  }
  
  if (building.pendingUpgrade) {
    return res.json(createError('该建筑已有待批准的升级申请', 400));
  }
  
  building.pendingUpgrade = true;
  building.upgradeProgress = 0;
  
  res.json(createResponse(currentWorkshop, '升级申请已提交，等待工坊主批准'));
});

router.post('/building/approve', async (req: Request, res: Response) => {
  await delay(600);
  const { buildingType } = req.body as ApproveUpgradeRequest;
  
  const building = currentWorkshop.buildings.find(b => b.type === buildingType);
  if (!building) {
    return res.json(createError('建筑不存在', 404));
  }
  
  if (!building.pendingUpgrade) {
    return res.json(createError('该建筑没有待批准的升级申请', 400));
  }
  
  building.level += 1;
  building.pendingUpgrade = false;
  building.upgradeProgress = 100;
  
  res.json(createResponse(currentWorkshop, `建筑升级成功！当前等级：${building.level}`));
});

router.post('/member/add', async (req: Request, res: Response) => {
  await delay(400);
  const { name, position, skillLevel, luck } = req.body;
  
  const newMember = {
    id: `member_${Date.now()}`,
    name,
    position,
    skillLevel: skillLevel || 30,
    luck: luck || 10,
    avatar: ['👨', '👩', '🧔', '👴', '🧙', '👨‍🦰', '👩‍🦰'][Math.floor(Math.random() * 7)]
  };
  
  currentWorkshop.members.push(newMember);
  res.json(createResponse(currentWorkshop, '成员招募成功'));
});

router.put('/member/:id', async (req: Request, res: Response) => {
  await delay(300);
  const { id } = req.params;
  const { position } = req.body;
  
  const member = currentWorkshop.members.find(m => m.id === id);
  if (!member) {
    return res.json(createError('成员不存在', 404));
  }
  
  member.position = position;
  res.json(createResponse(currentWorkshop, '成员职位调整成功'));
});

router.delete('/member/:id', async (req: Request, res: Response) => {
  await delay(300);
  const { id } = req.params;
  
  const index = currentWorkshop.members.findIndex(m => m.id === id);
  if (index === -1) {
    return res.json(createError('成员不存在', 404));
  }
  
  currentWorkshop.members.splice(index, 1);
  res.json(createResponse(currentWorkshop, '成员已解雇'));
});

export default router;
