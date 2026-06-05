import express, { type Request, type Response } from 'express';
import { createResponse, createError, delay, generateId } from '../utils.js';
import { mockCompetition, mockSeason, mockEquipments, mockRankings, mockUser } from '../../shared/mockData.js';
import type { Competition, Season, RankingEntry, CompetitionEntry, SubmitEntryRequest, RankingType } from '../../shared/types.js';

const router = express.Router();

let currentCompetition = { ...mockCompetition };

router.get('/competition/today', async (req: Request, res: Response) => {
  await delay(300);
  res.json(createResponse(currentCompetition));
});

router.get('/competition/:id', async (req: Request, res: Response) => {
  await delay(300);
  const { id } = req.params;
  
  if (id !== currentCompetition.id) {
    return res.json(createError('赛事不存在', 404));
  }
  
  res.json(createResponse(currentCompetition));
});

router.post('/competition/submit', async (req: Request, res: Response) => {
  await delay(500);
  const { equipmentId } = req.body as SubmitEntryRequest;
  
  if (!equipmentId) {
    return res.json(createError('装备ID不能为空', 400));
  }
  
  const equipment = mockEquipments.find(e => e.id === equipmentId);
  if (!equipment) {
    return res.json(createError('装备不存在', 404));
  }
  
  const now = Date.now();
  const startTime = currentCompetition.startTime.getTime();
  const endTime = currentCompetition.endTime.getTime();
  
  if (now < startTime || now > endTime) {
    return res.json(createError('赛事未开始或已结束', 400));
  }
  
  if (currentCompetition.requiredGenre !== 'all' && equipment.genre !== currentCompetition.requiredGenre) {
    return res.json(createError(`装备流派不符合要求，需要：${currentCompetition.requiredGenre}`, 400));
  }
  
  const existingEntry = currentCompetition.entries.find(e => e.playerId === mockUser.id);
  if (existingEntry) {
    existingEntry.equipment = equipment;
    existingEntry.score = equipment.score;
  } else {
    const newEntry: CompetitionEntry = {
      id: `entry_${generateId()}`,
      competitionId: currentCompetition.id,
      playerId: mockUser.id,
      playerName: mockUser.username,
      equipment,
      score: equipment.score,
      rank: 0,
    };
    currentCompetition.entries.push(newEntry);
  }
  
  currentCompetition.entries.sort((a, b) => b.score - a.score);
  currentCompetition.entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });
  
  const userRank = currentCompetition.entries.findIndex(e => e.playerId === mockUser.id) + 1;
  
  res.json(createResponse({
    rank: userRank,
    score: equipment.score,
    competition: currentCompetition,
  }, '参赛成功！'));
});

router.get('/rankings', async (req: Request, res: Response) => {
  await delay(400);
  const { type = 'score' } = req.query;
  const rankingType = type as RankingType;
  
  if (!['score', 'craft_count', 'enchant_count'].includes(rankingType)) {
    return res.json(createError('无效的排名类型', 400));
  }
  
  const rankings = mockRankings[rankingType];
  res.json(createResponse({ type: rankingType, rankings }));
});

router.get('/rankings/:type', async (req: Request, res: Response) => {
  await delay(300);
  const { type } = req.params;
  const rankingType = type as RankingType;
  
  if (!['score', 'craft_count', 'enchant_count'].includes(rankingType)) {
    return res.json(createError('无效的排名类型', 400));
  }
  
  const rankings = mockRankings[rankingType];
  res.json(createResponse({ type: rankingType, rankings }));
});

router.get('/season', async (req: Request, res: Response) => {
  await delay(300);
  res.json(createResponse(mockSeason));
});

router.get('/season/current', async (req: Request, res: Response) => {
  await delay(300);
  if (!mockSeason.isActive) {
    return res.json(createError('当前没有进行中的赛季', 404));
  }
  res.json(createResponse(mockSeason));
});

router.get('/season/rewards', async (req: Request, res: Response) => {
  await delay(200);
  res.json(createResponse(mockSeason.rewards));
});

export default router;
