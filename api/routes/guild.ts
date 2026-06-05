import express, { type Request, type Response } from 'express';
import { createResponse, createError, delay, generateId, getUserId } from '../utils.js';
import { mockGuild, mockDuels, mockUser } from '../../shared/mockData.js';
import type { Guild, Duel, CreateGuildRequest, ContributeRequest, ChallengeRequest, RespondDuelRequest } from '../../shared/types.js';

const router = express.Router();

let currentGuild: Guild | null = mockGuild;
let duels: Duel[] = [...mockDuels];

router.get('/', async (req: Request, res: Response) => {
  await delay(300);
  if (!currentGuild) return res.json(createError('您尚未加入任何公会', 404));
  res.json(createResponse(currentGuild));
});

router.post('/create', async (req: Request, res: Response) => {
  await delay(500);
  const { name } = req.body as CreateGuildRequest;
  if (!name || name.trim().length < 2) return res.json(createError('公会名称至少需要2个字符', 400));
  if (currentGuild) return res.json(createError('您已属于一个公会，无法创建新公会', 400));

  const userId = getUserId(req as { headers?: Record<string, string> });
  currentGuild = {
    id: `guild_${generateId()}`,
    name: name.trim(),
    level: 1,
    reputation: 0,
    presidentId: userId,
    presidentName: mockUser.username,
    vicePresidentIds: [],
    members: [{
      id: `gm_${generateId()}`,
      guildId: '',
      playerId: userId,
      playerName: mockUser.username,
      role: 'president',
      contribution: 0,
      joinedAt: new Date()
    }],
    buildings: [],
    createdAt: new Date()
  };
  currentGuild.members[0].guildId = currentGuild.id;
  res.json(createResponse(currentGuild, '公会创建成功！'));
});

router.post('/contribute', async (req: Request, res: Response) => {
  await delay(400);
  const { materials, gold } = req.body as ContributeRequest;
  if (!currentGuild) return res.json(createError('您尚未加入任何公会', 404));

  const userId = getUserId(req as { headers?: Record<string, string> });
  const member = currentGuild.members.find(m => m.playerId === userId);
  if (!member) return res.json(createError('您不是公会成员', 403));

  const contribution = (gold || 0) + (materials?.reduce((sum, m) => sum + m.amount * 10, 0) || 0);
  member.contribution += contribution;
  currentGuild.reputation += Math.floor(contribution / 10);
  if (gold && currentGuild.buildings.length > 0) currentGuild.buildings[0].currentGold += gold;

  res.json(createResponse({
    contribution,
    totalContribution: member.contribution,
    guildReputation: currentGuild.reputation
  }, '贡献成功！'));
});

router.post('/upgrade-building', async (req: Request, res: Response) => {
  await delay(500);
  const { buildingType } = req.body as { buildingType: string };
  if (!currentGuild) return res.json(createError('您尚未加入任何公会', 404));

  const building = currentGuild.buildings.find(b => b.type === buildingType);
  if (!building) return res.json(createError('建筑不存在', 404));

  if (building.upgradeProgress >= 100) {
    building.level += 1;
    building.upgradeProgress = 0;
    res.json(createResponse(building, `建筑升级成功！当前等级：${building.level}`));
  } else {
    building.upgradeProgress = Math.min(100, building.upgradeProgress + 25);
    res.json(createResponse(building, `升级进度：${building.upgradeProgress}%`));
  }
});

router.post('/challenge', async (req: Request, res: Response) => {
  await delay(400);
  const { targetGuildId, themeEquipment, representativeIds } = req.body as ChallengeRequest;
  if (!currentGuild) return res.json(createError('您尚未加入任何公会', 404));
  if (!targetGuildId || !themeEquipment || !representativeIds?.length) return res.json(createError('请填写完整的对决信息', 400));

  const newDuel: Duel = {
    id: `duel_${generateId()}`,
    challengerGuildId: currentGuild.id,
    challengerGuildName: currentGuild.name,
    challengedGuildId: targetGuildId,
    challengedGuildName: '🔥 烈焰兄弟会 🔥',
    status: 'pending',
    themeEquipment,
    representatives: representativeIds.map((pid, i) => ({
      id: `dr_${generateId()}`,
      duelId: '',
      guildId: currentGuild!.id,
      playerId: pid,
      playerName: currentGuild!.members[i]?.playerName || '代表' + (i + 1)
    })),
    scores: [],
    createdAt: new Date()
  };
  newDuel.representatives.forEach(r => r.duelId = newDuel.id);
  duels.unshift(newDuel);
  res.json(createResponse(newDuel, '对决已发起，等待对方响应！'));
});

router.post('/respond/:duelId', async (req: Request, res: Response) => {
  await delay(300);
  const { duelId } = req.params;
  const { accept, representativeIds } = req.body as RespondDuelRequest;

  const duel = duels.find(d => d.id === duelId);
  if (!duel) return res.json(createError('对决不存在', 404));
  if (duel.status !== 'pending') return res.json(createError('对决已处理', 400));

  if (accept) {
    const reps = representativeIds?.map((pid, i) => ({
      id: `dr_${generateId()}`,
      duelId: duel.id,
      guildId: currentGuild?.id || '',
      playerId: pid,
      playerName: currentGuild?.members[i]?.playerName || '代表' + (i + 1)
    })) || [];
    duel.representatives.push(...reps);
    duel.status = 'accepted';
    duel.startTime = new Date();
    duel.endTime = new Date(Date.now() + 3600000);
    res.json(createResponse(duel, '已接受对决！'));
  } else {
    duel.status = 'rejected';
    res.json(createResponse(duel, '已拒绝对决'));
  }
});

router.get('/duels', async (req: Request, res: Response) => {
  await delay(300);
  const { status } = req.query;
  let filtered = [...duels];
  if (status && status !== 'all') filtered = filtered.filter(d => d.status === status);
  res.json(createResponse(filtered));
});

router.get('/duels/:id', async (req: Request, res: Response) => {
  await delay(200);
  const { id } = req.params;
  const duel = duels.find(d => d.id === id);
  if (!duel) return res.json(createError('对决不存在', 404));
  res.json(createResponse(duel));
});

export default router;
