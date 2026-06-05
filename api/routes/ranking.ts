import express, { type Request, type Response } from 'express';
import { createResponse, createError, delay } from '../utils.js';
import { mockRankings, mockWeeklyReport } from '../../shared/mockData.js';
import type { RankingType, RankingEntry, WeeklyReport } from '../../shared/types.js';

const router = express.Router();

const typeMap: Record<RankingType, keyof typeof mockRankings> = {
  score: 'byScore',
  craft_count: 'byCraftCount',
  enchant_count: 'byEnchantCount',
};

router.get('/weekly', async (req: Request, res: Response) => {
  await delay(300);
  const { type = 'score' } = req.query;

  const rankingType = type as RankingType;
  const key = typeMap[rankingType];
  const rankings = mockRankings[key];

  if (!rankings) {
    return res.json(createError('无效的排行榜类型', 400));
  }

  res.json(createResponse(rankings));
});

router.get('/weekly-report', async (req: Request, res: Response) => {
  await delay(400);

  const report: WeeklyReport = {
    weekStart: mockWeeklyReport.weekStart,
    weekEnd: mockWeeklyReport.weekEnd,
    topEquipment: mockWeeklyReport.topEquipment,
    attributeDistribution: mockWeeklyReport.attributeDistribution,
    craftingTrend: mockWeeklyReport.craftingTrend,
    byScore: mockRankings.byScore,
    byCraftCount: mockRankings.byCraftCount,
    byEnchantCount: mockRankings.byEnchantCount,
    rankings: mockRankings
  };

  res.json(createResponse(report));
});

export default router;
