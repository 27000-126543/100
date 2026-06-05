/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import workshopRoutes from './routes/workshop.js'
import craftingRoutes from './routes/crafting.js'
import enchantingRoutes from './routes/enchanting.js'
import marketRoutes from './routes/market.js'
import arenaRoutes from './routes/arena.js'
import guildRoutes from './routes/guild.js'
import rankingRoutes from './routes/ranking.js'
import userRoutes from './routes/user.js'
import announcementRoutes from './routes/announcements.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/workshop', workshopRoutes)
app.use('/api/crafting', craftingRoutes)
app.use('/api/enchanting', enchantingRoutes)
app.use('/api/market', marketRoutes)
app.use('/api/arena', arenaRoutes)
app.use('/api/guild', guildRoutes)
app.use('/api/ranking', rankingRoutes)
app.use('/api/user', userRoutes)
app.use('/api/announcements', announcementRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error)
  res.status(500).json({
    success: false,
    error: 'Server internal error',
    message: error.message,
  })
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
    path: req.path,
  })
})

export default app
