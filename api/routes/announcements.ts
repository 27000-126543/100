import express, { type Request, type Response } from 'express';
import { createResponse, delay } from '../utils.js';
import { mockAnnouncements } from '../../shared/mockData.js';

const router = express.Router();

let announcements = [...mockAnnouncements];

router.get('/', async (req: Request, res: Response) => {
  await delay(200);
  const { type, limit = 20 } = req.query;
  
  let filtered = [...announcements];
  
  if (type && type !== 'all') {
    filtered = filtered.filter(a => a.type === type);
  }
  
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const result = filtered.slice(0, parseInt(limit as string));
  
  res.json(createResponse(result));
});

router.post('/', async (req: Request, res: Response) => {
  await delay(200);
  const { type, content, data } = req.body;
  
  const newAnnouncement = {
    id: `ann_${Date.now()}`,
    type,
    content,
    data,
    createdAt: new Date()
  };
  
  announcements.unshift(newAnnouncement);
  res.json(createResponse(newAnnouncement, '公告已发布'));
});

export default router;
